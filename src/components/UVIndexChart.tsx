import { useEffect, useState } from "react";
import { IUVIndexData, parseRawUvData } from "@/parseUvData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format as formatDate } from "date-fns";
import {
  CartesianGrid,
  Line,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  ResponsiveContainer,
} from "recharts";

const fetchUvData = async () => {
  const response = await fetch(
    "https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/10065/JSON"
  )
    .then((data) => data.json())
    .catch((error) => {
      console.error("Error fetching UV data", error);
    });
  return response;
};

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const MINUTE_IN_MILLISECONDS = 60 * 1000;

export function UVIndexChart() {
  const [uvData, setUvData] = useState<IUVIndexData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTimestamp, setCurrentTimestamp] = useState(
    new Date().getTime()
  );

  const nextDayTimestamp = new Date(
    currentTimestamp + DAY_IN_MILLISECONDS
  ).setHours(0, 0, 0, 0);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setCurrentTimestamp(new Date().getTime());
    }, MINUTE_IN_MILLISECONDS);

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const rawData = await fetchUvData();
      setLoading(false);
      const formattedData = parseRawUvData(rawData);
      setUvData(formattedData);
    };

    loadData();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>UV Index for {formatDate(new Date(), "MMMM d")}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={uvData}
              margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                domain={uvData.map((data) => data.dateTime)}
                type="number"
                scale="time"
                dataKey="dateTime"
                tickFormatter={(datetime) =>
                  `${new Date(datetime).getHours()}:00`
                }
              />
              <YAxis domain={[0, 11]} interval={0} ticks={[0, 3, 6, 8, 11]} />
              <Tooltip
                labelFormatter={(datetime) =>
                  `Time: ${new Date(datetime).getHours()}:00`
                }
                formatter={(value) => [`UV Index: ${value}`]}
              />
              <Line dataKey="uvValue" type="monotone" stroke="#8884d8" />
              <ReferenceLine
                x={currentTimestamp}
                stroke="red"
                label={{ value: "Now", position: "insideTop" }}
              />
              <ReferenceLine
                x={nextDayTimestamp}
                stroke="lightblue"
                label={{
                  position: "insideTop",
                  value: formatDate(new Date(nextDayTimestamp), "MMM d"),
                }}
              />
              <ReferenceLine
                y={3}
                stroke="lightgrey"
                label={{ value: "Moderate", position: "insideLeft" }}
                position="start"
              />
              <ReferenceLine
                y={6}
                stroke="lightgrey"
                label={{ value: "High", position: "insideLeft" }}
                position="start"
              />
              <ReferenceLine
                y={8}
                stroke="lightgrey"
                label={{ value: "Very High", position: "insideLeft" }}
                position="start"
              />
              <ReferenceLine
                y={11}
                stroke="lightgrey"
                label={{ value: "Extreme", position: "insideLeft" }}
                position="start"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

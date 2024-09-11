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
  ).then((data) => data.json());
  return response;
};

export function UVIndexChart() {
  const [uvData, setUvData] = useState<IUVIndexData[]>([]);
  const [loading, setLoading] = useState(true);

  const currentTimestamp = new Date().getTime();
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
              margin={{ top: 5, right: 5, left: -40, bottom: 5 }}
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
              <YAxis />
              <Tooltip
                labelFormatter={(datetime) =>
                  `Time: ${new Date(datetime).getHours()}:00`
                }
                formatter={(value) => [`UV Index: ${value}`]}
              />
              <Line dataKey="uvValue" type="monotone" stroke="#8884d8" />
              <ReferenceLine x={currentTimestamp} stroke="red" label="Now" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

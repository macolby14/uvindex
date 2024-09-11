import { useEffect, useState } from "react";
import EXAMPLE_DATA from "./exampledata.json";
import { IUVIndexData, parseRawUvData } from "@/parseUvData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format as formatDate } from "date-fns";
import {
  CartesianGrid,
  Line,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from "recharts";

const EXAMPLE_CURRENT_TIMESTAMP = 1725980900000;

function App() {
  const [uvData, setUvData] = useState<IUVIndexData[]>([]);
  const [loading, setLoading] = useState(false);

  const currentTimestamp = EXAMPLE_CURRENT_TIMESTAMP; // new Date().getTime();

  useEffect(() => {
    const formattedData = parseRawUvData(EXAMPLE_DATA);
    setUvData(formattedData);
  }, []);

  console.log(JSON.stringify(uvData));

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>UV Index for {formatDate(new Date(), "MMMM d")}</CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            Loading...
          </div>
        ) : (
          <LineChart
            width={600}
            height={300}
            data={uvData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              domain={uvData.map((data) => data.dateTime)}
              type="number"
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
        )}
      </CardContent>
    </Card>
  );
}

export default App;

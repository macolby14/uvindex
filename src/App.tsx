import { useEffect, useState } from "react";
import EXAMPLE_DATA from "./exampledata.json";
import { IUVIndexData, parseRawUvData } from "./parse";

function App() {
  const [uvData, setUvData] = useState<IUVIndexData[]>([]);

  useEffect(() => {
    const formattedData = parseRawUvData(EXAMPLE_DATA);
    setUvData(formattedData);
  }, []);

  console.log(JSON.stringify(uvData));

  return (
    <>
      <h1>UV Index Forecast</h1>
      <h2>Zip Code 10065</h2>
    </>
  );
}

export default App;

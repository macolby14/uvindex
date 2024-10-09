export interface IRawUvData {
  ORDER: number;
  ZIP: string;
  CITY: string;
  STATE: string;
  DATE_TIME: string;
  UV_VALUE: number;
}

export const fetchUvData = async (): Promise<IRawUvData[] | null> => {
  const response = await fetch(
    "https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/10065/JSON"
  )
    .then((data) => data.json() as Promise<IRawUvData[]>)
    .catch((error) => {
      console.error("Error fetching UV data", error);
      return null;
    });
  return response;
};

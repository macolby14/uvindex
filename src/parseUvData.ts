import { IRawUvData } from "./components/UVIndexChart/UVIndexChart.helper";

function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/(_\w)/g, (match) => match[1].toUpperCase());
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function keysToCamelCase(o: Record<string, any>): Record<string, any> {
  const out = {} as Record<string, any>; //eslint-disable-line @typescript-eslint/no-explicit-any
  for (const [key, val] of Object.entries(o)) {
    out[toCamelCase(key)] = val;
  }
  return out;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDateField(o: Record<string, any>): Record<string, any> {
  const out = {} as Record<string, any>; //eslint-disable-line @typescript-eslint/no-explicit-any
  for (const [key, val] of Object.entries(o)) {
    if (key === "dateTime") {
      out[key] = parseDate(val);
    } else {
      out[key] = val;
    }
  }
  return out;
}

/**
 * Given dates like Sep/10/2024 07 AM, parse it into a unix timestamp
 */
export function parseDate(dateString: string): number {
  const regex = /(\w+)\/(\d+)\/(\d+) (\d+) (AM|PM)/i;
  const match = dateString.match(regex)!;

  const [monthRaw, dayRaw, yearRaw, hourRaw, period] = match.slice(1);

  // Convert month abbreviation to number
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].indexOf(monthRaw);

  // Convert hour to 24-hour format
  // Convert hour to 24-hour format, accounting for 12 AM and 12 PM
  let hour = parseInt(hourRaw);
  if (hour === 12) {
    hour = 0; // 12AM is 0 hour and 12PM will be 12 hours
  }
  if (period === "PM") {
    hour += 12;
  }
  const year = parseInt(yearRaw);
  const day = parseInt(dayRaw);

  return new Date(year, month, day, hour).getTime();
}

export interface IUVData {
  zip: string;
  city: string;
  state: string;
  dateTime: number; // timestmap
  uvValue: number;
}

export function parseRawUvData(data: IRawUvData[]): IUVData[] {
  const formattedData = data.map((point) =>
    formatDateField(keysToCamelCase(point))
  );
  return formattedData as IUVData[];
}

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
    console.log("key", key);
    if (key === "dateTime") {
      out[key] = parseDate(val);
    } else {
      out[key] = val;
    }
  }
  return out;
}

function removeLeadingZeroes(s: string): string {
  return s.replace(/^0+/g, "");
}

/**
 * Given dates like Sep/10/2024 07 AM, parse it Sep 7 7AM
 */
export function parseDate(dateString: string): string {
  const regex = /(\w+)\/(\d+)\/(\d+) (\d+) (AM|PM)/i;
  const match = dateString.match(regex)!;

  const [monthRaw, dayRaw, , hourRaw, period] = match.slice(1); // ignore yearRaw
  const hour = removeLeadingZeroes(hourRaw);
  const day = removeLeadingZeroes(dayRaw);
  //

  return `${monthRaw} ${day} ${hour}${period}`;
}

export interface IUVIndexData {
  zip: string;
  city: string;
  state: string;
  dateTime: string;
  uvValue: number;
}
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseRawUvData(data: Record<string, any>[]): IUVIndexData[] {
  const formattedData = data.map((point) =>
    formatDateField(keysToCamelCase(point))
  );
  return formattedData as IUVIndexData[];
}

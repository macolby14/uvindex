import { expect, test } from "vitest";
import { parseDate, parseRawUvData } from "./parse";

test("Can parse a date with AM correctly", () => {
  expect(parseDate("Sep/10/2024 07 AM")).toStrictEqual(
    new Date(2024, 8, 10, 7, 0, 0)
  );
});

test("Can parse a date with PM correctly", () => {
  expect(parseDate("Sep/10/2024 07 PM")).toStrictEqual(
    new Date(2024, 8, 10, 19, 0, 0)
  );
});

test("Can parse a date with January correctly", () => {
  expect(parseDate("Jan/01/2025 2 PM")).toStrictEqual(
    new Date(2025, 0, 1, 14, 0, 0)
  );
});

test("Can parse 12AM correctly", () => {
  expect(parseDate("Jan/01/2025 12 AM")).toStrictEqual(
    new Date(2025, 0, 1, 0, 0, 0)
  );
});

test("Can parse 12PM correctly", () => {
  expect(parseDate("Jan/01/2025 12 PM")).toStrictEqual(
    new Date(2025, 0, 1, 12, 0, 0)
  );
});

test("Can parse an array of raw points", () => {
  expect(
    parseRawUvData([
      {
        ORDER: 1,
        ZIP: "20050",
        CITY: "Washington",
        STATE: "DC",
        DATE_TIME: "Sep/10/2024 07 AM",
        UV_VALUE: 0,
      },
      {
        ORDER: 2,
        ZIP: "20050",
        CITY: "Washington",
        STATE: "DC",
        DATE_TIME: "Sep/10/2024 08 AM",
        UV_VALUE: 0,
      },
    ])
  ).toStrictEqual([
    {
      order: 1,
      zip: "20050",
      city: "Washington",
      state: "DC",
      dateTime: new Date(2024, 8, 10, 7, 0, 0),
      uvValue: 0,
    },
    {
      order: 2,
      zip: "20050",
      city: "Washington",
      state: "DC",
      dateTime: new Date(2024, 8, 10, 8, 0, 0),
      uvValue: 0,
    },
  ]);
});

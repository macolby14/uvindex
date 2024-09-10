import { expect, test } from "vitest";
import { parseDate, parseRawUvData } from "./parse";

test("Can parse a date with AM correctly", () => {
  expect(parseDate("Sep/10/2024 07 AM")).toStrictEqual("Sep 10 7AM");
});

test("Can parse a date with PM correctly", () => {
  expect(parseDate("Sep/10/2024 07 PM")).toStrictEqual("Sep 10 7PM");
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
      dateTime: "Sep 10 7AM",
      uvValue: 0,
    },
    {
      order: 2,
      zip: "20050",
      city: "Washington",
      state: "DC",
      dateTime: "Sep 10 8AM",
      uvValue: 0,
    },
  ]);
});

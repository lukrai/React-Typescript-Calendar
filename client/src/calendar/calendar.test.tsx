import { getEnabledWeekDay, isCalendarDateValid } from "./helpers";

const enabledDaysByMonths: any[] = [
  { enabledDay: 0, fromDate: new Date(2019, 4, 15) },
  { enabledDay: 1, fromDate: new Date(2019, 4, 1) },
  { enabledDay: 2, fromDate: new Date(2019, 3, 15) },
];

it("Calendar input enabled week day", () => {
  const dates = [
    { date: new Date(2019, 0, 5), expectedDay: 3 },
    { date: new Date(2019, 3, 5), expectedDay: 3 },
    { date: new Date(2019, 3, 16), expectedDay: 2 },
    { date: new Date(2019, 4, 1), expectedDay: 2 },
    { date: new Date(2019, 4, 5), expectedDay: 1 },
    { date: new Date(2019, 4, 15), expectedDay: 1 },
    { date: new Date(2019, 4, 20), expectedDay: 0 },
  ];
  dates.forEach(o => {
    const enabledWeekDay = getEnabledWeekDay(o.date, enabledDaysByMonths);
    expect(enabledWeekDay).toBe(o.expectedDay);
  });
});

it("Calendar input isCalendarDateValid", () => {
  const dates = [
    { date: new Date(2019, 3, 5), weekDay: 3, valid: false },
    { date: new Date(2019, 3, 5), weekDay: 5, valid: true },
    { date: new Date(2019, 4, 1), weekDay: 2, valid: false },
    { date: new Date(2019, 4, 1), weekDay: 3, valid: true },
    { date: new Date(2019, 4, 15), weekDay: 1, valid: false },
    { date: new Date(2019, 4, 20), weekDay: 1, valid: true },
  ];
  dates.forEach(o => {
    const enabledWeekDay = isCalendarDateValid(o.date, o.weekDay);
    expect(enabledWeekDay).toBe(o.valid);
  });
});

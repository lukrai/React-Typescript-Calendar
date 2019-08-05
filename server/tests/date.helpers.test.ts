import { DateTime } from "luxon";
import { getNextMonthsDate, getNextWeekDate } from "../helpers/date.helper";

test("getNextMonthsDate should return correct dates", async () => {
    const dateArray = [
        { date: DateTime.local(2019, 7, 14), weekDay: 3, resultDate: "2019-08-14" },
        { date: DateTime.local(2019, 7, 16), weekDay: 3, resultDate: "2019-08-21" },
        { date: DateTime.local(2019, 9, 1), weekDay: 3, resultDate: "2019-10-02" },
        { date: DateTime.local(2019, 9, 2), weekDay: 3, resultDate: "2019-10-09" },
        { date: DateTime.local(2019, 9, 3), weekDay: 3, resultDate: "2019-10-09" },
        { date: DateTime.local(2019, 9, 3), weekDay: 1, resultDate: "2019-10-07" },
        { date: DateTime.local(2019, 9, 3), weekDay: 2, resultDate: "2019-10-08" },
        { date: DateTime.local(2019, 9, 3), weekDay: 4, resultDate: "2019-10-10" },
        { date: DateTime.local(2019, 9, 3), weekDay: 7, resultDate: "2019-10-13" },
        { date: DateTime.local(2019, 9, 4), weekDay: 3, resultDate: "2019-10-09" },
        { date: DateTime.local(2019, 9, 5), weekDay: 3, resultDate: "2019-10-09" },
        { date: DateTime.local(2019, 9, 6), weekDay: 3, resultDate: "2019-10-09" },
        { date: DateTime.local(2019, 9, 7), weekDay: 3, resultDate: "2019-10-09" },
        { date: DateTime.local(2019, 9, 8), weekDay: 3, resultDate: "2019-10-09" },
        { date: DateTime.local(2019, 9, 9), weekDay: 3, resultDate: "2019-10-16" },
        { date: DateTime.local(2019, 9, 10), weekDay: 3, resultDate: "2019-10-16" },
        { date: DateTime.local(2019, 9, 11), weekDay: 3, resultDate: "2019-10-16" },
        { date: DateTime.local(2019, 9, 12), weekDay: 3, resultDate: "2019-10-16" },
        { date: DateTime.local(2019, 9, 13), weekDay: 3, resultDate: "2019-10-16" },
        { date: DateTime.local(2019, 9, 24), weekDay: 3, resultDate: "2019-10-30" },
        { date: DateTime.local(2019, 9, 30), weekDay: 3, resultDate: "2019-11-06" },
        { date: DateTime.local(2019, 10, 2), weekDay: 3, resultDate: "2019-11-06" },
        { date: DateTime.local(2019, 10, 3), weekDay: 3, resultDate: "2019-11-06" },
        { date: DateTime.local(2019, 10, 7), weekDay: 3, resultDate: "2019-11-13" },
        { date: DateTime.local(2019, 10, 15), weekDay: 3, resultDate: "2019-11-20" },
        { date: DateTime.local(2019, 10, 17), weekDay: 3, resultDate: "2019-11-20" },
        { date: DateTime.local(2019, 10, 23), weekDay: 3, resultDate: "2019-11-27" },
    ];

    dateArray.forEach(o => {
        const result = getNextMonthsDate(o.date, o.weekDay);
        expect(result).toBe(o.resultDate);
    });
});

test("getNextMonthsDate should return correct dates", async () => {
    const dateArray = [
        { date: "2019-08-14", resultDate: "2019-08-21" },
        { date: "2019-08-21", resultDate: "2019-08-28" },
        { date: "2019-08-30", resultDate: "2019-09-06" },
        { date: "2019-10-01", resultDate: "2019-10-08" },
        { date: "2019-10-02", resultDate: "2019-10-09" },
        { date: "2019-10-03", resultDate: "2019-10-10" },
        { date: "2019-10-04", resultDate: "2019-10-11" },
        { date: "2019-10-05", resultDate: "2019-10-12" },
        { date: "2019-10-06", resultDate: "2019-10-13" },
        { date: "2019-10-07", resultDate: "2019-10-14" },
        { date: "2019-10-08", resultDate: "2019-10-15" },
    ];

    dateArray.forEach(o => {
        const result = getNextWeekDate(o.date);
        expect(result).toBe(o.resultDate);
    });
});

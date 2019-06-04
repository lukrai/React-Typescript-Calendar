import {DateTime} from "luxon";

export function getNextMonthsDate(date: DateTime, defaultWeekDay: number): string {
    const nextMonthDate = date.plus({ months: 1 });
    let weekDayAdjustedDate = nextMonthDate;
    if (nextMonthDate.weekday !== defaultWeekDay) {
        weekDayAdjustedDate = nextMonthDate.set({weekday: defaultWeekDay});
        if (weekDayAdjustedDate < nextMonthDate) {
            weekDayAdjustedDate = weekDayAdjustedDate.plus({weeks: 1});
        }
    }
    return weekDayAdjustedDate.toISODate();
}

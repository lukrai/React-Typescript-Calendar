import {DateTime} from "luxon";

export function getNextMonthsDate(date: DateTime, defaultWeekDay: number): string {
    const nextMonthDate = date.plus({ weeks: 5 });
    let weekDayAdjustedDate = nextMonthDate;
    if (nextMonthDate.weekday !== defaultWeekDay) {
        weekDayAdjustedDate = nextMonthDate.set({weekday: defaultWeekDay});
        if (weekDayAdjustedDate < nextMonthDate) {
            weekDayAdjustedDate = weekDayAdjustedDate.plus({weeks: 1});
        }
    }
    return weekDayAdjustedDate.toISODate();
}

export function getNextWeekDate(isoDate: string): string {
    const date = DateTime.fromISO(isoDate);
    const nextWeekDate = date.plus({ weeks: 1 });
    return nextWeekDate.toISODate();
}

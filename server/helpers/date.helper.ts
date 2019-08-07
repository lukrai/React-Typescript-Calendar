import { DateTime } from "luxon";

export const availableCalendarTimes = ["09:00", "09:30", "10:00", "10:30", "11:00"];
export const numberOfColumns = 7;

export function getNextMonthsDate(date: DateTime, defaultWeekDay: number): string {
    const nextMonthDate = date.plus({ weeks: 5 });
    let weekDayAdjustedDate = nextMonthDate;
    if (nextMonthDate.weekday !== defaultWeekDay) {
        weekDayAdjustedDate = nextMonthDate.set({ weekday: defaultWeekDay });
    }
    return weekDayAdjustedDate.toISODate();
}

export function getNextWeekDate(isoDate: string): string {
    const date = DateTime.fromISO(isoDate);
    const nextWeekDate = date.plus({ weeks: 1 });
    return nextWeekDate.toISODate();
}

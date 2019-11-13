export function getEnabledWeekDay(date: Date, enabledDaysByMonths) {
  let tempEnabledDay = { enabledDay: 3, fromDate: new Date(2018) };
  enabledDaysByMonths.length > 0 && enabledDaysByMonths.sort((a, b) => a.fromDate.getTime() - b.fromDate.getTime());
  for (const o of enabledDaysByMonths) {
    if (date != null && date > o.fromDate && date > tempEnabledDay.fromDate) {
      tempEnabledDay = o;
    }
  }
  return tempEnabledDay.enabledDay;
}

export function isCalendarDateValid(selectedDate: Date, enabledWeekDay: number) {
  return selectedDate && selectedDate.getDay() === enabledWeekDay;
}

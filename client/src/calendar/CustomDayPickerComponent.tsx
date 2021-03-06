import { DateTime } from "luxon";
import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { getEnabledWeekDay, isCalendarDateValid } from "./helpers";
// @ts-ignore
import MomentLocaleUtils, { formatDate, parseDate } from "react-day-picker/moment";

const MONTHS = [
  "Sausis",
  "Vasaris",
  "Kovas",
  "Balandis",
  "Gegužė",
  "Birželis",
  "Liepa",
  "Rugpjūtis",
  "Rugsėjis",
  "Spalis",
  "Lapkritis",
  "Gruodis",
];

const WEEKDAYS_LONG = [
  "Sekmadienis",
  "Pirmadienis",
  "Antradienis",
  "Trečiadienis",
  "Ketvirtadienis",
  "Penktadienis",
  "Šeštadienis",
];

const WEEKDAYS_SHORT = ["Sk", "Pr", "An", "Tr", "Kt", "Pn", "Št"];

const enabledDaysByMonths: any[] = [
  // {enabledDay: 0, fromDate: new Date(2019, 4, 15)},
  // {enabledDay: 1, fromDate: new Date(2019, 4, 1)},
  // {enabledDay: 2, fromDate: new Date(2019, 3, 15)},
];

interface IProps {
  selectedDay: Date;

  setDateParam(date: string): void;
}

export class CustomDayPickerInput extends React.Component<IProps> {
  public render() {
    return (
      <div style={{ display: "flex", marginLeft: "20px", marginRight: "2em" }}>
        <h5 className="font-weight-bold" style={{ alignSelf: "flex-end", marginRight: "1em" }}>
          Pasirinkta data
        </h5>
        <DayPickerInput
          onDayChange={this.handleDayChange}
          inputProps={{ className: "form-control" }}
          value={this.props.selectedDay}
          formatDate={formatDate}
          parseDate={parseDate}
          format="YYYY-MM-DD"
          dayPickerProps={{
            firstDayOfWeek: 1,
            disabledDays: {
              daysOfWeek: this.modifier(this.props.selectedDay),
            },
            showWeekNumbers: true,
            localeUtils: MomentLocaleUtils,
            months: MONTHS,
            weekdaysLong: WEEKDAYS_LONG,
            weekdaysShort: WEEKDAYS_SHORT,
          }}
        />
        {this.props.children}

        {this.renderDateWarning(this.props.selectedDay)}
      </div>
    );
  }

  private handleDayChange = selectedDay => {
    if (selectedDay) {
      this.props.setDateParam(DateTime.fromJSDate(selectedDay).toISODate());
    }
  };

  private modifier(date: Date) {
    const enabledWeekDay = getEnabledWeekDay(date, enabledDaysByMonths);
    return [0, 1, 2, 3, 4, 5, 6].filter(o => o !== enabledWeekDay);
  }

  private renderDateWarning(selectedDay: Date) {
    if (!isCalendarDateValid(selectedDay, getEnabledWeekDay(selectedDay, enabledDaysByMonths))) {
      return <h5 style={{ alignSelf: "flex-end", marginLeft: "1em" }}>Pasirinkta neteisinga data</h5>;
    }
    return null;
  }
}

import {DateTime} from "luxon";
import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

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
    constructor(props: any) {
        super(props);

        this.handleDayClick = this.handleDayClick.bind(this);
        this.modifier = this.modifier.bind(this);
    }

    public render() {
        return (
            <div style={{display: "flex", marginLeft: "16px"}}>
                <h5 className="font-weight-bold" style={{alignSelf: "flex-end", marginRight: "1em"}}>Posėdžių data</h5>
                <DayPickerInput
                    inputProps={{ className: "form-control"}}
                    value={this.props.selectedDay}
                    // formatDate={formatDate}
                    // parseDate={parseDate}
                    format="L"
                    dayPickerProps={{
                        onDayClick: this.handleDayClick,
                        firstDayOfWeek: 1,
                        disabledDays: {
                            daysOfWeek: this.modifier(this.props.selectedDay),
                        },
                        showWeekNumbers: true,
                        locale: "lt",
                        // localeUtils: MomentLocaleUtils,
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

    private handleDayClick(day: Date) {
        const date = DateTime.fromJSDate(day);
        this.props.setDateParam(date.toISODate());
    }

    private modifier(date: Date) {
        const enabledWeekDay = getEnabledWeekDay(date);
        return [0, 1, 2, 3, 4, 5, 6].filter(o => o !== enabledWeekDay);
    }

    private renderDateWarning(selectedDay: Date) {
        if (!isCalendarDateValid(selectedDay, getEnabledWeekDay(selectedDay))) {
            return <h5 style={{alignSelf: "flex-end", marginLeft: "1em"}}>Pasirinkta neteisinga data</h5>;
        }
        return null;
    }
}

function getEnabledWeekDay(date: Date) {
    let tempEnabledDay = {enabledDay: 3, fromDate: new Date(2018)};
    enabledDaysByMonths.length > 0 && enabledDaysByMonths.sort((a, b) => a.fromDate.getTime() - b.fromDate.getTime());
    for (const o of enabledDaysByMonths) {
        if (date != null && date > o.fromDate && date > tempEnabledDay.fromDate) {
            tempEnabledDay = o;
        }
    }
    return tempEnabledDay.enabledDay;
}

function isCalendarDateValid(selectedDate: Date, enabledWeekDay: number) {
    return selectedDate && selectedDate.getDay() === enabledWeekDay;
}

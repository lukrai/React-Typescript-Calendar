export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    court: string;
    isAdmin: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface ICourtCase {
    id: number;
    calendarId: number;
    fileNo: string;
    court: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isDisabled: boolean;
    time: string;  // e.g. 9:00
    createdAt: string;
    updatedAt: string;
}

export interface ICalendar {
    id: number;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICourtCaseWithCalendar extends ICourtCase {
    calendar: ICalendar;
}

export interface ICalendarWithCourtCases extends ICalendar{
    courtCases: ICourtCase[];
}

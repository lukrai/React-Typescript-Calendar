import {Sequelize} from "sequelize";
import {AppSettingsModel} from "../../models/AppSettings.model";
import {CalendarModel} from "../../models/Calendar.model";
import {CourtCaseModel} from "../../models/CourtCase.model";
import {SessionModel} from "../../models/Session.model";
import {UserModel} from "../../models/User.model";

export interface IDatabase {
    defaultWeekDay?: number;
    sequelize: Sequelize;
    AppSettings: AppSettingsModel;
    Calendar: CalendarModel;
    CourtCase: CourtCaseModel;
    User: UserModel;
    Session: SessionModel;
}

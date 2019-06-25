import * as express from "express";
import {NextFunction} from "express";
import {DateTime} from "luxon";
import HttpException from "../exceptions/HttpException";
import {getNextMonthsDate} from "../helpers/date.helper";
import {db} from "../models";
import {ICalendar} from "../models/Calendar.model";
import {ICourtCase} from "../models/CourtCase.model";
import {IRequestWithUser} from "../typings/Authentication";

const availableCalendarTimes = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"];
const numberOfColums = 7;

class CourtCaseController {
    constructor() {
        console.log("Initialize CourtCase controller");
    }

    public getAllCourtCases = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const courtCases: ICourtCase[] = await db.CourtCase.findAll();
            res.status(200).json({courtCases});
        } catch (err) {
            next(new HttpException(500, "Could not get all court cases."));
        }
    }

    public getCourtCase = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const courtCase = await db.CourtCase.findByPk(req.params.id);
            if (!courtCase) {
                return next(new HttpException(404, "Court case not found."));
            }
            return res.status(200).send({courtCase});
        } catch (err) {
            next(new HttpException(500, "Could not get court case."));
        }
    }

    public createCourtCase = async (req: IRequestWithUser, res: express.Response, next: NextFunction) => {
        try {
            const nextMonthsDate = getNextMonthsDate(DateTime.local(), db.defaultWeekDay);
            let calendar: ICalendar = await db.Calendar.findOne(
                {
                    where: {date: nextMonthsDate},
                    include: [{
                        as: "courtCases",
                        model: db.CourtCase,
                        include: [{
                            model: db.Calendar,
                            as: "calendar",
                        }],
                    }],
                });
            if (!calendar) {
                calendar = await db.Calendar.create({
                    date: nextMonthsDate,
                });
                const initialCourtCases = [];
                availableCalendarTimes.map(time => {
                    for (let i = 0; i < numberOfColums; i += 1) {
                        initialCourtCases.push({time, calendarId: calendar.id});
                    }
                });

                const createdCourtCases: ICourtCase[] = await db.CourtCase.bulkCreate(initialCourtCases, {returning: true});
                const updatedCourtCase = await db.CourtCase.findOne({where: {id: createdCourtCases[0].id}});
                if (!updatedCourtCase) {
                    return next(new HttpException(400, "Can't create court case."));
                }
                updatedCourtCase.court = req.body.court;
                updatedCourtCase.courtNo = req.body.courtNo;
                updatedCourtCase.fileNo = req.body.fileNo;
                updatedCourtCase.userId = req.user.id;

                await updatedCourtCase.save();
                return res.status(201).send(updatedCourtCase);
            }

            if (calendar.courtCases.length > 0) {
                const courtCaseToUpdate: any = calendar.courtCases.find(o => o.isDisabled !== false && o.fileNo == null && o.court == null && o.courtNo == null);
                if (courtCaseToUpdate != null) {
                    courtCaseToUpdate.court = req.body.court;
                    courtCaseToUpdate.courtNo = req.body.courtNo;
                    courtCaseToUpdate.fileNo = req.body.fileNo;
                    courtCaseToUpdate.userId = req.user.id;

                    await courtCaseToUpdate.save();
                    return res.status(201).send(courtCaseToUpdate);
                }
                return res.status(201).send({courtCase: null, message: "Times are filled for this date."});
            }
        } catch (err) {
            return next(new HttpException(400, "Can't create court case."));
        }
    }

    public updateCourtCase = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const courtCase = await db.CourtCase.findByPk(req.params.id);
            if (!courtCase) {
                return next(new HttpException(404, "Can't find court case."));
            }

            courtCase.court = req.body.court || courtCase.court;
            courtCase.courtNo = req.body.courtNo || courtCase.court;
            courtCase.fileNo = req.body.fileNo || courtCase.fileNo;
            courtCase.isDisabled = req.body.isDisabled === false ? false : req.body.isDisabled === true ? true : courtCase.isDisabled;
            await courtCase.save();

            return res.status(200).send(courtCase);
        } catch (err) {
            return next(new HttpException(400, "Can't update court case."));
        }
    }

    public disableEnableCourtCases = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            if (!req.body.courtCases || req.body.courtCases.length < 1) {
                return next(new HttpException(400, "CourtCases are missing in request body"));
            }
            const ids = req.body.courtCases.map(o => o.id);

            const courtCases = await db.CourtCase.findAll({ where : { id : ids }});
            const isDisabled = !courtCases.some(o => o.isDisabled === true);
            const promises = courtCases.map(o => {
                o.isDisabled = isDisabled;
                return o.save();
            });

            const result = await Promise.all(promises);
            return res.status(200).send(result);
        } catch (err) {
            return next(new HttpException(400, "Can't update court cases."));
        }
    }

    public deleteCourtCase = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const courtCase = await db.CourtCase.findByPk(req.params.id);
            if (!courtCase) {
                return next(new HttpException(400, "Can't find court case."));
            }

            courtCase.court = null;
            courtCase.courtNo = null;
            courtCase.fileNo = null;
            courtCase.isDisabled = null;
            // courtCase.userId = null;
            await courtCase.save();

            return res.status(200).send({courtCase});
        } catch (err) {
            return next(new HttpException(400, "Can't update court case."));
        }
    }
}

export default CourtCaseController;

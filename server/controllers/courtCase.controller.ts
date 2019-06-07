import * as express from "express";
import {db} from "../models";
import {ICourtCase} from "../models/CourtCase.model";
import {DateTime} from "luxon";
import {getNextMonthsDate} from "../helpers/date.helper";
import {ICalendar} from "../models/Calendar.model";

const availableCalendarTimes = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00"];
const numberOfColums = 7;

class CourtCaseController {
    constructor() {
        console.log("Initialize CourtCase controller");
    }

    public getAllCourtCases = async (req: express.Request, res: express.Response) => {
        try {
            const courtCases: ICourtCase[] = await db.CourtCase.findAll();
            res.status(200).json({courtCases});
        } catch (err) {
            res.status(500).json({err: ["oops", err]});
        }
    }

    public getCourtCase = async (req: express.Request, res: express.Response) => {
        try {
            const courtCase = await db.CourtCase.findByPk(req.params.id);
            if (!courtCase) {
                return res.status(404).send({
                    message: "CourtCase Not Found",
                });
            }
            return res.status(200).send({courtCase});
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    public createCourtCase = async (req: express.Request, res: express.Response) => {
        try {
            const nextMonthsDate = getNextMonthsDate(DateTime.local(), db.defaultWeekDay);
            let calendar: ICalendar = await db.Calendar.findOne(
                {
                    where: {date: nextMonthsDate},
                    include: [{
                        as: "courtCases",
                        model: db.CourtCase,
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
                    throw Error(`CourtCase not updated. id: ${createdCourtCases[0].id}`);
                }
                updatedCourtCase.court = req.body.court;
                updatedCourtCase.courtNo = req.body.courtNo;
                updatedCourtCase.fileNo = req.body.fileNo;

                await updatedCourtCase.save();
                return res.status(201).send({courtCase: updatedCourtCase});
            }

            if (calendar.courtCases.length > 0) {
                const courtCaseToUpdate: any = calendar.courtCases.find(o => o.isDisabled !== false && o.fileNo == null && o.court == null && o.courtNo == null);
                if (courtCaseToUpdate != null) {
                    courtCaseToUpdate.court = req.body.court;
                    courtCaseToUpdate.courtNo = req.body.courtNo;
                    courtCaseToUpdate.fileNo = req.body.fileNo;

                    await courtCaseToUpdate.save();
                    return res.status(201).send({courtCaseToUpdate});
                }
                return res.status(201).send({courtCase: null, message: "Times are filled for this date."});
            }
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    public updateCourtCase = async (req: express.Request, res: express.Response) => {
        try {
            const courtCase = await db.CourtCase.findByPk(req.params.id);
            if (!courtCase) {
                return res.status(404).send({
                    message: "CourtCase Not Found",
                });
            }

            courtCase.court = req.body.court || courtCase.court;
            courtCase.courtNo = req.body.courtNo || courtCase.court;
            courtCase.fileNo = req.body.fileNo || courtCase.fileNo;
            courtCase.isDisabled = req.body.isDisabled || courtCase.isDisabled;
            await courtCase.save();

            return res.status(200).send({courtCase});
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    public deleteCourtCase = async (req: express.Request, res: express.Response) => {
        try {
            const courtCase = await db.CourtCase.findByPk(req.params.id);
            if (!courtCase) {
                return res.status(404).send({
                    message: "CourtCase Not Found",
                });
            }

            courtCase.court = null;
            courtCase.courtNo = null;
            courtCase.fileNo = null;
            courtCase.isDisabled = null;
            // courtCase.userId = null;
            await courtCase.save();

            return res.status(200).send({courtCase});
        } catch (err) {
            return res.status(400).send(err);
        }
    }
}

export default CourtCaseController;

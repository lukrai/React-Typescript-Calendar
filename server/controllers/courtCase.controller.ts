import * as express from "express";
import {db} from "../models";
import {ICourtCase} from "../models/CourtCase.model";
import {DateTime} from "luxon";
import {getNextMonthsDate} from "../helpers/date.helper";
import {ICalendar} from "../models/Calendar.model";

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
            // const nextMonthsDate = getNextMonthsDate(DateTime.fromISO("2019-06-11"), db.defaultWeekDay);
            console.log(nextMonthsDate);
            let calendar: ICalendar = await db.Calendar.findOne({where: {date: nextMonthsDate}});
            console.log(calendar);
            if (!calendar) {
                calendar = await db.Calendar.create({
                    date: nextMonthsDate,
                });
            }

            const courtCase: ICourtCase = await db.CourtCase.create({
                calendarId: calendar.id,
                court: req.body.court,
                courtNo: req.body.courtNo,
                fileNo: req.body.fileNo,
                isDisabled: req.body.isDisabled,
                time: req.body.time,  // e.g. 9:00
            });
            return res.status(201).send({courtCase});
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    public updateCourtCase = async (req: express.Request, res: express.Response) => {
        // const user = req.body;
        try {
            const courtCase = await db.CourtCase.findByPk(req.params.id);
            if (!courtCase) {
                return res.status(404).send({
                    message: "CourtCase Not Found",
                });
            }
            await courtCase.updateAttributes({
                court: req.body.court || courtCase.court,
                courtNo: req.body.courtNo || courtCase.court,
                fileNo: req.body.fileNo || courtCase.fileNo,
                isDisabled: req.body.isDisabled || courtCase.isDisabled,
                time: req.body.time || courtCase.time,
            });
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
                    message: "User Not Found",
                });
            }
            const r = await courtCase.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(400).send(err);
        }
    }
}

export default CourtCaseController;

import * as express from "express";
import {DateTime} from "luxon";
import HttpException from "../exceptions/HttpException";
import {db} from "../models";
import {ICalendar} from "../models/Calendar.model";

class CalendarController {
    constructor() {
        console.log("Initialize calendar controller");
    }

    public getAllCalendarData = async (req: express.Request, res: express.Response) => {
        try {
            const calendars = await db.Calendar.findAll({
                include: [{
                    as: "courtCases",
                    model: db.CourtCase,
                }],
            });
            res.status(200).json({calendars});
        } catch (err) {
            res.status(500).json({err: ["oops", err]});
        }
    }

    public getCalendar = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const dateFromParam = DateTime.fromISO(req.params.date);
            if (!dateFromParam.isValid) {
                return next(new HttpException(400, "Wrong date param format. Should be YYYY-MM-DD."));
            }

            const calendar = await db.Calendar.findOne({
                where: {date: req.params.date},
                include: [{
                    as: "courtCases",
                    model: db.CourtCase,
                    limit: 100,
                    order: [["time", "ASC"], ["updatedAt", "DESC"]],
                }],
            });

            if (!calendar) {
                return next(new HttpException(404, "Calendar does not exist."));
            }
            return res.status(200).send(calendar);
        } catch (err) {
            return next(new HttpException(404, "Can't fetch calendar."));
        }
    }

    public createCalendar = async (req: express.Request, res: express.Response) => {
        try {
            const calendar: ICalendar = await db.Calendar.create({
                date: req.body.date,
            });
            return res.status(201).send({calendar});
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    public updateCalendar = async (req: express.Request, res: express.Response) => {
        try {
            const calendar = await db.Calendar.findByPk(req.params.id);
            if (!calendar) {
                return res.status(404).send({
                    message: "Calendar Not Found",
                });
            }
            await calendar.updateAttributes({
                date: req.body.date || calendar.date,
            });
            return res.status(200).send({calendar});
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    public deleteCalendar = async (req: express.Request, res: express.Response) => {
        try {
            const calendar = await db.Calendar.findByPk(req.params.id);
            if (!calendar) {
                return res.status(404).send({
                    message: "Calendar Not Found",
                });
            }
            const r = await calendar.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(400).send(err);
        }
    }
}

export default CalendarController;

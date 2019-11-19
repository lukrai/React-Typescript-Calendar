import * as express from "express";
import { DateTime } from "luxon";
import HttpException from "../exceptions/HttpException";
import { availableCalendarTimes, numberOfColumns } from "../helpers/date.helper";
import { db } from "../models";
import { ICalendar } from "../models/Calendar.model";

class CalendarController {
  constructor() {
    console.log("Initialize calendar controller");
  }

  public getAllCalendarData = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const calendars = await db.Calendar.findAll({
        include: [
          {
            as: "courtCases",
            model: db.CourtCase,
          },
        ],
      });
      res.status(200).json(calendars);
    } catch (err) {
      return next(new HttpException(404, "Can't fetch calendars."));
    }
  };

  public getCalendar = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const dateFromParam = DateTime.fromISO(req.params.date);
      if (!dateFromParam.isValid) {
        return next(new HttpException(400, "Wrong date param format. Should be YYYY-MM-DD."));
      }
      if (dateFromParam.weekday !== db.defaultWeekDay) {
        return next(new HttpException(400, `Wrong week day. Current availble week day: ${db.defaultWeekDay}.`));
      }
      let jsonCalendar;
      let calendar: ICalendar = await db.Calendar.findOne({
        where: { date: req.params.date },
        include: [
          {
            as: "courtCases",
            limit: 200,
            order: [["id", "ASC"]],
            model: db.CourtCase,
          },
        ],
      });

      if (!calendar) {
        calendar = await db.Calendar.create({
          date: req.params.date,
        });
        const initialCourtCases = [];
        availableCalendarTimes.map(time => {
          for (let i = 0; i < numberOfColumns; i += 1) {
            initialCourtCases.push({ time, calendarId: calendar.id });
          }
        });

        const createdCourtCases = await db.CourtCase.bulkCreate(initialCourtCases, { returning: true });
        jsonCalendar = calendar.toJSON();
        jsonCalendar.courtCases = [...createdCourtCases];
      } else {
        jsonCalendar = calendar.toJSON();
      }

      return res.status(200).send(jsonCalendar);
    } catch (err) {
      console.log(err);
      return next(new HttpException(404, "Can't fetch calendar."));
    }
  };

  public createCalendar = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const calendar: ICalendar = await db.Calendar.create({
        date: req.body.date,
      });
      return res.status(201).send(calendar);
    } catch (err) {
      return next(new HttpException(404, "Can't add calendar."));
    }
  };

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
      return res.status(200).send({ calendar });
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  public deleteCalendar = async (req: express.Request, res: express.Response) => {
    try {
      const calendar = await db.Calendar.findByPk(req.params.id);
      if (!calendar) {
        return res.status(404).send({
          message: "Calendar Not Found",
        });
      }
      await calendar.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(400).send(err);
    }
  };
}

export default CalendarController;

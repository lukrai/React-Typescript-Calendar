import * as express from "express";
import { DateTime } from "luxon";
import HttpException from "../exceptions/HttpException";
import { availableCalendarTimes, numberOfColumns } from "../helpers/date.helper";
import { db } from "../models/index2";
import { Calendar } from "../models/Calendar2.model";
import { CourtCase } from "../models/CourtCase2.model";

class CalendarController {
  constructor() {
    console.log("============== Initialize calendar controller =============");
  }

  public getAllCalendarData = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> => {
    try {
      const calendars = await Calendar.findAll({
        include: [
          {
            as: "courtCases",
            order: [["id", "ASC"]],
            model: CourtCase,
          },
        ],
        order: [["id", "ASC"]],
      });
      res.status(200).json(calendars);
    } catch (err) {
      return next(new HttpException(404, "Can't fetch calendars."));
    }
  };

  public getCalendar = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void | express.Response<any, Record<string, any>>> => {
    try {
      const dateFromParam = DateTime.fromISO(req.params.date);
      if (!dateFromParam.isValid) {
        return next(new HttpException(400, "Wrong date param format. Should be YYYY-MM-DD."));
      }
      if (dateFromParam.weekday !== db.defaultWeekDay) {
        return next(new HttpException(400, `Wrong week day. Current availble week day: ${db.defaultWeekDay}.`));
      }
      let jsonCalendar;
      let calendar = await Calendar.findOne({
        where: { date: req.params.date },
        include: [
          {
            as: "courtCases",
            limit: 200,
            order: [["id", "ASC"]],
            model: CourtCase,
          },
        ],
      });

      if (!calendar) {
        calendar = await Calendar.create({
          date: req.params.date,
        });
        const initialCourtCases = [];
        availableCalendarTimes.map((time) => {
          for (let i = 0; i < numberOfColumns; i += 1) {
            initialCourtCases.push({ time, calendarId: calendar.id });
          }
        });

        const createdCourtCases = await CourtCase.bulkCreate(initialCourtCases, { returning: true });
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

  public createCalendar = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void | express.Response<any, Record<string, any>>> => {
    try {
      const calendar = await Calendar.create({
        date: req.body.date,
      });
      return res.status(201).send(calendar);
    } catch (err) {
      return next(new HttpException(404, "Can't add calendar. Date might already exist."));
    }
  };

  public updateCalendar = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void | express.Response<any, Record<string, any>>> => {
    try {
      const calendar = await Calendar.findByPk(req.params.id);
      if (!calendar) {
        return next(new HttpException(404, "Calendar Not Found"));
      }
      await calendar.update({
        date: req.body.date || calendar.date,
      });
      return res.status(200).send(calendar);
    } catch (err) {
      return next(new HttpException(400, "Calendar update failed, id or body is in incorrect format."));
    }
  };

  public deleteCalendar = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void | express.Response<any, Record<string, any>>> => {
    try {
      const calendar = await Calendar.findByPk(req.params.id);
      if (!calendar) {
        return next(new HttpException(404, "Calendar Not Found"));
      }
      await calendar.destroy();
      return res.status(204).send();
    } catch (err) {
      return next(new HttpException(400, "Calendar delete failed, id or body is in incorrect format."));
    }
  };
}

export default CalendarController;

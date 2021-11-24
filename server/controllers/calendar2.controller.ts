import * as express from "express";
import { DateTime } from "luxon";
import HttpException from "../exceptions/HttpException";
import { availableCalendarTimes, numberOfColumns } from "../helpers/date.helper";
import { db } from "../models/index2";
import { Calendar } from "../models/Calendar2.model";
import { CourtCase, CourtCaseAttributes } from "../models/CourtCase2.model";
import { JudgeGroup, JudgeGroupAttributes } from "../models/JudgeGroup.model";
import { v1 as uuidv1 } from "uuid";
import minutesToHours from "date-fns/minutesToHours";
import hoursToMinutes from "date-fns/hoursToMinutes";

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

      let calendar = await Calendar.findOne({
        where: { date: req.params.date },
      });

      if (!calendar) {
        const judgeGroups = await JudgeGroup.findAll({
          order: [["id", "ASC"]],
        });

        const calendarTracks = this.createCourtCases(judgeGroups);

        calendar = await Calendar.create({
          date: req.params.date,
          tracks: calendarTracks,
        });
      }

      return res.status(200).send(calendar);
    } catch (err) {
      console.log(err);
      return next(new HttpException(404, "Can't fetch calendar."));
    }
  };

  public createCourtCases = (judgeGroups: JudgeGroupAttributes[]) => {
    const timeTracks = [];
    if (judgeGroups.length < 1) {
      return [];
    }

    judgeGroups.forEach((judgeGroup) => {
      const courtCases = [];
      let startingHour = judgeGroup.startingHour;
      let startingMinute = judgeGroup.startingMinute;
      for (let index = 0; index < judgeGroup.timeCardCount; index++) {
        const courtCase: CourtCaseAttributes = {
          id: uuidv1(),
          judgeGroupId: judgeGroup.id,
          fileNo: null,
          court: null,
          firstName: null,
          lastName: null,
          email: null,
          phoneNumber: null,
          isDisabled: false,
          time: this.formatCourtCaseTime(startingHour, startingMinute), // e.g. 09:00
          sessionTimeInMinutes: judgeGroup.sessionTimeInMinutes,
          userId: null,
          registeredAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        courtCases.push(courtCase);

        const [nextHour, nextMinutes] = this.getNextCourtCaseTime(
          startingHour,
          startingMinute,
          judgeGroup.sessionTimeInMinutes,
        );
        startingHour = nextHour;
        startingMinute = nextMinutes;
      }
      timeTracks.push(courtCases);
    });
    return timeTracks;
  };

  public getNextCourtCaseTime = (hours: number, minutes: number, sessionTimeInMinutes: number) => {
    const minutesFromHour = hoursToMinutes(hours);
    const correctTimeInMinutes = minutesFromHour + minutes + sessionTimeInMinutes;
    const finalHour = minutesToHours(correctTimeInMinutes);
    const finalMinutes = correctTimeInMinutes - hoursToMinutes(finalHour);

    return [finalHour, finalMinutes];
  };

  public formatCourtCaseTime = (hour: number, minute: number) => {
    const formattedHour = hour.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
    const formattedMinute = minute.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

    return `${formattedHour}:${formattedMinute}`;
  };

  public createCalendar = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void | express.Response<any, Record<string, any>>> => {
    try {
      // const calendar = await Calendar.create({
      //   date: req.body.date,
      // });
      // return res.status(201).send(calendar);
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

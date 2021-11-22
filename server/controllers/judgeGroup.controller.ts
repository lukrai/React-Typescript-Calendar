import * as express from "express";
import HttpException from "../exceptions/HttpException";
import { JudgeGroup } from "../models/JudgeGroup.model";

class JudgeGroupController {
  constructor() {
    console.log("============== Initialize JudgeGroup Controller =============");
  }

  public getAllJudgeGroups = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> => {
    try {
      const judgeGroups = await JudgeGroup.findAll({
        order: [["id", "ASC"]],
      });
      res.status(200).json(judgeGroups);
    } catch (err) {
      return next(new HttpException(404, "Judge groups not found."));
    }
  };

  // public getJudgeGroup = async (
  //   req: express.Request,
  //   res: express.Response,
  //   next: express.NextFunction,
  // ): Promise<void | express.Response<any, Record<string, any>>> => {
  //   try {
  //     const dateFromParam = DateTime.fromISO(req.params.date);
  //     if (!dateFromParam.isValid) {
  //       return next(new HttpException(400, "Wrong date param format. Should be YYYY-MM-DD."));
  //     }
  //     if (dateFromParam.weekday !== db.defaultWeekDay) {
  //       return next(new HttpException(400, `Wrong week day. Current availble week day: ${db.defaultWeekDay}.`));
  //     }
  //     let jsonCalendar;
  //     let calendar = await Calendar.findOne({
  //       where: { date: req.params.date },
  //       include: [
  //         {
  //           as: "courtCases",
  //           limit: 200,
  //           order: [["id", "ASC"]],
  //           model: CourtCase,
  //         },
  //       ],
  //     });

  //     if (!calendar) {
  //       calendar = await Calendar.create({
  //         date: req.params.date,
  //       });
  //       const initialCourtCases = [];
  //       availableCalendarTimes.map((time) => {
  //         for (let i = 0; i < numberOfColumns; i += 1) {
  //           initialCourtCases.push({ time, calendarId: calendar.id });
  //         }
  //       });

  //       const createdCourtCases = await CourtCase.bulkCreate(initialCourtCases, { returning: true });
  //       jsonCalendar = calendar.toJSON();
  //       jsonCalendar.courtCases = [...createdCourtCases];
  //     } else {
  //       jsonCalendar = calendar.toJSON();
  //     }

  //     return res.status(200).send(jsonCalendar);
  //   } catch (err) {
  //     console.log(err);
  //     return next(new HttpException(404, "Can't fetch calendar."));
  //   }
  // };

  // public createCalendar = async (
  //   req: express.Request,
  //   res: express.Response,
  //   next: express.NextFunction,
  // ): Promise<void | express.Response<any, Record<string, any>>> => {
  //   try {
  //     const calendar = await Calendar.create({
  //       date: req.body.date,
  //     });
  //     return res.status(201).send(calendar);
  //   } catch (err) {
  //     return next(new HttpException(404, "Can't add calendar. Date might already exist."));
  //   }
  // };

  public updateJudgeGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const judgeGroup = await JudgeGroup.findByPk(req.params.id);
      if (!judgeGroup) {
        return next(new HttpException(404, "Not Found"));
      }

      const { timeCardCount, startingHour, startingMinute, sessionTimeInMinutes } = req.body;
      await judgeGroup.update({
        timeCardCount,
        startingHour,
        startingMinute,
        sessionTimeInMinutes,
      });
      return res.status(200).send(judgeGroup);
    } catch (err) {
      return next(new HttpException(400, "Update failed, id or body is in incorrect format."));
    }
  };

  // public deleteCalendar = async (
  //   req: express.Request,
  //   res: express.Response,
  //   next: express.NextFunction,
  // ): Promise<void | express.Response<any, Record<string, any>>> => {
  //   try {
  //     const calendar = await Calendar.findByPk(req.params.id);
  //     if (!calendar) {
  //       return next(new HttpException(404, "Calendar Not Found"));
  //     }
  //     await calendar.destroy();
  //     return res.status(204).send();
  //   } catch (err) {
  //     return next(new HttpException(400, "Calendar delete failed, id or body is in incorrect format."));
  //   }
  // };
}

export default JudgeGroupController;

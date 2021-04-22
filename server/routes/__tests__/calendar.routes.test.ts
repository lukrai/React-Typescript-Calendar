import App from "../../app";
import supertest from "supertest";
// import { UserAttributes } from "../../models/User2.model";

const app = new App();
const request = supertest(app.listen());

beforeAll(function (done) {
  app.app.on("appInitialized", function () {
    done();
  });
});

describe("Calendar router ednpoints", () => {
  let loggedInUser;
  let cookies;

  beforeAll((done) => {
    request
      .post("/api/auth/login")
      .send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
      .end((err, response) => {
        loggedInUser = response.body;
        cookies = response.headers["set-cookie"];

        expect(loggedInUser).toEqual(
          expect.objectContaining({
            id: 1,
            court: "Kauno apygardos teismas",
            email: "admin@admin.local",
            firstName: "admin",
            lastName: "local",
            phoneNumber: "+37000000000",
            isAdmin: true,
          }),
        );
        done();
      });
  });

  describe("/api/calendar POST calender", () => {
    it("/api/user POST should create and return a Calendar", async (done) => {
      const response = await request.post("/api/calendar").set("Cookie", cookies).send({ date: "2019-10-09" });
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({ date: "2019-10-09" }));
      done();
    });

    it("/api/calendar POST should create and return a Calendar with random string", async (done) => {
      const response = await request.post("/api/calendar").set("Cookie", cookies).send({ date: "Random" });
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({ date: "Random" }));
      done();
    });

    it("/api/calendar POST should fail when same date already exists.", async (done) => {
      const response = await request.post("/api/calendar").set("Cookie", cookies).send({ date: "2019-10-09" });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Can't add calendar. Date might already exist.", status: 404 });
      done();
    });
  });

  describe("/api/calendar PUT update calendar ", () => {
    it("/api/calendar PUT should return failed message when non eexisting id is passed.", async (done) => {
      const response0 = await request.put("/api/calendar/99999").set("Cookie", cookies).send({ date: "Random2" });
      expect(response0.status).toBe(404);
      expect(response0.body).toEqual({ message: "Calendar Not Found", status: 404 });

      const response1 = await request.put("/api/calendar/aaaaaa").set("Cookie", cookies).send({ date: "Random2" });
      expect(response1.status).toBe(400);
      expect(response1.body).toEqual({
        message: "Calendar update failed, id or body is in incorrect format.",
        status: 400,
      });
      done();
    });

    it("/api/calendar PUT should return updated Calendar.", async (done) => {
      const response0 = await request.put("/api/calendar/2").set("Cookie", cookies).send({ date: "Random2" });
      expect(response0.status).toBe(200);
      expect(response0.body).toEqual(expect.objectContaining({ date: "Random2" }));
      done();
    });
  });

  describe("/api/calendar GET calendar ", () => {
    it("/api/calendar GET should return all calendars", async (done) => {
      const response0 = await request.get("/api/calendar").set("Cookie", cookies);
      expect(response0.status).toBe(200);
      expect(response0.body).toEqual([
        expect.objectContaining({
          courtCases: [],
          date: "2019-10-09",
          id: 1,
        }),
        expect.objectContaining({
          courtCases: [],
          date: "Random2",
          id: 2,
        }),
      ]);
      done();
    });
  });

  describe("/api/calendar/:id GET calendar ", () => {
    it("/api/calendar/:id GET should return existing calendar", async (done) => {
      const response0 = await request.get("/api/calendar/2019-10-09").set("Cookie", cookies);
      expect(response0.status).toBe(200);
      expect(response0.body).toEqual(
        expect.objectContaining({
          courtCases: [],
          date: "2019-10-09",
          id: 1,
        }),
      );
      done();
    });

    it("/api/calendar/:id GET should fail when wrong selector is passed", async (done) => {
      const response0 = await request.get("/api/calendar/99999").set("Cookie", cookies);
      expect(response0.status).toBe(400);
      expect(response0.body).toEqual({
        message: "Wrong date param format. Should be YYYY-MM-DD.",
        status: 400,
      });
      const response1 = await request.get("/api/calendar/2019-10-12").set("Cookie", cookies);
      expect(response1.status).toBe(400);
      expect(response1.body).toEqual({
        message: "Wrong week day. Current availble week day: 3.",
        status: 400,
      });
      done();
    });

    it("/api/calendar/:id GET should create new calendar with initial courtcases", async (done) => {
      const response0 = await request.get("/api/calendar/2021-04-28").set("Cookie", cookies);
      expect(response0.status).toBe(200);
      const omittedCourCases = response0.body.courtCases.map((o) => ({
        ...o,
        createdAt: undefined,
        updatedAt: undefined,
      }));
      expect(omittedCourCases).toEqual([
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 1,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 2,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 3,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 4,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 5,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 6,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 7,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 8,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 9,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 10,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 11,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 12,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 13,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 14,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 15,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 16,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 17,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 18,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 19,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 20,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 21,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 22,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 23,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 24,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 25,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 26,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 27,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 28,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "10:30",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 29,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "11:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 30,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "11:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 31,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "11:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 32,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "11:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 33,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "11:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 34,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "11:00",
          updatedAt: undefined,
          userId: null,
        },
        {
          calendarId: 4,
          court: null,
          createdAt: undefined,
          email: null,
          fileNo: null,
          firstName: null,
          id: 35,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "11:00",
          updatedAt: undefined,
          userId: null,
        },
      ]);
      expect(response0.body).toEqual(
        expect.objectContaining({
          date: "2021-04-28",
          id: 4,
        }),
      );
      done();
    });
  });

  describe("/api/calendar DELETE calendar ", () => {
    it("/api/calendar Delete should return failed message when non eexisting id is passed.", async (done) => {
      const response0 = await request.delete("/api/calendar/99999").set("Cookie", cookies);
      expect(response0.status).toBe(404);
      expect(response0.body).toEqual({ message: "Calendar Not Found", status: 404 });

      const response1 = await request.delete("/api/calendar/aaaaaa").set("Cookie", cookies);
      expect(response1.status).toBe(400);
      expect(response1.body).toEqual({
        message: "Calendar delete failed, id or body is in incorrect format.",
        status: 400,
      });
      done();
    });

    it("/api/calendar DELETE should delete Calendar.", async (done) => {
      const response0 = await request.delete("/api/calendar/1").set("Cookie", cookies).send({ date: "Random2" });
      expect(response0.status).toBe(204);
      expect(response0.body).toEqual({});

      const response1 = await request.delete("/api/calendar/2").set("Cookie", cookies).send({ date: "Random2" });
      expect(response1.status).toBe(204);
      expect(response1.body).toEqual({});

      const response2 = await request.delete("/api/calendar/4").set("Cookie", cookies).send({ date: "Random2" });
      expect(response2.status).toBe(204);
      expect(response2.body).toEqual({});
      done();
    });
  });
});

// + this.router.get("/", authMiddlewareAdmin, this.calendarController.getAllCalendarData);
// + this.router.post("/", authMiddlewareAdmin, this.calendarController.createCalendar);
// this.router.get("/:date", authMiddlewareAdmin, this.calendarController.getCalendar);
// + this.router.put("/:id", authMiddlewareAdmin, this.calendarController.updateCalendar);
// + this.router.delete("/:id", authMiddlewareAdmin, this.calendarController.deleteCalendar);

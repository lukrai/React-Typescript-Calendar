import App from "../../app";
import supertest from "supertest";
import { getNextMonthsDate } from "../../helpers/date.helper";
import { DateTime } from "luxon";
// import { UserAttributes } from "../../models/User2.model";

const app = new App();
const request = supertest(app.listen());

beforeAll(function (done) {
  app.app.on("appInitialized", function () {
    done();
  });
});

describe("Court Case router endpoints", () => {
  let loggedInUser;
  let cookies;

  let calendarId1, courtCaseId1;
  let calendarId2, courtCaseId2;
  let calendarId3, courtCaseId3;

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

  describe("/api/court-case POST court-case ", () => {
    it("/api/court-case POST should create new calendar and reserve the time", async (done) => {
      const response = await request.post("/api/court-case").set("Cookie", cookies).send({ fileNo: "v9999-999-991" });
      const nextMonthsDate = getNextMonthsDate(DateTime.local(), 3);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          calendar: expect.objectContaining({
            date: nextMonthsDate,
          }),
          court: "Kauno apygardos teismas",
          email: "admin@admin.local",
          fileNo: "v9999-999-991",
          firstName: "admin",
          isDisabled: null,
          lastName: "local",
          phoneNumber: "+37000000000",
          time: "09:00",
          userId: 1,
        }),
      );
      calendarId1 = response.body.calendarId;
      courtCaseId1 = response.body.id;
      done();
    }, 20000);

    it("/api/court-case POST should create reserve the time if calendar already exists", async (done) => {
      const response = await request.post("/api/court-case").set("Cookie", cookies).send({ fileNo: "v9999-999-992" });
      const nextMonthsDate = getNextMonthsDate(DateTime.local(), 3);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          calendar: expect.objectContaining({
            date: nextMonthsDate,
          }),
          court: "Kauno apygardos teismas",
          email: "admin@admin.local",
          fileNo: "v9999-999-992",
          firstName: "admin",
          isDisabled: null,
          lastName: "local",
          phoneNumber: "+37000000000",
          time: "09:00",
          userId: 1,
        }),
      );
      calendarId2 = response.body.calendarId;
      courtCaseId2 = response.body.id;
      done();
    }, 20000);

    it("/api/court-case POST should succeed if no fileNo is passed as payload", async (done) => {
      const response = await request.post("/api/court-case").set("Cookie", cookies).send({});
      const nextMonthsDate = getNextMonthsDate(DateTime.local(), 3);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          calendar: expect.objectContaining({
            date: nextMonthsDate,
          }),
          court: "Kauno apygardos teismas",
          email: "admin@admin.local",
          firstName: "admin",
          isDisabled: null,
          lastName: "local",
          phoneNumber: "+37000000000",
          time: "09:00",
          userId: 1,
        }),
      );
      expect(response.body.fileNo).toEqual(undefined);
      calendarId3 = response.body.calendarId;
      courtCaseId3 = response.body.id;
      done();
    }, 20000);
  });

  describe("/api/court-case/:id GET court-case ", () => {
    it("/api/court-case/:id GET should return a court case", async (done) => {
      const response = await request.get(`/api/court-case/${courtCaseId1}`).set("Cookie", cookies);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          courtCase: expect.objectContaining({
            court: "Kauno apygardos teismas",
            email: "admin@admin.local",
            fileNo: "v9999-999-991",
            firstName: "admin",
            isDisabled: null,
            lastName: "local",
            phoneNumber: "+37000000000",
            time: "09:00",
            userId: 1,
          }),
        }),
      );
      done();
    }, 20000);

    it("/api/court-case/:id GET should return 404 if court case is not found", async (done) => {
      const response = await request.get(`/api/court-case/99999`).set("Cookie", cookies);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Court case not found.", status: 404 });
      done();
    }, 20000);

    it("/api/court-case/:id GET should return 500 if court case is not found", async (done) => {
      const response = await request.get(`/api/court-case/aaaa`).set("Cookie", cookies);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Could not get court case.", status: 500 });
      done();
    }, 20000);
  });

  describe("/api/court-case GET all court-cases ", () => {
    it("/api/court-case GET should return all user court cases", async (done) => {
      const response = await request.get(`/api/court-case`).set("Cookie", cookies);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          // calendar: {
          //   createdAt: "2021-04-25T00:45:13.870Z",
          //   date: "2021-05-26",
          //   id: 5,
          //   updatedAt: "2021-04-25T00:45:13.870Z",
          // },
          calendarId: 5,
          court: "Kauno apygardos teismas",
          email: "admin@admin.local",
          fileNo: null,
          firstName: "admin",
          id: 38,
          isDisabled: null,
          lastName: "local",
          phoneNumber: "+37000000000",
          time: "09:00",
          userId: 1,
        }),
        expect.objectContaining({
          // calendar: {
          //   createdAt: "2021-04-25T00:45:13.870Z",
          //   date: "2021-05-26",
          //   id: 5,
          //   updatedAt: "2021-04-25T00:45:13.870Z",
          // },
          calendarId: 5,
          court: "Kauno apygardos teismas",
          email: "admin@admin.local",
          fileNo: "v9999-999-992",
          firstName: "admin",
          id: 37,
          isDisabled: null,
          lastName: "local",
          phoneNumber: "+37000000000",
          time: "09:00",
          userId: 1,
        }),
        expect.objectContaining({
          // calendar: {
          //   createdAt: "2021-04-25T00:45:13.870Z",
          //   date: "2021-05-26",
          //   id: 5,
          //   updatedAt: "2021-04-25T00:45:13.870Z",
          // },
          calendarId: 5,
          court: "Kauno apygardos teismas",
          email: "admin@admin.local",
          fileNo: "v9999-999-991",
          firstName: "admin",
          id: 36,
          isDisabled: null,
          lastName: "local",
          phoneNumber: "+37000000000",
          time: "09:00",
          userId: 1,
        }),
      ]);
      done();
    }, 20000);
  });

  describe("/api/court-case/:id PUT court-case ", () => {
    it("/api/court-case/:id PUT should update and return a court case", async (done) => {
      const response = await request
        .put(`/api/court-case/${courtCaseId1 || 36}`)
        .set("Cookie", cookies)
        .send({ fileNo: "v9999-UPDATED", court: "Kauno apygardos teismas1", isDisabled: "true" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          court: "Kauno apygardos teismas1",
          email: "admin@admin.local",
          fileNo: "v9999-UPDATED",
          firstName: "admin",
          isDisabled: null,
          lastName: "local",
          phoneNumber: "+37000000000",
          time: "09:00",
          userId: 1,
        }),
      );
      done();
    }, 20000);

    it("/api/court-case/:id PUT should return 404 if court case is not found", async (done) => {
      const response = await request.put(`/api/court-case/99999`).set("Cookie", cookies);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Can't find court case.", status: 404 });
      done();
    }, 20000);

    it("/api/court-case/:id PUT should return 500 if court case is not found", async (done) => {
      const response = await request.put(`/api/court-case/aaaa`).set("Cookie", cookies);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Can't update court case.", status: 500 });
      done();
    }, 20000);
  });

  describe("/api/court-case/ PUT disable enable court-case", () => {
    it("/api/court-case/ PUT should update and return a updated and disabled courtcases", async (done) => {
      const response = await request
        .put(`/api/court-case/`)
        .set("Cookie", cookies)
        .send({ courtCases: [{ id: courtCaseId2 || 37 }, { id: courtCaseId3 || 38 }] });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          court: "Kauno apygardos teismas",
          email: "admin@admin.local",
          fileNo: "v9999-999-992",
          firstName: "admin",
          isDisabled: true,
          lastName: "local",
          phoneNumber: "+37000000000",
          time: "09:00",
          userId: 1,
        }),
        expect.objectContaining({
          court: "Kauno apygardos teismas",
          email: "admin@admin.local",
          fileNo: null,
          firstName: "admin",
          isDisabled: true,
          lastName: "local",
          phoneNumber: "+37000000000",
          time: "09:00",
          userId: 1,
        }),
      ]);
      done();
    }, 20000);

    it("/api/court-case/ PUT should return 400 if court case are not sent", async (done) => {
      const response = await request.put(`/api/court-case`).set("Cookie", cookies).send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "CourtCases are missing in request body", status: 400 });

      const response1 = await request.put(`/api/court-case`).set("Cookie", cookies).send({ courtCases: [] });
      expect(response1.status).toBe(400);
      expect(response1.body).toEqual({ message: "CourtCases are missing in request body", status: 400 });
      done();
    }, 20000);

    it("/api/court-case/ PUT should return 500 if court cases object has wrong ids", async (done) => {
      const response = await request
        .put(`/api/court-case`)
        .set("Cookie", cookies)
        .send({ courtCases: [{ id: 9999 }, { id: "aaa" }] });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Can't update court cases.", status: 400 });
      done();
    }, 20000);
  });

  describe("/api/court-case/:id DELETE court-case", () => {
    it("/api/court-case/:id DELETE should return nullified court case", async (done) => {
      const response = await request.delete(`/api/court-case/${courtCaseId2 || 37}`).set("Cookie", cookies);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          court: null,
          email: null,
          fileNo: null,
          firstName: null,
          isDisabled: null,
          lastName: null,
          phoneNumber: null,
          registeredAt: null,
          time: "09:00",
          userId: null,
        }),
      );
      done();
    }, 20000);

    it("/api/court-case/:id DELETE should return 400 if court case id is invalid", async (done) => {
      const response = await request.delete(`/api/court-case/aaaaa`).set("Cookie", cookies);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Can't delete court case data.", status: 400 });
      done();
    }, 20000);

    it("/api/court-case/:id DELETE should return 404 if court case is not found", async (done) => {
      const response = await request.delete(`/api/court-case/9999`).set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Can't find court case.", status: 404 });
      done();
    }, 20000);
  });
});

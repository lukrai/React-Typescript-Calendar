import { calendarRoutesTests } from "../testFiles/calendar.routes.t";
import { userRoutesTests } from "../testFiles/user.routes.t";
import { courtCasesTests } from "../testFiles/courtCase.routes.t";

/**
 * Execute order is important for integrationt tests, that's why test files
 * are in different folder and imported in this file.
 *
 * Should pass with empty(initial) database.
 */
import App from "../../app";
import supertest from "supertest";

const app = new App();
const request = supertest(app.listen());

beforeAll(function (done) {
  app.app.on("appInitialized", function () {
    done();
  });
});

// These need to be wrapped to pass request param to test.
const userRoutesTestsWithParam = () => {
  (userRoutesTests(request) as unknown) as jest.EmptyFunction;
};

const calendarRoutesTestsWithParam = () => {
  (calendarRoutesTests(request) as unknown) as jest.EmptyFunction;
};

const courtCasesTestsWithParam = () => {
  (courtCasesTests(request) as unknown) as jest.EmptyFunction;
};

describe("User Routes", userRoutesTestsWithParam);
describe("Calendar Routes", calendarRoutesTestsWithParam);
describe("Court Cases Routes", courtCasesTestsWithParam);

import App from "../../app";
import supertest from "supertest";

const app = new App();
const request = supertest(app.listen());

beforeAll(function (done) {
  app.app.on("appInitialized", function () {
    done();
  });
});

describe("Test ednpoint", () => {
  it("Testing to see if Jest works", async (done) => {
    const response = await request.get("/check");
    console.log(response.headers);
    expect(response.status).toBe(200);
    done();
  });
});

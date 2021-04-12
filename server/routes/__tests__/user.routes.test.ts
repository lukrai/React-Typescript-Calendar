import App from "../../app";
import supertest from "supertest";

const app = new App();
const request = supertest(app.listen());

beforeAll(function (done) {
  app.app.on("appInitialized", function () {
    done();
  });
});

describe("User router ednpoints", () => {
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

  it("/check should return 'Works'", async (done) => {
    const response = await request.get("/check");
    expect(response.status).toBe(200);
    expect(response.body).toBe("Works");
    done();
  });

  it("/api/auth/status should return current logged in user", async (done) => {
    const response = await request.get("/api/auth/status").set("Cookie", cookies);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
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

// this.router.get("/user", authMiddlewareAdmin, this.userController.getAllUsers);
// this.router.post("/user", authMiddlewareAdmin, this.userController.createUser);
// this.router.get("/user/:id", authMiddleware, this.userController.getUser);
// this.router.put("/user/:id", authMiddlewareAdmin, this.userController.updateUser);
// this.router.delete("/user/:id", authMiddlewareAdmin, this.userController.deleteUser);

// + this.router.post("/auth/login", passport.authenticate("local"), this.authController.logIn);
// this.router.post("/auth/logout", this.authController.logOut);
// + this.router.get("/auth/status", authMiddleware, this.authController.status);
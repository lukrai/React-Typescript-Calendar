import App from "../../app";
import supertest from "supertest";
import { UserAttributes } from "../../models/User2.model";

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

  it("/api/auth/status should return current logged in user", async (done) => {
    const response = await request.get("/api/user").set("Cookie", cookies);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: 1,
        court: "Kauno apygardos teismas",
        email: "admin@admin.local",
        firstName: "admin",
        lastName: "local",
        phoneNumber: "+37000000000",
        isAdmin: true,
      }),
    ]);
    done();
  });

  describe("/api/user POST", () => {
    const user: UserAttributes = {
      firstName: "test",
      lastName: "local",
      email: "test@admin.local",
      phoneNumber: "+37000000000",
      court: "Kauno apygardos teismas",
      password: "Password12",
      passwordConfirmation: "Password12",
      isAdmin: false,
    };

    it("/api/user POST should create and return a user", async (done) => {
      const response = await request.post("/api/user").set("Cookie", cookies).send(user);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: 2,
          court: "Kauno apygardos teismas",
          email: "test@admin.local",
          firstName: "test",
          isAdmin: false,
          lastName: "local",
          phoneNumber: "+37000000000",
        }),
      );
      done();
    });

    it("/api/user POST should return 'Email or password is missing.' if password or email is missing", async (done) => {
      const badUser0 = { ...user, email: undefined };
      const response0 = await request.post("/api/user").set("Cookie", cookies).send(badUser0);
      expect(response0.status).toBe(400);
      expect(response0.body).toEqual({ message: "Email or password is missing.", status: 400 });

      const badUser1 = { ...user, password: undefined };
      const response1 = await request.post("/api/user").set("Cookie", cookies).send(badUser1);
      expect(response1.status).toBe(400);
      expect(response1.body).toEqual({ message: "Email or password is missing.", status: 400 });
      done();

      const badUser2 = { ...user, passwordConfirmation: undefined };
      const response2 = await request.post("/api/user").set("Cookie", cookies).send(badUser2);
      expect(response2.status).toBe(400);
      expect(response2.body).toEqual({ message: "Email or password is missing.", status: 400 });
    });

    it("/api/user POST should return 'Email already in use.' if email is already in use or enpoint fails in general", async (done) => {
      const badUser0 = { ...user };
      const response0 = await request.post("/api/user").set("Cookie", cookies).send(badUser0);
      expect(response0.status).toBe(400);
      expect(response0.body).toEqual({ message: "Email already in use.", status: 400 });

      const badUser1 = { ...user, email: "test2@admin.local", id: 2 };
      const response1 = await request.post("/api/user").set("Cookie", cookies).send(badUser1);
      expect(response1.status).toBe(400);
      expect(response1.body).toEqual({ message: "Email already in use.", status: 400 });
      done();
    });
  });
});

// + this.router.get("/user", authMiddlewareAdmin, this.userController.getAllUsers);
// + this.router.post("/user", authMiddlewareAdmin, this.userController.createUser);
// this.router.get("/user/:id", authMiddleware, this.userController.getUser);
// this.router.put("/user/:id", authMiddlewareAdmin, this.userController.updateUser);
// this.router.delete("/user/:id", authMiddlewareAdmin, this.userController.deleteUser);

// + this.router.post("/auth/login", passport.authenticate("local"), this.authController.logIn);
// this.router.post("/auth/logout", this.authController.logOut);
// + this.router.get("/auth/status", authMiddleware, this.authController.status);

const supertest = require("supertest");
const { app } = require("../app");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");
const {
  deleteManyUsers,
  insertManyUsers,
  newUser,
  insertHrUser,
  insertEmployeeUser,
  insertSupervisorUser,
} = require("../fixtures/users");
const mongoose = require("mongoose");
require("dotenv").config();

describe("/home/irfiyanda/Documents/api-manajemen-karyawan/src/tests/e2e/main.spec.js", () => {
  let hrToken;
  let supervisorToken;
  let employeeToken;
  let tokens = [];

  beforeAll(async () => {
    await mongoose.connect(process.env.URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await deleteManyUsers();
    await insertHrUser();
    await insertEmployeeUser();
    await insertSupervisorUser();

    const loginHr = await supertest(app).post("/auth/login").send({
      email: "hr@example.com",
      password: "password123",
    });
    hrToken = loginHr.body.token;

    const loginEmployee = await supertest(app).post("/auth/login").send({
      email: "employee@example.com",
      password: "password123",
    });
    employeeToken = loginEmployee.body.token;

    const loginSupervisor = await supertest(app).post("/auth/login").send({
      email: "supervisor@example.com",
      password: "password123",
    });
    supervisorToken = loginSupervisor.body.token;
    tokens = [employeeToken, hrToken];
  });
  afterAll(async () => {
    // await deleteManyUsers();
  });

  // user integration test
  describe("POST /user", () => {
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).post("/user").send(newUser);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .post("/user")
        .set("x-auth-token", "invalid_token")
        .send(newUser);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if user is not hr", async () => {
      const res = await supertest(app)
        .post("/user")
        .set("x-auth-token", employeeToken)
        .send(newUser);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 201 if user is hr and logged in", async () => {
      const res = await supertest(app)
        .post("/user")
        .set("x-auth-token", hrToken)
        .send(newUser);
      expect(res.status).toBe(201);
      expect(res.body.data.email).toBe("janedoe@admin.com");
      expect(res.body.data.role).toBe("employee",);
      expect(res.body.data.nik).toBe(1234567890123456);
      expect(res.body.data.name).toBe("Jane Doe");
      expect(res.body.data.birth.slice(0, 10)).toBe("1992-05-10");
      expect(res.body.data.gender).toBe("female");
      expect(res.body.data.address).toBe("456 Oak Avenue");
      expect(res.body.data.phone).toBe("987-654-3210");
      expect(res.body.data.entry_date.slice(0, 10)).toBe("2021-02-01");
      expect(res.body.data.image_profile).toBe("profile2.jpg");
    });
  });

  describe("GET /user", () => {
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).get("/user");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get("/user")
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 200 if user valid token", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get("/user")
          .set("x-auth-token", tokens[i]);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(4);
      }
    });
  });
});

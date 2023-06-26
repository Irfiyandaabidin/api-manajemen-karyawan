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
const {
  deleteManyAttendance,
  insertManyAttendance,
} = require("../fixtures/attendances");
const {
  salaries,
  insertManySalary,
  deleteManySalary,
} = require("../fixtures/salaries");
const {
  divisions,
  insertManyDivision,
  deleteManyDivision,
} = require("../fixtures/divisions");
const {
  reviews,
  insertManyReview,
  deleteManyReview,
} = require("../fixtures/employeeReviews");
const {
  vacations,
  insertManyVacation,
  deleteManyVacation,
} = require("../fixtures/vacations");
require("dotenv").config();

describe("/home/irfiyanda/Documents/api-manajemen-karyawan/src/tests/e2e/main.spec.js", () => {
  let hrToken;
  let supervisorToken;
  let employeeToken;
  let employeeToken2;
  let tokens = [];
  let employee_id;
  let attendance_id;
  let salary_id;
  let division_id;
  let review_id;
  let vacation_id;

  beforeAll(async () => {
    await deleteManySalary();
    await deleteManyUsers();
    await deleteManyAttendance();
    await deleteManyReview();
    await deleteManyDivision();
    await deleteManyVacation();
    await insertManyUsers();
    await insertHrUser();
    await insertEmployeeUser();
    await insertSupervisorUser();
    await insertManyAttendance();
    await insertManySalary();
    await insertManyDivision();
    await insertManyReview();
    await insertManyVacation();

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

    const loginEmployee2 = await supertest(app).post("/auth/login").send({
      email: "bobsmith@admin.com",
      password: "password",
    });
    employeeToken2 = loginEmployee2.body.token;

    const loginSupervisor = await supertest(app).post("/auth/login").send({
      email: "supervisor@example.com",
      password: "password123",
    });
    supervisorToken = loginSupervisor.body.token;
    tokens = [hrToken, employeeToken, supervisorToken];
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
      expect(res.body.data.role).toBe("employee");
      expect(res.body.data.nik).toBe(1234567890123456);
      expect(res.body.data.name).toBe("Jane Doe");
      expect(res.body.data.birth.slice(0, 10)).toBe("1992-05-10");
      expect(res.body.data.gender).toBe("female");
      expect(res.body.data.address).toBe("456 Oak Avenue");
      expect(res.body.data.phone).toBe("987-654-3210");
      expect(res.body.data.entry_date.slice(0, 10)).toBe("2021-02-01");
      expect(res.body.data.image_profile).toBe("profile2.jpg");
      employee_id = res.body.data._id;
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
        expect(res.body.data).toHaveLength(8);
      }
    });
  });

  describe("GET /user/:id", () => {
    it("should return 200 if data exists and login successful", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get(`/user/${employee_id}`)
          .set("x-auth-token", tokens[i]);
        expect(res.body.message).toBe("Get User successfully");
        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe("janedoe@admin.com");
        expect(res.body.data.role).toBe("employee");
        expect(res.body.data.nik).toBe(1234567890123456);
        expect(res.body.data.name).toBe("Jane Doe");
        expect(res.body.data.birth.slice(0, 10)).toBe("1992-05-10");
        expect(res.body.data.gender).toBe("female");
        expect(res.body.data.address).toBe("456 Oak Avenue");
        expect(res.body.data.phone).toBe("987-654-3210");
        expect(res.body.data.entry_date.slice(0, 10)).toBe("2021-02-01");
        expect(res.body.data.image_profile).toBe("profile2.jpg");
      }
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).get(`/user/${attendance_id}`);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get(`/user/${employee_id}`)
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("PUT /user/:id", () => {
    it("should return 200 if update data successful", async () => {
      const resLogin = await supertest(app).post(`/auth/login`).send({
        email: "janedoe@admin.com",
        password: "password",
      });
      const loginToken = resLogin.body.token;

      const res = await supertest(app)
        .put(`/user/${employee_id}`)
        .set("x-auth-token", loginToken)
        .send({
          email: "janedoee@admin.com",
          password: "password",
          role: "employee",
          nik: 1234567892123456,
          name: "Jane Doee",
          birth: "1992-05-20",
          gender: "female",
          address: "466 Oak Avenue",
          phone: "123456789121",
          entry_date: "2021-02-02",
          image_profile: "profile2.jpg",
        });
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe("janedoee@admin.com");
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).put(`/user/${employee_id}`);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 403 if token is invalid", async () => {
      const res = await supertest(app)
        .put(`/user/${employee_id}`)
        .set("x-auth-token", hrToken)
        .send({
          email: "janedoee@admin.com",
          password: "password",
          role: "employee",
          nik: 1234567892123456,
          name: "Jane Doee",
          birth: "1992-05-20",
          gender: "female",
          address: "466 Oak Avenue",
          phone: "123456789121",
          entry_date: "2021-02-02",
          image_profile: "profile2.jpg",
        });
      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access Denied, Only user can update");
    });
  });

  // Attendance
  describe("POST /attendance", () => {
    it("should return 201 if user is employee and successful attendance", async () => {
      const res = await supertest(app)
        .post("/attendance")
        .set("x-auth-token", employeeToken);
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe("Attendance added successfully");
      expect(res.body.data).toHaveProperty("employee_id");
      expect(res.body.data).toHaveProperty("date");
      expect(res.body.data).toHaveProperty("time_in");
      expect(res.body.data).toHaveProperty("status");
      attendance_id = res.body.data._id;
    });

    it("should return 400 if user already checked in today", async () => {
      const res = await supertest(app)
        .post("/attendance")
        .set("x-auth-token", employeeToken);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("You have already checked in today");
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).post(`/attendance`);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if user is not employee", async () => {
      const res = await supertest(app)
        .put("/attendance")
        .set("x-auth-token", hrToken);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("PUT /attendance", () => {
    it("should return 200 if user is employee and updated successful", async () => {
      const res = await supertest(app)
        .put("/attendance")
        .set("x-auth-token", employeeToken);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Attendance updated successfully");
      expect(res.body.data).toHaveProperty("employee_id");
      expect(res.body.data).toHaveProperty("date");
      expect(res.body.data).toHaveProperty("time_in");
      expect(res.body.data).toHaveProperty("status");
    });

    it("should return 400 if user is employee but not clocked in", async () => {
      const res = await supertest(app)
        .put("/attendance")
        .set("x-auth-token", employeeToken2);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Employee has not clocked in");
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).put(`/attendance`);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if user is not employee", async () => {
      const res = await supertest(app)
        .put("/attendance")
        .set("x-auth-token", hrToken);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("GET /attendance", () => {
    it("should return 401 if attendance is not logged in", async () => {
      const res = await supertest(app).get("/attendance");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get("/attendance")
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 200 if attendance valid token", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get("/attendance")
          .set("x-auth-token", tokens[i]);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(6);
      }
    });
  });

  describe("GET /attendance/:id", () => {
    it("should return 200 if data exists and login successful", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get(`/attendance/${attendance_id}`)
          .set("x-auth-token", tokens[i]);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Get attendance successfully");
      }
    });

    it("should return 401 if attendance is not logged in", async () => {
      const res = await supertest(app).get(`/attendance/${attendance_id}`);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get(`/attendance/${attendance_id}`)
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("DELETE /attendance/:id", () => {
    it("should return 200 if user is supervisor and delete successful", async () => {
      const res = await supertest(app)
        .delete(`/attendance/${attendance_id}`)
        .set("x-auth-token", supervisorToken);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Attendance delete successfully");
    });
    it("should return 404 if user is supervisor but id attendance not found", async () => {
      const res = await supertest(app)
        .delete(`/attendance/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set("x-auth-token", supervisorToken);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("Id not found");
    });
    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .delete("/attendance/aaaaaaaaaaaaaaaaaaaaaaa")
        .set("x-auth-token", hrToken);
      expect(res.statusCode).toEqual(401);
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).delete(
        `/attendance/aaaaaaaaaaaaaaaaaaaaaaa`
      );
      expect(res.statusCode).toEqual(401);
    });
  });

  // salary
  describe("POST /salary", () => {
    it("should return 200 if user is hr and add salary succes", async () => {
      const res = await supertest(app)
        .post("/salary")
        .set("x-auth-token", hrToken)
        .send({
          employee_id: "12ab34cd56ef7890fe1d2c3b",
          month: 1,
          year: 2021,
          basic_salary: 5000000,
          allowance: 1000000,
          deduction: 500000,
          total_salary: 5500000,
          payment_status: "unpaid",
        });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Salary added successfully");
      expect(res.body.data.employee_id).toBe("12ab34cd56ef7890fe1d2c3b");
      expect(res.body.data.month).toBe(1);
      expect(res.body.data.year).toBe(2021);
      expect(res.body.data.basic_salary).toBe(5000000);
      expect(res.body.data.allowance).toBe(1000000);
      expect(res.body.data.deduction).toBe(500000);
      expect(res.body.data.total_salary).toBe(5500000);
      expect(res.body.data.payment_status).toBe("unpaid");
      salary_id = res.body.data._id;
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).post("/salary").send(salaries[0]);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .post("/salary")
        .set("x-auth-token", "invalid_token")
        .send(salaries[0]);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if user is not hr", async () => {
      const res = await supertest(app)
        .post("/salary")
        .set("x-auth-token", employeeToken)
        .send(salaries[0]);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("PUT /salary/:id", () => {
    it("should return 200 if user is hr and update successfull", async () => {
      const res = await supertest(app)
        .put(`/salary/${salary_id}`)
        .set("x-auth-token", hrToken)
        .send({
          employee_id: "12ab34cd56ef7890fe1d2c3b",
          month: 2,
          year: 2022,
          basic_salary: 5000001,
          allowance: 1000001,
          deduction: 500001,
          total_salary: 5500001,
          payment_status: "unpaid",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Salary updated successfully");
      expect(res.body.data.employee_id).toBe("12ab34cd56ef7890fe1d2c3b");
      expect(res.body.data.month).toBe(2);
      expect(res.body.data.year).toBe(2022);
      expect(res.body.data.basic_salary).toBe(5000001);
      expect(res.body.data.allowance).toBe(1000001);
      expect(res.body.data.deduction).toBe(500001);
      expect(res.body.data.total_salary).toBe(5500001);
      expect(res.body.data.payment_status).toBe("unpaid");
    });

    it("should return 401 if user is not hr", async () => {
      const res = await supertest(app)
        .put(`/salary/${salary_id}`)
        .set("x-auth-token", employeeToken)
        .set({
          employee_id: "12ab34cd56ef7890fe1d2c3b",
          month: 2,
          year: 2022,
          basic_salary: 5000001,
          allowance: 1000001,
          deduction: 500001,
          total_salary: 5500001,
          payment_status: "unpaid",
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe(
        "Access Denied. Only hr is allowed to access"
      );
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).put(`/salary/${salary_id}`);
      expect(res.statusCode).toEqual(401);
    });
  });
  describe("GET /attendance", () => {
    it("should return 401 if attendance is not logged in", async () => {
      const res = await supertest(app).get("/attendance");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get("/attendance")
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 200 if attendance valid token", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get("/attendance")
          .set("x-auth-token", tokens[i]);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(5);
      }
    });
  });

  describe("GET /salary/:id", () => {
    it("should return 200 if data exists and login successful", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get(`/salary/${salary_id}`)
          .set("x-auth-token", tokens[i]);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Get salary successfully");
      }
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).get(`/salary/${salary_id}`);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get(`/salary/${salary_id}`)
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("DELETE /salary/:id", () => {
    it("should return 200 if user is supervisor and delete successful", async () => {
      const res = await supertest(app)
        .delete(`/salary/${salary_id}`)
        .set("x-auth-token", hrToken);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Salary delete successfully");
    });
    it("should return 404 if user is supervisor but id salary not found", async () => {
      const res = await supertest(app)
        .delete(`/salary/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set("x-auth-token", hrToken);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("Id not found");
    });
    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .delete("/salary/aaaaaaaaaaaaaaaaaaaaaaa")
        .set("x-auth-token", employeeToken);
      expect(res.statusCode).toEqual(401);
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).delete(
        `/salary/aaaaaaaaaaaaaaaaaaaaaaa`
      );
      expect(res.statusCode).toEqual(401);
    });
  });

  //division
  describe("POST /division", () => {
    it("should return 201 if user is hr and add division successful", async () => {
      const res = await supertest(app)
        .post("/division")
        .set("x-auth-token", hrToken)
        .send({
          division_name: "Tech Division",
          description: "Responsible for HR activities",
          employees: [employee_id],
          start_date: "2021-01-01",
          head_division: employee_id,
          budget: 90000,
        });
      expect(res.body.message).toBe("Division added successfully");
      expect(res.statusCode).toEqual(201);
      expect(res.body.data.division_name).toBe("Tech Division");
      expect(res.body.data.description).toBe("Responsible for HR activities");
      expect(res.body.data.start_date).toBe("2021-01-01T00:00:00.000Z");
      expect(res.body.data.head_division).toBe(employee_id);
      expect(res.body.data.budget).toBe(90000);
      division_id = res.body.data._id;
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).post("/division").send(divisions[0]);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .post("/division")
        .set("x-auth-token", "invalid_token")
        .send(divisions[0]);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if user is not hr", async () => {
      const res = await supertest(app)
        .post("/division")
        .set("x-auth-token", employeeToken)
        .send(divisions[0]);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("PUT /division/:id", () => {
    it("should return 200 if user is hr and update successfull", async () => {
      const res = await supertest(app)
        .put(`/division/${division_id}`)
        .set("x-auth-token", hrToken)
        .send({
          division_name: "HR Division",
          description: "Responsible for HR activities",
          employees: [employee_id],
          start_date: "2021-01-01",
          head_division: employee_id,
          budget: 100000,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Division updated successfully");
      expect(res.body.data.division_name).toBe("HR Division");
      expect(res.body.data.description).toBe("Responsible for HR activities");
      expect(res.body.data.employees).toEqual([employee_id]);
      expect(res.body.data.start_date).toBe("2021-01-01T00:00:00.000Z");
      expect(res.body.data.head_division).toBe(employee_id);
      expect(res.body.data.budget).toBe(100000);
    });

    it("should return 401 if user is not hr", async () => {
      const res = await supertest(app)
        .put(`/division/${division_id}`)
        .set("x-auth-token", employeeToken)
        .set({
          division_name: "HR Division",
          description: "Responsible for HR activities",
          employees: ["12ab34cd56ef7890fe1d2c3b", "1a2b3c4d5e6f7a8b9c0d1e2f"],
          start_date: "2021-01-01",
          head_division: "64991ad3185b61fae75951d1",
          budget: 100000,
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe(
        "Access Denied. Only hr is allowed to access"
      );
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).put(`/division/${division_id}`);
      expect(res.statusCode).toEqual(401);
    });
  });
  describe("GET /division", () => {
    it("should return 401 if attendance is not logged in", async () => {
      const res = await supertest(app).get("/division");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get("/division")
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 200 if division valid token", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get("/division")
          .set("x-auth-token", tokens[i]);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(5);
      }
    });
  });

  describe("GET /division/:id", () => {
    it("should return 200 if data exists and login successful", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get(`/division/${division_id}`)
          .set("x-auth-token", tokens[i]);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Get Division successfully");
      }
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).get(`/division/${division_id}`);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get(`/division/${division_id}`)
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("DELETE /division/:id", () => {
    it("should return 200 if user is hr and delete successful", async () => {
      const res = await supertest(app)
        .delete(`/division/${division_id}`)
        .set("x-auth-token", hrToken);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("division delete successfully");
    });
    it("should return 404 if user is hr but id division not found", async () => {
      const res = await supertest(app)
        .delete(`/division/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set("x-auth-token", hrToken);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("Division not found");
    });
    it("should return 401 if user is not hr", async () => {
      const res = await supertest(app)
        .delete("/division/aaaaaaaaaaaaaaaaaaaaaaa")
        .set("x-auth-token", employeeToken);
      expect(res.statusCode).toEqual(401);
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).delete(
        `/division/aaaaaaaaaaaaaaaaaaaaaaa`
      );
      expect(res.statusCode).toEqual(401);
    });
  });

  //Review
  describe("POST /review", () => {
    it("should return 200 if user is supervisor and add review succes", async () => {
      const res = await supertest(app)
        .post("/review")
        .set("x-auth-token", supervisorToken)
        .send({
          employee_id: "649877a6b02a25377da1bb1e",
          review_date: "2021-10-05T00:00:00.000Z",
          review_content: "Great work, keep it up!",
          review_score: 9,
          reviewer_id: "649877a4b02a25377da1baf4",
          reviewer_role: "HR",
        });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Review added successfully");
      expect(res.body.data.employee_id).toBe("649877a6b02a25377da1bb1e");
      expect(res.body.data.review_date).toBe("2021-10-05T00:00:00.000Z");
      expect(res.body.data.review_content).toBe("Great work, keep it up!");
      expect(res.body.data.review_score).toBe(9);
      expect(res.body.data.reviewer_id).toBe("649877a4b02a25377da1baf4");
      expect(res.body.data.reviewer_role).toBe("HR");
      review_id = res.body.data._id;
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).post("/review").send(reviews[0]);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .post("/review")
        .set("x-auth-token", "invalid_token")
        .send(reviews[0]);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .post("/review")
        .set("x-auth-token", employeeToken)
        .send(reviews[0]);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("PUT /employee-review/:id", () => {
    it("should return 200 if user is supervisor and update successfull", async () => {
      const res = await supertest(app)
        .put(`/employee-review/${review_id}`)
        .set("x-auth-token", supervisorToken)
        .send({
          employee_id: "649877a6b02a25377da1bb1e",
          review_date: "2021-10-05T00:00:00.000Z",
          review_content: "Great work, keep it up!",
          review_score: 8,
          reviewer_id: "649877a4b02a25377da1baf4",
          reviewer_role: "HR",
        });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Review added successfully");
      expect(res.body.data.employee_id).toBe("649877a6b02a25377da1bb1e");
      expect(res.body.data.review_date).toBe("2021-10-05T00:00:00.000Z");
      expect(res.body.data.review_content).toBe("Great work, keep it up!");
      expect(res.body.data.review_score).toBe(8);
      expect(res.body.data.reviewer_id).toBe("649877a4b02a25377da1baf4");
      expect(res.body.data.reviewer_role).toBe("HR");
      review_id = res.body.data._id;
    });

    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .put(`/employee-review/${review_id}`)
        .set("x-auth-token", employeeToken)
        .set({
          employee_id: "649877a6b02a25377da1bb1e",
          review_date: "2021-10-05T00:00:00.000Z",
          review_content: "Great work, keep it up!",
          review_score: 8,
          reviewer_id: "649877a4b02a25377da1baf4",
          reviewer_role: "HR",
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe(
        "Access Denied. Only supervisor is allowed to access"
      );
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).put(`/employee-review/${review_id}`);
      expect(res.statusCode).toEqual(401);
    });
  });
  describe("GET /review", () => {
    it("should return 401 if review is not logged in", async () => {
      const res = await supertest(app).get("/review");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get("/review")
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 200 if review valid token", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get("/review")
          .set("x-auth-token", tokens[i]);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(5);
      }
    });
  });

  describe("GET /employee-review/:id", () => {
    it("should return 200 if data exists and login successful", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get(`/employee-review/${review_id}`)
          .set("x-auth-token", tokens[i]);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Get review successfully");
      }
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).get(`/employee-review/${review_id}`);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get(`/employee-review/${review_id}`)
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("DELETE /employee-review/:id", () => {
    it("should return 200 if user is supervisor and delete successful", async () => {
      const res = await supertest(app)
        .delete(`/employee-review/${review_id}`)
        .set("x-auth-token", supervisorToken);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("review delete successfully");
    });
    it("should return 404 if user is supervisor but id review not found", async () => {
      const res = await supertest(app)
        .delete(`/employee-review/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set("x-auth-token", supervisorToken);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("Review not found");
    });
    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .delete("/employee-review/aaaaaaaaaaaaaaaaaaaaaaa")
        .set("x-auth-token", employeeToken);
      expect(res.statusCode).toEqual(401);
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).delete(
        `/employee-review/aaaaaaaaaaaaaaaaaaaaaaa`
      );
      expect(res.statusCode).toEqual(401);
    });
  });

  //vacation
  describe("POST /vacation", () => {
    it("should return 200 if user is supervisor and add vacation succes", async () => {
      const res = await supertest(app)
        .post("/vacation")
        .set("x-auth-token", supervisorToken)
        .send({
          employee_id: "64895f31901ab251dd08ad01",
          start_date: "2023-06-25T00:00:00.000Z",
          end_date: "2023-06-28T00:00:00.000Z",
          description: "Cuti mendesak",
          status: "await",
          type: "urgent",
          duration: 5,
          remaining: 7,
        });
      expect(res.status).toEqual(201);
      expect(res.body.message).toBe("Vacation added successfully");
      expect(res.body.data.employee_id).toBe("64895f31901ab251dd08ad01");
      expect(res.body.data.start_date).toBe("2023-06-25T00:00:00.000Z");
      expect(res.body.data.end_date).toBe("2023-06-28T00:00:00.000Z");
      expect(res.body.data.description).toBe("Cuti mendesak");
      expect(res.body.data.status).toBe("await");
      expect(res.body.data.type).toBe("urgent");
      expect(res.body.data.duration).toBe(5);
      expect(res.body.data.remaining).toBe(7);
      vacation_id = res.body.data._id;
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).post("/vacation").send(vacations[0]);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .post("/vacation")
        .set("x-auth-token", "invalid_token")
        .send(vacations[0]);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .post("/vacation")
        .set("x-auth-token", employeeToken)
        .send(vacations[0]);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("PUT /vacation/:id", () => {
    it("should return 200 if user is supervisor and update successfull", async () => {
      const res = await supertest(app)
        .put(`/vacation/${vacation_id}`)
        .set("x-auth-token", supervisorToken)
        .send({
          employee_id: "64895f31901ab251dd08ad01",
          start_date: "2023-06-25",
          end_date: "2023-06-28",
          description: "Cuti mendesak",
          status: "await",
          type: "urgent",
          duration: 6,
          remaining: 6,
        });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Vacation added successfully");
      expect(res.body.data.employee_id).toBe("64895f31901ab251dd08ad01");
      expect(res.body.data.start_date).toBe("2023-06-25");
      expect(res.body.data.end_date).toBe("2023-06-28");
      expect(res.body.data.description).toBe("Cuti mendesak");
      expect(res.body.data.status).toBe("await");
      expect(res.body.data.type).toBe("urgent");
      expect(res.body.data.duration).toBe(6);
      expect(res.body.data.remaining).toBe(6);
      vacation_id = res.body.data._id;
    });

    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .put(`/vacation/${vacation_id}`)
        .set("x-auth-token", employeeToken)
        .set({
          employee_id: "64895f31901ab251dd08ad01",
          start_date: "2023-06-25",
          end_date: "2023-06-28",
          description: "Cuti mendesak",
          status: "await",
          type: "urgent",
          duration: 6,
          remaining: 6,
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe(
        "Access Denied. Only supervisor is allowed to access"
      );
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).put(`/vacation/${vacation_id}`);
      expect(res.statusCode).toEqual(401);
    });
  });
  describe("GET /vacation", () => {
    it("should return 401 if review is not logged in", async () => {
      const res = await supertest(app).get("/vacation");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get("/vacation")
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });

    it("should return 200 if vacation valid token", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get("/vacation")
          .set("x-auth-token", tokens[i]);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(5);
      }
    });
  });

  describe("GET /vacation/:id", () => {
    it("should return 200 if data exists and login successful", async () => {
      for (let i = 0; i < tokens.length; i++) {
        const res = await supertest(app)
          .get(`/vacation/${vacation_id}`)
          .set("x-auth-token", tokens[i]);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Get Vacation successfully");
      }
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).get(`/employee-review/${vacation_id}`);
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await supertest(app)
        .get(`/vacation/${vacation_id}`)
        .set("x-auth-token", "invalid_token");
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("DELETE /vacation/:id", () => {
    it("should return 200 if user is supervisor and delete successful", async () => {
      const res = await supertest(app)
        .delete(`/vacation/${vacation_id}`)
        .set("x-auth-token", supervisorToken);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Vacation delete successfully");
    });
    it("should return 404 if user is supervisor but id vacation not found", async () => {
      const res = await supertest(app)
        .delete(`/vacation/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set("x-auth-token", supervisorToken);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("Vacation not found");
    });
    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .delete("/vacation/aaaaaaaaaaaaaaaaaaaaaaa")
        .set("x-auth-token", employeeToken);
      expect(res.statusCode).toEqual(401);
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).delete(
        `/vacation/aaaaaaaaaaaaaaaaaaaaaaa`
      );
      expect(res.statusCode).toEqual(401);
    });
  });

  afterAll(async () => {
    // await deleteManyUsers();
    // await deleteManyAttendance();
    // await deleteManyDivision();
    // await deleteManyReview();
    // await deleteManySalary();
    // await deleteManyVacation();
    await mongoose.disconnect();
  });
});

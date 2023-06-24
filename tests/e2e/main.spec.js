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
  deleteManyAttendance, insertManyAttendance,
} = require("../fixtures/attendances");
const { salaries, insertManySalary, deleteManySalary } = require("../fixtures/salaries");
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

  beforeAll(async () => {
    await mongoose.connect(process.env.URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await deleteManySalary();
    await deleteManyUsers();
    await deleteManyAttendance();
    await insertManyUsers();
    await insertHrUser();
    await insertEmployeeUser();
    await insertSupervisorUser();
    await insertManyAttendance();
    await insertManySalary();

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
      password: "password"
    })
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
        .set("x-auth-token", hrToken)
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
        .set("x-auth-token", hrToken)
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
        .set("x-auth-token", supervisorToken)
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Attendance delete successfully");
    })
    it("should return 404 if user is supervisor but id attendance not found", async () => {
      const res = await supertest(app)
        .delete(`/attendance/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set("x-auth-token", supervisorToken);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("Id not found");
    })
    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .delete("/attendance/aaaaaaaaaaaaaaaaaaaaaaa")
        .set("x-auth-token", hrToken)
      expect(res.statusCode).toEqual(401);
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).delete(`/attendance/aaaaaaaaaaaaaaaaaaaaaaa`);
      expect(res.statusCode).toEqual(401);
    });
  })

  // salary
  describe("POST /salary", () => {
    it("should return 200 if user is hr and add salary succes", async () => {
      const res = await supertest(app)
        .post("/salary")
        .set("x-auth-token", hrToken)
        .send({
          employee_id: '12ab34cd56ef7890fe1d2c3b',
          month: 1,
          year: 2021,
          basic_salary: 5000000,
          allowance: 1000000,
          deduction: 500000,
          total_salary: 5500000,
          payment_status: 'unpaid',
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
    })
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
  })
  
  describe("PUT /salary/:id", () => {
    it("should return 200 if user is hr and update successfull", async() => {
      const res = await supertest(app)
        .put(`/salary/${salary_id}`)
        .set("x-auth-token", hrToken)
        .send({
          employee_id: '12ab34cd56ef7890fe1d2c3b',
          month: 2,
          year: 2022,
          basic_salary: 5000001,
          allowance: 1000001,
          deduction: 500001,
          total_salary: 5500001,
          payment_status: 'unpaid',
        })
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
    })

    it("should return 401 if user is not hr", async () => {
      const res = await supertest(app)
        .put(`/salary/${salary_id}`)
        .set("x-auth-token", employeeToken)
        .set({
          employee_id: '12ab34cd56ef7890fe1d2c3b',
          month: 2,
          year: 2022,
          basic_salary: 5000001,
          allowance: 1000001,
          deduction: 500001,
          total_salary: 5500001,
          payment_status: 'unpaid',
        })
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe("Access Denied. Only hr is allowed to access");
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).put(`/salary/${salary_id}`);
      expect(res.statusCode).toEqual(401);
    });
  })
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
        .set("x-auth-token", hrToken)
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Salary delete successfully");
    })
    it("should return 404 if user is supervisor but id salary not found", async () => {
      const res = await supertest(app)
        .delete(`/salary/aaaaaaaaaaaaaaaaaaaaaaaa`)
        .set("x-auth-token", hrToken);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("Id not found");
    })
    it("should return 401 if user is not supervisor", async () => {
      const res = await supertest(app)
        .delete("/salary/aaaaaaaaaaaaaaaaaaaaaaa")
        .set("x-auth-token", employeeToken)
      expect(res.statusCode).toEqual(401);
    });
    it("should return 401 if user is not logged in", async () => {
      const res = await supertest(app).delete(`/salary/aaaaaaaaaaaaaaaaaaaaaaa`);
      expect(res.statusCode).toEqual(401);
    });
  })
  afterAll(async () => {
    // await deleteManyUsers();
    // await deleteManyAttendance();
    await mongoose.disconnect();
  });
});

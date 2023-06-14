const supertest = require("supertest");
const {app} = require('../app');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');
const { deleteManyUsers, insertManyUsers, newUser, insertHrUser, insertEmployeeUser, insertSupervisorUser } = require('../fixtures/users');
const mongoose = require('mongoose');
require('dotenv').config();

describe('/home/irfiyanda/Documents/api-manajemen-karyawan/src/tests/e2e/main.spec.js', () => {
    let hrToken;
    let supervisorToken;
    let employeeToken;
    beforeAll(async () => {
        await mongoose.connect(process.env.URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        await deleteManyUsers();
        await insertHrUser();
        await insertEmployeeUser()

        const loginHr = await supertest(app)
        .post('/auth/login')
        .send({
            email: 'hr@example.com',
            password: 'password123',
        });
        hrToken = loginHr.body.token

        const loginEmployee = await supertest(app)
        .post('/auth/login')
        .send({
            email: 'employee@example.com',
            password: 'password123',
        });
        employeeToken = loginEmployee.body.token

        const loginSupervisor = await supertest(app)
        .post('/auth/login')
        .send({
            email: 'supervisor@example.com',
            password: 'password123',
        });
        supervisorToken = loginSupervisor.body.token
    });
    afterAll(async () => {
        await deleteManyUsers();
    })
    describe('POST /user', () => {    
    
        it('should return 401 if user is not logged in', async () => {
            const res = await supertest(app)
             .post('/user')
             .send(newUser);
            expect(res.statusCode).toEqual(401)
        });
    
        it('should return 401 if user is not hr', async () => {
            const res = await supertest(app)
             .post('/user')
             .set('x-auth-token', employeeToken)
             .send(newUser);
            expect(res.statusCode).toEqual(401)
        })

        it('should return 201 if user is hr and logged in', async () => {
            const res = await supertest(app)
            .post('/user')
            .set('x-auth-token', hrToken)
            .send(newUser);
            console.log(res.body)
            expect(res.status).toBe(201);
            expect(res.body.data.email).toBe('johndoe@admin.com');
            expect(res.body.data.role).toBe('employee');
            expect(res.body.data.nik).toBe(123456);
            expect(res.body.data.name).toBe('John Doe');
            expect(res.body.data.birth.slice(0, 10)).toBe('1990-01-01');
            expect(res.body.data.gender).toBe('male');
            expect(res.body.data.address).toBe('123 Main Street');
            expect(res.body.data.phone).toBe('123-456-7890');
            expect(res.body.data.entry_date.slice(0, 10)).toBe('2021-01-01');
            expect(res.body.data.image_profile).toBe('profile.jpg');
        })
    })
})
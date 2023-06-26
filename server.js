const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./src/routes/user-route');
const vacationRoute = require('./src/routes/vacation-route');
const salaryRoute = require('./src/routes/salary-route');
const authRoute = require('./src/routes/auth-route');
const divisionRoute = require('./src/routes/division-route');
const attendanceRoute = require('./src/routes/attendance-route');
const reviewEmployeeRoute = require('./src/routes/employeeReview-route');
const bodyParser = require('body-parser');
const auth = require('./src/application/middleware/auth');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const cors = require('cors');
const db = require("./database/index");
require('dotenv').config();


function server() {
    const app = express();
    db.connect().catch(console.log())
    app.use(
        cors({
            origin: '*',
        })
    );
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    const swaggerDocument = yaml.load(
        fs.readFileSync('./src/swagger/swagger.yaml', 'utf-8')
    )

    app.use('/user', auth(), userRoute);
    app.use('/vacation', auth(), vacationRoute);    
    app.use('/salary', auth(), salaryRoute);
    app.use('/division', auth(), divisionRoute);
    app.use('/auth', authRoute);
    app.use('/attendance', auth(), attendanceRoute);
    app.use('/employee-review', auth(), reviewEmployeeRoute);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    return app
}

module.exports = {
    server,
}
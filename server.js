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
require('dotenv').config();


function server() {
    const app = express();
    app.use(
        cors({
            origin: '*',
        })
    );
    const dbUsername = process.env.DB_USERNAME;
    const dbPassword = process.env.DB_PASSWORD;
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;
    const dbName = process.env.DB_NAME;
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`, { useNewUrlParser: true })
        .then(() => {
            console.log('Database connected');
        })
        .catch((err) => {
            console.log(err)
        })
    
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
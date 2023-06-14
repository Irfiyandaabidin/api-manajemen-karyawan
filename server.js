const app = require('express')();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./src/routes/user-route');
const vacationRoute = require('./src/routes/vacation-route');
const salaryRoute = require('./src/routes/salary-route');
const authRoute = require('./src/routes/auth-route');
const divisionRoute = require('./src/routes/division-route');
const bodyParser = require('body-parser');
const auth = require('./src/application/middleware/auth');
require('dotenv').config();


function server() {
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;
    const dbName = process.env.DB_NAME;
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, { useNewUrlParser: true })
        .then(() => {
            console.log('Database connected');
        })
        .catch((err) => {
            console.log(err)
        })
    
    app.use('/user', userRoute);
    app.use('/vacation', auth(), vacationRoute);    
    app.use('/salary', auth(), salaryRoute);
    app.use('/division', auth(), divisionRoute);
    app.use('/auth', authRoute);

    return app
}

module.exports = {
    server,
}
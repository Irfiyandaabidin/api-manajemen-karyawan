const express = require('express');
const app = express();
const mongoose = require('mongoose');
const salaryRoute = require('./src/routes/salary-route');
const loginRoute = require('./src/routes/login-route');
const registerRoute = require('./src/routes/register-route');
const bodyParser = require('body-parser');
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running in ${PORT}`)
});
mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, { useNewUrlParser: true })
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log(err)
    })

app.use('/salary', salaryRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
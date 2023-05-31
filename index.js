const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

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
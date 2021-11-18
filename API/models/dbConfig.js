//const mongoose = require('mongoose');
const fs = require('fs');
const { convertcsvtojson } = require('../../csv/csv-parser');
const csvFile = "../csv/test.csv";

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'epytodo'
})

//module.exports.sendJsonDataToDB = sendJsonDataToDB;
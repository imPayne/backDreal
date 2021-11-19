const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const port = 8000;
const app = express();


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'VOTRE MDP',
    database: 'NOM DE BASE'
  });

function createTable() {

    var sqlBuildings = 'CREATE TABLE IF NOT EXISTS Buildings (building_id int(11) NOT NULL, posX int(11) DEFAULT NULL, posY int(11) DEFAULT NULL, width int(11) DEFAULT NULL, height int(11) DEFAULT NULL, PRIMARY KEY (building_id))'; 
    var sqlStorage = 'CREATE TABLE IF NOT EXISTS Storage (id int(11) DEFAULT NULL, zone_id int(11) DEFAULT NULL, level varchar(100) DEFAULT NULL, storage varchar(100) DEFAULT NULL, StorageMassBois int(11) DEFAULT NULL, StorageMassPlastique int(11) DEFAULT NULL, StorageMassPD int(11) DEFAULT NULL, UNIQUE KEY id (id), Key zone_id (zone_id), CONSTRAINT Storage_ibfk FOREIGN KEY (zone_id) REFERENCES Zone (id) ON DELETE CASCADE ON UPDATE CASCADE)';
    var sqlZone = 'CREATE TABLE IF NOT EXISTS Zone (building_id int(11) NOT NULL, id int(11) NOT NULL AUTO_INCREMENT, zone_posX int(11) NOT NULL, zone_posY int(11) NOT NULL, zone_width int(11) DEFAULT NULL, zone_height int(11) DEFAULT NULL, alley varchar(45) DEFAULT NULL, `column` varchar(45) DEFAULT NULL, PRIMARY KEY (id), KEY building_id (building_id), CONSTRAINT Zone_ibfk_1 FOREIGN KEY (building_id) REFERENCES Buildings (building_id) ON DELETE CASCADE ON UPDATE CASCADE)';
  
    connection.query(sqlBuildings);
    connection.query(sqlZone);
    connection.query(sqlStorage);
    console.log("Table Buildings Zone and Storage successfully created");
  }

module.exports = { createTable };
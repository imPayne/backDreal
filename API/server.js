const express = require('express');
const app = express();
const port = 8080;
const csvFile = "../csv/storages.csv";
const mysql = require('mysql');
const csv = require('csv-parser');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MatferDreal61',
  database: 'epytodo'
});

var zones = [];

class Area{
  constructor(posX, posY, width, height) {
      this._posX = posX;
      this._posY = posY;
      this._width = width;
      this._height = height;
  }
  get posX() {
      return this._posX;
  }
  get posY() {
      return this._posY;
  }
  get width() {
      return this._width;
  }
  get height() {
      return this._height;
  }
}

class Zone extends Area {
  constructor(posX, posY, width, height, storages, alley, column) {
      super(posX, posY, width, height);
      this.storages = storages;
      this.alley = alley;
      this.column = column;
  }
  addStorage(storage) {
    var index = this.storages.findIndex(function (s) {
      return(s.level === storage.level && s.storage === storage.storage);
    });
    if (index == -1) 
      this.storages.push(storage);
  }
}

class Storage {
  constructor(level, storage, posX, posY, masseBois, massePlastique, massePD) {
      this.posX = posX;
      this.posY = posY;
      this.masseBois = masseBois;
      this.massePlastique = massePlastique;
      this.massePD = massePD;
      this.level = level;
      this.storage = storage;
  }
}

function GetPreciseLocationY(row) {
  var alleyNumber = +row.alley.match(/\d+/g);//.join('');
  if (alleyNumber % 2 == 0) {
    var preciseY = parseFloat(row.Y, 10) + 20;
  }
  else {
    var preciseY = parseFloat(row.Y, 10) - 20;
  }
  return(preciseY);
}

function getBuildingId(row) {
  // building id return, il y a 4 buildings soit 4 id différent.
  var mainBuilding = 1;
  if (row.buildings == "FLO") {
    return(mainBuilding);
  }
}

//sendDataBuildings();


function sendDataBuildings() {
  //permet d'initialiser la table Buildings dans la DB
  var query = "INSERT INTO Buildings SET ?";
  var array = [
    {building_id: 1,posX: 90, posY: 50, width: 2315, height: 1040},
    {building_id: 2,posX: 60, posY: 1150, width: 460, height: 530},
    {building_id: 3,posX: 640, posY: 1150, width: 570, height: 590},
    {building_id: 4,posX: 1335, posY: 1150, width: 405, height: 430},
  ]

  for (i in array) {
    var params = {building_id: array[i].building_id, posX: array[i].posX, posY: array[i].posY, width: array[i].width, height: array[i].height};
    connection.query(query, params);
  }
  console.log("Insert in Buildings table success !");
}

function deleteOldData() {
  var queryDeleteZone = "DELETE FROM `epytodo`.`Zone` WHERE (`id` >= '0');"
  var queryDeleteStorage = "DELETE FROM `epytodo`.`Storage` WHERE (`id` >= '0');"
  
  connection.query(queryDeleteStorage);
  connection.query(queryDeleteZone);
  console.log("Delete Success !");
}

deleteOldData();


fs.createReadStream(csvFile)
  .pipe(csv())
  .on("data", (row) => {
    //create buildings in Buildings table
    var preciseY =  GetPreciseLocationY(row);
    var rowX = parseInt(row.X, 10);
    row.column = '' ? 'none' : row.column;
    var zone = new Zone(rowX, preciseY, 20, 20, [], row.alley, row.column);
    var storage = new Storage(row.level, row.storage, 0, 0, 0, 0, 0);

    var buildingNumberId = getBuildingId(row);
    

    //set prerequis query
    var paramsZone = {building_id: buildingNumberId,zone_posX: rowX, zone_posY: preciseY, zone_width: 20, zone_height: 20, alley: row.alley, column: row.column};
    var queryZone = "INSERT INTO Zone SET ?";
    var queryStorage = "INSERT INTO Storage SET ?";
    var storageZoneId;

    var index = zones.findIndex(function (z) {
      return z.alley === zone.alley && z.column === zone.column;
    });
    //si index pas trouvé (donc output == -1) => on push ds zones
    if (index == -1) {
      zone.addStorage(storage);
      zones.push(zone);
      connection.query(queryZone, paramsZone);
    }
    else {
      zones[index].addStorage(storage);
    }
    connection.query("SELECT `id` FROM Zone WHERE ?", [{alley: row.alley}, {column: row.column}], function(err, result, fields) {

      if (err) throw err;
        storageZoneId = result[0].id;
        console.log(storageZoneId);
    }); //récupère l'id Zone grâce à l'alley et le current alley 
    console.log(storageZoneId);
    var paramsStorage = {zone_id: storageZoneId,level: row.level, storage: row.storage};
    connection.query(queryStorage, paramsStorage);
  })
  
  .on("end", () => {
    console.log("CSV file successfully processed and Data inserted in Zone and Storage");
  });

app.get("/", (req, res) => {
  res.json({message: 'Root page ready'})
})

app.listen(port, () => {
  console.log(`Running at port ${port}`);
})

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MatferDreal61",
  database: "dreal",
});

const queries = [
  {
    name: "building",
    sql:
      "CREATE TABLE IF NOT EXISTS building (" +
      "building_id int(11) NOT NULL, " +
      "posX int(11) DEFAULT NULL, " +
      "posY int(11) DEFAULT NULL, " +
      "width int(11) DEFAULT NULL, " +
      "height int(11) DEFAULT NULL, " +
      "PRIMARY KEY (building_id));",
  },
  {
    name: "storage",
    sql:
      "CREATE TABLE IF NOT EXISTS storage ( " +
      "id int(11) DEFAULT NULL, " +
      "zone_id int(11) DEFAULT NULL, " +
      "`level` varchar(100) DEFAULT NULL, " +
      "`storageData` varchar(100) DEFAULT NULL, " +
      "StorageMassBois int(11) DEFAULT NULL, " +
      "StorageMassPlastique int(11) DEFAULT NULL, " +
      "StorageMassPD int(11) DEFAULT NULL, " +
      "UNIQUE KEY id (id), Key zone_id (zone_id), " +
      "CONSTRAINT `storageFK1` FOREIGN KEY (`zone_id`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);",
  },
  {
    name: "zone",
    sql:
      "CREATE TABLE IF NOT EXISTS zone (" +
      "building_id int(11) NOT NULL, " +
      "id int(11) NOT NULL AUTO_INCREMENT, " +
      "zone_posX int(11) NOT NULL, " +
      "zone_posY int(11) NOT NULL, " +
      "zone_width int(11) DEFAULT NULL, " +
      "zone_height int(11) DEFAULT NULL, " +
      "alley varchar(45) DEFAULT NULL, " +
      "`column` varchar(45) DEFAULT NULL, " +
      "PRIMARY KEY (id), " +
      "KEY building_id (building_id), " +
      "CONSTRAINT `zoneFK1` FOREIGN KEY (`building_id`) REFERENCES `building` (`building_id`) ON DELETE CASCADE ON UPDATE CASCADE);",
  },
];

function createTable() {
  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    queries.forEach((query) => {
      connection.query(query.sql, function (err, result) {
        if (err) throw err;
        console.log(`Table ${query.name} created`);
      });
    });
  });
}

module.exports = { createTable };

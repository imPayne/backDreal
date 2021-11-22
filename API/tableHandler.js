const connection = require('./connection');

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
      "CREATE TABLE IF NOT EXISTS storage (" +
      "id int(11) DEFAULT NULL, " +
      "zone_id int(11) DEFAULT NULL, " +
      "`level` varchar(100) DEFAULT NULL, " +
      "`storageData` varchar(100) DEFAULT NULL, " +
      "StorageMassBois int(11) DEFAULT NULL, " +
      "StorageMassPlastique int(11) DEFAULT NULL, " +
      "StorageMassPD int(11) DEFAULT NULL, " +
      "PRIMARY KEY (id), " +
      "FOREIGN KEY (zone_id) REFERENCES zone(id));",
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
      "`column` varchar(45) DEFAULT NULL,  " +
      "PRIMARY KEY (id), "+ 
      "FOREIGN KEY (building_id) REFERENCES building(building_id));",
  },
];

function createTable(connection) {
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
  return (true);
}

module.exports = { createTable };
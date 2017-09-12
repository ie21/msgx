var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('testDB.db');

db.serialize(function () {
  db.run("CREATE TABLE log (id, client, service, status, datetime)");
  
  db.run("INSERT INTO log VALUES (?, ?, ?, ?, ?)", ['1' ,'a1', 'b1', 'c1']);
  db.run("INSERT INTO log VALUES (?, ?, ?, ?, ?)", ['2', 'a2', 'b2', 'c2']);
  db.run("INSERT INTO log VALUES (?, ?, ?, ?, ?)", ['3', 'a3', 'b3', 'c3']);

  db.each("SELECT * FROM log", function (err, row) {
  	if(err) throw err;
    console.log(row);
  });
});

db.close();
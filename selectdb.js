var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('testDB.db');

const argument = process.argv[2];
console.log(process.argv[2]);

db.serialize(function () {
//  db.run("CREATE TABLE log (client, service, status, datetime)");
	db.each(argument);

  db.each(argument, function (err, row) {
  	if(err) throw err;
    console.log(row);
  });
});
db.close();
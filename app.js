/*
 
 node app.js

*/


// Requirements 
var pug = require("pug")
var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var Slack = require("slack-node");
var sqlite3 = require('sqlite3').verbose();
var socketio = require('socket.io');

var maxID = 0;

var currentTime=new Date();

// Slack variables
var slack = new Slack();
var webhookUri = "https://hooks.slack.com/services/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";
slack.setWebhook(webhookUri);
var slackChannel = "#general"


// SQLite3 database variables 
var db = new sqlite3.Database('/privat/testDB.db');


// View templating engine
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Console logiranje requesta
router.use(function (req,res,next) {
  console.log("[>>] " + currentTime + "[>>] Request /" + req.method);
  next();
});


var io = socketio.listen('3020', function (err, msg) {
    if (err) {
        console.error(err);
    }
});

io.on('connection', function (socket) {
     console.log('[>>] Client connected');
    socket.on('disconnect', function () {
        console.log('[>>] Client disconnected');

    });
});

// load index.html document 
router.get("/",function(req,res){
	res.sendFile(__dirname + "/public/index.html");
	console.log("[>>] " + currentTime + "Requested -- index.html");
});


// Request counter API 
// GET /requestCount to recieve number of total requests in log
router.get("/requestCount", function(req, res){
	db.serialize(function () {
		db.all("select count(*) from log", function(err, row){
			if(err) throw err;
			console.log(err);
			//res.setHeader('Content-Type', 'application/json');
         	res.send(JSON.stringify(row));
      		})
	})
})

// TOP 5 in log API 
router.get("/latest", function(req, res){
	var value = [];
	db.serialize(function () {
		
		db.get("select *" +  
			  +"from log " + 
			  +"where id is not null" +
			  +"order by id desc limit 3", 

			  function(err, row){
				if(err) throw err;
				console.log(err);
				//res.setHeader('Content-Type', 'application/json');  
				res.send(JSON.stringify(row));  
				io.emit('latest', JSON.stringify(row));            
		})		
	})
})

// > GET /ClientList 
// < returns unique client list alphabetically
router.get("/clientList", function(req, res){
	var value = [];
	db.serialize(function () {
		db.all("select distinct client from log order by client", function(err, row){
		if(err) throw err;
		console.log(err);
		//res.setHeader('Content-Type', 'application/json');  
		res.send(JSON.stringify(row));  		         
		})		
	})
})

router.get("/clientLastSync", function(req, res){
	var value = [];
	db.serialize(function () {
		db.all("select * from log where service not like \"test\" order by id desc limit 100", function(err, row){
		if(err) throw err;
		console.log(err);
		//res.setHeader('Content-Type', 'application/json');  
		res.send(JSON.stringify(row));  	         
		})		
	})
})





router.get("/details/:client",function(req,res){

	res.sendFile(__dirname + "/public/clientDetails.html");
	//var user = "davor";
	//res.render( '/public/clientDetails.html', { user: user } );

	console.log("[>>] " + currentTime + "Requested -- clientDetails.html");

	var db_query = "SELECT * FROM LOG WHERE CLIENT ='" + req.params.client +"' ORDER BY ID DESC LIMIT 25"

	// // get from database? 
	// db.serialize(function () {
		

	// })
});

router.get("/view/details/:client",function(req,res){

	console.log(dateNow() + " -- clientDetails.html + db query");

	var db_query = "SELECT * FROM LOG WHERE CLIENT =\'" + req.params.client +"\' ORDER BY ID DESC LIMIT 25"
	console.log(db_query)
	db.serialize(function () {
		db.all(db_query, function (err, row) {
	  		if(err) throw err;
			//console.log(row);
			console.log("[>>] " + currentTime + " Requested Client Details ")
			var x = JSON.stringify(row);
			res.send(JSON.stringify(row)); 
    		//io.emit('clientDetails', x);
    		}); 

	})
});

// About link 
router.get("/about",function(req,res){
  res.sendFile(__dirname + "/public/about.html");
});




// Registriraj CLIENT, SERVICE i STATUS 
//
//

 var vrijednost = 0;

router.get("/api/:client/:service/:status",function(req,res)
{
	// res.json({"message" : "Hello "+req.params.client + req.params.service + req.params.status});
	    res.send('OK');

	db.serialize(function () {
	// Upisati novu poruku remote clienta u bazu 
		db.get("select count(*) from log", function(err, row) {
			if (err) throw err;	
			for (key in row){
				vrijednost = row[key];
				console.log("[>>] maxID: " + vrijednost)
			}
		});

		//console.log(JSON.stringify(value));
		db.run("INSERT INTO log VALUES (?, ?, ?, ?, (select datetime(\"now\")))", [ vrijednost, req.params.client, req.params.service, req.params.status ]);
		console.log("[>>] " + currentTime + " << INSERT INTO status servisa " + vrijednost);

		query = "SELECT * FROM LOG WHERE ID IS NOT NULL ORDER BY ID desc limit 1"

		db.each(query, function (err, row) {
	  		if(err) throw err;
	  		console.log("[>>] SQL:  " + query)
    		console.log(row);
			var x = JSON.stringify(row);
    		io.emit('logline', JSON.stringify(row));
    		}); 

		db.all("SELECT id FROM LOG WHERE ID IS NOT NULL order by id desc limit 1 ", function (err, row) {
			if (err) throw err;

			var jstfy = JSON.stringify(row);
			//JSON.stringify(row, '"'replace?:'' any, space?: any)
			console.log("[>>] Average counter: " + jstfy);

			io.emit("dashAvg", row);

		})


		db.all("SELECT id as t FROM LOG WHERE ID IS NOT NULL limit 1", function(err, row) {
			if (err) throw err;
			console.log("[>>] postotak backupa u zadnja 24 sata: " + JSON.stringify(row));
			var postotak = [];
			postotak = row;
			console.log(postotak)
			io.emit('percentStatus', JSON.stringify(postotak));

		})



		});
	//db.close();


	// Server console logiranje
  	console.log("[>>] " + currentTime + " -- Client: " + req.params.client + ' Service: ' + req.params.service + ' Message: ' + req.params.status);


  	// Slack notifikacija po API update-u
  	slack.webhook({
  		channel: slackChannel,
  		username: "Messaging Service", 
  		text: dateNow() + " Client: [" + req.params.client +  "] Servis: [" + req.params.service + "] Status: [" + req.params.status + "]"}, function(err, response) {
		 // console.log(response);
});


})




app.use(express.static('public'));
app.use("/",router);

app.set('view engine', 'pug');

app.use("/error",function(req,res){
  res.sendFile(__dirname + "/public/404.html");
});


app.use(bodyParser.json());

router.post('/post', function(req, res, next){  
	//console.log(req.bodyparser);

 // console.log(JSON.stringify(req.computer));
   next();
     // your JSON
      // echo the result back
});



app.listen(3000,function(){
  console.log( dateNow() + " -- Live at Port 3000 ");


});

// datumi 
function dateToString(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dateOfString = (("" + day).length < 2 ? "0" : "") + day + "/";
    dateOfString += (("" + month).length < 2 ? "0" : "") + month + "/";
    dateOfString += date.getFullYear();
    return dateOfString;
}

function dateNow() {
	var currentdate = new Date();
	var datetime = dateToString(currentdate);
	datetime += ' ';
	datetime += + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

            // console.log(datetime);
            return datetime;
}




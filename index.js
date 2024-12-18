
// include socket.io, express and sqlite libraries
var socketio = require('socket.io');
var express = require('express');
var sql = require('sqlite3').verbose()

// create express object
var exp = express();

// use it to serve pages from the web folder
exp.use(express.static('webroot'))
var webapp = exp.listen(process.env.PORT, function() {
 console.log("Running")
})

var db = new sql.Database('HighScores.db');
// create a Scores table in the database
db.run("CREATE TABLE Scores ( playerName char(30) DEFAULT NULL, score int(11) DEFAULT 0, dateachieved timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)", (err) => {
 if (err) {
 console.log("error");
 }
})


// get socketio to listen to the webserver's connection
var io = socketio(webapp)

// Create a callback function to deal with each connection.
// The callback contains code to setup what happens whenever a named message is received
io.on('connection', function(socket) {
 // a new connection has been created i.e. a web browser has connected to the server
 console.log("connected to " + socket.id)

 socket.on('submitScore', function(data) {
 db.run('INSERT INTO Scores (playerName, score) VALUES (?,?)', [data.playerName,
Number(data.score)], function(err) {
 if (!err) {
 console.log(data.playerName + " submitted " + data.score)
 io.emit('newScore', data)
 }
 else {
 // could not save to database
 console.log("Error adding " + data.score + " for " + data.playerName);
 }
});
})

socket.on('getHighScores', function() {
 db.all('SELECT playerName, score FROM Scores ORDER BY score DESC LIMIT 10 ', [],
(err, rows) => {
 if (err) {
 throw err;
 }
 var t = tabulate(rows, ['playerName', 'score'])
 //socket.emit("highScores", t)
 socket.emit('highScores',t)
 })
})

 
 // note when the browser disconnects
 socket.on('disconnect', function() {
  console.log(socket.id + " disconnected")
 })
})


function tabulate(data, names) {
 var st = "<table><tr>"
 // setup the header names
 for (n of names) {
 st = st + "<td>" + n + "</td>"
 }
 st = st + "</tr>"
 // do the rows
 for (r of data) {
 st = st + "<tr>"
 for (var c = 0; c < names.length; c++) {
 st = st + "<td>" + r[names[c]] + "</td>"
 }
 st = st + "</tr>"
 }
 // finish the table off
 st = st + "</table>"
 return st
}
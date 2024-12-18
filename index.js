var socketio = require('socket.io');
var express = require('express');
var sql = require('sqlite3').verbose();

// create express object
var exp = express();

// use it to serve pages from the web folder
exp.use(express.static('webroot'));
var webapp = exp.listen(process.env.PORT || 3000, function() {
  console.log("Running on port " + (process.env.PORT || 3000));
});

var db = new sql.Database('HighScores.db');
// create a Scores table in the database
db.run(`CREATE TABLE IF NOT EXISTS Scores (
  playerName TEXT DEFAULT NULL,
  score INTEGER DEFAULT 0,
  dateachieved TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.log("Error creating table:", err.message);
  }
});

// get socket.io to listen to the webserver's connection
var io = socketio(webapp);

// Create a callback function to deal with each connection.
io.on('connection', function(socket) {
  // a new connection has been created
  console.log("connected to " + socket.id);

  socket.on('submitScore', function(data) {
    db.run('INSERT INTO Scores (playerName, score) VALUES (?, ?)', [data.playerName, Number(data.score)], function(err) {
      if (!err) {
        console.log(`${data.playerName} submitted ${data.score}`);
        io.emit('newScore', data);
      } else {
        console.log(`Error adding ${data.score} for ${data.playerName}:`, err.message);
      }
    });
  });

  socket.on('getHighScores', function() {
    db.all('SELECT playerName, score FROM Scores ORDER BY score DESC LIMIT 10', [], (err, rows) => {
      if (err) {
        console.error("Error fetching high scores:", err.message);
        return;
      }
      var t = tabulate(rows, ['playerName', 'score']);
      socket.emit('highScores', t);
    });
  });

  // note when the browser disconnects
  socket.on('disconnect', function() {
    console.log(socket.id + " disconnected");
  });
});

// HTML-escape a string
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

// Create an HTML table from data
function tabulate(data, names) {
  var st = "<table><tr>";
  // setup the header names
  for (let n of names) {
    st += `<td>${escapeHtml(n)}</td>`;
  }
  st += "</tr>";
  // do the rows
  for (let r of data) {
    st += "<tr>";
    for (let c = 0; c < names.length; c++) {
      st += `<td>${escapeHtml(String(r[names[c]]))}</td>`;
    }
    st += "</tr>";
  }
  st += "</table>";
  return st;
}

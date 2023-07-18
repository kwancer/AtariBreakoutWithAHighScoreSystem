 var socket = io();
 let playersName

  function sendmsg() {
    setName()
  socket.emit("submitScore", { playerName: playersName, score: highScore })
}
  function requestScores(){
    socket.emit("getHighScores")
  }

  socket.on("newScore", function(data) {
  document.getElementById("con").innerHTML = "Score submitted succesfully. "
})
console.log("running")
  socket.on('highScores', function(data){
    console.log(data);
    document.getElementById("table").innerHTML = data
  })


  function setName(){
    playersName = document.getElementById("myName").value 
  }

  function displayHighscore(){
    document.getElementById("current").innerHTML = highScore
  }
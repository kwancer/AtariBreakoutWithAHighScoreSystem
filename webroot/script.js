let bricks = [];
let ball;
let bat;
let start = true
let score = 0
let finish = false
let highScore = 0
let total = 0
let notPlayed =true

//creating bricks
function resetBricks() {
  total = 0
  bricks = []
  let numberOfRows = 6//set the number of rows of bricks

  //for loop draws all the bricks. 
  for (j = 0; j < numberOfRows; j++) {
    let oneBrick = random(80, 200) //generates a brick width for a row
    let remainder = width % oneBrick;
    let numberInRow = (width - remainder) / oneBrick; // works out the number of bricks in a row
    let offset = 10 // changes the gaps between bricks
    let color = [random(0,255),random(0,255),random(0,255)]
    let spaceing = remainder / (numberInRow + 1)//calculates the spacing between bricks based on remainder
    console.log(numberInRow)
    total += round(numberInRow)
    for (i = 0; i <= numberInRow; i++) {
      let x = oneBrick * i + spaceing * i + spaceing + offset / 2 //calculates x coordinate of each brick
      bricks.push(new Brick(x, j * 30 + 30, oneBrick - offset, 20 , color))

    }
  }
  
}

//end of game functions 
function lost() {
  textAlign(CENTER)
  fill(255,99,71)
  textSize(50)
 displayHighscore()
  text("You suck lol", width / 2, height / 2 - 100)
  textSize(22)
  fill(255)
  scoreDisplay()
}

function won() {
  fill(0,255,0)
  textSize(50)
  textAlign(CENTER)
  displayHighscore()
  text("Victory Royale!", width / 2, height / 2 - 100)
  fill(255)
  textSize(22)
  scoreDisplay()
}

function scoreDisplay() {
  textAlign(CENTER)
  text("High Score: " + highScore, width / 2, height / 2)
  text("Your Score: " + score, width / 2, height / 2 + 30)
  text("PRESS THE MOUSE BUTTON TO PLAY AGAIN", width / 2, height / 2 + 80)
  textAlign(LEFT)
}

function updateHighscore() {
  if (score > highScore) { highScore = score }
}
//end of end of game functions 

function preload(){
  oof = loadSound("oof.mp3")
  music = loadSound("song.mp3")
  vr = loadSound("vrt.mp3")
  g = loadImage("g.jpg")
}


function setup() {

  createCanvas(windowWidth*3/5, windowHeight*4/5);
  //canvas.parent('sketch-holder');
  background(g);
  noCursor();
  resetBricks()

  //creates all of the other elements
  bat = new Bat(15, 80)// creates the bat 
  ball = new Ball(0, 0, 10);// creates static ball
  lives = new LivesCounter()
}


function draw() {
  background(g);
  if (start) {
    rectMode(CENTER)
    textAlign(CENTER);
    fill(100)
    rect(width / 2, height / 2, 600, 50)
    fill(255)
    text("PRESS THE LEFT MOUSE BUTTON TO RELEASE THE BALL!", width / 2, height / 2)
    textAlign(LEFT)
    rectMode(CORNER)
  }
  text(" |  Score: " + score, 130, 22)
  textAlign(RIGHT)
  text("High Score: " + highScore, width - 20, 22)
  textAlign(LEFT)

  ball.draw();
  ball.update();

  bat.draw();
  bat.update();

  lives.draw()
  lives.decrease(ball.isTouchingBottom())
  if (ball.isTouchingBottom()) {
   
    ball.reset()
    start = true

  }

  if (bat.hits(ball)) {
    ball.bounce();
  }

  for (brick of bricks) {
    brick.draw();
  }

  for (i = 0; i <= bricks.length - 1; i++) {
    if (bricks[i].hits(ball)) {
      bricks.splice(i, 1);
      ball.bounce();
      score += 1


    }
  }
  if (finish) {
    
    updateHighscore()
    background(0)
    lost()
  }

  if (score === total) {
    updateHighscore()
    music.pause()
    ball.reset()
    background(0)
    if(notPlayed){vr.play();notPlayed=false}
    won()
  }
}


function mousePressed() {

  if(mouseX<width&&mouseX>0&&mouseY<height&&mouseY>0){
    document.getElementById("con").innerHTML = "      "
  if (start) {
    if(lives.count===3){music.play()}
    ball = new Ball(width/100, height/50, 10);
    start = false
    notPlayed = true
  }
  if (finish || score === total) {
    resetBricks()
    ball.reset()
    lives.reset()
    score = 0
    start = true
    finish = false
  }
  }
}
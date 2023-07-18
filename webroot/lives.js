//lives left counter

class LivesCounter {
  constructor() {
    this.count = 3

  }
  decrease(q) {
    if (q) {
      if (this.count === 0) {
        finish = true
        music.pause()
        oof.play()
      }
      else {
        this.count -= 1
      }
    }
  }
  draw() {
    textSize(20)
    text("Lives Left: " + this.count, 20, 22)

  }

  reset(){
    this.count=3
  }
}
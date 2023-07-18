class Brick {
	constructor(x,y,w,h,c) {
		this.x = x;
    this.y = y;
		this.w = w;
		this.h = h;
    this.c = c;
	}

	draw() {
    
    fill(this.c);
		rect(this.x, this.y, this.w, this.h,5)
    fill(255)
	}

	hits(ball) {
		return collideRectCircle(this.x, this.y, this.w, this.h, ball.x, ball.y, ball.r)
	}

  reset(){
    
  }
}
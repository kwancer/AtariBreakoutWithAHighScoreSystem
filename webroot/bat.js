class Bat {
	constructor(h, w) {
		this.x = width /2;
		this.y = height - 50;
		this.h = h;
		this.w = w;
	}

	draw() {
		fill(255);
		rect(this.x, this.y, this.w, this.h,5)
	}

	update() {
		this.x = mouseX - (this.w / 2)
	}

	hits(ball) {
		return collideRectCircle(this.x, this.y, this.w, this.h, ball.x, ball.y, ball.d)
	}

  
}
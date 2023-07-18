class Ball{
	constructor(xVel,yVel,radius) {
		this.x = width/2;
		this.y = height - 80;;
		this.yVel = - yVel;
		this.xVel = random(-xVel,xVel);
		this.r = radius;
    this.d = 2*this.r
  
	}

	draw() {
		fill(255);
		ellipse(this.x,this.y,this.d,this.d);
	}

	update() {
		this.x = this.x + this.xVel;	
		this.y = this.y + this.yVel;

		if(this.x + this.r > width || this.x - this.r < 0) {
			this.xVel = -this.xVel;
		}

		if(this.y - this.r < 0 || this.y + this.r > height) {
			this.yVel = -this.yVel;
		}
	}

  isTouchingBottom(){
    if(this.y + this.r > height) {
			return true
		}
    else{
      return false
    }
    
  }

	bounce() {
		this.yVel = -this.yVel;
    this.xVel = random(this.xVel-2,this.xVel+2)
    
	}

  reset(){
    this.x = width/2;
		this.y = height - 80;;
		this.yVel = 0;
		this.xVel = 0;
  }
}
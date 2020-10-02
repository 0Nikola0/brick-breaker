class Vec{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }
}


class Rect{
    constructor(x, y, w, h){
        this.pos = new Vec(x, y);
        this.size = new Vec(w, h);
    }
}


class Paddle extends Rect{
    constructor(pos, size, vel){
        super(pos[0], pos[1], size[0], size[1]);
        this.vel = new Vec(vel, 0)
    }

    move(key){
        switch (key.keyCode){
            // right arrow
            case 39: 
                this.pos.x += this.vel.x * (dt / 1000);
                
            // left arrow
            case 37:
                this.pos.x += this.vel.x * (dt / 1000);
                
            // up arrow
            case 38:
                this.pos.y += this.vel.y * (dt / 1000);
                
            // down arrow
            case 40:
                this.pos.y += this.vel.y * (dt / 1000);
                
        }
    }
    
    draw(){
        context.fillStyle = "#fff";
        context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}


class Ball extends Rect{
    constructor(pos, size, vel){
        super(pos[0], pos[1], size[0], size[1]);
        this.vel = new Vec(vel, vel);
    }
    
    check_collision(/*Rect*/ objs){
        // If the ball hits left or right wall
        if ((this.pos.x < 0) || ((this.pos.x + this.size.x) >= Canvas.width)){
            this.vel.x = -this.vel.x
        }

        /*for (obj of objs){
            // Check wheter the ball collides with any objs
            if (((this.pos.y >= obj.pos.y) && (this.pos.y <= (obj.pos.y + obj.size.y))) && 
                ((this.pos.x >= obj.pos.x) && (this.pos.x <= (obj.pos.x + obj.size.x)))){
                // Change direction
                this.vel.x = -this.vel.x;
                this.vel.y = -this.vel.y;
                break;
            }
        }*/
    }

    move(dt){
        this.pos.x += this.vel.x * (dt / 1000);
        this.pos.y += this.vel.y * (dt / 1000);
    }

    draw(){
        context.fillStyle = "#fff";
        context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}


const Canvas = document.getElementById("game");
const context = Canvas.getContext("2d");

const player = new Paddle([Canvas.width / 2, Canvas.height - 30], [50, 20], 200);
const ball = new Ball([Canvas.width / 2, 400], [20, 20], 200);
console.log(ball)


let LastTime;
function CallBack(millis){
    if (LastTime){
        update(millis - LastTime);
    }
    LastTime = millis;
    requestAnimationFrame(CallBack);
}


function update(dt){
    ball.move(dt);

    // Background
    context.fillStyle = "#000";
    context.fillRect(0, 0, Canvas.width, Canvas.height);

    ball.draw();
    player.draw();

    // TODO this doesnt work
    Canvas.addEventListener("keydown", function(e){
        player.move(e)
    });
}

CallBack();

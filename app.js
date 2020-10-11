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

    #updatePos(pos){
        this.pos.x = pos
    }

    move(){
        document.addEventListener("mousemove", event =>{
            /*  Player position is centered to the mouse
                Also prevents player to go off screen
            */
            this.#updatePos(event.offsetX < Canvas.width - this.size.x / 2 ? 
                (event.offsetX - this.size.x / 2 > 0 ? event.offsetX - this.size.x / 2 : 0) :
                 Canvas.width - this.size.x);
        });
    }

    collidedWith(ball){
        if (((ball.pos.y >= this.pos.y) && (ball.pos.y <= (this.pos.y + this.size.y))) && 
            ((ball.pos.x >= this.pos.x) && (ball.pos.x <= (this.pos.x + this.size.x)))){
            return true;
        }
        return false;
    }
    
    #moveWithKeys(key, dt){
        switch (key.code){
            case "ArrowRight": 
                this.pos.x += this.vel.x * (dt / 1000);
                
            case "ArrowLeft":
                this.pos.x -= this.vel.x * (dt / 1000);
                
            case "ArrowUp":
                this.pos.y -= this.vel.y * (dt / 1000);
                
            case "ArrowDown":
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
    
    checkCollisions(/*Rect*/ objs){
        // If the ball hits left or right wall
        if ((this.pos.x < 0) || ((this.pos.x + this.size.x) >= Canvas.width)){
            this.vel.x *= -1;
        }
        // If the ball hits top wall
        if (this.pos.y < 0){
            this.vel.y *= -1;
        }
        
        if (objs instanceof Paddle){
            if (player.collidedWith(this)){
                // Change direction
                this.vel.y *= -1;
                // Add some whitespace so ball doesnt bug
                this.pos.y -= 5;
            }
        }
        else{
            for (let i = 0; i < objs.length; i++){
                // Check wheter the ball collides with any objs
                if (objs[i].collidedWith(this)){
                    // Change directions
                    this.vel.y *= -1;
                    // Add some whitespace so ball doesnt bug
                    this.pos.y += 5;
                    // Removing the collided brick
                    bricks.splice(i, 1);
                    
                }
            }
        }
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


class Brick extends Rect{
    constructor(pos, size=[60, 30]){
        super(pos[0], pos[1], size[0], size[1]);
    }

    draw(){
        context.fillStyle = "#fff";
        context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    collidedWith(ball){
        if (((ball.pos.y >= this.pos.y) && (ball.pos.y <= (this.pos.y + this.size.y))) && 
            ((ball.pos.x >= this.pos.x) && (ball.pos.x <= (this.pos.x + this.size.x)))){
            // True if collides
            return true;
        }
        // False if not
        return false;
    }
}


function create_bricks(num){
    // num is the number of rows
    let posx = 10;
    let posy = 10;
    let bricks = [];
    for(let i = 0; i < num; i++){
        for (let j = 0; j < 10; j++){
            bricks.push(new Brick([posx, posy]));
            posx += 80;
            console.log(i);
        }  
        posx = 10;     
        posy += 38;
    }
    return bricks;
}


const Canvas = document.getElementById("game");
const context = Canvas.getContext("2d");

const player = new Paddle([Canvas.width / 2, Canvas.height - 30], [80, 20], 10);
const ball = new Ball([Canvas.width / 3, 400], [20, 20], 200);

var bricks = create_bricks(3);

let LastTime;
function CallBack(millis){
    if (LastTime){
        update(millis - LastTime);
    }
    LastTime = millis;
    requestAnimationFrame(CallBack);
}


function update(dt){
    
    // This can be optimized later, along with the class method
    if (ball.pos.y < (Canvas.height / 2)){
        ball.checkCollisions(bricks);
    }
    else{
        ball.checkCollisions(player)
    }

    ball.move(dt);
    player.move();

    // Background
    context.fillStyle = "#000";
    context.fillRect(0, 0, Canvas.width, Canvas.height);

    for (brick of bricks){
        brick.draw();
    }
    player.draw();
    ball.draw();
}

CallBack();

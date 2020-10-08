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

    move(pos){
        this.pos.x = pos
    }

    moveWithKeys(key, dt){
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
    
    check_collision(/*Rect*/ objs){
        // If the ball hits left or right wall
        if ((this.pos.x < 0) || ((this.pos.x + this.size.x) >= Canvas.width)){
            this.vel.x *= -1;
        }
        // If the ball hits top wall
        if (this.pos.y < 0){
            this.vel.y *= -1;
        }

        for (let i = 0; i < objs.length; i++){
            // Check wheter the ball collides with any objs
            if (((this.pos.y >= objs[i].pos.y) && (this.pos.y <= (objs[i].pos.y + objs[i].size.y))) && 
                ((this.pos.x >= objs[i].pos.x) && (this.pos.x <= (objs[i].pos.x + objs[i].size.x)))){
                // Change direction
                this.vel.y *= -1;
                break;
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
    constructor(pos, size=[50, 30]){
        super(pos[0], pos[1], size[0], size[1]);
    }

    draw(){
        context.fillStyle = "#fff";
        context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}


function moveWithMouse(/*Obj must have move() method*/ obj){
    document.addEventListener("mousemove", event =>{
        /*  the pos of the player is equal to the pos of the mouse minus the width of the player
            so the player is centered to the mouse not left allignt,
            unless the the player is about to exit the canvas
        */
        obj.move((event.offsetX) < Canvas.width - player.size.x ? event.offsetX - player.size.x / 2 : Canvas.width - player.size.x);
    });
}


// TODO Fiiiix
function create_bricks(num) {
    let posx = 10;
    let posy = 10;
    let bricks = [];
    for(let i = 0; i < num; i++){
        bricks.push(new Brick([posx, posy]));
        posx += 60;
    }
    return bricks;
}


const Canvas = document.getElementById("game");
const context = Canvas.getContext("2d");

const player = new Paddle([Canvas.width / 2, Canvas.height - 30], [80, 20], 10);
const player2 = new Paddle([Canvas.width / 2, Canvas.height - 30], [80, 20], 10);

const ball = new Ball([Canvas.width / 3, 400], [20, 20], 200);

const bricks = create_bricks(5);
console.log(bricks);

const objects = bricks.push(player)


let LastTime;
function CallBack(millis){
    if (LastTime){
        update(millis - LastTime);
    }
    LastTime = millis;
    requestAnimationFrame(CallBack);
}


function update(dt){
    // TODO Fiiiiix
    ball.check_collision(bricks);

    ball.move(dt);
    moveWithMouse(player);

    // Background
    context.fillStyle = "#000";
    context.fillRect(0, 0, Canvas.width, Canvas.height);

    ball.draw();
    player.draw();
    for (brick of bricks){
        brick.draw();
    }

}

CallBack();

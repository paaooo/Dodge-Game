// This file focuses on classes

// sets the canvas (can't do it in "main" as I need to call it here as well)
var canvas = document.getElementsByTagName("canvas")[0];
var c = canvas.getContext('2d');
canvas.width = 1366;
canvas.height = 786;

var gravity = .4;

function makeImage(path) {
    let image = new Image();
    image.src = path;
    return image;
}

var terrain = {
    platform1: makeImage('/images/platform1.png'),
    platform2: makeImage('/images/platform2.png'),
    platform3: makeImage('/images/platform3.png'),
    background: makeImage('/images/background.png'),
    sky: makeImage('/images/backgroundsky.png'),
    ground: makeImage('images/floor.png'),
    wall: {
        left: makeImage('images/leftwall.png'),
        right: makeImage('images/rightwall.png')
    }
}
var sprite = {
    idle: {
        right: makeImage('images/idle-right.png'),
        left: makeImage('images/idle-left.png')
    },
    run: {
        right: makeImage('images/run-right.png'),
        left: makeImage('images/run-left.png')
    } 
}

class Hero {
    // learned that you don't have to initialize variables in js
    constructor() {
        this.position = {
            x: 1000,
            y: 600
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.speed = 5.2;
        this.jumpHeight = 13.5;
        this.width = 40;
        this.height = 59;

        this.anim = { // these are all the variables used for sprite animation
            direction: 'right',
            speed: 60,
            frames: 0,
            maxFrames: 17,
            cropx: 18,
            cropy: 27,
            width: 23,
            height: 32,
            currentSprite: sprite.idle.right
        }
    }
    draw() {
        // c.fillRect(this.position.x, this.position.y, this.width, this.height); // draws where the current player is
        c.drawImage(
            this.anim.currentSprite,
            this.anim.cropx + (this.anim.frames * 80), // crop position x
            this.anim.cropy, // crop position y
            this.anim.width, // image width
            this.anim.height, // image height
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
    update() {
        this.draw();
        if (this.position.x + this.width + this.velocity.x >= this.width && this.position.x + this.width + this.velocity.x <= canvas.width) {
            this.position.x += this.velocity.x;
            // console.log("moving");
        }

        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y <= canvas.height) { // makes sure the entire character is at the bottom
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }

    }
}

class Platform {
    constructor(x, y, image) {
        this.position = {
            x,
            y
        }

        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Background {
    constructor(image) {
        this.image = image;
    }
    draw() {
        c.drawImage(this.image, 0, 0);
    }
}
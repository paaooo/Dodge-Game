// This file focuses on classes

// sets the canvas (can't do it in "main" as I need to call it here as well)
var canvas = document.getElementsByTagName("canvas")[0];
var c = canvas.getContext('2d');
canvas.width = 1366;
canvas.height = 786;

var gravity = .35;

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
    },
    slice: {
        left: makeImage('images/slice-left.png'),
        right: makeImage('images/slice-right.png')
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
        this.speed = 4;
        this.jumpHeight = 12;
        this.width = 46;
        this.height = 64;

        this.slicing = false; // this decides if the player is slicing or not

        this.anim = { // these are all the variables used for sprite animation
            frameSkip: 80,
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
    update() {
        // testing hitbox with animation
        // c.globalAlpha = 0.5;
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        // c.globalAlpha = 1;

        // movement
        this.position.x += this.velocity.x;
        // gravity & jumping
        this.position.y += this.velocity.y;
        this.velocity.y += gravity;

    }
}
class HeroAnimation { // so the actual animation doesn't change the hitbox of the character
    constructor() {
        this.xOffset = 2; // to center the character in the middle of the hitox
        this.animX = 1000;
        this.animY = 600;
        this.frameSkip = 80;
        this.direction = 'right';
        this.speed = 60;
        this.frames = 0;
        this.maxFrames = 18;
        this.cropx = 17;
        this.cropy = 27;
        this.width = 24;
        this.height = 32;
        this.currentSprite = sprite.idle.right;
    }
    drawAnimation(x, y) {
        this.animX = x - (this.width - 23) + this.xOffset;
        this.animY = y - ((this.height - 32) * 2);
        // c.fillRect(this.animX, this.animY, this.width*2, this.height*2); // testing animation space
        c.drawImage(
            this.currentSprite,
            this.cropx + (this.frames * this.frameSkip), // crop position x
            this.cropy, // crop position y
            this.width, // image width
            this.height, // image height
            this.animX,
            this.animY,
            this.width * 2,
            this.height * 2
        );
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
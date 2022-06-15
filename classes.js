// This file focuses on classes

// sets the canvas (can't do it in "main" as I need to call it here as well)
var canvas = document.getElementsByTagName("canvas")[0];
var c = canvas.getContext('2d');
canvas.width = 1366;
canvas.height = 786;

var lost = true;
var score = 0;

var gravity = .35;

function makeImage(path) {
    let image = new Image();
    image.src = path;
    return image;
}

var sound = {
    tick: new Howl({ src: ['sounds/tick.mp3'], volume: 1}),
    lose: new Howl({ src: ['sounds/lose.mp3'], volume: 0.2}),
    jump: new Howl({ src: ['sounds/jump.mp3'], volume: 0.03}),
    swing: new Howl({ src: ['sounds/swing.mp3'], volume: 0.1}),
    hit: new Howl({ src: ['sounds/hit.mp3'], volume: 0.05})
}

var terrain = {
    platform1: makeImage('images/platform1.png'),
    platform2: makeImage('images/platform2.png'),
    platform3: makeImage('images/platform3.png'),
    background: makeImage('images/background.png'),
    sky: makeImage('images/backgroundsky.png'),
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

var shuriken = makeImage('images/shurikenRotate.png');

class Hero {
    // learned that you don't have to initialize variables in js
    constructor() {
        this.position = {
            x: canvas.width / 2,
            y: 620
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.speed = 4.5;
        this.jumpHeight = 12;
        this.width = 46;
        this.height = 64;

        this.slicing = false; // this decides if the player is slicing or not
    }
    update() {
        // movement
        this.position.x += this.velocity.x;
        // gravity & jumping
        this.position.y += this.velocity.y;
        this.velocity.y += gravity;

    }
}
class HeroAnimation { // separated so the actual animation doesn't change the hitbox of the character
    constructor() {
        this.xOffset = 3; // to center the character in the middle of the hitox
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

class Projectile {
    constructor(image) {
        this.position = {
            x: canvas.width / 2,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.image = image;
        this.width = 35;
        this.height = 35;
        this.frames = 0;
        this.sliced = false; // for projectiles to only be sliced once per swing
    }
    draw(transparency) {
        c.globalAlpha = transparency; // to make projectiles invisible when the game has not started
        c.drawImage(
            this.image,
            230 * this.frames,
            0,
            230,
            230,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        c.globalAlpha = 1;
    }
    update() {
        if (lost) {
            this.draw(0);
        } else {
            this.draw(1);
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
// This file kind of serves as a main class
// Basically calls everything into place
window.onload = () => {
    const hero = new Hero(); // creates character
    const heroAnimation = new HeroAnimation();
    const platforms = [
        new Platform(512, 530, terrain.platform1),
        new Platform(545, 290, terrain.platform2),
        new Platform(175, 405, terrain.platform3),
        new Platform(1035, 405, terrain.platform3),
        new Platform(0, 700, terrain.ground),
        new Platform(-67, 0, terrain.wall.left),
        new Platform(1336, 0, terrain.wall.right)]; // creates platforms, walls, and the ground
    const background = new Background(terrain.background); // creates background
    const sky = new Background(terrain.sky); // creates sky / background for background

    function frameInterval() { // Frames for image animations
        var currentAnim = heroAnimation.currentSprite;
        var end = () => {
            // resets the animation interval when animation changes
            clearInterval(anim);
            frameInterval();
        }
        
        let anim = setInterval(() => {
            if ((currentAnim === sprite.slice.right || currentAnim === sprite.slice.left) && (heroAnimation.currentSprite === sprite.slice.right || heroAnimation.currentSprite === sprite.slice.left) // prevents slicing from resetting when turning
            || (currentAnim === heroAnimation.currentSprite)) { // checks if animation changed
                heroAnimation.frames++; // moves on to next frame
                if (heroAnimation.frames >= heroAnimation.maxFrames) {
                    if (currentAnim === sprite.slice.left || currentAnim === sprite.slice.right) { // If slice animation ends
                        hero.slicing = false;
                        setTimeout(() => { moveKeys.slice.pressed = false;}, 800) // sets up the cooldown for slicing
                    } else {
                        heroAnimation.frames = 0; // loops all animation apart from slice
                    }
                }
            } else {
                heroAnimation.frames = 0;
                end();
            }
        }, heroAnimation.speed);
    }
    frameInterval();

    var moveKeys = {
        left: {
            pressed: false
        },
        right: {
            pressed: false
        },
        up: {
            pressed: false
        },
        slice: {
            pressed: false
        }
    }

    function animate() { // Game loop
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height); // clears everythign in the canvas for the next frame to be drawn / updated
        // draws: background first, then platforms, then character
        sky.draw();
        background.draw();
        platforms.forEach((platform) => {
            platform.draw();
        });
        heroAnimation.drawAnimation(hero.position.x, hero.position.y);
        hero.update();

        // inputs
        if ((moveKeys.left.pressed && moveKeys.right.pressed) || (!moveKeys.left.pressed && !moveKeys.right.pressed)) { // for when both keys are pressed or none
            // idle
            hero.velocity.x = 0;
            // sets hero animation to idle depending on which direction
            heroAnimation.speed = 60;
            heroAnimation.maxFrames = 18;
            heroAnimation.cropy = 27;
            heroAnimation.width = 23;
            heroAnimation.height = 32;
            if (heroAnimation.direction === 'right') { // which direction the hero is facing
                heroAnimation.frameSkip = 80;
                heroAnimation.cropx = 18;
                heroAnimation.currentSprite = sprite.idle.right;
            } else {
                heroAnimation.frameSkip = -80;
                heroAnimation.cropx = 1398;
                heroAnimation.currentSprite = sprite.idle.left;
            }
        } else { // when left or right key is pressed
            // moving
            heroAnimation.speed = 25;
            heroAnimation.maxFrames = 24;
            heroAnimation.cropy = 22;
            heroAnimation.width = 25;
            heroAnimation.height = 37;
            if (moveKeys.right.pressed) { // when right key is pressed
                hero.velocity.x = hero.speed;
                // sets hero animation to run
                heroAnimation.frameSkip = 80;
                heroAnimation.direction = 'right';
                heroAnimation.cropx = 18;
                heroAnimation.currentSprite = sprite.run.right;
            } else { // when left key is pressed
                hero.velocity.x = -hero.speed;
                // sets hero animation to run
                heroAnimation.frameSkip = -80;
                heroAnimation.direction = 'left';
                heroAnimation.cropx = 1878;
                heroAnimation.currentSprite = sprite.run.left;
            }

        }
        // slicing - overrides current animation
        if (hero.slicing) {
            heroAnimation.speed = 50;
            heroAnimation.maxFrames = 6;
            heroAnimation.cropy = 37;
            heroAnimation.width = 55;
            heroAnimation.height = 37;
            if (heroAnimation.direction === 'right') { // slice right
                heroAnimation.cropx = 600;
                heroAnimation.currentSprite = sprite.slice.right;
                heroAnimation.frameSkip = -110;
            } else { // slice left
                heroAnimation.cropx = 26;
                heroAnimation.currentSprite = sprite.slice.left;
                heroAnimation.frameSkip = 110;
            }
        }
        //jumping
        if (moveKeys.up.pressed && // up key pressed
            (hero.velocity.y === gravity)) { // if the velocity is 0 (bottom) or equals to gravity (on a platform but doesn't move)
            hero.velocity.y -= hero.jumpHeight;
        }

        // Collision detection between character and platform
        platforms.forEach((platform) => {
            // Collision vertically
            if (hero.position.x + hero.width >= platform.position.x && hero.position.x <= platform.position.x + platform.width) { // detects if character is aligned with platform
                if (hero.position.y + hero.height <= platform.position.y && hero.position.y + hero.height + hero.velocity.y >= platform.position.y) { // detects if character is above platform
                    hero.velocity.y = 0;
                }
                if (hero.position.y >= platform.position.y + platform.height && hero.position.y + hero.velocity.y <= platform.position.y + platform.height) { // detects if character is below platform
                    hero.velocity.y = .5; // bumps character back down
                }
            }
            // Collision horizontally
            if ((hero.position.x + hero.width + hero.velocity.x >= platform.position.x && hero.position.x + hero.velocity.x <= platform.position.x + platform.width)
                && (hero.position.y + hero.height >= platform.position.y && hero.position.y <= platform.position.y + platform.height)) {
                hero.velocity.x = 0;
            }
        });
    }

    animate();

    //inputs
    addEventListener("keydown", ({ code }) => {
        switch (code) {
            case "KeyW":
            case "Space":
                moveKeys.up.pressed = true;
                break;
            case "KeyS":
                if (!moveKeys.slice.pressed) { // if the player already sliced this won't activate
                    hero.slicing = true;
                    heroAnimation.frames = 0; // resets frames before it draws slashing
                    moveKeys.slice.pressed = true;
                }
                break;
            case "KeyA":
                moveKeys.left.pressed = true;
                break;
            case "KeyD":
                moveKeys.right.pressed = true;
                break;
        }
    })
    addEventListener("keyup", ({ code }) => {
        switch (code) {
            case "KeyA":
                moveKeys.left.pressed = false;
                break;
            case "KeyD":
                moveKeys.right.pressed = false;
                break;
            case "KeyW":
            case "Space":
                moveKeys.up.pressed = false;
                break;
        }
    })
}
// This file kind of serves as a main class
// Basically calls everything into place
window.onload = () => {
    const hero = new Hero(); // creates character
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
        var currentAnim = hero.anim.currentSprite;
        var end = () => {
            // resets the animation interval when animation changes
            clearInterval(anim);
            hero.anim.frames = 0;
            frameInterval();
        }
        let anim = setInterval(() => {
            if (currentAnim === hero.anim.currentSprite) { // checks if animation changed
                hero.anim.frames++; // moves on to next frame
                if(currentAnim === sprite.slice.right && hero.anim.frames === hero.anim.maxFrames) { // If slice animation finished once
                    hero.slicing = false;
                    end();
                }
                hero.anim.frames %= hero.anim.maxFrames; // resets animation after all frames ends
            } else {
                end();
            }
        }, hero.anim.speed);
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
        hero.update();

        // inputs
        if ((moveKeys.left.pressed && moveKeys.right.pressed) || (!moveKeys.left.pressed && !moveKeys.right.pressed)) { // for when both keys are pressed or none
            // idle
            hero.velocity.x = 0;
            // sets hero animation to idle depending on which direction
            hero.anim.speed = 60;
            hero.anim.maxFrames = 18;
            hero.anim.cropy = 27;
            hero.anim.width = 23;
            hero.anim.height = 32;
            if (hero.anim.direction === 'right') { // which direction the hero is facing
                hero.anim.frameSkip = 80;
                hero.anim.cropx = 18;
                hero.anim.currentSprite = sprite.idle.right;
            } else {
                hero.anim.frameSkip = -80;
                hero.anim.cropx = 1398;
                hero.anim.currentSprite = sprite.idle.left;
            }
        } else { // when left or right key is pressed
            // moving
            hero.anim.speed = 25;
            hero.anim.maxFrames = 24;
            hero.anim.cropy = 22;
            hero.anim.width = 25;
            hero.anim.height = 37;
            if (moveKeys.right.pressed) { // when right key is pressed
                hero.velocity.x = hero.speed;
                // sets hero animation to run
                hero.anim.frameSkip = 80;
                hero.anim.direction = 'right';
                hero.anim.cropx = 18;
                hero.anim.currentSprite = sprite.run.right;
            } else { // when left key is pressed
                hero.velocity.x = -hero.speed;
                // sets hero animation to run
                hero.anim.frameSkip = -80;
                hero.anim.direction = 'left';
                hero.anim.cropx = 1878;
                hero.anim.currentSprite = sprite.run.left;
            }

        }
        // slicing - overrides current animation
        if(hero.slicing) {
            hero.anim.frameSkip = 110;
            hero.anim.speed = 40;
            hero.anim.maxFrames = 7;
            hero.anim.cropx = 26;
            hero.anim.cropy = 37;
            hero.anim.width = 55;
            hero.anim.height = 37;
            hero.anim.currentSprite = sprite.slice.right;
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
                // hero.velocity.y -= 8; // moved jumping inside animate() function
                moveKeys.up.pressed = true;
                break;
            case "KeyS":
                if (!moveKeys.slice.pressed) { // if the player already sliced this won't activate
                    hero.slicing = true;
                    moveKeys.slice.pressed = true;
                    setTimeout(() => { moveKeys.slice.pressed = false; }, 1000) // sets up the cooldown for slicing
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
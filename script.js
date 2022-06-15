// This file kind of serves as a main class
// Basically calls everything into place
window.onload = () => {
    const hero = new Hero(); // creates character
    const heroAnimation = new HeroAnimation();
    const platforms = [
        new Platform(512, 530, terrain.platform1),
        new Platform(545, 290, terrain.platform2),
        new Platform(175, 405, terrain.platform3),
        new Platform(1035, 405, terrain.platform3)]; // creates platforms

    const ground = new Platform(0, 700, terrain.ground); // creates ground
    const walls = { // creates walls
        left: new Platform(-67, 0, terrain.wall.left),
        right: new Platform(1336, 0, terrain.wall.right)
    }
    const background = new Background(terrain.background); // creates background
    const sky = new Background(terrain.sky); // creates sky / background for background

    const projectiles = [ // Contains amount of projectiles
        new Projectile(shuriken),
        new Projectile(shuriken),
        new Projectile(shuriken),
        new Projectile(shuriken),
        new Projectile(shuriken),
        new Projectile(shuriken),
        new Projectile(shuriken),
        new Projectile(shuriken)
    ]

    var moveKeys = { // So Inputs are able to be held down
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

    // Frames for image animations
    function frameInterval() {
        let currentAnim = heroAnimation.currentSprite;
        let end = () => {
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
                        setTimeout(() => { moveKeys.slice.pressed = false; }, 500) // sets up the cooldown for slicing
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

    // for projectiles to rotate
    setInterval(() => {
        projectiles.forEach((projectile) => {
            projectile.frames++;
            projectile.frames %= 6; // for it to reset after 6 frames
        })
    }, 25);

    var scoreInterval = null; // for score to go up
    function startGame() {
        // resets everything
        score = 0;
        loseGame();
        lost = false;
        // launches projectiles at a random direction
        projectiles.forEach((projectile) => {
            projectile.velocity.x = Math.ceil(Math.random() * 3) - 2.5 + Math.random();
            projectile.velocity.y = Math.ceil(Math.random() * 3) - 2.5 + Math.random();
            // if projectile is too slow
            if (Math.abs(projectile.velocity.x) + Math.abs(projectile.velocity.y) <= 2) {
                if (projectile.velocity.x > 0) {
                    projectile.velocity.x += 1;
                } else {
                    projectile.velocity.x -= 1;
                }
                if (projectile.velocity.y > 0) {
                    projectile.velocity.y += 1;
                } else {
                    projectile.velocity.y -= 1;
                }
            }
        });
        // starts counting the score up
        scoreInterval = setInterval(() => { score++; sound.tick.play(); }, 1000);
    }

    function loseGame() {
        // turns off projectiles
        lost = true;
        projectiles.forEach((projectile) => {
            projectile.velocity.x = 0;
            projectile.velocity.y = 0;
            projectile.position.x = canvas.width / 2;
            projectile.position.y = 100;
        });
        // stops score from going up
        clearInterval(scoreInterval);
    }

    function gameLoop() { // Game loop
        requestAnimationFrame(gameLoop);
        c.clearRect(0, 0, canvas.width, canvas.height); // clears everythign in the canvas for the next frame to be drawn / updated
        // draws: background first, then platforms, then character, then projectile
        sky.draw();
        background.draw();
        // Note: separated platforms, walls, and ground for projectile purposes, and to box character in
        platforms.forEach((platform) => {
            platform.draw();
        });

        ground.draw();
        walls.left.draw();
        walls.right.draw();

        heroAnimation.drawAnimation(hero.position.x, hero.position.y);
        hero.update();

        projectiles.forEach((projectile) => {
            projectile.update();
        });

        // inputs
        if ((moveKeys.left.pressed && moveKeys.right.pressed) || (!moveKeys.left.pressed && !moveKeys.right.pressed)) { // for when both keys are pressed or none
            // idle
            hero.velocity.x = 0;
            // sets hero animation to idle depending on which direction
            heroAnimation.speed = 60;
            heroAnimation.maxFrames = 18;
            heroAnimation.cropy = 27;
            heroAnimation.width = 24;
            heroAnimation.height = 32;
            if (heroAnimation.direction === 'right') { // which direction the hero is facing
                heroAnimation.xOffset = 3;
                heroAnimation.frameSkip = 80;
                heroAnimation.cropx = 17;
                heroAnimation.currentSprite = sprite.idle.right;
            } else {
                heroAnimation.xOffset = -3;
                heroAnimation.frameSkip = -80;
                heroAnimation.cropx = 1399;
                heroAnimation.currentSprite = sprite.idle.left;
            }
        } else { // when left or right key is pressed
            // moving
            heroAnimation.speed = 30;
            heroAnimation.maxFrames = 24;
            heroAnimation.cropy = 22;
            heroAnimation.width = 26;
            heroAnimation.height = 37;
            if (moveKeys.right.pressed) { // when right key is pressed
                hero.velocity.x = hero.speed;
                // sets hero animation to run
                heroAnimation.xOffset = 7;
                heroAnimation.frameSkip = 80;
                heroAnimation.direction = 'right';
                heroAnimation.cropx = 18;
                heroAnimation.currentSprite = sprite.run.right;
            } else { // when left key is pressed
                hero.velocity.x = -hero.speed;
                // sets hero animation to run
                heroAnimation.xOffset = -7;
                heroAnimation.frameSkip = -80;
                heroAnimation.direction = 'left';
                heroAnimation.cropx = 1878;
                heroAnimation.currentSprite = sprite.run.left;
            }

        }
        // slicing - overrides current animation
        if (hero.slicing) {
            heroAnimation.speed = 60;
            heroAnimation.maxFrames = 6;
            heroAnimation.cropy = 37;
            heroAnimation.width = 58;
            heroAnimation.height = 37;
            if (heroAnimation.direction === 'right') { // slice right
                heroAnimation.xOffset = 19;
                heroAnimation.cropx = 601;
                heroAnimation.currentSprite = sprite.slice.right;
                heroAnimation.frameSkip = -112;
            } else { // slice left
                heroAnimation.xOffset = -19;
                heroAnimation.cropx = 22;
                heroAnimation.currentSprite = sprite.slice.left;
                heroAnimation.frameSkip = 112;
            }
        }
        //jumping
        if (moveKeys.up.pressed && // up key pressed
            (hero.velocity.y === gravity)) { // if the velocity is 0 (bottom) or equals to gravity (on a platform but doesn't move)
                sound.jump.play();
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
            if ((hero.position.x + hero.width + hero.velocity.x >= platform.position.x && hero.position.x + hero.velocity.x <= platform.position.x + platform.width) // detects if character is beside platform
                && (hero.position.y + hero.height >= platform.position.y && hero.position.y <= platform.position.y + platform.height)) { // detects if character is in line with platform height
                hero.velocity.x = 0;
            }
        });

        // Collision between character and ground
        if (hero.position.y + hero.height + hero.velocity.y >= ground.position.y) {
            hero.velocity.y = 0;
        }

        // Collision between character and walls
        if (hero.position.x + hero.width + hero.velocity.x >= walls.right.position.x || hero.position.x + hero.velocity.x <= walls.left.position.x + walls.left.width) {
            hero.velocity.x = 0;
        }

        // Projectile Collisions
        projectiles.forEach((projectile) => {
            // Note: Collision with environment increases velocity

            // Collision between projectile and ground and top
            if (projectile.position.y + projectile.height + projectile.velocity.y >= ground.position.y || projectile.position.y + projectile.velocity.y <= 0) {
                projectile.velocity.y *= -1;
                if (projectile.velocity.y < 0) {
                    projectile.velocity.y -= gravity / 5;
                } else {
                    projectile.velocity.y += gravity / 5;
                }
            }
            // Collision between projectile and walls
            if (projectile.position.x + projectile.width + projectile.velocity.x >= walls.right.position.x || projectile.position.x + projectile.velocity.x <= walls.left.position.x + walls.left.width) {
                projectile.velocity.x *= -1;
                if (projectile.velocity.x < 0) {
                    projectile.velocity.x -= gravity / 3;
                } else {
                    projectile.velocity.x += gravity / 3;
                }
            }

            // Collision between projectile and player
            if (hero.slicing) { // during slicing animation
                if (projectile.position.y + projectile.velocity.y + projectile.height >= heroAnimation.animY && projectile.position.y + projectile.velocity.y <= heroAnimation.animY + heroAnimation.height // If projectile is aligned with hitbox vertically 
                    && projectile.position.x + projectile.velocity.x + projectile.width >= heroAnimation.animX && projectile.position.x + projectile.velocity.x <= heroAnimation.animX + (heroAnimation.width * 2) // If projectile is aligned with hitbox horizontally
                    && !projectile.sliced) { // If projectile hasn't been sliced yet
                    if (heroAnimation.direction === "right") {
                        projectile.position.x = heroAnimation.animX + (heroAnimation.width*2);
                        projectile.velocity.x = Math.abs(projectile.velocity.x) + .5;
                    } else {
                        projectile.position.x = heroAnimation.animX - projectile.width;
                        projectile.velocity.x = (Math.abs(projectile.velocity.x) * -1) - .5;
                    }
                    projectile.sliced = true;
                    if(!lost) {sound.hit.play();} // condition is so that sound doesn't play on invisible projectiles

                }
            } else {
                if(projectile.position.y + projectile.velocity.y + projectile.height >= hero.position.y && projectile.position.y + projectile.velocity.y <= hero.position.y + hero.height // If projectile is aligned with hitbox vertically
                    && projectile.position.x + projectile.velocity.x + projectile.width >= hero.position.x && projectile.position.x + projectile.velocity.x <= hero.position.x + hero.width) { // If projectile is aligned with hitbox horizontally
                        if(!lost) {sound.lose.play();} // condition is so that sound doesn't play on invisible projectiles
                        loseGame();
                    }
            }

            // Fixes interaction where player could put projectiles out of bounds if hit a certain way
            if(projectile.position.x < walls.left.position.x + walls.left.width) {
                projectile.position.x = walls.left.position.x + walls.left.width + .1;
            }
            if(projectile.position.x + projectile.width > walls.right.position.x) {
                projectile.position.x = walls.right.position.x - projectile.width - .1;
            }

            // Projectile max velocity
            if (Math.abs(projectile.velocity.y) > 10) {
                if (projectile.velocity.y > 0) {
                    projectile.velocity.y = 10;
                } else {
                    projectile.velocity.y = -10;
                }
            }
            if (Math.abs(projectile.velocity.x) > 10) {
                if (projectile.velocity.x > 0) {
                    projectile.velocity.x = 10;
                } else {
                    projectile.velocity.x = -10;
                }
            }
        });

        // Update Score
        document.getElementsByTagName("Score")[0].innerText = "Score: " + score;
    }

    //inputs
    addEventListener("keydown", (key) => {
        key.preventDefault();
        switch (key.code) {
            case "KeyW":
            case "Space":
                moveKeys.up.pressed = true;
                break;
            case "KeyS":
            case "KeyJ":
                if (!moveKeys.slice.pressed) { // if the player already sliced this won't activate
                    sound.swing.play();
                    hero.slicing = true;
                    heroAnimation.frames = 0; // resets frames before it draws slashing
                    moveKeys.slice.pressed = true;
                    projectiles.forEach((projectile) => { // resets sliced condition after every slice input
                        projectile.sliced = false;
                    })
                }
                break;
            case "KeyA":
                moveKeys.left.pressed = true;
                break;
            case "KeyD":
                moveKeys.right.pressed = true;
                break;
            case "Enter":
                startGame();
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

    document.getElementsByTagName("Start")[0].addEventListener("click", () => { startGame(); });
    frameInterval();
    gameLoop();
}
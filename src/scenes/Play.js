class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        this.cameras.main.fadeIn(2000, 255, 255, 255);
        this.input.keyboard.enabled = true;
        this.obstacleSpeed = -450;
        // this.obstacleSpeed = -1500;
        this.obstacleMin = 4000;
        this.obstacleMax = 5000;
        this.obstacleSpreadMin = 850;
        this.obstacleSpreadMax = -2500;
        this.JUMP_VELOCITY = -750;
        this.MAX_JUMPS = 1;
        this.SCROLL_SPEED = 3;
        this.collisionOn = true;
        this.SCORE_MULTIPLIER = 1;
        this.physics.world.gravity.y = 3000;
        
        // score control
        // this.scoreArray = [0, 700, 1670, 0, 0, 0, 4473, 7000]; // keep track of level threshold
        this.scoreArray = [0, 100, 200, 300, 400, 500, 600, 700, 800]; // tester track
        this.trueScore = 0 ;
        this.level = 1;
        this.levelMax = 9;
        this.fox_sprite = ['fox1','fox2','fox3','fox4','fox5','fox6','fox7','fox8','fox9'];
        this.run = this.fox_sprite[0] + '_run';        
        if (!bgMusic.isPlaying){
            bgMusic = this.sound.add(`${this.fox_sprite[this.level - 1]}_ost`, {volume: bg_volume, loop: true});
            bgMusic.play();
        }
        
        this.scoreTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                // this.score += 1;
                // this.trueScore += 1;
                this.trueScore += Math.floor(this.scoreTimer.getOverallProgress() * 5 * this.SCORE_MULTIPLIER);
            },
            loop: true
        });
        
        this.backgroundImage = this.add.tileSprite(0, 0, game.config.width, game.config.height, `${this.fox_sprite[this.level - 1]}_bg`).setOrigin(0).setDepth(-99999).setScale(1,1.4);

        // create player sprite
        this.fox = this.physics.add.sprite(game.config.width / 5, game.config.height - 3 * tileSize + 22, this.fox_sprite[this.level - 1]).setOrigin(1);

        // make ground tiles group (actual ground)
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'tile_block').setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        // pseudo ground
        this.groundScroll = this.add.tileSprite(0, game.config.height-tileSize, game.config.width, tileSize, `${this.fox_sprite[this.level - 1]}_tile`).setOrigin(0);

        // add physics collider
        this.physics.add.collider(this.fox, this.ground);

        // add obstacles
        // set up barrier group and add first barrier to kick things off
        this.obstacles = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        
        this.obstacleClock = this.time.addEvent({
            delay: 3000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '50px',
            strokeThickness: 3,
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
        };
        this.scoreText = this.add.text(69, 54, this.trueScore + 'm', scoreConfig);
        

        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.gamePaused = false;
        this.gameOver = false;
        
        this.add.image(0,0,'dream_border').setOrigin(0).setDepth(9999999);
    } // end of create()


    spawnObstacle() {
        if (!this.gamePaused){
            this.obstacle_sprite = ['rock', 'hole', 'spike'];
            let obstacle = new Obstacle(this, this.obstacleSpeed, this.obstacle_sprite[Math.floor(Math.random() * 3)]);     // create new obstacle
            obstacle.x += Phaser.Math.Between(0,1000);
            obstacle.x *= Phaser.Math.Between(1,2);
            obstacle.setDepth(-999);
            if((this.prevObstacle - obstacle.x >= this.obstacleSpreadMin || this.prevObstacle - obstacle.x <= this.obstacleSpreadMax) ||
            (this.prevObstacle - obstacle.x >= -1000 || this.prevObstacle - obstacle.x <= 500)){
                console.log(`Canceled spawn @ ${obstacle.x}px Prev: ${this.prevObstacle}px`);
                console.log(`Res: ${this.prevObstacle - obstacle.x}`);
                this.prevObstacle = undefined;
                obstacle.destroy();
                return;
            }
            console.log(`Spawned in ${this.obstacleClock.delay}s @ ${obstacle.x}px Prev: ${this.prevObstacle}px`);
            console.log(`Res: ${this.prevObstacle - obstacle.x}`);
            this.prevObstacle = obstacle.x;
            this.prevObstacle = obstacle.x;
            this.obstacles.add(obstacle);
        }
    }


    update(){
        if(!this.gamePaused && !this.gameOver){
            this.backgroundImage.tilePositionX += this.SCROLL_SPEED;
            this.groundScroll.tilePositionX += this.SCROLL_SPEED;
            
            // this.clock.delay = Math.ceil(Math.exp(Math.random()*(Math.log(this.obstacleMax)-Math.log(this.obstacleMin)))*this.obstacleMin);
            
            this.jumpUpdate();
                      
            if (this.level < this.levelMax && this.trueScore >= this.scoreArray[this.level]){
                // update level qualities
                console.log(`Level Up: ${this.level + 1} @ ${this.scoreArray[this.level]}m`);

                // this.SCORE_MULTIPLIER *= 1.2;
                this.level += 1;
                this.cameras.main.flash(3000);
                this.SCROLL_SPEED += 3;
                this.obstacles.clear();
                this.obstacleSpeed -= 150;
                this.obstacleClock.delay -= 220;
                this.obstacleSpreadMin -= 15;

                // update music
                this.tweens.add({        // fade out
                    targets: bgMusic,
                    volume: 0,
                    ease: 'Linear',
                    duration: 1500,
                });
                bgMusic = this.sound.add(`${this.fox_sprite[this.level - 1]}_ost`, {volume: 0, loop: true});                
                bgMusic.play();
                this.tweens.add({        // fade in
                    targets: bgMusic,
                    volume: bg_volume,
                    ease: 'Linear',
                    duration: 1500
                });
                
                // update bg
                // this.backgroundImage.texture = this.fox_sprite[this.level - 1] + '_bg';
                
                // update fox sprite
                this.fox.destroy();
                this.run = this.fox_sprite[this.level - 1] + '_run';
                this.fox = this.physics.add.sprite(game.config.width / 5, game.config.height - 3 * tileSize, this.fox_sprite[this.level - 1]).setOrigin(1);
                this.physics.add.collider(this.fox, this.ground);

                // this.groundScroll.destroy();
                // this.groundScroll = this.add.tileSprite(0, game.config.height-tileSize, game.config.width, tileSize, `${this.fox_sprite[this.level - 1]}_tile`).setOrigin(0);

                // i-frame buffer
                this.collisionOn = false;
                this.time.delayedCall(3000, () => {this.collisionOn = true;});
            }
            this.scoreText.text = this.trueScore + 'm';
        }

        if(!this.gamePaused && Phaser.Input.Keyboard.JustDown(keyP)){
            console.log("Game Paused");
            this.physics.world.gravity.y = 0;
            this.fox.body.velocity.y = 0;
            this.scoreTimer.paused = true;
            this.anims.pauseAll();
            bgMusic.pause();
            this.cameras.main.alpha = 0.5;
            this.gamePaused = true;
        }
        else if(this.gamePaused && Phaser.Input.Keyboard.JustDown(keyP)){
            console.log("Game Unpaused");
            this.physics.world.gravity.y = 3000;
            this.scoreTimer.paused = false;
            this.anims.resumeAll();
            bgMusic.resume();
            this.cameras.main.alpha = 1;
            this.gamePaused = false;
        }

        // check for collisions
        if (!collisionDebug && this.collisionOn){
            this.physics.world.collide(this.fox, this.obstacles, this.foxCollision, null, this);
        }   
    } // end of update()


    foxCollision() {
        console.log("Game Over");
        this.input.keyboard.enabled = false;
        this.gameOver = true; // turn off collision checking
        // this.sound.play('death', { volume: 0.3 });  // play death sound
       
        this.tweens.add({        // fade out
            targets: bgMusic,
            volume: 0,
            ease: 'Linear',
            duration: 400,
        });
        bgMusic = this.sound.add('death_ost', {volume: 0, loop: true});                
        bgMusic.play();
        this.tweens.add({        // fade in
            targets: bgMusic,
            volume: bg_volume,
            ease: 'Linear',
            duration: 1000
        });

        this.fox.alpha = 0;
        // death sequence
        let death = this.add.sprite(this.fox.x, this.fox.y, 'death').setOrigin(1);
        death.anims.play('death'); // explosion animation

        this.cameras.main.fadeOut(1500, 255, 255, 255);
        this.time.delayedCall(1500, () => {this.scene.start("gameOverScene");});
    }


    jumpUpdate(){
        // check if fox is grounded
	    this.fox.isGrounded = this.fox.body.touching.down;
	    // if so, we have jumps to spare
        if(Phaser.Input.Keyboard.JustDown(cursors.up) && this.fox.isGrounded){
            this.sound.play('jump_sfx', {volume: 2});
        }

	    if(this.fox.isGrounded) {
            this.fox.anims.play(this.run, true);
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
        }
        else{
            // this.fox.anims.play('jump', true);
        }
        if(!this.fox.isGrounded && Phaser.Input.Keyboard.DownDuration(cursors.down, 250)) {
	        this.fox.body.velocity.y = -1.3*this.JUMP_VELOCITY;
	    }
        // allow steady velocity change up to a certain key down duration
	    if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 250)) {
	        this.fox.body.velocity.y = this.JUMP_VELOCITY;
            this.jumping = true;
	    }
        // finally, letting go of the UP key subtracts a jump
	    if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumps--;
            this.jumping = false;            
        }
    }
}
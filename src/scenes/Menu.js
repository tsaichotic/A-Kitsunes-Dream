class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        this.sound.pauseOnBlur = false
        if (!bgMusic.isPlaying){
            bgMusic = this.sound.add('menu_ost', {volume: bg_volume, loop: true});
            bgMusic.play();
        }
        this.input.keyboard.enabled = false;
        this.cameras.main.fadeIn(1500);
        this.time.delayedCall(0, () => {this.input.keyboard.enabled = true;});
        
        this.selected = 1;
        
        //title name
        let titleConfig = {
            fontFamily: 'Patricia',
            fontSize: '110px',
            color: '#FFFFFF',
            align: 'center'
        };
        this.titleText = this.add.text(game.config.width/4, game.config.height/4 + 100, 'Title', titleConfig).setOrigin(0.5);

        this.titleText.alpha = 0;

        this.add.tween({
            targets: this.titleText,
            y: {from: game.config.height/4 + 150, to: game.config.height/4 + 100},
            alpha: 1,
            ease: 'Linear',
            duration: 1500,
            delay: 2000
        });

        this.dreamBorder = this.add.image(0,0,'dream_border').setOrigin(0).setDepth(9999);
        this.dreamBorder.alpha = 0;
        this.add.tween({
            targets: this.dreamBorder,
            alpha: 1,
            ease: 'Linear',
            duration: 1500,
            delay: 3000
        });
        
        //start buttons
        this.optionGroup = this.add.group();
        this.optionOffset = 100;
        this.start = this.add.sprite(game.config.width/2 + this.optionOffset, game.config.height/4+100, 'start').setOrigin(0.5);
        this.start.alpha = 0

        this.add.tween({
            targets: this.start,
            alpha: {from: 0, to: 1},
            x: '+= 70',
            duration: 1500,
            delay: 3000,
            ease: 'Cubic'
        });

        // animation loading
        // fox run
        for (let i = 1; i <= 9; i++){
            this.anims.create({
                key: `fox${i}_run`,
                frames: this.anims.generateFrameNumbers(`fox${i}`, {start: 0, end: 4, first: 0}),
                frameRate: 10,
                repeat: -1
            });
        }
        
        // fox death
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('death', {start: 0, end: 6, first: 0}),
            frameRate: 10,
            repeat: 0
        });


        // For testing
        let facadeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#FACADE',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        let facadeDebug = this.input.keyboard.createCombo(['f','a','c','a','d','e'], {
            resetOnWrongKey: true,
            maxKeyDelay: 0,
            resetOnMatch: true,
            deleteOnMatch: true,
        });

        this.input.keyboard.on('keycombomatch', (facadeDebug) => {
            collisionDebug = !collisionDebug;
            if (collisionDebug){
                this.add.tween({
                    targets: this.add.text(game.config.width/2, game.config.height/4 + 100, 'Collisions off!', facadeConfig).setOrigin(0.5),
                    alpha: {from: 1, to: 0},
                    duration: 3000,
                    ease: 'Linear'
                });
            }
            else if (!collisionDebug){
                this.add.tween({
                    targets: this.add.text(game.config.width/2, game.config.height/4 + 100, 'Collisions on!', facadeConfig).setOrigin(0.5),
                    alpha: {from: 1, to: 0},
                    duration: 3000,
                    ease: 'Linear'
                });
            }
        });
    }

    update(){
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        if(Phaser.Input.Keyboard.JustDown(keyENTER)) {
            this.input.keyboard.enabled = false;
            this.tweens.add({        // fade out
                targets: bgMusic,
                volume: 0,
                ease: 'Linear',
                duration: 1500,
            });
            this.time.delayedCall(1500, () => {bgMusic.stop();});
            this.cameras.main.fadeOut(1500, 255, 255, 255);
            this.time.delayedCall(1500,() => {this.scene.start("playScene");});
        }
    }
}
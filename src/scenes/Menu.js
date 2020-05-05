class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        if (!bgMusic.isPlaying){
            bgMusic = this.sound.add('menu_ost', {volume: bg_volume, loop: true});
            bgMusic.play();
        }
        this.input.keyboard.enabled = false;
        this.cameras.main.fadeIn(1000);
        this.time.delayedCall(1500, () => {this.input.keyboard.enabled = true;});
        
        this.selected = 1;
        
        this.add.image(0,0,'menu_bg').setOrigin(0);

        //title name
        this.title = this.add.sprite(game.config.width/4 + 50, game.config.height/4 + 100, 'title').setScale().setOrigin(0.5,1);
        this.title.alpha = 0;
        this.add.tween({
            targets: this.title,
            y: {from: game.config.height/4 + 150, to: game.config.height/4 + 100},
            alpha: 1,
            ease: 'Linear',
            duration: 1500,
            delay: 1200
        });

        this.dreamBorder = this.add.image(0,0,'dream_border').setOrigin(0).setDepth(9999);
        this.dreamBorder.alpha = 0;
        this.add.tween({
            targets: this.dreamBorder,
            alpha: 0.7,
            ease: 'Linear',
            duration: 1500,
            delay: 1200
        });
        
        //start buttons
        this.optionGroup = this.add.group();
        this.optionOffset = 140;
        this.start = this.add.sprite(game.config.width/2 + this.optionOffset, game.config.height/4, 'start').setOrigin(0.5);
        this.option = this.add.sprite(game.config.width/2 + 2*this.optionOffset, game.config.height/4 + 100, 'option').setOrigin(0.5); //to be added
        this.optionGroup.addMultiple([this.start, this.option]);
        this.optionGroup.setAlpha(0);

        this.add.tween({
            targets: [this.start, this.option],
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
                frames: this.anims.generateFrameNames('fox_atlas', {
                    prefix: `fox${i}_sprite`,
                    start: 1,
                    end: 5,
                    suffix: '',
                    zeroPad: 0
                }),
                frameRate: 10,
                repeat: -1
            });
        }
        this.anims.create({
            key: `snooze`,
            frames: this.anims.generateFrameNames('fox_atlas', {
                prefix: `snooze`,
                start: 1,
                end: 5,
                suffix: '',
                zeroPad: 0
            }),
            frameRate: 6,
            yoyo: true,
            repeat: -1
        });
        this.snooze = this.add.sprite(game.config.width/4 + 15, game.config.height/2 + 100, 'fox_atlas', 'snooze1').setDepth(100).setOrigin(1);
        this.snooze.anims.play('snooze');
        
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
        this.collisionDebugText = this.add.text(3*game.config.width/4, 3*game.config.height/4, 'Collision are currently off!').setOrigin(0.5);
        this.collisionDebugText.alpha = 0;
        this.input.keyboard.on('keycombomatch', (facadeDebug) => {
            collisionDebug = !collisionDebug;
        });
    }

    update(){
        if (collisionDebug){
            this.collisionDebugText.alpha = 1;
        }
        else if (!collisionDebug){
            this.collisionDebugText.alpha = 0;
        }

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        if(this.input.keyboard.checkDown(cursors.up, 250)) {
            if(this.selected > 1) {
                this.selected--;
            }
            else {
                this.selected = 2;
            }
        }
        else if(this.input.keyboard.checkDown(cursors.down, 250)) {
            if(this.selected < 2) {
                this.selected++;
            }
            else {
                this.selected = 1;
            }
        }
        if(this.selected == 1) {
            this.start.setTint(0x135300).setScale(1.3);
            this.option.setTint().setScale();
        }
        else if(this.selected == 2) {
            this.start.setTint().setScale();
            this.option.setTint(0x135300).setScale(1.3);
        }

        if(Phaser.Input.Keyboard.JustDown(keyENTER)) {
            this.input.keyboard.enabled = false;
            if(this.selected == 1) {
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
            else if(this.selected == 2) {
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500,() => {
                    this.cameras.main.fadeIn(1);
                    this.input.keyboard.enabled = true;
                    this.scene.pause();
                    this.scene.launch("optionScene");
                    keyENTER.reset();
                });
            }
        }
    }
}
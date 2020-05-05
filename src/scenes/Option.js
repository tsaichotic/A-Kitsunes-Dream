class Option extends Phaser.Scene {
    constructor() {
        super("optionScene");
    }

    create() {
        this.cameras.main.fadeIn(1500);
        this.volume_array = [0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1];
        let optionTextConfig = {
            fontFamily: 'Bradley Hand',
            fontSize: '55px',
            color: '#0D7DB0',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        this.opBG = this.add.sprite(0, 0, 'option_bg').setOrigin(0);
        this.dreamBorder = this.add.image(0,0,'dream_border').setOrigin(0).setDepth(9999);

        this.add.sprite(game.config.width/2, 60, 'option').setOrigin(0.5).setScale(1.3);
        this.volume = this.add.sprite(game.config.width/6 - 5, game.config.height/4, 'volume').setOrigin(0,0.5).setScale(0.7);
        this.volumeText = this.add.text(game.config.width/6 + 770, game.config.height/4 + 15, `${Math.floor(bg_volume * 10)}` , optionTextConfig).setOrigin(0,0.5);
        this.fullscreen = this.add.sprite(game.config.width/6, 2*game.config.height/4, 'fullscreen').setOrigin(0,0.5).setScale(0.7);
        this.fullscreenText = this.add.text(game.config.width/6 + 750, game.config.height/4 + 175, `${this.scale.isFullscreen ? '✔' : '❌'}`, optionTextConfig).setOrigin(0,0.5);
        this.return = this.add.sprite(game.config.width/6 + 10, 3*game.config.height/4, 'return').setOrigin(0,0.5).setScale(0.7);

        cursors = this.input.keyboard.createCursorKeys();
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.selected = 1;
    }

    update(){
        if(this.input.keyboard.checkDown(cursors.up, 250)) {
            if(this.selected > 1) {
                this.selected--;
            }
            else {
                this.selected = 3;
            }
        }
        else if(this.input.keyboard.checkDown(cursors.down, 250)){
            if(this.selected < 3) {
                this.selected++;
            }
            else {
                this.selected = 1;
            }
        }

        if(this.selected == 1) {
            this.volume.setTint(0xABFFA6).setScale(1.3);
            this.fullscreen.setTint().setScale();
            this.return.setTint().setScale();
        }
        else if(this.selected == 2) {
            this.volume.setTint().setScale();
            this.fullscreen.setTint(0xABFFA6).setScale(1.3);
            this.return.setTint().setScale();
        }
        else if(this.selected == 3) {
            this.volume.setTint().setScale();
            this.fullscreen.setTint().setScale();
            this.return.setTint(0xABFFA6).setScale(1.3);
        }
        if(this.selected == 1){
            if(this.input.keyboard.checkDown(cursors.left, 250) && volPt > 0){
                volPt --;
                bg_volume = this.volume_array[volPt];
                bgMusic.volume = bg_volume;
            }
            else if(this.input.keyboard.checkDown(cursors.right, 250) && volPt < 10){
                volPt ++;
                bg_volume = this.volume_array[volPt];
                bgMusic.volume = bg_volume;
            }
            
        }

        else if(this.selected == 2){
            if(Phaser.Input.Keyboard.JustDown(keyENTER)){
                this.scale.isFullscreen ? this.scale.stopFullscreen() : this.scale.startFullscreen();
            }
            
        }
        else if(this.selected == 3){
            if(Phaser.Input.Keyboard.JustDown(keyENTER)){
                this.add.tween({
                    targets: this.cameras.main,
                    alpha: 0,
                    ease: 'Linear',
                    duration: 500
                });
                this.time.delayedCall(500,() => {
                    this.scene.resume("menuScene");
                    this.scene.stop();
                });
            }
        }
        this.volumeText.text = `${volPt}`;
        this.fullscreenText.text = `${this.scale.isFullscreen ? '✔' : '❌'}`;
    } // end of update
}
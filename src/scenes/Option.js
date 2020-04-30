class Option extends Phaser.Scene {
    constructor() {
        super("optionScene");
    }

    create() {
        this.cameras.main.fadeIn(1500);
        this.volume_array = [0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1];
        let optionTextConfig = {
            fontFamily: 'Bradley Hand',
            fontSize: '50px',
            color: '#0D7DB0',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        this.add.text(game.config.width/2, 50, 'Options', {fontSize: '100px'}).setOrigin(0.5);
        this.volume = this.add.text(game.config.width/6, game.config.height/4, `Volume  ${Math.floor(bg_volume * 10)}` , optionTextConfig).setOrigin(0,0.5);
        this.fullscreen = this.add.text(game.config.width/6, 2*game.config.height/4, `Fullscreen    ${this.scale.isFullscreen ? '✔' : '❌'}`, optionTextConfig).setOrigin(0,0.5);
        this.return = this.add.text(game.config.width/6, 3*game.config.height/4, 'Return to Menu', optionTextConfig).setOrigin(0,0.5);

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
            this.volume.setTint(0x1081e0).setScale(1.2);
            this.fullscreen.setTint().setScale();
            this.return.setTint().setScale();
        }
        else if(this.selected == 2) {
            this.volume.setTint().setScale();
            this.fullscreen.setTint(0x1081e0).setScale(1.2);
            this.return.setTint().setScale();
        }
        else if(this.selected == 3) {
            this.volume.setTint().setScale();
            this.fullscreen.setTint().setScale();
            this.return.setTint(0x1081e0).setScale(1.2);
        }
        switch(this.selected){
            case 1:{
                if(this.input.keyboard.checkDown(cursors.left, 250) && volPt > 0){
                    volPt --;
                    bg_volume = this.volume_array[volPt];
                }
                else if(this.input.keyboard.checkDown(cursors.right, 250) && volPt < 10){
                    volPt ++;
                    bg_volume = this.volume_array[volPt];
                }
                break;
            }

            case 2:{
                if(Phaser.Input.Keyboard.JustDown(keyENTER)){
                    this.isFullscreen ? this.scale.stopFullScreen() : this.scale.startFullScreen();
                }
                break;
            }

            case 3:{
                if(Phaser.Input.Keyboard.JustDown(keyENTER)){
                    this.add.tween({
                        targets: this.cameras.main,
                        alpha: 0,
                        ease: 'Linear',
                        duration: 500
                    });
                    this.time.delayedCall(500,() => {
                        this.scene.stop("optionScene");
                    });
                    break;
                }
            }
        }
        this.volume.text = `Volume  ${volPt}`;
        this.fullscreen.text = `Fullscreen    ${this.scale.isFullscreen ? '✔' : '❌'}`;
    } // end of update
}
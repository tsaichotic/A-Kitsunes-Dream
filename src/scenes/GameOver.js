class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    create() {
        // this.sound.pauseOnBlur = false
        this.selected = 1
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.input.keyboard.enabled = false;
        this.cameras.main.fadeIn(1500, 255, 255, 255);
        this.time.delayedCall(1000, () => {this.input.keyboard.enabled = true;});

        let gameOverConfig = {
            fontFamily: 'Bradley Hand',
            fontSize: '70px',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        let choiceConfig = {
            fontFamily: 'Bradley Hand',
            fontSize: '50px',
            color: '#0D7DB0',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        this.optionOffset = 70;
        this.gameOverText = this.add.text(game.config.width/2 + this.optionOffset, game.config.height/4, 'Game Over', gameOverConfig).setOrigin(0);
        this.restartText = this.add.text(game.config.width/2 + 2*this.optionOffset, game.config.height/4 + 70, 'Restart...', choiceConfig).setOrigin(0);
        this.returnMenuText = this.add.text(game.config.width/2 + 3*this.optionOffset, game.config.height/4 + 140, 'Main Menu...', choiceConfig).setOrigin(0);
        
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        
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
        else if(this.selected == 1) {
            this.restartText.setTint(0x1081e0).setScale(1.2);
            this.returnMenuText.setTint().setScale();
        }
        else if(this.selected == 2) {
            this.restartText.setTint().setScale();
            this.returnMenuText.setTint(0x1081e0).setScale(1.2);
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
                this.time.delayedCall(1500, () => {this.scene.start("playScene");})
            }
            if(this.selected == 2) {
                this.tweens.add({        // fade out
                    targets: bgMusic,
                    volume: 0,
                    ease: 'Linear',
                    duration: 1500,
                });
                this.time.delayedCall(1500, () => {bgMusic.stop();});
                this.cameras.main.fadeOut(1500);
                this.time.delayedCall(1500, () => {this.scene.start("menuScene");})
            }
        }
    }
}
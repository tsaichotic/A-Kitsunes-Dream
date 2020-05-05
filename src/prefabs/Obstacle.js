class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, atlas, texture) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width, game.config.height - 53, atlas, texture);
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add physics body
        this.setVelocityX(velocity);            // make it go!
        this.setImmovable();
        this.body.allowGravity = false;
        // this.tint = Math.random() * 0xFFFFFF;   // randomize tint
        this.scene = scene;
        this.velocity = velocity;
    }

    update() {
        // override physics sprite update()
        super.update();
        if(this.scene.gameOver || this.scene.gamePaused){
            this.setVelocityX(0);
        }
        else if(!this.scene.gamePaused){
            this.setVelocityX(this.velocity);
        }

        // destroy obstacle if it reaches the left edge of the screen
        if(this.x < -this.width) {
            this.destroy();
        }
    }
}
class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload(){

        this.load.path = "./assets/fox_sprites/";
        this.load.atlas('fox_atlas', 'fox_atlas.png', 'fox_atlas.json');

        this.load.path = "./assets/bg/";
        this.load.image('option_bg', 'option_bg.png');
        this.load.image('menu_bg', 'menu_bg.png');
        this.load.image('fox1_bg', 'meadow.png');
        this.load.image('fox2_bg', 'forest.png');
        this.load.image('fox3_bg', 'river.png');
        this.load.image('fox4_bg', 'earth.png');
        this.load.image('fox5_bg', 'volcano.png');
        this.load.image('fox6_bg', 'cloud.png');
        this.load.image('fox7_bg', 'light.png');
        this.load.image('fox8_bg', 'dark.png');
        this.load.image('fox9_bg', 'final.png');

        this.load.path = "./assets/tiles/";
        this.load.image('fox1_tile', 'meadow_tile.png');
        this.load.image('fox2_tile', 'forest_tile.png');
        this.load.image('fox3_tile', 'river_tile.png');
        this.load.image('fox4_tile', 'meadow_tile.png');
        this.load.image('fox5_tile', 'volcano_tile.png');
        this.load.image('fox6_tile', 'blank_tile.png');
        this.load.image('fox7_tile', 'blank_tile.png');
        this.load.image('fox8_tile', 'blank_tile.png');
        this.load.image('fox9_tile', 'blank_tile.png');
        this.load.image('blank_tile', 'blank_tile.png');

        this.load.path = "./assets/ost/";
        this.load.audio('menu_ost', 'I_Am_Different.mp3');
        this.load.audio('fox1_ost', 'Dreams_of_the_Brilliant.mp3');
        this.load.audio('fox2_ost', 'The_Long_Journey.mp3');
        this.load.audio('fox3_ost', 'Water_Spirit.mp3');
        this.load.audio('fox4_ost', 'Earth_Spirit.mp3');
        this.load.audio('fox5_ost', 'Fire_Spirit.mp3');
        this.load.audio('fox6_ost', 'Wind_Spirit.mp3');
        this.load.audio('fox7_ost', 'Days_of_Summer.mp3');
        this.load.audio('fox8_ost', 'Days_of_Winter.mp3');
        this.load.audio('fox9_ost', 'Into_The_Sky.mp3');
        this.load.audio('death_ost','Autumn_Rain.mp3')
        
        this.load.path = "./assets/misc/";
        this.load.image('title', 'title.png');
        this.load.image('fullscreen', 'fullscreen.png');
        this.load.image('start', 'start.png');
        this.load.image('option', 'option.png');
        this.load.image('volume', 'volume.png');
        this.load.image('return', 'return.png');
        this.load.image('tutorial', 'tutorial.png');
        this.load.atlas('obstacle', 'obstacles.png', 'obstacles.json');
        this.load.image('dream_border', 'dream_border.png');
        this.load.spritesheet('death', 'death_animation.png', {frameWidth: 96, frameHeight: 96, startFrame: 0, endFrame: 6});

        this.load.path = "./assets/sfx/";
        this.load.audio('jump_sfx', 'jump_sfx.wav');
        this.load.audio('death_sfx', 'death_sfx.wav');


        /* test loading bar buffer*/
        // this.load.image('background', 'images/tut/background.png');
        // for(var i =0;i<30;i++) {
		// 	this.load.image('background_'+i, 'images/tut/background.png');
		// };

        // loading bar frame
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(game.config.width / 4, game.config.height / 2, game.config.width / 2, 50);
        
        // loading... text
        var loadingText = this.make.text({
            x: game.config.width / 2 + 5,
            y: game.config.height / 2 - 30,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        // loading percent text
        var percentText = this.make.text({
            x: game.config.width / 2,
            y: game.config.height / 2 + 70,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        // loader
        this.load.on('progress', function (value) {
            // console.log(value);
            percentText.setText(parseInt(value * 100) + '%');
            
            // active loading bar
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(game.config.width/4 + 10, game.config.height/2 + 10, (game.config.width / 2 - 20) * value, 30);
        });

        // load tracking
        // this.load.on('fileprogress', function (file) {
        //     console.log(file.src);
        // });
        
        // destroy loading bar
        this.load.on('complete', function () {
            // console.log('complete');
            progressBar.destroy();
            progressBox.destroy();	
            loadingText.destroy();
            percentText.destroy();
        });
    }

    create() {
        this.scene.start("menuScene");
        bgMusic = this.sound.add('menu_ost', {volume: bg_volume, loop: true});
        bgMusic.play();
    }
}
////////////////////////////////////////////////////////////////////////////////////
// Created by Jolene Tsai in collaboration with Nathan Ma
// This game revolves around the story of the nine-tailed fox, the Kitsune.
// As the player advances into the game, the fox will change forms,
// and grow up to nine tails to signify the players progression.
////////////////////////////////////////////////////////////////////////////////////

"use strict";

// global variables
let cursors;
let currentScene = 0;
const SCALE = 0.5;
const tileSize = 30;

let config = {
  type: Phaser.AUTO,
  title: "Fox Runner",
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1100,
      height: 680,
  },
  physics:{
    default: 'arcade',
    arcade:{
      gravity: {y: 1000},
      debug: false
    }
  },
  scene: [Load, Menu, Option, Play, GameOver]
};

let game = new Phaser.Game(config);

// reserve some keyboard variables
let keyF, keyP, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyENTER;
let bgMusic;
let volPt = 5;
let bg_volume = 0.5;
let collisionDebug = false;
import Phaser, { Scene } from 'phaser'
import TitleScene from './scenes/TitleScene'
import MainScene from './scenes/MainScene';

const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth)
const DEFAULT_HEIGHT = window.innerHeight // any height you want
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT


const game = new Phaser.Game({
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 0 } }
    }
})
game.scene.add("TitleScene", TitleScene)
game.scene.add("MainScene", MainScene)

game.scene.start("TitleScene")
import { Scene } from "phaser"

export default class TitleScene extends Scene {
    preload() {

    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.add.text(screenCenterX, screenCenterY, "Hello World", { color: '#00ff00', align: 'center' }).setOrigin(.5, .5)
        this.startButton = this.add.text(screenCenterX, screenCenterY + 100, "START", { color: '#00ff00', align: 'center' }).setOrigin(.5, .5)
        this.startButton.setInteractive()
        this.startButton.on("pointerover", () => this.changeButtonColor(this.startButton, '#fcb103'))
        this.startButton.on("pointerout", () => this.changeButtonColor(this.startButton, '#00ff00'))
        this.startButton.on("pointerdown", this.start)
    }
    start() {
        this.scene.stop
        this.scene.start("MainScene")
    }

    changeButtonColor(btn, color) {
        btn.setStyle({ color: color })
    }
}
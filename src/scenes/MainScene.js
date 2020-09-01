// @ts-nocheck
import Phaser from "phaser"
import { Body } from "matter";

export default class MainScene extends Phaser.Scene {

    create() {
        // register needed variables
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        //create game objects
        this.ball = this.add.circle(screenCenterX, screenCenterY, 10, 0x00ff00, 1).setOrigin(.5, .5)
        this.playerPaddle = this.add.rectangle(30, screenCenterY, 10, 50, 0x00ff00, 1)

        // registering game objects in the physics system
        this.physics.add.existing(this.ball)
        this.physics.add.existing(this.playerPaddle, true)

        //use jsdocs to gain intellisense around the physics bodies
        /** @type {Phaser.Physics.Arcade.Body} */
        this.playerPaddleBody = this.playerPaddle.body
        /** @type {Phaser.Physics.Arcade.Body} */
        this.ballBody = this.ball.body

        // set physics properties
        this.ballBody.setBounce(1, 1)
        this.ballBody.setCollideWorldBounds(true, 1, 1)
        this.ballBody.setVelocity(200, 200)

        // set collider between paddles and ball for physics
        this.physics.add.collider(this.playerPaddle, this.ball, () => {
            this.playerPaddle.setFillStyle(this.getRandomColor(), 1)
            this.ball.setFillStyle(this.getRandomColor(), 1)
        });

        // create Input cursors
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {

        if (this.cursors.down.isDown) {
            this.playerPaddle.y += 5
        } else if (this.cursors.up.isDown) {
            this.playerPaddle.y -= 5
        }


        this.playerPaddleBody.updateFromGameObject()
    }

    getRandomColor() {
        let characters = '0123456789ABCDEF';
        let color = '0x';
        for (let i = 0; i < 6; i++) {
            color += characters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


}
// @ts-nocheck
import Phaser from "phaser"

export default class MainScene extends Phaser.Scene {

    create() {
        // register needed variables
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.movementSpeed = 5
        this.computerDecidedToMove = false

        //create game objects
        this.ball = this.add.circle(screenCenterX, screenCenterY, 10, 0x00ff00, 1).setOrigin(.5, .5)
        this.playerPaddle = this.add.rectangle(30, screenCenterY, 10, 50, 0x00ff00, 1)
        this.computerPaddle = this.add.rectangle(this.cameras.main.width - 30, screenCenterY, 10, 50, 0x00ff00, 1)

        // registering game objects in the physics system
        this.physics.add.existing(this.ball)
        // these are static bodies
        this.physics.add.existing(this.playerPaddle, true)
        this.physics.add.existing(this.computerPaddle, true)

        //use jsdocs to gain intellisense around the physics bodies
        /** @type {Phaser.Physics.Arcade.Body} */
        this.playerPaddleBody = this.playerPaddle.body
        /** @type {Phaser.Physics.Arcade.Body} */
        this.computerPaddleBody = this.computerPaddle.body
        /** @type {Phaser.Physics.Arcade.Body} */
        this.ballBody = this.ball.body

        // set physics properties
        this.ballBody.setBounce(1, 1)
        this.ballBody.setCollideWorldBounds(true, 1, 1)
        this.ballBody.setVelocity(-200, -200)

        // set collider between paddles and ball for physics
        this.physics.add.collider(this.playerPaddle, this.ball, () => {
            this.playerPaddle.setFillStyle(this.getRandomColor(), 1)
            this.ball.setFillStyle(this.getRandomColor(), 1)
            setTimeout(() => {
                this.computerDecidedToMove = true
            }, 3000);
        });
        this.physics.add.collider(this.computerPaddle, this.ball, () => {
            this.computerPaddle.setFillStyle(this.getRandomColor(), 1)
            this.ball.setFillStyle(this.getRandomColor(), 1)
            this.computerDecidedToMove = false
        });

        // create Input cursors
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {

        if (this.cursors.down.isDown) {
            this.playerPaddle.y += this.movementSpeed
        } else if (this.cursors.up.isDown) {
            this.playerPaddle.y -= this.movementSpeed
        }
        this.computerMove()

        this.playerPaddleBody.updateFromGameObject()
        this.computerPaddleBody.updateFromGameObject()
    }

    getRandomColor() {
        let characters = '0123456789ABCDEF';
        let color = '0x';
        for (let i = 0; i < 6; i++) {
            color += characters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    computerMove() {
        let diff = this.ball.y - this.computerPaddle.y
        if (Math.abs(diff) < 15 || !this.computerDecidedToMove) {
            return
        }
        if (diff > 0) {
            this.computerPaddle.y += this.movementSpeed
        } else if (diff < 0) {
            this.computerPaddle.y += -this.movementSpeed
        }

    }


}
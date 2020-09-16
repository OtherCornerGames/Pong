// @ts-nocheck
import Phaser from "phaser"

export default class MainScene extends Phaser.Scene {

    create() {
        // register needed variables
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.movementSpeed = 5
        this.ballSpeed = 200
        this.computerReactionTime = 3000
        this.acceleration = { x: 0, y: 0 }
        this.computerDecidedToMove = true

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
        this.ballBody.setVelocity(Math.random() > .5 ? 250 : -250, Math.random() > .5 ? 250 : -250)

        // set collider between paddles and ball for physics
        this.physics.add.collider(this.playerPaddle, this.ball, () => {
            this.playerPaddle.setFillStyle(this.getRandomColor(), 1)
            this.ball.setFillStyle(this.getRandomColor(), 1)
            this.increaseDifficulty()
            this.ballBody.setVelocity(this.ballSpeed, this.ballSpeed);
            setTimeout(() => {
                this.computerDecidedToMove = true
            }, this.computerReactionTime);
        });
        this.physics.add.collider(this.computerPaddle, this.ball, () => {
            this.computerPaddle.setFillStyle(this.getRandomColor(), 1)
            this.ball.setFillStyle(this.getRandomColor(), 1)
            this.increaseDifficulty()
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
    increaseDifficulty() {
        this.ballSpeed *= 1.1
        this.computerReactionTime -= 100
        this.movementSpeed = this.movementSpeed > 10 ? 10 : this.movementSpeed + 1
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
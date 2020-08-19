// @ts-nocheck
import Phaser from "phaser"
import { Body } from "matter";

export default class MainScene extends Phaser.Scene {

    create() {
        // register needed variables
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.computerPaddleVelocity = new Phaser.Math.Vector2(0, 0)
        this.computerReactionTime = 2000
        this.computerError = .4
        this.paddleHeight = 50
        this.paddleWidth = 10
        this.ballRadius = 10
        this.computerDecidedToMove = false

        //create game objects
        this.ball = this.add.circle(screenCenterX, screenCenterY, this.ballRadius, 0x00ff00, 1).setOrigin(.5, .5)
        this.playerPaddle = this.add.rectangle(30, screenCenterY, this.paddleWidth, this.paddleHeight, 0x00ff00, 1)
        this.computerPaddle = this.add.rectangle(this.cameras.main.width - 20, screenCenterY, this.paddleWidth, this.paddleHeight, 0x00ff00, 1)

        // registering game objects in the physics system
        this.physics.add.existing(this.ball)
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
        this.ballBody.setVelocity(200, 200)

        // set collider between paddles and ball for physics
        this.physics.add.collider(this.playerPaddle, this.ball, () => {
            this.ballBody.setVelocity()
            setTimeout(() => {
                this.computerDecidedToMove = true
            }, this.computerReactionTime)
        })
        this.physics.add.collider(this.computerPaddle, this.ball, () => this.computerDecidedToMove = false)

        // create Input cursors
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {

        if (this.cursors.down.isDown) {
            this.playerPaddle.y += 5
        } else if (this.cursors.up.isDown) {
            this.playerPaddle.y -= 5
        }

        this.computerDecision()

        this.playerPaddleBody.updateFromGameObject()
        this.computerPaddleBody.updateFromGameObject()
    }

    computerDecision() {
        if (!this.computerDecidedToMove) {
            return
        }
        let top = this.computerPaddle.y + this.paddleHeight / 2 - this.ballRadius
        let diff = this.ball.y - this.computerPaddle.y
        const aiSpeed = 4
        if (Math.abs(diff) < 15) {
            return
        }
        if (diff > 0) {
            this.computerPaddleVelocity.y = aiSpeed
            if (this.computerPaddleVelocity.y > 10) {
                this.computerPaddleVelocity.y = 10
            }
        } else if (diff < 0) {
            this.computerPaddleVelocity.y = -aiSpeed
            if (this.computerPaddleVelocity.y < -10) {
                this.computerPaddleVelocity.y = -10
            }
        }
        this.computerPaddle.y += this.computerPaddleVelocity.y
    }

}
import Phaser from 'phaser'
import globalVariables from '../Globals'

class Paddle extends Phaser.Sprite {
    constructor(game, x, y){
        super (game, x, y, 'paddle')

        this.spaceBarCoolDown = true

        this.game.physics.arcade.enableBody(this)
        this.body.immovable = true

        this.anchor.setTo(0.5, 0.5)

        this.beginSpaceCoolDown = this.beginSpaceCoolDown.bind(this)

    }

    update (){
        const leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        if (leftKey.isDown){
            this.movePaddleLeft(10)
        }

        const rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        if (rightKey.isDown){
            this.movePaddleRight(10)
        }

        const spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
            if (this.spaceBarCoolDown === true && spaceBar.isDown && leftKey.isDown){
                this.movePaddleLeft(300)
                this.beginSpaceCoolDown()
            }

            if (this.spaceBarCoolDown === true && spaceBar.isDown && rightKey.isDown){
                this.movePaddleRight(300)
                this.beginSpaceCoolDown()
            }

    }

    decreaseBoostCooldown(){
        globalVariables.boostCooldown -= 1
    }

    beginSpaceCoolDown(){

        this.spaceBarCoolDown = false

        const myInterval = setInterval(this.decreaseBoostCooldown, 50)

        setTimeout(() => {
            this.spaceBarCoolDown = true
            globalVariables.boostCooldown = 100
            clearInterval(myInterval)
        }, 5000)
    }

    movePaddleLeft(leftShift) {
        const minX = this.width / 2

            if (this.x > minX)
                if (this.x - leftShift < minX){
                    this.x = minX
                } else {
                    this.x -= leftShift
                }
            }


    movePaddleRight (rightShift) {

        const maxX = this.game.width - (this.width / 2)

        if (this.x < maxX)
            if (this.x + rightShift > maxX) {
                this.x = maxX
            } else {
                this.x += rightShift
            }

    }
}

export default Paddle

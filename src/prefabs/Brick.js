import Phaser from 'phaser'
import globalVariables from '../Globals'

const MOVE_LEFT = 'MOVE_LEFT'
const MOVE_RIGHT = 'MOVE_RIGHT'
const MOVE_UP = 'MOVE_UP'
const MOVE_DOWN = 'MOVE_DOWN'
const MOVE_NONE = 'MOVE_NONE'

class Brick extends Phaser.Sprite {
    constructor(game, x, y){
        super (game, x, y, 'brick')


        this.game.physics.arcade.enableBody(this)
        this.body.immovable = true

    }

    update(){
    if (globalVariables.bricksMove){
        this.moveBrick()
        }
    }

    movementDuration(){
        return (this.randomNumberBetween1andParam(5) * 1000)
    }

    moveBrick(){

        const verticalDirection = this.moveUpOrDown()
        const horizontalDirection = this.moveLeftOrRight()

        let verticalMovementAmount = 0

        if (verticalDirection === MOVE_DOWN || verticalDirection === MOVE_UP){
            verticalMovementAmount = 1
        }

        let horizontalMovementAmount = 0

        if (horizontalDirection === MOVE_LEFT || horizontalDirection === MOVE_RIGHT){
            horizontalMovementAmount = 1
        }

        const maxX = this.game.world.width - this.width

        if (horizontalDirection === MOVE_RIGHT){
            this.x = Math.min(this.x + horizontalMovementAmount, maxX)
        } else if (horizontalDirection === MOVE_LEFT){
            this.x = Math.max(0, this.x - horizontalMovementAmount)
        }

        if (verticalDirection === MOVE_UP) {
            this.y = Math.max(this.y - verticalMovementAmount, 30)
        } else if (verticalDirection === MOVE_DOWN) {
            this.y = Math.min(this.y + verticalMovementAmount, this.game.world.height - 200)
        }
    }

    moveUpOrDown(){
        let randomNumber = this.randomNumberBetween1andParam(3)

        let moveDirection = ''

        if (randomNumber === 1){
            moveDirection = MOVE_UP
        } else if (randomNumber === 2){
            moveDirection = MOVE_DOWN
        } else {
            moveDirection = MOVE_NONE
        }

        return moveDirection
    }

    moveLeftOrRight(){
        let randomNumber = this.randomNumberBetween1andParam(3)

        let moveDirection = ''

        if (randomNumber === 1){
            moveDirection = MOVE_LEFT
        } else if (randomNumber === 2){
            moveDirection = MOVE_RIGHT
        } else {
            moveDirection = MOVE_NONE
        }

        return moveDirection
    }

    randomNumberBetween1andParam(param){
        return Math.floor(Math.random() * Math.floor(param))
    }
}

export default Brick

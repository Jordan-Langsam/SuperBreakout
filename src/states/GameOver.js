import Phaser from 'phaser'
import audioManager from '../../audioManager'
import globalVariables from '../Globals'

export default class extends Phaser.State {
  init () {}

  preload () {
  }

  create () {

    const gameOverText = this.createText(this.game.world.width / 2, this.game.world.centerY, 'center', 'GAME OVER').anchor.set(0.5, 0.5)

    const highScoreText = this.createText(this.game.world.width / 2, this.game.world.centerY + 40, 'center', 'SCORE: ' + globalVariables.score).anchor.set(0.5)

    const tryAgainImage = this.game.add.image(this.game.world.width / 2, this.game.world.centerY + 120, 'tryAgain')
    tryAgainImage.anchor.set(0.5)
    tryAgainImage.scale.set(0.1, 0.1)

    tryAgainImage.inputEnabled = true
    tryAgainImage.events.onInputDown.add(this.replay, this)

    this.initMuteImage()

    // mute button
    this.muteButton = this.game.input.keyboard.addKey(Phaser.Keyboard.M)

    this.muteButton.onUp.add(this.muteOrUnmute, this)

    audioManager.stopAllSounds()

    audioManager.playSoundEffect(this.game, 'gameOver')
  }

  createText(x, y, align, name) {
    return (
        this.game.add.text(x, y, name, {
            font: '30px Arial',
            align: align,
            fill: 'red'
        })
    )
}

    replay(){

        this.resetGlobalVariables()
        this.state.start('Game')
    }

    resetGlobalVariables(){
        globalVariables.level = 1
        globalVariables.lives = 5
        globalVariables.forcePush = 1
        globalVariables.score = 0
    }

      // mute image
  initMuteImage(){
    this.muteImage = this.add.image(0, 0, 'mute')
    this.muteImage.scale.set(0.07, 0.07)
    this.muteImage.visible = globalVariables.mute
  }

  // mute or unmute
  muteOrUnmute(){
    audioManager.muteOrUnmute(this.game)
    this.muteButtonUpdateVisibility()
  }

  muteButtonUpdateVisibility(){
    this.muteImage.visible = globalVariables.mute
  }
}

import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'
import globalVariables from '../Globals'
import {clone} from 'lodash'
import { SoundManager } from 'phaser-ce';

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#EDEEC9'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  create () {
  }

  preload () {
    if (config.webfonts.length) {
      WebFont.load({
        google: {
          families: config.webfonts
        },
        active: this.fontsLoaded
      })
    }

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    // images
    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
    this.load.image('brick', './assets/images/JeffGoldblum.jpg')
    this.load.image('paddle', './assets/images/paddle.png')
    this.load.image('storyImage', './assets/images/story.png')
    this.load.image('skip', './assets/images/skipButton.png')
    this.load.image('ball', './assets/images/ball.jpg')
    this.load.image('tryAgain', './assets/images/tryAgain.png')
    this.load.image('mute', './assets/images/mute.png')

    // audio
    globalVariables.soundManager = new SoundManager(this.game)
    this.game.load.audio('epic-intro', '../assets/audio/bensound-epic.mp3')
    this.game.load.audio('elevatorMusic', '../assets/audio/ElevatorMusic.mp3')
    this.game.load.audio('coolStruttin', '../assets/audio/CoolStruttin.mp3')
    this.game.load.audio('boop1', '../assets/audio/Beep1.wav')
    this.game.load.audio('boop2', '../assets/audio/Beep2.wav')
    this.game.load.audio('failBuzzer', '../assets/audio/failBuzzer.mp3')
    this.game.load.audio('hyperdriveTrouble', '../assets/audio/hyperdriveTrouble.mp3')
    this.game.load.audio('victory', '../assets/audio/victory.mp3')
    this.game.load.audio('gameOver', '../assets/audio/gameOver.mp3')

    this.loadBackgroundImages()
  }

  loadBackgroundImages(){
    const images = globalVariables.backGroundImages

    for (let i = 0; i < images.length; i++){
      this.load.image(`backgroundImage${i}`, images[i])
    }
  }

  render () {
    if (config.webfonts.length && this.fontsReady) {
      this.state.start('Splash')
    }
    if (!config.webfonts.length) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}

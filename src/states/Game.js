/* globals __DEV__ */
import Phaser from 'phaser'
import lang from '../lang'
import globalVariables from '../Globals'
import Brick from '../prefabs/Brick'
import Paddle from '../prefabs/Paddle'
import Ball from '../prefabs/Ball'
import audioManager from '../../audioManager'

export default class extends Phaser.State {

  constructor(){
    super()
    this.pointsForForcePush = 0
    this.bounceSoundIndexToUse = 0
    this.resetPropertiesToDefault()
  }
  resetPropertiesToDefault(){
    this.ballStartingPosition = true
    this.ballIsFrozen = false
    globalVariables.boostCooldown = 100
  }

  init () {}
  preload () { }

  create () {
    this.pointsForForcePush = 0
    this.game.physics.arcade.checkCollision.down = false
    this.initMusic()
    this.setBackgroundImage ()
    this.initNavigationBarText ()
    this.initMuteImage()
    this.initBricks ()
    this.initPaddle()
    this.initBall()

    // force push button
    this.upArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)

    // pause button
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.P)

    this.pauseButton.onUp.add(this.pauseOrResume, this)

    // mute button
    this.muteButton = this.game.input.keyboard.addKey(Phaser.Keyboard.M)

    this.muteButton.onUp.add(this.muteOrUnmute, this)

    // skip to next level
    this.nextLevelButton = this.game.input.keyboard.addKey(Phaser.Keyboard.C)
    this.nextLevelButton.onUp.add(this.nextLevel, this)
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

  // nav bar text
  initNavigationBarText () {
      this.boostCooldown = this.createText(300, 0, 'left', 'Boost Cooldown: ' + globalVariables.boostCooldown + '%')
      this.scoreText = this.createText(40, 0, 'left', 'SCORE: ' + globalVariables.score)
      this.levelText = this.createText(0, 0, 'center', 'LEVEL: ' + globalVariables.level)
      this.livesText = this.createText(-40, 0, 'right', 'LIVES: ' + globalVariables.lives)
      this.forcePushText = this.createText(-150, 0, 'right', 'Force Pushes ' + globalVariables.forcePush)

      this.pauseText = this.createText(0, this.game.world.height / 2, 'center', `PRESS 'P' TO RESUME`)

    this.pauseText.visible = false
  }

  createText (xOffset, yOffset, align, text){
    return (
      this.game.add.text (xOffset, yOffset, text, {
        font: '18px Arial',
        boundsAlignH: align,
        fill: 'white'
      }).setTextBounds(0, 0, this.game.world.width, 0)
    )
  }

  // bricks
  initBricks () {
    this.bricks = this.game.add.group()
    this.generateBricks(this.bricks)
  }

  generateBricks (brickGroup) {

    const level = globalVariables.level

    // rows
    const rows = globalVariables.MAX_ROWS
    const horizontalPadding = 20
    const xStartingCoord = this.birck_xStartingCoord(horizontalPadding, rows)

    // colums
    const columns = globalVariables.MAX_COLUMNS
    const verticalPadding = 10
    const yStartingCoord = 50

    // create bricks with appropriate spacing
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < columns; y++) {
        const brick = new Brick(this.game,
          this.brick_xCoord(x, horizontalPadding, xStartingCoord),
          this.brick_yCoord(y, verticalPadding, yStartingCoord)
        )

        this.setScaleForBrick(brick)
        brickGroup.add(brick)
      }
  }
}

birck_xStartingCoord(horizontalPadding, rows){
  return  Math.round(
    (this.game.world.width / 2)
    -
    (rows * this.scaledBrickWidth()) + (horizontalPadding * (rows - 1)) / 2)
}

brick_xCoord(x, spacing, startingCoord){
  return startingCoord + (x * spacing) + (x * this.scaledBrickWidth())
}

brick_yCoord(y, spacing, startingCoord) {
  return startingCoord + (y * spacing) + (y * this.scaledBrickWidth())
}

setScaleForBrick(brick) {
  brick.scale.setTo(0.05, 0.01)
}

scaledBrickWidth () {
  return 32
}

scaledBrickHeight (){
  return 8
}

  //background image
  setBackgroundImage () {
    if (this.backgroundImage){
      this.backgroundImage.destroy()
    }

    this.backgroundImage = this.add.image(0, 0, `backgroundImage${globalVariables.level - 1}`)
    globalVariables.bricksMove = (globalVariables.level % 2 === 0)

    this.backgroundImage.width = window.innerWidth
    this.backgroundImage.height = window.innerHeight
  }

  // paddle
  initPaddle () {

    if (this.paddle){
      this.paddle.destroy()
    }

    const paddleHeight = 20
    const paddleWidth = 50

    this.paddle = new Paddle (this.game, this.game.world.centerX, this.game.world.height - 100)

    this.paddle.scale.setTo(0.15, 0.05)
    this.game.add.existing(this.paddle)
  }

  initBall(){
    if (this.ball){
      this.ball.destroy()
    }

    this.ball = new Ball (this.game)
    this.ball.scale.setTo(0.02, 0.02)
    this.game.add.existing(this.ball)
    this.ball.events.onOutOfBounds.add(this.handleLostLife, this)
    this.ballStartingPosition = true
  }

  releaseBall(){

    this.enterKey = this.game.input.keyboard.addKey
    (Phaser.Keyboard.ENTER)

    if (this.enterKey.isDown){
      this.ballStartingPosition = false
      this.ball.body.velocity.x = this.randomStartingXVelocity()
      this.ball.body.velocity.y = -400
    }
  }

  randomStartingXVelocity(){
      let randomNumber = Math.floor(Math.random() * 100)

      if (randomNumber % 2 === 0){
        randomNumber = -randomNumber
      }

      return randomNumber
  }

  update(){
    if (this.ballStartingPosition === true){
      this.ball.x = (this.paddle.x - this.ball.width / 2)
      this.ball.y = (this.paddle.y - 30)
      this.ball.body.velocity.x = 0
      this.ball.body.velocity.y = 0
      this.releaseBall()
    }

    if (this.upArrow.isDown && globalVariables.forcePush > 0 && this.ballIsFrozen === false){
      this.forcePushDecrement()
      this.game.time.events.repeat(0, 1, this.forceFreezeBall, this);
    }

    this.game.physics.arcade.collide(this.ball, this.bricks, this.hitBrick, null, this)

    this.game.physics.arcade.collide(this.ball, this.paddle, this.hitPaddle, null, this)

    this.boostCooldown.setText('Boost Cooldown: ' + globalVariables.boostCooldown + '%')
  }

  hitPaddle(){

    let deltaX = 0

    if (this.ball.x < this.paddle.x){
      deltaX = this.paddle.x - this.ball.x
      this.ball.body.velocity.x = -10 * deltaX
    } else if (this.ball.x > this.paddle.x){
      deltaX = this.ball.x - this.paddle.x
      this.ball.body.velocity.x = 10 * deltaX
    }
  }

  hitBrick(ball, brickCollide){
    this.bricks.forEach(brick => {
      if (brickCollide === brick){
        brick.kill()
        this.playDestroyBrickSound()
        this.scoreUpdate()
        if (this.bricks.countLiving() === 0){
          this.win()
        }
      }
    })
  }

  playDestroyBrickSound(){
    audioManager.playSoundEffect(this.game, globalVariables.bounceSoundEffects[this.bounceSoundIndexToUse])

    if (this.bounceSoundIndexToUse >= globalVariables.bounceSoundEffects.length - 1){
      this.bounceSoundIndexToUse = 0
    } else {
      this.bounceSoundIndexToUse++
    }
  }

  forceFreezeBall(){
    const nextXVelocity = this.ball.body.velocity.x * .1
    const nextYVelocity = this.ball.body.velocity.y * .1

    console.log('next y velocity', nextYVelocity)
    console.log('next x velocity', nextXVelocity)

    this.ball.body.velocity.x = nextXVelocity
    this.ball.body.velocity.y = nextYVelocity

    this.ballIsFrozen = true

    const sound = audioManager.playSoundEffectForDuration(this.game, 'hyperdriveTrouble')

    this.frozenTimeout = setTimeout(()=>{
      this.ball.body.velocity.x = this.ball.body.velocity.x / .1
      this.ball.body.velocity.y = this.ball.body.velocity.y / .1
      this.ballIsFrozen = false
      sound.destroy()
    }, 2000)
  }

  render () {
  }

  // music
  initMusic(){
    audioManager.stopAllSounds()
    audioManager.playSong(this.game, globalVariables.levelMusic[globalVariables.level - 1])
  }

  // score
  scoreUpdate(){
    globalVariables.score += 30
    this.pointsForForcePush += 30
    if (this.pointsForForcePush >= 100){
      this.forcePushIncrement()
      this.pointsForForcePush -= 100
    }

    this.scoreText.setText("SCORE: " + globalVariables.score)
  }

  // force push
  forcePushDecrement() {
    globalVariables.forcePush--
    this.forcePushText.setText('Force Pushes ' + globalVariables.forcePush)
  }

  forcePushIncrement(){
    globalVariables.forcePush++
    this.forcePushText.setText('Force Pushes ' + globalVariables.forcePush)
  }

  // win
  win() {
    globalVariables.level++
    if (globalVariables.level -1 === globalVariables.backGroundImages.length){
      this.state.start('Win')
    } else {

      this.levelText.setText('LEVEL: ' + globalVariables.level)
      this.resetPropertiesToDefault()
      this.create()
    }
  }

  nextLevel(){
    this.win()
  }

  // handle lost life
  handleLostLife(){
    globalVariables.lives--

    // game is over
    if (globalVariables.lives <= 0){
      this.gameOver()
    }

    audioManager.playSoundEffect(this.game, globalVariables.failureSoundEffects[0])
    this.livesText.setText('LIVES: ' + globalVariables.lives)
    this.ball.destroy()
    this.initBall()
  }

  // game over
  gameOver(){
    this.state.start('GameOver')
  }

  // pause or resume
  pauseOrResume(){
    this.game.paused = !this.game.paused

    if (this.game.paused){
      this.pauseText.visible = true
    } else {
      this.pauseText.visible = false
    }
  }
}

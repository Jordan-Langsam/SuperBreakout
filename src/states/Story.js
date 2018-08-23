import Phaser from 'phaser'
import globalVariables from '../Globals'
// import { Sound, SoundManager } from 'phaser-ce';
import audioManager from '../../audioManager'

export default class extends Phaser.State {
    init () { }
    preload () {

    }

    create() {
        this.initMusic()
        this.initOpeningCredits()
        this.initScrollText()
        this.initSkipButton()
        this.initMuteImage()

            // mute button
    this.muteButton = this.game.input.keyboard.addKey(Phaser.Keyboard.M)

    this.muteButton.onUp.add(this.muteOrUnmute, this)
    }

    initScrollText (){
        const width = 300
        const fontWidth = 30
        const totalWidth = width + fontWidth
        const textHeight = 4000
        this.scrollText = this.game.add.text(0, 0, this.scrollTextContent(), {
            font: `${fontWidth}px Arial`,
            fill: "#000000",
            align: 'center'
        })

        this.scrollText.x = (this.game.world.width / 2) - (width / 2)
        this.scrollText.y = this.game.world.height
        this.scrollText.wordWrap = true
        this.scrollText.wordWrapWidth = width
        this.scrollText.visible = false

        this.scrollTextFinishedAnimating = false
    }

    initOpeningCredits(){
        var style = { font: "65px Arial", fill: "#000000", align: "center" };
        this.storyBy = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Story by:\n Greg Fox", style);
        this.storyBy.anchor.set(0.5)
        this.storyBy.alpha = 0.1

        this.game.add.tween(this.storyBy).to({ alpha: 1 }, 5000, "Linear", true);
    }

      update(){
        if (this.storyBy.alpha === 1){
            this.storyBy.destroy()
        }
        if (!this.storyBy.exists  && this.scrollText.y > -4000){
            this.scrollText.visible = true
            // this.scrollText.y -= 0.5
            this.scrollText.y -= 20.5

        }

        if (!this.storyBy.exists && this.scrollText.y < -4000){
            this.scrollTextFinishedAnimating = true
        }
      }

      initSkipButton(){
        this.skipImage = this.add.image(this.game.world.width - 100, 0, 'skip')
        this.skipImage.scale.set(0.2, 0.2)
        this.skipImage.inputEnabled = true
        this.skipImage.events.onInputDown.add(this.skipIntro, this);
      }

      skipIntro(){
          this.state.start('Game')
      }

      scrollTextContent() {
          return (
              `Untitled: The Oslo Paradigm \n\n EARTH, 1997–In the waning days of the second Carter administration, the Venusian insurrection has been nearly squashed, but a small band of sentient porpoises is making its way toward the fragile capital of Earth’s last habitable landmass, Paraguay. Cloistered within their cumbersome mechs but gaining ground every day, the menacing mereswine will stop at nothing until the blueprints for New Terra Firma are in the greedy flippers of porpoise King Tony II. It is a dark time for the bipedal.

              “We can no longer fight a war on two fronts, Mr. President! The mechaporpoises will be at the outer wall of Asunción D.C. in a matter of days, and the surviving Venusian platoon have a mastery over spacetime and exhale chlorine gas. To make matters worse, they’re also fearsome martial artists,” General Reitzfeld barks.

              “My loyalty is where it’s always been, General,” the oily peanut farmer replies, “with the money. My donors need these wars to continue for another six months, or I can kiss my third term goodbye. I will not get drawn into a course of action that leads to these wars’ immediate conclusion.”

              “But sir, think of New Terra Firma! Think of your people!”

              “My people are the the men and manly women that fill my coffers, General. Don’t make me fire you from the army.”

              That night, the General plots the unthinkable. Could he bring himself to do it? Even for a cause as noble as New Terra Firma and the Americo-Paraguayan coalition? What would Linda say, if she were here? But Linda was not here. Linda... Three years next June. Why would she keep her illness from him, until it was too late? Had he been a cheat and a lout as a younger man, of course. But they were thirty years past that. He thinks back to Arizona, to Flagstaff. To the man he was. To the stable boy who showed him another life.

              The next day all but one were killed. All but the one for whom the Prophecy foretold..."`
          )
      }

      initMusic(){
            audioManager.playSong(this.game, 'epic-intro')
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

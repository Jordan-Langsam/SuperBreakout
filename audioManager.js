import Phaser from 'phaser'
import globalVariables from './src/Globals'

class audioManager {
    constructor(){
        this.song = null
        this.effect = null
    }
}

audioManager.playSong = (game, songToPlay) => {

    try {
        if (game === null || songToPlay === null){
            throw 'must have a game and a song'
        }
    } catch (err){
        console.log(err)
    }

    if (this.song && this.song.name === songToPlay){
        return
    }

    if (this.song){
        this.song.destroy()
    }

    this.song = game.add.audio(songToPlay)
    this.song.loop = true
    this.song.play()
}

audioManager.muteOrUnmute = (game) => {
    globalVariables.mute = !globalVariables.mute
    game.sound.mute = globalVariables.mute
}

audioManager.playSoundEffect = (game, soundEffect) => {
    this.effect = game.add.audio(soundEffect)
    this.effect.loop = false
    this.effect.play()
}

audioManager.stopAllSounds = () => {
    console.log('gettinghit')
    if (this.song){
        // console.log('shoulddestroysong')
        this.song.destroy()
        this.song = null
    }

    if (this.effect){
        this.effect.destroy()
        this.effect = null
    }
}

audioManager.playSoundEffectForDuration = (game, soundEffect) => {
    this.effect = game.add.audio(soundEffect)
    this.effect.loop = false
    this.effect.play()
    return this.effect
}

export default audioManager

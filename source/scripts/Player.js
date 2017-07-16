import * as Pixi from "pixi.js"
import Keyb from "keyb"

import {getVectorLength, getDirection} from "scripts/Geometry.js"
import {FRAME} from "scripts/Constants.js"
import Bullet from "scripts/Bullet.js"
import Scene from "scripts/Scene.js"
import Text from "scripts/Text.js"
import Jukebox from "scripts/Jukebox.js"

const FRICTION = 0.75
const FRICTION_FALLTIME = 15 // in ticks (=1/60 of a second)
const MOVING_RISETIME  = 5 // in ticks (=1/60 of a second)
const GUN_COOLDOWN = 150 // in milliseconds

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
const PLAYER_TEXTURE = Pixi.Texture.from(require("images/HeartyFist.png"))
const PLAYER_TEXTURE2 = Pixi.Texture.from(require("images/HeartyFist2.png"))
const PLAYER_TEXTURE3 = Pixi.Texture.from(require("images/HeartyFist3.png"))

const DEATH_SOUND = new Audio(require("sounds/death.wav"))
const HEARTGRAB_SOUND = new Audio(require("sounds/heartgrab.wav"))
//const SPLATTER_SOUND = new Audio(require("sounds/splatter.wav"))
const GAINUP_SOUND = new Audio(require("sounds/HeartFanfare.wav"))

const VOICE_SOUNDS = [
    new Audio(require("sounds/voice-3.wav")),
    new Audio(require("sounds/voice-4.wav")),
    new Audio(require("sounds/voice-5.wav")),
    new Audio(require("sounds/voice-6.wav")),
    new Audio(require("sounds/voice-7.wav")),
    new Audio(require("sounds/voice-8.wav")),
    new Audio(require("sounds/voice-9.wav")),
    new Audio(require("sounds/voice-10.wav")),
]

export default class Player extends Pixi.Sprite {
    constructor() {
        super(PLAYER_TEXTURE)

        // These are hardcoded to spawn
        // the player in a good spot
        // on the level. Eventually
        // refactor this to read from
        // the level data like the baddies.
        this.position.x = 108
        this.position.y = 96

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.speed = 3

        // Calculate the desired force
        // magnitudes to match target
        // 0-to-Max speed times
        this.friction  = this.speed / FRICTION_FALLTIME
        this.moveForce = this.speed / MOVING_RISETIME + this.friction

        // The velocity will be defined
        // as a point, which is a tuple
        // with x and y coordinates. :]
        this.velocity = new Pixi.Point()

        this.ripHeart = 0
        this.maxhearts = 15
        this.hearts = 15

        this.gun = {
            // This is the duration of
            // time until the gun can shoot
            // another shot. This time is
            // in milliseconds.
            cooldown: 0,
        }
        this.aimAngle = 0
        this.addChild(this.gun.sprite = new Gun())
    }
    update(delta) {
        if(this.ripHeart > 0){
            this.animateHeartRipper(delta)
        }
        else{
            if(this.isDead) {
                this.spinWhenDead(delta)
            } else {
                this.move(delta)
                this.gun.sprite.update(delta)
                this.shoot(delta)
                this.heartbeat()
            }
        }
    }
    move(delta) {
        // Movement from input.
        var movement = {x: 0, y: 0}
        if(Keyb.isDown("W")) {
            movement.y = -1
        }
        if(Keyb.isDown("S")) {
            movement.y = +1
        }
        if(Keyb.isDown("A")) {
            movement.x = -1
        }
        if(Keyb.isDown("D")) {
            movement.x = +1
        }
        // Normalize the unit vector
        var norm = getVectorLength(movement.x, movement.y)
        if(norm > 0) {
            movement.x /= norm
            movement.y /= norm
        }

        // Dynamic velocity assignment
        // Player moving force
        this.velocity.x += movement.x * this.moveForce * delta.f
        this.velocity.y += movement.y * this.moveForce * delta.f
        // Friction-based deceleration
        // Get velocity length to normalize a directional unit vector
        var speed = getVectorLength(this.velocity.x, this.velocity.y)
        // The friction force points
        // opposite the current
        // velocity at a fixed
        // magnitude of this.friction
        if(speed > 0){
            if(speed > this.friction * delta.f) {
                this.velocity.x -= (this.velocity.x / speed) * this.friction * delta.f
                this.velocity.y -= (this.velocity.y / speed) * this.friction * delta.f
            } else {
                this.velocity.x = 0
                this.velocity.y = 0
            }
        }
        // Cap the speed at the max speed
        if(speed > this.speed) {
            this.velocity.x *= (this.speed / speed)
            this.velocity.y *= (this.speed / speed)
        }

        if(this.parent && this.parent.map) {
            this.parent.map.handlePotentialCollisions(this.position, this.velocity)
        }

        // Translation of position by velocity.
        this.position.x += this.velocity.x * delta.f
        this.position.y += this.velocity.y * delta.f

        this.position.x = Math.round(this.position.x)
        this.position.y = Math.round(this.position.y)
    }
    shoot(delta) {
        if(this.gun.cooldown > 0) {
            this.gun.cooldown -= delta.ms
        }

        // If the user is holding the shoot key...
        if(Keyb.isDown("<space>") || mouse.isDown
        || Keyb.isDown("<up>") || Keyb.isDown("<down>")
        || Keyb.isDown("<left>") || Keyb.isDown("<right>")) {
            // And the gun has cooled down...
            if(this.gun.cooldown <= 0) {
                // Then heat up the gun again!
                this.gun.cooldown = GUN_COOLDOWN

                // Are we low on hearts?
                var desperation = false
                if(this.hearts < 5){
                    desperation = true
                }

                // And fire a shot.
                if(this.parent != undefined) {
                    this.parent.addChild(new Bullet({
                        position: {x: this.position.x+9, y: this.position.y},
                        direction: this.aimAngle,
                        power: desperation
                    }), 0)
                }

                // Lose a heart.
                this.loseHeart()
            }
        }
    }
    animateHeartRipper(delta){
        this.ripHeart+=1
        // Kneeling
        if(this.ripHeart == 5){
            this.texture = PLAYER_TEXTURE3
        }
        // Grabbing
        if(this.ripHeart == 20){
            this.texture = PLAYER_TEXTURE2
            // play crunching, grabbing sound
            HEARTGRAB_SOUND.currentTime = 0
            HEARTGRAB_SOUND.volume = 0.1
            HEARTGRAB_SOUND.play()
        }
        // Ripping
        if(this.ripHeart == 60){
            this.texture = PLAYER_TEXTURE3
            // Play ripping, gushing sound
            /*
            SPLATTER_SOUND.currentTime = 0
            SPLATTER_SOUND.volume = 0.1
            SPLATTER_SOUND.play()*/
        }
        // Displaying
        if(this.ripHeart == 80){
            this.texture = PLAYER_TEXTURE
            // Play powerup sound
            // Show beating heart above your hand
            this.heldHeart = new DisplayHeart(this.position)
            this.parent.addChild(this.heldHeart, 0)
            // GAINUP_SOUND.currentTime = 0
            // GAINUP_SOUND.volume = 0.1
            // GAINUP_SOUND.play()
            // RIP GAINUP_SOUND

            var VOICE = VOICE_SOUNDS[Math.floor(Math.random() * VOICE_SOUNDS.length)]
            VOICE.currentTime = 0
            VOICE.volume = 0.2
            VOICE.play()
        }
        // Beating
        if(this.ripHeart > 80){
            this.heldHeart.scale.x = 1.5 - 0.3 * Math.sin( 4*(6.283/120) * (this.ripHeart - 80) )
            this.heldHeart.scale.y = 1.5 - 0.3 * Math.sin( 4*(6.283/120) * (this.ripHeart - 80) )
        }
        // Finishing
        if(this.ripHeart == 200){
            this.texture = PLAYER_TEXTURE
            this.ripHeart = 0
            this.parent.removeChild(this.heldHeart)
            this.gainHeart(5)
            this.maxhearts += 5
        }
    }
    heartbeat(){
        if(!!Jukebox.currentMusic) {
            if(this.hearts < 10){
                Jukebox.heartbeat.volume = 1.0 // This doesn't seem to be working.. :/
            }
            else{
                Jukebox.heartbeat.volume = 0.1
            }
        }
    }
    spinWhenDead(delta) {
        this.rotation += this.velocity * delta.f

        this.velocity *= 0.95

        if(this.velocity <= 0.0005) {
            this.velocity = 0
        }

        if(this.velocity === 0) {
            if(this.isTrulyDead != true) {
                this.isTrulyDead = true

                if(this.parent != undefined) {
                    var text = new Text("Hit R to restart")
                    text.position.y = this.position.y - (this.height * 1.5)
                    text.position.x = this.position.x
                    text.stack = 1000
                    this.parent.addChild(text)
                }
            }
        }

        if(Keyb.isJustDown("R", delta.ms)) {
            if(this.parent instanceof Scene) {
                this.parent.restartScene()
            }
        }
    }
    loseHeart(amount) {
        amount = amount || 1
        this.hearts -= amount
        if(this.hearts <= 0) {
            this.hearts = 0
            this.die()
        }
    }
    gainHeart(amount) {
        amount = amount || 1
        this.hearts += amount
    }
    die() {
        this.isDead = true
        this.tint = 0x333333
        this.gun.sprite.tint = 0x333333
        this.velocity = Math.PI / 4

        DEATH_SOUND.currentTime = 0
        DEATH_SOUND.volume = 0.1
        DEATH_SOUND.play()
    }
    get stack() {
        return 0
    }
}

const HEART_TEXTURE = Pixi.Texture.from(require("images/heart.png"))
const HEART_COLOR = 0xF86795

class DisplayHeart extends Pixi.Sprite {
    constructor(heroPos) {
        super(HEART_TEXTURE)

        this.position.x = heroPos.x-16
        this.position.y = heroPos.y-10

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.direction = 0

        this.rotation = 0

        this.tint = 0x0FFB5CD

        /* // Play Heart-Up Sound
        SHOOT_SOUND.volume = 0.1
        SHOOT_SOUND.currentTime = 0
        SHOOT_SOUND.playbackRate = Math.random() * 0.5 + 0.5
        SHOOT_SOUND.play()
        */
    }
    update(delta) {

        //this.pulse(delta)

    }
    pulse(delta) {
        this.tint = HEART_COLOR
        // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/3

        if(!!Jukebox.currentMusic) {
            var scale = this.getMusicalPulse(Jukebox.currentMusic.currentTime * 1000 % 2000)
            this.scale.x = scale
            this.scale.y = scale
        }
    }
    getMusicalPulse(time) {
        return 1 - (time <= 500 ? 0.2 * Math.sin(time * (6.283/500)) : 0)
    }
}

const GUN_TEXTURE = Pixi.Texture.from(require("images/ArmCannon.png"))

class Gun extends Pixi.Sprite {
    constructor() {
        super(GUN_TEXTURE)

        this.anchor.x = 0
        this.anchor.y = 0.5

        this.position.x = 12
        this.position.y = 0

        this.rotation = 0
    }
    update(delta) {
        var rotation = mouse.direction

        if(Keyb.isDown("<up>")) {
            rotation = Math.PI * 1.5
        }
        if(Keyb.isDown("<down>")) {
            rotation = Math.PI * 0.5
        }
        if(Keyb.isDown("<left>")) {
            rotation = Math.PI
        }
        if(Keyb.isDown("<right>")) {
            rotation = Math.PI * 2
        }

        this.parent.aimAngle = rotation

        if(rotation > Math.PI / +2
        || rotation < Math.PI / -2) {
            this.parent.scale.x = -1
            if(rotation > Math.PI / +2){
                this.rotation = (Math.PI / 2) - (rotation - Math.PI / 2)
            }
            else{
                this.rotation = (-Math.PI / 2) + (- Math.PI / 2 - rotation)
            }
        } else {
            this.parent.scale.x = +1
            this.rotation = rotation
        }
    }
}

var mouse = {direction: 0, position: {x: 0, y: 0}}

document.addEventListener("mousemove", function(event) {
    mouse.position.x = event.clientX
    mouse.position.y = event.clientY
    var center = {x: window.innerWidth / 2, y: window.innerHeight / 2}
    mouse.direction = getDirection(center, mouse.position)
})

document.addEventListener("mousedown", function(event) {
    mouse.isDown = true
})
document.addEventListener("mouseup", function(event) {
    mouse.isDown = false
})

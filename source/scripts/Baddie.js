import * as Pixi from "pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import {getVectorLength,getDistance} from "scripts/Geometry.js"
import {FRAME} from "scripts/Constants.js"
import Bullet from "scripts/Bullet.js"
import BaddieBullet from "scripts/BaddieBullet.js"
import Scene from "scripts/Scene.js"
import Text from "scripts/Text.js"

const SHOOT_SOUND = new Audio(require("sounds/shoot.wav"))
const DEATH_SOUND = new Audio(require("sounds/explosion.wav"))

const BADDIE_TEXTURE = Pixi.Texture.from(require("images/baddie.png"))
const WIN_SCREEN_TEXTURE = Pixi.Texture.from(require("images/win-screen.png"))

const GUN_COOLDOWN = 150 // in milliseconds
const COLLISION_RADIUS = 20

const SHORT_GUN_COOLDOWN = 50 // in milliseconds
const LONG_GUN_COOLDOWN = 750 // in milliseconds
const EVERY_NTH_SHOT = 2

const ROTATIONAL_FRICTION = 0.95

export default class Baddie extends Pixi.Sprite {
    constructor(protobaddie) {
        super(BADDIE_TEXTURE)

        this.position.x = protobaddie.position.x
        this.position.y = protobaddie.position.y

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.tint = 0xED9419

        this.hearts = 5

        this.isDead = false
        this.gun = {
            // This is the duration of
            // time until the gun can shoot
            // another shot. This time is
            // in milliseconds.
            cooldown: 0,

            // This is a counter of how
            // many times this gun has shot.
            // We use this to determine how
            // long to cooldown for, since
            // every fourth shot requires
            // a longer cooldown.
            shots: 0,

        }
        this.addChild(this.gun.sprite = new Blaster())

        this.velocity = new Pixi.Point()
    }
    update(delta) {
        // Translation of position by velocity.
        this.position.x += this.velocity.x * delta.f || 0
        this.position.y += this.velocity.y * delta.f || 0
        this.rotation += this.velocity.r * delta.f || 0

        // Deceleration from friction.
        this.velocity.r *= ROTATIONAL_FRICTION
        if(this.velocity.r <= 0.0005) {
            this.velocity.r = 0
        }

        if(this.isDead == false) {
            this.shoot(delta)
            this.gun.sprite.update(delta)
        }
        else{
            if(this.reaped != true
            && this.parent != undefined
            && this.parent.player != undefined) {
                if(this.touchingPlayer() && this.parent.player.ripHeart == 0){
                    this.parent.player.ripHeart = 1
                    this.reaped = true
                }
            }
        }
    }
    // MOVE FUNCTION GOES HERE
    shoot(delta) {
        if(this.gun.cooldown > 0) {
            this.gun.cooldown -= delta.ms
        }

        // If the user is holding the shoot key...
        if(true) {
            // And the gun has cooled down...
            if(this.gun.cooldown <= 0) {
                this.gun.shots += 1

                if(this.gun.shots % EVERY_NTH_SHOT == 0) {
                    this.gun.cooldown = LONG_GUN_COOLDOWN
                } else {
                    this.gun.cooldown = SHORT_GUN_COOLDOWN
                }

                // ...then fire the shot!
                if(this.parent != undefined) {
                    // SHOOT_SOUND.volume = 1 - Math.max(Math.min(getDistance(this.position, this.parent.player.position) / 300, 1), 0)
                    // SHOOT_SOUND.playbackRate = Math.random() * 0.5 + 0.5
                    // SHOOT_SOUND.currentTime = 0
                    // SHOOT_SOUND.play()

                    this.parent.addChild(new BaddieBullet({
                        position: this.position,
                        direction: this.gun.sprite.rotation,
                        distance: 200
                    }), 0)
                }
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
    touchingPlayer(){
        if(this.parent != undefined
        && this.parent.player != undefined) {
            return( (getDistance(this.parent.player.position,this.position)<COLLISION_RADIUS) )
        }
    }
    die() {
        this.isDead = true
        this.tint = 0x333333
        this.velocity.r = Math.PI / 4

        DEATH_SOUND.currentTime = 0
        DEATH_SOUND.volume = 0.1
        DEATH_SOUND.play()

        if(this.parent) {
            var alasEvilStillLurksInThisWorld
            this.parent.children.forEach((child) => {
                if(child instanceof Baddie) {
                    if(child.isDead != true) {
                        alasEvilStillLurksInThisWorld = true
                    }
                }
            })

            if(alasEvilStillLurksInThisWorld != true) {
                this.parent.hoorayEvilHasBeenVanquished = true

                if(this.parent.parent) {
                    this.parent.parent.addChild(new Pixi.Sprite(WIN_SCREEN_TEXTURE))
                }
                // var text = new Text("YOU WIN!", {color: 0xFC2E6C})
                // text.position.x = FRAME.WIDTH / 2
                // text.position.y = FRAME.HEIGHT / 2
                // this.parent.parent.addChild(text)
            }
        }
    }
    get stack() {
        return -5
    }
}

const BLASTER_TEXTURE = Pixi.Texture.from(require("images/gun.png"))

class Blaster extends Pixi.Sprite {
    constructor() {
        super(BLASTER_TEXTURE)

        this.anchor.x = 0
        this.anchor.y = 0.5

        this.rotation = 0
    }
    update(delta) {
        // Aim the shot!
        if(this.parent.parent != undefined
        && this.parent.parent.player != undefined) {
            var playerPos = this.parent.parent.player.position
            var targetRotation = Math.atan2(playerPos.y-this.parent.position.y,playerPos.x-this.parent.position.x)
            this.rotation += 0.05*(targetRotation-this.rotation)
        }
        // Flip the gun if necessary
        if(this.rotation > Math.PI / +2
        || this.rotation < Math.PI / -2) {
            this.scale.y = -1
        } else {
            this.scale.y = +1
        }
    }
}

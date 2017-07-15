import * as Pixi from "pixi.js"
import Keyb from "keyb"

import {getVectorLength} from "scripts/Geometry.js"
import {getDistance} from "scripts/Geometry.js"
import {FRAME} from "scripts/Constants.js"
import Bullet from "scripts/Bullet.js"
import Scene from "scripts/Scene.js"
import Text from "scripts/Text.js"

const FRICTION = 0.75
const FRICTION_FALLTIME = 15 // in ticks (=1/60 of a second)
const MOVING_RISETIME  = 5 // in ticks (=1/60 of a second)
const GUN_COOLDOWN = 150 // in milliseconds

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
const FOE_TEXTURE = Pixi.Texture.from(require("images/player.png"))

const DEATH_SOUND = new Audio(require("sounds/death.wav"))

export default class Foe extends Pixi.Sprite {
    constructor() {
        super(FOE_TEXTURE)

        this.position.x = FRAME.WIDTH / 4
        this.position.y = FRAME.HEIGHT / 4

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

        this.hearts = 5
    }
    update(delta) {
        if(this.isDead) {
            this.spinWhenDead(delta)
        } else {
            this.move(delta)
            this.collide(delta)
        }
    }
    move(delta) {
        // Movement from input.
        var movement = {x: 0, y: 0}
        if(Keyb.isDown("<up>") || Keyb.isDown("W")) {
            movement.y = +1
        }
        if(Keyb.isDown("<down>") || Keyb.isDown("S")) {
            movement.y = -1
        }
        if(Keyb.isDown("<left>") || Keyb.isDown("A")) {
            movement.x = +1
        }
        if(Keyb.isDown("<right>") || Keyb.isDown("D")) {
            movement.x = -1
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

        // Translation of position by velocity.
        this.position.x += this.velocity.x * delta.f
        this.position.y += this.velocity.y * delta.f
    }
    collide(delta) {
        if(this.parent != undefined) {
            this.parent.children.forEach((child) => {
                if(child.harm != undefined) {
                    if(getDistance(child.position,this.position) < 30 && child.speed>0){
                        this.loseHeart(child.harm)
                    }
                }
            })
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

                this.tint = 0x333333
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
        this.velocity = Math.PI / 4

        DEATH_SOUND.volume = 0.1
        DEATH_SOUND.currentTime = 0
        DEATH_SOUND.play()
    }
}
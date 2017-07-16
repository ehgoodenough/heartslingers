import * as Pixi from "pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import {getVectorLength} from "scripts/Geometry.js"
import {FRAME} from "scripts/Constants.js"
import Bullet from "scripts/Bullet.js"
import Scene from "scripts/Scene.js"

const BADDIE_TEXTURE = Pixi.Texture.from(require("images/player.png"))
const DEATH_SOUND = new Audio(require("sounds/explosion.wav"))

const ROTATIONAL_FRICTION = 0.95

export default class Baddie extends Pixi.Sprite {
    constructor(protobaddie) {
        super(BADDIE_TEXTURE)

        this.position.x = protobaddie.position.x
        this.position.y = protobaddie.position.y

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.tint = 0xFFD200

        this.hearts = 5

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
    }
    loseHeart(amount) {
        amount = amount || 1
        this.hearts -= amount
        if(this.hearts <= 0) {
            this.hearts = 0
            this.die()
        }
    }
    die() {
        this.isDead = true
        this.tint = 0x333333
        this.velocity.r = Math.PI / 4

        DEATH_SOUND.currentTime = 0
        DEATH_SOUND.volume = 0.1
        DEATH_SOUND.play()
    }
    get stack() {
        return -5
    }
}

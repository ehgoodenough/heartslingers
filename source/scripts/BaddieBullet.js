import * as Pixi from "pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

const FRICTION = 0.9
const GRAB_DISTANCE = 15
const GRAVITATE_DISTANCE = 50
const HARM_RADIUS = 20

const GRAB_SOUND = new Audio(require("sounds/pickup.wav"))

const SHARD_TEXTURE = Pixi.Texture.from(require("images/shard.png"))
const SHARD_COLOR = 0xFFF26B

import {getDistance} from "scripts/Geometry.js"
import Jukebox from "scripts/Jukebox.js"
import Player from "scripts/Player.js"

export default class BaddieBullet extends Pixi.Sprite {
    constructor(protobullet) {
        super(SHARD_TEXTURE)
        this.tint = SHARD_COLOR

        this.position.x = protobullet.position.x
        this.position.y = protobullet.position.y

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.direction = protobullet.direction || 0
        this.distance = protobullet.distance || 50

        this.speed = protobullet.speed || 5

        this.scale.x = 1.2
        this.scale.y = 1.2

        this.rotation = (protobullet.direction - Math.PI/2) || 0

        this.harm = 1

        // The duration of time
        // that this bullet has
        // been alive, in ms.
        this.time = 0

        this.velocity = new Pixi.Point()
    }
    update(delta) {
        this.time += delta.ms

        if(this.speed > 0) {
            this.move(delta)
            this.collideWithPlayer()
        } else {
            this.disappear()
        }

        this.position.x += this.velocity.x * delta.f || 0
        this.position.y += this.velocity.y * delta.f || 0

        this.velocity.x *= FRICTION
        if(this.velocity.x <= 0.05) {
            this.velocity.x = 0
        }

        this.velocity.y *= FRICTION
        if(this.velocity.y <= 0.05) {
            this.velocity.y = 0
        }
    }
    move(delta) {
        // After a bullet has
        // passed a given distance,
        // we begin to slow it down.
        if(this.speed > 0) {
            if(this.distance <= 0) {
                this.speed *= FRICTION
            }
        }

        // Since speed would
        // otherwise approach
        // zero but never reach
        // it, we help it along.
        if(this.speed <= 0.1) {
            this.speed = 0
        }

        this.distance -= this.speed

        this.velocity.x = Math.cos(this.direction) * this.speed
        this.velocity.y = Math.sin(this.direction) * this.speed
        this.velocity.r = (Math.PI / 32) * this.speed

        if(this.parent && this.parent.map) {
            this.parent.map.handlePotentialCollisions(this.position, this.velocity)
        }
    }
    disappear() {
        this.parent.removeChild(this)
    }
    collideWithPlayer() {
        if(this.parent != undefined
        && this.parent.player != undefined) {
            var distance = getDistance(this.position, this.parent.player.position)

            if(distance < HARM_RADIUS && this.parent.player.isDead != true) {
                this.parent.player.loseHeart(1)
                this.parent.removeChild(this)

                return // so i don't have to hear the grab sound

                // TODO : Make this a hurting sound
                GRAB_SOUND.currentTime = 0
                GRAB_SOUND.volume = 0.1
                GRAB_SOUND.play()
            }
        }
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
    get stack() {
        return -1
    }
}

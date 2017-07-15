import * as Pixi from "pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

const FRICTION = 0.9
const GRAB_DISTANCE = 15
const HARM_RADIUS = 20

const SHOOT_SOUND = new Audio(require("sounds/shoot.wav"))
const PICKUP_SOUND = new Audio(require("sounds/pickup.wav"))

const HEART_TEXTURE = Pixi.Texture.from(require("images/heart.png"))
const HEART_COLOR = 0xFC2E6C

import {getDistance} from "scripts/Geometry.js"
import Baddie from "scripts/Baddie.js"

export default class Bullet extends Pixi.Sprite {
    constructor(protobullet) {
        super(HEART_TEXTURE)

        this.position.x = protobullet.position.x
        this.position.y = protobullet.position.y

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.direction = protobullet.direction || 0
        this.distance = protobullet.distance || 50

        this.speed = protobullet.speed || 5

        this.rotation = Math.PI * 2 * Math.random()

        this.harm = 1

        this.startBeat = protobullet.start || 0

        // The duration of time
        // that this bullet has
        // been alive, in ms.
        this.time = 0

        SHOOT_SOUND.volume = 0.1
        SHOOT_SOUND.currentTime = 0
        SHOOT_SOUND.playbackRate = Math.random() * 0.5 + 0.5
        SHOOT_SOUND.play()
    }
    update(delta) {
        this.time += delta.ms

        if(this.speed > 0) {
            this.move(delta)
            this.collideWithBaddies()
        } else {
            this.pulseColor(delta)
            this.gravitateTowardsPlayer()
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

        this.distance -= this.speed * delta.f

        this.velocity = new Pixi.Point()
        this.velocity.x = Math.sin(this.direction) * this.speed * delta.f
        this.velocity.y = Math.cos(this.direction) * this.speed * delta.f

        if(this.parent && this.parent.tiledmap) {
            this.parent.tiledmap.handlePotentialCollisions(this.position, this.velocity)
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.rotation -= (Math.PI / 32) * this.speed
    }
    collideWithBaddies() {
        // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/4
        if(this.parent != undefined) {
            this.parent.children.forEach((child) => {
                if(child instanceof Baddie) {
                    if(getDistance(child.position,this.position) < HARM_RADIUS && child.hearts > 0){
                        child.loseHeart(this.harm)
                        this.speed = 0
                    }
                }
            })
        }
    }
    pulseColor(delta) {
        this.tint = HEART_COLOR
        // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/3
        var scale = this.heartPulse( (Date.now() - this.startBeat)%2000 )
        this.scale.x = scale
        this.scale.y = scale
    }
    heartPulse(time) {
      var h
      if(time > 500){
          h = 1
      }
      else{
          h = 1 - 0.2*Math.sin( time * (6.283/500) )
      }
      return(h)
    }
    gravitateTowardsPlayer() {
        if(this.parent != undefined
        && this.parent.player != undefined) {
            // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/5

            if(getDistance(this.position, this.parent.player.position) < GRAB_DISTANCE) {
                this.parent.player.gainHeart()
                this.parent.removeChild(this)

                PICKUP_SOUND.volume = 0.1
                PICKUP_SOUND.currentTime = 0
                PICKUP_SOUND.play()
            }
        }
    }
}

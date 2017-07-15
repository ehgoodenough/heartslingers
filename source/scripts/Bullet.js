import * as Pixi from "pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

const FRICTION = 0.9

const HEART_TEXTURE = Pixi.Texture.from(require("images/heart.png"))
const HEART_COLOR = 0xFC2E6C

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

        // The duration of time
        // that this bullet has
        // been alive, in ms.
        this.time = 0
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

        this.position.x += Math.sin(this.direction) * this.speed * delta.f
        this.position.y += Math.cos(this.direction) * this.speed * delta.f
    }
    collideWithBaddies() {
        // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/4
    }
    pulseColor(delta) {
        this.tint = HEART_COLOR
        // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/3
    }
    gravitateTowardsPlayer() {
        if(this.parent != undefined
        && this.parent.player != undefined) {
            // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/5
        }
    }
}

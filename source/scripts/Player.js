import * as Pixi from "pixi.js"
import Keyb from "keyb"

import {FRAME} from "scripts/Constants.js"
import Bullet from "scripts/Bullet.js"

const FRICTION = 0.75
const GUN_COOLDOWN = 150 // in milliseconds

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
const TEXTURE = Pixi.Texture.from(require("images/pixel.png"))

import {vecLength} from "scripts/Geometry.js"

export default class Player extends Pixi.Sprite {
    constructor() {
        super(TEXTURE)

        this.width = 18
        this.height = 18

        this.position.x = FRAME.WIDTH / 2
        this.position.y = FRAME.HEIGHT / 2

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.speed = 3

        // The velocity will be defined
        // as a point, which is a tuple
        // with x and y coordinates. :]
        this.velocity = new Pixi.Point()

        this.gun = {
            // This is the duration of
            // time until the gun can shoot
            // another shot. This time is
            // in milliseconds.
            cooldown: 0,
        }

        this.hearts = 100
    }
    update(delta) {
        this.move(delta)
        this.shoot(delta)
    }
    move(delta) {
        // Acceleration from input.
        var unitX = 0
        var unitY = 0
        if(Keyb.isDown("<up>") || Keyb.isDown("W")) {
            unitY = -1
        }
        if(Keyb.isDown("<down>") || Keyb.isDown("S")) {
            unitY = +1
        }
        if(Keyb.isDown("<left>") || Keyb.isDown("A")) {
            unitX = -1
        }
        if(Keyb.isDown("<right>") || Keyb.isDown("D")) {
            unitX = +1
        }
        // Normalize the unit vector
        var norm = vecLength(unitX,unitY)
        if(norm > 0) {
            unitX /= norm
            unitY /= norm
        }

        // Non-dynamic velocity assignment
        // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/1
        this.velocity.x = unitX * this.speed
        this.velocity.y = unitY * this.speed

        // Translation of position by velocity.
        this.position.x += this.velocity.x * delta.f
        this.position.y += this.velocity.y * delta.f

        // Deceleration of velocity.
        this.velocity.x *= FRICTION
        this.velocity.y *= FRICTION
    }
    shoot(delta) {
        if(this.gun.cooldown > 0) {
            this.gun.cooldown -= delta.ms
        }

        // If the user is holding the shoot key...
        if(Keyb.isDown("<space>")) {
            // And the gun has cooled down...
            if(this.gun.cooldown <= 0) {
                // Then heat up the gun again!
                this.gun.cooldown = GUN_COOLDOWN

                // And fire a shot.
                if(this.parent != undefined) {
                    this.parent.addChildAt(new Bullet({
                        position: this.position,
                        direction: 180 * Math.DEG_TO_RAD
                    }), 0)
                }

                // Lose a heart.
                this.loseHeart()
            }
        }
    }
    loseHeart(amount) {
        amount = amount || 1
        this.hearts -= amount
        if(this.hearts <= 0) {
            this.hearts = 0
            // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/7
        }
    }
    gainHeart(amount) {
        amount = amount || 1
        this.hearts += amount
    }
}

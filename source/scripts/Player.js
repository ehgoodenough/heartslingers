import * as Pixi from "pixi.js"
import Keyb from "keyb"

import {FRAME} from "scripts/Constants.js"
import Bullet from "scripts/Bullet.js"

const FRICTION = 0.75
const GUN_COOLDOWN = 150 // in milliseconds

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
const TEXTURE = Pixi.Texture.from(require("images/pixel.png"))

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
        // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/1
        if(Keyb.isDown("<up>") || Keyb.isDown("W")) {
            this.velocity.y = -1 * this.speed
        }
        if(Keyb.isDown("<down>") || Keyb.isDown("S")) {
            this.velocity.y = +1 * this.speed
        }
        if(Keyb.isDown("<left>") || Keyb.isDown("A")) {
            this.velocity.x = -1 * this.speed
        }
        if(Keyb.isDown("<right>") || Keyb.isDown("D")) {
            this.velocity.x = +1 * this.speed
        }

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
    loseHeart(damage) {
        damage = damage || 1
        this.hearts -= damage
        if(this.hearts <= 0) {
            this.hearts = 0
            // TODO: https://github.com/ehgoodenough/gmtk-2017/issues/7
        }
    }
}

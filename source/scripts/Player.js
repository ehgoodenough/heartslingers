import * as Pixi from "pixi.js"
import Keyb from "keyb"

import {FRAME} from "scripts/Constants.js"

const FRICTION = 0.75
const TEXTURE = Pixi.Texture.from(require("images/pixel.png"))

export default class Player extends Pixi.Sprite {
    constructor() {
        super(TEXTURE)

        this.width = 16
        this.height = 16

        this.position.y = FRAME.WIDTH / 2
        this.position.x = FRAME.HEIGHT / 2

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.speed = 3

        // The velocity will be defined
        // as a point, which is a tuple
        // with x and y coordinates. :]
        this.velocity = new Pixi.Point()
    }
    update(delta) {
        this.performMovement(delta)
    }
    performMovement(delta) {
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
}

import * as Pixi from "pixi.js"
import Keyb from "keyb"

const FRICTION = 0.75

export default class Player extends Pixi.Sprite {
    constructor() {
        var texture = Pixi.Texture.from(require("images/pixel.png"))
        super(texture)

        this.width = 16
        this.height = 16

        this.position.y = 16
        this.position.x = 16

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.speed = 5

        this.velocity = new Pixi.Point()
    }
    update(delta) {
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

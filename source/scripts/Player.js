import * as Pixi from "pixi.js"
import Keyb from "keyb"

export default class Player extends Pixi.Sprite {
    constructor() {
        var texture = Pixi.Texture.from(require("images/pixel.png"))
        super(texture)

        this.width = 32
        this.height = 32

        this.position.y = 32
        this.position.x = 32

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.speed = 5
    }
    update(delta) {
        if(Keyb.isDown("<up>") || Keyb.isDown("W")) {
            this.position.y -= this.speed * delta.f
        }

        if(Keyb.isDown("<down>") || Keyb.isDown("S")) {
            this.position.y += this.speed * delta.f
        }

        if(Keyb.isDown("<left>") || Keyb.isDown("A")) {
            this.position.x -= this.speed * delta.f
        }

        if(Keyb.isDown("<right>") || Keyb.isDown("D")) {
            this.position.x += this.speed * delta.f
        }
    }
}

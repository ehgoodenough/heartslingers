import * as Pixi from "pixi.js"

import Game from "scripts/Game.js"
import Player from "scripts/Player.js"
import {FRAME, STAGE} from "scripts/Constants.js"

export default class Scene extends Pixi.Container {
    constructor() {
        super()

        this.addChild(this.player = new Player())

        this.targetposition = new Pixi.Point()
    }
    update(delta) {
        this.children.forEach((child) => {
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })

        this.moveCamera()
    }
    moveCamera() {
        this.targetposition.x = -1 * (this.player.position.x - (FRAME.WIDTH / 2))
        this.targetposition.y = -1 * (this.player.position.y - (FRAME.HEIGHT * (2/3)))

        // this.position.x += (this.targetposition.x - this.position.x) / 25
        this.position.y += (this.targetposition.y - this.position.y) / 25
    }
    restartScene() {
        if(this.parent instanceof Game) {
            this.parent.scene = new Scene({
                // pass this the same
                // parameters that were
                // passed into this scene.
            })

            this.parent.addChild(this.parent.scene)
            this.parent.removeChild(this)
        }
    }
}

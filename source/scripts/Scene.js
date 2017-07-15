import * as Pixi from "pixi.js"

import Game from "scripts/Game.js"
import Player from "scripts/Player.js"
import Baddie from "scripts/Baddie.js"
import HeartBar from "scripts/HeartBar.js"
import {FRAME, STAGE} from "scripts/Constants.js"

export default class Scene extends Pixi.Container {
    constructor() {
        super()

        this.addChild(this.player = new Player())
        this.addChild(this.baddie = new Baddie())
        this.addChild(new HeartBar())
    }
    update(delta) {
        this.children.forEach((child) => {
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })
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

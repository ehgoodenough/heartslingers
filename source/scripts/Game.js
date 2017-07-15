import * as Pixi from "pixi.js"

import Scene from "scripts/Scene.js"
import {FRAME, STAGE} from "scripts/Constants.js"

export default class Game extends Pixi.Container {
    constructor() {
        super()

        // Instantiate the Pixi renderer.
        this.renderer = Pixi.autoDetectRenderer({
            width: FRAME.WIDTH, height: FRAME.HEIGHT,
            backgroundColor: FRAME.COLOR
        })

        // If we're still in the
        // development stage, then
        // expose this cheeky global
        // variable for debugging.
        if(STAGE === "DEVELOPMENT") {
            window.game = this
        }

        // Start the scene!!
        this.addChild(this.scene = new Scene())
    }
    update(delta) {
        this.children.forEach((child) => {
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })
    }
    render() {
        this.renderer.render(this)
    }
}

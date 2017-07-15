import * as Pixi from "pixi.js"

import Player from "scripts/Player.js"
import Text from "scripts/Text.js"
import {FRAME, STAGE} from "scripts/Constants.js"
import HeartBar from "scripts/HeartBar.js"

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer({
            width: FRAME.WIDTH, height: FRAME.HEIGHT,
            backgroundColor: 0x00BFFE
        })

        Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

        this.addChild(this.player = new Player())

        this.addChild(new HeartBar())

        // If we're still in the
        // development stage, then
        // expose this cheeky global
        // variable for debugging.
        if(STAGE === "DEVELOPMENT") {
            window.game = this
        }
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

import * as Pixi from "pixi.js"

import Player from "scripts/Player.js"
import Text from "scripts/Text.js"
import {WIDTH, HEIGHT} from "scripts/Constants.js"

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer({
            width: WIDTH, height: HEIGHT,
            backgroundColor: 0x00BFFE
        })

        Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

        this.addChild(this.player = new Player())
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

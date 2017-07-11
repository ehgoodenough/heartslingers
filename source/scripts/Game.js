import * as Pixi from "pixi.js"

import Player from "scripts/Player.js"

const WIDTH = 160 * 2
const HEIGHT = 90 * 2

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer({
            width: WIDTH, height: HEIGHT,
            backgroundColor: 0x00BFFE
        })

        Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

        this.addChild(new Player())
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

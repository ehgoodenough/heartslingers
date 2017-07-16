import * as Pixi from "pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import {FRAME} from "scripts/Constants.js"
import Text from "scripts/Text.js"

const UNDERLAY_TEXTURE = Pixi.Texture.from(require("images/heart-bar-underlay.png"))
const OVERLAY_TEXTURE = Pixi.Texture.from(require("images/heart-bar-overlay.png"))

const BAR_MARGIN = 8 // in pixels

export default class HeartBar extends Pixi.Container {
    constructor() {
        super(UNDERLAY_TEXTURE)

        this.position.x = BAR_MARGIN
        this.position.y = FRAME.HEIGHT - BAR_MARGIN

        this.addChild(this.underlay = new Pixi.Sprite(UNDERLAY_TEXTURE))
        this.addChild(this.overlay = new Pixi.Sprite(OVERLAY_TEXTURE))

        this.underlay.anchor.y = 1
        this.overlay.anchor.y = 1

        // TODO: replace this with an active counter of your hearts: 15/15 etc.
        this.addChild(this.text = new Text("YOUR LIFE IS YOUR AMMO"))
        this.text.position.x = FRAME.WIDTH / 2
        this.text.position.y = -16
    }
    update(delta) {
        this.resizeOverlays()
    }
    resizeOverlays() {
        if(OVERLAY_TEXTURE.hasLoaded == false) {
            return Pixi.Texture.EMPTY
        }

        var width = OVERLAY_TEXTURE.width * this.getHealthPercentage()
        var height = OVERLAY_TEXTURE.height

        this.overlay.texture = new Pixi.Texture(OVERLAY_TEXTURE, new Pixi.Rectangle(0, 0, width, height))
    }
    getHealthPercentage() {
        // If, for whatever reason,
        // we can't access the player,
        // then just return 100%.
        if(this.parent == undefined
        || this.parent.scene == undefined
        || this.parent.scene.player == undefined) {
            return 1
        }

        // Calculate the percentage.
        var percentage = this.parent.scene.player.hearts / this.parent.scene.player.maxhearts

        // Don't let the percentage fall below 0%.
        percentage = Math.min(Math.max(percentage, 0), 1)

        // Return the percentage
        return percentage
    }
}

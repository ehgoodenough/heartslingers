import * as Pixi from "pixi.js"

import Game from "scripts/Game.js"
import Map from "scripts/Map.js"
import Player from "scripts/Player.js"
import {FRAME, STAGE} from "scripts/Constants.js"

export default class Scene extends Pixi.Container {
    constructor() {
        super()

        this.addChild(this.map = new Map())
        this.addChild(this.player = new Player())

        this.map.baddies.forEach((baddie) => {
            this.addChild(baddie)
        })

        this.addChild(this.map.raisedLayer)
    }
    addChild(child) {
        super.addChild(child)
        this.children.sort(function(a, b) {
            if(a.stack < b.stack) {
                return -1
            } else if(a.stack > b.stack) {
                return +1
            } else {
                return 0
            }
        })
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
        var targetposition = new Pixi.Point()

        targetposition.x = this.player.position.x - (FRAME.WIDTH * (1/2))
        targetposition.y = this.player.position.y - (FRAME.HEIGHT * (1/2))

        // Keep the frame locked
        // within the confines of
        // the tiled map.
        if(targetposition.x < 0) {
            targetposition.x = 0
        }
        if(targetposition.y < 0) {
            targetposition.y = 0
        }
        if(this.map) {
            if(targetposition.x > this.map.width - FRAME.WIDTH) {
                targetposition.x = this.map.width - FRAME.WIDTH
            }
            if(targetposition.y > this.map.height - FRAME.HEIGHT) {
                targetposition.y = this.map.height - FRAME.HEIGHT
            }
        }

        // We're going to move
        // the entire scene in
        // the OPPOSITE direction
        // so as to keep the player
        // in the frame of the camera.
        targetposition.x *= -1
        targetposition.y *= -1

        // Interpolate to that position.
        this.position.x += (targetposition.x - this.position.x) / 10
        this.position.y += (targetposition.y - this.position.y) / 10

        if(this.position.x - targetposition.x < 0.1) {
            this.position.x = targetposition.x
        }
        if(this.position.y - targetposition.y < 0.1) {
            this.position.y = targetposition.y
        }
    }
    restartScene() {
        if(this.parent instanceof Game) {
            this.parent.scene = new Scene({
                // pass this the same
                // parameters that were
                // passed into this scene.
            })

            this.parent.addChildAt(this.parent.scene, 0)
            this.parent.removeChild(this)
        }
    }
}

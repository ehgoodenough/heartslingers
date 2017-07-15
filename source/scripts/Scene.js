import * as Pixi from "pixi.js"

import Game from "scripts/Game.js"
import Player from "scripts/Player.js"
import Baddie from "scripts/Baddie.js"
import HeartBar from "scripts/HeartBar.js"
import {FRAME, STAGE} from "scripts/Constants.js"

export default class Scene extends Pixi.Container {
    constructor() {
        super()

        this.addChild(this.tiledmap = new Tiledmap())
        this.addChild(this.player = new Player())
        this.addChild(this.baddie = new Baddie())
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
        targetposition.y = this.player.position.y - (FRAME.HEIGHT * (2/3))

        // Keep the frame locked
        // within the confines of
        // the tiled map.
        if(targetposition.x < 0) {
            targetposition.x = 0
        }
        if(targetposition.x > this.tiledmap.width - FRAME.WIDTH) {
            targetposition.x = this.tiledmap.width - FRAME.WIDTH
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

import tiledmap from "maps/1.json"

class Tiledmap extends Pixi.Graphics {
    constructor() {
        super()

        this.polygons = []
        tiledmap.layers.forEach((layer) => {
            layer.objects.forEach((object) => {
                if(!!object.polygon) {
                    this.polygons.push(new Pixi.Polygon(object.polygon.map((point) => {
                        return new Pixi.Point(object.x + point.x, object.y + point.y)
                    })))
                }
            })
        })

        this.beginFill(0x003648)
        this.polygons.forEach((polygon) => {
            this.drawPolygon(polygon)
        })
    }
    handlePotentialCollisions(position, velocity) {
        this.polygons.forEach((polygon) => {
            if(polygon.contains(position.x + velocity.x, position.y)) {
                velocity.x = 0
            }
            if(polygon.contains(position.x + velocity.x, position.y + velocity.y)) {
                velocity.y = 0
            }
        })
    }
}

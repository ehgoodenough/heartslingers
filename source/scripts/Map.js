import * as Pixi from "pixi.js"

import MAP from "maps/1.json"
import Baddie from "scripts/Baddie.js"

export default class Map extends Pixi.Graphics {
    constructor() {
        super()

        this.polygons = []
        this.baddies = []
        MAP.layers.forEach((layer) => {
            if(layer.type == "objectgroup") {
                layer.objects.forEach((object) => {
                    if(!!object.polygon) {
                        this.polygons.push(new Pixi.Polygon(object.polygon.map((point) => {
                            return new Pixi.Point(object.x + point.x, object.y + point.y)
                        })))
                    }
                    if(object.properties
                    && object.properties.isBaddie) {
                        this.baddies.push(new Baddie({
                            position: {x: object.x, y: object.y}
                        }))
                    }
                })
            }
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

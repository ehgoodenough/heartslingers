import * as Pixi from "pixi.js"

import MAP from "maps/1.json"

export default class Map extends Pixi.Graphics {
    constructor() {
        super()

        this.polygons = []
        MAP.layers.forEach((layer) => {
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

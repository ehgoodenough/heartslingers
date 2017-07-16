
export function getVectorLength(x,y) {
    return Math.sqrt(x*x + y*y)
}

// @name getDistance
// @param {Pixi.Point} p1
// @param {Pixi.Point} p2
// Gets the distance between two points.
export function getDistance(p1, p2) {
    var x = p1.x - p2.x
    var y = p1.y - p2.y
    return getVectorLength(x,y)
}

export function getDirection(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

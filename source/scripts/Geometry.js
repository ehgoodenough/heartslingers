
// @name getDistance
// @param {Pixi.Point} p1
// @param {Pixi.Point} p2
// Gets the distance between two points.
export function getDistance(p1, p2) {
    var x = p1.x - p2.x
    var y = p1.y - p2.y
    return vecLength(x,y)
}

export function vecLength(x,y) {
  return Math.sqrt(x*x + y*y)
}

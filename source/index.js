import Statgrab from "statgrab/do"
import Yaafloop from "yaafloop"

import Game from "scripts/Game.js"
var game = new Game()
document.getElementById("frame").appendChild(game.renderer.view)

var loop = new Yaafloop(function(delta) {
    game.update(delta)
    game.render()
})

import {STAGE} from "scripts/Constants.js"
import Jukebox from "scripts/Jukebox.js"

if(STAGE === "PRODUCTION") {
    var jukebox = new Jukebox([
        new Audio(require("music/procrastinator-elevator.mp3")),
    ])
}

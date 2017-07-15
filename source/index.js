import Statgrab from "statgrab/do"
import Yaafloop from "yaafloop"

import Game from "scripts/Game.js"
import Jukebox from "scripts/Jukebox.js"
import {STAGE} from "scripts/Constants.js"

Math.DEG_TO_RAD = Math.PI / 180
Math.RAD_TO_DEG = 180 / Math.PI

var game = new Game()

document.getElementById("frame").appendChild(game.renderer.view)

var loop = new Yaafloop(function(delta) {
    game.update(delta)
    game.render()
})

if(STAGE === "PRODUCTION") {
    var jukebox = new Jukebox([
        new Audio(require("music/Heart-of-Stone.mp3")),
        new Audio(require("music/PUT-YOUR-HEAART-INTO-IT.mp3")),
    ])
}

import * as Pixi from "pixi.js"

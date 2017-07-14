import * as Pixi from "pixi.js"

const DEFAULT_KERNING = 1
const DEFAULT_COLOR = 0xFFFFFF

const FONT_IMAGE = require("images/font.png")
const FONT_ATLAS = require("images/font.json")

export default class Text extends Pixi.Container {
    constructor(string, style) {
        super()

        this.string = string || ""
        this.style = style || {}

        getFont().then((font) => {
            this.font = font
        }).then(() => {
            this.createGlyphs()
            this.styleGlyphs()
            this.positionGlyphs()
        })
    }
    createGlyphs() {
        Array.from(this.string).forEach((character) => {
            this.addChild(new Pixi.Sprite(this.font[character]))
        })
    }
    styleGlyphs() {
        this.children.forEach((child) => {
            child.tint = this.style.color || DEFAULT_COLOR
        })
    }
    positionGlyphs() {
        for(var i = 0; i < this.children.length - 1; i += 1) {
            var a = this.children[i]
            var b = this.children[i + 1]

            b.position.x = a.position.x + a.width + DEFAULT_KERNING
        }

        var width = b.position.x + b.width
        var height = b.height

        this.children.forEach((child) => {
            child.position.x -= width / 2
        })
    }
}

var font = null
function getFont() {
    return new Promise((resolve) => {
        if(font) {
            resolve(font)
        } else {
            Pixi.BaseTexture.from(FONT_IMAGE).on("loaded", (texture) => {
                new Pixi.Spritesheet(texture, FONT_ATLAS).parse((textures) => {
                    for(var filename in textures) {
                        // Remove any underscores or file extensions.
                        var name = filename.replace(/(_|\.png|\.jpg)/g, "")

                        // Rename any predefined mapped names.
                        name = (name === "space" ? " " : name)
                        name = (name === "" ? " " : name)
                        name = (name === "wow" ? "!" : name)

                        // Save the texture under this friendly
                        // name. Delete the old texture that
                        // was indexed under the filename.
                        textures[name] = textures[filename]
                        delete textures[filename]
                    }

                    font = textures
                    resolve(textures)
                })
            })
        }
    })
}

const DEFAULT_VOLUME = 0.1

export default class Jukebox {
    static queue(music) {
        if(music instanceof Array == false) {
            music = new Array(music)
        }

        this.music = music

        this.music.forEach((music) => {
            music.volume = DEFAULT_VOLUME
            music.addEventListener("ended", (event) => {
                this.play()
            })
        })

        this.heartbeat = new Audio(require("music/Heartbeatss.mp3"))
        this.heartbeat.volume = DEFAULT_VOLUME
        this.heartbeat.loop = true

        this.play()
    }
    static play() {
        if(this.music.length > 0) {
            var music = this.music.shift()
            this.music.push(music)

            console.log("Playing", music.src)

            music.play()
            this.heartbeat.currentTime = 0

            this.currentMusic = music
        }
    }
}

// var currentTime = Date.now()
// var startTime = window.localStorage.getItem("startTime")
// if(startTime != undefined) {
//     music.currentTime = ((currentTime - startTime) / 1000) % music.duration
// } else {
//     window.localStorage.setItem("startTime", currentTime)
// }

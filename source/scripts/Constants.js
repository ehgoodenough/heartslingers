////////////////
// The Stage //
//////////////

import QueryString from "query-string"

var query = QueryString.parse(window.location.search)
query.stage = (query.stage || "").toUpperCase()

var stage = __STAGE__ || "DEVELOPMENT"

if(stage === "DEVELOPMENT") {
    if(query.stage !== "") {
        stage = query.stage
    }
}

export const STAGE = stage

/////////////////////
// The Dimensions //
///////////////////

export const WIDTH = 320
export const HEIGHT = 180

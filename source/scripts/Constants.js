////////////////
// The Stage //
//////////////

import QueryString from "query-string"

var query = QueryString.parse(window.location.search)
query.stage = query.stage ? query.stage.toUpperCase() : null

export const STAGE = query.stage || "DEVELOPMENT"

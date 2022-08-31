import "dotenv/config"

import { Client } from "discord.js"
import { config } from "./auxiliar/constants"
import { Util } from "./auxiliar/utils"
import { Timeouts } from "timeouts.ts-dev"
import { TokyoScript } from "@midowo/tokyo-script.ts"
import { Database } from "midb"
import express from "express"
import colors from "colors/safe"

const client = new Client({
    intents: config.intents,
    partials: config.partials
})

require("replit-dis-uniter")(client)

const util = new Util(client)
util.connect()

const db = new Database({})

const timeouts = new Timeouts({
    pulse: 15_000,
    db: db
})
timeouts._init()

const parser = new TokyoScript(client)

util.listen("./src/events").then(() => {
    console.log(colors.gray("Events loaded\n"))
    util.load("./src/commands").then(() => {
        util.handleSlashes()
        console.log(colors.gray("Source Loaded\n"))
    })
})

db.start()

client.login(config.token)

process.removeAllListeners("warning")

export { util, client, db, timeouts, parser }

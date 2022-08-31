import * as djs from "discord.js"
import { Event, TypeEvents } from "../../index"

export const event: Event<TypeEvents.Bot> = {
    name: "ready",
    code: (client: djs.Client) => {
        console.log(`Logged in as ${client.user!.tag}\n `)
    }
}

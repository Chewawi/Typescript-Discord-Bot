import * as djs from "discord.js"
import {
    Data,
    Event,
    SlashInteraction,
    TokyoInteraction,
    TypeEvents,
    Types
} from "../../index"
import { config } from "../auxiliar/constants"
import { util, db } from "../main"
import { Guild } from "../auxiliar/models"

export const event: Event<TypeEvents.Bot> = {
    name: "interactionCreate",
    code: async (interaction: TokyoInteraction | djs.CommandInteraction) => {
        const db = await Guild.findOne({ _id: interaction.guild!.id })
        if (interaction.type === djs.InteractionType.ApplicationCommand) {
            const ints = util.getCollection<Types.Slash>("slash")
            const int = ints.find(
                (i) => i.data.name === interaction.commandName
            )
            if (!int) return
            const d: Data<Types.Slash> = {
                int: interaction as SlashInteraction,
                client: interaction.client,
                util,
                config,
                idiom: db?.idiom || "en"
            }
            try {
                int.code(d)
            } catch (e) {
                interaction
                    .reply({
                        content: "¡Ops, Something internal went wrong!",
                        ephemeral: true
                    })
                    .catch((e) => null)
                console.log(e)
            }
        } else if (
            interaction.type !==
            djs.InteractionType.ApplicationCommandAutocomplete
        ) {
            const ints = util.getCollection<Types.Interaction>("interaction")
            const int = ints.find((i) => i._id === interaction.customId)
            if (!int) return
            const d: Data<Types.Interaction> = {
                int: interaction,
                client: interaction.client,
                util,
                config,
                idiom: db?.idiom || "en"
            }
            try {
                int.code(d)
            } catch (e) {
                console.log(e)
            }
        } else {
            const ints = util.getCollection<Types.Interaction>("interaction")
            const int = ints.find((i) => i._id === interaction.commandName)
            if (!int) return
            const d: Data<Types.Interaction> = {
                int: interaction,
                client: interaction.client,
                util,
                config,
                idiom: db?.idiom || "en"
            }
            try {
                int.code(d)
            } catch (e) {
                console.log(e)
            }
        }
    }
}

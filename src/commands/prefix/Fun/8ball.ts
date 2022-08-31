import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder
} from "discord.js"
import { Command, Types } from "../../../../index"
import { PrefixBuilder } from "../../../auxiliar/builders"
import { Errors } from "aux/constants"
import axios from "axios"

export const command: Command<Types.Prefix> = {
    data: new PrefixBuilder()
        .setNames("8ball", "eigthball")
        .setCategory("Fun")
        .setArgs(1),
    //@ts-ignore
    code: async (d) => {
        const args = d.args.join(" ")
        if (args.length < 1)
            return d.message.channel.send("Debes escribir al menos 1 carácter.")
        const encoded = encodeURIComponent(args)
        const response = await axios
            .get<Record<string, any>>(
                `https://api.miduwu.ga/json/8ball?text=${encoded}&idiom=${d.idiom}`
            )
            .catch((e) => null)
        if (!response?.data?.status) return d.util.throwError(d, ...Errors.api)

        const embed = new EmbedBuilder()
            .setColor(d.config.color)
            .setAuthor({
                name: d.message.author!.tag,
                iconURL: d.message.author!.displayAvatarURL()
            })
            .setTitle("8ball")
            .setThumbnail(`${d.client.user!.displayAvatarURL()}`)
            .addFields(
                //@ts-ignore
                {
                    name: d.util.look(
                        d.idiom,
                        "Pregunta",
                        "Question",
                        "Pergunta"
                    ),
                    value: `_ _ ${args}`
                },
                //@ts-ignore
                {
                    name: d.util.look(
                        d.idiom,
                        "Respuesta",
                        "Answer",
                        "Resposta"
                    ),
                    value: `_ _ ${response.data.data.response}`
                }
            )
            .setTimestamp()

        d.message.channel.send({ embeds: [embed] }).catch((e) => null)
    }
}

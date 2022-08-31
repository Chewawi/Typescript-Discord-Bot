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
    data: new PrefixBuilder().setNames("translate", "tr").setArgs(2),
    //@ts-ignore
    code: async (d) => {
        const args = d.args
        const encoded1 = encodeURIComponent(args[0])
        const encoded2 = encodeURIComponent(args[1])
        const res = await axios
            .get<Record<string, any>>(
                `https://api.miduwu.ga/json/translate?source=en&target=${encoded1}&text=${encoded2}`
            )
            .catch((e) => null)
        if (!res?.data?.status) return d.util.throwError(d, ...Errors.api)

        const embed = new EmbedBuilder()
            .setColor(d.config.color)
            .setAuthor({
                name: d.message.author!.tag,
                iconURL: d.message.author!.displayAvatarURL()
            })
            .setTitle(
                d.util.look(d.idiom, "Traducción", "Translate", "Tradução")
            )
            //@ts-ignore
            .setThumbnail(`${d.client.user!.displayAvatarURL()}`)
            .setDescription(`_ _ ${res.data.data.translated}`)
            .setTimestamp()
        //@ts-ignore
        d.message.channel.send({ embeds: [embed] })
    }
}

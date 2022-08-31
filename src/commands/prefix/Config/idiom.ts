import {
    ActionRowBuilder,
    SelectMenuBuilder,
    EmbedBuilder,
    ComponentType
} from "discord.js"
import { Command, Idioms, Types } from "../../../../index"
import { PrefixBuilder } from "../../../auxiliar/builders"
import { Errors, Emojis } from "../../../auxiliar/constants"
import { Guild } from "../../../auxiliar/models"

export const command: Command<Types.Prefix> = {
    data: new PrefixBuilder()
        .setNames("idiom", "language", "locale")
        .setExplan(
            "Cambia el idioma preferido del bot en el servidor.",
            "Change the preferred bot idiom in the server.",
            "Altere o idioma do bot preferido no servidor."
        )
        .setCooldown(7)
        .setPerms({ type: "user", list: ["ManageGuild"] }),
    code: async (d) => {
        const db = await Guild.findOne({ _id: d.message.guild!.id })
        const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
                .setCustomId("language")
                .setPlaceholder(
                    d.util.look(
                        d.idiom,
                        "Selecciona tu idioma.",
                        "Select your idiom.",
                        "Selecione sua lingua."
                    )
                )
                .addOptions([
                    {
                        label: "Español - (México).",
                        value: "es",
                        emoji: "🇲🇽",
                        description: "Traducción manual."
                    },
                    {
                        label: "English (U.S.A).",
                        value: "en",
                        emoji: "🇺🇸",
                        description: "Manual translation."
                    },
                    {
                        label: "Portugues (Brazil).",
                        value: "pt",
                        emoji: "🇧🇷",
                        description: "Tradução manual."
                    }
                ])
        )
        const embed = new EmbedBuilder()
            .setColor(d.config.color)
            .setThumbnail(d.client.user!.displayAvatarURL())
            .setAuthor({
                name: d.message.guild!.name,
                iconURL: d.message.guild!.iconURL() || ""
            })
            .addFields(
                {
                    name: d.util.look(d.idiom, "Actual", "Actual", "Atual"),
                    value: "```fix\n{idiom}```".replace(
                        "{idiom}",
                        d.idiom
                            .replace("en", "🇺🇲 English - (U.S.A).")
                            .replace("es", "🇲🇽 Español - (México).")
                            .replace("pt", "🇧🇷 Portugues - (Brazil).")
                    )
                },
                {
                    name: d.util.look(
                        d.idiom,
                        "Disponibles",
                        "available",
                        "Disponíveis"
                    ),
                    value: "```fix\n```"
                }
            )
            .setTimestamp()
        d.message.channel
            .send({ content: "_ _", embeds: [embed], components: [row] })
            .then((message) => {
                const collector = message.createMessageComponentCollector({
                    componentType: ComponentType.SelectMenu,
                    time: 60_000
                })
                collector.on("collect", async (i) => {
                    if (i.customId !== "language") return
                    //@ts-ignore
                    if (i.user.id !== d.message.author.id)
                        return i
                            .reply({
                                content: d.util.look(
                                    d.idiom,
                                    ...Errors.int_author
                                ),
                                ephemeral: true
                            })
                            .catch((e) => null) as any
                    const choice = i.values[0] as Idioms
                    if (choice === "en" && db) {
                        const obj = db.toObject()
                        delete obj.idiom
                        await db.replaceOne(obj)
                    } else if (db) {
                        db.idiom = choice
                        db.save()
                    } else {
                        Guild.create({
                            _id: d.message.guild!.id,
                            idiom: choice
                        })
                    }
                    //@ts-ignore
                    i.update({
                        content: `_ _ ${Emojis.si} **${d.util.look(
                            d.idiom,
                            "El Idioma del servidor fue cambiado con exito.",
                            "The server language was changed successfully.",
                            "O idioma do servidor foi alterado com sucesso."
                        )}**`,
                        embeds: [],
                        components: []
                    }).catch((e) => null)
                })
                collector.on("end", () => {
                    const newRow = row.toJSON()
                    newRow.components[0].disabled = true
                    message.edit({ components: [newRow] }).catch((e) => null)
                })
                //@ts-ignore
            })
            .catch((e) => d.util.solve(d))
    }
}

import {
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
    SelectMenuBuilder
} from "discord.js"
import { Command, Types } from "../../../../index"
import { PrefixBuilder } from "../../../auxiliar/builders"
import { Errors } from "../../../auxiliar/constants"
import ms from "ms"

/** @param {import("discord.js").EmbedBuilder} [reactionMember] */

export const command: Command<Types.Prefix> = {
    data: new PrefixBuilder()
        .setNames("help", "command")
        .setCategory("General")
        .setExplan(
            "Obtén ayuda acerca de un comando o en general.",
            "Get help about a command or in general.",
            "Obtenha ajuda sobre um comando ou em geral."
        )
        .setUsage("[Comando]", "[Command]", "[Comando]")
        .setCooldown(6),
    code: async (d) => {
        if (d.args[0]) {
            const cmd = d.util
                .getCollection<Types.Prefix>("prefix")
                .find((c) => c.data.names.includes(d.args[0].toLowerCase()))
            if (!cmd)
                return d.util.throwError(
                    d,
                    "El comando no fue encontrado.",
                    "The command was not found.",
                    "O comando não foi encontrado."
                )
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: d.message.author.tag,
                    iconURL: d.message.author.displayAvatarURL()
                })
                .setColor(d.config.color)
                .setFooter({
                    text: d.client.user!.tag,
                    iconURL: d.client.user!.displayAvatarURL()
                })
                .setTimestamp()
                .setTitle(`${d.prefix}${cmd.data.names[0]}`)
                .setFields(
                    {
                        name: d.util.look(
                            d.idiom,
                            "Descripción:",
                            "Description:",
                            "Descrição:"
                        ),
                        value: cmd.data.explan[d.idiom],
                        inline: true
                    },
                    {
                        name: d.util.look(
                            d.idiom,
                            "Categoría:",
                            "Category:",
                            "Categoria:"
                        ),
                        value: cmd.data.category,
                        inline: true
                    },
                    {
                        name: "Cooldown:",
                        value: cmd.data.cooldown ? ms(cmd.data.cooldown) : "2s",
                        inline: true
                    },
                    {
                        name: d.util.look(d.idiom, "Uso:", "Usage:", "Usar:"),
                        value:
                            "```fix\n" +
                            d.prefix +
                            `${
                                cmd.data.names.length > 1
                                    ? "[" + cmd.data.names.join("|") + "]"
                                    : cmd.data.names[0]
                            } ${
                                cmd.data.usage?.[d.idiom]
                                    ? cmd.data.usage[d.idiom]
                                    : ""
                            }` +
                            "```"
                    }
                )
            d.message.channel
                .send({ embeds: [embed] })
                .catch((e) => d.util.solve(d))
        } else {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: d.message.author.tag,
                    iconURL: d.message.author.displayAvatarURL()
                })
                .setColor(d.config.color)
                .setFooter({
                    text: d.client.user!.tag,
                    iconURL: d.client.user!.displayAvatarURL()
                })
                .setTimestamp()
                .setThumbnail(d.client.user!.displayAvatarURL())
                .setFields(
                    {
                        name:
                            "<:info:1000241343584538765> " +
                            d.util.look(
                                d.idiom,
                                "Información:",
                                "Info:",
                                "Informação:"
                            ),
                        value: `_ _ ${d.util.look(
                            d.idiom,
                            "Versión:",
                            "Version:",
                            "Versão:"
                        )} \`v0.2.1\``
                    },
                    {
                        name:
                            "<:icons_link:1014155773036728382> " +
                            d.util.look(
                                d.idiom,
                                "Links útiles:",
                                "Useful links:",
                                "Links úteis:"
                            ),
                        value: `_ _ <:dot:999761724498526319> [\`${d.util.look(
                            d.idiom,
                            "Invitación",
                            "Invite",
                            "Convite"
                        )}\`](${
                            d.config.invite
                        })\n_ _ <:dot:999761724498526319> [\`${d.util.look(
                            d.idiom,
                            "Soporte",
                            "Support",
                            "Suporte"
                        )}\`](${d.config.discord})`
                    },
                    { name: "\u200b", value: "\u200b" },
                    {
                        name: "<:xim_Shine:965958561253433375> TIP:",
                        value: `_ _ ${d.util
                            .look(
                                d.idiom,
                                "Usa **`{prefix}help <comando>`** para mostrar información de un comando específico.",
                                "Use **`{prefix}help <comando>`** to display info about a specific command.",
                                "Use `{prefix}help <comando>` para exibir informação de um comando específico."
                            )
                            .replace("{prefix}", d.prefix)}`
                    }
                )
            const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
                new SelectMenuBuilder()
                    .setCustomId("help_menu")
                    .setPlaceholder(
                        d.util.look(
                            d.idiom,
                            "Selecciona una categoría.",
                            "Select a category.",
                            "Selecione uma categoria."
                        )
                    )
                    .setOptions(
                        {
                            label: "Home",
                            value: "home"
                        },
                        {
                            label: "General",
                            value: "General"
                        },
                        {
                            label: "Utility",
                            value: "Utility"
                        },
                        {
                            label: "Fun",
                            value: "Fun"
                        },
                        {
                            label: "Configuration",
                            value: "Config"
                        },
                        {
                            label: "Information",
                            value: "Info"
                        }
                    )
            )
            d.message.channel
                .send({ embeds: [embed], components: [row] })
                .then((message) => {
                    const collector = message.createMessageComponentCollector({
                        componentType: ComponentType.SelectMenu,
                        time: 120_000
                    })
                    collector.on("collect", (i) => {
                        if (i.customId !== "help_menu") return
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
                        if (i.values[0] === "home") {
                            embed
                                .setFields(
                                    {
                                        name:
                                            "<:info:1000241343584538765> " +
                                            d.util.look(
                                                d.idiom,
                                                "Información:",
                                                "Info:",
                                                "Informação:"
                                            ),
                                        value: `_ _ ${d.util.look(
                                            d.idiom,
                                            "Versión:",
                                            "Version:",
                                            "Versão:"
                                        )} \`v0.2.1\``
                                    },
                                    {
                                        name:
                                            "<:icons_link:1014155773036728382> " +
                                            d.util.look(
                                                d.idiom,
                                                "Links útiles:",
                                                "Useful links:",
                                                "Links úteis:"
                                            ),
                                        value: `_ _ <:dot:999761724498526319> [\`${d.util.look(
                                            d.idiom,
                                            "Invitación",
                                            "Invite",
                                            "Convite"
                                        )}\`](${
                                            d.config.invite
                                        })\n_ _ <:dot:999761724498526319> [\`${d.util.look(
                                            d.idiom,
                                            "Soporte",
                                            "Support",
                                            "Suporte"
                                        )}\`](${d.config.discord})`
                                    },
                                    { name: "\u200b", value: "\u200b" },
                                    {
                                        name: "<:xim_Shine:965958561253433375> TIP:",
                                        value: `_ _ ${d.util
                                            .look(
                                                d.idiom,
                                                "Usa **`{prefix}help <comando>`** para mostrar información de un comando específico.",
                                                "Use **`{prefix}help <comando>`** to display info about a specific command.",
                                                "Use `{prefix}help <comando>` para exibir informação de um comando específico."
                                            )
                                            .replace("{prefix}", d.prefix)}`
                                    }
                                )
                                .setTitle(null)
                            //@ts-ignore
                            i.update({ embeds: [embed] }).catch((e) =>
                                d.util.solve(d)
                            )
                        } else {
                            const cmds = d.util
                                .getCollection<Types.Prefix>("prefix")
                                .filter((c) => c.data.category === i.values[0])
                                .sort()
                                .map((c) => c.data.names[0])
                            embed
                                .setTitle(`${i.values[0]}`)
                                .setFields({
                                    name: d.util.look(
                                        d.idiom,
                                        "Comandos",
                                        "Commands",
                                        "Comandos"
                                    ),
                                    value: `${
                                        cmds.length
                                            ? cmds
                                                  .map((c) => "**`" + c + "`**")
                                                  .join(", ")
                                            : "Not added yet."
                                    }`
                                })
                                .setFooter({
                                    text: `${cmds.length} ${d.util.look(
                                        d.idiom,
                                        "comandos.",
                                        "commands.",
                                        "comandos."
                                    )}`,
                                    iconURL: d.client.user!.displayAvatarURL()
                                })
                            //@ts-ignore
                            i.update({ embeds: [embed] }).catch(
                                (e) => d.util.solve
                            )
                        }
                    })
                    collector.on("end", () => {
                        const newRow = row.toJSON()
                        newRow.components[0].disabled = true
                        //@ts-ignore
                        message
                            .edit({ components: [newRow] })
                            .catch((e) => null)
                    })
                })
        }
    }
}

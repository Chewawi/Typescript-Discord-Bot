import {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} from "discord.js"
import { Command, Types } from "../../../../index"

export const command: Command<Types.Slash> = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Send a message through the bot.")
        .setDescriptionLocalizations({
            "es-ES": "Envia un mensaje a través del bot.",
            "pt-BR": "Envie uma mensagem através do bot."
        })
        .setDMPermission(false)
        //@ts-ignore
        .addStringOption((option) =>
            option
                .setName("embed")
                .setDescription("Send an embed message through the bot.")
                .setRequired(false)
        )
        //@ts-ignore
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("Send a normal message through the bot.")
                .setRequired(false)
        ),
    code: async (d) => {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("q0w")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(
                    d.util.look(
                        d.idiom,
                        "Enviado por:",
                        "Sent by:",
                        "Enviado por:"
                    ) + ` ${d.int.user!.tag}`
                )
                .setDisabled(true)
        )

        if (
            //@ts-ignore
            !d.int.member!.permissions.has(PermissionFlagsBits.ManageMessages)
        ) {
            //@ts-ignore
            d.util.throwError(d.idiom, "", "", "")
        } else {
            let embed_fala = d.int.options.getString("embed")
            let normal_fala = d.int.options.getString("message")
            if (!embed_fala && !normal_fala) {
        
                d.util.throwError(
                    //@ts-ignore
                    d.idiom,
                    "Escribe al menos una de las opciones.",
                    "Give at least one of the options.",
                    "Escreva pelo menos em uma das opções."
                )
            } else {
                if (!embed_fala) embed_fala = "⠀"
                if (!normal_fala) normal_fala = "⠀"

                const embed = new EmbedBuilder()
                    .setColor(0x303136)
                    .setAuthor({
                        name: d.int.user!.tag,
                        iconURL: d.int.user!.displayAvatarURL()
                    })
                    .setDescription(embed_fala)

                if (embed_fala === "⠀") {
                    
                    d.int.reply({
                        content: d.util.look(
                            //@ts-ignore
                            d.idiom,
                            `¡Tu mensaje fue enviado!`,
                            `Your message was sent!`,
                            `Sua mensagem foi enviada!`
                        ),
                        ephemeral: true
                    })
                    d.int.channel!.send({
                        content: `${normal_fala}\n_ _`,
                        components: [row]
                    })
                } else if (normal_fala === "⠀") {
                    d.int.reply({
                        content: d.util.look(
                            //@ts-ignore
                            d.idiom,
                            `¡Tu mensaje fue enviado!`,
                            `Your message was sent!`,
                            `Sua mensagem foi enviada!`
                        ),
                        ephemeral: true
                    })
                    d.int.channel!.send({ embeds: [embed] })
                } else {
                    d.int.reply({
                        content: d.util.look(
                            //@ts-ignore
                            d.idiom,
                            `¡Tu mensaje fue enviado!`,
                            `Your message was sent!`,
                            `Sua mensagem foi enviada!`
                        ),
                        ephemeral: true
                    })
                    d.int.channel!.send({
                        content: `${normal_fala}`,
                        embeds: [embed]
                    })
                }
            }
        }
    }
}

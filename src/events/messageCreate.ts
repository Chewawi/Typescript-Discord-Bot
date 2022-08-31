import * as djs from "discord.js"
import { Data, Event, TypeEvents, Types } from "../../index"
import { config } from "../auxiliar/constants"
import { util } from "../main"
import { Guild } from "../auxiliar/models"

export const event: Event<TypeEvents.Bot> = {
    name: "messageCreate",
    code: async (message: djs.Message) => {
        const db = await Guild.findOne({ _id: message.guild!.id })
        if (
            !(message.channel instanceof djs.BaseGuildTextChannel) &&
            message.channel.type !== djs.ChannelType.GuildPublicThread &&
            message.channel.type !== djs.ChannelType.GuildPrivateThread
        )
            return
        if (message.author.bot) return
        const commands = util.getCollection<Types.Prefix>("prefix")
        const _prefixes = [
            config.prefix,
            `<@${message.client.user!.id}`,
            `<@!${message.client.user!.id}`
        ]
        const prefix = _prefixes.find((p) =>
            message.content.toLowerCase().startsWith(p)
        )
        if (!prefix) return
        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const probably = args.shift()?.toLowerCase()
        if (!probably) return
        const command = commands.find((cmd) =>
            cmd.data.names.includes(probably!)
        )
        if (!command) return
        const d: Data<Types.Prefix> = {
            message,
            args,
            util,
            config,
            prefix,
            client: message.client,
            idiom: db?.idiom || "en"
        }
        if (command.data.isDev && !config.devs.includes(d.message.author.id))
            return
        if (command.data.args && command.data.args > args.length)
            return d.util.throwError(
                d,
                `¡Argumentos faltantes! Utiliza \`${prefix}help ${command.data.names[0]}\` para más información.`,
                `Missing arguments! Use \`${prefix}help ${command.data.names[0]}\` for more information.`,
                `Faltando argumentos! Use \`${prefix}help ${command.data.names[0]}\` para mais informações.`
            )
        if (!util.getCooldowns().has(command.data.names[0]))
            util.getCooldowns().set(
                command.data.names[0],
                new djs.Collection<any, any>()
            )
        const timestamps = util.getCooldowns().get(command.data.names[0])
        const amount = command.data.cooldown
        if (timestamps.has(message.author.id)) {
            if (Date.now() < timestamps.get(message.author.id) + amount) {
                const timeLeft =
                    (timestamps.get(message.author.id) + amount - Date.now()) /
                    1000
                return util.defer(d, {
                    content:
                        `<@${message.author.id}>, ` +
                        d.util
                            .look(
                                d.idiom,
                                `necesitas esperar **%time%** para poder usar nuevamente el comando.`,
                                `you need to wait **%time%** to use the command again.`,
                                `você precisa esperar **%time%** para usar o comando novamente.`
                            )
                            .replace("%time%", timeLeft.toFixed() + "s") +
                        " **(҂◡̀_◡́)ᕤ**"
                })
            }
        }
        timestamps.set(d.message.author.id, Date.now())
        setTimeout(() => timestamps.delete(d.message.author.id), amount)
        if (command.data.permissions.bot.length) {
            const botperms = command.data.permissions.bot
                .map((p) => "`" + p + "`")
                .join(", ")
            if (
                !message.guild!.members.me!.permissions.has(
                    command.data.permissions.bot
                )
            )
                return d.util.throwError(
                    d,
                    `No tengo los permisos necesarios para ejecutar este comando, permisos: [${botperms}]`,
                    `I do not have permissions enough to execute this command, permissions: [${botperms}]`,
                    `Não tenho as permissões necessárias para executar este comando, permissões: [${botperms}]`
                )
        }
        if (command.data.permissions.user.length) {
            const botperms = command.data.permissions.user
                .map((p) => "`" + p + "`")
                .join(", ")
            if (
                !message.guild!.members.me!.permissions.has(
                    command.data.permissions.bot
                )
            )
                return d.util.throwError(
                    d,
                    `No tienes los permisos necesarios para ejecutar este comando, permisos: [${botperms}]`,
                    `You don't have permissions enough to execute this command, permissions: [${botperms}]`,
                    `Você não tem as permissões necessárias para executar este comando, permissões: [${botperms}]`
                )
        }
        command.code(d).catch(console.log)
    }
}

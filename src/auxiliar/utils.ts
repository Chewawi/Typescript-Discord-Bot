import { lstatSync, readdirSync } from "fs"
import * as djs from "discord.js"
import { join } from "path"
import * as TS from "../../index"
import { PrefixBuilder } from "./builders"
import { REST } from "@discordjs/rest"
import { config, Emojis } from "./constants"
import { Routes } from "discord.js"
import { Loader } from "./prototypes"
import mongoose from "mongoose"
import colors from "colors/safe"
import _ from "lodash"

class Util {
    private client: djs.Client
    private commands: djs.Collection<string, TS.Command<TS.Types.Prefix>>
    private slash: djs.Collection<string, TS.Command<TS.Types.Slash>>
    private interactions: djs.Collection<
        string,
        TS.Command<TS.Types.Interaction>
    >
    private cooldowns: djs.Collection<string, any>
    constructor(client: djs.Client) {
        this.client = client
        this.commands = new djs.Collection()
        this.slash = new djs.Collection()
        this.interactions = new djs.Collection()
        this.cooldowns = new djs.Collection<string, any>()
        Loader()
    }
    async load(dir: string): Promise<void> {
        const mdir = process.cwd()
        const modules = readdirSync(join(mdir, dir))
        console.log(
            "|-------------------------------------|" +
                `\n| ` +
                colors.gray(`./${join(dir).replaceAll("\\", "/")}`)
        )

        for (const file of modules) {
            const stat = lstatSync(join(mdir, dir, file))
            if (stat.isDirectory()) {
                this.load(join(dir, file))
                continue
            }
            delete require.cache[join(mdir, dir, file)]
            const cmd: TS.Command<TS.Types> = require(join(
                mdir,
                dir,
                file
            )).command
            if (!cmd) continue
            if (
                this.isType<TS.CommandTypes, TS.Types.Prefix>(
                    cmd,
                    (c) => c.data instanceof PrefixBuilder
                )
            ) {
                cmd.data.category = dir.split("/")[3]!
                this.commands.set(cmd.data.names[0], cmd)
                console.log(
                    `| ` +
                        colors.green(`Command Loaded!`) +
                        `\n| Name: ${cmd.data.names[0]}           \n| Type: Prefixed `
                )
                console.log("|-------------------------------------|")
            } else if (
                this.isType<TS.CommandTypes, TS.Types.Slash>(
                    cmd,
                    (c) => c.data instanceof djs.SlashCommandBuilder
                )
            ) {
                cmd.category = _.last(dir.split("/"))
                this.slash.set(cmd.data.name, cmd)
                console.log(
                    `| ` +
                        colors.green(`Command Loaded!`) +
                        `\n| Name: ${cmd.data.name}           \n| Type: Slash `
                )
                console.log("|-------------------------------------|")
            } else if (
                this.isType<TS.CommandTypes, TS.Types.Interaction>(
                    cmd,
                    (c) => !!c._id
                )
            ) {
                this.interactions.set(cmd._id, cmd)
            }
        }
    }
    reset(): void {
        this.commands = new djs.Collection()
        this.slash = new djs.Collection()
        this.interactions = new djs.Collection()
    }
    async listen(dir: string): Promise<void> {
        const modules = readdirSync(join(process.cwd(), dir))
        for (const file of modules) {
            const event: TS.Event<TS.TypeEvents> = require(join(
                process.cwd(),
                dir,
                file
            )).event
            if (!event) continue
            if (
                this.isType<TS.EventTypes, TS.TypeEvents.Bot>(
                    event,
                    (e) => !!e.name
                )
            ) {
                this.client.on(event.name, event.code)
            } else {
                event.code()
            }
        }
    }
    handleSlashes(): void {
        const rest = new REST({ version: "10" }).setToken(config.token)
        rest.put(Routes.applicationCommands("924198727533600798"), {
            body: this.slash.map((s) => s.data.toJSON())
        })
    }
    getCollection<K extends keyof TS.CommandTypes>(
        type: "prefix" | "slash" | "interaction"
    ): djs.Collection<string, TS.Command<K>> {
        // @ts-ignore
        return type === "prefix"
            ? this.commands
            : type === "slash"
            ? this.slash
            : this.interactions
    }
    getCooldowns(): djs.Collection<string, any> {
        return this.cooldowns
    }
    async connect(): Promise<void> {
        mongoose.connection.on("connected", () => {
            console.log(colors.gray("Database connected"))
        })
        await mongoose.connect(process.env.MONGODB!)
        mongoose.connection.on("error", (err) => {
            console.log(err)
        })
    }
    isType<T, K extends keyof T>(
        obj: any,
        func: (obj: T[K]) => boolean
    ): obj is T[K] {
        return func(obj)
    }
    hasPerm(
        id: djs.Snowflake,
        channel: djs.BaseGuildTextChannel,
        perms: djs.PermissionResolvable
    ): boolean {
        if (!channel) return false
        return channel.permissionsFor(id)?.has(perms) ? true : false
    }
    look(d: TS.Idioms, es: string, en: string, pt: string): string {
        return d === "es" ? es : d === "en" ? en : d === "pt" ? pt : en
    }
    solve(d: TS.Data<TS.Types>): void {
        if (this.isType<TS.DataTypes, TS.Types.Prefix>(d, (v) => !!v.message)) {
            const has = this.hasPerm(
                this.client.user!.id,
                d.message.channel! as djs.BaseGuildTextChannel,
                ["EmbedLinks"]
            )
            if (!has)
                return this.throwError(
                    d,
                    "No tengo permisos para enviar contenido incrustado o links.",
                    "I do not have permissions to send embeds.",
                    "Eu não tenho permissões para incorporar embeds."
                )
        } else {
            const has = this.hasPerm(
                this.client.user!.id,
                d.int.channel! as djs.BaseGuildTextChannel,
                ["EmbedLinks"]
            )
            if (!has)
                return this.throwError(
                    d,
                    "No tengo permisos para enviar contenido incrustado o links.",
                    "I do not have permissions to send embeds.",
                    "Eu não tenho permissões para incorporar embeds."
                )
        }
    }
    throwError(
        d: TS.Data<TS.Types>,
        es: string,
        en: string,
        pt: string,
        options: TS.ThrowOptions = { bold: true, defer: true }
    ): void {
        const txt = `${Emojis.no} ${options?.bold ? "**" : ""}${this.look(
            "en",
            es,
            en,
            pt
        )}${options?.bold ? "**" : ""}`
        if (this.isType<TS.DataTypes, TS.Types.Prefix>(d, (v) => !!v.message)) {
            const obj = this.hasPerm(
                d.client.user!.id,
                d.message.channel as djs.BaseGuildTextChannel,
                ["SendMessages", "EmbedLinks"]
            )
                ? {
                      embeds: [
                          new djs.EmbedBuilder()
                              .setColor("Red")
                              .setDescription(txt)
                      ]
                  }
                : txt
            d.message.channel
                .send(obj)
                .then((m) =>
                    options.defer
                        ? setTimeout(() => {
                              m.delete().catch((e) => null)
                          }, 8_000)
                        : null
                )
                .catch((e) => null)
        } else if (
            this.isType<TS.DataTypes, TS.Types.Slash>(d, (v) => !!v.int)
        ) {
            const obj = this.hasPerm(
                d.client.user!.id,
                d.int.channel as djs.BaseGuildTextChannel,
                ["SendMessages", "EmbedLinks"]
            )
                ? {
                      embeds: [
                          new djs.EmbedBuilder()
                              .setColor("Red")
                              .setDescription(txt)
                      ],
                      ephemeral: true
                  }
                : { content: txt, ephemeral: true }
            if (d.int.deferred) d.int.editReply(obj).catch((e) => null)
            else d.int.reply(obj).catch((e) => null)
        }
    }
    throwFine(
        d: TS.Data<TS.Types>,
        es: string,
        en: string,
        pt: string,
        options: TS.ThrowOptions = { bold: true, defer: true }
    ): void {
        const txt = `${options?.bold ? "**" : ""}${this.look(
            "en",
            es,
            en,
            pt
        )}${options?.bold ? "**" : ""}`
        if (this.isType<TS.DataTypes, TS.Types.Prefix>(d, (v) => !!v.message)) {
            const obj = this.hasPerm(
                d.client.user!.id,
                d.message.channel as djs.BaseGuildTextChannel,
                ["SendMessages", "EmbedLinks"]
            )
                ? {
                      embeds: [
                          new djs.EmbedBuilder()
                              .setColor("Green")
                              .setDescription(txt)
                      ]
                  }
                : txt
            d.message.channel
                .send(obj)
                .then((m) =>
                    options.defer
                        ? setTimeout(() => {
                              m.delete().catch((e) => null)
                          }, 8_000)
                        : null
                )
                .catch((e) => null)
        } else if (
            this.isType<TS.DataTypes, TS.Types.Slash>(d, (v) => !!v.int)
        ) {
            const obj = this.hasPerm(
                d.client.user!.id,
                d.int.channel as djs.BaseGuildTextChannel,
                ["SendMessages", "EmbedLinks"]
            )
                ? {
                      embeds: [
                          new djs.EmbedBuilder()
                              .setColor("Green")
                              .setDescription(txt)
                      ]
                  }
                : { content: txt }
            if (d.int.deferred) d.int.editReply(obj).catch((e) => null)
            else d.int.reply(obj).catch((e) => null)
        }
    }
    random<T = unknown>(array: T[], length = 1): T[] {
        if (length >= array.length) return array
        const w3: T[] = []
        let j = 0
        while (j < length) {
            const random = Math.floor(Math.random() * array.length)
            if (w3.includes(array[random])) continue
            w3.push(array[random])
            j++
        }
        return w3
    }
    defer(d: TS.Data<TS.Types>, content: Record<string, any> | string): void {
        if (this.isType<TS.DataTypes, TS.Types.Prefix>(d, (v) => !!v.message)) {
            d.message.channel
                .send(content)
                .then((m) =>
                    setTimeout(() => {
                        m.delete().catch((e) => null)
                    }, 7_500)
                )
                .catch((e) => null)
        } else if (
            this.isType<TS.DataTypes, TS.Types.Slash>(d, (v) => !!v.int)
        ) {
            d.int.channel
                ?.send(content)
                ?.then((m) =>
                    setTimeout(() => {
                        m.delete().catch((e) => null)
                    }, 7_500)
                )
                ?.catch((e) => null)
        }
    }
    async getUser(id: djs.Snowflake, strict = false): Promise<djs.User | null> {
        if (!id) return null
        const some_id = id.replace(/[^\d]/g, "")
        let user = some_id
            ? this.client.users.cache.get(some_id) ||
              (await this.client.users.fetch(some_id).catch((e) => null))
            : null
        if (!strict && !user)
            user =
                this.client.users.cache.find((u) => u.username.includes(id)) ||
                null
        return user
    }
    async getMember(
        state: djs.Guild | TS.Data<TS.Types>,
        id: string,
        strict = false
    ): Promise<djs.GuildMember | null> {
        const guild =
            state instanceof djs.Guild
                ? state
                : this.isType<TS.DataTypes, TS.Types.Prefix>(
                      state,
                      (v) => !!v.message
                  )
                ? state.message.guild
                : state.int.guild
        if (!id) return null
        const some_id = id.replace(/[^\d]/g, "")
        let member = some_id
            ? guild!.members.cache.get(some_id) ||
              (await guild!.members.fetch(some_id).catch((e) => null))
            : null
        if (!strict && !member)
            member =
                guild!.members.cache.find((m) =>
                    m.user.username.includes(id)
                ) || null
        return member
    }
    async getChannel(
        state: djs.Guild | TS.Data<TS.Types>,
        id: string,
        strict = false
    ): Promise<djs.GuildBasedChannel | null> {
        const guild =
            state instanceof djs.Guild
                ? state
                : this.isType<TS.DataTypes, TS.Types.Prefix>(
                      state,
                      (v) => !!v.message
                  )
                ? state.message.guild
                : state.int.guild
        if (!id) return null
        const some_id = id.replace(/[^\d]/g, "")
        let channel = some_id
            ? guild!.channels.cache.get(some_id) ||
              (await guild!.channels.fetch(some_id).catch((e) => null))
            : null
        if (!strict && !channel)
            channel =
                guild!.channels.cache.find((c) => c.name.includes(id)) || null
        return channel as djs.GuildBasedChannel
    }
    async getRole(
        state: djs.Guild | TS.Data<TS.Types>,
        id: string,
        strict = false
    ): Promise<djs.Role | null> {
        const guild =
            state instanceof djs.Guild
                ? state
                : this.isType<TS.DataTypes, TS.Types.Prefix>(
                      state,
                      (v) => !!v.message
                  )
                ? state.message.guild
                : state.int.guild
        if (!id) return null
        const some_id = id.replace(/[^\d]/g, "")
        let role = some_id
            ? guild!.roles.cache.get(some_id) ||
              (await guild!.roles.fetch(some_id).catch((e) => null))
            : null
        if (!strict && !role)
            role = guild!.roles.cache.find((r) => r.name.includes(id)) || null
        return role
    }
    async getMessage(
        state: djs.GuildTextBasedChannel | TS.Data<TS.Types>,
        id: string
    ): Promise<djs.Message | null> {
        const channel = this.isType<TS.DataTypes, TS.Types.Prefix>(
            state,
            (v) => !!v.message
        )
            ? state.message.channel
            : this.isType<TS.DataTypes, TS.Types.Slash | TS.Types.Interaction>(
                  state,
                  (v) => !!v.int
              )
            ? state.int.channel!
            : state
        if (!id) return null
        const message =
            channel.messages.cache.get(id) ||
            (await channel.messages.fetch(id).catch((e) => null))
        return message
    }
    async hasDM(user: djs.Snowflake | djs.User): Promise<boolean> {
        const u =
            user instanceof djs.User ? user : await this.getUser(user, false)
        if (!u) return false
        const c = await u.send(" ").catch((err) => err.code)
        return c === 50007 ? false : true
    }
    isHex(str: string): boolean {
        if (!str) return false
        return /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str.replace(/(#)/g, ""))
    }
    cut(text: string, length: number, conector = "..."): string {
        if (text.length <= length) return text
        return text.slice(0, length).trim() + conector
    }
    clarify(
        data:
            | djs.APIApplicationCommandSubcommandOption
            | djs.RESTPostAPIApplicationCommandsJSONBody
    ): { subcommands: any[]; subgroups: any[]; normalones: any[] } {
        const sub_c = []
        const sub_g = []
        const normal = []
        if (!data.options)
            return { subcommands: [], subgroups: [], normalones: [] }
        for (const option of data.options) {
            if (option.type === 2) {
                const sub_g_subcmds = []
                for (const sub of option.options!) {
                    if (!sub.options) {
                        sub_g_subcmds.push({
                            name: sub.name,
                            explan: sub.description
                        })
                        continue
                    }
                    const subcmdsoptions = []
                    for (const sub_op of sub.options) {
                        subcmdsoptions.push({
                            name: sub_op.name,
                            explan: sub_op.description,
                            type: sub_op.type,
                            required: sub_op.required
                        })
                    }
                    sub_g_subcmds.push({
                        name: sub.name,
                        explan: sub.description,
                        options: subcmdsoptions
                    })
                    sub_g.push({
                        name: option.name,
                        explan: option.description,
                        ops: sub_g_subcmds
                    })
                }
            } else if (option.type === 1) {
                if (!option.options) {
                    sub_c.push({
                        name: option.name,
                        explan: option.description
                    })
                    continue
                }
                const sub_options = []
                for (const sub_op of option.options!) {
                    sub_options.push({
                        name: sub_op.name,
                        explan: sub_op.description,
                        type: sub_op.type,
                        required: sub_op.required
                    })
                }
                sub_c.push({
                    name: option.name,
                    explan: option.description,
                    options: sub_options
                })
            } else {
                normal.push({
                    name: option.name,
                    explan: option.description,
                    required: option.required
                })
            }
        }
        return { subcommands: sub_c, subgroups: sub_g, normalones: normal }
    }
}

export { Util }

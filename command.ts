import { Data, Command } from "../../../../index";
import Discord, { ActionRowBuilder, EmbedBuilder, ButtonBuilder, AttachmentBuilder } from 'discord.js';
import { CommandBuilder } from "../../../Builders/Command";

export const command = new CommandBuilder()
.setName("command")
.addAlias("comando")
.setDescription("Te doy la Información del Comando que quieras!","I give you the Command Information you want!","Eu lhe dou as Informações de Comando que você quer!")
.setColor("RANDOM")
.setUse("comando [Nombre]", "command [Name]", "comando [Nome]")
.setCategory("Información","Information","Informação")
.setCooldown("0s")
.setPermissions("client", [2048n,1024n,16384n])
.setNsfw(false)
.setPremium(false)
.setDeveloper(false)
.setIndex(true)
.setTesting(false)
.setRun(async(d: Data) => {
    const messageError = d.util.lang(d.lang, {
        es: `Debes de dar el nombre del comando!`,
        en: `You must give the name of the command!`,
        pt: `Você deve dar o nome do comando!`
    })
    /**
    if(!d.args.join(' ')) return d.message.channel.send({
        content: messageError
    })
     */
    const search: CommandBuilder | void = d.util.getCmd(d.args.join(' '))
    if(!search) return d.message.channel.send({
        content: messageError
    })

    let use = (d.util.lang(d.lang, search.use))
    if(use.startsWith('{PREFIX}')) use = (d.util.lang(d.lang, search.use)).slice(8)
    const ClientPermissions: string[] = []
    const UserPermissions: string[] = []
    for(const permission of search.permissions.client){
        ClientPermissions.push(d.util.InterpretePermission(d.lang, permission))
    }
    for(const permission of search.permissions.user){
        UserPermissions.push(d.util.InterpretePermission(d.lang, permission))
    }
    const perms = {
        client: !search.permissions.client[0]?d.util.lang(d.lang, ['Sin Permisos','Without Permission','Sem Permissão']):ClientPermissions.join('\n'),
        user: !search.permissions.user[0]?d.util.lang(d.lang, ['Sin Permisos','Without Permission','Sem Permissão']):UserPermissions.join('\n')
    }

    d.message.channel.send({
        embeds: [
            new EmbedBuilder({
                color: d.util.ResolveColor(search.color),
                title: d.util.lang(d.lang, {
                    es: `Comando: ${search.name} ${search.testing?d.config.emojis.icons["Beta"]:''} ${search.developer?d.config.emojis.icons["Dev"]:''} ${search.premium?d.config.emojis.icons["Crown"]:''} ${search.nsfw?d.config.emojis.icons["+18"]:''}`,
                    en: `Command: ${search.name} ${search.testing?d.config.emojis.icons["Beta"]:''} ${search.developer?d.config.emojis.icons["Dev"]:''} ${search.premium?d.config.emojis.icons["Crown"]:''} ${search.nsfw?d.config.emojis.icons["+18"]:''}`,
                    pt: `Comando: ${search.name} ${search.testing?d.config.emojis.icons["Beta"]:''} ${search.developer?d.config.emojis.icons["Dev"]:''} ${search.premium?d.config.emojis.icons["Crown"]:''} ${search.nsfw?d.config.emojis.icons["+18"]:''}`
                }),
                fields: [
                    {
                        name: d.util.lang(d.lang, {
                            es: `Nombres`,
                            en: `Names`,
                            pt: `Nomes`
                        }),
                        value: `${search.name}`,
                        inline: true
                    },
                    {
                        name: 'Aliases',
                        value: `${search.aliases.join(', ')}`,
                        inline: true
                    },
                    {
                        name: d.util.lang(d.lang, {
                            es: `Categoría`,
                            en: `Category`,
                            pt: `Categoria`
                        }),
                        value: d.util.lang(d.lang, search.category),
                        inline: true
                    },
                    {
                        name: d.util.lang(d.lang, {
                            es: `Descripción`,
                            en: `Description`,
                            pt: `Descrição`
                        }),
                        value: d.util.lang(d.lang, search.description),
                        inline: false
                    },
                    {
                        name: d.util.lang(d.lang, {
                            es: 'Uso',
                            en: 'Use',
                            pt: 'Uso'
                        }),
                        value: `\`\`\`fix\n${use}\n\`\`\``,
                        inline: false
                    },
                    {
                        name: d.util.lang(d.lang, {
                            es: 'Permisos del Cliente',
                            en: 'Client Permissions',
                            pt: 'Permissões do Cliente'
                        }),
                        value: `\`\`\`fix\n${perms.client}\n\`\`\``,
                        inline: true
                    },
                    {
                        name: d.util.lang(d.lang, {
                            es: 'Permisos de Usuario',
                            en: 'User Permissions',
                            pt: 'Permissões do Usuário'
                        }),
                        value: `\`\`\`fix\n${perms.user}\n\`\`\``,
                        inline: true
                    },
                    {
                        name: d.util.lang(d.lang, {
                            es: 'Enfriamiento',
                            en: 'Cooldown',
                            pt: 'Refrigeração'
                        }),
                        value: `\`\`\`fix\n${search.cooldown}\n\`\`\``,
                        inline: true
                    }
                ]
            })
        ]
    })
})
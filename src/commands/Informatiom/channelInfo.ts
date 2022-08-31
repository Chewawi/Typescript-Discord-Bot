import { Command } from "../../auxiliar/interfaces/Command";
import { Data } from "../../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../../auxiliar/builders";
import * as Discord from "discord.js"

export const command: Command = {
    data: new PrefixBuilder()
    .setName('channel-info')
	  .setAliases('channel', 'channelinfo')
		.setUsage('[channel-info|channel|channelinfo] <canal>', '[channel-info|channel|channelinfo] <channel>', '[channel-info|channel|channelinfo] <canal>')
	  .setCategory('Información', 'Information', 'Informação' )
	  .setDescription('Obtenga información sobre un canal del servidor.', 'Get information about a server channel.', 'Obtenha informações sobre um canal de servidor.'),
    run: async (d: Data) => {

		const channel = await d.util.getChannel(d, d.args[0]) || d.message.channel
    if(!channel) return d.util.throwError(d, 'Invalid', 'invalidChannel')
												 
    const chnl_img = {
   2: "https://cdn.discordapp.com/emojis/998203166971666433.png",
   0: "https://cdn.discordapp.com/emojis/859424401950113822.png",
   5: "https://cdn.discordapp.com/emojis/859424400456679445.png",
   11: "https://cdn.discordapp.com/emojis/998203443590217768.png",
   12: "https://cdn.discordapp.com/emojis/998203443590217768.png",
   10: "https://cdn.discordapp.com/emojis/998203443590217768.png",
   4: "https://cdn.discordapp.com/emojis/994511050793828403.png"
		} 

    let fields = [
			{
				name: '_ _ <:xim_Channel:956364117856387152> '+d.util.lang(d.idiom, "Nombre:", "Name", "Nome:"),
				value: "`#"+channel.name+"`"
			},
			{
				name: '_ _ <:Cw_ID:944458696539373608> '+"ID:",
				value: "`"+channel.id+"`"
			},
			{
				name: '_ _ <:icons_folder:994511050793828403> '+d.util.lang(d.idiom, "Categoría:", "Category:", "Categoria:"),
				// @ts-ignore
				value: channel.parentId ? "`#"+(await d.util.getChannel(d, channel.parentId)).name+"`" : d.util.lang(d.idiom, `\`No tiene\``, `\`Don't have\``, `\`Não tem\``)
			},
			{
				name: '_ _ <:Cw_Info:942494716224766024> '+d.util.lang(d.idiom, "Tipo del canal:", "Channel Type:", "Tipo do canal:"),
				value: d.util.channelType(d.idiom, channel.type)
			},
			{
				name: '_ _ <:Cw_Date:962726248885391360> '+d.util.lang(d.idiom, 'Creado el:', 'Created at:', 'Criado em:'),
				value: `<t:${~~(channel.createdAt / 1000)}:f>`
			}
		]
		channel?.topic && fields.push({
			name: '_ _ <:Akn_Message:980710828074500098> '+d.util.lang(d.idiom, "Tema del canal:", "Channel topic:", "Tema do canal:"),
			value: channel.topic.substring(0,1000)
		}) 
		const last_msg = channel?.lastMessageId && (await channel.messages.fetch(channel?.lastMessageId));

		// channel?.lastMessageId && (last_msg = await channel.messages.fetch(channel?.lastMessageId));
		channel?.lastMessageId && fields.push({
			name: '_ _ <:Cw_Category:942132611894116392> '+d.util.lang(d.idiom, "Último mensaje del canal:", "Last message of the channel:", "Última mensagem do canal:"),
			// @ts-ignore
			value: `\`${last_msg.author.tag}: ${last_msg.content.substring(0,400)}\``
		})
    d.message.reply({
			embeds: d.util.Embeds({
				author: {
        name: `Channel-Info`,
        icon_url: 'https://api.miduwu.ga/image/circle?image=' + d.client.user!.displayAvatarURL({ forceStatic: true })
			},
				// @ts-ignore
				thumbnail: chnl_img[channel.type],
				fields,
				footer: { 
        text: d.message.author.tag,
        icon_url: 'https://api.miduwu.ga/image/circle?image='+d.message.author.displayAvatarURL({ forceStatic: true })
        },
        stamp: new Date(),
				color: d.color
			})
		})

	}
}
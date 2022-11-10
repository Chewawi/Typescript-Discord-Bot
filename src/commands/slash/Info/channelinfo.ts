import {
	EmbedBuilder,
	SlashCommandBuilder,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType
} from 'discord.js'
import { Emojis } from 'aux/constants'
import { Command, Types } from '../../../../index'

export const command: Command<Types.Slash> = {
	data: new SlashCommandBuilder()
		.setName('channel-info')
		.setDescription('Get information from a channel!')
		.setDescriptionLocalizations({
			'es-ES': 'Obtén información de un canal!',
			'pt-BR': 'Obter informações de um canal!'
		})
		.setDMPermission(false)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('Server channel.')
				.setDescriptionLocalizations({
					'es-ES': 'Canal del servidor.',
					'pt-BR': 'Canal do servidor.'
				})
				.setRequired(false)
		),
	code: async (d) => {
		const channel = d.int.options.getChannel('channel') || (d.int.channel as any)

		const chnl_img = {
			2: 'https://cdn.discordapp.com/emojis/998203166971666433.png',
			0: 'https://cdn.discordapp.com/emojis/859424401950113822.png',
			5: 'https://cdn.discordapp.com/emojis/859424400456679445.png',
			11: 'https://cdn.discordapp.com/emojis/998203443590217768.png',
			12: 'https://cdn.discordapp.com/emojis/998203443590217768.png',
			10: 'https://cdn.discordapp.com/emojis/998203443590217768.png',
			4: 'https://cdn.discordapp.com/emojis/994511050793828403.png'
		}

		const embed = new EmbedBuilder()
			.setAuthor({
				name: d.int.user!.tag,
				iconURL: d.int.user!.displayAvatarURL()
			})
			.setThumbnail(chnl_img[channel.type])
			.setTitle(d.util.look(d.idiom, 'Información del canal', 'Channel information', 'Informações do canal'))
			.setDescription(
				`_ _ **${d.util.look(d.idiom, 'Nombre', 'Name', 'Nome')}:** \`${channel!.name}\`\n_ _ **ID:** \`${
					channel!.id
				}\`\n_ _ **${d.util.look(d.idiom, 'Categoría', 'Category', 'Categoria')}:** \`${
					d.int.guild!.channels.cache.get(channel!.parentId!)?.name
						? '#' + (await d.util.getChannel(d, channel!.parentId)).name
						: '_ _ ' + d.util.look(d.idiom, 'No tiene..', "Don't have..", 'Não tem..')
				}\``
			)
			.setFields(
				{
					name: d.util.look(d.idiom, 'Tipo del canal', 'Channel Type', 'Tipo do canal'),
					value: `_ _ ${d.util.channelType(d.idiom, channel!.type)}`
				},
				{
					name: d.util.look(d.idiom, 'Posición', 'Position', 'Posição'),
					value: `_ _ \`N° ${'position' in channel ? (channel.position + 1).toString() : '...'}\``
				},
				{
					name: 'NSFW',
					value: `_ _ ${
						'nsfw' in channel
							? channel.nsfw.toString().replace('true', Emojis.si).replace('false', Emojis.no)
							: Emojis.no
					}`
				},
				{
					name: d.util.look(d.idiom, 'Fecha de creación', 'Creation date', 'Data de criação'),
					value: `_ _ <t:${(channel.createdTimestamp! / 1000).toFixed()}:F> **(<t:${(
						channel.createdTimestamp! / 1000
					).toFixed()}:R>)**`
				},
				{
					name: d.util.look(d.idiom, 'Tópico del canal', 'Channel topic', 'Tópico do canal'),
					value: `${
						channel!.topic
							? '```' + channel!.topic.slice(0, 1000) + '```'
							: '_ _ ' + d.util.look(d.idiom, 'No tiene..', "Don't have..", 'Não tem..')
					}`
				}
			)
			.setColor(d.config.color)
			.setTimestamp()
			.setFooter({
				text: d.int.guild!.name,
				iconURL: d.int.guild!.iconURL({ forceStatic: false }) || null
			})

		d.int.reply({ embeds: [embed] })
	}
}

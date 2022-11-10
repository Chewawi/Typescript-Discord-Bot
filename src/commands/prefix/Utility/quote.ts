import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { Command, Types } from '../../../../index'
import { PrefixBuilder } from '../../../auxiliar/builders'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder()
		.setNames('quote', 'q')
		.setExplan(
			'Obtén el contenido de un mensaje usando su link (citalo).',
			'Get a message content using its link (quote it).',
			'Obtenha o conteúdo de uma mensagem usando seu link.'
		)
		.setUsage('<URL>', '<URL>', '<URL>')
		.setCooldown(3)
		.setArgs(1),
	code: async (d) => {
		const links = d.args[0].match(/channels\/[\d]+\/[\d]+\/[\d]+/g)
		if (!links?.length)
			return d.util.throwError(
				d,
				'No se encontró ningun link de mensaje valido.',
				'No valid message link was found.',
				'Nenhum link de mensagem válido foi encontrado.'
			)
		const [g, c, m] = links[0].split('/').slice(1)
		if (g !== d.message.guild!.id)
			return d.util.throwError(
				d,
				'Ese mensaje no se encuentra en este servidor.',
				'That message is not on this server.',
				'Essa mensagem não está neste servidor.'
			)
		const channel = await d.util.getChannel(d, c)
		if (!channel)
			return d.util.throwError(
				d,
				'No pude encontrar ese canal.',
				'I was unable to find that channel.',
				'Eu não consegui encontrar esse canal.'
			)
		if (!channel.isTextBased())
			return d.util.throwError(
				d,
				'No pude encontrar ese canal.',
				'I was unable to find that channel.',
				'Eu não consegui encontrar esse canal.'
			)
		const message = await d.util.getMessage(channel, m)
		if (!message)
			return d.util.throwError(
				d,
				'No pude encontrar el mensaje.',
				'I was unable to find that message.',
				'Eu não consegui encontrar esse mensagem.'
			)
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setURL(message.url)
				.setLabel(d.util.look(d.idiom, '¡Salta al mensaje!', 'Jump to message!', 'Ir para a mensagem!'))
		)
		if (message.embeds[0]) {
			d.message.channel
				.send({
					content:
						message.content?.slice(0, 1999) || `***By: (${message.author ? message.author.tag : 'Unknown.'})***\n${c}`,
					embeds: message.embeds,
					components: [row]
				})
				.catch((e) => d.util.solve(d))
		} else {
			const embed = new EmbedBuilder()
				.setAuthor({ name: message.author?.tag || 'Unknown', iconURL: message.author?.displayAvatarURL() || '' })
				.setFooter({ text: d.message.author!.tag || 'Unknown', iconURL: d.message.author!.displayAvatarURL() || '' })
				.setThumbnail(d.client.user!.displayAvatarURL())
				.setImage(message.attachments.first() ? message.attachments.first()!.url : null)
				.setTimestamp(message.createdTimestamp)
				.setColor(d.config.color)
				.setDescription(message.content ? message.content?.slice(0, 4000) : null)
			d.message.channel.send({ embeds: [embed] }).catch((e) => d.util.solve(d))
		}
	}
}

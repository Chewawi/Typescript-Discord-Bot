import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js'
import { Command, Types } from '../../../../index'
import { PrefixBuilder } from '../../../auxiliar/builders'
import { Errors } from 'aux/constants'
import axios from 'axios'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder().setNames('binary', 'bi').setArgs(1),
	code: async (d) => {
		const args = d.args.join(' ')
		if (/^[A-Za-z0-9\s]+$/.test(args) == false)
			return d.util.throwError(
				d,
				'No incluyas carácteres especiales.',
				'Do not include special characters.',
				'Não inclua caracteres especiais.'
			)
		const encoded = encodeURIComponent(args)
		const res = await axios
			.get<Record<string, any>>(`https://api.miduwu.ga/json/binary?text=${encoded}`)
			.catch((e) => null)
		if (!res?.data?.status) return d.util.throwError(d, ...Errors.api)

		const embed = new EmbedBuilder()
			.setColor(d.config.color)
			.setAuthor({
				name: d.message.author!.tag,
				iconURL: d.message.author!.displayAvatarURL()
			})
			.setTitle('Binary')
			.setThumbnail(`${d.client.user!.displayAvatarURL()}`)
			.addFields(
				{
					name: d.util.look(d.idiom, 'Entrada', 'Input', 'Entrada'),
					value: `${args}`
				},
				{
					name: d.util.look(d.idiom, 'Salida', 'Output', 'Saída'),
					value: `\`\`\`\n${res.data.data}\`\`\``
				}
			)
			.setTimestamp()

		d.message.channel.send({ embeds: [embed] })
	}
}

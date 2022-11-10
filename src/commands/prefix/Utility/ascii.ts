import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js'
import { Command, Types } from '../../../../index'
import { PrefixBuilder } from '../../../auxiliar/builders'
import { Errors } from 'aux/constants'
import axios from 'axios'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder().setNames('ascii').setCategory('Util').setArgs(1),
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
			.get<Record<string, any>>(`https://api.miduwu.ga/json/ascii?text=${encoded}`)
			.catch((e) => null)
		if (!res?.data?.status) return d.util.throwError(d, ...Errors.api)

		const embed = new EmbedBuilder()
			.setColor(d.config.color)
			.setAuthor({
				name: d.message.author!.tag,
				iconURL: d.message.author!.displayAvatarURL()
			})
			.setTitle('ASCII')
			.setThumbnail(`${d.client.user!.displayAvatarURL()}`)
			.setDescription(`\`\`\`ascii\n${'\u200b' + res.data.data}\`\`\``)
			.setTimestamp()

		d.message.channel.send({ embeds: [embed] })
	}
}

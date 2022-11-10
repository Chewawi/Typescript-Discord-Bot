import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js'
import { Command, Types } from '../../../../index'
import { PrefixBuilder } from '../../../auxiliar/builders'
import { Errors } from 'aux/constants'
import axios from 'axios'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder().setNames('reverse').setArgs(1),
	code: async (d) => {
		const args = d.args.join(' ')
		const encoded = encodeURIComponent(args)
		const res = await axios
			.get<Record<string, any>>(`https://api.miduwu.ga/json/reverse?text=${encoded}`)
			.catch((e) => null)
		if (!res?.data?.status) return d.util.throwError(d, ...Errors.api)

		const embed = new EmbedBuilder()
			.setColor(d.config.color)
			.setAuthor({
				name: d.message.author!.tag,
				iconURL: d.message.author!.displayAvatarURL()
			})
			.setTitle('Reverse')
			.setThumbnail(`${d.client.user!.displayAvatarURL()}`)
			.addFields(
				{
					name: d.util.look(d.idiom, 'Entrada', 'Input', 'Entrada'),
					value: `\`\`\`${args}\`\`\``
				},
				{
					name: d.util.look(d.idiom, 'Salida', 'Output', 'Saída'),
					value: `\`\`\`${res.data.data}\`\`\``
				}
			)
			.setTimestamp()

		d.message.channel.send({ embeds: [embed] })
	}
}

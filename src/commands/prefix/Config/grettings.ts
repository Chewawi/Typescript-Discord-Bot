import {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	ButtonStyle,
	ComponentType,
	AttachmentBuilder,
	BaseGuildTextChannel
} from 'discord.js'
import { Command, Types, Tag } from '../../../../index'
import { PrefixBuilder } from '../../../auxiliar/builders'
import { Guild } from '../../../auxiliar/models'
import { Errors, Emojis } from '../../../auxiliar/constants'
import { parser } from 'src/main'
import _ from 'lodash'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder()
		.setNames('grettings', 'gt', 'welcome', 'wlc')
		.setExplan(
			'Gestiona los triggers en el servidor.',
			'Manage the triggers on the server.',
			'Gerencie as triggers no servidor.'
		)
		.setUsage('<Sub-comando> <Opciones>', '<Subcommand> <Options>', '<Sub-comando> <Opções>')
		.setArgs(1)
		.setCooldown(15),
	code: async (d) => {
		const db = await Guild.findOne({ _id: d.message.guild!.id })

		if (d.args[0] == 'test' || d.args[0] == 'view') {
			if (!db?.grettings?.cc.length)
				d.util.throwError(
					d,
					'No has establecido las bienvenidas!',
					"You haven't set the welcomes!",
					'Você não definiu as boas-vindas!'
				)
			d.message.reply(parser.interprete(db.grettings.cc[0].content, d.message)).then(msg => msg.reply(`_ _  ${d.util.look(d.idiom, 'Canal establecido:', 'Established channel:', 'Canal estabelecido:')} <#${db.grettings.cc[0].channel}>`))
		} else if (d.args[0] == 'set') {
			const chnl = await d.util.getChannel(d, d.args[1])
			let txt = d.args.join(' ').replace('set', '').replace(d.args[1], '')

			if (!chnl) txt = d.args.join(' ').replace('set', '')

			
			const e = db?.toObject()?.grettings?.cc || []
			e.push({ name: '...', channel: !chnl ? d.message.channel!.id : chnl.id, content: txt })

			if (db) {
				db.grettings.cc = [_.last(e)]
				db.save()

				d.message.reply(`_ _ ${Emojis.si} **${d.util.look(
					d.idiom,
					'Las bienvenidas fueron alteradas con exito!',
					'Welcomes were successfully altered!',
					'As boas-vindas foram alteradas com sucesso!'
				)}**
			`)
			} else {
				Guild.create({
					_id: d.message.guild!.id,
					grettings: { cc: [_.last(e)] }
				})

				d.message.reply(`_ _ ${Emojis.si} **${d.util.look(
					d.idiom,
					'Las bienvenidas fueron alteradas con exito!',
					'Welcomes were successfully altered!',
					'As boas-vindas foram alteradas com sucesso!'
				)}**
			`)
			}
		} else if (d.args[0] == 'del' || d.args[0] == 'delete' || d.args[0] == 'remove') {
			if (!db?.grettings?.cc.length)
				d.util.throwError(
					d,
					'No has establecido las bienvenidas!',
					"You haven't set the welcomes!",
					'Você não definiu as boas-vindas!'
				)

			db.grettings.cc = []
			db.save()

			d.message.reply(
				`_ _ ${Emojis.si} **${d.util.look(
					d.idiom,
					'Las bienvenidas fueron eliminadas con exito!',
					'The welcomes were removed successfully!',
					'As boas-vindas foram removidas com sucesso!'
				)}**`
			)
		} else if (d.args[0] == 'raw') {
			if (!db?.grettings?.cc.length)
				d.util.throwError(
					d,
					'No has establecido las bienvenidas!',
					"You haven't set the welcomes!",
					'Você não definiu as boas-vindas!'
				)
			const file = new AttachmentBuilder(Buffer.from(db.grettings.cc[0].content), { name: 'raw.txt' })
			d.message.channel
				.send({
					content: '_ _ **' + d.util.look(d.idiom, 'Aqui tienes.', 'Here you have.', 'Aqui está.') + '**',
					files: [file]
				})
				.catch((e) => null)
		} else {
			const subcmds = ['set [channel] <content>', 'delete', 'raw', 'view']
			const embed = new EmbedBuilder()
				.setTitle('Grettings')
				.setDescription(
					d.util.look(
						d.idiom,
						'Una manera fácil de interactuar con las bienvenidas',
						'An easy way to interact with the grettings',
						'Uma maneira fácil de interagir com as boas-vindas'
					)
				)
				.setAuthor({ name: d.message.author.tag, iconURL: d.message.author.displayAvatarURL() })
				.setFooter({ text: d.message.guild!.name, iconURL: d.message.guild!.iconURL() || undefined })
				.setThumbnail(d.client.user.displayAvatarURL())
				.addFields({
					name: 'Subcommands:',
					value: subcmds.map((c) => `**\`${d.prefix}gt ${c}\`** `).join('\n')
				})
				.setColor(d.config.color)
			d.message.channel.send({ embeds: [embed] }).catch((e) => d.util.solve(d))
		}
	}
}

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
import { Errors } from '../../../auxiliar/constants'
import { parser } from 'src/main'
import _ from 'lodash'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder()
		.setNames('triggers', 'tg', 'auto-responder', 'ar')
		.setExplan(
			'Gestiona los triggers en el servidor.',
			'Manage the triggers on the server.',
			'Gerencie as triggers no servidor.'
		)
		.setUsage('<Sub-comando> <Opciones>', '<Subcommand> <Options>', '<Sub-comando> <Opções>')
		.setCooldown(15),
	code: async (d) => {
		const db = await Guild.findOne({ _id: d.message.guild!.id })
		const [sub, name] = [d.args[0]?.toLowerCase(), d.args[1]?.toLowerCase()]
		const tags = db?.toObject()?.triggers?.cc || []
		const getTag = (tag: string): Tag | undefined => tags.find((t) => t.name === tag?.toLowerCase())

		if (sub === 'add' || sub === 'create') {
			const content = d.args.slice(2)?.join(' ')
			if (!name?.length || !content?.length)
				return d.util.throwError(
					d,
					'Necesitamos que proporcione un nombre y un contenido.',
					'Provide us a name and a content.',
					'Você precisa nos fornecer um nome e conteúdo.'
				)
			if (name.length > 25 || 2 > name.length || content.length > 1925 || 1 > content.length)
				return d.util.throwError(
					d,
					'El tamaño está excediendo el máximo.' + '**Nombre => `25`**\n**Contenido => `1925`**',
					'The size is exceeding the maximum.' + '**Name => `25`**\n**Content => `1925`**',
					'O tamanho é superior ao máximo.' + '**Nome => `25`**\n**Conteúdo => `1925`**',
					{ bold: false }
				)
			if (/[^a-zA-Z0-9]/g.test(name))
				return d.util.throwError(
					d,
					'No se admiten caracteres especiales. RegExp permitido: **`a-zA-Z0-9`**',
					'Special characters are not allowed. RegeExp allowed: **`a-zA-Z0-9`**',
					'Caracteres especiais não são permitidos. RegExp permitido: **`a-zA-Z0-9`**',
					{ bold: false }
				)
			if (tags.length && tags.length >= 50)
				return d.util.throwError(
					d,
					'Este servidor ha alcanzado el limite de triggers.',
					'This server has reached the trigger limit.',
					'Este servidor atingiu o limite de triggers.'
				)
			const tag = getTag(name)
			if (tag)
				return d.util.throwError(
					d,
					'Este trigger ya existe.',
					'This trigger already exists.',
					'Esta trigger já existe.'
				)
			tags.push({ name: name, content: content, user: d.message.author.id })
			if (!db) {
				await Guild.create({ _id: d.message.guild!.id, triggers: { cc: tags } })
			} else {
				if (!db.triggers) db.triggers = { cc: tags }
				else db.triggers.cc = tags
				await db.save()
			}
			d.util.throwFine(
				d,
				'Tu trigger se ha añadido exitosamente.',
				'Your trigger was added successfully.',
				'Sua trigger foi adicionada com sucesso.'
			)
		} else if (sub === 'delete' || sub === 'remove') {
			const tag = getTag(name)
			if (!tag)
				return d.util.throwError(
					d,
					'Trigger no encontrado. Intenta usar `{p}tg list`.'.replace('{p}', d.prefix),
					'Trigger not found. Try using `{p}tg list`.'.replace('{p}', d.prefix),
					'Trigger não encontrado. Tente usar `{p}tg list`'.replace('p', d.prefix)
				)
			if (tag.user !== d.message.author.id && !d.message.member!.permissions.has('ManageGuild'))
				return d.util.throwError(
					d,
					'No tienes los suficientes permisos para usar este comando.',
					'You do not have enough permissions to use this command.',
					'Você não tem permissões suficientes para usar este comando.'
				)
			if (tags.filter((t) => t.name !== name).length || db!.tags?.bans?.length) {
				db!.triggers!.cc = tags.filter((t) => t.name !== name)
				await db!.save()
			} else {
				const obj = db!.toObject()
				delete obj.triggers
				await db!.replaceOne(obj)
			}
			d.util.throwFine(
				d,
				'El trigger fue eliminado exitosamente.',
				'That trigger was deleted successfully.',
				'A trigger foi eliminada com sucesso.'
			)
		} else if (sub === 'edit' || sub === 'modify') {
			const tag = getTag(name)
			if (!tag)
				return d.util.throwError(
					d,
					'Trigger no encontrado. Intenta usar `{p}tg list`.'.replace('{p}', d.prefix),
					'Trigger not found. Try using `{p}tg list`.'.replace('{p}', d.prefix),
					'Trigger não encontrado. Tente usar `{p}tg list`'.replace('p', d.prefix)
				)
			if (tag.user !== d.message.author.id && !d.message.member!.permissions.has('ManageGuild'))
				return d.util.throwError(
					d,
					'No tienes los suficientes permisos para usar este comando.',
					'You do not have enough permissions to use this command.',
					'Você não tem permissões suficientes para usar este comando.'
				)
			const content = d.args.slice(2)?.join(' ')
			if (!content?.length)
				return d.util.throwError(
					d,
					'Necesitas proporcionar un contenido.',
					'You need to provide a content.',
					'Você precisa fornecer um conteúdo.'
				)
			if (content.length > 1925 || 1 > content.length)
				return d.util.throwError(
					d,
					'El tamaño está excediendo el máximo (1925).',
					'The size is exceeding the maximum (1925).',
					'O tamanho é superior ao máximo (1925).'
				)
			const index = tags.findIndex((item) => item.name === name)
			tags[index].content = content
			db!.triggers!.cc = tags
			await db!.save()
			d.util.throwFine(
				d,
				'Tu trigger se ha modificado exitosamente.',
				'Your trigger was modified successfully.',
				'Sua trigger foi modificado com sucesso.'
			)
		} else if (sub === 'list') {
			if (!db?.triggers?.cc?.length)
				return d.util.throwError(
					d,
					'Este servidor no tiene triggers todavía.',
					'This server does not have triggers yet.',
					'Este servidor ainda não possui triggers.'
				)
			const arrs = _.chunk(db.triggers.cc, 10)
			const resolve = async (index: number) => {
				const loaded = []
				for (const t of arrs[index]) {
					const user = await d.util.getUser(t.user)
					const obj = { name: t.name, user: user ? user.tag : 'Unknown User' }
					loaded.push(obj)
				}
				return loaded
			}
			const embed = new EmbedBuilder()
				.setTitle(`Triggers [${db.triggers.cc.length}]`)
				.setColor(d.config.color)
				.setAuthor({ name: d.message.author.tag, iconURL: d.message.author.displayAvatarURL() })
				.setFooter({ text: d.message.guild!.name, iconURL: d.message.guild!.iconURL() || undefined })
				.setThumbnail(d.client.user.displayAvatarURL())
			if (arrs.length > 1) {
				const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
					new ButtonBuilder()
						.setCustomId('def_previous')
						.setStyle(ButtonStyle.Primary)
						.setLabel(d.util.look(d.idiom, 'Anterior', 'Previous', 'Anterior')),
					new ButtonBuilder()
						.setCustomId('def_next')
						.setStyle(ButtonStyle.Primary)
						.setLabel(d.util.look(d.idiom, 'Siguiente', 'Next', 'Próxima'))
				])
				let p = 0
				embed
					.setDescription(
						(await resolve(p))
							.map(
								(u) =>
									`**\` ${_.flattenDeep(arrs).findIndex((t) => t.name == u.name) + 1}. \`** **${u.name}**  (${u.user})`
							)
							.join('\n')
					)
					.setFooter({ text: `${d.util.look(d.idiom, 'Página:', 'Page:', 'Página:')} ${p + 1}/${arrs.length}` })
				d.message.channel
					.send({ embeds: [embed], components: [row] })
					.then((message) => {
						const collector = message.createMessageComponentCollector({
							componentType: ComponentType.Button,
							time: 60_000
						})
						collector.on('collect', async (i) => {
							if (i.user.id !== d.message.author.id)
								return i
									.reply({ content: d.util.look(d.idiom, ...Errors.int_author), ephemeral: true })
									.catch((e) => null) as any
							if (i.customId === 'def_previous') {
								--p
								if (!arrs[p]) p = arrs.length - 1
								i.update({
									embeds: [
										embed
											.setDescription(
												(await resolve(p))
													.map(
														(u) =>
															`**\` ${_.flattenDeep(arrs).findIndex((t) => t.name == u.name) + 1}. \`** **${
																u.name
															}**  (${u.user})`
													)
													.join('\n')
											)
											.setFooter({
												text: `${d.util.look(d.idiom, 'Página:', 'Page:', 'Página:')} ${p + 1}/${arrs.length}`
											})
									]
								}).catch((e) => null)
							} else if (i.customId === 'def_next') {
								p++
								if (!arrs[p]) p = 0
								i.update({
									embeds: [
										embed
											.setDescription(
												(await resolve(p))
													.map(
														(u) =>
															`**\` ${_.flattenDeep(arrs).findIndex((t) => t.name == u.name) + 1}. \`** **${
																u.name
															}**  (${u.user})`
													)
													.join('\n')
											)
											.setFooter({
												text: `${d.util.look(d.idiom, 'Página:', 'Page:', 'Página:')} ${p + 1}/${arrs.length}`
											})
									]
								}).catch((e) => null)
							}
						})
						collector.on('end', () => {
							const newRow = row.toJSON()
							newRow.components[0].disabled = true
							newRow.components[1].disabled = true
							message.edit({ components: [newRow] }).catch((e) => null)
						})
					})
					.catch((e) => d.util.solve(d))
			} else {
				d.message.channel
					.send({
						embeds: [
							embed.setDescription(
								(await resolve(0)).map((u, i) => `**\` ${i + 1}. \`** **${u.name}**  (${u.user})`).join('\n')
							)
						]
					})
					.catch((e) => d.util.solve(d))
			}
		} else if (sub === 'raw' || sub === 'source') {
			const tag = getTag(name)
			if (!tag)
				return d.util.throwError(
					d,
					'Trigger no encontrado. Intenta usar `{p}tg list`.'.replace('{p}', d.prefix),
					'Trigger not found. Try using `{p}tg list`.'.replace('{p}', d.prefix),
					'Trigger não encontrado. Tente usar `{p}tg list`'.replace('p', d.prefix)
				)
			if (!d.util.hasPerm(d.client.user!.id, d.message.channel as BaseGuildTextChannel, 'AttachFiles'))
				return d.util.throwError(
					d,
					'No tengo los permisos para enviar archivos en este canal.',
					'I do not have the permissions to send files in this channel.',
					'Eu não tenho as permissões para enviar archivos neste canal.'
				)
			const file = new AttachmentBuilder(Buffer.from(tag.content), { name: 'raw.txt' })
			d.message.channel
				.send({
					content: '_ _ **' + d.util.look(d.idiom, 'Aqui tienes.', 'Here you have.', 'Aqui está.') + '**',
					files: [file]
				})
				.catch((e) => null)
		} else {
			const subcmds = ['add <name> <content>', 'delete <name>', 'edit <name> <content>', 'raw <name>', 'list']
			const embed = new EmbedBuilder()
				.setTitle('Triggers')
				.setDescription(
					d.util.look(
						d.idiom,
						'Una manera fácil de interactuar con las auto repuestas',
						'An easy way to interact with the auto responder',
						'Uma maneira fácil de interagir com as respostas automáticas'
					)
				)
				.setAuthor({ name: d.message.author.tag, iconURL: d.message.author.displayAvatarURL() })
				.setFooter({ text: d.message.guild!.name, iconURL: d.message.guild!.iconURL() || undefined })
				.setThumbnail(d.client.user.displayAvatarURL())
				.addFields({
					name: 'Subcommands:',
					value: subcmds.map((c) => `**\`${d.prefix}ar ${c}\`** `).join('\n')
				})
				.setColor(d.config.color)
			d.message.channel.send({ embeds: [embed] }).catch((e) => d.util.solve(d))
		}
	}
}

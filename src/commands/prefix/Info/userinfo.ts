import { EmbedBuilder } from 'discord.js'
import { Command, Types } from '../../../../index'
import { PrefixBuilder } from '../../../auxiliar/builders'
import { Errors } from 'aux/constants'
import axios from 'axios'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder().setNames('user', 'userinfo', 'user-info'),
	//@ts-ignore
	code: async (d) => {
		const user = (await d.util.getUser(d.args[0])) || d.message.author
		const member = (await d.util.getMember(d, d.args[0])) || d.message.guild.members.cache.get(user.id)

		if (!user) d.util.throwError(d, ...Errors.user_found)

		const embed = new EmbedBuilder()
			.setTitle(d.util.look(d.idiom, 'Información del usuario', 'User Info', 'Informação do usuário'))
			.setAuthor({
				name: user.tag,
				iconURL: user.displayAvatarURL()
			})
			.setFooter({
				text: d.message.author!.tag,
				iconURL: d.message.author!.displayAvatarURL()
			})
			.setThumbnail(user.displayAvatarURL())
			.setDescription(
				`_ _ **${d.util.look(d.idiom, 'Nombre', 'Name', 'Nome')}:** \`${user!.username}\`\n_ _ **${d.util.look(
					d.idiom,
					'Apodo',
					'Nickname',
					'Nick'
				)}: \`${
					!member.nickname ? d.util.look(d.idiom, 'No tiene.', 'No nickname.', 'Não tem.') : member.nickname
				}\` **\n_ _ **${d.util.look(d.idiom, 'Tag', 'Tag', 'Tag')}:** \`${user!.tag}\`\n_ _ **ID:** \`${user!.id}\``
			)
			.setFields({
				name: `${d.util.look(d.idiom, 'Cuenta creada el', 'Account created on', 'Conta criada em')}:`,
				value: `_ _ <T:${Math.floor(user.createdTimestamp / 1000)}>`
			})
			.setColor(d.config.color)

		d.message.channel.send({ embeds: [embed] })
	}
}

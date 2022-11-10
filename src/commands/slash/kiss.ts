import {
	EmbedBuilder,
	SlashCommandBuilder,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType
} from 'discord.js'
import { Emojis, Colors } from 'aux/constants'
import { Command, Types } from '../../../index'

export const command: Command<Types.Slash> = {
	data: new SlashCommandBuilder()
		.setName('interaction')
		.setDescription('🤩')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('kiss')
				.setDescription('Kiss a user!')
				.setDescriptionLocalizations({
					'es-ES': 'Besa a un usuario!',
					'pt-BR': 'Beija um usuário!'
				})
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('User.')
						.setDescriptionLocalizations({ 'es-ES': 'Usuario.', 'pt-BR': 'Usuário.' })
						.setRequired(true)
				)
		),
	code: async (d) => {
		const user = d.int.options.getUser('user')
		const gif = d.util.gif('kiss')

		if (user == d.client.user) d.util.throwError(d, 'No, gracias u.u', 'No, thanks u.u', 'Não, obrigado u.u')
		if (user == d.int.user)
			d.util.throwError(
				d,
				'Yo que tu no lo haria. o.o',
				"I wouldn't do it if you weren't. o.o",
				'Eu não faria isso se fosse você. o.o'
			)

		const embed = new EmbedBuilder()
			.setColor(Colors.interact)
			.setDescription(
				`**${d.int.user.username}** ${d.util.look(d.idiom, 'beso a', 'kissed', 'beijou')} **${
					user.username
				}**. (~￣³￣)~`
			)
			.setImage(gif.url)
			.setFooter({ text: 'Anime: ' + gif.name })
			.setTimestamp()

		d.int.reply({ embeds: [embed] })
	}
}

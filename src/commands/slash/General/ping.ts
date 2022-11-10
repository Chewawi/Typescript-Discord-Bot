import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command, Types } from '../../../../index'

export const command: Command<Types.Slash> = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get the bot ping')
		.setDescriptionLocalizations({
			'es-ES': 'Obtén el ping del bot.',
			'pt-BR': 'Obtenha o ping do bot.'
		})
		.setDMPermission(false),
	code: async (d) => {
		d.int.reply(`Mi ping es 1000000ms omg tohru ping`).catch((e) => d.util.solve(d))
	}
}

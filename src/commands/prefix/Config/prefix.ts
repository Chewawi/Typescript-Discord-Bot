import { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, ComponentType } from 'discord.js'
import { Command, Idioms, Types } from '../../../../index'
import { PrefixBuilder } from '../../../auxiliar/builders'
import { Errors, Emojis } from '../../../auxiliar/constants'
import { Guild } from '../../../auxiliar/models'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder()
		.setNames('set-prefix', 'setprefix')
		.setExplan(
			'Cambia el prefijo preferido del bot en el servidor.',
			'Change the preferred bot prefix in the server.',
			'Altere o prefixo do bot preferido no servidor.'
		)
		.setCooldown(7)
		.setArgs(1)
		.setPerms({ type: 'user', list: ['ManageGuild'] }),
	code: async (d) => {
		const db = await Guild.findOne({ _id: d.message.guild!.id })
		const p = d.args[0]
		
		if(p == db?.prefix) return d.util.throwError(d, '¡No puedes establecer el mismo prefijo!', 'You can\'t set the same prefix!', 'Você não pode definir o mesmo prefixo!')
        if(p.length > 4) return d.util.throwError(d, '¡El prefijo no puede alcanzar el máximo de 4 carácteres!', 'The prefix cannot reach the maximum of 4 characters!', 'O prefixo não pode atingir o máximo de 4 caracteres!')

		if (db) {
			db.prefix = p
			db.save()
		} else {
			Guild.create({
				_id: d.message.guild!.id,
				prefix: p
			})
		}

		d.util.throwFine(d, '¡Prefijo establecido con éxito!', 'Prefix set successfully!', 'Prefixo definido com sucesso!')
	}
}

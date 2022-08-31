import { Command } from "../../auxiliar/interfaces/Command";
import { Data } from "../../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../../auxiliar/builders";
import * as Discord from "discord.js"
import { errors } from '../../auxiliar/constants'

export const command: Command = {
    data: new PrefixBuilder()
    .setName('set-prefix')
	  .setAliases('setprefix', 'prefix')
		.setUsage('[setprefix|set-prefix|prefix] <prefijo>', '[setprefix|set-prefix|prefix] <prefix>', '[setprefix|set-prefix|prefix] <prefixo>')
	  .setCategory('Personalización', 'Personalization', 'Personalização' )
	  .setPerms(['ManageChannels'], []),
    run: async (d: Data) => {
		if(!d.args[0]) return d.util.error(d, 'Por favor, otorge un prefijo.', 'Please provide a prefix.', 'Forneça um prefixo.')
		if(d.args[0].length >= 5) return d.util.error(d, 'No puedes colocar un prefijo con más de 4 cáracteres.', 'You cannot place a prefix with more than 4 characters.', 'Você não pode colocar um prefixo com mais de 4 caracteres.')
			
		var prefixes = [(await d.client.db.get(`${d.message.guild!.id}.prefix`) || "!"), 'uni', `<@${d.client.user!.id}>`, `<@!${d.client.user!.id}>`]
			
		if(prefixes.some(prefix => prefix.toLowerCase() == d.args[0])) return d.util.error(d, 'No puedes colocar el mismo prefijo que ya esta esta establecido.', 'You cannot set the same prefix that is already set.', 'Você não pode colocar o mesmo prefixo que já está definido.')

  	d.util.success(d, `Prefix cambiado a \`${d.args[0]}\``)

		await d.client.db.set(d.message.guild!.id+'.prefix', d.args[0], 'guilds')
	}
}
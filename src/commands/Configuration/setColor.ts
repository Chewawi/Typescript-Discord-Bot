import { Command } from "../../auxiliar/interfaces/Command";
import { Data } from "../../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../../auxiliar/builders";
import * as Discord from "discord.js"
import { errors } from '../../auxiliar/constants'

export const command: Command = {
    data: new PrefixBuilder()
    .setName('set-color')
	  .setAliases('setcolor', 'color')
		.setUsage('[setcolor|set-color|color] <hex>', '[setcolor|set-color|color] <hex>', '[setcolor|set-color|color] <hex>')
	  .setCategory('Personalización', 'Personalization', 'Personalização' )
	  .setPerms(['ManageChannels'], []),
    run: async (d: Data) => {
		if(!d.args[0]) return d.util.error(d, `Por favor, otorge un color.`, `Please provide a color.`, `Forneça uma cor.`);
		if(!d.util.isValidHex(d.args[0])) return d.util.error(d, '.', '.', '.')
			
		var color = await d.client.db.get(`${d.message.guild!.id}.prefix`) || "?"

		if(color == d.args[0]) return d.util.error(d, 'No puedes colocar el mismo color que ya esta esta establecido.', 'You cannot set the same color that is already set.', 'Você não pode colocar a mesma cor que já estava definido.')

  	d.util.success(d, `Color cambiado a \`${d.args[0]}\``)

		await d.client.db.set(d.message.guild!.id+'.color', d.args[0].replace('#', ''), 'guilds')
	}
			}
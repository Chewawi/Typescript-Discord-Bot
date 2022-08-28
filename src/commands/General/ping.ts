import { Command } from "../../auxiliar/interfaces/Command";
import { Data } from "../../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../../auxiliar/builders";
import ts from "typescript";


export const command: Command = {
    data: new PrefixBuilder()
    .setName('ping')
	  .setAliases('pi')
	  .setUsage('[ping|pi]', '[ping|pi]', '[ping|pi]')
		.setCategory('General', 'General', 'Geral')
	  .setDescription('Obten las latencias de Xiaom', 'Get Xiaom latencies.', 'Obtenha as latências do Xiaom.'),
    run: async (d: Data) => {
			let executed = Date.now()
      d.message.reply({ embeds: d.util.Embeds({
author: {
	name: 'Ping!',
	icon_url: 'https://api.miduwu.ga/image/circle?image='+d.client.user!.displayAvatarURL({ forceStatic: true })
		},
description: `_ _ ${d.util.lang(d.idiom, 'Latencia del cliente.', 'Client latency.', 'Latência do cliente.')}_ _ `,
thumbnail: 'https://api.miduwu.ga/image/circle?image='+d.client.user!.displayAvatarURL({ forceStatic: true }),
fields: [{
name: '_ _ '+d.util.emoji('Cw_Use')+' '+d.util.lang(d.idiom, 'Cliente', 'Client', 'Cliente'),
value: '`'+d.client.ws.ping+' ms` '+d.util.latEmoji(d.client.ws.ping)
}, {
name: '_ _ '+d.util.emoji('Akn_Message')+' '+d.util.lang(d.idiom, 'Mensajes', 'Messages', 'Mensagens'),
value: '`'+(executed - d.message.createdTimestamp)+' ms` '+d.util.latEmoji(Date.now() - d.message.createdTimestamp)
}, {
name: '_ _ '+d.util.emoji('icons_folder')+' '+d.util.lang(d.idiom, 'Base de datos'),
value: '`'+(await d.client.db.ping())+' ms` '+d.util.latEmoji((await d.client.db.ping()))
}],
footer: { 
text: d.message.author.tag,
icon_url: 'https://api.miduwu.ga/image/circle?image='+d.message.author.displayAvatarURL({ forceStatic: true })
},
stamp: new Date(),
color: d.util.latColor((Math.floor(d.client.ws.ping)+(Math.floor(executed-d.message.createdTimestamp)))/2)
})
				
			})
  }
}
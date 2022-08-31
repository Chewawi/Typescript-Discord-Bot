import { Command } from "../../auxiliar/interfaces/Command";
import { Data } from "../../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../../auxiliar/builders";
import * as Discord from "discord.js"
import { errors } from '../../auxiliar/constants'

export const command: Command = {
    data: new PrefixBuilder()
    .setName('set-lang')
	  .setAliases('setlang', 'lang')
		.setUsage('[setlang|set-lang]', '[setlang|set-lang]', '[setlang|set-lang]')
	  .setCategory('Personalización', 'Personalization', 'Personalização' )
	  .setPerms(['ManageChannels'], []),
    run: async (d: Data) => {

  const a = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.SelectMenuBuilder()
					.setCustomId('menu')
					.setPlaceholder(d.util.lang(d.idiom, 'Selecciona un Idioma.', 'Select a Language.', 'Selecione um idioma.'))
					.addOptions([
						{
							label: 'Español - (México).',
							description: 'Selecciona el idioma del servidor a Español Latino!',
							emoji: '🇲🇽',
							value: 'es',
						},
						{
							label: 'English - (U.S).',
							description: 'Set the server language to US English!',
							emoji: '🇺🇸',
							value: 'en',
						},
						{
							label: 'Português - (Brasil).',
							description: 'Selecione o idioma do servidor para o Português Brasileiro!',
							emoji: '🇧🇷',
							value: 'pt',
						},
					]),
			);

  const sex = d.util.Embeds({
				author: {
        	name: `${d.util.lang(d.idiom, 'Idioma del Servidor', 'Server language.', 'Linguagem do servidor.')}`,
	        icon_url: 'https://api.miduwu.ga/image/circle?image='+d.client.user!.displayAvatarURL({ forceStatic: true })
	    	},
				thumbnail: `https://api.miduwu.ga/image/circle?image=${d.client.user!.displayAvatarURL({ forceStatic: true })}`,
				description: `_ _ ${d.util.lang(d.idiom, 'Setea el idioma del servidor, seleccionando uno de los disponibles en el menu de abajo.', 'Set the language of the server, selecting one of the available ones in the menu below.', 'Defina o idioma do servidor, selecionando um dos disponíveis no menu abaixo.')}\n_ _`,
				fields: [{
					name: `${d.util.emoji('eg_member')} ${d.util.lang(d.idiom, 'Idioma actual:', 'Actual lang:', 'Linguagem atual:')}`,
					value: `_ _ __${d.idiom.replaceAll('es', 'Español - (México)').replaceAll('en', 'English - (U.S)').replaceAll('pt', 'Portugués - (Brasil)')}.__`
				}, {
					name: `${d.util.emoji('eg_discovery')} ${d.util.lang(d.idiom, 'Idiomas disponibles:', 'Available languages:', 'Linguagems disponíveis:')}`,
					value: '\`\`\`css\n# - 1. Español - (México).\n# - 2. English (U.S).\n# - 3. Portugués (Brasil).\`\`\`'
				}],
				footer: { 
          text: d.message.author.tag,
          icon_url: 'https://api.miduwu.ga/image/circle?image='+d.message.author.displayAvatarURL({ forceStatic: true })
        },
        stamp: new Date(),
				color: d.color
			})
// @ts-ignore								
	       let m = await d.message.channel.send({ embeds:sex, components:[a] }).catch() 
         const collector = m.createMessageComponentCollector({ time: 180000 }) 
// @ts-ignore
			     collector.on('collect', async(i) => { 
         if(i.customId !== 'menu') return; 
         if(!i.isSelectMenu()) return
				 if(i.user.id !== d.message.author.id) return i.reply({content: d.util.lang(d.idiom, errors.interaction_author.en, errors.interaction_author.en, errors.interaction_author.pt), ephemeral: true}) 
				 if(i.values[0] === 'en'){ 
	          await i!.deferUpdate() 
		          d.client.db.set(d.message.guild!.id+'.lang', 'en', 'guilds')
				 		  i.editReply({content:d.client.config.si+' Server language set to **English** with success!', embeds:[], components:[]}).catch() 
          } 
				 if(i.values[0] === 'es'){ 
					await i!.deferUpdate() 
					    d.client.db.set(d.message.guild!.id+'.lang', 'es', 'guilds') 
							i.editReply({content:d.client.config.emojis.si+' Idioma del sevidor establecido a **Español** con éxito!', embeds:[], components:[]}).catch() 
			    } 
         if(i.values[0] === 'pt'){ 
					await i!.deferUpdate() 
					    d.client.db.set(d.message.guild!.id+'.langu', 'pt', 'guilds') 
							i.editReply({content:d.client.config.emojis.si+' Idioma do servidor definido como **Português** com sucesso!', embeds:[], components:[]}).catch() 
			    } 
		  })
	 }
	}
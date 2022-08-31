import { Command } from "../../auxiliar/interfaces/Command";
import { Data } from "../../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../../auxiliar/builders";
import * as Discord from "discord.js"

export const command: Command = {
    data: new PrefixBuilder()
    .setName('avatar')
	  .setAliases('av')
		.setUsage('[avatar|av] <usuario>', '[avatar|av] <user>', '[avatar|av] <usuário>')
	  .setCategory('Utilidad', 'Utility', 'Útil' )
	  .setDescription('Obtenga su Avatar o el de un usuario.', 'Get your Avatar or a user\'s avatar.', 'Obtenha seu Avatar ou o avatar de um usuário.'),
    run: async (d: Data) => {
      
      let user = await d.util.getUser(d.args[0]) || d.message.author;
			let pfp = user.displayAvatarURL({ forceStatic: false, extension: 'png', size: 512})

      // @ts-ignore
      const btn = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
          .setURL(pfp)
          .setLabel(d.util.lang(d.idiom, 'Descargar avatar', 'Download avatar', 'Baixar avatar'))
          .setStyle(Discord.ButtonStyle.Link)
            )

	   	d.message.reply({ embeds: d.util.Embeds({
			author: {
        name: "Avatar!",
				icon_url: 'https://api.miduwu.ga/image/circle?image='+d.client.user!.displayAvatarURL({ forceStatic: true })
			},
			img: pfp,
			fields: [{
				name: d.util.emoji('Cw_Question')+d.util.lang(d.idiom, ' Tamaños:', ' Sizes:', ' Tamanhos:'),
				value: `\n_ _ **[\[512\]](${pfp}?size=512) · [\[1024\]](${pfp}?size=1024) · [\[2048\]](${pfp}?size=2048) · [\[4096\]](${pfp}?size=4096)**`,
			}],
			stamp: new Date(),
      footer: {
				text: d.message.author.tag,
	      icon_url: d.message.author.displayAvatarURL({forceStatic: true, extension: 'png'})
			},
			color: d.color
				// @ts-ignore
    		}), components: [btn]	})
		}
}
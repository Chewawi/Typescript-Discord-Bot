import { Command } from "../../auxiliar/interfaces/Command";
import { Data } from "../../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../../auxiliar/builders";
import * as Discord from "discord.js"

export const command: Command = {
    data: new PrefixBuilder()
    .setName('role-info')
	  .setAliases('roleinfo', 'role')
		.setUsage('[role-info|role|roleinfo] <rol>', '[role-info|role|roleinfo] <role>', '[role-info|role|roleinfo] <cargo>')
	  .setCategory('Información', 'Information', 'Informação' )
	  .setDescription('Obtenga información sobre un rol del servidor.', 'Get information about a server role.', 'Obtenha informações sobre um cargo do servidor.'),
    run: async (d: Data) => {
       let rol = await d.util.getRole(d, d.args[0]);
			 if(!rol) return d.util.throwError(d, 'Invalid', 'invalidRole')
	
       d.message.reply({
				embeds: d.util.Embeds({
					author: {
           name: `Role-Info`,
           icon_url: 'https://api.miduwu.ga/image/circle?image=' + d.client.user!.displayAvatarURL({ forceStatic: true })
		    	},
					fields: [{
						name: `_ _ ${d.util.emoji('Cw_Name')} ${d.util.lang(d.idiom, 'Nombre', 'Name', 'Nome')}`,
            value: `\`@${rol.name}\``
					},
				  {
						name: `_ _ ${d.util.emoji('Cw_ID')} ID`,
						value: `\`${rol.id}\``
					}, {
						name: `_ _ ${d.util.emoji('Cw_Date')} ${d.util.lang(d.idiom, 'Creado el', 'Created at', 'Criado em')}`,
						value: `<t:${d.util.unix(rol.createdAt)}:F>`
					}, {
		    		name: `_ _ ${d.util.emoji('Cw_List')} ${d.util.lang(d.idiom, "Separación de los demás roles:", "Separation from other roles:", "Separação de outros cargos:")}`,
		    		value: `${d.util.lang(d.idiom, `${rol.hoist ? "Verdadero" : "Falso"}`, rol.hoist ? "True" : "False", rol.hoist ? "Verdadeiro" : "Falso")}`
			    }, {
				   name: `_ _ ${d.util.emoji('Cw_PingT')} ${d.util.lang(d.idiom, "Mencionable:", "Mentionable:", "Mencionável:")}`,
			  	 value: `${d.util.lang(d.idiom, `${rol.mentionable ? "Verdadero" : "Falso"}`, rol.mentionable ? "True" : "False", rol.mentionable ? "Verdadeiro" : "Falso")}`
		    	}, {
				   name: `_ _ ${d.util.emoji('Cw_List3')} ${d.util.lang(d.idiom, "Posición (Desde abajo hasta arriba):", "Position (From bottom to top):", "Posição (De baixo para cima):")}`,
				   value: `${rol.rawPosition+1}`
		      }, {
			  	 name: `_ _ ${d.util.emoji('xim_Roles')} ${d.util.lang(d.idiom, "Permisos:", "Permissions:", "Permissões:")}`,
			  	 value: `\`\`\`\n${d.util.permission(d.idiom, rol.permissions.toArray()).join(", ")}.\`\`\``
		    	}],
					footer: { 
           text: d.message.author.tag,
           icon_url: 'https://api.miduwu.ga/image/circle?image='+d.message.author.displayAvatarURL({ forceStatic: true })
          },
          stamp: new Date(),
					color: (rol.color == "0" ? d.color : rol.color)
			  	})
			 })
		}
}
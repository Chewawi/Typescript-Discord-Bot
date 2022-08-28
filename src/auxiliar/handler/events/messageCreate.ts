import { BaseGuildTextChannel, Client, Collection } from "discord.js";
import { Command } from '../../interfaces/Command';
import { Data } from '../../interfaces/Data';
import { util } from '../../../index';
import { db } from "../../../index";
import { config } from "../../../index";
import { timeouts } from "../../../index";

export default (client: any): void => {
    client.on('messageCreate', async message => {

    if(!(message.channel instanceof BaseGuildTextChannel) && !message.channel.isThread()) return;
    if(message.author.bot) return;
     
				
		const hexToDecimal = hex => parseInt(hex, 16);

    let idiom: string = await client.db.get(message.guild!.id+'.lang', 'guilds') || 'en'
    let color: number = hexToDecimal(Number((await client.db.get(message.guild!.id+'.color', 'guilds')))) || 2105638
    let array: string[] = await client.db.get('devs')

    const commands = util.getCommands()
		let guild_prefix = await client.db.get(message.guild!.id+'.prefix', 'guilds') || '!'

		const prefixes = ['uni', `${guild_prefix}`, `<@${client.user!.id}>`, `<@!${client.user!.id}>`]
    if(!prefixes.some(p => message.content.toLowerCase().startsWith(p.toLowerCase()))) return;
    let prefix = prefixes.find(p => message.content.toLowerCase().startsWith(p.toLowerCase()))
    const args: string[] = message.content.slice(prefix!.length).trim().split(/ +/)
    const probably: string = args.shift()!.toLowerCase()

			
      // @ts-ignore
    let command: Command | undefined = commands.find(cmd => cmd.data.name === probably || cmd.data.aliases && cmd.data.aliases.includes(probably))
			if(!command) return message.reply('_ _ **El comando no fue encontrado.**')
				
			if(command.data.onlyDev && !array.includes(message.author.id)) return;
		
						prefix = guild_prefix			
    const d: Data = { message, client, args, util, /* db, config, */ idiom, color, prefix /* timeout */ }
 
			if(((command?.data.permissions) || false)){
				if(!Array.isArray(command?.data.permissions?.user)){
			command.data.permissions.user = [command?.data.permissions?.user]
				}
				if(command?.data.permissions?.user){
					
					if(command?.data.permissions?.user?.some((permission) => !(message.member.permissions.has(permission))))return d.util.error(d, `No tienes suficientes permisos. Si quieres ejecutar el comando necesitarás ${command?.data.permissions?.user?.length < 2 ? "el siguiente permiso" : "los siguientes permisos"} \`${d.util.permission("es", command?.data.permissions?.user).join(", ")}\``, `You don't have enough permissions. If you want to execute the command you will need ${command?.data.permissions?.user?.length < 2 ? "the following permission" : "the following permissions"} \`${d.util.permission("en", command?.data.permissions?.user).join(", ")}\``, `Você não tem permissões suficientes. Se você quiser executar o comando, precisará de ${command?.data.permissions?.user?.length < 2 ? "a seguinte permissão" : "as seguintes permissões"} \`${d.util.permission("pt", command?.data.permissions?.user).join(", ")}\``)
				}
				if(!Array.isArray(command?.data.permissions?.bot)){
					command.data.permissions.bot = [command?.data.permissions?.bot]
				}
				if(command?.data.permissions?.bot){
					
					if(command?.data.permissions?.bot?.some((permission) => !(message.member.permissions.has(permission))))return d.util.error(d, `No tienes suficientes permisos. Si quieres ejecutar el comando necesitarás ${command?.data.permissions?.bot?.length < 2 ? "el siguiente permiso" : "los siguientes permisos"} \`${d.util.permission("es", command?.data.permissions?.bot).join(", ")}\``, `You don't have enough permissions. If you want to execute the command you will need ${command?.data.permissions?.bot?.length < 2 ? "the following permission" : "the following permissions"} \`${d.util.permission("en", command?.data.permissions?.bot).join(", ")}\``, `Você não tem permissões suficientes. Se você quiser executar o comando, precisará de ${command?.data.permissions?.bot?.length < 2 ? "a seguinte permissão" : "as seguintes permissões"} \`${d.util.permission("pt", command?.data.permissions?.bot).join(", ")}\``)
				}
											}
			   
					 command.run(d)		
})
}
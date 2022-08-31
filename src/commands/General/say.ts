import { Command } from "../../auxiliar/interfaces/Command";
import { Data } from "../../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../../auxiliar/builders";
import ts from "typescript";


export const command: Command = {
    data: new PrefixBuilder()
    .setName('say'),
    run: async (d: Data) => {
		if(!d.args[0]) return d.util.error(d, 'No has otorgado un texto el cuál voy a decir.')
		d.message.reply({
			content: d.args.join(" "),
			allowedMentions: {
				// @ts-ignore
				repliedUser: false,
				// @ts-ignore
	      users: false,
				// @ts-ignore
				roles: false
			}
		})
		}
}
import { Command } from "../auxiliar/interfaces/Command";
import { Data } from "../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../auxiliar/builders";

export const command: Command = {
    data: new PrefixBuilder()
    .setName('pene')
	  .setPrefixed(true),
    run: async (d: Data) => {
			d.message.reply('comes') 
		}
}
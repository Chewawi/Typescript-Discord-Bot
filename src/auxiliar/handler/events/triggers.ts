import { BaseGuildTextChannel, Client, Collection } from "discord.js";
import { Command } from '../../interfaces/Command';
import { Data } from '../../interfaces/Data';
import { util } from '../../../index';

export default (client: any): void => {
    client.on('messageCreate', async message => {

    if(!(message.channel instanceof BaseGuildTextChannel) && !message.channel.isThread()) return;
    if(message.author.bot) return;

		let t = (await client.db.get(message.guild.id + '.triggers', 'guilds'))?.find(a => a?.trigger == message.content);
        if (!t) return;
        message.reply(`${t.content}`).catch(e => null);

	})
}
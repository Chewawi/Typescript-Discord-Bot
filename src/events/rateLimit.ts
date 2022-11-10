import * as djs from 'discord.js'
import { Event, TypeEvents } from '../../index'
import { Emojis } from 'aux/constants'
import { client, util } from '../main'
import colors from 'colors/safe'

export const event: Event<TypeEvents.Custom> = {
	code: () => {
		setInterval(() => {
			const guild = client.guilds.resolve('1007822115522752622')
			const channel = client.channels.cache.get('1009994680685039716') as djs.BaseGuildTextChannel

			if (!client || !client.user) {
				console.log(colors.red('Client Not Login, Process Kill'))
				process.kill(1)
			} else {
				channel.messages.fetch('1038144250682032200').then((a) =>
					a.edit({
						embeds: [
							new djs.EmbedBuilder()
								.setTitle(`${Emojis.si} | ${client.user.username} Uptime`)
								.setDescription(
									`**Parece que** \` ${client.user.username} \`  **esta online** \n Memória: \`${
										process.memoryUsage().rss / 1024 / 1024
									}\` \n Almacenamiento: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb\``
								)
								.setColor('Green')
						]
					})
				)
			}
		}, 50000)
	}
}

import * as djs from 'discord.js'
import { Event, TypeEvents } from '../../index'
import { execSync } from 'child_process'
import colors from 'colors/safe'

export const event: Event<TypeEvents.Bot> = {
	name: 'ready',
	code: (client: djs.Client) => {
		if (!client || !client.user) {
			console.log('Client Not Login, Process Kill')
			process.kill(1)
		} else {
			console.log(`Logged in as ${colors.blue(client.user!.tag)}!\n `)
		}
	}
}

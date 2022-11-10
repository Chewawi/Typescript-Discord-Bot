import * as djs from 'discord.js'
import { Data, Event, TypeEvents, Types } from '../../index'
import { config } from '../auxiliar/constants'
import { util, parser } from '../main'
import { Guild } from '../auxiliar/models'
import _ from 'lodash'

export const event: Event<TypeEvents.Bot> = {
	name: 'guildMemberAdd',
	code: async (member: any) => {
		const db = await Guild.findOne({ _id: member.guild!.id })

		if (!db?.grettings?.cc?.length) return
		// @ts-ignore
		const e = db.grettings.cc[0]

		if (!e) return
		// @ts-ignore
		const obj = parser.interprete(e.content, member)
		if (typeof obj !== 'string') {
			obj.allowedMentions = { parse: ['users'] }
			// @ts-ignore
			obj.failIfNotExists = false
		}

		member.guild.channels.cache
			// @ts-ignore
			.get(e.channel)
			.send(obj)
			.catch((e) => null)
	}
}

import * as djs from 'discord.js'
import { Data, Event, TypeEvents, Types, Tag } from '../../index'
import { config } from '../auxiliar/constants'
import { util, parser } from '../main'
import { Guild } from '../auxiliar/models'
import _ from 'lodash'

export const event: Event<TypeEvents.Bot> = {
	name: 'messageCreate',
	code: async (message: djs.Message) => {
		const db = await Guild.findOne({ _id: message.guild!.id })

		if (
			!(message.channel instanceof djs.BaseGuildTextChannel) &&
			message.channel.type !== djs.ChannelType.GuildPublicThread &&
			message.channel.type !== djs.ChannelType.GuildPrivateThread
		)
			return
		if (message.author.bot) return

		const name = message.content.trim().toLowerCase()

		if (!db?.triggers?.cc?.length) return
		const tag = db.triggers.cc.find((t) => name === String(t.name))

		if (!tag) return
		const obj = parser.interprete(tag.content, message)
		if (typeof obj !== 'string') {
			obj.allowedMentions = { repliedUser: false, parse: ['users'] }
		}

		message.reply(obj).catch((e) => null)
	}
}

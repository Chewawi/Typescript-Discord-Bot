import { Command, Types } from '../../../../index'
import { PrefixBuilder } from '../../../auxiliar/builders'
import { GOOGLE_IMG_SCRAP } from 'google-img-scrap'
import { Pagination } from 'pagination.djs'
import * as djs from 'discord.js'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder().setNames('image', 'img').setUsage('<URL>', '<URL>', '<URL>').setCooldown(3).setArgs(1),
	code: async (d) => {
		const q = ['<:pp_1:1040133011468992523>', '<:pp_2:1040132248126631946>', '<:pp_3:1040132791305777192>', '<:pp_4:1040133159154626592>']
		const pagination = new Pagination(d.message, {
	firstEmoji: q[0],
	prevEmoji: q[1],
	nextEmoji: q[2],
	lastEmoji: q[3]})
		const imgs = (
			//@ts-ignore
			await (0, GOOGLE_IMG_SCRAP)({ 
				search: d.args.join(' '),
				safeSearch: true,
				limit: 60
			})
		).result.map((image) => ({
			image
		}))

		let images = []
		imgs.forEach((x) => images.push(x.image.url))

		pagination.setImages(images)
		pagination.render()
	}
}

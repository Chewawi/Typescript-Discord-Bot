import { Event, TypeEvents } from '../../index'
import { db } from '../main'
import colors from 'colors/safe'

export const event: Event<TypeEvents.Custom> = {
	code: () => {
		db.on('ready', () => {
			console.log(colors.gray('Internal database connected.\n'))
		})
	}
}

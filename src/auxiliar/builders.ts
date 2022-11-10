import { PermissionResolvable } from 'discord.js'

interface DataPrefixBuilder {
	names: string[]
	explan: { es: string; en: string; pt: string }
	usage: { es: string; en: string; pt: string }
	note?: { es: string; en: string; pt: string }
	cooldown: number
	args: number
	isDev: boolean
	category: string
	permissions: { user: PermissionResolvable[]; bot: PermissionResolvable[] }
}

export class PrefixBuilder {
	names: string[]
	explan: { es: string; en: string; pt: string }
	usage: { es: string; en: string; pt: string }
	note?: { es: string; en: string; pt: string }
	cooldown?: number
	args: number
	isDev: boolean
	category: string
	permissions: { user: PermissionResolvable[]; bot: PermissionResolvable[] }
	constructor(data?: DataPrefixBuilder) {
		this.names = data?.names || []
		this.explan = data?.explan || { es: '', en: '', pt: '' }
		this.usage = data?.usage || { es: '', en: '', pt: '' }
		this.note = data?.note
		this.cooldown = data?.cooldown || 2000
		this.args = data?.args || 0
		this.isDev = data?.isDev || false
		this.category = ''
		this.permissions = { user: [], bot: [] }
	}
	setNames(...names: string[]): PrefixBuilder {
		this.names = names
		return this
	}
	setCategory(category: string): PrefixBuilder {
		this.category = category
		return this
	}
	setExplan(es: string, en: string, pt: string): PrefixBuilder {
		this.explan = { es, en, pt }
		return this
	}
	setUsage(es: string, en: string, pt: string): PrefixBuilder {
		this.usage = { es, en, pt }
		return this
	}
	setNote(es: string, en: string, pt: string): PrefixBuilder {
		this.note = { es, en, pt }
		return this
	}
	setCooldown(cooldown: number): PrefixBuilder {
		this.cooldown = cooldown * 1000
		return this
	}
	setArgs(args: number): PrefixBuilder {
		this.args = args
		return this
	}
	setDev(is: boolean): PrefixBuilder {
		this.isDev = is
		return this
	}
	setPerms(options: { type: 'bot' | 'user'; list: PermissionResolvable[] }): PrefixBuilder {
		this.permissions[options.type] = options.list
		return this
	}
}

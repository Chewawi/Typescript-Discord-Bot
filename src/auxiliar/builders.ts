export interface DataBuilder {
    name: string
    aliases: string[] 
	  onlyDev: boolean
    nonPrefixed: boolean
    cooldown: number
	  category: { es: string, en: string, pt: string }
    usage?: { es: string, en: string, pt: string }
    description: { es: string, en: string, pt: string }
	  permissions: { user: string[], bot: string[] }
}

export class PrefixBuilder {
    name: string
    aliases: string[]
	  onlyDev: boolean
    nonPrefixed: boolean
    cooldown: number
	  category: { es: string, en: string, pt: string }
    usage?: { es: string, en: string, pt: string }
    description: { es: string, en: string, pt: string }
    permissions: { user: string[], bot: string[] }
    constructor(data?: DataBuilder) {
        this.name = data?.name || ''
        this.aliases = data?.aliases || []
			  this.onlyDev = data?.onlyDev || false
			  this.nonPrefixed = data?.nonPrefixed || false
        this.cooldown = data?.cooldown || 0
			  this.category = data?.category || { es: '', en: '', pt: '' }
        this.usage = data?.usage
        this.description = data?.description || { es: '', en: '', pt: '' }
			  this.permissions = data?.permissions || { user: [], bot: [] }
    }
    setName(name: string): PrefixBuilder {
        this.name = name
        return this
    }
    setAliases(...aliases: string[]): PrefixBuilder {
        this.aliases = aliases
        return this
    }
    setOnlyDev(onlyDev: boolean): PrefixBuilder {
        this.onlyDev = onlyDev
        return this
		}
	 setPrefixed(nonPrefixed: boolean): PrefixBuilder {
        this.nonPrefixed = nonPrefixed
        return this
					}
    setCooldown(amount: number): PrefixBuilder {
        this.cooldown = amount
        return this
    }
	  setDescription(es: string, en: string, pt: string): PrefixBuilder {
			this.description = { es, en, pt }
			return this
		}
    setUsage(es: string, en: string, pt: string): PrefixBuilder {
        this.usage = { es, en, pt }
        return this
    }
    setCategory(es: string, en: string, pt: string): PrefixBuilder {
        this.category = { es, en, pt }
        return this
		}
	  setPerms(user: string[], bot: string[]): PrefixBuilder {
        this.permissions = { user, bot }
        return this
	  }
} 
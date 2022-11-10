import { Schema, model, SchemaTypes } from 'mongoose'
import * as TS from '../../index'

const GuildSchema = new Schema<TS.GuildModel>({
	_id: { type: String, required: true },
	prefix: String,
	idiom: String,
	tags: { bans: SchemaTypes.Array, list: SchemaTypes.Array },
	triggers: { cc: SchemaTypes.Array },
	grettings: { cc: SchemaTypes.Array }
})

export const Guild = model<TS.GuildModel>('Guild', GuildSchema)

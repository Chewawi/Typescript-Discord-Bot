import { PrefixBuilder } from "src/auxiliar/builders";
import { Util } from "src/auxiliar/utils"
import { config } from "src/auxiliar/constants"
import * as djs from "discord.js";

export interface CommandTypes {
    PrefixType: {
        data: PrefixBuilder
        code: (d: Data<Types.Prefix>) => Promise<void>;
    }
    SlashType: {
        data: djs.SlashCommandSubcommandBuilder | djs.SlashCommandSubcommandsOnlyBuilder | Omit<djs.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
        code: (d: Data<Types.Slash>) => Promise<void>;
        category?: string
    }
    InteractionType: {
        _id: string
        code: (d: Data<Types.Interaction>) => Promise<void>;
    }
}

export interface DataTypes {
    PrefixType: {
        message: djs.Message
        client: djs.Client
        args: string[]
        idiom: Idioms
        util: Util
        config: typeof config
        prefix: string
    }
    SlashType: {
        int: SlashInteraction
        client: djs.Client
        idiom: Idioms
        util: Util
        config: typeof config
    }
    InteractionType: {
        int: TokyoInteraction
        client: djs.Client
        idiom: Idioms
        util: Util
        config: typeof config
    }
}

export interface SlashInteraction extends djs.CommandInteraction {
    options: djs.CommandInteractionOptionResolver
}

export interface ThrowOptions {
    bold?: boolean
    defer?: boolean
	emoji?: boolean
}

export enum Types {
    Prefix = 'PrefixType',
    Slash = 'SlashType',
    Interaction = 'InteractionType'
}
export enum TypeEvents {
    Bot = 'BotType',
    Custom = 'CustomType'
}

export type Idioms = 'es' | 'en' | 'pt'
export type PartialErrors = [string, string, string]
export type TokyoInteraction = djs.ButtonInteraction | djs.SelectMenuInteraction | djs.ModalSubmitInteraction | djs.AutocompleteInteraction

export interface EventTypes {
    BotType: {
        name: keyof djs.ClientEvents
        code(...types: any[]): void;
    }
    CustomType: {
        code(...types: any[]): void;
    }
}

export interface Tag {
    name: string
    content: string
    user: djs.Snowflake
}

export interface Greet {
	name: string
	channel: string
	content: string
}

export interface GuildModel {
    _id: string
    prefix?: string
    idiom?: Idioms
    tags?: { bans: djs.Snowflake[], list: Tag[] }
	triggers?: { cc: Tag[] }
	grettings?: { cc: Greet[] }
}

export type Data<K extends keyof DataTypes> = DataTypes[K]
export type Command<K extends keyof CommandTypes> = CommandTypes[K]
export type Event<K extends keyof EventTypes> = EventTypes[K]

declare global {
    interface Number {
        toReadable(): string
    }
    interface String {
        toFormalCase(): string
    }
        }
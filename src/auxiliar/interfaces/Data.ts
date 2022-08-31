import { Util } from "./src/auxiliar/utils"
import { Client, Message } from "discord.js"
import { db } from "../index";
import { config } from "../index";
import { timeouts } from "../index";


// @ts-ignore
const hexToDecimal = hex => parseInt(hex, 16);

export type Idioms = 'es' | 'en' | 'pt';

let Prefix: string = db.get(message.guild!.id+'.guild', 'guilds') || '!'
let Idiom: string = db.get(message.guild!.id+'.lang', 'guilds') || 'en'
let Color: string = hexToDecimal(db.get(message.guild!.id+'.color', 'guilds')) || '2105638'

export interface Data {
client: any,
message: Message,
args: string[],
util: Util,
/* db: db,
config: config, */
idiom: Idiom,
color: Color,
prefix: Prefix,
// timeout: timeouts
}
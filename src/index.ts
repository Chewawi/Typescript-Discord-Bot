import 'dotenv/config'

import express from "express"
import { Client } from "discord.js";
import { config } from "./auxiliar/constants";
import { Util } from "./auxiliar/utils";
import { Database } from "midb"
import { Timeouts } from "timeouts.ts-dev";
import { clientReady, messageCreate, antiCrash, customTriggers } from "./auxiliar/handler/eventHandler"
import { Panel } from '@akarui/aoi.panel'

// -------> CLIENT <--------
let client: any = new Client({
    intents: config.INTENTS,
	  allowedMentions: { repliedUser: false }
})

// --------> UTIL <---------
const util = new Util(client)
util.load('./src/commands/')

// ------> DATABASE <-------
let db = new Database({
	tables: ['main', 'guilds', 'users']
})
db.start()

// ↓↓ ----> EVENTS <---- ↓↓
clientReady(client)
messageCreate(client)
antiCrash(client)
customTriggers(client)

// -------> LOGIN <--------
client.login(process.env.TOKEN)

// -------> KEEP-ALIVE <--------


// --------> TIMEOUTS <---------
const timeouts = new Timeouts({
    pulse: 10_000, 
    db: db 
})
timeouts.on('expires', async timeout => {
     if(timeout.id === 'reminder') {
          let user = await util.getUser(timeout.data.userId)
          if(!user) return;
          let guild = await client.guilds.cache.get(timeout.data.guildId)
          if(!guild) return;
          let text = `> <@${user.id}> \n ${util.emoji('xim_Clock')} ${util.lang((await db.get(guild.id+'.lang')), '**Recordatorio:**', '**Reminder:**', '**Lembrete:***')} \n\n${timeout.data.message}`
			  // @ts-ignore
          user.send(text).catch(e=>null)
          }
}) 

timeouts._init()

process.removeAllListeners('warning');

 (client as any).db = db;
 (client as any).config = config;
 (client as any).util = util;

/*const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));*/

const panel = new Panel({
    username: "e",//username for logging in
    password: "123",//password for logging in
 // @ts-ignor
    secret: require('crypto').randomBytes(16).toString("hex"),//session secret
    port: 3000,//port on which website is hosted, Not required! Default 3000
    bot: client,//your aoi.js client
    mainFile: "./src/index.js",//Main file where code is running.Not required, default taken from package.json
    commands: "./src/commands",// folder name in which all the edit needing files are there.
    interaction:"./src"//interactions folder
})
panel.loadPanel()
panel.onError()


export { client, db, util, config, timeouts }
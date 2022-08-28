import 'dotenv/config'

import express from "express"
import { Client } from "discord.js";
import { config } from "./auxiliar/constants";
import { Util } from "./auxiliar/utils";
import { Database } from "midb"
import { Timeouts } from "timeouts.ts-dev";
import { clientReady, messageCreate, antiCrash, customTriggers } from "./auxiliar/handler/eventHandler"
import DarkDashboard from 'dbd-dark-dashboard';
import DBD from "discord-dashboard";


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

let langsSettings = {};

/* --- DASHBOARD --- */
/*(async ()=>{
    let DBD = require('discord-dashboard');
    await DBD.useLicense(config.dbd_license);
    DBD.Dashboard = DBD.UpdatedClass();

    const Dashboard = new DBD.Dashboard({
        port: 80,
        client: {
            id: config.discord.client_id,
            secret: config.discord.client_secret
        },
        redirectUri: config.redirect_uri,
        domain: 'https://XiaomTSv2.soyblas.repl.co',
        bot: client,
        theme: DarkDashboard(DBD.default_configs.dbdDarkDashboard),
        settings: [
            {
                categoryId: 'setup',
                categoryName: "Setup",
                categoryDescription: "Setup your bot with default settings!",
                categoryOptionsList: [
                    {
                        optionId: 'lang',
                        optionName: "Language",
                        optionDescription: "Change bot's language easily",
                        optionType: DBD.formTypes.select({"Polish": 'pl', "English": 'en', "French": 'fr'}),
                        getActualSet: async ({guild}) => {
                            return langsSettings[guild.id] || null;
                        },
                        setNew: async ({guild,newData}) => {
                            langsSettings[guild.id] = newData;
                            return;
                        }
                    },
                ]
            },
        ]
    });
    Dashboard.init();
})();*/

// @ts-ignore
const { Panel } = require('@akarui/aoi.panel');
const panel = new Panel({
    username: "test",//username for logging in
    password: "2", //password for logging in
    secret: "aoijs",//session secret
    port: 3000,//port on which website is hosted, Not required! Default 3000
    bot: client,//your aoi.js client
    mainFile: "src/index.ts",//Main file where code is running.Not required, default taken from package.json
    commands: "src"// folder name in which all the edit needing files are there.
})
panel.loadPanel()//Load The Panel

panel.onError()

export { client, db, util, config, timeouts }
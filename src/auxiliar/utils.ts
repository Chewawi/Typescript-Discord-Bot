import { Collection, Client, Snowflake, User } from "discord.js"
import { Command } from "./interfaces/Command"
import { Data, Idioms } from "./interfaces/Data"
import { errors } from "./constants"
import { db } from "../index"
import { join } from "path";
import { readdirSync, lstatSync } from "fs";
import colors from 'colors/safe'


class Util {
	private client: Client
  public commands: Collection<string, Command>
  constructor(client: Client) {
      this.client = client    
      this.commands = new Collection()
  }
  async load(dir: string): Promise<void> {
      let mdir = process.cwd()
      let modules = readdirSync(join(mdir, dir))
		console.log('|-------------------------------------|'+`\n| `+colors.gray(`./${join(dir).replaceAll("\\","/")}`))
		
      for(const file of modules) {
          let stat = lstatSync(join(mdir, dir, file))
          if(stat.isDirectory()) { this.load(join(dir, file)); continue }
          let command = require(join(mdir, dir, file))?.command
					if(!command) return;
          delete require.cache[require(join(mdir, dir, file))]
          this.commands.set(command.data.name, command)
				console.log(`| ` + colors.green(`Command Loaded!`) + `\n| Name: ${command.data.name}           `)
				console.log('|-------------------------------------|')
				
					}
 }

	
// ----------> GET-CMDS <----------
	getCommands(): Collection<string, object> {
		return this.commands
	}
  getCommand(name: string): Collection<string, object> | object | void {
  if(!name) return this.commands
  return this.commands.get(name) || this.commands.find(cmd => cmd.data.aliases.includes(name))
} 

// ------------> LANG <------------
  lang(variable: string, spanish: string, english: string, portuguese: string): string {
   return variable?.toLocaleLowerCase() == 'es' ? spanish: variable?.toLocaleLowerCase() == 'en' ? english: variable?.toLocaleLowerCase() == 'pt' ? portuguese: english
	} 
	
// -----------> IDIOM <------------
  async getIdiom(guild: Snowflake): Promise<Idioms> {
    let result: any = await db.get(guild+'.lang', 'guilds')
    return result || 'en'
   } 

// -----------> COLOR <------------
  reboot(): void {
    try {
        process.on("exit", () => {
            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit",
            });
        });
        process.exit();
    } catch (e) {
			// @ts-ignore
        throw new Error(`[Error] No pudimos reiniciar! Error: ${e.message}`)
    }
} 


// -----------> ERROR <------------
  async error(d: Data, es: string, en: string, pt: string): Promise<void> {
        let idiom = await this.getIdiom(d.message.guild!.id);
        d.message.reply(`<:eg_wrong:980211963688779826> **`+d.util.lang(idiom,es,en,pt)+`**`);
    } 
  async getError(d: Data, type: string, err: string): Promise<any> {
		let lang = await this.getIdiom(d.message.guild!.id)
		// @ts-ignore
	 return errors[type][err][lang];
  }
	
// ----------> SUCCESS <-----------
	async success(d: Data, es: string, en: string, pt: string): Promise<void> {
        let idiom = await this.getIdiom(d.message.guild!.id);
        d.message.reply(`<:eg_right:980211728686145576> **`+d.util.lang(idiom,es,en,pt)+`**`);
    }  
	
// -----------> EMOJI <------------
	emoji(emji: string): string {
		if(!emji) return 'NONE';
		let result = this.client.emojis.cache.find(e=> e.name == emji);
//@ts-ignore
    return `<:${result!.name}:${result!.id}>`;
	}

// ----------> GET-USER <----------
	async getUser(id: any, strict: boolean = false): Promise<any> {
        if (!id) return null;
        let some_id = id.replace(/[^\d]/g, '');
        let user = (this.client.users.cache.get(some_id)) || (await this.client.users.fetch(some_id).catch(e => null));
        if (!strict && !user)
					// @ts-ignore
            user = (this.client.users.cache.find(u => u.username.includes(id)) || null);
        return user;
    } 
	
// ---------> GET-CHANNEL <---------
  async getChannel(d: Data, arg: any, strict: boolean = false): Promise<any> {
	  if (!arg) return null;     
		let id = arg.replace(/[^\d]/g, '');
    let channel = id ? d.message.guild!.channels.cache.get(id) || (await d.message.guild!.channels.fetch(id).catch(e => null)) : null;
    if (!strict && !channel) channel = d.message.guild!.channels.cache.find(r => r.name.includes(arg)) || null;
    return channel;																											 
  }

// -----------> GET-ROLE <------------
  async getRole(d: Data, arg: any, strict: boolean = false): Promise<any> {
	  if (!arg) return null;
    let id = arg.replace(/[^\d]/g, '');
   	let role = id ? d.message.guild!.roles.cache.get(id) || (await d.message.guild!.roles.fetch(id).catch(e=>null)) : null
    if(!strict && !role) role = d.message.guild!.roles.cache.find(r => r.name.includes(arg)) || null 
  	return role;																													 
	}

// -----------> EMBEDS <-----------
	Embeds(...embeds: any[]): any[] {
	var _embeds = new Array();
        for(var embed of embeds){
            _embeds.push(new (require("discord.js")).Embed({
                title: embed.title || null,
                url: embed.url || null,
                footer: embed.footer || null,
							  description: embed.description || null,
                image: {url: embed.img} || null,
                timestamp: embed.stamp || null,
                color: embed.color,
                fields: embed.fields || null,
                author: embed.author || null,
                thumbnail: {url: embed.thumbnail},
                video: embed.video || null
            }))
        }
	return _embeds
}
	
// --------> LAT-EMOJI <---------
	latEmoji(int: any): string {
  let res = '<:ping_Good:993053664895848448>'
  if(int <= 100) res = '<:ping_Good:993053664895848448>'
  if(int > 100 && int <= 199) res = '<:ping_Medium:993053665965379624>'
  if(int >= 200) res = '<:ping_Bad:993053666925879407>'
  return res
} 

// --------> LAT-COLOR <---------
  latColor(int: any): number {
  let res = 5763719 
  if(int <= 100) res = 5763719 
  if(int > 100 && int <= 199) res = 15105570 
  if(int >= 200) res = 15548997 
  return res
} 

// -------> CHANNEL-TYPE <--------
	channelType(lang: string = "es", channel: number = 0): string {
		let channeltype = `${channel}`
		if(lang == "es"){
			channeltype = channeltype?.replace("0", "Canal de Texto.")?.replace("2","Canal de Voz.")?.replace("4", "Categoría.")?.replace("5","Canal de Anuncios.")?.replace("10", "Hilo público de de canal de Anuncios.")?.replace("11","Hilo público de de canal de Texto.")?.replace("12", "Hilo privado de de canal de Texto.")?.replace("13","Escenario de voz.")?.replace("14", "Canal de Directorio de Servidores.")?.replace("15","Canal de Foro del Servidor.")
		} else if(lang == "en"){
			channeltype = channeltype?.replace("0", "Text Channel.")?.replace("2","Voice Channel.")?.replace("4", "Category.")?.replace( "5","Announcement channel.")?.replace("10", "Announcement channel public thread.")?.replace("11","Text channel public thread.")?.replace("12", "Text channel private thread.")?.replace("13","Voice Scenario.")?.replace("14", "Server Directory Channel.") ?.replace("15","Server Forum Channel.")
		} else if(lang == "pt"){
			channeltype = channeltype?.replace("0", "Canal de texto.")?.replace("2","Canal de voz.")?.replace("4", "Categoria.")?.replace( "5 ","Canal de anúncio.")?.replace("10", "Tópico público do canal de anúncio.")?.replace("11","Tópico público do canal de texto.")?.replace("12", "Texto canal privado encadeamento.")?.replace("13","Cenário de voz.")?.replace("14", "Canal do Diretório do Servidor.") ?.replace("15","Canal do Fórum do Servidor.");
		}
		return channeltype
				}

// -----------> UNIX <-------------
	unix(stamp: number): number {
	return Math.trunc(Number(stamp)/1000)
	}

// -----------> PERMS <------------
	permission(lang: string = "es", perms: any[] = []): any {
	var result: any[] = []
	if(lang == "es"){
		perms.forEach(p => {
			result.push(p?.replace("CreateInstantInvite", "Crear invitación")?.replace("SendMessagesInThreads", "Enviar mensajes en hilos")?.replace("RequestToSpeak", "Preguntar para hablar")?.replace("UseExternalEmojis", "Usar emojis externos")?.replace("StartEmbeddedActivities", "Iniciar actividades integradas")?.replace("KickMembers", "Expulsar miembros")?.replace("BanMembers", "Banear miembros")?.replace("Administrator", "Administrador")?.replace("ManageChannels", "Controlar canales")?.replace("ManageServer", "Controlar servidor")?.replace("AddReactions", "Añadir reacciones")?.replace("ViewAuditLog", "Ver el registro de Auditoría")?.replace("PrioritySpeaker", "Propiedad al hablar")?.replace("Stream", "Crear invitación")?.replace("ViewChannel", "Ver canales")?.replace("SendMessages", "Enviar mensajes")?.replace("SendTTSMessages", "Enviar TTS mensajes")?.replace("ManageMessages ", "Controlar Mensajes")?.replace("EmbedLinks", "Enviar mensajes incrustados (embeds)")?.replace("AttachFiles", "Enviar archivos")?.replace("ReadMessageHistory", "Leer el historial de mensajes")?.replace("MENTION_EVERYONE", "Mencionar everyone")?.replace("ViewGuildInsights", "Ver las perspectivas del servidor")?.replace("Connect", "Conectar a un canal de voz")?.replace("Speak", "Hablar en un canal de voz")?.replace("MuteMembers", "Silenciar en un canal de voz")?.replace("DefeanMembers", "Ensordecer miembros en un canal de voz")?.replace("MoveMembers", "Mover miembros en un canal de voz")?.replace("ChangeNickname", "Cambiar tú apodo")?.replace("ManageNicknames", "Controlar apodos")?.replace("ManageRoles", "Controlar roles")?.replace("ManageWebhooks", "Controlar webhooks")?.replace("UseApplicationCommands", "Usar comandos de barra")?.replace("RequestToSpeak", "Pedir permisos para hablar")?.replace("ManageEvents", "Crear eventos")?.replace("ManageThreads", "Controlar hilos")?.replace("CreatePublicThreads", "Crear hilos públicos")?.replace("CreatePrivateThreads", "Crear hilos privados")?.replace("UseExternalStickers", "Usar stickers externos")?.replace("SendMessagesInThreads", "Enviar mensajes en hilos")?.replace("UseEmbeddedActivities", "Usar actividades en canales de voz")?.replace("ModerateMembers", "Moderar a miembros")?.replace("UsePublicThreads", "Usar hilos públicos")?.replace("UsePrivateThreads", "Usar hilos privados")?.replace("UseVAD", "Usar detección de actividad de voz"))
		})
	}
	if(lang == "en"){
		perms.forEach(p => {
			result.push(p?.replace("CreateInstantInvite", "Create Invitation")?.replace("SendMessagesInThreads", "Send messages in threads")?.replace("RequestToSpeak", "Ask to Speak")?.replace ("UseExternalEmojis", "Use External Emojis")?.replace("StartEmbeddedActivities", "Start Embedded Activities")?.replace("KickMembers", "Kick Members")?.replace("BanMembers", "Ban Members")?.replace("Administrator", "Administrator")?.replace("ManageChannels", "Control Channels")?.replace("ManageServer", "Control Server")?.replace("AddReactions", "Add Reactions ")?.replace("ViewAuditLog", "View Audit Log")?.replace("PrioritySpeaker", "Property when speaking")?.replace("Stream", "Create Invitation")?.replace("ViewChannel", "View Channels")?.replace("SendMessages", "Send Messages")?.replace("SendTTSMessages", "Send TTS Messages")?.replace("ManageMessages ", "Manage Messages")?.replace("EmbedLinks", "Send embedded messages (embeds)")?.replace("AttachFiles", "Send r files")?.replace("ReadMessageHistory", "Read message history")?.replace("MENTION_EVERYONE", "Mention everyone")?.replace("ViewGuildInsights", "View server insights")?.replace("Connect", "Connect to a voice channel")?.replace("Speak", "Speak on a voice channel")?.replace("MuteMembers", "Mute on a voice channel")?.replace("DefeanMembers", "Deafen members in a voice channel")?.replace("MoveMembers", "Move members in a voice channel")?.replace("ChangeNickname", "Change your nickname")?.replace("ManageNicknames", "Control nicknames")?.replace("ManageRoles", "Control roles")?.replace("ManageWebhooks", "Control webhooks")?.replace("UseApplicationCommands", "Use commands slash")?.replace("RequestToSpeak", "Request permissions to speak")?.replace("ManageEvents", "Create events")?.replace("ManageThreads", "Control threads")?.replace("CreatePublicThreads", "Create public threads")?.replace("CreatePrivateThreads", "Create private threads")?.replace("UseExter nalStickers", "Use external stickers")?.replace("SendMessagesInThreads", "Send messages in threads")?.replace("UseEmbeddedActivities", "Use activities in voice channels")?.replace("ModerateMembers", "Moderate members")?.replace("UsePublicThreads", "Use public threads")?.replace("UsePrivateThreads", "Use private threads")?.replace("UseVAD", "Use voice activity detection"))
		})
  }
	if(lang == "pt"){
		perms.forEach(p => {
			result.push(p?.replace("CreateInstantInvite", "Create Invitation")?.replace("SendMessagesInThreads", "Enviar mensagens em tópicos")?.replace("RequestToSpeak", "Pedir para falar")?.replace ("UseExternalEmojis", "Usar Emojis Externos")?.replace("StartEmbeddedActivities", "Iniciar Atividades Incorporadas")?.replace("KickMembers", "Kick Members")?.replace("BanMembers", "Ban Members")?.replace("Administrador", "Administrador")?.replace("ManageChannels", "Control Channels")?.replace("ManageServer", "Control Server")?.replace("AddReactions", "Add Reactions")?.replace("ViewAuditLog", "Visualizar log de auditoria")?.replace("PrioritySpeaker", "Propriedade ao falar")?.replace("Stream", "Criar convite")?.replace("ViewChannel", "Ver Canais")?.replace("SendMessages", "Enviar Mensagens")?.replace("SendTTSMessages", "Enviar Mensagens TTS")?.replace("ManageMessages ", "Gerenciar Mensagens")?.replace("EmbedLinks", "Enviar mensagens incorporadas (incorporações)")?.replace("AttachFiles", "Enviar r files")?.replace("ReadMessageHistory", "Ler o histórico de mensagens")?.replace("MENTION_EVERYONE", "Mencionar todos")?.replace("ViewGuildInsights", "Ver informações do servidor")?.replace("Conectar", "Conectar a um canal de voz")?.replace("Falar", "Falar em um canal de voz")?.replace("MuteMembers", "Silenciar em um canal de voz")?.replace("DefeanMembers", "Ensurdecer membros em um canal de voz")?.replace("MoveMembers", "Mover membros em um canal de voz")?.replace("ChangeNickname", "Alterar seu apelido")?.replace("ManageNicknames", "Controlar apelidos")?.replace("ManageRoles", "Controlar funções")?.replace("ManageWebhooks", "Controlar webhooks")?.replace("UseApplicationCommands", "Usar comandos barra")?.replace("RequestToSpeak ", "Solicitar permissão para falar")?.replace("ManageEvents", "Criar eventos")?.replace("ManageThreads", "Threads de controle")?.replace("CreatePublicThreads", "Criar threads públicos")?.replace("CreatePrivateThreads", "Criar threads privados")?.replace("UseExter nalStickers", "Usar adesivos externos")?.replace("SendMessagesInThreads", "Enviar mensagens em tópicos")?.replace("UseEmbeddedActivities", "Usar atividades em canais de voz")?.replace("ModerateMembers", "Moderar membros")?.replace("UsePublicThreads", "Usar encadeamentos públicos")?.replace("UsePrivateThreads", "Usar encadeamentos privados")?.replace("UseVAD", "Usar detecção de atividade de voz"))
		})
	}
	return result
	}

// ---------> THROW-ERR <----------
  async throwError(d: Data, type: string, err: string): Promise<void> {
		let lang = await this.getIdiom(d.message.guild!.id)
		// @ts-ignore
		if(!type || !err) return d.message.reply(`_ _ <:eg_wrong:980211963688779826> **${d.util.lang(lang, 'Ocurrio un error genérico, lo siento.', 'A generic error occurred, sorry.', 'Ocorreu um erro genérico, desculpe.')}**`)
		// @ts-ignore
    d.message.reply('_ _ <:eg_wrong:980211963688779826> **'+errors[type][err][lang]+'**')
  } 

	isValidHex(hex: string): boolean {
    if(!hex || typeof hex !== 'string') return false
    const code = hex.replace(/(#)/g, '')
    const regex = new RegExp("^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
    return regex.test(code)
	}
}

export { Util }
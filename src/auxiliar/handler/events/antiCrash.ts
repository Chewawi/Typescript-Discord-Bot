import { Client } from "discord.js"
import colors from "colors/safe"

export default (c: Client): void => { 
	const client = c
	process.on('unhandledRejection', async(reason, p) => {
 console.log(colors.yellow(' [antiCrash]')+colors.gray(' :: ')+colors.red('Unhandled Rejection/Catch'));
 console.log(reason, p);
		const channel = await client.channels!.fetch("997350676109733918")
			// @ts-ignore
			channel!.send({
			embeds: [
				{
					title: `New error has occurred`,
					fields: [{
						name: "Type:",
						value: `unhandledRejection`,
					}, {
						name: "Reason:",
						value: `\`\`\`js\n${reason}\`\`\``
					}],
					color: 15548997,
					timestamp: new Date()
				}
			]
		})
 });
 process.on("uncaughtException", async(err, origin) => {
 console.log(colors.yellow(' [antiCrash]')+colors.gray(' :: ')+colors.red('Uncaught Exception/Catch'));
 console.log(err, origin);
	const channel = await client.channels!.fetch("997350676109733918")
			// @ts-ignore
			channel.send({
			embeds: [
				{
					title: `New error has occurred`,
					fields: [{
						name: "Type:",
						value: `uncaughtException`,
					}, {
						name: "Origin:",
						value: `\`\`\`js\n${origin}\`\`\``
					}],
					color: 15548997,
					timestamp: new Date
				}
			]
		})
 }); 
	
process.on('uncaughtExceptionMonitor', async(err, origin) => {
 console.log(colors.yellow(' [antiCrash]')+colors.gray(' :: ')+colors.red('Uncaught Exception/Catch')+colors.gray(' (MONITOR)'));
 console.log(err, origin);
	 const channel = await client.channels!.fetch("997350676109733918")
			// @ts-ignore
			channel.send({
			embeds: [
				{
					title: `New error has occurred`,
					fields: [{
						name: "Type:",
						value: `uncaughtExceptionMonitor`,
					}, {
						name: "Origin:",
						value: `\`\`\`js\n${origin}\`\`\``
					}],
					color: 15548997,
					timestamp: new Date
				}
			]
		})
 });
/* process.on('multipleResolves', async(type, promise, reason) => {
 console.log(' [antiCrash] :: Multiple Resolves');
const channel = await client.channels!.fetch("997350676109733918")
			// @ts-ignore
			channel.send({
			embeds: [
				{
					title: `New error has occurred`,
					fields: [{
						name: "Type:",
						value: `multipleResolves`,
					}, {
						name: "Reason:",
						value: `\`\`\`js\n${reason}\`\`\``
					}],
					color: 0,
					timestamp: new Date
				}
			]
		})
 });*/
	 var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g; 
	// @ts-ignore
 client.on("warn", e => { 
   console.log(colors.yellow(e))
 }); 
	// @ts-ignore
 client.on("error", e => {
     // @ts-ignore
   console.log(colors.red(e))
 }); 

console.log(colors.gray("\n[ANTICRASH]: Enabled\n")) 

let y = process.openStdin()
y.addListener('data', res => {
    let x = res.toString().trim().split(/ +/g)
    const channel = client.channels.cache.get("997350676109733918")
	// @ts-ignore
    channel.send(`${x.join(' ')}`);
})
	
}

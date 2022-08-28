import { Command } from "../auxiliar/interfaces/Command";
import { Data } from "../auxiliar/interfaces/Data";
import { PrefixBuilder } from "../auxiliar/builders";
import ts from "typescript";


export const command: Command = {
    data: new PrefixBuilder()
    .setName('eval')
	  .setAliases('e')
    .setOnlyDev(true),
    run: async (d: Data) => {
	 	 var _async = d.message.content.includes("--async")
	  	if(_async){
			 d.args.pop()
			 }
			
		    let input = d.args.join(' ')	
			
        // array o null
let depth = input.match(/--depth [\d]{1,2}/gim)
let a = 0
if(depth) {
    let uwu = depth[0] // --depth X
    a = Number(uwu.split(' ')?.[1])
    // ahora quitamos ese depth de nuestro code a evaluar
    input = input.replace(uwu, '')
} 

     
        let tiempo1 = Date.now();
        try {
            let result: any = _async ? await eval(`(async() => { ${ts.transpile(input)} })()`) : await eval(ts.transpile(input))
            if (typeof result === 'object') {
                result = require('util').inspect(result, { depth: a });
            } else if (typeof result === 'function') {
                result = result.toString()
            } else {
                result = require('util').inspect(result);
            }
            result = result.replaceAll(d.client.token, '[UNI_TOKEN]')
     
    	let tipo = typeof result;

            d.message.reply({content: `\`\`\`ts\n${result.substring(0,1700) == result ? result : result.substring(0,1700)+`\n..`}\`\`\``})
        } catch(err: any) {
            d.message.reply(`\`\`\`ansi\nError:\n${err?.toString()}\`\`\``)
							}
    }
}

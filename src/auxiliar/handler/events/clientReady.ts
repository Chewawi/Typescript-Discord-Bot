import { Client } from 'discord.js';
import { table } from 'table';
import colors from 'colors/safe'

export default (client: Client): void => {
	client.once('ready', async () => {
		var _total_users = 0;
		for(var _guild of client.guilds.cache.toJSON()){
		        try{
		            var _members = (await _guild.members.fetch()).size
		            await (_total_users += _members);
		        } catch(_error) {
							// @ts-ignore
		            console.log(`${colors.yellow("[CLIENT]: ")} Failed to cache ${_guild.name} users with: ${colors.red(_error.message)}`);
		        };
		    };
		
		const data = [
      [colors.yellow('[USERS]'), `${colors.green(`${_total_users}`)}`],
			[colors.yellow('[GUILDS]'), `${colors.green(`${client.guilds!.cache.size}`)}`]
    ];

    const config = {
  columnDefault: {
    width: 10,
  },
  header: {
    alignment: 'center',
    content: colors.green('CLIENT CONNECTED!'),
  },
}
		// @ts-ignore
		console.log(table(data, config))
	})
}
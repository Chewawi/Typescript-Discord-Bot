import { Command, Types } from '../../../../index'
import { PrefixBuilder } from '../../../auxiliar/builders'

export const command: Command<Types.Prefix> = {
	data: new PrefixBuilder()
		.setNames('reload', 'update', 'reboot', 'r')
		.setExplan(
			'Recara la carpeta de comandos del código fuente del bot.',
			'Reload the commands folder from the bot source.',
			'Recarregue a pasta de comandos da fonte do bot.'
		)
		.setDev(true),
	code: async (d) => {
		d.util.reset()
		d.util
			.load('./src/commands')
			.then(() => {
				d.util.handleSlashes()
				d.util.throwFine(d, 'Listo mi amor', 'Listo mi amor', 'Listo mi amor')
			})
			.catch((e) => {
				const rr = '```js\n{err}```'.replace('{err}', e.message)
				d.util.throwError(d, `Error: ${rr}`, `Error: ${rr}`, `Error: ${rr}`)
			})
	}
}

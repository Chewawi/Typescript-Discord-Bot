import { ColorResolvable, GatewayIntentBits as I, Partials } from 'discord.js'
import { PartialErrors } from '../../index'

export const config = {
	prefix: '?',
	intents: [I.MessageContent, I.GuildMessages, I.GuildMembers, I.GuildMessageReactions, I.GuildVoiceStates, I.Guilds],
	token: process.env.TOKEN as string,
	partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User, Partials.Reaction],
	color: 0x202122,
	invite: 'https://top.gg/bot/778085817510789120/invite',
	discord: 'https://discord.com/invite/3pT2WHG9EG',
	devs: ['852970774067544165']
}

export const Errors: Record<
	'api' | 'user_found' | 'channel_found' | 'role_found' | 'int_author' | 'missing_perms',
	PartialErrors
> = {
	api: [
		'No he podido conectarme a la API en este momento.',
		'I was unable to connect to the API at this time.',
		'Eu não consegui me conectar à API neste momento.'
	],
	user_found: [
		'El usuario proporcionado no fue encontrado.',
		'The user provided was not found.',
		'O usuário fornecido não foi encontrado.'
	],
	channel_found: [
		'El canal proporcionado no es válido o no fue encontrado.',
		"The channel provided isn't valid or was not found.",
		'O canal fornecido não é válido ou não foi encontrado.'
	],
	role_found: [
		'El rol proporcionado no existe o no fue encontrado.',
		"The role provided doesn't exist or was not found.",
		'O cargo fornecido não existe ou não encontrado.'
	],
	int_author: ['Esta interacción no es para ti.', "This interaction isn't for you.", 'Essa interação não é para você.'],
	missing_perms: [
		'No tienes los suficientes permisos para usar este comando.',
		"You don't have enough permissions to use this command.",
		'Você não tem permissões suficientes para usar este comando.'
	]
}

export const Emojis = {
	heart: '<:TT_08:904901776887672892>',
	no: '<:eg_wrong:1029412572899836055>',
	si: '<:eg_right:1029412506743091280>',
	nums: ['<:n_one_1:1039169376315789332>', '<:n_two_2:1039169392166060052>', '<:n_three_3:1039169408918110248>', '<:n_four_4:1039169426215419984>', '<:n_five_5:1039169443172986930>', '<:n_six_6:1039169520482402354>', '<:n_seven_7e:1039169459757264926>', '<:n_eight_8:1039169476765159434>']
}

export const Colors = {
	interact: 0x303136,
	anime: {
		kiss: ''
	}
}

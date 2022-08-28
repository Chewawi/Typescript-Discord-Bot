import { GatewayIntentBits as I } from "discord-api-types/v10"

export const config = {
	"TOKEN": "OTI0MTk4NzI3NTMzNjAwNzk4.GvWVQK.34wQhX1z8fUbhf37j3Jb7wwf-zIY0nKpmQtGR8",
	"INTENTS": 34815 as I,
	"PARTIALS": "",

	"emojis": {
    "si": "<:eg_right:980211728686145576>",
    "no": "<:eg_wrong:980211963688779826>"
},
	"dbd_license": 'e81d544e-2af8-4887-90d2-3dd1ae601b18',
  "redirect_uri": 'https://XiaomTSv2.soyblas.repl.co/discord/callback',
  "discord": {
     "bot_token": 'OTI0MTk4NzI3NTMzNjAwNzk4.GvWVQK.34wQhX1z8fUbhf37j3Jb7wwf-zIY0nKpmQtGR8',
     "client_id": '924198727533600798',
     "client_secret": 'Wi7NxPycFQG1SUlKmzT0sscjRos8WsTS',
		}
}

	
export const errors = {
	"Args": {
		"argsCheck": {
			"es": "Otorge para",
		  "en": "",
		  "pt": ""
		}
	},
	"Invalid": {
	  "invalidRole": {
		  "es": "El rol otorgado no es válido!",
		  "en": "The role granted is not valid!",
	  	"pt": "O cargo concedido não é válido!"
	  },
		"invalidChannel": {
      "es": "El canal otorgado no es válido!",
	    "en": "The granted channel is not valid!",
			"pt": "O canal concedido não é válido!"
	  }
	},
	"interaction_author": { 
        "es": 'La interacción no es para ti.', 
        "en": 'The interaction is not for you.', 
        "pt": 'A interação não é para você.' 
	}
}


/* {
     "es": "",
		  "en": "",
		  "pt": ""
	}*/
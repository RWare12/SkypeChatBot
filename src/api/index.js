import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
var builder = require('botbuilder');
const fetch = require('node-fetch');


// export function pushNotif(req,res) {

// 	var body = {
// 		"type": "message",
// 		"from": {
// 			"id": "28:4b21f634-f354-4052-bd20-197d723b147f",
// 			"name": "RalphisBot"
// 		},
// 		"conversation": {
// 			"id": "29:1ZP3jLbRNeWZC1By3zD544UsrMXbaHJsOMl-GCRtJCrEmTfhMMDfpHJwpfQhgJV8N",
// 			"name": "skype"
// 		},
// 		"recipient": {
// 			"id": "29:1hyAw4bRWYopy7NVSvwZMLS818XJUezpScqGM8puyadEBdIeLJt3efxT3il1Ia-nS",
// 			"name": "John Pastor"
// 		},
// 		"text": "My bot's reply",
// 		"replyToId": "29:1hyAw4bRWYopy7NVSvwZMLS818XJUezpScqGM8puyadEBdIeLJt3efxT3il1Ia-nS"
// 	 };
// 	fetch('https://smba.trafficmanager.net/apis/v3/conversations/1hyAw4bRWYopy7NVSvwZMLS818XJUezpScqGM8puyadEBdIeLJt3efxT3il1Ia-nS/', { 
// 		method: 'POST',
// 		body:    JSON.stringify(body),
// 		// Authorization: "Bearer ACCESS_TOKEN",
// 		headers: { 'Content-Type': 'application/json' },
// 	})
// 		.then(res => res.json())
// 		.then(json => console.log(json));
// 	res.json({"fulfillmenttext":"push notif test"});
// }

// var builder = require('botbuilder');
// var connector = new builder.ChatConnector({
// 	appId: '4b21f634-f354-4052-bd20-197d723b147f',
// 	appPassword: 'kREBLB54471*[]pkhqtwTB;'
//   });
  
// var bot = new builder.UniversalBot(connector);



export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	// RalphisBot
	api.post('/skypebot', (req, res) => {
		const data = req.body.queryResult.action;
		let num1 = req.body.queryResult.parameters.number;
		let num2 = req.body.queryResult.parameters.number1;
		let conversationId = req.body.originalDetectIntentRequest.payload.data.address.conversation;
		let channelId = 'skype';
		let serviceURL = req.body.originalDetectIntentRequest.payload.data.address.serviceUrl;
		let addressId = req.body.originalDetectIntentRequest.payload.data.address.id
		let botId = req.body.originalDetectIntentRequest.payload.data.address.bot;
		let user = req.body.originalDetectIntentRequest.payload.data.address.user;
		let address = {addressId, channelId, user, conversationId, bot : botId, serviceURL};
		let skypeid = req.body.originalDetectIntentRequest.payload.data;
		var body = req.body.originalDetectIntentRequest.payload;
		console.log(body);
		// console.log(data);
		// console.log(addressId);
		console.log(conversationId);
		
		switch(data){
			case 'test':
				res.json({"fulfillmentText" : "This is a test"});
				break;

			case 'add' :
				let sum = num1 + num2;
				res.json({"fulfillmentText" : `the sum is ${sum}`});
				break;
			
			case 'quick':
				res.json({"fulfillmentMessages": [{
					"quickReplies": {
					"title": "Hello",
					"quickReplies": "Aigooooo"
					},
					"platform": "SKYPE"
					}]
				})
				break;

			case 'cards':
				res.json({"fulfillmentMessages" :[{
					"card": {
					"title": "Aigooooo",
					"subtitle": "Aigooooo",
					"imageUri": ["https://i.imgur.com/R4KGxPC.png"],
					"buttons": [
						{
						"text": "Aigooooo"
						}
					]
					},
					"platform": "SKYPE"
					}] 
				});
				break;

			case 'input.unknown':
				res.json({"fulfillmentText" : "I am your... FATHER!"});
				break;

			case 'pushnotif':
				// pushNotif(req,res);
				var connector = new builder.ChatConnector({
					// appId: '4b21f634-f354-4052-bd20-197d723b147f',
					// appPassword: 'kREBLB54471*[]pkhqtwTB;',
					appId: process.env['4b21f634-f354-4052-bd20-197d723b147f'],
					appPassword: process.env['kREBLB54471*[]pkhqtwTB;']
					});
				var bot = new builder.UniversalBot(connector);

				var msg = new builder.Message().address(address);
				msg.text("This is a test");
				msg.textLocale('en-US');
				bot.send(msg);

				res.json({"fulfillmentText" : "Message sent!"});
				
				break;
		}

	});

	return api;
}

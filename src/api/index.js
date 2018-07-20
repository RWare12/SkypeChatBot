import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
var builder = require('botbuilder');
const fetch = require('node-fetch');

// connection to chat bot. Requires MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD. 
var connector = new builder.ChatConnector({
	appId: '4b21f634-f354-4052-bd20-197d723b147f',
	appPassword: 'kREBLB54471*[]pkhqtwTB;',
	});
var bot = new builder.UniversalBot(connector);


export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// callback url for 'RalphisBot'
	api.post('/skypebot', (req, res) => {
		const data = req.body.queryResult.action;
		let num1 = req.body.queryResult.parameters.number;
		let num2 = req.body.queryResult.parameters.number1;
		var body = req.body.originalDetectIntentRequest.payload;
		console.log(body);
		// console.log(data);
		// console.log(addressId);
		
		switch(data){
			// Enter 'I am the doom bringer' of test intent to trigger
			case 'test':
				res.json({"fulfillmentText" : "Omae wa mou Shinderu!"});
				break;
			// Simple math addition will trigger example.. "1 + 1"
			case 'add' :
				let sum = num1 + num2;
				res.json({"fulfillmentText" : `the sum is ${sum}`});
				break;
			// Type "quick" for quickreplies to trigger
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
			// Type "Aigooooo" for cards to trigger
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

			// type 'push' for procative message(a.k.a. push notification in facebook) to trigger
			case 'pushnotif':
				let channelId = 'skype';
				let conversation = req.body.originalDetectIntentRequest.payload.data.address.conversation;
				let serviceUrl = req.body.originalDetectIntentRequest.payload.data.address.serviceUrl;
				let id = req.body.originalDetectIntentRequest.payload.data.address.id
				let botDetails = req.body.originalDetectIntentRequest.payload.data.address.bot;
				let user = req.body.originalDetectIntentRequest.payload.data.address.user;
				let address = {id, channelId, user, conversation, botDetails, serviceUrl};
				var msg = new builder.Message().address(address);
				msg.text("This is a proactive message/push notification");
				msg.textLocale('en-US');
				bot.send(msg);
				console.log(address);
				break;
		}

	});

	return api;
}

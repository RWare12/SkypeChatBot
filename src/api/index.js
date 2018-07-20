import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
	  appId: '14c384d2-831f-404c-847f-803879cffc5c',
	  appPassword: 'hrdLVQT4628=emhmOJK0]^%'
});

var bot = new builder.UniversalBot(connector);

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	api.post('/SkypeChatbot', (req, res) => {
		switch (req.body.queryResult.action) {
			case 'proactive.message':
				let channelId = 'skype';
				let id = req.body.originalDetectIntentRequest.payload.address.id;
				var user = req.body.originalDetectIntentRequest.payload.address.user;
				let conversation = req.body.originalDetectIntentRequest.payload.address.conversation;
				let botDetails = req.body.originalDetectIntentRequest.payload.address.bot;
				let serviceUrl = req.body.originalDetectIntentRequest.payload.address.serviceUrl;
				let address = {id, channelId, user, conversation, botDetails, serviceUrl};
				var msg = new builder.Message().address(address);
				msg.text('pushed message');
				msg.textLocale('en-US');
				bot.send(msg);
				return res.json({'fulfillmentText':'test output'});
				break;
			case 'dog.get':
				return res.json({'fulfillmentMessages': [
					{
						'card': {
							'title': 'Frisbee Doge',
							'subtitle': 'so sad',
							'imageUri': 'http://i.imgur.com/7bCZzdm.png'
						},
						'platform': 'SKYPE'
					}
				]});
				break;
			case 'help.help':
				return res.json({'fulfillmentMessages': [
					{
						'quickReplies': {
							'title': 'Here are some things you can do with this bot:',
							'quickReplies': [
								'tell me a joke',
								'dog',
								'push'
							]
						},
						'platform': 'SKYPE'
					}
				]});
				break;
		}
	});

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}

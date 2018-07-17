import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	api.post('/SkypeChatbot', (req, res) => {
		switch (req.body.queryResult.action) {
			case 'test.test':
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
								'Tell me a joke',
								'dog'
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

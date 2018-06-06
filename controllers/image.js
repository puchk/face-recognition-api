const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'ec6cbdadc3b14481a4fd94d91b9c7ae5'
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('api not working'))
}

const handleImage = (req, res, knex) => {
	const {id} = req.body;
	knex('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('doesn\'t receive entries count'))
}

module.exports = {
	handleImage,
	handleApiCall
}
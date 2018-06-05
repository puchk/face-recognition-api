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
	handleImage: handleImage
}
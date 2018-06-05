const handleSignIn = (req, res, knex, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('empty field');
	}
	knex.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return knex.select('*').from('users')
					.where('email', '=', email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong info')
			}
		})
		.catch(err => res.status(400).json('wrong information'))
}

module.exports = {
	handleSignIn: handleSignIn
}
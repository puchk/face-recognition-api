const handleRegister = (req, res, knex, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('empty field');
	}
	const hash = bcrypt.hashSync(password);
		knex.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					}).then(response => {
						res.json(response[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		
			.catch(err => res.status(400).json(err));
}

module.exports = {
	handleRegister: handleRegister
};
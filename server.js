const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const db = {
	users: [
		{
			id: '12345',
			name: 'Tom',
			email: 'tom@email.com',
			password: 'abcde',
			entries: 0,
			joined: new Date()
		},
		{
			id: '23435',
			name: 'Bob',
			email: 'bob@email.com',
			password: '123456',
			entries: 0,
			joined: new Date()
		}
	]
}

app.get('/', (req, res) => {
	res.send(db.users);
});

app.post('/signin', (req, res) => {
	if (req.body.email === db.users[0].email && req.body.password === db.users[0].password) {
		res.json('works');
	} else {
		res.status(400).json('error');
	}
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	db.users.push({
		id: '32423',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(db.users[db.users.length-1]);
});

app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
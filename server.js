const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const db = {
	users: [
		{
			id: '1',
			name: 'Tom',
			email: 'tom@email.com',
			password: 'abcde',
			entries: 0,
			joined: new Date()
		},
		{
			id: '2',
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

app.get('/profile/:id', (req, res) =>{
	const {id} = req.params;
	let foundUser = false;
	db.users.forEach(user => {
		if (user.id === id) {
			foundUser = true;
			return res.json(user);
		} 		
	});
	if (!foundUser) {
			res.status(404).json('user not found');
		}
});

app.put('/image', (req, res) => {
	const {id} = req.body;
	let foundUser = false;
	db.users.forEach(user => {
		if (user.id === id) {
			foundUser = true;
			user.entries++;
			return res.json(user.entries);
		} 		
	});
	if (!foundUser) {
			res.status(404).json('user not found');
		}
});

app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
const PORT = 3000;

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    // NEED TO INSERT PW
    password : '',
    database : 'face_recognition'
  }
});

knex.select('*').from('users').then(data => {
	console.log(data);
});

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

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send(db.users);
});

app.post('/signin', (req, res) => {
	if (req.body.email === db.users[0].email && req.body.password === db.users[0].password) {
		res.json(db.users[0]);
	} else {
		res.status(400).json('error');
	}
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	knex('users')
		.returning('*')
		.insert({
			email: email,
			name: name,
			joined: new Date()
		}).then(response => {
			res.json(response[0]);
		})
		.catch(err => res.status(400).json(err));
});

app.get('/profile/:id', (req, res) =>{
	const {id} = req.params;
	knex.select('*').from('users').where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('user not found')
			}
		})
		.catch(err => res.status(400).json('user not found'));
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



	/*bcrypt.hash(password, null, null, function(err, hash) {
		console.log(hash);
	});*/
/*
// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});*/

app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
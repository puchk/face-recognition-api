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
	knex.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return knex.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong info')
			}
		})
		.catch(err => res.status(400).json('wrong information'))
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
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
	knex('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('doesn\'t receive entries count'))
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
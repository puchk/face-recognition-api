const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const signIn = require('./controllers/signIn');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
const PORT = process.env.PORT || 3000;

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.DATABASE_URL,
    ssl: true
  }
});

knex.select('*').from('users').then(data => {
	console.log(data);
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('app is working') });
app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, knex, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, knex) });
app.put('/image', (req, res) => { image.handleImage(req, res, knex) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });



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
  console.log(`Server is listening on port ${PORT}`);
});
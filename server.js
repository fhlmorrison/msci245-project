let mysql = require('mysql');
let config = require('./config.js');
const fetch = require('node-fetch');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { response } = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get('/', (req, res) => {res.send('<html>Hello</html>'); console.log('Hello')})


app.post('/api/loadUserSettings', (req, res) => {

	let connection = mysql.createConnection(config);
	let userID = req.body.userID;

	let sql = `SELECT mode FROM user WHERE userID = ?`;
	console.log(sql);
	let data = [userID];
	console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		res.send({ express: string });
	});
	connection.end();
});

app.get('/api/getMovies', (req, res) => {

	console.log('getMovies API request')
	let connection = mysql.createConnection(config);
	
	// TODO 6.b.iv

	// `SELECT id, name, year, quality FROM movies`
	// => `SELECT * FROM movies`

	let sql = `SELECT * FROM movies`;
	console.log(sql);

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		// let string = JSON.stringify(results);
		// let obj = JSON.parse(string);
		// res.send({ express: string });
		res.json(results)
	});
	connection.end();
});

app.post('/api/addReview', (req, res) => {

	let connection = mysql.createConnection(config);
	// Parse request and assign values to list\
	
	// [reviewTitle, reviewContent, reviewScore, userID, movieID]
	let submission = req.body
	console.log(submission)
	let data = Object.values(submission)
	console.log(data)
	
	// TODO 6.c.ii

	// `INSERT INTO table1 (fields) VALUES (values)`

	let sql = `INSERT INTO review (reviewTitle, reviewContent, reviewScore, userID, movieID) VALUES (?, ?, ?, ?, ?)`;
	console.log(sql);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			res.send({message: error.message})
			return console.error(error.message);
		}

		//let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		//res.send({ express: string });
		res.send({message: 'success'})
	});
	connection.end();
});


// app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
app.listen(port, '18.216.101.119'); //for the deployed version, specify the IP address of the server

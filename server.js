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

app.get('/', (req, res) => { res.send('<html>Hello</html>'); console.log('Hello') })

app.post('/api/search', (req, res) => {
	let connection = mysql.createConnection(config);

	const bd = req.body

	// Get data from request
	let rawData = [bd.director, bd.actor, bd.title] // [director, actor, title]
	let data = rawData.map(e => `%${e}%`)

	let sql = `SELECT DISTINCT m.id as movie_id, 
    m.name as title,
    GROUP_CONCAT(DISTINCT CONCAT_WS('\n', d.first_name, d.last_name) SEPARATOR '\n\n') as director,
    GROUP_CONCAT(DISTINCT CONCAT_WS(' - ', rw.reviewTitle, rw.reviewContent) SEPARATOR '\n\n') as reviews,
    AVG(rw.reviewScore) as avg_score
		FROM movies m
		INNER JOIN movies_directors m_d ON m.id = m_d.movie_id
		INNER JOIN directors d ON m_d.director_id = d.id
		INNER JOIN roles r ON m.id = r.movie_id
		INNER JOIN actors a ON r.actor_id = a.id
		LEFT JOIN review rw ON rw.movieID = m.id
		WHERE LOWER(CONCAT(d.first_name, ' ', d.last_name)) 
		LIKE LOWER(?)
		AND LOWER(CONCAT(a.first_name, ' ', a.last_name)) 
		LIKE LOWER(?)
		AND LOWER(m.name)
		LIKE LOWER(?)
		GROUP BY m.id, m.name
		;`
	//
	console.log('Searching database with terms: ' + data)

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		// Send query results
		res.json(results)
	})
	connection.end()
});

app.post('/api/recommendations', (req, res) => {
	let connection = mysql.createConnection(config);

	const bd = req.body

	// Get data from request
	let data = [bd.userID, bd.userID]

	// By director
	let sql = `SELECT DISTINCT m_d2.movie_id, m.name as title,
    GROUP_CONCAT(DISTINCT CONCAT_WS('\n', d.first_name, d.last_name) SEPARATOR '\n\n') as director,
    GROUP_CONCAT(DISTINCT CONCAT_WS('\n', rw.reviewTitle, rw.reviewContent) SEPARATOR '\n\n') as reviews,
    AVG(rw.reviewScore) as avg_score
	FROM directors d
	INNER JOIN movies_directors m_d ON m_d.director_id = d.id
	INNER JOIN review r ON r.movieID = m_d.movie_id
	INNER JOIN movies_directors m_d2 ON m_d2.director_id = m_d.director_id
	INNER JOIN movies m ON m.id = m_d2.movie_id
	LEFT JOIN review rw ON rw.movieID = m_d2.movie_id
	WHERE r.userID = ?
	AND m_d2.movie_id NOT IN (SELECT movieID FROM review WHERE userID = ?)
	GROUP BY m_d2.movie_id, m.name
	;`
	//
	console.log('Getting recommendations for userID=' + data[0])

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		// Send query results
		res.json(results)
	})
	connection.end()
});


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

app.post('/api/getMovies', (req, res) => {

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
	console.log('Adding review to DB');

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			res.send({ message: error.message })
			return console.error(error.message);
		}

		//let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		//res.send({ express: string });
		res.send({ message: 'success' })
		console.log('Added successfully')
	});
	connection.end();
});


app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
// app.listen(port, '18.216.101.119'); //for the deployed version, specify the IP address of the server

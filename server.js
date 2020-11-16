require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

// app.get('/teste', (req, res) => res.sendFile(path.join(__dirname, 'indexTeste.js')))

app.get('/teste', function (req, res) {
	// res.send('GET request to the homepage');
	
	const clientSecret = getClientSecret();

	console.log(clientSecret);
});

const getClientSecret = () => {
	// sign with RSA SHA256
	const privateKey = 'MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgas++S2m0JMKlyKWaoRABozLbmN71tUW8j1gFvC1jsgygCgYIKoZIzj0DAQehRANCAAQrSJDDf0wTjMWwWUwR3d09uKJZB9W9kVl1QXL48AuTr4rtewEyPjS+9blyN5tMiEkw3qJ01993Wxevv4KaTGbi';
	const headers = {
		kid: 'A7HVB5A6MF',
		typ: undefined // is there another way to remove type?
	}
	const claims = {
		'iss': 'CICLOO',
		'aud': 'https://appleid.apple.com',
		'sub': 'br.com.cicloo.service',
	}

	token = jwt.sign(claims, privateKey, {
		algorithm: 'ES256',
		header: headers,
		expiresIn: '24h'
	});

	return token
}

const getUserId = (token) => {
	const parts = token.split('.')
	try {
		return JSON.parse(new Buffer(parts[1], 'base64').toString('ascii'))
	} catch (e) {
		return null
	}
}

app.post('/callback', (req, res) => {
  console.log('req.body', JSON.stringify(req.body))
	const clientSecret = getClientSecret()
	const requestBody = {
		grant_type: 'authorization_code',
		code: req.body.code,
		redirect_uri: 'https://moraes-apple.herokuapp.com/callback',
		client_id: 'br.com.cicloo.service',
		client_secret: clientSecret,
		scope: 'name email'
  }
  console.log('requestBody', JSON.stringify(requestBody))
  

	axios.request({
		method: "POST",
		url: "https://appleid.apple.com/auth/token",
		data: querystring.stringify(requestBody),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	}).then(response => {
    console.log('response', JSON.stringify(response))
		return res.json({
			success: true,
			data: response.data,
			user: getUserId(response.data.id_token)
		})
	}).catch(error => {
		console.log(error.response.data)
		return res.status(500).json({
			success: false,
			error: error.response.data
		})
	})
})

app.listen(80, () => console.log(`App listening on port ${80}!`))

// app.listen(process.env.PORT || 80, () => console.log(`App listening on port ${process.env.PORT || 80}!`))
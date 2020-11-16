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

const clientSecret = getClientSecret();

console.log(clientSecret);
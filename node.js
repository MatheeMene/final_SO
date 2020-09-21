const { networkInterfaces } = require('os');
const express = require('express');
const http = require('https');
const app = express();
const port = 3001;
const nets = networkInterfaces();
const ips = [];
//const masterAddress = 'http://172.18.0.22:3000';
const masterAddress = 'http://127.0.0.1:3000';

const axios = require('axios');
app.use(function(req, res, next) {

	//to allow cross domain requests to send cookie information.
	res.header('Access-Control-Allow-Credentials', true);

	// origin can not be '*' when crendentials are enabled. so need to set it to the request origin
	res.header('Access-Control-Allow-Origin',  req.headers.origin);

	// list of methods that are supported by the server
	res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');

	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-XSRF-TOKEN');

	next();
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());

for (const name of Object.keys(nets)) {
	for (const net of nets[name]) {
		if (net.family === 'IPv4' && !net.internal) {
			ips.push(net.address);
		}
	}
}

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/status', (req, res) => {
	res.send({
		status: true,
		ip: ips[0],
		load: 0
	});
});

function fib(n) {
	if (n < 2)
		return n;
	return fib(n - 1) + fib(n - 2);
}

app.post('/assign-fib-sequence', (req, res) => {
	const { body: { number }} = req;
	console.log('chegou o numero' + number);
	if (number) {
		return fib(number);
	}

	return 'Not valid';
});


axios.post(masterAddress + '/assign-node', {
	ip: ips[0]
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

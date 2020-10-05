const { networkInterfaces } = require('os');
const express = require('express');
const http = require('https');
const app = express();
const port = 3001;
const nets = networkInterfaces();
const ips = [];
//const masterAddress = 'http://172.18.0.22:3000';
const masterAddress = 'http://127.0.0.1:3000';
const { fork,spawn } = require('await-spawn');
const axios = require('axios');
var sys = require('sys')
var exec = require('child_process').exec;
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin',  req.headers.origin);
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

app.get('/status', async (req, res) => {
	const child= exec("./get_cpu_usage.sh", function(err, stdout, stderr) {
		res.send({
			status: true,
			ip: ips[0],
			load: stdout
		});
	});
});

function fib(n) {
	if (n < 2)
		return n;
	return fib(n - 1) + fib(n - 2);
}

app.post('/assign-fib-sequence', async (req, res) => {
	const { body: { number }} = req;
	if (number) {
		return new Promise((resolve,reject) => {
			resolve(res.send({success: true, result: fib(number)}));
		});
	}

	return res.send({success: false});
});


axios.post(masterAddress + '/assign-node', {
	ip: ips[0]
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

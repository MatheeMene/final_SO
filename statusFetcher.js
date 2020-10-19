const express = require('express');
const app = express();
const port = 3002;
const bodyParser = require('body-parser');
const readline = require('readline');
const axios = require('axios');
const exec = require('child_process').exec;
app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin',  req.headers.origin);
	res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-XSRF-TOKEN');

	next();
});

app.listen(port, () => {
	console.log(`App is running on http://localhost:${port}, my king.`);
});

app.get('/:id', function(req,res) {
	const child = exec("docker stats --no-stream " + req.params.id, function(err, stdout, stderr) {
		var dataLine = stdout.split('\n')[1];
		var splittedBySpaces = dataLine.split(' ');
		var cpuUsage = 0;
		for (let i = 0; i < splittedBySpaces.length; i++) {
			if (splittedBySpaces[i].indexOf('%') != -1) {
				cpuUsage = splittedBySpaces[i].substr(0, splittedBySpaces[i].length - 1);
				break;
			}
		}

		return res.send({
			container: req.params.id,
			usage: cpuUsage
		});
	});
});


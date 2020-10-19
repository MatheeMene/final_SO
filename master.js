const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const readline = require('readline');
const axios = require('axios');
app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin',  req.headers.origin);
	res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-XSRF-TOKEN');

	next();
});

let nodesAvailable = {};

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`App is running on http://localhost:${port}, my king.`);
});

app.post('/assign-node', (req, res) => {
	const { body: { ip }} = req;
	const port = req.body.port;

	const addr = ip + ':' + port;
	if (ip && ip.length > 0) {
		if (!nodesAvailable[addr]) {
			nodesAvailable[addr] = {
				status: true,
				load: 0,
				port: port
			}
		}

		res.send({
			status: true,
			message: "successfully assigned child with address: " + ip
		});
	} else {
		res.send({
			status: false,
			message: 'failed to assign address'
		});
	}
});

app.put('/receive-status', (req, res) => {
	let resultFromNode = req.body;
	console.log('result from node ' + resultFromNode.ip + ": " + resultFromNode.number);
});

function checkNodesStatus() {
	for (const [key, value] of Object.entries(nodesAvailable)) {

		axios.get('http://' + key + '/status').then(function (response) {
			let load = response.data.load;
			console.log(response.data)
			nodesAvailable[key].load = parseFloat(load);
		}).catch(function (error) {
			console.log(error)
			delete nodesAvailable[key];
			console.warn('Alert: node ' + key + ' dropped');
		});
	}
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function getLeastUsedNode() {
	let lowerLoad = Number.MAX_VALUE;
	let lowerLoadIndex = '';
	let lowerLoadPort = '';
	for (const [key,value] of Object.entries(nodesAvailable)) {
		if (value.load < lowerLoad) {
			lowerLoad = value.load;
			lowerLoadIndex = key;
			lowerLoadPort = value.port;
		}
	}

	return lowerLoadIndex;
}

function sendWorkToNode(num) {
	let leastUsedNode = getLeastUsedNode();
	if (leastUsedNode && leastUsedNode.length > 0) {
		let route = 'http://' + leastUsedNode + '/assign-fib-sequence';
		axios.post(route, {
			number: num
		}).then(function (response) {
				if (response.data.success) {
					console.log('Result from node ' + leastUsedNode + ': running');
				}
			})
			.catch(function (error) {
				console.log(error);
			});

	}
}

function promptMenu() {
	rl.question("Choose operation: \n1 - Set Fibonacci sequence to calculate\n2 - Get cluster status\n", (option) => {
		if (option == '1') {
			rl.question("Set sequence number: \n", (number) => {
				sendWorkToNode(number);
				promptMenu();
			});
		} else if (option == '2') {
			rl.question("Set sequence number: \n", (numbers) => {

			});

		}
	});
}

function main() {
	setInterval(checkNodesStatus.bind(this), 3000);
	promptMenu();
}

main();


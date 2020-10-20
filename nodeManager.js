const { fork, spawn } = require('await-spawn');
const exec = require('child_process').exec;
const readline = require('readline');
var lastNodePort = 3004;
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function main() {
	//const child = exec("docker run --ip 172.18.0.22 -it --net balancer-net master:latest", function(err, stdout, stderr) {});
	promptMenu();
}

function spawnNode() {
	const child = exec("./spawn_node.sh " + lastNodePort, function(err, stdout, stderr) {});
}

function promptMenu() {
	rl.question("Press 1 to create new node\n", (option) => {
		if (option == '1') {
			spawnNode();
			lastNodePort++;
			promptMenu();
		} else {
			promptMenu();
		}
	});
}

main();

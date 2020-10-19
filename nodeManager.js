const { fork, spawn } = require('await-spawn');
const exec = require('child_process').exec;
const readline = require('readline');
var lastNodePort = 3004;
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function main() {
	promptMenu();
}

function spawnNode() {
	console.log("dqwdqwdqw");
	const child = exec("./spawn_node.sh " + lastNodePort, function(err, stdout, stderr) {
		 console.log(stdout, "stdout");
	});
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

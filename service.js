const { workerData, parentPort } = require('worker_threads')

parentPort.postMessage({ result: fib(workerData.num) });

function fib(n) {
	if (n < 2)
		return n;
	return fib(n - 1) + fib(n - 2);
}


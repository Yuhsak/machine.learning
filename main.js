const Perceptron = require('./lib/perceptron/main').default
const isBrowser = new Function("try {return this===window;}catch(e){ return false;}")

if (isBrowser()) {
	window.machineLearning = {Perceptron}
} else {
	module.exports = {Perceptron}
}

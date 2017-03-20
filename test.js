const Perceptron = require('./main').Perceptron

// initialize
const perceptron = new Perceptron({
	epoch: 500, // optional, default to 1000
	eta: 0.2, // optional, default to 0.1
	vias: 2, // optional, default to 1
})

// you can make chain
perceptron.input([0,0]).should.be(0)
	.input([1,0]).should.be(0)
	.input([0,1]).should.be(0)
	.input([1,1]).should.be(1)

// or just like this
const x = [ [0,0], [0,1], [1,0], [1,1] ]
perceptron.input(x).should.be([0,0,0,1])

// event for each epoch
perceptron.on('process', ({epoch, elapsedEpoch, w}) => {})

// event for training finish
perceptron.on('done', ({epoch, elapsedEpoch, w}) => {
	console.log('finished. elapsedEpoch: ' + elapsedEpoch + ', weights: [' + w + ']')
})

// train synchronously
const result = perceptron.train().output(x)
console.log('result => [' + result + ']') // should be [0,0,0,1]

// train asynchronously
perceptron
	.train({
		w: [10,20,5], // you can optionaly give initial weights
		async: true // if async: true, then process will be executed asynchronously, and returns a promise
	})
	.then(model => {
		console.log('result => [' + model.output(x) + ']')// should be [0,0,0,1]
	})

# machine.learning
Simple machine learning module for node.js &amp; browsers.

## Install

```sh
npm install machine.learning
```

## Usage

### Class: Perceptron

```js
// import
import {Perceptron} from 'machine.learning'

// initialize
const perceptron = new Perceptron({
	epoch: 500, // optional, default to 1000
	eta: 0.2, // optional, default to 0.1
	bias: 2, // optional, default to 1
})

// you can make chain
perceptron.this([0,0]).should.be(0)
	.this([1,0]).should.be(0)
	.this([0,1]).should.be(0)
	.this([1,1]).should.be(1)

// or just like this
const x = [ [0,0], [0,1], [1,0], [1,1] ]
perceptron.this(x).should.be([0,0,0,1])

// event for each epoch
perceptron.on('process', ({epoch, elapsedEpoch, w}) => {})

// event for training finish
perceptron.on('done', ({epoch, elapsedEpoch, w}) => {
	console.log('finished. elapsedEpoch: ' + elapsedEpoch + ', weights: [' + w + ']')
})

// train synchronously
const result = perceptron.learn().what.is.that(x)
console.log('result => [' + result + ']') // should be [0,0,0,1]

// train asynchronously
perceptron
	.learn({
		w: [10,20,5], // you can optionaly give initial weights
		async: true // if async: true, then process will be executed asynchronously, and returns a promise
	})
	.then(model => {
		console.log('result => [' + model.what.is.that(x) + ']')// should be [0,0,0,1]
	})
```

## For browser

Simply import `browser.js` in your html, then `machineLearning` object will be attached to global.

```html
<script src='browser.js'></script>
<script>
	const perceptron = new machineLearning.Perceptron()
	perceptron.this.([0,0]).should.be(0)
	perceptron.this.([1,1]).should.be(1)
	perceptron.learn()
	const answer = perceptron.what.is.that([1,1])
	console.log(answer) // should be 1
</script>
```

## Development

Currently this module uses gulp as task runner for build source codes, and mocha for testing.

Please see once `gulpfile.babel.js` and `test/test.js` if you're getting in.

### Build & start watching source code

```sh
npm start
```

### Run test

```sh
npm test
```

const util = {
	dot(vec1, vec2) {
		// console.log(vec1)
		return vec1.map((item, index) => {
			return item * vec2[index]
		}).reduce((a, b) => {
			return a+b
		})
	},
	step(val) {
		return val > 0 ? 1 : 0
	},
	isNested(arr) {
		return Array.isArray(arr[0])
	},
	runAsync(callback) {
		const isBrowser = new Function("try {return this===window;}catch(e){ return false;}")
		isBrowser() ? setTimeout(() => {callback()},10) : process.nextTick(() => {callback()})
	}
	
}

const [_startSync, _startAsync, _process, _withBias] = [...Array(4).keys()].map(Symbol)

class Perceptron {
	
	constructor({epoch, eta, bias}={}) {
		this.epoch = epoch ? epoch : 1000
		this.eta = eta ? eta : 0.1
		this.bias = bias ? bias : 1
		this.elapsedEpoch = 0
		this.x = []
		this.y = []
		this.w = []
		this.events = {}
	}
	
	[_startSync]() {
		let r = false
		while (!r && this.elapsedEpoch < this.epoch) {
			r = this[_process]()
		}
		this.emit('done', this.resultProps)
		return this
	}
	
	[_startAsync]() {
		const self = this
		return new Promise((resolve, reject) => {
			(function _loop (_i) {
				return new Promise((_resolve, _reject) => {
					const shouldBreak = self[_process]()
					util.runAsync(() => {
						_resolve({time: _i+1, shouldBreak})
					})
				})
				.then(({time, shouldBreak}) => {
					if (shouldBreak || time >= self.epoch-1) {
						self.emit('done', self.resultProps)
						resolve(self)
					} else _loop(time)
				})
			})(0)
		})
	}
	
	[_process]() {
		this.elapsedEpoch++
		this.xWithBias.forEach((inputVec, index) => {
			const o = this.output(inputVec)[0]
			const y = this.y[index]
			this.w = this.w.map((weight, _index) => {
				return weight + (y - o) * inputVec[_index] * this.eta
			})
		})
		this.emit('process', this.resultProps)
		// console.log(this.w)
		return this.output(this.x).every((outputVal, index) => {return outputVal == this.y[index]})
	}
	
	[_withBias](...x) {
		return x.map(inputVec => {return [...inputVec, this.bias]})
	}
	
	get xWithBias() {
		return this[_withBias](...this.x)
	}
	
	get resultProps() {
		return {epoch: this.epoch, elapsedEpoch: this.elapsedEpoch, w: this.w}
	}
	
	learn({w, async=false}={}) {
		this.w = w ? w : this.w.length > 0 ? this.w : Array(this.xWithBias[0].length).fill(0)
		this.elapsedEpoch = 0
		return async ? this[_startAsync]() : this[_startSync]()
	}
	
	input(input) {
		this.x = [...this.x, ...input]
		return this
	}
	
	this(input) {
		const _input = util.isNested(input) ? input : [input]
		return this.input(_input)
	}
	
	get should() {
		return this
	}
	
	be(label) {
		const _label = Array.isArray(label) ? label : [label]
		this.y = [...this.y, ..._label]
		return this
	}
	
	output(input) {
		const _input = util.isNested(input) ? input : [input]
		const o = _input.map(inputVec => {
			const _inputVec = this.w.length > inputVec.length ? this[_withBias](inputVec) : inputVec
			return util.step(util.dot(util.isNested(_inputVec) ? _inputVec[0] : _inputVec, this.w))
		})
		return o
	}
	
	get what() {
		return this
	}
	
	get is() {
		return this
	}
	
	that(input) {
		const o = this.output(input)
		return o.length == 1 ? o[0] : o
	}
	
	on(name, func) {
		this.events[name] = !this.events[name] ? [func] : [...this.events[name], func]
	}
	
	emit(name, arg) {
		if (this.events[name]) this.events[name].forEach(func => {func(arg)})
	}
	
}

export default Perceptron

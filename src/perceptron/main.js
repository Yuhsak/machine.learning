const util = {
	dot(vec1, vec2) {
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
		return arr.some(_arr => {return Array.isArray(_arr)})
	}
}

const [_startSync, _startAsync, _process, _withVias] = [...Array(4).keys()].map(Symbol)

class Perceptron {
	
	constructor({epoch, eta, vias}={}) {
		this.epoch = epoch ? epoch : 1000
		this.eta = eta ? eta : 0.1
		this.vias = vias ? vias : 1
		this.elapsedEpoch = 0
		this.x = []
		this.y = []
		this.w = []
		this.events = {}
	}
	
	[_startSync]() {
		Array(this.epoch).fill(0).some(() => {
			return this[_process]()
		})
		this.emit('done', this.resultProps)
		return this
	}
	
	[_startAsync]() {
		const self = this
		return new Promise((resolve, reject) => {
			(function _loop (_i) {
				return new Promise((_resolve, _reject) => {
					const shouldBreak = self[_process]()
					// process.nextTick(() => {
					setTimeout(()=>{
						_resolve({time: _i+1, shouldBreak})
					// })
				}, 10)
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
		this.xWithVias.forEach((inputVec, index) => {
			const o = this.output(inputVec)
			const y = this.y[index]
			this.w = this.w.map((weight, _index) => {
				return weight + (y - o) * inputVec[_index] * this.eta
			})
		})
		this.emit('process', this.resultProps)
		return this.output(this.x).every((outputVal, index) => {return outputVal == this.y[index]})
	}
	
	[_withVias](...x) {
		const _x = x.map(inputVec => {return [...inputVec, this.vias]})
		return _x.length == 1 ? _x[0] : _x
	}
	
	get xWithVias() {
		return this[_withVias](...this.x)
	}
	
	get resultProps() {
		return {epoch: this.epoch, elapsedEpoch: this.elapsedEpoch, w: this.w}
	}
	
	learn({w, async=false}={}) {
		this.w = w ? w : this.w.length > 0 ? this.w : Array(this.xWithVias[0].length).fill(0)
		this.elapsedEpoch = 0
		return async ? this[_startAsync]() : this[_startSync]()
	}
	
	input(input) {
		const _input = util.isNested(input) ? input : [input]
		this.x = [...this.x, ..._input]
		return this
	}
	
	this(input) {
		return this.input(input)
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
			const _inputVec = this.w.length > inputVec.length ? this[_withVias](inputVec) : inputVec
			return util.step(util.dot(_inputVec, this.w))
		})
		return o.length == 1 ? o[0] : o
	}
	
	get what() {
		return this
	}
	
	get is() {
		return this
	}
	
	that(input) {
		return this.output(input)
	}
	
	on(name, func) {
		this.events[name] = !this.events[name] ? [func] : [...this.events[name], func]
	}
	
	emit(name, arg) {
		if (this.events[name]) this.events[name].forEach(func => {func(arg)})
	}
	
}

export default Perceptron

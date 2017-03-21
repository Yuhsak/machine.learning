const Perceptron = require('../main').Perceptron
const should = require('should')

describe('Perceptron', () => {
	
	const x = [[0,0],[0,1],[1,0],[1,1]]
	
	const tests = {
		value: [
			{
				title: 'AND',
				label: [0,0,0,1]
			},
			{
				title: 'OR',
				label: [0,1,1,1]
			},
			{
				title: 'NAND',
				label: [1,1,1,0]
			},
			{
				title: 'NOR',
				label: [1,0,0,0]
			}
		],
		init: function () {
			this.value = this.value.map(item => {
				item.description = `should return [${item.label.toString()}]`
				return item
			})
			delete this.init
			return this.value
		}
	}.init()
	
	tests.forEach(_case => {
		describe(_case.title, () => {
			describe(_case.description, () => {
				const y = _case.label
				it('sync', () => {
					const p = new Perceptron()
					p.this(x).should.be(y).learn()
					p.what.is.that(x).should.be.eql(y)
				})
				it('async', () => {
					const p = new Perceptron()
					return p.this(x).should.be(y).learn({async: true})
						.then(model => {
							model.what.is.that(x).should.be.eql(y)
						})
				})
			})
		})
	})

})

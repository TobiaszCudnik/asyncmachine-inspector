var _ = require('lodash')

function ooify(fn) {
    return function() {
        return fn.apply(this, [this].concat([].slice.call(arguments)))
    }
}
module.exports = _.zipObject(_.map(_.keys(_.prototype), methodName => {
    return [methodName, ooify(_[methodName])]
}))

//var { sortBy, filter, map } = methods
//
//var array = [1, 2, 3, 14, 2, 35, 73, 8, 77]
//
//array = array
//    ::sortBy(y => y)
//    ::map(y => y)
//    ::filter(y => y % 2)
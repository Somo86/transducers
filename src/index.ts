import * as R from 'ramda';

const list = [0,3];

const add1 = v => v + 1;
const isOdd = v => v % 2 == 1;
const diffFrom1 = v => v !== 1;
const sum = (result, input) => {
  return result + input;
}; 

const combiner = (result, input) => result.push(input); 

const mapReducer = R.curry((mapFn, combineFn) => (list, input) => {
  return combineFn(list, mapFn(input));
});

const filterReducer = R.curry((predicate, combineFn) => (result, input) => {
    if (predicate(input)) {
      return combineFn(result, input);
    }
    return result;
});

var transducer = R.compose(
  mapReducer(add1),
  filterReducer(diffFrom1),
)

function transduce(transducer, combineFn, initialValue, list) {
  var reducer = transducer(combineFn);
  console.log(reducer);
  return list.reduce(reducer, initialValue);
}

var a = transduce(transducer, sum, 0, list);
console.log(a);

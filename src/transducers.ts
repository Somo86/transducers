import * as R from 'ramda';

type TCombine<T> = (x, y) => T;

const mapReducer = R.curry(<T, U>(mapFn: Function, combineFn: TCombine<T>) => (result: T, input: U): T => {
  return combineFn(result, mapFn(input));
});

const filterReducer = R.curry(<T, U>(predicate: Function, combineFn: TCombine<T>) => (result: T, input: U): T => {
  if (predicate(input)) {
    return combineFn(result, input);
  }
  return result;
});

function transduce<T>(transducer: Function, combineFn: Function, initialValue: T, list): T {
  let reducer = transducer(combineFn);
  return list.reduce(reducer, initialValue);
}

export default {
  transduce,
  compose: R.compose,
  filter: filterReducer,
  map: mapReducer,
};

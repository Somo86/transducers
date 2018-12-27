import * as R from 'ramda';
import { default as t } from './transducers';
import { default as c } from './combiners';

//const add1 = v => v + 1;
//const isOdd = v => v % 2 == 1;
//const diffFrom1 = v => v !== 1;
const same = v => v;
const getSurplus = (nToDrop: number, list: any[]) => list.slice(nToDrop);

export const keep = <T>(predicate: Function, list: T[]): T[] => {
  const transducer = R.compose(
    t.filter(predicate)
  );
  return t.transduce(transducer, c.list, [], list);
};

export const drop = <T>(nToDrop: number, list: T[]): T[] => {
  list = getSurplus(nToDrop, list);
  return dropFn(list);
};

export const dropWhile = <T>(predicate: (n) => boolean, list: T[]): T[] => {
  let nToDrop = 0;
  let whileDo = predicate(nToDrop);
  while(whileDo) {
    nToDrop++;
    whileDo = predicate(nToDrop);
  }
  list = getSurplus(nToDrop, list);
  return dropFn(list);
};

function dropFn(list) {
  const transducer = R.compose(
    t.map(same)
  );
  return t.transduce(transducer, c.list, [], list);
}


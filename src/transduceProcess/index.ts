import { sum1, even } from "./transformers";
import {compose} from 'ramda';

type result<T> = T;
type combineType<T> = (result, input) => result<T>;
//1. Normal composed iterators return intermediate arrays
[0,1,2,3,4,5,6]
    .map(sum1) // [1,2,3,4,5,6,7]
    .map(sum1) // [2,3,4,5,6,7,8]
    .filter(even); // [2,4,6,8]

//2. Try to find a common way to implement all iterators. Reduce them
// Transform map and filter to be applied using reduce type 
const mapReducer = (f): combineType<any[]> => (result, input) => result.concat(f(input));
const filterReducer = (predicate): combineType<any[]> => (result, input) => 
    predicate(input) ? result.concat(input) : result;

// Apply filter - map using reducer
[0,1,2,3,4,5,6]
    .reduce(mapReducer(sum1), []) //[1,2,3,4,5,6,7]
    .reduce(mapReducer(sum1), []) //[2,3,4,5,6,7,8]
    .reduce(filterReducer(even)) //[2,4,6,8]

//3. Let's extract repeated combineType to a single combiner function
// result.concat(x) is same for all iterators
// now we can pass combiner function as a parameter
const combiner: combineType<any[]> = (result, input) => result.concat(input);
const mapping = 
    (f): (x: combineType<any>) => combineType<any> => 
    (combiner: combineType<any>):combineType<any> => 
    (result, input) => combiner(result, f(input));

const filtering = 
    (predicate): (x: combineType<any>) => combineType<any> => 
    (combiner:combineType<any>):combineType<any> => 
    (result, input) => predicate(input) ? combiner(result, input) : result;

//4. Notice mapping and filtering have a composable structure
// (combiner:combineType<any>):combineType<any> same type in and out
// the final type returned is also compatible with reduce type
// let's compose

[0,1,2,3,4,5,6].reduce(
    mapping(sum1)(
        mapping(sum1)(filtering(even)(combiner))
    ), []
);
//Let's use Ramda Compose
//entry: combineType
//output: combineType
const transformer = compose(
    mapping(sum1),
    mapping(sum1),
    filtering(even)
);

[0,1,2,3,4,5,6].reduce(transformer(combiner), []); //[2,4,6,8]

//5. Write all down on a Transducer function
const transducer = (transformer, combiner, initialValue, list) =>
    list.reduce(transformer(combiner), initialValue);
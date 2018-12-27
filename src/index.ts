import * as reducers from './reducers';
import * as transducers from './transducers';
import * as combiners from './combiners';

export default {
  ...reducers,
  ...transducers,
  ...combiners,
}

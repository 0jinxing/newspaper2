import { createActions } from 'redux-actions';

export default createActions({
  FILTER: (filter = 'START') => ({ filter }),
});

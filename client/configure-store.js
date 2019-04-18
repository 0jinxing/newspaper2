import { createStore } from 'redux';
import rootReducer from './reducer';

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState);

  // store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
}

export default configureStore;

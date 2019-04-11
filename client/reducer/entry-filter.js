import { handleActions } from 'redux-actions';
import actions from '../actions/entry-filter';

export default handleActions(
  {
    [actions.filter]: (state, action) => ({
      ...state,
      filter: action.payload,
    }),
  },
  { filter: 'TODAY' }
);

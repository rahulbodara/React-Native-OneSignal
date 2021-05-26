
import * as actionTypes from '../actions/actionTypes';

export const actions = {};

initialstate = {
  friend_request_list: [],
};

const FriendRequestReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.FRIENDREQUESTLIST:
      return {friend_request_list: action.payload};
      break;
    default:
      break;
  }
  return state;
};

export default FriendRequestReducer;

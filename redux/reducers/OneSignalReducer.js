
import * as actionTypes from '../actions/actionTypes';

export const actions = {};

initialstate = {
  onesignal_user_id: [],
};

const OneSignalReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ONESIGNAL_USERID:
      return {onesignal_user_id: action.payload};
      break;
    default:
      break;
  }
  return state;
};

export default OneSignalReducer;


import * as actionTypes from '../actions/actionTypes';

export const actions = {};

initialstate = {
  notification_list: [],
};

const NotificationReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.NOTIFICATIONLIST:
      return {notification_list: action.payload};
      break;
    default:
      break;
  }
  return state;
};

export default NotificationReducer;

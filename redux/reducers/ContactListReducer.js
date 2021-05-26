
import * as actionTypes from '../actions/actionTypes';

export const actions = {};

initialstate = {
  contactMainList: [],
  contactlist: [],
};

const ContactListReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.CONTACTLIST:
      return {contactMainList: action.payload, contactlist: action.payload};
      break;
    case actionTypes.CONTACTSEARCHLIST:
      return {...state, contactlist: action.payload};
      break;
    default:
      break;
  }
  return state;
};

export default ContactListReducer;

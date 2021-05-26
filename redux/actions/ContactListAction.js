import * as actionTypes from './actionTypes';

export const ContactList = (payload) => {
  return {type: actionTypes.CONTACTLIST, payload: payload};
};

export const ContactSearchList = (payload) => {
  return {type: actionTypes.CONTACTSEARCHLIST, payload: payload};
};

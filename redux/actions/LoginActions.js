import * as actionTypes from './actionTypes';

export const loginDetails = (payload) => {
  return {type: actionTypes.LOGINDATA, payload: payload};
};

export const signOut = (payload) => {
  return {type: actionTypes.SIGNOUT, payload: payload};
};

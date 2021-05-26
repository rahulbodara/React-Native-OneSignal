import React from 'react';
import * as actionTypes from '../actions/actionTypes';

export const actions = {};

initialstate = {
  loginData: {},
};

const LoginReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.LOGINDATA:
      return {...state, ...action.payload};
      break;
    case actionTypes.SIGNOUT:
      return action.payload;
      break;
    default:
      break;
  }
  return state;
};

export default LoginReducer;

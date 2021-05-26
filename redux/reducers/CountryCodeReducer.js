import React from 'react';
import * as actionTypes from '../actions/actionTypes';

export const actions = {};

initialstate = {
  country_code: '',
};

const CountryCodeReducer = (state = initialstate, action) => {
  //console.log('action payload ', action.payload);
  switch (action.type) {
    case actionTypes.COUNTRY_CODE:
      return {country_code: action.payload};
      break;
    default:
      break;
  }
  return state;
};

export default CountryCodeReducer;

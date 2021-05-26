import * as actionTypes from './actionTypes';

export const CountryCode = (payload) => {
  return {type: actionTypes.COUNTRY_CODE, payload: payload};
};

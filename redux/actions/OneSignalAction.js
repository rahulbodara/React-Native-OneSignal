import * as actionTypes from './actionTypes';

export const storeOneSignalUserID = (payload) => {
  return {type: actionTypes.GET_ONESIGNAL_USERID, payload: payload};
};

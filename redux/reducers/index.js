import {combineReducers} from 'redux';
import SignUpReducer from './SignUpReducer';
import LoginReducer from './LoginReducer';
import TokenReducer from './TokenReducer';
import ContactListReducer from './ContactListReducer';
import FriendRequestReducer from './FriendRequestReducer';
import NotificationReducer from './NotificationReducer';
import OneSignalReducer from './OneSignalReducer';
import CountryCodeReducer from './CountryCodeReducer';

export default combineReducers({
  SignUpReducer,
  LoginReducer,
  TokenReducer,
  ContactListReducer,
  FriendRequestReducer,
  NotificationReducer,
  OneSignalReducer,
  CountryCodeReducer,
});

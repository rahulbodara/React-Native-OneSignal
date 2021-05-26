import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {colors} from '../utils/Config';
import {
  verifyRegisterOTP,
  addUserToken,
  getUserMasterContact,
} from '../utils/api';
import Toast from 'react-native-simple-toast';
import {tokenData} from '../redux/actions/TokenActions';
import {loginDetails} from '../redux/actions/LoginActions';
import {
  addUser,
  getToken,
  userLoginWithPhone,
  verifyLoginOTP,
} from '../utils/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen-hooks';
import i18n from 'i18n-js';
import {I18nManager} from 'react-native';
import Purchases from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpVerify = (props) => {
  const [otp, setOtp] = useState('');
  const [params, setParams] = useState(props.route.params);
  const [loader, setLoader] = useState(false);
  const player_id = useSelector((state) => state.OneSignalReducer);
  const dispatch = useDispatch();
  console.log('parameters data ', props.route.params);
  const handleOTPChange = (otp) => {
    setOtp(otp);
    console.log('otp digits ', otp, typeof otp);
  };
  console.log('Register Details', props.route.params.data);
  const signUpData = async () => {
    console.log('signup by email ', player_id);
    const verifyParams = {
      mobile_number: params.data.mobile_number,
      mobile_prefix: params.data.mobile_prefix,
      otp: otp,
    };
    setLoader(true);
    let response = await verifyRegisterOTP(verifyParams);
    if (response.status === 200) {
      const json = props.route.params.data;
      delete json['country_code'];
      getToken(response.data.data.access_token);
      let result = await addUser(json);

      if (result.status === 200) {
        setLoader(false);
        await dispatch(
          tokenData({
            access_token: response.data.data.access_token,
            token_type: response.data.data.access_type,
          }),
        );
        let usertoken_res = await addUserToken({
          token: player_id.onesignal_user_id,
        });
        if (usertoken_res.status === 200) {
          let master_response = await getUserMasterContact({
            user_id: result.data.data.id,
          });
          if (master_response.status === 200) {
            await AsyncStorage.setItem("@subscription_app_key",`myqard_user_${response.data.data.user_id}`)
            Purchases.identify(`myqard_user_${master_response.data.data.user_id}`);
            await dispatch(loginDetails(master_response.data.data));
            props.navigation.navigate('BusinessCard', {
              data: params.data,
            });
            Toast.show(i18n.t('OTP_verify_success'), Toast.LONG);
          } else {
            Toast.show(i18n.t('error_calling_api'), Toast.LONG);
          }
        }
      } else {
        console.log('Error While storing data in add user');
        setLoader(false);
      }
    } else {
      setLoader(false);
      Toast.show(i18n.t('wrong_OTP'), Toast.LONG);
    }
  };

  const signInData = async () => {
    console.log('params => ', params);
    const verifyParams = {
      mobile_number: params.data.mobile_number,
      mobile_prefix: params.data.mobile_prefix,
      otp: otp,
    };
    setLoader(true);
    let response = await verifyLoginOTP(verifyParams);
    console.log('OTP Verify Response ', response.data, response.data.data);
    if (response.status === 200) {
      getToken(response.data.data.access_token);
      setLoader(false);
      await AsyncStorage.setItem("@subscription_app_key",`myqard_user_${response.data.data.user_id}`)
      await dispatch(
        tokenData({
          access_token: response.data.data.access_token,
          token_type: response.data.data.access_type,
        }),
      );
      let usertoken_res = await addUserToken({
        token: player_id.onesignal_user_id,
      });
      if (usertoken_res.status === 200) {
        let master_response = await getUserMasterContact({
          user_id: response.data.data.user_id,
        });
        if (master_response.status === 200) {
          Purchases.identify(`myqard_user_${master_response.data.data.user_id}`);
          await dispatch(loginDetails(master_response.data.data));
          props.navigation.navigate('Drawer');
          Toast.show(i18n.t('OTP_verify_success'), Toast.LONG);
        } else {
          Toast.show(i18n.t('error_calling_api'), Toast.LONG);
        }
      }
    } else {
      setLoader(false);
      Toast.show(i18n.t('wrong_OTP'), Toast.LONG);
    }
  };

  const reSendOTP = async () => {
    console.log('resend otp');
    let otpParams = {
      mobile_number: params.data.mobile_number,
      mobile_prefix: params.data.mobile_prefix,
    };
    if (params.type === 'login') {
      const response = await userLoginWithPhone(otpParams);
      if (response.status && response.data && response.data.message) {
        Toast.show(response.data.message, Toast.LONG);
      } else {
        Toast.show('Something wrong', Toast.LONG);
      }
    } else if (params.type === 'signup') {
      const response = await sendRegisterOTP(otpParams);
      if (response.status && response.data && response.data.message) {
        Toast.show(response.data.message, Toast.LONG);
      } else {
        Toast.show('Something wrong', Toast.LONG);
      }
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="padding"
        enabled
        keyboardVerticalOffset={0}>
        <ScrollView>
          <View
            style={{
              backgroundColor: colors.primaryColor,
              height: 300,
              position: 'absolute',
              top: -300,
              left: 0,
              right: 0,
            }}
          />
          <View>
            <ImageBackground
              source={require('../assests/top_design.png')}
              style={{
                width: wp('100%'),
                height: hp('38%'),
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  marginLeft: wp('10%'),
                }}>
                <Image
                  source={require('../assests/header_design.png')}
                  style={{
                    width: 200,
                    height: 150,
                  }}
                />
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('3%'),
              backgroundColor: '#fff',
            }}>
            <Text style={{fontSize: hp('3%'), color: '#5E6A7C'}}>
              {i18n.t('OTP_Verify')}
            </Text>
          </View>

          <View style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('2%'),
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                }}>
                <Text style={{fontSize: hp('1.8%'), color: '#5E6A7C'}}>
                  {i18n.t('OTP_Sent_TO')}{' '}
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: hp('1.8%')}}>
                  {params.data.mobile_prefix} {params.data.mobile_number}
                </Text>
              </View>

              <OTPInputView
                style={{
                  width: '100%',
                  height: '10%',
                  paddingLeft: 30,
                  paddingRight: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('5%'),
                  marginBottom: hp('5%'),
                }}
                pinCount={4}
                autoFocusOnLoad
                codeInputFieldStyle={{
                  backgroundColor: colors.textFieldBgColor,
                  alignItems: 'center',
                  alignSelf: 'center',
                  color: '#5E6A7C',
                  borderWidth: 0,
                  borderRadius: 10,
                  fontWeight: '800',
                }}
                codeInputHighlightStyle={{
                  borderColor: '#03DAC6',
                  color: '#5E6A7C',
                  fontWeight: '800',
                }}
                onCodeFilled={(code) => {
                  handleOTPChange(code);
                }}
              />

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text style={{fontSize: hp('1.5%'), color: '#5E6A7C'}}>
                  {i18n.t('OTP_resend_label')}
                </Text>
                <TouchableOpacity
                  style={{marginLeft: 5}}
                  onPress={() => reSendOTP()}>
                  <Text
                    style={{
                      fontSize: hp('1.5%'),
                      fontWeight: 'bold',
                      color: colors.primaryColor,
                    }}>
                    {i18n.t('Resend_OTP_label')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{marginTop: hp('18%')}}
              >
                <TouchableOpacity
                  onPress={() =>
                    props.route.params.type == 'login'
                      ? signInData()
                      : signUpData()
                  }
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={styles.btnSubmitViewStyle}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: hp('1.8%'),
                        fontWeight: 'bold',
                      }}>
                      {i18n.t('verify_and_proceed_btn_label')}
                    </Text>
                    {loader ? (
                      <View style={{marginLeft: wp('3%')}}>
                        <ActivityIndicator size="small" color="#fff" />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{backgroundColor: 'white'}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  btnSubmitViewStyle: {
    paddingLeft: wp('5%'),
    paddingRight: wp('5%'),
    height: hp('5.5%'),
    backgroundColor: '#4287f5',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    width: wp('90%'),
  },
});

export default OtpVerify;

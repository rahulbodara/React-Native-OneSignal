import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import BusinessCardInput from '../components/BusinessCardInput';
import {colors, OneSignal_APP_ID} from '../utils/Config';
import {
  userLoginWithEmail,
  userLoginWithPhone,
  getToken,
  addUserToken,
} from '../utils/api';
import Toast from 'react-native-simple-toast';
import {useSelector, useDispatch} from 'react-redux';
import {loginDetails} from '../redux/actions/LoginActions';
import {tokenData} from '../redux/actions/TokenActions';
import {storeOneSignalUserID} from '../redux/actions/OneSignalAction';
import OneSignal from 'react-native-onesignal';
import i18n from 'i18n-js';
import Purchases from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen-hooks';

const inputfield = {
  mobileno: 0,
  email: '',
  otp: '',
  password: '',
};

const Login = (props) => {
  const phoneInput = useRef(null);
  const [email, setEmail] = useState('');
  const [mobileno, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [phonefield, setPhoneField] = useState(false);
  const [loader, setLoader] = useState(false);
  const reduxdata = useSelector((state) => state.LoginReducer);
  const player_id = useSelector((state) => state.OneSignalReducer);
  const redux_country_code = useSelector((state) => state.CountryCodeReducer);

  const dispatch = useDispatch();

  

  useEffect(() => {
    // console.log('Use Effect Data ', reduxdata);
    OneSignal.setAppId(OneSignal_APP_ID);
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      console.log('Prompt Response ', response);
    });
    (async () => {
      console.log('Device iNfo =======> ', await OneSignal.getDeviceState());
      let one_signal_info = await OneSignal.getDeviceState();
      console.log('One Signal Info ', one_signal_info);
      dispatch(storeOneSignalUserID(one_signal_info.userId));
    })();
    console.log('Login contact list ', player_id.onesignal_user_id);
  }, []);

  const loginWithEmail = async () => {
    console.log('Login Response ', reduxdata);
    if (email !== '') {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        Toast.show(i18n.t('check_valid_emailID'), Toast.LONG);
        return;
      }
    } else {
      Toast.show(i18n.t('check_emailID'), Toast.LONG);
      return;
    }

    if (password == '') {
      Toast.show(i18n.t('check_password'), Toast.LONG);
      return;
    }

    setLoader(true);

    let loginWithEmailParams = {
      email: email,
      password: password,
    };

    const response = await userLoginWithEmail(loginWithEmailParams);
    if (
      response.status === 200 &&
      response.data.data &&
      response.data.data.access_token
    ) {
      console.log('working', player_id.onesignal_user_id);
      await getToken(response.data.data.access_token);
      await dispatch(loginDetails(response.data.data));
      setLoader(false);
      let usertoken_res = await addUserToken({
        token: player_id.onesignal_user_id,
      });
      console.log(
        'reponse dispatch ',
        usertoken_res.status,
        usertoken_res.data,
      );
      if (usertoken_res.status === 200) {
        console.log(
          'User Token Data not found success ',
          usertoken_res.status,
          usertoken_res.data.message,
        );
        Toast.show(i18n.t('login_success'), Toast.LONG);
        Purchases.identify(`myqard_user_${response.data.data.user_id}`);
        await AsyncStorage.setItem(
          '@subscription_app_key',
          `myqard_user_${response.data.data.user_id}`,
        );
        await dispatch(
          tokenData({
            access_token: response.data.data.access_token,
            token_type: response.data.data.token_type,
          }),
        );
      } else {
        console.log(
          'User Token Data not found ',
          usertoken_res.status,
          usertoken_res.data.message,
        );
        Toast.show('Error', Toast.LONG);
      }
    } else if (response.status === 401) {
      setLoader(false);
      Toast.show(i18n.t('error_calling_api'), Toast.LONG);
    }
  };

  const loginWithPhone = async () => {
    if (mobileno == '') {
      Toast.show(i18n.t('check_mobile_number'), Toast.LONG);
      return;
    }

    if (mobileno.length != 0) {
      if (!phoneInput.current?.isValidNumber(mobileno)) {
        Toast.show(i18n.t('check_mobile_number'), Toast.LONG);
        setLoader(false);
        return;
      }
    }
    let finalMobileNo = phoneInput.current?.getNumberAfterPossiblyEliminatingZero(
      mobileno,
      `+${phoneInput.current?.getCallingCode()}${mobileno}`,
    );

    let loginWithPhoneParams = {
      mobile_number: finalMobileNo.number,
      mobile_prefix: `+${phoneInput.current?.getCallingCode()}`,
    };

    const response = await userLoginWithPhone(loginWithPhoneParams);
    console.log(
      'Login With Phone Response ',
      response.data,
      loginWithPhoneParams,
    );
    if (response.status === 200) {
      Toast.show(i18n.t('OTP_sent'), Toast.LONG);
      props.navigation.navigate('OtpVerify', {
        type: 'login',
        data: loginWithPhoneParams,
      });
    } else if (response.status === 404) {
      Toast.show(response.data.message, Toast.LONG);
    } else {
      console.log('Error');
      Toast.show(i18n.t('error_calling_api'), Toast.LONG);
    }
  };

  return (
    <>
      <View style={{flex: 1, height: hp('100%'), backgroundColor: '#fff'}}>
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
              <Text
                style={{fontSize: 28, letterSpacing: 0.4, color: '#5E6A7C'}}>
                {i18n.t('login')}
              </Text>
            </View>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
              <View style={{flex: 1}}>
                {!phonefield ? (
                  <>
                    <View
                      style={{
                        marginTop: hp('2%'),
                        marginLeft: wp('3.5%'),
                        marginRight: wp('3.5%'),
                      }}>
                      <BusinessCardInput
                        labelname={i18n.t('email')}
                        textname={email}
                        texttype="email-address"
                        changeText={(value) => setEmail(value)}
                        placeholder={i18n.t('email')}
                      />
                    </View>
                    <View
                      style={{
                        marginTop: hp('2%'),
                        marginLeft: wp('3.5%'),
                        marginRight: wp('3.5%'),
                      }}>
                      <BusinessCardInput
                        labelname={i18n.t('password')}
                        textname={password}
                        texttype="default"
                        passwordfield={true}
                        changeText={(value) => setPassword(value)}
                        placeholder={i18n.t('password')}
                      />
                    </View>
                  </>
                ) : (
                  <View
                    style={{
                      marginTop: hp('2%'),
                      marginLeft: wp('3.5%'),
                      marginRight: wp('3.5%'),
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: hp('1.5%'),
                        color: '#5E6A7C',
                      }}>
                      Phone Number
                    </Text>

                    <PhoneInput
                      ref={phoneInput}
                      defaultValue={mobileno}
                      placeholder=" "
                      codeTextStyle={{height: hp('2%'), fontSize: hp('1.5%')}}
                      containerStyle={{
                        height: hp('5%'),
                        width: '100%',
                        backgroundColor: colors.textFieldBgColor,
                        borderRadius: 10,
                      }}
                      textContainerStyle={{
                        backgroundColor: colors.textFieldBgColor,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                      }}
                      textInputStyle={{
                        fontSize: hp('1.5%'),
                        height: hp('5%'),
                      }}
                      defaultCode={redux_country_code.country_code}
                      layout="first"
                      onChangeText={(text) => {
                        setMobileNo(text);
                      }}
                    />
                  </View>
                )}

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: hp('5%'),
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      setPhoneField(!phonefield)
                    }>
                    <Text
                      style={{color: colors.primaryColor, fontWeight: '500'}}>
                      {i18n.t('login_with')}{' '}
                      {phonefield ? i18n.t('email').toUpperCase() : 'OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginTop: hp('5%'),
                    marginLeft: wp('3.5%'),
                    marginRight: wp('3.5%'),
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      !phonefield ? loginWithEmail() : loginWithPhone();
                    }}
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.btnSubmitViewStyle}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: hp('2'),
                          fontWeight: 'bold',
                        }}>
                        {i18n.t('login')}
                      </Text>
                      {loader ? (
                        <View style={{marginLeft: wp('3%')}}>
                          <ActivityIndicator size="small" color="#fff" />
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: hp('2%'),
                    }}>
                    <Text style={{fontSize: hp('1.8%')}}>
                      {i18n.t('Dont_have_account')}{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('SignUpMobile')}>
                      <Text
                        style={{
                          fontSize: hp('1.8%'),
                          color: colors.primaryColor,
                          fontWeight: 'bold',
                        }}>
                        {i18n.t('signup')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={{backgroundColor: 'white'}} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  btnSubmitViewStyle: {
    paddingLeft: wp('5%'),
    paddingRight: wp('5%'),
    height: hp('5.5%'),
    backgroundColor: '#4287f5',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    width: wp('90%'),
  },
});

export default Login;

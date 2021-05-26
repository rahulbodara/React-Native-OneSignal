import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  PermissionsAndroid,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Icon, BottomSheet, ListItem} from 'react-native-elements';
import HeaderBar from '../components/HeaderBar';
import {colors} from '../utils/Config';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import PhoneInput from 'react-native-phone-number-input';
import BusinessCardField from '../components/BusinessCardField';
import {useSelector, useDispatch} from 'react-redux';
import * as ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import {loginDetails} from '../redux/actions/LoginActions';
import {
  updateUserPersonalInfo,
  updateUserAddress,
  updateUserWork,
  getUserMasterContact,
} from '../utils/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen-hooks';
import i18n from 'i18n-js';
import {Platform} from 'react-native';

const initialLayout = {width: Dimensions.get('window').width};

let firstRouteData = {};
let secondRouteData = {};

const FirstRoute = (props) => {
  const [filePath, setFilePath] = useState({});
  const [loader, setLoader] = useState(false);
  const phoneInput = useRef(null);
  const officeInput = useRef(null);
  const homeInput = useRef(null);
  const reduxdata = useSelector((state) => state.SignUpReducer);
  const logindata = useSelector((state) => state.LoginReducer);
  const redux_country_code = useSelector((state) => state.CountryCodeReducer);
  const [changeImage, setChangeImage] = useState(false);
  const dispatch = useDispatch();
  const [fields, setFields] = useState({
    title: 's',
    first_name: reduxdata.personal_info_field.first_name,
    last_name: reduxdata.personal_info_field.last_name,
    mobile_number: reduxdata.personal_info_field.mobile_number,
    office_phone: '',
    home_phone: '',
    email: reduxdata.personal_info_field.email,
    mobile_prefix: reduxdata.personal_info_field.mobile_prefix,
    home_phone_prefix: '',
    office_phone_prefix: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    old_password: '',
    password: '',
    confirm_password: '',
    mobile_country_code: '',
    office_phone_country_code: '',
    home_phone_country_code: '',
  });
  const [switches, setSwitches] = useState({
    title_visibility: false,
    first_name_visibility: false,
    last_name_visibility: false,
    mobile_number_visibility: false,
    office_phone_visibility: false,
    home_phone_visibility: false,
    email_visibility: false,
    facebook_visibility: false,
    instagram_visibility: false,
    linkedin_visibility: false,
  });

  const [addrFields, setAddrFields] = useState({
    country: '',
    state: '',
    city: '',
    street: '',
    street_number: '',
  });
  const [addrSwitches, setAddrSwitches] = useState({
    country_visibility: false,
    state_visibility: false,
    city_visibility: false,
    street_visibility: false,
    street_number_visibility: false,
  });

  const setMobileInput = (text) => {
    console.log('calling');
    setFields({
      ...fields,
      mobile_number: text,
      mobile_prefix: `+${phoneInput.current?.getCallingCode()}`,
      mobile_country_code: `${phoneInput.current?.getCountryCode()}`,
    });
    updateMainVariable('mobile_number', text, 'input');
    updateMainVariable(
      'mobile_prefix',
      `+${phoneInput.current?.getCallingCode()}`,
      'input',
    );
    updateMainVariable(
      'mobile_country_code',
      `${phoneInput.current?.getCountryCode()}`,
      'input',
    );
  };

  const setOfficeInput = (text) => {
    setFields({
      ...fields,
      office_phone: text,
      office_phone_prefix: `+${officeInput.current?.getCallingCode()}`,
      office_phone_country_code: `${officeInput.current?.getCountryCode()}`,
    });
    updateMainVariable('office_phone', text, 'input');
    updateMainVariable(
      'office_phone_prefix',
      `+${officeInput.current?.getCallingCode()}`,
      'input',
    );
    updateMainVariable(
      'office_phone_country_code',
      `${officeInput.current?.getCountryCode()}`,
      'input',
    );
  };

  const setHomeInput = (text) => {
    setFields({
      ...fields,
      home_phone: text,
      home_phone_prefix: `+${homeInput.current?.getCallingCode()}`,
      home_phone_country_code: `${homeInput.current?.getCountryCode()}`,
    });
    updateMainVariable('home_phone', text, 'input');
    updateMainVariable(
      'home_phone_prefix',
      `+${homeInput.current?.getCallingCode()}`,
      'input',
    );
    updateMainVariable(
      'home_phone_country_code',
      `${homeInput.current?.getCountryCode()}`,
      'input',
    );
  };

  //const dispatch = useDispatch();
  const setInputData = (key, value) => {
    setFields({...fields, [key]: value});
    updateMainVariable(key, value, 'input');
  };

  const setSwitchData = (key, value) => {
    setSwitches({...switches, [key]: value});
    updateMainVariable(key, value, 'switch');
  };

  const setAddrInputData = (key, value) => {
    setAddrFields({...addrFields, [key]: value});
    updateAddrMainVariable(key, value, 'input');
  };

  const setAddrSwitchData = (key, value) => {
    setAddrSwitches({...addrSwitches, [key]: value});
    updateAddrMainVariable(key, value, 'switch');
  };

  const openPhotoBottomSheet = () => {
    console.log('open bottom sheet');
    setIsVisible(true);
  };

  useEffect(() => {
    console.log('All UseEffect Data ', props.route.params.data);
    const replaceString = {};
    for (let [key, value] of Object.entries(switches)) {
      replaceString[key] = value ? '1' : '0';
    }
    firstRouteData = {...fields, ...replaceString};

    const replaceString1 = {};
    for (let [key, value] of Object.entries(addrSwitches)) {
      replaceString1[key] = value ? '1' : '0';
    }
    secondRouteData = {...addrFields, ...replaceString1};
  }, []);

  const firstFormSubmit = async () => {
    setLoader(true);

    if (fields.first_name == '') {
      Toast.show(i18n.t('check_first_name'), Toast.LONG);
      setLoader(false);
      return false;
    }

    if (fields.last_name == '') {
      Toast.show(i18n.t('check_last_name'), Toast.LONG);
      setLoader(false);
      return false;
    }

    if (fields.mobile_number == '') {
      Toast.show(i18n.t('check_mobile_number'), Toast.LONG);
      setLoader(false);
      return false;
    }

    if (fields.email != '') {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields.email)) {
        Toast.show(i18n.t('check_valid_emailID'), Toast.LONG);
        setLoader(false);
        return false;
      }
    } else {
      Toast.show(i18n.t('check_emailID'), Toast.LONG);
      setLoader(false);
      return false;
    }

    if (!phoneInput.current?.isValidNumber(fields.mobile_number)) {
      Toast.show(i18n.t('check_mobile_number'), Toast.LONG);
      setLoader(false);
      return;
    }
    console.log(
      'type of checking ',
      typeof fields.office_phone,
      fields.office_phone.length,
    );

    if (fields.office_phone.length != 0) {
      if (!officeInput.current?.isValidNumber(fields.office_phone)) {
        Toast.show(i18n.t('check_office_number'), Toast.LONG);
        setLoader(false);
        return;
      }
    }

    if (fields.home_phone.length != 0) {
      if (!homeInput.current?.isValidNumber(fields.home_phone)) {
        Toast.show(i18n.t('check_home_number'), Toast.LONG);
        setLoader(false);
        return;
      }
    }

    const replaceString = {};
    for (let [key, value] of Object.entries(switches)) {
      replaceString[key] = value ? '1' : '0';
    }
    const replaceString2 = {};
    for (let [key, value] of Object.entries(addrSwitches)) {
      replaceString2[key] = value ? '1' : '0';
    }
    secondRouteData = {...addrFields, ...replaceString2};
    firstRouteData = {...fields, ...replaceString};

    let imagePath = '';
    if (changeImage) {
      if (filePath.type == 'image/jpg') {
        imagePath = `data:${filePath.type};base64,` + filePath.base64;
      } else if (filePath.type == 'image/jpeg') {
        imagePath = `data:${filePath.type};base64,` + filePath.base64;
      } else {
        imagePath = `data:${filePath.type};base64,` + filePath.base64;
      }
    }

    // if (Object.keys(firstRouteData).length !== 0) {
    //   setLoader(false);
    //   props.jumpTo('business');
    // }

    let updateparams = {};
    if (changeImage) {
      updateparams = {
        ...firstRouteData,
        img: imagePath,
        mobile_number: fields.mobile_number,
        office_phone: fields.office_phone,
        home_phone: fields.home_phone,
        user_id: logindata.user_id,
      };
      firstRouteData = {...firstRouteData, img: imagePath};
    } else {
      updateparams = {
        ...firstRouteData,
        mobile_number: fields.mobile_number,
        office_phone: fields.office_phone,
        home_phone: fields.home_phone,
        user_id: logindata.user_id,
      };
      firstRouteData = {...firstRouteData};
    }
    setLoader(false);
    props.jumpTo('business');
  };

  const takePhoto = () => {
    ImagePicker.launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        //setResponse(response);
        console.log('photo response ', response);
        setFilePath(response);
        setIsVisible(false);
        setChangeImage(true);
      },
    );
  };

  const choosePhotoLibrary = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        console.log('Library Photo ', response);
        setFilePath(response);
        setIsVisible(false);
        setChangeImage(true);
      },
    );
  };

  const [isVisible, setIsVisible] = useState(false);
  const list = [
    {
      title: 'Take Photo',
      onPress: () => takePhoto(),
    },
    {
      title: 'Choose Photo from Library',
      onPress: () => choosePhotoLibrary(),
    },
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: 'white'},
      titleStyle: {color: 'black'},
      onPress: () => setIsVisible(false),
    },
  ];

  const updateMainVariable = (key, value, type) => {
    if (type === 'input') {
      firstRouteData = {...firstRouteData, [key]: value};
    } else {
      let val = value ? '1' : '0';
      firstRouteData = {...firstRouteData, [key]: val};
    }
  };

  const updateAddrMainVariable = (key, value, type) => {
    if (type === 'input') {
      secondRouteData = {...secondRouteData, [key]: value};
    } else {
      let val = value ? '1' : '0';
      secondRouteData = {...secondRouteData, [key]: val};
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior="padding"
      enabled
      keyboardVerticalOffset={Platform.OS == 'ios' ? 150 : -100}>
      <ScrollView>
        <BottomSheet
          isVisible={isVisible}
          containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
          {list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
        <View
          style={{
            flex: 1,
            marginTop: 15,
            marginBottom: 15,
            backgroundColor: colors.whiteWithOpacity,
          }}>
          <View>
            <View style={{margin: 10}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={[
                    styles.placeholderCircle,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}>
                  <Image
                    source={{uri: filePath.uri}}
                    style={{width: 80, height: 80, borderRadius: 10}}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => openPhotoBottomSheet()}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    height: 25,
                    width: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 30,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 2,
                  }}>
                  <Image
                    source={require('../assests/edit.png')}
                    style={{width: 15, height: 15}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            <View
              style={{
                width: '50%',
              }}>
              <View
                style={{
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <BusinessCardField
                  labelname={i18n.t('first_name')}
                  labelbold={true}
                  textname={fields.first_name}
                  changeText={(val) => setInputData('first_name', val)}
                  texttype="default"
                  isEnabled={switches.first_name_visibility}
                  showSwitch={false}
                  toggleSwitch={(val) =>
                    setSwitchData('first_name_visibility', val)
                  }
                />
              </View>
            </View>

            <View
              style={{
                width: '50%',
              }}>
              <View
                style={{
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <BusinessCardField
                  labelname={i18n.t('last_name')}
                  labelbold={true}
                  textname={fields.last_name}
                  changeText={(val) => setInputData('last_name', val)}
                  texttype="default"
                  isEnabled={switches.last_name_visibility}
                  showSwitch={false}
                  toggleSwitch={(val) =>
                    setSwitchData('last_name_visibility', val)
                  }
                />
              </View>
            </View>
          </View>

          <View>
            <View style={{padding: 15, flexDirection: 'row'}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    // fontSize: hp('1.5%'),
                    fontSize: 12,
                    color: '#5E6A7C',
                  }}>
                  {i18n.t('mobile_phone')}
                </Text>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={`${fields.mobile_number}`}
                  // codeTextStyle={{height: hp('2%'), fontSize: hp('1.5%')}}
                  codeTextStyle={
                    Platform.OS == 'ios'
                      ? {height: hp('2%'), fontSize: 14}
                      : {fontSize: 14}
                  }
                  placeholder=" "
                  containerStyle={{
                    // height: hp('5%'),
                    height: 40,
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
                    fontSize: 14,
                    height: 40,
                    color: '#5E6A7C',
                  }}
                  defaultCode={redux_country_code.country_code}
                  layout="first"
                  onChangeText={(text) => {
                    setMobileInput(text);
                  }}
                />
              </View>
            </View>
          </View>

          <View>
            <View style={{padding: 15, flexDirection: 'row'}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#5E6A7C',
                  }}>
                  {i18n.t('office_phone')}
                </Text>
                <PhoneInput
                  ref={officeInput}
                  defaultValue={`${fields.office_phone}`}
                  // codeTextStyle={{height: hp('2%'), fontSize: hp('1.5%')}}
                  codeTextStyle={
                    Platform.OS == 'ios'
                      ? {height: hp('2%'), fontSize: 14}
                      : {fontSize: 14}
                  }
                  placeholder=" "
                  containerStyle={{
                    // height: hp('5%'),
                    height: 40,
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
                    // fontSize: hp('1.5%'),
                    fontSize: 14,
                    // height: hp('5%'),
                    height: 40,
                    color: '#5E6A7C',
                  }}
                  defaultCode={redux_country_code.country_code}
                  layout="first"
                  onChangeText={(text) => {
                    setOfficeInput(text);
                  }}
                />
              </View>

              <View style={{position: 'absolute', right: 15, top: 38}}>
                {!switches.office_phone_visibility ? (
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() =>
                      setSwitchData('office_phone_visibility', true)
                    }>
                    <Icon
                      name="ios-eye-off-sharp"
                      type="ionicon"
                      style={{marginRight: 15}}
                      color="#5E6A7C"
                      size={20}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() =>
                      setSwitchData('office_phone_visibility', false)
                    }>
                    <Icon
                      name="eye-sharp"
                      type="ionicon"
                      style={{marginRight: 15}}
                      color="#277EED"
                      size={20}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View>
            <View style={{padding: 15, flexDirection: 'row'}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#5E6A7C',
                  }}>
                  {i18n.t('home_phone')}
                </Text>
                <PhoneInput
                  ref={homeInput}
                  defaultValue={`${fields.home_phone}`}
                  // codeTextStyle={{height: hp('2%'), fontSize: hp('1.5%')}}
                  codeTextStyle={{height: hp('2%'), fontSize: 14}}
                  placeholder=" "
                  containerStyle={{
                    height: 40,
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
                    // fontSize: hp('1.5%'),
                    fontSize: 14,
                    // height: hp('5%'),
                    height: 40,
                    color: '#5E6A7C',
                  }}
                  defaultCode={redux_country_code.country_code}
                  layout="first"
                  onChangeText={(text) => {
                    //setInputData('home_phone', text);
                    setHomeInput(text);
                  }}
                />
              </View>

              <View style={{position: 'absolute', right: 15, top: 38}}>
                {!switches.home_phone_visibility ? (
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() =>
                      setSwitchData('home_phone_visibility', true)
                    }>
                    <Icon
                      name="ios-eye-off-sharp"
                      type="ionicon"
                      style={{marginRight: 15}}
                      color="#5E6A7C"
                      size={20}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() =>
                      setSwitchData('home_phone_visibility', false)
                    }>
                    <Icon
                      name="eye-sharp"
                      type="ionicon"
                      style={{marginRight: 15}}
                      color="#277EED"
                      size={20}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('email')}
                labelbold={true}
                textname={fields.email}
                changeText={(val) => setInputData('email', val)}
                texttype="default"
                isEnabled={switches.email_visibility}
                showSwitch={false}
                toggleSwitch={(val) => setSwitchData('email_visibility', val)}
              />
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('facebook_label')}
                textname={fields.facebook}
                iconInput={true}
                imglabel={require('../assests/facebook.png')}
                changeText={(val) => setInputData('facebook', val)}
                texttype="default"
                isEnabled={switches.facebook_visibility}
                showSwitch={true}
                toggleSwitch={(val) =>
                  setSwitchData('facebook_visibility', val)
                }
              />
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('instagram_label')}
                textname={fields.instagram}
                iconInput={true}
                imglabel={require('../assests/instagram.png')}
                changeText={(val) => setInputData('instagram', val)}
                texttype="default"
                isEnabled={switches.instagram_visibility}
                showSwitch={true}
                toggleSwitch={(val) =>
                  setSwitchData('instagram_visibility', val)
                }
              />
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('linkedin_label')}
                textname={fields.linkedin}
                iconInput={true}
                imglabel={require('../assests/linkedin.png')}
                changeText={(val) => setInputData('linkedin', val)}
                texttype="default"
                isEnabled={switches.linkedin_visibility}
                showSwitch={true}
                toggleSwitch={(val) =>
                  setSwitchData('linkedin_visibility', val)
                }
              />
            </View>
          </View>

          <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
            <BusinessCardField
              labelname={i18n.t('county')}
              textname={addrFields.country}
              changeText={(val) => setAddrInputData('country', val)}
              texttype="default"
              isEnabled={addrSwitches.country_visibility}
              showSwitch={true}
              toggleSwitch={(val) =>
                setAddrSwitchData('country_visibility', val)
              }
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            <View
              style={{
                width: '50%',
              }}>
              <View
                style={{
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <BusinessCardField
                  labelname={i18n.t('state')}
                  textname={addrFields.state}
                  changeText={(val) => setAddrInputData('state', val)}
                  texttype="default"
                  isEnabled={addrSwitches.state_visibility}
                  showSwitch={true}
                  toggleSwitch={(val) =>
                    setAddrSwitchData('state_visibility', val)
                  }
                />
              </View>
            </View>

            <View
              style={{
                width: '50%',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <BusinessCardField
                  labelname={i18n.t('city')}
                  textname={addrFields.city}
                  changeText={(val) => setAddrInputData('city', val)}
                  texttype="default"
                  isEnabled={addrSwitches.city_visibility}
                  showSwitch={true}
                  toggleSwitch={(val) =>
                    setAddrSwitchData('city_visibility', val)
                  }
                />
              </View>
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('street')}
                textname={addrFields.street}
                changeText={(val) => setAddrInputData('street', val)}
                // placeholder="Enter Street"
                texttype="default"
                isEnabled={addrSwitches.street_visibility}
                showSwitch={true}
                toggleSwitch={(val) =>
                  setAddrSwitchData('street_visibility', val)
                }
              />
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('street_number')}
                textname={addrFields.street_number}
                changeText={(val) => setAddrInputData('street_number', val)}
                texttype="default"
                isEnabled={addrSwitches.street_number_visibility}
                showSwitch={true}
                toggleSwitch={(val) =>
                  setAddrSwitchData('street_number_visibility', val)
                }
              />
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <TouchableOpacity
              onPress={() => firstFormSubmit()}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.btnSubmitViewStyle}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  {i18n.t('save_and_continue')}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SecondRoute = (props) => {
  const phoneInput = useRef(null);
  const faxInput = useRef(null);
  const [focused, setFocused] = useState(false);
  const [loader, setLoader] = useState(false);
  const logindata = useSelector((state) => state.LoginReducer);
  const redux_country_code = useSelector((state) => state.CountryCodeReducer);
  const dispatch = useDispatch();
  const [selectedDropdown, setSelectedDropdown] = useState('Software Engineer');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [fields, setFields] = useState({
    title: 'Software Engineer',
    description: '',
    company_name: '',
    phone: '',
    fax: '',
    email: '',
    phone_prefix: '',
    country: '',
    state: '',
    city: '',
    street: '',
    street_number: '',
    phone_country_code: '',
    fax_prefix: '',
    fax_country_code: '',
  });
  const [switches, setSwitches] = useState({
    title_visibility: false,
    description_visibility: false,
    company_name_visibility: false,
    phone_visibility: false,
    fax_visibility: false,
    email_visibility: false,
    country_visibility: false,
    state_visibility: false,
    city_visibility: false,
    street_visibility: false,
    street_number_visibility: false,
  });

  useEffect(() => {
    const items = [
      {label: 'Software Engineer', value: 'Software Engineer', selected: true},
      {label: 'Doctor', value: 'Doctor', selected: false},
      {label: 'Student', value: 'Student', selected: false},
      {label: 'Truck Driver', value: 'Truck Driver', selected: false},
    ];
    setDropdown(items);
  }, []);

  const thirdFormSubmit = async () => {
    setLoader(true);

    if (firstRouteData.first_name == '') {
      Toast.show(i18n.t('check_personal_firstname'), Toast.LONG);
      setLoader(false);
      return false;
    }

    if (firstRouteData.last_name == '') {
      Toast.show(i18n.t('check_personal_lastname'), Toast.LONG);
      setLoader(false);
      return false;
    }

    if (firstRouteData.mobile_number == '') {
      Toast.show(i18n.t('valid_mobile_personal_info'), Toast.LONG);
      setLoader(false);
      return false;
    }

    if (firstRouteData.email != '') {
      if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          firstRouteData.email,
        )
      ) {
        Toast.show(i18n.t('valid_email_personal_info'), Toast.LONG);
        setLoader(false);
        return false;
      }
    } else {
      Toast.show(i18n.t('check_email_personal_info'), Toast.LONG);
      setLoader(false);
      return false;
    }

    if (firstRouteData.mobile_number.length != 0) {
      if (!phoneInput.current?.isValidNumber(firstRouteData.mobile_number)) {
        Toast.show(i18n.t('check_mobile_personal_info'), Toast.LONG);
        setLoader(false);
        return;
      }
    }

    if (fields.email != '') {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields.email)) {
        Toast.show(i18n.t('check_valid_emailID'), Toast.LONG);
        setLoader(false);
        return false;
      }
    } else {
      Toast.show(i18n.t('check_emailID'), Toast.LONG);
      setLoader(false);
      return false;
    }
    if (fields.phone.length != 0) {
      if (!phoneInput.current?.isValidNumber(fields.phone)) {
        Toast.show(i18n.t('check_mobile_number'), Toast.LONG);
        setLoader(false);
        return;
      }
    }
    if (fields.fax.length != 0) {
      if (!faxInput.current?.isValidNumber(fields.fax)) {
        Toast.show(i18n.t('check_fax_number'), Toast.LONG);
        setLoader(false);
        return;
      }
    }
    const replaceString = {};
    for (let [key, value] of Object.entries(switches)) {
      replaceString[key] = value ? '1' : '0';
    }
    let params = {...fields, ...replaceString};
    //console.log('First Data  ', firstRouteData);
    const response = await updateUserPersonalInfo({
      ...firstRouteData,
      user_id: logindata.user_id,
    });
    console.log('Update response ', response.data, firstRouteData, {
      user_id: logindata.user_id,
    });
    if (response.status === 200) {
      // setLoader(false);
      const addr_response = await updateUserAddress({
        ...secondRouteData,
        user_id: logindata.user_id,
      });
      console.log('Update address response ', addr_response.data);
      if (addr_response.status === 200) {
        const work_response = await updateUserWork({
          ...params,
          user_id: logindata.user_id,
        });
        console.log('Update address response ', work_response.data);
        if (work_response.status === 200) {
          setLoader(false);

          let master_response = await getUserMasterContact({
            user_id: logindata.user_id,
          });
          if (master_response.status === 200) {
            await dispatch(loginDetails(master_response.data.data));
            props.navigation.navigate('Drawer');
          } else {
            console.log('Error While Calling API');
          }
          console.log(
            'work_response info success ',
            work_response.data.message,
            work_response.data,
          );
          Toast.show(work_response.data.message, Toast.LONG);
        } else {
          setLoader(false);
          console.log(
            'work_response info ',
            work_response.data.message,
            work_response.data,
          );
          if (
            work_response.data.message == 'validation_error' &&
            work_response.data.data.email
          ) {
            Toast.show('The email field is required.', Toast.LONG);
          } else {
            Toast.show(work_response.data.message, Toast.LONG);
          }
        }
      } else {
        setLoader(false);
        console.log(
          'addr_response info ',
          addr_response.data.message,
          addr_response.data,
        );
        Toast.show(addr_response.data.message, Toast.LONG);
      }
      // Toast.show('Updated', Toast.LONG);
    } else {
      setLoader(false);
      console.log('personal info ', response.data.message, response.data);
      Toast.show(response.data.message, Toast.LONG);
    }
  };

  selectDropdown = (select, label, ind) => {
    let dropdowncopy = [...dropdown];
    const datav = dropdowncopy.reduce((acc, cur, index) => {
      if (index == ind) {
        cur.selected = !select;
      } else {
        cur.selected = false;
      }
      acc.push(cur);
      return acc;
    }, []);
    console.log('selected Dropdown values ', datav);
    setDropdown(datav);
    setSelectedDropdown(label);
    setFields({...fields, title: label});
    setShowDropdown(false);
    // updateMainVariable('title', label, 'input');
  };

  const setPhoneInput = (text) => {
    console.log('calling');
    setFields({
      ...fields,
      phone: text,
      phone_prefix: `+${phoneInput.current?.getCallingCode()}`,
      phone_country_code: `${phoneInput.current?.getCountryCode()}`,
    });
  };

  const setFaxInput = (text) => {
    console.log('calling');
    setFields({
      ...fields,
      fax: text,
      fax_prefix: `+${faxInput.current?.getCallingCode()}`,
      fax_country_code: `${faxInput.current?.getCountryCode()}`,
    });
  };

  //const dispatch = useDispatch();
  const setInputData = (key, value) => {
    setFields({...fields, [key]: value});
  };

  const setSwitchData = (key, value) => {
    setSwitches({...switches, [key]: value});
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior="padding"
      enabled
      keyboardVerticalOffset={Platform.OS == 'ios' ? 150 : -100}>
      <ScrollView>
        <View
          style={{
            flex: 1,
            marginTop: 15,
            marginBottom: 15,
            backgroundColor: colors.whiteWithOpacity,
          }}>
          <View style={{margin: 10}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: wp('76%'), marginLeft: wp('2%')}}>
                <Text
                  style={{
                    color: 'black',
                    // fontWeight: 'bold',
                    fontSize: 12,
                    color: '#5E6A7C',
                  }}>
                  {i18n.t('job_title')}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 5,
                paddingLeft: 5,
                paddingRight: 5,
              }}>
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                activeOpacity={1}
                style={{
                  width: '100%',
                  // height: hp('5%'),
                  height: 40,
                  backgroundColor: '#E7EBF0',
                  borderRadius: 10,
                  // marginLeft: wp('2%'),
                  justifyContent: 'center',
                  paddingLeft: wp('2%'),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginTop: 2, color: '#5E6A7C'}}>
                    {selectedDropdown}
                  </Text>
                  <View style={{marginRight: 0}}>
                    {!switches.title_visibility ? (
                      <TouchableOpacity
                        style={{justifyContent: 'center'}}
                        onPress={() => setSwitchData('title_visibility', true)}>
                        <Icon
                          name="ios-eye-off-sharp"
                          type="ionicon"
                          style={{marginRight: 15}}
                          color="#5E6A7C"
                          size={20}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{justifyContent: 'center'}}
                        onPress={() =>
                          setSwitchData('title_visibility', false)
                        }>
                        <Icon
                          name="eye-sharp"
                          type="ionicon"
                          style={{marginRight: 15}}
                          color="#277EED"
                          size={20}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {showDropdown ? (
            <View style={{position: 'absolute', top: '10%', zIndex: 1}}>
              <View
                style={{
                  padding: 10,
                  width: wp('100%') - 30,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  marginLeft: 15,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,

                  elevation: 6,
                }}>
                {dropdown.map((data, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        selectDropdown(data.selected, data.label, index)
                      }
                      style={{
                        height: 35,
                        // backgroundColor: 'blue',
                        justifyContent: 'center',
                        paddingLeft: 10,
                        backgroundColor: data.selected
                          ? 'rgba(39, 126, 237, 0.08)'
                          : '#fff',
                        borderRadius: 10,
                      }}>
                      <Text
                        style={{
                          color: data.selected ? colors.primaryColor : '#000',
                        }}>
                        {data.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('job_description')}
                textname={fields.description}
                changeText={(val) => setInputData('description', val)}
                texttype="default"
                isEnabled={switches.description_visibility}
                showSwitch={true}
                toggleSwitch={(val) =>
                  setSwitchData('description_visibility', val)
                }
              />
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('company_name')}
                textname={fields.company_name}
                changeText={(val) => setInputData('company_name', val)}
                texttype="default"
                isEnabled={switches.company_name_visibility}
                showSwitch={true}
                toggleSwitch={(val) =>
                  setSwitchData('company_name_visibility', val)
                }
              />
            </View>
          </View>

          <View>
            <View style={{padding: 15, flexDirection: 'row'}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#5E6A7C',
                  }}>
                  {i18n.t('mobile_phone')}
                </Text>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={`${fields.phone}`}
                  // codeTextStyle={{height: hp('2%'), fontSize: hp('1.5%')}}
                  codeTextStyle={
                    Platform.OS == 'ios'
                      ? {height: hp('2%'), fontSize: 14}
                      : {fontSize: 14}
                  }
                  placeholder=" "
                  containerStyle={{
                    // height: hp('5%'),
                    height: 40,
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
                    // fontSize: hp('1.5%'),
                    fontSize: 14,
                    // height: hp('5%'),
                    height: 40,
                    color: '#5E6A7C',
                  }}
                  defaultCode={redux_country_code.country_code}
                  layout="first"
                  onChangeText={(text) => {
                    //setInputData('mobile_number', text);
                    setPhoneInput(text);
                  }}
                />
              </View>
              <View style={{position: 'absolute', right: 15, top: 38}}>
                {!switches.phone_visibility ? (
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() => setSwitchData('phone_visibility', true)}>
                    <Icon
                      name="ios-eye-off-sharp"
                      type="ionicon"
                      style={{marginRight: 15}}
                      color="#5E6A7C"
                      size={20}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() => setSwitchData('phone_visibility', false)}>
                    <Icon
                      name="eye-sharp"
                      type="ionicon"
                      style={{marginRight: 15}}
                      color="#277EED"
                      size={20}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View>
            <View style={{padding: 15, flexDirection: 'row'}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#5E6A7C',
                  }}>
                  {i18n.t('fax')}
                </Text>
                <PhoneInput
                  ref={faxInput}
                  defaultValue={`${fields.fax}`}
                  // codeTextStyle={{height: hp('2%'), fontSize: hp('1.5%')}}
                  codeTextStyle={
                    Platform.OS == 'ios'
                      ? {height: hp('2%'), fontSize: 14}
                      : {fontSize: 14}
                  }
                  placeholder=" "
                  containerStyle={{
                    // height: hp('5%'),
                    height: 40,
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
                    // fontSize: hp('1.5%'),
                    fontSize: 14,
                    // height: hp('5%'),
                    height: 40,
                    color: '#5E6A7C',
                  }}
                  defaultCode={redux_country_code.country_code}
                  layout="first"
                  onChangeText={(text) => {
                    //setInputData('mobile_number', text);
                    setFaxInput(text);
                  }}
                />
              </View>
              <View style={{position: 'absolute', right: 15, top: 38}}>
                {!switches.fax_visibility ? (
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() => setSwitchData('fax_visibility', true)}>
                    <Icon
                      name="ios-eye-off-sharp"
                      type="ionicon"
                      style={{marginRight: 15}}
                      color="#5E6A7C"
                      size={20}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() => setSwitchData('fax_visibility', false)}>
                    <Icon
                      name="eye-sharp"
                      type="ionicon"
                      style={{marginRight: 15}}
                      color="#277EED"
                      size={20}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('email')}
                labelbold={true}
                textname={fields.email}
                changeText={(val) => setInputData('email', val)}
                texttype="default"
                isEnabled={switches.email_visibility}
                showSwitch={true}
                toggleSwitch={(val) => setSwitchData('email_visibility', val)}
              />
            </View>
          </View>

          <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
            <BusinessCardField
              labelname={i18n.t('country')}
              textname={fields.country}
              changeText={(val) => setInputData('country', val)}
              texttype="default"
              isEnabled={switches.country_visibility}
              showSwitch={true}
              toggleSwitch={(val) => setSwitchData('country_visibility', val)}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            <View
              style={{
                width: '50%',
              }}>
              <View
                style={{
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <BusinessCardField
                  labelname={i18n.t('state')}
                  textname={fields.state}
                  changeText={(val) => setInputData('state', val)}
                  texttype="default"
                  isEnabled={switches.state_visibility}
                  showSwitch={true}
                  toggleSwitch={(val) => setSwitchData('state_visibility', val)}
                />
              </View>
            </View>

            <View
              style={{
                width: '50%',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <BusinessCardField
                  labelname={i18n.t('city')}
                  textname={fields.city}
                  changeText={(val) => setInputData('city', val)}
                  texttype="default"
                  isEnabled={switches.city_visibility}
                  showSwitch={true}
                  toggleSwitch={(val) => setSwitchData('city_visibility', val)}
                />
              </View>
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('street')}
                textname={fields.street}
                changeText={(val) => setInputData('street', val)}
                texttype="default"
                isEnabled={switches.street_visibility}
                showSwitch={true}
                toggleSwitch={(val) => setSwitchData('street_visibility', val)}
              />
            </View>
          </View>

          <View>
            <View style={{padding: 10, paddingLeft: 15, paddingRight: 15}}>
              <BusinessCardField
                labelname={i18n.t('street_number')}
                textname={fields.street_number}
                changeText={(val) => setInputData('street_number', val)}
                texttype="default"
                isEnabled={switches.street_number_visibility}
                showSwitch={true}
                toggleSwitch={(val) =>
                  setSwitchData('street_number_visibility', val)
                }
              />
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <TouchableOpacity
              onPress={() => thirdFormSubmit()}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.btnSubmitViewStyle}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  {i18n.t('done')}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const BusinessCard = (props) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'personal', title: i18n.t('personal_info_tab_label')},
    {key: 'business', title: i18n.t('business_info_tab_label')},
  ]);

  useEffect(() => {
    if (Platform.OS != 'ios') {
      getPermissionAsync();
    }
  }, []);

  const getPermissionAsync = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'MyQard Camera Permission',
          message: 'MyQard needs access to your camera ' + 'so you can scan.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={({route, focused, color}) => (
        <Text
          style={{
            color,
            fontSize: 12,
            fontWeight: '500',
            // fontWeight: 'bold',
          }}>
          {route.title}
        </Text>
      )}
      indicatorStyle={{
        backgroundColor: colors.primaryColor,
      }}
      style={{
        backgroundColor: colors.whiteWithOpacity,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        borderTopWidth: 0,
        elevation: 0,
      }}
      indicatorContainerStyle={{
        borderColor: colors.textFieldBgColor,
      }}
      inactiveColor="rgba(94, 106, 124, 0.6)"
      activeColor={colors.primaryColor}
    />
  );

  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'personal':
        return <FirstRoute jumpTo={jumpTo} {...props} />;
      case 'business':
        return <SecondRoute jumpTo={jumpTo} {...props} />;
      default:
        break;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <HeaderBar
        iconLeft={{name: 'leftcircle', type: 'antdesign'}}
        headerName={i18n.t('business_card_label')}
        backgroundColor="rgba(39, 126, 237,0.6)"
        barStyle="dark-content"
        left={true}
        right={false}
        back={true}
        navigateOfLeft={() => props.navigation.goBack()}
      />
      <View style={{flex: 1, backgroundColor: colors.whiteWithOpacity}}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  btnSubmitViewStyle: {
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    backgroundColor: '#4287f5',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    width: '90%',
    borderRadius: 10,
  },
  placeholderCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 5,
  },
});

export default BusinessCard;

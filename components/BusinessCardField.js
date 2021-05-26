import React, {useState} from 'react';
import {Text, View, TextInput, Switch, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {colors} from '../utils/Config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen-hooks';
import {Image} from 'react-native';

const BusinessCardField = (props) => {
  const [focused, setFocused] = useState(false);
  return (
    <>
      <View
        style={{
          width: wp('80%'),
        }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: props.labelbold ? 'bold' : 'normal',
            color: focused ? colors.primaryColor : '#5E6A7C',
          }}>
          {props.labelname}
        </Text>
      </View>
      <View style={{flexDirection: 'row', width: '100%'}}>
        {props.iconInput ? (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
              borderRadius: 10,
              backgroundColor: colors.textFieldBgColor,
            }}>
            <Image source={props.imglabel} style={{marginLeft: 10}} />
            <TextInput
              value={props.textname}
              onChangeText={(value) => props.changeText(value)}
              keyboardType={props.texttype}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                width: '80%',
                flex: 1,
                height: 40,
                paddingLeft: wp('2%'),
                fontSize: 14,
                color: '#5E6A7C',
                fontWeight: focused ? 'bold' : 'normal',
              }}
            />
            {props.showSwitch ? (
              !props.isEnabled ? (
                <TouchableOpacity
                  style={{justifyContent: 'center'}}
                  onPress={() => props.toggleSwitch(true)}>
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
                  onPress={() => props.toggleSwitch(false)}>
                  <Icon
                    name="eye-sharp"
                    type="ionicon"
                    style={{marginRight: 15}}
                    color="#277EED"
                    size={20}
                  />
                </TouchableOpacity>
              )
            ) : null}
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 40,
              borderRadius: 10,
              backgroundColor: colors.textFieldBgColor,
            }}>
            <TextInput
              value={props.textname}
              onChangeText={(value) => props.changeText(value)}
              keyboardType={props.texttype}
              secureTextEntry={props.passwordfield ? true : false}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                width: '80%',
                height: 40,
                borderRadius: 10,
                backgroundColor: colors.textFieldBgColor,
                paddingLeft: wp('2%'),
                fontSize: 14,
                color: '#5E6A7C',
                fontWeight: focused ? 'bold' : 'normal',
              }}
            />

            {props.showSwitch ? (
              !props.isEnabled ? (
                <TouchableOpacity
                  style={{justifyContent: 'center'}}
                  onPress={() => props.toggleSwitch(true)}>
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
                  onPress={() => props.toggleSwitch(false)}>
                  <Icon
                    name="eye-sharp"
                    type="ionicon"
                    style={{marginRight: 15}}
                    color="#277EED"
                    size={20}
                  />
                </TouchableOpacity>
              )
            ) : null}
          </View>
        )}
      </View>
    </>
  );
};

export default BusinessCardField;

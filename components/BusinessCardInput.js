import React, {useState} from 'react';
import {Text, TextInput} from 'react-native';
import {colors} from '../utils/Config';
const BusinessCardInput = (props) => {
  const [focused, setFocused] = useState(false);
  return (
    <>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 12,
          color: focused ? colors.primaryColor : '#5E6A7C',
        }}>
        {props.labelname}
      </Text>
      <TextInput
        value={props.textname}
        onChangeText={(value) => props.changeText(value)}
        keyboardType={props.texttype}
        secureTextEntry={props.passwordfield ? true : false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: 40,
          borderRadius: 10,
          backgroundColor: colors.textFieldBgColor,
          paddingLeft: 10,
          fontSize: 14,
        }}
      />
    </>
  );
};

export default BusinessCardInput;

import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Icon} from 'react-native-elements';

const DrawerListItem = (props) => {
  return (
    <TouchableOpacity
      style={{margin: 15, flexDirection: 'row'}}
      onPress={() => props.onDrawerListClick()}>
      <View
        style={{
          backgroundColor: '#277EED',
          borderRadius: 10,
          height: 40,
          width: 40,
          marginLeft: 10,
        }}>
        <Icon
          name={props.iconData.name}
          type={props.iconData.type}
          color="#fff"
          size={18}
          style={{margin: 10}}
        />
      </View>
      <View style={{marginLeft: 15, justifyContent: 'center'}}>
        <Text style={{fontSize: 16, color: 'rgba(44, 64, 110,0.4)'}}>
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DrawerListItem;

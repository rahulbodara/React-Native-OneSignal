import React from 'react';
import {Image} from 'react-native';
import {StatusBar} from 'react-native';
import {Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {colors, statusBarHeight} from '../utils/Config';

const HeaderBar = (props) => {
  return (
    <>
      <StatusBar barStyle="default" hidden={false} />
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.primaryColor,
          paddingTop: statusBarHeight(),
        }}>
        <View
          style={{
            marginTop: 16,
            marginBottom: 16,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {props.left ? (
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 24,
              }}>
              {props.back ? (
                <TouchableOpacity
                  style={{justifyContent: 'center'}}
                  onPress={() => props.navigateOfLeft()}>
                  <Icon
                    name={props.iconLeft.name}
                    type={props.iconLeft.type}
                    color="#fff"
                    size={35}
                  />
                </TouchableOpacity>
              ) : !props.center ? (
                <TouchableOpacity onPress={() => props.navigateOfLeft()}>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 5,
                      //   marginLeft: 10,
                    }}>
                    <Icon
                      name={props.iconLeft.name}
                      type={props.iconLeft.type}
                      color="#277EED"
                      size={20}
                      style={{margin: 8}}
                    />
                  </View>
                </TouchableOpacity>
              ) : null}
              <View
                style={{
                  marginLeft: 15,
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 20, color: '#fff'}}>
                  {props.headerName}
                </Text>
              </View>
            </View>
          ) : null}
          {props.right ? (
            <View
              style={{
                paddingRight: 24,
              }}>
              <TouchableOpacity
                style={{}}
                onPress={() => props.navigateOfRight()}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    alignItems: 'center',
                    width: 40,
                  }}>
                  {!props.iconRightImg ? (
                    <Icon
                      name={props.iconRight.name}
                      type={props.iconRight.type}
                      color="#277EED"
                      size={20}
                      style={{margin: 8}}
                    />
                  ) : (
                    <Image
                      source={props.iconRImage}
                      style={{
                        width: 20,
                        height: 20,
                        margin: 8,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default HeaderBar;

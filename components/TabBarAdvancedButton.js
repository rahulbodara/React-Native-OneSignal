import React from 'react';
import {StyleSheet, TouchableOpacity, View, Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const screenHeight = Dimensions.get('screen').height;

export default TabBarAdvancedButton = (props) => (
  <View style={styles.container} pointerEvents="box-none">
    <LinearGradient colors={['#5EA4FF', '#277EED']} style={styles.button}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('AddNewContacts');
        }}>
        <Icon
          name="plus"
          type="font-awesome"
          color="#fff"
          style={styles.buttonIcon}
        />
      </TouchableOpacity>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 85,
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    top: 0,
    marginLeft: 15,
  },
  button: {
    top: screenHeight > 780 ? -25.5 : -28,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 27,
    shadowOffset: {width: 10, height: 15},
    shadowColor: 'blue',
    shadowOpacity: 1,
    elevation: 5,
  },
});

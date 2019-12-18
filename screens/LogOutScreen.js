import React from 'react';
import { StyleSheet } from 'react-native';
import {
    Text,
  } from '@ui-kitten/components';

class LogOutScreen extends React.Component {
    static navigationOptions = {
      drawerLabel: 'LogOut',
    };
  
    render() {
      return (
        <Text>LogOut SCREEN</Text>
      );
    }
  }

const styles = StyleSheet.create({
  
});

export default LogOutScreen;
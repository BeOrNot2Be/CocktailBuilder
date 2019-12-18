import React from 'react';
import { StyleSheet } from 'react-native';
import {
    Text,
  } from '@ui-kitten/components';

class UserScreen extends React.Component {
    static navigationOptions = {
      drawerLabel: 'User',
    };
  
    render() {
      return (
        <Text>User SCREEN</Text>
      );
    }
  }

const styles = StyleSheet.create({
  
});

export default UserScreen;
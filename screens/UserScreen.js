import React from 'react';
import { StyleSheet } from 'react-native';
import {
    Text,
    Layout
  } from '@ui-kitten/components';

class UserScreen extends React.Component {
    static navigationOptions = {
      drawerLabel: 'User',
    };
  
    render() {
      return (
        <Layout level='1'>
          <Text>User SCREEN</Text>
        </Layout>
      );
    }
  }

const styles = StyleSheet.create({
  
});

export default UserScreen;
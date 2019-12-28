import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
    Text,
    Layout,
    Avatar,
    Toggle,
    Divider
  } from '@ui-kitten/components';
  import { LinearGradient } from 'expo-linear-gradient';
  import { ThemeContext } from '../themes/theme-context';


const UserScreen = ({navigation}) => {
      const theme = React.useContext(ThemeContext);
      const [checked, setChecked] = React.useState(false);
      
      const onCheckedChange = (isChecked) => {
        setChecked(isChecked);
        theme.toggleTheme();
      };

      return (
        <Layout style={styles.drawerContainer}>
          <Layout style={styles.headerContainer} >
            <LinearGradient
              start={[0, 0.5]}
              colors={['#0BAB64', '#3BB78F']}
              style={styles.gradient} 
            >
              <Layout style={styles.boxHeader} >
                <Layout style={styles.avatarContainer}>
                  <Avatar style={styles.circle} shape='rounded' source={require('../assets/images/avatar.jpg')}/>
                </Layout>
                <Text category='h6'>
                  Alex Weinstein
                </Text>
              </Layout>
            </LinearGradient>
          </Layout>
          <Layout style={styles.middleContainer} level='2'/>
          <Layout style={styles.footerContainer}>
          <Layout style={{...styles.boxFooter, alignItems: 'flex-end'}}>
              <Toggle
                text='Theme'
                status='basic'
                checked={checked}
                onChange={onCheckedChange}
              />
            </Layout>
            <Divider/>
            <Layout style={styles.boxFooter}>
              <TouchableOpacity                   
                style={styles.LogOutButton}
                onPress={() => navigation.navigate('LogOut')}
              >
                <Text 
                  status="danger"
                >Log Out</Text>
              </TouchableOpacity>
            </Layout>
            <Layout style={{flex:1}}>
              <Text style={styles.center} appearance='hint'>
                powered by cocktailbuilder.com 2019
              </Text>
            </Layout>
          </Layout>
        </Layout>
      );
  }

const styles = StyleSheet.create({
  drawerContainer:{
    flexDirection: 'column',
    flex: 1,
  },
  headerContainer:{
    flex: 4,
  },
  gradient:{
    height: '100%',
  },
  boxHeader:{
    flex: 1,
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  avatarContainer: {
    backgroundColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  circle: {
    width: 100,
    height: 100,
  },
  middleContainer:{
    flex: 9,
  },
  footerContainer:{
    flex: 3,
  },
  boxFooter:{
    flex: 2,
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
  },
  LogOutButton: {
    width: '100%',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    textAlign:'center'
  },
});

export default UserScreen;
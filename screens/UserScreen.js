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
  import { connect } from 'react-redux';
  import { 
    LOG_OUT,
    TOGGLE_THEME
  } from '../actions/User';
const UserScreen = ({navigation, user, toggleTheme, LogOut}) => {

      return (
        <Layout style={styles.drawerContainer}>
          <Layout style={styles.headerContainer} >
            <TouchableOpacity onPress={ user.logged ? () => {} : () => googleLogin()}>
              <LinearGradient
                start={[0, 0.5]}
                colors={['#0BAB64', '#3BB78F']}
                style={styles.gradient} 
              >
                <Layout style={styles.boxHeader} >
                {user.logged ? (
                  <>
                  <Layout style={styles.avatarContainer}>
                    <Avatar style={styles.circle} shape='rounded' source={{uri: user.userInfo.photoUrl}}/>
                  </Layout>
                  <Text category='h6'>
                    {user.userInfo.name}
                  </Text>
                  </>
                ) : (
                  <>
                    <Layout style={styles.avatarContainer}>
                      <Avatar style={styles.circle} shape='rounded' source={require('../assets/images/icon.png')}/>
                    </Layout>
                    <Text category='h6'>
                      Cocktail Builder
                    </Text>
                  </>
                )}
                </Layout>
              </LinearGradient>
            </TouchableOpacity>
          </Layout>
          <Layout style={styles.middleContainer} level='2'/>
          <Layout style={styles.footerContainer}>
          <Layout style={{...styles.boxFooter, alignItems: 'flex-end'}}>
              <Toggle
                text='Theme'
                status='basic'
                checked={user.theme == 1? true: false}
                onChange={toggleTheme}
              />
            </Layout>
            <Divider/>
            <Layout style={styles.boxFooter}>
              <TouchableOpacity                   
                style={styles.LogOutButton}
                onPress={() => LogOut()}
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

const mapStateToProps = (state) => {
  return (
    {
      user: state.user
    }
  )
};

const mapDispatchToProps = dispatch => ({
  toggleTheme: () => dispatch({type: TOGGLE_THEME}),
  LogOut : () => dispatch({type: LOG_OUT}),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
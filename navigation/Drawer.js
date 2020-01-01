import React from 'react';
import { StyleSheet, TouchableOpacity, Alert, Easing, Animated } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {
  Avatar,
  Toggle,
  Layout,
  Text,
  Divider,
  List,
  Button
} from '@ui-kitten/components';
import UserScreen from '../screens/UserScreen';
import RecipeModalScreen from '../screens/RecipeModalScreen';
import { createStackNavigator } from 'react-navigation-stack';
import MainTabNavigator from './MainTabNavigator';
import { HomeIcon } from '../components/Icons';
import { createAppContainer } from 'react-navigation';
import { Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import { 
  LOG_OUT,
  TOGGLE_THEME
} from '../actions/User';
import GoogleApi from '../api/google';
import NativeApi from '../api/native';



const DrawerComponent  = ({ navigation, user, LogOut, googleLogin, toggleTheme, initUser}) => {

  const [route, setRoute] = React.useState(navigation.state.routes[0].routeName);

  if (user.userInfo === undefined) {
    initUser();
  }

  const onSelect = (index) => {
    const { [index]: selectedTabRoute } = navigation.state.routes;
    navigation.navigate(selectedTabRoute.routeName);
    setRoute(selectedTabRoute.routeName);
    navigation.closeDrawer();
  };

  const data = [{ title: 'Home', icon:HomeIcon }];
  
  const renderItem = ({ item, index }) => {
    return (
      <Layout>
        <TouchableOpacity 
          onPress={() => onSelect(index)}
        > 
          <Layout style={styles.listItemContainer} >
            <Layout style={styles.listItemIcon} level={route == item.title ? '3' : '2'}>
              <Button 
                icon={item.icon}
                status={route == item.title ? 'primary' : 'basic'}
                appearance='ghost'
              />
            </Layout>
            <Layout style={styles.layoutTittle}  level={route == item.title ? '3' : '2'}>
              <Text category={route == item.title ? 'label' : 'c2'}>
                {item.title}
              </Text>
            </Layout>
          </Layout>
        </TouchableOpacity>
        <Divider/>
      </Layout>
    )
  }

  return (
        <Layout style={styles.drawerContainer}>
          <Layout style={styles.headerContainer} >
            <TouchableOpacity onPress={ user.logged ? () => onSelect(1) : () => googleLogin()}>
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
          <Layout style={styles.middleContainer} level='2'>
            <List 
              data={data}
              renderItem={renderItem}
            />
          </Layout>
          <Layout style={styles.footerContainer}>
            <Divider/>
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
              <TouchableOpacity style={{width:'100%'}}>
                {user.logged? (
                  <Text 
                    style={styles.LogOutButton}
                    status="danger"
                    onPress={() => Alert.alert(
                      'Alert',
                      'Are you sure that you wanna sign out?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        { text: 'Yes', onPress: () => LogOut() },
                      ],
                      { cancelable: false }
                    )}
                  >Log Out</Text>
                ): (
                  <Text 
                    style={styles.LogOutButton}
                    status="info"
                    onPress={() => googleLogin()}
                  >Log In</Text>
                )}
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
};

const mapStateToProps = (state) => {
  return (
    {
      user: state.user
    }
  )
};

const mapDispatchToProps = dispatch => ({
  LogOut : () => {NativeApi.ClearUserCache(dispatch); dispatch({type: LOG_OUT})},
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  toggleTheme: () => dispatch({type: TOGGLE_THEME}), 
  initUser: () => NativeApi.GetUser(dispatch),
});

const DrawerNavigator  = createDrawerNavigator({
  Home: createStackNavigator(
      {
        content: MainTabNavigator,
        modal: { screen: RecipeModalScreen },
      },
      {
        headerMode: 'none',
        mode: 'modal',
        initialRouteName: 'content',
        transparentCard: true,
        cardShadowEnabled: false,
        defaultNavigationOptions: {
          gesturesEnabled: false,
        },
        transitionConfig: () => ({
          transitionSpec: {
            duration: 250,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
          },
          screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const thisSceneIndex = scene.index;
        
            const height = layout.initHeight;
            const translateY = position.interpolate({
              inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
              outputRange: [height, 0, 0],
            });
        
            const opacity = position.interpolate({
              inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
              outputRange: [1, 1, 0.5],
            });
        
            return { opacity, transform: [{ translateY }] };
          },
        }),
      } 
  ),
  User: { 
    screen: UserScreen
  },
}, {
  contentComponent: connect(mapStateToProps, mapDispatchToProps)(DrawerComponent),
  drawerPosition: 'right',
  drawerOpenRoute: 'Drawer',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
});

const styles = StyleSheet.create({
  drawerContainer:{
    flexDirection: 'column',
    height: Dimensions.get('window').height,
  },
  headerContainer:{
    flex: 4,
  },
  middleContainer:{
    flex: 9,
  },
  footerContainer:{
    flex: 3,
  },
  center: {
    justifyContent: 'center',
    textAlign:'center'
  },
  container:{
    flexDirection: 'row',
  },
  box:{
    flex: 1,
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
  },
  boxHeader:{
    flex: 1,
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  boxFooter:{
    flex: 2,
    justifyContent: 'center',
    textAlign:'center',
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
  gradient:{
    height: '100%',
  },
  LogOutButton: {
    paddingHorizontal: 8,
  },
  layoutTittle: {
    padding: 16,
    flex: 4,
    justifyContent: 'flex-start',
  },
  listItemContainer: {
    paddingHorizontal: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listItemIcon: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});

export default createAppContainer(DrawerNavigator);
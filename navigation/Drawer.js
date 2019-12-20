import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {
  Icon,
  DrawerHeaderFooter,
  Toggle,
  Layout,
  Text,
  Divider,
  Button
} from '@ui-kitten/components';
import UserScreen from '../screens/UserScreen';
import LogOutScreen from '../screens/LogOutScreen';
import MainTabNavigator from './MainTabNavigator';
import { createAppContainer } from 'react-navigation';
import { ThemeContext } from '../themes/theme-context';
import { Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';



const DrawerComponent  = ({ navigation }) => {

  const theme = React.useContext(ThemeContext);
  const [checked, setChecked] = React.useState(false);
  
  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
    theme.toggleTheme();
  };

  const onSelect = (index) => {
      const { [index]: selectedTabRoute } = navigation.state.routes;
      navigation.navigate(selectedTabRoute.routeName);
      navigation.closeDrawer();
      };

  return (
        <Layout style={styles.drawerContainer}>
          <Layout style={styles.headerContainer} >
            <LinearGradient
              start={[0, 0.5]}
              colors={['#0BAB64', '#3BB78F']}
              style={styles.gradient} 
            >
              <Layout style={{...styles.boxHeader, flex:6} } >
                <View style={styles.circle}/>
              </Layout>
              <Layout style={styles.boxHeader} >
                <Text>
                  Some Random Name Upercase
                </Text>
              </Layout>
            </LinearGradient>
          </Layout>
          <Layout style={styles.middleContainer} level='2'>
          </Layout>
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
            <Layout style={{...styles.boxFooter, alignItems: 'flex-start'}}>
              <Button
                appearance="ghost"
                status="danger"
              >Log Out</Button>
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


const DrawerNavigator  = createDrawerNavigator({
  Home: {
    screen: MainTabNavigator
  },
  LogOut: { 
    screen: LogOutScreen
  },
  User: { 
    screen: UserScreen
  },
}, {
  contentComponent: DrawerComponent,
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
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50, 
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: 'gray',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  gradient:{
    height: '100%',
  }
});

export default createAppContainer(DrawerNavigator);
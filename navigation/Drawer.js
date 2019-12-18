import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {
  Drawer,
  Icon,
  DrawerHeaderFooter,
} from '@ui-kitten/components';
import UserScreen from '../screens/UserScreen';
import LogOutScreen from '../screens/LogOutScreen';
import MainTabNavigator from './MainTabNavigator';
import { createAppContainer } from 'react-navigation';


const routs = [
    { title: 'Home' },
    { title: 'User' },
    { title: 'LogOut' },

]

const PersonIcon = (style) => (
  <Icon {...style} name='person'/>
);

const Header = () => (
  <DrawerHeaderFooter
    title='John Doe'
    description='Smth extra info'
    icon={PersonIcon}
  />
);

const Footer = () => (
  <DrawerHeaderFooter description='powered by cocktailbuilder.com 2019'/>
);

const DrawerComponent  = ({ navigation }) => {

  const onSelect = (index) => {
      const { [index]: selectedTabRoute } = navigation.state.routes;
      navigation.navigate(selectedTabRoute.routeName);
      navigation.closeDrawer();
      };

  return (
    <SafeAreaView>
      <Drawer 
        data={routs}
        onSelect={onSelect}
        header={Header}
        footer={Footer}
      />
    </SafeAreaView>
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
  
});

export default createAppContainer(DrawerNavigator);
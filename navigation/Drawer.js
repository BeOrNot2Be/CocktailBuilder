import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
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
import LogOutScreen from '../screens/LogOutScreen';
import MainTabNavigator from './MainTabNavigator';
import { HomeIcon } from '../components/Icons';
import { createAppContainer } from 'react-navigation';
import { ThemeContext } from '../themes/theme-context';
import { Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const DrawerComponent  = ({ navigation }) => {

  const theme = React.useContext(ThemeContext);
  const [checked, setChecked] = React.useState(false);
  const [route, setRoute] = React.useState(navigation.state.routes[0].routeName);

  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
    theme.toggleTheme();
  };

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
            <TouchableOpacity onPress={() => onSelect(2)}>
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
                checked={checked}
                onChange={onCheckedChange}
              />
            </Layout>
            <Divider/>
            <Layout style={styles.boxFooter}>
              <TouchableOpacity style={{width:'100%'}} onPress={() => onSelect(1)}>
                <Text 
                  style={styles.LogOutButton}
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
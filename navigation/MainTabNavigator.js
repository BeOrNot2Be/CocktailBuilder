/*import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;

*/

import React from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer, SafeAreaView } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
import FavoriteScreen from '../screens/FavoriteScreen';
import CocktailScreen from '../screens/CocktailScreen';
import IngredientScreen from '../screens/IngredientScreen';

const ListIcon = (style) => (
  <Icon {...style} name='list-outline' />
);
// get 3rd party icon pack / or svg and get glass or cocktail stuff  
const EmailIcon = (style) => (
  <Icon {...style} name='email-outline' />
);

const HeartIcon = (style) => (
  <Icon {...style} name='heart-outline' />
);

const TabBarComponent = ({ navigation }) => {

  const onSelect = (index) => {
    const selectedTabRoute = navigation.state.routes[index];
    navigation.navigate(selectedTabRoute.routeName);
  };

  return (
    <SafeAreaView>
      <BottomNavigation
        style={styles.bottomNavigation}
        selectedIndex={navigation.state.index}
        onSelect={onSelect}>
        <BottomNavigationTab title='Ingredients' icon={ListIcon}/>
        <BottomNavigationTab title='Cocktails' icon={EmailIcon}/>
        <BottomNavigationTab title='Favorites' icon={HeartIcon}/>
      </BottomNavigation>
    </SafeAreaView>
  );
};

const TabNavigator = createBottomTabNavigator({
  Ingredients: IngredientScreen,
  Cocktails: CocktailScreen,
  Favorites: FavoriteScreen,
}, {
  tabBarComponent: TabBarComponent,
});

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});

export default createAppContainer(TabNavigator);
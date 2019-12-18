import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
import FavoriteScreen from '../screens/FavoriteScreen';
import CocktailScreen from '../screens/CocktailScreen';
import IngredientScreen from '../screens/IngredientScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

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
      <BottomNavigation
        style={styles.bottomNavigation}
        selectedIndex={navigation.state.index}
        onSelect={onSelect}>
        <BottomNavigationTab title='Ingredients' icon={ListIcon}/>
        <BottomNavigationTab title='Cocktails' icon={EmailIcon}/>
        <BottomNavigationTab title='Favorites' icon={HeartIcon}/>
      </BottomNavigation>
  );
};

const TabNavigator = createBottomTabNavigator({
  Ingredients: createStackNavigator( { Ingredients: IngredientScreen }, config),
  Cocktails: createStackNavigator({ Cocktails: CocktailScreen }, config),
  Favorites: createStackNavigator({ Favorites: FavoriteScreen }, config),
}, {
  tabBarComponent: TabBarComponent,
});

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});

export default TabNavigator;
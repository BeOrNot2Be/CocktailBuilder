import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import {
  BottomNavigation,
  BottomNavigationTab,
} from '@ui-kitten/components';
import FavoriteScreen from '../screens/FavoriteScreen';
import CocktailScreen from '../screens/CocktailScreen';
import RecipeScreen from '../screens/RecipeScreen';
import IngredientScreen from '../screens/IngredientScreen';
import IngredientTabNavigator from './IngredientTopBar';
import {ListIcon, CocktailIcon as EmailIcon, HeartIcon } from '../components/Icons';

const config ={
  headerMode: 'none',
  defaultNavigationOptions: {
  }
}

const TabBarComponent = ({ navigation }) => {

  const onSelect = (index) => {
    const selectedTabRoute = navigation.state.routes[index];
    navigation.navigate(selectedTabRoute.routeName);
  };

  return (
      <BottomNavigation
        style={styles.bottomNavigation}
        selectedIndex={navigation.state.index}
        onSelect={onSelect}
        appearance="noIndicator"
        >
        <BottomNavigationTab title='Ingredients' icon={ListIcon}/>
        <BottomNavigationTab title='Cocktails' icon={EmailIcon}/>
        <BottomNavigationTab title='Favorites' icon={HeartIcon}/>
      </BottomNavigation>
  );
};

const TabNavigator = createBottomTabNavigator({
  Ingredients: createStackNavigator({
    Ingredients: IngredientTabNavigator,
    Ingredient: IngredientScreen
    }, config),
  Cocktails: createStackNavigator({ 
    Cocktails: CocktailScreen,
    Recipe: RecipeScreen,
  }, config),
  Favorites: createStackNavigator({ 
    Favorites: FavoriteScreen,
    Recipe: RecipeScreen 
  }, config),
}, {
  tabBarComponent: TabBarComponent,
});

const styles = StyleSheet.create({
  bottomNavigation: {
    borderTopLeftRadius:15, 
    borderTopRightRadius:15,
    position:'absolute',
    bottom: 0,
    padding:10,
    zIndex: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});

export default TabNavigator;
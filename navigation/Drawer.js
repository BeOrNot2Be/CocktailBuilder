import React from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import {
  Drawer,
} from '@ui-kitten/components';
import FavoriteScreen from '../screens/FavoriteScreen';
import CocktailScreen from '../screens/CocktailScreen';
import IngredientScreen from '../screens/IngredientScreen';


const routs = [
    { title: 'Ingredients' },
    { title: 'Cocktails' },
    { title: 'Favorites' },
]

const DrawerComponent  = ({ navigation }) => {

  const onSelect = (index) => {
      const { [index]: selectedTabRoute } = navigation.state.routes;
      navigation.navigate(selectedTabRoute.routeName);
      navigation.closeDrawer();
      };

  return (
    <Drawer data={routs} onSelect={onSelect} />
  );
};

const DrawerNavigator  = createDrawerNavigator({
  Ingredients: IngredientScreen,
  Cocktails: CocktailScreen,
  Favorites: FavoriteScreen,
}, {
  contentComponent: DrawerComponent,
});

const styles = StyleSheet.create({
  
});

export default createAppContainer(DrawerNavigator);
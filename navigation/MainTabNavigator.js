import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
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
import SearchedCocktailsScreen from '../screens/SearchedCocktailsScreen';
import IngredientTabNavigator from './IngredientTopBar';
import {ListIcon, CocktailIcon, HeartIcon } from '../components/Icons';
import IconBadge from 'react-native-icon-badge';
import { connect } from 'react-redux';

const config ={
  headerMode: 'none',
  defaultNavigationOptions: {
  }
}

const TabBarComponent = ({ navigation, foundCocktailsNumber }) => {

  const onSelect = (index) => {
    const selectedTabRoute = navigation.state.routes[index];
    navigation.navigate(selectedTabRoute.routeName);
  };

  const getBadge = (style, icon) => {
    return (
    <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
      <IconBadge
        MainElement={icon(style)}
        BadgeElement={
          <Text style={{color:'#FFFFFF'}}>3</Text>
        }
        IconBadgeStyle={
          {left: 12,
            top: 0,
          right: 0}
        }
        Hidden={false}
        />
    </View>)
  }

  return (
      <BottomNavigation
        style={styles.bottomNavigation}
        selectedIndex={navigation.state.index}
        onSelect={onSelect}
        appearance="noIndicator"
        >
        <BottomNavigationTab title='Ingredients' icon={ListIcon}/>
        <BottomNavigationTab title={`Cocktails(${foundCocktailsNumber})`} icon={CocktailIcon}/>
        <BottomNavigationTab title='Favorites' icon={HeartIcon}/>
      </BottomNavigation>
  );
};

const mapStateToProps = (state) => {
  return (
    {
      foundCocktailsNumber: state.cocktails.cocktailsByIngredients.length,
    }
  )
};

const TabNavigator = createBottomTabNavigator({
  Ingredients: createStackNavigator({
    Ingredients: IngredientTabNavigator,
    Ingredient: IngredientScreen
    }, config),
  Cocktails: createStackNavigator({ 
    Cocktails: CocktailScreen,
    SearchedCocktails: SearchedCocktailsScreen,
    Recipe: RecipeScreen,
  }, config),
  Favorites: createStackNavigator({ 
    Favorites: FavoriteScreen,
    Recipe: RecipeScreen 
  }, config),
}, {
  tabBarComponent: connect(mapStateToProps)(TabBarComponent),
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
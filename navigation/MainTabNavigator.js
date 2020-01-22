import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import {
  BottomNavigation,
  BottomNavigationTab,
  Text,
  Layout
} from '@ui-kitten/components';
import FavoriteScreen from '../screens/FavoriteScreen';
import CocktailScreen from '../screens/CocktailScreen';
import RecipeScreen from '../screens/RecipeScreen';
import IngredientScreen from '../screens/IngredientScreen';
import SearchedCocktailsScreen from '../screens/SearchedCocktailsScreen';
import IngredientTabNavigator from './IngredientTopBar';
import {ListIcon, CocktailIcon, HeartMenuIcon } from '../components/Icons';
import IconBadge from 'react-native-icon-badge';
import { connect } from 'react-redux';
import {  SafeAreaView } from 'react-navigation';

const config ={
  headerMode: 'none',
  defaultNavigationOptions: {
  }
}

const TabBarComponent = ({ navigation, foundCocktailsNumber, theme, favCocktailsNumber }) => {

  const onSelect = (index) => {
    const selectedTabRoute = navigation.state.routes[index];
    navigation.navigate(selectedTabRoute.routeName);
  };

  const getBadge = (style, icon, num) => {
    if (num > 0 ) {
      return (
        <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
          <IconBadge
            MainElement={
              icon(style)
            }
            BadgeElement={
              <Layout
                style={{...styles.badge, backgroundColor: theme? '#DB3B29' : '#FF4463'}}
              >
                <Text
                  style={{color:'#FFFFFF'}}
                  category='label'
                >{num > 99 ? `${99}+` : num}</Text>
              </Layout>
            }
            IconBadgeStyle={
              {left: 12,
                top: 0,
              right: 0,
            backgroundColor: ''}
            }
            Hidden={false}
            />
        </View>)
    }
    else {
      return icon(style); 
    }
  }

  return (
    <SafeAreaView>
      <BottomNavigation
        style={styles.bottomNavigation}
        selectedIndex={navigation.state.index}
        onSelect={onSelect}
        appearance="noIndicator"
        >
        <BottomNavigationTab title='Ingredients' icon={ListIcon}/>
        <BottomNavigationTab title={`Cocktails`} icon={(style) => getBadge(style, CocktailIcon, foundCocktailsNumber )}/>
        <BottomNavigationTab title='Favorites' icon={(style) => getBadge(style, HeartMenuIcon, favCocktailsNumber)}/>
      </BottomNavigation>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return (
    {
      foundCocktailsNumber:  state.cocktails.cocktailsByIngredients.length - Math.floor(state.cocktails.cocktailsByIngredients.length/10), // get amount without adds
      favCocktailsNumber: state.cocktails.favCocktails.length - Math.floor(state.cocktails.favCocktails.length/10),
      theme: state.user.theme
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
  resetOnBlur : true,
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
  badge: {
    marginLeft: 10,
    minWidth:30,
    height:20,
    borderRadius:15,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default TabNavigator;
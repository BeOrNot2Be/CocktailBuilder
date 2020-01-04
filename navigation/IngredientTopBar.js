import React from 'react';
import {  SafeAreaView } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { 
    TabBar,
    Tab,
    Layout
} from '@ui-kitten/components';
import SearchedIngredientsScreen from '../screens/SearchedIngredientScreen';
import AddedIngredientScreen from '../screens/AddedIngredientScreen';
import Header from '../components/Header';
import { SearchIcon, AddedSquareIcon } from '../components/Icons';
import { connect } from 'react-redux';

const TabBarComponent = ({ navigation, addedIngredientNumber }) => {

  const onSelect = (index) => {
    const selectedTabRoute = navigation.state.routes[index];
    navigation.navigate(selectedTabRoute.routeName);
  };

  return (
    <Layout level="1">
        <SafeAreaView>
        <Header navigation={navigation}/>
        <TabBar selectedIndex={navigation.state.index} onSelect={onSelect}>
            <Tab title='Search' icon={SearchIcon} />
            <Tab title={`In My Bar (${addedIngredientNumber})`} icon={AddedSquareIcon} />
        </TabBar>
        </SafeAreaView>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return (
    {
      addedIngredientNumber: state.ingredients.addedIngredients.length,
    }
  )
};

const TabNavigator = createMaterialTopTabNavigator({ 
      Searched: SearchedIngredientsScreen,
      Added: AddedIngredientScreen,
}, {
  tabBarComponent: connect(mapStateToProps)(TabBarComponent),
});

export default TabNavigator;
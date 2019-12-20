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

const TabBarComponent = ({ navigation }) => {

  const onSelect = (index) => {
    const selectedTabRoute = navigation.state.routes[index];
    navigation.navigate(selectedTabRoute.routeName);
  };

  return (
    <Layout level="1">
        <SafeAreaView>
        <Header navigation={navigation}/>
        <TabBar selectedIndex={navigation.state.index} onSelect={onSelect}>
            <Tab title='Searched' icon={SearchIcon} />
            <Tab title='Added' icon={AddedSquareIcon} />
        </TabBar>
        </SafeAreaView>
    </Layout>
  );
};

const TabNavigator = createMaterialTopTabNavigator({ 
      Searched: SearchedIngredientsScreen,
      Added: AddedIngredientScreen,
}, {
  tabBarComponent: TabBarComponent,
});

export default TabNavigator;
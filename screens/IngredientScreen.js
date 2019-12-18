import React from 'react';
import { StyleSheet } from 'react-native';
import AddedIngredientsList from '../components/AddedIngredients';
import SearchedIngredientsList from '../components/SearchedIngredients';
import { DrawerActions } from "react-navigation-drawer";
import {
  Tab,
  TabView,
  Icon,
  Button
} from '@ui-kitten/components';

const MenuIcon = (style) => (
  <Icon
    {...style}
    width={24}
    height={24}
    name='menu-outline'
   />
);

const AddedIcon = (style) => (
    <Icon {...style} name='plus-square-outline' />
  );

const SearchIcon = (style) => (
    <Icon {...style} name='search' />
  );

const IngredientScreen = ({ navigation }) => {

    const [tabsIndex, setTabsIndex] = React.useState(0);

  return (
    <>
      <TabView
      selectedIndex={tabsIndex}
      onSelect={setTabsIndex}>
          <Tab title='Added' icon={AddedIcon}>
            <AddedIngredientsList/>
          </Tab>
          <Tab title='Search' icon={SearchIcon}>
            <SearchedIngredientsList/>
          </Tab>
      </TabView>
  </>
  )
}

IngredientScreen.navigationOptions = ({ navigation, navigationOptions }) => {
  return {
    title: 'Ingredients',
    headerRight: () => (
      <Button
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        appearance='ghost'
        status='basic'
        icon={MenuIcon}      
      />
    ),
  }
};

const styles = StyleSheet.create({
});

export default IngredientScreen;
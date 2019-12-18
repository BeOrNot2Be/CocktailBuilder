import React from 'react';
import { StyleSheet } from 'react-native';
import AddedIngredientsList from '../components/AddedIngredients';
import SearchedIngredientsList from '../components/SearchedIngredients';

import {
  Tab,
  Divider,
  TabView,
  Icon
} from '@ui-kitten/components';


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
    <Divider/>
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

const styles = StyleSheet.create({
});

export default IngredientScreen;
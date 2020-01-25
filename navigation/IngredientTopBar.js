/** @format */

import React from "react";
import PropTypes from "prop-types";
import { SafeAreaView } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { TabBar, Tab, Layout } from "@ui-kitten/components";
import { connect } from "react-redux";
import SearchedIngredientsScreen from "../screens/SearchedIngredientScreen";
import AddedIngredientScreen from "../screens/AddedIngredientScreen";
import Header from "../components/Header";
import { SearchIcon, AddedSquareIcon } from "../components/Icons";
import GoogleAnalytics from "../api/googleAnalytics";

const TabBarComponent = ({ navigation, addedIngredientNumber }) => {
  const onSelect = index => {
    const selectedTabRoute = navigation.state.routes[index];
    navigation.navigate(selectedTabRoute.routeName);
    GoogleAnalytics.sendIngsPagesAnalytics(selectedTabRoute.routeName);
  };

  return (
    <Layout level="1">
      <SafeAreaView>
        <Header navigation={navigation} />
        <TabBar selectedIndex={navigation.state.index} onSelect={onSelect}>
          <Tab
            title={`In My Bar (${addedIngredientNumber})`}
            icon={AddedSquareIcon}
          />
          <Tab title="Search" icon={SearchIcon} />
        </TabBar>
      </SafeAreaView>
    </Layout>
  );
};

TabBarComponent.propTypes = {
  addedIngredientNumber: PropTypes.any,
  navigation: PropTypes.any
};

const mapStateToProps = state => {
  return {
    addedIngredientNumber: state.ingredients.addedIngredients.length
  };
};

const TabNavigator = createMaterialTopTabNavigator(
  {
    Added: AddedIngredientScreen,
    Searched: SearchedIngredientsScreen
  },
  {
    tabBarComponent: connect(mapStateToProps)(TabBarComponent)
  }
);

export default TabNavigator;

/** @format */

import React from "react";
import PropTypes from "prop-types";
import { Easing, Animated } from "react-native";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { TabBar, Tab, Layout } from "@ui-kitten/components";
import { connect } from "react-redux";
import SearchedIngredientsScreen from "../screens/SearchedIngredientScreen";
import AddedIngredientScreen from "../screens/AddedIngredientScreen";
import ForcedLogInModal from "../screens/ForcedLogIn";
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
      <TabBar selectedIndex={navigation.state.index} onSelect={onSelect}>
        <Tab
          title={`In My Bar (${addedIngredientNumber})`}
          icon={AddedSquareIcon}
        />
        <Tab title="Search" icon={SearchIcon} />
      </TabBar>
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
    Searched: createStackNavigator(
      {
        ingredientContent: SearchedIngredientsScreen,
        forceLogInModal: { screen: ForcedLogInModal }
      },
      {
        headerMode: "none",
        mode: "modal",
        initialRouteName: "ingredientContent",
        transparentCard: true,
        cardShadowEnabled: false,
        defaultNavigationOptions: {
          gesturesEnabled: false
        },
        transitionConfig: () => ({
          transitionSpec: {
            duration: 250,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true
          },
          screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const thisSceneIndex = scene.index;

            const height = layout.initHeight;
            const translateY = position.interpolate({
              inputRange: [
                thisSceneIndex - 1,
                thisSceneIndex,
                thisSceneIndex + 1
              ],
              outputRange: [height, 0, 0]
            });

            const opacity = position.interpolate({
              inputRange: [
                thisSceneIndex - 1,
                thisSceneIndex,
                thisSceneIndex + 1
              ],
              outputRange: [1, 1, 0.5]
            });

            return { opacity, transform: [{ translateY }] };
          }
        })
      }
    )
  },
  {
    tabBarComponent: connect(mapStateToProps)(TabBarComponent)
  }
);

export default TabNavigator;

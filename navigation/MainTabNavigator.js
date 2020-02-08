/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import {
  BottomNavigation,
  BottomNavigationTab,
  Text,
  Layout
} from "@ui-kitten/components";
import IconBadge from "react-native-icon-badge";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import _ from "lodash";
import FavoriteScreen from "../screens/FavoriteScreen";
import CocktailScreen from "../screens/CocktailScreen";
import RecipeScreen from "../screens/RecipeScreen";
import IngredientScreen from "../screens/IngredientScreen";
import SearchedCocktailsScreen from "../screens/SearchedCocktailsScreen";
import IngredientTabNavigator from "./IngredientTopBar";
import { BottleIcon, CocktailIcon, HeartMenuIcon } from "../components/Icons";
import GoogleAnalytics from "../api/googleAnalytics";
import Header from "../components/Header";

const config = {
  defaultNavigationOptions: {
    // eslint-disable-next-line react/prop-types
    header: ({ scene, previous, navigation }) => (
      <Header scene={scene} previous={previous} navigation={navigation} />
    )
  }
};

const styles = StyleSheet.create({
  bottomNavigation: {
    //borderTopLeftRadius: 15,
    //borderTopRightRadius: 15,
    bottom: 0,
    padding: 10,
    zIndex: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  badge: {
    marginLeft: 10,
    height: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  }
});

const TabBarComponent = ({
  navigation,
  foundCocktailsNumber,
  theme,
  favCocktailsNumber
}) => {
  const onSelect = index => {
    const selectedTabRoute = navigation.state.routes[index];
    if (index > 0) {
      const navigateAction = NavigationActions.navigate({
        routeName: selectedTabRoute.routeName,
        action: navigation.popToTop({ immediate: true })
      });
      navigation.dispatch(navigateAction);
    } else {
      navigation.navigate("Added");
    }
    GoogleAnalytics.sendMainPagesAnalytics(selectedTabRoute.routeName);
  };

  const numDigits = x => {
    return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 2;
  };

  const getBadge = (style, icon, num) => {
    if (num > 0) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <IconBadge
            MainElement={icon({ ...style, height: 23 })}
            BadgeElement={
              <Layout
                style={{
                  ...styles.badge,
                  minWidth: numDigits(num) * 10,
                  backgroundColor: theme ? "#DB3B29" : "#FF4463"
                }} // makes adjustable banner
              >
                <Text style={{ color: "#FFFFFF" }} category="label">
                  {num == 10000 ? `${9999}+` : num}
                </Text>
              </Layout>
            }
            IconBadgeStyle={{ left: 12, top: 0, right: 0, backgroundColor: "" }}
            Hidden={false}
          />
        </View>
      );
    }
    return icon(style);
  };

  return (
    <SafeAreaView>
      <BottomNavigation
        style={styles.bottomNavigation}
        selectedIndex={navigation.state.index}
        onSelect={onSelect}
        appearance="noIndicator"
      >
        <BottomNavigationTab
          title="Ingredients"
          icon={style => BottleIcon({ ...style, marginVertical: 0 })}
        />
        <BottomNavigationTab
          title="Cocktails"
          icon={style =>
            getBadge(
              { ...style, marginVertical: 0 },
              CocktailIcon,
              foundCocktailsNumber
            )
          }
        />
        <BottomNavigationTab
          title="Favorites"
          icon={style =>
            getBadge(
              { ...style, marginVertical: 0 },
              HeartMenuIcon,
              favCocktailsNumber
            )
          }
        />
      </BottomNavigation>
    </SafeAreaView>
  );
};

TabBarComponent.propTypes = {
  favCocktailsNumber: PropTypes.any,
  foundCocktailsNumber: PropTypes.any,
  navigation: PropTypes.any,
  theme: PropTypes.any
};

const getAmountWithoutAdds = num => {
  return num - Math.floor(num / 10);
};

const getAmountThatCanBeMade = cocktails => {
  return _.filter(cocktails, item => {
    if (item.MissingIngr === undefined) {
      // excludes added ads
      return false;
    }
    return !item.MissingIngr;
  }).length;
};

const mapStateToProps = state => {
  return {
    foundCocktailsNumber: getAmountThatCanBeMade(
      state.cocktails.cocktailsByIngredients
    ),
    favCocktailsNumber: getAmountWithoutAdds(
      state.cocktails.favCocktails.length
    ),
    theme: state.user.theme
  };
};

const TabNavigator = createBottomTabNavigator(
  {
    Ingredients: createStackNavigator(
      {
        Ingredients: IngredientTabNavigator,
        Ingredient: IngredientScreen
      },
      config
    ),
    Cocktails: createStackNavigator(
      {
        Cocktails: CocktailScreen,
        SearchedCocktails: SearchedCocktailsScreen,
        Recipe: RecipeScreen
      },
      config
    ),
    Favorites: createStackNavigator(
      {
        Favorites: FavoriteScreen,
        Recipe: RecipeScreen
      },
      config
    )
  },
  {
    tabBarComponent: connect(mapStateToProps)(TabBarComponent),
    resetOnBlur: false,
    lazy: false
  }
);

export default TabNavigator;

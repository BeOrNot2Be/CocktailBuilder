/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { DrawerActions } from "react-navigation-drawer";
import { BackIcon, MenuIcon } from "./Icons";

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold"
  }
});

const Header = ({ navigation }) => {
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  );

  const DrawerToggle = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    />
  );

  return (
    <TopNavigation
      title={navigation.state.routeName}
      alignment="center"
      rightControls={DrawerToggle()}
      leftControl={
        ["Ingredients", "Cocktails", "Favorites"].indexOf(
          navigation.state.routeName
        ) === -1
          ? BackAction()
          : null
      }
      titleStyle={styles.title}
    />
  );
};

Header.propTypes = {
  navigation: PropTypes.any
};

export default Header;

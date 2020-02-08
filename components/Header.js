/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import {
  Layout,
  TopNavigation,
  TopNavigationAction
} from "@ui-kitten/components";
import { DrawerActions } from "react-navigation-drawer";
import { BackIcon, MenuIcon } from "./Icons";

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold"
  }
});

const Header = ({ scene, previous, navigation }) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.routeName;

  const DrawerToggle = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    />
  );

  return (
    <Layout>
      <SafeAreaView>
        <TopNavigation
          title={title}
          alignment="center"
          rightControls={DrawerToggle()}
          leftControl={
            ["Ingredients", "Cocktails", "Favorites"].indexOf(title) === -1 ? (
              <TopNavigationAction
                icon={BackIcon}
                onPress={() => navigation.goBack(null)}
              />
            ) : null
          }
          titleStyle={styles.title}
        />
      </SafeAreaView>
    </Layout>
  );
};

Header.propTypes = {
  scene: PropTypes.any,
  navigation: PropTypes.any,
  previous: PropTypes.any
};

export default Header;

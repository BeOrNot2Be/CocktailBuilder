/** @format */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { mapping, dark, light } from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { AppearanceProvider } from "react-native-appearance";
import { StatusBar, Platform } from "react-native";
import { IonicIconsPack } from "./ionic-icons";
import { MaterialCommunityIconsPack } from "./material-icons";
import AppNavigator from "./navigation/Loader";
import { default as lightTheme } from "./themes/custom-theme.json";
import { default as darkTheme } from "./themes/night-theme.json";
import { default as customMapping } from "./themes/custom-mapping.json";

const themes = { 1: { ...light, ...lightTheme }, 0: { ...dark, ...darkTheme } };

if (Platform.OS !== "ios") {
  StatusBar.setHidden(true);
}

const AppComponent = ({ theme }) => {
  return (
    <>
      <StatusBar
        backgroundColor={theme ? "#ffffff" : "#383838"}
        barStyle={theme ? "dark-content" : "light-content"}
      />
      <IconRegistry
        icons={[EvaIconsPack, IonicIconsPack, MaterialCommunityIconsPack]}
      />
      <AppearanceProvider>
        <ApplicationProvider
          mapping={mapping}
          theme={themes[theme]}
          customMapping={customMapping}
        >
          <AppNavigator />
        </ApplicationProvider>
      </AppearanceProvider>
    </>
  );
};

AppComponent.propTypes = {
  theme: PropTypes.any
};

const mapStateToProps = state => ({
  theme: state.user.theme
});

export default connect(mapStateToProps, null)(AppComponent);

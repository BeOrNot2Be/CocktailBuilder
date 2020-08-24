/** @format */

import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  Easing,
  Animated,
  Dimensions,
  ScrollView,
  Linking,
  Platform
} from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import LoaderScreen from "../screens/LoadingScreen";
import RecipeModalScreen from "../screens/RecipeModalScreen";
import Drawer from "./Drawer";
import { HomeIcon, LogOutIcon, LogInIcon } from "../components/Icons";
import { LOG_OUT, TOGGLE_THEME } from "../actions/User";
import GoogleApi from "../api/google";
import NativeApi from "../api/native";

const styles = StyleSheet.create({});

const LoadingModal = createBottomTabNavigator(
  {
    MainApp: Drawer,
    Loader: { screen: LoaderScreen }
  },
  {
    lazy: false,
    headerMode: "none",
    initialRouteName: "Loader",
    defaultNavigationOptions: {
      tabBarVisible: false
    }
  }
);

export default createAppContainer(LoadingModal);

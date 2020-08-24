/** @format */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StyleSheet, Alert, FlatList } from "react-native";
import { Input, Layout, Text, Spinner, Button } from "@ui-kitten/components";
import ListItem from "../components/CocktailListItem";
import { SearchIcon, CrossIcon } from "../components/Icons";
import MainSourceFetch from "../api/web";
import GoogleApi from "../api/google";
import GoogleAnalytics from "../api/googleAnalytics";
import { TOGGLE_FAV_COCKTAIL } from "../actions/Cocktails";

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  spinner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  }
});

const LoadingScreen = ({ navigation, searchedIngredients }) => {
  const openApp = () => navigation.navigate("MainApp");

  if (searchedIngredients.length !== 0) {
    setTimeout(function() {
      openApp();
    }, 800);
  }

  return (
    <Layout style={styles.background}>
      <Layout style={styles.spinner}>
        <Text category="h6"> Welcome back</Text>
        <Spinner size="giant" />
      </Layout>
    </Layout>
  );
};

LoadingScreen.propTypes = {
  navigation: PropTypes.any,
  searchedIngredients: PropTypes.any
};

const mapStateToProps = state => {
  return {
    searchedIngredients: state.ingredients.searchedIngredients
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);

/** @format */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StyleSheet, ScrollView, Alert, SafeAreaView } from "react-native";
import { Input, Layout, Text } from "@ui-kitten/components";
import ListItem from "../components/listItem";
import { SearchIcon, CrossIcon } from "../components/Icons";
import MainSourceFetch from "../api/web";
import GoogleApi from "../api/google";
import GoogleAnalytics from "../api/googleAnalytics";
import { TOGGLE_FAV_COCKTAIL } from "../actions/Cocktails";

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: "transparent"
  },
  scrollContainer: {
    height: "100%"
  },
  textContainer: {
    paddingLeft: 24
  }
});

const SearchedCocktailsScreen = ({
  navigation,
  cocktails,
  search,
  favCocktailsIDs,
  toggle,
  user,
  googleLogin
}) => {
  const [inputValue, setInputValue] = React.useState(
    navigation.getParam("inputSearch", "")
  );
  const [lastSearch, setLastSearch] = React.useState(
    navigation.getParam("inputSearch", "")
  );

  const openRecipe = item => {
    GoogleAnalytics.openedRecipe(item.CocktailName);
    navigation.push("Recipe", { recipe: item });
  };

  const askForLogin = () => {
    Alert.alert(
      "Alert",
      "You need to sign in before using this functionality",
      [
        {
          text: "Ok"
        },
        { text: "Sign In", onPress: () => googleLogin() }
      ],
      { cancelable: false }
    );
  };

  const ToggleFollow = (ref, item) => {
    if (user.logged) {
      toggle(item, user.token);
    } else {
      askForLogin();
    }
  };

  const openModal = item => {
    navigation.push("modal", { recipe: item });
  };

  const listConfig = {
    ingredients: false,
    added: false,
    fav: false,
    onLongPress: openModal,
    onPress: openRecipe,
    onMainButtonPress: ToggleFollow,
    favsID: favCocktailsIDs
  };

  return (
    <Layout level="1">
      <SafeAreaView>
        <ScrollView style={styles.scrollContainer}>
          <Layout style={styles.container}>
            <Input
              placeholder="Search"
              value={inputValue}
              onChangeText={setInputValue}
              icon={inputValue ? CrossIcon : SearchIcon}
              onIconPress={() => setInputValue("")}
              autoCorrect={false}
              onSubmitEditing={() => {
                search(inputValue);
                setLastSearch(inputValue);
              }}
            />
          </Layout>
          {cocktails.length === 0 ? (
            <Layout style={styles.textContainer}>
              <Text category="p2" status="basic">
                No results found for search: {lastSearch}
              </Text>
            </Layout>
          ) : (
            <>
              {cocktails.map(ListItem(listConfig))}
              <Layout level="1" style={{ height: 200 }} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

SearchedCocktailsScreen.propTypes = {
  cocktails: PropTypes.any,
  favCocktailsIDs: PropTypes.any,
  googleLogin: PropTypes.any,
  navigation: PropTypes.any,
  search: PropTypes.any,
  toggle: PropTypes.any,
  user: PropTypes.any
};

const mapStateToProps = state => {
  return {
    cocktails: state.cocktails.searchedCocktails,
    favCocktailsIDs: state.cocktails.favCocktailsIDs,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => ({
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  search: input => MainSourceFetch.getCocktailsByName(input, dispatch),
  toggle: (item, token) =>
    dispatch({ type: TOGGLE_FAV_COCKTAIL, data: { item, token } })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchedCocktailsScreen);

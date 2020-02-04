/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { Input, Layout, Button } from "@ui-kitten/components";
import { connect } from "react-redux";
import _ from "lodash";
import ListItem from "../components/listItem";
import { SearchIcon, CrossIcon, BackIcon } from "../components/Icons";
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
  buttonContainer: {
    marginTop: 10,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  textContainer: {
    height: "100%",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  addIngsButtonContainer: {
    marginTop: 10,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  }
});

const CocktailScreen = ({
  navigation,
  cocktails,
  search,
  favCocktailsIDs,
  toggle,
  user,
  googleLogin
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const [listLengthEnd, setListLengthEnd] = React.useState(20);

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

  const getMore = () => {
    askForLogin();
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

  const onSearch = input => {
    navigation.push("SearchedCocktails", { inputSearch: input });
    search(input);
  };

  return (
    <Layout level="1">
      <ScrollView style={styles.scrollContainer}>
        <Layout style={styles.container}>
          <Input
            placeholder="Search"
            value={inputValue}
            onChangeText={setInputValue}
            icon={inputValue ? CrossIcon : SearchIcon}
            onIconPress={() => setInputValue("")}
            autoCorrect={false}
            onSubmitEditing={() => onSearch(inputValue)}
          />
        </Layout>
        {cocktails.length === 0 ? (
          <Layout style={styles.addIngsButtonContainer}>
            <Button
              style={styles.button}
              icon={BackIcon}
              onPress={() => navigation.navigate("Searched", { focus: true })}
            >
              Add my ingredients
            </Button>
          </Layout>
        ) : (
          <>
            {cocktails.slice(0, listLengthEnd).map(ListItem(listConfig))}
            <Layout style={styles.buttonContainer}>
              {user.logged ? (
                cocktails.length > listLengthEnd ? (
                  <Button
                    onPress={() => {
                      setListLengthEnd(listLengthEnd + 20);
                    }}
                    style={styles.button}
                  >
                    Load More
                  </Button>
                ) : (
                  <></>
                )
              ) : (
                <Button onPress={getMore} style={styles.button}>
                  Load More
                </Button>
              )}
            </Layout>
            <Layout level="1" style={{ height: 200 }} />
          </>
        )}
      </ScrollView>
    </Layout>
  );
};

CocktailScreen.propTypes = {
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
    cocktails: state.cocktails.cocktailsByIngredients,
    user: state.user,
    favCocktailsIDs: state.cocktails.favCocktailsIDs
  };
};

const mapDispatchToProps = dispatch => ({
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  search: input => MainSourceFetch.getCocktailsByName(input, dispatch),
  toggle: (item, token) =>
    dispatch({ type: TOGGLE_FAV_COCKTAIL, data: { item, token } })
});

export default connect(mapStateToProps, mapDispatchToProps)(CocktailScreen);

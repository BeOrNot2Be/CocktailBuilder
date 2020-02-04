/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, ScrollView, Alert, SafeAreaView } from "react-native";
import { Layout, Text, Spinner, Button } from "@ui-kitten/components";
import { connect } from "react-redux";
import ListItem from "../components/listItem";
import MainSourceFetch from "../api/web";
import GoogleApi from "../api/google";
import GoogleAnalytics from "../api/googleAnalytics";
import { TOGGLE_FAV_COCKTAIL } from "../actions/Cocktails";

const styles = StyleSheet.create({
  scrollContainer: {
    height: "100%"
  },
  textHeader: {
    marginBottom: 16,
    justifyContent: "center",
    textAlign: "center"
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  spinner: {
    height: "100%",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  }
});

const IngredientScreen = ({
  navigation,
  favCocktailsIDs,
  user,
  toggle,
  googleLogin
}) => {
  const [cocktailsList, setCocktailsList] = React.useState([]);
  const [listLength, setListLength] = React.useState(10);

  const ingredient = navigation.getParam("ingredient", {
    Name: "vodka",
    ID: 3,
    Popularity: 2642,
    NormalizedIngredientID: 1
  });

  React.useEffect(() => {
    MainSourceFetch.getCocktailsByIngredient(
      ingredient,
      setCocktailsList,
      cocktailsList
    );
  });

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
    if (user.logged) {
      setListLength(listLength + 10);
    } else {
      askForLogin();
    }
  };

  const openRecipe = item => {
    GoogleAnalytics.openedRecipe(item.CocktailName);
    navigation.push("Recipe", { recipe: item });
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
        <Layout level="1">
          <ScrollView style={styles.scrollContainer}>
            <Text category="h6" style={styles.textHeader}>
              More cocktails with {ingredient.Name}
            </Text>
            {ingredient.Popularity !== undefined ? (
              <Text appearance="hint" category="c2" style={styles.textHeader}>
                {ingredient.Popularity} results
              </Text>
            ) : (
              <></>
            )}
            {cocktailsList.length !== 0 ? (
              <>
                {cocktailsList.slice(0, listLength).map(ListItem(listConfig))}
                {cocktailsList.length > listLength ? (
                  <Layout style={styles.buttonContainer}>
                    <Button onPress={getMore} style={styles.button}>
                      {" "}
                      More{" "}
                    </Button>
                  </Layout>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <Layout style={styles.spinner}>
                <Spinner size="giant" />
              </Layout>
            )}
            <Layout level="1" style={{ height: 250 }} />
          </ScrollView>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

IngredientScreen.propTypes = {
  favCocktailsIDs: PropTypes.any,
  googleLogin: PropTypes.any,
  navigation: PropTypes.any,
  toggle: PropTypes.any,
  user: PropTypes.any
};

const mapStateToProps = state => {
  return {
    favCocktailsIDs: state.cocktails.favCocktailsIDs,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => ({
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  toggle: (item, token) =>
    dispatch({ type: TOGGLE_FAV_COCKTAIL, data: { item, token } })
});

export default connect(mapStateToProps, mapDispatchToProps)(IngredientScreen);

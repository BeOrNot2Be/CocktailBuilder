/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, FlatList, Alert } from "react-native";
import { Layout, Text, Spinner, Button } from "@ui-kitten/components";
import { connect } from "react-redux";
import ListItem from "../components/CocktailListItem";
import MainSourceFetch from "../api/web";
import GoogleApi from "../api/google";
import GoogleAnalytics from "../api/googleAnalytics";
import { TOGGLE_FAV_COCKTAIL } from "../actions/Cocktails";
import {
  ADD_INGREDIENT_TO_SEARCH_BY,
  UNLOGGED_ADD_INGREDIENT_TO_SEARCH_BY
} from "../actions/Ingredients";
import { AddCheckmarkIcon, AddedIcon } from "../components/Icons";
import { isEmpty, find } from "lodash";
import { StackActions } from "react-navigation";

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
  headerButtonContainer: { flex: 3 },
  headerTextContainer: { flex: 7 },
  spinner: {
    height: "100%",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  background: {
    height: "100%"
  }
});

const updateIngredientWithMoraData = (
  searchedIngredients,
  ingredient,
  setIngredientFunc
) =>
  new Promise((resolve, reject) => {
    if (!isEmpty(ingredient)) {
      const NormalizedName = ingredient.NormalizedName.toLowerCase();

      let additionalIngData =
        ingredient.normalized === undefined
          ? searchedIngredients.find(ing => ing.ID === ingredient.ID)
          : searchedIngredients.find(
              ing =>
                ing.NormalizedIngredientID === ingredient.NormalizedID &&
                ing.Name === NormalizedName
            );

      if (
        additionalIngData === undefined &&
        ingredient.normalized === undefined
      ) {
        additionalIngData = searchedIngredients.find(
          ing =>
            ing.NormalizedIngredientID === ingredient.NormalizedID &&
            ing.Name === NormalizedName
        );
      }

      if (additionalIngData !== undefined) {
        setIngredientFunc({ ...ingredient, ...additionalIngData });
      } else {
        setIngredientFunc({ ...ingredient, Popularity: null });
      }
    }
    resolve();
  });

const IngredientScreen = ({
  navigation,
  favCocktailsIDs,
  user,
  searchedIngredients,
  added,
  toggle,
  googleLogin,
  addIngredient,
  unloggedAddIngredient
}) => {
  const [cocktailsList, setCocktailsList] = React.useState([]);
  const [listLength, setListLength] = React.useState(10);
  const [ingredient, setIngredient] = React.useState(
    navigation.getParam("ingredient", {
      Name: "vodka",
      ID: 3,
      Popularity: 2642,
      NormalizedIngredientID: 1
    })
  );

  React.useEffect(() => {
    if (cocktailsList.length === 0) {
      MainSourceFetch.getCocktailsByIngredient(
        ingredient,
        setCocktailsList,
        cocktailsList
      );
    }

    if (ingredient.Popularity === undefined) {
      updateIngredientWithMoraData(
        searchedIngredients,
        ingredient,
        setIngredient
      );
    }
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

  const addIngredientToInventory = ing => {
    const item = {
      Name: ing.Name,
      ID: ing.ID,
      Popularity: ing.Popularity,
      NormalizedIngredientID: ing.NormalizedIngredientID
    };

    if (user.logged) {
      addIngredient(item);
    } else
      unloggedAddIngredient(item, () => {
        navigation.dispatch(StackActions.popToTop());
        navigation.dispatch(
          StackActions.push({ routeName: "forceLogInModal" })
        );
      });
  };

  const addedIngredientState = !!added.get(ingredient.ID);

  return (
    <Layout level="1" style={styles.background}>
      <FlatList
        data={cocktailsList.slice(0, listLength)}
        keyExtractor={(item, index) =>
          item.ad ? index.toString() : item.CocktailID.toString()
        }
        ListHeaderComponent={
          ingredient.Popularity !== undefined &&
          ingredient.Popularity !== null ? (
            <>
              <Layout
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  padding: 10
                }}
              >
                <Layout style={{ flex: 7 }}>
                  <Text category="h6">
                    More cocktails with{" "}
                    {ingredient.normalized === undefined
                      ? ingredient.Name
                      : ingredient.NormalizedName}
                  </Text>
                  <Text appearance="hint" category="c2">
                    {ingredient.Popularity} results
                  </Text>
                </Layout>

                <Layout style={styles.headerButtonContainer}>
                  <Button
                    onPress={() => {
                      if (!addedIngredientState) {
                        addIngredientToInventory(ingredient);
                      }
                    }}
                    appearance={addedIngredientState ? "outline" : "filled"}
                    icon={addedIngredientState ? AddCheckmarkIcon : AddedIcon}
                    style={styles.button}
                    status={addedIngredientState ? "success" : "info"}
                  >
                    {addedIngredientState ? "Added" : "Add"}
                  </Button>
                </Layout>
              </Layout>
            </>
          ) : (
            <>
              <Text category="h6" style={styles.textHeader}>
                More cocktails with{" "}
                {ingredient.normalized === undefined
                  ? ingredient.Name
                  : ingredient.NormalizedName}
              </Text>
            </>
          )
        }
        ListFooterComponent={
          <>
            {cocktailsList.length !== 0 ? (
              <>
                {cocktailsList.length > listLength ? (
                  <Layout style={styles.buttonContainer}>
                    <Button onPress={getMore} style={styles.button}>
                      More
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
            <Layout level="1" style={{ height: 80 }} />
          </>
        }
        renderItem={({ item }) => (
          <ListItem
            item={item}
            onMainButtonPress={ToggleFollow}
            onPress={openRecipe}
            onLongPress={openModal}
            favsID={favCocktailsIDs}
          />
        )}
        extraData={favCocktailsIDs}
      />
    </Layout>
  );
};

IngredientScreen.propTypes = {
  favCocktailsIDs: PropTypes.any,
  googleLogin: PropTypes.any,
  navigation: PropTypes.any,
  toggle: PropTypes.any,
  user: PropTypes.any,
  searchedIngredients: PropTypes.any,
  added: PropTypes.any,
  addIngredient: PropTypes.func,
  unloggedAddIngredient: PropTypes.func
};

const mapStateToProps = state => {
  return {
    favCocktailsIDs: state.cocktails.favCocktailsIDs,
    searchedIngredients: state.ingredients.searchedIngredients,
    added: state.ingredients.addedCheck,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => ({
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  toggle: (item, token) =>
    dispatch({ type: TOGGLE_FAV_COCKTAIL, data: { item, token } }),
  addIngredient: item =>
    dispatch({ type: ADD_INGREDIENT_TO_SEARCH_BY, data: item }),
  unloggedAddIngredient: (item, openForceLogIn) =>
    dispatch({
      type: UNLOGGED_ADD_INGREDIENT_TO_SEARCH_BY,
      data: item,
      subdatafunc: openForceLogIn
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(IngredientScreen);

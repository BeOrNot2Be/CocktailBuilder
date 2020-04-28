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
import { AddCheckmarkIcon, AddedIcon } from "../components/Icons";

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
    NormalizedIngredientID: 1,
    added: false,
    action: () => console.log("ing default add/rem func")
  });
  const [addedIngedient, setAddedIngedient] = React.useState(ingredient.added);

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

  return (
    <Layout level="1" style={styles.background}>
      <FlatList
        data={cocktailsList.slice(0, listLength)}
        keyExtractor={(item, index) =>
          item.ad ? index.toString() : item.CocktailID.toString()
        }
        ListHeaderComponent={
          ingredient.Popularity !== undefined ? (
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
                    More cocktails with {ingredient.Name}
                  </Text>
                  <Text appearance="hint" category="c2">
                    {ingredient.Popularity} results
                  </Text>
                </Layout>

                <Layout style={styles.headerButtonContainer}>
                  <Button
                    onPress={() => {
                      if (!addedIngedient) {
                        ingredient.action();
                        setAddedIngedient(!addedIngedient);
                      }
                    }}
                    appearance={addedIngedient ? "outline" : "filled"}
                    icon={addedIngedient ? AddCheckmarkIcon : AddedIcon}
                    style={styles.button}
                    status={addedIngedient ? "success" : "info"}
                  >
                    {addedIngedient ? "Added" : "Add"}
                  </Button>
                </Layout>
              </Layout>
            </>
          ) : (
            <>
              <Text category="h6" style={styles.textHeader}>
                More cocktails with {ingredient.Name}
              </Text>
              <Layout style={styles.buttonContainer}>
                <Button onPress={getMore} style={styles.button}>
                  Add
                </Button>
              </Layout>
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

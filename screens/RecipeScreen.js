/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, FlatList, View, Alert, Platform } from "react-native";
import {
  Layout,
  Divider,
  Text,
  Card,
  Button,
  CardHeader,
  Spinner
} from "@ui-kitten/components";
import { connect } from "react-redux";
import _ from "lodash";
import { AdMobBanner, AdMobInterstitial } from "expo-ads-admob";
import { NavigationEvents } from "react-navigation";
import ListItem from "../components/CocktailListItem";
import MainSourceFetch from "../api/web";
import NativeApi from "../api/native";
import GoogleApi from "../api/google";
import GoogleAnalytics from "../api/googleAnalytics";
import { HeartIcon, ShareIcon, HeartOutlineIcon } from "../components/Icons";
import {
  TOGGLE_FAV_COCKTAIL,
  INCREMENT_RECIPE_VIEW_COUNTER
} from "../actions/Cocktails";

const unitID =
  Platform.OS === "ios"
    ? "ca-app-pub-4338763897925627/6432597471"
    : "ca-app-pub-4338763897925627/8128822528";

const interstitialUnitID =
  Platform.OS === "ios"
    ? "ca-app-pub-4338763897925627/9964554855"
    : "a-app-pub-4338763897925627/4999809260";

const styles = StyleSheet.create({
  scrollContainer: {
    height: "100%"
  },
  divider: {
    marginHorizontal: 8,
    marginVertical: 24
  },
  textHeader: {
    marginBottom: 16,
    justifyContent: "center",
    textAlign: "center"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%",
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 8,
    borderRadius: 10,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  cardDivider: {
    marginBottom: 16,
    marginTop: 16
  },
  link: {
    padding: 0,
    margin: 0
  },
  spinner: {
    height: "100%",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  recipeHeader: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  ads: {
    marginVertical: 10,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  background: {
    height: "100%"
  },
  cardHeaderText: { flex: 4, padding: 10 },
  headerControl: {
    flex: 1
  }
});

const RecipeScreen = ({
  navigation,
  favCocktailsIDs,
  toggle,
  user,
  googleLogin,
  viewRecipe
}) => {
  const [recipeData, setRecipeData] = React.useState({});
  const [normalizedNames, setNormalizedNames] = React.useState({});
  const [cocktailsList, setCocktailsList] = React.useState([]);
  const [listLength, setListLength] = React.useState(10);
  const recipe = navigation.getParam("recipe", {
    Name: "vodka",
    ID: 3,
    Popularity: 2642,
    NormalizedIngredientID: 1
  });

  const openRecipe = item => {
    GoogleAnalytics.openedRecipe(item.CocktailName);
    navigation.push("Recipe", { recipe: item });
  };

  React.useEffect(() => {
    if (_.isEmpty(recipeData)) {
      MainSourceFetch.getCocktail(recipe, setRecipeData, recipeData);
    }
    if (!_.isEmpty(recipeData) && _.isEmpty(cocktailsList)) {
      MainSourceFetch.getCocktailsByIngredient(
        recipeData.Ingredients[0],
        setCocktailsList,
        cocktailsList
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

  const CardToggleFollow = () => {
    if (user.logged) {
      toggle(recipe, user.token);
    } else {
      askForLogin();
    }
  };

  const CardsHeader = () => (
    <View style={styles.headerContainer}>
      <Text category="h6" style={styles.cardHeaderText}>
        {recipe.CocktailName}
      </Text>
      <Button
        style={styles.headerControl}
        appearance="ghost"
        icon={ShareIcon}
        onPress={() => NativeApi.ShareLink(recipeData)}
      />
      <Button
        style={styles.headerControl}
        status="danger"
        appearance="ghost"
        icon={
          favCocktailsIDs.indexOf(recipe.CocktailID) !== -1
            ? HeartIcon
            : HeartOutlineIcon
        }
        onPress={CardToggleFollow}
      />
    </View>
  );

  const ToggleFollow = (ref, item) => {
    if (user.logged) {
      toggle(item, user.token, favCocktailsIDs);
    } else {
      askForLogin();
    }
  };

  const openModal = item => {
    navigation.push("modal", { recipe: item });
  };

  const openIngredient = item => {
    navigation.push("Ingredient", { ingredient: item });
  };

  const getMore = () => {
    if (user.logged) {
      setListLength(listLength + 10);
    } else {
      askForLogin();
    }
  };

  const getNormalizedName = (actualName, normalizedName, ingredient) => {
    if (actualName.toLowerCase() !== normalizedName.toLowerCase()) {
      if (normalizedNames[actualName] === undefined) {
        const commonSubstringMatrix = [];

        for (let i = 0; i < actualName.length + 1; i += 1) {
          commonSubstringMatrix[i] = [];
          for (let j = 0; j < normalizedName.length + 1; j += 1) {
            commonSubstringMatrix[i][j] = 0;
          }
        }

        let longestCommonSubstring = 0;

        for (let i = 0; i < actualName.length + 1; i += 1) {
          for (let j = 0; j < normalizedName.length + 1; j += 1) {
            if (i == 0 || j == 0) {
              commonSubstringMatrix[i][j] = 0;
            } else if (
              actualName[i - 1].toLowerCase() ==
              normalizedName[j - 1].toLowerCase()
            ) {
              commonSubstringMatrix[i][j] =
                commonSubstringMatrix[i - 1][j - 1] + 1;

              longestCommonSubstring = Math.max(
                longestCommonSubstring,
                commonSubstringMatrix[i][j]
              );
            }
          }
        }

        const newNormalizedNames = normalizedNames;
        if (actualName.length > 4 && longestCommonSubstring < 4) {
          newNormalizedNames[actualName] = (
            <>
              {" (or "}
              <Text
                style={styles.link}
                status="primary"
                category="s1"
                onPress={() => {
                  openIngredient({
                    ...ingredient,
                    normalized: true
                  });
                }}
              >
                {normalizedName}
              </Text>
              )
            </>
          );
        } else {
          newNormalizedNames[actualName] = false;
        }
        setNormalizedNames(newNormalizedNames);

        if (newNormalizedNames[actualName] !== false) {
          return newNormalizedNames[actualName];
        }
      } else if (normalizedNames[actualName] !== false) {
        return normalizedNames[actualName];
      }
    }

    return <></>;
  };

  return (
    <Layout level="1" style={styles.background}>
      <NavigationEvents
        onDidFocus={() => {
          if (
            user.recipeViewCounter % user.interstitialAdRatio === 0 &&
            user.recipeViewCounter !== 0
          ) {
            AdMobInterstitial.setAdUnitID(interstitialUnitID).then(() =>
              AdMobInterstitial.requestAdAsync({
                servePersonalizedAds: true
              }).then(() => AdMobInterstitial.showAdAsync())
            );
          }
          viewRecipe();
        }}
      />

      <FlatList
        data={cocktailsList.slice(0, listLength)}
        keyExtractor={(item, index) =>
          item.ad ? index.toString() : item.CocktailID.toString()
        }
        ListHeaderComponent={
          _.isEmpty(recipeData) ? (
            <Layout style={styles.spinner}>
              <Spinner size="giant" />
            </Layout>
          ) : (
            <>
              <Layout style={styles.card}>
                <Card header={CardsHeader} style={styles.card}>
                  <Layout>
                    {recipeData.Ingredients.map(ingredient => (
                      <Text category="s1" key={ingredient.ID}>
                        {ingredient.Amount != "" && ingredient.Measurement != ""
                          ? `${ingredient.Amount} ${ingredient.Measurement} of`
                          : ""}{" "}
                        <Text
                          style={styles.link}
                          status="primary"
                          category="s1"
                          onPress={() => openIngredient(ingredient)}
                        >
                          {ingredient.Name}
                        </Text>
                        {getNormalizedName(
                          ingredient.Name,
                          ingredient.NormalizedName,
                          ingredient
                        )}
                      </Text>
                    ))}
                  </Layout>
                  <Divider style={styles.cardDivider} />
                  <Layout>
                    <Text>
                      {recipeData.Instructions.replace(/<[^>]+>/g, "")
                        .replace(/(\\r\\n|\\n|\\r)/gm, " ")
                        .replace(/(\r\n|\n|\r)/gm, "")}
                    </Text>
                  </Layout>
                </Card>
              </Layout>
              <Layout style={styles.ads}>
                <AdMobBanner
                  bannerSize="mediumRectangle"
                  adUnitID={unitID}
                  servePersonalizedAds
                  testDevices={[AdMobBanner.simulatorId]}
                  onAdFailedToLoad={error => console.error(error)}
                />
              </Layout>
              <Divider style={styles.divider} />
              <Text category="h6" style={styles.textHeader}>
                More cocktails with {recipeData.Ingredients[0].Name}
              </Text>
            </>
          )
        }
        ListFooterComponent={
          <>
            {cocktailsList.length !== 0 ? (
              cocktailsList.length > listLength ? (
                <Layout style={styles.buttonContainer}>
                  <Button onPress={getMore} style={styles.button}>
                    {" "}
                    More{" "}
                  </Button>
                </Layout>
              ) : (
                <></>
              )
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

RecipeScreen.propTypes = {
  favCocktailsIDs: PropTypes.any,
  googleLogin: PropTypes.any,
  navigation: PropTypes.any,
  toggle: PropTypes.any,
  user: PropTypes.any,
  viewRecipe: PropTypes.func
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
    dispatch({ type: TOGGLE_FAV_COCKTAIL, data: { item, token } }),
  viewRecipe: () => dispatch({ type: INCREMENT_RECIPE_VIEW_COUNTER })
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeScreen);

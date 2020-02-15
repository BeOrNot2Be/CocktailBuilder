/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Alert, FlatList } from "react-native";
import { Input, Layout, Button } from "@ui-kitten/components";
import { connect } from "react-redux";
import { SearchIcon, CrossIcon, BackIcon } from "../components/Icons";
import ListItem from "../components/CocktailListItem";
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
  },
  background: {
    height: "100%"
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

  const onSearch = input => {
    navigation.push("SearchedCocktails", { inputSearch: input });
    search(input);
  };

  return (
    <Layout level="1" style={styles.background}>
      <FlatList
        data={cocktails.slice(0, listLengthEnd)}
        keyExtractor={(item, index) =>
          item.ad ? index.toString() : item.CocktailID.toString()
        }
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
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
        }
        ListFooterComponent={
          cocktails.length === 0 ? (
            <Layout style={styles.addIngsButtonContainer}>
              <Button
                style={styles.button}
                icon={BackIcon}
                onPress={() => {
                  navigation.setParams({ focus: true }); // need to set param twice due to weird bug
                  navigation.navigate("ingredientContent", { focus: true });
                }}
              >
                Add my ingredients
              </Button>
            </Layout>
          ) : (
            <>
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
              <Layout level="1" style={{ height: 80 }} />
            </>
          )
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

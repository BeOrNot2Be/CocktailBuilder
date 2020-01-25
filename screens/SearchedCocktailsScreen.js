/** @format */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Input, Layout, Text } from "@ui-kitten/components";
import ListItem from "../components/listItem";
import Header from "../components/Header";
import { SearchIcon, CrossIcon } from "../components/Icons";
import MainSourceFetch from "../api/web";
import GoogleApi from "../api/google";
import GoogleAnalytics from "../api/googleAnalytics";

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
  favCocktails,
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
      toggle(item, user.token, favCocktails);
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
    favsID: favCocktails.map(e => e.CocktailID)
  };

  return (
    <Layout level="1">
      <SafeAreaView>
        <Header navigation={navigation} />
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
  favCocktails: PropTypes.any,
  googleLogin: PropTypes.any,
  navigation: PropTypes.any,
  search: PropTypes.any,
  toggle: PropTypes.any,
  user: PropTypes.any
};

const mapStateToProps = state => {
  return {
    cocktails: state.cocktails.searchedCocktails,
    favCocktails: state.cocktails.favCocktails,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => ({
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  search: input => MainSourceFetch.getCocktailsByName(input, dispatch),
  toggle: (item, token, favs) => {
    const favIDs = favs.map(e => e.CocktailID);
    if (_.includes(favIDs, item.CocktailID)) {
      MainSourceFetch.saveRemovedFav(item, favs, token, dispatch);
    } else {
      MainSourceFetch.saveAddedFav(item, favs, token, dispatch);
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchedCocktailsScreen);

/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Alert, FlatList } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { connect } from "react-redux";
import _ from "lodash";
import ListItem from "../components/CocktailListItem";
import MainSourceFetch from "../api/web";
import GoogleApi from "../api/google";
import GoogleAnalytics from "../api/googleAnalytics";
import RealGoogleButton from "../components/GoogleButton";

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  scrollContainer: {
    height: "100%"
  },
  textForNotSignedIn: {
    marginTop: "30%",
    height: "100%",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  formContainer: {
    maxWidth: "70%",
    textAlign: "center",
    marginBottom: 24
  }
});

const FavoriteScreen = ({
  navigation,
  cocktails,
  user,
  removeFav,
  googleLogin,
  cocktailsIds
}) => {
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

  const RemoveItem = (ref, item) => {
    if (user.logged) {
      removeFav(item, user.token, cocktailsIds);
    } else {
      askForLogin();
    }
  };

  const openModal = item => {
    navigation.push("modal", { recipe: item });
  };

  return (
    <Layout level="1">
      <FlatList
        data={_.sortBy(cocktails, [item => item.CocktailName])}
        keyExtractor={item => item.CocktailID.toString()}
        ListFooterComponent={
          user.logged ? (
            <Layout level="1" style={{ height: 250 }} />
          ) : (
            <Layout style={styles.textForNotSignedIn}>
              <Layout style={styles.formContainer}>
                <Text appearance="hint" category="label">
                  To unlock useful functionality like favorites list you need to
                  have an account
                </Text>
              </Layout>
              <RealGoogleButton />
            </Layout>
          )
        }
        renderItem={({ item }) => (
          <ListItem
            item={item}
            onMainButtonPress={RemoveItem}
            onPress={openRecipe}
            onLongPress={openModal}
            favsID={cocktailsIds}
          />
        )}
        extraData={cocktailsIds}
      />
    </Layout>
  );
};

FavoriteScreen.propTypes = {
  cocktails: PropTypes.any,
  googleLogin: PropTypes.any,
  navigation: PropTypes.any,
  removeFav: PropTypes.any,
  user: PropTypes.any,
  cocktailsIds: PropTypes.any
};

const mapStateToProps = state => {
  return {
    cocktails: state.cocktails.favCocktails,
    cocktailsIds: state.cocktails.favCocktailsIDs,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => ({
  removeFav: (removed, token, favsIDs) =>
    MainSourceFetch.saveRemovedFav(removed, favsIDs, token, dispatch),
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteScreen);

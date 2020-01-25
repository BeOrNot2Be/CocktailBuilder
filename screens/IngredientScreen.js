/** @format */

import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
('react-native');
import { Layout, Text, Spinner, Button } from '@ui-kitten/components';
import ListItem from '../components/listItem';
import Header from '../components/Header';
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import GoogleApi from '../api/google';
import _ from 'lodash';
import GoogleAnalytics from '../api/googleAnalytics';

const IngredientScreen = ({
  navigation,
  favCocktails,
  user,
  toggle,
  googleLogin
}) => {
  const [cocktailsList, setCocktailsList] = React.useState([]);
  const [listLength, setListLength] = React.useState(10);

  const ingredient = navigation.getParam('ingredient', {
    Name: 'vodka',
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
      'Alert',
      'You need to sign in before using this functionality',
      [
        {
          text: 'Ok'
        },
        { text: 'Sign In', onPress: () => googleLogin() }
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

  const getMore = () => {
    if (user.logged) {
      setListLength(listLength + 10);
    } else {
      askForLogin();
    }
  };

  const openRecipe = (item) => {
    GoogleAnalytics.openedRecipe(item.CocktailName);
    navigation.push('Recipe', { recipe: item });
  };

  const openModal = (item) => {
    navigation.push('modal', { recipe: item });
  };

  const listConfig = {
    ingredients: false,
    added: false,
    fav: false,
    onLongPress: openModal,
    onPress: openRecipe,
    onMainButtonPress: ToggleFollow,
    favsID: favCocktails.map((e) => e.CocktailID)
  };

  return (
    <Layout level="1">
      <SafeAreaView>
        <Header navigation={navigation} />
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
                      {' '}
                      More{' '}
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

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%'
  },
  textHeader: {
    marginBottom: 16,
    justifyContent: 'center',
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center'
  },
  spinner: {
    height: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => {
  return {
    favCocktails: state.cocktails.favCocktails,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  toggle: (item, token, favs) => {
    const favIDs = favs.map((e) => e.CocktailID);
    if (_.includes(favIDs, item.CocktailID)) {
      MainSourceFetch.saveRemovedFav(item, favs, token, dispatch);
    } else {
      MainSourceFetch.saveAddedFav(item, favs, token, dispatch);
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(IngredientScreen);

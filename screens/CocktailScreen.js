import React from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { 
  Input,
  Layout,
  Button,
  Text,
  ButtonGroup
} from '@ui-kitten/components';
import ListItem from '../components/listItem';
import Header from '../components/Header';
import {
  SearchIcon,
  CrossIcon,
} from '../components/Icons'; 
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import GoogleApi from '../api/google';
import _ from 'lodash';

const CocktailScreen = ({ navigation, cocktails, search, favCocktails, toggle, user, googleLogin }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [listLengthEnd, setListLengthEnd] = React.useState(20); 

  const openRecipe = (item) => {
    navigation.push('Recipe', {recipe: item})
  };

  const askForLogin = () => {
    Alert.alert(
      'Alert',
      'You need to sign in before using this functionality',
      [
        {
          text: 'Ok',
        },
        { text: 'Sign In', onPress: () => googleLogin() },
      ],
      { cancelable: false }
    )
  }

  const ToggleFollow = (ref, item) => {
    if (user.logged) {
      toggle(item, user.token, favCocktails)
    } else {
      askForLogin()
    }
  }

  const getMore = () => {
    askForLogin()
  }

  const openModal = (item) => {
    navigation.push('modal', {recipe:item})
  }
  
  const listConfig = {
    ingredients: false,
    added:false,
    fav:false,
    onLongPress:openModal,
    onPress:openRecipe,
    onMainButtonPress:ToggleFollow,
    favsID: favCocktails.map(e => e.CocktailID)
    }
  
  const onSearch = (input) => {
    navigation.push("SearchedCocktails", {inputSearch: input}),
    search(input)
  }


  return (
    <Layout level='1'>
      <SafeAreaView>
        <Header navigation={navigation}/>
          <ScrollView 
            style={styles.scrollContainer}
          >
              <Layout style={styles.container}>
                  <Input
                    placeholder='Search'
                    value={inputValue}
                    onChangeText={setInputValue}
                    icon={ inputValue ? CrossIcon : SearchIcon }
                    onIconPress={() => setInputValue('')}
                    autoCorrect={false}
                    onSubmitEditing={() => onSearch(inputValue)}
                  />
              </Layout>
              {cocktails.length === 0 ? (
                <Layout style={styles.textContainer}>
                  <Text category='h3' appearance='hint' >Add some ingredients</Text>
                </Layout>
              ) : (
                <>
                  {cocktails.slice(0, listLengthEnd).map(ListItem(listConfig))}
                  <Layout 
                    style={styles.buttonContainer}
                    >
                      {user.logged? (
                        cocktails.length > listLengthEnd? (
                          <Button
                            onPress={() => {setListLengthEnd(listLengthEnd + 20);}}
                            style={styles.button}
                          >Load More</Button>
                        ) : (<></>)
                      ) : (
                        <Button
                        onPress={getMore}
                        style={styles.button}
                      >Load More</Button>
                      ) }
                  </Layout>
                  <Layout level='1' style={{height: 200,}}/>
                </>
              )}
          </ScrollView>
      </SafeAreaView>
    </Layout>
  )
}


const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: 'transparent'
  },
  scrollContainer:{
    height: '100%',
  },
  buttonContainer : {
    marginTop: 10,
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
  },
  textContainer: {
    height: '100%',
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return (
    {
      cocktails: state.cocktails.cocktailsByIngredients,
      favCocktails: state.cocktails.favCocktails,
      user: state.user
    }
  )
};

const mapDispatchToProps = dispatch => ({
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  search : input => MainSourceFetch.getCocktailsByName(input, dispatch),
  toggle : (item, token, favs) => {
    const favIDs = favs.map(e => e.CocktailID);
    if (_.includes(favIDs, item.CocktailID)) {
      MainSourceFetch.saveRemovedFav(item, favs, token, dispatch)
    } else {
      MainSourceFetch.saveAddedFav(item, favs, token, dispatch)
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CocktailScreen);
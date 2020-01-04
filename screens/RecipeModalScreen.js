import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import {
  Button,
  Card,
  CardHeader,
  Text,
  Divider,
  Layout,
  Spinner
} from '@ui-kitten/components';
import _ from 'lodash';
import {
  HeartIcon,
  ShareIcon,
  HeartOutlineIcon
} from '../components/Icons';
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import NativeApi from '../api/native';
import GoogleApi from '../api/google';



  

const RecipeModal = ({navigation,  favCocktails, toggle, user, googleLogin}) => {
    const [recipeData, setRecipeData] = React.useState({});
    const recipe = navigation.getParam('recipe', {Name: "vodka", ID: 3, Popularity:2642, NormalizedIngredientID: 1})// improve it

    React.useEffect(() => {
      if (recipe.Ingredients === undefined) {
        MainSourceFetch.getCocktail(recipe, setRecipeData, recipeData);
      } else {
        if (_.isEmpty(recipeData)){
          setRecipeData(recipe)
        }
      }
    })

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

    const CardToggleFollow = () => {
      if (user.logged) {
        toggle(recipe, user.token, favCocktails)
      } else {
        askForLogin()
      }
    }

    const Footer = () => (
      <View style={styles.footerContainer}>
        <Button
          style={styles.footerControl}
          appearance='ghost'
          icon={ShareIcon}
          onPress={() => NativeApi.ShareLink(recipeData)}
        />
        <Button
          style={styles.footerControl}
          status='danger'
          appearance='ghost'
          icon={_.includes(favCocktails.map(e => e.CocktailID), recipe.CocktailID)? HeartIcon: HeartOutlineIcon}
          onPress={CardToggleFollow}
          />
      </View>
    );

    const Header = () => (
      <CardHeader
        title={recipe.CocktailName}
        description='by CocktailBuilder'
      />
    );

    const openIngredient = (item) => {
      navigation.goBack();
      navigation.push('Ingredient', {ingredient: item})
    }

    return (
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <View style={styles.Backdrop}>
          <SafeAreaView>
              <View style={styles.cardContainer}>
                <Card header={Header} footer={Footer} style={styles.card}>
                {_.isEmpty(recipeData)? (
                  <Layout 
                    style={styles.spinner}
                  >
                    <Spinner size='giant'/>
                  </Layout>
                ): (
                  <>
                    <Layout>
                        {recipeData.Ingredients.map((ingredient) => (
                            <Text category='s1' key={ingredient.ID}> 
                                {ingredient.Amount} {ingredient.Measurement} of <Text style={styles.link} status='primary' category='s1' onPress={() => openIngredient(ingredient)}>{ingredient.Name}</Text>
                            </Text>
                        ))}
                    </Layout>
                    <Divider style={styles.cardDivider}/>
                    <Layout>
                        <Text>
                            {recipeData.Instructions}
                        </Text>
                    </Layout>
                  </>
                )}
                </Card>
              </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    card: {
      borderRadius: 10,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '100%',
    },
    cardContainer: {
      maxWidth: '100%',
      marginBottom: 8,
      marginTop: 8,
      marginHorizontal: 8,
      borderRadius: 10,
      borderColor: 'transparent',
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
      },
    cardDivider: {
        marginBottom: 16,
        marginTop: 16,
    },
    link: {
        padding: 0,
        margin: 0,
    },
    Backdrop: {
      width: '100%',
      height: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spinner: {
      justifyContent: 'center',
      textAlign:'center',
      alignItems: 'center',
    },
  });

  const mapStateToProps = (state) => {
    return (
      {
        favCocktails: state.cocktails.favCocktails,
        user: state.user
      }
    )
  };
  
  const mapDispatchToProps = dispatch => ({
    googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
    toggle : (item, token, favs) => {
      const favIDs = favs.map(e => e.CocktailID);
      if (_.includes(favIDs, item.CocktailID)) {
        MainSourceFetch.saveRemovedFav(item, favs, token, dispatch)
      } else {
        MainSourceFetch.saveAddedFav(item, favs, token, dispatch)
      }
    }
  });

export default connect(mapStateToProps, mapDispatchToProps)(RecipeModal);
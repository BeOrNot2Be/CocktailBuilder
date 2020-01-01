import React from 'react';
import { StyleSheet, ScrollView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
  Layout,
  Button,
  Text
} from '@ui-kitten/components';
import ListItem from '../components/listItem';
import { GoogleIcon } from '../components/Icons';
import Header from '../components/Header';
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import GoogleApi from '../api/google';
import _ from 'lodash';

let fetched = false;

const FavoriteScreen = ({navigation, cocktails, user, removeFav, fetchFav, googleLogin}) => {
  const openRecipe = (item) => {
    navigation.push('Recipe', {recipe: item})
  };

  const RemoveItem = (ref, item) => {
    ref.bounceOutLeft(800)
    if (user.logged) {
      removeFav(item, user.token, cocktails)
    } else {
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
  }

  const openModal = (item) => {
    navigation.push('modal', {recipe:item})
  }

  const listConfig = {
    ingredients: false,
    added:false,
    fav:true,
    onLongPress:openModal,
    onPress:openRecipe,
    onMainButtonPress:RemoveItem,
    favsID: cocktails.map(e => e.CocktailID)
    }
  
  React.useEffect(() => {
    if (!fetched){
      if (user.logged) {
        fetchFav( user.token )
        fetched = true
      }
    } else {
      if (!user.logged){
        fetched = false
      }
    }
  })

  return (
    <Layout level='1'>
      <SafeAreaView>
        <Header navigation={navigation}/>
        <Layout level='1' style={styles.scrollContainer}>
          <ScrollView >
            {
              user.logged? (
                <>
                  {cocktails.map(ListItem(listConfig))}
                  <Layout level='1' style={{height: 250,}}/>
                </>
              ) : (
                <Layout style={styles.CTAdiv}>
                  <Layout style={styles.formContainer}>
                    <Text 
                      appearance='hint'
                      category='label'
                    >To unlock useful functionality like favorites list you need to have an account</Text>
                    </Layout>
                    <Button 
                      status="danger"
                      onPress={() => googleLogin()}
                      icon={GoogleIcon}
                    >Join for FREE</Button>
                </Layout>
              )
            } 
          </ScrollView>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}


const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer:{
    height: '100%',
  },
  CTAdiv: {
    marginTop: '30%',
    height: '100%',
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
  },
  formContainer: {
    maxWidth: '70%',
    textAlign:'center',
    marginBottom: 24,
  }
});

const mapStateToProps = (state) => {
  return (
    {
      cocktails: state.cocktails.favCocktails,
      user: state.user
    }
  )
};

const mapDispatchToProps = dispatch => ({
  removeFav : (removed, token, favs) => MainSourceFetch.saveRemovedFav(removed, favs, token, dispatch),
  fetchFav : (token) => MainSourceFetch.getFavs( token, dispatch ),
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  //addFav : (added, token, favs) => MainSourceFetch.saveAddedFav(added, favs, token, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(FavoriteScreen);

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
  Layout,
  Button,
  Text
} from '@ui-kitten/components';
import RecipeModal from '../components/RecipeModal';
import ListItem from '../components/listItem';
import Modal from 'react-native-modal';
import Header from '../components/Header';
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import GoogleApi from '../api/google';
import _ from 'lodash';

let fetched = false;

const FavoriteScreen = ({navigation, cocktails, user, removeFav, fetchFav, googleLogin}) => {

  const [visible, setVisible] = React.useState(false);

  const toggleModal = () => {
    setVisible(false);
  };

  

  const openRecipe = (item) => {
    navigation.push('Recipe', {recipe: item})
  };

  const openModal = (index) => {
    //FETCH DATA && LOADING
    setVisible(true);
  };

  const RemoveItem = (ref, item) => {
    ref.bounceOutLeft(800)
    if (user.logged) {
      removeFav(item, user.token, cocktails)
    }
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
          <ScrollView>
            {
              user.logged? (
                <>
                  {cocktails.map(ListItem(listConfig))}
                  <Modal
                    isVisible={visible}
                    onBackdropPress={toggleModal}
                      >
                      <RecipeModal />
                  </Modal>
                  <Layout level='1' style={{height: 250,}}/>
                </>
              ) : (
                <Layout style={styles.CTAdiv}>
                  <Text>To unlock useful functionality like favorites list you need to have an account</Text>
                  <Button 
                    status="danger"
                    onPress={() => googleLogin()}
                  >Login for FREE !</Button>
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
    height: '100%',
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
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

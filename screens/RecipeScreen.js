import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View } from 'react-native'; //check View to layout
import {
  Layout,
  Divider,
  Text,
  Card,
  Button,
  CardHeader,
  Spinner
} from '@ui-kitten/components';
import Modal from 'react-native-modal';
import ListItem from '../components/listItem';
import Header from '../components/Header';
import RecipeModal from '../components/RecipeModal';
import {
  HeartIcon,
  ShareIcon,
  HeartOutlineIcon
} from '../components/Icons';
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import _ from 'lodash';



const RecipeScreen = ({navigation, favCocktails, toggle, user }) => {

    const [visible, setVisible] = React.useState(false);
    const [recipeData, setRecipeData] = React.useState({});
    const [cocktailsList, setCocktailsList] = React.useState([]);
    const [listLength, setListLength] = React.useState(10);
    const recipe = navigation.getParam('recipe', {Name: "vodka", ID: 3, Popularity:2642, NormalizedIngredientID: 1})// improve it
    const toggleModal = () => {
      setVisible(false);
    };
  
    const openModal = (index) => {
      //FETCH DATA && LOADING
      setVisible(true);
    };

    const openRecipe = (item) => {
        navigation.push('Recipe', {recipe: item})
      };

    React.useEffect(() => {
      MainSourceFetch.getCocktail(recipe, setRecipeData, recipeData);
      if (!_.isEmpty(recipeData)){
        MainSourceFetch.getCocktailsByIngredient(recipeData.Ingredients[0], setCocktailsList, cocktailsList);
      }
    })
    
    const CardsHeader = () => (
      <CardHeader
        title={recipe.CocktailName}
        description='by CocktailBuilder'
      />
    );
    
    const CardsFooter = () => ( // add functionality
      <View style={styles.footerContainer}>
        <Button
          style={styles.footerControl}
          appearance='ghost'
          icon={ShareIcon}
          onPress={() => {console.warn(recipeData.Url)}}
        />
        <Button
          style={styles.footerControl}
          status='danger'
          appearance='ghost'
          icon={_.includes(favCocktails.map(e => e.CocktailID), recipe.CocktailID)? HeartIcon: HeartOutlineIcon}
          onPress={() => {if (user.logged) {toggle(recipe, user.token, favCocktails)}}}
          />
      </View>
    );
    
    const ToggleFollow = (ref, item) => 
    {
      ref.shake(800)
      if (user.logged) {
        toggle(item, user.token, favCocktails)
      }
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

        const openIngredient = (ing) => {
          console.warn(ing)
      }


  return (
    <Layout level='1'>
      <SafeAreaView>
        <Header navigation={navigation}/>
        <Layout level='1'>
          <ScrollView style={styles.scrollContainer}>
            { _.isEmpty(recipeData) ? (
               <Layout 
               style={styles.spinner}
               >
                <Spinner size='giant'/>
               </Layout>
            ) : (
               <Layout style={styles.card}>
                <Card header={CardsHeader} footer={CardsFooter} style={styles.card}>
                    <Layout>
                        {recipeData.Ingredients.map((ingredient) => (
                            <Text category='s1' key={ingredient.ID}> 
                                {ingredient.Amount} {ingredient.Measurement} of <Text style={styles.link} status='primary' category='s1' onPress={() => openIngredient(ingredient.ID)}>{ingredient.Name}</Text>
                            </Text>
                        ))}
                    </Layout>
                    <Divider style={styles.cardDivider}/>
                    <Layout>
                        <Text>
                            {recipeData.Instructions}
                        </Text>
                    </Layout>
                </Card>
              </Layout>
            )}
            {cocktailsList.length !== 0 ? (
              <>
               <Divider style={styles.divider}/>
              <Text  category='h6' style={styles.textHeader}>
                More cocktails with {recipeData.Ingredients[0].Name}
              </Text>
              {cocktailsList.slice(0,listLength).map(ListItem(listConfig))}
              <Layout 
              style={styles.buttonContainer}
              >
                <Button
                  onPress={() => setListLength(listLength + 10)}
                  style={styles.button}
                > More </Button>
            </Layout>
              </>
            ) : (
              <Layout 
              style={styles.spinner}
              >
                <Spinner size='giant'/>
              </Layout>
            )}

            
            <Modal
              isVisible={visible}
              onBackdropPress={toggleModal}
              animationIn="fadeIn"
              animationOut="fadeOut"
            >
                <RecipeModal />
            </Modal>
            <Layout level='1' style={{height: 250,}}/>
          </ScrollView>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  scrollContainer:{
    height: '100%',
  },
  divider: {
    marginHorizontal: 8,
    marginVertical: 24,
  },
  textHeader: {
    marginBottom: 16,
    justifyContent: 'center',
    textAlign:'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
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
  spinner: {
    height: '100%',
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
  },
  buttonContainer : {
    marginTop: 10,
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
  toggle : (item, token, favs) => {
    const favIDs = favs.map(e => e.CocktailID);
    if (_.includes(favIDs, item.CocktailID)) {
      MainSourceFetch.saveRemovedFav(item, favs, token, dispatch)
    } else {
      MainSourceFetch.saveAddedFav(item, favs, token, dispatch)
    }
  }
});

export default  connect(mapStateToProps, mapDispatchToProps)(RecipeScreen);
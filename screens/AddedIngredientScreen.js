import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Layout,
} from '@ui-kitten/components';
import ListItem from '../components/listItem';
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import { REMOVE_INGREDIENT_FROM_SEARCH_BY, ADDED_CHECK_MAP_UPDATE } from '../actions/Ingredients';

const AddedIngredients= ({ navigation, addedIngredients, getCocktailsByIngredients, removeIngredient, setAdded }) => {

  const openIngredient = () => {
    navigation.push('Ingredient')
  };


  const removeIngredientToList = (ref, item) => {
    removeIngredient(item)
    getCocktailsByIngredients(addedIngredients.filter(ing => ing.ID !== item.ID ))
    setAdded(item.ID)
  }

  const listConfig = {
    ingredients: true,
    added: true,
    onPress:openIngredient,
    onMainButtonPress:removeIngredientToList
  }

  return (
    <Layout level='2' style={styles.scrollContainer}>
      <ScrollView>
          {(addedIngredients.length === 0)? (
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center', }} level='2'>
              <Text appearance='hint' category='h3'>
                No Added Ingredients
              </Text>
            </Layout>
          ): (
            <>
              {addedIngredients.map(ListItem(listConfig))}
              <Layout level='2' style={{height: 80,}}/>
            </>
          )}
      </ScrollView>
    </Layout>
  )
}



const styles = StyleSheet.create({
  scrollContainer:{
    height: '100%',
  }
});

const mapStateToProps = (state) => {
  return (
    {
      addedIngredients: state.ingredients.addedIngredients,
    }
  )
};

const mapDispatchToProps = dispatch => ({
  getCocktailsByIngredients : addedIngredients => MainSourceFetch.getCocktailsByIngredients(addedIngredients, dispatch),
  removeIngredient: (item) => dispatch({ type:REMOVE_INGREDIENT_FROM_SEARCH_BY, data: item }),
  setAdded: (addedID) => dispatch({ type:ADDED_CHECK_MAP_UPDATE, data: addedID }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddedIngredients);
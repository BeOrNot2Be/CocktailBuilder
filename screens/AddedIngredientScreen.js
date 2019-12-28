import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Layout,
} from '@ui-kitten/components';
import ListItem from '../components/listItem';
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import { REMOVE_INGREDIENT_FROM_SEARCH_BY } from '../actions/Ingredients';

const data = new Array(5).fill({
  title: 'Title for Item',
});


const AddedIngredients= ({ navigation, addedIngredients, getCocktailsByIngredients ,removeIngredient }) => {

  const openIngredient = () => {
    navigation.push('Ingredient')
  };


  const removeIngredientToList = (ref, item) => {
    removeIngredient(item)
    ref.slideOutLeft(800);
    getCocktailsByIngredients(addedIngredients.filter(ing => ing.ID !== item.ID ))
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
          {(data.length === 0)? (
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text category='h1'>
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
  removeIngredient: (item) => dispatch({ type:REMOVE_INGREDIENT_FROM_SEARCH_BY, data: item })
});

export default connect(mapStateToProps, mapDispatchToProps)(AddedIngredients);
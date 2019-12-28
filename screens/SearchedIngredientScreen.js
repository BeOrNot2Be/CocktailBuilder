import React from 'react';
import { StyleSheet, ScrollView} from 'react-native';
import {
  Layout,
  Input,
  Text,
  Button
} from '@ui-kitten/components';
import ListItem from '../components/listItem';
import {
  SearchIcon
  } from '../components/Icons'; 
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import { ADD_INGREDIENT_TO_SEARCH_BY } from '../actions/Ingredients';
import Fuse from 'fuse.js';



const IngredientScreen = ({navigation, searchedIngredients, addedIngredients, addIngredient, getCocktailsByIngredients, getIngredientList }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [listLength, setListLength] = React.useState(10);

  getIngredientList();

  const addIngredientToList = (ref, item) => {
    addIngredient(item)
    ref.slideOutRight(800);
    getCocktailsByIngredients(addedIngredients.concat(item))
  }

  const openIngredient = (item) => {
    navigation.push('Ingredient', {
      ingredient: item
    });
    };
  
  const listConfig = {
    ingredients: true,
    onPress:openIngredient,
    onMainButtonPress:addIngredientToList
    }

  //search
  let founded;
  
  var options = {
    threshold: 0.2,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: [
      "Name",
    ]
  }

  const searchEngine = new Fuse(searchedIngredients, options);

  founded = searchEngine.search(inputValue);

  return (
    <Layout level='2' style={styles.scrollContainer}>
      <ScrollView>
          <Layout style={styles.container} level='2'>
            <Input
              placeholder='Search'
              value={inputValue}
              onChangeText={setInputValue}
              icon={SearchIcon}
              caption={founded.length !== 0 ? `Founded ${founded.length} results` : ''}
            />
          </Layout>
          {founded.length !== 0 ? (
            <>
            {founded.slice(0,listLength).map(ListItem(listConfig))}
            <Layout 
              style={styles.buttonContainer}
              level='2'
              >
              <Button
                onPress={() => setListLength(listLength + 10)}
              > More </Button>
            </Layout>
            </>
          ) : 
              (inputValue !== '' ? (
              <Text>No results found for search:{inputValue}</Text>
              ):<></>)}
          <Layout level='2' style={{height: 80,}}/>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 5,
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
});

const mapStateToProps = (state) => {
  return (
    {
      addedIngredients: state.ingredients.addedIngredients,
      searchedIngredients: state.ingredients.searchedIngredients,
    }
  )
};

let fetched = false;

const mapDispatchToProps = dispatch => ({
  getCocktailsByIngredients : addedIngredients => MainSourceFetch.getCocktailsByIngredients(addedIngredients, dispatch),
  addIngredient: (id) => dispatch({ type:ADD_INGREDIENT_TO_SEARCH_BY, data: id }),
  getIngredientList: () => { 
    if (!fetched){
      MainSourceFetch.getIngredientsList(dispatch);
      fetched = true
   }},
});

export default connect(mapStateToProps, mapDispatchToProps)(IngredientScreen);
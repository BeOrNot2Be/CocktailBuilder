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
import _ from 'lodash';

let typingTimeout = null;
let searching = true;

const IngredientScreen = ({navigation, searchEngine, addedIngredients, addIngredient, getCocktailsByIngredients, getIngredientList }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [listLength, setListLength] = React.useState(10);
  const [founded, setFounded] = React.useState([]);
  getIngredientList();

  const addIngredientToList = (ref, item) => {
    if (_.indexOf(addedIngredients, item) === -1) {
      addIngredient(item)
      getCocktailsByIngredients(addedIngredients.concat(item))
    }
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

  
  const searchInput = text => {
    clearTimeout(typingTimeout);
    searching = true
    typingTimeout = setTimeout(() => {
      searching = false;
      setFounded(searchEngine.search(text).sort((a, b) => (a.Popularity > b.Popularity) ? -1 : 1))
    }, 400);
    setInputValue(text);
  }

  const getMore = () => {
    setListLength(listLength + 10)
  }

  return (
    <Layout level='2' style={styles.scrollContainer}>
      <ScrollView>
          <Layout style={styles.container} level='2'>
            <Input
              placeholder='Search'
              value={inputValue}
              onChangeText={searchInput}
              icon={SearchIcon}
              caption={founded.length !== 0 ? `Found ${founded.length} results` : ''}
            />
          </Layout>
          {founded.length !== 0 ? (
            <>
            {founded.slice(0,listLength).map(ListItem(listConfig))}
            {founded.length > listLength? (
            <Layout 
              style={styles.buttonContainer}
              level='2'
              >
              <Button
                onPress={getMore}
              > More </Button>
            </Layout>) : (<>
            </>)}
            </>
          ) : 
              (inputValue !== '' && !searching ? (
                <Layout style={styles.textContainer} level="2">
                  <Text category='p2' status='basic'>No results found for search: {inputValue}</Text>
                </Layout>
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
  textContainer: {
    paddingLeft: 24
  }
});

var options = {
  threshold: 0.2,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    "Name",
  ]
}

const mapStateToProps = (state) => {
  return (
    {
      addedIngredients: state.ingredients.addedIngredients,
      searchEngine: new Fuse(state.ingredients.searchedIngredients, options),
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
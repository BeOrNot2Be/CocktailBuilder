import React from 'react';
import { StyleSheet, ScrollView, FlatList} from 'react-native';
import {
  Layout,
  Input,
  Text,
  Button,
  ButtonGroup
} from '@ui-kitten/components';
import ListItem from '../components/SearchedIngredientItem';
import {
  SearchIcon,
  ForwardIcon,
  BackIcon
  } from '../components/Icons'; 
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import { 
  ADD_INGREDIENT_TO_SEARCH_BY,
  ADDED_CHECK_MAP_UPDATE } from '../actions/Ingredients';
import _ from 'lodash';

let typingTimeout = null;
let searching = true;

const IngredientScreen = ({navigation, searchEngine, addedIngredients, addIngredient, getCocktailsByIngredients, getIngredientList, added, setAdded, getInventoryList, user }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [founded, setFounded] = React.useState([]);
  const [listLengthStart, setListLengthStart] = React.useState(0);
  const [listLengthEnd, setListLengthEnd] = React.useState(10); 


  getIngredientList();

  getCocktailsByIngredients(addedIngredients)

  React.useEffect(() => {
      if (user.logged) {
        getInventoryList( user.token )
      }
  })

  const addIngredientToList = (ref, item) => {
      addIngredient(item)
      setAdded(item.ID);
  }

  const openIngredient = (item) => {
    navigation.push('Ingredient', {
      ingredient: item
    });
  };
  
  const searchInput = text => {
    clearTimeout(typingTimeout);
    searching = true
    typingTimeout = setTimeout(() => {
      searching = false;
      setListLengthEnd(10)
      setListLengthStart(0)
      setFounded(searchEngine.search(text).sort((a, b) => (a.Popularity > b.Popularity) ? -1 : 1))
    }, 400);
    setInputValue(text);
  }

  return (
    <Layout level='2' style={styles.scrollContainer}>
            <FlatList
              data={founded.slice(listLengthStart, listLengthEnd)}
              keyExtractor={item => item.ID.toString()}
              ListHeaderComponent={
                <Layout style={styles.container} level='2'>
                  <Input
                    placeholder='Search'
                    value={inputValue}
                    onChangeText={searchInput}
                    icon={SearchIcon}
                    caption={founded.length !== 0 ? `Found ${founded.length} results` : ''}
                  />
                  {founded.length !== 0 ? (<></>) : 
                  (inputValue !== '' && !searching ? (
                    <Layout style={styles.textContainer} level="2">
                      <Text category='p2' status='basic'>No results found for search: {inputValue}</Text>
                    </Layout>
                  ):<></>)}
                </Layout>
              }
              ListFooterComponent={
                <>
                  <Layout 
                    level='2'
                    style={styles.buttonContainer}
                    > 
                      <ButtonGroup appearance='outline' size='large'>
                      {listLengthStart > 9 ? (
                        <Button
                        onPress={() => {setListLengthEnd(listLengthEnd - 10); setListLengthStart(listLengthStart - 10)}}
                          style={styles.button}
                          icon={BackIcon}
                        ></Button>
                      ) : (<></>)}
                      {founded.length > listLengthEnd? (
                        <Button
                          onPress={() => {setListLengthEnd(listLengthEnd + 10); setListLengthStart(listLengthStart + 10)}}
                          style={styles.button}
                          icon={ForwardIcon}
                        ></Button>
                      ) : (<></>)}
                      </ButtonGroup>
                  </Layout>
              <Layout level='2' style={{height: 80,}}/>
              </>
            }
              renderItem={({ item }) => (
                <ListItem item={item} onMainButtonPress={addIngredientToList} onPress={openIngredient} added={!!added.get(item.ID)} />
              )}
              extraData={added}
            />
    </Layout>
  )
};

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



const mapStateToProps = (state) => {
  return (
    {
      addedIngredients: state.ingredients.addedIngredients,
      added: state.ingredients.addedCheck,
      searchEngine:  state.ingredients.searchEngine,
      user: state.user
    }
  )
};

let fetchedSearched = false;
let fetchedInventory = false;

const mapDispatchToProps = dispatch => ({
  getCocktailsByIngredients : addedIngredients => MainSourceFetch.getCocktailsByIngredients(addedIngredients, dispatch),
  addIngredient: (id) => dispatch({ type:ADD_INGREDIENT_TO_SEARCH_BY, data: id }),
  getIngredientList: () => { 
    if (!fetchedSearched){
      MainSourceFetch.getIngredientsList(dispatch);
      fetchedSearched = true
   }},
  getInventoryList: (token) => { 
    if (!fetchedInventory){
      MainSourceFetch.getInventoryIngs(token, dispatch);
      fetchedInventory = true
   }},
  setAdded: (addedID) => dispatch({ type:ADDED_CHECK_MAP_UPDATE, data: addedID }),
});

export default connect(mapStateToProps, mapDispatchToProps)(IngredientScreen);
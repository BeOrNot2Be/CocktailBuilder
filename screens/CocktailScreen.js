import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import { 
  Input,
  Layout
} from '@ui-kitten/components';
import RecipeModal from '../components/RecipeModal';
import ListItem from '../components/listItem';
import Header from '../components/Header';
import {
  SearchIcon,
  CrossIcon
} from '../components/Icons'; 
import { connect } from 'react-redux';
import MainSourceFetch from '../api/web';
import _ from 'lodash';

const CocktailScreen = ({ navigation, cocktails, search, favCocktails, toggle, user }) => {
  const [inputValue, setInputValue] = React.useState('');
  
  const [visible, setVisible] = React.useState(false);

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

  const ToggleFollow = (ref, item) => {
    ref.shake(800)
    if (!_.isEmpty(user)) {
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
  
  const onSearch = (input) => {
    navigation.push("SearchedCocktails", {inputSearch: input}),
    search(input)
  }

  return (
    <Layout level='1'>
      <SafeAreaView>
        <Header navigation={navigation}/>
          <ScrollView style={styles.scrollContainer}>
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
              <Text>Add some ingredients</Text>
              ) : (
                <>
                  {cocktails.map(ListItem(listConfig))}
                  <Layout level='1' style={{height: 200,}}/>
                  <Modal
                  isVisible={visible}
                  onBackdropPress={toggleModal}
                    >
                    <RecipeModal />
                  </Modal>
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
  }
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
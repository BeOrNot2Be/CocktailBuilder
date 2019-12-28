import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
'react-native';
import {
  Layout,
  Text,
  Spinner,
  Button
} from '@ui-kitten/components';
import Modal from 'react-native-modal';
import ListItem from '../components/listItem';
import Header from '../components/Header';
import RecipeModal from '../components/RecipeModal';
import MainSourceFetch from '../api/web';


const ItemAnimation = ref => ref.bounceOutRight(800)//change

const IngredientScreen = ({navigation}) => {
    const [cocktailsList, setCocktailsList] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [listLength, setListLength] = React.useState(10);

    const ingredient = navigation.getParam('ingredient', {Name: "vodka", ID: 3, Popularity:2642, NormalizedIngredientID: 1})

    const toggleModal = () => {
      setVisible(false);
    };
    
    React.useEffect(() => {
      MainSourceFetch.getCocktailsByIngredient(ingredient, setCocktailsList, cocktailsList);
    })

    const openModal = (index) => {
      //FETCH DATA && LOADING
      setVisible(true);
    };

    const openRecipe = (item) => {
        navigation.push('Recipe', {recipe: item})
      };

    const listConfig = {
        ingredients: false,
        added:false,
        fav:false,
        onLongPress:openModal,
        onPress:openRecipe,
        onMainButtonPress:ItemAnimation
        }

  return (
    <Layout level='1'>
      <SafeAreaView>
        <Header navigation={navigation}/>
        <Layout level='1'>
          <ScrollView style={styles.scrollContainer}>
            <Text  category='h6' style={styles.textHeader}>
                More cocktails with {ingredient.Name}
            </Text>
            <Text appearance='hint' category='c2' style={styles.textHeader}>
                {ingredient.Popularity} results
            </Text>
            {cocktailsList.length !== 0 ? (
              <>
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
  textHeader: {
    marginBottom: 16,
    justifyContent: 'center',
    textAlign:'center',
  },
  buttonContainer : {
    marginTop: 10,
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
  },
  spinner: {
    height: '100%',
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center',
  }
});

export default IngredientScreen;
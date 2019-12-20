import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import { 
  Input,
  Layout,
  Icon
} from '@ui-kitten/components';
import RecipeModal from '../components/RecipeModal';
import ListItem from '../components/listItem';
import Header from '../components/Header';
import {
  SearchIcon, CrossIcon
  } from '../components/Icons'; 

const data = new Array(3).fill({
  title: 'Title for Item',
  description: 'Some small desc for example and stuff(ui testing)'
});

const CocktailScreen = ({ navigation }) => {
  const [inputValue, setInputValue] = React.useState('');

  const [visible, setVisible] = React.useState(false);

  const toggleModal = () => {
    setVisible(false);
  };

  const openModal = (index) => {
    //FETCH DATA && LOADING
    setVisible(true);
  };

  const openRecipe = () => {
    navigation.push('Recipe')
  };

  const ItemAnimation = ref => ref.bounceOutRight(800)
  const listConfig = {
    ingredients: false,
    added:false,
    fav:false,
    onLongPress:openModal,
    onPress:openRecipe,
    onMainButtonPress:ItemAnimation
    }

  const renderIcon = (style) => (
      <Icon {...style} name={inputValue ? 'close-outline' : 'search-outline'}/>
    );
  
  return (
    <Layout level='1'>
      <SafeAreaView>
        <Header navigation={navigation}/>
        <Layout level='1'>
          <ScrollView style={styles.scrollContainer}>
              <Layout style={styles.container}>
                  <Input
                    placeholder='Search'
                    value={inputValue}
                    onChangeText={setInputValue}
                    icon={ inputValue ? CrossIcon : SearchIcon }
                    onIconPress={() => setInputValue('')}
                  />
              </Layout>
              {data.map(ListItem(listConfig))}
              <Modal
              isVisible={visible}
              onBackdropPress={toggleModal}
              animationIn="fadeIn"
              animationOut="fadeOut"
                >
                <RecipeModal />
              </Modal>
          </ScrollView>
        </Layout>
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
  },
  scrollContainer:{
    height: '100%',
  }
});

export default CocktailScreen;
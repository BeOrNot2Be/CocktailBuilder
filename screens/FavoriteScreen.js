import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
  Layout
} from '@ui-kitten/components';
import RecipeModal from '../components/RecipeModal';
import ListItem from '../components/listItem';
import Modal from 'react-native-modal';
import Header from '../components/Header';

const data = new Array(3).fill({
  title: 'Title for Item',
  description: 'Some small desc for example and stuff(ui testing)'
});

const FavoriteScreen = ({navigation}) => {
  const onUnFollow = () => {};

  const [visible, setVisible] = React.useState(false);

  const toggleModal = () => {
    setVisible(false);
  };

  

  const openRecipe = () => {
    navigation.push('Recipe')
  };

  const openModal = (index) => {
    //FETCH DATA && LOADING
    setVisible(true);
  };

  const ItemAnimation = ref => ref.bounceOutLeft(800)

  const listConfig = {
    ingredients: false,
    added:false,
    fav:true,
    onLongPress:openModal,
    onPress:openRecipe,
    onMainButtonPress:ItemAnimation
    }
  

  return (
    <Layout level='1'>
      <SafeAreaView>
        <Header navigation={navigation}/>
        <Layout level='1' style={styles.scrollContainer}>
          <ScrollView>
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer:{
    height: '100%',
  }
});

export default FavoriteScreen;

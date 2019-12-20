import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
'react-native';
import {
  Layout,
  Divider,
  Text
} from '@ui-kitten/components';
import Modal from 'react-native-modal';
import ListItem from '../components/listItem';
import Header from '../components/Header';
import RecipeModal from '../components/RecipeModal';

const data = new Array(5).fill({
    title: 'Title for Item',
    description: 'Some small desc for example and stuff(ui testing)'
  });

const ItemAnimation = ref => ref.bounceOutRight(800)//change

const RecipeScreen = ({navigation}) => {

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
            <RecipeModal style={styles.card} />
            <Divider style={styles.divider}/>
            <Text  category='h6' style={styles.textHeader}>
                More cocktails with Gin
            </Text>
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
  scrollContainer:{
    height: '100%',
  },
  card:{
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
  divider: {
    marginHorizontal: 8,
    marginVertical: 24,
  },
  textHeader: {
    marginBottom: 16,
    justifyContent: 'center',
    textAlign:'center',
  }
});

export default RecipeScreen;
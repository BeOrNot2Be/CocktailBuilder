import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import { 
  Input,
  Layout,
  Icon,
} from '@ui-kitten/components';
import RecipeModal from '../components/RecipeModal';
import ListItem from '../components/listItem';
import Header from '../components/Header';



const SearchIcon = (style) => (
  <Icon {...style} name='search-outline' />
);

const data = new Array(3).fill({
  title: 'Title for Item',
  description: 'Some small desc for example and stuff(ui testing)'
});

const CocktailScreen = ({ navigation }) => {
  let AnimationModalRef;
  const [inputValue, setInputValue] = React.useState('');

  const [visible, setVisible] = React.useState(false);

  const toggleModal = () => {
    setVisible(false);
  };

  const openModal = (index) => {
    //FETCH DATA && LOADING
    setVisible(true);
  };

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
                  icon={SearchIcon}
                />
              </Layout>
              {data.map(ListItem(false, false, false, openModal, toggleModal))}
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
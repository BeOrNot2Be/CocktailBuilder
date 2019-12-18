import React from 'react';
import { StyleSheet } from 'react-native';
import { 
  List,
  ListItem,
  Button,
  Modal,
  Input,
  Layout,
  Icon
} from '@ui-kitten/components';
import RecipeModal from '../components/RecipeModal';
import { DrawerActions } from "react-navigation-drawer";

const MenuIcon = (style) => (
  <Icon
    {...style}
    width={24}
    height={24}
    name='menu-outline'
   />
);

const SearchIcon = (style) => (
  <Icon {...style} name='search-outline' />
);

const data = new Array(8).fill({
  title: 'Title for Item',
  description: 'Some small desc for example and stuff(ui testing)'
});

const CocktailScreen = () => {
  const [inputValue, setInputValue] = React.useState('');

  const [visible, setVisible] = React.useState(false);

  const toggleModal = () => {
    setVisible(!visible);
  };

  const renderModalElement = () => (
      <RecipeModal />
  );

  const openItem = (index) => {
    //FETCH DATA && LOADING
    setVisible(true);
  };
  

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      onPress={() => openItem(index)}
    />
  );


  return (
    <>
      <Layout style={styles.container}>
        <Input
          placeholder='Search'
          value={inputValue}
          onChangeText={setInputValue}
          icon={SearchIcon}
        />
      </Layout>
      <List
          data={data}
          renderItem={renderItem}
        />
      <Modal
        allowBackdrop={true}
        backdropStyle={styles.backdrop}
        onBackdropPress={toggleModal}
        visible={visible}>
        {renderModalElement()}
      </Modal>
    </>
  )
}

CocktailScreen.navigationOptions = ({ navigation, navigationOptions }) => {
  return {
    title: 'Cocktails',
    headerRight: () => (
      <Button
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        appearance='ghost'
        status='basic'
        icon={MenuIcon}      
      />
    ),
  }
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
});

export default CocktailScreen;
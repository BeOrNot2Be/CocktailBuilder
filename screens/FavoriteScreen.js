import React from 'react';
import { StyleSheet } from 'react-native';
import {
  List,
  ListItem,
  Button,
  Modal,
  Icon
} from '@ui-kitten/components';
import { DrawerActions } from "react-navigation-drawer";
import RecipeModal from '../components/RecipeModal';

const data = new Array(8).fill({
  title: 'Title for Item',
  description: 'Some small desc for example and stuff(ui testing)'
});

const HeartIcon = (style) => (
  <Icon
    {...style}
    width={32}
    height={32}
    name='heart'
   />
);

const MenuIcon = (style) => (
  <Icon
    {...style}
    width={24}
    height={24}
    name='menu-outline'
   />
);

const FavoriteScreen = ({navigation}) => {
  const onUnFollow = () => {};

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
  
  const renderItemAccessory = (style) => (
    <Button
      appearance='ghost'
      status='danger'
      icon={HeartIcon}
      onPress={onUnFollow}/>
  );

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessory={renderItemAccessory}
      onPress={() => openItem(index)}
    />
  );

  return (
    <>
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

FavoriteScreen.navigationOptions = ({ navigation, navigationOptions }) => {
  return {
    title: 'Favorites',
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
});

export default FavoriteScreen;

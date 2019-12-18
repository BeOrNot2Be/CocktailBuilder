import React from 'react';
import { StyleSheet } from 'react-native';
import {
  List,
  ListItem,
  Button,
  Modal,
  Icon
} from '@ui-kitten/components';
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

const FavoriteScreen = (props) => {
  console.warn(props)
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

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default FavoriteScreen;

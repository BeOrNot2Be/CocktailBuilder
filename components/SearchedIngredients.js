import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Layout,
  Input,
  List,
  ListItem,
  Button,
  Icon
} from '@ui-kitten/components';


const data = new Array(60).fill({
  title: 'Title for Item',
});

const AddedIcon = (style) => (
    <Icon {...style} name='plus-circle-outline' />
  );

const QuestionIcon = (style) => (
    <Icon {...style} name='question-mark-circle-outline' />
  );

const SearchIcon = (style) => (
    <Icon {...style} name='search-outline' />
  );


const IngredientScreen = () => {

  const [inputValue, setInputValue] = React.useState('');

  const renderItemAccessory = (style) => (
    <>
    <Button 
      appearance='ghost'
      status='basic' 
      style={style} 
      icon={QuestionIcon}
    />
    <Button 
      style={style} 
      icon={AddedIcon}
    >
      ADD
    </Button>
    </>
  );
  
  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      accessory={renderItemAccessory}
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
        style={styles.list}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  list:{
    paddingBottom: 200, // fix list unvisitable bug
  }
});

export default IngredientScreen;
import React from 'react';
import { StyleSheet, ScrollView} from 'react-native';
import {
  Layout,
  Input,
  List,
  Button,
  Icon
} from '@ui-kitten/components';
import ListItem from '../components/listItem';
import {
  SearchIcon
  } from '../components/Icons'; 

const data = new Array(3).fill({
  title: 'Title for Item',
});



const IngredientScreen = () => {

  const [inputValue, setInputValue] = React.useState('');

  return (
    <Layout level='2' style={styles.scrollContainer}>
      <ScrollView>
          <Layout style={styles.container} level='2'>
            <Input
              placeholder='Search'
              value={inputValue}
              onChangeText={setInputValue}
              icon={SearchIcon}
            />
          </Layout>
          {data.map(ListItem(true))}
      </ScrollView>
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

export default IngredientScreen;
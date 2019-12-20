import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Layout,
} from '@ui-kitten/components';
import ListItem from '../components/listItem';
 

const data = new Array(3).fill({
  title: 'Title for Item',
});


const AddedIngredients= ({ navigation }) => {

  
  return (
    <Layout level='2' style={styles.scrollContainer}>
      <ScrollView>
          {(data.length === 0)? (
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text category='h1'>
                No Added Ingredients
              </Text>
            </Layout>
          ): (
            data.map(ListItem(true, true))
          )}
      </ScrollView>
    </Layout>
  )
}



const styles = StyleSheet.create({
  scrollContainer:{
    height: '100%',
  }
});

export default AddedIngredients;
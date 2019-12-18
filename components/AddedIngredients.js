import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  Layout,
  Icon,
  Button,
  List,
  ListItem
} from '@ui-kitten/components';

const data = new Array(5).fill({
  title: 'Title for Item',
});
const RemoveIcon = (style) => (
    <Icon {...style} name='minus-circle-outline' />
  );

const QuestionIcon = (style) => (
    <Icon {...style} name='question-mark-circle-outline' />
  );

const AddedIngredients= ({ navigation }) => {

 const renderItemAccessory = (style) => (
  <>
    <Button 
      appearance='ghost'
      status='basic'
      style={style}
      icon={QuestionIcon}
    />
    <Button 
      {...style}
      status='danger'
      icon={RemoveIcon}
    >
      Remove
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
      {(data.length === 0)? (
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text category='h1'>
            No Added Ingredients
          </Text>
        </Layout>
      ): (
        <List
          data={data}
          renderItem={renderItem}
        />
      )}
    </>
  )
}



const styles = StyleSheet.create({
});

export default AddedIngredients;
import React from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';
import {
    Text,
    Layout,
    Button,
  } from '@ui-kitten/components';
import {
    RemoveIcon,
    QuestionIcon,
    AddedIcon,
    HeartIcon,
    HeartOutlineIcon
} from './Icons';

const ListItemComponent = (ingredients = false, added=false, fav=false , onLongPress={}, onPressOut={}) => {
    if (ingredients) {
        return (item, index) => (
            <Layout key={index} style={styles.lisItem}>
              <Layout style={styles.container}>
                  <Layout style={styles.layoutButton}>
                  <Button
                      style={styles.Button}
                      appearance='ghost'
                      status='basic'
                      icon={QuestionIcon}
                  />
                  </Layout>
                  <Layout style={styles.layoutTittle}>
                  <Text>
                      {`${item.title} ${index + 1}`}
                  </Text>
                  </Layout>
                  <Layout style={styles.layoutButton}>
                  {added?(
                      <Button 
                      style={styles.Button}
                      appearance='ghost'
                      status='danger'
                      icon={RemoveIcon}
                  />
                  ):(
                      <Button 
                      icon={AddedIcon}
                  />  
                  )}
                  </Layout>
              </Layout>
            </Layout>
        );
    } else {
        return (item, index) => {
          return(
            <Layout key={index} style={styles.lisItem}>
              <TouchableOpacity 
                onLongPress={onLongPress}
              >
                <Layout style={styles.container}>
                    <Layout style={styles.layoutTittle}>
                      
                        <Text>
                          {item.title}
                        </Text>
                        <Text appearance='hint'>
                          {item.description}
                        </Text>
                      </Layout>
                    <Layout style={styles.layoutButton}>
                    <Button
                        appearance='ghost'
                        status='danger'
                        icon={fav? HeartIcon : HeartOutlineIcon}
                    />
                    </Layout>
                </Layout>
                </TouchableOpacity>
            </Layout>
        )};
    } 
}


const styles = StyleSheet.create({
    lisItem:{
      marginBottom: 8,
      marginTop: 8,
      marginHorizontal: 8,
      padding: 8,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
    container: {
      paddingHorizontal: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      },
    layoutButton: {
      paddingHorizontal: 0,
      flex: 1,
      justifyContent: 'flex-start',
    },
    layoutTittle: {
      paddingHorizontal: 0,
      justifyContent: 'center',
      flex: 4
    },
    Button: {
      paddingRight: 0,
      paddingLeft: 0,
      marginLeft: 0,
      marginRight: 0,
      margin: 0,
    }
  });

export default ListItemComponent;

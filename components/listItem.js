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
import * as Animatable from 'react-native-animatable';

const ListItemComponent = (constArgs) => {
    const {
      ingredients,
      added,
      fav,
      onLongPress,
      onMainButtonPress,
      onPress,
    } = {
      ingredients:false,
      added:false,
      fav:false,
      onLongPress:{},
      onMainButtonPress:{},
      onPress:{},
      ...constArgs
    };

    if (ingredients) {
        return (item, index) => {
          let handleViewRef;

          return (
            <Animatable.View key={index} ref={ ref => handleViewRef = ref}>
              <Layout style={styles.lisItem}>
                <TouchableOpacity 
                    onPress={onPress}
                  >
                  <Layout style={styles.container}>
                      <Layout style={styles.layoutTittle}>
                      <Text>
                          {`${item.title} ${index + 1}`}
                      </Text>
                      </Layout>
                      <Layout style={styles.layoutButton}>
                      {added?(
                          <Button 
                            appearance='ghost'
                            status='danger'
                            icon={RemoveIcon}
                            onPress={() => onMainButtonPress(handleViewRef)}
                        />
                      ):(
                          <Button
                          status='info'
                          icon={AddedIcon}
                          onPress={() => onMainButtonPress(handleViewRef)}
                      >Add</Button>  
                      )}
                      </Layout>
                  </Layout>
                </TouchableOpacity>
              </Layout>
            </Animatable.View>
        )};
    } else {
        return (item, index) => {

          let handleViewRef;

          return(

            <Animatable.View key={index} ref={ ref => handleViewRef = ref}>
              <Layout style={styles.lisItem}>
                <TouchableOpacity 
                  onLongPress={onLongPress}
                  onPress={onPress}
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
                            onPress={() => onMainButtonPress(handleViewRef)}
                        />
                        </Layout>
                    </Layout>
                </TouchableOpacity>
              </Layout>
            </Animatable.View>
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
      flex: 2,
      justifyContent: 'flex-start',
    },
    layoutTittle: {
      paddingHorizontal: 0,
      justifyContent: 'center',
      flex: 4
    },
  });

export default ListItemComponent;

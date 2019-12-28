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
            <Animatable.View key={item.ID || index} ref={ ref => handleViewRef = ref}>
              <Layout style={styles.lisItem}>
                <TouchableOpacity 
                    onPress={() => onPress(item)}
                  >
                  <Layout style={styles.container}>
                      <Layout style={styles.layoutTittle}>
                        <Text>
                            {item.Name}
                        </Text>
                        <Text appearance='hint' category='c2'>
                          {item.Popularity} recipes includes 
                        </Text>
                      </Layout>
                      <Layout style={styles.layoutButton}>
                      {added?(
                          <Button 
                            appearance='ghost'
                            status='danger'
                            icon={RemoveIcon}
                            onPress={() => onMainButtonPress(handleViewRef, item)}
                        />
                      ):(
                          <Button
                          status='info'
                          icon={AddedIcon}
                          onPress={() => onMainButtonPress(handleViewRef, item)}
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

            <Animatable.View key={item.CocktailID} ref={ ref => handleViewRef = ref}>
              <Layout style={styles.lisItem}>
                <TouchableOpacity 
                  onLongPress={onLongPress}
                  onPress={() => onPress(item)}
                >
                    <Layout style={styles.container}>
                        <Layout style={styles.layoutTittle}>
                            <Text>
                              {item.CocktailName}
                            </Text>
                            <Text appearance='hint' category='c2'>
                              {item.MissingIngr == 0 ? "You can make it!" : `You need ${item.MissingIngr} ${item.MissingIngr !== 1? 'ingredients': 'ingredient'} more`}
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
      marginBottom: 10,
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

import React from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {
    Text,
    Layout,
    Button,
  } from '@ui-kitten/components';
import {
    RemoveIcon,
    AddedIcon,
    HeartIcon,
    HeartOutlineIcon
} from './Icons';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import {
  AdMobBanner,
} from 'expo-ads-admob'

const unitID =  Platform.OS === 'ios'? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-3940256099942544/6300978111'
const ListItemComponent = (constArgs) => {
    const {
      ingredients,
      added,
      fav,
      onLongPress,
      onMainButtonPress,
      onPress,
      favsID,
    } = {
      ingredients:false,
      added:false,
      fav:false,
      onLongPress:{},
      onMainButtonPress:{},
      onPress:{},
      favsID: [],
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
                          Used in {item.Popularity == 0? 1: item.Popularity} recipes 
                        </Text>
                      </Layout>
                      <Layout style={styles.layoutButton}>
                      {added?(
                          <Button 
                            status='danger'
                            icon={RemoveIcon}
                            onPress={() => onMainButtonPress(handleViewRef, item)}
                          >Remove</Button>
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
          console.log(item)
          if (item.ad) {
            return (
              <Layout style={styles.ads} key={index}>
                <AdMobBanner
                  bannerSize="mediumRectangle"
                  adUnitID={unitID}
                  servePersonalizedAds={true}
                  testDevices={[AdMobBanner.simulatorId]}
                  onAdFailedToLoad={error => console.error(error)}
                />
              </Layout>
            );
          } else {
            let handleViewRef;
            return(

              <Animatable.View key={item.CocktailID} ref={ ref => handleViewRef = ref}>
                <Layout style={styles.lisItem}>
                  <TouchableOpacity 
                    onLongPress={() => onLongPress(item)}
                    onPress={() => onPress(item)}
                  >
                      <Layout style={styles.container}>
                          <Layout style={styles.layoutTittle}>
                              <Text>
                                {item.CocktailName}
                              </Text>
                              <Text appearance='hint' category='c2'>
                                {fav? 
                                  `${item.Ingredients.length != 0? item.Ingredients.length: 1} ${item.Ingredients.length !== 1? 'ingredients': 'ingredient'}` : 
                                  (item.MissingIngr == 0 ? "You can make it!" : (
                                    item.MissingIngr !== undefined ? `You need ${item.MissingIngr} ${item.MissingIngr !== 1? 'ingredients': 'ingredient'} more` :
                                    `${item.TotalIngredients != 0? item.TotalIngredients: 1} ${item.TotalIngredients !== 1? 'ingredients': 'ingredient'}`
                                  ))}
                              </Text>
                            </Layout>
                          <Layout style={styles.layoutButton}>
                          <Button
                              appearance='ghost'
                              status='danger'
                              icon={_.includes(favsID, item.CocktailID)? HeartIcon : HeartOutlineIcon}
                              onPress={() => onMainButtonPress(handleViewRef, item)}
                          />
                          </Layout>
                      </Layout>
                  </TouchableOpacity>
                </Layout>
              </Animatable.View>
          )
          }};
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
    ads: {
      marginVertical: 10,
      justifyContent: 'center',
      textAlign:'center',
      alignItems: 'center',
    }
  });

export default ListItemComponent;

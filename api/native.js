import _ from 'lodash';
import {Share, AsyncStorage} from 'react-native';
import { 
  CACHE_SIGN_IN,
  USER_CACHE_CLEANED,
  USER_CACHE_CLEANED_ERROR
} from '../actions/User';

export default class NativeApi {

    static async ShareLink(item) {
        try {
            const result = await Share.share({
              message:
                `${item.Url}?utm_source=share_recipe&utm_medium=native_app`,
            });
      
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
          } catch (error) {
            alert(error.message);
          }
        };

    static async SaveUser(user) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        // Error saving data
      }
    }

    static async GetUser(dispatch) {
      try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
          dispatch({
            type: CACHE_SIGN_IN,
            data: JSON.parse(value) 
          })
        }
      } catch (error) {
        // Error retrieving data
      }
    };

    static async ClearUserCache(dispatch) {
      try {
        await AsyncStorage.removeItem('user');
          dispatch({
            type: USER_CACHE_CLEANED,  
        })
      } catch (error) {
        dispatch({
          type: USER_CACHE_CLEANED_ERROR,  
      })
      }
    };

}

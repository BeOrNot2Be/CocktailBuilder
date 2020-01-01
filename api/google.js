import { 
    GOOGLE_SIGN_IN,
    GOOGLE_FULL_SIGN_IN
} from '../actions/User';
import _ from 'lodash';
import MainSourceFetch from '../api/web';


import * as Google from 'expo-google-app-auth';


const ConnectionIssue = () => {
  NetInfo.fetch().then(state => {
      if (!state.isConnected) {
          alert('You are not connected to the Internet')
      }
    });
  }
  
  const FetchingIssue = () => {
      alert('Some network issues happened. Check your connection or give us some time to fix issues!')
  }

export default class GoogleApi {

    static async signInWithGoogleAsync(dispatch) {
        try {
          const result = await Google.logInAsync({
            androidClientId: "629930544514-kgpsf2jgqqnijqdscd02k8r9tdc2hqcm.apps.googleusercontent.com",
            iosClientId: "629930544514-a4sin974ddd6nispqjcsvd621fd4g6di.apps.googleusercontent.com",
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            dispatch({
                type:GOOGLE_SIGN_IN,
                data: {accessToken: result.accessToken, refreshToken: result.refreshToken, userInfo: result.user }
            })
          } else {
            console.warn({ cancelled: true });
          }
        } catch (e) {
          FetchingIssue()
          ConnectionIssue()
        }
    }

    static async fullSignInWithGoogleAsync(dispatch) {
        try {
          const result = await Google.logInAsync({
            androidClientId: "629930544514-kgpsf2jgqqnijqdscd02k8r9tdc2hqcm.apps.googleusercontent.com",
            iosClientId: "629930544514-a4sin974ddd6nispqjcsvd621fd4g6di.apps.googleusercontent.com",
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            dispatch({
                type:GOOGLE_FULL_SIGN_IN,
                data: {accessToken: result.accessToken, refreshToken: result.refreshToken, userInfo: result.user }
            })
            MainSourceFetch.getToken(result.user.email, dispatch)
          } else {
            console.warn({ cancelled: true });
          }
        } catch (e) {
          FetchingIssue()
          ConnectionIssue()
        }
    }
      

}

import { APPLE_FULL_SIGN_IN } from "../actions/User";
import * as AppleAuthentication from 'expo-apple-authentication';
import NetInfo from "@react-native-community/netinfo";
import MainSourceFetch from "./web";

const ConnectionIssue = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        alert("You are not connected to the Internet");
      }
    });
  };

export default class AppleApi {

    static async fullSignInWithAppleAsync(dispatch, callback = null) {

        try {
            const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
            });
            dispatch({
                type: APPLE_FULL_SIGN_IN,
                data: {
                identityToken: credential.identityToken,
                authorizationCode: credential.authorizationCode,
                userInfo: { 
                    name: `${credential.givenName} ${credential.familyName}` || credential.nickname,
                    photoUrl:"https://user-images.githubusercontent.com/33556915/98438942-be093f80-20a2-11eb-8553-6650a4159f39.png"
                },
            }
            });
            console.log(credential);
            console.log(credential.email);
            MainSourceFetch.getToken(credential.email, dispatch);
            if (callback) callback();
        } catch (e) {
            console.warn(e);
            ConnectionIssue();
        }
    }
}
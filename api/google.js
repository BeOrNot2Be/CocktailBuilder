/** @format */

import * as Google from "expo-google-app-auth";
import NetInfo from "@react-native-community/netinfo";
import { GOOGLE_SIGN_IN, GOOGLE_FULL_SIGN_IN } from "../actions/User";
import MainSourceFetch from "./web";

const ConnectionIssue = () => {
  NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      alert("You are not connected to the Internet");
    }
  });
};

const googleSignInConfig = {
  androidClientId:
    "629930544514-kgpsf2jgqqnijqdscd02k8r9tdc2hqcm.apps.googleusercontent.com",
  iosClientId:
    "629930544514-a4sin974ddd6nispqjcsvd621fd4g6di.apps.googleusercontent.com",
  androidStandaloneAppClientId:
    "629930544514-18gq8qeqe7kaim1eeh5mj4od7nkkam9r.apps.googleusercontent.com",
  iosStandaloneAppClientId:
    "629930544514-v103mmj4n0v86mg6sv448etsvfgc9v01.apps.googleusercontent.com",
  scopes: ["profile", "email"]
};

export default class GoogleApi {
  static async signInWithGoogleAsync(dispatch) {
    // for further development
    try {
      const result = await Google.logInAsync(googleSignInConfig);

      if (result.type === "success") {
        dispatch({
          type: GOOGLE_SIGN_IN,
          data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            userInfo: result.user
          }
        });
      } else {
        console.warn({ cancelled: true });
      }
    } catch (e) {
      ConnectionIssue();
    }
  }

  static async fullSignInWithGoogleAsync(dispatch, callback = null) {
    try {
      const result = await Google.logInAsync(googleSignInConfig);

      if (result.type === "success") {
        dispatch({
          type: GOOGLE_FULL_SIGN_IN,
          data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            userInfo: result.user
          }
        });
        MainSourceFetch.getToken(result.user.email, dispatch);
        if (callback) callback();
      } else {
        console.warn({ cancelled: true });
      }
    } catch (e) {
      console.warn(e);
      ConnectionIssue();
    }
  }
}

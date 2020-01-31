/** @format */

import PropTypes from "prop-types";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import * as firebase from "firebase";
import AppComponent from "./AppComponent";
import store from "./store";
import { firebaseConfig } from "./constants/ApiKeys";

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/btn_google_signin_dark_normal_web.png")
    ]),
    Asset.loadAsync([
      require("./assets/images/btn_google_signin_light_normal_web.png")
    ]),
    Asset.loadAsync([require("./assets/images/icon.png")]),
    Font.loadAsync({
      ...Ionicons.font,
      roboto: require("./assets/fonts/Roboto-Regular.ttf")
    })
  ]);
}

export default function App({ skipLoadingScreen }) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  if (!isLoadingComplete && !skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  }
  return (
    <Provider store={store}>
      <AppComponent />
    </Provider>
  );
}

App.propTypes = {
  skipLoadingScreen: PropTypes.any
};

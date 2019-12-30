import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AppComponent from './AppComponent';
import reducer from './reducers/MainReducer';


const store = createStore(reducer);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <Provider store={ store }>
        <AppComponent/>
      </Provider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/avatar.jpg'),
      require('./assets/images/icon.png'),
    ]),
    Font.loadAsync({
      ...Ionicons.font,
      'roboto': require('./assets/fonts/Roboto-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}


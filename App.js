import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { 
  ApplicationProvider,
  IconRegistry,
} from '@ui-kitten/components';
import { mapping, dark, light } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { IonicIconsPack } from './ionic-icons';
import AppNavigator from './navigation/Drawer';
import { default as lightTheme } from './themes/custom-theme.json';
import { default as darkTheme } from './themes/night-theme.json';
import { default as customMapping } from './themes/custom-mapping.json';
import { ThemeContext } from './themes/theme-context';
import reducer from './reducers/MainReducer';

const themes = { light:{...light, ...lightTheme}, dark:{...dark, ...darkTheme} };

const store = createStore(reducer);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  const [theme, setTheme] = React.useState('light');
  const currentTheme = themes[theme];

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

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
        <IconRegistry icons={[EvaIconsPack, IonicIconsPack]} />
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <ApplicationProvider
            mapping={mapping}
            theme={currentTheme}
            customMapping={customMapping}
          >
            <AppNavigator />
          </ApplicationProvider>
        </ThemeContext.Provider>
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


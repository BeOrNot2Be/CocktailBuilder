import React from 'react'
import { connect } from 'react-redux'
import { 
  ApplicationProvider,
  IconRegistry,
} from '@ui-kitten/components';
import { mapping, dark, light } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { IonicIconsPack } from './ionic-icons';
import { AppearanceProvider } from 'react-native-appearance';
import AppNavigator from './navigation/Drawer';
import { default as lightTheme } from './themes/custom-theme.json';
import { default as darkTheme } from './themes/night-theme.json';
import { default as customMapping } from './themes/custom-mapping.json';


const themes = { 1:{...light, ...lightTheme}, 0:{...dark, ...darkTheme} };

const AppComponent = ({theme}) => {
    
    return (
        <>
          <IconRegistry icons={[EvaIconsPack, IonicIconsPack]} />
          <AppearanceProvider>
          <ApplicationProvider
            mapping={mapping}
            theme={themes[theme]}
            customMapping={customMapping}
          >
            <AppNavigator />
          </ApplicationProvider>
          </AppearanceProvider>
        </>
    )
}

const mapStateToProps = (state) => ({
    theme: state.user.theme
})

export default connect(mapStateToProps, null)(AppComponent)

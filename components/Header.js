import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import {
  Icon,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back'/>
);

const MenuIcon = (style) => (
  <Icon {...style} name='menu'/>
);

const InfoIcon = (style) => (
  <Icon {...style} name='info'/>
);

const LogoutIcon = (style) => (
  <Icon {...style} name='log-out'/>
);

const Header = (props) => {
  console.warn(props)
  const [menuVisible, setMenuVisible] = React.useState(false);

  const menuData = [
    { title: 'About', icon: InfoIcon },
    { title: 'Logout', icon: LogoutIcon },
  ];

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onMenuItemSelect = (index) => {
    // Handle Item Select

    setMenuVisible(false);
  };

  const renderMenuAction = () => (
    <OverflowMenu
      visible={menuVisible}
      data={menuData}
      onSelect={onMenuItemSelect}
      onBackdropPress={toggleMenu}>
      <TopNavigationAction
        icon={MenuIcon}
        onPress={toggleMenu} // set slider
      />
    </OverflowMenu>
  );

  const onBack = () => {}

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={onBack}/>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        leftControl={renderBackAction()}
        rightControls={renderMenuAction()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
  },
});

export default Header;
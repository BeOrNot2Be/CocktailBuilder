import React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons }  from '@expo/vector-icons';

export const IonicIconsPack = {
  name: 'ionic',
  icons: createIconsMap(),
};

function createIconsMap() {
  return new Proxy({}, {
    get(target, name) {
      return IconProvider(name);
    },
  });
}

const IconProvider = (name) => ({
  toReactElement: (props) => { return IonicIcon({ name, ...props })},
});

function IonicIcon({ name, ...style }) {
  delete style.animation;
  delete style.style; // need to delete because of the bug when custom icon inside some tags 
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
  return (
    <Ionicons name={name} size={height} color={tintColor} style={iconStyle} />
  );
  }
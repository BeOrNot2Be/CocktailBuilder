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
  toReactElement: (props) => IonicIcon({ name, ...props }),
});

function IonicIcon({ name, style }) {
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
  return (
    <Ionicons name={name} size={height} color={tintColor} style={iconStyle} />
  );
  }
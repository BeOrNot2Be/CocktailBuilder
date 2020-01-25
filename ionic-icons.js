/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function IonicIcon({ name, ...style }) {
  delete style.animation;
  delete style.style; // need to delete because of the bug that apers when custom icon inside some tags
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
  return (
    <Ionicons name={name} size={height} color={tintColor} style={iconStyle} />
  );
}

IonicIcon.propTypes = {
  name: PropTypes.any,
  style: PropTypes.any
};

const IconProvider = name => ({
  toReactElement: props => {
    return IonicIcon({ name, ...props });
  }
});

function createIconsMap() {
  return new Proxy(
    {},
    {
      get(target, name) {
        return IconProvider(name);
      }
    }
  );
}

export const IonicIconsPack = {
  name: "ionic",
  icons: createIconsMap()
};

/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function MaterialCommunityIcon({ name, ...style }) {
  delete style.animation;
  delete style.style; // need to delete because of the bug that apers when custom icon inside some tags
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
  return (
    <MaterialCommunityIcons
      name={name}
      size={height}
      color={tintColor}
      style={iconStyle}
    />
  );
}

MaterialCommunityIcon.propTypes = {
  name: PropTypes.any,
  style: PropTypes.any
};

const IconProvider = name => ({
  toReactElement: props => {
    return MaterialCommunityIcon({ name, ...props });
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

export const MaterialCommunityIconsPack = {
  name: "material",
  icons: createIconsMap()
};

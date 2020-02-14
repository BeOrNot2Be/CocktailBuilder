/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, Layout, Button } from "@ui-kitten/components";
import * as Animatable from "react-native-animatable";
import { RemoveIcon } from "./Icons";

const styles = StyleSheet.create({
  lisItem: {
    marginBottom: 10,
    marginTop: 8,
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  container: {
    paddingHorizontal: 0,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  layoutButton: {
    paddingHorizontal: 0,
    flex: 2,
    justifyContent: "flex-start"
  },
  layoutTittle: {
    paddingHorizontal: 0,
    justifyContent: "center",
    flex: 4
  }
});

const IngredientItem = React.memo(({ item, onMainButtonPress, onPress }) => {
  let handleViewRef;
  return (
    <Animatable.View
      ref={ref => {
        handleViewRef = ref;
      }}
    >
      <Layout style={styles.lisItem}>
        <TouchableOpacity onPress={() => onPress(item)}>
          <Layout style={styles.container}>
            <Layout style={styles.layoutTittle}>
              <Text>{item.Name}</Text>
              <Text appearance="hint" category="c2">
                Used in {item.Popularity == 0 ? 1 : item.Popularity}{" "}
                {item.Popularity < 2 ? "recipe" : "recipes"}
              </Text>
            </Layout>
            <Layout style={styles.layoutButton}>
              <Button
                status="danger"
                icon={RemoveIcon}
                onPress={() => onMainButtonPress(handleViewRef, item)}
              >
                Remove
              </Button>
            </Layout>
          </Layout>
        </TouchableOpacity>
      </Layout>
    </Animatable.View>
  );
});

IngredientItem.propTypes = {
  item: PropTypes.any,
  onMainButtonPress: PropTypes.any,
  onPress: PropTypes.any
};

export default IngredientItem;

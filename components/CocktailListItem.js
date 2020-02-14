/** @format */
/* eslint-disable no-else-return */

import React from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Layout, Button } from "@ui-kitten/components";
import * as Animatable from "react-native-animatable";
import { AdMobBanner } from "expo-ads-admob";
import { HeartIcon, HeartOutlineIcon } from "./Icons";

const unitID =
  Platform.OS === "ios"
    ? "ca-app-pub-4338763897925627/6432597471"
    : "ca-app-pub-4338763897925627/8128822528";

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
  },
  ads: {
    marginVertical: 10,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  }
});

const ListItemComponent = React.memo(
  ({ item, onLongPress, onPress, onMainButtonPress, favsID }) => {
    if (item.ad) {
      return (
        <Layout style={styles.ads}>
          <AdMobBanner
            bannerSize="mediumRectangle"
            adUnitID={unitID}
            servePersonalizedAds
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={error => console.error(error)}
          />
        </Layout>
      );
    } else {
      let handleViewRef;
      return (
        <Animatable.View
          ref={ref => {
            handleViewRef = ref;
          }}
        >
          <Layout style={styles.lisItem}>
            <TouchableOpacity
              onLongPress={() => onLongPress(item)}
              onPress={() => onPress(item)}
            >
              <Layout style={styles.container}>
                <Layout style={styles.layoutTittle}>
                  <Text>{item.CocktailName}</Text>
                  <Text appearance="hint" category="c2">
                    {item.MissingIngr == 0
                      ? "You can make it!"
                      : item.MissingIngr !== undefined
                      ? `You need ${item.MissingIngr} more ${
                          item.MissingIngr !== 1 ? "ingredients" : "ingredient"
                        }`
                      : `${
                          item.TotalIngredients != 0 ? item.TotalIngredients : 1
                        } ${
                          item.TotalIngredients !== 1
                            ? "ingredients"
                            : "ingredient"
                        }`}
                  </Text>
                </Layout>
                <Layout style={styles.layoutButton}>
                  <Button
                    appearance="ghost"
                    status="danger"
                    icon={
                      favsID.indexOf(item.CocktailID) !== -1
                        ? HeartIcon
                        : HeartOutlineIcon
                    }
                    onPress={() => onMainButtonPress(handleViewRef, item)}
                  />
                </Layout>
              </Layout>
            </TouchableOpacity>
          </Layout>
        </Animatable.View>
      );
    }
  }
);

ListItemComponent.propTypes = {
  item: PropTypes.any,
  onMainButtonPress: PropTypes.any,
  onPress: PropTypes.any,
  favsID: PropTypes.any,
  onLongPress: PropTypes.any
};

export default ListItemComponent;

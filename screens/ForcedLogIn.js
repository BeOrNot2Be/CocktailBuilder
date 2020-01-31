/** @format */

import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  SafeAreaView
} from "react-native";
import { Card, Text } from "@ui-kitten/components";
import RealGoogleButton from "../components/GoogleButton";

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%"
  },
  cardContainer: {
    maxWidth: "100%",
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 8,
    borderRadius: 10,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  Backdrop: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cardMainText: {
    textAlign: "center"
  }
});

const ForceLogInModal = ({ navigation }) => {
  const Footer = () => (
    <View style={styles.footerContainer}>
      <RealGoogleButton />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View style={styles.Backdrop}>
        <SafeAreaView>
          <View style={styles.cardContainer}>
            <Card footer={Footer} style={styles.card}>
              <Text style={styles.cardMainText} category="h2">
                Please Sign In to add sixth ingredient
              </Text>
            </Card>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

ForceLogInModal.propTypes = {
  navigation: PropTypes.any
};

export default ForceLogInModal;

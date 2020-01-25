/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text, Layout, Avatar, Toggle, Divider } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { connect } from "react-redux";
import { LOG_OUT, TOGGLE_THEME } from "../actions/User";
import NativeApi from "../api/native";
import GoogleApi from "../api/google";

const styles = StyleSheet.create({
  drawerContainer: {
    flexDirection: "column",
    flex: 1
  },
  headerContainer: {
    flex: 4
  },
  gradient: {
    height: "100%"
  },
  boxHeader: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  avatarContainer: {
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  circle: {
    width: 100,
    height: 100
  },
  middleContainer: {
    flex: 9
  },
  footerContainer: {
    flex: 3
  },
  boxFooter: {
    flex: 2,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  LogOutButton: {
    width: "100%",
    alignItems: "center"
  },
  center: {
    justifyContent: "center",
    textAlign: "center"
  }
});

const UserScreen = ({ navigation, user, toggleTheme, LogOut, googleLogin }) => {
  return (
    <Layout style={styles.drawerContainer}>
      <Layout style={styles.headerContainer}>
        <TouchableOpacity
          onPress={user.logged ? () => {} : () => googleLogin()}
        >
          <LinearGradient
            start={[0, 0.5]}
            colors={["#0BAB64", "#3BB78F"]}
            style={styles.gradient}
          >
            <Layout style={styles.boxHeader}>
              {user.logged ? (
                <>
                  <Layout style={styles.avatarContainer}>
                    <Avatar
                      style={styles.circle}
                      shape="rounded"
                      source={{ uri: user.userInfo.photoUrl }}
                    />
                  </Layout>
                  <Text category="h6">{user.userInfo.name}</Text>
                </>
              ) : (
                <>
                  <Layout style={styles.avatarContainer}>
                    <Avatar
                      style={styles.circle}
                      shape="rounded"
                      source={require("../assets/images/icon.png")}
                    />
                  </Layout>
                  <Text category="h6">Cocktail Builder</Text>
                </>
              )}
            </Layout>
          </LinearGradient>
        </TouchableOpacity>
      </Layout>
      <Layout style={styles.middleContainer} level="2" />
      <Layout style={styles.footerContainer}>
        <Layout style={{ ...styles.boxFooter, alignItems: "flex-end" }}>
          <Toggle
            text="Theme"
            status="basic"
            checked={!!user.theme}
            onChange={toggleTheme}
          />
        </Layout>
        <Divider />
        <Layout style={styles.boxFooter}>
          <TouchableOpacity
            style={styles.LogOutButton}
            onPress={() =>
              Alert.alert(
                "Alert",
                "Are you sure that you wanna sign out?",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => LogOut(navigation) }
                ],
                { cancelable: false }
              )
            }
          >
            <Text status="danger">Log Out</Text>
          </TouchableOpacity>
        </Layout>
        <Layout style={{ flex: 1 }}>
          <Text style={styles.center} appearance="hint">
            powered by cocktailbuilder.com 2019
          </Text>
        </Layout>
      </Layout>
    </Layout>
  );
};

UserScreen.propTypes = {
  LogOut: PropTypes.any,
  navigation: PropTypes.any,
  toggleTheme: PropTypes.any,
  user: PropTypes.any,
  googleLogin: PropTypes.any
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => ({
  toggleTheme: () => dispatch({ type: TOGGLE_THEME }),
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  LogOut: navigation => {
    NativeApi.ClearUserCache(dispatch);
    dispatch({ type: LOG_OUT });
    navigation.navigate("Home");
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);

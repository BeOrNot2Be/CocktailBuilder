/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { Layout } from "@ui-kitten/components";
import { connect } from "react-redux";
import GoogleApi from "../api/google";

const styles = StyleSheet.create({
  buttonLayout: {
    marginTop: 10,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  button: {
    width: 191,
    height: 46,
    resizeMode: "stretch"
  }
});

const GoogleButton = ({ theme, googleLogin }) => {
  return (
    <Layout style={styles.buttonLayout}>
      <TouchableOpacity onPress={() => googleLogin()}>
        {theme ? (
          <Image
            style={styles.button}
            source={require("../assets/images/btn_google_signin_light_normal_web.png")}
          />
        ) : (
          <Image
            style={styles.button}
            source={require("../assets/images/btn_google_signin_dark_normal_web.png")}
          />
        )}
      </TouchableOpacity>
    </Layout>
  );
};

GoogleButton.propTypes = {
  theme: PropTypes.any,
  googleLogin: PropTypes.any
};

const mapStateToProps = state => {
  return {
    theme: !!state.user.theme
  };
};

const mapDispatchToProps = dispatch => ({
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GoogleButton);

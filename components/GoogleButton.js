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

const GoogleButton = ({ theme, googleLogin, callback }) => {
  return (
    <Layout style={styles.buttonLayout}>
      <TouchableOpacity onPress={() => googleLogin(callback)}>
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
  googleLogin: PropTypes.any,
  callback: PropTypes.any
};

const mapStateToProps = (state, ownProps) => {
  return {
    theme: !!state.user.theme,
    callback: ownProps.callback || null
  };
};

const mapDispatchToProps = dispatch => ({
  googleLogin: callback =>
    GoogleApi.fullSignInWithGoogleAsync(dispatch, callback)
});

export default connect(mapStateToProps, mapDispatchToProps)(GoogleButton);

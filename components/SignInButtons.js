/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import * as AppleAuthentication from 'expo-apple-authentication';
import { Layout } from "@ui-kitten/components";
import { connect } from "react-redux";
import GoogleApi from "../api/google";
import AppleApi from "../api/apple";

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

const SignInButtons = ({ theme, googleLogin, appleLogin, callback }) => {
  return (
    <>
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

      <Layout style={styles.buttonLayout}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={theme ? AppleAuthentication.AppleAuthenticationButtonStyle.BLACK : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={5}
          style={styles.button}
        onPress={() => {

          try {
            const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
            });
            // dispatch({
            //     type: APPLE_FULL_SIGN_IN,
            //     data: {
            //     identityToken: credential.identityToken,
            //     authorizationCode: credential.authorizationCode,
            //     userInfo: { 
            //         name: `${credential.givenName} ${credential.familyName}` || credential.nickname,
            //         photoUrl:"https://user-images.githubusercontent.com/33556915/98438942-be093f80-20a2-11eb-8553-6650a4159f39.png"
            //     },
            // }
            // });
            console.log(credential);
            console.log(credential.email);
            // MainSourceFetch.getToken(credential.email, dispatch);
            // if (callback) callback();
          } catch (e) {
              console.warn(e);
          }
        }}
        // } appleLogin(callback)}
        />
      </Layout>
  </>
  );
};

SignInButtons.propTypes = {
  theme: PropTypes.any,
  googleLogin: PropTypes.any,
  appleLogin: PropTypes.any,
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
    GoogleApi.fullSignInWithGoogleAsync(dispatch, callback),
  appleLogin: callback =>
    AppleApi.fullSignInWithAppleAsync(dispatch, callback),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInButtons);

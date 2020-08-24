/** @format */

import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  Easing,
  Animated,
  Dimensions,
  ScrollView,
  Linking,
  Platform
} from "react-native";
import { createDrawerNavigator } from "react-navigation-drawer";
import {
  Avatar,
  Toggle,
  Layout,
  Text,
  Divider,
  Button
} from "@ui-kitten/components";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import UserScreen from "../screens/UserScreen";
import RecipeModalScreen from "../screens/RecipeModalScreen";
import MainTabNavigator from "./MainTabNavigator";
import { HomeIcon, LogOutIcon, LogInIcon } from "../components/Icons";
import { LOG_OUT, TOGGLE_THEME } from "../actions/User";
import GoogleApi from "../api/google";
import NativeApi from "../api/native";

const styles = StyleSheet.create({
  drawerContainer: {
    flexDirection: "column",
    height: Dimensions.get("window").height
  },
  headerContainer: {
    flex: 4
  },
  middleContainer: {
    flex: 9
  },
  footerContainer: {
    flex: 3
  },
  center: {
    justifyContent: "center",
    textAlign: "center"
  },
  container: {
    flexDirection: "row"
  },
  box: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  boxHeader: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  boxFooter: {
    flex: 2,
    justifyContent: "center",
    textAlign: "center"
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
  gradient: {
    height: "100%"
  },
  LogButtonText: {
    paddingHorizontal: 0,
    paddingVertical: 16
  },
  layoutTittle: {
    padding: 16,
    flex: 4,
    justifyContent: "flex-start"
  },
  listItemContainer: {
    paddingHorizontal: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  listItemIcon: {
    flex: 1,
    justifyContent: "flex-start"
  },
  LinkPageButton: {},
  logButton: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  }
});

const DrawerComponent = ({
  navigation,
  user,
  LogOut,
  googleLogin,
  toggleTheme,
  initUser,
  searchedIngredients
}) => {
  const [route, setRoute] = React.useState(
    navigation.state.routes[0].routeName
  );
  if (searchedIngredients.length != 0) {
    if (user.userInfo === undefined) {
      initUser();
    }
  }

  const logoutAlert = () => {
    Alert.alert(
      "Alert",
      "Are you sure that you wanna sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Yes", onPress: () => LogOut() }
      ],
      { cancelable: false }
    );
  };

  const mailLink = `mailto:alex@cocktailbuilder.com?subject=CocktailBuilder%20${Platform.OS}%20app%20feedback`;

  const openFeedbackSendPopup = () => {
    Linking.canOpenURL(mailLink).then(supported => {
      if (supported) {
        Linking.openURL(mailLink);
      }
    });
  };

  const openBlogWebPage = () => {
    Linking.openURL("https://blog.cocktailbuilder.com/");
  };

  const onSelect = index => {
    const { [index]: selectedTabRoute } = navigation.state.routes;
    navigation.navigate(selectedTabRoute.routeName);
    setRoute(selectedTabRoute.routeName);
    navigation.closeDrawer();
  };

  const Pages = [{ title: "Home", icon: HomeIcon }];

  const PagesListRenderItem = (item, index) => {
    return (
      <Layout key={index}>
        <TouchableOpacity onPress={() => onSelect(index)}>
          <Layout style={styles.listItemContainer}>
            <Layout
              style={styles.listItemIcon}
              level={route == item.title ? "3" : "2"}
            >
              <Button
                icon={item.icon}
                status={route == item.title ? "primary" : "basic"}
                appearance="ghost"
              />
            </Layout>
            <Layout
              style={styles.layoutTittle}
              level={route == item.title ? "3" : "2"}
            >
              <Text category={route == item.title ? "label" : "c2"}>
                {item.title}
              </Text>
            </Layout>
          </Layout>
        </TouchableOpacity>
        <Divider />
      </Layout>
    );
  };

  return (
    <Layout style={styles.drawerContainer}>
      <Layout style={styles.headerContainer}>
        <TouchableOpacity
          onPress={user.logged ? () => onSelect(1) : () => googleLogin()}
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
      <Layout style={styles.middleContainer} level="2">
        <ScrollView>
          {Pages.map((page, i) => PagesListRenderItem(page, i))}
          <Divider />
          <TouchableOpacity onPress={openFeedbackSendPopup}>
            <Layout style={styles.layoutTittle} level="2">
              <Text category="label" appearance="hint">
                Feedback
              </Text>
            </Layout>
          </TouchableOpacity>
          <TouchableOpacity onPress={openBlogWebPage}>
            <Layout style={styles.layoutTittle} level="2">
              <Text category="label" appearance="hint">
                Blog
              </Text>
            </Layout>
          </TouchableOpacity>
        </ScrollView>
      </Layout>
      <Layout style={styles.footerContainer}>
        <Divider />
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
          <TouchableOpacity onPress={user.logged ? logoutAlert : googleLogin}>
            <Layout style={styles.logButton}>
              <Text
                style={styles.LogButtonText}
                status={user.logged ? "danger" : "info"}
              >
                {user.logged ? "Log Out" : "Log In"}
              </Text>

              <Button
                status={user.logged ? "danger" : "info"}
                appearance="ghost"
                icon={user.logged ? LogOutIcon : LogInIcon}
              />
            </Layout>
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

DrawerComponent.propTypes = {
  LogOut: PropTypes.any,
  googleLogin: PropTypes.any,
  initUser: PropTypes.any,
  navigation: PropTypes.any,
  searchedIngredients: PropTypes.any,
  toggleTheme: PropTypes.any,
  user: PropTypes.any
};

const mapStateToProps = state => {
  return {
    user: state.user,
    searchedIngredients: state.ingredients.searchedIngredients
  };
};

const mapDispatchToProps = dispatch => ({
  LogOut: () => {
    NativeApi.ClearUserCache(dispatch);
    dispatch({ type: LOG_OUT });
  },
  googleLogin: () => GoogleApi.fullSignInWithGoogleAsync(dispatch),
  toggleTheme: () => dispatch({ type: TOGGLE_THEME }),
  initUser: () => NativeApi.GetUser(dispatch)
});

const DrawerNavigator = createDrawerNavigator(
  {
    Home: createStackNavigator(
      {
        content: MainTabNavigator,
        modal: { screen: RecipeModalScreen }
      },
      {
        headerMode: "none",
        mode: "modal",
        initialRouteName: "content",
        transparentCard: true,
        cardShadowEnabled: false,
        defaultNavigationOptions: {
          gesturesEnabled: false
        },
        transitionConfig: () => ({
          transitionSpec: {
            duration: 250,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true
          },
          screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const thisSceneIndex = scene.index;

            const height = layout.initHeight;
            const translateY = position.interpolate({
              inputRange: [
                thisSceneIndex - 1,
                thisSceneIndex,
                thisSceneIndex + 1
              ],
              outputRange: [height, 0, 0]
            });

            const opacity = position.interpolate({
              inputRange: [
                thisSceneIndex - 1,
                thisSceneIndex,
                thisSceneIndex + 1
              ],
              outputRange: [1, 1, 0.5]
            });

            return { opacity, transform: [{ translateY }] };
          }
        })
      }
    ),
    User: {
      screen: UserScreen
    }
  },
  {
    contentComponent: connect(
      mapStateToProps,
      mapDispatchToProps
    )(DrawerComponent),
    drawerPosition: "right",
    drawerOpenRoute: "Drawer",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle"
  }
);

export default DrawerNavigator;

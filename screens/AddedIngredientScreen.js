/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, ScrollView } from "react-native";
import { Button, Layout } from "@ui-kitten/components";
import { connect } from "react-redux";
import _ from "lodash";
import ListItem from "../components/listItem";
import MainSourceFetch from "../api/web";
import {
  REMOVE_INGREDIENT_FROM_SEARCH_BY,
  ADDED_CHECK_MAP_UPDATE
} from "../actions/Ingredients";
import { ForwardIcon } from "../components/Icons";
import RealGoogleButton from "../components/GoogleButton";

const styles = StyleSheet.create({
  scrollContainer: {
    height: "100%"
  },
  button: {},
  buttonContainer: {
    margin: 20,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  }
});

const AddedIngredients = ({
  navigation,
  addedIngredients,
  getCocktailsByIngredients,
  removeIngredient,
  setAdded,
  user
}) => {
  const openIngredient = () => {
    navigation.push("Ingredient");
  };

  getCocktailsByIngredients(addedIngredients);

  const removeIngredientToList = (ref, item) => {
    removeIngredient(item);
    setAdded(item.ID);
  };

  const listConfig = {
    ingredients: true,
    added: true,
    onPress: openIngredient,
    onMainButtonPress: removeIngredientToList
  };

  return (
    <Layout level="2" style={styles.scrollContainer}>
      <ScrollView>
        {addedIngredients.length === 0 ? (
          <></>
        ) : (
          <>
            {_.sortBy(addedIngredients, [item => item.Name]).map(
              ListItem(listConfig)
            )}
          </>
        )}
        {user.logged ? (
          <></>
        ) : (
          <Layout level="2" style={styles.buttonContainer}>
            <RealGoogleButton />
          </Layout>
        )}
        <Layout level="2" style={styles.buttonContainer}>
          <Button
            style={styles.button}
            icon={ForwardIcon}
            onPress={() => navigation.navigate("Searched", { focus: true })}
          >
            Add my ingredients
          </Button>
        </Layout>
        <Layout level="2" style={{ height: 80 }} />
      </ScrollView>
    </Layout>
  );
};

AddedIngredients.propTypes = {
  addedIngredients: PropTypes.any,
  getCocktailsByIngredients: PropTypes.any,
  navigation: PropTypes.any,
  removeIngredient: PropTypes.any,
  setAdded: PropTypes.any,
  user: PropTypes.any
};

const mapStateToProps = state => {
  return {
    addedIngredients: state.ingredients.addedIngredients,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => ({
  getCocktailsByIngredients: (addedIngredients, token) =>
    MainSourceFetch.getCocktailsByIngredients(
      addedIngredients,
      dispatch,
      token
    ),
  removeIngredient: item =>
    dispatch({ type: REMOVE_INGREDIENT_FROM_SEARCH_BY, data: item }),
  setAdded: addedID => dispatch({ type: ADDED_CHECK_MAP_UPDATE, data: addedID })
});

export default connect(mapStateToProps, mapDispatchToProps)(AddedIngredients);

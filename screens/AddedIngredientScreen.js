/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, FlatList } from "react-native";
import { Button, Layout } from "@ui-kitten/components";
import { connect } from "react-redux";
import _ from "lodash";
import ListItem from "../components/AddedIngListItem";
import MainSourceFetch from "../api/web";
import { REMOVE_INGREDIENT_FROM_SEARCH_BY } from "../actions/Ingredients";
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
  user
}) => {
  const openIngredient = () => {
    navigation.push("Ingredient");
  };

  getCocktailsByIngredients(addedIngredients);

  const removeIngredientToList = (ref, item) => {
    removeIngredient(item);
  };

  return (
    <Layout level="2" style={styles.scrollContainer}>
      <FlatList
        data={_.sortBy(addedIngredients, [item => item.Name])}
        keyExtractor={item => item.ID.toString()}
        ListFooterComponent={
          <>
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
                onPress={() => {
                  navigation.setParams({ focus: true }); // need to set param twice due to weird bug
                  navigation.navigate("ingredientContent", { focus: true });
                }}
              >
                Add my ingredients
              </Button>
            </Layout>
            <Layout level="2" style={{ height: 80 }} />
          </>
        }
        renderItem={({ item }) => (
          <ListItem
            item={item}
            onMainButtonPress={removeIngredientToList}
            onPress={openIngredient}
          />
        )}
      />
    </Layout>
  );
};

AddedIngredients.propTypes = {
  addedIngredients: PropTypes.any,
  getCocktailsByIngredients: PropTypes.any,
  navigation: PropTypes.any,
  removeIngredient: PropTypes.any,
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
    dispatch({ type: REMOVE_INGREDIENT_FROM_SEARCH_BY, data: item })
});

export default connect(mapStateToProps, mapDispatchToProps)(AddedIngredients);

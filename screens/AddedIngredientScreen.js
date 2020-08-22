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
  background: {
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
  const openIngredient = item => {
    navigation.push("Ingredient", { ingredient: item });
  };

  getCocktailsByIngredients(addedIngredients);

  const removeIngredientToList = (ref, item) => {
    removeIngredient(item, addedIngredients);
  };

  return (
    <Layout level="2" style={styles.background}>
      <FlatList
        data={_.sortBy(addedIngredients, [item => item.Name])}
        keyExtractor={item => item.ID.toString()}
        ListFooterComponent={
          <>
            {/* can't make code make more efficient because of the weird bug after compilation (update in state doesn't update the view ) */}
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
            onPress={() => openIngredient(item)}
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
  removeIngredient: (item, addedIngredients) =>
    dispatch({
      type: REMOVE_INGREDIENT_FROM_SEARCH_BY,
      data: item,
      args: { list: addedIngredients }
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(AddedIngredients);

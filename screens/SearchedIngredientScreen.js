/** @format */

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, FlatList } from "react-native";
import { Layout, Text, Button, Input } from "@ui-kitten/components";
import { connect } from "react-redux";
import { NavigationEvents } from "react-navigation";
import ListItem from "../components/SearchedIngredientItem";
import { SearchIcon } from "../components/Icons";
import {
  ADD_INGREDIENT_TO_SEARCH_BY,
  UNLOGGED_ADD_INGREDIENT_TO_SEARCH_BY
} from "../actions/Ingredients";

let typingTimeout = null;
let searching = true;

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 5
  },
  scrollContainer: {
    height: "100%"
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  textContainer: {
    paddingLeft: 24
  }
});

const IngredientScreen = ({
  navigation,
  searchEngine,
  addIngredient,
  added,
  user,
  unloggedAddIngredient
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const [founded, setFounded] = React.useState([]);
  const [listLengthEnd, setListLengthEnd] = React.useState(20);

  const searchInput = text => {
    clearTimeout(typingTimeout);
    searching = true;
    typingTimeout = setTimeout(() => {
      searching = false;
      setListLengthEnd(10);
      setFounded(
        searchEngine
          .search(text)
          .sort((a, b) => (a.Popularity > b.Popularity ? -1 : 1))
      );
    }, 400);
    setInputValue(text);
  };

  const addIngredientToList = (ref, item) => {
    setInputValue("");
    setFounded([item]);
    if (user.logged) {
      addIngredient(item);
    } else
      unloggedAddIngredient(item, () => navigation.push("forceLogInModal"));
  };

  const openIngredient = item => {
    navigation.push("Ingredient", {
      ingredient: item
    });
  };

  const inputRef = React.useRef();

  return (
    <Layout level="2" style={styles.scrollContainer}>
      <NavigationEvents
        onDidFocus={() => {
          if (navigation.getParam("focus", false)) {
            inputRef.current.focus();
          }
        }}
        onWillBlur={() => {
          navigation.setParams({ focus: false });
          inputRef.current.blur();
        }}
      />
      <FlatList
        data={founded.slice(0, listLengthEnd)}
        keyExtractor={item => item.ID.toString()}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Layout style={styles.container} level="2">
            <Input
              placeholder="Search"
              ref={inputRef}
              autoCorrect={false}
              value={inputValue}
              onChangeText={searchInput}
              icon={SearchIcon}
              caption={
                founded.length !== 0 && inputValue !== ""
                  ? `Found ${founded.length} results`
                  : ""
              }
            />
            {founded.length !== 0 ? (
              <></>
            ) : inputValue !== "" && !searching ? (
              <Layout style={styles.textContainer} level="2">
                <Text category="p2" status="basic">
                  No results found for search: {inputValue}
                </Text>
              </Layout>
            ) : (
              <></>
            )}
          </Layout>
        }
        ListFooterComponent={
          <>
            <Layout level="2" style={styles.buttonContainer}>
              {founded.length > listLengthEnd ? (
                <Button
                  onPress={() => {
                    setListLengthEnd(listLengthEnd + 20);
                  }}
                >
                  Load More
                </Button>
              ) : (
                <></>
              )}
            </Layout>
            <Layout level="2" style={{ height: 80 }} />
          </>
        }
        renderItem={({ item }) => (
          <ListItem
            item={item}
            onMainButtonPress={addIngredientToList}
            onPress={openIngredient}
            added={!!added.get(item.ID)}
          />
        )}
        extraData={added}
      />
    </Layout>
  );
};

IngredientScreen.propTypes = {
  addIngredient: PropTypes.any,
  added: PropTypes.any,
  navigation: PropTypes.any,
  searchEngine: PropTypes.any,
  user: PropTypes.any,
  unloggedAddIngredient: PropTypes.any
};

const mapStateToProps = state => {
  return {
    added: state.ingredients.addedCheck,
    searchEngine: state.ingredients.searchEngine,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => ({
  addIngredient: item =>
    dispatch({ type: ADD_INGREDIENT_TO_SEARCH_BY, data: item }),
  unloggedAddIngredient: (item, openForceLogIn) =>
    dispatch({
      type: UNLOGGED_ADD_INGREDIENT_TO_SEARCH_BY,
      data: item,
      subdatafunc: openForceLogIn
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(IngredientScreen);

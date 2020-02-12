/** @format */

import Fuse from "fuse.js";
import _ from "lodash";
import { loop, Cmd } from "redux-loop";
import {
  SEARCHED_INGREDIENTS,
  ADD_INGREDIENT_TO_SEARCH_BY,
  REMOVE_INGREDIENT_FROM_SEARCH_BY,
  UNLOGGED_ADD_INGREDIENT_TO_SEARCH_BY,
  GET_INVENTORY_INGS
} from "../actions/Ingredients";
import MainSourceFetch from "../api/web";
import GoogleAnalytics from "../api/googleAnalytics";

const BreakException = {};

const options = {
  threshold: 0.2,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: ["Name"]
};

const INITIAL_STATE = loop(
  {
    searchedIngredients: [],
    addedIngredients: [],
    addedCheck: new Map(),
    searchEngine: new Fuse([], options)
  },
  Cmd.run(MainSourceFetch.getIngredientsList, {
    args: [Cmd.dispatch]
  })
);

const mergeWithBackEnd = (clientInventory, backendInventoryIds, fullList) => {
  let exist;
  const newFetchedItems = [...clientInventory];
  backendInventoryIds.forEach(ingID => {
    exist = false;
    try {
      clientInventory.forEach(clientIng => {
        if (ingID == clientIng.ID) {
          exist = true;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    if (!exist) {
      newFetchedItems.push(_.find(fullList, ing => ing.ID === ingID));
    }
  });
  return newFetchedItems;
};

const updateAddedIngCheckMap = (oldMap, newAddedIngs) => {
  const newAdded = new Map(oldMap);
  newAddedIngs.forEach(ing => newAdded.set(ing.ID, true));
  return newAdded;
};

const ingredientsReducer = (state = INITIAL_STATE, action) => {
  let newAdded;
  switch (action.type) {
    case SEARCHED_INGREDIENTS:
      return {
        ...state,
        searchedIngredients: action.data,
        searchEngine: new Fuse(action.data, options)
      };

    case ADD_INGREDIENT_TO_SEARCH_BY:
      GoogleAnalytics.addedIngToMyBar(action.data.Name);
      newAdded = new Map(state.addedCheck);
      newAdded.set(action.data.ID, !state.addedCheck.get(action.data.ID));
      return {
        ...state,
        addedIngredients: state.addedIngredients.concat(action.data),
        addedCheck: newAdded
      };

    case UNLOGGED_ADD_INGREDIENT_TO_SEARCH_BY:
      if (state.addedIngredients.length > 4) {
        action.subdatafunc();
        return state;
      }
      GoogleAnalytics.addedIngToMyBar(action.data.Name);
      newAdded = new Map(state.addedCheck);
      newAdded.set(action.data.ID, !state.addedCheck.get(action.data.ID));
      return {
        ...state,
        addedIngredients: state.addedIngredients.concat(action.data),
        addedCheck: newAdded
      };

    case GET_INVENTORY_INGS:
      const mergedAddedIngs = mergeWithBackEnd(
        state.addedIngredients,
        action.data,
        state.searchedIngredients
      );
      return {
        ...state,
        addedIngredients: mergedAddedIngs,
        addedCheck: updateAddedIngCheckMap(state.addedCheck, mergedAddedIngs)
      };

    case REMOVE_INGREDIENT_FROM_SEARCH_BY:
      newAdded = new Map(state.addedCheck);
      newAdded.set(action.data.ID, !state.addedCheck.get(action.data.ID));
      return {
        ...state,
        addedIngredients: state.addedIngredients.filter(
          item => item.ID !== action.data.ID
        ),
        addedCheck: newAdded
      };

    default:
      return state;
  }
};

export default ingredientsReducer;

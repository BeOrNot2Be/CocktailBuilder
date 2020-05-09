/** @format */
/* eslint-disable no-else-return */

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
    searchEngine: new Fuse([], options),
    backendAddedIngredientsUpdate: []
  },
  Cmd.run(MainSourceFetch.getIngredientsList, {
    args: [Cmd.dispatch]
  })
);

const mergeWithBackEnd = (clientInventory, backendInventoryIds, fullList) => {
  const newFetchedItems = [...clientInventory];
  const clientInventoryIds = new Set(clientInventory.map(ing => ing.ID));

  backendInventoryIds.forEach(newID => {
    if (!clientInventoryIds.has(newID)) {
      newFetchedItems.push(_.find(fullList, ing => ing.ID === newID));
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
      if (state.backendAddedIngredientsUpdate.length === 0) {
        return {
          ...state,
          searchedIngredients: action.data,
          searchEngine: new Fuse(action.data, options)
        };
      } else {
        const mergedAddedIngs = mergeWithBackEnd(
          state.addedIngredients,
          state.backendAddedIngredientsUpdate,
          action.data
        );
        return {
          ...state,
          addedIngredients: mergedAddedIngs,
          addedCheck: updateAddedIngCheckMap(state.addedCheck, mergedAddedIngs),
          searchedIngredients: action.data,
          searchEngine: new Fuse(action.data, options),
          backendAddedIngredientsUpdate: []
        };
      }

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
      if (state.searchedIngredients.length > 0) {
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
      } else {
        return { ...state, backendAddedIngredientsUpdate: action.data };
      }

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

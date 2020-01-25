/** @format */

import {
  SEARCHED_INGREDIENTS,
  ADD_INGREDIENT_TO_SEARCH_BY,
  REMOVE_INGREDIENT_FROM_SEARCH_BY,
  ADDED_CHECK_MAP_UPDATE,
  GET_INVENTORY_INGS,
  SAVE_INVENTORY_INGS
} from '../actions/Ingredients';
import MainSourceFetch from '../api/web';
import Fuse from 'fuse.js';
import _ from 'lodash';
import { loop, Cmd } from 'redux-loop';
import GoogleAnalytics from '../api/googleAnalytics';

var options = {
  threshold: 0.2,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: ['Name']
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

  for (let ingID of backendInventoryIds) {
    exist = false;
    for (let clientIng of clientInventory) {
      if (ingID == clientIng.ID) {
        exist = true;
        break;
      }
    }
    if (!exist) {
      newFetchedItems.push(_.find(fullList, (ing) => ing.ID === ingID));
    }
  }
  return newFetchedItems;
};

const updateAddedIngCheckMap = (oldMap, newAddedIngs) => {
  const newAdded = new Map(oldMap);
  for (let ing of newAddedIngs) {
    newAdded.set(ing.ID, true);
  }
  return newAdded;
};

const ingredientsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCHED_INGREDIENTS:
      return {
        ...state,
        searchedIngredients: action.data,
        searchEngine: new Fuse(action.data, options)
      };

    case ADD_INGREDIENT_TO_SEARCH_BY:
      GoogleAnalytics.addedIngToMyBar(action.data.Name);
      return {
        ...state,
        addedIngredients: state.addedIngredients.concat(action.data)
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

    case ADDED_CHECK_MAP_UPDATE:
      const newAdded = new Map(state.addedCheck);
      newAdded.set(action.data, !state.addedCheck.get(action.data));
      return { ...state, addedCheck: newAdded };

    case REMOVE_INGREDIENT_FROM_SEARCH_BY:
      return {
        ...state,
        addedIngredients: state.addedIngredients.filter(
          (item) => item.ID !== action.data.ID
        )
      };

    default:
      return state;
  }
};

export default ingredientsReducer;

/** @format */

import { loop, Cmd } from "redux-loop";
import _ from "lodash";
import {
  SEARCHED_RECIPES,
  GET_COCKTAILS_BY_INGREDIENTS,
  ADD_FAV_COCKTAIL,
  REMOVE_FAV_COCKTAIL,
  FETCH_FAV_COCKTAIL,
  FETCH_FAV_COCKTAIL_ID
} from "../actions/Cocktails";
import { LOG_OUT } from "../actions/User";
import MainSourceFetch from "../api/web";

const INITIAL_STATE = {
  searchedCocktails: [],
  cocktailsByIngredients: [],
  favCocktails: []
};

function usersFavByIDFetchSuccessfulAction(item) {
  return {
    type: ADD_FAV_COCKTAIL,
    data: item
  };
}

const cocktailsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCHED_RECIPES:
      return { ...state, searchedCocktails: action.data };

    case GET_COCKTAILS_BY_INGREDIENTS:
      return { ...state, cocktailsByIngredients: action.data };

    case ADD_FAV_COCKTAIL:
      if (_.indexOf(state.favCocktails, action.data) === -1) {
        return {
          ...state,
          favCocktails: state.favCocktails.concat(action.data)
        };
      }
      return state;

    case FETCH_FAV_COCKTAIL:
      return { ...state, favCocktails: action.data };

    case FETCH_FAV_COCKTAIL_ID:
      return loop(
        state,
        Cmd.list(
          action.data.map(ID =>
            Cmd.run(MainSourceFetch.getFavByIDFetchReturn, {
              successActionCreator: usersFavByIDFetchSuccessfulAction,
              args: [ID]
            })
          )
        )
      );

    case LOG_OUT:
      return { ...state, favCocktails: [] };

    case REMOVE_FAV_COCKTAIL:
      return {
        ...state,
        favCocktails: state.favCocktails.filter(
          item => item.CocktailID !== action.data.CocktailID
        )
      };

    default:
      return state;
  }
};

export default cocktailsReducer;

/** @format */

import { loop, Cmd } from "redux-loop";
import {
  SEARCHED_RECIPES,
  GET_COCKTAILS_BY_INGREDIENTS,
  ADD_FAV_COCKTAIL,
  REMOVE_FAV_COCKTAIL,
  FETCH_FAV_COCKTAIL_ID,
  TOGGLE_FAV_COCKTAIL
} from "../actions/Cocktails";
import { LOG_OUT } from "../actions/User";
import MainSourceFetch from "../api/web";
import GoogleAnalytics from "../api/googleAnalytics";

const INITIAL_STATE = {
  searchedCocktails: [],
  cocktailsByIngredients: [],
  favCocktails: [],
  favCocktailsIDs: []
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
      if (state.favCocktailsIDs.indexOf(action.data.CocktailID) === -1) {
        action.data.TotalIngredients = action.data.Ingredients.length;
        return {
          ...state,
          favCocktailsIDs: state.favCocktailsIDs.concat(action.data.CocktailID),
          favCocktails: state.favCocktails.concat(action.data)
        };
      }
      return state;

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

    case TOGGLE_FAV_COCKTAIL:
      const isInFavs =
        state.favCocktailsIDs.indexOf(action.data.item.CocktailID) !== -1;
      if (isInFavs) {
        const newFavCocktailsIDs = state.favCocktailsIDs.filter(
          id => id !== action.data.item.CocktailID
        );
        const newState = {
          ...state,
          favCocktailsIDs: newFavCocktailsIDs,
          favCocktails: state.favCocktails.filter(
            item => item.CocktailID !== action.data.item.CocktailID
          )
        };
        return loop(
          newState,
          Cmd.run(MainSourceFetch.saveRemovedFavSimplified, {
            args: [newFavCocktailsIDs, action.data.token]
          })
        );
        // eslint-disable-next-line no-else-return
      } else {
        const newFavCocktailsIDs = state.favCocktailsIDs.concat(
          action.data.item.CocktailID
        );
        action.data.item.TotalIngredients =
          action.data.item.MissingIngr + action.data.item.PresentIngr;
        const newState = {
          ...state,
          favCocktailsIDs: newFavCocktailsIDs,
          favCocktails: state.favCocktails.concat(action.data.item)
        };
        GoogleAnalytics.addedRecipeToFav(action.data.item.CocktailName);
        return loop(
          newState,
          Cmd.run(MainSourceFetch.saveAddedFavSimplified, {
            args: [newFavCocktailsIDs, action.data.token]
          })
        );
      }

    case REMOVE_FAV_COCKTAIL:
      return {
        ...state,
        favCocktailsIDs: state.favCocktailsIDs.filter(
          id => id !== action.data.CocktailID
        ),
        favCocktails: state.favCocktails.filter(
          item => item.CocktailID !== action.data.CocktailID
        )
      };

    default:
      return state;
  }
};

export default cocktailsReducer;

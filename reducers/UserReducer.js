/** @format */

import { loop, Cmd } from "redux-loop";
import {
  ADD_TOKEN,
  GOOGLE_SIGN_IN,
  GOOGLE_FULL_SIGN_IN,
  LOG_OUT,
  TOGGLE_THEME,
  CACHE_SIGN_IN,
  FETCHED_INTERSTITIAL_AD_RATIO
} from "../actions/User";
import {
  FETCH_FAV_COCKTAIL_ID,
  GET_COCKTAILS_BY_INGREDIENTS,
  INCREMENT_RECIPE_VIEW_COUNTER
} from "../actions/Cocktails";
import { GET_INVENTORY_INGS } from "../actions/Ingredients";
import NativeApi from "../api/native";
import MainSourceFetch from "../api/web";
import GoogleAnalytics from "../api/googleAnalytics";

const INITIAL_STATE = loop(
  {
    logged: false,
    theme: 1,
    recipeViewCounter: 0,
    interstitialAdRatio: 5
  },
  Cmd.run(MainSourceFetch.getInterstitialAdRatio, {
    args: [Cmd.dispatch]
  })
);

function usersFavsFetchSuccessfulAction(ids) {
  return {
    type: FETCH_FAV_COCKTAIL_ID,
    data: ids
  };
}

function usersInventoryIngsFetchSuccessfulAction(ids) {
  return {
    type: GET_INVENTORY_INGS,
    data: ids
  };
}

const userReducer = (state = INITIAL_STATE, action) => {
  let user;
  switch (action.type) {
    case ADD_TOKEN:
      user = { ...state, token: action.data, logged: true };
      NativeApi.SaveUser(user);
      GoogleAnalytics.loggedIn();
      return loop(
        user,
        Cmd.list([
          Cmd.run(MainSourceFetch.getFavsIDFetchReturn, {
            successActionCreator: usersFavsFetchSuccessfulAction,
            args: [user.token]
          }),
          Cmd.run(MainSourceFetch.getInventoryIngsFetchReturn, {
            successActionCreator: usersInventoryIngsFetchSuccessfulAction,
            args: [user.token]
          })
        ])
      );

    // test version
    case GOOGLE_SIGN_IN:
      return { ...state, googleUser: action.data };

    case GOOGLE_FULL_SIGN_IN:
      user = { ...state, ...action.data };
      NativeApi.SaveUser(user);
      return user;

    case CACHE_SIGN_IN:
      user = { ...state, ...action.data };
      GoogleAnalytics.loggedIn();
      if (user.logged) {
        return loop(
          user,
          Cmd.list([
            Cmd.run(MainSourceFetch.getFavsIDFetchReturn, {
              successActionCreator: usersFavsFetchSuccessfulAction,
              args: [user.token]
            }),
            Cmd.run(MainSourceFetch.getInventoryIngsFetchReturn, {
              successActionCreator: usersInventoryIngsFetchSuccessfulAction,
              args: [user.token]
            })
          ])
        );
      }
      return user;

    case GET_COCKTAILS_BY_INGREDIENTS:
      if (state.logged) {
        return loop(
          state,
          Cmd.run(MainSourceFetch.saveInventoryIngs, {
            args: [action.args.ingsStr, state.token, Cmd.dispatch]
          })
        );
      }
      return state;

    case INCREMENT_RECIPE_VIEW_COUNTER:
      const recipeViewCounter = state.recipeViewCounter + 1;

      user = {
        ...state,
        recipeViewCounter:
          recipeViewCounter > state.interstitialAdRatio ? 1 : recipeViewCounter
      };
      NativeApi.SaveUser(user);
      return user;

    case FETCHED_INTERSTITIAL_AD_RATIO:
      const newInterstitialAdRatio = Number(action.data);

      if (!Number.isNaN(newInterstitialAdRatio)) {
        user = {
          ...state,
          interstitialAdRatio: newInterstitialAdRatio
        };
      } else {
        user = state;
      }

      return user;

    case LOG_OUT:
      return INITIAL_STATE;

    case TOGGLE_THEME:
      user = { ...state, theme: state.theme == 1 ? 0 : 1 };
      if (user.logged) {
        NativeApi.SaveUser(user);
      }
      return user;

    default:
      return state;
  }
};

export default userReducer;

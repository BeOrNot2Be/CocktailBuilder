/** @format */

import { combineReducers } from "redux-loop";
import userReducer from "./UserReducer";
import cocktailsReducer from "./CocktailsReducer";
import ingredientsReducer from "./IngredientsReducer";

export default combineReducers({
  user: userReducer,
  cocktails: cocktailsReducer,
  ingredients: ingredientsReducer
});

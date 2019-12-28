import { 
  SEARCHED_INGREDIENTS,
  ADD_INGREDIENT_TO_SEARCH_BY,
  REMOVE_INGREDIENT_FROM_SEARCH_BY
} from '../actions/Ingredients'
import MainSourceFetch from '../api/web';

const INITIAL_STATE = {
  searchedIngredients:[],
  addedIngredients:[],
};

const ingredientsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCHED_INGREDIENTS:
      return {...state, searchedIngredients:action.data}
    
    case ADD_INGREDIENT_TO_SEARCH_BY:
    return {
      ...state, 
      searchedIngredients: state.searchedIngredients.filter(item => item.ID !== action.data.ID),
      addedIngredients: state.addedIngredients.concat(action.data)
    }

    case REMOVE_INGREDIENT_FROM_SEARCH_BY:
      return {
        ...state,
        addedIngredients: state.addedIngredients.filter(item => item.ID !== action.data.ID),
        searchedIngredients: state.searchedIngredients.concat(action.data),
      }
      //topByIngredients

    default:
      return state
  }
};
  
  
  export default ingredientsReducer;
  
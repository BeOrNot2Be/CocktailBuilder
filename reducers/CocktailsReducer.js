import { 
  SEARCHED_RECIPES,
  GET_COCKTAILS_BY_INGREDIENTS
} from '../actions/Cocktails'

const INITIAL_STATE = {
    searchedCocktails:[],
    cocktailsByIngredients:[],
  };
  
const cocktailsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCHED_RECIPES:
      return {...state, searchedCocktails:action.data}

    case GET_COCKTAILS_BY_INGREDIENTS:
      return {...state, cocktailsByIngredients:action.data}
      
    default:
      return state
  }
};
  
  
  export default cocktailsReducer;
  
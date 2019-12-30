import { 
  SEARCHED_RECIPES,
  GET_COCKTAILS_BY_INGREDIENTS,
  ADD_FAV_COCKTAIL,
  REMOVE_FAV_COCKTAIL,
  FETCH_FAV_COCKTAIL,
} from '../actions/Cocktails'
import { 
  LOG_OUT
} from '../actions/User';

const INITIAL_STATE = {
    searchedCocktails:[],
    cocktailsByIngredients:[],
    favCocktails: []
  };
  
const cocktailsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCHED_RECIPES:
      return {...state, searchedCocktails:action.data}

    case GET_COCKTAILS_BY_INGREDIENTS:
      return {...state, cocktailsByIngredients:action.data}

    case ADD_FAV_COCKTAIL:
      return {...state, favCocktails: state.favCocktails.concat(action.data)}

    case FETCH_FAV_COCKTAIL:
      return {...state, favCocktails: action.data}

    case LOG_OUT:
        return {...state, favCocktails: []}

    case REMOVE_FAV_COCKTAIL:
      return {...state, favCocktails: state.favCocktails.filter(item => item.CocktailID !== action.data.CocktailID)}
      
    default:
      return state
  }
};
  
  
  export default cocktailsReducer;
  
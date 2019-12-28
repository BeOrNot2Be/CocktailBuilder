import { 
    SEARCHED_RECIPES,
    GET_COCKTAILS_BY_INGREDIENTS
} from '../actions/Cocktails';
import _ from 'lodash';
import { 
    SEARCHED_INGREDIENTS,
} from '../actions/Ingredients';

const validateStrInput = (input) =>{
    return input
}

const makeIngredientsFetchable = (ingredients) =>{
    return ingredients.map(ingredient => ingredient.ID).join('-')
}

export default class MainSourceFetch {
    static getCocktailsByName(input, dispatch){
        const str = validateStrInput(input) 
        fetch(`https://www.cocktailbuilder.com/json/cocktailsByName?param=${str}`)
        .then(response => response.json())
        .then(responseJson => {
            dispatch({
                type: SEARCHED_RECIPES,
                data: responseJson
            });
        })
        .catch(error => {
            console.error(error);
          });
    }

    static getCocktailsByIngredients(ingredients, dispatch){
        const str = makeIngredientsFetchable(ingredients) 
        fetch(`https://www.cocktailbuilder.com/json/topByIngredients?param=${str}`)
        .then(response => response.json())
        .then(responseJson => {
            dispatch({
                type: GET_COCKTAILS_BY_INGREDIENTS,
                data: responseJson
            });
        })
        .catch(error => {
            console.error(error);
          });
    }

    static getCocktailsByIngredient(ingredient, setState, cocktailsList){
        fetch(`https://www.cocktailbuilder.com/json/topByIngredients?param=${ingredient.ID}`)
        .then(response => response.json())
        .then(responseJson => {
            if (cocktailsList.length != responseJson.length) {
                setState(responseJson)
            };
        })
        .catch(error => {
            console.error(error);
          });
    }

    static getIngredientsList(dispatch){
        fetch(`https://www.cocktailbuilder.com/json/ingredientList`)
        .then(response => response.json())
        .then(responseJson => {
            dispatch({
                type: SEARCHED_INGREDIENTS,
                data: responseJson
            });
        })
        .catch(error => {
            console.error(error);
          });
    }

    static getCocktail(recipe, setRecipeData, previousRecipe){
        fetch(`https://www.cocktailbuilder.com/json/cocktailDetails?param=${recipe.CocktailID}`)
        .then(response => response.json())
        .then(responseJson => {
            if (!_.isEqual(previousRecipe, responseJson)) {
                setRecipeData(responseJson)
            }
        })
        .catch(error => {
            console.error(error);
          });
    }

}

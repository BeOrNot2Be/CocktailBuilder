import { 
    SEARCHED_RECIPES,
    GET_COCKTAILS_BY_INGREDIENTS,
    REMOVE_FAV_COCKTAIL,
    ADD_FAV_COCKTAIL,
    FETCH_FAV_COCKTAIL
} from '../actions/Cocktails';
import { 
    ADD_TOKEN,
    GOOGLE_SIGN_IN
} from '../actions/User';
import _ from 'lodash';
import { 
    SEARCHED_INGREDIENTS,
    GET_INVENTORY_INGS,
    SAVE_INVENTORY_INGS
} from '../actions/Ingredients';

import * as Google from 'expo-google-app-auth';

import NetInfo from '@react-native-community/netinfo';

const validateStrInput = (input) =>{
    return input
}

const makeIngredientsFetchable = (ingredients) =>{
    return ingredients.map(ingredient => ingredient.ID).join('-')
}

const ConnectionIssue = () => {
NetInfo.fetch().then(state => {
    if (!state.isConnected) {
        alert('You are not connected to the Internet')
    }
  });
}

const FetchingIssue = () => {
    alert('Some network issues happened. Check your connection or give us some time to fix issues!')
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
            FetchingIssue()
            ConnectionIssue()
          });
    }

    static getCocktailsByIngredients(ingredients, dispatch, token=false){
        console.warn('update')
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
            FetchingIssue()
            ConnectionIssue()
          });
        if (token !== false) {
            this.saveInventoryIngs(ingredients, token, dispatch)
        } 
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
            FetchingIssue()
            ConnectionIssue()
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
            FetchingIssue()
            ConnectionIssue()
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
            FetchingIssue()
            ConnectionIssue()
          });
    }

    static getCocktailById(ID, dispatchFunc){
        fetch(`https://www.cocktailbuilder.com/json/cocktailDetails?param=${ID}`)
        .then(response => response.json())
        .then(responseJson => {
            responseJson.CocktailID = ID; 
            responseJson.CocktailName = responseJson.Name;
            dispatchFunc(responseJson);
        })
        .catch(error => {
            FetchingIssue()
            ConnectionIssue()
          });
    }

    static getToken(email, dispatch){
        fetch('https://www.cocktailbuilder.com/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email:email})
        })
        .then(response => response.json())
        .then(responseJson => {
            dispatch({
                type: ADD_TOKEN,
                data: responseJson.token
            })
        })
        .catch(error => {
            FetchingIssue()
            ConnectionIssue()
          });
    }

    static getFavs(token, dispatch){
        fetch(`https://www.cocktailbuilder.com/api/users/${token}/favorites`)
        .then(response => response.json())
        .then(responseJson => {
            const loadFavIntoState = (item) => dispatch({
                type: ADD_FAV_COCKTAIL,
                data: item 
            })
            for (cocktailIndex of responseJson) {
                this.getCocktailById(cocktailIndex, loadFavIntoState);
            }
        })
        .catch(error => {
            FetchingIssue()
            ConnectionIssue()
          });
    }

    static getInventoryIngs(token, dispatch){
        fetch(`https://www.cocktailbuilder.com/api/users/${token}/inventory`)
        .then(response => response.json())
        .then(responseJson => {
            dispatch({
                type: GET_INVENTORY_INGS,
                data: responseJson 
            })
        })
        .catch(error => {
            FetchingIssue()
            ConnectionIssue()
          });
        return []
    }

    static saveInventoryIngs(ings, token, dispatch){
        fetch(`https://www.cocktailbuilder.com/api/users/${token}/inventory`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            body: (ings).map(ing => `ingredients[]=${ing.ID}`).join('&')
        })
        .then(response => response.json())
        .then(responseJson => {
            dispatch({
                type: SAVE_INVENTORY_INGS,
            })
        })
        .catch(error => {
            FetchingIssue()
            ConnectionIssue()
          });
    }

    static saveRemovedFav(removed, favs, token, dispatch){
        fetch(`https://www.cocktailbuilder.com/api/users/${token}/favorites`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            body: favs.filter(item => item.CocktailID !== removed.CocktailID).map(fav => `cocktails[]=${fav.CocktailID}`).join('&')
        })
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.result === 'success') {
                dispatch({
                    type: REMOVE_FAV_COCKTAIL,
                    data: removed
                })
            }
        })
        .catch(error => {
            FetchingIssue()
            ConnectionIssue()
          });
    }

    static saveAddedFav(added, favs, token, dispatch){
        fetch(`https://www.cocktailbuilder.com/api/users/${token}/favorites`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            body: favs.concat(added).map(fav => `cocktails[]=${fav.CocktailID}`).join('&')
        })
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.result === 'success') {
                const loadFavIntoState = (item) => dispatch({
                    type: ADD_FAV_COCKTAIL,
                    data: item 
                })
                this.getCocktailById(added.CocktailID, loadFavIntoState)
            }
        })
        .catch(error => {
            FetchingIssue()
            ConnectionIssue()
          });
    }

    static async signInWithGoogleAsync(dispatch) {
        try {
          const result = await Google.logInAsync({
            androidClientId: "629930544514-kgpsf2jgqqnijqdscd02k8r9tdc2hqcm.apps.googleusercontent.com",
            iosClientId: "629930544514-a4sin974ddd6nispqjcsvd621fd4g6di.apps.googleusercontent.com",
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            dispatch({
                type:GOOGLE_SIGN_IN,
                data: result
            })
          } else {
            console.warn({ cancelled: true });
          }
        } catch (e) {
          console.warn({ error: true });
        }
      }
      

}

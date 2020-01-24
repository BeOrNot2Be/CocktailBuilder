import { Analytics, Event, PageHit  } from 'expo-analytics';

const analytics = new Analytics('UA-156898270-1');

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

export default class GoogleAnalytics {

    static cocktailPageOpened() {
        analytics.hit(new PageHit('CocktailPage'))
        .then(() => {console.log("success")})
        .catch(e => {console.log(e.message)});
    }

    static favPageOpened() {
        analytics.hit(new PageHit('FavoritePage'))
        .then(() => {console.log("success")})
        .catch(e => {console.log(e.message)});
    }

    static ingsPageOpened() {
        analytics.hit(new PageHit('IngredientsPage'))
        .then(() => {console.log("success")})
        .catch(e => {console.log(e.message)});
    }

    static addedIngsOpened() {
        analytics.hit(new PageHit('MyBar'))
        .then(() => {console.log("success")})
        .catch(e => {console.log(e.message)});
    }

    static searchedIngsOpened() {
        analytics.hit(new PageHit('SearchedIngredients'))
        .then(() => {console.log("success")})
        .catch(e => {console.log(e.message)});
    }
    
    static sendMainPagesAnalytics(name) {
        switch (name) {
            case 'Favorites':
                this.favPageOpened()
                break;
            
            case 'Cocktails':
                this.cocktailPageOpened()
                break;
            
            case 'Ingredients':
                this.ingsPageOpened()
                break;
        
            default:
                break;
        } 
    }

    static sendIngsPagesAnalytics(name) {
        switch (name) {
            case 'Added':
                this.addedIngsOpened()
                break;
            
            case 'Searched':
                this.searchedIngsOpened()
                break;
            
            default:
                break;
        } 
    }

    static addedIngToMyBar(ing_name) {
        analytics.event(new Event('Ingredients', 'Addded to My Bar', `${ing_name} Ingredient Added to My Bar`))
        .then(() => console.log("success"))
        .catch(e => console.log(e.message));
    }

    static addedRecipeToFav(recipe_name) {
        analytics.event(new Event('Recipes', 'Addded to Favorites', `${recipe_name} Recipe Added to Favorites`))
        .then(() => console.log("success"))
        .catch(e => console.log(e.message));
    }

    static openedRecipe(recipe_name) {
        analytics.event(new Event('Recipes', 'Opened', `${recipe_name} Recipe Opened`))
        .then(() => console.log("success"))
        .catch(e => console.log(e.message));
    }
}

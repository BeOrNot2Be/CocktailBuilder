/** @format */

import { Analytics, Event, PageHit } from "expo-analytics";
import NetInfo from "@react-native-community/netinfo";

const analytics = new Analytics("UA-759662-3");

// eslint-disable-next-line no-unused-vars
const ConnectionIssue = () => {
  NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      alert("You are not connected to the Internet");
    } else {
      alert(
        "Some network issues happened. Check your connection or give us some time to fix issues!"
      );
    }
  });
};

export default class GoogleAnalytics {
  static cocktailPageOpened() {
    analytics.hit(new PageHit("Cocktail List")).catch(e => {
      console.error(e.message);
    });
  }

  static favPageOpened() {
    analytics.hit(new PageHit("FavoritePage")).catch(e => {
      console.error(e.message);
    });
  }

  // deactivated page because in
  // IngredientsPage automatically opens MyBar Tab
  //
  // static ingsPageOpened() {
  //   analytics.hit(new PageHit("IngredientsPage")).catch(e => {
  //     console.error(e.message);
  //   });
  // }

  static addedIngsOpened() {
    analytics.hit(new PageHit("MyBar")).catch(e => {
      console.error(e.message);
    });
  }

  static searchedIngsOpened() {
    analytics.hit(new PageHit("SearchedIngredients")).catch(e => {
      console.error(e.message);
    });
  }

  static sendMainPagesAnalytics(name) {
    switch (name) {
      case "Favorites":
        this.favPageOpened();
        break;

      case "Cocktails":
        this.cocktailPageOpened();
        break;

      case "Ingredients":
        this.addedIngsOpened();
        break;

      default:
        break;
    }
  }

  static sendIngsPagesAnalytics(name) {
    switch (name) {
      case "Added":
        this.addedIngsOpened();
        break;

      case "Searched":
        this.searchedIngsOpened();
        break;

      default:
        break;
    }
  }

  static addedIngToMyBar(ingName) {
    analytics
      .event(
        new Event(
          "Ingredients",
          "Addded to My Bar",
          `${ingName} Ingredient Added to My Bar`
        )
      )
      .catch(e => console.error(e.message));
  }

  static addedRecipeToFav(recipeName) {
    analytics
      .event(
        new Event(
          "Recipes",
          "Addded to Favorites",
          `${recipeName} Recipe Added to Favorites`
        )
      )
      .catch(e => console.error(e.message));
  }

  static openedRecipe(recipeName) {
    analytics
      .event(new Event("Recipes", "Opened", `${recipeName} Recipe Opened`))
      .catch(e => console.error(e.message));
  }

  static loggedIn() {
    analytics
      .event(new Event("Users", "Logged In", "User Signed in from Mobile App"))
      .catch(e => console.error(e.message));
  }
}

import { 
  ADD_TOKEN,
  GOOGLE_SIGN_IN,
  GOOGLE_FULL_SIGN_IN,
  LOG_OUT,
  TOGGLE_THEME,
  USER_CACHE_CLEANED_ERROR,
  CACHE_SIGN_IN,
} from '../actions/User';
import { 
  FETCH_FAV_COCKTAIL_ID,
  GET_COCKTAILS_BY_INGREDIENTS
} from '../actions/Cocktails'
import { 
  GET_INVENTORY_INGS,
} from '../actions/Ingredients'
import NativeApi from '../api/native';
import { loop, Cmd } from 'redux-loop';
import MainSourceFetch from '../api/web';

const INITIAL_STATE = {
  logged: false,
  theme: 1 
};

function usersFavsFetchSuccessfulAction(ids){
  return {
     type: FETCH_FAV_COCKTAIL_ID,
     data: ids
  };
}

function usersInventoryIngsFetchSuccessfulAction(ids){
  return {
     type: GET_INVENTORY_INGS,
     data: ids
  };
}

const userReducer = (state = INITIAL_STATE, action) => {
  let user;
  switch (action.type) {
    case ADD_TOKEN:
      user = {...state, token: action.data, logged: true};
      NativeApi.SaveUser(user)
      return loop(user, Cmd.list([
        Cmd.run(MainSourceFetch.getFavsIDFetchReturn, {
        successActionCreator: usersFavsFetchSuccessfulAction,
        args: [user.token]
      }),
      Cmd.run(MainSourceFetch.getInventoryIngsFetchReturn, {
        successActionCreator: usersInventoryIngsFetchSuccessfulAction,
        args: [user.token]
      }),
    ]));

    // test version
    case GOOGLE_SIGN_IN:
      return {...state, googleUser: action.data}

    case GOOGLE_FULL_SIGN_IN:
      user = {...state, ...action.data};
      NativeApi.SaveUser(user)
      return user

    case CACHE_SIGN_IN:
      user = {...state, ...action.data}; 
      if (user.logged) {
        return loop(user, Cmd.list([
            Cmd.run(MainSourceFetch.getFavsIDFetchReturn, {
            successActionCreator: usersFavsFetchSuccessfulAction,
            args: [user.token]
          }),
          Cmd.run(MainSourceFetch.getInventoryIngsFetchReturn, {
            successActionCreator: usersInventoryIngsFetchSuccessfulAction,
            args: [user.token]
          }),
        ]));
      } else {
        return user
      }

    case GET_COCKTAILS_BY_INGREDIENTS:
      if (state.logged) {
        return loop(state, 
          Cmd.run(MainSourceFetch.saveInventoryIngs, 
            {args: [action.args.ingsStr, state.token, Cmd.dispatch]}
            )
          )
      } else {
        return state
      }
      
        
    case LOG_OUT:
        return INITIAL_STATE

    case TOGGLE_THEME:
      user = {...state, theme: state.theme == 1? 0 : 1 };
        NativeApi.SaveUser(user)
        return user

    default:
      return state
  }
};


export default userReducer;

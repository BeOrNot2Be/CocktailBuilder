import { 
  ADD_TOKEN,
  GOOGLE_SIGN_IN,
  GOOGLE_FULL_SIGN_IN,
  LOG_OUT,
  TOGGLE_THEME,
  USER_CACHE_CLEANED_ERROR,
  CACHE_SIGN_IN,
} from '../actions/User';
import NativeApi from '../api/native';

const INITIAL_STATE = {
  logged: false,
  theme: 1 
};

const userReducer = (state = INITIAL_STATE, action) => {
  let user;
  switch (action.type) {
    case ADD_TOKEN: 
      user = {...state, token: action.data, logged: true};
      NativeApi.SaveUser(user)
      return user

    case GOOGLE_SIGN_IN:
      return {...state, googleUser: action.data}

    case GOOGLE_FULL_SIGN_IN:
      user = {...state, ...action.data};
      NativeApi.SaveUser(user)
      return user

    case CACHE_SIGN_IN:
      user = {...state, ...action.data};
      NativeApi.SaveUser(user)
      return user;
      
        
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

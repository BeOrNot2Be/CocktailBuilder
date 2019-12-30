import { 
  ADD_TOKEN,
  GOOGLE_SIGN_IN,
  GOOGLE_FULL_SIGN_IN,
  LOG_OUT,
  TOGGLE_THEME
} from '../actions/User';

const INITIAL_STATE = {
  logged: false,
  theme: 1 // cache
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TOKEN: 
    //save cache
      return {...state, token: action.data, logged: true}

    case GOOGLE_SIGN_IN:
      return {...state, googleUser: action.data}

    case GOOGLE_FULL_SIGN_IN:
      //save cache
      return {...state, ...action.data}
        
    case LOG_OUT:
      //clear cache
        return INITIAL_STATE

    case TOGGLE_THEME:
        return {...state, theme: state.theme == 1? 0 : 1 }

    default:
      return state
  }
};


export default userReducer;

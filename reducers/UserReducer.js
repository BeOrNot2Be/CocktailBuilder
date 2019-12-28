import { 
  ADD_TOKEN,
} from '../actions/User';

const INITIAL_STATE = {
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TOKEN: 
      return {...state, token: action.data}

    default:
      return state
  }
};


export default userReducer;

import { createStore, compose } from 'redux';
import reducer from './reducers/MainReducer';
import { install  } from 'redux-loop';


const enhancer = compose(
    install(),
  );

const mainStore = createStore(reducer, {}, install());

export default mainStore;

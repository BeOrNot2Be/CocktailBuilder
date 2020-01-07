import { createStore } from 'redux';
import reducer from './reducers/MainReducer';

const mainStore = createStore(reducer);

export default mainStore;

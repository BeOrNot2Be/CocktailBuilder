/** @format */

import { createStore } from "redux";
import { install } from "redux-loop";
import reducer from "./reducers/MainReducer";

const mainStore = createStore(reducer, {}, install());

export default mainStore;

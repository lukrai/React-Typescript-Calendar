import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "./root.reducer";

export default preloadedState => createStore(reducer, preloadedState, applyMiddleware(thunk));

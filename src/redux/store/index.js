import { applyMiddleware, compose, createStore } from 'redux';
import data from './data';
import thunk from 'redux-thunk';
import axios from 'axios';
import { createRootReducer,httpReducer } from '../reducers';
import { notification, message } from 'antd';


function storeState(state, name, value) {
    state[name] = value;
    return state;
}

const store = createStore(httpReducer, data,applyMiddleware(thunk));
export default store
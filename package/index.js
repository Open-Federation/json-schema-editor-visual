import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Model from './model'
import Schema from './App.js'
import utils from './utils'

import {combineReducers, createStore , applyMiddleware} from 'redux'


module.exports = (config = {})=>{
  if(config.lang) utils.lang = config.lang;
  return {    
    Model: Model,
    Component: Schema
  }
}
// const store = Model.getStore(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// render(
//   <Provider store={store} className="wrapper">
//     <Schema />
//   </Provider>,
//   document.getElementById('root')
// )
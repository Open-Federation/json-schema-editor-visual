import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {combineReducers, createStore , applyMiddleware} from 'redux'
import 'antd/dist/antd.css'
const jEditor = require('../package/index.js')()

const store = jEditor.Model.getStore(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const Component = jEditor.Component;

const schema = ''

render(
  <Provider store={store} className="wrapper">
    <Component showEditor={true}  data={schema} onChange={(e)=>{
      console.log('changeValue', e)
    }} />
  </Provider>,
  document.getElementById('root')
)
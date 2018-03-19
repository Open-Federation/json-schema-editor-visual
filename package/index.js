import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App.js'
import utils from './utils'
import moox from 'moox'
import schema from './models/schema'
import PropTypes from 'prop-types'


import {combineReducers, createStore , applyMiddleware} from 'redux'


module.exports = (config = {})=>{
  if(config.lang) utils.lang = config.lang;
  const Model = moox({
    schema
  })

  const store = Model.getStore();

  const Schema= App(Model)

  const Component = (props)=>{
    return <Provider store={store} className="wrapper">
      <Schema {...props} />
    </Provider>
  }

  Component.propTypes = {
    data: PropTypes.string,
    onChange: PropTypes.func,
    showEditor: PropTypes.bool
  }
  return Component;

}


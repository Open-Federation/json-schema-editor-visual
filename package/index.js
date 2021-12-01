import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App.js'
import utils from './utils'
import moox from 'moox'
import schema from './models/schema'
import PropTypes from 'prop-types'

module.exports = (config = {})=>{
  if(config.lang) utils.lang = config.lang;
  
  const Model = moox({
    schema
  })
  if(config.format){
    Model.__jsonSchemaFormat = config.format
  } else {
    Model.__jsonSchemaFormat = utils.format
  }
  if(config.integerFormat){
    Model.__jsonIntegerFormat = config.integerFormat
  } else {
    Model.__jsonIntegerFormat = utils.integerFormat
  }

  if(config.mock) {
    Model.__jsonSchemaMock = config.mock
  }

  

  const store = Model.getStore();

  const Component = (props)=>{
    return <Provider store={store} className="wrapper">
      <App Model={Model} {...props} />
    </Provider>
  }

  Component.propTypes = {
    data: PropTypes.string,
    onChange: PropTypes.func,
    showEditor: PropTypes.bool
  }
  return Component;

}


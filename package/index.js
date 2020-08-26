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

  if(config.mock) {
    Model.__jsonSchemaMock = config.mock
  }

  

  const store = Model.getStore();

  const Component = (props)=>{
    const hasRoot = props.hasRoot === undefined ? true : props.hasRoot;
    const { descriptionPlaceholders } = props;
    const buttonsConfig = props.buttonsConfig || {
      position: 'top',
      importJSON: true,
      extra: null
    }
    return <Provider store={store} className="wrapper">
      <App
        Model={Model}
        {...props}
        hasRoot={hasRoot}
        descriptionPlaceholders={descriptionPlaceholders || {}}
        buttonsConfig={buttonsConfig}
      />
    </Provider>
  }

  Component.propTypes = {
    data: PropTypes.string,
    onChange: PropTypes.func,
    showEditor: PropTypes.bool
  }
  return Component;

}


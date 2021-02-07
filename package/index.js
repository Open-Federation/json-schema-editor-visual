import React from 'react'
import { Provider } from 'react-redux'
import App from './App.js'
import utils from './utils'
import store from "./redux/store";
import PropTypes from 'prop-types'

module.exports = (config = {})=>{
  const Component = (props)=>{
    return <Provider store={store} className="wrapper">
      <App {...props} />
    </Provider>
  }

  Component.propTypes = {
    data: PropTypes.string,
    onChange: PropTypes.func,
    showEditor: PropTypes.bool
  }
  return Component;
}


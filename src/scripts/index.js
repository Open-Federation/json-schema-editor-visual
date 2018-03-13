import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Model from './model'
import Schema from './App.js'

const store = Model.getStore()
render(
  <Provider store={store} className="wrapper">
    <Schema />
  </Provider>,
  document.getElementById('root')
)
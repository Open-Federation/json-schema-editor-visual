import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {combineReducers, createStore , applyMiddleware} from 'redux'
import 'antd/dist/antd.css'
import jEditor from '../package/index.js'

const store = jEditor.Model.getStore(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const Component = jEditor.Component;

const schema = JSON.stringify({
  "title": "Product",
  "type": "object",
  "properties": {
    "id": {
      "description": "The unique identifier for a product",
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "price": {
      "type": "number",
      "minimum": 0,
      "exclusiveMinimum": true
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "array": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "length": {
            "type": "number"
          },
          "width": {
            "type": "number"
          },
          "height": {
            "type": "number"
          }
        }
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "dimensions": {
      "type": "object",
      "properties": {
        "length": {
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      },
      "required": [
        "length",
        "width",
        "height"
      ]
    }
  },
  "required": [
    "id",
    "name",
    "price"
  ]
})

render(
  <Provider store={store} className="wrapper">
    <Component data={schema} onChange={(e)=>{
      console.log('changeValue', e)
    }} />
  </Provider>,
  document.getElementById('root')
)
# json-schema-editor-visual
A json-schema editor of high efficient and easy-to-use, base on React.



## Usage
```
npm install json-schema-editor-visual
```

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {combineReducers, createStore , applyMiddleware} from 'redux'
import 'antd/dist/antd.css'
import jEditor from '../package/index.js'

const store = jEditor.Model.getStore();
const Component = jEditor.Component;

render(
  <Provider store={store} className="wrapper">
    <Component />
  </Provider>,
  document.getElementById('root')
)
```

## Run dev
```
git clone https://github.com/YMFE/json-schema-editor-visual.git
npm install
npm run start
```


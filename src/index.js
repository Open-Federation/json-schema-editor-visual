import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import 'antd/dist/antd.css';

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}
//import '../dist/main.css'
const jeditor = require('../package/index.js');
const mock = [];

const JEditor1 = jeditor({mock: mock});

render(
  <div>
    <JEditor1
      showEditor={true}
      isMock={false}
      data={''}
      onChange={e => {
        console.log('changeValue', e);
      }}
    />
  </div>,
  document.getElementById('root')
);

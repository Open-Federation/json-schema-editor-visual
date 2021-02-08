import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from "../package/redux/store";
import 'antd/dist/antd.css';
import JEditor from '../package/App';

render(
  <div>
    <Provider store={store} className="wrapper">
      <JEditor
          showEditor={true}
          isMock={false}
          data={''}
          onChange={e => {
            console.log('changeValue', e);
          }}
      />
    </Provider>
  </div>,
  document.getElementById('root')
);

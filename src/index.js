import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import 'antd/dist/antd.css';

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}
import '../dist/main.css'
const jeditor = require('../dist/main');
const mock = [
  { name: '字符串', mock: '@string' },
  { name: '自然数', mock: '@natural' },
  { name: '浮点数', mock: '@float' },
  { name: '字符', mock: '@character' },
  { name: '布尔', mock: '@boolean' },
  { name: 'url', mock: '@url' },
  { name: '域名', mock: '@domain' },
  { name: 'ip地址', mock: '@ip' },
  { name: 'id', mock: '@id' },
  { name: 'guid', mock: '@guid' },
  { name: '当前时间', mock: '@now' },
  { name: '时间戳', mock: '@timestamp' }
];

const JEditor1 = jeditor({
  mock: mock,
  lang: 'zh_CN',
});

const DemoApp = () => {
  // const [data, setData] = useState('');
  const schemaType = ['string', 'integer', 'long', 'double', 'object', 'array'];
  const descriptionPlaceholders = {
    double: "与钱相关，请勿使用该类型",
    long: "展示字段请使用string类型",
    integer: "展示字段请使用string类型"
  }
  const handleChange = e => {
    // console.log(e)
    // setData(e);
  }
  
  return (
    <div>
      <a target="_blank" href="https://github.com/YMFE/json-schema-editor-visual">
        <h1>JSON-Schema-Editor</h1>
      </a>
      <p style={{ fontSize: '16px' }}>
        A json-schema editor of high efficient and easy-to-use, base on React.{' '}
        <a target="_blank" href="https://github.com/YMFE/json-schema-editor-visual">
          Github
      </a>
      </p>
      <br />
      <h3>
        该工具已被用于开源接口管理平台：{' '}
        <a target="_blank" href="https://github.com/ymfe/yapi">
          YApi
      </a>
      </h3>

      <br />
      <h2>Example:</h2>
      <hr />

      <JEditor1
        showEditor={true}
        isMock={false}
        showDefaultInput={true}
        data={''}
        rootTitle="body"
        // hasRoot={false}
        onChange={handleChange}
        schemaType={schemaType}
        descriptionPlaceholders={descriptionPlaceholders}
      />

      {/* <JEditor2
      showEditor={true}
      data={null}
      onChange={e => {
        // console.log("changeValue", e);
      }}
    /> */}
    </div>
  )
}

render(
  <div>
    <DemoApp />
  </div>,
  document.getElementById('root')
);

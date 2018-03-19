import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { combineReducers, createStore, applyMiddleware } from "redux";
import "antd/dist/antd.css";

if(process.process.env.NODE_ENV === 'production'){
  window.Perf = require('react-addons-perf');
}

const jeditor = require("../package/index.js");

const JEditor1 = jeditor()
const JEditor2 = jeditor({
  lang: 'zh_CN'
})

// const store = jEditor.Model.getStore(
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );
// const Component = jEditor.Component;

const schema = "";

render(
    <div>
      <a  target="_blank" href="https://github.com/YMFE/json-schema-editor-visual"><h1>JSON-Schema-Editor</h1></a>
      <p style={{fontSize: '16px'}}>
        A json-schema editor of high efficient and easy-to-use, base on React.{" "}
        <a target="_blank" href="https://github.com/YMFE/json-schema-editor-visual">Github</a>        
      </p>
      <br/>
      <h3>该工具已被用于开源接口管理平台： <a  target="_blank" href="https://github.com/ymfe/yapi">YApi</a></h3>

      

      <br/>
      <h2>Example:</h2>
      <hr />
      

      
      <JEditor1
        showEditor={true}
        data={schema}
        onChange={e => {
          console.log("changeValue", e);
        }}
      />
    </div>,
  document.getElementById("root")
);

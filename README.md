# json-schema-editor-visual
基于[json-schema-editor](https://github.com/YMFE/json-schema-editor-visual)的编辑器。
与原版相比，特点如下：
1. 可以隐藏根节点
2. 支持自定义placeholder
3. 支持自定义类型
4. 新增默认值输入框
5. 新增公共参数复选框

## Usage
```
mnpm install @banmafe/jsonschema
```

```js
const option = {}
import 'antd/dist/antd.css'
require('json-schema-editor-visual/dist/main.css')
const schemaEditor = require("json-schema-editor-visual/dist/main.js");
const SchemaEditor = schemaEditor(option)

render(
    <SchemaEditor />,
  document.getElementById('root')
)
[更多示例](https://github.com/echo6456/json-schema-editor-visual)
```

## Option Object

| name | desc | default |
| ---- | ----------- | --------- |
| `lg` | language, support `en_US` or `zh_CN` | en_US 

## SchemaEditor Props

| name | type | default | desc
| ---- | ----------- | --------- | --------- |
| `data` | string | null | the data of editor
| `onChange`| function | null | 
| `showEditor` | boolean | false | 

## Links
https://github.com/echo6456/json-schema-editor-visual
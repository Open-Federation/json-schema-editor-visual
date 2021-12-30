# json-schema-editor-visual

- A json-schema editor of high efficient and easy-to-use, base on React.
- 在json-schema-editor-visual基础上修改
- 增加了加载 ref 定义的功能 支持 JSON schema 的类型定义

![avatar](json-schema-editor-visual.jpg)

## Usage
```
yarn add @leslieliu/react-jsonschema-editor
```

```js
import schemaEditor from '@leslieliu/react-jsonschema-editor/dist/main.js';
const SchemaEditor = schemaEditor({});

<SchemaEditor
  showEditor={true}
  isMock={false}
  data={''}
  onChange={(e) => {
    console.log('changeValue', e);
  }}
/>
```

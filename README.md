# json-schema-editor-visual

- A json-schema editor of high efficient and easy-to-use, base on React.
- 增加了加载 ref 定义的功能 支持 JSON schema 的类型定义

![avatar](json-schema-editor-visual.jpg)

## Usage
~~npm install json-schema-editor-visual~~
```
npm install git+https://github.com/liuwei0514/json-schema-editor-visual.git
or
yarn add liuwei0514/json-schema-editor-visual
```

```js
import schemaEditor from 'json-schema-editor-visual/dist/main.js';
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

## Option Object

| name   | desc                                 | default |
| ------ | ------------------------------------ | ------- |
| `lang` | language, support `en_US` or `zh_CN` | en_US   |

## SchemaEditor Props

| name         | type     | default | desc               |
| ------------ | -------- | ------- | ------------------ |
| `data`       | string   | null    | the data of editor |
| `onChange`   | function | null    |
| `showEditor` | boolean  | false   |

## Links

https://github.com/liuwei0514/json-schema-editor-vue

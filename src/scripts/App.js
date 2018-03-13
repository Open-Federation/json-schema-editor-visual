import React from 'react';
import { Input, Row, Col, Form, Select, Checkbox, Button, Icon, Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import AceEditor from './components/AceEditor/AceEditor.js'
import _ from 'underscore';
import { connect } from 'react-redux'
import Model from './model.js'
import SchemaObject from './components/SchemaComponents/SchemaJson.js'
import PropTypes from 'prop-types'

let produce = {
  title: 'Product',
  type: 'object',
  properties: {
    id: {
      description: 'The unique identifier for a product',
      type: 'number'
    },
    name: {
      type: 'string'
    },
    price: {
      type: 'number',
      minimum: 0,
      exclusiveMinimum: true
    },
    tags: {
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 1,
      uniqueItems: true
    },
    array: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          length: { type: 'number' },
          width: { type: 'number' },
          height: { type: 'number' }
        }
      },
      minItems: 1,
      uniqueItems: true
    },
    dimensions: {
      type: 'object',
      properties: {
        length: { type: 'number' },
        width: { type: 'number' },
        height: { type: 'number' }
      },
      required: ['length', 'width', 'height']
    }
  },
  required: ['id', 'name', 'price']
};





class jsonSchema extends React.Component {
  constructor(props) {
    super(props);
  }

  static childContextTypes={
    changeNameAction: PropTypes.func
  }

  getChildContext(){
    return {
      changeNameAction: this.props.changeNameAction
    }
  }

  componentDidMount() {}

  onChange = (value, item, index) => {
    console.log(value, item, index);
  };

  handleSubmit = e => {};

  getValue = () => {
    console.log(this.refs.object.export());
    return this.export();
  };

  export = e => {
    console.log(e);
  };

  handleParams = (e) =>{
    // 将数据map 到store中
    this.props.changeEditorSchemaAction(e.jsonData)
    // let value = JSON.parse(e.target.value)
    // this.props.changeEditorSchemaAction(value);
  }

  render() {
    console.log(this.props.p)
    return (
      <Row>
        <Col span={8}>
          <AceEditor className="pretty-editor" mode='json' data={JSON.stringify(this.props.p, null, 2)} onChange={this.handleParams} />
        </Col>
        <Col span={16} className="wrapper">
          <SchemaObject
            onChange={this.onChange}
            map ={'properties'}
            // data={JSON.parse(produce)}
            data={this.props.p}
            onExport={this.export}
          />
          <Button onClick={this.getValue}>导出</Button>
        </Col>
      </Row>
    );
  }
}


export default connect((state) => ({
  p : state.schema.data
}), {
    changeEditorSchemaAction: Model.schema.changeEditorSchemaAction,
    changeNameAction: Model.schema.changeNameAction,
    changeValueAction: Model.schema.changeValueAction,
    addValueAction: Model.schema.addValueAction,
    deleteItemAction: Model.schema.deleteItemAction,
    enableRequireAction: Model.schema.enableRequireAction
  })(jsonSchema)

import React from 'react';
import { Input, Row, Col, Form, Select, Checkbox, Button, Icon, Modal, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import AceEditor from './components/AceEditor/AceEditor.js';
import _ from 'underscore';
import { connect } from 'react-redux';
import Model from './model.js';
import SchemaJson from './components/SchemaComponents/SchemaJson.js';
import PropTypes from 'prop-types';
import { SCHEMA_TYPE } from './utils.js'
import handleSchema from './schema'


class jsonSchema extends React.Component {
  constructor(props) {
    super(props);
   
  }

  static childContextTypes = {
    changeNameAction: PropTypes.func,
    changeValueAction: PropTypes.func,
    enableRequireAction: PropTypes.func,
    addValueAction: PropTypes.func,
    deleteItemAction: PropTypes.func,
    changeTypeAction: PropTypes.func
  };

  getChildContext() {
    return {
      changeNameAction: this.props.changeNameAction,
      changeValueAction: this.props.changeValueAction,
      enableRequireAction: this.props.enableRequireAction,
      addValueAction: this.props.addValueAction,
      deleteItemAction: this.props.deleteItemAction,
      changeTypeAction: this.props.changeTypeAction
    };
  }

  componentDidMount() {
    
  }


  handleParams = e => {
    if(!e.text) return;
    // 将数据map 到store中
    if(e.format !== true){
      return message.error('不是合法的 json 字符串')
    }
    handleSchema(e.jsonData)
    this.props.changeEditorSchemaAction(e.jsonData);
  };

  changeType = (key, value) => {
   
    this.props.changeTypeAction([key], value)
  }

  render() {
    return (
      <Row>
        <Col span={8}>
          <AceEditor
            className="pretty-editor"
            mode="json"
            data={JSON.stringify(this.props.schema, null, 2)}
            onChange={this.handleParams}
          />
        </Col>
        <Col span={16} className="wrapper">
          <Select
            className="type-select-style"
            onChange={e =>
              this.changeType(
                `type`,
                e
              )
            }
            value={this.props.schema.type || 'object'}
          >
            {SCHEMA_TYPE.map((item, index) => {
              return (
                <Option value={item} key={index}>
                  {item}
                </Option>
              );
            })}
          </Select>
          <SchemaJson
            data={this.props.schema}
          />
        </Col>
      </Row>
    );
  }
}

export default connect(
  state => ({
    schema: state.schema.data
  }),
  {
    changeEditorSchemaAction: Model.schema.changeEditorSchemaAction,
    changeNameAction: Model.schema.changeNameAction,
    changeValueAction: Model.schema.changeValueAction,
    enableRequireAction: Model.schema.enableRequireAction,
    addFieldAction: Model.schema.addFieldAction,
    deleteItemAction: Model.schema.deleteItemAction,
    changeTypeAction: Model.schema.changeTypeAction
  }
)(jsonSchema);

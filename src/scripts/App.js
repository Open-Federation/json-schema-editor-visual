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
const GenerateSchema = require('generate-schema/src/schemas/json.js')

class jsonSchema extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  }
  handleOk = () => {
    this.setState({ visible: false })
    this.jsonData = GenerateSchema(this.jsonData)    
    this.props.changeEditorSchemaAction(this.jsonData);
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }

  static childContextTypes = {
    changeNameAction: PropTypes.func,
    changeValueAction: PropTypes.func,
    enableRequireAction: PropTypes.func,
    addFieldAction: PropTypes.func,
    deleteItemAction: PropTypes.func,
    changeTypeAction: PropTypes.func,
    addChildFieldAction: PropTypes.func
  };

  getChildContext() {
    return {
      changeNameAction: this.props.changeNameAction,
      changeValueAction: this.props.changeValueAction,
      enableRequireAction: this.props.enableRequireAction,
      addFieldAction: this.props.addFieldAction,
      deleteItemAction: this.props.deleteItemAction,
      changeTypeAction: this.props.changeTypeAction,
      addChildFieldAction: this.props.addChildFieldAction
    };
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

  handleImportJson = (e)=>{
    if(!e.text) return;    
    this.jsonData = e.jsonData;
  }

  render() {
    const {visible} = this.state;
    return (
      <div>
        <Button onClick={this.showModal}>Import JSON</Button>
        <Modal
            maskClosable={false}
            visible={visible}
            title="Title"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>Return</Button>,
              <Button key="submit" type="primary"  onClick={this.handleOk}>
                Submit
              </Button>
            ]}
          >
            <AceEditor data="" mode="json" onChange={this.handleImportJson} />
        </Modal>


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
      </div>
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
    changeTypeAction: Model.schema.changeTypeAction,
    addChildFieldAction: Model.schema.addChildFieldAction
  }
)(jsonSchema);

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
import { SCHEMA_TYPE } from './utils.js';
import handleSchema from './schema';
const GenerateSchema = require('generate-schema/src/schemas/json.js');
const utils = require('./utils');

class jsonSchema extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      show: true,
      editVisible: false,
      description: '',
      descriptionKey: null
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    this.setState({ visible: false });
    this.jsonData = GenerateSchema(this.jsonData);
    this.props.changeEditorSchemaAction(this.jsonData);
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  static childContextTypes = {
    changeNameAction: PropTypes.func,
    changeValueAction: PropTypes.func,
    enableRequireAction: PropTypes.func,
    addFieldAction: PropTypes.func,
    deleteItemAction: PropTypes.func,
    changeTypeAction: PropTypes.func,
    addChildFieldAction: PropTypes.func,
    setOpenValueAction: PropTypes.func,
    getOpenValue: PropTypes.func
  };

  getChildContext() {
    return {
      changeNameAction: this.props.changeNameAction,
      changeValueAction: this.props.changeValueAction,
      enableRequireAction: this.props.enableRequireAction,
      addFieldAction: this.props.addFieldAction,
      deleteItemAction: this.props.deleteItemAction,
      changeTypeAction: this.props.changeTypeAction,
      addChildFieldAction: this.props.addChildFieldAction,
      setOpenValueAction: this.props.setOpenValueAction,
      getOpenValue: keys => {
        return utils.getData(this.props.open, keys);
      }
    };
  }

  handleParams = e => {
    if (!e.text) return;
    // 将数据map 到store中
    if (e.format !== true) {
      return message.error('不是合法的 json 字符串');
    }
    handleSchema(e.jsonData);
    this.props.changeEditorSchemaAction(e.jsonData);
  };

  changeType = (key, value) => {
    this.props.changeTypeAction([key], value);
  };

  handleImportJson = e => {
    if (!e.text) return;
    this.jsonData = e.jsonData;
  };

  addChildField = key => {
    this.props.addChildFieldAction([key]);
    this.setState({ show: true });
  };

  clickIcon = () => {
    this.setState({ show: !this.state.show });
  };

  changeValue = (key, value) => {
    this.props.changeValueAction(key, value)
  }

  handleEditOk = (e) => {
    
    this.setState({
      editVisible: false,
    });
    this.props.changeValueAction(this.state.descriptionKey, this.state.description)

  }
  handleEditCancel = (e) => {
    
    this.setState({
      editVisible: false,
    });
  }
  showEdit =(prefix, name, value) => {
    console.log(prefix, name, value)
    let descriptionKey = [].concat(prefix, name);
    let description = value
    this.setState({
      editVisible: true,
      description: value,
      descriptionKey

    });
  }

  // 修改备注参数信息
  changeDesc = (e) =>{
    this.setState({
      description:e,
  
    });
  }

  render() {
    const { visible, editVisible, description } = this.state;
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
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Submit
            </Button>
          ]}
        >
          <AceEditor data="" mode="json" onChange={this.handleImportJson} />
        </Modal>
        <Modal
          title="备注"
          visible={editVisible}
          onOk={this.handleEditOk}
          onCancel={this.handleEditCancel}
        >
          
          <TextArea value={description}  placeholder="备注" onChange={(e)=>this.changeDesc(e.target.value)} autosize={{ minRows: 6, maxRows: 10 }}/>
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
          <Col span={16} className="wrapper object-style">
            <Row type="flex" justify="space-around" align="middle">
              <Col span={8} className="col-item name-item">
                <Row type="flex" justify="space-around" align="middle">
                  <Col span={2}>
                    {this.props.schema.type === 'object' ? (
                      <span onClick={this.clickIcon}>
                        <Icon
                          style={{ display: this.state.show ? 'none' : 'block' }}
                          className="icon-object"
                          type="caret-right"
                        />
                        <Icon
                          style={{ display: this.state.show ? 'block' : 'none' }}
                          className="icon-object"
                          type="caret-down"
                        />
                      </span>
                    ) : null}
                  </Col>
                  <Col span={22}>
                    <Input
                      addonAfter={<Checkbox disabled />}
                      disabled
                      value={this.props.schema.title}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={2} className="col-item">
                <Select
                  className="type-select-style"
                  onChange={e => this.changeType(`type`, e)}
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
              </Col>
              <Col span={4} className="col-item">
                <Input
                  addonAfter={<Icon type="edit" />}
                  placeholder="备注"
                  value={this.props.schema.description}
                  onChange={e => this.changeValue(['description'], e.target.value)}
                />
              </Col>
              <Col span={2} className="col-item">
                {this.props.schema.type === 'object' ? (
                  <span onClick={() => this.addChildField('properties')}>
                    <Icon type="plus" className="plus" />
                  </span>
                ) : null}
              </Col>
            </Row>
            {this.state.show && <SchemaJson data={this.props.schema} showEdit={this.showEdit}/>}
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  state => ({
    schema: state.schema.data,
    open: state.schema.open
  }),
  {
    changeEditorSchemaAction: Model.schema.changeEditorSchemaAction,
    changeNameAction: Model.schema.changeNameAction,
    changeValueAction: Model.schema.changeValueAction,
    enableRequireAction: Model.schema.enableRequireAction,
    addFieldAction: Model.schema.addFieldAction,
    deleteItemAction: Model.schema.deleteItemAction,
    changeTypeAction: Model.schema.changeTypeAction,
    addChildFieldAction: Model.schema.addChildFieldAction,
    setOpenValueAction: Model.schema.setOpenValueAction
  }
)(jsonSchema);

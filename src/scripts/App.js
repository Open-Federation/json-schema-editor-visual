import React from 'react';
import {
  Input,
  Row,
  Tooltip,
  Col,
  Form,
  Select,
  Checkbox,
  Button,
  Icon,
  Modal,
  message
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import './index.css'
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
import CustomItem from './components/SchemaComponents/SchemaOther.js'



class jsonSchema extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      show: true,
      editVisible: false,
      description: '',
      descriptionKey: null,
      advVisible: false,
      itemKey: []
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
    this.props.changeValueAction(key, value);
  };

  // 备注弹窗
  handleEditOk = () => {
    this.setState({
      editVisible: false
    });
    this.props.changeValueAction(this.state.descriptionKey, this.state.description);
  };
  handleEditCancel = () => {
    this.setState({
      editVisible: false
    });
  };
  showEdit = (prefix, name, value) => {
    let descriptionKey = [].concat(prefix, name);
    let description = value;
    this.setState({
      editVisible: true,
      description: value,
      descriptionKey
    });
  };

  // 修改备注参数信息
  changeDesc = e => {
    this.setState({
      description: e
    });
  };

  // 高级设置
  handleAdvOk = () => {
    if (this.state.itemKey.length === 0) {
      this.props.changeEditorSchemaAction(this.curItemCustomValue);
    } else {
      this.props.changeValueAction(this.state.itemKey, this.curItemCustomValue);
    }
    this.setState({
      advVisible: false
    });
  };
  handleAdvCancel = () => {
    this.setState({
      advVisible: false
    });
  };
  showAdv = (key, value) => {

    this.setState({
      advVisible: true,
      itemKey: key
    });
    this.curItemCustomValue = value;
  };

  handleImportAdv = e => {
    if (!e.text) return;
    this.curItemCustomValue = e.jsonData;
  };

  render() {
    const { visible, editVisible, description, advVisible, type } = this.state;
    return (
      <div className="json-editor">
        <Button onClick={this.showModal}>Import JSON</Button>
        <Modal
          maskClosable={false}
          visible={visible}
          title="导入JSON"
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
          <TextArea
            value={description}
            placeholder="备注"
            onChange={e => this.changeDesc(e.target.value)}
            autosize={{ minRows: 6, maxRows: 10 }}
          />
        </Modal>
        <Modal
          title="高级设置"
          visible={advVisible}
          onOk={this.handleAdvOk}
          onCancel={this.handleAdvCancel}
        >
          
          <CustomItem data={this.curItemCustomValue}  changeEditor={this.handleImportAdv}/>
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
            <Row type="flex"  align="middle">
              <Col span={12} className="col-item name-item col-item-name">
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
                    <Input addonAfter={<Checkbox disabled />} disabled value="root" />
                  </Col>
                </Row>
              </Col>
              <Col span={4}  className="col-item col-item-type">
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
              <Col span={5}    className="col-item col-item-desc">
                <Input
                  addonAfter={
                    <Icon
                      type="edit"
                      onClick={e => this.showEdit([], 'description', e.target.value)}
                    />
                  }
                  placeholder="备注"
                  value={this.props.schema.description}
                  onChange={e => this.changeValue(['description'], e.target.value)}
                />
              </Col>
              <Col span={3}  className="col-item col-item-setting">
                <span className="adv-set" onClick={() => this.showAdv([], this.props.schema)}>
                  <Tooltip placement="top" title="高级设置">
                    <Icon type="setting" />
                  </Tooltip>
                </span>
                {this.props.schema.type === 'object' ? (
                  <span onClick={() => this.addChildField('properties')}>
                    <Tooltip placement="top" title="添加子节点">
                      <Icon type="plus" className="plus" />
                    </Tooltip>
                  </span>
                ) : null}
              </Col>
            </Row>
            {this.state.show && (
              <SchemaJson
                data={this.props.schema}
                showEdit={this.showEdit}
                showAdv={this.showAdv}
              />
            )}
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

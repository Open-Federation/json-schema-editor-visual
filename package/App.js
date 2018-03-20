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
  message,
  Tabs
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
import './index.css';
import AceEditor from './components/AceEditor/AceEditor.js';
import _ from 'underscore';
import { connect } from 'react-redux';
import SchemaJson from './components/SchemaComponents/SchemaJson.js';
import PropTypes from 'prop-types';
import { SCHEMA_TYPE } from './utils.js';
import handleSchema from './schema';
const GenerateSchema = require('generate-schema/src/schemas/json.js');
const utils = require('./utils');
import CustomItem from './components/SchemaComponents/SchemaOther.js';
import LocalProvider from './components/LocalProvider/index.js';

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
      itemKey: [],
      curItemCustomValue: null
    };

    this.jsonSchemaData = null;
    this.jsonData = null;
  }

  static propTypes = {
    data: PropTypes.string,
    onChange: PropTypes.func,
    showEditor: PropTypes.bool
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    this.setState({ visible: false });
    if (this.importJsonType !== 'schema') {
      if (!this.jsonData) return;
      let jsonData = GenerateSchema(this.jsonData);
      this.props.changeEditorSchemaAction(jsonData);
    } else {
      if (!this.jsonSchemaData) return;
      this.props.changeEditorSchemaAction(this.jsonSchemaData);
    }
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  componentWillReceiveProps(nextProps) {
    if (typeof this.props.onChange === 'function' && this.props.schema !== nextProps.schema) {
      let oldData = JSON.stringify(this.props.schema || '');
      let newData = JSON.stringify(nextProps.schema || '');
      if (oldData !== newData) return this.props.onChange(newData);
    }
    if (this.props.data && this.props.data !== nextProps.data) {
      this.props.changeEditorSchemaAction(JSON.parse(nextProps.data));
    }
  }

  componentWillMount() {
    let data = this.props.data;
    if (!data) {
      data = `{
        "type": "object",
        "title": "empty object",
        "properties":{}
      }`;
    }
    this.props.changeEditorSchemaAction(JSON.parse(data));
  }

  static childContextTypes = {
    changeNameAction: PropTypes.func,
    changeValueAction: PropTypes.func,
    enableRequireAction: PropTypes.func,
    addFieldAction: PropTypes.func,
    deleteItemAction: PropTypes.func,
    changeTypeAction: PropTypes.func,
    addChildFieldAction: PropTypes.func,
    setOpenValueAction: PropTypes.func,
    getOpenValue: PropTypes.func,
    changeCustomValue: PropTypes.func
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
      },
      changeCustomValue: this.changeCustomValue
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
    if (!e.text) {
      return (this.jsonData = null);
    }
    this.jsonData = e.jsonData;
  };

  handleImportJsonSchema = e => {
    if (!e.text) {
      return (this.jsonSchemaData = null);
    }
    this.jsonSchemaData = e.jsonData;
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
      this.props.changeEditorSchemaAction(this.state.curItemCustomValue);
    } else {
      this.props.changeValueAction(this.state.itemKey, this.state.curItemCustomValue);
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
      itemKey: key,
      curItemCustomValue: value
    });
    // this.curItemCustomValue = value;
  };

  changeCustomValue = newValue => {
    this.setState({
      curItemCustomValue: newValue
    });
  };

  changeCheckBox = e => {
    console.log(e);
    this.props.requireAllAction(e, this.props.schema);
  };

  render() {
    const { visible, editVisible, description, advVisible, type } = this.state;

    let checked =
      this.props.schema.type === 'object' || this.props.schema.type === 'array' ? false : true;

    return (
      <div className="json-schema-react-editor">
        <Button className="import-json-button" type="primary" onClick={this.showModal}>
          {LocalProvider('import_json')}
        </Button>
        <Modal
          maskClosable={false}
          visible={visible}
          title={LocalProvider('import_json')}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className="json-schema-react-editor-import-modal"
          okText={LocalProvider('ok')}
          cancelText={LocalProvider('cancel')}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              {LocalProvider('cancel')}
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              {LocalProvider('ok')}
            </Button>
          ]}
        >
          <Tabs
            defaultActiveKey="json"
            onChange={key => {
              this.importJsonType = key;
            }}
          >
            <TabPane tab="JSON" key="json">
              <AceEditor data="" mode="json" onChange={this.handleImportJson} />
            </TabPane>
            <TabPane tab="JSON-SCHEMA" key="schema">
              <AceEditor data="" mode="json" onChange={this.handleImportJsonSchema} />
            </TabPane>
          </Tabs>
        </Modal>
        <Modal
          title={LocalProvider('default')}
          maskClosable={false}
          visible={editVisible}
          onOk={this.handleEditOk}
          onCancel={this.handleEditCancel}
          okText={LocalProvider('ok')}
          cancelText={LocalProvider('cancel')}
        >
          <TextArea
            value={description}
            placeholder={LocalProvider('default')}
            onChange={e => this.changeDesc(e.target.value)}
            autosize={{ minRows: 6, maxRows: 10 }}
          />
        </Modal>
        <Modal
          title={LocalProvider('adv_setting')}
          maskClosable={false}
          visible={advVisible}
          onOk={this.handleAdvOk}
          onCancel={this.handleAdvCancel}
          okText={LocalProvider('ok')}
          cancelText={LocalProvider('cancel')}
          className="json-schema-react-editor-adv-modal"
        >
          <CustomItem data={JSON.stringify(this.state.curItemCustomValue, null, 2)} />
        </Modal>
        <Row>
          {this.props.showEditor && (
            <Col span={8}>
              <AceEditor
                className="pretty-editor"
                mode="json"
                data={JSON.stringify(this.props.schema, null, 2)}
                onChange={this.handleParams}
              />
            </Col>
          )}
          <Col span={this.props.showEditor ? 16 : 24} className="wrapper object-style">
            <Row type="flex" align="middle">
              <Col span={12} className="col-item name-item col-item-name">
                <Row type="flex" justify="space-around" align="middle">
                  <Col span={2}>
                    {this.props.schema.type === 'object' ? (
                      <span className="down-style" onClick={this.clickIcon}>
                        {this.state.show ? (
                          <Icon
                            className="icon-object"
                            type="caret-down"
                          />
                        ) : (
                          <Icon
                            className="icon-object"
                            type="caret-right"
                          />
                        )}
                      </span>
                    ) : null}
                  </Col>
                  <Col span={22}>
                    <Input
                      addonAfter={
                        <Tooltip placement="top" title={LocalProvider('checked_all')}>
                          <Checkbox
                          disabled={checked}
                          onChange={e => this.changeCheckBox(e.target.checked)}
                        />
                        </Tooltip>
                        
                      }
                      disabled
                      value="root"
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={4} className="col-item col-item-type">
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
              <Col span={5} className="col-item col-item-desc">
                <Input
                  addonAfter={
                    <Icon
                      type="edit"
                      onClick={e => this.showEdit([], 'description', e.target.value)}
                    />
                  }
                  placeholder={LocalProvider('description')}
                  value={this.props.schema.description}
                  onChange={e => this.changeValue(['description'], e.target.value)}
                />
              </Col>
              <Col span={3} className="col-item col-item-setting">
                <span className="adv-set" onClick={() => this.showAdv([], this.props.schema)}>
                  <Tooltip placement="top" title={LocalProvider('adv_setting')}>
                    <Icon type="setting" />
                  </Tooltip>
                </span>
                {this.props.schema.type === 'object' ? (
                  <span onClick={() => this.addChildField('properties')}>
                    <Tooltip placement="top" title={LocalProvider('add_child_node')}>
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

export default Model =>
  connect(
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
      setOpenValueAction: Model.schema.setOpenValueAction,
      requireAllAction: Model.schema.requireAllAction
    }
  )(jsonSchema);

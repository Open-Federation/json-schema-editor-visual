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
  Modal,
  message,
  Tabs,
} from 'antd';
import {
  QuestionCircleOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  EditOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
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
import { SCHEMA_TYPE, debounce } from './utils.js';
import handleSchema from './schema';
const GenerateSchema = require('generate-schema/src/schemas/json.js');
const utils = require('./utils');
import CustomItem from './components/SchemaComponents/SchemaOther.js';
import LocalProvider from './components/LocalProvider/index.js';
import MockSelect from './components/MockSelect/index.js';



class jsonSchema extends React.Component {
  constructor(props) {
    super(props);
    this.alterMsg = debounce(this.alterMsg, 2000);
    this.state = {
      visible: false,
      show: true,
      editVisible: false,
      description: '',
      descriptionKey: null,
      advVisible: false,
      itemKey: [],
      curItemCustomValue: null,
      checked: false,
      editorModalName: '', // 弹窗名称desctiption | mock
      mock: ''
    };
    this.Model = this.props.Model.schema;
    this.jsonSchemaData = null;
    this.jsonData = null;
  }

  // json 导入弹窗
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    if (this.importJsonType !== 'schema') {
      if (!this.jsonData) {
        return message.error('json 数据格式有误');
      }

      let jsonData = GenerateSchema(this.jsonData);
      this.Model.changeEditorSchemaAction({ value: jsonData });
    } else {
      if (!this.jsonSchemaData) {
        return message.error('json 数据格式有误');
      }
      this.Model.changeEditorSchemaAction({ value: this.jsonSchemaData });
    }
    this.setState({ visible: false });
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
      this.Model.changeEditorSchemaAction({ value: JSON.parse(nextProps.data) });
    }
  }

  componentWillMount() {
    let data = this.props.data;
    if (!data) {
      data = `{
        "type": "object",
        "title": "title",
        "properties":{}
      }`;
    }
    this.Model.changeEditorSchemaAction({ value: JSON.parse(data) });
  }

  getChildContext() {
    return {
      getOpenValue: keys => {
        return utils.getData(this.props.open, keys);
      },
      changeCustomValue: this.changeCustomValue,
      Model: this.props.Model,
      isMock: this.props.isMock
    };
  }

  alterMsg = () => {
    // return message.error(LocalProvider('valid_json'));
  };

  // AceEditor 中的数据
  handleParams = e => {
    if (!e.text) return;
    // 将数据map 到store中
    if (e.format !== true) {
      return this.alterMsg();
    }
    handleSchema(e.jsonData);
    this.Model.changeEditorSchemaAction({
      value: e.jsonData
    });
  };

  // 修改数据类型
  changeType = (key, value) => {
    this.Model.changeTypeAction({ key: [key], value });
  };

  handleImportJson = e => {
    if (!e.text || e.format !== true) {
      return (this.jsonData = null);
    }
    this.jsonData = e.jsonData;
  };

  handleImportJsonSchema = e => {
    if (!e.text || e.format !== true) {
      return (this.jsonSchemaData = null);
    }
    this.jsonSchemaData = e.jsonData;
  };
  // 增加子节点
  addChildField = key => {
    this.Model.addChildFieldAction({ key: [key] });
    this.setState({ show: true });
  };

  clickIcon = () => {
    this.setState({ show: !this.state.show });
  };

  // 修改备注信息
  changeValue = (key, value) => {
    if (key[0] === 'mock') {
      value = value ? { mock: value } : '';
    }
    this.Model.changeValueAction({ key, value });
  };

  // 备注/mock弹窗 点击ok 时
  handleEditOk = name => {
    this.setState({
      editVisible: false
    });
    let value = this.state[name];
    if (name === 'mock') {
      value = value ? { mock: value } : '';
    }
    this.Model.changeValueAction({ key: this.state.descriptionKey, value });
  };

  handleEditCancel = () => {
    this.setState({
      editVisible: false
    });
  };
  /*
    展示弹窗modal
    prefix: 节点前缀信息
    name: 弹窗的名称 ['description', 'mock']
    value: 输入值
    type: 如果当前字段是object || array showEdit 不可用
  */
  showEdit = (prefix, name, value, type) => {
    if (type === 'object' || type === 'array') {
      return;
    }
    let descriptionKey = [].concat(prefix, name);

    value = name === 'mock' ? (value ? value.mock : '') : value;
    this.setState({
      editVisible: true,
      [name]: value,
      descriptionKey,
      editorModalName: name
    });
  };

  // 修改备注/mock参数信息
  changeDesc = (e, name) => {
    this.setState({
      [name]: e
    });
  };

  // 高级设置
  handleAdvOk = () => {
    if (this.state.itemKey.length === 0) {
      this.Model.changeEditorSchemaAction({
        value: this.state.curItemCustomValue
      });
    } else {
      this.Model.changeValueAction({
        key: this.state.itemKey,
        value: this.state.curItemCustomValue
      });
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
      curItemCustomValue: value // 当前节点的数据信息
    });
  };

  //  修改弹窗中的json-schema 值
  changeCustomValue = newValue => {
    this.setState({
      curItemCustomValue: newValue
    });
  };

  changeCheckBox = e => {
    this.setState({ checked: e });
    this.Model.requireAllAction({ required: e, value: this.props.schema });
  };

  render() {
    const {
      visible,
      editVisible,
      description,
      advVisible,
      type,
      checked,
      editorModalName
    } = this.state;
    const { schema } = this.props;

    let disabled =
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
          okText={'ok'}
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
          title={
            <div>
              {LocalProvider(editorModalName)}
              &nbsp;
              {editorModalName === 'mock' && (
                <Tooltip title={LocalProvider('mockLink')}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/YMFE/json-schema-editor-visual/issues/38"
                  >
                    <QuestionCircleOutlined />
                  </a>
                </Tooltip>
              )}
            </div>
          }
          maskClosable={false}
          visible={editVisible}
          onOk={() => this.handleEditOk(editorModalName)}
          onCancel={this.handleEditCancel}
          okText={LocalProvider('ok')}
          cancelText={LocalProvider('cancel')}
        >
          <TextArea
            value={this.state[editorModalName]}
            placeholder={LocalProvider(editorModalName)}
            onChange={e => this.changeDesc(e.target.value, editorModalName)}
            autosize={{ minRows: 6, maxRows: 10 }}
          />
        </Modal>

        {advVisible && (
          <Modal
            title={LocalProvider('adv_setting')}
            maskClosable={false}
            visible={advVisible}
            onOk={this.handleAdvOk}
            onCancel={this.handleAdvCancel}
            okText={LocalProvider('ok')}
            width={780}
            cancelText={LocalProvider('cancel')}
            className="json-schema-react-editor-adv-modal"
          >
            <CustomItem data={JSON.stringify(this.state.curItemCustomValue, null, 2)} />
          </Modal>
        )}

        <Row>
          {this.props.showEditor && (
            <Col span={8}>
              <AceEditor
                className="pretty-editor"
                mode="json"
                data={JSON.stringify(schema, null, 2)}
                onChange={this.handleParams}
              />
            </Col>
          )}
          <Col span={this.props.showEditor ? 16 : 24} className="wrapper object-style">
            <Row type="flex" align="middle">
              <Col span={8} className="col-item name-item col-item-name">
                <Row type="flex" justify="space-around" align="middle">
                  <Col span={2} className="down-style-col">
                    {schema.type === 'object' ? (
                      <span className="down-style" onClick={this.clickIcon}>
                        {this.state.show ? (
                          <CaretDownOutlined className="icon-object" type="caret-down" />
                        ) : (
                          <CaretRightOutlined className="icon-object" type="caret-right" />
                        )}
                      </span>
                    ) : null}
                  </Col>
                  <Col span={22}>
                    <Input
                      addonAfter={
                        <Tooltip placement="top" title={'checked_all'}>
                          <Checkbox
                            checked={checked}
                            disabled={disabled}
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
              <Col span={3} className="col-item col-item-type">
                <Select
                  className="type-select-style"
                  onChange={e => this.changeType(`type`, e)}
                  value={schema.type || 'object'}
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
              {this.props.isMock && (
                <Col span={3} className="col-item col-item-mock">
                  <MockSelect
                    schema={schema}
                    showEdit={() => this.showEdit([], 'mock', schema.mock, schema.type)}
                    onChange={value => this.changeValue(['mock'], value)}
                  />
                </Col>
              )}
              <Col span={this.props.isMock ? 4 : 5} className="col-item col-item-mock">
                <Input
                  addonAfter={
                    <EditOutlined
                      type="edit"
                      onClick={() =>
                        this.showEdit([], 'title', this.props.schema.title)
                      }
                    />
                  }
                  placeholder={'Title'}
                  value={this.props.schema.title}
                  onChange={e => this.changeValue(['title'], e.target.value)}
                />
              </Col>
              <Col span={this.props.isMock ? 4 : 5} className="col-item col-item-desc">
                <Input
                  addonAfter={
                    <EditOutlined
                      type="edit"
                      onClick={() =>
                        this.showEdit([], 'description', this.props.schema.description)
                      }
                    />
                  }
                  placeholder={'description'}
                  value={schema.description}
                  onChange={e => this.changeValue(['description'], e.target.value)}
                />
              </Col>
              <Col span={2} className="col-item col-item-setting">
                <span className="adv-set" onClick={() => this.showAdv([], this.props.schema)}>
                  <Tooltip placement="top" title={LocalProvider('adv_setting')}>
                    <SettingOutlined type="setting" />
                  </Tooltip>
                </span>
                {schema.type === 'object' ? (
                  <span onClick={() => this.addChildField('properties')}>
                    <Tooltip placement="top" title={LocalProvider('add_child_node')}>
                      <PlusOutlined type="plus" className="plus" />
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

jsonSchema.childContextTypes = {
  getOpenValue: PropTypes.func,
  changeCustomValue: PropTypes.func,
  Model: PropTypes.object,
  isMock: PropTypes.bool
};

jsonSchema.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
  showEditor: PropTypes.bool,
  isMock: PropTypes.bool,
  Model: PropTypes.object
};

export default connect(state => ({
  schema: state.schema.data,
  open: state.schema.open
}))(jsonSchema);

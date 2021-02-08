import React, { Component, PureComponent } from 'react';
import {
  Dropdown,
  Menu,
  Row,
  Col,
  Select,
  Checkbox,
  Icon,
  Input,
  message,
  Tooltip
} from 'antd';
import FieldInput from './FieldInput'

import {
  changeEditorSchema, changeType, addChildField, changeValue, requireAll,
  setOpenValue, changeName, deleteItem, enableRequire, addField
} from '../../redux/actions';

const Option = Select.Option;
import './schemaJson.css';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from '../../utils.js';
import LocaleProvider from '../LocalProvider/index.js';
import MockSelect from '../MockSelect/index.js';

const mapping = (name, data, showEdit, showAdv) => {
  switch (data.type) {
    case 'array':
      return <SchemaArray prefix={name} data={data} showEdit={showEdit} showAdv={showAdv} />;
    case 'object':
      let nameArray = [].concat(name, 'properties');
      return <SchemaObject prefix={nameArray} data={data} showEdit={showEdit} showAdv={showAdv} />;
    default:
      return null;
  }
};

class SchemaArrayComponent extends PureComponent {
  constructor(props, context) {
    super(props);
    this._tagPaddingLeftStyle = {};
  }

  componentWillMount() {
    const { prefix } = this.props;
    let length = prefix.filter(name => name != 'properties').length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`
    };
  }

  getPrefix() {
    return [].concat(this.props.prefix, 'items');
  }

  // 修改数据类型
  handleChangeType = value => {
    let prefix = this.getPrefix();
    let keys = [].concat(prefix, 'type');
    this.props.changeType({ keys, value });
  };

  // 修改备注信息
  handleChangeDesc = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `description`);
    let value = e.target.value;
    this.props.changeValue({ key, value });
  };

  // 修改mock信息
  handleChangeMock = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `mock`);
    let value = e ? { mock: e } : '';
    this.props.changeValue({ key, value });
  };

  handleChangeTitle = e =>{
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `title`);
    let value = e.target.value;
    this.props.changeValue({ key, value });
  }

  // 增加子节点
  handleAddChildField = () => {
    let prefix = this.getPrefix();
    let keyArr = [].concat(prefix, 'properties');
    this.props.addChildField({ key: keyArr });
    this.props.setOpenValue({ key: keyArr, value: true });
  };

  handleClickIcon = () => {
    let prefix = this.getPrefix();
    // 数据存储在 properties.name.properties下
    let keyArr = [].concat(prefix, 'properties');
    this.props.setOpenValue({ key: keyArr });
  };

  handleShowEdit = (name, type) => {
    let prefix = this.getPrefix();
    this.props.showEdit(prefix, name, this.props.data.items[name], type);
  };

  handleShowAdv = () => {
    this.props.showAdv(this.getPrefix(), this.props.data.items);
  };

  getOpenValue = jsonPath => {
    return _.get(this.props.open, jsonPath);
  };

  render() {
    const { data, prefix, showEdit, showAdv } = this.props;
    const items = data.items;
    let prefixArray = [].concat(prefix, 'items');

    let prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);
    let showIcon = this.getOpenValue([prefixArrayStr]);
    return (
      !_.isUndefined(data.items) && (
        <div className="array-type">
          <Row className="array-item-type" type="flex" justify="space-around" align="middle">
            <Col
              span={8}
              className="col-item name-item col-item-name"
              style={this.__tagPaddingLeftStyle}
            >
              <Row type="flex" justify="space-around" align="middle">
                <Col span={2} className="down-style-col">
                  {items.type === 'object' ? (
                    <span className="down-style" onClick={this.handleClickIcon}>
                      {showIcon ? (
                        <Icon className="icon-object" type="caret-down" />
                      ) : (
                        <Icon className="icon-object" type="caret-right" />
                      )}
                    </span>
                  ) : null}
                </Col>
                <Col span={22}>
                  <Input addonAfter={<Checkbox disabled />} disabled value="Items" />
                </Col>
              </Row>
            </Col>
            <Col span={3} className="col-item col-item-type">
              <Select
                name="itemtype"
                className="type-select-style"
                onChange={this.handleChangeType}
                value={items.type}
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
            {this.context.isMock && (
              <Col span={3} className="col-item col-item-mock">
                
                <MockSelect
                  schema={items}
                  showEdit={() => this.handleShowEdit('mock', items.type)}
                  onChange={this.handleChangeMock}
                />
              </Col>
            )}
            <Col span={this.context.isMock ? 4 : 5} className="col-item col-item-mock">
              <Input
                addonAfter={<Icon type="edit" onClick={() => this.handleShowEdit('title')} />}
                placeholder={LocaleProvider('title')}
                value={items.title}
                onChange={this.handleChangeTitle}
              />
            </Col>
            <Col span={this.context.isMock ? 4 : 5} className="col-item col-item-desc">
              <Input
                addonAfter={<Icon type="edit" onClick={() => this.handleShowEdit('description')} />}
                placeholder={LocaleProvider('description')}
                value={items.description}
                onChange={this.handleChangeDesc}
              />
            </Col>
            <Col span={this.context.isMock ? 2: 3} className="col-item col-item-setting">
              <span className="adv-set" onClick={this.handleShowAdv}>
                <Tooltip placement="top" title={LocaleProvider('adv_setting')}>
                  <Icon type="setting" />
                </Tooltip>
              </span>

              {items.type === 'object' ? (
                <span onClick={this.handleAddChildField}>
                  <Tooltip placement="top" title={LocaleProvider('add_child_node')}>
                    <Icon type="plus" className="plus" />
                  </Tooltip>
                </span>
              ) : null}
            </Col>
          </Row>
          <div className="option-formStyle">{mapping(prefixArray, items, showEdit, showAdv)}</div>
        </div>
      )
    );
  }
}

const SchemaArray = connect(({ open }) => { return { open }}, {
  changeEditorSchema, changeType, addChildField, changeValue, requireAll,
  setOpenValue, changeName, deleteItem, enableRequire, addField
})(SchemaArrayComponent);

class SchemaItemComponent extends PureComponent {
  constructor(props, context) {
    super(props);
    this._tagPaddingLeftStyle = {};
    // this.num = 0
  }

  componentWillMount() {
    const { prefix } = this.props;
    let length = prefix.filter(name => name != 'properties').length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`
    };
  }

  getPrefix() {
    return [].concat(this.props.prefix, this.props.name);
  }

  // 修改节点字段名
  handleChangeName = e => {
    const { data, prefix, name } = this.props;
    let value = e.target.value;

    if (data.properties[value] && typeof data.properties[value] === 'object') {
      return message.error(`The field "${value}" already exists.`);
    }

    this.props.changeName({ keys: prefix, name, value });
  };

  // 修改备注信息
  handleChangeDesc = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'description');
    let value = e.target.value;
    this.props.changeValue({ key, value });
  };

  // 修改mock 信息
  handleChangeMock = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `mock`);
    let value = e ? { mock: e } : '';
    this.props.changeValue({ key, value });
  };

  handleChangeTitle = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `title`);
    let value = e.target.value;
    this.props.changeValue({ key, value });
  }

  // 修改数据类型
  handleChangeType = e => {
    let prefix = this.getPrefix();
    let keys = [].concat(prefix, 'type');
    this.props.changeType({ keys, value: e });
  };

  handleDeleteItem = () => {
    const { prefix, name } = this.props;
    let nameArray = this.getPrefix();
    this.props.deleteItem({ keys: nameArray });
    this.props.enableRequire({ keys: prefix, name, required: false });
  };
  /*
  展示备注编辑弹窗
  editorName: 弹窗名称 ['description', 'mock']
  type: 如果当前字段是object || array showEdit 不可用
  */
  handleShowEdit = (editorName, type) => {
    const { data, name, showEdit } = this.props;

    showEdit(this.getPrefix(), editorName, data.properties[name][editorName], type);
  };

  handleShowAdv = () => {
    const { data, name, showAdv } = this.props;
    showAdv(this.getPrefix(), data.properties[name]);
  };

  //  增加子节点
  handleAddField = () => {
    const { prefix, name } = this.props;
    this.props.addField({ keys: prefix, name });
  };

  // 控制三角形按钮
  handleClickIcon = () => {
    let prefix = this.getPrefix();
    // 数据存储在 properties.xxx.properties 下
    let keyArr = [].concat(prefix, 'properties');
    this.props.setOpenValue({ key: keyArr });
  };

  // 修改是否必须
  handleEnableRequire = e => {
    const { prefix, name } = this.props;
    let required = e.target.checked;
    this.props.enableRequire({ keys: prefix, name, required });
  };

  render() {
    let { name, data, prefix, open, showEdit, showAdv } = this.props;
    let value = data.properties[name];
    let prefixArray = [].concat(prefix, name);
    let show = _.get(open, prefix);
    let showIcon = _.get(open, [].concat(prefix, name, 'properties'));
    return show ? (
      <div>
        <Row type="flex" justify="space-around" align="middle">
          <Col
            span={8}
            className="col-item name-item col-item-name"
            style={this.__tagPaddingLeftStyle}
          >
            <Row type="flex" justify="space-around" align="middle">
              <Col span={2} className="down-style-col">
                {value.type === 'object' ? (
                  <span className="down-style" onClick={this.handleClickIcon}>
                    {showIcon ? (
                      <Icon className="icon-object" type="caret-down" />
                    ) : (
                      <Icon className="icon-object" type="caret-right" />
                    )}
                  </span>
                ) : null}
              </Col>
              <Col span={22}>
                <FieldInput
                  addonAfter={
                    <Tooltip placement="top" title={LocaleProvider('required')}>
                      <Checkbox
                        onChange={this.handleEnableRequire}
                        checked={
                          _.isUndefined(data.required) ? false : data.required.indexOf(name) != -1
                        }
                      />
                    </Tooltip>
                  }
                  onChange={this.handleChangeName}
                  value={name}
                />
              </Col>
            </Row>
          </Col>


          <Col span={3} className="col-item col-item-type">
            <Select
              className="type-select-style"
              onChange={this.handleChangeType}
              value={value.type}
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


          {this.context.isMock && (
            <Col span={3} className="col-item col-item-mock">
              <MockSelect
                schema={value}
                showEdit={() => this.handleShowEdit('mock', value.type)}
                onChange={this.handleChangeMock}
              />
            </Col>
          )}

          <Col span={this.context.isMock ? 4 : 5} className="col-item col-item-mock">
            <Input
              addonAfter={<Icon type="edit" onClick={() => this.handleShowEdit('title')} />}
              placeholder={LocaleProvider('title')}
              value={value.title}
              onChange={this.handleChangeTitle}
            />
          </Col>

          <Col span={this.context.isMock ? 4 : 5} className="col-item col-item-desc">
            <Input
              addonAfter={<Icon type="edit" onClick={() => this.handleShowEdit('description')} />}
              placeholder={LocaleProvider('description')}
              value={value.description}
              onChange={this.handleChangeDesc}
            />
          </Col>

          
          <Col span={this.context.isMock ? 2: 3}  className="col-item col-item-setting">
            <span className="adv-set" onClick={this.handleShowAdv}>
              <Tooltip placement="top" title={LocaleProvider('adv_setting')}>
                <Icon type="setting" />
              </Tooltip>
            </span>
            <span className="delete-item" onClick={this.handleDeleteItem}>
              <Icon type="close" className="close" />
            </span>
            {value.type === 'object' ? (
              <DropPlus prefix={prefix} name={name} />
            ) : (
              <span onClick={this.handleAddField}>
                <Tooltip placement="top" title={LocaleProvider('add_sibling_node')}>
                  <Icon type="plus" className="plus" />
                </Tooltip>
              </span>
            )}
          </Col>
        </Row>
        <div className="option-formStyle">{mapping(prefixArray, value, showEdit, showAdv)}</div>
      </div>
    ) : null;
  }
}

SchemaItemComponent.contextTypes = {
  isMock: PropTypes.bool
};

const SchemaItem = connect(({ open }) => { return { open }}, {
  changeEditorSchema, changeType, addChildField, changeValue, requireAll,
  setOpenValue, changeName, deleteItem, enableRequire, addField
})(SchemaItemComponent);

class SchemaObjectComponent extends Component {
  render() {
    const { data, prefix, showEdit, showAdv } = this.props;
    return (
      <div className="object-style">
        {Object.keys(data.properties).map((name, index) => {
          return (
            <SchemaItem
              key={index}
              data={data}
              name={name}
              prefix={prefix}
              showEdit={showEdit}
              showAdv={showAdv}
            />
          );
        })}
      </div>
    );
  }
}

const SchemaObject = connect(
  ({ schema }) => {return { schema }}
)(SchemaObjectComponent);

const DropPlusComponent = (props, context) => {
  const { prefix, name, addField, setOpenValue, addChildField} = props;
  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={() => addField({ keys: prefix, name })}>
          {LocaleProvider('sibling_node')}
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={() => {
            setOpenValue({ key: [].concat(prefix, name, 'properties'), value: true });
            addChildField({ key: [].concat(prefix, name, 'properties') });
          }}
        >
          {LocaleProvider('child_node')}
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Tooltip placement="top" title={LocaleProvider('add_node')}>
      <Dropdown overlay={menu}>
        <Icon type="plus" className="plus" />
      </Dropdown>
    </Tooltip>
  );
};

const DropPlus = connect(null, { addField, addChildField, setOpenValue })(DropPlusComponent);

const SchemaJsonComponent = ({ schema, showEdit, showAdv }) => {
  const item = mapping([], schema, showEdit, showAdv);
  return <div className="schema-content">{item}</div>;
};

const SchemaJson = connect(({ schema, open }) => {
  return {schema, open};
})(SchemaJsonComponent);

export default SchemaJson;

import React from 'react';
import { Dropdown, Menu, Input, Row, Col, Form, Select, Checkbox, Button, Icon, Modal, message, Tooltip } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import './schemaJson.css';
import _ from 'underscore';
import { connect } from 'react-redux';
import Model from '../../model.js';
import PropTypes from 'prop-types';
import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from '../../utils.js';
const InputGroup = Input.Group;
import LocaleProvider from '../LocalProvider/index.js'

const mapping = (name, data, showEdit, showAdv) => {
  switch (data.type) {
    case 'array':
      return <SchemaArray prefix={name} data={data} showEdit={showEdit} showAdv={showAdv} />;
      break;
    case 'object':
      let nameArray = [].concat(name, 'properties');
      return <SchemaObject prefix={nameArray} data={data} showEdit={showEdit} showAdv={showAdv} />;
      break;
    default:
      return null;
    // return <SchemaOther dataSource={data}/>
  }
};

const changeType = (prefix, type, value, change) => {
  let key = [].concat(prefix, type);
  change(key, value);
};

const changeValue = (prefix, type, value, change) => {
  let key = [].concat(prefix, type);
  change(key, value);
};
const changeName = (value, prefix, name, change) => {
  change(value, prefix, name);  
};

const enableRequire = (prefix, name, required, change) => {
  change(prefix, name, required);
};

const deleteItem = (prefix, name, change) => {
  let nameArray = [].concat(prefix, name);
  change.deleteItemAction(nameArray);
  change.enableRequireAction(prefix, name, false);
};

const addField = (prefix, name, change) => {
  change(prefix, name);
};

const addChildField = (prefix, name, change) => {
  let keyArr = [].concat(prefix, name, 'properties');
  change.addChildFieldAction(keyArr);
  change.setOpenValueAction(keyArr, true);
};

const clickIcon = (prefix, change) => {
  // 数据存储在 properties.name.properties下
  let keyArr = [].concat(prefix, 'properties');
  change(keyArr);
};


const SchemaArray = (props, context) => {
  const { data, prefix, showEdit, showAdv } = props;
  const items = data.items;
  let prefixArray = [].concat(prefix, 'items');
  const optionForm = mapping(prefixArray, items, showEdit, showAdv);
  let length = prefix.filter(name => name != 'properties').length;

  let prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);
  let showIcon = context.getOpenValue([prefixArrayStr]);

  return (
    !_.isUndefined(data.items) && (
      <div className="array-type">
        <Row className="array-item-type" type="flex" justify="space-around" align="middle">
          <Col
            span={12}
            className="col-item name-item col-item-name"
            style={{ paddingLeft: `${20 * (length + 1)}px` }}
          >
            <Row type="flex" justify="space-around" align="middle">
              <Col span={2}>
                {items.type === 'object' ? (
                  <span className="down-style" onClick={() => clickIcon(prefixArray, context.setOpenValueAction)}>
                    <Icon
                      style={{ display: showIcon ? 'none' : 'block' }}
                      className="icon-object"
                      type="caret-right"
                    />
                    <Icon
                      style={{ display: showIcon ? 'block' : 'none' }}
                      className="icon-object"
                      type="caret-down"
                    />
                  </span>
                ) : null}
              </Col>
              <Col span={22}>
                <Input addonAfter={<Checkbox disabled />} disabled value="Items" />
              </Col>
            </Row>
          </Col>
          <Col span={4} className="col-item col-item-type">
            <Select
              name="itemtype"
              className="type-select-style"
              onChange={e => changeType(prefixArray, `type`, e, context.changeTypeAction)}
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
          <Col span={5} className="col-item col-item-desc">
            <Input
              addonAfter={
                <Icon
                  type="edit"
                  onClick={() => showEdit(prefixArray, `description`, items.description)}
                />
              }
              placeholder={LocaleProvider('description')}
              value={items.description}
              onChange={e =>
                changeValue(prefixArray, `description`, e.target.value, context.changeValueAction)
              }
            />
          </Col>
          <Col span={3} className="col-item col-item-setting">
            <span className="adv-set" onClick={() => showAdv(prefixArray, items)}>
              <Tooltip placement="top" title={LocaleProvider('adv_setting')}>
                <Icon type="setting" />
              </Tooltip>
            </span>

            {items.type === 'object' ? (
              <span onClick={() => addChildField(prefix, 'items', context)}>
                <Tooltip placement="top" title={LocaleProvider('add_child_node')}>
                  <Icon type="plus" className="plus" />
                </Tooltip>
              </span>
            ) : null}
          </Col>
        </Row>
        <div className="option-formStyle">{optionForm}</div>
      </div>
    )
  );
};

SchemaArray.contextTypes = {
  changeTypeAction: PropTypes.func,
  changeValueAction: PropTypes.func,
  addChildFieldAction: PropTypes.func,
  setOpenValueAction: PropTypes.func,
  getOpenValue: PropTypes.func
};


const SchemaObject = (props, context) => {
  const { data, prefix, showEdit, showAdv } = props;

  return (
    <div className="object-style">
      {Object.keys(data.properties).map((name, index) => {
        let value = data.properties[name];
        let copiedState = value;
        let prefixArray = [].concat(prefix, name);

        let length = prefix.filter(name => name != 'properties').length;

        let optionForm = mapping(prefixArray, copiedState, showEdit, showAdv);

        let prefixStr = prefix.join(JSONPATH_JOIN_CHAR);
        let prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);
        let show = context.getOpenValue([prefixStr]);
        let showIcon = context.getOpenValue([prefixArrayStr]);

        return (
          show && (
            <div data-index={index} key={index}>
              <Row type="flex" justify="space-around" align="middle">
                <Col
                  span={12}
                  className="col-item name-item col-item-name"
                  style={{ paddingLeft: `${20 * (length + 1)}px` }}
                >
                  <Row type="flex" justify="space-around" align="middle">
                    <Col span={2}>
                      {value.type === 'object' ? (
                        <span  className="down-style" onClick={() => clickIcon(prefixArray, context.setOpenValueAction)}>
                          <Icon
                            style={{ display: showIcon ? 'none' : 'block' }}
                            className="icon-object"
                            type="caret-right"
                          />
                          <Icon
                            style={{ display: showIcon ? 'block' : 'none' }}
                            className="icon-object"
                            type="caret-down"
                          />
                        </span>
                      ) : null}
                    </Col>
                    <Col span={22}>
                      <Input
                        addonAfter={
                          <Checkbox
                            onChange={e =>
                              enableRequire(
                                prefix,
                                name,
                                e.target.checked,
                                context.enableRequireAction
                              )
                            }
                            checked={
                              _.isUndefined(data.required)
                                ? false
                                : data.required.indexOf(name) != -1
                            }
                          />
                        }
                        onChange={e =>{
                          if(data.properties[e.target.value] && typeof data.properties[e.target.value] === 'object'){
                            return message.error(`The field "${e.target.value}" already exists.`)
                          }
                          changeName(e.target.value, prefix, name, context.changeNameAction)
                        }}
                        value={name}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={4} className="col-item col-item-type">
                  <Select
                    className="type-select-style"
                    onChange={e => changeType(prefixArray, 'type', e, context.changeTypeAction)}
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
                <Col span={5} className="col-item col-item-desc">
                  <Input
                    addonAfter={
                      <Icon
                        type="edit"
                        onClick={() => showEdit(prefixArray, `description`, value.description)}
                      />
                    }
                    placeholder={LocaleProvider('description')}
                    value={value.description}
                    onChange={e =>
                      changeValue(
                        prefixArray,
                        `description`,
                        e.target.value,
                        context.changeValueAction
                      )
                    }
                  />
                </Col>
                <Col span={3} className="col-item col-item-setting">
                  <span className="adv-set" onClick={() => showAdv(prefixArray, value)}>
                    <Tooltip placement="top" title={LocaleProvider('adv_setting')}>
                      <Icon type="setting" />
                    </Tooltip>
                  </span>
                  <span className="delete-item" onClick={() => deleteItem(prefix, name, context)}>
                    <Icon type="close" className="close" />
                  </span>
                  {value.type === 'object' ? (
                    <DropPlus prefix={prefix} name={name} add={context} />
                  ) : (
                    <span onClick={() => addField(prefix, name, context.addFieldAction)}>
                      <Tooltip placement="top" title={LocaleProvider('add_sibling_node')}>
                        <Icon type="plus" className="plus" />
                      </Tooltip>
                    </span>
                  )}
                </Col>
              </Row>
              <div className="option-formStyle">{optionForm}</div>
            </div>
          )
        );
      })}
    </div>
  );
};

SchemaObject.contextTypes = {
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

const DropPlus = props => {
  const { prefix, name, add } = props;
  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={() => addField(prefix, name, add.addFieldAction)}>{LocaleProvider('sibling_node')}</span>
      </Menu.Item>
      <Menu.Item>
        <span onClick={() => addChildField(prefix, name, add)}>{LocaleProvider('child_node')}</span>
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

const SchemaJson = props => {
  const item = mapping([], props.data, props.showEdit, props.showAdv);
  return <div className="schema-content">{item}</div>;
};

export default SchemaJson;

import React, { PureComponent } from 'react';
import {
  Dropdown,
  Menu,
  Input,
  Row,
  Col,
  Form,
  Select,
  Checkbox,
  Button,
  Icon,
  Modal,
  message,
  Tooltip
} from 'antd';
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
import LocaleProvider from '../LocalProvider/index.js';
import utils from '../../utils'

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
  }
};


class SchemaArray extends PureComponent {
  static contextTypes={
    setOpenValueAction: PropTypes.func,
    getOpenValue: PropTypes.func
  }

  constructor(props) {
    super(props);
    this._tagPaddingLeftStyle = {};
  }

  componentWillMount() {
    const { prefix } = this.props;
    let length = prefix.filter(name => name != 'properties').length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`
    }
  }

  changeType = (prefix, value) => {
    let key = [].concat(prefix, 'type');
    utils.userModel.changeTypeAction({key, value});
  };

  handleChangeType = (value) => {
    let prefix = this.getPrefix()
    this.changeType(prefix, value)
  }

  changeValue = (prefix, type, value, change) => {
    let key = [].concat(prefix, type);
    utils.userModel.changeValueAction({key, value});
  };

  handleChangeValue = (e) => {
    let prefix = this.getPrefix()
    this.changeValue(prefix, `description`, e.target.value)
  }

  addChildField = (prefix, name, change) => {
    let keyArr = [].concat(prefix, name, 'properties');
    utils.userModel.addChildFieldAction({key:keyArr});
    utils.userModel.setOpenValueAction({key: keyArr, value: true});
  };

  getPrefix() {
    return [].concat(this.props.prefix, 'items');
  }


  clickIcon = prefix => {
    // 数据存储在 properties.name.properties下
    let keyArr = [].concat(prefix, 'properties');
    utils.userModel.setOpenValueAction({key: keyArr});
  };

  handleClickIcon = () => {
    let prefix = this.getPrefix()
    this.clickIcon(prefix)
  }

  handleShowEdit = () => {
    let prefix = this.getPrefix()
    this.props.showEdit(prefix, `description`, this.props.data.items.description)
  }

  handleShowAdv = () => {
    this.props.showAdv(this.getPrefix(), this.props.data.items)
  }

  handleAddChildField = () => {
    this.addChildField(this.getPrefix(), 'items')
  }

  render() {
    const { data, prefix, showEdit, showAdv } = this.props;
    const items = data.items;
    let prefixArray = [].concat(prefix, 'items');
    let length = prefix.filter(name => name != 'properties').length;

    let prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);
    let showIcon = this.context.getOpenValue([prefixArrayStr]);
    return (
      !_.isUndefined(data.items) && (
        <div className="array-type">
          <Row className="array-item-type" type="flex" justify="space-around" align="middle">
            <Col
              span={12}
              className="col-item name-item col-item-name"
              style={this.__tagPaddingLeftStyle}
            >
              <Row type="flex" justify="space-around" align="middle">
                <Col span={2}>
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
            <Col span={4} className="col-item col-item-type">
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
            <Col span={5} className="col-item col-item-desc">
              <Input
                addonAfter={
                  <Icon
                    type="edit"
                    onClick={this.handleShowEdit}
                  />
                }
                placeholder={LocaleProvider('description')}
                value={items.description}
                onChange={this.handleChangeValue}
              />
            </Col>
            <Col span={3} className="col-item col-item-setting">
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


class SchemaItem extends PureComponent {
  static contextTypes={
    setOpenValueAction: PropTypes.func,
    getOpenValue: PropTypes.func
  }
  constructor(props) {
    super(props);
    this._tagPaddingLeftStyle = {};
    this.num = 0
  }

  componentWillMount() {
    const { prefix } = this.props;
    let length = prefix.filter(name => name != 'properties').length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`
    }
  }

  clickIcon = prefix => {
    // 数据存储在 properties.name.properties下
    let keyArr = [].concat(prefix, 'properties');
    utils.userModel.setOpenValueAction({key: keyArr});
  };

  enableRequire = (prefix, name, required) => {
    utils.userModel.enableRequireAction({prefix, name, required});
  };

  changeName = (value, prefix, name) => {
    utils.userModel.changeNameAction({value, prefix, name});
  };

  changeValue = (prefix, type, value) => {
    let key = [].concat(prefix, type);
    utils.userModel.changeValueAction({key, value});
  };

  handleChangeDesc = (e) => {
    const { data, name } = this.props
    this.changeValue(this.getPrefix(), `description`, e.target.value)
  }

  changeType = (prefix, value) => {
    let key = [].concat(prefix, 'type');
    utils.userModel.changeTypeAction({key, value});
  };

  handleChangeType = (e) => {
    this.changeType(this.getPrefix(), e)
  }

  deleteItem = (prefix, name, change) => {
    let nameArray = [].concat(prefix, name);
    utils.userModel.deleteItemAction({key: nameArray});
    utils.userModel.enableRequireAction({prefix, name, required: false});
  };

  handleDeleteItem = () => {
    const { prefix, name } = this.props;
    this.deleteItem(prefix, name)
  }

  handleShowEdit = () => {
    const { data, name, showEdit } = this.props
    showEdit(this.getPrefix(), `description`, data.properties[name].description)
  }

  handleShowAdv = () => {
    const { data, name, showAdv } = this.props
    showAdv(this.getPrefix(), data.properties[name])
  }

  handleAddField = () => {
    const { prefix, name } = this.props;
    this.addField(prefix, name)
  }

  addField = (prefix, name) => {
    utils.userModel.addFieldAction({prefix, name});
  };

  getPrefix() {
    return [].concat(this.props.prefix, this.props.name)
  }

  handleClickIcon = () => {
    this.clickIcon(this.getPrefix())
  }

  handleEnableRequire = (e) => {
    this.enableRequire(this.props.prefix, this.props.name, e.target.checked)
  }

  handleChangeName = (e) => {
    const { data, prefix, name } = this.props
    if (
      data.properties[e.target.value] &&
      typeof data.properties[e.target.value] === 'object'
    ) {
      return message.error(`The field "${e.target.value}" already exists.`);
    }
    this.changeName(e.target.value, prefix, name);
  }


  render() {
    let { name, data, prefix, showEdit, showAdv } = this.props;
    let value = data.properties[name];
    let prefixArray = [].concat(prefix, name);

    let length = prefix.filter(name => name != 'properties').length;

    let prefixStr = prefix.join(JSONPATH_JOIN_CHAR);
    let prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);
    let show = this.context.getOpenValue([prefixStr]);
    let showIcon = this.context.getOpenValue([prefixArrayStr]);
    return (
      show ? (
        <div>
          <Row type="flex" justify="space-around" align="middle">
            <Col
              span={12}
              className="col-item name-item col-item-name"
              style={this.__tagPaddingLeftStyle}
            >
              <Row type="flex" justify="space-around" align="middle">
                <Col span={2}>
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
                  <Input
                    addonAfter={
                      <Checkbox
                        onChange={this.handleEnableRequire}
                        checked={
                          _.isUndefined(data.required)
                            ? false
                            : data.required.indexOf(name) != -1
                        }
                      />
                    }
                    onChange={this.handleChangeName}
                    value={name}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={4} className="col-item col-item-type">
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
            <Col span={5} className="col-item col-item-desc">
              <Input
                addonAfter={
                  <Icon
                    type="edit"
                    onClick={this.handleShowEdit}
                  />
                }
                placeholder={LocaleProvider('description')}
                value={value.description}
                onChange={this.handleChangeDesc}
              />
            </Col>
            <Col span={3} className="col-item col-item-setting">
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
      ) : null
    );
  }

}

class SchemaObjectComponent extends PureComponent {
  shouldComponentUpdate(nextProps) {
    if (_.isEqual(nextProps.data, this.props.data)
      && _.isEqual(nextProps.prefix, this.props.prefix)
      && _.isEqual(nextProps.open, this.props.open)
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { data, prefix, showEdit, showAdv } = this.props;
    return (
      <div className="object-style">
        {Object.keys(data.properties).map((name, index) =>
          <SchemaItem
            key={index}
            data={this.props.data}
            name={name}
            prefix={prefix}
            showEdit={showEdit}
            showAdv={showAdv} />
        )}
      </div>
    );
  }
}

const SchemaObject = connect(state => ({
  open: state.schema.open
}))(SchemaObjectComponent)



const DropPlus = props => {
  const { prefix, name, add } = props;
  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={() => utils.userModel.addFieldAction({prefix, name})}>
          {LocaleProvider('sibling_node')}
        </span>
      </Menu.Item>
      <Menu.Item>
        <span onClick={() => utils.userModel.addChildFieldAction({key: [].concat(prefix, name, 'properties')})}>{LocaleProvider('child_node')}</span>
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

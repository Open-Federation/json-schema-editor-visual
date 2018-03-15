import React from 'react';
import {
  Dropdown,
  Menu,
  Input,
  InputNumber,
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

import './schemaJson.css';
import _ from 'underscore';
import { connect } from 'react-redux';
import Model from '../../model.js';
import PropTypes from 'prop-types';
import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from '../../utils.js';
const InputGroup = Input.Group;
import AceEditor from '../AceEditor/AceEditor.js';

const SchemaString = props => {
  const { data } = props;
  return (
    <div>
      SchemaString
      <Row className="other-row" type="flex" justify="space-around" align="middle">
        <Col span={4}>默认值：</Col>
        <Col span={20}>
          <Input value={props.default} placeholder="默认值" />
        </Col>
      </Row>
      <Row className="other-row" type="flex" justify="space-around" align="middle">
        <Col span={12}>
          <Row>
            <Col style={{width: '80px'}}>最小值：</Col>
            <Col span={20}>
              
              <InputNumber value={props.minLength} placeholder="min.length" />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col style={{width: '80px'}}>最大值：</Col>
            <Col span={20}>
             
              <InputNumber value={props.maxLength} placeholder="max.length" />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const SchemaNumber = props => {
  return <div>SchemaNumber</div>;
};

const SchemaBoolean = props => {
  return <div>SchemaBoolean</div>;
};

const SchemaInt = props => {
  return <div>SchemaInt</div>;
};

const mapping = (data, changeHandler) => {
  return {
    string: <SchemaString onChange={changeHandler} data={data} />,
    number: <SchemaNumber onChange={changeHandler} data={data} />,
    boolean: <SchemaBoolean onChange={changeHandler} data={data} />,
    integer: <SchemaInt onChange={changeHandler} data={data} />
  }[data.type];
};

const CustomItem = props => {
  const { data, changeEditor } = props;
  console.log(data.type);
  const optionForm = mapping(data);

  return (
    <div>
      <div>{optionForm}</div>
      <AceEditor data={data} mode="json" onChange={changeEditor} />
    </div>
  );
};

export default CustomItem;

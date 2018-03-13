import React from 'react';
import { Input, Row, Col, Form, Select, Checkbox, Button, Icon, Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

import _ from 'underscore';
import { connect } from 'react-redux'
import Model from '../../model.js'
import PropTypes from 'prop-types'

function checkJsonSchema(json) {
  let newJson = Object.assign({}, json);
  if (_.isUndefined(json.type) && _.isObject(json.properties)) {
    newJson.type = 'object';
  }

  return newJson;
}

const mapping = (name, data, changeHandler) => {
  switch (data.type) {
    case 'array':
      return <SchemaArray onChange={changeHandler} prefix={`${name}.properties`} data={data} />;
      break;
    case 'object':
      return <SchemaObject onChange={changeHandler} prefix={`${name}.properties`} data={data} />;
      break;
    default:
      return <AdvModal onChange={changeHandler} name={name} data={data} />;
    // return <SchemaOther dataSource={data}/>
  }
};

class AdvModal extends React.Component {
  constructor(props) {
    super(props);
  }

  state = { visible: false };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = e => {
    this.setState({
      visible: false
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  mapping = (name, data, changeHandler) => {
    return {
      string: <SchemaString onChange={changeHandler} ref={name} data={data} />,
      number: <SchemaNumber onChange={changeHandler} ref={name} data={data} />,
      array: <SchemaArray onChange={changeHandler} ref={name} data={data} />,
      
      boolean: <SchemaBoolean onChange={changeHandler} ref={name} data={data} />
    }[data.type];
  };

  render() {
    const { data, name } = this.props;
    return (
      <div>
        <Button onClick={this.showModal}>高级</Button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this.mapping(name, data)}
        </Modal>
      </div>
    );
  }
}



const SchemaString = (props) => {
  
    return <div>String</div>;
  
}

const SchemaInt = (props) => {
 
    return <div>SchemaInt</div>;
  
}



const SchemaArray = (props, context) => {
  const { data, prefix } = props
  const change = () => {
   
  }

  const optionForm = mapping(`${prefix}.items`, data.items, change);

  var optionFormStyle = {
    paddingLeft: '25px',
    paddingTop: '8px'
  };
  return (
    <div style={{ marginTop: '60px' }}>
      <div className="array-item-type">
        Items Type:
        <Select name="itemtype" onChange={e => changeValue(`${prefix}.items.type`, e, context.changeValueAction )} value={data.items.type}>
          <Option value="string">string</Option>
          <Option value="number">number</Option>
          <Option value="array">array</Option>
          <Option value="object">object</Option>
          <Option value="boolean">boolean</Option>
        </Select>
      </div>
      <div style={optionFormStyle}>{optionForm}</div>
    </div>
  );

}

SchemaArray.contextTypes={
  changeValueAction: PropTypes.func
}


const SchemaNumber = (props) => {
 
    return <div>SchemaNumber</div>;

}

const SchemaBoolean = (props) => {

 
    return <div>SchemaBoolean</div>;
 
}

const changeValue = (key, value, change) => {
  
  change(key, value)
};
const changeName = (value, prefix ,name, change) =>{
  
  change(value, prefix,name)
  
}

const enableRequire = (prefix, name, required, change) => {
  
  change(prefix, name, required)
}

const deleteItem = (key, change) =>{

  change(key)

}

const add = (key, change) => {

  change(key)

}


const SchemaObject = (props, context) => {

  var optionFormStyle = {
      paddingLeft: '25px',
      paddingTop: '4px'
  };
  var requiredIcon = {
      fontSize: '1em',
      color: 'red',
      fontWeight: 'bold',
      paddingLeft: '5px'
  };
  var fieldStyle = {
      paddingBottom: '10px'
  };
  var objectStyle = {
      borderLeft: '2px dotted gray',
      paddingLeft: '8px',
      paddingTop: '6px',
      marginLeft: '20px',
      marginTop: '60px'
  };
  var typeSelectStyle = {
      marginLeft: '5px'
  };
  var deletePropStyle = {
      border: '1px solid black',
      padding: '0px 4px 0px 4px',
      pointer: 'cursor'
  };
    console.log('props',props)
    console.log('context',context)
    const { data, prefix } = props
    return (
      <div style={objectStyle}>
        {
          Object.keys(data.properties).map((name, index) => {
            let value = data.properties[name];
            var copiedState = JSON.parse(JSON.stringify(value));
            var optionForm = mapping(`${prefix}.${name}`, copiedState);
            return (
              <Row data-index={index} key={index}>
                <Col span={4} className="col-item">
                  <Input
                    onChange={e => changeName(e.target.value, prefix, name, context.changeNameAction)}
                    value={name}
                  />
                </Col>
                <Col span={2} className="col-item">
                  <Select
                    style={typeSelectStyle}
                    onChange={e => changeValue(`${prefix}.${name}.type`,e , context.changeValueAction)}
                    value={value.type}
                  >
                    <Option value="string">string</Option>
                    <Option value="number">number</Option>
                    <Option value="array">array</Option>
                    <Option value="object">object</Option>
                    <Option value="boolean">boolean</Option>
                  </Select>
                </Col>
                <Col span={2} className="col-item">
                  <span style={requiredIcon}>*</span>
                  <Checkbox
                    onChange={e => enableRequire(prefix, name, e.target.checked,context.enableRequireAction )}
                    checked={_.isUndefined(data.required) ? false : data.required.indexOf(name) != -1}
                  >
                    必要
                  </Checkbox>
                </Col>
                <Col span={4} className="col-item">
                  <Input
                    placeholder="默认值"
                    value={value.default}
                    onChange={e => changeValue(`${prefix}.${name}.default`,e.target.value , context.changeValueAction)}
                  />
                </Col>
                <Col span={4} className="col-item">
                  <TextArea
                    placeholder="备注"
                    value={value.description}
                    onChange={e => changeValue(`${prefix}.${name}.description`,e.target.value , context.changeValueAction)}
                  />
                </Col>
                <Col span={1} className="col-item">
                  <span 
                    onClick={() => deleteItem(`${prefix}.${name}`, context.deleteItemAction)}
                  >
                    <Icon type="delete" />
                  </span>
                </Col>
                <div style={optionFormStyle}>{optionForm}</div>
              </Row>
            );
          })
        }
        <Button 
          onClick={()=>add(prefix, context.addValueAction)} 
          className="add-btn"
        >
          再添加一项
        </Button>
      </div>
    );
  }


SchemaObject.contextTypes={
  changeNameAction: PropTypes.func,
  changeValueAction: PropTypes.func,
  enableRequireAction: PropTypes.func,
  addValueAction: PropTypes.func,
  deleteItemAction: PropTypes.func
}



export default SchemaObject
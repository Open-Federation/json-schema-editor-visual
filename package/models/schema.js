const _ = require('underscore');
import utils from '../utils';
let fieldNum = 1;
import handleSchema from '../schema.js';

export default {
  state: {
    message: null,
    data: {
      title: '',
      type: 'object',
      properties: {},
      required: []
    },
    open: {
      properties: true
    }
  },

  changeEditorSchemaAction: function(state, action) {
    handleSchema(action.value);
    state.data = action.value;
  },

  changeNameAction: function(state, action, oldState) {
    const keys = action.prefix;
    const name = action.name;
    const value = action.value;
    let oldData = oldState.data;
    let parentKeys = utils.getParentKeys(keys);
    let parentData = utils.getData(oldData, parentKeys);
    let requiredData = [].concat(parentData.required || []);
    let propertiesData = utils.getData(oldData, keys);
    let newPropertiesData = {};

    let curData = propertiesData[name];
    let openKeys = [].concat(keys, value, 'properties').join(utils.JSONPATH_JOIN_CHAR);
    let oldOpenKeys = [].concat(keys, name, 'properties').join(utils.JSONPATH_JOIN_CHAR);
    if (curData.properties) {
      delete state.open[oldOpenKeys];
      state.open[openKeys] = true;
    }

    if (propertiesData[value] && typeof propertiesData[value] === 'object') {
      return;
    }

    requiredData = requiredData.map(item => {
      if (item === name) return value;
      return item;
    });

    parentKeys.push('required');
    utils.setData(state.data, parentKeys, requiredData);

    for (let i in propertiesData) {
      if (i === name) {
        newPropertiesData[value] = propertiesData[i];
      } else newPropertiesData[i] = propertiesData[i];
    }

    utils.setData(state.data, keys, newPropertiesData);
  },

  changeValueAction: function(state, action) {
    const keys = action.key;
    if (action.value) {
      utils.setData(state.data, keys, action.value);
    } else {
      utils.deleteData(state.data, keys);
    }
  },

  changeTypeAction: function(state, action, oldState) {
    const keys = action.key;
    const value = action.value;

    let parentKeys = utils.getParentKeys(keys);
    let oldData = oldState.data;
    let parentData = utils.getData(oldData, parentKeys);
    if (parentData.type === value) {
      return;
    }
    // let newParentData = utils.defaultSchema[value];
    let newParentDataItem = utils.defaultSchema[value];

    // 将备注过滤出来
    let parentDataItem = parentData.description ? { description: parentData.description } : {};
    let newParentData = Object.assign({}, newParentDataItem, parentDataItem);

    let newKeys = [].concat('data', parentKeys);
    utils.setData(state, newKeys, newParentData);
  },

  enableRequireAction: function(state, action, oldState) {
    const keys = action.prefix;
    let parentKeys = utils.getParentKeys(keys);
    let oldData = oldState.data;
    let parentData = utils.getData(oldData, parentKeys);
    let requiredData = [].concat(parentData.required || []);
    let index = requiredData.indexOf(action.name);

    if(action.up || action.down){
      parentKeys.push('required');
      utils.setData(state.data, parentKeys, requiredData);
    }
    else if (!action.required && index >= 0) {
      requiredData.splice(index, 1);
      parentKeys.push('required');
      if (requiredData.length === 0) {
        utils.deleteData(state.data, parentKeys);
      } else {
        utils.setData(state.data, parentKeys, requiredData);
      }
    } else if (action.required && index === -1) {
      requiredData.push(action.name);
      parentKeys.push('required');
      utils.setData(state.data, parentKeys, requiredData);
    }
  },

  enableRequireActionUpdate: function(state, action, oldState) {
    const keys = action.prefix;
    let parentKeys = utils.getParentKeys(keys);
    let oldData = oldState.data;
    let parentData = utils.getData(oldData, parentKeys);
    let requiredData = [].concat(parentData.required || []);
    let index = requiredData.indexOf(action.name);

    if(action.up){
      utils.setData(state.data, parentKeys, requiredData);
    }
    else{
      if (!action.required && index >= 0) {
        parentKeys.push('required');
        if (requiredData.length === 0) {
          utils.deleteData(state.data, parentKeys);
        } else {
          utils.setData(state.data, parentKeys, requiredData);
        }
      } else if (action.required && index === -1) {
        requiredData.push(action.name);
        parentKeys.push('required');
        utils.setData(state.data, parentKeys, requiredData);
      }
    }
  },

  requireAllAction: function(state, action, oldState) {
    // let oldData = oldState.data;
    let data = utils.cloneObject(action.value);
    utils.handleSchemaRequired(data, action.required);

    state.data = data;
  },

  // 删除节点
  deleteItemAction: function(state, action, oldState) {
    const keys = action.key;
    let name = keys[keys.length - 1];
    let oldData = oldState.data;
    let parentKeys = utils.getParentKeys(keys);
    let parentData = utils.getData(oldData, parentKeys);
    let newParentData = {};
    for (let i in parentData) {
      if (i !== name) {
        newParentData[i] = parentData[i];
      }
    }

    utils.setData(state.data, parentKeys, newParentData);
  },

  // 向上
  upItemAction: function(state, action, oldState) {
    const keys = action.key;
    let name = keys[keys.length - 1];
    let oldData = oldState.data;
    let parentKeys = utils.getParentKeys(keys);
    let parentData = utils.getData(oldData, parentKeys);

    // 数组key
    let requiredData = Object.keys(parentData);
    
    // 取移动项下标
    let itemIndex = requiredData.indexOf(name);

    // 如果第一个元素就不允许在执行
    if(itemIndex === 0){
      return false;
    }

    let pevitemName = requiredData[itemIndex-1];

    // 将数组下标进行换位
    requiredData[itemIndex] = pevitemName;
    requiredData[itemIndex-1] = name;

    // 修改properties
    let newParentData = {};
    requiredData.forEach((item) => {
      newParentData[item] = parentData[item]
    })
    utils.setData(state.data, parentKeys, newParentData);
    
    // 修改required
    let requiredKeys = utils.getParentKeys(parentKeys);
    requiredKeys.push('required')
    utils.setData(state.data, requiredKeys, requiredData);
  },

  // 向下
  downItemAction: function(state, action, oldState) {
    const keys = action.key;
    let name = keys[keys.length - 1];
    let oldData = oldState.data;
    let parentKeys = utils.getParentKeys(keys);
    let parentData = utils.getData(oldData, parentKeys);

    // 数组key
    let requiredData = Object.keys(parentData);
    let len = requiredData.length
    
    // 取移动项下标
    let itemIndex = requiredData.indexOf(name);

    // 如果第一个元素就不允许在执行
    if(itemIndex === len-1){
      return false;
    }

    let pevitemName = requiredData[itemIndex+1];

    // 将数组下标进行换位
    requiredData[itemIndex] = pevitemName;
    requiredData[itemIndex+1] = name;

    // 修改properties
    let newParentData = {};
    requiredData.forEach((item) => {
      newParentData[item] = parentData[item]
    })
    utils.setData(state.data, parentKeys, newParentData);
    
    // 修改required
    let requiredKeys = utils.getParentKeys(parentKeys);
    requiredKeys.push('required')
    utils.setData(state.data, requiredKeys, requiredData);
  },

  // 添加子节点
  addFieldAction: function(state, action, oldState) {
    const keys = action.prefix;
    let oldData = oldState.data;
    let name = action.name;
    let propertiesData = utils.getData(oldData, keys);
    let newPropertiesData = {};

    let parentKeys = utils.getParentKeys(keys);
    let parentData = utils.getData(oldData, parentKeys);
    let requiredData = [].concat(parentData.required || []);

    if (!name) {
      newPropertiesData = Object.assign({}, propertiesData);
      let ranName = 'field_' + fieldNum++;
      newPropertiesData[ranName] = utils.defaultSchema.string;
      requiredData.push(ranName);
    } else {
      for (let i in propertiesData) {
        newPropertiesData[i] = propertiesData[i];
        if (i === name) {
          let ranName = 'field_' + fieldNum++;
          newPropertiesData[ranName] = utils.defaultSchema.string;
          requiredData.push(ranName);
        }
      }
    }
    utils.setData(state.data, keys, newPropertiesData);
    // add required
    parentKeys.push('required');
    utils.setData(state.data, parentKeys, requiredData);
  },

  // 添加子节点
  addChildFieldAction: function(state, action, oldState) {
    const keys = action.key;
    let oldData = oldState.data;
    let propertiesData = utils.getData(oldData, keys);
    let newPropertiesData = {};

    newPropertiesData = Object.assign({}, propertiesData);
    let ranName = 'field_' + fieldNum++;
    newPropertiesData[ranName] = utils.defaultSchema.string;
    utils.setData(state.data, keys, newPropertiesData);

    // add required
    let parentKeys = utils.getParentKeys(keys);
    let parentData = utils.getData(oldData, parentKeys);
    let requiredData = [].concat(parentData.required || []);
    requiredData.push(ranName);
    parentKeys.push('required');
    utils.setData(state.data, parentKeys, requiredData);
  },

  setOpenValueAction: function(state, action, oldState) {
    const keys = action.key.join(utils.JSONPATH_JOIN_CHAR);

    let status;
    if (_.isUndefined(action.value)) {
      status = utils.getData(oldState.open, [keys]) ? false : true;
    } else {
      status = action.value;
    }
    utils.setData(state.open, [keys], status);
  }
};

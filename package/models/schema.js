const _ = require('underscore');
import utils from '../utils';
let fieldNum = 1;

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

    if (!action.required && index >= 0) {
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

  requireAllAction: function(state, action, oldState) {
    // let oldData = oldState.data;
    let data = utils.cloneObject(action.value);
    utils.handleSchemaRequired(data, action.required);

    state.data = data;
  },
};

const _ = require('underscore');
import utils from '../utils';
let fieldNum = 1;
import handleSchema from '../schema.js'

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

  setOpenValueAction: (key, value) => {
    return {
      key,
      value
    };
  },

  changeEditorSchemaAction: value => ({
    value
  }),

  changeNameAction: (value, prefix, name) => {
    return {
      value,
      prefix,
      name
    };
  },

  changeValueAction: (key, value) => {
    return {
      key,
      value
    };
  },

  changeTypeAction: (key, value) => {
    return {
      key,
      value
    };
  },

  addFieldAction: (prefix, name) => {
    return {
      prefix,
      name
    };
  },

  addChildFieldAction: key => {
    return {
      key
    };
  },

  deleteItemAction: key => {
    return {
      key
    };
  },

  enableRequireAction: (prefix, name, required = true) => {
    
    return {
      prefix,
      name,
      required
    };
  },

  requireAllAction: (required, value) => {
    console.log('requireAllAction', required, value);

    return {
      required,
      value
    };
  },

  reducers: {
    changeEditorSchemaAction: function(state, action) {
      handleSchema(action.value)
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
      utils.setData(state.data, keys, action.value);
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
      let newParentData = utils.defaultSchema[value];
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
        utils.setData(state.data, parentKeys, requiredData);
      } else if (action.required && index === -1) {
        requiredData.push(action.name);
        parentKeys.push('required');
        utils.setData(state.data, parentKeys, requiredData);
      }
    },

    requireAllAction: function(state, action, oldState) {
      // let oldData = oldState.data;
      let data = utils.cloneObject(action.value)
      utils.handleSchemaRequired(data, action.required)
      
      state.data = data;
      
    },

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

    addFieldAction: function(state, action, oldState) {
      const keys = action.prefix;
      let oldData = oldState.data;
      let name = action.name;
      let propertiesData = utils.getData(oldData, keys);
      let newPropertiesData = {};
      if (!name) {
        newPropertiesData = Object.assign({}, propertiesData);
        newPropertiesData['field_' + fieldNum++] = utils.defaultSchema.string;
      } else {
        for (let i in propertiesData) {
          newPropertiesData[i] = propertiesData[i];
          if (i === name) {
            newPropertiesData['field_' + fieldNum++] = utils.defaultSchema.string;
          }
        }
      }
      utils.setData(state.data, keys, newPropertiesData);
    },
    addChildFieldAction: function(state, action, oldState) {
      const keys = action.key;
      let oldData = oldState.data;
      let propertiesData = utils.getData(oldData, keys);
      let newPropertiesData = {};
      newPropertiesData = Object.assign({}, propertiesData);
      newPropertiesData['field_' + fieldNum++] = utils.defaultSchema.string;
      utils.setData(state.data, keys, newPropertiesData);
    },

    setOpenValueAction: function(state, action, oldState) {
      const keys = action.key.join(utils.JSONPATH_JOIN_CHAR);

      let status;
      if (_.isUndefined(action.value)) {
        status = utils.getData(oldState.open, [keys]) ? false : true;
        // status = !status;
      } else {
        status = action.value;
      }
      // let status = utils.getData(oldState.open, [keys]) ? true : false;
      utils.setData(state.open, [keys], status);
    }
  }
};

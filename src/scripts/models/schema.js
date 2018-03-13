const _ = require("underscore");
import utils from "../utils";

const schema = {
  "title": "Product",
  "type": "object",
  "properties": {
    "id": {
      "description": "The unique identifier for a product",
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "price": {
      "type": "number",
      "minimum": 0,
      "exclusiveMinimum": true
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "array": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "length": {
            "type": "number"
          },
          "width": {
            "type": "number"
          },
          "height": {
            "type": "number"
          }
        }
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "dimensions": {
      "type": "object",
      "properties": {
        "length": {
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      },
      "required": [
        "length",
        "width",
        "height"
      ]
    }
  },
  "required": [
    "id",
    "name",
    "price"
  ]
}


export default {
  state: {
    message: null,
    // data: {
    //   title: "",
    //   type: "object",
    //   properties: {},
    //   required: []
    // }
    data: schema
  },


  changeEditorSchemaAction: value => ({
    value
  }),

  changeNameAction: (value, prefix, name) => {
    console.log("changeNameAction", value, prefix, name);
    return {
      value,
      prefix,
      name
    };
  },

  changeValueAction: (key, value) => {
    console.log("changeValueAction", key, value);
    return {
      key,
      value
    };
  },

  addValueAction: (key) =>{
    console.log('addValueAction', key)
    return {}
  },

  deleteItemAction: (key) =>{
    console.log('deleteItemAction', key)
    return {}
  },

  enableRequireAction: (prefix, name, required = true) => {
    console.log("enableRequireAction", prefix, name, required);
    return {};
  },

  reducers: {
    changeEditorSchemaAction: function(state, action) {
      state.data = action.value;
    },

    changeNameAction: function(state, action, oldState) {
      
      const keys = action.prefix.split(".");
      const name = action.name;
      const value = action.value;
      let oldData = oldState.data;
      let parentKeys = utils.getParentKeys(keys);
      let parentData = utils.getData(oldData, parentKeys);
      let requiredData = [].concat(parentData.required || []);

      requiredData.map(item => {
        if (item === name) return value;
        return item;
      });

      let propertiesData = utils.getData(oldData, keys);
      let newPropertiesData = {};
      for (let i in propertiesData) {
        if (i === name) {
          newPropertiesData[value] = propertiesData[i];
        } else newPropertiesData[i] = propertiesData[i];
      }
      utils.setData(state.data, keys, newPropertiesData);
    },

    changeValueAction: function(state, action){
      const keys = action.key.split(".");
      utils.setData(state.data, keys, action.value)
    }
  }
};

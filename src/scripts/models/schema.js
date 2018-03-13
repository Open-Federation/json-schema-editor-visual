const _ = require("underscore");
import utils from '../utils'

export default {
  state: {
    message: null,
    data: {
      title: "",
      type: "object",
      properties: {},
      required: []
    }
  },

  changeEditorSchemaAction: value => ({
    value
  }),

  changeNameAction: (value, prefix, name) => {
    console.log('changeNameAction', value, prefix, name)
    return {
      value,
      prefix,
      name
    } 
  },

  changeValueAction: (key, value) => {
    console.log('changeValueAction', key, value)
    return {}
  },

  addValueAction: (key) =>{
    console.log('addValueAction', key)
    return {}
  },

  deleteItemAction: (key) =>{
    console.log('deleteItemAction', key)
    return {}
  },

  enableRequireAction: (prefix, name, required = true)=>{
    console.log('enableRequireAction',prefix, name, required)
    return {}
  },

  reducers: {
    changeEditorSchemaAction: function(state, action) {
      state.data = action.value;
    },

    changeNameAction: function(state, action, oldState) {

      let indexList = action.prefix.split(".");

      let newObject = Object.assign({}, oldState.data);
      let required = [];
      console.log(action.prefix);
      for (let i = 0; i <= indexList.length - 1; i++) {
        let index = indexList[i];

        required = [].concat(newObject.required);
        newObject = newObject[index];
      }

      console.log("required", required);
      let object = {};
      for (let key in newObject) {
        if (key === action.name) {
          object[action.value] = newObject[key];
        } else {
          object[key] = newObject[key];
        }
      }

      let name = `state.data.${action.prefix} = ${JSON.stringify(object)}`;
      eval(name);

      // 处理required
      let index = required.indexOf(action.name);
      console.log(index);
      if (index >= 0) {
        required.splice(index, 1, action.value);
      }

      let requireStr = `state.data${getPrefix(
        action.prefix
      )}.required = ${JSON.stringify(required)}`;
      console.log("requireStr", requireStr);
      eval(requireStr);
      console.log(required);
    }
  }
};

function getPrefix(str) {
  let preStr = str
    .split(".")
    .slice(0, -1)
    .join(".");

  preStr = preStr ? "." + preStr : "";
  return preStr;
}

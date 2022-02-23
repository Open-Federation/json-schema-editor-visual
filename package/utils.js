const JSONPATH_JOIN_CHAR = '.'
exports.JSONPATH_JOIN_CHAR = JSONPATH_JOIN_CHAR
exports.lang = 'en_US'
exports.format = [
  { name: 'date-time' },
  { name: 'date' },
  { name: 'email' },
  { name: 'hostname' },
  { name: 'ipv4' },
  { name: 'ipv6' },
  { name: 'uri' },
]
const _ = require('underscore')
exports.SCHEMA_TYPE = [
  'string',
  'number',
  'array',
  'object',
  'boolean',
  'integer',
  'datetime',
]
exports.defaultSchema = {
  string: {
    type: 'string',
  },
  number: {
    type: 'number',
  },
  array: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  object: {
    type: 'object',
    properties: {},
  },
  boolean: {
    type: 'boolean',
  },
  integer: {
    type: 'integer',
  },
}

// 防抖函数，减少高频触发的函数执行的频率
// 请在 constructor 里使用:

// this.func = debounce(this.func, 400);
exports.debounce = (func, wait) => {
  let timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}

function getData(state, keys) {
  let curState = state
  for (let i = 0; i < keys.length; i++) {
    curState = curState[keys[i]]
  }
  return curState
}

exports.getData = getData

exports.setData = function (state, keys, value) {
  let curState = state
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]]
  }
  curState[keys[keys.length - 1]] = value
}

exports.loadRef = function (state, keys) {
  let curState = state
  let curState2 = state
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]]
  }
  for (let i = 0; i < keys.length - 2; i++) {
    curState2 = curState2[keys[i]]
  }
  const ref = curState.$ref.replace('#/definitions/', '')
  const definition = state.definitions[ref]
  delete curState.$ref
  curState.type = definition.type
  curState.properties = definition.properties
  curState.required = definition.required
  curState.description = definition.description
  console.log('~~~~~~~~~~~~~~~~')
  console.log({
    curState: JSON.stringify(curState),
    curState2: JSON.stringify(curState2),
    definition: JSON.stringify(definition),
  })
  console.log('~~~~~~~~~~~~~~~~')

  // curState[keys[keys.length - 1]] = {}
  // delete curState[keys[keys.length - 2]].$ref
  // curState[keys[keys.length - 1]][ref] = definition
}

exports.deleteData = function (state, keys) {
  let curState = state
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]]
  }

  delete curState[keys[keys.length - 1]]
}

exports.getParentKeys = function (keys) {
  if (keys.length === 1) return []
  let arr = [].concat(keys)
  arr.splice(keys.length - 1, 1)
  return arr
}

exports.clearSomeFields = function (keys, data) {
  const newData = Object.assign({}, data)
  keys.forEach((key) => {
    delete newData[key]
  })
  return newData
}

function getFieldstitle(data) {
  const requiredtitle = []
  Object.keys(data).map((title) => {
    requiredtitle.push(title)
  })

  return requiredtitle
}

function handleSchemaRequired(schema, checked) {
  // console.log(schema)
  if (schema.type === 'object') {
    let requiredtitle = getFieldstitle(schema.properties)

    // schema.required = checked ? [].concat(requiredtitle) : [];
    if (checked) {
      schema.required = [].concat(requiredtitle)
    } else {
      delete schema.required
    }

    handleObject(schema.properties, checked)
  } else if (schema.type === 'array') {
    handleSchemaRequired(schema.items, checked)
  } else {
    return schema
  }
}

function handleObject(properties, checked) {
  for (var key in properties) {
    if (properties[key].type === 'array' || properties[key].type === 'object')
      handleSchemaRequired(properties[key], checked)
  }
}

exports.handleSchemaRequired = handleSchemaRequired

function cloneObject(obj) {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      var newArr = []
      obj.forEach(function (item, index) {
        newArr[index] = cloneObject(item)
      })
      return newArr
    } else {
      var newObj = {}
      for (var key in obj) {
        newObj[key] = cloneObject(obj[key])
      }
      return newObj
    }
  } else {
    return obj
  }
}

exports.cloneObject = cloneObject

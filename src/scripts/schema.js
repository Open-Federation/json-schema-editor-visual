module.exports = handleSchema;


function handleSchema(schema) {
  if(!schema.type && schema.properties && typeof schema.properties === 'object') schema.type = 'object'
  if (schema.type === "object") {
    if(!schema.properties)schema.properties = {}
    handleObject(schema.properties, schema);
  }else if (schema.type === "array") {
    if(!schema.items)schema.items = {type: 'string'}
    handleSchema(schema.items);
  }else{
    return schema
  }
}

function handleObject(properties) {
  for (var key in properties) {
    if(properties[key].type === 'array' || properties[key].type === 'object')
    handleSchema(properties[key]);
  }
}


module.exports =  {
  JSONPATH_JOIN_CHAR: '.',
  getData: function getData(state,key){
    let data;
    eval(`data= state.${key}`)
    return data
  },
  setData: function setData(state, key, value){
    let data;
    eval(`state.${key} = ${JSON.stringify(value)}`)
  }
}
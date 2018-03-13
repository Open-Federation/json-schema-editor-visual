  const JSONPATH_JOIN_CHAR = '.'
  exports.JSONPATH_JOIN_CHAR = JSONPATH_JOIN_CHAR

  function getData(state,keys){ 
    let curState = state;
    for(let i =0; i< keys.length; i++){
      curState = curState[keys[i]]
    }
    return curState;
  }

  exports.getData = getData

  exports.setData = function (state, keys, value){
    let curState = state;
    for(let i =0; i< keys.length -1 ; i++){
      curState = curState[keys[i]]
    }
    curState[keys[keys.length - 1]] = value
  }

  exports.getParentKeys = function(keys){
    if(keys.length === 1) return [];
    let arr = [].concat(keys)
    arr.splice(keys.length - 1, 1)
    return arr
  }

const _  = require('underscore')

export default {
  state: {
    data: {
      title:'',
      type:'object',
      properties: {},
      required: [],
      // propertyNames: [],      
    } 
  },
  
  changeEditorSchemaAction: (value) =>({
    value
  }),

  changeNameAction: (value, prefix, name) =>({
    value,
    prefix,
    name
  }),
 
  reducers: {

    changeEditorSchemaAction: function(state, action) {
      state.data = action.value;
   
    
    },

    changeNameAction: function(state, action, oldState) {
      // var str = `state.${action.name} = "${action.value}"`
      // console.log(str)
      // eval(str)
      
        let indexList = action.prefix.split('.')
        
        let newObject = Object.assign({}, oldState.data)
        let required = []
        console.log(action.prefix)
        for(let i=0 ;i<=indexList.length-1; i++) {
           let index = indexList[i]
           
           required = [].concat(newObject.required)
           newObject = newObject[index]
        }

        console.log('required', required)
        let object = {}
        for (let key in newObject) {
          if(key === action.name){
            object[action.value] = newObject[key]
          }else {
            object[key] = newObject[key]
          }
        }
        
        let name = `state.data.${action.prefix} = ${JSON.stringify(object) }`
        eval(name)

        // 处理required
        let index = required.indexOf( action.name)
        console.log(index)
        if(index >=0) {
          required.splice(index , 1, action.value)
        }

       
        let requireStr = `state.data${getPrefix(action.prefix)}.required = ${JSON.stringify(required) }`
        console.log('requireStr',requireStr)
        eval(requireStr)
        console.log(required)


        




        
       


    },
  }
}

function getRandomName(len=4){
  let str = ''
  while(len--) str += String.fromCharCode(97 + Math.ceil(Math.random()* 25))
  return str
}

function getPrefix(str) {
  let preStr = str.split('.').slice(0, -1).join('.');

  preStr = preStr ? '.'+preStr : ''
  return preStr
  
  
}
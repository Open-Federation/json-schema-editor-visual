import utils from '../../utils'

const langs = {
  en: {
    'import_json': 'Import JSON'
  },
  zh: {
    'import_json': '导入 json'
  }
}


export default (props)=>{
  return langs[utils.lang][props.message]
}
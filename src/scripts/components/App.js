import React from 'react'
import { connect } from 'react-redux'
import Model from '../model'

const App = (props) => {
  const handleClick = () => {
    if (props.user.status === 1) return;
    props.requestStatusAction()
    props.addUserAction()
  }
  const handleClickSync = () => props.addUserSyncAction()
  const delUser = (index) => ()=>props.delUserAction(index)
  const getContent = (item, index) => {
    return <input type="text" onChange={(event) => {
      props.changeCurrentEditUserAction(event.target.value, index)
    }} value={item} />
  }
  const list = props.user.list.filter(item=>{
    item = item + '';
    return !props.user.filterText || item.indexOf(props.user.filterText) !== -1
  })

  return <div style={{ width: 500, margin: '100px auto' }}>
    <div >
      <input placeholder="Filter" style={{height: 35, width: '100%', backgroundColor: '#eee'}} type="text" value={props.user.filterText} onChange={(event)=> props.changeFilterValueAction(event.target.value)} />
    </div>
    <div>
      <button style={{ height: '40px', margin: 30 }} onClick={handleClick}>Async Add Random Number</button>
      <button style={{ height: '40px', margin: 30 }} onClick={handleClickSync}>Add Random Number</button>
      {props.user.status === 1 ? 'loading...' : ''}
    </div>
    {list.map((item, index) => {
      return <div style={{ height: 30, margin: 15, backgroundColor: '#eee' }} key={index}>{}{getContent(item, index)} &nbsp; <span onClick={delUser(index)}>X</span></div>
    })}
  </div>
}
export default connect((state) => ({
  user: state.user
}), {
    addUserAction: Model.user.addUserAction,
    requestStatusAction: Model.user.requestStatusAction,
    delUserAction: Model.user.delUserAction,
    addUserSyncAction: Model.user.addUserSyncAction,
    changeCurrentEditUserAction: Model.user.changeCurrentEditUserAction,
    changeFilterValueAction: Model.user.changeFilterValueAction
  })(App)

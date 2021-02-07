import * as types from './actionTypes';

let fieldNum = 1;

export const changeEditorSchema = ({ value }) => ({
    type: types.CHANGE_EDITOR_SCHEMA,
    payload: { value }
});

export const changeName = ({ keys, name, value }) => ({
    type: types.CHANGE_NAME,
    payload: { keys, name, value }
})

export const changeValue = ({key, value}) => ({
    type: types.CHANGE_VALUE,
    payload: {keys: key, value}
})

export const changeType = ({ keys, value }) => ({
    type: types.CHANGE_TYPE,
    payload: { keys, value }
})

export const enableRequire = ({ keys, name, required }) => ({
    type: types.ENABLE_REQUIRE,
    payload: { keys, name, required }
})

export const requireAll = payload => ({
    type: types.REQUIRE_ALL,
    payload
})

export const deleteItem = ({ keys }) => ({
    type: types.DELETE_ITEM,
    payload: { keys }
})

export const addField = ({ keys, name }) => ({
    type: types.ADD_FIELD,
    payload: { keys, name, fieldNum: fieldNum++ }
})

export const addChildField = ({ key }) => ({
    type: types.ADD_CHILD_FIELD,
    payload: {
        keys: key, //@TODO change key to keys
        fieldNum: fieldNum++
    }
})

export const setOpenValue = ({ key, value }) => ({
    type: types.SET_OPEN_VALUE,
    payload: {key, value}
})

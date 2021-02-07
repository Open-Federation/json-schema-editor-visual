import * as types from '../actionTypes';
import handleSchema from '../../schema';
import { defaultSchema } from '../../utils';
import _ from 'lodash';

const initialSchema = {
    title: '',
    type: 'object',
    properties: {},
    required: []
}

const getParentKey = (keys) => (keys.length === 1) ? [] : _.dropRight(keys, 1);

const addRequiredFields = (state, keys, fieldName) => {
    let parentKeys = getParentKey(keys); // parent
    let parentData = parentKeys.length ? _.get(state, parentKeys) : state;
    let requiredData = [].concat(parentData.required || []);
    requiredData.push(fieldName);
    parentKeys.push('required');
    return _.set(state, parentKeys, _.uniq(requiredData));
}

const removeRequireField = (state, keys, fieldName) => {
    let parentKeys = getParentKey(keys); // parent
    let parentData = parentKeys.length ? _.get(state, parentKeys) : state;
    let requiredData = [].concat(parentData.required || []);
    let filteredRequire = requiredData.filter(i => i !== fieldName);
    parentKeys.push('required');
    return _.set(state, parentKeys, _.uniq(filteredRequire));
};

const addChildField = (state, keys, fieldName) => {
    let currentField = _.get(state, keys);
    if(_.isUndefined(currentField)) {
        return state;
    }
    return _.update(state, keys, (n => _.assign(n, {
        [fieldName]: defaultSchema.string
    })));
}

const _handleEditorSchemaChange = (state, { value }) => {
    handleSchema(value);
    return {...state, ...value};
}

const _handleAddChildField = (state, {keys, fieldNum}) => {
    const fieldName = `field_${fieldNum}`;
    let originalState = _.clone(state);
    state = addChildField(state, keys, fieldName);
    return addRequiredFields(originalState, keys, fieldName);
}

const _handleDelete = (state, { keys }) => {
    const clonedState = _.clone(state);
    _.unset(clonedState, keys);
    return clonedState;
}

const _handleAddField = (state, { keys, name, fieldNum }) => {
    const clonedState = _.cloneDeep(state);
    let propertiesData = _.get(state, keys);
    let newPropertiesData = {};
    let parentKeys = getParentKey(keys);
    let parentData = parentKeys.length ? _.get(state, parentKeys): state;
    let requiredData = [].concat(parentData.required || []);

    let fieldName = `field_${fieldNum}`;

    if(!!name) {
        for (let i in propertiesData) {
            newPropertiesData[i] = propertiesData[i];
            if (i === name) {
              newPropertiesData[fieldName] = defaultSchema.string;
              requiredData.push(fieldName);
            }
        }
    } else {
        newPropertiesData = _.assign(propertiesData, {
            [fieldName]: defaultSchema.string
        });
        requiredData.push(fieldName);
    }

    let newState = _.update(clonedState, keys, (n => _.assign(n, newPropertiesData)));
    return addRequiredFields(newState, keys, fieldName);
};

const _handleChangeType = (state, {keys, value}) => {
    let parentKeys = getParentKey(keys);
    let parentData = parentKeys.length ? _.get(state, parentKeys) : state;
    let clonedState = _.cloneDeep(state);

    if (parentData.type === value) {
      return clonedState;
    }

    let description = parentData.description ? { description: parentData.description } : {};
    let newParentDataItem = {...defaultSchema[value], ...description};
    return _.set(clonedState, parentKeys, newParentDataItem);
};

const _handleEnableRequire = (state, { keys, name, required }) => {
    let parentKeys = getParentKey(keys);
    let clonedState = _.cloneDeep(state);
    let parentData = parentKeys.length ? _.get(state, parentKeys) : state;
    let requiredArray = [].concat(parentData.required || []);
    var requiredFieldIndex = requiredArray.indexOf(name);
    let foundRequired = requiredFieldIndex >= 0;

    if (!required && foundRequired) {
        // Remove from required arr
        requiredArray.splice(requiredFieldIndex, 1);
    } else if (required && !foundRequired) {
        // Add to required arr
        requiredArray.push(name);
    }
    parentKeys.push('required');
    return _.set(clonedState, parentKeys, requiredArray);
}

const getSchemaItem = (state, keys) => {
    return keys.length ? _.get(state, keys) : state;
}

const getRequiredFields = (schema) => {
    return [].concat(schema.required || []);
}

const _handleChangeName = (state, { keys, name, value }) => {
    let clonedState = _.cloneDeep(state);
    let parentKeys = getParentKey(keys);
    let parentData = getSchemaItem(state, parentKeys);
    let requiredArray = getRequiredFields(parentData);

    const items = _.get(clonedState, keys);
    const keyExists = Object.keys(items).indexOf(value) >= 0 && items[value] === 'object';

    if (keyExists || !_.has(items, name)) {
        return state;
    }

    items[value] = items[name];
    delete items[name];

    requiredArray = requiredArray.map(item => {
        if (item === name) return value;
        return item;
    });

    let newState = addRequiredFields(clonedState, keys, value);
    return removeRequireField(newState, keys, name);
};

const _handleChangeValue = (state, {keys, value}) => {
    if (value) {
      return _.set(state, keys, value);
    } else {
      return _handleDelete(state, keys);
    }
};

const schema = (state = initialSchema, action) => {
    switch (action.type) {
        case types.CHANGE_EDITOR_SCHEMA:
            return _handleEditorSchemaChange(state, action.payload);
        case types.ADD_CHILD_FIELD:
            return _handleAddChildField(state, action.payload);
        case types.DELETE_ITEM:
            return _handleDelete(state, action.payload);
        case types.ADD_FIELD:
            return _handleAddField(state, action.payload);
        case types.CHANGE_TYPE:
            return _handleChangeType(state, action.payload);
        case types.ENABLE_REQUIRE:
            return _handleEnableRequire(state, action.payload);
        case types.CHANGE_NAME:
            return _handleChangeName(state, action.payload);
        case types.CHANGE_VALUE:
            return _handleChangeValue(state, action.payload);
        default:
            return state;
    }
};

export default schema;
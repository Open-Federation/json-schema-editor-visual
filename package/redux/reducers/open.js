import * as types from '../actionTypes';
import _ from 'lodash';

const initialState = {
    properties: true
};

const open = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_OPEN_VALUE:
            const {key, value} = action.payload;
            let clonedState = _.cloneDeep(state);
            let status = _.isUndefined(value) ? !_.get(state, key) : !!value;
            return _.set(clonedState, key, status);
        default:
            return state;
    }
};

export default open;
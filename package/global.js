const Global = {
    SCHEMA_TYPE: ['string', 'number', 'array', 'object', 'boolean', 'integer'],
    colSpanMap: {
        basic: {
            fieldName: 8,
            type: 3,
            title: 5,
            description: 5,
            setting: 3,
        },
        mock: {
            fieldName: 8,
            type: 3,
            mock: 3,
            title: 4,
            description: 4,
            setting: 2,
        },
        mock_defaultValue: {
            fieldName: 6,
            type: 3,
            mock: 3,
            title: 4,
            description: 3,
            setting: 2,
            default: 3
        },
        defaultValue: {
            fieldName: 8,
            type: 3,
            default: 3,
            title: 4,
            description: 4,
            setting: 2,
        },
    },
}


export default Global;

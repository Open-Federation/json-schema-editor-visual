module.exports = {
    plugins: ['antd'],
    config: {
        exports: [
            ['./src/index.js']            
        ],
        modifyWebpackConfig: function(baseConfig) {
            baseConfig.context = require('path').resolve(__dirname);
            baseConfig.output.prd.filename = '[name][ext]'
            return baseConfig;
        }
    }
};

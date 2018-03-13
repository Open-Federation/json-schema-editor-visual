module.exports = {
    plugins: ['antd'],
    config: {
        exports: [
            ['babel-polyfill', './scripts/index.js'],
            './styles/index.css'
        ],
        modifyWebpackConfig: function(baseConfig) {
            return baseConfig;
        }
    }
};

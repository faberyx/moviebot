const { override, addWebpackModuleRule } = require('customize-cra');
const { addReactRefresh } = require('customize-cra-react-refresh');

/* config-overrides.js */
module.exports = override(
  addReactRefresh(),
  addWebpackModuleRule({
    test: /\.worker\.js$/,
    use: 'worker-loader'
  }),
  addWebpackModuleRule({
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000
    }
  })
);

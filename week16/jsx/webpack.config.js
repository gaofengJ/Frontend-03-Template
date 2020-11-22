const path = require('path')

module.exports = {
  entry: './main.js',
  // entry: './animation-demo.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader', // ES6转为ES5
          options: {
            presets: ['@babel/preset-env'],
            // plugins: ['@babel/plugin-transform-react-jsx'] // 解析jsx
            plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]] // 改变解析jsx的默认方法
          }
        }
      }
    ]
  },
  mode: 'development', // 开发环境，生产环境替换成production（开发环境模式不会压缩代码）
  devServer: {
    port: 8080,
    hot: true,
    contentBase: path.join(__dirname, '/dist'),
    // contentBase: path.join(__dirname),
    watchContentBase: true
  }
}
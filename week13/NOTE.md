# 学习笔记
这周开始了组件化第一部分内容的学习，主要有jsx的封装和轮播图的第一部分。jsx的封装里遇到了如下问题：    

安装完依赖包后执行```webpack-dev-server：```提示webpack-dev-server: command not found，需要再全局安装webpack-dev-server。    

全局安装之后报Cannot find module 'webpack-cli/bin/config-yargs：Webpack-cli与webpack-dev-server版本不兼容导致，然后更换了老版本的webpack-cli。    

之后发现index.html仍然没有实时刷新，原因：webpack-dev-server只监听webpack.config.js中entry入口下文件（如js、css等）的变动，只有这些文件的变动才会触发实时编译打包与页面刷新，而对于不在entry入口下的html文件，却不进行监听与页面刷新。
多次尝试之后发现了解决办法：在webpack.config.js中加入
```json
devServer: {
    port: 8080,
    hot: true,
    contentBase: path.join(__dirname, '/dist'),
    watchContentBase: true
  }
```
官方文档的定义：告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。devServer.publicPath 将用于确定应该从哪里提供 bundle，并且此选项优先。修改contentBase就可以实现监听index.html的功能。    

轮播图开始学习前端的时候都做过，但是没有做的很完善。课程中对于循环播放（最后一张切换到第一张）的思路，以及一些小技巧（利用取余函数进行循环）还是很值得学习的。


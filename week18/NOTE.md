## 学习笔记

* Mocha的简单使用：
1. 安装Mocha
2. 编写测试用例（test.js）
在测试用例中引入待测试文件使用断言进行测试

* 使Mocha支持import
安装babel，添加.babelrc。

* 简化输入命令
将命令添加到package.json中，然后通过npm调用。
package.json默认会把./node_modules/.bin/加到自己的path中，所以只需添加mocha --require @babel/register

* code coverage
表示测试覆盖了原文件中的哪些代码。

* VS Code本地调试
调试时，可以在VS Code的launch.json文件中通过以下代码：
```json
"runtimeArgs": [
  "--require", "@babel/register"
],
"sourceMaps": true,
"args": [

],
"program": "${workspaceFolder}/node_modules/.bin/mocha"
```
调试过程中，可以通过Uncovered提示，不断完善测试用例，完善覆盖程度。

* 把单元测试相关的代码集成到generator中。


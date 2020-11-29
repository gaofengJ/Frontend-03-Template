## 学习笔记

### 初始化Yeoman（一）

Yeoman的API比较奇怪，它会顺次执行一个class中的所有方法。  

npm link：把一个我们在本地的模块link到一个我们的npm的标准的模块里面去。

package.json中name必须以generator开头。

### 初始化Yeoman（二）

在使用yo toolchain之前，必须要npm link建立联系。

### 初始化工具Yeoman（三）

* 关于yo vue命令
执行yo vue命令的时候一直好奇yo后面为什么跟vue，经过反复测试，猜测结果如下：
在/generator-vue中执行npm link时已经生成了一个新的命令（yo --generator可以查看已经安装好的命令），这里其实完整的命令应该是yo generator-vue，但是如果package中name以generator为前缀的话可以忽略。（如果有助教看到的话可以帮忙确定下这个猜测是不是对的）

初始化过程中发现两个坑：
* 安装vue时如果没有添加版本号会自动标记为vue@12.*，导致一直安装失败
* 如果给项目起名为vue，会导致安装vue失败```Refusing to install package with name "vue" under a package```
找问题找了好久...

### Webpack基础

#### webpack
多文件合并，通过loader和plugin控制合并规则。

npx的作用：
* 调用项目安装的模块
* 避免全局安装模块
* 使用不同版本的node

### Babel

.babelrc：Babel的配置文件。
Babel一般和webpack等其他工具配合使用。

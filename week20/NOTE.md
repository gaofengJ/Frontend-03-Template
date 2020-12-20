## 学习笔记

### 持续集成 | 发布前检查的相关知识
持续集成，相对于最终阶段集成。
* 最终阶段集成
前面各自开发，最终集成联调。
* 持续集成
持续集成有两个重要概念：
  1. daily build
  2. BVT：build verification test（构建的验证测试，是一种冒烟测试）
* 前端持续集成：
  1. daily build视开发周期而定，可以设在提交后
  2. BVT：测试用例，lint

### 持续集成 | Git Hooks基本用法
这里主要学习的是client hook。在.git文件夹中，所有的hook都是以.sample结尾的，并不会实际执行，只要把.sample去掉，就会变成一个可执行的东西。

问题：$ git update-index --chmod=+x ./pre-commit报fatal: this operation must be run in a work tree

类Linux系统通过#!来标记这个文件用哪个脚本引擎执行的。
```
#!/d/nodejs/node node
console.log('hello, hooks')
```

在window下好像不生效，还没有找到原因。

stack overflow的回答：Note: Windows does not support shebang lines, so they're effectively ignored there; on Windows it is solely a given file's filename extension that determines what executable will interpret it. However, you still need them in the context of npm.[1]

### 持续集成 | ESLint基本使用

### 持续集成 | ESLint API及其高级用法

### 持续集成 | 使用无头浏览器检查DOM

结合这两周的学习以及各种查阅资料，今天终于把项目布上去了，有兴趣的同学可以看一下。
![阿里云ECS服务器前后端项目部署](https://juejin.cn/post/6908323868360835085)

# 学习笔记

这周的学习内容比较简单，都是一些CSS的基础，包括CSS的规则、选择器相关内容，算是一个系统化学习的过程吧，补全了对于CSS规范的认识。

## 作业：为什么 first-letter 可以设置 display: block; float 之类的，而 first-line 不行呢？

::first-letter是在layout之后，确定了一段文字中的第一个文字之后完成的，操作布局时性能开销较小。
::first-line在某块级元素的第一行应用样式。第一行的长度取决于很多因素，包括元素宽度，文档宽度和文本的文字大小。所以这里重新排版消耗性能大。
所以first-letter 可以设置 display: block; float 之类的，而 first-line 不行。

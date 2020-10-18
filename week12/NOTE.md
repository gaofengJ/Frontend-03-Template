# 学习笔记
本周学习了两块内容，Proxy的使用（vue3中双向绑定相关API reactive的实现）和拖拽（拖拽和CSSOM的结合）

## Proxy
通过这节课的学习，加强了对Proxy的印象，认识了Vue3中reactive API的实现原理，通过effect和reactivity来实现Proxy对于属性的动态绑定，替代Vue2中Object.defineProperty()的作用。

## 拖拽
这里拖拽没有使用HTML5的dragable属性，而是使用transform或者insertNode方法去改变拖拽元素的位置。这里对于Range及相关API以及getBoundingClientRect的实际使用有了更深的认识。
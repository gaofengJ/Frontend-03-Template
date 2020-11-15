# 学习笔记

1. 手势的基本知识  
tap、pan、pan move、flick、press start的概念及对比。  
注意：移动10px之后视为pan start，这里10px指的是Retina屏上的10px，如果是一倍屏的话为5px，三倍屏的话为15px。

2. 触屏事件  
touchstart、touchmove和touchend，和mousedown、mousemove、mouseup一一对应。  
touchmove只有在touchstart触发之后才会触发，所以在同级监听即可。  
start、move、end各有一个identifier表示touch的唯一ID  
touchend和touchcancel的区别：  
touchend：touchmove正常结束触发touchend事件，异常结束触发touchcancel事件。  

3. e.button共五个值：
* 左键：0
* 中键：1
* 右键：2
* 高级一点的鼠标可能有其他两个键  

4. 使用Object.create(null)创建空对象是一个好习惯，用于KV的匹配，避免Object的原始属性添乱  

5. mousedown分按键，mousemove不分按键，可以通过e.buttons（通过掩码记录）来区分： 
* 0b11111：五个键全按下 
* 0b00001：只按了左键
* 0b00010：只按了中键
* 0b00011：左键和中键同时按  

5. mousedown的e.button和mousemove的e.buttons中中键和右键顺序相反，需要处理  

6. Event() 构造函数, 创建一个新的事件对象 Event。  

7. 向一个指定的事件目标派发一个事件,  并以合适的顺序同步调用目标元素相关的事件处理函数。标准事件处理规则(包括事件捕获和可选的冒泡过程)同样适用于通过手动的使用dispatchEvent()方法派发的事件。  
```
cancelled = !target.dispatchEvent(event)

event 是要被派发的事件对象。
target 被用来初始化 事件 和 决定将会触发 目标.
```  

8. flick事件：不能只计算两个点之间的速度，根据不同浏览器实现的不同，会有一个较大的误差。所以对速度的判断应该是取数个点，然后把它进行一个平均。课程中采用存储一段时间之内的点，来做速度平均计算。  

9. 将代码做解耦：分为listen（监听）=>recognize（识别）=>dispatch（分发）三个部分。  
```javascript
new Listener(new Recognizer(dispatch))
```

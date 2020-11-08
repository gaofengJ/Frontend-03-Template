## 学习笔记

JavaScript中处理帧的方案：    
```javascript
setInterval(() => {}, 16) // 人眼可识别的最高刷新频率为60帧

let tick = () => {
  setTimeout(() => {}, 16)
}

let tick = () => {
  requestAnimationFrame(tick) // 申请浏览器执行下一帧的时候执行以下代码，使用cancelAnimationFrame去掉
}
```

动画分为属性动画和帧动画。前端开发中一般都是属性动画。

时间线的更新：  
1. 在add函数中添加startTime参数，表示animation的开始时间
2. 在start函数中比较startTime与animation的startTime，来处理动画之前添加的动画和运行中添加的动画

通过cancelAnimationFrame、记录PAUSE_TIME来实现暂停、重启功能。

通过将所有参数状态设为空或重新声明来实现重置功能。

通过state来管理TimeLine状态。

const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler') // 使外部无法访问到
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')

export class Timeline { // 时间线
  constructor () {
    this.state = 'Inited' // 状态管理
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }
  start () {
    if (this.state !== 'Inited') return
    this.state = 'started'
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[TICK] = () => {
      let now = Date.now()
      for (let animation of this[ANIMATIONS]) {
        let t
        if (this[START_TIME].get(animation) < startTime) { // 判断动画是在时间线开始之前还是之后添加的
          t = now - startTime - this[PAUSE_TIME] - animation.delay
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
        }
        if (animation.duration < t) { // 终止条件
          this[ANIMATIONS].delete(animation)
          t = animation.duration // 防止超出时间范围，如果超过则用duration代替
        }
        if (t > 0) {
          animation.receive(t)
        }
      }
      // requestAnimationFrame：告诉浏览器-希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画
      // 该方法传入一个回调函数作为参数，在浏览器下一次重绘之前执行
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[TICK]()
  }
  // set rate () {

  // }
  // get rate () {

  // }
  pause () { // 暂停
    if (this.state !== 'started') return
    this.state = 'paused'
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }
  resume () { // 恢复
    if (this.state !== 'paused') return
    this.state = 'started'
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }
  reset () {
    this.pause()
    this.state = 'Inited'
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
    this[PAUSE_START] = 0
    this[TICK_HANDLER] = null
  }
  add (animation, startTime) { // add时添加delay
    if (arguments.length < 2) {
      startTime = Date.now() // 默认值
    }
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }
}

export class Animation {
  constructor (object, property, startValue, endValue, duration, delay, timingFunction, template) { // timingFunction：差值函数
    timingFunction = timingFunction || (v => v)
    template = template || (v => v)
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction
    this.template = template
  }
  receive (time) { // 执行函数
    let range = (this.endValue - this.startValue)
    let progerss = this.timingFunction(time / this.duration)
    this.object[this.property] = this.template(this.startValue + range * progerss) // 已经执行的时间/持续时间
  }
}

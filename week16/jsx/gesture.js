export class Dispatcher {
  constructor (element) {
    this.element = element
  }
  dispatch (type, properties) {
    let event = new Event(type)
    for (let name in properties) {
      event[name] = properties[name]
    }
    this.element.dispatchEvent(event)
  }
}

export class Listener {
  constructor (element, recognizer) {
    let contexts = new Map()

    let isListeningMouse = false

    element.addEventListener('mousedown', e => {
      let context = Object.create(null)
      contexts.set('mouse' + (1 << e.button), context) // 1 << e.button 移位，值为1、2、4、8、16
    
      recognizer.start(e, context)
    
      let mousemove = (e) => {
        let button = 1
        while (button <= e.buttons) {
          if (button & e.buttons) { // 掩码成立的时候执行
            // buttons的顺序上面e.button的中键和右键顺序相反
            let key
            if (button === 2) {
              key = 4
            } else if (button === 4) {
              key = 2
            } else {
              key = button
            }
            let context = contexts.get('mouse' + key)
            recognizer.move(e, context)
          }
          button = button << 1
        }
      }
      let mouseup = (e) => {
        let context = contexts.get('mouse' + (1 << e.button))
        recognizer.end(e, context)
        contexts.delete('mouse' + (1 << e.button))
    
        if (e.buttons === 0) { // 所有事件都为空
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
          isListeningMouse = false
        }
      }
      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
        isListeningMouse = true
      }
    })
    element.addEventListener('touchstart', e => { // e包含多个触点
      for (let touch of e.changedTouches) {
        let context = Object.create(null)
        contexts.set(touch.identifier, context)
        recognizer.start(touch, context)
      }
    })
    
    element.addEventListener('touchmove', e => {
      for (let touch of e.changedTouches) {
        let context = contexts.get(touch.identifier)
        recognizer.move(touch, context)
      }
    })
    
    element.addEventListener('touchend', e => {
      for (let touch of e.changedTouches) {
        let context = contexts.get(touch.identifier)
        recognizer.end(touch, context)
        contexts.delete(touch.identifier)
      }
    })
    
    element.addEventListener('touchcancel', e => {
      for (let touch of e.changedTouches) {
        let context = contexts.get(touch.identifier)
        recognizer.cancel(touch, context)
        contexts.delete(touch.identifier)
      }
    })
  }
}

export class Recognizer {
  constructor (dispatcher) {
    this.dispatcher = dispatcher
  }
  start (point, context) {
    context.startX = point.clientX
    context.startY = point.clientY

    this.dispatcher.dispatch('start', {
      clientX: point.clientX,
      clientY: point.clientY,
    })

    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      }
    ]
    // isTap、isPan、isPress三者互斥
    context.isTap = true
    context.isPan = false
    context.isPress = false
  
    context.handler = setTimeout(() => { // 按下0.5s之后出发press事件
      context.isTap = false
      context.isPan = false
      context.isPress = true
      context.handler = null
      this.dispatcher.dispatch('press', {})
    }, 500)
  }
  
  move (point, context) {
    
    let dx = point.clientX - context.startX
    let dy = point.clientY - context.startY
  
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) { // 移动超过10px
      context.isTap = false
      context.isPan = true
      context.isPress = false
      context.isVertical = Math.abs(dx) < Math.abs(dy)
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      })
      clearTimeout(context.handler)
    }
    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      })
    }
  
    context.points = context.points.filter(point => Date.now() - point.t < 500) // 只存取500ms内的点
  
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    })
  }
  
  end (point, context) {
    if (context.isTap) {
      dispatch('tap', {})
      clearTimeout(context.handler)
    }

    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {})
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500)
    let d
    let v
    if (!context.points.length) { // 没有速度
      v = 0
    } else {
      d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2)
      v = d / (Date.now() - context.points[0].t)
    }
    if (v > 1.5) { // 单位：px/ms
      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v // 速度
      })
      context.isFlick = true
    } else {
      context.isFlick = false
    }

    if (context.isPan) {
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v
      })
    }

    this.dispatcher.dispatch('end', {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY,
      isVertical: context.isVertical,
      isFlick: context.isFlick,
      velocity: v,
    })
  }
  
  cancel (point, context) {
    clearTimeout(context.handler)
    this.dispatcher.dispatch('cancel', {})
  }
}

export function enableGesture (element) {
  new Listener(element, new Recognizer(new Dispatcher(element)))
}

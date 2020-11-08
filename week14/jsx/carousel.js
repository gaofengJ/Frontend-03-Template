import { Component } from './framework'

export class Carousel extends Component {
  constructor () {
    super()
    this.attributes = Object.create(null)
  }
  setAttribute (name, value) {
    this.attributes[name] = value
  }
  render () {
    this.root = document.createElement('div')
    this.root.classList.add('carousel')
    for (let record of this.attributes.src) {
      let child = document.createElement('div')
      child.style.backgroundImage = `url(${record})`
      this.root.appendChild(child)
    }
    
    let position = 0
    this.root.addEventListener('mousedown', e => {
      let children = this.root.children
      let startX = e.clientX // 相对于浏览器的坐标，推荐使用

      let move = e => {
        let x = e.clientX - startX

        let current = position - Math.round((x - x % 500) / 500) // 算出当前屏幕中心的元素

        for (let offset of [-1, 0, 1]) { // 把中心元素和左右的元素都挪到正确位置
          let pos = current + offset
          pos = (pos + children.length) % children.length // 使用取余运算处理循环

          children[pos].style.transition = 'none'
          children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
        }
      }

      let up = e => {
        let x = e.clientX - startX
        position = position - Math.round(x / 500)

        for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) { // 把中心元素和左右的元素都挪到正确位置
          let pos = position + offset
          pos = (pos + children.length) % children.length // 使用取余运算处理循环

          children[pos].style.transition = 'none'
          children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`
        }
        // mouseup之后取消监听
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      // 在document上监听防止移出root元素后丢失mouseup事件，另外在document上监听移出浏览器后仍可监听
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })
    
    /* let currentIndex = 0
    setInterval(() => {
      let children = this.root.children
      let nextIndex = (currentIndex + 1) % children.length // 通过取余的操作来循环
      
      let current = children[currentIndex]
      let next = children[nextIndex]

      // 先把current和next挪动到正确的位置，current位置一定是正确的
      next.style.transform = 'none' // 使下一行没有动画
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`
      setTimeout(() => {
        // 异动两个元素
        next.style.transform = ''
        current.style.transform = `translate(${- 100 - currentIndex * 100}%)`
        next.style.transform = `translateX(${- nextIndex * 100}%)`
        currentIndex = nextIndex
      }, 16) // 16：浏览器中一帧的时间
     
    }, 3000) */

    return this.root
  }
  mountTo (parent) {
    parent.appendChild(this.render())
  }
}
function getStyle (element) {
  if (!element.style) {
    element.style = {}
  }

  // computedStyle 是kv结构的对象
  for (let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      // 视频里是parseInt 我觉得应该是parseFloat
      element.style[prop] = parseFloat(element.style[prop])
    }
  }

  return element.style
}


function layout (element) {
  if (!element.computedStyle) {
    return
  }
  let elementStyle = getStyle(element)
  if (elementStyle.display !== "flex") {
    return
  }
  let items = element.children.filter(e => e.type === 'element')
  // 支持一个特殊的order属性 
  items.sort((a, b) => (a.order || 0) - (b.order || 0))

  let style = elementStyle
  // width和height空的都设为 null
  ["width", "height"].forEach(prop => {
    // ""是怎么来的
    if (style[prop] === "auto" || style[prop] === "") {
      style[prop] = null
    }
  })

  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row"
  }
  if (!style.alignItems || style.alignItems === "auto") {
    style.alignItems = "stretch"
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start"
  }
  if (!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowrap"
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "stretch"
  }

  let mainSize, mainStart, mainEnd, mainSign, mainBase
  let crossSize, crossStart, crossEnd, crossSign, crossBase

  if (style.flexDirection === 'row') {
    mainSize = "width"
    mainStart = "left"
    mainEnd = "right"
    mainSign = +1 // 从右往左排就是属性相减，mainSign = -1
    mainBase = 0

    crossSize = "height"
    crossStart = "top"
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'row-reverse') {
    mainSize = "width"
    mainStart = "left"
    mainEnd = "right"
    mainSign = -1 
    mainBase = style.width

    crossSize = "height"
    crossStart = "top"
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'column') {
    mainSize = "height"
    mainStart = "top"
    mainEnd = "bottom"
    mainSign = +1
    mainBase = 0

    crossSize = "width"
    crossStart = "left"
    crossEnd = "right"
  }

  if (style.flexDirection === 'column-reverse') {
    mainSize = "height"
    mainStart = "bottom"
    mainEnd = "top"
    mainSign = -1
    mainBase = style.height

    crossSize = "width"
    crossStart = "left"
    crossEnd = "right"
  }

  if (style.flexWrap === 'wrap-reverse') {
    let tmp = crossStart
    crossStart = crossEnd
    crossEnd = tmp
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  // 如果为true则父元素主轴没有设置尺寸，由子元素自行撑开
  let isAutoMainSize = false
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0
    // items是type为element的children
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      let itemStyle = getStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
        elementStyle[mainSize] = elementStyle[mainSize] += itemStyle[mainSize]
      }
    }
    isAutoMainSize = true
  }

  let flexLine = []
  let flexLines = [flexLine]

  // 主轴剩余空间 = 父元素的mainSize
  let mainSpace = elementStyle[mainSize]
  // crossSpace的含义是行高
  let crossSpace = 0

  // items是type为element的children
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    let itemStyle = getStyle(item)

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) {
      // flex的元素是可伸缩的，无论如何都可以放进去
      flexLine.push(item)
      // style 就是 elementStyle
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      // 计算主轴和交叉轴的尺寸
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null || itemStyle[crossSize] !== (void 0)) {
        corssSize = Math.max(crossSpace, itemStyle[corssSize])  
      }
      flexLine.push(item)
    } else {
      // 换行的逻辑
      // 子元素尺寸比父元素尺寸还要大
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }
      if (mainSpace < itemStyle[mainSize]) {
        // 采取换行，记录一些必要的数据
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        // 创建新的flexline
        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }
      // 计算主轴和交叉轴的尺寸
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])        
      }
      mainSpace -= itemStyle[mainSize]
    }
  }
  flexLine.mainSpace = mainSpace
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  // 计算主轴方向

  // 等比压缩 mainSpace < 0 是一个单行的逻辑
  if (mainSpace < 0) {
    let scale = style[mainSize] / (style[mainsize] - mainSpace)
    let currentMain = mainBase

    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      let itemStyle = getStyle(item)

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale

      itemStyle[mainStart] = currentMain
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    }
  } else {
    // process each flex line 
    flexLines.forEach(function (items) {
      let mainSpace = items.mainSpace
      let flexTotal = 0

      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let itemStyle = getStyle(item)

        if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
          flexTotal += itemStyle.flex
          continue
        }
      }

      if (flexTotal > 0) {
        let currentMain = mainBase

        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          let itemStyle = getStyle(item)

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
          }
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }
      } else {
        // There is no flexible flex items, which means, justifyContent should work
        let currentMain
        let step
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase
          step = 0
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase
          step = 0
        }
        if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSize + mainBase
          step = 0
        }
        if (style.justifyContent === 'space-between') {
          step = mainSpace / (items.length - 1) * mainSign
          currentMain = mainBase
        }
        if (style.justifyContent === 'space-around') {
          step = mainSpace / items.length * mainSign
          currentMain = step / 2 + mainBase
        }

        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          let itemStyle = getStyle(item)
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }

  // compute cross axis sizes
  // align-items, align-self
  // let crossSpace

  if (!style[crossSize]) {
    crossSpace = 0
    elementStyle[crossSize] = 0
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
    }
  } else {
    crossSpace = style[crossSize]
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace
    }
  }

  if (style.flexWrap === "wrap-reverse") {
    crossBase = style[crossSize]
  } else {
    crossBase = 0
  }

  let lineSize = style[crossSize] / flexLines.length

  let step
  if (style.alignContent === 'flex-start') {
    crossBase += 0
    step = 0
  }
  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace
    step = 0
  }
  if (style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2
    step = 0
  }
  if (style.alignContent === 'space-between') {
    crossBase += 0
    step = crossSpace / (flexLines.length - 1)
  }
  if (style.alignContent === 'space-around') {
    step = crossSpace / flexLines.length
    crossBase += crossSign * step / 2
  }
  if (style.alignContent === 'stretch') {
    crossBase += 0
    step = 0
  }

  flexLines.forEach(function (items) {
    let lineCrossSize = style.alignContent === 'stretch' ? 
                        items.crossSpace + crossSpace / flexLines.length :
                        items.crossSpace
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      let itemStyle = getStyle(item)

      let align = itemStyle.alignSelf || style.alignItems

      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0
      }

      if (align === "flex-start") {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === "flex-end") {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
      }
      if (align === "center") {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === "stretch") {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== undefined) ? itemStyle[crossSize] : items.crossSpace)
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }
    }
    crossBase += crossSign * (lineCrossSize + step) 
  })

}

module.exports = layout
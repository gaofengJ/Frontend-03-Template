function match(selector, element) {
  const selectorArr = selector.split(' ').filter(selector => selector !== '').reverse()
  let currentEle = element
  for (const i of selectorArr) {
    i.match(/^([\w]+)?((?:.[\w]+)|(?:#[\w]+))?((?:.[\w]+)|(?:#[\w]+))$/)
    const selectorParts = [RegExp.$1, RegExp.$2, RegExp.$3]
    if (!matchSelector(selectorParts, i)) {
      return false
    }
    currentEle = currentEle.parentElement
  }
  return true
}

function matchSelector (selectorParts, element) {
  if (!selectorParts || !element) return false
  for (const part of selectorParts) {
    if (!part) continue
    if (part.startsWith('.')) {
      const className = part.replace('.', '')
      if (!(element.getAttribute('class') && element.getAttribute('class').trim().split(' ').includes(className))) {
        return false
      }
    } else if (part.startsWith('#')) {
      const id = part.replace('#', '')
      if (!(element.getAttribute('id') && element.getAttribute('id').trim() === id)) {
        return false
      }
    } else {
      if (element.tagName !== part.toUpperCase()) {
        return false
      }
    }
  }
  return false
}


match("div #id.class", document.getElementById("id"));
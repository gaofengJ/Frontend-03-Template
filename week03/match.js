/**
 * @titie 使用状态机，找到字符abcdef
 * @param str 
 */
function match (str) {
  // state 当前状态
  // start 初始值（状态函数）
  let state = start
  for (let c of str) {
    state =  state(c)
  }
  return state === end
}

function start (c) {
  if (c === 'a') {
    return foundA
  } else {
    return start
  }
}

function end (c) {
  return end
}

function foundA (c) {
  if (c === 'b') {
    return foundB
  } else {
    return start(c) // 判断是不是a
  }
}

function foundB (c) {
  if (c === 'c') {
    return foundC
  } else {
    return start(c)
  }
}

function foundC (c) {
  if (c === 'a') {
    return foundA2
  } else {
    return start(c)
  }
}

function foundA2 (c) {
  if (c === 'b') {
    return foundB2
  } else {
    return start(c)
  }
}

function foundB2 (c) {
  if (c === 'x') {
    return end
  } else {
    return foundB(c)
  }
}

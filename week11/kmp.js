function kmp (source, pattern) {
  // 计算table,看字符串中有没有自重复
  let table = new Array(pattern.length).fill(0)

  {
    let i = 1 // 自重复串开始的位置
    let j = 0 // 已重复的字数

    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        ++j
        ++i
        table[i] = j
      } else {
        // j = 0 把已重复字数重置为0，但是这样会有问题
        if (j > 0) {
          j = table[j]
        } else {
          ++i
        }
      }
    }
  }

  {
    let i = 0 // source的位置
    let j = 0 // pattern的位置
    while (i < source.length) {
      if (pattern[j] === source[i]) {
        ++i
        ++j
      } else {
        if (j > 0) {
          j = table[j]
        } else {
          ++i
        }
      }
      if (j === pattern.length) return true
    }
    return false
  }

  // abcdabce
  // aabaaac

  // 匹配
}

// kmp('', 'abcdabce') // -> [0, 0, 0, 0, 0, 1, 2, 3]
// kmp('', 'abababc') // -> [0, 0, 0, 1, 2, 3, 4]
// kmp('', 'aabaaac') // -> [0, 0, 1, 0, 1, 2, 2]

// console.log(kmp('Hello', 'll')) // -> true
// console.log(kmp('Helxlo', 'll')) // -> false
console.log(kmp('aabaabaaacx', 'aabaaac')) // -> true
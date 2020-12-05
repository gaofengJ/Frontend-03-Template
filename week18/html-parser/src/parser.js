let currentToken = null
let currentAttribute = null
let currentTextNode = null
let stack = ''
const EOF = Symbol('EOF') // end of file

function emit (token) {
  let top = stack[stack.length - 1]

  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    // 把当前元素挂在其父元素上
    top.children.push(element)
    element.parent = top

    // 自封闭标签存入就要立马从栈里取出，所以不需要push入栈
    if (!token.isSelfClosing) {
      stack.push(element)
    }

    currentTextNode = null

  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('Tag start end doesn\'t match!')
    } else {
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (!currentTextNode) {
      currentTextNode = {
        type: 'text',
        content: '',
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data (c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen (c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    return
  }
}

function endTagOpen (c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c === '>') {

  } else if (c === EOF) {

  } else {

  }
}

function tagName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return attriOrSelfclosing
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c //.toLowerCase()
    return tagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    // 理论上走不到这里
    return tagName
  }
}

// selfClosingStartTag 既可以写成 <img/> 也可以写成 <img />
function attriOrSelfclosing (c) {
  if (c === '/') {
    // <img />
    return selfClosingStartTag
  } else {
    // <div class=...
    return beforeAttributeName(c)
  }
}

function beforeAttributeName (c) {
  if (c.match(/^\s$/)) {
    return beforeAttributeName
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    // throw error
  } else {
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName(c)
  }
}

function attributeName (c) {
  if (c.match(/^[\t\n\f]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '\u0000') {

  } else if (c === '\'' || c === '"' || c === '<') {

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function afterAttributeName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {
  } else {
    // 理论上这条分支是多余的，从beforeAttributeName或者attributeName状态进入时c已经确定了
    // currentToken[currentAttribute.name] = currentAttribute.value
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function beforeAttributeValue (c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue
  } else if (c === '"') {
    return doubleQuotedAttributeValue
  } else if (c === '\'') {
    return singleQuotedAttributeValue
  } else if (c === '>') {
  } else {
    return unQuotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue (c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue (c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function unQuotedAttributeValue (c) {
  if (c.match(/^[\t\n\f]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === '\u0000') {

  } else if (c === '"' || c === '\'' || c === '<' || c === '=' || c === '`') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return unQuotedAttributeValue
  }
}

function afterQuotedAttributeValue (c) {
  if (c.match(/^[\t\n\f]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    throw new Error('unexpected charater "' + c + '"')
  }
}

function selfClosingStartTag (c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c === 'EOF') {

  } else {

  }
}

export function parserHTML (html) {

  stack = [{ type: 'document', children: [] }]
  currentToken = null
  currentAttribute = null
  currentTextNode = null
   
  let state = data
  for (let c of html) {
    state = state(c)
  }
  state = state(EOF)

  return stack[0]
}

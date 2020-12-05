let assert = require('assert')

import { parserHTML } from '../src/parser.js'

describe('parse html：', function () {
  it('<a></a>', function () {
    let tree = parserHTML('<a></a>')
    assert.strictEqual(tree.children[0].tagName, 'a')
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href="//time.geekbang.org"></a>', function () {
    let tree = parserHTML('<a href="//time.geekbang.org"></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href></a>', function () {
    let tree = parserHTML('<a href></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href id></a>', function () {
    let tree = parserHTML('<a href id></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href="abc" id></a>', function () {
    let tree = parserHTML('<a href="abc" id></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a id=abc></a>', function () {
    let tree = parserHTML('<a id=abc></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a id=abc />', function () {
    let tree = parserHTML('<a id=abc />')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a id=\'abc\' />', function () {
    let tree = parserHTML('<a id=\'abc\' />')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a />', function () {
    let tree = parserHTML('<a />')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<>', function () {
    let tree = parserHTML('<>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].type, 'text')
  })
})
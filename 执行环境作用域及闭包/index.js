function A (x) {
  return function B (y) {
    console.log(x + y)
  }
}

var C = A(1)
C(1)

// 伪代码模拟

// 执行环境栈
ECStack = []

// 初始化
ECStack = [
  // 全局执行环境
  EC(G)  = {
    // 全局变量对象
    VO(G) = {
      Math: {},
      String: {},
      Date: {},
      document: {}, //DOM操作
      ...
      window: this, //让window属性指向了自身
      A: [Function: A],
      C: [Function: B]
    }
  }
]

// 函数A的[[Scope]]属性，在A创建时生成，保存A所在执行环境的作用域链
A.[[Scope]] = scopeChain:<VO(G)>

// 执行A函数

ECStack = [
  // 函数A的执行环境
  EC(A) = {
    // A的变量对象，在A执行时才会被创建
    VO(A) = {
      arguments: []
      x: 1,
      B: [Function: B]
    },
    scopeChain: <AO(A), VO(G)> 
    // 作用域链初始化为 <VO(G)>，通过复制A的[[Scope]]属性创建，然后将A的活动对象AO(A)（即变量对象）推入作用域链前端
  },

  // 全局执行环境
  EC(G)  = {
    // 全局变量对象
    VO(G) = {
      Math: {},
      String: {},
      Date: {},
      document: {}, //DOM操作
      ...
      window: this, //让window属性指向了自身
      A: [Function: A],
      C: [Function: B]
    }
  }
]

// 函数B的[[Scope]]属性，在B创建时生成，保存B所在执行环境的作用域链
B.[[Scope]] = scopeChain: <AO(A), VO(G)> 

// 函数A执行完后，A的执行环境从栈顶弹出

// 执行B函数

ECStack = [
  // 函数B的执行环境
  EC(B) = {
    // B的变量对象，在B执行时才会被创建
    VO(B) = {
      arguments: []
      y: 1
    },
    scopeChain: <AO(B), AO(A), VO(G)> 
    // 作用域链初始化为 <AO(A), VO(G)>，通过复制B的[[Scope]]属性创建，然后将B的活动对象AO(B)（即变量对象）推入作用域链前端
  },

  // 全局执行环境
  EC(G)  = {
    // 全局变量对象
    VO(G) = {
      Math: {},
      String: {},
      Date: {},
      document: {}, //DOM操作
      ...
      window: this, //让window属性指向了自身
      A: [Function: A],
      C: [Function: B]
    }
  }
]

// 函数B执行完后，B的执行环境从栈顶弹出，执行环境栈只剩下全局执行环境

// 上述代码执行过程也展示了闭包的具体机制
// 函数A执行完后其作用域链被销毁，但是因为函数B的作用域链引用着函数A的活动对象，因此函数A的活动对象仍保留在内存中，可以在函数B的执行环境内被访问到。
// 这也是为什么闭包会造成内存泄漏。因为B函数一直存在于全局变量对象内，保持着对函数A变量对象的引用。

// 通过手动解除对函数B的引用来释放内存
C = null

// 另外由于每次查找某个标识符时都会从作用域链前端开始查找，当作用域链过长时会导致性能的损耗。
// 可以通过在内部函数内再保存一下外部函数变量的方式来减少作用域链的查询次数。如下所示

// 优化前
var hello = 'hello'
function wrap (text) {
  return function inner () {
    for (var i = 1; i < 10; i++) {
      console.log(hello + text)
    }
  }
}

var run = wrap('word')
run()

// 优化后
var hello = 'hello'
function wrap (text) {
  return function inner () {
    var innerHello = hello,
        innerText = text
    for (var i = 1; i < 10; i++) {
      console.log(innerHello + innerText)
    }
  }
}

var run = wrap('word')
run()
// js 基本结构

console.log(Object.__proto__ === Function.prototype)
console.log(Function.__proto__ === Function.prototype)
console.log(Array.__proto__ === Function.prototype)
console.log(Number.__proto__ === Function.prototype)
console.log(String.__proto__ === Function.prototype)
console.log(Boolean.__proto__ === Function.prototype)
console.log(RegExp.__proto__ === Function.prototype)
console.log(Symbol.__proto__ === Function.prototype)

console.log(Object.prototype.__proto__) // null
console.log(Function.prototype.__proto__ === Object.prototype)
console.log(Array.prototype.__proto__ === Object.prototype)
console.log(Number.prototype.__proto__ === Object.prototype)
console.log(String.prototype.__proto__ === Object.prototype)
console.log(Boolean.prototype.__proto__ === Object.prototype)
console.log(RegExp.prototype.__proto__ === Object.prototype)
console.log(RegExp.prototype.__proto__ === Object.prototype)
console.log(Symbol.prototype.__proto__ === Object.prototype)



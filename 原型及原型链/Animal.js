// prototype 构造函数的原型对象，除箭头函数外所有type为function的数据类型都有此属性
// __proto__ 标准为[[Prototype]],指向该实例构造函数的原型对象
// 基本构造函数原构造函数的原型对象 ƒ () { [native code] }

function Animal (legNum, color) {
  this.color = color
  this.legNum = legNum
}

Animal.prototype.eat = function() {
  console.log('吃')
}
Animal.prototype.move = function() {
  console.log('动')
}

module.exports = Animal
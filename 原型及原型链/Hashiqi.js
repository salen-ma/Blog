var Dog = require('./Dog')

function Hashiqi () {
  Dog.apply(this, arguments)
}

Hashiqi.prototype = Object.create(Dog.prototype)
Hashiqi.prototype.constructor = Hashiqi

var erHa = new Hashiqi(4, '黑', '拆家')
console.log(erHa)
console.log(erHa instanceof Hashiqi)
console.log(erHa.hasOwnProperty('legNum'))
console.log(erHa.hasOwnProperty('say'))

console.log(erHa.__proto__) // Hashiqi.prototype
console.log(erHa.__proto__.__proto__) // Dog.prototype
console.log(erHa.__proto__.__proto__.__proto__) // Animal.prototype
console.log(erHa.__proto__.__proto__.__proto__.__proto__) // Object.prototype
console.log(erHa.__proto__.__proto__.__proto__.__proto__.__proto__) // null



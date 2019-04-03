var Animal = require('./Animal')

function Dog (legNum, color, skill) {
  Animal.call(this, legNum, color)
  this.skill = skill
}

Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.say = function () {
  console.log('汪汪')
}
Dog.prototype.constructor = Dog

// var blackDog = new Dog(4, '黑', '看家')
// console.log(blackDog)
// console.log(blackDog.__proto__) // Dog.prototype
// console.log(blackDog.__proto__.__proto__) // Animal.prototype
// console.log(blackDog.__proto__.__proto__.__proto__) // Object.prototype
// console.log(blackDog.__proto__.__proto__.__proto__.__proto__) // null

// blackDog.eat()
// blackDog.move()

module.exports = Dog
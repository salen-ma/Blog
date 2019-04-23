const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

let isFunction = value => typeof value === 'function'
let isIterator = value => {
  var res
  try {
    res = !!value[Symbol.iterator]
  } catch (err) {
    res = false
  }
  return res
}

class MyPromise {
  constructor (resolver) {
    if (!isFunction(resolver)) {
      throw new Error(`Promise resolver ${resolver + ''} is not a function`)
    }

    this._resolve = this._resolve.bind(this)
    this._reject = this._reject.bind(this)
    this._status = PENDING
    this._value
    this._fulfilledQueque = []
    this._rejectedQueque = []
    this._fulFilledFinallyQueque = []
    this._rejectedFinallyQueque = []

    try {
      resolver(this._resolve, this._reject)
    } catch (err) {
      this._reject(err)
    }
  }

  then (onFulfilled, onRejected) {
    let { _status, _value } = this

    return new MyPromise ((onFulfilledNext, onRejectedNext) => {
      let fulfilled = value => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value)
          } else {
            let res = onFulfilled(value)
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              onFulfilledNext(res)
            }
          }
        } catch (err) {
          onRejectedNext(err)
        }
      }

      let rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error)
          } else {
            let res = onRejected(error)
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              onFulfilledNext(res)
            }
          }
        } catch (err) {
          onRejectedNext(err)
        }
      }

      switch (_status) {
        case PENDING:
          this._fulfilledQueque.push(fulfilled)
          this._rejectedQueque.push(rejected)
          break
        case FULFILLED:
          setTimeout(() => {
            fulfilled(_value)
          }, 0)
          break
        case REJECTED:
          setTimeout(() => {
            rejected(_value)
          }, 0)
          break
      }
    })
  }

  catch (onRejected) {
    return this.then(undefined, onRejected)
  }

  finally (onFinally) {
    let { _status, _value } = this

    return new MyPromise ((onFulfilledNext, onRejectedNext) => {
      let fulFilledFinally = value => {
        try {
          if (!isFunction(onFinally)) {
            onFulfilledNext(value)
          } else {
            let res = onFinally()
            if (res instanceof MyPromise) {
              res.then(() => {onFulfilledNext(value)})
            } else {
              onFulfilledNext(value)
            }
          }
        } catch (err) {
          onRejectedNext(err)
        }
      }

      let rejectedFinally = error => {
        try {
          if (!isFunction(onFinally)) {
            onRejectedNext(error)
          } else {
            let res = onFinally()
            if (res instanceof MyPromise) {
              res.then(() => {undefined, onRejectedNext(error)})
            } else {
              onRejectedNext(error)
            }
          }
        } catch (err) {
          onRejectedNext(err)
        }
      }

      switch (_status) {
        case PENDING:
          this._fulFilledFinallyQueque.push(fulFilledFinally)
          this._rejectedFinallyQueque.push(rejectedFinally)
          break
        case FULFILLED:
          setTimeout(() => {
            fulFilledFinally(_value)
          }, 0)
          break
        case REJECTED:
          setTimeout(() => {
            rejectedFinally(_value)
          }, 0)
          break
      }
    })
  }

  _resolve (value) {
    // 状态确定后不再变化
    if (this._status !== PENDING) {
      return
    }

    let run = () => {
      this._value = value
      this._status = FULFILLED
      while (this._fulfilledQueque.length) {
        let [f] = this._fulfilledQueque.splice(0, 1)
        f(value)
      }
      while (this._fulFilledFinallyQueque.length) {
        let [f] = this._fulFilledFinallyQueque.splice(0, 1)
        f(value)
      }
    }
    setTimeout(run, 0)
  }

  _reject (reason) {
    // 状态确定后不再变化
    if (this._status !== PENDING) {
      return
    }

    let run = () => {
      this._value = reason
      this._status = REJECTED
      while (this._rejectedQueque.length) {
        let [f] = this._rejectedQueque.splice(0, 1)
        f(reason)
      }
      while (this._rejectedFinallyQueque.length) {
        let [f] = this._rejectedFinallyQueque.splice(0, 1)
        f(reason)
      }
    }
    setTimeout(run, 0)
  }

  static resolve (value) {
    return new MyPromise ((resolve, reject) => {
      resolve(value)
    })
  }

  static reject (value) {
    return new MyPromise ((resolve, reject) => {
      reject(value)
    })
  }

  static all (promises) {
    if (!isIterator(promises)) {
      throw new Error(`${promises + ''} is not iterable`)
    }

    return new MyPromise((resolve, reject) => {
      let values = []
      let count = 0
      let len = promises.length
      
      for (let i = 0; i < len; i++) {
        let p = promises[i]
        if (!(p instanceof MyPromise)) {
          p = MyPromise.resolve(p)
        }
        p.then(res => {
          values[i] = res
          count++
          if (count === len) {
            resolve(values)
          }
        }).catch(err => {
          reject(err)
        })
      }
    })
  }

  static race (promises) {
    if (!isIterator(promises)) {
      throw new Error(`${promises + ''} is not iterable`)
    }

    return new MyPromise((resolve, reject) => {
      for (p of promises) {
        if (!(p instanceof MyPromise)) {
          p = MyPromise.resolve(p)
        }

        p.then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }
    })
  }
}


var p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(111)
  }, 1000)
})

let arr = [1, p, 2]
var p1 = MyPromise.race(arr)

p1.then(res => {
  console.log(res)
})

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p1 done')
  }, 1000)
})

p1.then(res => {console.log(res)})
  .finally(() => {console.log('finally')})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p2 failed')
  }, 1000)
})

p2.catch(reason => {console.log(reason)})
  .finally(() => {console.log('finally')})

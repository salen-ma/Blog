## 前言

随着前端技术的不断发展，

## 一、 配置package.json

在package.json内添加

```javascript
"config": {
    "nuxt": {
      "host": "0.0.0.0",    // 使可通过ip或域名访问
      "port": "3000"        // nuxt服务端口号
    }
}
```

## 二、 配置访问地址

假设后台接口服务地址为
http://myproject.com:8899/api/***/***  
nuxt服务地址为 http://myproject.com:3000

想让用户通过地址 http://myproject.com/nuxt/ 访问nuxt项目

- 配置nuxt.config.js

```javascript
// 应用的根URL。举个例子，如果整个单页面应用的所有资源可以通过 /app/ 来访问，那么 base 配置项的值需要设置为 '/app/'。

router: {
    base: '/nuxt/'
}
```

此时可通过 http://myproject.com:3000/nuxt/ 来访问nuxt项目  

- 配置nginx

```nginx
location /nuxt/ {
    proxy_pass http://127.0.0.1:3000/nuxt/;
    proxy_set_header Host $host:$server_port;
}
	
location /api/ {
    proxy_pass http://127.0.0.1:8899/api/;
    proxy_set_header Host $host:$server_port;
}
```

访问http://myproject.com/nuxt/***会被代理到http://myproject.com:3000/nuxt/  
访问http://myproject.com/api/***会被代理到http://myproject.com:8899/api/   
此时可通过http://myproject.com/nuxt/正常访问项目


## 三、 上传项目至服务器并启动

在服务器新建一个文件夹,上传nuxt项目到此文件夹，进入项目根目录

先运行build命令npm run build  

再运行start命令，通过pm2 管理进程 pm2 start npm -- start


## 四、 静态化

nuxt 可通过generate命令生成静态html文件,可通过将静态html部署到CDN服务器来提升访问速度。

> 我们进一步考虑下电商应用的场景，利用 nuxt generate，是不是可以将应用静态化后部署在 CDN 服务器，每当一个商品的库存发生变化时，就重新静态化下，更新下商品的库存。但是如果用户访问的时候恰巧更新了呢？我们可以通过调用电商的 API ，保证用户访问的是最新的数据。这样相对于传统的电商应用来说，这种静态化的方案可以大大节省服务器的资源。

对于nuxt官网给出的这种应用场景，考虑一下实现方案。

### 4.1 首先通过generate命令静态化整个项目,对于动态的商品库存可将generate的routes属性设为返回一个 Promise 对象的函数。

```javascript
module.exports = {
  generate: {
    routes: function () {
      return axios.get('https://my-api/goods')
      .then((res) => {
        return res.data.map((good) => {
          return '/goods/' + good.id
        })
      })
    }
  }
}
```

静态化完成后，触发generate:done回调，将静态化后的商品详情页上传至cdn。

### 4.2 当新增商品或者有商品发生更新时,重新进行静态化。为了节约性能，这里可以当新增商品达到一定数量时再重新静态化。可以只静态化变化的商品，通过重写generate配置实现。

```javascript
// goodsApi.js 静态化全部商品
export const goodsApi = 'https://my-api/goods'
// 重写为 只静态化发生变化和新增的商品
export const goodsApi = 'https://my-api/changedGoods'

// nuxt.config.js
import { goodsApi } from 'goodsApi.js'
module.exports = {
  generate: {
    routes: function () {
      return axios.get(goodsApi)
      .then((res) => {
        return res.data.map((good) => {
          return '/goods/' + good.id
        })
      })
    }
  }
}

// 重新调用 generate
// exec.js
const { exec } = require('child_process'); 
const generate = exec('yarn generate')
generate.stdout.on('data', data => console.log('stdout: ', data))
```

静态化完成后，触发generate:done回调，将发生变化的商品详情页上传至cdn。

### 4.3 解决用户访问还未静态化的详情页时的问题

修改nginx配置

```nginx
location ~/goods/(.*) {
    proxy_pass http://mycdn.com/goods/;
    if ( !-e $request_filename) {
        rewrite ~/goods/(.*) /goods/$1 break;
        proxy_pass http://127.0.0.1;
    }
}
```

当用户访问 http://myproject/goods/aaa时 ，先代理到 http://mycdn.com/goods/aaa 去cdn上找有没有aaa商品的静态页面。若未找到，则走本地服务器，进行模板渲染。


## 五、 参考

[天猫浏览型应用的CDN静态化架构演变](https://blog.csdn.net/jfkidear/article/details/72833585)
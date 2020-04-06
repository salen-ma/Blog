
- [nginx常用命令](#nginx%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4)
- [nginx 配置详解](#nginx-%E9%85%8D%E7%BD%AE%E8%AF%A6%E8%A7%A3)
- [nginx 内置变量](#nginx-%E5%86%85%E7%BD%AE%E5%8F%98%E9%87%8F)
- [nginx 日志](#nginx-%E6%97%A5%E5%BF%97)
  - [错误日志](#%E9%94%99%E8%AF%AF%E6%97%A5%E5%BF%97)
  - [访问日志](#%E8%AE%BF%E9%97%AE%E6%97%A5%E5%BF%97)
- [nginx location匹配规则](#nginx-location%E5%8C%B9%E9%85%8D%E8%A7%84%E5%88%99)
- [nginx gzip](#nginx-gzip)
- [nginx 静态资源服务器](#nginx-%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E6%9C%8D%E5%8A%A1%E5%99%A8)
  - [root和alias的区别](#root%E5%92%8Calias%E7%9A%84%E5%8C%BA%E5%88%AB)
- [nginx 反向代理](#nginx-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86)
- [nginx 移动端适配](#nginx-%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D)
- [nginx 重定向](#nginx-%E9%87%8D%E5%AE%9A%E5%90%91)
- [nginx 负载均衡](#nginx-%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1)
- [nginx 调试模块 echo-nginx-module](#nginx-%E8%B0%83%E8%AF%95%E6%A8%A1%E5%9D%97-echo-nginx-module)


## nginx常用命令

nginx -V 查看nginx详细信息  
cat nginx.conf | grep -vE "#|^$" // 查看文件去除注释和空格  
nginx -t 测试  
nginx -s reload 重启

## nginx 配置详解

[nginx 配置详解](https://www.jianshu.com/p/24a01dcb3f0a)

## nginx 内置变量

[nginx 内置变量](https://blog.csdn.net/leonnew/article/details/82732120)

## nginx 日志

### 错误日志

> error_log file level  
> 可配置位置 main, http, server, location

file 日志文件地址  
level 日志级别

日志级别有 debug | info | notice | warn | error | crit | alert | emerg 级别越高记录信息越少,生产场景一般是 warn | error | crit 这三个级别之一

### 访问日志

> log_format name format  
> access_log file name  
> 可配置位置http, server, location, if in location, limit_except

log_format  
name 格式标签  
format 日志格式

access_log  
file 日志文件地址  
name 日志标签名称

## nginx location匹配规则

> location [=|~|~*|^~] /uri/ { … }

>* =   严格匹配。如果请求匹配这个location，那么将停止搜索并立即处理此请求
>* ~   区分大小写匹配(可用正则表达式)
>* ~*  不区分大小写匹配(可用正则表达式)
>* !~  区分大小写不匹配
>* !~* 不区分大小写不匹配
>* ^~  如果把这个前缀用于一个常规字符串,那么告诉nginx 如果路径匹配那么不测试正则表达式

> 多个location配置的情况下匹配顺序为：
>* 首先匹配= ；
>* 其次匹配^~；
>* 再其次是按文件中顺序的正则匹配；
>* 最后是交给 / 通用匹配；
>* 当有匹配成功时候，停止匹配，按当前匹配规则处理请求。

## nginx gzip

[nginx gzip详解](https://www.cnblogs.com/Renyi-Fan/p/11047490.html)
gzip配置的常用参数

>* gzip on|off; #是否开启gzip
>* gzip_buffers 32 4K| 16 8K #缓冲(压缩在内存中缓冲几块? 每块多大?)
>* gzip_comp_level [1-9] #推荐6 压缩级别(级别越高,压的越小,越浪费CPU计算资源)
>* gzip_disable #正则匹配UA 什么样的Uri不进行gzip
>* gzip_min_length 200 # 开始压缩的最小长度(再小就不要压缩了,意义不在)
>* gzip_http_version 1.0|1.1 # 开始压缩的http协议版本(可以不设置,目前几乎全是1.1协议)
>* gzip_proxied # 设置请求者代理服务器,该如何缓存内容
>* gzip_types text/plain application/xml # 对哪些类型的文件用压缩 如txt,xml,html ,css
>* gzip_vary on|off # 是否传输gzip压缩标志

## nginx 静态资源服务器

### root和alias的区别

root指的是location匹配路径的上一级目录，如例一实际访问的文件是/data/wwwroot/test/
alias会将location匹配路径替换为alias指定的目录,如例二实际访问的文件就是/data/wwwroot/
```nginx
# eg1
location ^~ /test/ {
  root /data/wwwroot;
  index index.html index.htm; 
}

# eg2
location ^~ /home/ {
  alias /data/wwwroot/;
  index index.html index.htm; 
}

```

## nginx 反向代理

```nginx
location ~ ^(/v5/|/sms/|/us/|/seekerResume/|/menu/|/third/|/im/|/staff/|/perm/|/enumdict/|/role/|/loadUserRole|/pla/|/ap/|/wal/|/nj/) {
	proxy_pass http://test2.51zouchuqu.com;
}
```

## nginx 移动端适配

```nginx
location ^~ /website/ {
  # 移动、pc设备适配
  set $mobile_request '0';
  if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
    set $mobile_request '1';
  }
  if ($mobile_request = '1') {
		root /data/wwwroot/mobile/;
  }
  if ($mobile_request = '0') {
		root /data/wwwroot/pc/;
  }
	index index.html;
}
```

## nginx 重定向

rewrite regex replacement [flag];

regex：用来匹配URI的正则表达式；  
replacement：匹配成功后用来替换URI中被截取内容的字符串  
flag：用来设置rewrite对URI的处理行为,包含如下数据：

| 符号        | 说明   |
| --------   | :----:  |
| last     | 终止在本location块中处理接收到的URI，并将此处重写的URI作为新的URI使用其他location进行处理。（只是终止当前location的处理） |
| break     | 将此处重写的URI作为一个新的URI在当前location中继续执行，并不会将新的URI转向其他location。 |
| redirect     | 将重写后的URI返回客户端，状态码是302，表明临时重定向，主要用在replacement字符串不以“http://”，“ https://”或“ $scheme” 开头； |
| permanent     | 将重写的URI返回客户端，状态码为301,指明是永久重定向； |

## nginx 负载均衡

```nginx
upstream server {
  ip_hash;
	server localhost:8080 weight=1;
	server localhost:8081 weight=3;
	server localhost:8082 weight=6;
}

server {
	listen       8888;
	server_name  localhost;
	location / {
		proxy_pass http://server;
	}
}
```
ip_hash它的作用是如果第一次访问该服务器后就记录，之后再访问都是该服务器了

```js
// 测试代码
const http = require('http')
console.log(process.argv, 'process.argv')
let port = process.argv.slice(-1)[0].split('=')[1] || 8080
console.log(port, 'port')
http.createServer(async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  })
  res.end('访问端口:' + port)
}).listen(port)

pm2 start index.js --name server8082 -- port=8082
```

## nginx 调试模块 echo-nginx-module

[模块地址](https://github.com/openresty/echo-nginx-module)  
[安装方法](https://www.cnblogs.com/chenjianxiang/p/8489055.html)
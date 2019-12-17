nginx -V 查看nginx详细信息
cat nginx.conf | grep -vE "#|^$" // 查看文件去除注释和空格

> * 内置变量
> * 日志
> * 静态资源服务器
> * 反向代理
> * 移动端适配
> * 重定向
> * 负载均衡

## nginx 配置详解
[nginx 配置详解](https://www.jianshu.com/p/24a01dcb3f0a)

## nginx 内置变量
[nginx 内置变量](https://blog.csdn.net/leonnew/article/details/82732120)

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

## nginx 调试模块 echo-nginx-module
https://github.com/openresty/echo-nginx-module
安装方法 https://www.cnblogs.com/chenjianxiang/p/8489055.html

## 简易控制台插件
> 用于 博客, 论坛, IE6-7 调试信息输出的简易控制台

### 调用方法
请将该文件调用写到 `body` 标签内，写在头部会出错，因为没有写 `dom ready` 检测。  
也不要异步调用他，因为脚本有一个根据参数判定是否劫持 `console` 的过程。

所以为了简单安全，直接在 `<body>` 内调用即可。
```html
<script type="text/javascript" src="Simple-Console.min.js"></script>
```

如果是在 `IE6-7` 调试的时候用，建议开启劫持模式。
```html
<script type="text/javascript" src="Simple-Console.min.js?rep"></script>
```
### 全局方法
为了方便在 `博客`, `论坛` 等地方使用，脚本特意提供了一个 `runjs` 方法。
```js
runjs('alert("test.")');
runjs('console.log("test.")');
runjs('console.dir({key: "val"})');
```
使用方便，简单。  
好了各位客官，赶紧去各种折腾起来吧。

[作者博客]: http://www.cnblogs.com/52cik/
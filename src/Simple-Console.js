/**
 * Simple Console Js v0.3.4
 * 用于博客,论坛,IE6-7调试信息输出的简易控制台
 *
 * http://www.cnblogs.com/52cik/
 *
 * Released under the MIT license
 * Date: 2014-07-15
 */
(function(window, document, undefined) {
    
    /**
     * 创建元素
     * @param {String} tag 标签名
     * @return {Element} 返回创建的节点
     */
    function createElement(tag) {
        return document.createElement(tag);
    }

    /**
     * 添加子节点
     * @param  {Element} parent 父节点
     * @param  {Element} child  子节点
     */
    function appendChild(parent, child) {
        parent.appendChild(child);
    }
    
    var _jsconsole = createElement("div"); // 创建 js 输出 div
    appendChild(document.body, _jsconsole); // 添加到 body
    _jsconsole.id = "jsconsole"; // 设置 id
    
    // 插入 控制台部分 html
    _jsconsole.innerHTML =
        '<div class="title">' +
            '<span>js output</span>' +
            '<a href="###" id="js_close">&#215;</a>' +
        '</div>' +
        '<div id="js_contents"></div>';

    var head = document.getElementsByTagName('head')[0] || document.documentElement, // 取 head 元素
        style = createElement('style'), // 创建 styel 元素
        cssText = // 控制台部分 css
        "html{_background-image:url(about:blank);_background-attachment:fixed}"+
        "#jsconsole{font:14px/1.5 'Comic Sans MS';padding:0;width:90%;height:230px;position:fixed;bottom:17px;_position:absolute;_top:expression(documentElement.scrollTop+documentElement.clientHeight-this.offsetHeight-17+'px');left:50%;margin-left:-45%;border:1px solid #BBB;border-radius:5px;overflow:hidden;box-shadow:0px 0px 12px #CCC;background-color:#FFF;display:none;z-index:20130914}" +
        "#jsconsole .title{position:relative;height:16px;line-height:14px;padding:8px 10px;background-color:#EEE;border-bottom:1px solid #DDD}" +
        "#js_close{display:inline-block;color:#666;font:13px/12px Tahoma;text-decoration:none;height:13px;width:13px;text-align:center;position:absolute;right:11px;top:9px;border:1px solid #AAA;border-radius:3px}" +
        "#js_contents{height:180px;padding:8px 12px;color:#666;overflow-y:auto}" +
        "#js_contents .item{font-size:12px;padding:0;border-bottom:1px solid #F0F0F0;margin-bottom:2px;word-break:break-all}" +
        "#js_contents .item .msg{font-family:'Microsoft YaHei',SimSun,sans-serif}";
    appendChild(head, style); // 将样式表添加到 head 里
    
    // 摘自 seajs style 插件
    if (style.styleSheet) { // IE
        style.styleSheet.cssText = cssText;
    } else { // W3C
        appendChild(style, document.createTextNode(cssText));
    }
    
    /** Console 主代码 **/    
    var _contents = document.getElementById("js_contents"), // 控制台显示区域
        _item = createElement("div"), // 显示项目，每个项目里有 title 和 message 两个 span
        _tit = createElement("span"), // title 部分
        _msg = createElement("span"), // message 部分
        _show = false; // 默认不显示

    _item.className = "item"; // 添加 class
    _tit.className = "tit";
    _msg.className = "msg";

    appendChild(_item, _tit); // 将 title 节点添加到 item 里
    appendChild(_item, _msg); // 将 message 节点添加到 item 里

    document.getElementById("js_close").onclick = function() { // 关闭按钮 事件
        _jsconsole.style.display = "none"; // 隐藏控制台
        return _show = false; // 变量标为 false
    }

    
    /**
     * 根据条件，返回数据类型函数
     * @param {mixed}  obj 任意数据
     * @param {String} allow 允许的类型，如果类型不再允许类型范围内则返回 def 指定类型，没有指定 def，则返回 "object"
     * @param {String} def 数据类型不在允许类型范围内，则返回此字符串。
     */
    function type(obj, allow, def) {
        var _types = {}, // 存储类型用
            _type;
        
        allow = (allow || "Boolean Number String Function Array Date RegExp Object").split(" ");
        
        for (var i=0, l=allow.length; i<l; i++) {
            _types["[object " + allow[i].charAt(0).toUpperCase() + allow[i].substr(1) + "]"] = allow[i].toLowerCase();
        }
        
        _type = Object.prototype.toString.call(obj);
        
        if (!-[1,]) { // 弥补IE下 null undefined 对象, 编译后会被优化，需要手动修改回来、
            if (obj === undefined) {
                _type = "[object Undefined]";
            } else if (obj === null) {
                _type = "[object Null]";
            }
        }
        
        return _types[ _type ] || def || "object"; // 如果 不在允许类型内，则返回 def，def 未定义则返回 "object"
    }


    var _color = { // 渲染用的颜色
              "bracket": "#881280", // 括号
               "number": "#ff0000", // 数字
               "string": "#808080", // 字符串
               "regexp": "#8000FF", // 正则
              "boolean": "#000080", // 布尔
            "attribute": "#0070A5"  // 属性
        },
        _tpl = ['<span style="', '', '">', '', '</span>']; // 渲染生成的字符串
    /**
     * 根据类型简单高亮处理
     * @param {mixed}  obj 任意数据
     * @param {String} oType 类型，如果不指定，则自动判断
     * @return {String} 返回渲染后的 html
     */
    function render(obj, oType) {
        if (obj === undefined) { // 特殊处理 undefined 与 null
            obj = "undefined";
            oType = "attribute";
        } else if (obj === null) {
            obj = "null";
            oType = "attribute";
        } else if (obj === "") {
            oType = "string";
        } else if ( !oType ) {
            oType = type(obj);
            if ( oType === "string" && "{}[]()".indexOf(obj) > -1) {
                oType = "bracket";
            }
        }
        
        if (oType === "string") {
            var out = createElement("div"),
                arr = obj.split("\n");
            
            for(var i=0, l=arr.length; i<l; i++) {
                i && appendChild(out, createElement("br"));
                appendChild(out, document.createTextNode(arr[i]));
            }
            
            obj = '"' + out.innerHTML + '"';
            out = null;
        }

        return _color[oType] ? '<span style="' + _color[oType] + '">' + obj + '</span>' : obj;
    }
    
    /**
     * 输出控制台 核心函数
     * @param {String} tit 输出标题
     * @param {String} msg 输出信息
     * @param {String} color 输出颜色
     */
    function _log(tit, msg, color) {
        if(!_show) { // 如果没有显示控制台，先显示
            _jsconsole.style.display = "block";
            _contents.innerHTML = ""; // 清空显示
            _show = true;
        }
        _tit.innerHTML = tit || ""; // 插入标题
        _tit.style.color = "#0080FF"; // 标题颜色 (暂时写死)
        _msg.innerHTML = msg || ""; // 插入信息
        _item.style.color = color || "#666"; //信息颜色
        appendChild(_contents, _item.cloneNode(true)); // 克隆一份 item，添加到控制台
        _contents.scrollTop = _contents.scrollHeight; // 出现滚动条则跳到末尾
    }
    
    // window.alert = function (msg) { // 修改 alert 输出
    var _alert = function (msg) {
        _log("alert: ", render(msg));
    };
    
    var _space = " &nbsp; &nbsp; &nbsp; ", //缩进控制
        _key = function (o) { // 取执行用的 key 方法
            return type(o, "object array arguments", "nop"); // 只允许 object array 类型，否则返回 nop
        };
    
    var jshelper = { // 根据类型处理，只定义了，object array nop 类型
        object: function (obj, deep) { // 处理对象方法
            deep = deep || 0; // 递归深度，(用于控制缩进层级数)
            var _indent = new Array(deep + 1).join(_space), // 控制 {}[] 的缩进
                _indentex = new Array(deep + 2).join(_space), // 控制其他内容缩进
                _type = "", // 保存变量类型，用于递归处理
                _ret = _indent + (deep ? "" : "<br>") + render("{", "bracket") + '<br>'; // 返回对象数据的 { 缩进控制字符串 (简单的处理了下高亮)

            for (var k in obj) { // 遍历对象
                _type = _key(obj[k]); //取对象类型
                /**
                 * _indentex 缩进控制
                 * k 当前对象的 key
                 * _type 当前对象的值的类型
                 * 如果当前对象的值的类型是 object 就进行换行，进行递归对象的缩进
                 * this[ _type ]( obj[k], deep+1 ) 进行递归处理
                 * 当对象值类型是 object 时，相当于调用 this.object(obj[k], deep+1)
                 * 把返回数据累加到 _ret
                 **/
                _ret += _indentex + render(k, "attribute") + ": " + (_type === "object" ? "<br>" : "") + this[ _type ]( obj[k], deep+1 ) + "<br>";
            }
            _ret += _indent + render("}", "bracket"); // 拼接上末尾的 } 字符串 (简单的处理了下高亮)
            return _ret; // 返回当前层处理的数据
        },
        array: function (obj, deep) { // 处理数组方法，和对象处理类似，但是简单多了
            deep = deep || 0; // 递归深度
            var _type = "", // 当前值类型
                _sp = "", // 数组间的 , 分割，因为要展开显示，所以没法 join(", ")， join的话，对象就直接显示 [object Object] 了
                _ret = render("[", "bracket"); // 缩进的 [ 字符串 (简单的处理了下高亮)

            //for (var i=0,l=obj.length; i<l; i++ ) { // 数组遍历
            for (var i in obj) { // 数组遍历
                _type = _key(obj[i]); // 当前值的类型
                /**
                 * _sp 是 ", " 分隔符，第一次没有赋值，所以一开始加上的是 "" 空字符
                 * 如果当前对象的值的类型是 object 就进行换行，进行递归对象的缩进
                 * this[ _type ]( obj[k], deep+1 ) 进行递归处理
                 * 当对象值类型是 object 时，相当于调用 this.object(obj[k], deep+1)
                 * 把返回数据累加到 _ret
                 **/
                 
                 if (isNaN(i)) {
                    _ret += _sp + render(i, "attribute") + ": " + (_type === "object" ? "<br>" : "") + this[ _type ]( obj[i], deep+1 );
                 } else {
                    _ret += _sp + (_type === "object" ? "<br>" : "") + this[ _type ]( obj[i], deep+1 );
                 }
                _sp = ", "; // 下次循环， 分隔符就是 逗号 了、
            }

            return _ret + '<span style="color:#881280">]</span>'; //返回末尾的 ] 字符串 (简单的处理了下高亮)
        },
        nop: function (obj) { // 其他类型都直接输出
            return render(obj);
        }
    };
    
    var _console = { // 覆盖 console 功能
        log: function() { // 控制台 log 方法 (最简单，所有参数都直接输出, 无法显示复杂类型数据)
            var _ret = [], _type, _args = arguments;
            for (var i=0, l=_args.length; i<l; i++) {
                _type = _key(_args[i]);
                if (_type === "arguments" || _type === "object" && _args[i].callee) { // Arguments 对象特殊处理
                    _type = "array";
                }
                _ret.push( jshelper[ _type ]( _args[i] ) );
            }
            _log( "console.log: ", _ret.join(", ") );
        },
        dir: function(obj) { // 控制台 dir 方法，用于展开 对象 或 数组
            _log(
                "console.dir: ", (jshelper)[ _key(obj) ]( obj ) // 根据 obj 的类型处理 obj 数据
            );
        },
        _cacheTime: {}, // 控制台 time 方法用的时间缓存对象
        time: function(name) { // 控制台 time 方法，根据 name 记录时间
            this._cacheTime[name] = +new Date(); // 把 name 的触发时间 缓存
        },
        timeEnd: function(name) { // 控制台 timeEnd 方法，根据 name 处理输出所用时间
            if (!this._cacheTime[name]) { // 如果不存在这输出 name is not find.
                _log("console.time: ", "[ " + name + " ] is not find!", "red");
                return;
            }
            var _now = +new Date(); // 结束时间，
            _log("console.time[ " + render(name, "attribute") + " ]: ", render(_now - this._cacheTime[name], "number") + "ms"); // 结束时间 - 触发时间 = 所用时间
            delete this._cacheTime[name]; // 删除 name 缓存
        },
        error: function() {
            var _ret = [], _args = arguments;
            for (var i=0,l=_args.length; i<l; i++) {
                _ret.push(_args[i]);
            }
            _log('', _ret.join(', '), 'red');
        },
        clear: function() { // 清空控制台，其实没什么必要，可是比较简单，就随便写写、、
            _contents.innerHTML = "";
            _log("Console was cleared.");
        }
    };
    
    var scripts = document.scripts,
        _bak_alert = window.alert, // 保存原生方法
        _bak_console = window.console;
    
    var isRep = scripts[scripts.length-1].src.indexOf('rep') > -1;
    if (isRep) {
        window.alert = _alert; // 替换原生方法
        window.console = _console;
        window._alert = _bak_alert;
        window._console = _bak_console;
        _bak_console && _bak_console.log('请使用 _alert 或者 _console 代替进行调试。');
    }
    
    /** runjs v0.01 beta**/
    window.runjs = (function() {
        var scriptNode = createElement("script");
        scriptNode.type = "text/javascript";
        scriptNode.charset = document.charset || document.characterSet || "";
        
        var strTry = ['try{', '\n}catch(e){console.error(e.name+": "+e.message)}']; // 捕捉运行时错误
            
        return function (code, istry, charset) {
            var node = scriptNode.cloneNode(); // 克隆一个副本
            charset && (node.charset = charset);
            
            if (!isRep) { // 如果已经替换就不替换了
                window.alert = _alert; // 替换原生方法
                window.console = _console;
            }
            node.text = istry ? code : strTry.join(code); // 写入执行代码
            
            appendChild(head, node); // 添加到head，并运行js
            head.removeChild(node); // 移除节点
            node = null; // 释放dom
            
            if (!isRep) {
                setTimeout(function () { // 修复运行时替换 console.time 导致的 BUG
                    window.alert = _bak_alert; // 回复原生方法
                    window.console = _bak_console;
                }, 99);
            }
        }
    })();
})(window, document);

/**
 * v0.3.4 - 2014-07-15 22:54:57
 * 修复运行时替换 console.time 导致的 BUG
 *
 * v0.3.3
 * 修复替换导致的 $$ $' $` $& 丢失问题
 */

/**
 * 2014-06-28
 * 更新了劫持模式，默认不劫持
 * 加参数 ?rep 的时候才劫持。
 * 比如 IE6-8 调试的时候，可以直接劫持，反正他们没有 console 对象。
 * 例如：<script type="text/javascript" src="Simple-Console.js?rep"></script>
 * 
 * 论坛，博客等调用的时候最好别劫持，因为 runjs 函数内部会在运行期间劫持，结束后复原。
 * 
 * 最后感谢落叶的蚂蚁论坛为本插件进行了一年多，全方面测试，修复了大量BUG，目前运行稳定。。
 */
 
/**
 * 2013-09-20
 * 最后说一点点。。。
 * 该脚本其实就模拟了一点点控制台常用的输出方法，
 * 并和谐了 alert 输出，让调试就变得方便了。
 * 可能你觉得用不到，因为限度浏览器直接F12即可，
 * 那我举个简单例子：IE 6, 7 下怎么调试？
 * 你可能会说：有插件啊。 
 * yes！完全正确。
 * 
 * 当你的博客写了篇关于 js 的文章，
 * 你是想让他直接复制代码，然后 F12 调试呢，
 * 还是直接点 "运行", 然后弹层显示结果呢？
 * 反正我正巧遇到了，所以就写了个，兼容 IE6-11, chrome, firefox
 * 至于对你有没有用，我也不知道，用到的话，记得过来拿就好了。
 **/
 
 /**
  * 几个简单的应用列子
  * 普通输出测试
  * alert("alert test"); //alert test
  * console.log("log test", 1, 2, "hehe"); //log test, 1, 2, hehe
  * console.dir("dir test", 1, 2, "hehe"); //dir test
  * console.dir({str:"hehe...", number:1234, arr:[11, "22", {innerStr:"inner", innerarr:[11,22,33]}, /regexp/, true], date:new Date()});
  * 对象，数组会展开后输出。
  * {
  *       str: hehe...
  *       number: 1234
  *       arr: [11, 22, 
  *             {
  *                   innerStr: inner
  *                   innerarr: [11, 22, 33]
  *             }, /regexp/, true]
  *       date: Sun Sep 15 2013 16:39:50 GMT+0800 (China Standard Time)
  * }
  * 
  * 计时输出测试：
  * console.time("arr[ i ] = i"); //记录开始时间
  * for(var i=0,arr=[ i ]; i<1e7; i++) { //1000W次数组赋值测试
  *     arr[ i ] = i;
  * }
  * console.timeEnd("arr[i] = i"); //结算消耗时间
  * 输出: console.time[ arr[i] = i ]: 14090ms
  * 
  * console.time("arr.push(i)"); //记录开始时间
  * for(var i=0,arr=[ i ]; i<1e7; i++) { //1000W次数组赋值测试
  *     arr.push(i);
  * }
  * console.timeEnd("arr.push(i)"); //结算消耗时间
  * 输出: console.time[ arr.push(i) ]: 11142ms
  * 
  * 没了，就这么几个简单常用的方法。
  **/
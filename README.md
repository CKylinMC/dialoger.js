# Dialoger

![dialoger](https://i.loli.net/2018/04/21/5adaa3e533398.png)

Dialoger是一个简单对话框组件，基于 Html5 的`<dialog>`标签。由于大部分浏览器尚不支持这个特性，可以通过额外加载dialogPolyfill的方式获得支持。此对话框不需要JQuery支持。

## 使用

在项目中引用dialoger.js和dialoger.css。如果要引用dialogPolyfill，请在dialoger引用前先引用dialogerPolyfill。

#### 初始化

```javascript
dialoger.init()
```

这一步骤将会在网页中插入必须的组件。请确保网页中没有其他的ID为dialoger或dialog-*的元素。

#### 创建一个对话框

```javascript
dialoger.create()
```

这一行会开始初始化一个对话框。包含参数的写法是：

```javascript
dialoger.create(content = '',title = '',closebutton = '关闭',closecallback = (function(){}),okbutton = '确认',okcallback = '')
```

我不是很喜欢这个写法，但是依然保留了。

上面一行会把dialoger自身返回，可以快速拼凑语句。下面的写法会直接更新对话框。

```javascript
.setTitle("标题")//设置标题
.setContent("内容")//设置内容

.setCloseButton("按钮文本",function(){/* onClick */},/* 设置是否隐藏 */ false)//设置关闭按钮
.setOkButton("按钮文本",function(){/* onClick */},/* 设置是否隐藏 */ false)//设置确定按钮
//当然以上两个设置按钮的方法也可以拆分：
.setCloseButtonText(string)
.setCloseButtonAction(function)
.hideCloseButton(boolean)
.setOkButtonText(string)
.setOkButtonAction(function)
.hideOkButton(boolean)
//同时可以修改其样式：
.setCloseButtonStyle(int & string)
.setCloseButtonStyle(int & string)
//可以填写以下样式的名字或序号(0开始)：
//['default','primary','success','light','green','chocolate','deep','disable','disabled','warning','error']

//当一切准备就绪后，可以使用下面这一行来显示
.show()
//也可以使用下面这一行来关闭对话框
.close()
//要注意的是因为过渡动画的实现方法，在关闭动画结束以前，对话框不会真的关闭。如果需要切换对话框，请直接创建一个新的对话框覆盖即可。
```

如果对话框真的很简单就一行字，那么直接用下面这个方法即可：

```javascript
dialoger.newDialog()
```

参数等同于`dialoger.create`，只是会立刻打开对话框。



## 其他

这个对话框是我初学时的练手作品，所以很多地方都不是最优解决方案，甚至很蠢，有很多的坑。发布上来只是想要记录一下。



















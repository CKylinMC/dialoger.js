/**
	Dialoger.js
	@author CKylinMC
	@version 1.1
	@class dialoger
*/


////////////[Init]////////////

var dialoger = {};

//dialoger 初始化状态
dialoger.inited = false;

//dialoger 初始化方法
dialoger.init = function (force) {
	if(!this.inited){
		if(!this.checkSupport(false)&&!force) {
		    console.error("[dialoger] DialogPolyfill is required with this browser!");
		    this.inited = false;
		    return this;
        }
		dialogdiv = document.createElement('div');
		dialogdiv.id = 'dialoger-dialogs';
		document.body.appendChild(dialogdiv);
		let templete = document.createElement('script');
		templete.type = 'text/templete';
		templete.id = 'dialogtemplete';
		let templetecontent = '';
		templetecontent+= "    <dialog id=\'dialoger-dialog\' oncancel='dialoger.Triggers.oncancel(event);return false;'>";
		templetecontent+= "        <div id=\'dialog-card\' class=\'dialog-card dialog\'>";
		templetecontent+= "        <div class=\'dialog-header\' id=\'dialog-header\'></div>";
		templetecontent+= "        <div class=\'dialog-body\' id=\'dialog-contents\'></div>";
		templetecontent+= "        <div class=\'dialog-footer dialog-footer-right\'>";
		templetecontent+= "            <button class=\'dialog-button primary\' id=\'dialog-ok\' onclick=\'dialoger.close();dialoger.dialog.okCallback();\' 	style=\'display:none\'>Ok</button>";
		templetecontent+= "            <button class=\'dialog-button\' id=\'dialog-close\' onclick=\'dialoger.close();dialoger.dialog.closeCallback();\' 	style=\'display:inline-block\'>Close</button>";
		templetecontent+= "        </div>";
		templetecontent+= "        <div class=\'dialog-clear\'></div>";
		templetecontent+= "    </div>";
		templetecontent+= "    </dialog>";
		templete.innerHTML = templetecontent;
		document.body.appendChild(templete);
		this.inited = true;
	}else console.warn("[dialoger] Dialoger has already inited.");
	return this;
};
dialoger.checkInit = function(){
	if(!this.inited){
		console.error("[dialoger] Dialoger has never been inited.");
		return false;
	}else{
		return true;
	}
};
dialoger.checkSupport = function(showRes = true){
	if(!document.createElement("dialog").showModal){
		if ("undefined" === typeof (dialogPolyfill)) {
			if(showRes) console.info("[dialoger] Your browser not support <dialog> tag, but dialogPolyfill could work! :)");
			return true;
        }
		else{
            if(showRes) console.info("[dialoger] Your browser not support <dialog> tag, and dialogPolyfill couldn't work too. Dialoger may not work on your browser...:(");
			return false;
        }
	}else{
        if(showRes) console.info("[dialoger] Your browser support <dialog> tag! :D");
		return true;
    }
};

////////////[Class Helpers]////////////

dialoger.addClass = function(obj, cls){
    let obj_class = obj.className;
    let blank = (obj_class != '') ? ' ' : '';
    let added = obj_class + blank + cls;
    obj.className = added;
};
dialoger.delClass = function(obj, cls){
    let obj_class = ' '+obj.className+' ';
    obj_class = obj_class.replace(/(\s+)/gi, ' ');
    let removed = obj_class.replace(' '+cls+' ', ' ');
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');
    obj.className = removed;
};
dialoger.hasClass = function(obj, cls){
    let obj_class = obj.className;
    let obj_class_lst = obj_class.split(/\s+/);
    let x = 0;
    for(x in obj_class_lst) {
        if(obj_class_lst[x] == cls) {
            return true;
        }
    }
    return false;
};
dialoger.inArr = function(value,array){
	for(let i in array){
		if(array[i]===value){
			return true;
		}
	}
	return false;
};
dialoger.isNum = function(num,returnContent = false){
	try{
		num = parseInt(num);
		if(returnContent) return num;
		return true;
	}catch(e){
		return false;
	}
};
dialoger.addButtonStyle = function(styleConfig){
	if(typeof(styleConfig)!=="object") styleConfig = {};
	let style = {
		name: styleConfig.name||"buttonCustomTheme_"+Math.random().toString(36).substr(4),
		bgColor: (styleConfig.bgColor||null)||"#e6e6e6",
		textColor: (styleConfig.textColor||null)||"black"
	};
	let css = ".dialog-button."+style.name+"{background-color:"+style.bgColor+";color:"+style.textColor+"} "
		+".dialog-button."+style.name+":active{background-color:"+style.bgColor+";color:"+style.textColor+"}"
	let styleE = document.createElement("style");
	styleE.innerHTML = css;
	document.getElementsByTagName("body")[0].insertBefore(styleE,document.getElementsByTagName("body")[0].children[0]);
	this.stylenames.push(style.name);
	return style.name;
};

////////////[Dialogs]////////////

dialoger.dialog = {};
dialoger.dialog.closeCallback = (function(){});
dialoger.dialog.okCallback = (function(){});

//dialoger 对话框创建
dialoger.create = dialoger.createDialog = function(content = '',title = '',closebutton = '关闭',closecallback = (function(){}),okbutton = '确认',okcallback = ''){
	if(!this.checkInit()) return;
    let div = document.getElementById('dialoger-dialogs');
    div.innerHTML = document.getElementById('dialogtemplete').innerHTML;
    //showModal();
    this.setTitle(title);
    this.setContent(content);
    //if(typeof(closecallback)=='function'){
        this.setCloseButtonText(closebutton);
        this.dialog.closeCallback = closecallback;
    //}
    if(typeof(okcallback)=='function'){
        this.setOkButtonText(okbutton);
        this.dialog.okCallback = okcallback;
    }
    return this;
};

//创建立刻显示的对话框
dialoger.newDialog = function(content = '',title = '',closebutton = '关闭',closecallback = (function(){}),okbutton = '确认',okcallback = ''){
	return this.create(content,title,closebutton,closecallback,okbutton,okcallback).show();
};

//存储初始化的dialog元素
dialoger.Element = '';

////////////[Settings]////////////

//显示对话框
dialoger.show = function(){
    this.Element = document.querySelector('#dialoger-dialog');
    if(!this.checkSupport(0)) {
    	// if("undefined" === typeof("dialogPolyfill")){
    	// 	console.error("[dialoger] Can't open a dialog! Please load dialogPolyfill!");
        //     this.inited = false;
        //     return this;
		// }
    	dialogPolyfill.registerDialog(this.Element);
    }
    // Now dialog acts like a native <dialog>.
    this.Element.showModal();
    this.addClass(document.getElementById('dialog-card'),'on');
    this.addClass(document.getElementById('dialoger-dialog'),'show');
	return this;
};

//退出对话框
dialoger.close = function(){
    this.addClass(document.getElementById('dialog-card'),'off');
    this.addClass(document.getElementById('dialoger-dialog'),'hide');
    setTimeout((function(){dialoger.Element.close()}),300);
	return this;
};

//动态设置dialoger对话框的标题
dialoger.setTitle = function(text = ''){
    document.getElementById('dialog-header').innerHTML = text;
	return this;
};

//动态设置dialoger对话框内容
dialoger.setContent = function(text = ''){
    document.getElementById('dialog-contents').innerHTML = text;
	return this;
};

dialoger.stylenames = ['default','primary','success','light','green','chocolate','deep','disable','disabled','warning','error'];
dialoger.changeStyles = function(targetDom = null,newstyle = null){
	if(targetDom&&targetDom instanceof HTMLElement){
		for(let i in this.stylenames){
			if(this.hasClass(targetDom,this.stylenames[i])){
				this.delClass(targetDom,this.stylenames[i]);
			}
		}
		if(newstyle){
			if((num = this.isNum(newstyle,1))&&num>=0&&num<=this.stylenames.length){
				newstyle = this.stylenames[num];
			}
			if(!this.inArr(newstyle,this.stylenames)){
				console.warn("[dialoger] Set styles failed.");
				return this;
			}
			this.addClass(targetDom,newstyle);
		}
		return this;
	}else{
		console.warn("[dialoger] Cant change styles, DOM is invaild.");
		return this;
	}
};

//dialoger默认关闭按钮设置

dialoger.setCloseButton = function(text,action,hide = false){
	this.setCloseButtonText(text);
	this.setCloseButtonAction(action);
	this.hideCloseButton(hide);
	return this;
};
dialoger.setCloseButtonText = function(text = '关闭'){
    //dialoger.hideCloseButton(false);
    document.getElementById('dialog-close').innerHTML = text;
	return this;
};
dialoger.setCloseButtonAction = function(closecallback = (function(){})){
    this.dialog.closeCallback = closecallback;
	return this;
};
dialoger.setCloseButtonStyle = function(classname = "default"){
	if((num = this.isNum(classname,1))&&num>=0&&num<=this.stylenames.length){
		classname = this.stylenames[num];
	}
	if(!this.inArr(classname,this.stylenames)){
		console.warn("[dialoger] Set close button style failed.");
		return this;
	}
	this.changeStyles(document.getElementById('dialog-close'),classname);
	return this;
};
dialoger.hideCloseButton = function(hide = true){
	if(hide){
		document.getElementById('dialog-close').style.display = 'none';
	}else{
		document.getElementById('dialog-close').style.display = 'inline-block';
	}
	return this;
};

//dialoger主按钮设置

dialoger.setOkButtonText = function(text = '确认'){
    //dialoger.hideOkButton(false);
    document.getElementById('dialog-ok').innerHTML = text;
	return this;
};
dialoger.setOkButtonAction = function(okcallback = (function(){})){
    this.dialog.okCallback = okcallback;
	return this;
};
dialoger.setOkButtonStyle = function(classname = "primary"){
	if((num = this.isNum(classname,1))&&num>=0&&num<=this.stylenames.length){
		classname = this.stylenames[num];
	}
	if(!this.inArr(classname,this.stylenames)){
		console.warn("[dialoger] Set ok button style failed.");
		return this;
	}
	this.changeStyles(document.getElementById('dialog-ok'),classname);
	return this;
};
dialoger.hideOkButton = function(hide = true){
	if(hide){
		document.getElementById('dialog-ok').style.display = 'none';
	}else{
		document.getElementById('dialog-ok').style.display = 'inline-block';
	}
	return this;
};
dialoger.setOkButton = function(text,action,hide = false){
	this.setOkButtonText(text);
	this.setOkButtonAction(action);
	this.hideOkButton(hide);
	return this;
};

////////////[Triggers]////////////

dialoger.Triggers = {};

//设置使用ESC按键退出dialoger时的回调
dialoger.Triggers.oncancel = function(e){
	this.close();
	this.dialog.closeCallback(e);
};


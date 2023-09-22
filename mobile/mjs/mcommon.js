function clearArray(arr){
    for (var key in arr) {
        delete arr[key]
    }
    arr.length = 0
}
function second2time(sec, opts) {
    var second, d, h, m, s;
    var ret = "";
    second = Math.abs(sec);
    if (typeof opts == "undefined" || opts.indexOf('h') >= 0) {
        h = parseInt(second / 60 / 60 % 24);
        ret = "" + h < 10 ? ("0" + h) : h
    }
    if (typeof opts == "undefined" || opts.indexOf('m') > 0) {
        m = parseInt(second / 60 % 60);
        if(ret != ""){ret += ":"}
        ret += "" + m < 10 ? ("0" + m) : m
    }
    if (typeof opts == "undefined" || opts.indexOf('s') >= 0) {
        s = parseInt(second % 60);
        if(ret != ""){ret += ":"}
        ret += "" + s < 10 ? ("0" + s) : s
    }
    if (typeof opts == "undefined" || opts.indexOf('d') >= 0) {
        d = parseInt(second / 60 / 60 / 24);
        if(d>0){ret = "" + d +"D " + ret}
    }
    if (sec < 0){
        ret = "-" + ret
    }else if(typeof opts != "undefined" && opts.indexOf('-') >= 0){
        ret = "+" + ret
    }
    return ret
}

 function formatSecToStr(value){
	let seconds = parseInt(value);
  	let hourSec = 60 * 60;
  	let minuteSec = 60;
    let hh = Math.floor(seconds / hourSec).toString().padStart(2, '0');//多少小时
    let mm = Math.floor((seconds % hourSec) / minuteSec).toString().padStart(2, '0');//多少分钟
    if(hh > 0){
      return hh + ":" + mm ;
    } else if (mm > 0){
      return  "00:" + mm;
    }else{
      return "00:00";
    }
}

//tab init
function pagechanged(page){  
    if (typeof page != "undefined" && page.substring(0, 1) == "#") {
        var $page = $("ul.tabbar li[target='" +page+"']");//find page object
        $page.parent().find(".tab_active").removeClass("tab_active");//deactive oldpage
        $page.addClass("tab_active");//active newpage
        $page.parent().parent().find(".tab_content").hide();//hide all
        $(page).show();
        $page.focus();
    }    
}
$(document).ready(function() {
    $.each($("ul.tabbar li a"), function(i, value){
        $item = $(value);
        $item.text($item.attr("title"));
    });
    $("ul.tabbar li").click(function() {
        var newpage = $(this).attr("target");
        pagechanged(newpage);
    })
});
var draggable = false;
var dlgDrag;
var mouseX, mouseY, drawnX, drawnY, diffX, diffY;
document.onmousemove = dragmove;
function dragmove(e) {
    var sx = window.scrollX || document.documentElement.scrollLeft || 0;
    var sy = window.scrollY || document.documentElement.scrollTop || 0;
    if (!e) e = window.event;
    mouseX = e.clientX + sx;
    mouseY = e.clientY + sy;
    var deltaX = mouseX - diffX;
    var deltaY = mouseY - diffY;
    diffX = mouseX;
    diffY = mouseY;
	
    if (draggable) {		
        var e = e||event;
        var l = e.clientX - drawnX;
        var t = e.clientY - drawnY;
        //此处的判断是为了防止拖拽框被拖出屏幕可视区域
        if(l < 0) {
            l = 0;
        }else if(l > document.documentElement.clientWidth - dlgDrag.offsetWidth){
            l = document.documentElement.clientWidth - dlgDrag.offsetWidth;
        }
        if(t < 0) {
            t = 0;
        }else if(t > document.documentElement.clientHeight- dlgDrag.offsetHeight){
            t = document.documentElement.clientHeight - dlgDrag.offsetHeight;
        }
        dlgDrag.style.left = l + 'px';
        dlgDrag.style.top  = t + 'px';
	}
    return true;
}

function dragstart(dlgId, e) {
    dlgDrag = document.getElementById(dlgId);
    draggable = true;
    drawnX = mouseX - dlgDrag.offsetLeft;
    drawnY = mouseY - dlgDrag.offsetTop;

    if (e.cancelable) {
        e.preventDefault()
    }
    if (window.event) {
        window.event.returnValue = false
    }
    dlgDrag.onmouseup = function() {
        draggable = false;
        dlgDrag = null
    }
}

function showLoading(visibled, msg) {    
    if (visibled) { 
        $("body").append("<div class='modalmask' ontouchmove='event.preventDefault();'></div>");
        var $dlg = $("<div id='dlg_loading' class='dialog' style='width: 300px;'></div>").appendTo("BODY");
        $("<div class='out'><div class='in'><span id='tips'></span></div></div>").appendTo($dlg);
        $dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height()) + "px");
        $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
        if(typeof msg =="undefined" || msg==""){
            if(typeof JS_GLOBAL_TIPS == "undefined"){
                msg = window.parent.JS_GLOBAL_TIPS;
            }else{
                msg = JS_GLOBAL_TIPS;
            }
        }
        $dlg.find("#tips").html(msg);
        $dlg.css("display", "block")
    } else {
        $("body #dlg_loading").remove();
        $(".modalmask").remove()
    }
}
function showMessage(icon, title, prompt, delay) {
    var $dlg = $("<div id='dlg_msgbox' class='dialog' style='width: 300px;'></div>").appendTo("BODY");
    $("<div class='out'><div class='in'><p></p><div style='min-height: 50px;_height: 50px;'><span id='content' style='display:block; padding: 20px 15px 20px 55px;'></span></div></div></div>").appendTo($dlg);
    $dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height()) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
    $dlg.find("p").text(title);
    $dlg.find("#content").addClass("icon_"+icon).html(prompt);
    $dlg.css("display", "block").mousemove(function() {
        $dlg.remove()
    });
	if(delay == null){
		delay = 2;
	}
    setTimeout(function() {$dlg.remove()}, delay * 1000)
}

function error(x){
	x;
}


function getIdValue(id, io, string){
	if(id == null || id.length < 1 || io == null || io.length < 1){
		return null;
	}
	
	var ios = io.split(",");
	for(var i = 0; i < ios.length; i++){
		var key4val = ios[i].split(":");
		if(ios[i].indexOf(id) == 0 && key4val.length == 2){
			if(string != null && typeof string != "undefined" && string){
				return key4val[1];
			}else{
				return key4val[1].length == 0 ? null:parseFloat(key4val[1]);
			}				
		}
	}
	return null;
}

function removeIdValue(id, io){
	if(id == null || id.length < 1 || io == null || io.length < 1){
		return "";
	}
		
	var newIoTable = "";
	var ios = io.split(",");
	
	for(var i = 0; i < ios.length; i++){
		var key4val = ios[i].split(":");
		if(key4val.length == 2){
			if(!ios[i].startsWith(id + ":")){
				newIoTable += key4val[0] +":"+ key4val[1] + ",";
			}
		}
	}
	if(!newIoTable.startsWith(",")){
		newIoTable = "," + newIoTable;
	}
	return newIoTable;
}

function getIdByIndex(io, index){
	if(io == null || io.length < 1){
		return null;
	}
	
	io = io.replace(new RegExp(',+',"gm"),','); 	
	var ios = io.split(",");

	if(ios.length - 2 >= index){		
		if(ios[index + 1] != null){
			var key4val = ios[index + 1].split(":");
			if(key4val.length == 2){
				return parseInt(key4val[0], 16);
			}
		}
	}
	
	return null;
}

function getElementIndex(id, io){
	if(id == null || id.length < 1 || io == null || io.length < 1){
		return "";
	}
	
	io = io.replace(new RegExp(',+',"gm"),','); 	
	var ios = io.split(",");
	
	for(var i = 0; i < ios.length; i++){
		var key4val = ios[i].split(":");
		if(key4val.length == 2){
			if(ios[i].startsWith(id + ":")){
				return i;
			}
		}
	}	
	return null;
}

function getStatusByIndex(index, status){
	if(index != null && status != null){
		var status_array = status.split(";").reverse();	
		if(status_array[0] != null){
			var one = status_array[0].split("<br>")[index - 1];
			var i = one.indexOf(":");
			return (one.substring(i + 1)).trim();//one.split(":")[1];
		}
	}	
	return "--";
}

function downloadCSV(file, data) {
    $("body").append('<form id="frmupload" action="download.php" method="post" target="_blank"><input type="text" id="file_name" name="file_name"/><textarea cols="500" id="file_data" name="file_data" wrap="off"></textarea></form>');
    $("#file_name").val(file);
    $("#file_data").val(data);
    $("#frmupload").submit().remove();
    return true
}
function downloadRPT(file, alias) {
    $("body").append('<form id="frmupload" action="download.php" method="post" target="_blank"><input type="text" id="file_name" name="file_name"/><input type="text" id="file_alias" name="file_alias"/></form>');
    $("#file_name").val(file);
    $("#file_alias").val(alias);
    $("#frmupload").submit().remove();
    return true
}
function loadScript(url,oCallback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
	// most browsers
	script.onload = oCallback;
	// IE 6 & 7
	script.onreadystatechange = function() {
		if (this.readyState == 'complete') {
			oCallback();
		}
	}
    document.body.appendChild(script);
}
/*
function formatDate(date, format) {   
    if (!date) return;   
    if (!format) format = "yyyy-MM-dd";   
    switch(typeof date) {   
        case "string":   
            date = new Date(Date.parse(date.replace(/-/g, "/")));   
            break;   
        case "number":   
            date = new Date(date);   
            break;   
    }    
    if (!date instanceof Date) return;   
	var dict = {   
        "yyyy": date.getFullYear(),   
        "M": date.getMonth() + 1,   
        "d": date.getDate(), 
        "H": date.getHours(),   
        "m": date.getMinutes(),   
        "s": date.getSeconds(),   
        "MM": ("" + (date.getMonth() + 101)).substr(1),   
        "dd": ("" + (date.getDate() + 100)).substr(1),   
        "HH": ("" + (date.getHours() + 100)).substr(1),   
		"hh": ("" + (date.getHours()/12 + 100)).substr(1), //小时    
        "mm": ("" + (date.getMinutes() + 100)).substr(1),   
        "ss": ("" + (date.getSeconds() + 100)).substr(1)   
    };

    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {   
        return dict[arguments[0]];   
    });                   
}
*/

   /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * java风格
     * eg:
     * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
function formatDate(date, fmt) {
	if (!date) return;   
    if (!fmt) fmt = "yyyy-MM-dd";   
    switch(typeof date) {   
        case "string":   
            date = new Date(Date.parse(date.replace(/-/g, "/")));   
            break;   
        case "number":   
            date = new Date(date);   
            break;   
    }    
    if (!date instanceof Date) return; 
	
    var o = {
        "M+" : date.getMonth() + 1, //月份
        "d+" : date.getDate(), //日
        "h+" : date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
        "H+" : date.getHours(), //小时
        "m+" : date.getMinutes(), //分
        "s+" : date.getSeconds(), //秒
        "q+" : Math.floor((date.getMonth() + 3) / 3), //季度
        "S" : date.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function unique(arr){
    var tmp = new Array();
    for(var i in arr){
	    if(tmp.indexOf(arr[i]) == -1){
	        tmp.push(arr[i]);
	    }
	}
    return tmp;
}

function sortKey2Value(arr){
	var newarr = new Array();
	for (key in arr){
	    newarr.push(key);
	}
	newarr.sort(function (x, y){
		return x < y ? 1 : -1;
	});
	
	var values = new Array();
	for (var i = 0; i < newarr.length; i++){
	    values.push(arr[newarr[i]]);
	}	
	return values;
}

function newDate(str) {
	var date = new Date(); 
	if(str.split(" ").length == 2){
		var yyyymmdd = str.split(" ")[0].split('-');
		var hhmmss = str.split(" ")[1].split(':');			
		date.setUTCFullYear(yyyymmdd[0], yyyymmdd[1] - 1, yyyymmdd[2]);
		
		if(hhmmss.length == 3){
			date.setUTCHours(hhmmss[0], hhmmss[1], hhmmss[2], 0);
		}else{
			date.setUTCHours(hhmmss[0], hhmmss[1], 0, 0);
		}			
	}else{
		var yyyymmdd = str.split('-');
		date.setUTCFullYear(yyyymmdd[0], yyyymmdd[1] - 1, yyyymmdd[2]);
		date.setUTCHours(0, 0, 0, 0);
	}
	return date;
} 

//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}

//获取下一年时间，格式YYYY-MM-DD
function getNextYearFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear() + 1;
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var nextyeardate = year + seperator1 + month + seperator1 + strDate;
	return nextyeardate;
}

//获取当前时间，格式YYYY-MM-DD HH:MM:SS
function getCurentDateTime(){ 
	var now = new Date();
   
	var year = now.getFullYear();       //年
	var month = now.getMonth() + 1;     //月
	var day = now.getDate();            //日
   
	var hh = now.getHours();            //时
	var mm = now.getMinutes();          //分
	var ss = now.getSeconds();          //秒
   
	var clock = year + "-";
   
	if(month < 10)
		clock += "0";
   
	clock += month + "-";
   
	if(day < 10)
		clock += "0";
	   
	clock += day + " ";
   
	if(hh < 10)
		clock += "0";
	   
	clock += hh + ":";
	
	if (mm < 10) 
		clock += '0'; 
	
	clock += mm + ":"; 
	
	if (ss < 10) 
		clock += '0';

	clock += ss; 
	
	return(clock); 
} 

/*
 * 计算两点对于正北方向的朝向角度 [0,360]
 * @param {*} start format:{'latitude': 30, 'longitude': 120 }
 * @param {*} end
 */
function bearing(start, end) {
	let rad = Math.PI / 180,
      	lat1 = start.latitude * rad,
      	lat2 = end.latitude * rad,
      	lon1 = start.longitude * rad,
      	lon2 = end.longitude * rad;
    const a = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const b = Math.cos(lat1) * Math.sin(lat2) -
        	  Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

   	return radiansToDegrees(Math.atan2(a, b));
}

/*
 * 弧度转换为角度
 */
function radiansToDegrees(radians) {
    const degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}

function speedUnitConversion(value, unit){
	value = parseFloat(value);
	if(unit == 1){
		//mph
		value = (value * 0.6213712);
	}
	//kph
	return parseFloat(value.toFixed(0));
}

function mileageUnitConversion(value, unit){
	value = parseFloat(value);
	if(unit == 1){
		//Mile(英里)
		value = value * 0.6213712;
	}else if(unit == 2){
		//Nautical mile(海里)
		value = value * 0.5399568;
	}
	//km
	return parseFloat((value/10).toFixed(0));
}

function fuelUnitConversion(value, unit){
	value = parseFloat(value);
	if(unit == 1){
		//Gallon(加仑)
		value = (value * 0.2199692);
	}
	//Liter(升)
	return parseFloat(value.toFixed(0));
}

function tempUnitConversion(value, unit){
	value = parseFloat(value);
	if(unit == 1){
		//Fahrenheit
		value = ((value/10) * 1.8 + 32);
	}else{
		//Celsius	
		value = value/10;
	}
	return parseFloat(value.toFixed(1));
}

function altitudeUnitConversion(value, unit){
	value = parseFloat(value);
	if(unit == 1){
		//feet
		value = (value * 3.2808399);
	}
	//meter
	return parseFloat(value.toFixed(0));
}

function tpmsUnitConversion(value, unit){
	value = parseFloat(value);
	if(unit == 1){
		//kpa
		value = value * 100;
	}else if(unit == 2){
		//psi
		value = value * 14.5;
	}else if(unit == 3){
		//kg/cm2
		value = value * 1.02;
	}
	//bar
	return parseFloat(value.toFixed(1));
}


jQuery.fn.hasScrollBar = function(direction)
{
  if (direction == 'vertical')
  {
    return this.get(0).scrollHeight > this.innerHeight();
  }
  else if (direction == 'horizontal')
  {
    return this.get(0).scrollWidth > this.innerWidth();
  }
  return false;
 
}



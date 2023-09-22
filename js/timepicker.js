var controlid;
var currdate;
var startdate;
var enddate;
var yy;
var mm;
var hh;
var ii;
var currday;
var addtime = false;
var today = new Date();
var lastcheckedyear = false;
var lastcheckedmonth = false;
var WND = window.parent;
var S_WEEK = WND.JS_WEEK;
var S_TODAY = WND.JS_TODAY;
var S_MONTH = WND.JS_MONTH;
var S_HOUR = WND.JS_HOUR;
var S_MINUTE = WND.JS_MINUTE;
var S_LAST_MONTH = WND.JS_LAST_MONTH;
var S_NEXT_MONTH = WND.JS_NEXT_MONTH;
var S_SEL_YEAR = WND.JS_SEL_YEAR;
var S_SEL_MONTH = WND.JS_SEL_MONTH;
var ie = navigator.appName == "Microsoft Internet Explorer";

function _cancelBubble(event) {
	e = event ? event : window.event;
	if(ie) {
		e.cancelBubble = true;
	} else {
		e.stopPropagation();
	}
}

function getposition(obj) {
	var ret = {x:0,y:0};
	ret.x = obj.offsetLeft;
	ret.y = obj.offsetTop;
	while(obj.offsetParent) {
        obj = obj.offsetParent;
		ret.x += obj.offsetLeft;
        if(obj.scrollTop < obj.offsetTop){
            ret.y += obj.offsetTop + obj.scrollTop;
        }
        else if(obj.scrollTop > obj.offsetTop){
            ret.y += obj.offsetTop - obj.scrollTop;
        }
        else{
            ret.y += obj.offsetTop;
        }
	}
	return ret;
}

function loadcalendar() {
	s = '<div id="calendar" style="display:none; position:absolute; z-index:10000;" onclick="_cancelBubble(event)">';
	if (ie)
		s += '<iframe width="200" height="160" src="about:blank" style="position: absolute;z-index:-1;"></iframe>';

	s += '<div style="width: 200px;">'
		+ '<table class="tableborder" cellspacing="0" cellpadding="0" width="100%" style="text-align: center">'
		+ '<tr align="center" class="header">'
		+ ' <td class="header"><a href="#" onclick="refreshcalendar(yy, mm-1);return false;" title="'+S_LAST_MONTH+'"><<</a></td>'
		+ ' <td colspan="5" style="text-align: center" class="header">'
		+ '  <a href="#" onclick="showdiv(\'year\');_cancelBubble(event);return false" title="'+S_SEL_YEAR+'" id="year"></a>'
		+ '  <a id="month" title="'+S_SEL_MONTH+'" href="#" onclick="showdiv(\'month\');_cancelBubble(event);return false"></a>'
		+ ' </td>'
		+ ' <td class="header"><A href="#" onclick="refreshcalendar(yy, mm+1);return false" title="'+S_NEXT_MONTH+'">>></A></td>'
		+ '</tr>';

	s += '<tr class="category">';
	for(var i = 0; i < 7; i++){
		s += '<td>'+S_WEEK[i]+'</td>';
	}
	s += '</tr>';

	for(var i = 0; i < 6; i++) {
		s += '<tr class="altbg2">';
		for(var j = 1; j <= 7; j++)
			s += '<td id=d' + (i * 7 + j) + ' height="19">0</td>';
		s += '</tr>';
	}

	s += '<tr id="hourminute">'
		+ '<td colspan="7" align="center">'
		+ ' <input type="text" size="1" value="" id="hour" onKeyUp=\'this.value=this.value > 23 ? 23 : zerofill(this.value);controlid.value=controlid.value.replace(/\\d+(\:\\d+)/ig, this.value+"$1")\'>'+S_HOUR
		+ ' <input type="text" size="1" value="" id="minute" onKeyUp=\'this.value=this.value > 59 ? 59 : zerofill(this.value);controlid.value=controlid.value.replace(/(\\d+\:)\\d+/ig, "$1"+this.value)\'>'+S_MINUTE
		+ '</td>'
		+ '</tr>'
		+ '</table>'
		+ '</div></div>';

	s += '<div id="calendar_year" onclick="_cancelBubble(event)"><div class="col">';
	for(var k = 1970; k <= 2050; k++) {
		s += k != 1930  &&  k % 10 == 0 ? '</div><div class="col">' : '';
		s	+= '<a href="#" onclick="refreshcalendar(' + k + ', mm);$(\'#calendar_year\').css(\'display\',\'none\');return false">'
		+ '<span' + (today.getFullYear() == k ? ' class="today"' : '') + ' id="calendar_year_' + k + '">' + k + '</span></a><br />';
	}
	s += '</div></div>';

	s += '<div id="calendar_month" onclick="_cancelBubble(event)">';
	for(var k = 1; k <= 12; k++) {
		s += '<a href="#" onclick="refreshcalendar(yy, ' + (k - 1) + ');$(\'#calendar_month\').css(\'display\',\'none\');return false">'
		+ '<span' + (today.getMonth()+1 == k ? ' class="today"' : '') + ' id="calendar_month_' + k + '">' + k + ( k < 10 ? ' ' : '')
		+ S_MONTH+'</span></a><br />';
	}
	s += '</div>';
	var nElement = document.createElement("div");
	nElement.innerHTML=s;
	document.getElementsByTagName("body")[0].appendChild(nElement);
//	document.write(s);
	document.onclick = function(event) {
		$("#calendar, #calendar_year, #calendar_month").css("display","none");
	};
	$('#calendar').click(function(event) {
		_cancelBubble(event);
		$("#calendar_year, #calendar_month").css("display","none");
	});
}

function parsedate(s) {
	/(\d+)\-(\d+)\-(\d+)\s*(\d*):?(\d*)/.exec(s);
	var m1 = (RegExp.$1  &&  RegExp.$1 > 1899  &&  RegExp.$1 < 2101) ? parseFloat(RegExp.$1) : today.getFullYear();
	var m2 = (RegExp.$2  &&  (RegExp.$2 > 0  &&  RegExp.$2 < 13)) ? parseFloat(RegExp.$2) : today.getMonth() + 1;
	var m3 = (RegExp.$3  &&  (RegExp.$3 > 0  &&  RegExp.$3 < 32)) ? parseFloat(RegExp.$3) : today.getDate();
	var m4 = (RegExp.$4  &&  (RegExp.$4 > -1  &&  RegExp.$4 < 24)) ? parseFloat(RegExp.$4) : 0;
	var m5 = (RegExp.$5  &&  (RegExp.$5 > -1  &&  RegExp.$5 < 60)) ? parseFloat(RegExp.$5) : 0;
	/(\d+)\-(\d+)\-(\d+)\s*(\d*):?(\d*)/.exec("0000-00-00 00\:00");
	return new Date(m1, m2 - 1, m3, m4, m5);
}

function settime(d) {
	$('#calendar').css("display","none");
	controlid.value = yy + "-" + zerofill(mm + 1) + "-" + zerofill(d) 
	+ (addtime ? ' ' + zerofill($("#hour").val()) + ':' + zerofill($("#minute").val()) : "");
}

function showcalendar(event, controlid1, addtime1, startdate1, enddate1) {
	controlid = controlid1;
	addtime = addtime1;
	startdate = startdate1 ? parsedate(startdate1) : false;
	enddate = enddate1 ? parsedate(enddate1) : false;
	currday = controlid.value ? parsedate(controlid.value) : today;
	hh = currday.getHours();
	ii = currday.getMinutes();
	var p = getposition(controlid);
	$("#calendar").css("display","block").css("left", p.x+"px").css("top", (p.y + 24)+"px");
	_cancelBubble(event);
	refreshcalendar(currday.getFullYear(), currday.getMonth());
	if(lastcheckedyear != false) {
		$("#calendar_year_" + lastcheckedyear).css("className", "default");
		$("#calendar_year_" + today.getFullYear()).css("className", "today");
	}
	if(lastcheckedmonth != false) {
		$("#calendar_month_" + lastcheckedmonth).css("className", "default");
		$("#calendar_month_" + (today.getMonth() + 1)).css("className", "today");
	}
	$("#calendar_year_" + currday.getFullYear()).css("className", "checked");
	$("#calendar_month_" + (currday.getMonth() + 1)).css("className", "checked");
	$('#hourminute').css("display", addtime ? "" : "none");
	lastcheckedyear = currday.getFullYear();
	lastcheckedmonth = currday.getMonth() + 1;
}

function refreshcalendar(y, m) {
	var x = new Date(y, m, 1);
	var mv = x.getDay();
	var d = x.getDate();

	yy = x.getFullYear();
	mm = x.getMonth();
	$("#year").html(yy);
	$("#month").html(mm + 1 > 9  ? (mm + 1) : "0" + (mm + 1));
	for(var i = 1; i <= mv; i++) {
		$("#d" + i).html("").removeClass();
	}
	while(x.getMonth() == mm) {
		var dd = $("#d" + (d + mv)).html('<a href="###" onclick="settime(' + d + ');return false;">' + d + '</a>');
		if(x.getTime() < today.getTime() || (enddate  &&  x.getTime() > enddate.getTime()) || (startdate  &&  x.getTime() < startdate.getTime())) {
			$(dd).addClass("expire");
		} else {
			$(dd).addClass("default");
		}
		if(x.getFullYear() == today.getFullYear()  &&  x.getMonth() == today.getMonth()  &&  x.getDate() == today.getDate()) {
			$(dd).addClass("today");
			$(dd).attr("title", S_TODAY);
		}
		if(x.getFullYear() == currday.getFullYear()  &&  x.getMonth() == currday.getMonth()  &&  x.getDate() == currday.getDate()) {
			$(dd).addClass("checked");
		}
		x.setDate(++d);
	}
	while(d + mv <= 42) {
		$("#d" + (d + mv)).html("");
		d++;
	}
	if(addtime) {
		$("#hour").val(zerofill(hh));
		$("#minute").val(zerofill(ii));
	}
}

function showdiv(id) {
	$("#calendar_year, #calendar_month").css("display","none");
	var p = getposition(document.getElementById(id));
	$('#calendar_' + id).css("left", p.x+"px").css("top", (p.y + 16)+"px").css("display", "block");
}

function zerofill(s) {
	var s = parseFloat(s.toString().replace(/(^[\s0]+)|(\s+$)/g, ''));
	s = isNaN(s) ? 0 : s;
	return (s < 10 ? '0' : '') + s.toString();
}

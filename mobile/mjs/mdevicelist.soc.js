var alarmtimer;

function getSpeedState(on, v, s, t, a, ar, st) {
	/**
	sta default
	0: offline
	1: online and static
	2 to 6: online and moving	
	7: online and alarm
	30: online and idle
	*/
	
    var WP = window.parent;
    //{tip:"short tips", sta: "state", spd:"map tipwindow tips"}
    var ret = {
        tip: "",
        sta: 0, //default offline
        spd: s +" "+ WP.UNIT_SPEED + " (" + WP.JS_STATIC + ")",
		val: s
    };
    //check speed of vehicle
    if (on == 1) {
        ret.sta = 1;
        if (v == 1){
            if (s >= 120) { //if speed exceeds 120
                ret.tip = s + "" + WP.UNIT_SPEED;
                ret.sta = 6;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_OVER_SPEED + ")"
            } else if (s >= 90) { //if speed exceeds 90
                ret.tip = s + "" + WP.UNIT_SPEED;
                ret.sta = 5;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_HIGH_SPEED + ")"
			} else if (s >= 80) { //if speed exceeds 80
                ret.tip = s + " " + WP.UNIT_SPEED;
                ret.sta = 4;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_HIGH_SPEED + ")"            
			} else if (s > 40) { //if speed exceeds 40
                ret.tip = s + " " + WP.UNIT_SPEED;
                ret.sta = 3;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_MOVING + ")"
            } else if (s > 0) { //if vehicle is moving
                ret.tip = s + " " + WP.UNIT_SPEED;
                ret.sta = 2;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_MOVING + ")"
            }else {
				var acc = (typeof st != undefined && st != null && st.indexOf('3005') >= 0);
				if(acc){
					ret.sta = 30;
				}else{
					ret.sta = 1;
				}
				
                ret.tip = "0" + " " + WP.UNIT_SPEED;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_STATIC + ")"
            }
        }
		//if have alarm
		if(a > 0){
			ret.sta = 7;
		}
		
		//custom arrow
		if(ar == "black"){
			ret.sta = 8;
		}else if(ar == "blue"){
			ret.sta = 9;
		}else if(ar == "green"){
			ret.sta = 10;
		}else if(ar == "gray"){
			ret.sta = 11;
		}else if(ar == "orange"){
			ret.sta = 12;
		}else if(ar == "purple"){
			ret.sta = 13;
		}else if(ar == "red"){
			ret.sta = 14;
		}else if(ar == "yellow"){
			ret.sta = 15;
		}
    }else{
        ret.spd = s + " " + WP.UNIT_SPEED;
        
		if(t == null || t == "undefined" || t == ''){			
			ret.tip = WP.JS_TIMEOUT_INVALID;
		}else{
			var time = newDate(t).getTime() + new Date().getTimezoneOffset()*60*1000;
			var timenow = new Date().getTime();

			//seconds
			var timeout = (timenow - time) / 1000.0;
			
			if(s == -1){
				ret.tip = WP.JS_EXPIRED;
			}else if(timeout <= 0){
				 ret.tip = s + " " + WP.UNIT_SPEED;
			}else if(timeout > 0 && timeout < 60){
				ret.tip = "<1" + WP.JS_TIMEOUT_MINS;
			}else if(timeout >=60 && timeout < 3600){
				ret.tip = ">" + parseInt(timeout/60) + WP.JS_TIMEOUT_MINS;
			}else if(timeout >=3600 && timeout < 3600 * 24){
				ret.tip = ">" + parseInt(timeout/3600) + WP.JS_TIMEOUT_HOUR;
			}else if(timeout >=3600 * 24 && timeout < 3600 * 24 * 7){
				ret.tip = ">" + parseInt(timeout/(3600 * 24)) + WP.JS_TIMEOUT_DAY;
			}else if(timeout >=3600 * 24 * 7 && timeout < 3600 * 24 * 30){
				ret.tip = ">" + parseInt(timeout/(3600 * 24 * 7)) + WP.JS_TIMEOUT_WEEK;
			}else if(timeout >=3600 * 24 * 30 && timeout < 3600 * 24 * 365){
				ret.tip = ">" + parseInt(timeout/(3600 * 24 * 30)) + WP.JS_TIMEOUT_MON;
			}else{
				ret.tip = ">" + parseInt(timeout/(3600 * 24 * 365)) + WP.JS_TIMEOUT_YEAR;
			}
		}
    }
    return ret;
}

function getSpeedColor(s) { //color indication to show speed levels
    if (s >= 120) {
        return "#FF002A"
    } else if (s >= 90) {
        return "#9A009C"
    } else if (s >= 80) {
        return "#3200FF"
    } else if (s > 40) {
        return "#0096FE"
    } else if (s <= 40) {
        return "#5DFEFE"
    } else {
        return "#5DFEFE"
    }
}
function getFlagById(id){
    return window.parent.JS_DEVICE_FLAG4ID[id];
}
function getIdByFlag(flag){
    return window.parent.JS_DEVICE_ID4FLAG[flag];
}
function updateFlag(objid,flag){
	window.parent.JS_DEVICE_FLAG4ID[objid] = flag;
}
function getStatusById(id){
    return window.parent.JS_DEVICE_STATUS[id];
}
function setStatusById(id, status){
    window.parent.JS_DEVICE_STATUS[id] = status;
}
function getTypeById(id){
	return window.parent.JS_DEVICE_TYPE4ID[id];
}
function getDeviceList(){
    var ret = [];
    var arr = window.parent.JS_DEVICE_FLAG4ID;
    for(var key in arr){
        ret.push(arr[key])
    }
    return ret
}
var Groups = [];//device group
var GroupItem = [];//group item(tree.tr)
var ChangeItems = new Array();

/* new or update groupitem
 * if map then 
 *   drawicon
 *   if current = n then locate
 **/
function addGroupItem(tid, selid, gid, gtxt, n, c, nc, si, x, y, i, d, t, ts, v, a, ic, ar, p, map, st, io, dt, s, jb, dn, ex) { 
	zt = t;
	t = (t == null || t.length == 0) ? t : $.format.date(t, JS_DEFAULT_DATETIME_fmt_JS);
	ts = (ts == null || ts.length == 0) ? ts : $.format.date(ts, JS_DEFAULT_DATETIME_fmt_JS);
	var show = needShowAllAsset == 1;
	var $tbody;
    var $tr;
    //update group
    var tgkey = tid + "_" + gid;
    var $KG = Groups[tgkey];
    if(!$KG){
        $tbody = $("<tbody class='info-card'></tbody>").appendTo("#" + tid);
        $tr = $("<tr class='a'></tr>").attr("g", gid).attr("t", gtxt).appendTo($tbody);
		
        $KG = $tr;
		$("<th style='background-color: #fff;'><input style='margin: 0px 4px; height: 16px; width: 16px;' type='checkbox' class='showall'></input></th>").attr("title",JS_SHOW_ALL).appendTo($tr).find("input").prop('checked', show).css({opacity: show ? 1.0 : 0.5});
		$("<th style='background-color: #fff;'><input style='margin: 0px 4px; height: 16px; width: 16px;' type='checkbox' class='trackall'></input></th>").attr("title",JS_TRACK_ALL).appendTo($tr);
        $g = $("<th style='word-wrap:break-word;word-break:break-all;'></th>").text(gtxt).attr("colspan", "8");
        if(JS_DEFAULT_COLLAPSED == 0){
			$g.addClass("group open").appendTo($tr);
		}else{
			$g.addClass("group close").appendTo($tr)
		}
		Groups[tgkey] = $KG
    }else{
        if($KG.attr("t") != gtxt){
            $KG.attr("t", gtxt);
            $KG.children().eq(0).text(gtxt);
        }
        $tbody = $KG.parent();
    }
    //update group item
    var tvkey = tid + "_" + n;
    var $KI = GroupItem[tvkey];
    if(!$KI){
        $tr = $("<tr></tr>").attr("g", gid).attr("s", p.sta).attr("n", n).attr("i", i).attr("sval",p.val).attr("st", st).attr("ic", ic).attr("ar", ar).appendTo($tbody);
        $KI = $tr;		
		var track = false;
		if(tid != "tree_all"){
            var $keyitem = GroupItem["tree_all" + "_" + n]
			if($keyitem){
				show = $keyitem.find("td:eq(0) input").is(':checked');
				track = $keyitem.find("td:eq(1) input").is(':checked');
			}			
		}
		$("<td><input style='margin: 0px 4px; height: 16px; width: 16px;' type='checkbox'></input></td>").attr("n", n).attr("title",JS_SHOW).appendTo($tr).find("input").prop('checked', show);
		$("<td><input style='margin: 0px 4px; height: 16px; width: 16px;;' type='checkbox'></input></td>").attr("n", n).attr("title",JS_TRACK).appendTo($tr).find("input").prop('checked', track);
        $("<td style='word-wrap:break-word;word-break:break-all;'></td>").attr("c", c).attr("x", x).attr("y", y).attr("sp", s).attr("d", d).attr("i", i).attr("t", t).attr("dn", dn).attr("dt", dt).attr("io", io).attr("zt", zt).attr("ex", ex).html(c + "<br/><span style='font-size:12px; color:#808080; white-space: nowrap;'>"+t+"</span>").appendTo($tr);
        $("<td></td>").text(p.tip).attr('tip',p.tip).appendTo($tr);
		$("<td></td>").appendTo($tr);
		$("<td></td>").attr("v", v).appendTo($tr);
		$("<td></td>").attr("a", a).appendTo($tr);
		$("<td></td>").attr("takn", getIdValue("5A:", io, true)).appendTo($tr);
		$("<td></td>").attr("takp", getIdValue("5B:", io, true)).appendTo($tr);
		$("<td></td>").appendTo($tr);              
        GroupItem[tid + "_" + n] = $KI;		
		//play sound
		if(a > 0 && JS_DEFAULT_SOUND_ALARM == 1){
			playAlarm();
		}
		//toast alarm
		if(tid == 'tree_all' && a > 0 && JS_DEFAULT_POPUP_ALARM == 1){
			var point = {
				n: n,
				c: c, 
				nc: nc,
				si: si,
				v: v,
				x: x, 
				y: y, 
				i: i, 
				sta: p.sta, 
				d: d, 
				t: t, 
				ts: ts, 
				spd: p.spd, 
				a: a, 
				s: s, 
				st: st, 
				io: io, 
				dt: dt, 
				jb: jb, 
				dn: dn
			};
			loadEventInfo(n, point);
		}
		
		//end state
		$tr = $("<tr class='end_state'></tr>").insertAfter($KI);

		$td = $("<td colspan=8></td>").appendTo($tr);
		$ul = $("<div style='list-style: none; display:flex;'></div>");
		$ul.appendTo($td);
		
		var stateLength = $(window).width() - 15 - 15 - 32 - 32;
		$("<div class='w-1/2'><div style='width: "+stateLength*0.2+"px;' id='temp_1'></div>").appendTo($ul);
		$("<div style='width: "+stateLength*0.2+"px;' id='temp_1'></div>").appendTo($ul);
		$("<div style='width: "+stateLength*0.2+"px;' id='fuel_1'></div>").appendTo($ul);
		$("<div style='width: "+stateLength*0.2+"px; cursor:pointer;' id='mil_24'></div>").appendTo($ul); 
		$("<div style='width: "+stateLength*0.2+"px;' id='max_speed_24'></div>").appendTo($ul);
		$("<div style='width: "+stateLength*0.197+"px;' id='moving_time_24'></div></div>").appendTo($ul); 
		$("<div style='width: "+stateLength*0.2+"px;' id='idle_time_24'></div>").appendTo($ul);
		$("<div style='width: "+stateLength*0.2+"px;' id='stop_time_24'></div>").appendTo($ul);
		$("<div style='width: "+stateLength*0.2+"px;' id='engine_time_24'></div>").appendTo($ul);
		$("<div style='width: "+stateLength*0.197+"px;' id='total_mil'></div>").appendTo($ul);
		$("<div style='width: "+stateLength*0.205+"px;' id='door_state'></div>").appendTo($ul);
		$("<div id='last_driver'></div>").appendTo($td);
    }else{
        //update status
		var alarmlast = $KI.find("td:eq(6)").attr("a");
        $KI.attr("s", p.sta).attr("n", n).attr("i", i).attr("sval",p.val).attr("st", st).attr("ic", ic).attr("ar", ar);
        var $child = $KI.children();
        $child.eq(2).attr("c", c).attr("x", x).attr("y", y).attr("sp", s).attr("d", d).attr("i", i).attr("t", t).attr("dn", dn).attr("dt", dt).attr("io", io).attr("zt", zt).attr("ex", ex).html(c + "<br/><span style='font-size:12px; color:#808080; white-space: nowrap;'>"+t+"</span>");
        $child.eq(3).text(p.tip).attr('tip',p.tip);
        $child.eq(5).attr("v", v);
        $child.eq(6).attr("a", a);
		$child.eq(7).attr("takn", getIdValue("5A:", io, true));
		$child.eq(8).attr("takp", getIdValue("5B:", io, true));
        //group changed
        if($KI.attr("g") != gid){
            $KI.attr("g", gid);
            var $p = $KI.parent();
			$KI.next().remove();
            $KI.remove();
            if($p.children().length == 1){
                var g = $p.children().eq(0).attr("g");
                $p.remove();
                delete Groups[tid + "_" + g];
            }  
            $KI.appendTo($tbody);
			//end state
			$tr = $("<tr class='end_state'></tr>").insertAfter($KI);
			
			$td = $("<td colspan=8></td>").appendTo($tr);
			$("<ul style='list-style: none;'></ul>").appendTo($td);
			
			var stateLength = $(window).width() - 15 - 15 - 32 - 32;
			$("<li style='width: "+stateLength*0.2+"px;' id='temp_1'></li>").appendTo($td);
			$("<li style='width: "+stateLength*0.2+"px;' id='fuel_1'></li>").appendTo($td);
			$("<li style='width: "+stateLength*0.2+"px; cursor:pointer;' id='mil_24'></li>").appendTo($td); 
			$("<li style='width: "+stateLength*0.2+"px;' id='max_speed_24'></li>").appendTo($td);
			$("<li style='width: "+stateLength*0.197+"px;' id='moving_time_24'></li>").appendTo($td); 
			$("<li style='width: "+stateLength*0.2+"px;' id='idle_time_24'></li>").appendTo($td);
			$("<li style='width: "+stateLength*0.2+"px;' id='stop_time_24'></li>").appendTo($td);
			$("<li style='width: "+stateLength*0.2+"px;' id='engine_time_24'></li>").appendTo($td);
			$("<li style='width: "+stateLength*0.197+"px;' id='total_mil'></li>").appendTo($td);
			$("<li style='width: "+stateLength*0.205+"px;' id='door_state'></li>").appendTo($td);
			$("<li id='last_driver'></li>").appendTo($td);
        } 	
		
		if(selid == n){
			needloc = true;
		}
		//play sound
		if(a > alarmlast && JS_DEFAULT_SOUND_ALARM == 1){
			playAlarm();
		}
		
		//toast alarm
		if(tid == 'tree_all' && a > alarmlast && JS_DEFAULT_POPUP_ALARM == 1){
			var point = {
				n: n,
				c: c, 
				nc: nc,
				si: si,
				v: v,
				x: x, 
				y: y, 
				i: i, 
				sta: p.sta, 
				d: d, 
				t: t, 
				ts: ts, 
				spd: p.spd, 
				a: a, 
				s: s, 
				st: st, 
				io: io, 
				dt: dt, 
				jb: jb, 
				dn: dn
			};
			loadEventInfo(n, point);
		}
    }
	if ($KI.parent().children().eq(0).find("th:eq(2)").hasClass("open")) {
		$KI.show();
		$KI.next().show();
	}else{
		$KI.hide();
		$KI.next().hide();
	}
	
    if(map && selid == n){
        $KI.addClass("active");
		$KI.next().addClass("active");
    }
    ChangeItems.push($KI);
    if (map) {
        try {
            /*TODO: add speed,if s>0 then updateicon*/
			//alert(c+","+st);
			if(historyid != n){
				map.DrawIcon(n, c, nc, si, v, x, y, i, p.sta, d, t, ts, p.spd, a, false, s, st, io, dt, jb, dn, ANIMATION_TIME);
			}
            if(show && !historymode){
				map.HideShowMarker(true,n);
			}
            if ($KI.find("td:eq(1) input").is(':checked') && historyid != n) {
                map_locate(n, selid == n && !historymode, selid == n, true, false);
            }else if($KI.find("td:eq(0) input").is(':checked') && selid == n && !historymode){
				map_locate(n, true, false, false, false);
			}			
        } catch(e) {}
    }
}
function findGroupItem(tid, vid){
    var tvkey = tid + "_" + vid;
    var $keyitem = GroupItem[tvkey];
    if($keyitem){
        return true
    }else{
        return false
    }
}
function removeGroupItem(tid, gid, vid) {
    var tvkey = tid + "_" + vid;
    var $keyitem = GroupItem[tvkey];
    if($keyitem){
		$keyitem.next().remove();
        $keyitem.remove();
        delete GroupItem[tvkey]
    }
    var tgkey = tid + "_" + gid;
    var $key = Groups[tgkey];
    if($key && $key.parent().children().length == 1){
        var $p = $key.parent();
        $key.remove();
        $p.remove();
        delete Groups[tgkey]
    }
}

function deleteObject(gid,n){	
	if(findGroupItem("tree_online", n)) {
		removeGroupItem("tree_online", gid, n)
	}
	if(findGroupItem("tree_offline", n)) {
		removeGroupItem("tree_offline", gid, n)
	}
	if(findGroupItem("tree_expired", n)) {
		removeGroupItem("tree_expired", gid, n)
	}
	if(findGroupItem("tree_all", n)) {
		removeGroupItem("tree_all", gid, n)
	}
	delete window.parent.JS_DEVICE_FLAG4ID[n];
	map.RemoveMarker(n);
	updateStatusCount();
}

function deleteGroup(gid){
	var tgkey = "tree_all" + "_" + gid;
	if(Groups[tgkey] != null && typeof Groups[tgkey] != "undefined"){
		var p = Groups[tgkey].parent().children();
		$(p).each(function(i, value) {
			var n = $(value).attr("n");
			if(n){
				deleteObject(gid, n);
			}
		})
	}
}

function addGroup(jo, current, map, first) {
    var j;
    for (var i = 0; i < jo.item.length; i++) {
        j = jo.item[i];
		
        setStatusById(j.n, j.e);
        var p = getSpeedState(j.on, j.v, j.s, j.t, j.a, j.ar, j.io);
        if (j.on == 0) {
            if(!first && findGroupItem("tree_online", j.n)) {
                removeGroupItem("tree_online", jo.gid, j.n)
            }			
			if(j.s == -1){
				if(!first && findGroupItem("tree_offline", j.n)) {
					removeGroupItem("tree_offline", jo.gid, j.n)
				}
				addGroupItem("tree_expired", current, jo.gid, jo.gtxt, j.n, j.c, j.nc, j.si, j.x, j.y, j.i, j.d, j.t, j.ts, j.v, j.a, j.ic, j.ar, p, null, j.st, j.io, j.dt, j.s, j.jb, j.dn, j.ex)
			}else{
				if(!first && findGroupItem("tree_expired", j.n)) {
					removeGroupItem("tree_expired", jo.gid, j.n)
				}
				addGroupItem("tree_offline", current, jo.gid, jo.gtxt, j.n, j.c, j.nc, j.si, j.x, j.y, j.i, j.d, j.t, j.ts, j.v, j.a, j.ic, j.ar, p, null, j.st, j.io, j.dt, j.s, j.jb, j.dn, j.ex)
			}           
        } else {
            if(!first && findGroupItem("tree_offline", j.n)) {
                removeGroupItem("tree_offline", jo.gid, j.n)
            }
			if(!first && findGroupItem("tree_expired", j.n)) {
                removeGroupItem("tree_expired", jo.gid, j.n)
            }
            addGroupItem("tree_online", current, jo.gid, jo.gtxt, j.n, j.c, j.nc, j.si, j.x, j.y, j.i, j.d, j.t, j.ts, j.v, j.a, j.ic, j.ar, p, null, j.st, j.io, j.dt, j.s, j.jb, j.dn, j.ex)
        }
        addGroupItem("tree_all", current, jo.gid, jo.gtxt, j.n, j.c, j.nc, j.si, j.x, j.y, j.i, j.d, j.t, j.ts, j.v, j.a, j.ic, j.ar, p, map, j.st, j.io, j.dt, j.s, j.jb, j.dn, j.ex);
    }
    j = null;
}
function clearList(id) {
    $("#" + id + " tbody").remove()
}

function loadEventInfo(keyid, toastShow){
	var timer = null;
	var needfish = 1;
	if(typeof toastShow == "undefined" || toastShow == false){
		showLoading(true);
		timer = setTimeout("showLoading(false,true)", requestTimeout);
		needfish = 0;
	}
   
   $.get("../alarm.ajax.php", {"objid": keyid, "needfish": needfish}, function(data) {	    
        try {
			if(typeof toastShow == "undefined" || toastShow == false){
				showLoading(false);
				if(timer != null){
					clearTimeout(timer);
				}
				var json = eval('(' + data + ')');
				$("#event-table").empty();
				$("#event-table").animate({scrollTop:0},0);
				for(var i=0; i<json.length; i++){
					var jo = json[i];
					var $tbody = $("<tbody class='event-table-body'></tbody>").appendTo($("#event-table"));
					var $tr = $("<tr></tr>").appendTo($tbody);
					var $td_time = $("<td></td>").text($.format.date(jo.t, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
					var $td_object = $("<td></td>").text(jo.c).appendTo($tr);
					var $td_event = $("<td></td>").text(jo.a).appendTo($tr);
				}
			}else{
				var json = eval('(' + data + ')');
				for(var i=0; i<json.length; i++){
					var jo = json[i];
					if(jo.n > lastAlarmId){									
						toastShow.x = jo.x;
						toastShow.y = jo.y;
						toastShow.s = jo.s; 
						toastShow.t = jo.t;
						toastShow.st = jo.st;
						toastShow.io = jo.io;
						
						toastr.error($.format.date(jo.t, JS_DEFAULT_DATETIME_fmt_JS) + '<br>'+ jo.a, toastShow.c,
						{
							"closeButton": true,
							"debug": false,
							"newestOnTop": false,
							"progressBar": false,
							"positionClass": "toast-top-right",
							"preventDuplicates": false,
							"onclick": function () {
								if (map) {
									try {								
										map.DrawIcon(toastShow.n, toastShow.c, toastShow.nc, toastShow.si, toastShow.v, toastShow.x, toastShow.y, toastShow.i, toastShow.sta, toastShow.d, toastShow.t, toastShow.ts, toastShow.spd, toastShow.a, false, toastShow.s, toastShow.st, toastShow.io, toastShow.dt, toastShow.jb, toastShow.dn);
										map.HideShowMarker(true,toastShow.n);
										map_locate(toastShow.n, true, false, false, true);
										releaseTrack();
										//1 mins later auto clear alarm marker
										if(alarmtimer){
											clearTimeout(alarmtimer);
											alarmtimer = null;
										}
										alarmtimer = setTimeout('clearAlarm('+toastShow.n+');', 60000);
									} catch(e) {alert(e);}
								}
							},
							"showDuration": "300",
							"hideDuration": "1000",
							"timeOut": "300000",
							"extendedTimeOut": "1000",
							"showEasing": "swing",
							"hideEasing": "linear",
							"showMethod": "fadeIn",
							"hideMethod": "fadeOut"
						});
						
						lastAlarmId = jo.n;
					}
				}			
			}          
        } catch(e) {showLoading(false);}
    })
}

function clearAlarm(keyid){
	var item = $("#tab_all .tree_table").find("tbody tr[n="+keyid+"]").find("td:eq(0) input");
	if(!item.is(":checked")){		
		map.HideShowMarker(false,keyid);
	}
}

function showTaskInfo(tname){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try {
		$.post("../manage.task.ajax.php", {"type":13, "tname": tname}, function(data) {
			clearTimeout(timer);
			showLoading(false);			
			var jo = eval('(' + data + ')');
			if(jo != null && typeof jo != "undefined" && jo.jsons != null && typeof jo.jsons != "undefined" && jo.jsone != null && typeof jo.jsone != "undefined"){
				$("#maptools #ed_task").addClass("tool_active");
				$("#maptools #ed_task").css({opacity:1.0});
				$("#maptools #ed_task").attr("tid", jo.jsons[0].tid).attr("oid", jo.jsons[0].oid);
				
				/**start location*/
				var waypoints = [], startLocation = [], endLocation = [], message = [];

				if(jo.jsons[0].at == 1){//Circle
					var apts = jo.jsons[0].ap.split(",");
					startLocation = [apts[0],apts[1]];					
					
				}else if(jo.jsons[0].at == 2){ //Rectangle
					var apts = jo.jsons[0].ap.split(";");
					startLocation = ext.RectangleCenter(parseFloat(apts[0].split(",")[0]),
							   parseFloat(apts[0].split(",")[1]),
							   parseFloat(apts[1].split(",")[0]),
							   parseFloat(apts[1].split(",")[1]));					
					
				}else if(jo.jsons[0].at == 3){ //Polygon
					var route = [];
					var points = jo.jsons[0].ap.split(";");
					
					for(var i = 0; i < points.length; i++){
						var point = [points[i].split(',')[0],points[i].split(',')[1]];
						route.push(point);
					}					
					startLocation = ext.PolygonCenter(route);
					
				}else if(jo.jsons[0].at == 4){ //marker
					var apts = jo.jsons[0].ap.split(",");
					startLocation = [apts[0],apts[1]];
					
				}else if(jo.jsons[0].at == 5){ //Polyline
					var route = [];
					var points = jo.jsons[0].ap.split(";");
					
					for(var i = 0; i < points.length; i++){
						var point = [points[i].split(',')[0],points[i].split(',')[1]];
						route.push(point);
					}					
					startLocation = ext.PolylineCenter(route);
				}
				message.push(JS_TASK_START +"</br>("+ jo.jsons[0].sf +" - "+ jo.jsons[0].st + ")");
				
				/**end location*/
				if(jo.jsone[0].at == 1){//Circle
					var apts = jo.jsone[0].ap.split(",");
					endLocation = [apts[0],apts[1]];					
					
				}else if(jo.jsone[0].at == 2){ //Rectangle
					var apts = jo.jsone[0].ap.split(";");
					endLocation = ext.RectangleCenter(parseFloat(apts[0].split(",")[0]),
							   parseFloat(apts[0].split(",")[1]),
							   parseFloat(apts[1].split(",")[0]),
							   parseFloat(apts[1].split(",")[1]));
					
				}else if(jo.jsone[0].at == 3){ //Polygon
					var route = [];
					var points = jo.jsone[0].ap.split(";");
					
					for(var i = 0; i < points.length; i++){
						var point = [points[i].split(',')[0],points[i].split(',')[1]];
						route.push(point);
					}					
					endLocation = ext.PolygonCenter(route);
					
				}else if(jo.jsone[0].at == 4){ //marker
					var apts = jo.jsone[0].ap.split(",");
					endLocation = [apts[0],apts[1]];
					
				}else if(jo.jsone[0].at == 5){ //Polyline
					var route = [];
					var points = jo.jsone[0].ap.split(";");
					
					for(var i = 0; i < points.length; i++){
						var point = [points[i].split(',')[0],points[i].split(',')[1]];
						route.push(point);
					}
					
					endLocation = ext.PolylineCenter(route);
				}
				message.push(JS_TASK_END +"</br>("+ jo.jsone[0].ef +" - "+ jo.jsone[0].et + ")");
				
				waypoints.push(startLocation);
				waypoints.push(endLocation);
				map.ActiveTaskPathTool(false);
				map.ActiveTaskPathTool(true, waypoints, message);
				showPage("page_map");
			}else{
				showMessage("info", JS_TASK_INFO, JS_NO_TASK);
			}                  
		});
	} catch(e) {showLoading(false); showMessage("info", JS_TASK_INFO, JS_NO_TASK);}
}

function disableCurrentTask(){
	var opts = {
		"type": 14, 
		"state": 4,
		"tid": $("#maptools #ed_task").attr("tid"), 
		"oid": $("#maptools #ed_task").attr("oid")			
	}
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try {
		$.post("../manage.task.ajax.php", opts, function(data) {
			clearTimeout(timer);
			showLoading(false);
			var result = eval('(' + data + ')');
			if(result.status == 'ok'){
				$("#maptools #ed_task").removeClass("tool_active");
			    $("#maptools #ed_task").css({opacity:0.5});
				$("#maptools #ed_task").removeAttr("tid").removeAttr("oid");
				map.ActiveTaskPathTool(false);
				showMessage("succ", JS_TASK_INFO, JS_DISABLE_TASK_SUCC);
			}else if(result.error == -20){
				showMessage("stop", JS_TASK_INFO, JS_NO_PERMISSION);
			}else{
				showMessage("stop", JS_TASK_INFO, JS_DISABLE_TASK_FAIL);					
			}
		});
	} catch(e) {showLoading(false); showMessage("info", JS_TASK_INFO, JS_NO_TASK);}
}

function showLastPhoto(keyid){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	$.get("../last.photo.ajax.php", {"objid": keyid}, function(data) {
        clearTimeout(timer);
		showLoading(false);
		try {
			var jo = eval('(' + data + ')');
			if(jo != null && jo != "none"){
				$dlg = $("#dlg_lastphoto");
				$("#lastphoto").empty();
				$dlg.css("display", "block");
				$("body").append("<div class='modalmask' ontouchmove='event.preventDefault();'></div>");
				$dlg.append("<span id='close' class='dialog_cancel'></span>");
				$dlg.find("#close").click(function() {
					$dlg.css("display", "none");
					$(this).remove();
					$(".modalmask").remove()
				});
				
				$dlg.find("#button_ok").click(function(){
					$dlg.css("display", "none");
					$dlg.find("#close").remove();
					$(".modalmask").remove()
				});
				
				$("#phototime").html(jo.time);
				$("#lastphoto").append(jo.img);
				
				$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
				$dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
			}else{
				showMessage("info", JS_LAST_PHOTO, JS_NO_PHOTO);
			}           
        } catch(e) {showLoading(false); showMessage("info", JS_LAST_PHOTO, JS_NO_PHOTO);}
    })
}

function showLastVoice(keyid){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	$.get("../last.voice.ajax.php", {"objid": keyid}, function(data) {
        clearTimeout(timer);
		showLoading(false);
		try {
			var jo = eval('(' + data + ')');
			if(jo != null && jo != "none"){
				$dlg = $("#dlg_lastvoice");
				$("#lastvoice").empty();
				$dlg.css("display", "block");
				$("body").append("<div class='modalmask' ontouchmove='event.preventDefault();'></div>");
				$dlg.append("<span id='close' class='dialog_cancel'></span>");
				$dlg.find("#close").click(function() {
					$dlg.css("display", "none");
					$(this).remove();
					$(".modalmask").remove()
				});
				
				$dlg.find("#button_ok").click(function(){
					$dlg.css("display", "none");
					$dlg.find("#close").remove();
					$(".modalmask").remove()
				});
				
				$("#voicetime").html(jo.time);
				$("#lastvoice").append(jo.audio);
				
				$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
				$dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
			}else{
				showMessage("info", JS_LAST_VOICE, JS_NO_VOICE);
			}           
        } catch(e) {showLoading(false); showMessage("info", JS_LAST_VOICE, JS_NO_VOICE);}
    })
}

function showSharePosition(keyid){
	if(keyid == null || typeof keyid == undefined){
		keyid = menu_operator_id;
	}
	$("#mnuOperat").hide();
	$dlg = $("#dlg_shareposition");
	$dlg.find("#shareurl").val("");
	$dlg.css("display", "block");
	$dlg.find("#urltr").css("display", "none");
	$dlg.find("#button_copy").css("display", "none");
	$("body").append("<div class='modalmask' ontouchmove='event.preventDefault();'></div>");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$dlg.find("#close").click(function() {
		$dlg.css("display", "none");
		$(this).remove();
		$(".modalmask").remove()
	});
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
	$dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	
	$dlg.find("#button_ok").unbind("click").click(function(){
		var mustok = true;	
		$("#dlg_shareposition .must").each(function(){
			if($(this).val()=="" || $(this).val()==null){
				$(this).addClass("invalidbox");
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		});
		if(!mustok)return;
		$(".modalmask").remove();
		$dlg.find("#shareurl").val("");
		$dlg.find("#urltr").css("display", "none");
		$dlg.find("#button_copy").css("display", "none");
		var expired = $dlg.find("#shareexpired").val();
		getShareToken(keyid,expired);
	});
}

function getShareToken(keyid, expired){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	$.get("../share.position.ajax.php", {"objid": keyid, "expired": expired}, function(data) {
        clearTimeout(timer);
		showLoading(false);
		try {
			var jo = eval('(' + data + ')');
			if(jo != null && jo != "none"){
				$dlg = $("#dlg_shareposition");			
				$("body").append("<div class='modalmask' ontouchmove='event.preventDefault();'></div>");				
				
				$dlg.find("#shareurl").val(window.location.protocol + "//" + window.location.host +"/share.login.ajax.php?token="+ jo.token);
				$dlg.find("#urltr").css("display", "table-row");
				$dlg.find("#button_copy").css("display", "block");
				
				$dlg.find("#button_copy").unbind("click").click(function(){
				    var copyText = document.getElementById("shareurl");
				    copyText.select();
				    copyText.setSelectionRange(0, 99999); 
				    document.execCommand("copy");
					showMessage("succ", JS_SHARE_POSITION, JS_SHARE_COPY_SUCCESS);
				});
			}else{
				showMessage("stop", JS_SHARE_POSITION, JS_SHARE_FAIL);
			}           
        } catch(e) {showMessage("stop", JS_SHARE_POSITION, JS_SHARE_FAIL);}
    })
}

function showObjChart(){
	$("#dashboard-table-div").animate({scrollTop:0},0);
	$("#dashboard-table").animate({scrollTop:0},0);
	var movestop = getMovingStopCarNumber();
	var topObjIos = getTopMileageEngine();	
	createObjStateBar(getAllNumber(), getOnlineNumber(), getOfflineNumber(), getAlarmCarNumber(), getExpiredNumber(), movestop[0], movestop[1], movestop[2], movestop[3], topObjIos[0], topObjIos[1], topObjIos[2], topObjIos[3], getExpireObjByDays());	
}

function initCmdParams(protocolid, commandid){
	$("#cmderror").css("display","none");
	$("#cmdparam tbody").empty();
    var $tbody = $("<tbody></tbody>").appendTo($("#cmdparam"));
	var paramNo = 0;
	
	for(var i = 0; i < protocolCmd.length; i++)
	{
		if(protocolCmd[i].pid == protocolid && protocolCmd[i].cid == commandid){			
			var $tr = $("<tr></tr>").appendTo($tbody);
			/*parameter unit*/
			var unit = "";
			if(protocolCmd[i].units != null && protocolCmd[i].units.length > 0){
				unit = "(" + protocolCmd[i].units + ")";
			}
			
			var $tname = $("<td></td>").appendTo($tr);
			$("<label></label>").removeClass().addClass("ilabel").text(protocolCmd[i].pm == 1 ? "*" + protocolCmd[i].pn + unit : protocolCmd[i].pn + unit).appendTo($tname);
       
			var $tvalue = $("<td></td>").appendTo($tr);
			var $input;
			
			/*VALUE_TYPE == 0*/
			if(protocolCmd[i].vt == 0){
				$input = $("<select></select>").addClass("iselect").addClass("enablebox").appendTo($tvalue);
				$tvalue.attr("ptype", 0);				
				if(protocolCmd[i].dv != null && protocolCmd[i].dv.length > 0){
					var params = protocolCmd[i].dv.split(";");
					var paramFirstIndex = parseInt(params[0].split("=")[1]);
					for(a = 0; a < params.length; a++){
						var param = params[a].split("=");
						if(param.length == 2){
							$item = $("<option></option>").appendTo($input);
							$item.text(param[0]);
							
							if(paramFirstIndex == 0){
								$item.attr("value", param[1]);
							}else{
								$item.attr("value", param[1] -1);
							}
						}
					}  
				}
			}
			/*VALUE_TYPE == 4*/
			else if(protocolCmd[i].vt == 4){
				$input = $("<div>" +
							"<input type='file' style='display:none' onchange='importFile(this);'/>" +
							"<input type='button' id='import' value='"+protocolCmd[i].h+"' onclick='loadFile(this);'/>" +
						"</div>").appendTo($tvalue);
				$tvalue.attr("ptype", 4);				
			}
			/*DEF_VALUE == %DATE%*/
			else if(protocolCmd[i].dv == "%DATE%"){
				var selector = '.date_' + protocolCmd[i].pid +"_"+ protocolCmd[i].cid +"_"+ protocolCmd[i].paid +"_"+ protocolCmd[i].psn;
				$input = $("<input class='"+selector.substring(1)+"'></input>").addClass("itime").addClass("enablebox").appendTo($tvalue);
				$tvalue.attr("ptype", 1);
				var format = "YYYY-MM-DD";
				initPicker(selector, JS_SELECT_TIME, format);
			}
			/*DEF_VALUE == %TIME%*/
			else if(protocolCmd[i].dv == "%TIME%"){
				var selector = '.time_' + protocolCmd[i].pid +"_"+ protocolCmd[i].cid +"_"+ protocolCmd[i].paid +"_"+ protocolCmd[i].psn;
				$input = $("<input class='"+selector.substring(1)+"'></input>").addClass("itime").addClass("enablebox").appendTo($tvalue);
				$tvalue.attr("ptype", 2);
				var format = "HH:mm";
				initPicker(selector, JS_SELECT_TIME, format);
			}
			else{
				$input = $("<input></input>").removeClass().addClass("itext").addClass("enablebox").appendTo($tvalue);
				$tvalue.attr("ptype", 3);
				if(protocolCmd[i].dv != null && protocolCmd[i].dv.indexOf("%") !=0){
					$input.val(protocolCmd[i].dv);
				}
			}
			
			if(protocolCmd[i].pm == 1){
				$input.addClass("must");
			}
			$input.attr("valuetype", protocolCmd[i].vt);
			$input.attr("maxlen", protocolCmd[i].maxl);
			$input.attr("minvalue", protocolCmd[i].minv);
			$input.attr("maxvalue", protocolCmd[i].maxv);
			$input.attr("limit", protocolCmd[i].l);						
			
			paramNo++;
		}
	}
	if(paramNo == 0){
		var $noParam = $("<td></td>").appendTo($tbody);
		$("<label></label>").removeClass().addClass("ilabel").text(JS_NO_NEED_PARAM).appendTo($noParam);
	}	
}

function loadFile(target){
	$(target).prev().click();
}

function importFile(target){
	var selectedFile = target.files[0];
    var name = selectedFile.name;
    var size = selectedFile.size;
    console.log("file:"+name+",size："+size);

    var reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);

    reader.onloadend = function(e){
        var i = e.target.result;
        var u8 = new Uint8Array(i,0,size);
        console.log(buf2hex(u8));
		$(target).parent().attr("file",buf2hex(u8));
		$(target).parent().parent().css("background-color", "white");
    };
}

function buf2hex(buffer) { 
    return Array.prototype.map.call(new Uint8Array(buffer), function(x) {return ('00' + x.toString(16)).slice(-2)}).join('');															
}

function showSendCmd(flag) {
	//console.log('flag', flag);
	if(flag == null || flag.length == 0 || typeCmd == null || typeCmd.length == 0){
		return;
	} 
    var keyid = getIdByFlag(flag);
	var typeid = getTypeById(keyid);
	if(typeid == null || typeof typeid == undefined){
		return;
	}
	dlgSendCmd(flag, typeid);
}

function dlgDeviceInfo(keyid,ios) {
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	
    $.get("../devinfo.ajax.php", {"objid": keyid}, function(data) {
        clearTimeout(timer);
		showLoading(false);
		try {
            $("#object_detail").css("display","block");
			$("#object_list").css("display","none");
			
			var jo = eval('(' + data + ')');
            $("#object_detail_list tbody").empty();
			var $tbody = $("<tbody></tbody>").appendTo($("#object_detail_list"));
			var $tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(OBJECT_INFO_FLAG).appendTo($tr);
			$("<td></td>").text(jo.oflag).appendTo($tr);
			$tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(OBJECT_INFO_TYPE).appendTo($tr);
			$("<td></td>").text(jo.dtype).appendTo($tr);
			$tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(OBJECT_INFO_DEVICE_ID).appendTo($tr);
			$("<td></td>").text(jo.devno).appendTo($tr);
			$tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(OBJECT_INFO_SIMCARD).appendTo($tr);
			$("<td></td>").text(jo.simno).appendTo($tr);
			$tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(OBJECT_INFO_INSTALLTIME).appendTo($tr);
			$("<td></td>").text($.format.date(jo.itime, JS_DEFAULT_DATE_FMT)).appendTo($tr);
			$tr = $("<tr></tr>").appendTo($tbody);
            $("<td></td>").text(OBJECT_INFO_EXPIRETIME).appendTo($tr);
			$("<td></td>").text($.format.date(jo.etime, JS_DEFAULT_DATE_FMT)).appendTo($tr);
			$tr = $("<tr></tr>").appendTo($tbody);
            $("<td></td>").text(OBJECT_INFO_CUSTNAME).appendTo($tr);
			$("<td></td>").text(jo.custname).appendTo($tr);
			$tr = $("<tr></tr>").appendTo($tbody);
            $("<td></td>").text(OBJECT_INFO_CONTACTPHONE).appendTo($tr);
			$("<td></td>").text(jo.custphone).appendTo($tr);
			
			showObjectStatus(keyid);
        } catch(e) {showLoading(false)}
    });
	
	$("#last5day_mil").empty();
	$("#last5day_eng").empty();
	$("#last5day_load").empty();
	var timer_2 = setTimeout("queryingMilEng = false", requestTimeout);
	$.get("../stastics.ajax.php", {"rtime": true, "objid": keyid, "type": 51, "etime": getCurentDateTime()}, function(data) {  
		clearTimeout(timer_2);
		try {
			var json = eval('(' + data + ')');
			if(json != null && json.length > 0){
				objLastMiEg[keyid] = json;
				var $elementMi = $("#last5day_mil");
				var $elementEg = $("#last5day_eng");
				var $elementLd = $("#last5day_load");
				createLast5daysMiEgBar(keyid, $elementMi, $elementEg, $elementLd);
			}							
		} catch(e) {queryingMilEng = false;}
	})
	
	$("#last5day_tire").empty();
	var $tiredatas = parseTireData(getIdValue("51:", ios, true));
	if($tiredatas.index.length == 0){
		var noTire = $("<label nowrap='nowrap' style='padding: 2px; height: 60px; width: 100%; font-size:15pt; color: #AAAAAA; line-height: 70px;'></label>").text(JS_NO_DATA);
		$("#last5day_tire").append(noTire);
		$("#last5day_tire").css({"min-width": '100px', 'text-align': 'center'});
	}else{						
		$("#last5day_tire").css("min-width", '100%');
		createTiresensorBar($tiredatas.index, $tiredatas.tire, $tiredatas.temp, $tiredatas.bat);
	}
}

function parseTireData(tireIo){
	var datas = {
		index : [],
		tire : [],
		temp : [],
		bat : []
	}
	
	if(tireIo != null && tireIo.length > 0){
		var rows = tireIo.split('&');
		if(rows.length > 0){
			for(var i = 0; i < rows.length; i++){		
				if(rows[i] != null && rows[i].length > 0){
					var row = rows[i].split('*');
					if(row != null && row.length == 4){
						datas.index.push(parseInt(row[0]));
						//pressure
						datas.tire.push(tpmsUnitConversion(parseFloat(row[1]), JS_UNIT_TPMS));
						/*if(JS_UNIT_TPMS == 1){
							datas.tire.push(parseFloat((parseFloat(row[1]) * 100).toFixed(1)));
						}else if(JS_UNIT_TPMS == 2){
							datas.tire.push(parseFloat((parseFloat(row[1]) * 14.5).toFixed(1)));
						}else if(JS_UNIT_TPMS == 3){
							datas.tire.push(parseFloat((parseFloat(row[1]) * 1.02).toFixed(1)));
						}else{
							datas.tire.push(parseFloat(parseFloat(row[1]) .toFixed(1)));
						}*/
												
						//temp
						/*if(JS_UNIT_TEMPERATURE == 1){
							datas.temp.push(parseFloat((parseFloat(row[2]) * 1.8 + 32).toFixed(1)));
						}else{
							datas.temp.push(parseFloat(parseFloat(row[2]).toFixed(1)));
						}*/
						datas.temp.push(tempUnitConversion(parseFloat(row[2]), JS_UNIT_TEMPERATURE));
						
						//bat
						datas.bat.push(parseFloat(parseFloat(row[3]).toFixed(0)));
					}
				}
			}
		}		
	}
	
	return datas;
}

function dlgSendCmd(flag, typeid) {
	var jo;							
	var $ul = $("#cmdul");
	$ul.empty();
	$("#cmdparam tbody").empty();
	$("#cmderror").css("display","none");
	
	for(var i = 0; i < typeCmd.length; i++)
	{
		if(typeCmd[i].tid == typeid){
			jo = typeCmd[i];
			var $li = $("<li></li>").attr("cmdid", typeCmd[i].cid).appendTo($ul);
			var $a = $("<a onmousedown=\"initCmdParams("+jo.pid+","+jo.cid+")\"></a>").text(typeCmd[i].cn).appendTo($li);
		}
	}
	
    $("#cmd-send").unbind("click").click(function() {
		$("#cmderror").css("display","none");
		var cflag = $("#cflag").val();    
		if(cflag == ""){
			$("#cflag").addClass("invalidbox");
			return;
		}else{
			$("#cflag").removeClass("invalidbox");
		}
		var objid = getIdByFlag(cflag);
		if(objid == null || typeof objid == undefined){
			$("#cflag").addClass("invalidbox");
			return;
		}else{
			$("#cflag").removeClass("invalidbox");
		}
		var matchArray;
		
		/*not select command*/
		if($("#cmdul li.cmd_active").attr("cmdid") == null){
			$("#cmderror").css("display","block").css("color", "red").text(JS_SELECT_ONE_CMD);
			return;
		}
		
		/*not input must parameter*/
		var mustok = true;
		$("#cmdparam").find(".must").each(function(){
			if(($(this).val()=="" || $(this).val()==null) && $(this).parent().attr("ptype") != 4){
				$(this).css("background-color", "red"); 
				mustok = false;
			}else{
				$(this).css("background-color", "white"); 
			}
		});
		if(!mustok)return;
		
		/*valuetype=1,2,3,9 and parameter out of range*/
		var rangeok = true;
		$("#cmdparam").find("[valuetype=1],[valuetype=2],[valuetype=3],[valuetype=9]").each(function(){
			var cinput = $(this).val();
			if(cinput != ""){
				var intPat = /^[+-]?\d+(\.\d+)?$/;// /^(-)?(0|[1-9][0-9]*)$/; 
				matchArray = cinput.match(intPat);
				if (matchArray == null) {
					$(this).css("background-color", "red");
					$("#cmderror").css("display","block").css("color", "red").text(JS_RANGE_ERROR + $(this).attr("limit"));
					rangeok = false;
					return false;
				}else{
					$(this).css("background-color", "white"); 
				}
			}
			
			if($(this).attr("limit") != null && $(this).attr("limit").indexOf("..") >0){
				var limit_min = parseFloat($(this).attr("limit").split("..")[0]);
				var limit_max = parseFloat($(this).attr("limit").split("..")[1]);
				
				if(parseFloat(cinput) < limit_min || parseFloat(cinput) > limit_max){
					$(this).css("background-color", "red");
					$("#cmderror").css("display","block").css("color", "red").text(JS_RANGE_ERROR + $(this).attr("limit"));
					rangeok = false;
					return false;
				}
			}
		});
		if(!rangeok)return;
		
		/*valuetype=5 and parameter out of length*/
		var lengthok = true;
		$("#cmdparam").find("[valuetype=5]").each(function(){
			var cinput = $(this).val();
			var length_max = parseInt($(this).attr("maxlen"));
			if(cinput.length > length_max){
				$(this).css("background-color", "red");
				$("#cmderror").css("display","block").css("color", "red").text(JS_LENGTH_ERROR + $(this).attr("maxlen"));
				lengthok = false;
				return false;
			}
		});
		if(!lengthok)return;
		
		/*valuetype=4 and not load file*/
		var fileok = true;
		$("#cmdparam").find("[valuetype=4]").each(function(){
			if(typeof($(this).attr("file"))=="undefined"){
				$(this).parent().css("background-color", "red");				
				fileok = false;
				return false;
			}else{
				$(this).parent().css("background-color", "white");
			}
		});
		
		if(!fileok)return;
		
		var params = "";
		$("#cmdparam tbody").find("tr").each(function(){
			var param = $(this).children().eq(1);
			if(param.attr("ptype") == 0){
				params = params + $(this).children().eq(1).find("select").val() + ",";
			}else{
				params = params + $(this).children().eq(1).find("input").val() + ",";
			}
		});

        var req = {
            "objid": objid,
            "cmdid": $("#cmdul li.cmd_active").attr("cmdid"),
			"params": params.substring(0,params.length -1)
        }
       
        showLoading(true);
		var timer = setTimeout(function(){
								$(".modalmask").remove();
								showLoading(false,true)}, requestTimeout);
		
        try{
            $.get("../command.ajax.php", req, function(data) {
                clearTimeout(timer);
				showLoading(false);
                if (data.indexOf('ok') >= 0) {                
                    $(".modalmask").remove();
					showMessage("succ", JS_CMD_SENDCMD, JS_CMD_SEND_SUCC);
                } else {
                    alert(data)
                }
            });
        }catch(e){error(showLoading(false));}
    });
	
    $("#cmdul li a").click(function() {
        $(".cmd_active").removeClass("cmd_active");
        $(this).parent().addClass("cmd_active")
    });
}

var $lastselect;//device list last selection
function updateOne(tr){
	var n = tr.attr("n");
    var s = tr.attr("s");
	var i = tr.attr("i");
	var a = tr.find("td:eq(6)").attr("a");
	var st = tr.attr("st");
	var sval = tr.attr("sval");
	var takn = tr.find("td:eq(7)").attr("takn");
	var takp = tr.find("td:eq(8)").attr("takp");
    var isactive = tr.hasClass("active");
	var ios = tr.find("td:eq(2)").attr("io");
	var ic = tr.attr("ic");
	var dn = tr.find("td:eq(2)").attr("dn");
	
	tr.attr("class","normal").find("td:eq(2)").css({'background': 'url(../img/icons/icon_'+i+'.svg) no-repeat 5px center', 'padding-left': '30px', 'background-size': '20px 20px'});

	if(a == 0){
		tr.css("background-color","");
		tr.next().css("background-color","");
	}else{
		tr.css("background-color",ic);
		tr.next().css("background-color",ic);
	}
	
    if(isactive){
        tr.addClass("active");
		tr.next().addClass("active");
    }

	tr.find("td:eq(3)").removeClass().removeAttr("title");
	tr.find("td:eq(5)").removeClass().removeAttr("title");
	tr.find("td:eq(6)").removeClass().removeAttr("title");
	tr.find("td:eq(7)").removeClass().removeAttr("title");
	tr.find("td:eq(8)").removeClass().removeAttr("title");
	tr.find("td:eq(9)").removeClass().removeAttr("title");
	
	//tr.removeAttr("text-decoration");
    
	if(s == "0"){ 
		tr.find("td:eq(4)").attr("class","offline").attr("title",JS_TIP_OBJ_OFFLINE);		
    }else{		
		tr.find("td:eq(4)").attr("class","online").attr("title",JS_TIP_OBJ_ONLINE);
		
		if(typeof st != undefined && st != null && st.indexOf('3005') >= 0){
			tr.find("td:eq(3)").attr("class","engine_on").attr("title",JS_ENGINE_ON);
		}else{
			var WP = window.parent;
			if(typeof st != undefined && st != null && st.indexOf('3006') >= 0 && sval != null && sval > 0){
				tr.find("td:eq(3)").attr("class","engine_off").attr("title",JS_ENGINE_OFF);
			}else{
				tr.find("td:eq(3)").attr("class","parking").attr("title",JS_PARKING);
				//tr.find("td[tip='0 "+WP.UNIT_SPEED+"']").attr("class","parking").attr("title",JS_PARKING);
			}	
		}	
    }

	tr.find("td:eq(9)").attr("class","menu").attr("title",JS_ASSET_CONTROL);	
	//tr.find("td[v='1']").attr("class","valid").attr("title",JS_GPS_VALID);
	var ptype = getIdValue("62:", ios, true);
	if(typeof ptype != undefined && ptype != null){
		if(ptype == '0'){
			tr.find("td:eq(6)").attr("class","gpsvalid").attr("title",JS_GPS_VALID);
		}else{
			tr.find("td:eq(6)").attr("class","cellvalid").attr("title",JS_LBS_VALID);
		}
	}else{
		if(typeof st != undefined && st.indexOf('200E') >= 0){
			tr.find("td:eq(6)").attr("class","gpsvalid").attr("title",JS_GPS_VALID);
		}else{
			tr.find("td:eq(6)").attr("class","invalid").attr("title",JS_LOCATION_INVALID);
		}
	}
	
	//alarm
	if(a > 0){
		tr.find("td:eq(7)").attr("class","alarm").attr("title",JS_ALARM_INFO).unbind("click").click(function(e){
			showPage('page_events');
		});
	}		
	
	//Expired
	if(sval == "-1"){
		tr.css("text-decoration","line-through");
	}else{
		tr.css("text-decoration","none");
	}
	
	//task new
	if(takn != null && typeof takn != "undefined"){
		tr.find("td:eq(7)").attr("class","tasknew").attr("title",JS_TASK_NEW_INFO).unbind("click").click(function(e){
			showTaskInfo(takn);
		});				
	}
	
	//task processing
	if(takp != null && typeof takp != "undefined"){
		tr.find("td:eq(8)").attr("class","taskprocessing").attr("title",JS_TASK_PROCESSING_INFO).unbind("click").click(function(e){
			showTaskInfo(takp);
		});	
	}
	
	//Menu	
	tr.find("td:eq(9)").unbind("click").click(function(e){
		dlgDeviceInfo(n,ios);
	});
	
	//end state
	$tr = tr.next();		
	//temp
	var oneIoVal = getIdValue("48:", ios);
	var temp_1 = '--';
	if(oneIoVal != null){
		temp_1 = tempUnitConversion(oneIoVal, JS_UNIT_TEMPERATURE);
	}
	
	oneIoVal = getIdValue("49:", ios);
	var temp_2 = '--';
	if(oneIoVal != null){
		temp_2 = tempUnitConversion(oneIoVal, JS_UNIT_TEMPERATURE);
	}
	var tempstr = (temp_1 + ',' + temp_2 + UNIT_TEMP).replace("--,","").replace(",--","");
	$tr.find("#temp_1").text(tempstr);
	
	//fuel
	oneIoVal = getIdValue("1E:", ios);
	var fuel_1 = '--';
	if(oneIoVal != null){
		fuel_1 = fuelUnitConversion(oneIoVal, JS_UNIT_FUEL);
	}
	
	oneIoVal = getIdValue("1F:", ios);
	var fuel_2 = '--';
	if(oneIoVal != null){
		fuel_2 = fuelUnitConversion(oneIoVal, JS_UNIT_FUEL);
	}
	var fuelstr = (fuel_1 + ',' + fuel_2 + UNIT_FUEL).replace("--,","").replace(",--","");
	$tr.find("#fuel_1").text(fuelstr);
	
	//mil 24 hour
	oneIoVal = getIdValue("3F:", ios);
	var mil_24 = '--';
	if(oneIoVal != null){
		mil_24 = mileageUnitConversion(oneIoVal, JS_UNIT_DISTANCE);			
	}
	$tr.find("#mil_24").text(mil_24 + UNIT_DIST);
	
	//max speed
	oneIoVal = getIdValue("3C:", ios);
	var max_speed = '--';
	if(oneIoVal != null){
		max_speed = speedUnitConversion(oneIoVal, JS_UNIT_SPEED);
	}
	$tr.find("#max_speed_24").text(max_speed + UNIT_SPEED);	

	//last 24h moving time
	oneIoVal = getIdValue("3D:", ios);
	var moving_time = '--';
	if(oneIoVal != null){
		moving_time = formatSecToStr(oneIoVal);
	}
	$tr.find("#moving_time_24").text(moving_time);	
	
	//last 24h idle time
	oneIoVal = getIdValue("40:", ios);
	var idle_time = '--';
	if(oneIoVal != null){
		idle_time = formatSecToStr(oneIoVal);
	}
	$tr.find("#idle_time_24").text(idle_time);
	
	//last 24h stop time
	oneIoVal = getIdValue("41:", ios);
	var stop_time = '--';
	if(oneIoVal != null){
		stop_time = formatSecToStr(oneIoVal);
	}
	$tr.find("#stop_time_24").text(stop_time);
	
	//last 24h engine time
	oneIoVal = getIdValue("3E:", ios);
	var engine_time = '--';
	if(oneIoVal != null){
		engine_time = formatSecToStr(oneIoVal);
	}
	$tr.find("#engine_time_24").text(engine_time);
	
	//total odometer
	oneIoVal = getIdValue("A:", ios);
	var total_mil = '--';
	if(oneIoVal != null){
		total_mil = mileageUnitConversion(oneIoVal, JS_UNIT_DISTANCE);			
	}
	$tr.find("#total_mil").text(total_mil + UNIT_DIST);
	
	//door state
	var door_state = '--';
	if(typeof st != undefined && st != null && st.indexOf('3002') >= 0){
		door_state = JS_DOOR_CLOSE
	}else if(typeof st != undefined && st != null && st.indexOf('3001') >= 0){
		door_state = JS_DOOR_OPEN
	}			
	$tr.find("#door_state").text(door_state);
	
	//driver
	var last_driver = '--';
	if(dn != null && dn.length > 0){
		last_driver = dn;
	}
	$tr.find("#last_driver").text(last_driver);
	
	$tr.find("#temp_1").attr("class","temp_1");
	$tr.find("#fuel_1").attr("class","fuel_1");
	$tr.find("#mil_24").attr("class","mil_24");
	$tr.find("#mil_24").unbind("click").click(function(e){
		showLast24History(tr.attr("n"));
		var show = tr.find("td:first-child input");
		var track = tr.find("td:eq(1) input");
		if(!show.is(':checked')){
			show.trigger('click');
		}
		if(!track.is(':checked')){
			track.trigger('click');
		}
	});
	$tr.find("#max_speed_24").attr("class","max_speed_24");
	$tr.find("#moving_time_24").attr("class","moving_time_24");
	$tr.find("#idle_time_24").attr("class","idle_time_24");
	$tr.find("#stop_time_24").attr("class","stop_time_24");
	$tr.find("#engine_time_24").attr("class","engine_time_24");
	$tr.find("#total_mil").attr("class","total_mil");
	$tr.find("#door_state").attr("class","door_state");
	$tr.find("#last_driver").attr("class","last_driver");
	
	$tr.find("td li").each(function(index, ele){
		if(haveInfo(index + 1)){
			$(this).css("display","block");
		}else{
			$(this).css("display","none");
		}
	});
}

function showLast24History(objid){
	map.ClearTrack(objid);
	showLoading(true);
	var timer_search = setTimeout("queryTimeout()", 90000);
	var param = {
		"objid": objid, 
		"day": 1, 
		"time1": '', 
		"time2": '', 
		"stop": 5, 
		"event": 0, 
		"ptype": 1,
		"btype": 1
	}
	events = [];
	stops = [];
	moves = [];
	try{
        $.get("../playback.ajax.php", param, function(data) {
            clearTimeout(timer_search);
			showLoading(false);
            try{
                var json = eval('(' + data + ')');
                if(json != null && typeof json.error != "undefined"){
                     showMessage("stop", JS_PLAY_TITLE, json.error, 10);
                } else if(json != null && typeof json.item != "undefined" && json.item.length > 0){
                    showPage('page_map');
					var hisData = json.item;					
					map.DrawTrackLine(objid, hisData, { point: true }, stops, false, events, false, true, false, moves);
					//map_locate(objid, true, true, false, false);									
				}
			}catch(e){/*alert(e.message)*/error(showLoading(false));}
		});
	}catch(e){/*alert(e.message)*/error(showLoading(false));}
}

function playAlarm() {
	var player = $("#player")[0];
		
	if (!!window.ActiveXObject || "ActiveXObject" in window){
		player.play();
	}else{
		if (player.paused){	
			//player.pause();
			player.play();
		}
	}
}

var t1, tlist = [];
function timerefresh(){
    clearTimeout(t1);
    $.each(tlist, function(idx, $tr){
        updateOne($tr);
        if(idx >= 20){
            return false;
        }
    });
    tlist.splice(0, 20);
    if(tlist.length > 0){
        t1 = setTimeout("timerefresh();", 20);
    }else{
        clearTimeout(t1);
    }
}

function showAllObj(isShow){
	map.HideShowMarker(isShow);
	
	var $tabs = $(".tree_table");
    var $ths = $tabs.find("tbody tr th input.showall");
	$.each($ths, function(idx, value){
		if(isShow){
			$(this).css({opacity:1.0}).prop('checked', true);
		}else{
			$(this).css({opacity:0.5}).prop('checked', false);
		}	
	});
	
	var $trs = $tabs.find("tbody tr:gt(0)");
	$.each($trs, function(idx, value){
		if(isShow){			
			$(value).find("td:first-child input").prop('checked', true);
		}else{
			map.ClearTrack();
			$(value).find("td:first-child input").prop('checked', false);
			$(value).find("td:eq(1) input").prop('checked', false);
		}
	});
}

function updateShow() {
    var $tabs = $(".tree_table");
    var $ths = $tabs.find("tbody tr th.group");
	
    $ths.unbind("click").click(function() {
        if ($(this).is(".open")) {
            $(this).removeClass("open").addClass("close")
        } else {
			//update css
			var tid = $(this).parent().parent().parent().attr("id");
			var $trs = $(this).parent().parent().find("tr:gt(0):not(.end_state)");
			
			$.each($trs, function(idx, value){	
				var keyid = parseInt($(value).attr("n"));
				var tvkey = tid + "_" + keyid;
				updateOne(GroupItem[tvkey]);
			});
			
            $(this).removeClass("close").addClass("open")
        }
        $(this).parent().parent().find("tr:gt(0)").toggle()
    });
	
	$ths = $tabs.find("tbody tr th input.showall");
	$ths.unbind("click").click(function() {
        if($(this).is(':checked')){
			$(this).css({opacity:1.0});			
			var $trs = $(this).parent().parent().parent().find("tr:gt(0)");
			
			$.each($trs, function(idx, value){							
				var keyid = parseInt($(value).attr("n"));			
				map.HideShowMarker(true,keyid);
				
				$(value).find("td:first-child input").prop('checked', true);
				
				var items = findpageitems(keyid);
				$.each(items, function(index,val){
					 $(val).find("td:eq(0) input").prop('checked', true);
				});
			});
			
		}else{
			$(this).css({opacity:0.5});			
			$trs = $(this).parent().parent().parent().find("tr:gt(0)");
			
			$.each($trs, function(idx, value){								
				var keyid = parseInt($(value).attr("n"));			
				map.HideShowMarker(false,keyid);
				
				$(value).find("td:eq(0) input").prop('checked', false);
				$(value).find("td:eq(1) input").prop('checked', false);
				
				var items = findpageitems(keyid);
				$.each(items, function(index,val){
					 $(val).find("td:eq(0) input").prop('checked', false);
					 $(val).find("td:eq(1) input").prop('checked', false);
				});
			});
			
			$(this).parent().parent().parent().find("tr th input.trackall").css({opacity:0.5}).prop('checked', false);
		}
    });
	
	$ths = $tabs.find("tbody tr th input.trackall");
	$ths.unbind("click").click(function() {
        if($(this).is(':checked')){
			$(this).css({opacity:1.0});
			
			$trs = $(this).parent().parent().parent().find("tr:gt(0)");
			
			$.each($trs, function(idx, value){
				var keyid = parseInt($(value).attr("n"));
				map.HideShowMarker(true,keyid);
				map_locate(keyid, false, false, false, false);
				$(value).find("td:eq(0) input").prop('checked', true);
				$(value).find("td:eq(1) input").prop('checked', true);
				
				var items = findpageitems(keyid);
				$.each(items, function(index,val){					 
					 $(val).find("td:eq(0) input").prop('checked', true);
					 $(val).find("td:eq(1) input").prop('checked', true);					 					 
				});	
			});
			
			$(this).parent().parent().parent().find("tr th input.showall").css({opacity:1.0}).prop('checked', true);
		}else{
			$(this).css({opacity:0.5});				
			$trs = $(this).parent().parent().parent().find("tr:gt(0)");
			
			$.each($trs, function(idx, value){								
				var keyid = parseInt($(value).attr("n"));			
				map.ClearTrack(keyid);
				
				$(value).find("td:eq(1) input").prop('checked', false);
				
				var items = findpageitems(keyid);
				$.each(items, function(index,val){
					 $(val).find("td:eq(1) input").prop('checked', false);
				});
			});
		}
    });	
	
	/* update group item show event*/
	//$.each($tabs.find("tbody tr:not(tr:first-child)"), function(i,value){
	$.each(ChangeItems, function(i, value){
		$(value).find("td:first-child input").unbind("click").click(function() {
			$tr = $(value).closest('tr');
			var keyid = parseInt($tr.attr("n"));
			
			if($(this).is(':checked')){							
				map.HideShowMarker(true,keyid);
				
				var items = findpageitems(keyid);
				$.each(items, function(index,value){
					 $(value).find("td:eq(0) input").prop('checked', true);
				});
				
			}else{			
				map.HideShowMarker(false,keyid);
				//if not show also cancel track
				map.ClearTrack(keyid);	
				$(value).find("td:eq(1) input").prop('checked', false);
				
				var items = findpageitems(keyid);
				$.each(items, function(index,value){
					 $(value).find("td:eq(0) input").prop('checked', false);
					 $(value).find("td:eq(1) input").prop('checked', false);
				});
				
				//cancel show all
				$(value).parent().find("tr:first-child th:first-child input").prop('checked', false).css({opacity:0.5});
			}				
		});
	});
	
	/* update group item track event*/
	//$.each($tabs.find("tbody tr:not(tr:first-child)"), function(i,value){
	$.each(ChangeItems, function(i, value){
		$(value).find("td:eq(1) input").unbind("click").click(function() {
			$tr = $(value).closest('tr');
			var keyid = parseInt($tr.attr("n"));
			
			if($(this).is(':checked')){							
				//if track also show
				map.HideShowMarker(true,keyid);
				$(value).find("td:first-child input").prop('checked', true);
				
				var items = findpageitems(keyid);
				$.each(items, function(index,value){
					 $(value).find("td:eq(0) input").prop('checked', true);
					 $(value).find("td:eq(1) input").prop('checked', true);
				});
				
			}else{			
				map.ClearTrack(keyid);
				
				var items = findpageitems(keyid);
				$.each(items, function(index,value){
					 $(value).find("td:eq(1) input").prop('checked', false);
				});

				//cancel track all
				$(value).parent().find("tr:first-child th:eq(1) input").prop('checked', false).css({opacity:0.5});
			}				
		});
	});		

    /* update group item click event */	
	//$.each($tabs.find("tbody tr:not(tr:first-child)"), function(i,value){
	$.each(ChangeItems, function(i, value){
		$(value).find("td:lt(6):gt(1)").unbind("click").bind("click",function(e) {  
			$(".active").removeClass("active");
			$(".active").next().removeClass("active");
			$(".hover").removeClass("hover");
			$(".hover").next().removeClass("hover");
			$lastselect = $(value).closest('tr');
			$lastselect.addClass("active");
			$lastselect.next().addClass("active");
			var keyid = parseInt($lastselect.attr("n"));
			current_id = keyid;
			var t = $lastselect.find("td:eq(2)").attr("t")
			
			var sval = $lastselect.attr("sval");
			if(sval != "-1" && t != null && t != "undefined" && t != ''){
				$lastselect.find("td:first-child input").prop('checked', true);
				
				var items = findpageitems(keyid);
				$.each(items, function(index,value){
					 $(value).find("td:eq(0) input").prop('checked', true);
				});
				
				setTimeout(function () {
					showPage('page_map');
					map.HideShowMarker(true,keyid);
					map_locate(keyid, true, true, false, true); 
					
				},50);						
			}  				
		});
	});
	
	/* update group item swipeleft event  */
	//$.each($tabs.find("tbody tr:not(tr:first-child)"), function(i,value){	
	$.each(ChangeItems, function(i, value){
		$(value).find("td:lt(4):gt(1)").unbind("swipeleft").bind("swipeleft",function() {
			$(".hover").removeClass("hover");
			$lastselect = $(value).closest('tr');
			var keyid = parseInt($lastselect.attr("n"));
			var flag = getFlagById(keyid);
			$("#oflag").val(flag);
			showPage('page_history');
		});
	});
	
	/* update group item swiperight event */	
	//$.each($tabs.find("tbody tr:not(tr:first-child)"), function(i,value){	
	$.each(ChangeItems, function(i, value){
		$(value).find("td:lt(4):gt(1)").unbind("swiperight").bind("swiperight",function() {
			$(".hover").removeClass("hover");
			$lastselect = $(value).closest('tr');
			var keyid = parseInt($lastselect.attr("n"));
			var flag = getFlagById(keyid);
			$("#cflag").val(flag);
			showSendCmd($("#cflag").val());
			showPage('page_cmd');		
		});
	});
		
	/* update group item hover event */
	$.each(ChangeItems, function(i, value){
		$(value).unbind("hover").hover(function(e) {
		//$tabs.find("tbody tr:not(tr:first-child)").unbind("hover").hover(function(e) {
				$lastselect = $(this);
				if(!$lastselect.hasClass('active')){
					//$lastselect.addClass("hover")
				}
				var keyid = parseInt($lastselect.attr("n"));
			},function(){
				$(".hover").removeClass("hover");
				var keyid = parseInt($lastselect.attr("n"));
				if(typeof ext != "undefined"){
					//ext.ClearLink(); 
				}
			}
		);
	});
	
	
	/* update groupitem style 
    if(ChangeItems.length > 50){
        tlist = ChangeItems.slice(0);
        timerefresh();
    }else{*/
        $.each(ChangeItems, function(idx, $tr){
			if($tr.parent().find('th').hasClass('open')){	
				updateOne($tr);
			}
        });
    //}
	
    /* update status count */
    updateStatusCount();
	
	/* update alarm number */
	var alarms = getAllAlarm();
	if(typeof alarms != "undefined" && alarms > 0){
		if(alarms > 10){
			alarms = "10+";
		}
		$("#alarm_msg").html("<a href='#'>" + JS_TIP_OBJ_ALARM + "(" + alarms + ")</a>");
		$("#alarm_msg").css("background-image",'url("../img/siren_on.png")');
		$("#alarm_msg a").css("color","red");
	}else{
		$("#alarm_msg").html("<a href='#'>" + JS_TIP_OBJ_ALARM + "(0)</a>");
		$("#alarm_msg").css("background-image",'url("../img/siren_off.png")');
		$("#alarm_msg a").css("color","white");
	}
	$("#alarm_msg").unbind("click").click(function() {
		loadEventInfo();
	});
}

function updateStatusCount(){
	$.each($("#mod ul li"), function(i, value) {
        var $tbody = $($(value).attr("target") + " tbody tr:not(tr:first-child)");
        var $tab = $(value).find("a");//table a label
        $tab.text($tab.attr("title") + "(" + parseInt($tbody.length/2) + ")");
        var $trs = $($(value).attr("target") + " tbody tr:first-child");
        $.each($trs, function(n, tr) {
            var $offline = $(tr).parent().find("[s='0']");
            var $all = $(tr).parent().find("[s]");
            var $th = $(tr).find("th:eq(2)");
            $th.text($(tr).attr("t") + " [" + ($all.length - $offline.length) + "/" + $all.length + "]")
        })
    });
}

function releaseTrack(){
	current_id = 0;
	$(".active").removeClass("active");
}

function cancelDefShowAll(){
	needShowAllAsset = 0;
}

function updateDevice(json, current, map, first) {
    var needupdate = json != null && typeof json != "undefined" && json.length > 0;
    if(typeof first != "undefined" && first == true ){
        if($lastselect){
            $lastselect = null;
        }
        clearList("tree_all");
        clearList("tree_online");
        clearList("tree_offline");
		clearList("tree_expired");
        clearArray(Groups);//device group
        clearArray(GroupItem);//group item(tree.tr)
    }
    try {
        if(needupdate){
			clearArray(ChangeItems);
			ChangeItems = new Array();	
            for (var r = 0; r < json.length; r++) {
                addGroup(json[r], current, map, first)
            }
        }
    }finally {
        if(needupdate){
			map.RefreshClusters();
			updateShow();
		}
    }
}

function getOnlineNumber(){
	return $("#tree_online tbody tr[s]").length;
}

function getOfflineNumber(){
	return $("#tree_offline tbody tr[s]").length;
}

function getExpiredNumber(){
	return $("#tree_expired tbody tr[s]").length;
}

function getExpireObjByDays(){
	var expires = {
		ex_30: [],
		ex_15: [],
		ex_7: [],
		ex_1: [],
		ex_0: []
	};
	var r = $("#tree_all tbody tr:not(tr:first-child)");	
	$(r).each(function(i, value) {
		if($(value).find("td:eq(2)").attr('ex') != null){		
			var ex = (newDate($(value).find("td:eq(2)").attr('ex')).getTime() - new Date().getTime()) / (24 * 3600 * 1000);
			if(ex <= 0){
				expires.ex_0.push($(value).find("td:eq(2)").attr('c'));
			}else if(ex <= 1){
				expires.ex_1.push($(value).find("td:eq(2)").attr('c'));
			}else if(ex <= 7){
				expires.ex_7.push($(value).find("td:eq(2)").attr('c'));
			}else if(ex <= 15){
				expires.ex_15.push($(value).find("td:eq(2)").attr('c'));
			}else if(ex <= 30){
				expires.ex_30.push($(value).find("td:eq(2)").attr('c'));
			}				
		}		
	})
	
	return expires;
}

function getAlarmCarNumber(){
	var alarms = 0;
	var r = $("#tree_all tbody tr:not(tr:first-child)");	
	$(r).each(function(i, value) {
		var a = $(value).find("td:eq(4)").attr('a');
		if(a > 0){
			alarms++;
		}
	})
	return alarms;
}

function getAllAlarm(){
	var alarms = 0;
	var r = $("#tree_all tbody tr:not(tr:first-child)");	
	$(r).each(function(i, value) {
		var a = $(value).find("td:eq(6)").attr('a');
		if(typeof a != "undefined" && a != null){
			alarms = alarms + parseInt(a);
		}
	})
	return alarms;
}

function getAllNumber(){
	return $("#tree_all tbody tr[s]").length;
}

function getShowObjs(){
	var objs = [];
	var r = $("#tree_all tbody tr:not(tr:first-child)");	
	$(r).each(function(i, value) {		
		if ($(value).find("td:eq(0) input").is(':checked')) {
			objs.push($(value).attr('n'));
		}
	})
	return objs;
}

function getMovingStopCarNumber(){
	var movestop = [];
	var movings = 0;
	var stops = 0;
	var idles = 0;
	var speedRange = {
		s_0_40: [],
		s_40_80: [],
		s_80_90: [],
		s_90_120: [],
		s_120: []
	}
	
	var r = $("#tree_online tbody tr:not(tr:first-child)") ;	
	$(r).each(function(i, value) {
		var sval = $(value).attr('sval');
		if(sval > 0){
			movings++;
		}else{
			stops++;
		}
		
		var sta = $(value).attr('s');
		if(sta == 30){
			idles++;
		}
		
		if(sval >=0  && sval<=40){
			speedRange.s_0_40.push($(value).find("td:eq(2)").attr('c'));			
		}else if(sval >40  && sval<=80){
			speedRange.s_40_80.push($(value).find("td:eq(2)").attr('c'));
		}else if(sval >80  && sval<=90){
			speedRange.s_80_90.push($(value).find("td:eq(2)").attr('c'));
		}else if(sval >90  && sval<=120){
			speedRange.s_90_120.push($(value).find("td:eq(2)").attr('c'));
		}else if(sval >120){
			speedRange.s_120.push($(value).find("td:eq(2)").attr('c'));
		}
	})

	movestop.push(movings);
	movestop.push(stops);
	movestop.push(speedRange);
	movestop.push(idles);
	return movestop;
}

function getTopMileageEngine(){
	var allObjIos = [];
	var topObjIos = [];
	
	var r = $("#tree_all tbody tr:not(tr:first-child)");	
	$(r).each(function(i, value) {
		var io = $(value).find("td:eq(2)").attr('io');
		var zt = $(value).find("td:eq(2)").attr('zt');
		var c = $(value).find("td:eq(2)").attr('c');
		var sval =$(value).attr("sval"); 
		var m24h = getIdValue("3F:", io);
		var e24h = getIdValue("3E:", io);
		var i24h = getIdValue("40:", io);
		var o24h = getIdValue("3D:", io);
		
		if(m24h == null){
			m24h = 0;
		}
		
		/*if(JS_UNIT_DISTANCE == 1){
			m24h = parseInt(m24h) * 0.6213712;
		}else if(JS_UNIT_DISTANCE == 2){
			m24h = parseInt(m24h) * 0.5399568;
		}else{
			m24h = parseInt(m24h);
		}*/
		m24h = parseInt(mileageUnitConversion(m24h, JS_UNIT_DISTANCE));	
		
		if(sval != "-1" && zt != null && (new Date().getTime() - newDate(zt).getTime()) < 24 * 3600 * 1000){
			allObjIos.push({'c': c, 'm': m24h == null ? 0 : m24h, 'e': e24h == null ? 0 : (parseFloat(e24h))/3600, 'i': i24h == null ? 0 : (parseFloat(i24h))/3600, 'o': o24h == null ? 0 : (parseFloat(o24h))/3600});
		}	
	})
	topObjIos.push(allObjIos.sort(sortMileage).slice(0,10));
	topObjIos.push(allObjIos.sort(sortEngine).slice(0,10));
	topObjIos.push(allObjIos.sort(sortIdle).slice(0,10));
	topObjIos.push(allObjIos.sort(sortMoving).slice(0,10));
	
	return topObjIos;
}

function sortMileage(obj1, obj2) {
	var val1 = obj1.m;
    var val2 = obj2.m;
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
    }
	return val2 - val1
}

function sortEngine(obj1, obj2) {
	var val1 = obj1.e;
    var val2 = obj2.e;
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
    }
	return val2 - val1
}

function sortIdle(obj1, obj2) {
	var val1 = obj1.i;
    var val2 = obj2.i;
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
    }
	return val2 - val1
}

function sortMoving(obj1, obj2) {
	var val1 = obj1.o;
    var val2 = obj2.o;
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
    }
	return val2 - val1
}

function getAllAlarm(){
	var alarms = 0;
	var r = $("#tree_all tbody tr:not(tr:first-child)");	
	$(r).each(function(i, value) {
		var a = $(value).find("td:eq(6)").attr('a');
		alarms = alarms + parseInt(a);
	})
	return alarms;
}

function createSpeedometer(element,speed){
	var opts = {
	  angle: 0.35, // The span of the gauge arc
	  lineWidth: 0.1, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#2B82D4' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#2B82D4',   // Colors
	  colorStop: '#2B82D4',    // just experiment with them
	  strokeColor: '#C4C4C4',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	};
	var target = document.getElementById(element); // your canvas element
	var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
	gauge.maxValue = 250; // set max gauge value
	gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge.animationSpeed = 32; // set animation speed (32 is default value)
	gauge.set(speed); // set actual value
	
}

function createObjStateBar(all, online, offline, alarm, expired, moving, stop, speedRange, idle, topmileage, topengine, topidle, topMoving, expires){
	$("#dlg_objstatechart .content").empty();
	
	var sta_on_off_exp_chart = Highcharts.chart('sta_on_off_exp', {
		credits: {
			 enabled: false
		},
		exporting: {
			enabled: false
		},
		chart: {
			spacing : [0, 0 , 0, 0],
			margin: [5, 5, 5, 5]
		},
		title: {
			floating:false,
			text: JS_OBJECTS,
			style: {fontSize: '12px',fontWeight: 'bold'},
			align: "left",
			x: '5',
			y: '15'
		},
		tooltip: {
			pointFormat: '{point.y}'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				size: 80,
				dataLabels: {
					overflow: "visible",
					enabled: true,
					align: 'left',
					format: '{point.name}: {point.y}',
					distance: 2,
					style: {
						textOverflow: 'none',
						fontWeight: 'normal',
						fontSize: '7px',
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				},
			},
			connectorPadding: 5
		},
		series: [{
			type: 'pie',
			innerSize: '50%',
			data: [
				{
					name: JS_TIP_OBJ_ONLINE, 
					x: online,
					y: online,
					color: '#4DA74D',
					sliced: true,
					selected: true
				},
				{
					name: JS_TIP_OBJ_OFFLINE,
					x: offline,
					y: offline,
					color: 'gray'					
				},
				{
					name: JS_TIP_OBJ_EXPIRED, 
					x: expired,
					y: expired,
					color: "#EDC240"
				}
			]
		}]
	});
	
	var sta_mov_sti_alm_chart = Highcharts.chart('sta_mov_sti_alm', {
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			spacing : [0, 0 , 0, 0],
			margin: [5, 5, 5, 5]
		},
		title: {
			floating:true,
			text: '',
			style: {fontSize: '12px'},
			align: "left"
		},
		tooltip: {
			pointFormat: '{point.y}'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				size: 80,
				dataLabels: {
					overflow: "visible",
					enabled: true,
					align: 'left',
					format: '{point.name}: {point.y}',
					distance: 2,
					style: {
						textOverflow: 'none',
						fontWeight: 'normal',
						fontSize: '7px',
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				},
			},
			connectorPadding: 5
		},
		series: [{
			type: 'pie',
			innerSize: '50%',
			data: [
				{
					name: JS_MOVING, 
					x: moving,
					y: moving,
					color: "#2CA089",
					
					sliced: true,
					selected: true
				},
				{
					name: JS_STATIC,
					x: stop,
					y: stop,
					color: '#73D300'			
				},
				{
					name: JS_IDLE,
					x: idle,
					y: idle,
					color: '#FF7F2A'			
				},
				{
					name: JS_TIP_OBJ_ALARM, 
					x: alarm,
					y: alarm,
					color: "#CB4B4B"
				}
			]
		}]
	});
	
	/*解决highchart的tooltip隐藏问题*/
	(function (H) {
		H.wrap(
		H.Tooltip.prototype,
		'getLabel',
		function (proceed) {
			var t = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		  
		  if (this.container) {
			H.css(
				this.container,
			  { zIndex: 9999 }
			);
		  }
		  
		  return t;
		}
	  );
	})(Highcharts);
	
	var ex_0,ex_1,ex_7,ex_15,ex_30;
	if(expires.ex_0.length <= 30){
		ex_0 = expires.ex_0;
	}else{
		ex_0 = expires.ex_0.slice(0,30);
		ex_0.push('...');
	}
	
	if(expires.ex_1.length <= 30){
		ex_1 = expires.ex_1;
	}else{
		ex_1 = expires.ex_1.slice(0,30);
		ex_1.push('...');
	}
	
	if(expires.ex_7.length <= 30){
		ex_7 = expires.ex_7;
	}else{
		ex_7 = expires.ex_7.slice(0,30);
		ex_7.push('...');
	}
	
	if(expires.ex_15.length <= 30){
		ex_15 = expires.ex_15;
	}else{
		ex_15 = expires.ex_15.slice(0,30);
		ex_15.push('...');
	}
	
	if(expires.ex_30.length <= 30){
		ex_30 = expires.ex_30;
	}else{
		ex_30 = expires.ex_30.slice(0,30);
		ex_30.push('...');
	}
		
	var toolTip_exp = [
	  ex_0,
	  ex_1,
	  ex_7,
	  ex_15,
	  ex_30
	];
	var sta_exp_time_chart = Highcharts.chart('sta_exp_time', {
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			spacing : [0, 0 , 0, 0],
			margin: [5, 5, 5, 5]
		},
		title: {
			floating:true,
			text: '',
			style: {fontSize: '12px'},
			align: "left"
		},
		tooltip: {
			outside: true,			
			pointFormatter: function() {
			var string = '';
			Highcharts.each(toolTip_exp[this.series.data.indexOf(this)], function(p) {
			  string += '<a href = "">' + p + '</a><br>'
			})
			return "<br>" + string + "<br />";
		  }
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				size: 80,
				dataLabels: {
					overflow: "visible",
					enabled: true,
					align: 'left',
					format: '{point.name}: {point.y}',
					distance: 2,
					style: {
						textOverflow: 'none',
						fontWeight: 'normal',
						fontSize: '7px',
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				},
			},
			connectorPadding: 5
		},
		series: [{
			type: 'pie',
			innerSize: '50%',
			data: [
				{
					name: JS_EXPIRE_0, 
					x: expires.ex_0.length,
					y: expires.ex_0.length,
					color: "#DC143C",
					
					sliced: true,
					selected: true
				},
				{
					name: JS_EXPIRE_1,
					x: expires.ex_1.length,
					y: expires.ex_1.length,
					color: '#FF00FF'			
				},
				{
					name: JS_EXPIRE_7, 
					x: expires.ex_7.length,
					y: expires.ex_7.length,
					color: "#C71585"
				},
				{
					name: JS_EXPIRE_15, 
					x: expires.ex_15.length,
					y: expires.ex_15.length,
					color: "#FFD700"
				},
				{
					name: JS_EXPIRE_30, 
					x: expires.ex_30.length,
					y: expires.ex_30.length,
					color: "#00FF99"
				}
			]
		}]
	});
	
	var s_0_40,s_40_80,s_80_90,s_90_120,s_120;
	if(speedRange.s_0_40.length <= 30){
		s_0_40 = speedRange.s_0_40;
	}else{
		s_0_40 = speedRange.s_0_40.slice(0,30);
		s_0_40.push('...');
	}
	
	if(speedRange.s_40_80.length <= 30){
		s_40_80 = speedRange.s_40_80;
	}else{
		s_40_80 = speedRange.s_40_80.slice(0,30);
		s_40_80.push('...');
	}
	
	if(speedRange.s_80_90.length <= 30){
		s_80_90 = speedRange.s_80_90;
	}else{
		s_80_90 = speedRange.s_80_90.slice(0,30);
		s_80_90.push('...');
	}
	
	if(speedRange.s_90_120.length <= 30){
		s_90_120 = speedRange.s_90_120;
	}else{
		s_90_120 = speedRange.s_90_120.slice(0,30);
		s_90_120.push('...');
	}
	
	if(speedRange.s_120.length <= 30){
		s_120 = speedRange.s_120;
	}else{
		s_120 = speedRange.s_120.slice(0,30);
		s_120.push('...');
	}
	
	var toolTip_speed = [
	  s_0_40,
	  s_40_80,
	  s_80_90,
	  s_90_120,
	  s_120
	];
	var sta_speed_range_chart = Highcharts.chart('sta_speed_range', {
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			spacing : [0, 0 , 0, 0],
			margin: [5, 5, 5, 5]
		},
		title: {
			floating:true,
			text: '',
			style: {fontSize: '12px'},
			align: "left"
		},
		tooltip: {
			outside: true,			
			pointFormatter: function() {
			var string = '';
			Highcharts.each(toolTip_speed[this.series.data.indexOf(this)], function(p) {
			  string += '<a href = "">' + p + '</a><br>'
			})
			return "<br>" + string + "<br />";
		  }
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				size: 80,
				dataLabels: {
					overflow: "visible",
					enabled: true,
					align: 'left',
					format: '{point.name}: {point.y}',
					distance: 2,
					style: {
						textOverflow: 'none',
						fontWeight: 'normal',
						fontSize: '7px',
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				},
			},
			connectorPadding: 5
		},
		series: [{
			type: 'pie',
			innerSize: '50%',
			data: [
				{
					name: JS_SPEED_0_40, 
					x: speedRange.s_0_40.length,
					y: speedRange.s_0_40.length,
					color: "#5DFEFE",
					
					sliced: true,
					selected: true
				},
				{
					name: JS_SPEED_40_80,
					x: speedRange.s_40_80.length,
					y: speedRange.s_40_80.length,
					color: '#0096FE'			
				},
				{
					name: JS_SPEED_80_90, 
					x: speedRange.s_80_90.length,
					y: speedRange.s_80_90.length,
					color: "#3200FF"
				},
				{
					name: JS_SPEED_90_120, 
					x: speedRange.s_90_120.length,
					y: speedRange.s_90_120.length,
					color: "#9A009C"
				},
				{
					name: JS_SPEED_120, 
					x: speedRange.s_120.length,
					y: speedRange.s_120.length,
					color: "#FF002A"
				}
			]
		}]
	});
	
	var colors = ['#8E468E', '#D64646', '#008E8E', '#FF8E46', '#8BBA00', '#AFD8F8', '#F6BD0F', '#B6BD0F', '#4CCA00', '#1CBA00'];
	var mcategories = [];
	var mdata = [];
	var ecategories = [];
	var edata = [];
	var icategories = [];
	var idata = [];
	var ocategories = [];
	var odata = [];
	
	for(j = 0; j < topmileage.length; j++) {		
		if(topmileage[j].m > 0.1){
			var one = {'color': colors[j], 'y': topmileage[j].m};
			mcategories.push(topmileage[j].c);
			mdata.push(one);
		}		
	}
	
	for(j = 0; j < topengine.length; j++) {		
		if(topengine[j].e > 0.1){
			var one = {'color': colors[j], 'y': topengine[j].e};
			ecategories.push(topengine[j].c);
			edata.push(one);
		}		
	}
	
	for(j = 0; j < topidle.length; j++) {		
		if(topidle[j].i > 0.1){
			var one = {'color': colors[j], 'y': topidle[j].i};
			icategories.push(topidle[j].c);
			idata.push(one);
		}		
	}
	
	for(j = 0; j < topMoving.length; j++) {		
		if(topMoving[j].o > 0.1){
			var one = {'color': colors[j], 'y': topMoving[j].o};
			ocategories.push(topMoving[j].c);
			odata.push(one);
		}		
	}
	
	var sta_last24h_mileage_chart = Highcharts.chart('sta_last24h_mileage', {		
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			type: 'column'
		},
		title: {
			text: JS_LAST24H_MILEAGE,
			style: {fontSize: '12px',fontWeight: 'bold'},
			align: "left"
		},
		subtitle: {
            text: '',
			style: {
				display: 'none'
			}
        },
		xAxis: {
			categories: mcategories,
			title: {
				text: null
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: JS_MILEAGE + "(" + UNIT_DIST + ")"
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '{point.y:.1f}' + "(" + UNIT_DIST + ")"
		},
		series: [{
			data: mdata		
		}]
	});
	
	var sta_last24h_engine_chart = Highcharts.chart('sta_last24h_engine', {
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			type: 'column'
		},
		title: {
			text: JS_LAST24H_ENGINE,
			style: {fontSize: '12px',fontWeight: 'bold'},
			align: "left"
		},
		subtitle: {
            text: '',
			style: {
				display: 'none'
			}
        },
		xAxis: {
			categories: ecategories,
			title: {
				text: null
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: JS_HOUR + "(h)"
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '{point.y:.1f}' + "(h)"
		},
		series: [{
			data: edata		
		}]
	});	

	var sta_last24h_idle_chart = Highcharts.chart('sta_last24h_idle', {
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			type: 'column'
		},
		title: {
			text: JS_LAST24H_IDLE,
			style: {fontSize: '12px',fontWeight: 'bold'},
			align: "left"
		},
		subtitle: {
            text: '',
			style: {
				display: 'none'
			}
        },
		xAxis: {
			categories: icategories,
			title: {
				text: null
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: JS_HOUR + "(h)"
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '{point.y:.1f}' + "(h)"
		},
		series: [{
			data: idata		
		}]
	});	
	
	var sta_last24h_moving_chart = Highcharts.chart('sta_last24h_moving', {
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			type: 'column'
		},
		title: {
			text: JS_LAST24H_MOVING,
			style: {fontSize: '12px',fontWeight: 'bold'},
			align: "left"
		},
		subtitle: {
            text: '',
			style: {
				display: 'none'
			}
        },
		xAxis: {
			categories: ocategories,
			title: {
				text: null
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: JS_HOUR + "(h)"
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '{point.y:.1f}' + "(h)"
		},
		series: [{
			data: odata		
		}]
	});	
}

function createLast5daysMiEgBar(keyid, $elementMi, $elementEg, $elementLd){
	var colors = ['#8E468E', '#D64646', '#008E8E', '#FF8E46', '#8BBA00', '#AFD8F8', '#F6BD0F', '#B6BD0F', '#4CCA00', '#1CBA00'];
	var colors2 = ['#EFC342', '#ADDBFF', '#CE494A', '#4AA64A', '#9441EF',  '#AFD8F8', '#F6BD0F', '#B6BD0F', '#4CCA00', '#1CBA00'];
	var mcategories = [];
	var mdata = [];
	var ecategories = [];
	var edata = [];
	var lcategories = [];
	var ldata = [];
	var json = objLastMiEg[keyid];
	
	if(json == null){
		return;
	}
	
	for(j = 0; j < json.length; j++) {		
		var one = {'color': colors[j], 'y': json[j].MILEAGE/1000};
		mcategories.push(json[j].COLLECT_DATE.split('-')[2]);
		mdata.push(one);	
	}
	
	for(j = 0; j < json.length; j++) {		
		var one = {'color': colors2[j], 'y': json[j].DRIVING_TIME/3600};
		ecategories.push(json[j].COLLECT_DATE.split('-')[2]);
		edata.push(one);
	}
	
	for(j = 0; j < json.length; j++) {		
		var one = {'color': colors2[j], 'y': json[j].LOAD_TIME/3600};
		lcategories.push(json[j].COLLECT_DATE.split('-')[2]);
		ldata.push(one);
	}
	
	var sta_last5days_mileage_chart = Highcharts.chart('last5day_mil', {		
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			type: 'column',
			spacingTop: 5,
			spacingRight: 0,
			spacingBottom: 0,
			spacingLeft: 0,
			plotBorderWidth: 0
		},
		title: {
			text: JS_RECENT_MILEAGE + "(" + UNIT_DIST + ")",
			style: {fontSize: '12px',fontWeight: 'bold'},
			align: "left"
		},
		subtitle: {
			text: '',
			style: {
				display: 'none'
			}
		},
		plotOptions: {
			series: {
				animation: false
			}
		},
		xAxis: {
			categories: mcategories,
			title: {
				text: null
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: null
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '{point.y:.1f}' + "(" + UNIT_DIST + ")"
		},
		series: [{
			data: mdata		
		}]
	});
	
	var sta_last5days_engine_chart = Highcharts.chart('last5day_eng', {
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			type: 'column',
			spacingTop: 5,
			spacingRight: 0,
			spacingBottom: 0,
			spacingLeft: 0,
			plotBorderWidth: 0
		},
		title: {
			text: JS_RECENT_ENGINE + "(h)",
			style: {fontSize: '12px',fontWeight: 'bold'},
			align: "left"
		},
		subtitle: {
			text: '',
			style: {
				display: 'none'
			}
		},
		xAxis: {
			categories: ecategories,
			title: {
				text: null
			}
		},
		plotOptions: {
			series: {
				animation: false
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: null
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '{point.y:.1f}' + "(h)"
		},
		series: [{
			data: edata		
		}]
	});	
	
	
	var sta_last5days_load_chart = Highcharts.chart('last5day_load', {
		credits: {
			 text: '',
			 href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			type: 'column',
			spacingTop: 5,
			spacingRight: 0,
			spacingBottom: 0,
			spacingLeft: 0,
			plotBorderWidth: 0
		},
		title: {
			text: JS_RECENT_LOAD + "(h)",
			style: {fontSize: '12px',fontWeight: 'bold'},
			align: "left"
		},
		subtitle: {
			text: '',
			style: {
				display: 'none'
			}
		},
		xAxis: {
			categories: lcategories,
			title: {
				text: null
			}
		},
		plotOptions: {
			series: {
				animation: false
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: null
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '{point.y:.1f}' + "(h)"
		},
		series: [{
			data: ldata		
		}]
	});	
}

function createTiresensorBar(indexs, tires, temps, bats){
	var chart = Highcharts.chart('last5day_tire', {
		chart: {
			zoomType: 'xy'
		},
		credits: {
			text: '',
			href: ''
		},
		exporting: {
			enabled: false
		},
		chart: {
			type: 'column',
			spacingTop: 5,
			spacingRight: 0,
			spacingBottom: 0,
			spacingLeft: 0,
			plotBorderWidth: 0
		},
		title: {
			text: JS_RECENT_TIRESENSOR,
			style: {fontSize: '12px',fontWeight: 'bold'},
			align: "left"
		},
		subtitle: {
			text: '',
			style: {
				display: 'none'
			}
		},
		xAxis: [{
			categories: indexs,
			crosshair: true
		}],
		yAxis: [{ 
			gridLineWidth: 0,
			title: {
				text: JS_TIRE_PRESSURE,
				style: {
					color: '#5D8AA8',
					fontSize: '8px'
				}
			},
			labels: {
				format: '{value} ' + UNIT_TPMS,
				style: {
					color: '#5D8AA8',
					fontSize: '8px'
				}
			}	
		},{ 
			labels: {
				format: '{value}' + UNIT_TEMP,
				style: {
					color: '#FA8523',
					fontSize: '8px'
				}
			},
			title: {
				text: JS_TEMP,
				style: {
					color: '#FA8523',
					fontSize: '8px'
				}
			},
			opposite: true
		}/*, { 
			gridLineWidth: 0,
			max: 100,
			title: {
				text: JS_BAT,
				style: {
					color: '#238E41',
					fontSize: '8px'
				}
			},
			labels: {
				format: '{value} %',
				style: {
					color: '#238E41',
					fontSize: '8px'
				}
			},
			opposite: true
		}*/],
		tooltip: {
			shared: true
		},
		legend: {
			enabled: false
		},
		series: [ {
			name: JS_TIRE_PRESSURE,
			type: 'spline',		
			data: tires,
			tooltip: {
				valueSuffix: ' ' + UNIT_TPMS
			},
			color: '#5D8AA8'
		}, {
			name: JS_TEMP,
			type: 'spline',
			yAxis: 1,
			data: temps,
			tooltip: {
				valueSuffix: ' ' + UNIT_TEMP
			},
			color: '#FA8523'
		}/*,{
			name: JS_BAT,
			type: 'spline',
			yAxis: 2,
			data: bats,
			marker: {
				enabled: true
			},
			dashStyle: 'shortdot',
			tooltip: {
				valueSuffix: ' %'
			},
			color:'#238E41'
		}*/]
	});

}




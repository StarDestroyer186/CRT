var alarmtimer, alarmtimer2, mgrshare_position_array_name = [], race_array = [];
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
    if (on == 1) {
        ret.sta = 1;
        if (v == 1){			
            if (s >= 120) {
                ret.tip = s + "" + WP.UNIT_SPEED;
                ret.sta = 6;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_OVER_SPEED + ")"
            } else if (s >= 90) {
                ret.tip = s + "" + WP.UNIT_SPEED;
                ret.sta = 5;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_HIGH_SPEED + ")"
			} else if (s >= 80) {
                ret.tip = s + " " + WP.UNIT_SPEED;
                ret.sta = 4;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_HIGH_SPEED + ")"            
			} else if (s > 40) {
                ret.tip = s + " " + WP.UNIT_SPEED;
                ret.sta = 3;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_MOVING + ")"
            } else if (s > 0) {
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
        
		if(t == null || t == undefined || t == ''){			
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
				ret.tip = "<1" + " " + WP.JS_TIMEOUT_MINS;
			}else if(timeout >=60 && timeout < 3600){
				ret.tip = ">" + parseInt(timeout/60) + " " + WP.JS_TIMEOUT_MINS;
			}else if(timeout >=3600 && timeout < 3600 * 24){
				ret.tip = ">" + parseInt(timeout/3600) + " " + WP.JS_TIMEOUT_HOUR;
			}else if(timeout >=3600 * 24 && timeout < 3600 * 24 * 7){
				ret.tip = ">" + parseInt(timeout/(3600 * 24)) + " " + WP.JS_TIMEOUT_DAY;
			}else if(timeout >=3600 * 24 * 7 && timeout < 3600 * 24 * 30){
				ret.tip = ">" + parseInt(timeout/(3600 * 24 * 7)) + " " + WP.JS_TIMEOUT_WEEK;
			}else if(timeout >=3600 * 24 * 30 && timeout < 3600 * 24 * 365){
				ret.tip = ">" + parseInt(timeout/(3600 * 24 * 30)) + " " + WP.JS_TIMEOUT_MON;
			}else{
				ret.tip = ">" + parseInt(timeout/(3600 * 24 * 365)) + " " + WP.JS_TIMEOUT_YEAR;
			}
		}
    }
    return ret;
}

function getSpeedColor(s) {
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
	$('#asset_list_item').change();
}
function updateDeviceId(objid,id){
	window.parent.JS_DEVICE_NO4ID[objid] = id;
	$('#asset_list_item').change();
}
function updateSimcard(objid,sim){
	window.parent.JS_DEVICE_SIM4ID[objid] = sim;
	$('#asset_list_item').change();
}
function getStatusById(id){
    return window.parent.JS_DEVICE_STATUS[id];
}
function getIoById(id){
    return window.parent.JS_DEVICE_ID4IO[id];
}
function setStatusById(id, status){
    window.parent.JS_DEVICE_STATUS[id] = status;
}
function getTypeById(id){
	return window.parent.JS_DEVICE_TYPE4ID[id];
}
function updateDeviceType(objid, type){
	window.parent.JS_DEVICE_TYPE4ID[objid] = type;
}
function getDeviceList(){
    var ret = [];
    var arr = window.parent.JS_DEVICE_FLAG4ID;
    for(var key in arr){
        ret.push(arr[key])
    }
    return ret
}
function getGroup4Flags(){//key=gname  value=[flags]
	var ret = [];	
	var ret_sort = [];
	var gnames = [];
	var arr = window.parent.JS_DEVICE_ID4GROUPID;
	
    for(var key in arr){
		var gname =  window.parent.JS_GROUP4NAME[arr[key]];
		var flag = getFlagById(key);
		
		if(!ret[gname]){		
			ret[gname] = [];
			gnames.push(gname);
		}
		ret[gname].push(flag);
    }
	gnames = gnames.sort((a,b) => {
		return a.localeCompare(b);
	});
	
	for(var i = 0; i < gnames.length; i++){
		ret_sort[gnames[i]] = ret[gnames[i]];
	}
	return ret_sort;
}
function getIDsList(){
	var ret = [];
    var arr = window.parent.JS_DEVICE_NO4ID;
    for(var key in arr){
        ret.push(arr[key])
    }
    return ret
}
function getSimList(){
	var ret = [];
    var arr = window.parent.JS_DEVICE_SIM4ID;
    for(var key in arr){
        ret.push(arr[key])
    }
    return ret
}
function getDriverList(){
	var ret = [];
    var arr = window.parent.JSDEVICE_DRIVER4ID;
    for(var key in arr){
        ret.push(arr[key])
    }
    return ret
}
function getGroupList(){
    return JS_GROUP
}
function getPlaceList(){
	var ret = [];
    var arr = window.parent.JS_PLACE_NAME4ID;
    for(var key in arr){
        ret.push(arr[key])
    }
	return ret
}
function getPlaceById(zid){
	return window.parent.JS_PLACE_NAME4ID[zid];
}
function updatePlace(zid,name){
	window.parent.JS_PLACE_NAME4ID[zid] = name;
}
function getPlaceByName(name){
    return window.parent.JS_PLACE_ID4NAME[name];
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
        $tbody = $("<tbody></tbody>").appendTo("#" + tid);
        $tr = $("<tr style='height: 25px;'></tr>").attr("g", gid).attr("t", gtxt).appendTo($tbody);		
        $KG = $tr;

		$("<th style='background-color: #F8F8F8;'><input style='margin: 0px 0px 0px 5px;' type='checkbox' class='showall'></input></th>").attr("title",JS_SHOW_ALL).appendTo($tr).find("input").prop('checked', show).css({opacity: show ? 1.0 : 0.5});
		$("<th style='background-color: #F8F8F8;'><input style='margin: 0px 0px 0px 5px;' type='checkbox' class='trackall'></input></th>").attr("title",JS_TRACK_ALL).appendTo($tr);
        $g = $("<th style='word-wrap:break-word;word-break:break-all; background-color: #F8F8F8;'></th>").text(gtxt).attr("colspan", "8");
		if(JS_DEFAULT_COLLAPSED == 0){
			$g.addClass("group open").appendTo($tr);
		}else{
			$g.addClass("group close").appendTo($tr)
		}
        Groups[tgkey] = $KG
		if(tid == 'tree_all'){
			JS_GROUP.push(gtxt);
			JS_GROUP4NAME[gid] = gtxt;
		}
    }else{
        if($KG.attr("t") != gtxt){
            $KG.attr("t", gtxt);
            $KG.children().eq(2).text(gtxt);
        }
        $tbody = $KG.parent();
    }
    //update group item
    var tvkey = tid + "_" + n;
    var $KI = GroupItem[tvkey];
    if(!$KI){
        $tr = $("<tr></tr>").attr("g", gid).attr("s", p.sta).attr("n", n).attr("c", c).attr("nc", nc).attr("si", si).attr("i", i).attr("sval",p.val).attr("st", st).attr("dn", dn).attr("ic", ic).attr("ar", ar).attr("io", io).appendTo($tbody);
        $KI = $tr;
		var track = false;
		if(tid != "tree_all"){
            var $keyitem = GroupItem["tree_all" + "_" + n]
			if($keyitem){
				show = $keyitem.find("td:eq(0) input").is(':checked');
				track = $keyitem.find("td:eq(1) input").is(':checked');
			}			
		}
		$("<td><input style='margin: 0px 0px 0px 5px;' type='checkbox'></input></td>").attr("n", n).attr("title",JS_SHOW).appendTo($tr).find("input").prop('checked', show);
		$("<td><input style='margin: 0px 0px 0px 5px;' type='checkbox'></input></td>").attr("n", n).attr("title",JS_TRACK).appendTo($tr).find("input").prop('checked', track);
        $("<td style='word-wrap:break-word;word-break:break-all;'></td>").attr("c", c).attr("x", x).attr("y", y).attr("sp", s).attr("d", d).attr("i", i).attr("t", t).attr("dn", dn).attr("dt", dt).attr("io", io).attr("zt", zt).attr("nc", nc).attr("si", si).attr("ex", ex).html(c + "<br/><span style='font-size:12px; color:#808080; white-space: nowrap;'>"+t+"</span>").appendTo($tr);
        $("<td></td>").html("<span>"+p.tip+"</span>").attr('tip',p.tip).appendTo($tr);
		$("<td></td>").appendTo($tr);
		$("<td></td>").attr("v", v).appendTo($tr);
		$("<td></td>").attr("a", a).appendTo($tr);
		$("<td></td>").attr("takn", getIdValue("5A:", io, true)).appendTo($tr);
		$("<td></td>").attr("takp", getIdValue("5B:", io, true)).appendTo($tr);
		$("<td></td>").attr("mu", 1).appendTo($tr); 
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
			dlgAlarmInfo(n, point);
		}
		
		//end state
		$tr = $("<tr class='end_state'></tr>").insertAfter($KI);
		$("<td></td>").text('').appendTo($tr);
		$("<td></td>").text('').appendTo($tr);
		$td = $("<td colspan=8></td>").appendTo($tr);
		$("<ul style='list-style: none;'></ul>").appendTo($td);
		console.log('scope 1');
		$("<li style='width: 60px;' id='temp_1'></li>").appendTo($td);
		$("<li style='width: 60px;' id='fuel_1'></li>").appendTo($td);
		$("<li style='width: 40px; cursor:pointer;' id='mil_24'></li>").appendTo($td); 
		$("<li style='width: 45px;' id='max_speed_24'></li>").appendTo($td);
		$("<li style='width: 58px;' id='moving_time_24'></li>").appendTo($td); 
		$("<li style='width: 60px;' id='idle_time_24'></li>").appendTo($td);
		$("<li style='width: 40px;' id='stop_time_24'></li>").appendTo($td);
		$("<li style='width: 45px;' id='engine_time_24'></li>").appendTo($td);
		$("<li style='width: 58px;' id='total_mil'></li>").appendTo($td);
		$("<li style='width: 62px;' id='door_state'></li>").appendTo($td);
		$("<li id='last_driver'></li>").appendTo($td);
    }else{	
        //update status
		var alarmlast = $KI.find("td:eq(6)").attr("a");
        $KI.attr("s", p.sta).attr("n", n).attr("c", c).attr("nc", nc).attr("si", si).attr("i", i).attr("sval",p.val).attr("st", st).attr("dn", dn).attr("ic", ic).attr("ar", ar).attr("io", io);
        var $child = $KI.children();
        $child.eq(2).attr("c", c).attr("x", x).attr("y", y).attr("sp", s).attr("d", d).attr("i", i).attr("t", t).attr("dn", dn).attr("dt", dt).attr("io", io).attr("zt", zt).attr("nc", nc).attr("si", si).attr("ex", ex).html(c + "<br/><span style='font-size:12px; color:#808080; white-space: nowrap;'>"+t+"</span>");
        $child.eq(3).html("<span>"+p.tip+"</span>").attr('tip',p.tip);
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
            $KI.appendTo($tbody)
			//end state
			$tr = $("<tr class='end_state'></tr>").insertAfter($KI);
			$("<td></td>").text('').appendTo($tr);
			$("<td></td>").text('').appendTo($tr);
			$td = $("<td colspan=8></td>").appendTo($tr);
			$("<ul style='list-style: none;'></ul>").appendTo($td);
				$("<li style='width: 60px;' id='temp_1'></li>").appendTo($td);
				$("<li style='width: 60px;' id='fuel_1'></li>").appendTo($td);
				$("<li style='width: 40px; cursor:pointer;' id='mil_24'></li>").appendTo($td); 
				$("<li style='width: 45px;' id='max_speed_24'></li>").appendTo($td);
				$("<li style='width: 58px;' id='moving_time_24'></li>").appendTo($td); 
				$("<li style='width: 60px;' id='idle_time_24'></li>").appendTo($td);
				$("<li style='width: 40px;' id='stop_time_24'></li>").appendTo($td);
				$("<li style='width: 45px;' id='engine_time_24'></li>").appendTo($td);
				$("<li style='width: 58px;' id='total_mil'></li>").appendTo($td);
				$("<li style='width: 62px;' id='door_state'></li>").appendTo($td);
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
			dlgAlarmInfo(n, point);
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
            map.DrawIcon(n, c, nc, si, v, x, y, i, p.sta, d, t, ts, p.spd, a, false, s, st, io, dt, jb, dn, ANIMATION_TIME);
			if(show){
				map.HideShowMarker(true,n);
			}			
            if ($KI.find("td:eq(1) input").is(':checked')) {
                map_locate(n, selid == n, selid == n, true, false);
            }else if($KI.find("td:eq(0) input").is(':checked') && selid == n){
				map_locate(n, true, false, false, false);
			}
        } catch(e) {}
    }
	
	//update race info
	if(tid == 'tree_all'){
		var distToDest = getIdValue("125:", io, true);
		var routeComp = getIdValue("F7:", io, true);
		
		if(distToDest != null){
			race_array[0] = $KI;
			for(var j = 1; j < race_array.length; j++){
				if(c == race_array[j].attr('c')){
					race_array.splice(j, 1);
				}
			}
			console.log('1='+c)
		}else if(routeComp != null){
			if(typeof race_array[1] == "undefined"){
				race_array[1] = $KI;
				console.log('21='+c);
			}else{
				var oldKI = race_array[1];
				var oldC = oldKI.attr('c');
				var oldRouteComp = getIdValue("F7:", oldKI.attr('io'), true);
				
				if(oldC == c){
					race_array[1] = $KI;
					console.log('22='+c);
				}else if(parseFloat(oldRouteComp) < parseFloat(routeComp)){
					race_array[2] =race_array[1];
					race_array[1] = $KI;
					console.log('23='+c);
				}else{
					race_array[2] = $KI;
					console.log('31='+c);
				}			
			}			
		}
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
	delete window.parent.JS_DEVICE_ID4GROUPID[n];
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

function deletePlace(zid){
	delete window.parent.JS_PLACE_NAME4ID[zid];
}

function addGroup(jo, current, map, first) {
    var j;
    for (var i = 0; i < jo.item.length; i++) {
        j = jo.item[i];
		
        setStatusById(j.n, j.e);
        var p = getSpeedState(j.on, j.v, j.s, j.t, j.a, j.ar, j.st);
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
function dlgTrackInfo(keyid, oflag) {
	//var assets = [];
	//assets[keyid] = oflag;
    window.open("track.view.php?objid=" + keyid + "&oflag=" + oflag, "_blank")
	//window.open("track.view.php?assets=" + assets, "_blank")
}
function showTrackInfo(keyid) {
	$("#mnuOperat").hide();

	if(keyid == null || typeof keyid == undefined){
		keyid = menu_operator_id;
	}
	var oflag = getFlagById(keyid);
    dlgTrackInfo(keyid, oflag)
}
function cancelAlarm(owner, alarmid){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    $.get("alarm.ajax.php",{"delid": alarmid}, function(data){
        clearTimeout(timer);
		showLoading(false);
		try {
			$(owner).parent().remove();
			if(data=="ok"){
				//todo autoclose alarm dialog
			}
		}catch(e){showLoading(false);}		
    });
}
function dlgAlarmInfo(keyid, toastShow){
	var timer = null;
	var needfish = 1;
	if(typeof toastShow == "undefined" || toastShow == false){
		showLoading(true);
		timer = setTimeout("showLoading(false,true)", requestTimeout);
		needfish = 0;
	}
	
    $.get("alarm.ajax.php", {"objid": keyid, "needfish": needfish}, function(data) {       	
		try {
			if(typeof toastShow == "undefined" || toastShow == false){
				showLoading(false);
				if(timer != null){
					clearTimeout(timer);
				}
				var json = eval('(' + data + ')');
				$dlg = $("#dlg_altinfo");
				$dlg.css("display", "block");
				$("body").append("<div class='modalmask'></div>");
				$dlg.append("<span id='close' class='dialog_cancel'></span>");
				
				// var $ul = $dlg.find("#altul");
				// $ul.empty();
				// for(var i=0; i<json.length; i++){
				// 	var jo = json[i];
				// 	var status = "<div class='event-notification'><strong>" + jo.c + "</strong>"
				// 		+"<button class='delete clear-notification' type='button' onClick='cancelAlarm(this,"+jo.n+")' value='' /></button>[ " + (i + 1) +" ] " + jo.a + "<br>"
				// 		+  $.format.date(jo.t, JS_DEFAULT_DATETIME_fmt_JS) + "<br>"
				// 		+ "<a class='tab' style ='font-size: 12px; color: #4D8ED9; text-decoration: none;' target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+jo.y / 1000000 + "," + jo.x / 1000000+">"+(jo.y / 1000000).toFixed(5) + "," + (jo.x / 1000000).toFixed(5)+" </a>" + "<br>"
				// 		+ jo.e + "</div><br>";
				// 	$("<li></li>").html(status).appendTo($ul);
				// }

				var $ul = $dlg.find("#altul");
				$ul.empty();
				for (var i = 0; i < json.length; i++) {
				    var jo = json[i];
				    var status = `
				        <div style="padding: 1rem; margin: 0 auto; background-color: #ffffff; border-radius: 0.75rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; gap: 1rem;" class='event-notification'>
				            <div style="justify-content:between">
				                <div style="font-size: 1rem; font-weight: 500; color: #000000;"><strong>${jo.c}</strong></div>
				                <span>Event : ${jo.a}</span></br>
				                <span>Date : ${jo.t}</span></br>
				                <span>Co-ordinates : <a style="font-size: 12px; color: #4D8ED9; text-decoration: none;" target="_blank" href="${JS_GOOGLE_MAP_BASE_LINK}/maps?hl=en&q=${jo.y / 1000000},${jo.x / 1000000}">${(jo.y / 1000000).toFixed(5)},${(jo.x / 1000000).toFixed(5)}</a></span>
				                <span>Speed : ${jo.e}</span>
				            </div>
				            <div style="flex-shrink: 0;">
				            	<button class="delete clear-notification" type="button" onClick="cancelAlarm(this, ${jo.n})" value=""><img src="../img/delete.png"></button>
				            </div>
				        </div>
				        <br>
				    `;
				    $("<li></li>").html(status).appendTo($ul);
				}



				$dlg.find("span#altinfo").html(status);
				$dlg.find("#close").click(function() {
					$dlg.css("display", "none");
					$(this).remove();
					$(".modalmask").remove();
				});
				$dlg.find("#button_ok").click(function(){
					$dlg.css("display", "none");
					$dlg.find("#close").remove();
					$(".modalmask").remove()                
				});
				$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 2) + "px");
				$dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
				$("#altul").parent().scrollTop(0);
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
										map.DrawIcon(-1000, toastShow.c, toastShow.nc, toastShow.si, toastShow.v, toastShow.x, toastShow.y, toastShow.i, toastShow.sta, toastShow.d, toastShow.t, toastShow.ts, toastShow.spd, toastShow.a, true, toastShow.s, toastShow.st, toastShow.io, toastShow.dt, toastShow.jb, toastShow.dn);
										map.HideShowMarker(true,-1000);
										releaseTrack();
										hideAlarmMarker();
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

function hideAlarmMarker(){
	if(alarmtimer2){
		clearTimeout(alarmtimer2);
		alarmtimer2 = null;
	}
	alarmtimer2 = setTimeout('map.HideShowMarker(false, -1000);', 30000);
}

function getLastAlarms(keyid, $element, $marker){
	queryingAlarm = true;
	var timer = setTimeout("queryingAlarm = false", requestTimeout);
	$.get("alarm.ajax.php", {"objid": keyid, "needfish": 0}, function(data) {  
		clearTimeout(timer);
		queryingAlarm = false;
		$element.removeClass("query_waiting");
		try {
			if(data == '.'){
				objLastEvent[keyid] = null;
				showLastAlarms(keyid, $element, $marker);
			}else{
				var json = eval('(' + data + ')');
				if(json != null && json.length > 0){
					objLastEvent[keyid] = json;
					showLastAlarms(keyid, $element, $marker);
				}
			}					
		} catch(e) {queryingAlarm = false;}
	})
}

function showLastAlarms(keyid, $element, $marker){
	$element.empty();
	var haveAlarm = false;
	var $table_event = $("<table></table>").appendTo($element);
	var json = objLastEvent[keyid];
	
	if(json != null){
		$element.css("text-align", "left");
		for(var i=0; i<json.length; i++){
			var jo = json[i];
			var $tr_event = $("<tr></tr>").appendTo($table_event);
			var $td_event = $("<td class='lastEvent' title='"+jo.t +" "+ jo.a +"' nowrap='nowrap' style='cursor:pointer; border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px; width: 100%;'></td>").attr("n",jo.n).attr("c",jo.c).attr("x",jo.x).attr("y",jo.y).attr("t",jo.t).attr("ts",jo.ts).attr("s",jo.s).attr("d",jo.d).attr("e",jo.e).attr("st",jo.st).attr("io",jo.io).text((jo.t).split(" ")[1] +"  "+ jo.a).appendTo($tr_event);
			$td_event.unbind("click").click(function(){
				var p = getSpeedState(1, 1, $(this).attr("s"), $(this).attr("t"), 1, $(this).attr("st"));
				var io = $(this).attr("io");
				var jb = getIdValue("5F:", io, true);
				var dn = getIdValue("5E:", io, true);			
				map.DrawIcon(-1000, $(this).attr("c"), $marker.properties.nc, $marker.properties.si, 1, $(this).attr("x"), $(this).attr("y"), $marker.properties.ico, 7, $(this).attr("d"), $(this).attr("t"), $(this).attr("ts"), p.spd, $(this).attr("a"), true, $(this).attr("s"), $(this).attr("st"), io, $marker.properties.dt, jb, dn);		
				map.HideShowMarker(true, -1000);
				hideAlarmMarker();				
				releaseTrack();
			});
			haveAlarm = true;
		}
	}
	
	if(!haveAlarm){
		$element.css("text-align", "center");
		$("<label nowrap='nowrap' style='padding: 2px; height: 60px; width: 100%; font-size:15pt; color: #AAAAAA; line-height: 70px;'></label>").text(JS_NO_DATA).appendTo($element);
	}
}

function getLast5daysMiEg(keyid, $elementMi, $elementEg, $elementLd){
	queryingMilEng = true;
	var timer = setTimeout("queryingMilEng = false", requestTimeout);
	$.get("stastics.ajax.php", {"rtime": true, "objid": keyid, "type": 51, "etime": getCurentDateTime()}, function(data) {  
		clearTimeout(timer);
		queryingMilEng = false;
		$elementMi.removeClass("query_waiting");
		$elementEg.removeClass("query_waiting");
		$elementLd.removeClass("query_waiting");
		try {
			var json = eval('(' + data + ')');
			if(json != null && json.length > 0){
				objLastMiEg[keyid] = json;
				createLast5daysMiEgBar(keyid, $elementMi, $elementEg, $elementLd);
			}							
		} catch(e) {queryingMilEng = false;}
	})
}

function getLastMaTa(keyid, $elementMa, $elementTa, $odometer, $engineHour){
	queryingMaTa = true;
	var timer = setTimeout("queryingMaTa = false", requestTimeout);
	$.get("last.maintain.task.ajax.php", {"objid": keyid}, function(data) {  
		clearTimeout(timer);
		queryingMaTa = false;
		$elementMa.removeClass("query_waiting");
		$elementTa.removeClass("query_waiting");

		try {
			var json = eval('(' + data + ')');			
			if(json != null){
				objLastMaTa[keyid] = json;
				showLastMaTa(keyid, $elementMa, $elementTa, $odometer, $engineHour);
			}							
		} catch(e) {queryingMaTa = false;}
	})
}

function showLastMaTa(keyid, $elementMa, $elementTa, $odometer, $engineHour){
	/**show maintainance*/
	$elementMa.empty();
	var haveMa = false;
	var $table_ma = $("<table></table>").appendTo($elementMa);
	var json = objLastMaTa[keyid];
	
	if(json != null){
		var json_ma = json.mt;
		
		if(json_ma != null){
			var jo = json_ma[0];
	
			/*Odometer interval*/
			var mile = jo.mile;
			var milv = jo.milv;
			var miln = jo.miln;
			var mili = (jo.mill == null || jo.mill.length ==0) ? 0 : (milv - ($odometer - jo.mill)).toFixed(0);
			if (mili == -0) {
				mili = 0;
			}
			if(mile == 1 && milv > 0 && miln != null && miln.length > 0 && mili >= 0 && $odometer > 0){
				var $tr_odo = $("<tr></tr>").appendTo($table_ma);
				var $td_odo = $("<td class='lastMa' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px; min-width: 80px;'></td>").text(miln).appendTo($tr_odo);
				$td_odo = $("<td class='lastMa' nowrap='nowrap' style='padding: 2px 2px 2px 20px; border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; min-width: 80px;'></td>").html(mili + '&nbsp;'+UNIT_DIST+'.&nbsp;' + JS_LEFT).appendTo($tr_odo);	
				if(mili <= 100){
					$td_odo.addClass("info_warning");
				}
				haveMa = true;
			}
			
			/*Engine hour interval*/
			var enge = jo.enge;
			var engv = jo.engv;
			var engn = jo.engn;
			var engi = (jo.engl == null || jo.engl.length ==0) ? 0 : (engv - ($engineHour - jo.engl)).toFixed(0);
			if (engi == -0) {
				engi = 0;
			}
			if(enge == 1 && engv > 0 && engn != null && engn.length > 0 && engi >= 0 && $engineHour > 0){
				var $tr_eng = $("<tr></tr>").appendTo($table_ma);
				var $td_eng = $("<td class='lastMa' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px; min-width: 80px;'></td>").text(engn).appendTo($tr_eng);
				$td_eng = $("<td class='lastMa' nowrap='nowrap' style='padding: 2px 2px 2px 20px; border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; min-width: 80px;'></td>").html(engi + '&nbsp;h.&nbsp;' + JS_LEFT).appendTo($tr_eng);	
				if(engi <= 100){
					$td_eng.addClass("info_warning");
				}
				haveMa = true;
			}
			
			/*Days interval*/
			var daye = jo.daye;
			var dayv = jo.dayv;
			var dayn = jo.dayn;
			var dayi = (jo.dayl == null || jo.dayl.length != 10) ? 0 : (dayv - parseInt((new Date().getTime() - newDate(jo.dayl).getTime()) / (24 * 3600 * 1000))).toFixed(0);
			if (dayi == -0) {
				dayi = 0;
			}
			if(daye == 1 && dayv > 0 && dayn != null & dayn.length > 0 && dayi >= 0){
				var $tr_day = $("<tr></tr>").appendTo($table_ma);
				var $td_day = $("<td class='lastMa' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px; min-width: 80px;'></td>").text(dayn).appendTo($tr_day);
				$td_day = $("<td class='lastMa' nowrap='nowrap' style='padding: 2px 2px 2px 20px; border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; min-width: 80px;'></td>").html(dayi + '&nbsp;d.&nbsp;' + JS_LEFT).appendTo($tr_day);	
				if(dayi <= 15){
					$td_day.addClass("info_warning");
				}
				haveMa = true;
			}

			/*customize*/
			var custm = jo.custm;
			if(custm != null && custm.length > 0){
				var custm_arr = custm.split(";");
				for(var i = 0; i < custm_arr.length; i++){
					if(custm_arr[i] != null && custm_arr[i].length > 0){										
						var custm_one = custm_arr[i].split(",");
						if(custm_one != null && custm_one.length == 5){
							if(custm_one[0]!= null && custm_one[0] == "1"){
								/*Odometer interval*/
								custm_one[2] = mileageUnitConversion(parseInt(custm_one[2])*10,JS_UNIT_DISTANCE).toFixed(0);
								custm_one[4] = mileageUnitConversion(parseInt(custm_one[4])*10,JS_UNIT_DISTANCE).toFixed(0);
								
								var mile = custm_one[1];
								var milv = custm_one[2];
								var miln = custm_one[3];
								var mili = (custm_one[4] == null || custm_one[4].length ==0) ? 0 : (parseFloat(milv) - ($odometer - parseFloat(custm_one[4]))).toFixed(0);
								if (mili == -0) {
									mili = 0;
								}
								if(mile == 1 && milv > 0 && miln != null && miln.length > 0 && mili >= 0 && $odometer > 0){
									var $tr_odo = $("<tr></tr>").appendTo($table_ma);
									var $td_odo = $("<td class='lastMa' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px; min-width: 80px;'></td>").text(miln).appendTo($tr_odo);
									$td_odo = $("<td class='lastMa' nowrap='nowrap' style='padding: 2px 2px 2px 20px; border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; min-width: 80px;'></td>").html(mili + '&nbsp;'+UNIT_DIST+'.&nbsp;' + JS_LEFT).appendTo($tr_odo);	
									if(mili <= 100){
										$td_odo.addClass("info_warning");
									}
									haveMa = true;
								}																												
							}else if(custm_one[0]!= null && custm_one[0] == "2"){
								/*Engine hour interval*/
								var enge = custm_one[1];
								var engv = custm_one[2];
								var engn = custm_one[3];
								var engi = (custm_one[4] == null || custm_one[4].length ==0) ? 0 : (parseFloat(engv) - ($engineHour - parseFloat(custm_one[4]))).toFixed(0);
								if (engi == -0) {
									engi = 0;
								}
								if(enge == 1 && engv > 0 && engn != null && engn.length > 0 && engi >= 0 && $engineHour > 0){
									var $tr_eng = $("<tr></tr>").appendTo($table_ma);
									var $td_eng = $("<td class='lastMa' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px; min-width: 80px;'></td>").text(engn).appendTo($tr_eng);
									$td_eng = $("<td class='lastMa' nowrap='nowrap' style='padding: 2px 2px 2px 20px; border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; min-width: 80px;'></td>").html(engi + '&nbsp;h.&nbsp;' + JS_LEFT).appendTo($tr_eng);	
									if(engi <= 100){
										$td_eng.addClass("info_warning");
									}
									haveMa = true;
								}
							}else if(custm_one[0]!= null && custm_one[0] == "3"){
								/*Days interval*/
								var daye = custm_one[1];
								var dayv = custm_one[2];
								var dayn = custm_one[3];
								var dayi = (custm_one[4] == null || custm_one[4].length == 0) ? 0 : (parseFloat(dayv) - parseInt((new Date().getTime() - newDate(custm_one[4].split(" ")[0]).getTime()) / (24 * 3600 * 1000))).toFixed(0);
								if (dayi == -0) {
									dayi = 0;
								}
								if(daye == 1 && dayv > 0 && dayn != null && dayn.length > 0 && dayi >= 0){
									var $tr_day = $("<tr></tr>").appendTo($table_ma);
									var $td_day = $("<td class='lastMa' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px; min-width: 80px;'></td>").text(dayn).appendTo($tr_day);
									$td_day = $("<td class='lastMa' nowrap='nowrap' style='padding: 2px 2px 2px 20px; border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; min-width: 80px;'></td>").html(dayi + '&nbsp;d.&nbsp;' + JS_LEFT).appendTo($tr_day);	
									if(dayi <= 15){
										$td_day.addClass("info_warning");
									}
									haveMa = true;
								}
							}
						}
					}
				}
			}
										
		}					
	}	
	if(!haveMa){
		var $tr_ma = $("<tr></tr>").appendTo($table_ma);
		var $td_ma = $("<td nowrap='nowrap' align='center' valign='middle' style='padding: 2px; height: 60px; width: 100%; font-size:15pt; color: #AAAAAA;'></td>").text(JS_NO_DATA).appendTo($tr_ma);
	}
	
	/**show task*/
	$elementTa.empty();
	var haveTa = false;
	var $table_ta = $("<table></table>").appendTo($elementTa);
	var json = objLastMaTa[keyid];
	
	if(json != null){
		var json_ta = json.ta;
		
		if(json_ta != null){
			for(var i = 0; i < json_ta.length; i++){
				var jo = json_ta[i];
				var tn = jo.tn;
				var ts = jo.ts;
				var $tr_ta = $("<tr></tr>").appendTo($table_ta);
				var $td_ta = $("<td class='lastTa' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px; min-width: 80px;'></td>").text(tn).appendTo($tr_ta);
				$td_ta = $("<td class='lastTa' nowrap='nowrap' style='padding: 2px 2px 2px 20px; border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; min-width: 80px;'></td>").appendTo($tr_ta);	
				if(ts == 0){
					$td_ta.html(JS_TASK_NEW_INFO).addClass("task_new");
				}else if(ts == 1){
					$td_ta.html(JS_TASK_PROCESSING_INFO).addClass("task_in_progress");
				}else if(ts == 2){
					$td_ta.html(JS_TASK_FINISH).addClass("task_finish");
				}else if(ts == 3){
					$td_ta.html(JS_TASK_FAIL).addClass("task_fail");
				}
				haveTa = true;
			}		
		}
	}
	
	if(!haveTa){
		var $tr_ta = $("<tr></tr>").appendTo($table_ta);
		var $td_ta = $("<td nowrap='nowrap' align='center' valign='middle' style='padding: 2px; height: 60px; width: 100%; font-size:15pt; color: #AAAAAA;'></td>").text(JS_NO_DATA).appendTo($tr_ta);
	}
}


function getLastDriver(keyid, jb, $element){
	queryingDriver = true;
	var timer = setTimeout("queryingDriver = false", requestTimeout);
	$.get("driver.image.ajax.php", {"jb":jb, "full": true}, function(data) {
		 clearTimeout(timer);
		 queryingDriver = false;
		 $element.removeClass("query_waiting");		 
		 
		 if(data != null && data != 'none'){
			 var json = eval('(' + data + ')');
			 if(json.pi == null || json.pi.length == 0){
				 json.pi = "<img src='img/none driver.png' alt='null' height='89' width='80'>";
			 }
			 objLastDriver[keyid] = json;			 		 
			 map.drivers[keyid].img = json.pi;		
			 map.drivers4jb[jb] = map.drivers[keyid];
		 }else{
			 var json = {
				 'dn': '---',
				 'ph': '---',
				 'rf': '---',
				 'pi': "<img src='img/none driver.png' alt='null' height='89' width='80'>"
			 }
			 objLastDriver[keyid] = json;
		 }
		 showLastDriver(keyid);
	});
}

function showLastDriver(keyid){
	$("#sta_last_driver_info").empty();
	$("#sta_last_driver_img ul").empty();
	
	if(objLastDriver[keyid] == null){
		return;
	}
	
	var dn = objLastDriver[keyid].dn;
	var ph = (objLastDriver[keyid].ph == null || objLastDriver[keyid].ph.length == 0) ? "---" : objLastDriver[keyid].ph;
	var rf = (objLastDriver[keyid].rf == null || objLastDriver[keyid].rf.length == 0) ? "---":objLastDriver[keyid].rf;
	
	var $ul = $("<ul></ul>").appendTo($("#sta_last_driver_info"));	
	$("<li>"+dn+"</li>").addClass('driver_name').appendTo($ul);
	$("<li>"+ph+"</li>").addClass('driver_phone').appendTo($ul);
	$("<li>"+rf+"</li>").addClass('driver_rfid').appendTo($ul);
	
	$("<li>"+objLastDriver[keyid].pi+"</li>").appendTo($("#sta_last_driver_img ul"));
}

function getLastPhoto(keyid, $element){
	queryingPhoto = true;
	var timer = setTimeout("queryingPhoto = false", requestTimeout);
	$.get("last.photo.ajax.php", {"objid":keyid, "size": true}, function(data) {
		 clearTimeout(timer);
		 queryingPhoto = false
		 $element.removeClass("query_waiting");		 
		 
		 if(data != null && data != 'none'){
			 var json = eval('(' + data + ')');			
			 objLastPhoto[keyid] = json;			 
		 }else{
			 var json = {
				 'img': '---',
				 'time': '---'
			 }
			 objLastPhoto[keyid] = json;
		 }
		 displayLastPhoto(keyid);
	});
}

function displayLastPhoto(keyid){
	$("#sta_last_photo").empty();
	$("#sta_last_photo_title").empty();
	
	if(objLastPhoto[keyid] == null){
		return;
	}
	
	var img = objLastPhoto[keyid].img;
	var time = objLastPhoto[keyid].time;
	
	if(time != "---"){
		$("#sta_last_photo_title").text(JS_LAST_PHOTO + "(" +time+ ")")
	}else{
		$("#sta_last_photo_title").text(JS_LAST_PHOTO);
	}
	
	if(img == "---"){
		img = $("<label nowrap='nowrap' style='padding: 2px; height: 60px; width: 100%; font-size:15pt; color: #AAAAAA; line-height: 70px;'></label>").text(JS_NO_DATA);
	}
	$("#sta_last_photo").append(img);	
}

function clearAlarm(keyid){
	var item = $("#tab_all .tree_table").find("tbody tr[n="+keyid+"]").find("td:eq(0) input");
	if(!item.is(":checked")){		
		map.HideShowMarker(false,keyid);
	}
}

function showAlarmInfo(keyid){
    dlgAlarmInfo(keyid)
}

function showLastPhoto(keyid){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try {
		$.get("last.photo.ajax.php", {"objid": keyid}, function(data) {
			clearTimeout(timer);
			showLoading(false);			
			var jo = eval('(' + data + ')');
			if(jo != null && jo != "none"){
				$dlg = $("#dlg_lastphoto");
				$("#lastphoto").empty();
				$dlg.css("display", "block");
				$("body").append("<div class='modalmask'></div>");
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
		});
	} catch(e) {showLoading(false); showMessage("info", JS_LAST_PHOTO, JS_NO_PHOTO);}
}

function showLastVoice(keyid){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try {
		$.get("last.voice.ajax.php", {"objid": keyid}, function(data) {
			clearTimeout(timer);
			showLoading(false);			
			var jo = eval('(' + data + ')');
			if(jo != null && jo != "none"){
				$dlg = $("#dlg_lastvoice");
				$("#lastvoice").empty();
				$dlg.css("display", "block");
				$("body").append("<div class='modalmask'></div>");
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
		});
	} catch(e) {showLoading(false); showMessage("info", JS_LAST_VOICE, JS_NO_VOICE);}
}

function showSharePositionInfo(keyid) {
	$("#mnuOperat").hide();

	if(keyid == null || typeof keyid == undefined){
		keyid = menu_operator_id;
		//initserach(keyid);
	}
    loadSharePosition(keyid)
}

function loadSharePosition(keyid){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try {
		$.post("share.position.ajax.php", {"type":1}, function(data) {
			clearTimeout(timer);
			showLoading(false);		
			
			$dlg = $("#dlg_shareposition");
			$dlg.css("display", "block");
			$("body").append("<div class='modalmask'></div>");
			$dlg.append("<span id='close' class='dialog_cancel'></span>");
			$dlg.find("#close").click(function() {
				$dlg.css("display", "none");
				$(this).remove();
				$(".modalmask").remove();
			});
			
			$("#share_position_addnew").unbind('click').click(function() {
				sharePositionView(1, null, null);				
			});
			
			$dlg.find("#button_cancel").click(function(){
				$dlg.css("display", "none");
				$dlg.find("#close").remove();
				$(".modalmask").remove();
			});
					
			$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
			$dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
			
			$table = $("#share_position_list");	
			$table.find("tbody").remove();
			
			if(typeof data != undefined && data != null && data.length > 1){
				var jo = eval('(' + data + ')');
				if(jo != null && jo != "none"){
					var $tbody = $("<tbody></tbody>").appendTo($table);
					mgrshare_position_array_name = [];
					
					for (var i = 0; i < jo.length; i++) {		
						var $tr = $("<tr></tr>").appendTo($tbody);
						$("<td></td>").text(i+1).attr("shid", jo[i].shid).appendTo($tr);
						$("<td></td>").text(jo[i].sn).attr("sn",jo[i].sn).appendTo($tr);
						mgrshare_position_array_name.push(jo[i].sn);
						
						$("<td></td>").text(jo[i].e).appendTo($tr);
						$("<td></td>").text(jo[i].p).appendTo($tr);
						var assets = jo[i].oids == null ? 0:jo[i].oids.split(',').length;
						$("<td></td>").text(assets).appendTo($tr);
						
						if(jo[i].sa == 0){
							$td = $("<td data-sort="+jo[i].sa+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_disable").appendTo($td);														
						}else{
							$td = $("<td data-sort="+jo[i].sa+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_enable").appendTo($td);														
						}
						
						if(jo[i].ee == 1){
							$("<td data-sort="+((jo[i].et == null || jo[i].et.length == 0) ? jo[i].et : newDate(jo[i].et).getTime())+"></td>").text((jo[i].et == null || jo[i].et.length == 0) ? jo[i].et : $.format.date(jo[i].et, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
						}else{
							$("<td></td>").text('').appendTo($tr);
						}											
											
						$td = $("<td></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px;' onclick='sharePositionView(2,"+keyid+","+jo[i].shid+")'></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);	
						
						str = "<a style='padding-left: 20px;' onclick='sharePositionView(3,"+keyid+","+jo[i].shid+")'></a>";
						$(str).attr("href","#").addClass("operate_delete").appendTo($td);
					}
					
					//$("#share_position_list tbody tr:odd").removeClass().addClass("oddcolor");
						
					if($("#mgrshare_position_item").val() == "1"){
						$("#mgrshare_position_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrshare_position_array_name, minLength: mgrshare_position_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}					
				}
			}
			
			if(keyid != null){
				sharePositionView(1, keyid, null);
			}
		});
	} catch(e) {showMessage("stop", JS_SHARE_POSITION, JS_SHARE_FAIL);}
}

function sharePositionView(state, keyid, shareid){
	$("#mnuOperat").hide();
	if(state != 3){
		sharePositionState(keyid);		
		sharePositionFill();
	}
		
	if(state == 1){
		//new Share Position	
		if(keyid != null){
			$("#share_position_assets").val(keyid);
			$("#share_position_assets").multiselect('reload');
		}	
		showSharePositionDlg(state, keyid, shareid);
	}else{
		//edit Share Position
		locate_table("#share_position_list", "shid", shareid, true);
		dlgSharePositionInfo(state, keyid, shareid);
	}
}

function sharePositionState(keyid){
	var Wnd = $("#dlg_shareposition_properties");	
	$(Wnd).find(".itext").val("");
	$(Wnd).find("#share_position_active").prop("checked", true);
	$(Wnd).find("#share_position_expire").prop("checked", false);
	$(Wnd).find("#share_position_delete").prop("checked", false);
	$(Wnd).find("#share_position_send_email").prop("checked", false);
	$(Wnd).find("#share_position_send_sms").prop("checked", false);	
	
	$(Wnd).find("#button_copy").unbind("click").click(function(){
		var copyText = document.getElementById("shareurl");
		copyText.select();
		copyText.setSelectionRange(0, 99999); 
		document.execCommand("copy");
		showMessage("succ", JS_SHARE_POSITION, JS_SHARE_COPY_SUCCESS);
	});
}

function sharePositionFill(){
	var $items = $("#share_position_assets");	
	$items.empty();
		
	/*var arr = window.parent.JS_DEVICE_FLAG4ID;
    for(var key in arr){	
		$item = $("<option></option>").appendTo($items);
		$item.attr("value", key);
		$item.text(arr[key]);
    }*/
	var g4flags = getGroup4Flags();
	for(var key in g4flags){
		var gname = key;
		var flags = g4flags[key];
		$item = $("<optgroup label='"+gname+"'></optgroup>").appendTo($items);

		for(var k = 0; k < flags.length; k++){
			$it = $("<option></option>").appendTo($item);
			$it.attr("value", getIdByFlag(flags[k]));
			$it.text(flags[k]);
		}
	}
	
	$items.multiselect({
		columns: 3,
		placeholder: JS_SHARE_POSITION_SELECT_ASSETS,
		texts: {
			selectedOptions: JS_SELECTED
		},
		searchOptions: {
			'default': 'Search States'
		},
		selectAll: true,
		search: true,
		maxPlaceholderWidth: 175,
		maxHeight: 230,
		minHeight: 230,
		selectGroup: true
	});
	
	$items.val('');
    $items.trigger('chosen:updated');
	$items.multiselect('reload');
}

function dlgSharePositionInfo(state, keyid, shareid){
	/**edit Share Position*/
	if(state == 2){
		showLoading(true,null,3);
		var timer = setTimeout("showLoading(false,null,3);", requestTimeout);
		try {
			$.post("share.position.ajax.php", {"type": 2, "shid": shareid}, function(data) {			
				clearTimeout(timer);
				var WP = window.parent;
				showLoading(false,null,3);			
				var json = eval('(' + data + ')');
				var jo = json[0];	
				
				var Wnd = $("#dlg_shareposition_properties");				
				showSharePositionDlg(state, keyid, shareid);
				//init Share Position
				$(Wnd).find("#share_position_active").prop("checked", jo.sa==1);	
				$(Wnd).find("#share_position_name").val(jo.sn);
				if(jo.oids != null){
					$('#share_position_assets').val(jo.oids.split(','));
					$('#share_position_assets').multiselect('reload');
				}
				$(Wnd).find("#share_position_email").val(jo.e);
				$(Wnd).find("#share_position_phone").val(jo.p);
				$(Wnd).find("#share_position_expire").prop("checked", jo.ee==1);
				$(Wnd).find("#share_position_delete").prop("checked", jo.ed==1);
				$(Wnd).find("#share_position_send_email").prop("checked", jo.enm==1);
				$(Wnd).find("#share_position_send_sms").prop("checked", jo.ens==1);				
				$(Wnd).find("#shareexpired").val(jo.et);
				$(Wnd).find("#shareurl").val(window.location.protocol + "//" + window.location.host +"/share.login.ajax.php?token="+ jo.tn);
			});
		} catch(e) {showLoading(false,null,3);}
	}else if(state == 3){
		/**delete SharePosition */
		var WP = window.parent
		var $dlg = $("#dlg_delconfirm");
		$dlg.css("display","block");
		$dlg.css("z-index","1020");
		$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
		$dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
		$dlg.append("<span id='close' class='dialog_cancel'></span>");
		$("body").append("<div class='modalmask_level3'></div>");
		$dlg.find("#close").click(function() {
			$dlg.find("#button_ok").unbind("click");
			$dlg.css("display", "none");
			$(this).remove();
			$(".modalmask_level3").remove()
		});
		$dlg.find("#button_cancel").click(function(){
			$dlg.find("#button_ok").unbind("click");
			$dlg.css("display", "none");
			$dlg.find("#close").remove();
			$(".modalmask_level3").remove()
		});
		$dlg.find("#button_ok").click(function() {
			$(this).unbind("click");
			$dlg.css("display", "none");
			showLoading(true,null,3);
			var timer = setTimeout("showLoading(false,null,3);", requestTimeout);
			try {
				$.post("share.position.ajax.php", {"type": 3, "state": state, "shid": shareid}, function(data) {
					clearTimeout(timer);
					showLoading(false,null,3);
					var result = eval('(' + data + ')');
					if(result.status == 'ok'){
						
						var $td = $("#share_position_list tbody tr td[shid="+shareid+"]");
						var delIdex = parseInt($td.parent().find("td:first-child").text());
						var $trs = $("#share_position_list tbody tr");//$td.parent().nextAll();
						$.each($trs, function(idx, value){
							var index = parseInt($(value).find("td:first-child").text());
							if(delIdex < index){
								$(value).find("td:first-child").text(index - 1);
							}							
						});
						
						$td.parent().remove();
						mgrshare_position_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrshare_position_array_name),1);				
						
						//$("#share_position_list tbody tr").removeClass("oddcolor");
						//$("#share_position_list tbody tr:odd").addClass("oddcolor");
						
						$("#mgrshare_position_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrshare_position_array_name,minLength:mgrshare_position_array_name.length < 2000 ? 0:2,max:10,scroll:true});				
						
						showMessage("succ", JS_SHARE_POSITION, JS_DELETE_SUCC);
					}else if(result.error == -20){
						showMessage("stop", JS_SHARE_POSITION, JS_NO_PERMISSION);
					}else {
						showMessage("stop", JS_SHARE_POSITION, JS_DELETE_FAIL);
					}
				});
			} catch(e) {showLoading(false,null,3);}
		});	
	}		
}

function showSharePositionDlg(state, keyid, shareid){
	var Wind = $("#dlg_shareposition_properties");
	$(Wind).css("z-index", "1012");
	$(Wind).css("display", "block");
	$("body").append("<div class='modalmask_level2'></div>");
	$(Wind).append("<span id='close' class='dialog_cancel'></span>");
	$(Wind).find("#close").click(function() {
		$(Wind).css("display", "none");
		$(this).remove();
		$(".modalmask_level2").remove();
	});
	
	$(Wind).find("#button_cancel").click(function(){
		$(Wind).css("display", "none");
		$(Wind).find("#close").remove();
		$(".modalmask_level2").remove()
	});
	
	$(Wind).css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
	$(Wind).css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	
	$(Wind).find("#button_ok").unbind("click").click(function(){
		/**check share position input*/
		if(checkSharePositionDlg()){
			/**save share position*/
			saveSharePosition(state, keyid, shareid);
		}
	});
}

function checkSharePositionDlg(){
	var Wind = $("#dlg_shareposition_properties");
	$(Wind).find(".itext, .itime").each(function(){
		$(this).removeClass("invalidbox"); 
	});
	
	var mustok = true;				
	$(Wind).find(".must").each(function(){
		var value = $(this).val().replace(/(^\s*)|(\s*$)/g,"");
		if(value == ""){			
			$(this).addClass("invalidbox").focus();
			mustok = false;
		}else{
			$(this).removeClass("invalidbox");
		}	
	});
	
	$(Wind).find("#share_position_assets").each(function(){
		var value = $(this).val();
		if(value == null || value.length == 0){
			$(this).addClass("invalidbox").focus();
			mustok = false;
		}else{
			$(this).removeClass("invalidbox");
		}
	});
	return mustok;
}

function saveSharePosition(state, keyid, shareid){
	var WP = window.parent;
	var Wind = $("#dlg_shareposition_properties");
	showLoading(true,null,3);
	var timer = setTimeout("showLoading(false,null,3)", requestTimeout);
	
	var req = {
		"type":3,
		"state": state,
		"sn": $(Wind).find("#share_position_name").val(),
		"sa": $(Wind).find("#share_position_active").prop("checked") ? 1 : 0,
		"oids": $(Wind).find("#share_position_assets").val().join(),
		"e": $(Wind).find("#share_position_email").val(),
		"p": $(Wind).find("#share_position_phone").val(),
		"ee": $(Wind).find("#share_position_expire").prop("checked") ? 1 : 0,
		"et": $(Wind).find("#shareexpired").val(),
		"ed": $(Wind).find("#share_position_delete").prop("checked") ? 1 : 0,
		"enm": $(Wind).find("#share_position_send_email").prop("checked") ? 1 : 0,
		"ens": $(Wind).find("#share_position_send_sms").prop("checked") ? 1 : 0,
		"shid": shareid
	}
	
	try {
		$.post("share.position.ajax.php", req, function(data) {
			clearTimeout(timer);
			showLoading(false,null,3);
			
			var result = eval('(' + data + ')');
			if(result != null && result != "none" && result.status == 'ok'){											
				
				if(state == 2){					
					/**edit share position*/
					var str = "#share_position_list tbody tr td[shid='"+req.shid+"']";
					var $td = $(str);
					if($td.length > 0){
						var $tr = $td.parent();						
						mgrshare_position_array_name.splice($.inArray($tr.find('td:eq(1)').text(),mgrshare_position_array_name),1);						
						$tr.find('td:eq(1)').text(req.sn).attr("sn",req.sn);	
						$tr.find('td:eq(2)').text(req.e);
						$tr.find('td:eq(3)').text(req.p);
						var assets = req.oids.split(',').length;		
						$tr.find('td:eq(4)').text(assets);		
						
						$tr.find('td:eq(5)').attr("data-sort", req.sa);
						if(req.sa == 0){
							$tr.find('td:eq(5) a').removeClass("state_enable").addClass("state_disable");																					
						}else{
							$tr.find('td:eq(5) a').removeClass("state_disable").addClass("state_enable");																					
						}
						
						if(req.ee == 1){
							$tr.find('td:eq(6)').text((req.et == null || req.et.length == 0) ? req.et : $.format.date(req.et, JS_DEFAULT_DATETIME_fmt_JS)).attr("data-sort", ((req.et == null || req.et.length == 0) ? req.et : newDate(req.et).getTime()))
						}else{
							$tr.find('td:eq(6)').text('');
						}
						mgrshare_position_array_name.push(req.sn);					
						
						if($("#mgrshare_position_item").val() == "1"){
							 $("#mgrshare_position_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrshare_position_array_name,minLength:mgrshare_position_array_name.length < 2000 ? 0:2,max:10,scroll:true});
						}
						
						if(typeof req.en != "undefined"){
							locate_table("#share_position_list", "sn", req.sn, true);
						}
						showMessage("succ", JS_SHARE_POSITION, JS_UPDATE_SUCC);	
					}
				}else{
					/**new share position*/
					$(Wind).find("#shareurl").val(window.location.protocol + "//" + window.location.host +"/share.login.ajax.php?token="+ result.token);
					/**delete same name share position*/
					var $td = $("#share_position_list tbody tr td[sn='"+req.sn+"']");
					if($td.length > 0){
						var delIdex = parseInt($td.parent().find("td:first-child").text());
						var $trs =  $("#share_position_list tbody tr");//$td.parent().nextAll();
						$.each($trs, function(idx, value){
							var index = parseInt($(value).find("td:first-child").text());
							if(delIdex < index){
								$(value).find("td:first-child").text(index - 1);
							}						
						});
						
						$td.parent().remove();
						mgrshare_position_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrshare_position_array_name),1);
					}
									
					var $tbody = $("#share_position_list tbody");
					if($tbody.length == 0){
						$tbody = $("<tbody></tbody>").appendTo($("#share_position_list"));
					}
					
					mgrshare_position_array_name.push(req.en);
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text($tbody.find("tr").size()).attr("shid", result.shid).appendTo($tr);
					$("<td></td>").text(req.sn).attr("sn",req.sn).appendTo($tr);
					$("<td></td>").text(req.e).appendTo($tr);
					$("<td></td>").text(req.p).appendTo($tr);
					var assets = req.oids.split(',').length;
					$("<td></td>").text(assets).appendTo($tr);
					
					if(req.sa == 0){
						$td = $("<td data-sort="+req.sa+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_disable").appendTo($td);														
					}else{
						$td = $("<td data-sort="+req.sa+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_enable").appendTo($td);														
					}
					
					if(req.ee == 1){
						$("<td data-sort="+((req.et == null || req.et.length == 0) ? req.et : newDate(req.et).getTime())+"></td>").text((req.et == null || req.et.length == 0) ? req.et : $.format.date(req.et, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
					}else{
						$("<td></td>").text('').appendTo($tr);
					}
										
					$td = $("<td></td>").appendTo($tr);
					var str = "<a style='padding-left: 20px;' onclick='sharePositionView(2,"+keyid+","+result.shid+")'></a>";
					$(str).attr("href","#").addClass("operate_edit").appendTo($td);	
					
					str = "<a style='padding-left: 20px;' onclick='sharePositionView(3,"+keyid+","+result.shid+")'></a>";
					$(str).attr("href","#").addClass("operate_delete").appendTo($td);
					
					//$("#share_position_list tbody tr").removeClass("oddcolor");
					//$("#share_position_list tbody tr:odd").addClass("oddcolor");
					if($("#mgrshare_position_item").val() == "1"){
						 $("#mgrshare_position_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrshare_position_array_name,minLength:mgrshare_position_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					if(typeof req.en != "undefined"){
						locate_table("#share_position_list", "sn", req.sn, true);
					}
					showMessage("succ", JS_SHARE_POSITION, JS_SAVE_SUCC);
				}
			}else if(result.error == -20){
				showMessage("stop", JS_SHARE_POSITION, JS_NO_PERMISSION);
			}else{
				showMessage("stop", JS_SHARE_POSITION, JS_SHARE_FAIL);
			}           			
		});
	} catch(e) {showLoading(false,null,3);showMessage("stop", JS_SHARE_POSITION, JS_SHARE_FAIL);}
}


function showTaskInfo(tname){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try {
		$.post("manage.task.ajax.php", {"type":13, "tname": tname}, function(data) {
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
		$.post("manage.task.ajax.php", opts, function(data) {
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

function dlgDeviceInfo(keyid) {
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try {
		$.get("devinfo.ajax.php", {"objid": keyid}, function(data) {
			clearTimeout(timer);
			showLoading(false);
			
			var jo = eval('(' + data + ')');
			$dlg = $("#dlg_objinfo");
			$dlg.find(".itext,icontent").val("");
			$("#oflag").removeClass("invalidbox");
			$dlg.css("display", "block");
			$("body").append("<div class='modalmask'></div>");
			$dlg.append("<span id='idclose' class='dialog_cancel'></span>");
			$dlg.find("#idclose").click(function() {
				$dlg.css("display", "none");
				$(this).remove();
				$(".modalmask").remove()
			});

			$dlg.find("#button_cancel").click(function(){
				$dlg.css("display", "none");
				$dlg.find("#idclose").remove();
				$(".modalmask").remove()
			});
			$dlg.find("#button_ok").unbind("click").click(function() {								
				var mustok = true;
				if($("#oflag").val()=="" || $("#oflag").val()==null){
					$("#oflag").addClass("invalidbox");
					mustok = false;
				}else{
					$("#oflag").removeClass("invalidbox");
				}
				if(!mustok)return;
				
				$(this).unbind("click");
				var req = {
					"style": "post",
					"objid": keyid,
					"oflag": $dlg.find("#oflag").val(),  
					//"okind": $dlg.find("input[name='okind']:checked").val(),
					"okind": parseInt(iconSelect.getSelectedValue()),               
					"custphone": $dlg.find("#custphone").val(),                    
					"remark": $dlg.find("#remark").val()
				}
				showLoading(true);
				try{
					timer = setTimeout("showLoading(false,true)", requestTimeout);
					$.get("devinfo.ajax.php", req, function(data) {
						clearTimeout(timer);
						showLoading(false);						
						if (data.indexOf("ok") >= 0) {
							$dlg.css("display", "none");
							$dlg.find("#idclose").remove();
							$(".modalmask").remove();
							showMessage("succ", JS_DEVICE_INFO, JS_UPDATE_SUCC);
						}else{
							var result = eval('(' + data + ')');
							if(result.error == -1){
								$("#oflag").addClass("invalidbox").focus();
								showMessage("stop", JS_DEVICE_INFO, JS_ERROR_TIP);
							}else if(result.error == -20){
								showMessage("stop", JS_DEVICE_INFO, JS_NO_PERMISSION);
							}
						}
					});
				}catch(e){error(showLoading(false));}
			});
			
			$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
			$dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
			$dlg.find("#oflag").val(jo.oflag);
			$dlg.find("#dtype").val(jo.dtype);
			$dlg.find("#devno").val(jo.devno);
			$dlg.find("#simno").val(jo.simno);
			$dlg.find("#itime").val($.format.date(jo.itime, JS_DEFAULT_DATE_FMT));
			$dlg.find("#etime").val($.format.date(jo.etime, JS_DEFAULT_DATE_FMT));
			$dlg.find("#custname").val(jo.custname);
			$dlg.find("#custphone").val(jo.custphone);
			$dlg.find("#drvname").val(jo.drvname);
			$dlg.find("#drvphone").val(jo.drvphone);
			//$dlg.find("input[name='okind'][value=" + jo.okind + "]").prop("checked", true);
			iconSelect.setSelectedIndex(jo.okind - 1);
			$dlg.find("#remark").val(jo.remark)       
		});
	} catch(e) {showLoading(false);}
}
function showDeviceInfo(keyid) {
	$("#mnuOperat").hide();

	if(keyid == null || typeof keyid == undefined){
		keyid = menu_operator_id;
		//initserach(keyid);
	}
    dlgDeviceInfo(keyid)
}

function initCmdParams(protocolid, commandid){
	$("#cmderror").css("display","none");
	$("#cmdparam").empty();
    var $tbody = $("<tbody></tbody>").appendTo($("#cmdparam"));
	var paramNo = 0;
	
	for(var i = 0; i < protocolCmd.length; i++)
	{
		if(protocolCmd[i].pid == protocolid && protocolCmd[i].cid == commandid){			
			var $tr = $("<tr></tr>").appendTo($tbody);
			var $tname = $("<td></td>").appendTo($tr);
			$("<label></label>").removeClass().addClass("edit").text(protocolCmd[i].pm == 1 ? "*" + protocolCmd[i].pn : protocolCmd[i].pn).appendTo($tname);
       
			var $tvalue = $("<td></td>").appendTo($tr);
			var $input;
			
			/*VALUE_TYPE == 0*/
			if(protocolCmd[i].vt == 0){
				$input = $("<select></select>").addClass("iselect").addClass("enablebox").width(150).appendTo($tvalue);
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
				$input = $("<input readonly='true' style='margin-left: 4px;'></input>").removeClass().addClass("itime").addClass("enablebox").width(145).appendTo($tvalue);
				$tvalue.attr("ptype", 1);
				$input.datepicker({
					dateFormat: "yy-mm-dd",
					changeMonth: true,
					changeYear: true,
					yearRange: "-20:+20"
				});
			}
			/*DEF_VALUE == %TIME%*/
			else if(protocolCmd[i].dv == "%TIME%"){
				$input = $("<input readonly='true' style='margin-left: 4px;></input>").removeClass().addClass("itime").addClass("enablebox").width(145).appendTo($tvalue);
				$tvalue.attr("ptype", 2);
				$input.timepicker({
					timeFormat: "HH:mm"
				});
			}
			else{
				$input = $("<input style='margin-left: 4px;'></input>").removeClass().addClass("itext").addClass("enablebox").width(145).appendTo($tvalue);
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
			
			/*parameter unit*/
			if(protocolCmd[i].units != null && protocolCmd[i].units.length > 0){
				var $tunits = $("<td></td>").appendTo($tr);
				$("<label></label>").removeClass().addClass("edit").text(protocolCmd[i].units).appendTo($tunits);
			}
			
			paramNo++;
		}
	}
	if(paramNo == 0){
		var $noParam = $("<td></td>").text(JS_NO_NEED_PARAM).appendTo($tbody);
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

function showSendCmd(keyid) {
	$("#mnuOperat").hide();
	if(typeCmd == null || typeCmd.length == 0){
		showMessage("info", JS_CMD_SENDCMD, JS_NO_COMMAND);
		return;
	} 

	if(keyid == null || typeof keyid == undefined){
		keyid = menu_operator_id;
		//initserach(keyid);
	}
	var typeid = getTypeById(keyid);
    dlgSendCmd(keyid, typeid);
}

function dlgSendCmd(keyid, typeid) {
	var jo;							
	var $ul = $("#cmdul");
	$ul.empty();
	$("#cmdparam").empty();
	$("#cmderror").css("display","none")
	
	for(var i = 0; i < typeCmd.length; i++)
	{
		if(typeCmd[i].tid == typeid){
			jo = typeCmd[i];
			var $li = $("<li></li>").attr("cmdid", typeCmd[i].cid).appendTo($ul);
			var $a = $("<a onmousedown=\"initCmdParams("+jo.pid+","+jo.cid+")\"></a>").text(typeCmd[i].cn).appendTo($li);
		}
	}
	
    var $dlg = $("#dlg_sendcmd");
    $dlg.css("display", "block");
    $("body").append("<div class='modalmask'></div>");
    $dlg.append("<span id='close' class='dialog_cancel'></span>");
    $dlg.find("#close").click(function() {
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_ok").unbind("click").click(function() {
		var matchArray;
		
		/*not select command*/
		if($(".dialog ul li.dlg_active").attr("cmdid") == null){
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
				var intPat = /^[+-]?\d+(\.\d+)?$/;///^-?[0-9]+$/;
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
		
        $(this).unbind("click");
		var params = "";
		$("#cmdparam").find("tr").each(function(){
			var param = $(this).children().eq(1);
			if(param.attr("ptype") == 0){
				params = params + $(this).children().eq(1).find("select").val() + ",";
			}else if(param.attr("ptype") == 4){
				params = params + $(this).children().eq(1).find("div").attr("file") + ",";
			}else{
				params = params + $(this).children().eq(1).find("input").val() + ",";
			}
		});

        var req = {
            "objid": keyid,
            "cmdid": $(".dialog ul li.dlg_active").attr("cmdid"),
			"params": params.substring(0,params.length -1)
        }
        $dlg.css("display", "none");
        showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
        try{
            $.get("command.ajax.php", req, function(data) {	
				clearTimeout(timer);
                showLoading(false);
                if (data.indexOf('ok') >= 0) {
					$dlg.find("#close").remove();
                    $(".modalmask").remove();
					showMessage("succ", JS_CMD_SENDCMD, JS_CMD_SEND_SUCC);
                } else{
					var result = eval('(' + data + ')');
					if(result.error == -20){
						showMessage("stop", JS_CMD_SENDCMD, JS_NO_PERMISSION);
					}else {
						alert(data)
					}
				}
            });
        }catch(e){error(showLoading(false));}
    });
    $(".dialog ul li").click(function() {
        $(".dlg_active").removeClass("dlg_active");
        $(this).addClass("dlg_active")
    });
    $dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px")
}

function showStreetView(){
	$("#mnuOperat").hide();
	var keyid = menu_operator_id;
	//initserach(keyid);
	var marker = map.GetMarker(keyid);
	var x = marker.properties.x;
	var y = marker.properties.y;
	var dir = marker.properties.dir;
	openStreetView(x,y,dir); 
}

function openStreetView(x, y, dir){
	window.open(JS_GOOGLE_MAP_BASE_LINK+"/maps?q&layer=c&hl="+JS_CURRENT_LANG+"&cbll="+y / 1000000+","+x / 1000000+"&cbp=11,"+dir+",0,0,0", "_blank");
	//window.open(JS_GOOGLE_MAP_BASE_LINK+"/cbk?output=thumbnail&w=90&h=68&ll=51.494966,-0.146674", "_blank"); 
}

function showObjChart(){
	$dlg = $("#dlg_objstatechart");
	if($dlg.css("display")=="none"){
		$("body").append("<div class='modalmask'></div>");
		$dlg.css("display", "block");
		
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
		
		$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 2) + "px");
		$dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	}		
	var movestop = getMovingStopCarNumber();
	var topObjIos = getTopMileageEngine();	
	createObjStateBar(getAllNumber(), getOnlineNumber(), getOfflineNumber(), getAlarmCarNumber(), getExpiredNumber(), movestop[0], movestop[1], movestop[2], movestop[3], topObjIos[0], topObjIos[1], topObjIos[2], topObjIos[3], getExpireObjByDays());	
}

var $lastselect;//device list last selection
function updateOne(tr){
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
	
	tr.attr("class","normal").find("td:eq(2)").css({'background': 'url(img/icons/icon_'+i+'.svg) no-repeat 5px center', 'padding-left': '30px', 'background-size': '20px 20px'});
	
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
			var keyid = tr.attr("n");
			showAlarmInfo(keyid);
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
		menu_operator_id = tr.attr("n");
		$("#mnuOperat").hide();
		$("#mnuOperat").show();
		/*If exceed body*/
		var bheight = $(document.body).height();
		var mheight = 150;
		var hheight = 228;
		if(bheight - e.pageY < mheight){
			$("#mnuOperat").css({'top':e.pageY-mheight-50,'left':e.pageX});
		}else{
			$("#mnuOperat").css({'top':e.pageY-50,'left':e.pageX});
		}
				
		var dheight = bheight - $(".liHistory").offset().top;
		if(dheight < hheight){
			$(".mnuHistory").css({'top': dheight - hheight});	
		}else{
			$(".mnuHistory").css({'top': 0});	
		}
    });
	
	/*update device tips*/
	$(tr.find("td:eq(2)")).unbind("hover").hover(function(e) {
		var WP = window.parent;
		var io = $(this).attr("io");
		$("#tip_name").text($(this).text());
		$("#tip_device_no").text($(this).attr("nc"));
		$("#tip_simcard").text($(this).attr("si"));
		$("#tip_driver").text($(this).attr("dn"));
		$("#tip_lat").text(($(this).attr("y") / 1000000).toFixed(5) + String.fromCharCode(176));
		$("#tip_lng").text(($(this).attr("x") / 1000000).toFixed(5) + String.fromCharCode(176));
		$("#tip_speed").text($(this).attr("sp") + " " + WP.UNIT_SPEED);
		$("#tip_heading").text($(this).attr("d") + String.fromCharCode(176));
		$("#tip_time").text($(this).attr("t"));
		
		var io = $(this).attr("io");
		var dt = $(this).attr("dt");
		
		var oneIoVal = getIdValue("A:", io);
		if(oneIoVal != null){
			oneIoVal = mileageUnitConversion(oneIoVal, JS_UNIT_DISTANCE);	
			$("#tip_mil").text((oneIoVal) + UNIT_DIST);
		}else{
			$("#tip_mil").text("---");
		}
		
		//fuel
		oneIoVal = getIdValue("1E:", io);
		var fuel_1 = '---';
		if(oneIoVal != null){
			fuel_1 = fuelUnitConversion(oneIoVal, JS_UNIT_FUEL);			
		}
		
		oneIoVal = getIdValue("1F:", io);
		var fuel_2 = '---';
		if(oneIoVal != null){
			fuel_2 = fuelUnitConversion(oneIoVal, JS_UNIT_FUEL);
		}
		$("#tip_fuel").text(fuel_1 + ',' + fuel_2 + UNIT_FUEL);
		
		//Inner battery
		oneIoVal =getIdValue("1:", io);
		if(oneIoVal != null){
			$("#tip_bat").text(oneIoVal + "%");
		}else{
			$("#tip_bat").text("---");
		}
		
		//temp
		oneIoVal = getIdValue("48:", io);
		var temp_1 = '---';
		if(oneIoVal != null){
			temp_1 = tempUnitConversion(oneIoVal, JS_UNIT_TEMPERATURE);			
		}
		
		oneIoVal = getIdValue("48:", io);
		var temp_2 = '---';
		if(oneIoVal != null){
			temp_2 = tempUnitConversion(oneIoVal, JS_UNIT_TEMPERATURE);
		}	
		$("#tip_temp").text(temp_1 +','+ temp_2 + UNIT_TEMP);
		
		//passenger
		oneIoVal = getIdValue("1C:", io);
		if(oneIoVal != null){
			$("#tip_passenger").text(oneIoVal);
		}else{
			$("#tip_passenger").text("---");
		}
		
		//humidity
		oneIoVal = getIdValue("1D:", io);
		if(oneIoVal != null){
			if(JS_UNIT_HUMIDITY == 1){
				//
			}
			$("#tip_humidity").text(oneIoVal + UNIT_HUMIDITY);
		}else{
			$("#tip_humidity").text("---");
		}
		
		$("#devicetips").css("display","block");
		$("#devicetips").css({'top':e.pageY,'left':e.pageX+15});
		/*If exceed body*/
		var bheight = $(document.body).height();
		var tipsbottom = $("#devicetips").offset().top + $("#devicetips").height();
		if(tipsbottom > bheight){
			$("#devicetips").css({'top':e.pageY - (tipsbottom - bheight + 30),'left':e.pageX+15});
		}	
	},function(){
		$("#devicetips").css("display","none");
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
	
	$tr.find("#temp_1").attr("class","temp_1").attr("title",JS_TEMP);
	$tr.find("#fuel_1").attr("class","fuel_1").attr("title",JS_FUEL);
	$tr.find("#mil_24").attr("class","mil_24").attr("title",JS_ODOMETER_24H);
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
	$tr.find("#max_speed_24").attr("class","max_speed_24").attr("title",JS_MAX_SPEED_24H);
	$tr.find("#moving_time_24").attr("class","moving_time_24").attr("title",JS_INFO_MOVING_TIME_24H);
	$tr.find("#idle_time_24").attr("class","idle_time_24").attr("title",JS_INFO_IDLE_TIME_24H);
	$tr.find("#stop_time_24").attr("class","stop_time_24").attr("title",JS_INFO_STOP_TIME_24H);
	$tr.find("#engine_time_24").attr("class","engine_time_24").attr("title",JS_INFO_ENGINE_TIME_24H);
	$tr.find("#total_mil").attr("class","total_mil").attr("title",JS_ODOMETER);
	$tr.find("#door_state").attr("class","door_state").attr("title",JS_DOOR_STATE);
	$tr.find("#last_driver").attr("class","last_driver").attr("title",JS_DRIVER_NAME);	
	
	$tr.find("td li").each(function(index, ele){
		if(haveInfo(index + 1)){
			$(this).css("display","block");
		}else{
			$(this).css("display","none");
		}
	});
}

function haveInfo(info){
	if(JS_DEFAULT_ASSET_INFOS == null || JS_DEFAULT_ASSET_INFOS.length == 0){
		return false;
	}else{
		var ins = JS_DEFAULT_ASSET_INFOS.toString().split(',');
		for(var i = 0; i < ins.length; i++){
			if(info.toString() == ins[i]){
				return true;
			}
		}
		return false;
	}
}


function showLast24History(objid){
	map.ClearTrack(objid);
	showLoading(true);
	var timer_search = setTimeout("showLoading(false,true)", 30000);
	var param = {
		"objid": objid, 
		"day": 0.1, 
		"time1": '', 
		"time2": '', 
		"stop": 0, 
		"event": 0, 
		"ptype": 1,
		"btype": 1
	}
	events = [];
	stops = [];
	moves = [];
	try{
        $.get("playback.ajax.php", param, function(data) {
            clearTimeout(timer_search);
			showLoading(false);
            try{
                var json = eval('(' + data + ')');
                if(json != null && typeof json.error != "undefined"){
                     showMessage("stop", JS_PLAY_TITLE, json.error, 10);
                } else if(json != null && typeof json.item != "undefined" && json.item.length > 0){
                    var hisData = json.item;					
					map.DrawTrackLine(objid, hisData, { point: true }, stops, false, events, false, true, false, moves);
					//map_locate(objid, true, true, false, false);									
				}
			}catch(e){/*alert(e.message)*/clearTimeout(timer_search); error(showLoading(false));}
		});
	}catch(e){/*alert(e.message)*/clearTimeout(timer_search); error(showLoading(false));}
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
				map_locate(keyid, true, true, false, false);
				
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
				map_locate(keyid, true, true, false, false);				
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
	
	/* update group item click event*/
	//$.each($tabs.find("tbody tr:not(tr:first-child)"), function(i,value){
	$.each(ChangeItems, function(i, value){
		$(value).find("td:lt(6):gt(1)").unbind("click").click(function() {
			$(".active").removeClass("active");
			$(".active").next().removeClass("active");
			$(".gractive").removeClass("gractive");
			$(".hover").removeClass("hover");
			$(".hover").next().removeClass("hover");
			$lastselect = $(value).closest('tr');
			$lastselect.addClass("active");
			$lastselect.next().addClass("active");
			var keyid = parseInt($lastselect.attr("n"));
			current_id = keyid;
			
			map.HideShowMarker(true,keyid);
			map_locate(keyid, true, true, false, true);	
			$lastselect.find("td:first-child input").prop('checked', true);
			//$lastselect.find("td:eq(1) input").prop('checked', true);
			
			var items = findpageitems(keyid);
			$.each(items, function(index,value){
				 $(value).find("td:eq(0) input").prop('checked', true);
				 //$(value).find("td:eq(1) input").prop('checked', true);
			});
		});
	});
	
	/* update group item hover event */
	$.each(ChangeItems, function(i, value){
		$(value).unbind("hover").hover(function(e) {
		//$tabs.find("tbody tr:not(tr:first-child)").unbind("hover").hover(function(e) {
				$lastselect = $(this);
				if(!$lastselect.hasClass('active')){
					$lastselect.addClass("hover");
					$lastselect.next().addClass("hover")
				}
				var keyid = parseInt($lastselect.attr("n"));
				link_marker(keyid);
			},function(){
				$(".hover").removeClass("hover");
				$(".hover").next().removeClass("hover");
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
    /*$.each($("#mod ul li"), function(i, value) {
        var $tbody = $($(value).attr("target") + " tbody tr:not(tr:first-child)");
        var $tab = $(value).find("a");//table a label
        $tab.text($tab.attr("title") + "(" + $tbody.length + ")");
        var $trs = $($(value).attr("target") + " tbody tr:first-child");
        $.each($trs, function(n, tr) {
            var $offline = $(tr).parent().find("[s='0']");
            var $all = $(tr).parent().find("[s]");
            var $th = $(tr).find("th:eq(2)");
            $th.text($(tr).attr("t") + " [" + ($all.length - $offline.length) + "/" + $all.length + "]")
        })
    })*/
	
	/* update alarm number */
	var alarms = getAllAlarm();
	if(typeof alarms != "undefined" && alarms > 0){
		if(alarms > 10){
			alarms = "10+";
		}
		$("#alarm_msg").html("<a href='#'>" + JS_TIP_OBJ_ALARM + "(" + alarms + ")</a>");
		$("#alarm_msg").css("background-image",'url("../img/alarm.svg")');
		$("#alarm_msg a").css("color","red");
	}else{
		$("#alarm_msg").html("<a href='#'>" + JS_TIP_OBJ_ALARM + "(0)</a>");
		$("#alarm_msg").css("background-image",'url("../img/alarm_off.svg ")');
		$("#alarm_msg a").css("color","white");
	}
	$("#alarm_msg").unbind("click").click(function() {
		dlgAlarmInfo();
	});
}

function updateStatusCount(){
	/* update status count */
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

function releaseTrack(keyid){
	current_id = 0;
	$(".active").removeClass("active");
	$(".gractive").removeClass("gractive");
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
			
			//display race
			$('#race_details tbody').empty();
			$tbody = $("<tbody></tbody>").appendTo("#race_details");
			for(var i = 0; i < race_array.length; i++){
				var $KI = race_array[i];
				if($KI ==  null || typeof $KI.attr('c') == "undefined" || $KI.attr('c') == null){
					continue;
				}
				
				var c = $KI.attr('c');			
				var y = ($KI.find("td:eq(2)").attr('y')/1000000).toFixed(6);
				var x = ($KI.find("td:eq(2)").attr('x')/1000000).toFixed(6);;
				var speed = $KI.attr('sval');
				var io = $KI.attr('io');
				
				var routeLeng = getIdValue("F6:", io, true);
				var routeComp = getIdValue("F7:", io, true);
				var distToDest = getIdValue("125:", io, true);
				var timeToDest = getIdValue("124:", io, true);		
				var distToleader = getIdValue("122:", io, true);
				var timeToleader = getIdValue("123:", io, true);
				
				$tr = $("<tr></tr>").appendTo($tbody);
				$("<td></td>").html("<span>"+c+"</span>").appendTo($tr);
				$("<td></td>").html("<span>"+y+','+x+"</span>").appendTo($tr);
				if(routeLeng != null && routeComp != null){
					$("<td></td>").html("<span>"+(parseFloat(routeLeng)*parseFloat(routeComp)/100).toFixed(3)+"</span>").appendTo($tr);
					$("<td></td>").html("<span>"+(routeLeng - parseFloat(routeLeng)*parseFloat(routeComp)/100).toFixed(3)+"</span>").appendTo($tr);
				}else{
					$("<td></td>").html("---").appendTo($tr);
					$("<td></td>").html("---").appendTo($tr);
				}
				$("<td></td>").html("<span>"+speed+"</span>").appendTo($tr);
				
				if(i == 0){
					$("<td></td>").html("<span>"+(distToDest == null ? "---":distToDest)+"</span>").appendTo($tr);
					$("<td></td>").html("<span>"+(timeToDest == null ? "---":second2time(timeToDest))+"</span>").appendTo($tr);
				}else{
					$("<td></td>").html("<span>"+(distToleader == null ? "---":distToleader)+"</span>").appendTo($tr);
					$("<td></td>").html("<span>"+(timeToleader == null ? "---":second2time(timeToleader))+"</span>").appendTo($tr);
				}
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
	var r = $("#tree_online tbody tr:not(tr:first-child)");	
	$(r).each(function(i, value) {
		var a = $(value).find("td:eq(6)").attr('a');
		if(a > 0){
			alarms++;
		}
	})
	return alarms;
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
		if(typeof a != "undefined" && a != null){
			alarms = alarms + parseInt(a);
		}
	})
	return alarms;
}

function getAllNumber(){
	return $("#tree_all tbody tr[s]").length;
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
				size: 110,
				dataLabels: {
					enabled: true,
					align: 'left',
					format: '{point.name}: {point.y}',
					distance: 10,
					style: {
						textOverflow: 'none',
						fontWeight: 'normal',
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				},
			},
			connectorPadding: 10
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
				size: 110,
				dataLabels: {
					enabled: true,
					align: 'left',
					format: '{point.name}: {point.y}',
					distance: 10,
					style: {
						textOverflow: 'none',
						fontWeight: 'normal',
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				},
			},
			connectorPadding: 10
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
				size: 110,
				dataLabels: {
					enabled: true,
					align: 'left',
					format: '{point.name}: {point.y}',
					distance: 10,
					style: {
						textOverflow: 'none',
						fontWeight: 'normal',
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				},
			},
			connectorPadding: 10
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
				size: 110,
				dataLabels: {
					enabled: true,
					align: 'left',
					format: '{point.name}: {point.y}',
					distance: 10,
					style: {
						textOverflow: 'none',
						fontWeight: 'normal',
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				},
			},
			connectorPadding: 10
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
	
	var sta_last5days_mileage_chart = Highcharts.chart('sta_last5day_mileage', {		
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
			text: '',
			style: {
				display: 'none'
			}
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
	
	var sta_last5days_engine_chart = Highcharts.chart('sta_last5day_engine', {
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
			text: '',
			style: {
				display: 'none'
			}
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
	
	
	var sta_last5days_load_chart = Highcharts.chart('sta_last5day_load', {
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
			text: '',
			style: {
				display: 'none'
			}
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

/*function createSpeedometer(speed){
	var sta_speedometer_chart = Highcharts.chart('sta_speedometer', {
	  chart: {
		type: 'gauge',
		plotBackgroundColor: null,
		plotBackgroundImage: null,
		plotBorderWidth: 0,
		plotShadow: false,
		spacingTop: 5,
		spacingRight: 0,
		spacingBottom: 0,
		spacingLeft: 0,
		plotBorderWidth: 0
	  },
	  credits: {
		text: '',
		href: ''
	  },
	  exporting: {
		enabled: false
	  },
	  title: {
		text: '',
		style: {
			display: 'none'
		}
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
	  pane: {
		startAngle: -150,
		endAngle: 150,
		background: [{
		  backgroundColor: {
			linearGradient: {
			  x1: 0,
			  y1: 0,
			  x2: 0,
			  y2: 1
			},
			stops: [[0, '#FFF'], [1, '#333']]
		  },
		  borderWidth: 0,
		  outerRadius: '109%'
		}, {
		  backgroundColor: {
			linearGradient: {
			  x1: 0,
			  y1: 0,
			  x2: 0,
			  y2: 1
			},
			stops: [[0, '#333'], [1, '#FFF']]
		  },
		  borderWidth: 1,
		  outerRadius: '107%'
		}, {// default background
		}, {
		  backgroundColor: '#DDD',
		  borderWidth: 0,
		  outerRadius: '105%',
		  innerRadius: '103%'
		}]
	  },
	  // the value axis
	  yAxis: {
		min: 0,
		max: 200,
		minorTickInterval: 'auto',
		minorTickWidth: 1,
		minorTickLength: 10,
		minorTickPosition: 'inside',
		minorTickColor: '#666',
		tickPixelInterval: 30,
		tickWidth: 2,
		tickPosition: 'inside',
		tickLength: 10,
		tickColor: '#666',
		labels: {
		  step: 2,
		  rotation: 'auto'
		},
		title: {
		  text: UNIT_SPEED
		},
		plotBands: [{
		  from: 0,
		  to: 120,
		  color: '#55BF3B' // green

		}, {
		  from: 120,
		  to: 160,
		  color: '#DDDF0D' // yellow

		}, {
		  from: 160,
		  to: 200,
		  color: '#DF5353' // red

		}]
	  },
	  series: [{
		name: JS_SPEED,
		data: [speed],
		tooltip: {
		  pointFormat: '{point.y}' + UNIT_SPEED
		}
	  }]
	});
}*/

function createSpeedometer(speed){
	var opts = {
	  angle: 0.23, // The span of the gauge arc
	  lineWidth: 0.1, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.49, // // Relative to gauge radius
		strokeWidth: 0.042, // The thickness
		color: '#2B82D4', // Fill color,
		augeArea:{
            margin:0
		}
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#2B82D4',   // Colors
	  colorStop: '#2B82D4',    // just experiment with them
	  strokeColor: '#C4C4C4',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	};
	var target = document.getElementById('sta_speedometer'); // your canvas element
	var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
	gauge.maxValue = 250; // set max gauge value
	gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge.animationSpeed = 32; // set animation speed (32 is default value)
	gauge.set(speed); // set actual value
}

function createTiresensorBar(indexs, tires, temps, bats){
	var chart = Highcharts.chart('sta_tiresensor', {
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
			text: '',
			style: {
				display: 'none'
			}
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
					color: '#5D8AA8'
				}
			},
			labels: {
				format: '{value} ' + UNIT_TPMS,
				style: {
					color: '#5D8AA8'
				}
			}	
		},{ 
			labels: {
				format: '{value}' + UNIT_TEMP,
				style: {
					color: '#FA8523'
				}
			},
			title: {
				text: JS_TEMP,
				style: {
					color: '#FA8523'
				}
			},
			opposite: true
		}/*, { 
			gridLineWidth: 0,
			max: 100,
			title: {
				text: JS_BAT,
				style: {
					color: '#238E41'
				}
			},
			labels: {
				format: '{value} %',
				style: {
					color: '#238E41'
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
			type: 'spline',//'column',		
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





/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var map, ext, once = [], current_id = 0, timer, remain=20, needloc = false,  zones = [], usermarkers = [], geoList = null, historymode = false, historyid = 0, historyMarkerLast = null, zones = [], usermarkers = [], objLastMiEg = [],
geoList = null, needLoadCommand = true, needUpdatePlace = false, firstpagechange = false ,nologin = false, blockMoroccoBorders = false, lastAlarmId = 0, requestTimeout = 60000, 
isRequestTimeout = false, needShowAllAsset = 0, UNIT_SPEED, UNIT_DIST, UNIT_FUEL, UNIT_TEMP, UNIT_ALTITUDE, UNIT_HUMIDITY, UNIT_TPMS, ANIMATION_TIME = 2000, isShowMyLocation = false, myLocation = { lng: 0,lat: 0, needCenter: false },
selectAssetInfos;
var OffsetH = 51+25+11;/*header + footer + padding*/
var OffsetW = 18;/*pading(top bottom)*/
var typeCmd, protocolCmd;
var page_last = "page_map";
/*jquery loaded*/
$(document).ready(function() {
		
    /**兼容ios拖滚整个页面*/
	var mobileAgent = new Array("iphone", "ipod", "ipad");
	var browser = navigator.userAgent.toLowerCase(); 
	
	for (var i=0; i< mobileAgent.length; i++) {
		if (browser.indexOf(mobileAgent[i])!=-1) { 			
			var elements = ['page_objects','page_dashboard','dashboard-table-div','object_list','tablist','object_detail','page_events','event-table-div',
							'settings','settings-items','cmdul','page_cmd_details','page_history_setting','details_panel', 'tab_movesdetail'];
			for(var i = 0; i < elements.length; i++){
				document.getElementById(elements[i]).addEventListener('touchstart', function(event){
					this.allowUp = (this.scrollTop > 0);
					this.allowDown = (this.scrollTop < this.scrollHeight - this.clientHeight);
					this.prevTop = null; this.prevBot = null;
					this.lastY = event.pageY;
				});

				document.getElementById(elements[i]).addEventListener('touchmove', function(event){
					var up = (event.pageY > this.lastY), down = !up;
					this.lastY = event.pageY;

					if ((up && this.allowUp) || (down && this.allowDown)) event.stopPropagation();
					else event.preventDefault();
				});
			}						
			
			break; 
		} 
	} 	
	
    $("#tab_online").toggle();
    $("#tab_offline").toggle();
	$("#tab_expired").toggle();
    $("#loadmapwait").css("display", "block");
	
	remain = JS_GLOBAL_MIM_UPDATE;	
	needShowAllAsset = JS_DEFAULT_SHOW;
		
	initUnits();
	onLoadGoogle();

	/*loading device list*/
	getDeviceListData(0);
	
	Highcharts.setOptions({
		lang:{
		   contextButtonTitle: JS_CONTEXTBUTTONTITLE,
		   decimalPoint: JS_DECIMALPOINT,
		   downloadJPEG: JS_DOWNLOADJPEG,
		   downloadPDF: JS_DOWNLOADPDF,
		   downloadPNG: JS_DOWNLOADPNG,
		   downloadSVG: JS_DOWNLOADSVG,
		   loading: JS_LOADING,
		   months: [JS_MONTHS1,JS_MONTHS2,JS_MONTHS3,JS_MONTHS4,JS_MONTHS5,JS_MONTHS6,JS_MONTHS7,JS_MONTHS8,JS_MONTHS9,JS_MONTHS10,JS_MONTHS11,JS_MONTHS12],
		   noData: JS_NODATA,
		   printChart: JS_PRINTCHART,
		   resetZoom: JS_RESETZOOM,
		   resetZoomTitle: JS_RESETZOOMTITLE,
		   shortMonths: [JS_SHORTMONTHS1,JS_SHORTMONTHS2,JS_SHORTMONTHS3,JS_SHORTMONTHS4,JS_SHORTMONTHS5,JS_SHORTMONTHS6,JS_SHORTMONTHS7,JS_SHORTMONTHS8,JS_SHORTMONTHS9,JS_SHORTMONTHS10,JS_SHORTMONTHS11,JS_SHORTMONTHS12],
		   thousandsSep: JS_THOUSANDSSEP,
		   weekdays: [JS_WEEKDAYS1,JS_WEEKDAYS2,JS_WEEKDAYS3,JS_WEEKDAYS4,JS_WEEKDAYS5,JS_WEEKDAYS6,JS_WEEKDAYS7]
		},
		tooltip: {
			dateTimeLabelFormats: {
				year:"%Y",
				second:"%Y-%m-%d %H:%M:%S",
			}
		},
		xAxis: {
			dateTimeLabelFormats: {
				year: '%Y',
				month: '%Y-%m',
				dat: '%Y-%m-%d',
			}
		} 
	});
	
	initAssetInfos();
		
	$("#shareexpired").datetimepicker({
		dateFormat: "yy-mm-dd",
		timeFormat: "HH:mm:ss",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});
	
	$("#shareexpired").unbind("click").click(function(){
		$("#shareexpired").focus();
	});	  

	$.cookie("pull_active", JS_PUSH_NOTIFICATION, { expires: 30 });
	$.cookie("pull_interval", JS_PUSH_INTERVAL, { expires: 30 });
	var u = navigator.userAgent;
	if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) { //判断Android
	    //$("#push_setting").css("display", "block");
	}else{
		$("#push_setting").css("display", "none");
	}		
});

function shareToApps(desc, keyid) {
	try {
		if (navigator.share) {
			window.navigator.share({
			   title: document.title,
			   text: desc
			});
		} else {
			if // if we're on iOS, open in Apple Maps 
				((navigator.platform.indexOf("iPhone") != -1) || 
				 (navigator.platform.indexOf("iPad") != -1) || 
				 (navigator.platform.indexOf("iPod") != -1))
				 window.webkit.messageHandlers.shareMsg.postMessage(desc)
			 else // else use Google 
				window.AndroidShareHandler.share(desc);
		}		
	} catch (err) {
		alert(err.message)
	}
}

function initUnits(){
	UNIT_SPEED = "kph";
	if(JS_UNIT_SPEED == 1){
		UNIT_SPEED = "mph";
	}
	
	UNIT_DIST = "km";
	if(JS_UNIT_DISTANCE == 1){
		UNIT_DIST = "mi";
	}else if(JS_UNIT_DISTANCE == 2){
		UNIT_DIST = "nmi";
	}
	
	UNIT_FUEL = "L";
	if(JS_UNIT_FUEL == 1){
		UNIT_FUEL = "gal";
	}
	
	UNIT_TEMP = "℃";
	if(JS_UNIT_TEMPERATURE == 1){
		UNIT_TEMP = "℉";
	}
	
	UNIT_ALTITUDE = "m";
	if(JS_UNIT_ALTITUDE == 1){
		UNIT_ALTITUDE = "ft";
	}
	
	UNIT_HUMIDITY = "%rh";
	if(JS_UNIT_HUMIDITY == 1){
		//
	}
	
	UNIT_TPMS = "bar";
	if(JS_UNIT_TPMS == 1){
		UNIT_TPMS = "kpa";
	}else if(JS_UNIT_TPMS == 2){
		UNIT_TPMS = "psi";
	}else if(JS_UNIT_TPMS == 3){
		UNIT_TPMS = "kg/cm2";
	}
}

function getIcons(){
	var icons = [];
	
	for(var i = 1; i <= JS_OBJECT_KIND; i++){
		icons.push({'iconFilePath':'../img/icons/icon_'+ i +'.svg', 'iconValue':i});
	}
	return icons;
}

function getDeviceListData(start){
	 $.get("../devlist.ajax.php", {"start": start,"userName": $("#user a").text()}, function(data){
        if($.trim(data) != ""){
            var result = eval('(' + data + ')');
           
			if(result != null && typeof result != "undefined"){
                refresh_list(result);
                updateDevice(result.data, current_id, map, result.first);
            }
           
            if(result.start > -1){
				//continue
            	getDeviceListData(result.start);
            }else{
				//finish
				cancelDefShowAll();
            	$("#selone").bind("click", search_select);
				
                $("#device").keyup(function(event) {
                    if (event.keyCode == '13') {
                        search_select();
                        event.preventDefault();
                    }
                });
				
				//loadScript("http://ditu.google.cn/maps/api/js?key="+JS_GOOGLE_KEY+"&v=3.21&sensor=false&language="+JS_CURRENT_LANG+"&libraries=drawing,geometry&callback=onLoadGoogle");
				
				try{ 
					if(JS_DEFAULT_FIT == 1){
						map.MarkersFitBounds();
					}
				}catch(e){}			
				
				$("#loadmapwait").css("display", "none");
				timer = setTimeout("relocate()", 1000);
				
				var deviceList = getDeviceList();
				$("#oflag").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true});
				$("#cflag").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,select: function(event, ui){
					showSendCmd(ui.item.value);
				}});
				
				//load command info
				$.get("../commandinfo.ajax.php", function(data){
					if($.trim(data) != ""){
						var result = eval('(' + data + ')');
					   
						if(result != null && typeof result != "undefined"){
							typeCmd = result.tcmd;
							protocolCmd = result.pparam;
						}
					}
				});	
				
				if(JS_DEFAULT_PAGE == 3){
					showObjChart();
				}
			}			
        }else{
        	//none data
			//onLoadMap();
			//loadScript("http://ditu.google.cn/maps/api/js?key="+JS_GOOGLE_KEY+"&v=3.21&sensor=false&language="+JS_CURRENT_LANG+"&libraries=drawing,geometry&callback=onLoadGoogle");
        }
	 });
}

function refresh_list(json){
    var nomap = typeof map == "undefined";
    if(!nomap && json.first){
        map.ClearMarkers();
    }
    if(json.first){		
		clearArray(JS_DEVICE_ID4FLAG);
        clearArray(JS_DEVICE_FLAG4ID);
        clearArray(JS_DEVICE_STATUS); 
		clearArray(JS_DEVICE_TYPE4ID);
		clearArray(JS_DEVICE_SIM4ID);
		clearArray(JS_DEVICE_NO4ID);
		clearArray(JSDEVICE_DRIVER4ID);
		clearArray(JS_DEVICE_ID4GROUPID);
		clearArray(JS_GROUP);
    }
	
	if(typeof json.data != "undefined" && json.data != null){
		for(var i=0; i<json.data.length; i++){
			for(var j=0; j<json.data[i].item.length;j++){
				var jo = json.data[i].item[j];			
				JS_DEVICE_ID4FLAG[jo.c] = jo.n;
				JS_DEVICE_FLAG4ID[jo.n] = jo.c;
				JS_DEVICE_STATUS[jo.n] = jo.e;
				JS_DEVICE_TYPE4ID[jo.n] = jo.dt;
				JS_DEVICE_SIM4ID[jo.n] = jo.si;
				JS_DEVICE_NO4ID[jo.n] = jo.nc;
				JS_DEVICE_ID4GROUPID[jo.n] = json.data[i].gid;
				
				if(jo.dn != null && jo.dn.length > 0){
					JSDEVICE_DRIVER4ID[jo.n] = jo.dn;
				}
				
				if(nomap){				
					var p = getSpeedState(jo.on, jo.v, jo.s, jo.t, jo.a, jo.ar, jo.io);
					var desc = { n: jo.n, c: jo.c, v: jo.v, x: jo.x, y: jo.y,
						t: $.format.date(jo.t, JS_DEFAULT_DATETIME_fmt_JS),ts: $.format.date(jo.ts, JS_DEFAULT_DATETIME_fmt_JS), i: jo.i, d: jo.d, a: jo.a, sta: p.sta, spd: p.spd, st: jo.st, io: jo.io, dt: jo.dt, s: p.val, jb: jo.jb, dn: jo.dn};
					once.push(desc);
				}
			}
		}	
	}
	
	//delete object	
	if(typeof json.deleteo != "undefined" && json.deleteo != null){
		
		for(var i=0; i<json.deleteo.length; i++){
			var n = json.deleteo[i];
			var gid = JS_DEVICE_ID4GROUPID[n];
			deleteObject(gid,n);
		}
	}
	
	
	//delete group
	if(typeof json.deleteg != "undefined" && json.deleteg != null){
		for(var i=0; i<json.deleteg.length; i++){
			var gid = json.deleteg[i];
			deleteGroup(gid);
		}
	}
    
    if(json.start != null && json.start == -1){
		var deviceList = getDeviceList();
        $("#device").autocomplete({
			source: deviceList,
			minLength: deviceList.length < 2000 ? 0 : 2,
			max:10,
            scroll:true
		}).focus(function(){            
			 $(this).autocomplete('search', $(this).val())
        });
    }
}
function menuselect(cmd, keyid, typeid, y , x, t){
    var flag = getFlagById(keyid);

    switch(cmd){
        case 1: 
			showPage("page_objects");
			dlgDeviceInfo(keyid); 			
			break;
			
        case 2: 
			showPage("page_cmd");
			$("#cflag").val(flag); 
			showSendCmd($("#cflag").val());
			break;
			
        case 3: 
			showPage('page_events');
			break;
			
		case 4: 
			showLastPhoto(keyid); 
			break;
			
		case 5:
			showLastVoice(keyid); 
			break;
			
		case 6: 
			var $label = $("<label></label>");
			map.GeoNames(x, y, $label, "text", 0, false);		
			var desc = OBJECT_INFO_FLAG +": "+ flag + "\n";		
			desc += JS_GPS_TIME +": "+ t + "\n";
			desc += JS_ADDRESS +": "+ $label.text() + "\n";
			desc += JS_POSITION +": " + JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q=" + (y / 1000000.0).toFixed(5) + "," + (x/ 1000000.0).toFixed(5);
			shareToApps(desc, keyid);
			//showSharePosition(keyid);
			break;
			
		case 7: 
			$("#oflag").val(flag);
			showPage("page_history");			
			break;
    }
}
function map_locate(keyid, center, geoname, track, zoomIn){
    try{
        var flag = getFlagById(keyid);
        var $dev_flag = $("#geo #dev_flag");
        if($dev_flag.text() != flag){
            $dev_flag.text(flag);
        }
        if(keyid > 0){
			if(typeof map != "undefined"){				
				var marker = map.LocateMarker(keyid, center, zoomIn, true);				
				if(typeof track != "undefined" && track){
					map.AddTrackPoint(keyid, marker.properties.x, marker.properties.y, marker.properties.s, marker.properties.t, marker.properties.dir, null, ANIMATION_TIME);
				}					

				if($('#maptools #ed_street_view').hasClass("tool_active")){
					$('#maptools #ed_street_view').attr("x",marker.properties.x).attr("y",marker.properties.y).attr("dir",marker.properties.dir);
					$('#streetview_img').html('<img src=https://maps.googleapis.com/maps/api/streetview?key='+JS_GOOGLE_KEY+'&size=150x83&sensor=false&location='+marker.properties.y / 1000000+','+marker.properties.x / 1000000+'&fov=90&heading='+marker.properties.dir+'&pitch=10>');						
					//following link do not have heading
					//http://cbk0.google.com/cbk?output=thumbnail&w=380&h=170&p=60&ll=45.47264,-73.65495					
				}else{
					$('#maptools #ed_street_view').removeAttr("x").removeAttr("y").removeAttr("dir");
				}
				
				map.MoveTop(marker);				
			}			
        }
    }catch(e){}
}

function findpageitem(tab, flag){
    var ret = false;
	var $item = $(tab+" .tree_table").find("tbody tr td:nth-child(3):contains('"+flag+"')");
    if($item.length > 0){
        var $tr = $item.eq(0).parent();/*first row*/
        if($lastselect){
            $lastselect.removeClass("active");
			$lastselect.next().removeClass("active");
        }
        $tr.addClass("active");
		$tr.next().addClass("active");
        $lastselect = $tr;
        /*test group is close,then opened*/
        var $th = $tr.parent().find("tr th:eq(2)");
        if($th.hasClass("close")){
            $th.removeClass("close").addClass("open");
			
			//update css
			var tid = $th.parent().parent().parent().attr("id");
			var $trs = $th.parent().parent().find("tr:gt(0):not(.end_state)");
			
			$.each($trs, function(idx, value){	
				var n = parseInt($(value).attr("n"));
				var tvkey = tid + "_" + n;
				updateOne(GroupItem[tvkey]);
			});
			
            $tr.parent().find("tr:gt(0)").toggle();
        }
        var keyid = parseInt($tr.attr("n"));
		current_id = keyid;
        if($tr.position().top != 0){
            $(tab).parent().scrollTop(0);
            $(tab).parent().scrollTop($tr.position().top);
        }
        ret = true;
    }
    return ret
}
function findpageitems(keyid){
	var items = [];
	var tab = $("#mod .tab_active").attr("target");

	if(tab == "#tab_all"){
		var item = $("#tab_online"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		item = $("#tab_offline"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		item = $("#tab_expired"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		
	}else if(tab == "#tab_online"){
		var item = $("#tab_all"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		item = $("#tab_offline"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		item = $("#tab_expired"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		
	}else if(tab == "#tab_offline"){
		var item = $("#tab_all"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		item = $("#tab_online"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		item = $("#tab_expired"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		
	}else if(tab == "#tab_expired"){
		var item = $("#tab_all"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		item = $("#tab_online"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
		item = $("#tab_offline"+" .tree_table").find("tbody tr[n="+keyid+"]");
		if(item.length > 0){
			items.push(item);
		}
	}
	return items;
}
function search_select(){
	releaseTrack();
    var flag = $("#sch #device").val();
    if(flag != ""){
        var tab = $("#object_list .tab_active").attr("target");
        if(!findpageitem(tab, flag) && tab != "#tab_all"){
            pagechanged("#tab_all");
            findpageitem("#tab_all", flag);
        }
    }
}
function relocate(){
	if(!nologin){
		remain--;
		if(remain < 0){
			remain = JS_GLOBAL_MIM_UPDATE;
			var objid = getShowObjs();
			if(objid.length >= 0){							
				$.post("../devstat.ajax.php?t=" + new Date().getTime(), {"objid": objid,"test":1}, function(data){
					if(data != ""){
						try{
							if(data == "nologin"){
								 if(timer){
									clearTimeout(timer);
									timer = null;
									nologin = true;
									window.location.href="../mobile/mlogin.php"; 
								}
							}else{
								needloc = false;
								var result = eval('(' + data + ')');
								refresh_list(result);
								updateDevice(result.data, current_id, map, result.first);
								json = null;
							}				
						}catch(e){}
						data = null;
					}
				});
			}
			
			if(needUpdatePlace){
				loadPlace();
			}
			
			if(needLoadCommand){
				loadUserCommand();
			}
			
			getLocation(false);
		}
		var $timeout = $("#geo #timeout");
		$timeout.text(remain).attr("title", JS_LOCATE_TIP.replace("%d", remain));
		$timeout = null;
		timer = null;
		timer = setTimeout("relocate()", 1000);
	}    
}
function onfree(){
    JS_DEVICE_ID4FLAG = null;
    JS_DEVICE_FLAG4ID = null;
    JS_DEVICE_STATUS = null;
	JS_DEVICE_TYPE4ID = null;
    if(typeof map != "undefined"){
        try{ map.Free(); map = null; }catch(e){}
    }
}
function oninit() {
    /**/
	pagechanged('#tab_speedchart');
}

function onLoadGoogle(){
	if(JS_GOOGLE_TYPE == 1){
		 loadScript("https://maps.googleapis.com/maps/api/js?key="+JS_GOOGLE_KEY, onLoadGoogleMutant());
	 }else{
		 onLoadGoogleMutant();
	 }
}

function onLoadGoogleMutant(){
	loadScript("mmap/leaflet/Leaflet.GoogleMutant.js",onLoadMap);
}

function onLoadMap(){
    /*loading map*/
    var opts = {
        centerLng: JS_DEFAULT_LNG,
        centerLat: JS_DEFAULT_LAT,
        zoom: JS_DEFAULT_ZOOM
    };	
    map = new MapOperat("map", opts, false, true, false); 	
	ext = new MapExtend(map.GetMap(), false, false);
	
	loadPlace();
	loadUserCommand();
	
	//Block Morocco borders
	if(JS_GOOGLE_TYPE == 0 && blockMoroccoBorders){
		var route = [];
		var points = "27.667269,-13.173926;27.667269,-8.667617".split(";");
		
		for(var i = 0; i < points.length; i++){
			var point = [points[i].split(',')[0],points[i].split(',')[1]];
			route.push(point);
		}
		ext.BuildPolyline(route, false, "#F3F1ED", 20, false, "", 15);
		
		points = "24.226929,-16.260254;25.145285,-10.128906".split(";");
		ext.BuildRectangle(parseFloat(points[0].split(",")[0]),
						   parseFloat(points[0].split(",")[1]),
						   parseFloat(points[1].split(",")[0]),
						   parseFloat(points[1].split(",")[1]),
						   false, "#F3F1ED", 20, false, "", 8, 1);
	}
	
	map.Zoom(JS_DEFAULT_ZOOM);
	/*map tools*/
	$("#maptools #ed_asset").attr('title',JS_ENABLE_DISABLE_ASSET);
	$("#maptools #ed_fit").attr('title',JS_FIT_ASSETS);
	if(JS_DEFAULT_SHOW == 1){
		$("#maptools #ed_asset").css({opacity: 1.0}).addClass("tool_active");		
	}
	$("#maptools #ed_label").attr('title',JS_ENABLE_DISABLE_LABEL);
	$("#maptools #ed_marker").attr('title',JS_ENABLE_DISABLE_MARKER);
	if(JS_DEFAULT_MARKER == 1){
		$("#maptools #ed_marker").css({opacity: 1.0}).addClass("tool_active");
	}
	$("#maptools #ed_zone").attr('title',JS_ENABLE_DISABLE_ZONES);
	if(JS_DEFAULT_ZONE == 1){
		$("#maptools #ed_zone").css({opacity: 1.0}).addClass("tool_active");
	}
	
	$("#maptools #ed_clusters").attr('title',JS_ENABLE_DISABLE_CLUSTERS);
	$("#maptools #ed_street_view").attr('title',JS_ENABLE_DISABLE_STREETVIEW);
	$("#maptools #ed_task").attr('title',JS_DISABLE_TASK);
	$("#maptools #ed_driver").attr('title',JS_ENABLE_DISABLE_DRIVER);
	$("#maptools_ext #ed_arrow").attr('title',JS_ENABLE_DISABLE_ARROWS);
	$("#maptools_ext #ed_point").attr('title',JS_ENABLE_DISABLE_POINTS);
	$("#maptools_ext #ed_stop").attr('title',JS_ENABLE_DISABLE_STOPS);
	$("#maptools_ext #ed_event").attr('title',JS_ENABLE_DISABLE_EVENTS);
	$("#maptools_ext #ed_snap").attr('title',JS_ENABLE_DISABLE_SNAP);
	$("#maptools_ext #ed_route").attr('title',JS_ENABLE_DISABLE_ROUTE);	
	$("#maptools_ext").css("display", "none");
	
	$("#maptools #ed_asset").parent().unbind("click").click(function() {
		if(($("#maptools #ed_asset").hasClass("tool_active"))){
			$("#maptools #ed_asset").removeClass("tool_active");
			$("#maptools #ed_asset").css({opacity:0.5});
			showAllObj(false);
			cancelDefShowAll();
		}else{
			$("#maptools #ed_asset").addClass("tool_active");			
			$("#maptools #ed_asset").css({opacity:1.0});
			showAllObj(true);
		}
	});
	
	$("#maptools #ed_fit").parent().unbind("click").click(function() {
		map.MarkersFitBounds();
	});
	
	$("#maptools #ed_label").parent().unbind("click").click(function() {
		if(($("#maptools #ed_label").hasClass("tool_active"))){
			$("#maptools #ed_label").removeClass("tool_active");
			$("#maptools #ed_label").css({opacity:0.5});
			map.ToggleMarkerTooltip(false);
		}else{						
			$("#maptools #ed_label").addClass("tool_active");
			$("#maptools #ed_label").css({opacity:1.0});
			map.ToggleMarkerTooltip(true);
		}
	});
	
	$("#maptools #ed_marker").parent().unbind("click").click(function() {
		if(($("#maptools #ed_marker").hasClass("tool_active"))){
			$("#maptools #ed_marker").removeClass("tool_active");
			$("#maptools #ed_marker").css({opacity:0.5});
			ext.ClearUserMarker(usermarkers);
		}else{
			$("#maptools #ed_marker").addClass("tool_active");			
			$("#maptools #ed_marker").css({opacity:1.0});
			drawUserMarker();
		}
	});
	
	$("#maptools #ed_zone").parent().unbind("click").click(function() {
		if(($("#maptools #ed_zone").hasClass("tool_active"))){
			$("#maptools #ed_zone").removeClass("tool_active");
			$("#maptools #ed_zone").css({opacity:0.5});
			ext.ClearZone(zones);
		}else{
			$("#maptools #ed_zone").addClass("tool_active");			
			$("#maptools #ed_zone").css({opacity:1.0}); 
			drawZone();
		}
	});
	
	$("#maptools #ed_clusters").parent().unbind("click").click(function() {
		if(($("#maptools #ed_clusters").hasClass("tool_active"))){
			$("#maptools #ed_clusters").removeClass("tool_active");
			$("#maptools #ed_clusters").css({opacity:0.5});
			map.ClustersMarker(false);
		}else{
			$("#maptools #ed_clusters").addClass("tool_active");			
			$("#maptools #ed_clusters").css({opacity:1.0}); 
			map.ClustersMarker(true);
		}
	});
	
	$("#maptools #ed_street_view").parent().unbind("click").click(function() {
		if(($("#maptools #ed_street_view").hasClass("tool_active"))){
			$("#maptools #ed_street_view").removeClass("tool_active");
			$("#maptools #ed_street_view").css({opacity:0.5});
			$("#streetview_img").css("display", "none");
			$('#maptools #ed_street_view').removeAttr("x").removeAttr("y").removeAttr("dir");
		}else{						
			$("#maptools #ed_street_view").addClass("tool_active");
			$("#maptools #ed_street_view").css({opacity:1.0});			
			$("#streetview_img").css({"display":"-webkit-box", "-webkit-box-align":"center", "-webkit-box-pack":"center"});
			if(current_id > 0){
				map_locate(current_id, true, false, false, false);
			}
		}
	});
	
	$("#maptools #ed_driver").parent().unbind("click").click(function() {
		if(($("#maptools #ed_driver").hasClass("tool_active"))){
			$("#maptools #ed_driver").removeClass("tool_active");
			$("#maptools #ed_driver").css({opacity:0.5});
			map.ToggleDriver(false);	
		}else{						
			$("#maptools #ed_driver").addClass("tool_active");
			$("#maptools #ed_driver").css({opacity:1.0});			
			map.ToggleDriver(true);			
		}
	});
	
	$("#maptools #ed_task").parent().unbind("click").click(function() {
		if(($("#maptools #ed_task").hasClass("tool_active"))){			
			disableCurrentTask();								
		}
	});
	
	$("#maptools_ext #ed_arrow").parent().unbind("click").click(function() {
		if(($("#maptools_ext #ed_arrow").hasClass("tool_active"))){
			$("#maptools_ext #ed_arrow").removeClass("tool_active");
			$("#maptools_ext #ed_arrow").css({opacity:0.5});
			map.ToggleAngleLayer(false);
		}else{
			$("#maptools_ext #ed_arrow").addClass("tool_active");			
			$("#maptools_ext #ed_arrow").css({opacity:1.0});
			map.ToggleAngleLayer(true);	
		}
	});
	
	$("#maptools_ext #ed_point").parent().unbind("click").click(function() {
		if(($("#maptools_ext #ed_point").hasClass("tool_active"))){
			$("#maptools_ext #ed_point").removeClass("tool_active");
			$("#maptools_ext #ed_point").css({opacity:0.5});
			map.ToggleTimesLayer(false);
		}else{
			$("#maptools_ext #ed_point").addClass("tool_active");			
			$("#maptools_ext #ed_point").css({opacity:1.0});
			map.ToggleTimesLayer(true);		
		}
	});
	
	$("#maptools_ext #ed_stop").parent().unbind("click").click(function() {
		if(($("#maptools_ext #ed_stop").hasClass("tool_active"))){
			$("#maptools_ext #ed_stop").removeClass("tool_active");
			$("#maptools_ext #ed_stop").css({opacity:0.5});
			map.ToggleStopLayer(false);
		}else{
			$("#maptools_ext #ed_stop").addClass("tool_active");			
			$("#maptools_ext #ed_stop").css({opacity:1.0});
			map.ToggleStopLayer(true);		
		}
	});
	
	$("#maptools_ext #ed_event").parent().unbind("click").click(function() {
		if(($("#maptools_ext #ed_event").hasClass("tool_active"))){
			$("#maptools_ext #ed_event").removeClass("tool_active");
			$("#maptools_ext #ed_event").css({opacity:0.5});
			map.ToggleEventLayer(false);
		}else{
			$("#maptools_ext #ed_event").addClass("tool_active");			
			$("#maptools_ext #ed_event").css({opacity:1.0});
			map.ToggleEventLayer(true);		
		}
	});
	
	$("#maptools_ext #ed_route").parent().unbind("click").click(function() {
		if(($("#maptools_ext #ed_route").hasClass("tool_active"))){
			$("#maptools_ext #ed_route").removeClass("tool_active");
			$("#maptools_ext #ed_route").css({opacity:0.5});
			map.ShowHideTrackLine(historyid, false);
		}else{
			$("#maptools_ext #ed_route").addClass("tool_active");			
			$("#maptools_ext #ed_route").css({opacity:1.0});
			map.ShowHideTrackLine(historyid, true);		
		}
	});
	
	$("#maptools_ext #ed_snap").parent().unbind("click").click(function() {
		if(($("#maptools_ext #ed_snap").hasClass("tool_active"))){
			$("#maptools_ext #ed_snap").removeClass("tool_active");
			$("#maptools_ext #ed_snap").css({opacity:0.5});
			map.ToggleSnapLayer(false);
		}else{
			$("#maptools_ext #ed_snap").addClass("tool_active");			
			$("#maptools_ext #ed_snap").css({opacity:1.0});	
			map.ToggleSnapLayer(true);	
		}
	});
	
	$("#mylocation").unbind("click").click(function() {
		if(($("#mylocation").hasClass("tool_active"))){
			$("#mylocation").removeClass("tool_active");
			$("#mylocation").css({opacity:0.5});
			hideMyLocation();
			isShowMyLocation = false;
		}else{	
			$("#mylocation").addClass("tool_active");			
			$("#mylocation").css({opacity:1.0});	
			isShowMyLocation = true;
			getLocation(true);				
		}
	});
	
	$("#object-back").unbind("click").click(function() {
		showPage('page_menu');
	});
	$("#object-release").unbind("click").click(function(){
		releaseTrack();
	});
	$("#page_history #history-back").unbind("click").click(function() {
		showPage('page_menu');
	});
	$("#page_cmd #cmd-back").unbind("click").click(function() {
		showPage('page_menu');
	});
	$("#dashboard-back").unbind("click").click(function() {
		showPage('page_menu');
	});
	$("#event-back").unbind("click").click(function() {
		showPage('page_menu');
	});
	$("#page_setting #setting-back").unbind("click").click(function() {
		showPage('page_menu');
	});

	$("#cflag").bind("input propertychange", function() {
		showSendCmd($("#cflag").val());
	}); 
	
	$("#day").change(function(){		
        if(parseInt($(this).val()) < 0){
            $("#starttime, #endtime").show();
        }else{
            $("#starttime, #endtime").hide();
        }
    });
	var format = "YYYY-MM-DD HH:mm:ss";
	initPicker('.history_date_from', JS_HIS_TIME_START, format);
	initPicker('.history_date_to', JS_HIS_TIME_END, format);

	$("#history_date_from").click(function() {
		initPicker('.history_date_from', JS_HIS_TIME_START, format);
	});
	
	$("#history_date_to").click(function() {
		initPicker('.history_date_to', JS_HIS_TIME_END, format);
	});
	
	$("#queryhis").bind("click", doSearch); 
	
	$("#hide").click(function() {
		showHistoryNavbar(false);
		map.ResizeMapContainer();
	});
	$("#setting-btn").bind("click", doUpdateSet);
	$("#object-detail-back").click(function() {
		$("#object_detail").css("display","none");
		$("#object_list").css("display","block");
	});
	
	$("#route").click(function() {
		if(($("#route i").hasClass("icon-navbar-route"))){
			$("#route span").text(JS_MAP);
			$("#route i").removeClass("icon-navbar-route").addClass("icon-navbar-map");
			$("#map").css("display","none");
			$("#details_panel").css("display","block");			
		}else{
			$("#route span").text(JS_ROUTE);
			$("#route i").removeClass("icon-navbar-map").addClass("icon-navbar-route");
			$("#map").css("display","block");
			$("#details_panel").css("display","none");			
		}
		map.ResizeMapContainer();
	});
	
	$("#streetview_img").unbind("click").click(function() {
		var x = $('#maptools #ed_street_view').attr("x");
		var y = $('#maptools #ed_street_view').attr("y");
		var dir = $('#maptools #ed_street_view').attr("dir");
		openStreetView(x, y, dir);
	});
	
	switch (JS_DEFAULT_PAGE)
	{
		case 0:
			showPage("page_menu");
			break;
			
		case 1:
			showPage("page_objects");
			break;
			
		case 2:
			showPage("page_map");
			break;
			
		case 3:
			showPage("page_dashboard");
			break;
	}	
	
	getLocation(false);
}

function openStreetView(x, y, dir){
	window.open(JS_GOOGLE_MAP_BASE_LINK+"/maps?q&layer=c&hl="+JS_CURRENT_LANG+"&cbll="+y / 1000000+","+x / 1000000+"&cbp=11,"+dir+",0,0,0", "_blank");
	//window.open(JS_GOOGLE_MAP_BASE_LINK+"/cbk?output=thumbnail&w=90&h=68&ll=51.494966,-0.146674", "_blank"); 
}

function initPicker(element, title, format){
	var text = {
		title: title,
		cancel: JS_BUTTON_CANCEL,
		confirm: JS_BUTTON_OK
	}
	new Picker(document.querySelector(element), {
	   format: format,
	   text: text
	});
}

function showView(objs, show){
    var $view = $(objs);
    if(show){
        $view.css("visibility","visible");
		$view.css("z-index","1");
		$view.css("display","block");
    } else {
        $view.css("visibility","hidden");
		$view.css("z-index","-1");
		$view.css("display","none");
    }
}

function showPage(page){
	 switch(page){
        case "page_menu":			
			$("#page_menu").css("display", "block");
			showView("#page_map, #page_objects, #page_dashboard, #page_history, #page_cmd, #page_events, #page_setting, #maptools, #maptools_ext", false);
			showView("#page_menu", true);
			break;
		
		case "page_map":
			$("#page_map, #maptools").css("display", "block");
			showView("#page_menu, #page_objects, #page_dashboard, #page_history, #page_cmd, #page_events, #page_setting", false);
			showView("#page_map, #maptools", true);
			if(historymode){
				$("#maptools_ext").css("display", "block");
				showView("#maptools_ext", true);
			}
			map.ResizeMapContainer();
			page_last = page;
			break;
			
		case "page_objects":			
			$("#page_objects").css("display", "block");
			showView("#page_menu, #page_map, #page_dashboard, #page_history, #page_cmd, #page_events, #page_setting, #maptools, #maptools_ext", false);
			showView("#page_objects", true);
			page_last = page;
			if(!firstpagechange){
				pagechanged("#tab_all");
				firstpagechange = true;
			}
			break;
			
		case "page_dashboard":
			$("#page_dashboard").css("display", "block");
			showView("#page_menu, #page_map, #page_objects,#page_history, #page_cmd, #page_events, #page_setting, #maptools, #maptools_ext", false);
			showView("#page_dashboard", true);
			page_last = page;
			showObjChart();
			break;
			
		case "page_history":
			$("#page_history").css("display", "block");
			showView("#page_menu, #page_map, #page_objects, #page_dashboard, #page_cmd, #page_events, #page_setting, #maptools, #maptools_ext", false);
			showView("#page_history", true);
			page_last = page;
			break;	
			
		case "page_cmd":
			$("#page_cmd").css("display", "block");
			showView("#page_menu, #page_map, #page_objects, #page_dashboard, #page_history, #page_events, #page_setting, #maptools, #maptools_ext", false);
			showView("#page_cmd", true);
			page_last = page;
			break;	
			
		case "page_events":
			$("#page_events").css("display", "block");
			showView("#page_menu, #page_map, #page_objects, #page_dashboard, #page_history, #page_cmd, #page_setting, #maptools, #maptools_ext", false);
			showView("#page_events", true);
			page_last = page;
			loadEventInfo();
			break;	
			
		case "page_setting":
			$("#page_setting").css("display", "block");
			showView("#page_menu, #page_map, #page_objects, #page_dashboard, #page_history, #page_cmd, #page_events, #maptools, #maptools_ext", false);
			showView("#page_setting", true);
			page_last = page;
			$("#idZoom").val(JS_DEFAULT_ZOOM);
			$("#show_all_object").prop("checked", JS_DEFAULT_SHOW == 1);
			$("#show_marker").prop("checked", JS_DEFAULT_MARKER == 1);
			$("#object_fit_bounds").prop("checked", JS_DEFAULT_FIT == 1);
			$("#collapsed_asset_group").prop("checked", JS_DEFAULT_COLLAPSED == 1);
			$("#show_zone").prop("checked", JS_DEFAULT_ZONE == 1);
			$("#def_page option[value="+JS_DEFAULT_PAGE+"]").prop("selected", true);
			$("#idZoom").find("option[value='"+JS_DEFAULT_ZOOM+"']").prop("selected",true);
			$("#pushNoti").prop("checked", JS_PUSH_NOTIFICATION == 1);
			
			$("#sond_alarm").prop("checked", JS_DEFAULT_SOUND_ALARM == 1);
			$("#popup_alarm").prop("checked", JS_DEFAULT_POPUP_ALARM == 1);
			$("#unit_speed option[value="+JS_UNIT_SPEED+"]").prop("selected", true);
			$("#unit_distance option[value="+JS_UNIT_DISTANCE+"]").prop("selected", true);
			$("#unit_fuel option[value="+JS_UNIT_FUEL+"]").prop("selected", true);
			$("#unit_temp option[value="+JS_UNIT_TEMPERATURE+"]").prop("selected", true);
			$("#unit_altitude option[value="+JS_UNIT_ALTITUDE+"]").prop("selected", true);
			$("#unit_tpms option[value="+JS_UNIT_TPMS+"]").prop("selected", true);	
			initAssetInfosUpdate();
			break;	
			
		case "page_last":
			$("#"+page_last+"").css("display", "block");
			showView("#page_menu, #page_map, #page_objects, #page_dashboard, #page_history, #page_cmd, #page_events, #page_setting, #maptools, #maptools_ext", false);
			showView("#"+page_last+"", true);
			break;
	 }	 
}

function initAssetInfos(){
	selectAssetInfos = new vanillaSelectBox("#asset_infos", {
        "maxHeight": 300, 
		"minWidth": 130,
        "search": false,
		"disableSelectAll": false,
		"placeHolder": JS_INFO_SELECT,
        "translations": { "all": JS_SELECT_ALL_ITEM, "items": JS_SELECT_ITEMS,"selectAll":JS_SELECT_ALL,"clearAll":JS_SELECT_CLEAR_ALL }
    });
	
	initAssetInfosUpdate();
}

function initAssetInfosUpdate(){
	selectAssetInfos.empty();
	selectAssetInfos.setValue(JS_DEFAULT_ASSET_INFOS.toString().split(','));
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

function showHistoryNavbar(show){	
	if(show){
		historymode = true;		
		$("#map").css("bottom", "35px");
		$("#history_navbar").css("display","block");				
		$("#maptools_ext").css("display", "block");
		$("#playspeed").css("display", "block");
	}else{	
		$("#play i").removeClass("icon-navbar-play").addClass("icon-navbar-stop");
		$("#map").css("bottom", "0px");
		$("#map").css("display","block");
		$("#details_panel").css("display","none");
		$("#history_navbar").css("display","none");
		
		$("#maptools_ext").css("display", "none");
		$("#playspeed").css("display", "none");
		stopHistory();
		historymode = false;
		
		if (map) {
			map.ClearTrack(historyid);
			map.RemoveMarker(historyid);			
			map.AddMarker(historyid, historyMarkerLast);
			
			var item = $("#tab_all .tree_table").find("tbody tr[n="+historyid+"]").find("td:eq(0) input");
			if(item.is(":checked")){
				map.HideShowMarker(true,historyid);
				map.LocateMarker(historyid, true, true, true);
			}else{
				map.HideShowMarker(false,historyid);
			}
			
			historyMarkerLast = null;
		}			
		historyid = 0;
	}
	
	if (map) {
		map.SetHistoryId(historyid);
	}
	
	map.SetHistoryMode(show);
}

//load user command
function loadUserCommand(){
	$.get("../commandinfo.ajax.php", function(data){
		if($.trim(data) != ""){
			var result = eval('(' + data + ')');
		   
			if(result != null && typeof result != "undefined"){
				typeCmd = result.tcmd;
				protocolCmd = result.pparam;								
			}
		}
		needLoadCommand = false;
	});	
}

//load user Place
function loadPlace(){	
	$.post("../manage.ajax.php", {type:6,full:1}, function(data) {
		if($.trim(data) != ""){
			var result = eval('(' + data + ')');					   
			if(result != null && typeof result != "undefined"){
				if(result.list != null){
					needUpdatePlace = false;
					geoList = result.list;
					if($("#maptools #ed_zone").hasClass("tool_active")){
						ext.ClearZone(zones);
						drawZone();	
					}
					if($("#maptools #ed_marker").hasClass("tool_active")){
						ext.ClearUserMarker(usermarkers);
						drawUserMarker();
					}					
				}else{
					ext.ClearZone(zones);
					ext.ClearUserMarker(usermarkers);
				}
			}
		}
	});
}

function drawZone(){	
	var editable = false;
	var center_y, center_x, zone;
	if(geoList == null || geoList == 'undefined' || geoList.length == 0){
		return;
	}
	for(var a = 0; a < geoList.length; a++){
		var o = geoList[a];
		var acolor = $.trim(o.ac);
		var zoom = o.zoom;
		if(o.at == 1){
			var apts = o.ap.split(",");
			zone = ext.BuildCircle(parseFloat(apts[0]),parseFloat(apts[1]),parseFloat(apts[2]), editable, acolor, zoom, false, o.an);
			zones[o.zid] = zone;
			
		}else if(o.at == 2){
			var points = o.ap.split(";");
			zone = ext.BuildRectangle(parseFloat(points[0].split(",")[0]),
							   parseFloat(points[0].split(",")[1]),
							   parseFloat(points[1].split(",")[0]),
							   parseFloat(points[1].split(",")[1]),
							   editable, acolor, zoom, false, o.an);
			zones[o.zid] = zone;
			
		}else if(o.at == 3){
			var route = [];
			var points = o.ap.split(";");
			
			for(var i = 0; i < points.length; i++){
				var point = [points[i].split(',')[0],points[i].split(',')[1]];
				route.push(point);
			}
			zone = ext.BuildPolygon(route, editable, acolor, zoom, false, o.an);
			zones[o.zid] = zone;

		}else if(o.at == 5){
			var route = [];
			var points = o.ap.split(";");
			
			for(var i = 0; i < points.length; i++){
				var point = [points[i].split(',')[0],points[i].split(',')[1]];
				route.push(point);
			}
			zone = ext.BuildPolyline(route, editable, acolor, zoom, false, o.an);
			zones[o.zid] = zone;
		}		
	}
}

function drawUserMarker(){
	var editable = false;
	var marker;
	if(geoList == null || geoList == 'undefined' || geoList.length == 0){
		return;
	}
	
	for(var a = 0; a < geoList.length; a++){
		var o = geoList[a];
		var acolor = $.trim(o.ac);
		var zoom = o.zoom;
		if(o.at == 4){
			var apts = o.ap.split(",");
			marker = ext.BuildMarker(parseFloat(apts[0]), parseFloat(apts[1]), editable, acolor, zoom, false, o.an);
			usermarkers[o.zid] = marker;
		}	
	}
}

function doUpdatePwd(){
	var idOld = $("#oldpwd").val();
    var idNew = $("#newpwd").val();
    var idRep = $("#reppwd").val();
	
    if(idOld == ""){
        showLoading(false);
		$("#errorpwd").css("display", "block").text(JS_STATUS_EMPTYOLDPASS);
        $("#oldpwd").focus();
        return;
    }
    if(idNew == ""){
        showLoading(false);
		$("#errorpwd").css("display", "block").text(JS_STATUS_EMPTYNEWPASS);
        $("#oldpwd").focus();
        return;
    }
    if(idNew != idRep){
        showLoading(false);
		$("#errorpwd").css("display", "block").text(JS_STATUS_INVALIDREPEPASS);
        $("#oldpwd").focus();
        return;
    }
							   
    try{
        $.get("../changpass.ajax.php", { "idOld": idOld, "idNew": idNew, "idRep": idRep }, function(data) {
			showLoading(false);
            if(data == "ok"){
                showMessage("succ", JS_UPDATE_SET, JS_UPDATE_SUCC, 5);
            }else{
                showMessage("stop", JS_UPDATE_SET, JS_UPDATE_FAIL, 5);
            }         
        });
    }catch(e){
        showLoading(false);
        showMessage("stop", JS_UPDATE_SET, JS_UPDATE_FAIL, 5);
    }
}

function doUpdateSet(){	
	$("#errorpwd").css("display", "none");
	isRequestTimeout = false;
    var idLng = $("#idLng").val();
    var idLat = $("#idLat").val();
    var idDate = $("#idDate").val();
    var idTime = $("#idTime").val();
    var idLang = $("#idLang").val();
	var idZoom = $("#idZoom").val();
	var idShow = $("#show_all_object").prop("checked") ? 1 : 0;
	var iFitBounds = $("#object_fit_bounds").prop("checked") ? 1 : 0;
	var iCollapsedGroup = $("#collapsed_asset_group").prop("checked") ? 1 : 0;
	var assetInfos = $("#asset_infos").val() == null ? '':$("#asset_infos").val().toString();
	var idMarker = $("#show_marker").prop("checked") ? 1 : 0;
	var idZone = $("#show_zone").prop("checked") ? 1 : 0;
	var idPage = $("#def_page").find("option:selected").val();
	var pushNoti = $("#pushNoti").prop("checked") ? 1 : 0;
	var idSound = $("#sond_alarm").prop("checked") ? 1 : 0;
	var idPopup = $("#popup_alarm").prop("checked") ? 1 : 0;
	var unitSpeed = $("#unit_speed").find("option:selected").val();
	var unitDist = $("#unit_distance").find("option:selected").val();
	var unitFuel = $("#unit_fuel").find("option:selected").val();
	var unitTemp = $("#unit_temp").find("option:selected").val();
	var unitAltitude = $("#unit_altitude").find("option:selected").val();
	var unitTpms = $("#unit_tpms").find("option:selected").val();
	
    showLoading(true, JS_GLOBAL_TIPS);
    $("#setting-btn").removeClass("enable").addClass("disable").unbind("click");
    var timer = setTimeout(function(){
		isRequestTimeout = true;
		$("#setting-btn").removeClass("disable").addClass("enable").bind("click", doUpdateSet);
		showLoading(false,true)}, 20000);
		
    try{
        $.get("../setting.ajax.php", { "idLat": idLat, "idLng": idLng, "idDate": idDate, "idTime": idTime, "idLang": idLang, "idZoom": idZoom, "iFitBounds": iFitBounds, "iCollapsedGroup": iCollapsedGroup, "assetInfos": assetInfos, "idShow": idShow, "idMarker": idMarker, "idZone": idZone, "idPage": idPage, "idSound": idSound, "idPopup": idPopup, "unitSpeed": unitSpeed, "unitDist": unitDist, "unitFuel": unitFuel, "unitTemp": unitTemp, "unitAltitude": unitAltitude, "unitTpms": unitTpms, "pushNoti": pushNoti }, function(data) {
            clearTimeout(timer);
            if(data.indexOf('ok') >= 0){
				var WP = window.parent;
				WP.JS_DEFAULT_DATETIME_fmt_JS = idDate + ' ' + idTime;
				WP.JS_DEFAULT_SOUND_ALARM = idSound;
				WP.JS_DEFAULT_POPUP_ALARM = idPopup;
				WP.JS_UNIT_SPEED = unitSpeed;
				WP.JS_UNIT_DISTANCE = unitDist;
				WP.JS_UNIT_FUEL = unitFuel;
				WP.JS_UNIT_TEMPERATURE = unitTemp;
				WP.JS_UNIT_ALTITUDE = unitAltitude;
				WP.JS_UNIT_TPMS = unitTpms;
				WP.JS_DEFAULT_ZOOM = idZoom;
				WP.JS_DEFAULT_SHOW = idShow;
				WP.JS_DEFAULT_MARKER = idMarker;
				WP.JS_DEFAULT_ZONE = idZone;
				WP.JS_DEFAULT_PAGE = idPage;
				WP.JS_DEFAULT_COLLAPSED = iCollapsedGroup;
				WP.JS_DEFAULT_ASSET_INFOS = assetInfos;
				WP.JS_PUSH_NOTIFICATION = pushNoti;		
				$.cookie("pull_active", pushNoti, { expires: 30 });
				WP.initUnits();
				if($("#oldpwd").val() == "" && $("#newpwd").val() == "" && $("#reppwd").val() == ""){
					showLoading(false);
					showMessage("succ", JS_UPDATE_SET, JS_UPDATE_SUCC, 5);
				}else{
					doUpdatePwd();
				}               
            }else{
				showLoading(false);
                showMessage("stop", JS_UPDATE_SET, JS_UPDATE_FAIL, 5);
            }
			if(!isRequestTimeout){
				$("#setting-btn").removeClass("disable").addClass("enable").bind("click", doUpdateSet);
			}          
        });
    }catch(e){
        showLoading(false);
        showMessage("stop", JS_UPDATE_SET, JS_UPDATE_FAIL, 5);
        $("#setting-btn").removeClass("disable").addClass("enable").bind("click", doUpdateSet);
    }
}

function mapsSelector(lat, lng) {
  if // if we're on iOS, open in Apple Maps 
    ((navigator.platform.indexOf("iPhone") != -1) || 
     (navigator.platform.indexOf("iPad") != -1) || 
     (navigator.platform.indexOf("iPod") != -1))
     //window.open("maps://maps.google.com/maps?q="+lat+","+lng+"&amp;ll=", "_blank");
	  window.location = "maps://maps.google.com/maps?q="+lat+","+lng+"&amp;ll=";
  else // else use Google 
     //window.open("http://maps.google.com/maps?q="+lat+","+lng+"&amp;ll=", "_blank");
     window.location.href = 'geo:'+lat+","+lng + "?q=" + lat +","+ lng + "("+lat +","+ lng+")";
	//window.location.href = "google.navigation:q="+lat+","+lng;
}

function openWaze(lat, lng){
	 if // if we're on iOS, open in Apple Maps 
		((navigator.platform.indexOf("iPhone") != -1) || 
		 (navigator.platform.indexOf("iPad") != -1) || 
		 (navigator.platform.indexOf("iPod") != -1))
		 //window.open("https://www.waze.com/ul?ll="+lat+","+lng+"&navigate=no");
		 window.location = "https://www.waze.com/ul?ll="+lat+","+lng+"&navigate=no";
	 else // else use Google 
		 window.location.href = "waze://?ll="+lat+","+lng+"&navigate=yes";
}

function showObjectStatus(keyid){
	if(keyid > 0){
		if(typeof map != "undefined"){
			var marker = map.LocateMarker(keyid, false, false, false);

			$("#object_detail_ext tbody").empty();
			var $tbody = $("<tbody></tbody>").appendTo($("#object_detail_ext"));
			//Position
			var $tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(JS_POSITION).appendTo($tr);
			//
			//$("<td></td>").html("<a style='outline:none; margin: 2px 0px' target='_blank' href="+"http://maps.google.com/?q="+(marker.properties.y/1000000).toFixed(5) + "," + (marker.properties.x/1000000).toFixed(5)+"&t=m><img style='outline:none; margin: 2px 0px' src='../img/google.svg' width='30px' height='30px'></img></a>&nbsp;&nbsp;<a style='outline:none; margin: 2px 0px' target='_blank' href="+"waze://?ll="+(marker.properties.y/1000000).toFixed(5) + "," + (marker.properties.x/1000000).toFixed(5)+"&navigate=no><img style='outline:none; margin: 2px 0px' src='../img/waze.png' width='30px' height='30px'></img></a>").appendTo($tr);
			$("<td></td>").html("<a style='outline:none; margin: 2px 0px' onclick='mapsSelector("+(marker.properties.y/1000000).toFixed(5)+","+(marker.properties.x/1000000).toFixed(5)+")'><img style='outline:none; margin: 2px 0px' src='../img/google.svg' width='30px' height='30px'></img></a>&nbsp;&nbsp;<a style='outline:none; margin: 2px 0px' onclick='openWaze("+(marker.properties.y/1000000).toFixed(5)+","+(marker.properties.x/1000000).toFixed(5)+")'><img style='outline:none; margin: 2px 0px' src='../img/waze.png' width='30px' height='30px'></img></a>").appendTo($tr);
			//Speed
			var $tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(JS_SPEED).appendTo($tr);
			$("<td></td>").text(marker.properties.s + " " + UNIT_SPEED).appendTo($tr);
			//Heading
			var $tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(JS_HEADING).appendTo($tr);
			$("<td></td>").html(marker.properties.dir + " &#176;").appendTo($tr);
			//GPS time
			var $tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(JS_GPS_TIME).appendTo($tr);
			$("<td></td>").html(marker.properties.t).appendTo($tr);		
			//Server time
			var $tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(JS_SERVER_TIME).css("width","35%").appendTo($tr);
			$("<td></td>").html(marker.properties.ts).appendTo($tr);
			
			var status = getStatusById(keyid);	
			var status_array = status.split(";").reverse();
			
			if(status_array.length > 0){										
				for(var a = 0; a < status_array.length; a++){
					if(status_array[a].length > 0){
						var one_status = status_array[a].split("<br>");
						for(var i =0; i < one_status.length; i++){
							var $tr = $("<tr></tr>").appendTo($tbody);
							var one_status_value = one_status[i].split(": ");
							
							var timePat = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
							var matchArray = one_status_value[1] != null && one_status_value[1].match(timePat);
							if (matchArray != null) {
								$("<td></td>").text(one_status_value[0]).appendTo($tr);
								$("<td></td>").text($.format.date(one_status_value[1], JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							}else{
								$("<td></td>").text(one_status_value[0]).appendTo($tr);
								$("<td></td>").text(one_status_value[1]).appendTo($tr);
							}												
						}
					}									
				}		
			} 
			//address
			var $tr = $("<tr></tr>").appendTo($tbody);
			$("<td></td>").text(JS_TIP_ADDR).appendTo($tr);
			var $address = $("<td></td>").appendTo($tr);	
			map.GeoNames(marker.properties.x, marker.properties.y, $address, "text", 0);
			
			var sta_table = marker.properties.st;
			
			//cut command
			$('#scmd_cut').prop("checked", false);
			var $scmd_cut = $("#scmd_cut");
			$('#scmd_cut').unbind('click').click(function () {
				if($('#scmd_cut').prop("checked")){
					sendScommand(keyid, 6, null, $scmd_cut);
				}
			});
				
			/*if(sta_table != null && sta_table.indexOf("301D") != -1){
				$('#scmd_cut').prop("checked", true);
			}*/
			
			//uncut command
			$('#scmd_uncut').prop("checked", false);
			var $scmd_uncut = $("#scmd_uncut");
			$('#scmd_uncut').unbind('click').click(function () {
				if($('#scmd_uncut').prop("checked")){
					sendScommand(keyid, 7, null, $scmd_uncut);
				}
			});
			
			if(sta_table != null && sta_table.indexOf("301D") != -1){
				$('#scmd_uncut').prop("checked", true);
			}
			
			//arm command
			$('#scmd_arm').prop("checked", false);
			var $scmd_arm = $("#scmd_arm");
			$('#scmd_arm').unbind('click').click(function () {
				if($('#scmd_arm').prop("checked")){
					sendScommand(keyid, 653, null, $scmd_arm);
				}
			});
				
			if(sta_table != null && sta_table.indexOf("3007") != -1){
				$('#scmd_arm').prop("checked", true);
			}
			
			//disarm command
			$('#scmd_disarm').prop("checked", false);
			var $scmd_disarm = $("#scmd_disarm");
			$('#scmd_disarm').unbind('click').click(function () {
				if($('#scmd_disarm').prop("checked")){
					sendScommand(keyid, 665, null, $scmd_disarm);
				}
			});
				
			if(sta_table != null && sta_table.indexOf("3008") != -1){
				$('#scmd_disarm').prop("checked", true);
			}
			
			//lock command
			$('#scmd_lock').prop("checked", false);
			var $scmd_lock = $("#scmd_lock");
			$('#scmd_lock').unbind('click').click(function () {
				if($('#scmd_lock').prop("checked")){
					sendScommand(keyid, 4, null, $scmd_lock);
				}
			});
				
			if(sta_table != null && sta_table.indexOf("3002") != -1){
				$('#scmd_lock').prop("checked", true);
			}
			
			//unlock command
			$('#scmd_unlock').prop("checked", false);
			var $scmd_unlock = $("#scmd_unlock");
			$('#scmd_unlock').unbind('click').click(function () {
				if($('#scmd_unlock').prop("checked")){
					sendScommand(keyid, 5, null, $scmd_unlock);
				}
			});
				
			if(sta_table != null && sta_table.indexOf("3001") != -1){
				$('#scmd_unlock').prop("checked", true);
			}
			
			$("#object_detail").animate({scrollTop:0},0);
		}			
	}
}

function issupportcmd(typeid, cmdid){
	var support = false;
	var jo;
	
	for(var i = 0; i < typeCmd.length; i++) {
		if(typeCmd[i].tid == typeid){
			jo = typeCmd[i];
			if(cmdid == typeCmd[i].cid){
				support = true;
				break;
			}
		}
	}	
	return support;
}

function sendScommand(keyid, cmdid, params, $btn){
	var req = {
		"objid": keyid,
		"cmdid": cmdid,
		"params": params == null ? '' : params.substring(0,params.length -1)
	}

	try{
		$.get("../command.ajax.php", req, function(data) {	
			if (data.indexOf('ok') >= 0) {
				//do nothing
			} else{
				$btn.prop("checked",false);
			}
		});
	}catch(e){$btn.prop("checked",false);}
}

function getLocation(center){
   if(!isShowMyLocation){
	   return;
   }
   
   myLocation.needCenter = center;
   
   var options = {
	   enableHighAccuracy:true, 
	   maximumAge:1000
   }
   if(navigator.geolocation){
	   //浏览器支持geolocation
	   navigator.geolocation.getCurrentPosition(onSuccess,onError,options);	  
   }else{
	   //浏览器不支持geolocation
	   
   }
}

function onSuccess(position){
   myLocation.lng = position.coords.longitude.toFixed(6);
   myLocation.lat = position.coords.latitude.toFixed(6);
   displayMyLocation(myLocation.needCenter);
}

function displayMyLocation(needCenter){
	if(myLocation.lng == 0 || myLocation.lat == 0){
		return;
	}
	map.DisplayMyLocation(myLocation,needCenter);
}

function hideMyLocation(){
	map.HideMyLocation();
}

function onError(error){
   switch(error.code){
	   case 1:
			//alert("User denied the request for Geolocation.");
			break;

	   case 2:
			//alert("Location information is unavailable.");
			break;

	   case 3:
			//alert("The request to get user location timed out.");
			break;

	   case 4:
			//alert("An unknown error occurred.");
			break;
   }
   
}

function getIpLocation(){
	$.get("../ip.location.ajax.php", function(data) {	    
        try {
			var json = eval('(' + data + ')');

			if(json != null){
				myLocation.lng = json.lng;
			    myLocation.lat = json.lat;
			    displayMyLocation(myLocation.needCenter);
			}				
		} catch(e) {}   
	});
}



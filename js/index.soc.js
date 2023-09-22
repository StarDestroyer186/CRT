/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var map, ext, once = [], current_id = 0, menu_operator_id = 0, timer, remain=20, needloc = false, zones = [], usermarkers = [], geoList = null, needLoadCommand = true, needUpdatePlace = false, needUpdateUser = true, nologin = false, firstClick = true, lastLat = null, lastLng = null, queryingAlarm = false, queryingMilEng = false, queryingDriver = false, queryingPhoto = false, queryingMaTa = false,
fastHistoryValue = null, blockMoroccoBorders = false, iconSelect, lastAlarmId = 0, requestTimeout = 60000, needShowAllAsset = 0, UNIT_SPEED, UNIT_DIST, UNIT_FUEL, UNIT_TEMP, UNIT_ALTITUDE, UNIT_HUMIDITY, UNIT_TPMS, exportFileName = "", exportTableId = "", reportHeader = "", array_users, objLastEvent = [], objLastMiEg = [], objLastDriver = [], objLastPhoto = [], objLastMaTa = [], ANIMATION_TIME = 2000;
var OffsetH = 51 + 11;/*header + footer + padding*/
var OffsetW = 14;/*pading(top bottom)*/
var typeCmd, protocolCmd;
/*jquery loaded*/
$(document).ready(function() {
    window.onresize=function(){
        var iframe = document.getElementById("frame_content");
        if(iframe.src != ""){
            iframe.height = document.body.clientHeight - (OffsetH);
            iframe.width = document.body.clientWidth - OffsetW;
        }
    };
    $("#tab_online").toggle();
    $("#tab_offline").toggle();
	$("#tab_expired").toggle();
    $("#loadmapwait").css("display", "block");
	
	remain = JS_GLOBAL_MIM_UPDATE;
	needShowAllAsset = JS_DEFAULT_SHOW;

	$.contextMenu({
		selector: '.tablist .tab_content', 
		callback: function(key, options) {
			releaseTrack(); 
		},
		items: {
			"relTrack": {name: JS_RELEASE_TRACK}
		}
	});
	
	initUnits();		
	onLoadGoogle();	
	
	checkTabbarScrollbar();
	
	/*loading device list*/
	getDeviceListData(0);

	$("#staswitch").addClass("hide_status");
	$("#staswitch").unbind("click").click(function() {
		if(($(this).hasClass("hide_status")) || firstClick){
			$(this).removeClass("hide_status");
			$(this).attr('src','img/down-arrow.svg'); 
			$("#stasep").css("bottom", "161px");
			$("#assetinfo").css("display", "block");
			$("#map").css("bottom", "165px");
			$("#streetview_img").css("bottom", "168px");
			if(map){
				map.ResizeMapContainer();
			}
			if(firstClick){
				firstClick = false;
			}			
		}else{						
			$(this).addClass("hide_status");
			$(this).attr('src','img/up-arrow.svg');
			$("#stasep").css("bottom", "4px"); 			
			$("#assetinfo").css("display", "none");
			$("#map").css("bottom", "8px");
			$("#streetview_img").css("bottom", "10px");
			if(map){
				map.ResizeMapContainer();
			}			
		}
	});	
	
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

	if(typeof JS_P_UID != "undefined" && JS_P_UID != null && JS_P_UID.length > 0){
		$("#return_line").css("display", "block");
		$("#user_return").css("display", "block");
	}else{
		$("#return_line").css("display", "none");
		$("#user_return").css("display", "none");
	}
	
	$('#race_details tr:eq(0) th:eq(2)').append("("+UNIT_DIST+")");
	$('#race_details tr:eq(0) th:eq(3)').append("("+UNIT_DIST+")");
	$('#race_details tr:eq(0) th:eq(5)').append("("+UNIT_DIST+")");
	$('#race_details tr:eq(0) th:eq(4)').append("("+UNIT_SPEED+")");
	$('#race_details th').unbind("click").click(function() {
		exportFileName = JS_RACE_INFO + "-" + getCurentDateTime();
		exportTableId = "race_details";
		doExport(3);
	});
	
	/*init icon*/
	iconSelect = new IconSelect("my-icon-select", 
		{'selectedIconWidth':24,
		'selectedIconHeight':24,
		'selectedBoxPadding':1,
		'iconsWidth':24,
		'iconsHeight':24,
		'boxIconSpace':1,
		'vectoralIconNumber':4,
		'horizontalIconNumber':4});	
	
	iconSelect.refresh(getIcons());
});

function checkTabbarScrollbar(){
	if($(".tabbar").hasScrollBar("horizontal")){ 
		$(".tablist").css("top","39px");
	}else{
		$(".tablist").css("top","22px");
	}
}

function returnUser(){
	var timezoneOffset = new Date().getTimezoneOffset() / 60 * -1;
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try{
		$.post("login.ajax.php?t=" + new Date().getTime(), {"type": 0, "timezone": timezoneOffset}, function(data) {
			clearTimeout(timer);
			showLoading(false);
			if(data.indexOf('ok')>=0){
				window.parent.location.reload(true);
			}
		});
	}catch(e){error(showLoading(false));}	
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
		icons.push({'iconFilePath':'img/icons/icon_'+ i +'.svg', 'iconValue':i});
	}
	return icons;
}

function getDeviceListData(start){
	 $.get("devlist.ajax.php", {"start": start,"userName": $("#user a").text()}, function(data){
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
				$("#showobjchart").bind("click", showObjChart);
				$("#speedcompass #close").click(function(){
				    $("#speedcompass .content").toggle();
					if($("#speedcompass .content").is(":visible")){
						 $("#speedcompass").removeClass("speedcompasshide").addClass("speedcompassshow");
						 $("#speedcompass #close").removeClass("speedchart_max").addClass("speedchart_min");
				    }else{
						$("#speedcompass").removeClass("speedcompassshow").addClass("speedcompasshide");
						$("#speedcompass #close").removeClass("speedchart_min").addClass("speedchart_max");
					}
				});
				
                $("#device").keyup(function(event) {
                    if (event.keyCode == '13') {
                        search_select();
                        event.preventDefault();
                    }
                });
				
				try{ 
					if(JS_DEFAULT_FIT == 1){
						map.MarkersFitBounds();
					}
				}catch(e){}	
				
				$("#loadmapwait").css("display", "none");
				timer = setTimeout("relocate()", 1000);
				
				checkTabbarScrollbar();	
				
				/*If there is expire
				var expires = getExpireObjByDays();
				if(expires.ex_1.length > 0 || expires.ex_7.length > 0 || expires.ex_15.length > 0 || expires.ex_30.length > 0){
					showObjChart();
				}*/
				
				//onLoadMap();
                //loadScript("http://www.google.cn/maps/api/js?v=3.8&sensor=false&language="+JS_CURRENT_LANG+"&callback=onLoadMap");
				//loadScript("http://ditu.google.cn/maps/api/js?key="+JS_GOOGLE_KEY+"&v=3.21&sensor=false&language="+JS_CURRENT_LANG+"&libraries=drawing,geometry&callback=onLoadGoogle");	
				
			}
        }else{
        	//none data
			//onLoadMap();
        	//loadScript("http://maps.google.com/maps/api/js?sensor=false&language="+JS_CURRENT_LANG+"&callback=onLoadMap");
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
		clearArray(JS_DEVICE_ID4IO);
    }

	if(typeof json.data != "undefined" && json.data != null){
		for(var i=0; i<json.data.length; i++){
			for(var j=0; j<json.data[i].item.length;j++){
				var jo = json.data[i].item[j];
				JS_DEVICE_ID4FLAG[jo.c] = jo.n;
				JS_DEVICE_FLAG4ID[jo.n] = jo.c;
				JS_DEVICE_STATUS[jo.n] = jo.e;
				JS_DEVICE_ID4IO[jo.n] = jo.io;
				JS_DEVICE_TYPE4ID[jo.n] = jo.dt;
				JS_DEVICE_SIM4ID[jo.n] = jo.si;
				JS_DEVICE_NO4ID[jo.n] = jo.nc;
				JS_DEVICE_ID4GROUPID[jo.n] = json.data[i].gid;
				if(jo.dn != null && jo.dn.length > 0){
					JSDEVICE_DRIVER4ID[jo.n] = jo.dn;
				}		
				
				if(nomap){
					var p = getSpeedState(jo.on, jo.v, jo.s, jo.t, jo.a, jo.ar);
					var desc = { n: jo.n, c: jo.c, v: jo.v, x: jo.x, y: jo.y,
						t: ((jo.t == null || jo.t.length == 0) ? jo.t : $.format.date(jo.t, JS_DEFAULT_DATETIME_fmt_JS)),ts: ((jo.ts == null || jo.ts.length == 0) ? jo.ts : $.format.date(jo.ts, JS_DEFAULT_DATETIME_fmt_JS)), i: jo.i, d: jo.d, a: jo.a, sta: p.sta, spd: p.spd, st: jo.st, io: jo.io, dt: jo.dt, s: p.val, jb: jo.jb, dn: jo.dn};
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
		//$("#asset_list_item").val("1");
		/*$("#device").autocomplete({
			source: getDeviceList(),
			minLength: 0,
			max:10,
            scroll:true
		}).focus(function(){            
			 $(this).autocomplete('search', $(this).val())
        });*/
		
		
		if($("#asset_list_item").val() == "1"){
			 var deviceList = getDeviceList();
			 $("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList, minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}else if($("#asset_list_item").val() == "2"){
			 var deviceList = getIDsList();
			 $("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}else if($("#asset_list_item").val() == "3"){
			 var deviceList = getSimList();
			$("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}else if($("#asset_list_item").val() == "4"){
			var deviceList = getDriverList();
			$("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}else{
			var deviceList = getGroupList();
			$("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}				
    }
}
function menuselect(cmd, keyid, typeid){
	//initserach(keyid);
	
    switch(cmd){
        case 1: showTrackInfo(keyid); break;
        case 2: showDeviceInfo(keyid); break;
        case 3: showSendCmd(keyid); break;
        case 4: showAlarmInfo(keyid); break;
		case 5: showLastPhoto(keyid); break;
		case 6: showLastVoice(keyid); break;
		case 7: showSharePositionInfo(keyid); break;
    }
}

function initserach(keyid){
	$("#asset_list_item").val("1");
    var flag = getFlagById(keyid);
    var device = $("#sch #device").val();
    if(device != flag){
        $("#sch #device").val(flag);
        search_select();
    }
}

function map_locate(keyid, center, geoname, track, zoomIn){
    //try{
        var flag = getFlagById(keyid);
        var $dev_flag = $("#geo #dev_flag");
        if($dev_flag.text() != flag){
            $dev_flag.text(flag);
        }
        if(keyid > 0){
			if(typeof map != "undefined"){
				if(firstClick){
					$("#staswitch").click();
				}
				
				var marker = map.LocateMarker(keyid, center, zoomIn, true);
				if(marker == null || typeof marker.properties == "undefined" || marker.properties == null){
					$("#assetinfo #statuslist").empty();
					return;
				}
				
				//如果勾选了跟踪多个车辆，只刷新选择车辆信息
				if(geoname || (track && current_id == keyid)){
					var $scroll_left = $("#assetinfo #statuslist").position().left;
					var $addresslast = $("#addresslast").text();
					$("#assetinfo #statuslist").empty();
					var $tbody = $("<tbody></tbody>").appendTo($("#assetinfo #statuslist"));
					
					//Asset name
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(JS_ASSET_NAME).addClass("oneline info_name").appendTo($tr);
					$("<td align='right'></td>").text(marker.properties.title).addClass("oneline info_right").css({'background': 'url(img/icons/icon_'+marker.properties.ico+'.svg) no-repeat 5px center', 'padding-left': '30px', 'background-size': '20px 20px'}).appendTo($tr);
					//Position	
					var $tr = $("<tr></tr>").appendTo($tbody);	
					$("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(JS_POSITION).addClass("oneline info_position").appendTo($tr);
					$("<td align='right'></td>").addClass("oneline info_right").html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+(marker.properties.y / 1000000).toFixed(5) + "," + (marker.properties.x / 1000000).toFixed(5)+">"+(marker.properties.y / 1000000).toFixed(5)+" &#176;,"+(marker.properties.x / 1000000).toFixed(5)+" &#176;</a>").appendTo($tr);
					//Speed
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(JS_SPEED).addClass("oneline info_speed").appendTo($tr);
					$("<td align='right' style='border-right: 15px solid #fff; border-left: 0px solid;'></td>").addClass("oneline").text(marker.properties.s + " " + UNIT_SPEED).appendTo($tr);
					//Heading
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(JS_HEADING).addClass("oneline info_angle").appendTo($tr);
					$("<td align='right' style='border-right: 15px solid #fff; border-left: 0px solid;'></td>").addClass("oneline").html(marker.properties.dir + " &#176;").appendTo($tr);
					//GPS time
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(JS_GPS_TIME).addClass("oneline info_time").appendTo($tr);
					$("<td align='right' style='border-right: 15px solid #fff; border-left: 0px solid;'></td>").addClass("oneline").html(marker.properties.t).appendTo($tr);	
					//Server time
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(JS_SERVER_TIME).addClass("oneline info_time").appendTo($tr);
					$("<td align='right' style='border-right: 15px solid #fff; border-left: 0px solid;'></td>").addClass("oneline").html(marker.properties.ts).appendTo($tr);
					
					var acc_state = "---";	
					var driver_name = "---";
					
					if(marker.properties.st != null && typeof marker.properties.st != "undefined" && marker.properties.st.length > 0){
						//var acc = getIdValue("45:", marker.properties.io, true);
						if(marker.properties.st.indexOf('3005') >= 0){
						//if(marker.properties.st.indexOf("3005") != -1){
							acc_state = JS_ON ;
						}else if(marker.properties.st.indexOf('3006') >= 0){
							acc_state = JS_OFF;
						}
					}
					
					if(marker.properties.dn != null && typeof marker.properties.dn != "undefined" && marker.properties.dn.length > 0){
						driver_name = marker.properties.dn;
					}					
 
					//Engine
					$tr = $("#assetinfo #statuslist tr:eq(0)");															
					$("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(JS_ENGINE).addClass("oneline info_engine").appendTo($tr);
					$("<td align='right' style='border-right: 15px solid #fff; border-left: 0px solid;'></td>").addClass("oneline").html(acc_state).appendTo($tr);	
					//Driver name
					$tr = $("#assetinfo #statuslist tr:eq(1)");															
					$("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(JS_DRIVER_NAME).addClass("oneline info_driver").appendTo($tr);
					$("<td align='right' style='border-right: 15px solid #fff; border-left: 0px solid;'></td>").addClass("oneline").html(driver_name).appendTo($tr);					
					//Address
					$tr = $("#assetinfo #statuslist tr:eq(2)");
					$("<td rowspan='4' valign='top' style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(JS_ADDRESS).addClass("oneline info_address").appendTo($tr);					
					var $address_td = $("<td rowspan='4' align='right' valign='top' style='border-right: 15px solid #fff; border-left: 0px solid;'></td>").appendTo($tr);
					var $address = $("<div id='addresslast' style='height: 68px; width: 100px; overflow-y: scroll;'></div>").appendTo($address_td);
					
					if(typeof geoname != "undefined" && geoname){
						if($('#assetinfo').is(':hidden')){
							//do nothing
						}else if (lastLat != 0 && lastLng != 0 && lastLat == marker.properties.y && lastLng == marker.properties.x && $addresslast != null && $addresslast.length > 0){
							$address.text($addresslast);							
						}else{
							lastLat = marker.properties.y;
							lastLng = marker.properties.x;	
							$address.addClass("query_waiting");
							map.GeoNames(marker.properties.x, marker.properties.y, $address, "text", 0);				
						}						

						if($('#maptools #ed_street_view').hasClass("tool_active")){
							$('#maptools #ed_street_view').attr("x",marker.properties.x).attr("y",marker.properties.y).attr("dir",marker.properties.dir);
							$('#streetview_img').html('<img src=https://maps.googleapis.com/maps/api/streetview?key='+JS_GOOGLE_KEY+'&size=308x170&sensor=false&location='+marker.properties.y / 1000000+','+marker.properties.x / 1000000+'&fov=90&heading='+marker.properties.dir+'&pitch=10>');						
							//following link do not have heading
							//http://cbk0.google.com/cbk?output=thumbnail&w=380&h=170&p=60&ll=45.47264,-73.65495
						}else{
							$('#maptools #ed_street_view').removeAttr("x").removeAttr("y").removeAttr("dir");
						}
					}
				
					var status = getStatusById(keyid);	
					var status_array = status.split(";").reverse();					
					
					if(status_array.length > 0){
						var totalCol = 6;
						var indexCol = 0;
						for(var a = 0; a < status_array.length; a++){
							if(status_array[a].length > 0){
								var one_status = status_array[a].split("<br>");
								var ios = marker.properties.io;	
								
								for(var i =0; i < one_status.length; i++){
									var one_status_value = one_status[i].split(": ");
									if(one_status_value.length != 2){
										continue;
									}
									
									indexCol = (i % totalCol);
									var $tr, $table_status, $tr_status, $td_status;
									
									if(i == one_status.length - 1){
										$tr = $("#assetinfo #statuslist tr:eq(0)");										
									}else{
										$tr = $("#assetinfo #statuslist tr:eq("+indexCol+")");
									}
																		
									var elementId = getIdByIndex(ios, i);								
								
									if(i == one_status.length - 1){
										var $td_end = $("<td rowspan='6' valign='top' style='border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff';></td>").appendTo($tr);						
										$table_status = $("<table style='margin: -3px 0px 0px 0px'></table>").addClass("tab_status").appendTo($td_end);
										$tr_status = $("<tr></tr>").appendTo($table_status);
										$td_status = $("<td style='padding-left: 18px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_status").text(one_status_value[0]).appendTo($tr_status);						
									}else{											
										var $td = $("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(one_status_value[0]).addClass("oneline").appendTo($tr);
										if(elementId == 1 || elementId == 110 || elementId == 111 || elementId == 112 || elementId == 113){
											$td.addClass("info_io_battery");
										}else if(elementId == 2){
											$td.addClass("info_io_door");
										}else if(elementId == 4 ){
											$td.addClass("info_io_power");
										}else if(elementId == 5 || elementId == 6 || elementId == 7 || elementId == 8 || elementId == 104){
											$td.addClass("info_io_status");
										}else if(elementId == 22 ){
											$td.addClass("info_io_mode");
										}else if(elementId == 30 || elementId == 31 || elementId == 40 || elementId == 41 || elementId == 80){
											$td.addClass("info_io_fuel");
										}else if(elementId == 17 || elementId == 18 || elementId == 19 || elementId == 61 || elementId == 62 || elementId == 64 || elementId == 65){
											$td.addClass("info_io_time");
										}else if(elementId == 10 || elementId == 63){
											$td.addClass("info_io_odometer");
										}else if(elementId == 11 || elementId == 12 || elementId == 14 || elementId == 15 || elementId == 16){
											$td.addClass("info_io_nearest_zone");
										}else if(elementId == 13 ){
											$td.addClass("info_io_maintenance");
										}else if(elementId == 20 ){
											$td.addClass("info_io_gps");
										}else if(elementId == 21 ){
											$td.addClass("info_io_gsm");
										}else if(elementId == 23 || elementId == 50 || elementId == 51){
											$td.addClass("info_io_ad");									
										}else if(elementId == 25 || elementId == 26){
											$td.addClass("info_io_command");
										}else if(elementId == 27 ){
											$td.addClass("info_io_altitude");
										}else if(elementId == 28 ){
											$td.addClass("info_io_passenger");
										}else if(elementId == 29 || elementId == 120 || elementId == 121 || elementId == 122){
											$td.addClass("info_io_humidity");
										}else if(elementId == 60 ){
											$td.addClass("info_io_max_speed");
										}else if(elementId == 72 || elementId == 73 || elementId == 74 || elementId == 75 || elementId == 76 || elementId == 77 || elementId == 78 || elementId == 79){
											$td.addClass("info_io_temp");
										}else if(elementId == 95 ){
											$td.addClass("info_io_workid");										
										}else if(elementId == 96 ){
											$td.addClass("info_io_driver_tel");										
										}else if(elementId == 90 || elementId == 91 || elementId == 92 || elementId == 93){
											$td.addClass("info_io_task");
										}else if(elementId == 98 ){
											$td.addClass("info_io_pos_type");
										}else if(elementId == 99 ){
											$td.addClass("info_io_weight");
										}else if(elementId == 140 || elementId == 141 || elementId == 142 || elementId == 143 || elementId == 144){
											$td.addClass("info_io_digital");
										}else if(elementId == 197 || elementId == 198 || elementId == 199 || elementId == 200){
											$td.addClass("info_io_cell");
										}else if(elementId == 240 ){
											$td.addClass("info_io_moving");
										}else if(elementId == 100){
											$td.addClass("info_alarm_name");
										}else if(elementId == 69){
											$td.addClass("info_io_acc");
										}else if(elementId == 81){
											$td.addClass("info_io_tire");
										}else if(elementId == 241){
											$td.addClass("info_io_sleep_mode");
										}else if(elementId == 242){
											$td.addClass("info_io_gnns_status");
										}else if(elementId == 245){
											$td.addClass("info_io_seat_belt");
										}else if(elementId == 246){
											$td.addClass("info_io_route_length");
										}else if(elementId == 247){
											$td.addClass("info_io_moving_percent");
										}else if(elementId == 248){
											$td.addClass("info_io_departure");
										}else if(elementId == 249){
											$td.addClass("info_io_delivery");
										}else if(elementId == 290 || elementId == 293){
											$td.addClass("info_io_dist_to_leader");
										}else if(elementId == 291 || elementId == 292){
											$td.addClass("info_io_time_to_leader");
										}
										else{
											$td.addClass("info_io");
										}
									}
									
									var timePat = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
									var matchArray = one_status_value[1] != null && one_status_value[1].match(timePat);
									if (matchArray != null) {
										$("<td align='right' style='border-right: 15px solid #fff; border-left: 0px solid;'></td>").text($.format.date(one_status_value[1], JS_DEFAULT_DATETIME_fmt_JS)).addClass("oneline").appendTo($tr);
									}else{
										if(i == one_status.length - 1){											
											$tr_status = $("<tr></tr>").appendTo($table_status);										
											$td_status = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 150px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_status);
											var $div_status = $("<div style='height: 100px; width: 102%; overflow-y: scroll; background: #fff; '></div>").appendTo($td_status);
											$div_status.text(one_status_value[1]);
										}else{
											$("<td align='right' style='border-right: 15px solid #fff; border-left: 0px solid;'></td>").text(one_status_value[1]).addClass("oneline").appendTo($tr);
										}										
									}												
								}
							}									
						}																										
					}		
					$("#assetinfo #statuslist tbody tr:even").addClass("oddcolor");	
					$("#assetinfo #statuslist tbody").addClass("tab_status");	
					
					/*shortcut command*/
					$tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					$td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'></td>").appendTo($tr_end);
					var $table_scmd = $("<table style='margin: -3px 0px 0px 0px'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_scmd = $("<tr></tr>").appendTo($table_scmd);
					var $td_scmd = $("<td style='padding-left: 20px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_scmd").text(JS_SHORTCUT_COMMAND).appendTo($tr_scmd);
					$tr_scmd = $("<tr></tr>").appendTo($table_scmd);						
					$td_scmd = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 50px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_scmd);
					var $div_scmd = $("<div style='height: 100px; width: 102%; overflow-y: scroll;'></div>").appendTo($td_scmd);
					initscmd(keyid, $div_scmd, marker.properties.st);
					
					
					/*last events*/
					var $tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					var $td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'; ></td>").appendTo($tr_end);
					var $table_event = $("<table style='margin: -3px 0px 0px 0px;'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_event = $("<tr></tr>").appendTo($table_event);
					var $td_event = $("<td style='padding-left: 20px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_levent").text(JS_RECENT_EVENTS).appendTo($tr_event);
					$tr_event = $("<tr></tr>").appendTo($table_event);						
					$td_event = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 150px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_event);					
					var $div_event = $("<div style='height: 100px; width: 102%; overflow-y: scroll;'></div>").appendTo($td_event);
					
					if(geoname && !track && !queryingAlarm){	
						$div_event.addClass("query_waiting");
						getLastAlarms(keyid, $div_event, marker);
					}else{
						showLastAlarms(keyid, $div_event, marker);
					}									
					
					/*last mileage*/
					$tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					$td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'></td>").appendTo($tr_end);
					var $table_mileage = $("<table style='margin: -3px 0px 0px 0px'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_mileage = $("<tr></tr>").appendTo($table_mileage);
					var $td_mileage = $("<td style='padding-left: 20px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_lmileage").text(JS_RECENT_MILEAGE + "(" + UNIT_DIST + ")").appendTo($tr_mileage);
					$tr_mileage = $("<tr></tr>").appendTo($table_mileage);						
					$td_mileage = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 150px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_mileage);
					var $div_mileage = $("<div id='sta_last5day_mileage' style='min-width: 150px; min-height: 100px;'></div>").appendTo($td_mileage);
					
					/*last engine*/
					$tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					$td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'></td>").appendTo($tr_end);
					var $table_engine = $("<table style='margin: -3px 0px 0px 0px'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_engine = $("<tr></tr>").appendTo($table_engine);
					var $td_engine = $("<td style='padding-left: 20px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_lengine").text(JS_RECENT_ENGINE + "(h)").appendTo($tr_engine);
					$tr_engine = $("<tr></tr>").appendTo($table_engine);						
					$td_engine = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 150px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_engine);
					var $div_engine = $("<div id='sta_last5day_engine' style='min-width: 150px; min-height: 100px;'></div>").appendTo($td_engine);																	
					
					/*last load*/
					$tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					$td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'></td>").appendTo($tr_end);
					var $table_load = $("<table style='margin: -3px 0px 0px 0px'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_load = $("<tr></tr>").appendTo($table_load);
					var $td_load = $("<td style='padding-left: 20px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_lload").text(JS_RECENT_LOAD + "(h)").appendTo($tr_load);
					$tr_load = $("<tr></tr>").appendTo($table_load);						
					$td_load = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 150px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_load);
					var $div_load = $("<div id='sta_last5day_load' style='min-width: 150px; min-height: 100px;'></div>").appendTo($td_load);			
					
					if(geoname && !track && !queryingMilEng){	
						$div_mileage.addClass("query_waiting");
						$div_engine.addClass("query_waiting");
						$div_load.addClass("query_waiting");
						getLast5daysMiEg(keyid, $div_mileage, $div_engine, $div_load);
					}else{
						createLast5daysMiEgBar(keyid, $div_mileage, $div_engine, $div_load);
					}
					
					/*Speedometer*/
					$tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					$td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'></td>").appendTo($tr_end);
					var $table_speedometer = $("<table style='margin: -3px 0px 0px 0px'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_speedometer = $("<tr></tr>").appendTo($table_speedometer);
					var $td_speedometer = $("<td style='padding-left: 25px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_lspeed").text(JS_RECENT_SPEEDOMETER + "(" + UNIT_SPEED + ")").appendTo($tr_speedometer);
					$tr_speedometer = $("<tr></tr>").appendTo($table_speedometer);						
					$td_speedometer = $("<td bgcolor='#fff' class='speedometer' height='100px' rowspan='5' valign='top' style='background: #fff; width: 100px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_speedometer);
					var $div_speedometer = $("<canvas id='sta_speedometer' style='max-width: 200px; max-height: 100%; margin-left: -40px; margin-right: -50px; margin-bottom: 0px;'></canvas><label style='display:block; margin-left:35px; margin-top:-60px;'><span style='font-weight:bold; font-size: 20px'>"+marker.properties.s+"</span>"+UNIT_SPEED+"</label>").appendTo($td_speedometer);
					//var $div_speedometer = $("<div id='sta_speedometer' style='min-width: 100px; min-height: 100px;'></div>").appendTo($td_speedometer);	
					createSpeedometer(marker.properties.s);
					
					/*tire sensor*/
					$tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					$td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'></td>").appendTo($tr_end);
					var $table_tiresensor = $("<table style='margin: -3px 0px 0px 0px'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_tiresensor = $("<tr></tr>").appendTo($table_tiresensor);
					var $td_tiresensor = $("<td style='padding-left: 25px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_tiresensor").text(JS_RECENT_TIRESENSOR).appendTo($tr_tiresensor);
					$tr_tiresensor = $("<tr></tr>").appendTo($table_tiresensor);						
					$td_tiresensor = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 100px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_tiresensor);
					var $div_tiresensor = $("<div id='sta_tiresensor' style='min-height: 100px;'></div>").appendTo($td_tiresensor);
					var $tiredatas = parseTireData(getIdValue("51:", marker.properties.io, true));
									
					if($tiredatas.index.length == 0){
						var noTire = $("<label nowrap='nowrap' style='padding: 2px; height: 60px; width: 100%; font-size:15pt; color: #AAAAAA; line-height: 70px;'></label>").text(JS_NO_DATA);
						$("#sta_tiresensor").append(noTire);
						$div_tiresensor.css({"min-width": '100px', 'text-align': 'center'});
					}else{						
						$div_tiresensor.css("min-width", 150 + $tiredatas.index.length * 50 + 'px');
						createTiresensorBar($tiredatas.index, $tiredatas.tire, $tiredatas.temp, $tiredatas.bat);
					}
					
					/*driver info*/
					$tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					$td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'></td>").appendTo($tr_end);
					var $table_driver = $("<table style='margin: -3px 0px 0px 0px'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_driver = $("<tr></tr>").appendTo($table_driver);
					var $td_driver = $("<td colspan='2' style='padding-left: 20px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_ldriver").text(JS_RECENT_DRIVER).appendTo($tr_driver);
					$tr_driver = $("<tr style='border-left: 0px solid; border-right: 0px solid;'></tr>").appendTo($table_driver);						
					var $td_driver_info = $("<td id='sta_last_driver_info' bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 100px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_driver);
					var $td_driver_img = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 100px; border-left: 0px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_driver);
					var $div_driver_img = $("<div id='sta_last_driver_img' style='min-width: 100px; min-height: 100px;'><ul><li><img src='img/none driver.png' alt='null' height='89' width='80'></li></ul></div>").appendTo($td_driver_img);
					
					if(geoname && !track && !queryingDriver){	
						$div_driver_img.addClass("query_waiting");
						getLastDriver(keyid, marker.properties.jb, $div_driver_img);
					}else{
						showLastDriver(keyid);
					}
					
					/*last maintainance*/
					var $tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					var $td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'; ></td>").appendTo($tr_end);
					var $table_maintainance = $("<table style='margin: -3px 0px 0px 0px;'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_maintainance = $("<tr></tr>").appendTo($table_maintainance);
					var $td_maintainance = $("<td style='padding-left: 20px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_lmaintain").text(JS_RECENT_MAINTAINANCE).appendTo($tr_maintainance);
					$tr_maintainance = $("<tr></tr>").appendTo($table_maintainance);						
					$td_maintainance = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 100px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_maintainance);					
					var $div_maintainance = $("<div style='height: 100px; width: 102%; overflow-y: scroll;'></div>").appendTo($td_maintainance);
					
					/*last task*/
					var $tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					var $td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'; ></td>").appendTo($tr_end);
					var $table_task = $("<table style='margin: -3px 0px 0px 0px;'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_task = $("<tr></tr>").appendTo($table_task);
					var $td_task = $("<td style='padding-left: 20px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_ltask").text(JS_RECENT_TASK).appendTo($tr_task);
					$tr_task = $("<tr></tr>").appendTo($table_task);						
					$td_task = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 100px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_task);					
					var $div_task = $("<div style='height: 100px; width: 102%; overflow-y: scroll;'></div>").appendTo($td_task);										
					
					var $odometer = 0;
					var $engineHour = 0;
					var oneIoVal = getIdValue("A:", marker.properties.io);						
					if(oneIoVal != null){						
						$odometer = mileageUnitConversion(oneIoVal, JS_UNIT_DISTANCE);
					}
					
					$engineHour = getIdValue("11:", marker.properties.io);
					
					if(geoname && !track && !queryingMaTa){	
						$div_task.addClass("query_waiting");
						$div_maintainance.addClass("query_waiting");												
						getLastMaTa(keyid, $div_maintainance, $div_task, $odometer, $engineHour);
					}else{
						showLastMaTa(keyid, $div_maintainance, $div_task, $odometer, $engineHour);
					}
					
					/*photo info*/
					$tr_end = $("#assetinfo #statuslist tr:eq(0)");	
					$td_end = $("<td rowspan='6' valign='top' style='border-left: 10px solid #fff; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;' bgcolor='#fff'></td>").appendTo($tr_end);
					var $table_photo = $("<table style='margin: -3px 0px 0px 0px'></table>").addClass("tab_status").appendTo($td_end);
					var $tr_photo = $("<tr></tr>").appendTo($table_photo);
					var $td_photo = $("<td id='sta_last_photo_title' style='padding-left: 20px; white-space: nowrap; border-top: 0px solid; border-left: 5px solid #F5F5F5;'></td>").addClass("info_lphoto").text(JS_LAST_PHOTO).appendTo($tr_photo);
					$tr_photo = $("<tr></tr>").appendTo($table_photo);						
					$td_photo = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 150px; border-left: 5px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_photo);
					var $div_photo = $("<div id='sta_last_photo' style='min-width: 150px; min-height: 100px; text-align: center; overflow-y: hidden;'></div>").appendTo($td_photo);																	
					
					if(geoname && !track && !queryingPhoto){	
						$div_photo.addClass("query_waiting");
						getLastPhoto(keyid, $div_photo);
					}else{
						displayLastPhoto(keyid, $div_photo);
					}					
						
					$("#assetinfo").animate({scrollLeft: -$scroll_left}, 0);
				}
										
				if(typeof track != "undefined" && track){
					map.AddTrackPoint(keyid, marker.properties.x, marker.properties.y, marker.properties.s, marker.properties.t, marker.properties.dir, null, ANIMATION_TIME);
				}
				
				map.MoveTop(marker);		
			}			
        }
    //}catch(e){}
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
						datas.tire.push(row[1].length == 0 ? 0:tpmsUnitConversion(parseFloat(row[1]), JS_UNIT_TPMS));
						/*
						if(JS_UNIT_TPMS == 1){
							datas.tire.push(parseFloat((parseFloat(row[1]) * 100).toFixed(1)));
						}else if(JS_UNIT_TPMS == 2){
							datas.tire.push(parseFloat((parseFloat(row[1]) * 14.5).toFixed(1)));
						}else if(JS_UNIT_TPMS == 3){
							datas.tire.push(parseFloat((parseFloat(row[1]) * 1.02).toFixed(1)));
						}else{
							datas.tire.push(parseFloat(parseFloat(row[1]) .toFixed(1)));
						}
						*/						
						//temp
						datas.temp.push(row[2].length == 0 ? 0:tempUnitConversion(parseFloat(row[2]), JS_UNIT_TEMPERATURE));
						/*if(JS_UNIT_TEMPERATURE == 1){
							datas.temp.push(parseFloat((parseFloat(row[2]) * 1.8 + 32).toFixed(1)));
						}else{
							datas.temp.push(parseFloat(parseFloat(row[2]).toFixed(1)));
						}*/
						
						//bat
						datas.bat.push(row[3].length == 0 ? 0:parseFloat(parseFloat(row[3]).toFixed(0)));
					}
				}
			}
		}		
	}
	
	return datas;
}

function initscmd(keyid, $element, sta_table){
	if(typeCmd == null || typeCmd.length == 0){
		return;
	} 
	var typeid = getTypeById(keyid);
	var $table_scmd = $("<table></table>").appendTo($element);
	
	//if(issupportcmd(typeid, 6)){
		//cut command
		var $tr_scmd = $("<tr></tr>").appendTo($table_scmd);
		var $td_scmd_name = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);
		$("<label>"+JS_CMD_ENABLE_IMMOBILIZER+"</label>").appendTo($td_scmd_name);
		$td_scmd_btn = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);	
		var $scmd_cut = $("<input type='checkbox' id='scmd_cut' class='cmdcheckbox'></input>").appendTo($td_scmd_btn);
		$("<label class='cmdswitch' for='scmd_cut'></label>").appendTo($td_scmd_btn);
		
		$('#scmd_cut').click(function () {
			if($('#scmd_cut').prop("checked")){
				sendScommand(keyid, 6, null, $scmd_cut);
			}
		});
			
		if(sta_table != null && sta_table.indexOf("301D") != -1){
			$('#scmd_cut').prop("checked", true);
		}
	//}
	
	//if(issupportcmd(typeid, 7)){		
		//uncut command
		var $tr_scmd = $("<tr></tr>").appendTo($table_scmd);
		var $td_scmd_name = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);
		$("<label>"+JS_CMD_DISABLE_IMMOBILIZER+"</label>").appendTo($td_scmd_name);
		$td_scmd_btn = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);	
		var $scmd_uncut = $("<input type='checkbox' id='scmd_uncut' class='cmdcheckbox'></input>").appendTo($td_scmd_btn);
		$("<label class='cmdswitch' for='scmd_uncut'></label>").appendTo($td_scmd_btn);
		
		$('#scmd_uncut').click(function () {
			if($('#scmd_uncut').prop("checked")){
				sendScommand(keyid, 7, null, $scmd_uncut);
			}
		});
		
		/*if(sta_table != null && sta_table.indexOf("301D") != -1){
			$('#scmd_uncut').prop("checked", true);
		}*/
	//}
	
	//if(issupportcmd(typeid, 653)){
		//arm command
		var $tr_scmd = $("<tr></tr>").appendTo($table_scmd);
		var $td_scmd_name = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);
		$("<label>"+JS_CMD_ARM+"</label>").appendTo($td_scmd_name);
		$td_scmd_btn = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);	
		var $scmd_arm = $("<input type='checkbox' id='scmd_arm' class='cmdcheckbox'></input>").appendTo($td_scmd_btn);
		$("<label class='cmdswitch' for='scmd_arm'></label>").appendTo($td_scmd_btn);
		
		$('#scmd_arm').click(function () {
			if($('#scmd_arm').prop("checked")){
				sendScommand(keyid, 653, null, $scmd_arm);
			}
		});
			
		if(sta_table != null && sta_table.indexOf("3007") != -1){
			$('#scmd_arm').prop("checked", true);
		}
	//}
	
	//if(issupportcmd(typeid, 665)){
		//disarm command
		var $tr_scmd = $("<tr></tr>").appendTo($table_scmd);
		var $td_scmd_name = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);
		$("<label>"+JS_CMD_DISARM+"</label>").appendTo($td_scmd_name);
		$td_scmd_btn = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);	
		var $scmd_disarm = $("<input type='checkbox' id='scmd_disarm' class='cmdcheckbox'></input>").appendTo($td_scmd_btn);
		$("<label class='cmdswitch' for='scmd_disarm'></label>").appendTo($td_scmd_btn);
		
		$('#scmd_disarm').click(function () {
			if($('#scmd_disarm').prop("checked")){
				sendScommand(keyid, 665, null, $scmd_disarm);
			}
		});
			
		if(sta_table != null && sta_table.indexOf("3008") != -1){
			$('#scmd_disarm').prop("checked", true);
		}
	//}
	
	//if(issupportcmd(typeid, 4)){
		//lock command
		var $tr_scmd = $("<tr></tr>").appendTo($table_scmd);
		var $td_scmd_name = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);
		$("<label>"+JS_CMD_LOCK_DOOR+"</label>").appendTo($td_scmd_name);
		$td_scmd_btn = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);	
		var $scmd_lock = $("<input type='checkbox' id='scmd_lock' class='cmdcheckbox'></input>").appendTo($td_scmd_btn);
		$("<label class='cmdswitch' for='scmd_lock'></label>").appendTo($td_scmd_btn);
		
		$('#scmd_lock').click(function () {
			if($('#scmd_lock').prop("checked")){
				sendScommand(keyid, 4, null, $scmd_lock);
			}
		});
			
		if(sta_table != null && sta_table.indexOf("3002") != -1){
			$('#scmd_lock').prop("checked", true);
		}
	//}
	
	//if(issupportcmd(typeid, 5)){
		//unlock command
		var $tr_scmd = $("<tr></tr>").appendTo($table_scmd);
		var $td_scmd_name = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);
		$("<label>"+JS_CMD_UNLOCK_DOOR+"</label>").appendTo($td_scmd_name);
		$td_scmd_btn = $("<td class='scmd' nowrap='nowrap' style='border-left: 0px solid; border-right: 0px solid; border-top: 0px solid;  border-bottom: 1px solid #EEE; padding: 2px;'></td>").appendTo($tr_scmd);	
		var $scmd_unlock = $("<input type='checkbox' id='scmd_unlock' class='cmdcheckbox'></input>").appendTo($td_scmd_btn);
		$("<label class='cmdswitch' for='scmd_unlock'></label>").appendTo($td_scmd_btn);
		
		$('#scmd_unlock').click(function () {
			if($('#scmd_unlock').prop("checked")){
				sendScommand(keyid, 5, null, $scmd_unlock);
			}
		});
			
		if(sta_table != null && sta_table.indexOf("3001") != -1){
			$('#scmd_unlock').prop("checked", true);
		}
	//}
}

function issupportcmd(typeid, cmdid){
	var support = false;
	var jo;
	
	if(typeCmd != null){
		for(var i = 0; i < typeCmd.length; i++) {
			if(typeCmd[i].tid == typeid){
				jo = typeCmd[i];
				if(cmdid == typeCmd[i].cid){
					support = true;
					break;
				}
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
		$.get("command.ajax.php", req, function(data) {	
			if (data.indexOf('ok') >= 0) {
				//do nothing
			} else{
				$btn.prop("checked",false);
			}
		});
	}catch(e){$btn.prop("checked",false);}
}

function link_marker(keyid){
	try{
        if(typeof map != "undefined"){
            map.LinkMarker(keyid);
        }
    }catch(e){}
}

function findpageitem(tab, flag){
    var ret = false;
    var $item, index = 0;
	/*if($("#asset_list_item").val() == "1"){
		$item = $(tab+" .tree_table").find("tbody tr[c*='"+flag+"']");		
	}else if($("#asset_list_item").val() == "2"){
		$item = $(tab+" .tree_table").find("tbody tr[nc*='"+flag+"']");
	}else if($("#asset_list_item").val() == "3"){
		$item = $(tab+" .tree_table").find("tbody tr[si*='"+flag+"']");
	}else if($("#asset_list_item").val() == "4"){
		$item = $(tab+" .tree_table").find("tbody tr[dn*='"+flag+"']");
	}else{
		index = 1;
		$item = $(tab+" .tree_table").find("tbody tr[t*='"+flag+"']");
	}*/
	
	if($("#asset_list_item").val() == "1"){
		$item = $(tab+" .tree_table").find("tbody tr[c='"+flag+"']");		
	}else if($("#asset_list_item").val() == "2"){
		$item = $(tab+" .tree_table").find("tbody tr[nc='"+flag+"']");
	}else if($("#asset_list_item").val() == "3"){
		$item = $(tab+" .tree_table").find("tbody tr[si='"+flag+"']");
	}else if($("#asset_list_item").val() == "4"){
		$item = $(tab+" .tree_table").find("tbody tr[dn='"+flag+"']");
	}else{
		index = 1;
		$item = $(tab+" .tree_table").find("tbody tr[t*='"+flag+"']");
	}
	
    if($item.length > 0){
        var $tr = $item.eq(0);/*first row*/
        if($lastselect){
			if(index == 0){
				$lastselect.removeClass("active");
				$lastselect.next().removeClass("active");
			}else{
				$lastselect.removeClass("gractive");
			}				
        }
		if(index == 0){
			$tr.addClass("active");	
			$tr.next().addClass("active");	
		}else{
			$tr.addClass("gractive");	
		}
			      
        $lastselect = $tr;
        /*test group is close,then opened*/
        var $th = $tr.parent().find("tr th:eq(2)");
		var keyid = parseInt($tr.attr("n"));
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
        
		current_id = keyid;
        map_locate(keyid, true, true, false, false);
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
	var tab = $(".tab_active").attr("target");
	
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
        var tab = $(".tab_active").attr("target");
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
				$.post("devstat.ajax.php?t=" + new Date().getTime(), {"objid": objid}, function(data){
					if(data != ""){
						try{
							if(data == "nologin"){
								 if(timer){
									clearTimeout(timer);
									timer = null;
									nologin = true;
									window.location.href="../login.php"; 
								}
							}else{
								needloc = false;
								var result = eval('(' + data + ')');
								refresh_list(result);
								updateDevice(result.data, current_id, map, result.first);
								
								if($("#dlg_objstatechart").css("display")=="block"){
									showObjChart();
								}
								checkTabbarScrollbar();
								/*if(needloc && current_id > 0){
									map_locate(current_id, false, false);
								}
								json = null;*/
							}											
						}catch(e){alert(e.message);}
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
			if(needUpdateUser){
				loadUser();
			}
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
	JS_GROUP = null;
	JS_DEVICE_NO4ID = null;
	JS_DEVICE_SIM4ID = null;
	JSDEVICE_DRIVER4ID = null;
    if(typeof map != "undefined"){
        try{ map.Free(); map = null; }catch(e){}
    }
}
function oninit() {
    /**/
}

function onLoadGoogle(){
	 if(JS_GOOGLE_TYPE == 1){
		 loadScript("https://maps.googleapis.com/maps/api/js?key="+JS_GOOGLE_KEY, onLoadGoogleMutant());
	 }else{
		 onLoadGoogleMutant();
	 }
}

function onLoadGoogleMutant(){
	loadScript("map/leaflet/Leaflet.GoogleMutant.js",onLoadMap);
}

function onLoadMap(){
    /*loading map*/
    var opts = {
        centerLng: JS_DEFAULT_LNG,
        centerLat: JS_DEFAULT_LAT,
        zoom: JS_DEFAULT_ZOOM
    };	
    map = new MapOperat("map", opts, true, true, false); 
	ext = new MapExtend(map.GetMap(), false, false);
	
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
	
	loadPlace();
	loadUserCommand();
	loadUser();
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
	$("#maptools #ed_measure").attr('title',JS_ENABLE_DISABLE_MEASURE);
	$("#maptools #ed_ruler").attr('title',JS_ENABLE_DISABLE_RULER);
	$("#maptools #ed_navigation").attr('title',JS_ENABLE_DISABLE_NAVIGATION);
	$("#maptools #ed_street_view").attr('title',JS_ENABLE_DISABLE_STREETVIEW);
	$("#maptools #ed_task").attr('title',JS_DISABLE_TASK);
	$("#maptools #ed_driver").attr('title',JS_ENABLE_DISABLE_DRIVER);
	
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
	
	$("#maptools #ed_measure").parent().unbind("click").click(function() {
		if(($("#maptools #ed_measure").hasClass("tool_active"))){
			$("#maptools #ed_measure").removeClass("tool_active");
			$("#maptools #ed_measure").css({opacity:0.5});
			map.ActiveMeasureTool(false);
		}else{						
			$("#maptools #ed_measure").addClass("tool_active");
			$("#maptools #ed_measure").css({opacity:1.0});
			map.ActiveMeasureTool(true);
			
			$("#maptools #ed_ruler").removeClass("tool_active");
			$("#maptools #ed_ruler").css({opacity:0.5});
			map.ActiveRulerTool(false);
			
			$("#maptools #ed_navigation").removeClass("tool_active");
			$("#maptools #ed_navigation").css({opacity:0.5});
			map.ActiveNavigationTool(false);
		}
	});
	
	$("#maptools #ed_ruler").parent().unbind("click").click(function() {
		if(($("#maptools #ed_ruler").hasClass("tool_active"))){
			$("#maptools #ed_ruler").removeClass("tool_active");
			$("#maptools #ed_ruler").css({opacity:0.5});
			map.ActiveRulerTool(false);						
		}else{						
			$("#maptools #ed_ruler").addClass("tool_active");
			$("#maptools #ed_ruler").css({opacity:1.0});
			map.ActiveRulerTool(true);
			
			$("#maptools #ed_measure").removeClass("tool_active");
			$("#maptools #ed_measure").css({opacity:0.5});
			map.ActiveMeasureTool(false);
			
			$("#maptools #ed_navigation").removeClass("tool_active");
			$("#maptools #ed_navigation").css({opacity:0.5});
			map.ActiveNavigationTool(false);
		}
	});
	
	$("#maptools #ed_navigation").parent().unbind("click").click(function() {
		if(($("#maptools #ed_navigation").hasClass("tool_active"))){
			$("#maptools #ed_navigation").removeClass("tool_active");
			$("#maptools #ed_navigation").css({opacity:0.5});
			map.ActiveNavigationTool(false);						
		}else{						
			$("#maptools #ed_navigation").addClass("tool_active");
			$("#maptools #ed_navigation").css({opacity:1.0});
			
			$("#maptools #ed_ruler").removeClass("tool_active");
			$("#maptools #ed_ruler").css({opacity:0.5});
			map.ActiveRulerTool(false);
			
			$("#maptools #ed_measure").removeClass("tool_active");
			$("#maptools #ed_measure").css({opacity:0.5});
			map.ActiveMeasureTool(false);
			
			map.ActiveNavigationTool(true);
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
				map_locate(current_id, true, true, false, true);
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
	
	$("#streetview_img").unbind("click").click(function() {
		var x = $('#maptools #ed_street_view').attr("x");
		var y = $('#maptools #ed_street_view').attr("y");
		var dir = $('#maptools #ed_street_view').attr("dir");
		openStreetView(x,y,dir);
	});
	
	$('#asset_list_item').change(function () {		
		if($("#asset_list_item").val() == "1"){
			 var deviceList = getDeviceList();
			 $("#device").attr('placeholder',JS_ASSET_NAME);
			 $("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}else if($("#asset_list_item").val() == "2"){
			 var deviceList = getIDsList();
			 $("#device").attr('placeholder',JS_DEVICE_ID);
			 $("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}else if($("#asset_list_item").val() == "3"){
			var deviceList = getSimList();
			$("#device").attr('placeholder',JS_SIMCARD_NO);
			$("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}else if($("#asset_list_item").val() == "4"){
			var deviceList = getDriverList();
			$("#device").attr('placeholder',JS_DRIVER_NAME);
			$("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}else{
			var deviceList = getGroupList();
			$("#device").attr('placeholder',JS_GROUP_NAME);
			$("#device").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0 : 2,max:10,scroll:true,delay:0});
		}
	});
	
	/*share position search*/
    $("#share_position_search").click(function(){
		var mgrshare_position_item = $("#mgrshare_position_item").val();
        var mgrshare_position_cond = $("#mgrshare_position_cond").val();
        if(mgrshare_position_cond == "")return;
		
		if(mgrshare_position_item == "1"){
            locate_table("#share_position_list", "sn", mgrshare_position_cond, true);
        }
    });
}

//load user command
function loadUserCommand(){
	$.get("commandinfo.ajax.php", function(data){
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
	$.post("manage.ajax.php", {type:6,full:1}, function(data) {
		if($.trim(data) != ""){
			var result = eval('(' + data + ')');					   
			if(result != null && typeof result != "undefined"){
				if(result.list != null){
					needUpdatePlace = false;
					geoList = result.list;
					for(var a = 0; a < geoList.length; a++){
						var o = geoList[a];
						JS_PLACE_NAME4ID[o.zid] = o.an;
						JS_PLACE_ID4NAME[o.an] = o;
					}
					
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

//load user list
function loadUser(){	
	$.post("manage.ajax.php", {type:1}, function(data) {
		if($.trim(data) != ""){
			var result = eval('(' + data + ')');					   
			if(result != null && typeof result != "undefined"){
				
				if(result.list != null){
					var jo;
					var list = result.list;
					needUpdateUser = false;
					array_users = [];
				
					for(var i = 0; i < list.length; i++)
					{
						jo = list[i];
						array_users.push(jo.uname);					
					}
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

function showView(objs, show){
    var $view = $(objs);
    if(show){
        $view.css("visibility","visible");
		$view.css("z-index","1");
    } else {
        $view.css("visibility","hidden");
		$view.css("z-index","-1");
    }
}

function showPage(target, page){
    if(target.id == "nav_current")return;
    /*change current*/
    document.getElementById("nav_current").id = "";
    target.id = "nav_current";
    /**/
    var framefile="";
    switch(page){
        case "monitor":
            showView("#frm", false); showView("#sch, #mod, #tip, #map, #geo, #speedcompass, #streetview_img, #maptools, #assetinfo, #stasep", true);
			$('#speedcompass .content *').attr('visibility', 'visible');
            break;
        case "playback":			
            framefile = "playback.view.php";
            break;
        case "stastics":
            framefile = "stastics.view.php";
            break;
        case "manage":
            framefile = "manage.view.php";
            break;
        case "setting":
            framefile = "setting.view.php";
            break;
    }
    if(framefile != ""){
        showView("#frm", true); showView("#sch, #mod, #tip, #map, #geo, #speedcompass, #streetview_img, #maptools, #assetinfo, #stasep", false);
		$('#speedcompass .content *').attr('visibility', 'hidden');
        var iframe = document.getElementById("frame_content");
        //test old frame.( fast playback need load each time )
        if(iframe.src.indexOf(framefile)<0 || (framefile == "playback.view.php" && this.fastHistoryValue != null)){
            iframe.height = document.body.clientHeight - (OffsetH);
            iframe.width = document.body.clientWidth - OffsetW;
            iframe.src = framefile;
        }
    }
}

function showFastHistory(fastHistoryValue){
	$("#mnuOperat").hide();
	this.fastHistoryValue = fastHistoryValue;
    var target = document.getElementsByClassName("playback")[0];	
	showPage(target, 'playback');
}

function showUseInfo(){
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	$.post("manage.ajax.php", {"type":1, "usrid":-1, "view":1}, function(data) {
        clearTimeout(timer);
		showLoading(false);
		try {
			var json = eval('(' + data + ')');
            var jo = json[0];
		    var Wnd = $("#dlg_useinfo");
		    $(Wnd).css("display", "block");
		    $("body").append("<div class='modalmask'></div>");
		    $(Wnd).append("<span id='close' class='dialog_cancel'></span>");
		    $(Wnd).find("#close").click(function(){
		        $(Wnd).css("display", "none");
		        $(this).remove();
		        $(".modalmask").remove();
		    });
		    
		    $(Wnd).find("#button_cancel").click(function(){
		    	$(Wnd).css("display", "none");
				$(Wnd).find("#close").remove();
		        $(".modalmask").remove()
		    });
		    
		    $(Wnd).css("top", Math.round(document.body.clientHeight / 2 - $(Wnd).height() / 3 * 2) + "px");
		    $(Wnd).css("left", Math.round(document.body.clientWidth / 2 - $(Wnd).width() / 2) + "px");

		    $(Wnd).find("#username").val(jo.uname);
		    $(Wnd).find("#loginname").val(jo.login);
		    $(Wnd).find("#useremail").val(jo.email);
			$(Wnd).find("#emailreport").prop("checked", jo.rmail==1);
		    $(Wnd).find("#emailoffset").val(jo.rtime);
			$(Wnd).find("#available").prop("checked", jo.valid==1);
		    $(Wnd).find("#userphone").val(jo.uphone);
		    $(Wnd).find("#limitcar").val(jo.olimit);
			$(Wnd).find(".itext ,.icheck").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
        } catch(e) {showLoading(false);}
	});
}


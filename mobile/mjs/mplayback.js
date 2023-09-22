var map, globalData = '', track, hisData = [], events = [], playtimer, tmrChange, speed=1000, isQueryTimeout = false, needBound = false, currentChart = [], symbol4Color = [], chart4SymbolColor = [], charts;
var play = {ico: 0, objid: 0, oflag:"", pos: 0, run: false};

//Ico, play.objid, play.oflag, play.pos, play.run = false
function stopHistory(){
    play.run = false;
    if(playtimer){
        clearTimeout(playtimer);
        playtimer = null;
    }
}

function playHistory(top){
    if(play.pos >= 0 && play.pos < hisData.length){
        var j = hisData[play.pos];		
        var p = getSpeedState(1, 1, j.s, j.tg, timeIsEvent(j.tg) ? 1:0, getIdValue("43:", j.q, true), j.st);//defaul online and gpsvalid and no alarm
		var ftime = (j.tg == null || j.tg.length == 0) ? j.tg : $.format.date(j.tg, JS_DEFAULT_DATETIME_fmt_JS);
		var fstime = (j.ts == null || j.ts.length == 0) ? j.ts : $.format.date(j.ts, JS_DEFAULT_DATETIME_fmt_JS);
        map.DrawIcon(play.objid, play.oflag, null, null, 1, j.x, j.y, play.ico, p.sta, j.d, ftime, fstime, p.spd, 0, true, p.val,j.st, j.q, null, getIdValue("5F:", j.q, true), getIdValue("5E:", j.q, true), speed);
        map.LocateMarker(play.objid, true, false, needBound);
		needBound = true;
        play.pos++;
        if(play.run){
            playtimer = setTimeout('playHistory(true);', speed);
        }		
    }else{
        if(play.run){
            $("#play").click();
        }
    }
}

function queryTimeout(){
	showLoading(false,true);
	$("#queryhis").removeClass("disable").addClass("enable").bind("click", doSearch);
	isQueryTimeout = true;
}

function timeIsEvent(time){	
	if(events != null && typeof events != "undefined"){
		for(var i = 0; i < events.length; i++){
			if(events[i].t == time){
				return true;
			}
		}
	}
	return false;
}

function doSearch(){
	isQueryTimeout = false;
	needBound = false;
    var oflag = $("#oflag").val();    
    if(oflag == ""){
		$("#oflag").addClass("invalidbox");
        return;
    }else{
		$("#oflag").removeClass("invalidbox");
	}
    var objid = getIdByFlag(oflag);
	if(objid == null || typeof objid == undefined){
		$("#oflag").addClass("invalidbox");
        return;
    }else{
		$("#oflag").removeClass("invalidbox");
	}
    var day = parseFloat(eval($("#day").val()));
	var event = $("#event_mark").val() == "1" ? 1 : 0;	
	var stop = $("#stop_mark").val() == "1" ? $("#stop_duration").val() : 0;
	
	if(event == 0){
		$("#maptools_ext #ed_event").removeClass("tool_active");
		$("#maptools_ext #ed_event").css({opacity:0.5});
		map.ToggleEventLayer(false);
	}else{
		$("#maptools_ext #ed_event").addClass("tool_active");			
		$("#maptools_ext #ed_event").css({opacity:1.0});
		map.ToggleEventLayer(true);
	}
	
	if(stop == 0){
		$("#maptools_ext #ed_stop").removeClass("tool_active");
		$("#maptools_ext #ed_stop").css({opacity:0.5});
		map.ToggleStopLayer(false);
	}else{
		$("#maptools_ext #ed_stop").addClass("tool_active");			
		$("#maptools_ext #ed_stop").css({opacity:1.0});
		map.ToggleStopLayer(true);
	}
	
    var param;
    if(day < 0){
        var time1 = $("#history_date_from").val();
        if(time1 == ""){
            $("#history_date_from").focus();
            return;
        }
        var time2 = $("#history_date_to").val();
        if(time2 == ""){
            $("#history_date_to").focus();
            return;
        }
        param = { "objid": objid, "day": day, "time1": time1, "time2": time2, "stop": $("#stop_duration").val(), "event": 1, "ptype": $("#position_type").val(), "btype": $("#playback_type").val()};
    }else{
        param = { "objid": objid, "day": day, "stop": $("#stop_duration").val(), "event": 1, "ptype": $("#position_type").val(), "btype": $("#playback_type").val()};
    }
    $("#queryhis").removeClass("enable").addClass("disable").unbind("click");

	$("#play").unbind("click");
	if(play.run){$("#play").click();}
    map.ClearTrack(objid);
	map.ClearTrack(historyid);
    hisData = [];
	events = [];
    showLoading(true);
	var timer = setTimeout("queryTimeout(false)", 120000);
	map.Zoom(12);
	$("#general tbody").empty();
	$("#hisroute tbody").empty();
	$('#select_chart').empty();	
	$("#chart_div").empty();
	$("#tab_speedchart").empty();
	$("#tab_ignitionchart").empty();
	$("#tab_fuelchart").empty();
	$("#tab_tempchart").empty();
	$("#tab_altitudechart").empty();
	$("#table_movesdetail").find("tbody").remove();
	
    try{
        $.get("../playback.ajax.php", param, function(data) {
            clearTimeout(timer);
			showLoading(false);
            try{
                var json = eval('(' + data + ')');
                if(json != null && typeof json.error != "undefined"){
                     showMessage("stop", JS_PLAY_TITLE, json.error, 10);
                } else if(json != null && typeof json.item != "undefined" && json.item.length > 0){
                    globalData = data;
                    hisData = json.item;
					events = json.events;
					var stops = json.stops;
					var moves = json.moves;
					initChartDisplay(hisData, json.ctsensor, json.rfuel, json.sfuel);
					drawSpeedChart(hisData);
					/*drawIgnitionChart(hisData);
					drawFuelChart(hisData, json.rfuel, json.sfuel);
					drawTempChart(hisData);
					drawAltitudeChart(hisData);*/
					toRouteIndex(events, stops, moves, hisData[0].tg, hisData[hisData.length - 1].tg, hisData);
					showMovesDetail(moves);					
                    play.objid = objid;
                    play.oflag = oflag;
                    play.ico = json.ico;					
					
					//播放下一个前把上一个播放的marker还原
					if(historyMarkerLast != null && historyid != objid){
						map.RemoveMarker(historyid);
						var item = $("#tab_all .tree_table").find("tbody tr[n="+historyid+"]").find("td:eq(0) input");
						if(item.is(":checked")){							
							map.AddMarker(historyid, historyMarkerLast);
						}						
					}
					
					if(historyid != objid){
						historyMarkerLast = map.GetAndRemoveMarker(objid);
					}	
					historyid = objid;
					showHistoryNavbar(true);
					showPage('page_map');					
   
                    var j = hisData[0];
                    var p = getSpeedState(1, 1, j.s, j.tg, timeIsEvent(j.tg) ? 1:0, getIdValue("43:", j.q, true), j.st);
					var ftime = (j.tg == null || j.tg.length == 0) ? j.tg : $.format.date(j.tg, JS_DEFAULT_DATETIME_fmt_JS);
					var fstime = (j.ts == null || j.ts.length == 0) ? j.ts : $.format.date(j.ts, JS_DEFAULT_DATETIME_fmt_JS);
                    map.DrawIcon(play.objid, play.oflag, null, null, 1, j.x, j.y, play.ico, p.sta, j.d, ftime, fstime, p.spd, 0, true, p.val,j.st, j.q, null, getIdValue("5F:", j.q, true), getIdValue("5E:", j.q, true), speed);	
					map.HideShowMarker(true,play.objid);
					
					var nstops = $("#maptools_ext #ed_stop").hasClass("tool_active");
					var nevents = $("#maptools_ext #ed_event").hasClass("tool_active");
					var nangles = $("#maptools_ext #ed_arrow").hasClass("tool_active");
					var ntimes = $("#maptools_ext #ed_point").hasClass("tool_active");
                    map.DrawTrackLine(play.objid, hisData, { point: true }, stops, nstops, events, nevents, nangles, ntimes, moves);				                  				
					play.pos = 0;                 
					playHistory(true);
					
					
					var $tbody = $("<tbody></tbody>").appendTo($("#general"));
					var $tr = $("<tr></tr>").appendTo($tbody);
                    $("<td></td>").text(NAVI_DISTANCE).append("("+UNIT_DIST+"):").appendTo($tr);
                    $("<td></td>").text(json.m).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_DIVTIME).appendTo($tr);
                    $("<td></td>").text(json.dt).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_STOPTIME).appendTo($tr);
                    $("<td></td>").text(json.st).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_AVSPEED).append("("+UNIT_SPEED+"):").appendTo($tr);
                    $("<td></td>").text(json.s).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_MAXSPEED).append("("+UNIT_SPEED+"):").appendTo($tr);
                    $("<td></td>").text(json.ms).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_IDLETIME).appendTo($tr);
                    $("<td></td>").text(json.it).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_LOADTIME).appendTo($tr);
                    $("<td></td>").text(json.dut).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_SENSOR_FUEL_CONSUMPTION).append("("+UNIT_FUEL+"):").appendTo($tr);
                    $("<td></td>").text(json.sfc).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_ESTIMATE_FUEL_CONSUMPTION).append("("+UNIT_FUEL+"):").appendTo($tr);
                    $("<td></td>").text(json.efc).appendTo($tr);					
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_CAN_FUEL_CONSUMPTION).append("("+UNIT_FUEL+"):").appendTo($tr);
                    $("<td></td>").text(json.cfc).appendTo($tr);					
					$tr = $("<tr></tr>").appendTo($tbody);
					
					$("<td></td>").text(NAVI_SPEEDING_DIST).append("("+UNIT_DIST+"):").appendTo($tr);
                    $("<td></td>").text(json.spd).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_SPEEDING_TIME).appendTo($tr);
                    $("<td></td>").text(json.spt).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_SPEEDING_COUNT).appendTo($tr);
                    $("<td></td>").text(json.spc).appendTo($tr);
					$tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text(NAVI_ENGINE_COUNT).appendTo($tr);
                    $("<td></td>").text(json.engc).appendTo($tr);										
					
					$("#play").click(function(){
						map.ShowHideMovesLine(play.objid, null, null, false);
						if(!play.run){
							$("#play i").removeClass("icon-navbar-stop");
							$("#play i").addClass("icon-navbar-play");
							play.run = true;
							if(play.pos >= hisData.length){play.pos = 0;}
							playHistory(true);
						}else{
							$("#play i").removeClass("icon-navbar-play");
							$("#play i").addClass("icon-navbar-stop");
							stopHistory();
						}
					});
					
					$("#playspeed").change(function(){
						speed = parseInt($(this).val());
					});
					
					pagechanged('#tab_chart');
                }
            }catch(e){
				//alert(e);
                showMessage("stop", JS_PLAY_TITLE, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeout){
				$("#queryhis").removeClass("disable").addClass("enable").bind("click", doSearch);
			}           
        });
    }catch(e){
		error(showLoading(false));
		$("#queryhis").removeClass("disable").addClass("enable").bind("click", doSearch);
	}
};

function popSymbolColor(){
	return symbol4Color.pop();
}

function initChartDisplay(tracks, ctsensor, rfuel_, sfuel_){
	currentChart = [];
	chart4SymbolColor = [];
	
	symbol4Color = [];	
	symbol4Color[4] = {symbol: 'circle', color: '#5D8AA8'/*'#80B4E5'*/};
	symbol4Color[3] = {symbol: 'diamond', color: '#9CC602'};
	symbol4Color[2] = {symbol: 'square', color: '#FAB444'};
	symbol4Color[1] = {symbol: 'triangle', color: '#1CBA00'};
	symbol4Color[0] = {symbol: 'triangle-down', color: '#008E8E'};
	
	$('#select_chart').empty();	
	$items = $("<select id='chart_display' style='width:200px;' multiple></select>").appendTo('#select_chart');
	$item = $("<option></option>").appendTo($items);
	$item.attr("value", 66);
	$item.attr("st", 2);
	$item.attr("selected", true);
	$item.text(JS_SPEED);
	
	$item = $("<option></option>").appendTo($items);
	$item.attr("value", 69);
	$item.attr("st", 1);
	$item.text(JS_IGNITION);
	
	$item = $("<option></option>").appendTo($items);
	$item.attr("value", 30);
	$item.attr("st", 2);
	$item.text(JS_NAVI_CHART_FUEL_1);
	
	$item = $("<option></option>").appendTo($items);
	$item.attr("value", 72);
	$item.attr("st", 2);
	$item.text(JS_NAVI_CHART_TEMP_1);
			
	if(ctsensor != null && typeof ctsensor != "undefined"){
		for(var i = 0; i < ctsensor.length; i++){
			var sn = ctsensor[i].sn; 
			var eid = ctsensor[i].eid; 
			var st = ctsensor[i].st; 	
			$("#chart_display option[value="+eid+"]").remove(); 
			
			$item = $("<option></option>").appendTo($items);
			$item.attr("value", eid);
			$item.attr("st", st);
			if(eid == 66 || eid == 69 || eid == 30 || eid == 72){
				//$item.attr("selected", true);
			}			
			$item.text(sn);
		}
	}
	currentChart = $("#chart_display").val() == null ? [] : ($("#chart_display").val()).toString().split(",");
	
	var selectCharts = new vanillaSelectBox("#chart_display", {
        "maxHeight": 130, 
		"minWidth": 60,
        "search": false,
		"disableSelectAll": true,
		"placeHolder": JS_INFO_SELECT,
		"maxSelect": 4, 
        "translations": { "all": JS_SELECT_ALL_ITEM, "items": JS_SELECT_ITEMS,"selectAll":JS_SELECT_ALL,"clearAll":JS_SELECT_CLEAR_ALL }
    });
	
	$('#chart_display').change(function(){
		var deleteItems = [];
		var newItems = [];
		var after_items = $("#chart_display").val() == null ? [] : ($(this).val()).toString().split(",");
				
		for(var i = 0; i < currentChart.length; i++){
			if(after_items.indexOf(currentChart[i]) < 0){
				//been deleted
				deleteItems.push(currentChart[i]);
			}
		}
		
		for(var i = 0; i < after_items.length; i++){
			if(currentChart.indexOf(after_items[i]) < 0){
				//new
				newItems.push(after_items[i]);
			}
		}
		
		/*新控件可以设置最大显示数量
		if(after_items.length > 4){
			//max select 3 items
			for(var j = 0; j < newItems.length; j++){
				$("#chart_display option[value="+newItems[j]+"]").removeAttr("selected");
				$("#chart_display option[value="+newItems[j]+"]").prop("selected", false);
				$("#chart_display").trigger('change');				
			}
			showMessage("stop", JS_PLAY_TITLE, JS_MAX_ITEMS, 5);
			return;
		}*/
		
		currentChart = after_items;
		
		//add new chart
		for(var i = 0; i < newItems.length; i++){
			var sn = $("#chart_display option[value="+newItems[i]+"]").text();
			var eid = parseInt(newItems[i]).toString(16).toUpperCase();
			var st = $("#chart_display option[value="+newItems[i]+"]").attr("st");
			addChart(tracks, sn, eid, st, rfuel_, sfuel_);
		}
		
		//delete
		for(var i = 0; i < deleteItems.length; i++){
			var eid = parseInt(deleteItems[i]).toString(16).toUpperCase();
			removeChart(eid);
		}
		
		//只剩下一个轴时显示fillColor
		if(currentChart.length > 1){
			for(var i = 0; i < currentChart.length; i++){
				var idHex = parseInt(currentChart[i]).toString(16).toUpperCase();
				charts.get('chart-axis_'+idHex).series[0].update({ type: 'line' });
			}
		}else{
			for(var i = 0; i < currentChart.length; i++){
				var idHex = parseInt(currentChart[i]).toString(16).toUpperCase();
				charts.get('chart-axis_'+idHex).series[0].update({ type: 'area' });
			}
		}
	});
}

function toRouteIndex(events, stops, moves, start, end, hisData){
	var WP = window.parent;
	var route = [];
	//events
	if(events != null && typeof events != "undefined"){
		var index = 0;
		for(var i = 0; i < events.length; i++){
			if(events[i].x != 0 && events[i].y != 0){
				var row = {
					time: events[i].t,
					type: 1,
					data: events[i],
					index: index
				}
				route.push(row);
				index++;
			}		
		}
	}
	
	//stops
	if(stops != null && typeof stops != "undefined"){
		for(var i = 0; i < stops.length; i++){
			var row = {
				time: stops[i].START_TIME,
				type: 2,
				data: stops[i],
				index: i
			}
			route.push(row);
		}
	}
	
	//moves
	if(moves != null && typeof moves != "undefined"){
		for(var i = 0; i < moves.length; i++){	
			var row = {
				time: moves[i].GPS_TIME_START,
				type: 3,
				data: moves[i]			
			}
			route.push(row);
		}
	}	
	
	route.sort(function(a, b){  
		if(a.time < b.time){  
			return -1;  
		}else if(a.time > b.time){  
			return 1;  
		}  
		return 0;  
	});
	
	if(route != null && typeof route != "undefined"){
		var $table_route = $("<table style='width: 100%; border-collapse:collapse; border-sapcing: 0px 0px;'></table>").appendTo($("#hisroute"));
		//start	
		var time_start = $.format.date(start, WP.JS_DEFAULT_DATETIME_fmt_JS);
		var $tr_start = $("<tr></tr>").appendTo($table_route);
		var $td_start = $("<td style='padding-left: 30px; margin-left: 10px;' title=\""+time_start+"\">"+time_start+"</td>").addClass("route_start").appendTo($tr_start);
		$($td_start).unbind("click").click(function() {
			switchToMap();
			map.ShowHideMovesLine(play.objid, null, null, false);
			map.LocateStartMarker();
		});
		
		for(var i = 0; i < route.length; i++){				
			if(route[i].type == 1){
				//event
				var time_event = $.format.date(route[i].time, WP.JS_DEFAULT_DATETIME_fmt_JS);
				var $tr_event = $("<tr></tr>").appendTo($table_route);	
				var $td_event = $("<td style='padding-left: 30px; margin-left: 10px;' title=\""+time_event+"\">"+time_event+"&nbsp;&nbsp;"+route[i].data.e+"</td>").attr("index_e", route[i].index).addClass("route_event").appendTo($tr_event);

				$($td_event).unbind("click").click(function() {
					switchToMap();
					map.ShowHideMovesLine(play.objid, null, null, false);
					map.LocateEventMarker($(this).attr("index_e"));
				});
			}else if(route[i].type == 2){
				//stop
				var time_stop = $.format.date(route[i].time, WP.JS_DEFAULT_DATETIME_fmt_JS);
				var $tr_stop = $("<tr></tr>").appendTo($table_route);	
				var $td_stop = $("<td style='padding-left: 30px; margin-left: 10px;' title=\""+time_stop+"\">"+time_stop+"&nbsp;&nbsp;"+route[i].data.DURATION+"</td>").attr("index_s", route[i].index).addClass("route_stop").appendTo($tr_stop);
				$($td_stop).unbind("click").click(function() {
					switchToMap();
					map.ShowHideMovesLine(play.objid, null, null, false);
					map.LocateStopMarker($(this).attr("index_s"));
				});
			}else if(route[i].type == 3){
				//move
				var time_move = $.format.date(route[i].time, WP.JS_DEFAULT_DATETIME_fmt_JS);				
				var $tr_move = $("<tr></tr>").appendTo($table_route);
				var $td_move = $("<td style='padding-left: 30px; margin-left: 10px;' title=\""+time_move+"\">"+time_move+"&nbsp;&nbsp;"+route[i].data.DURATION+"&nbsp;("+(route[i].data.DISTANCE/1000).toFixed(1)+"&nbsp;"+WP.UNIT_DIST+")"+"</td>").attr("start", route[i].data.GPS_TIME_START).attr("end", route[i].data.GPS_TIME_END).addClass("route_drive").appendTo($tr_move);
				$($td_move).unbind("click").click(function() {
					switchToMap();
					map.ShowHideMovesLine(play.objid, $(this).attr("start"), $(this).attr("end"), true);
				});
			}	
		}
		//end
		var time_end = $.format.date(end, WP.JS_DEFAULT_DATETIME_fmt_JS);
		var $tr_end = $("<tr></tr>").appendTo($table_route);
		var $td_end = $("<td style='padding-left: 30px; margin-left: 10px;' title=\""+time_end+"\">"+time_end+"</td>").addClass("route_end").appendTo($tr_end);
		$($td_end).unbind("click").click(function() {
			switchToMap();
			map.ShowHideMovesLine(play.objid, null, null, false);
			map.LocateEndMarker();
		});
	}
}

function switchToMap(){
	$("#route span").text(JS_ROUTE);
	$("#route i").removeClass("icon-navbar-map").addClass("icon-navbar-route");
	$("#details_panel").css("display","none");	
	$("#map").css("display","block");
	map.ResizeMapContainer();
}

function locate_table(table, field, value, top, addfield, addvalue){
    $(table + " tbody tr.selected").removeClass("selected").find("td:first-child").css("background-color", "");
    if(value != ""){
        str = "";
		if(addfield == undefined && addvalue == undefined){
			str = table + " tbody tr td["+field+"='"+value+"']";
		}else{
			str = table + " tbody tr td["+field+"='"+value+"']["+addfield+"='"+addvalue+"']";
		}
        var $td = $(str);
        if($td.length > 0){
            var $tr = $td.parent();
            $tr.addClass("selected");
            var $p = $(table);
            if(top==true){
                $p.parent().scrollTop(28);
                if($tr.position().top != 0){
                    $p.parent().scrollTop($tr.position().top);
                }
            }
        }
    }else if(top){
        $(table).parent().scrollTop(0);
    }    
}

function drawSpeedChart(tracks){
	var WP = window.parent;
	$("#chart_div").empty();
	var symbolColor = popSymbolColor();
	chart4SymbolColor['chart-axis_'+42] = symbolColor;
	var datas = [];
	for (var i = 0; i < tracks.length; i++) {
		var speed = tracks[i].s;
		var time = newDate(tracks[i].tg).getTime();
		datas.push([time, speed]);
	}

	charts = Highcharts.chart('chart_div', {
		credits: {
			 text: '',
			 href: ''
		},
		chart: {
			zoomType: 'x',
			panning: true,
            panKey: 'shift'
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
			type: 'datetime'
		},
		yAxis: {
			/*crosshair: {
                label: {
                    enabled: true,
                    format: '{value:.2f}'
                }
            },*/
			id: 'chart-axis_'+42,  //默认显示速度
            labels: {
                align: 'left',
                format: '{value:.f}',
                y: 6,
                x: 2
            },			
			title: {
				text: JS_SPEED + " (" + WP.UNIT_SPEED + ")"
			},
			min: 0,
			gridLineColor: '#EFEFEF',
			gridLineWidth: 0.5
		},
		legend: {
            layout: 'horizontal',
            align: 'right',
            verticalAlign: 'top',
            //x: -90,
            y: -18,
            floating: true,
			symbolHeight: 8
        },
		plotOptions: {
			series: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, symbolColor.color],
						[1, Highcharts.Color(symbolColor.color).setOpacity(0).get('rgba')]
					]
				},
				//cursor: 'pointer',
				events: {
					click: function(e) {
						clickToPlay(e.point.index,true);
					}
			    }
			}
		},		
		series: [{
			type: 'area',
			name: JS_SPEED,
			data: datas,
			yAxis: 'chart-axis_'+42,
			id: 'xaxis_'+42,
			tooltip: {
                valueDecimals: 1
            },
			color: symbolColor.color,
			marker: {
				fillColor: symbolColor.color,
				radius: 4,
				symbol: symbolColor.symbol
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 2
				}
			},
			threshold: null
		}],		
		navigation: {
            buttonOptions: {
                verticalAlign: 'bottom',
				y: 15
            }
        },
		tooltip: {
			positioner: function (labelWidth, labelHeight, point) {
				var tooltipX, tooltipY;
				if (point.plotX + labelWidth > charts.plotWidth) {
					tooltipX = point.plotX + charts.plotLeft - labelWidth - 20;
				} else {
					tooltipX = point.plotX + charts.plotLeft + 20;
				}
				
				//tooltipY = point.plotY + charts.plotTop - 20;
				tooltipY = 40;
				
				return {
					x: tooltipX,
					y: tooltipY
				};
			},
			borderWidth: 1,
			backgroundColor: 'rgba(255,255,255,0.8)',
			
			crosshairs: {
				color: '#BB3333',
				dashStyle: 'solid',//dash
				width: 1
			},
			shared: true,
			pointFormatter: function () {
                var symbol = '',
                    symbolName;

                function setSymbol(symbolName) {
                    switch (symbolName) {
                        case 'circle':
                            symbol = '●';
                            break;
                        case 'diamond':
                            symbol = '♦';
                            break;
                        case 'square':
                            symbol = '■';
                            break;
                        case 'triangle':
                            symbol = '▲';
                            break;
                        case 'triangle-down':
                            symbol = '▼';
                            break;
                    }
                }

                if (this.graphic && this.graphic.symbolName) {
                    // when marker is enabled
                    setSymbol(this.graphic.symbolName);
                } else if (this.marker && this.marker.symbol) {
                    var url = this.marker.symbol.replace(/^url\(|\)$/g, '');
                    symbol = '<img src="' + url + '" alt="Marker" />';
                } else if (this.series.symbol) {
                    // when marker is disabled
                    setSymbol(this.series.symbol);
                }
				if(this.series.type == 'flags'){
					/*var obj = this.series;
					for (var key in obj) {
						if (Object.prototype.hasOwnProperty.call(obj, key)) {
							var val = obj[key];
							console.log(key +'='+val);
						}
					}*/
					return '<span style="color:' + this.series.color + '">' + symbol + '</span>' + ' ' + this.series.name + ': ' + this.series.yData + '<br/>';
				}else{
					return '<span style="color:' + this.series.color + '">' + symbol + '</span>' + ' ' + this.series.name + ': ' + this.y + '<br/>';
				}              
            }
		},
		exporting: {
			enabled: true
		}				
	});
}

function addChart(tracks, sn, eid, st, rfuel_, sfuel_){
	var WP = window.parent;
	var datas = [];
	var symbolColor = popSymbolColor();
	
	var rfuels = [];
	var sfuels = [];
	var rfuels2 = [];
	var sfuels2 = [];
	var rfuelpoints = rfuel_;
	var sfuelpoints = sfuel_;
	var maxv = 0;
	if(rfuelpoints != null){
		for (var i = 0; i < rfuelpoints.length; i++){
			var sensorId = parseInt(rfuelpoints[i].SENSOR_ID);
			var before = parseInt(rfuelpoints[i].FBEFORE);
			var after = parseInt(rfuelpoints[i].FAFTER);
			var time = newDate(rfuelpoints[i].GPS_TIME).getTime();
			var rfuel = after - before;
			if(rfuel > 0){
				if(sensorId == 30){
					rfuels.push({x: time, y: rfuel, title: rfuel, text: JS_REFUEL + " 1 " + "(" + WP.UNIT_FUEL + "): " + rfuel});
				}else if(sensorId == 31){
					rfuels2.push({x: time, y: rfuel, title: rfuel, text: JS_REFUEL + " 2 " + "(" + WP.UNIT_FUEL + "): " + rfuel});
				}			
			}						
		}
	}
	
	if(sfuelpoints != null){
		for (var i = 0; i < sfuelpoints.length; i++){
			var sensorId = parseInt(sfuelpoints[i].SENSOR_ID);
			var before = parseInt(sfuelpoints[i].FBEFORE);
			var after = parseInt(sfuelpoints[i].FAFTER);
			var time = newDate(sfuelpoints[i].GPS_TIME).getTime();
			var sfuel = before - after;
			if(sfuel > 0){
				if(sensorId == 30){
					sfuels.push({x: time, y: sfuel, title: sfuel, text: JS_STEAL_FUEL + " 1 " + " (" + WP.UNIT_FUEL + "): " + sfuel});
				}else if(sensorId == 31){
					sfuels2.push({x: time, y: sfuel, title: sfuel, text: JS_STEAL_FUEL + " 2 " + " (" + WP.UNIT_FUEL + "): " + sfuel});
				}				
			}						
		}
	}
	if(st == 1){
		//1:digital 
		for (var i = 0; i < tracks.length; i++) {
			if(tracks[i].q != null && getIdValue(eid + ":", tracks[i].q, true) != null){
				var v = getIdValue(eid + ":", tracks[i].q, true).split(" ")[0];
				var digital = v == "1" ? 100 : 0;	
				var time = newDate(tracks[i].tg).getTime();
				datas.push([time, digital]);
			}										
		}
	}else{
		for (var i = 0; i < tracks.length; i++) {
			if(tracks[i].q != null && getIdValue(eid + ":", tracks[i].q, true) != null){
				var v = getIdValue(eid + ":", tracks[i].q);
				var time = newDate(tracks[i].tg).getTime();
				
				if(eid == 'A' || eid == "3F"){
					//mileage
					v = mileageUnitConversion(v, WP.JS_UNIT_DISTANCE);
				}else if(eid == "48" || eid == "49" || eid == "4A" || eid == "4B" || eid == "4C" || eid == "4D" || eid == "4E" || eid == "4F"){
					//temperature
					v = tempUnitConversion(v, WP.JS_UNIT_TEMPERATURE);	
				}else if(eid == "42"){
					//speed
					v = speedUnitConversion(v, WP.JS_UNIT_SPEED);
				}else if(eid == "1B"){
					//altitude
					v = altitudeUnitConversion(v, WP.JS_UNIT_ALTITUDE);	
				}else if(eid == "1E" || eid == "1F"){
					//fuel
					v = fuelUnitConversion(v, WP.JS_UNIT_FUEL);	
					if(v > maxv){
						maxv = v;
					}
				}
				datas.push([time, v]);
			}								
		}
	}
	
	
	var unit = "", min = 0;
	if(eid == 'A' || eid == "3F"){
		//mileage
		unit = WP.UNIT_DIST;
	}else if(eid == "48" || eid == "49" || eid == "4A" || eid == "4B" || eid == "4C" || eid == "4D" || eid == "4E" || eid == "4F"){
		//temperature
		unit = WP.UNIT_TEMP;
		min = -30;
	}else if(eid == "42"){
		//speed
		unit = WP.UNIT_SPEED;
	}else if(eid == "1B"){
		//altitude
		unit = WP.UNIT_ALTITUDE;	
	}else if(eid == "1E" || eid == "1F"){
		//fuel
		unit = WP.UNIT_FUEL;
	}
	
	charts.addAxis({ // new yAxis
		id: 'chart-axis_'+eid,
		title: {
			text: sn + (unit.length > 0 ? (" (" +unit + ")") : "")
		},
		lineWidth: 1,
		lineColor: '#08F',
		opposite: false,
		lineWidth: 0,
		min: min,
		max: (eid == "1E" || eid == "1F") ? maxv + 80: null,
		gridLineColor: '#EFEFEF',
		gridLineWidth: 0.5
	});
		
	if(st == 1){
		//1:digital 		
		charts.addSeries({					
			type: 'area',
			name: sn,
			data: datas,
			yAxis: 'chart-axis_'+eid,
			id: 'xaxis_'+eid,
			step: 'left',
			color: symbolColor.color,
			tooltip: {
                valueDecimals: 0
            },
			marker: {
				fillColor: symbolColor.color,
				radius: 4,
				symbol: symbolColor.symbol
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 2
				}
			},
			threshold: null,
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, symbolColor.color],
					[1, Highcharts.Color(symbolColor.color).setOpacity(0).get('rgba')]
				]
			}
		});
	}else{
		charts.addSeries({					
			type: 'area',
			name: sn,
			data: datas,
			yAxis: 'chart-axis_'+eid,
			id: 'xaxis_'+eid,
			color: symbolColor.color,
			tooltip: {
                valueDecimals: 1
            },
			marker: {
				fillColor: symbolColor.color,
				radius: 4,
				symbol: symbolColor.symbol 
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 2
				}
			},
			threshold: null,
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, symbolColor.color],
					[1, Highcharts.Color(symbolColor.color).setOpacity(0).get('rgba')]
				]
			}
		});

		//fuel 1 refuel/steal fuel
		if(eid == "1E"){
			if(rfuels.length > 0){
				charts.addSeries({
					type : 'flags',
					clip: false,
					name: JS_REFUEL + " 1 (" + WP.UNIT_FUEL + ")",
					data : rfuels,
					color: symbolColor.color,
					fillColor: symbolColor.color,
					marker: {
						fillColor: symbolColor.color,
						radius: 4,
						symbol: 'triangle-down' 
					},
					yAxis: 'chart-axis_'+eid,
					id: 'refuel-1',
					onSeries : 'xaxis_'+eid,
					shape : 'circlepin',
					width : 16
				});
			}
			
			if(sfuels.length > 0){
				charts.addSeries({
					type: 'flags',
					clip: false,
					name: JS_STEAL_FUEL + " 1 (" + WP.UNIT_FUEL + ")",
					data: sfuels,
					color: symbolColor.color,
					fillColor: symbolColor.color,
					marker: {
						fillColor: symbolColor.color,
						radius: 4,
						symbol: 'triangle-down' 
					},
					yAxis: 'chart-axis_'+eid,
					id: 'steal-1',
					onSeries : 'xaxis_'+eid,
					shape : 'squarepin',
					width : 16
				});	
			}
			
		}
		
		//fuel 2 refuel/steal fuel
		if(eid == "1F"){
			if(rfuels2.length > 0){
				charts.addSeries({
					type : 'flags',
					clip: false,
					name: JS_REFUEL + " 2 (" + WP.UNIT_FUEL + ")",
					data : rfuels2,
					color: symbolColor.color,
					fillColor: symbolColor.color,
					marker: {
						fillColor: symbolColor.color,
						radius: 4,
						symbol: 'triangle-down' 
					},
					yAxis: 'chart-axis_'+eid,
					id: 'refuel-2',
					onSeries : 'xaxis_'+eid,
					shape : 'circlepin',
					width : 16
				});
			}
						
			if(sfuels2.length > 0){
				charts.addSeries({
					type: 'flags',
					clip: false,
					name: JS_STEAL_FUEL + " 2 (" + WP.UNIT_FUEL + ")",
					data: sfuels2,
					color: symbolColor.color,
					fillColor: symbolColor.color,
					marker: {
						fillColor: symbolColor.color,
						radius: 4,
						symbol: 'triangle-down' 
					},
					yAxis: 'chart-axis_'+eid,
					id: 'steal-2',
					onSeries : 'xaxis_'+eid,
					shape : 'squarepin',
					width : 16
				});	
			}			
		}
	}
	
	chart4SymbolColor['chart-axis_'+eid] = symbolColor;
}

function removeChart(eid){
	if(charts.get('chart-axis_'+eid)){
		charts.get('chart-axis_'+eid).remove();
		var symbolColor = chart4SymbolColor['chart-axis_'+eid];
		symbol4Color.push(symbolColor);
		delete chart4SymbolColor['chart-axis_'+eid];				
	}
}

function drawIgnitionChart(tracks){
	var WP = window.parent;
	$("#tab_ignitionchart").empty();
	var datas = [];
	var ignitionLast = 0;
	for (var i = 0; i < tracks.length; i++) {
		//var ignition = (tracks[i].st != null && (tracks[i].st).indexOf('3005') != -1) ? 1 : 0;
		var ignition = (tracks[i].q != null && getIdValue("45:", tracks[i].q, true) == "1") ? 1 : 0;
		var time = newDate(tracks[i].tg).getTime();
		ignitionLast = ignition;
		datas.push([time, ignition]);
	}
	
	$('#tab_ignitionchart').highcharts({				
		credits: {
			 text: '',
			 href: ''
		},
		chart: {
			zoomType: 'x',
			panning: true,
            panKey: 'shift'
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
			type: 'datetime',
		},
		yAxis: {
			title: {
				text: JS_IGNITION 
			},
			min: 0,
            plotLines : [ {
                value : 0,
                width : 1,
                color : '#4DA74D'
            } ] 
		},
		legend: {
			enabled: false
		},
		plotOptions: {
			area: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, '#4DA74D'],
						[1, Highcharts.Color('#4DA74D').setOpacity(0).get('rgba')]
					]
				},
				marker: {
					fillColor: '#4DA74D',
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				threshold: null
			},
			series: {
				cursor: 'pointer',
				color: '#4DA74D',
				events: {
					click: function(e) {
						clickToPlay(e.point.index,true);
					}
			    }				
			}
		},
		
		series: [{
			type: 'area',
			name: JS_IGNITION,
			data: datas,
			step: 'left'
		}],
		
		navigation: {
            buttonOptions: {
                verticalAlign: 'bottom',
				y: 15
            }
        },
		
		exporting: {
			enabled: true
		}
	});
}

function drawFuelChart(tracks,rfuel_,sfuel_){
	var WP = window.parent;
	$("#tab_fuelchart").empty();
	var datas = [], datas2 = [];
	var rfuels = [];
	var sfuels = [];
	var rfuels2 = [];
	var sfuels2 = [];
	var rfuelpoints = rfuel_;
	var sfuelpoints = sfuel_;
	var maxFuel = 0;
	
	for (var i = 0; i < tracks.length; i++) {
		var f1 = getIdValue("1E:", tracks[i].q);
		var f2 = getIdValue("1F:", tracks[i].q);
		var fuel = parseInt(fuelUnitConversion(f1 == null ? 0: f1, WP.JS_UNIT_FUEL));
		var fuel2 = parseInt(fuelUnitConversion(f2 == null ? 0: f2, WP.JS_UNIT_FUEL));
		var time = newDate(tracks[i].tg).getTime();
		datas.push([time, fuel]);
		datas2.push([time, fuel2]);
		if(fuel > maxFuel){
			maxFuel = fuel;
		}
		if(fuel2 > maxFuel){
			maxFuel = fuel2;
		}
	}
	maxFuel = maxFuel + 20;
	
	if(rfuelpoints != null){
		for (var i = 0; i < rfuelpoints.length; i++){
			var sensorId = parseInt(rfuelpoints[i].SENSOR_ID);
			var before = parseInt(rfuelpoints[i].FBEFORE);
			var after = parseInt(rfuelpoints[i].FAFTER);
			var time = newDate(rfuelpoints[i].GPS_TIME).getTime();
			var rfuel = after - before;
			if(rfuel > 0){
				if(sensorId == 30){
					rfuels.push({x: time, title: rfuel, text: JS_REFUEL + " 1 " + "(" + WP.UNIT_FUEL + "): " + rfuel});
				}else if(sensorId == 31){
					rfuels2.push({x: time, title: rfuel, text: JS_REFUEL + " 2 " + "(" + WP.UNIT_FUEL + "): " + rfuel});
				}					
			}						
		}
	}
	
	if(sfuelpoints != null){
		for (var i = 0; i < sfuelpoints.length; i++){
			var sensorId = parseInt(sfuelpoints[i].SENSOR_ID);
			var before = parseInt(sfuelpoints[i].FBEFORE);
			var after = parseInt(sfuelpoints[i].FAFTER);
			var time = newDate(sfuelpoints[i].GPS_TIME).getTime();
			var sfuel = before - after;
			if(sfuel > 0){
				if(sensorId == 30){
					sfuels.push({x: time, title: sfuel, text: JS_STEAL_FUEL + " 1 " + " (" + WP.UNIT_FUEL + "): " + sfuel});
				}else if(sensorId == 31){
					sfuels2.push({x: time, title: sfuel, text: JS_STEAL_FUEL + " 2 " + " (" + WP.UNIT_FUEL + "): " + sfuel});
				}				
			}						
		}
	}
	
	$('#tab_fuelchart').highcharts({				
		credits: {
			 text: '',
			 href: ''
		},
		chart: {
			zoomType: 'x',
			panning: true,
            panKey: 'shift'
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
			type: 'datetime',
		},
		yAxis: {
			title: {
				text: JS_FUEL + "(" + WP.UNIT_FUEL + ")"
			},
			min: 0,
			max: maxFuel,
            plotLines : [ {
                value : 0,
                width : 1,
                color : '#EDC240'
            },
			 {
                value : 0,
                width : 1,
                color : '#7cb5ec'
            }
			] 
		},
		legend: {
			enabled: false
		},	
		plotOptions: {
			area: {
				
				marker: {
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				threshold: null
			}
		},
		series: 
		[{
			type: 'area',
			name: JS_FUEL + " 1 (" + WP.UNIT_FUEL + ")",
			data: datas,
			id : 'dataseries1',
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, '#EDC240'],
					[1, Highcharts.Color('#EDC240').setOpacity(0).get('rgba')]
				]
			},
			marker: {
				fillColor: '#EDC240',
				radius: 2
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 1
				}
			},
			threshold: null,
			cursor: 'pointer',
			color: '#EDC240',
			events: {
				click: function(e) {
					clickToPlay(e.point.index,true);
				}
			}
		},
		{
			type: 'area',
			name: JS_FUEL + " 2 (" + WP.UNIT_FUEL + ")",
			data: datas2,
			id : 'dataseries2',
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, '#F76A01'],
					[1, Highcharts.Color('#F76A01').setOpacity(0).get('rgba')]
				]
			},
			marker: {
				fillColor: '#F76A01',
				radius: 2
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 1
				}
			},
			threshold: null,
			cursor: 'pointer',
			color: '#F76A01',
			events: {
				click: function(e) {
					clickToPlay(e.point.index,true);
				}
			}
		},
		{
			type : 'flags',
			clip: false,
			name: JS_REFUEL + " 1 (" + WP.UNIT_FUEL + ")",
			data : rfuels,
			onSeries : 'dataseries1',
			shape : 'circlepin',
			width : 16
		},
		{
			type : 'flags',
			clip: false,
			name: JS_REFUEL + " 2 (" + WP.UNIT_FUEL + ")",
			data : rfuels2,
			onSeries : 'dataseries2',
			shape : 'circlepin',
			width : 16
		},
		{
			type: 'flags',
			clip: false,
			name: JS_STEAL_FUEL + " 1 (" + WP.UNIT_FUEL + ")",
			data: sfuels,
			onSeries : 'dataseries1',
			shape : 'squarepin',
			width : 16
		},
		{
			type: 'flags',
			clip: false,
			name: JS_STEAL_FUEL + " 2 (" + WP.UNIT_FUEL + ")",
			data: sfuels2,
			onSeries : 'dataseries2',
			shape : 'squarepin',
			width : 16
		}
		],
			
		navigation: {
            buttonOptions: {
                verticalAlign: 'bottom',
				y: 15
            }
        },
		
		exporting: {
			enabled: true
		}				
	});
}

function drawTempChart(tracks){
	var WP = window.parent;
	$("#tab_tempchart").empty();
	var datas = [];
	var datas2 = [];
	for (var i = 0; i < tracks.length; i++) {
		var t1 = getIdValue("48:", tracks[i].q);
		var t2 = getIdValue("49:", tracks[i].q);
		
		var temp = parseFloat(tempUnitConversion(t1 == null ? 0: t1, WP.JS_UNIT_TEMPERATURE));
		var temp2 = parseFloat(tempUnitConversion(t2 == null ? 0: t2, WP.JS_UNIT_TEMPERATURE));
		var time = newDate(tracks[i].tg).getTime();
		datas.push([time, temp]);
		datas2.push([time, temp2]);
	}
	
	$('#tab_tempchart').highcharts({				
		credits: {
			 text: '',
			 href: ''
		},
		chart: {
			zoomType: 'x',
			panning: true,
            panKey: 'shift'
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
			type: 'datetime',
		},
		yAxis: {
			title: {
				text: JS_TEMP + "(" + WP.UNIT_TEMP + ")"
			},
			min: 0,
            plotLines : [ {
                value : 0,
                width : 1,
                color : '#0096FE'
            } ] 
		},
		legend: {
			enabled: false
		},		
		series: [{
			type: 'area',
			name: JS_TEMP + ' 1',
			data: datas,
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, '#0096FE'],
					[1, Highcharts.Color('#0096FE').setOpacity(0).get('rgba')]
				]
			},
			marker: {
				fillColor: '#0096FE',
				radius: 2
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 1
				}
			},
			threshold: null,
			cursor: 'pointer',
			color: '#0096FE',
			events: {
				click: function(e) {
					clickToPlay(e.point.index,true);
				}
			}
		},
		{
			type: 'area',
			name: JS_TEMP + ' 2',
			data: datas2,
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, '#3ACCBC'],
					[1, Highcharts.Color('#3ACCBC').setOpacity(0).get('rgba')]
				]
			},
			marker: {
				fillColor: '#3ACCBC',
				radius: 2
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 1
				}
			},
			threshold: null,
			cursor: 'pointer',
			color: '#3ACCBC',
			events: {
				click: function(e) {
					clickToPlay(e.point.index,true);
				}
			}
		}
		],
		
		navigation: {
            buttonOptions: {
                verticalAlign: 'bottom',
				y: 15
            }
        },
		
		exporting: {
			enabled: true
		}				
	});
}

function drawAltitudeChart(tracks){
	var WP = window.parent;
	$("#tab_altitudechart").empty();
	var datas = [];
	for (var i = 0; i < tracks.length; i++) {
		var high = tracks[i].h;
		var time = newDate(tracks[i].tg).getTime();
		datas.push([time, high]);
	}
	
	$('#tab_altitudechart').highcharts({				
		credits: {
			 text: '',
			 href: ''
		},
		chart: {
			zoomType: 'x',
			panning: true,
            panKey: 'shift'
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
			type: 'datetime',
		},
		yAxis: {
			title: {
				text: JS_ALTITUDE + "(" + WP.UNIT_ALTITUDE + ")"
			},
			min: 0,
            plotLines : [ {
                value : 0,
                width : 1,
                color : '#8E468E'
            } ] 
		},
		legend: {
			enabled: false
		},
		plotOptions: {
			area: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, '#8E468E'],
						[1, Highcharts.Color('#8E468E').setOpacity(0).get('rgba')]
					]
				},
				marker: {
					fillColor: '#8E468E',
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				threshold: null
			},
			series: {
				cursor: 'pointer',
				color: '#8E468E',
				events: {
					click: function(e) {
						clickToPlay(e.point.index,true);
					}
			    }
			}
		},
		
		series: [{
			type: 'area',
			name: JS_ALTITUDE,
			data: datas
		}],
		
		navigation: {
            buttonOptions: {
                verticalAlign: 'bottom',
				y: 15
            }
        },
		
		exporting: {
			enabled: true
		}				
	});
}

function clickToPlay(pos,top){
	if(hisData){
		if(play.run){$("#play").click();}
		play.pos = pos;
		if(tmrChange){
			clearTimeout(tmrChange);
		}
		tmrChange = null;
		if(top){
			tmrChange = setTimeout('playHistory(true);', 50);
		}else{
			tmrChange = setTimeout('playHistory(false);', 50);
		}		
	}	
}

function showMovesDetail(moves){
	$table = $("#table_movesdetail");
    $table.find("tbody").remove();
	var $tbody = $("<tbody></tbody>").appendTo($table);
	var WP = window.parent;
	$('#table_movesdetail tr:eq(0) th:eq(2)').text(NAVI_DISTANCE).append("("+WP.UNIT_DIST+")");
	
	if(moves != null){
		for (var i = 0; i < moves.length; i++) {		
			var $tr = $("<tr></tr>").attr("index", i + "").attr("start",moves[i].GPS_TIME_START).attr("end",moves[i].GPS_TIME_END).appendTo($tbody);		
			$("<td align='center'></td>").html($.format.date(moves[i].GPS_TIME_START, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);				
			$("<td align='center'></td>").html(moves[i].DURATION).appendTo($tr);
			$("<td align='center'></td>").html(parseFloat(moves[i].DISTANCE / 1000.0).toFixed(2)).appendTo($tr);
		}
		$table.find("tbody tr").unbind("click").click(function() {
			 var index = parseInt($(this).attr("index"));
			 
			 //locate_table("#table_movesdetail", "index", index + "", false);
			 $("#route span").text(JS_ROUTE);
			 $("#route i").removeClass("icon-navbar-map").addClass("icon-navbar-route");
			 $("#details_panel").css("display","none");	
			 $("#map").css("display","block");
			 
			 map.ResizeMapContainer();
			 var start = $(this).attr("start");
			 var end = $(this).attr("end");
			 map.ShowHideMovesLine(play.objid, start, end, true);
		});
		
		
	}
}

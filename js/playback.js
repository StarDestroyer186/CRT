/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var map, ext, zones = [], usermarkers = [], globalData = '', track, hisData = [], timer, tmrChange, speed=1000, isQueryTimeout = false, needBound = false, stops = [], moves = [], events = [], currentChart = [], symbol4Color = [], chart4SymbolColor = [], charts,
page_now = 1, page_size = 50, page_total;
var play = {ico: 0, objid: 0, oflag:"", pos: 0, run: false};

//Ico, play.objid, play.oflag, play.pos, play.run = false
function stopHistory(){
    play.run = false;
    if(timer){
        clearTimeout(timer);
        timer = null;
    }
}

function playHistory(top){
    if(play.pos >= 0 && play.pos < hisData.length){
		var msg
		if(parseInt($("#table_messages").find("tr:first-child").find('td:eq(0)').text()) > play.pos || parseInt($("#table_messages").find("tr:last-child").find('td:eq(0)').text()) < play.pos){
			page_now = play.pos == 0 ? 1 : Math.ceil(play.pos / page_size);
			showIndexPage(page_now);
			showMessages(hisData);
		}
		
        var j = hisData[play.pos];		
        $("#status").html(j.e);
        var p = getSpeedState(1, 1, j.s, j.tg, timeIsEvent(j.tg) ? 1:0, getIdValue("43:", j.q, true), j.st);//defaul online and gpsvalid
		var ftime = (j.tg == null || j.tg.length == 0) ? j.tg : $.format.date(j.tg, JS_DEFAULT_DATETIME_fmt_JS);
		var fstime = (j.ts == null || j.ts.length == 0) ? j.ts : $.format.date(j.ts, JS_DEFAULT_DATETIME_fmt_JS);
        //alert(j.e);
		map.DrawIcon(play.objid, play.oflag, null, null, 1, j.x, j.y, play.ico, p.sta, j.d, ftime, fstime, p.spd, 0, false, p.val,j.st, j.q, null, getIdValue("5F:", j.q, true), getIdValue("5E:", j.q, true), speed);    
		map.LocateMarker(play.objid, true, false, needBound);
		needBound = true;
        track.setPosition(play.pos, null);
		locate_table("#table_messages", "index", play.pos + "", top);
		
        play.pos++;
        if(play.run){
            timer = setTimeout('playHistory(true);', speed);
        }	
    }else{
        if(play.run){
            $("#play").click();
        }
    }
}

function queryTimeout(){
	showLoading(false,true);
	$("#search").removeAttr("disabled").bind("click", doSearch);
	$("#export").attr('disabled',false);
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
	var WP = window.parent;
	isQueryTimeout = false;
	needBound = false;
    var oflag = $("#device").val();    
    if(oflag == ""){
        $("#device").focus();
        return;
    }
    var objid = getIdByFlag(oflag);

    var day = parseFloat(eval($("#day").val()));
    var param;
    if(day < 0){
        var time1 = $("#time1").val();
        if(time1 == ""){
            $("#time1").focus();
            return;
        }
        var time2 = $("#time2").val();
        if(time2 == ""){
            $("#time2").focus();
            return;
        }
        param = { "objid": objid, "day": day, "time1": time1, "time2": time2, "stop": $("#stop_duration").val(), "event": 1, "ptype": $("#position_type").val(), "btype": $("#playback_type").val()};
    }else{
        param = { "objid": objid, "day": day, "stop": $("#stop_duration").val(), "event": 1, "ptype": $("#position_type").val(), "btype": $("#playback_type").val()};
    }
	$("#sepswitch").removeClass("hide_status");
	$("#sepswitch").attr('src','img/down-arrow.svg'); 	
	$("#separation").css("bottom", "198px");
	$("#hisstatus").css("display", "block");
	$("#historymap").css("bottom", "206px");
	if(map){
		map.ResizeMapContainer();
	}
	
    $("#search,#play,#export").attr("disabled",true).unbind("click");
    //$("#status,#tab_statistics").css("display", "none");
    $("#play").val(JS_BUTTON_PLAY);
    if(play.run){$("#play").click();}
    map.ClearTrack();
    map.ClearMarkers();
    hisData = [];
	pagechanged('#tab_chart');
	$("#table_movesdetail").find("tbody").remove();
	$("#table_messages").find("tbody").remove();
	$('#select_chart').empty();	
	$("#chart_div").empty();
	$("#tab_speedchart").empty();
	$("#tab_ignitionchart").empty();
    showLoading(true);
	var timer_search = setTimeout("queryTimeout()", 120000);
	map.Zoom(12);
	events = [];
	stops = [];
	moves = [];
	$("#distance").text("");
	$("#divtime").text("");
	$("#stoptime").text("");
	$("#dutytime").text("");
	$("#avspeed").text("");
	$("#maxspeed").text("");
	$("#idletime").text("");
	$("#sensorfuelconsumption").text("");
	$("#estimatefuelconsumption").text("");
	$("#canfuelconsumption").text("");
	
	$("#speedingdist").text("");
	$("#speedingtime").text("");
	$("#speedingcount").text("");
	$("#enginecount").text("");
	
	$("#tab_process").empty();
					
    try{
        $.get("playback.ajax.php", param, function(data) {
            clearTimeout(timer_search);
			showLoading(false);
            try{
                var json = eval('(' + data + ')');
                if(json != null && typeof json.error != "undefined"){
                     showMessage("stop", JS_PLAY_TITLE, json.error, 10);
                } else if(json != null && typeof json.item != "undefined" && json.item.length > 0){
					
                    globalData = data;
                    hisData = json.item;					
					events = json.events;
					stops = json.stops;
					moves = json.moves;
                    play.objid = objid;
                    play.oflag = oflag;
                    play.ico = json.ico;
                    track.setRange(0, hisData.length - 1);					
					initChartDisplay(hisData, json.ctsensor, json.rfuel, json.sfuel);
					drawSpeedChart(hisData);
					
					/*drawIgnitionChart(hisData);
					drawFuelChart(hisData, json.rfuel, json.sfuel);
					drawTempChart(hisData);
					drawAltitudeChart(hisData);*/
					showMovesDetail(moves);
					initMsgPage();
					showMessages(hisData);
					toRouteIndex(events, stops, moves, hisData[0].tg, hisData[hisData.length - 1].tg, hisData);
					
                    var j = hisData[0];
                    var p = getSpeedState(1, 1, j.s, j.tg, timeIsEvent(j.tg) ? 1:0, getIdValue("43:", j.q, true), j.st);
					var ftime = (j.tg == null || j.tg.length == 0) ? j.tg : $.format.date(j.tg, JS_DEFAULT_DATETIME_fmt_JS);
					var fstime = (j.ts == null || j.ts.length == 0) ? j.ts : $.format.date(j.ts, JS_DEFAULT_DATETIME_fmt_JS);	
					//alert(j.e);
					
                    map.DrawIcon(play.objid, play.oflag, null, null, 1, j.x, j.y, play.ico, p.sta, j.d, ftime, fstime, p.spd, 0, true, p.val,j.st, j.q, null, getIdValue("5F:", j.q, true), getIdValue("5E:", j.q, true), speed);
					map.HideShowMarker(true,play.objid);
									
					var nstops = $("#maptools #ed_stop").hasClass("tool_active");
					var nevents = $("#maptools #ed_event").hasClass("tool_active");
					var nangles = $("#maptools #ed_arrow").hasClass("tool_active");
					var ntimes = $("#maptools #ed_point").hasClass("tool_active");
                    map.DrawTrackLine(play.objid, hisData, { point: true }, stops, nstops, events, nevents, nangles, ntimes, moves);					
					play.pos = 0;
                    playHistory(true);
					
                    $("#export").removeAttr("disabled").bind("click", function(e){
						var startTime = (hisData[0].tg == null || hisData[0].tg.length == 0) ? hisData[0].tg : $.format.date(hisData[0].tg, JS_DEFAULT_DATETIME_fmt_JS);
						var endTime = (hisData[hisData.length - 1].tg == null || hisData[hisData.length - 1].tg.length == 0) ? hisData[hisData.length - 1].tg : $.format.date(hisData[hisData.length - 1].tg, JS_DEFAULT_DATETIME_fmt_JS);
						
						WP.reportHeader = "<tr><td colspan=9>" + play.oflag + "</td></tr>";
						WP.reportHeader += "<tr><td colspan=9>" + startTime + " - " + endTime + "</td></tr>";	
						WP.exportFileName = play.oflag;
						WP.exportTableId = "table_messages";
						$("#mnuOperat").hide();
						$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
						$("#mnuOperat").show();																																															
					});
                    //$("#status,#tab_statistics").css("display", "block");
					$("#distance").text(json.m);
					$("#divtime").text(json.dt);
					$("#stoptime").text(json.st);
					$("#dutytime").text(json.dut);
					$("#avspeed").text(json.s);
					$("#maxspeed").text(json.ms);
					$("#idletime").text(json.it);
					$("#sensorfuelconsumption").text(json.sfc);
					$("#estimatefuelconsumption").text(json.efc);
					$("#canfuelconsumption").text(json.cfc);
					
					$("#speedingdist").text(json.spd);
					$("#speedingtime").text(json.spt);
					$("#speedingcount").text(json.spc);
					$("#enginecount").text(json.engc);
					
					$("#play").removeAttr("disabled").click(function(){
						map.ShowHideMovesLine(play.objid, null, null, false);
						
						if(!play.run){
							$(this).val(JS_BUTTON_STOP);
							play.run = true;
							$("#search,#export").attr("disabled",true).unbind("click");
							if(play.pos >= hisData.length){play.pos = 0;}
							playHistory(true);							
						}else{
							$(this).val(JS_BUTTON_PLAY);
							stopHistory();
							$("#search").removeAttr("disabled").bind("click", doSearch);
							$("#export").removeAttr("disabled").bind("click", function(e){
								var startTime = (hisData[0].tg == null || hisData[0].tg.length == 0) ? hisData[0].tg : $.format.date(hisData[0].tg, JS_DEFAULT_DATETIME_fmt_JS);
								var endTime = (hisData[hisData.length - 1].tg == null || hisData[hisData.length - 1].tg.length == 0) ? hisData[hisData.length - 1].tg : $.format.date(hisData[hisData.length - 1].tg, JS_DEFAULT_DATETIME_fmt_JS);
								
								WP.reportHeader = "<tr><td colspan=9>" + play.oflag + "</td></tr>";
								WP.reportHeader += "<tr><td colspan=9>" + startTime + " - " + endTime + "</td></tr>";								
								WP.exportFileName = play.oflag;
								WP.exportTableId = "table_messages";
								$("#mnuOperat").hide();
								$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
								$("#mnuOperat").show();								
							});
						}
					});
                }
            }catch(e){
				//alert(e.message);
                showMessage("stop", JS_PLAY_TITLE, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeout){
				$("#search").removeAttr("disabled").bind("click", doSearch);
			}          
        });
    }catch(e){/*alert(e.message)*/error(showLoading(false));}
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
	$items = $("<select id='chart_display' multiple></select>").appendTo('#select_chart');
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
        "maxHeight": 137, 
		"minWidth": 60,
        "search": false,
		"disableSelectAll": false,
		"placeHolder": JS_CHART_SELECT,
		"maxSelect": 4, 
        "translations": { "all": JS_SELECT_ALL_ITEM, "items": JS_SELECT_ITEMS,"selectAll":'['+JS_SELECT_ALL+']',"clearAll":'['+JS_SELECT_CLEAR_ALL+']' }
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
		var $table_route = $("<table style='width: 100%; border-collapse:collapse; border-sapcing: 0px 0px; '></table>").appendTo($("#tab_process"));
		//start	
		var time_start = $.format.date(start, WP.JS_DEFAULT_DATETIME_fmt_JS);
		var $tr_start = $("<tr></tr>").appendTo($table_route);
		var $td_start = $("<td title=\""+time_start+"\" nowrap='nowrap'>"+time_start+"</td>").addClass("route_start").appendTo($tr_start);
		$($td_start).unbind("click").click(function() {
			selectRoute($(this));
			map.ShowHideMovesLine(play.objid, null, null, false);
			map.LocateStartMarker();
		});
		
		for(var i = 0; i < route.length; i++){				
			if(route[i].type == 1){
				//event
				var time_event = $.format.date(route[i].time, WP.JS_DEFAULT_DATETIME_fmt_JS);
				var $tr_event = $("<tr></tr>").appendTo($table_route);	
				var $td_event = $("<td title=\""+time_event+"\" nowrap='nowrap'>"+time_event+"&nbsp;&nbsp;"+route[i].data.e+"</td>").attr("index_e", route[i].index).addClass("route_event").appendTo($tr_event);

				$($td_event).unbind("click").click(function() {
					selectRoute($(this));
					map.ShowHideMovesLine(play.objid, null, null, false);
					map.LocateEventMarker($(this).attr("index_e"));
				});
			}else if(route[i].type == 2){
				//stop
				var time_stop = $.format.date(route[i].time, WP.JS_DEFAULT_DATETIME_fmt_JS);
				var $tr_stop = $("<tr></tr>").appendTo($table_route);	
				var $td_stop = $("<td title=\""+time_stop+"\" nowrap='nowrap'>"+time_stop+"&nbsp;&nbsp;"+route[i].data.DURATION+"</td>").attr("index_s", route[i].index).addClass("route_stop").appendTo($tr_stop);
				$($td_stop).unbind("click").click(function() {
					selectRoute($(this));
					map.ShowHideMovesLine(play.objid, null, null, false);
					map.LocateStopMarker($(this).attr("index_s"));
				});
			}else if(route[i].type == 3){
				//move
				var time_move = $.format.date(route[i].time, WP.JS_DEFAULT_DATETIME_fmt_JS);
				var title = JS_NAVI_DISTANCE +"("+WP.UNIT_DIST+"):&nbsp;&nbsp;" + (route[i].data.DISTANCE/1000).toFixed(1) + "&#10;" +
							//JS_NAVI_DIVTIME + "&nbsp;&nbsp;" + route[i].data.DRIVING_TIME + "&#10;" +
							JS_NAVI_MAXSPEED +"("+WP.UNIT_SPEED+"):&nbsp;&nbsp;" + route[i].data.MAX_SPEED + "&#10;" +
							JS_NAVI_AVSPEED +"("+WP.UNIT_SPEED+"):&nbsp;&nbsp;" + route[i].data.AVG_SPEED + "&#10;";
							//JS_NAVI_SENSOR_FUEL_CONSUMPTION +"("+WP.UNIT_FUEL+"):&nbsp;&nbsp;" + route[i].data.SENSOR_FUEL + "&#10;" +
							//JS_NAVI_ESTIMATE_FUEL_CONSUMPTION +"("+WP.UNIT_FUEL+"):&nbsp;&nbsp;" + route[i].data.ESTIMATE_FUEL + "&#10;" +
							//JS_NAVI_CAN_FUEL_CONSUMPTION +"("+WP.UNIT_FUEL+"):&nbsp;&nbsp;" + route[i].data.CAN_FUEL + "&#10;";
				var $tr_move = $("<tr></tr>").appendTo($table_route);
				var $td_move = $("<td title=\""+title+"\" nowrap='nowrap'>"+time_move+"&nbsp;&nbsp;"+route[i].data.DURATION+"&nbsp;("+(route[i].data.DISTANCE/1000).toFixed(1)+"&nbsp;"+WP.UNIT_DIST+")"+"</td>").attr("start", route[i].data.GPS_TIME_START).attr("end", route[i].data.GPS_TIME_END).addClass("route_drive").appendTo($tr_move);
				$($td_move).unbind("click").click(function() {
					selectRoute($(this));
					map.ShowHideMovesLine(play.objid, $(this).attr("start"), $(this).attr("end"), true);
				});
			}	
		}
		//end
		var time_end = $.format.date(end, WP.JS_DEFAULT_DATETIME_fmt_JS);
		var $tr_end = $("<tr></tr>").appendTo($table_route);
		var $td_end = $("<td title=\""+time_end+"\" nowrap='nowrap'>"+time_end+"</td>").addClass("route_end").appendTo($tr_end);
		$($td_end).unbind("click").click(function() {
			selectRoute($(this));
			map.ShowHideMovesLine(play.objid, null, null, false);
			map.LocateEndMarker();
		});
	}
}

function selectRoute($td){
	$("#tab_process .active").removeClass("active");
	$td.parent().addClass("active");
}

function exportPdf(){
	$("#mnuOperat").hide();
	showLoading(true);
	var export_search = setTimeout("queryTimeout()", 60000);
	var startTime = $.format.date(hisData[0].tg, JS_DEFAULT_DATETIME_fmt_JS);
	var endTime = $.format.date(hisData[hisData.length - 1].tg, JS_DEFAULT_DATETIME_fmt_JS);
	
	$("#export").attr('disabled',true);  
	ext.ClearZone(zones);
	ext.ClearUserMarker(usermarkers);				
	map.RemoveMarker(play.objid);
	map.ShowHideAveragePoint(true);

	leafletImage(map.GetMap(), function(err, canvas) {
		/*$("body").append('<form id="frmupload" action="download.dompdf.php" method="post" target="_blank"><input type="text" id="file_name" name="file_name"/><textarea cols="500" id="file_data" name="file_data" wrap="off"></textarea></form>');
		$("#file_name").val(play.oflag);
		var $html = "<h1>" + play.oflag + "</h1>";
		$html = $html + "<h3>" + startTime + "&nbsp;&nbsp;-&nbsp;&nbsp;" + endTime + "</h3>";
		$html = $html + "<br>" + "<img src="+canvas.toDataURL()+"></img><br><br>";
		$html = $html + "<br>" + $("#tab_statistics").html();
		$html = $html + "<br>"	+ $("#tab_movesdetail").html().replace(/display:none/g,"");
			
		$("#file_data").val($html);
		$("#frmupload").submit().remove();*/
		
		var $html = "<table nobr='true' style='width: '"+$("#historymap").width()+"px;' class='tab_report'>" + 
							"<tr><td>" +  "<h1>" + play.oflag + "</h1>" + "</td></tr>" +
							"<tr><td>" +  "<h3>" + startTime + "&nbsp;&nbsp;-&nbsp;&nbsp;" + endTime + "</h3>" + "</td></tr>" +
							"<tr><td>" +  "<br>" + "<img src="+canvas.toDataURL()+"></img><br><br>" + "</td></tr>"  +
					  "</table>"; 
					  
		$html = $html + "<br><table nobr='true' width= '"+$("#historymap").width()+"px;'><tr><td>" + $("#tab_statistics").html() + "</td></tr></table>";
		$html = $html + "<br>"+ $("#tab_movesdetail").html();
		$html = $html.replace(/display: none;/g,"");		
		exportPdfByHtml($html, play.oflag);
		
		var currentZoom = map.GetMap().getZoom();
		play.pos = play.pos == 0 ? 0 : play.pos -1;
		playHistory(true);
		map.HideShowMarker(true,play.objid);
		map.ShowHideAveragePoint(false);
		
		if($("#maptools #ed_zone").hasClass("tool_active")){
			drawZone();
		}
		if($("#maptools #ed_marker").hasClass("tool_active")){
			drawUserMarker();
		}
		
		map.Zoom(currentZoom);
		$("#export").attr('disabled',false);
		clearTimeout(export_search);
		showLoading(false);
	});
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
		max: (eid == "1E" || eid == "1F") ? maxv + 100 : null,
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
				color: '#4DA74D',
				cursor: 'pointer',
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
            panKey: 'shift',
			events: {
				load: function() {
				  this.series[1].markerGroup.clip(this.clipRect); // series[1] -> index of flag series
				}
			}
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
			min: -20,
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
	
	if(moves != null){
		for (var i = 0; i < moves.length; i++) {		
			var $tr = $("<tr style='border: 1px solid #ccc;'></tr>").attr("index", i + "").attr("start",moves[i].GPS_TIME_START).attr("end",moves[i].GPS_TIME_END).appendTo($tbody);
			$("<td style='border: 1px solid #ccc;'></td>").text(i).attr("index", i + "").appendTo($tr);			
			$("<td style='border: 1px solid #ccc;'></td>").html($.format.date(moves[i].GPS_TIME_START, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);		
			
			var $address_start = $("<td style='border: 1px solid #ccc;'></td>").attr("x",moves[i].LNG_START * 1000000).attr("y",moves[i].LAT_START * 1000000).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+moves[i].LAT_START + "," + moves[i].LNG_START +">"+ moves[i].LAT_START + "," + moves[i].LNG_START +" </a>").appendTo($tr);
							
			if (i < 1 && $address_start.isOnScreen()) {
				 $tr.addClass("geocode_address");
				 $address_start.addClass("geocode_address");
				 WP.map.GeoNames($address_start.attr("x"), $address_start.attr("y"), $address_start, "link", 0);
			}
			
			$address_start.unbind("hover").hover(function(e) {
				 if (!$(this).hasClass("geocode_address")) {
					 $(this).addClass("geocode_address");
					 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
				 }
			});
			
			$("<td style='border: 1px solid #ccc;'></td>").html($.format.date(moves[i].GPS_TIME_END, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
			
			var $address_end = $("<td style='border: 1px solid #ccc;'></td>").attr("x",moves[i].LNG_END * 1000000).attr("y",moves[i].LAT_END * 1000000).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+moves[i].LAT_END + "," + moves[i].LNG_END +">"+ moves[i].LAT_END + "," + moves[i].LNG_END +" </a>").appendTo($tr);
							
			if (i < 1 && $address_end.isOnScreen()) {
				 $tr.addClass("geocode_address");
				 $address_end.addClass("geocode_address");
				 WP.map.GeoNames($address_end.attr("x"), $address_end.attr("y"), $address_end, "link", 0);
			}
			
			$address_end.unbind("hover").hover(function(e) {
				 if (!$(this).hasClass("geocode_address")) {
					 $(this).addClass("geocode_address");
					 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
				 }
			});
			
			$("<td style='border: 1px solid #ccc;'></td>").html(moves[i].DURATION).appendTo($tr);
			$("<td style='border: 1px solid #ccc;'></td>").html(parseFloat(moves[i].DISTANCE / 1000.0).toFixed(2)).appendTo($tr);
			$("<td style='border: 1px solid #ccc; display:none'></td>").html(moves[i].MAX_SPEED).appendTo($tr);
			$("<td style='border: 1px solid #ccc; display:none'></td>").html(moves[i].DRIVING_TIME).appendTo($tr);
			$("<td style='border: 1px solid #ccc; display:none'></td>").html(moves[i].IDLE_TIME).appendTo($tr);
			$("<td style='border: 1px solid #ccc; display:none'></td>").html(moves[i].SENSOR_FUEL).appendTo($tr);
			$("<td style='border: 1px solid #ccc; display:none'></td>").html(moves[i].ESTIMATE_FUEL).appendTo($tr);
		}
		$("#table_movesdetail tbody tr:odd").removeClass().addClass("oddcolor");
		$table.find("tbody tr").unbind("click").click(function() {
			 var index = parseInt($(this).attr("index"));
			 var start = $(this).attr("start");
			 var end = $(this).attr("end");
			 map.ShowHideMovesLine(play.objid, start, end, true);
			 
			 locate_table("#table_movesdetail", "index", index + "", false);
		});
		
		/*$table.parent().scroll(function(e){
			 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
				 var $tdstart = $(this).find("td:eq(2)");							 
				 if ($tdstart.isOnScreen() && !($tdstart.hasClass("geocode_address"))) {
					 $tdstart.addClass("geocode_address");
					 WP.map.GeoNames($tdstart.attr("x"), $tdstart.attr("y"), $tdstart, "link", 0);
				 }
				 
				 var $tdend = $(this).find("td:eq(4)");							 
				 if ($tdend.isOnScreen() && !($tdend.hasClass("geocode_address"))) {
					 $tdend.addClass("geocode_address");
					 WP.map.GeoNames($tdend.attr("x"), $tdend.attr("y"), $tdend, "link", 0);
				 }
			 });
		});*/
	}
}

function initMsgPage(){
	page_now = 1;
	page_size = parseInt($("#page_size").val());
	
	if(hisData != null && hisData.length > 0){
		if(hisData.length % page_size == 0){
			page_total = hisData.length / page_size;
		}else{
			page_total = Math.ceil((hisData.length / page_size));
		}
		$("#page_total").text(page_total);
		$("#page_current").val(page_now);
	}else{
		$("#page_total").text('0');
		$("#page_current").val('0');
	}
}

function showFirstPage(){
	if(hisData != null && hisData.length > 0){
		page_now = 1;
		showMessages(hisData);
		$("#page_current").val(page_now);
	}
}

function showPreviousPage(){
	if(hisData != null && hisData.length > 0){
		if(page_now > 1){
			page_now--;
		}else{
			page_now = 1;
		}
		showMessages(hisData);
		$("#page_current").val(page_now);
	}
}

function showNextPage(){
	if(hisData != null && hisData.length > 0){
		if(page_now < page_total){
			page_now++;
		}else{
			page_now = page_total
		}
		showMessages(hisData);
		$("#page_current").val(page_now);
	}
}

function showEndPage(){
	if(hisData != null && hisData.length > 0){
		page_now = page_total;
		showMessages(hisData);
		$("#page_current").val(page_now);
	}
}

function showIndexPage(index){
	if(hisData != null && hisData.length > 0){
		if(index < 1){
			index = 1;
		}
		
		if(index > page_total){
			index = page_total;
		}
		page_now = index;
		showMessages(hisData);
		$("#page_current").val(page_now);
	}
}

function showMessages(tracks){
	$table = $("#table_messages");
    $table.find("tbody").remove();
	var $tbody = $("<tbody></tbody>").appendTo($table);
	var i = (page_now - 1) * page_size;
	var j = page_now == page_total ? tracks.length:(page_now * page_size);
	
	for (; i < j; i++) {		
		var $tr = $("<tr height=10px></tr>").attr("index", i + "").appendTo($tbody);
		$("<td></td>").text(i).attr("index", i + "").appendTo($tr);
		$("<td></td>").html((tracks[i].e == null || tracks[i].e.length == 0) ? "":tracks[i].e.replaceAll("<br>",'')).attr("title", (tracks[i].e == null || tracks[i].e.length == 0) ? "":tracks[i].e.replaceAll("<br>",'\n')).appendTo($tr);
		if(tracks[i].v==1){
			$("<td></td>").attr("title",JS_YES).text(JS_YES).appendTo($tr);
		}else{
			if(tracks[i].v == null || tracks[i].v.length == 0){
				$("<td></td>").text("").appendTo($tr);
			}else{
				$("<td></td>").attr("title",JS_NO).text(JS_NO).appendTo($tr);
			}		
		}
		$("<td></td>").attr("title",(tracks[i].y / 1000000).toFixed(5)).html((tracks[i].y / 1000000).toFixed(5)).appendTo($tr);
		$("<td></td>").attr("title",(tracks[i].x / 1000000).toFixed(5)).html((tracks[i].x / 1000000).toFixed(5)).appendTo($tr);
		$("<td></td>").attr("title",tracks[i].s).html(tracks[i].s).appendTo($tr);
		$("<td></td>").attr("title",tracks[i].d).html(tracks[i].d).appendTo($tr);
		$("<td></td>").attr("title",(tracks[i].tg == null || tracks[i].tg.length == 0) ? tracks[i].tg : $.format.date(tracks[i].tg, JS_DEFAULT_DATETIME_fmt_JS)).html((tracks[i].tg == null || tracks[i].tg.length == 0) ? tracks[i].tg : $.format.date(tracks[i].tg, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
		$("<td></td>").attr("title",(tracks[i].ts == null || tracks[i].ts.length == 0) ? tracks[i].ts : $.format.date(tracks[i].ts, JS_DEFAULT_DATETIME_fmt_JS)).html((tracks[i].ts == null || tracks[i].ts.length == 0) ? tracks[i].ts : $.format.date(tracks[i].ts, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
	}
	$("#table_messages tbody tr:odd").removeClass().addClass("oddcolor");
	$table.find("tbody tr").unbind("click").click(function() {
		 var index = parseInt($(this).attr("index"));
		 clickToPlay(index,false);
    });
	
	$table.parent().scrollTop(0);
}

function onfree(){
    try{ map.Free(); }catch(e){}
    map = null;
}

function oninit() {
	$("#tab_movesdetail").toggle();
	$("#tab_messages").toggle();
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
	
	$("#time1").val(getNowFormatDate() + " 00:00");
	$("#time2").val(getNowFormatDate() + " 23:59");
	loadcalendar();//

	var deviceList = getDeviceList();
	$("#device").autocomplete({
		source: deviceList,
		minLength: deviceList.length < 2000 ? 0 : 2,
		max:10,
        scroll:true
	}).focus(function(){            
		 $(this).autocomplete('search', $(this).val())
	});
	
    $("#speed").change(function(){
        speed = parseInt($(this).val());
    });
    $("#day").change(function(){
        if(parseInt($(this).val()) < 0){
            $("#seltime").css("display", "block");
			$("#fieldset_pro").css("top", "405px");
        }else{
            $("#seltime").css("display", "none");
			$("#fieldset_pro").css("top", "400px");
        }
    });
    track = $.fn.Trackbar({renderTo: "#trackbar",
        maxValue: 1000,
        valueTip: true,
        onChanged: function(pos){
			clickToPlay(pos,true);
        }
    });
    $("#loadmapwait").css("display", "block");
	onLoadGoogle();
    //loadScript("http://maps.google.com/maps/api/js?sensor=false&language="+JS_CURRENT_LANG+"&callback=onLoadMap");
	//loadScript("http://ditu.google.cn/maps/api/js?key="+JS_GOOGLE_KEY+"&v=3.21&sensor=false&language="+JS_CURRENT_LANG+"&callback=onLoadGoogle");
	
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
	
	var WP = window.parent;
	
	$("#sepswitch").unbind("click").click(function() {
		if(($(this).hasClass("hide_status"))){
			$(this).removeClass("hide_status");
			$(this).attr('src','img/down-arrow.svg'); 		
			$("#separation").css("bottom", "198px");
			$("#hisstatus").css("display", "block");
			$("#historymap").css("bottom", "206px");
			if(map){
				map.ResizeMapContainer();
			}		
		}else{						
			$(this).addClass("hide_status");
			$(this).attr('src','img/up-arrow.svg'); 			
			$("#separation").css("bottom", "0px");
			$("#hisstatus").css("display", "none");
			$("#historymap").css("bottom", "8px");
			if(map){
				map.ResizeMapContainer();
			}			
		}
	});
	
	
	$('#table_messages tr:eq(0) th:eq(5)').append("("+WP.UNIT_SPEED+")");
	$('#avspeed_text').append("("+WP.UNIT_SPEED+"):");
	$('#maxspeed_text').append("("+WP.UNIT_SPEED+"):");
	$('#distance_text').append("("+WP.UNIT_DIST+"):");
	$('#speedingdist_text').append("("+WP.UNIT_DIST+"):");
	$('#sensorfuelconsumption_text').append("("+WP.UNIT_FUEL+"):");
	$('#estimatefuelconsumption_text').append("("+WP.UNIT_FUEL+"):");
	$('#canfuelconsumption_text').append("("+WP.UNIT_FUEL+"):");
	$('#table_movesdetail tr:eq(0) th:eq(6)').append("("+WP.UNIT_DIST+")");
	$('#table_movesdetail tr:eq(0) th:eq(7)').append("("+WP.UNIT_SPEED+")");
	$('#table_movesdetail tr:eq(0) th:eq(10)').append("("+WP.UNIT_FUEL+")");
	$('#table_movesdetail tr:eq(0) th:eq(11)').append("("+WP.UNIT_FUEL+")");
	
	if(JS_CURRENT_LANG == "zh_CN" || JS_CURRENT_LANG == "zh_TW"){
		/**Chinese*/
		loadScript("js/fonts/FZYTK-normal.js", pdfFontLoaded);
	}else if(JS_CURRENT_LANG == "th"){
		/**Thai*/
		loadScript("js/fonts/NotoSansThai-VariableFont_wdth,wght-normal.js", pdfFontLoaded);
	}else{
		loadScript("js/fonts/arial-normal.js", pdfFontLoaded);
	}
	
	$("#page_first").unbind("click").click(function() {
		showFirstPage();
	});	
	
	$("#page_previous").unbind("click").click(function() {
		showPreviousPage();
	});
	
	$("#page_next").unbind("click").click(function() {
		showNextPage();
	});
	
	$("#page_end").unbind("click").click(function() {
		showEndPage();
	});
	
	$("#page_current").keydown(function(e) {
        if (e.keyCode == 13) {
			var index = (this.value == null || this.value.length ==0) ? 1:parseInt(this.value);
            showIndexPage(index);
        }
	});
	
	$("#page_current").keyup(function(e) {
        this.value = this.value.replace(/[^\d]/g,'');
	});
	
	$("#page_size").change(function(){
		page_size = parseInt($(this).val());
		initMsgPage();
		var index = ($("#page_current").val() == null || $("#page_current").val().length ==0) ? 1:parseInt($("#page_current").val());
        showIndexPage(index);
	});
	 
}

function pdfFontLoaded(){
	$("#export_pdf").css('cursor', 'pointer');
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
    map = new MapOperat("historymap", opts, true, false, true);
	ext = new MapExtend(map.GetMap(), false, false);
    $("#loadmapwait").css("display", "none");
    $("#search").attr("title","").removeAttr("disabled").bind("click", doSearch); 
	//Block Morocco borders
	var WP = window.parent;
	if(JS_GOOGLE_TYPE == 0){
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
	$("#maptools #ed_label").attr('title',JS_ENABLE_DISABLE_LABEL);
	$("#maptools #ed_marker").attr('title',JS_ENABLE_DISABLE_MARKER);
	if(JS_DEFAULT_MARKER == 1){
		$("#maptools #ed_marker").css({opacity: 1.0}).addClass("tool_active");
	}
	$("#maptools #ed_zone").attr('title',JS_ENABLE_DISABLE_ZONES);
	if(JS_DEFAULT_ZONE == 1){
		$("#maptools #ed_zone").css({opacity: 1.0}).addClass("tool_active");
	}
	$("#maptools #ed_arrow").attr('title',JS_ENABLE_DISABLE_ARROWS);
	$("#maptools #ed_point").attr('title',JS_ENABLE_DISABLE_POINTS);
	$("#maptools #ed_stop").attr('title',JS_ENABLE_DISABLE_STOPS);
	$("#maptools #ed_event").attr('title',JS_ENABLE_DISABLE_EVENTS);
	$("#maptools #ed_route").attr('title',JS_ENABLE_DISABLE_ROUTE);
	$("#maptools #ed_snap").attr('title',JS_ENABLE_DISABLE_SNAP);
	$("#maptools #ed_driver").attr('title',JS_ENABLE_DISABLE_DRIVER);
	$("#maptools #ed_measure").attr('title',JS_ENABLE_DISABLE_MEASURE);
	$("#maptools #ed_ruler").attr('title',JS_ENABLE_DISABLE_RULER);
	
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
	
	$("#maptools #ed_arrow").parent().unbind("click").click(function() {
		if(($("#maptools #ed_arrow").hasClass("tool_active"))){
			$("#maptools #ed_arrow").removeClass("tool_active");
			$("#maptools #ed_arrow").css({opacity:0.5});
			map.ToggleAngleLayer(false);
		}else{
			$("#maptools #ed_arrow").addClass("tool_active");			
			$("#maptools #ed_arrow").css({opacity:1.0});
			map.ToggleAngleLayer(true);	
		}
	});
	
	$("#maptools #ed_point").parent().unbind("click").click(function() {
		if(($("#maptools #ed_point").hasClass("tool_active"))){
			$("#maptools #ed_point").removeClass("tool_active");
			$("#maptools #ed_point").css({opacity:0.5});
			map.ToggleTimesLayer(false);
		}else{
			$("#maptools #ed_point").addClass("tool_active");			
			$("#maptools #ed_point").css({opacity:1.0});
			map.ToggleTimesLayer(true);		
		}
	});
	
	$("#maptools #ed_stop").parent().unbind("click").click(function() {
		if(($("#maptools #ed_stop").hasClass("tool_active"))){
			$("#maptools #ed_stop").removeClass("tool_active");
			$("#maptools #ed_stop").css({opacity:0.5});
			map.ToggleStopLayer(false);
		}else{
			$("#maptools #ed_stop").addClass("tool_active");			
			$("#maptools #ed_stop").css({opacity:1.0});
			map.ToggleStopLayer(true);		
		}
	});
	
	$("#maptools #ed_event").parent().unbind("click").click(function() {
		if(($("#maptools #ed_event").hasClass("tool_active"))){
			$("#maptools #ed_event").removeClass("tool_active");
			$("#maptools #ed_event").css({opacity:0.5});
			map.ToggleEventLayer(false);
		}else{
			$("#maptools #ed_event").addClass("tool_active");			
			$("#maptools #ed_event").css({opacity:1.0});
			map.ToggleEventLayer(true);		
		}
	});
	
	$("#maptools #ed_route").parent().unbind("click").click(function() {
		if(($("#maptools #ed_route").hasClass("tool_active"))){
			$("#maptools #ed_route").removeClass("tool_active");
			$("#maptools #ed_route").css({opacity:0.5});
			map.ShowHideTrackLine(play.objid, false);
		}else{
			$("#maptools #ed_route").addClass("tool_active");			
			$("#maptools #ed_route").css({opacity:1.0});
			map.ShowHideTrackLine(play.objid, true);		
		}
	});
	
	$("#maptools #ed_snap").parent().unbind("click").click(function() {
		if(($("#maptools #ed_snap").hasClass("tool_active"))){
			$("#maptools #ed_snap").removeClass("tool_active");
			$("#maptools #ed_snap").css({opacity:0.5});
			map.ToggleSnapLayer(false);
		}else{
			$("#maptools #ed_snap").addClass("tool_active");			
			$("#maptools #ed_snap").css({opacity:1.0});	
			map.ToggleSnapLayer(true);	
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
	
	if($("#maptools #ed_zone").hasClass("tool_active")){
		drawZone();
	}
	if($("#maptools #ed_marker").hasClass("tool_active")){
		drawUserMarker();
	}
	
	pagechanged('#tab_chart');
	pagechanged('#tab_process');	
	loadFastHistory();
}

function loadFastHistory(){
	var WP = window.parent;
	if(WP.fastHistoryValue != null && WP.menu_operator_id > 0){
		$("#device").val(WP.getFlagById(WP.menu_operator_id));
		$("#day").val(WP.fastHistoryValue);			
		WP.fastHistoryValue = null;
		$("#search").click();
	}
}

function drawZone(){
	var WP = window.parent;
	var geoList = WP.geoList;
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
	var WP = window.parent;
	var geoList = WP.geoList;
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


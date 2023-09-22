var requestTimeout = 90000, isQueryTimeOut = false, currentChart = [], symbol4Color = [], chart4SymbolColor = [], charts;
function exportExcel(name){   
	var tab_text = "<table border='2px'><tr bgcolor='#D5D5D5'>";
    var textRange; var j = 0;
    tab = document.getElementById('table_byrtime'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++){     
        tab_text = tab_text + tab.rows[j].innerHTML+"</tr>";
    }

    tab_text =tab_text + "</table>";
    //tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    //tab_text = tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    //tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
	
	/*
    if (!!window.ActiveXObject || "ActiveXObject" in window){      // If Internet Explorer
		txtAreaRpt.document.open("txt/html","replace");
        txtAreaRpt.document.write(tab_text);
        txtAreaRpt.document.close();
        txtAreaRpt.focus(); 
        sa = txtAreaRpt.document.execCommand("SaveAs",true,name+".xls");
		return (sa);
    } else{  //other browser not tested on IE 11
		var uri = 'data:application/vnd.ms-excel,' + encodeURIComponent(tab_text);
		var link = document.createElement("a");    
		link.href = uri;
		link.style = "visibility:hidden";
		link.download = name + ".xls";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}*/
	var blob = new Blob([tab_text]);
	if (window.navigator.msSaveOrOpenBlob) {
		//IE
		window.navigator.msSaveBlob(blob, name + ".xls");
	} else {
		var a = window.document.createElement("a");
		a.href = window.URL.createObjectURL(blob, {type: "application/vnd.ms-excel;charset=utf-8"});
		a.download = name + ".xls";
		document.body.appendChild(a);
		a.click();  
		document.body.removeChild(a);
	}
}

function typeChange(select){
	$("#table_byrtime").empty();
	$("#exportbyrtime").attr("disabled",true).unbind("click");
	$table = $("#table_byrtime");
	var WP = window.parent;
	
	switch(select) {
		case 0:
			$("#table_byrtime").css('width', '180%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','none');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','none');
			$("#condition_etime").css('display','none');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='2%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_DEVICEID).appendTo($tr);
			//$("<th width='9%'></th>").text(JS_INFO_DEVICESIM).appendTo($tr);
			$("<th width='10%'></th>").text(JS_NAVI_TARGETSTATUS).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_ODOMETER + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_ENGINE_HOUR).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_MAX_SPEED_24H + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_ODOMETER_24H + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_MOVING_TIME_24).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_IDLE_TIME_24H).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_STOP_TIME_24H).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_ENGINE_TIME_24H).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_ROUTE_COMPLETE).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_BATTERY).appendTo($tr);
			$("<th width='4%'></th>").text(JS_GPSVALID).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_LATITUDE).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_LONGITUDE).appendTo($tr);
			$("<th width='4%'></th>").text(JS_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_HEADING).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_GPSTIME).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_REVTIME).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_LOCATION).appendTo($tr);
			$("<th class='no-sort' width='0%' style='display:none'></th>").text(JS_GROUP_NAME).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 1:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead style='font-size: 8px;'></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='4%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='40%'></th>").text(JS_NAVI_TARGETSTATUS).appendTo($tr);
			$("<th width='5%'></th>").text(JS_GPSVALID).appendTo($tr);
			$("<th width='6%'></th>").text(JS_INFO_LATITUDE).appendTo($tr);
			$("<th width='6%'></th>").text(JS_INFO_LONGITUDE).appendTo($tr);
			$("<th width='6%'></th>").text(JS_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_HEADING).appendTo($tr);
			$("<th width='11%'></th>").text(JS_INFO_GPSTIME).appendTo($tr);
			$("<th width='11%'></th>").text(JS_INFO_REVTIME).appendTo($tr);
			$("<th class='no-sort' width='6%'></th>").text(JS_LOCATION).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 2:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='4%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='12%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='12%'></th>").text(JS_INFO_DEVICEID).appendTo($tr);
			$("<th width='6%'></th>").text(JS_CAMERAID).appendTo($tr);
			$("<th width='12%'></th>").text(JS_PHOTOTYPE).appendTo($tr);
			$("<th width='12%'></th>").text(JS_PHOTOTIME).appendTo($tr);
			$("<th class='no-sort' width='50%'></th>").text(JS_PHOTODETAIL).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 3:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='4%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th width='15%'></th>").text(JS_WORKID).appendTo($tr);
			$("<th width='15%'></th>").text(JS_DRIVERNAME).appendTo($tr);
			$("<th width='15%'></th>").text(JS_DRIVER_LICENSE).appendTo($tr);
			$("<th width='15%'></th>").text(JS_DRIVER_PHONE).appendTo($tr);
			$("<th width='15%'></th>").text(JS_BRUSH_TIME).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must');  
		    break;
			
		case 5:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			$('#device_flag').attr('placeholder',"").addClass('must');  
		    break;
			
		case 54:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'block');
			$("#select_chart").css('display', 'block');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			$('#device_flag').attr('placeholder',"").addClass('must');  
		    break;
			
		case 6:
		case 14:
		case 15:
		case 16:
		case 17:
		case 18:
		case 19:
		case 20:
		case 21:
		case 22:
		case 23:
		case 24:
		case 25:
		case 26:
		case 27:
		case 28:
		case 31:
		case 32:
		case 35:
		case 36:
		case 37:
		case 40:
		case 44:
		case 45:
		case 46:
		case 48:
		case 49:
		case 50:
		case 53:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th width='9%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th width='7%'></th>").text(JS_ALARM_TYPE).appendTo($tr);
			$("<th width='8%'></th>").text(JS_GROUP_NAME).appendTo($tr);
			$("<th class='no-sort' width='20%'></th>").text(JS_NAVI_TARGETSTATUS).appendTo($tr);
			$("<th width='5%'></th>").text(JS_GPSVALID).appendTo($tr);
			$("<th width='6%'></th>").text(JS_INFO_LATITUDE).appendTo($tr);
			$("<th width='6%'></th>").text(JS_INFO_LONGITUDE).appendTo($tr);
			$("<th width='4%'></th>").text(JS_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th width='3%'></th>").text(JS_INFO_HEADING).appendTo($tr);
			$("<th width='9%'></th>").text(JS_INFO_GPSTIME).appendTo($tr);
			$("<th width='9%'></th>").text(JS_INFO_REVTIME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_LOCATION).appendTo($tr);
			$('#device_flag').attr('placeholder',JS_BLANK_FOR_ALL_ASSET).removeClass('must'); 
		    break;
			
		case 7:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 8:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_FUEL_SENSOR).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_BEFORE_FUEL + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_AFTER_FUEL + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_REFUEL + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_GPSTIME).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_LOCATION).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 9:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_FUEL_SENSOR).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_BEFORE_FUEL + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_AFTER_FUEL + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_STEAL_FUEL + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_GPSTIME).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_LOCATION).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 10:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 52:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');	
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','none');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','block');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_DEVICESIM).appendTo($tr);						
			$("<th class='no-sort' width='9%'></th>").text(JS_INFO_TEMPERATURE + " 1(" + WP.UNIT_TEMP + ")").appendTo($tr);
			$("<th class='no-sort' width='9%'></th>").text(JS_INFO_TEMPERATURE + " 2(" + WP.UNIT_TEMP + ")").appendTo($tr);
			$("<th class='no-sort' width='9%'></th>").text(JS_INFO_FUEL + " 1(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='9%'></th>").text(JS_INFO_FUEL + " 2(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='9%'></th>").text(JS_INFO_ODOMETER + "(" + WP.UNIT_DIST + ")").appendTo($tr);			
			$("<th class='no-sort' width='9%'></th>").text(JS_INFO_GPSTIME).appendTo($tr);
			$("<th class='no-sort' width='9%'></th>").text(JS_INFO_REVTIME).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
			
		case 11:
			$("#table_byrtime").css('width', '150%');	
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '254px');	
			$("#chart_byrtime").css('display','block');
			$("#condition_flag").css('display','none');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','block');
			$("#cost_fuel").css('display','block');
			$("#cost_mileage").css('display','block');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='2%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_USAGE_DATE).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_DRIVING_TIME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_STOP_TIME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_AV_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_MAX_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_IDLE_TIMES).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_IDLE_TIME).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HEAVY_DUTY_TIMES).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HARSH_ACCELERATION).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HARSH_BRAKING).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HARSH_CORNERING).appendTo($tr);			
			$("<th class='no-sort' width='5%'></th>").text(NAVI_SENSOR_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(NAVI_ESTIMATE_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(NAVI_CAN_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);			
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_SPEEDING_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_SPEEDING_LAST_TIME).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_SPEEDING_COUNT).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_ENGINE_ON_COUNT).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_COST_FUEL).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_COST_MILEAGE).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_GROUP_NAME).appendTo($tr);
			
			$("#cost_fuel_per_liter_l").text(JS_COST_FUEL + " / " + WP.UNIT_FUEL);
			$("#cost_mileage_per_km_l").text(JS_COST_MILEAGE + " / " + WP.UNIT_DIST);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 39:
			$("#table_byrtime").css('width', '150%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','block');
			$("#cost_mileage").css('display','block');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='2%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_DRIVING_TIME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_STOP_TIME).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_AV_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_MAX_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_IDLE_TIMES).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_IDLE_TIME).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HEAVY_DUTY_TIMES).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HARSH_ACCELERATION).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HARSH_BRAKING).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HARSH_CORNERING).appendTo($tr);	
			$("<th class='no-sort' width='5%'></th>").text(NAVI_SENSOR_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(NAVI_ESTIMATE_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(NAVI_CAN_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_SPEEDING_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_SPEEDING_LAST_TIME).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_SPEEDING_COUNT).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_ENGINE_ON_COUNT).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_COST_FUEL).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_COST_MILEAGE).appendTo($tr);
			
			$("#cost_fuel_per_liter_l").text(JS_COST_FUEL + " / " + WP.UNIT_FUEL);
			$("#cost_mileage_per_km_l").text(JS_COST_MILEAGE + " / " + WP.UNIT_DIST);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 12:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','block');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_IGNITION_STATUS).appendTo($tr);
			$("<th class='no-sort' width='9%'></th>").text(JS_START).appendTo($tr);
			$("<th class='no-sort' width='9%'></th>").text(JS_END).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_DURATION).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_START_LOCATION).appendTo($tr);				
			$("<th class='no-sort' width='8%'></th>").text(JS_AV_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_MAX_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_IDLE_TIME).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_TEMPERATURES).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_DOOR_OPEN_TIME).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 13:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','none');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','none');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th width='10%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th width='9%'></th>").text(JS_INFO_DEVICEID).appendTo($tr);
			//$("<th width='7%'></th>").text(JS_INFO_DEVICESIM).appendTo($tr);
			$("<th class='no-sort' width='16%'></th>").text(JS_NAVI_TARGETSTATUS).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_ODOMETER + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_ENGINE_HOUR).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_BATTERY).appendTo($tr);
			$("<th width='5%'></th>").text(JS_GPSVALID).appendTo($tr);
			$("<th width='6%'></th>").text(JS_INFO_LATITUDE).appendTo($tr);
			$("<th width='6%'></th>").text(JS_INFO_LONGITUDE).appendTo($tr);
			$("<th width='6%'></th>").text(JS_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_HEADING).appendTo($tr);
			$("<th width='9%'></th>").text(JS_INFO_GPSTIME).appendTo($tr);
			$("<th width='9%'></th>").text(JS_INFO_REVTIME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_LOCATION).appendTo($tr);
			$("<th class='no-sort' width='0%' style='display:none'></th>").text(JS_GROUP_NAME).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
		
		case 29:	
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th width='15%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th width='15%'></th>").text(JS_GROUP_NAME).appendTo($tr);
			$("<th width='15%'></th>").text(JS_DRIVERNAME).appendTo($tr);
			$("<th width='15%'></th>").text(JS_INFO_USEDEFFLAG).appendTo($tr);
			$("<th width='11%'></th>").text(JS_INFO_GPSTIME).appendTo($tr);
			$("<th width='8%'></th>").text(JS_INFO_LATITUDE).appendTo($tr);		
			$("<th width='8%'></th>").text(JS_INFO_LONGITUDE).appendTo($tr);
			$("<th width='10%'></th>").text(JS_MAX_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 30:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','none');
			$("#condition_etime").css('display','none');
			$("#condition_day").css('display','block');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th width='24%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th width='24%'></th>").text(JS_LOWEST_AD).appendTo($tr);
			$("<th width='24%'></th>").text(JS_HIGHEST_AD).appendTo($tr);
			$("<th width='24%'></th>").text(JS_AVERAGE_AD).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must');  
		    break;
			
		case 33:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','none');
			$("#condition_etime").css('display','none');
			$("#condition_day").css('display','block');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_GROUP_NAME).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_DRIVERNAME).appendTo($tr);
			$("<th class='no-sort' width='7%'></th>").text(JS_INFO_USEDEFFLAG).appendTo($tr);
			$("<th class='no-sort' width='6%'></th>").text(JS_AV_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='6%'></th>").text(JS_MAX_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='7%'></th>").text(JS_INFO_LATITUDE).appendTo($tr);		
			$("<th class='no-sort' width='7%'></th>").text(JS_INFO_LONGITUDE).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_SPEEDING_START_TIME).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_SPEEDING_END_TIME).appendTo($tr);
			$("<th class='no-sort' width='6%'></th>").text(JS_INFO_SPEEDING_LAST_TIME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_LOCATION).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 34:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','block');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='10%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_GROUP_NAME).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_DRIVERNAME).appendTo($tr);
			$("<th class='no-sort' width='9%'></th>").text(JS_INFO_USEDEFFLAG).appendTo($tr);
			$("<th class='no-sort' width='6%'></th>").text(JS_INFO_LATITUDE).appendTo($tr);		
			$("<th class='no-sort' width='6%'></th>").text(JS_INFO_LONGITUDE).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_INFO_SPEEDING_START_TIME).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_INFO_SPEEDING_END_TIME).appendTo($tr);
			$("<th class='no-sort' width='6%'></th>").text(JS_DURATION).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_LOCATION).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
			break;
			
		case 38:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_GROUP_NAME).appendTo($tr);
			$("<th class='no-sort' width='7%'></th>").text(JS_DRIVERNAME).appendTo($tr);
			$("<th class='no-sort' width='6%'></th>").text(JS_INFO_USEDEFFLAG).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_START).appendTo($tr);
			$("<th class='no-sort' width='6%'></th>").text(JS_START_LOCATION).appendTo($tr);
			$("<th class='no-sort' width='14%'></th>").text(JS_NAVI_TARGETSTATUS).appendTo($tr);
			$("<th class='no-sort' width='8%'></th>").text(JS_END).appendTo($tr);
			$("<th class='no-sort' width='6%'></th>").text(JS_END_LOCATION).appendTo($tr);
			$("<th class='no-sort' width='14%'></th>").text(JS_NAVI_TARGETSTATUS).appendTo($tr);			
			$("<th class='no-sort' width='5%'></th>").text(JS_DURATION).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
			break;
			
		case 41:
			$("#table_byrtime").css('width', '150%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th class='no-sort' width='2%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='5'></th>").text(JS_DRIVERNAME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_INFO_PLACE_NAME).appendTo($tr);
			$("<th class='no-sort' width='5'></th>").text(JS_INFO_ENTER_TIME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_INFO_LEAVE_TIME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_DURATION).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_DRIVING_TIME).appendTo($tr);
			$("<th class='no-sort' width='5%'></th>").text(JS_STOP_TIME).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_AV_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_MAX_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_IDLE_TIMES).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_IDLE_TIME).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HARSH_ACCELERATION).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HARSH_BRAKING).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_HARSH_CORNERING).appendTo($tr);	
			$("<th class='no-sort' width='4%'></th>").text(NAVI_SENSOR_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(NAVI_ESTIMATE_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(NAVI_CAN_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_SPEEDING_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_SPEEDING_LAST_TIME).appendTo($tr);
			$("<th class='no-sort' width='4%'></th>").text(JS_INFO_SPEEDING_COUNT).appendTo($tr);

			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 42:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','none');
			$("#condition_uname").css('display','block');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='3%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th width='24%'></th>").text(JS_USER_NAME).appendTo($tr);
			$("<th width='24%'></th>").text(JS_LOGIN_TIME).appendTo($tr);
			$("<th width='24%'></th>").text(JS_LOGIN_IP).appendTo($tr);
			$("<th width='24%'></th>").text(JS_LOGIN_TIME_ZONE).appendTo($tr);
			$('#user_name').attr('placeholder',JS_BLANK_FOR_ALL_USER).removeClass('must'); 
			var WP = window.parent; 
			$("#user_name").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: WP.array_users,minLength: WP.array_users.length < 2000 ? 0:2,max:10,scroll:true});
		    break;
			
		case 43:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='4%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th class='no-sort' width='12%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th class='no-sort' width='12%'></th>").text(JS_INFO_DEVICEID).appendTo($tr);
			$("<th width='12%'></th>").text(JS_RECORDING_TIME).appendTo($tr);
			$("<th class='no-sort' width='50%'></th>").text(JS_RECORDING_DETAIL).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 55:
			$("#table_byrtime").css('width', '100%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead style='font-size: 8px;'></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='4%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th width='9%'></th>").text(JS_EXPENSE_DATE).appendTo($tr);
			$("<th width='9%'></th>").text(JS_EXPENSE_NAME).appendTo($tr);
			$("<th width='9%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th width='9%'></th>").text(JS_EXPENSE_QUANTITY).appendTo($tr);
			$("<th width='9%'></th>").text(JS_EXPENSE_COST).appendTo($tr);
			$("<th width='9%'></th>").text(JS_EXPENSE_SUPPLIER).appendTo($tr);
			$("<th width='9%'></th>").text(JS_EXPENSE_BUYER).appendTo($tr);
			$("<th width='9%'></th>").text(JS_EXPENSE_ODOMETER + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th width='9%'></th>").text(JS_EXPENSE_ENGINE_HOUR).appendTo($tr);
			$("<th width='15%'></th>").text(JS_EXPENSE_REMARK).appendTo($tr);
			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
		case 47:
			$("#table_byrtime").css('width', '150%');
			$("#graph_byrtime").css('display', 'none');
			$("#select_chart").css('display', 'none');
			$("#table_byrtime_div").css('bottom', '4px');		
			$("#chart_byrtime").css('display','none');
			$("#condition_flag").css('display','block');
			$("#condition_uname").css('display','none');
			$("#condition_multi_flag").css('display','none');
			$("#cost_fuel").css('display','none');
			$("#cost_mileage").css('display','none');
			$("#condition_stime").css('display','block');
			$("#condition_etime").css('display','block');
			$("#condition_day").css('display','none');
			$("#rduration").css('display','none');
			var $thead = $("<thead></thead>").appendTo($table);
			var $tr = $("<tr></tr>").appendTo($thead);
			$("<th width='2%'></th>").text(JS_REPORT_NO).appendTo($tr);
			$("<th width='5%'></th>").text(JS_INFO_OBJECTFLAG).appendTo($tr);
			$("<th width='5'></th>").text(JS_DRIVERNAME).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_TASK_NAME).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_TASK_STATUS).appendTo($tr);
			$("<th width='4'></th>").text(JS_INFO_TASK_START_TIME).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_TASK_END_TIME).appendTo($tr);
			$("<th width='4%'></th>").text(JS_DURATION).appendTo($tr);
			$("<th width='4%'></th>").text(JS_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th width='4%'></th>").text(JS_DRIVING_TIME).appendTo($tr);
			$("<th width='4%'></th>").text(JS_STOP_TIME).appendTo($tr);
			$("<th width='4%'></th>").text(JS_AV_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th width='4%'></th>").text(JS_MAX_SPEED + "(" + WP.UNIT_SPEED + ")").appendTo($tr);
			$("<th width='4%'></th>").text(JS_IDLE_TIMES).appendTo($tr);
			$("<th width='4%'></th>").text(JS_IDLE_TIME).appendTo($tr);
			$("<th width='4%'></th>").text(JS_HARSH_ACCELERATION).appendTo($tr);
			$("<th width='4%'></th>").text(JS_HARSH_BRAKING).appendTo($tr);
			$("<th width='4%'></th>").text(JS_HARSH_CORNERING).appendTo($tr);	
			$("<th width='4%'></th>").text(NAVI_SENSOR_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th width='4%'></th>").text(NAVI_ESTIMATE_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th width='4%'></th>").text(NAVI_CAN_FUEL_CONSUMPTION + "(" + WP.UNIT_FUEL + ")").appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_SPEEDING_DISTANCE + "(" + WP.UNIT_DIST + ")").appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_SPEEDING_LAST_TIME).appendTo($tr);
			$("<th width='4%'></th>").text(JS_INFO_SPEEDING_COUNT).appendTo($tr);

			$('#device_flag').attr('placeholder',"").addClass('must'); 
		    break;
			
	}
}

function doQueryRpt(msg_title, by, flag, stime, etime, other){
	var objid = 0;
	var objid = getIdByFlag(flag);

	switch(parseInt(by)){
		case 0://Last location report
			queryLastLocationRpt(msg_title, by);
			break;
			
		case 1://Trip Log Report
			queryTripLogRpt(msg_title, by);
			break;
		
		case 2://History Photo Report
			queryPhotoRpt(msg_title, by);
			break;
			
		case 3://Asset RFID Log
			queryAssetRfidRpt(msg_title, by);
			break;
			
		case 5://Speed Chart
			querySpeedChartRpt(msg_title, by);
			break;
			
		case 54://Graph
			queryGraphRpt(msg_title, by);
			break;
			
		case 55://Expense
			queryExpenseRpt(msg_title, by);
			break;
			
		case 6://All Alarm Events Report
		case 14:
		case 15:
		case 16:
		case 17:
		case 18:
		case 19:
		case 20:
		case 21:
		case 22:
		case 23:
		case 24:
		case 25:
		case 26:
		case 27:
		case 28:
		case 31:
		case 32:
		case 35:
		case 36:
		case 37:
		case 40:
		case 44:
		case 45:
		case 46:
		case 48:
		case 49:
		case 50:
		case 53:
			queryAlarmEventsRpt(msg_title, by);
			break;
			
		case 7://Fuel Chart
			queryFuelChartRpt(msg_title, by);
			break;
			
		case 8://Refuel Log
			queryReFuelRpt(msg_title, by);
			break;
			
		case 9://Steal fuel Log
			queryStealFuelRpt(msg_title, by);
			break;
			
		case 10://Temperature Chart
			queryTempChartRpt(msg_title, by);
			break;
			
		case 11://Asset Daily Usage Report
			queryAssetUsageRpt(msg_title, by);
			break;
			
		case 12://Daily Travel Report
			queryDailyTravelRpt(msg_title, by);
			break;
			
		case 13://Not Reported Report
			queryNotReportedRpt(msg_title, by);
			break;
			
		case 29://Max Speed Report
			queryMaxSpeedRpt(msg_title, by);
			break;
			
		case 30://Alcohol AD Report
			queryAlcoholADRpt(msg_title, by);
			break;
			
		case 33://Speeding time Report
			querySpeedingTimeRpt(msg_title, by);
			break;
			
		case 34://Stops detail Report
			queryStopsDetailRpt(msg_title, by);
			break;
			
		case 38://Moves detail Report
			queryMovesDetailRpt(msg_title, by);
			break;
			
		case 39://Asset Usage Report Real Time
			queryAssetRtUsageRpt(msg_title, by);
			break;
			
		case 41://Place event detail report
			queryPlaceEventDetailRpt(msg_title, by);
			break;
			
		case 42://User login record
			queryUserLoginRecordRpt(msg_title, by);
			break;
			
		case 43://Voice Recording Report
			queryVoiceRecordRpt(msg_title, by);
			break;
			
		case 47://Task detail report
			queryTaskDetailRpt(msg_title, by);
			break;
			
		case 52://temp gas mil hour report
			queryTempGasMilHourRpt(msg_title, by);
			break;
		
	}	
}

function queryLastLocationRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
    var opts = {"rtime": true, "type": parseInt(rpttype)};
	var WP = window.parent;

    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
			
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=22>" + msg_title + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					
					for(var i=0; i<json.length; i++)
					{
						try{
							var plat = json[i].c;
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").text(json[i].c).appendTo($tr);
							$("<td></td>").text(json[i].n).appendTo($tr);
							//$("<td></td>").text(json[i].sim).appendTo($tr);
							$("<td></td>").html(json[i].e).appendTo($tr);
							var odometer = WP.getIdValue("A:",json[i].q);
							var engineHour = WP.getIdValue("11:",json[i].q);
							var innerBattery = WP.getIdValue("1:",json[i].q);
							var max_speed_24 = WP.getIdValue("3C:",json[i].q);
							var mil_24 = WP.getIdValue("3F:",json[i].q);
							var moving_24 = WP.getIdValue("3D:",json[i].q);
							var idle_24 = WP.getIdValue("40:",json[i].q);
							var stop_24 = WP.getIdValue("41:",json[i].q);
							var engine_24 = WP.getIdValue("3E:",json[i].q);
							var routeLength = WP.getIdValue("F6:",json[i].q);
							var routeComplete = WP.getIdValue("F7:",json[i].q);

							if(odometer != null){
								$("<td></td>").html(mileageUnitConversion(odometer, JS_UNIT_DISTANCE)).appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							if(engineHour != null){
								$("<td></td>").html(engineHour).appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							if(max_speed_24 != null){
								$("<td></td>").html(speedUnitConversion(max_speed_24, JS_UNIT_SPEED)).appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							if(mil_24 != null){
								$("<td></td>").html(mileageUnitConversion(mil_24, JS_UNIT_DISTANCE)).appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							if(moving_24 != null){
								$("<td data-sort="+moving_24+"></td>").html(formatSecToStr(moving_24)).appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							if(idle_24 != null){
								$("<td data-sort="+idle_24+"></td>").html(formatSecToStr(idle_24)).appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							if(stop_24 != null){
								$("<td data-sort="+stop_24+"></td>").html(formatSecToStr(stop_24)).appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							if(engine_24 != null){
								$("<td data-sort="+engine_24+"></td>").html(formatSecToStr(engine_24)).appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							if(routeLength != null && routeComplete != null){
								var routeMoving = mileageUnitConversion(parseFloat(routeLength)*10, JS_UNIT_DISTANCE) * (parseFloat(routeComplete)/100.0);	
								if(routeMoving > parseFloat(routeLength)){
									routeMoving = parseFloat(routeLength);
								}
							    $("<td></td>").html(routeMoving.toFixed(0) + WP.UNIT_DIST + " | " + routeComplete + "%").appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							if(innerBattery != null){
								$("<td></td>").html(innerBattery + "%").appendTo($tr);
							}else{
								$("<td></td>").html("").appendTo($tr);
							}
							
							
							
							if(json[i].v==1){
								$("<td></td>").text(JS_YES).appendTo($tr);
							}else{
								$("<td></td>").text(JS_NO).appendTo($tr);
							}							
							$("<td></td>").html(json[i].y / 1000000).appendTo($tr);
							$("<td></td>").html(json[i].x / 1000000).appendTo($tr);
							$("<td></td>").html(json[i].s).appendTo($tr);
							$("<td></td>").html(json[i].d).appendTo($tr);
							$("<td data-sort="+((json[i].g == null || json[i].g.length == 0) ? json[i].g : newDate(json[i].g).getTime())+"></td>").html((json[i].g == null || json[i].g.length == 0) ? json[i].g : $.format.date(json[i].g, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td data-sort="+((json[i].r == null || json[i].r.length == 0) ? json[i].r : newDate(json[i].r).getTime())+"></td>").html((json[i].r == null || json[i].r.length == 0) ? json[i].r : $.format.date(json[i].r, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							var $address = $("<td></td>").attr("x",json[i].x).attr("y",json[i].y).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].y / 1000000 + "," + json[i].x / 1000000+">"+JS_LOCATION+" </a>").appendTo($tr);
							$("<td style='display:none'></td>").html(json[i].gname).appendTo($tr);
							
							if (i < 5 && $address.isOnScreen()) {
								 $tr.addClass("geocode_address");
								 $address.addClass("geocode_address");
								 WP.map.GeoNames($address.attr("x"), $address.attr("y"), $address, "link", 0);
							}
							$address.unbind("hover").hover(function(e) {
								 if (!$(this).hasClass("geocode_address")) {
									 $(this).addClass("geocode_address");
									 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
								 }
							});
						}catch(e){alert(e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
							 var $td = $(this).find("td:eq(13)");							 
							 if ($td.isOnScreen() && !($td.hasClass("geocode_address"))) {
								 $(this).addClass("geocode_address");
								 $td.addClass("geocode_address");
								 WP.map.GeoNames($td.attr("x"), $td.attr("y"), $td, "link", 0);
							 }
						 });
					});	*/			
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
				    $("#mnuOperat").hide();
				    $("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
				    $("#mnuOperat").show();								
				});
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryTripLogRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
					isQueryTimeOut = true;
					$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
					$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
						WP.exportFileName = msg_title;
						WP.exportTableId = "table_byrtime";
						$("#mnuOperat").hide();
						$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
						$("#mnuOperat").show();								
				    });
					showLoading(false,true)}, requestTimeout);
		
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');				
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=10>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=10>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=10>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');				
					
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").html(json[i].e).appendTo($tr);
							if(json[i].v==1){
								$("<td></td>").text(JS_YES).appendTo($tr);
							}else{
								$("<td></td>").text(JS_NO).appendTo($tr);
							}							
							$("<td></td>").html(json[i].y / 1000000).appendTo($tr);
							$("<td></td>").html(json[i].x / 1000000).appendTo($tr);
							$("<td></td>").html(json[i].s).appendTo($tr);
							$("<td></td>").html(json[i].d).appendTo($tr);
							$("<td data-sort="+((json[i].g == null || json[i].g.length == 0) ? json[i].g : newDate(json[i].g).getTime())+"></td>").html((json[i].g == null || json[i].g.length == 0) ? json[i].g : $.format.date(json[i].g, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td data-sort="+((json[i].r == null || json[i].r.length == 0) ? json[i].r : newDate(json[i].r).getTime())+"></td>").html((json[i].r == null || json[i].r.length == 0) ? json[i].r : $.format.date(json[i].r, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							var $address = $("<td></td>").attr("x",json[i].x).attr("y",json[i].y).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].y / 1000000 + "," + json[i].x / 1000000+">"+JS_LOCATION+" </a>").appendTo($tr);
							
							if (i < 5 && $address.isOnScreen()) {
								 $tr.addClass("geocode_address");
								 $address.addClass("geocode_address");
								 WP.map.GeoNames($address.attr("x"), $address.attr("y"), $address, "link", 0);
							}
							
							$address.unbind("hover").hover(function(e) {
								 if (!$(this).hasClass("geocode_address")) {
									 $(this).addClass("geocode_address");
									 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
								 }
							});
						}catch(e){alert(e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
							 var $td = $(this).find("td:eq(9)");
							 if ($td.isOnScreen() && !($td.hasClass("geocode_address"))) {
								 $(this).addClass("geocode_address");
								 $td.addClass("geocode_address");
								 WP.map.GeoNames($td.attr("x"), $td.attr("y"), $td, "link", 0);
							 }
						 });
					});	*/
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryExpenseRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
					isQueryTimeOut = true;
					$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
					$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
						WP.exportFileName = msg_title;
						WP.exportTableId = "table_byrtime";
						$("#mnuOperat").hide();
						$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
						$("#mnuOperat").show();								
				    });
					showLoading(false,true)}, requestTimeout);
		
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');				
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=11>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=11>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=11>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');				
					var totalCost = 0;
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").html(json[i].d).appendTo($tr);
							$("<td></td>").html(json[i].en).appendTo($tr);
							$("<td></td>").html(flag).appendTo($tr);
							$("<td></td>").html(json[i].q).appendTo($tr);
							$("<td></td>").html(json[i].c).appendTo($tr);
							$("<td></td>").html(json[i].s).appendTo($tr);
							$("<td></td>").html(json[i].b).appendTo($tr);
							$("<td></td>").html(json[i].o).appendTo($tr);
							$("<td></td>").html(json[i].g).appendTo($tr);
							$("<td></td>").html(json[i].r).appendTo($tr);
							totalCost+=json[i].c;
						}catch(e){alert(e.message);}
					}
					
					if(totalCost > 0){
						var $tr = $("<tr></tr>").appendTo($tbody);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text(JS_TOTAL).appendTo($tr);
						$("<td></td>").html(totalCost).appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
					}
					
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryPhotoRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });							   
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=7>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=7>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=7>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").text(flag).appendTo($tr);
							$("<td></td>").html(json[i].n).appendTo($tr);
							$("<td></td>").html(json[i].id).appendTo($tr);
							if(json[i].e == "1"){
								$("<td></td>").html(JS_PHOTOBYMANUAL).appendTo($tr);
							}else if(json[i].e == "2"){
								$("<td></td>").html(JS_PHOTOBYAUTO).appendTo($tr);
							}else{
								$("<td></td>").html(JS_PHOTOBYALARM).appendTo($tr);
							}						
							$("<td data-sort="+((json[i].t == null || json[i].t.length == 0) ? json[i].t : newDate(json[i].t).getTime())+"></td>").html($.format.date(json[i].t, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td></td>").html(json[i].p).appendTo($tr);
						}catch(e){alert(e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryAssetRfidRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });							   
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=6>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=6>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=6>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").text(json[i].j).appendTo($tr);
							$("<td></td>").html(json[i].n).appendTo($tr);
							$("<td></td>").html(json[i].l).appendTo($tr);				
							$("<td></td>").html(json[i].p).appendTo($tr);
							$("<td data-sort="+((json[i].t == null || json[i].t.length == 0) ? json[i].t : newDate(json[i].t).getTime())+"></td>").html($.format.date(json[i].t, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
						}catch(e){alert(e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function querySpeedChartRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.empty();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };

    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);				   
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
                    drawSpeedChart(json);
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryGraphRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $("#graph_byrtime").empty();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };

    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);				   
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json != null && json.ios != null && json.ios.length > 0){
					initChartDisplay(json.ios, json.ctsensor, json.rfuel, json.sfuel, msg_title);
                    drawGraph(json.ios);
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function popSymbolColor(){
	return symbol4Color.pop();
}

function initChartDisplay(tracks, ctsensor, rfuel_, sfuel_, msg_title){
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
        "maxHeight": 300, 
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
			showMessage("stop", msg_title, JS_MAX_ITEMS, 5);
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

function queryAlarmEventsRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true; 
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var objid = getIdByFlag(flag);
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	var eventtype = '';//default all event
	
	switch(parseInt(rpttype)){
		case 14:
			eventtype = '4107';
			break;
			
		case 15:
			eventtype = '4097';
			break;
			
		case 16:
			eventtype = '4098';
			break;
			
		case 17:
			eventtype = '4099';
			break;
		
		case 18:
			eventtype = '4100';
			break;
			
		case 19:
			eventtype = '4101';
			break;
			
		case 20:
			eventtype = '4102';
			break;
			
		case 21:
			eventtype = '4103';
			break;
			
		case 22:
			eventtype = '4110';
			break;
			
		case 23:
			eventtype = '4111';
			break;
			
		case 24:
			eventtype = '4114';
			break;
			
		case 25:
			eventtype = '4115';
			break;
			
		case 26:
			eventtype = '4164';
			break;
			
		case 27:
			eventtype = '4130';
			break;
			
		case 28:
			eventtype = '4129';
			break;
			
		case 31:
			eventtype = '16416';
			break;
			
		case 32:
			eventtype = '16417';
			break;
			
		case 35:
			eventtype = '16407';
			break;
			
		case 36:
			eventtype = '16408';
			break;
			
		case 37:
			eventtype = '16409';
			break;
			
		case 40:
			eventtype = '12320';
			break;
			
		case 44:
			eventtype = '16423';
			break;
			
		case 45:
			eventtype = '16424';
			break;
			
		case 46:
			eventtype = '16425';
			break;
			
		case 48:
			eventtype = '4170';
			break;
			
		case 49:
			eventtype = '4171';
			break;
			
		case 50:
			eventtype = '4173';
			break;
			
		case 53:
			eventtype = '20481';
			break;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"eventtype": eventtype,
				"objid": typeof objid != "undefined" ? objid : -1,
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });			   
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=13>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=13>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=13>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").html(json[i].c).appendTo($tr);
							$("<td></td>").html(json[i].a).appendTo($tr);
							$("<td></td>").html(json[i].gn).appendTo($tr);
							$("<td></td>").html(json[i].e).appendTo($tr);
							if(json[i].v==1){
								$("<td></td>").text(JS_YES).appendTo($tr);
							}else{
								$("<td></td>").text(JS_NO).appendTo($tr);
							}							
							$("<td></td>").html(json[i].y / 1000000).appendTo($tr);
							$("<td></td>").html(json[i].x / 1000000).appendTo($tr);
							$("<td></td>").html(json[i].s).appendTo($tr);
							$("<td></td>").html(json[i].d).appendTo($tr);
							$("<td data-sort="+((json[i].g == null || json[i].g.length == 0) ? json[i].g : newDate(json[i].g).getTime())+"></td>").html($.format.date(json[i].g, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td data-sort="+((json[i].r == null || json[i].r.length == 0) ? json[i].r : newDate(json[i].r).getTime())+"></td>").html($.format.date(json[i].r, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							var $address = $("<td></td>").attr("x",json[i].x).attr("y",json[i].y).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].y / 1000000 + "," + json[i].x / 1000000+">"+JS_LOCATION+" </a>").appendTo($tr);
							
							if (i < 5 && $address.isOnScreen()) {
								 $tr.addClass("geocode_address");
								 $address.addClass("geocode_address");
								 WP.map.GeoNames($address.attr("x"), $address.attr("y"), $address, "link", 0);
							}
							
							$address.unbind("hover").hover(function(e) {
								 if (!$(this).hasClass("geocode_address")) {
									 $(this).addClass("geocode_address");
									 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
								 }
							});
						}catch(e){alert(e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
							 var $td = $(this).find("td:eq(12)");	
							 if ($td.isOnScreen() && !($td.hasClass("geocode_address"))) {
								 $(this).addClass("geocode_address");
								 $td.addClass("geocode_address");
								 WP.map.GeoNames($td.attr("x"), $td.attr("y"), $td, "link", 0);
							 }
						 });
					});*/

                }
            }catch(e){
				showLoading(false); 
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryFuelChartRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.empty();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };

    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json != null && json.fuel != null && json.fuel.length > 0){
                    drawFuelChart(json);
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
			}          
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryReFuelRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=8>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=8>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=8>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					var refueltotal = 0;
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").html(flag).appendTo($tr);
							$("<td></td>").html(json[i].SENSOR_ID).appendTo($tr);
							$("<td></td>").html(json[i].FBEFORE).appendTo($tr);
							$("<td></td>").html(json[i].FAFTER).appendTo($tr);
							$("<td></td>").html(json[i].r).appendTo($tr);
							refueltotal += parseInt(json[i].r);
							$("<td></td>").html($.format.date(json[i].GPS_TIME, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							var $address = $("<td></td>").attr("x",json[i].LNG).attr("y",json[i].LAT).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].LAT / 1000000 + "," + json[i].LNG / 1000000+">"+JS_LOCATION+" </a>").appendTo($tr);
							
							if (i < 5 && $address.isOnScreen()) {
								 $tr.addClass("geocode_address");
								 $address.addClass("geocode_address");
								 WP.map.GeoNames($address.attr("x"), $address.attr("y"), $address, "link", 0);
							}
							
							$address.unbind("hover").hover(function(e) {
								 if (!$(this).hasClass("geocode_address")) {
									 $(this).addClass("geocode_address");
									 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
								 }
							});
						}catch(e){alert(e.message);}
					}
					if(refueltotal > 0){
						var $tr = $("<tr></tr>").appendTo($tbody);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text(JS_TOTAL).appendTo($tr);
						$("<td></td>").html(refueltotal).appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
							 var $td = $(this).find("td:eq(7)");							 
							 if ($td.isOnScreen() && !($td.hasClass("geocode_address"))) {
								 $(this).addClass("geocode_address");
								 $td.addClass("geocode_address");
								 WP.map.GeoNames($td.attr("x"), $td.attr("y"), $td, "link", 0);
							 }
						 });
					});	*/
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}          
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryStealFuelRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=8>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=8>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=8>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					var stealfueltotal = 0;
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").html(flag).appendTo($tr);
							$("<td></td>").html(json[i].SENSOR_ID).appendTo($tr);
							$("<td></td>").html(json[i].FBEFORE).appendTo($tr);
							$("<td></td>").html(json[i].FAFTER).appendTo($tr);
							$("<td></td>").html(json[i].s).appendTo($tr);
							stealfueltotal += parseInt(json[i].s);
							$("<td></td>").html($.format.date(json[i].GPS_TIME, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							var $address = $("<td></td>").attr("x",json[i].LNG).attr("y",json[i].LAT).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].LAT / 1000000 + "," + json[i].LNG / 1000000+">"+JS_LOCATION+" </a>").appendTo($tr);
							
							if (i < 5 && $address.isOnScreen()) {
								 $tr.addClass("geocode_address");
								 $address.addClass("geocode_address");
								 WP.map.GeoNames($address.attr("x"), $address.attr("y"), $address, "link", 0);
							}
							
							$address.unbind("hover").hover(function(e) {
								 if (!$(this).hasClass("geocode_address")) {
									 $(this).addClass("geocode_address");
									 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
								 }
							});
						}catch(e){alert(e.message);}
					}
					if(stealfueltotal > 0){
						var $tr = $("<tr></tr>").appendTo($tbody);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text(JS_TOTAL).appendTo($tr);
						$("<td></td>").html(stealfueltotal).appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
							 var $td = $(this).find("td:eq(7)");							 
							 if ($td.isOnScreen() && !($td.hasClass("geocode_address"))) {
								 $(this).addClass("geocode_address");
								 $td.addClass("geocode_address");
								 WP.map.GeoNames($td.attr("x"), $td.attr("y"), $td, "link", 0);
							 }
						 });
					});	*/
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryTempChartRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.empty();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };

    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
                    drawTempChart(json);
                }
            }catch(e){
				//alert(e);
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
			}      
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryAssetUsageRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#timebyrtime1, #timebyrtime2").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	$("#device_multi_flag").removeClass("invalidbox");
	var objectFlags = $("#device_multi_flag").val();
	var objids = "";
	if(objectFlags != null && typeof objectFlags.length != "undefined" && objectFlags.length > 0){
		for(var i = 0; i < objectFlags.length; i++){
			objids += getIdByFlag(objectFlags[i]) + ",";
		}		
		if(objids.length == 0){
			$("#device_multi_flag").addClass("invalidbox");
			mustok = false;
		}else{
			objids = objids.substring(0,objids.length - 1);
		}
	}else{
		$("#device_multi_flag").addClass("invalidbox");
		mustok = false;
	}
	
	$("#tab_byrtime").find("#cost_fuel_per_liter, #cost_mileage_per_km").each(function(){
		var value = $(this).val(); 
		if(value != ""){
			matchArray = value.match(/^([1-9]\d*|[0]{1,1})$/);
			if (matchArray == null) {
				$(this).addClass("invalidbox").focus();
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		}
	});
		
	$("#device_flag").removeClass("invalidbox");

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	$("#chart_byrtime").empty();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val().split(" ")[0] + " 00:00:00";
	var etime = $("#timebyrtime2").val().split(" ")[0] + " 00:00:00";
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 62){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 62", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objids": objids.split(','),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.post("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false); 
			var costfuel = ($("#cost_fuel_per_liter").val() == null || $("#cost_fuel_per_liter").val().length == 0) ? 0 : parseInt($("#cost_fuel_per_liter").val());
			var costmileage = ($("#cost_mileage_per_km").val() == null || $("#cost_mileage_per_km").val().length == 0) ? 0 : parseInt($("#cost_mileage_per_km").val());
			
            try{
                var json = eval('(' + data + ')');				
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=23>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=23>" + objectFlags.join(",") + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=23>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
					var assets = [];
					var Y_mil = [];
					var Y_dt = [];
					var Y_st = [];
					var Y_it = [];
					var Y_dut = [];
					var Y_sf = [];
					var Y_ef = [];
					var Y_cf = [];
					var cur_oid = -1;
					var cur_mil = 0;
					var cur_dt = 0;
					var cur_st = 0;
					var cur_its = 0;
					var cur_it = 0;
					var cur_dut = 0;
					var cur_ha = 0;
					var cur_hb = 0;
					var cur_hc = 0;
					var cur_sf = 0;
					var cur_ef = 0;
					var cur_cf = 0;
					var cur_spd = 0;
					var cur_spt = 0;
					var cur_spn = 0;
					var cur_egn = 0;
					var cur_fc = 0;
					var cur_mc = 0;
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").attr("objname",getFlagById(json[i].OBJECT_ID)).appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").text(getFlagById(json[i].OBJECT_ID)).appendTo($tr);
							$("<td></td>").html($.format.date(json[i].COLLECT_DATE, JS_DEFAULT_DATE_FMT)).appendTo($tr);
							$("<td></td>").attr("mil",(json[i].MILEAGE / 1000).toFixed(1)).html((json[i].MILEAGE / 1000).toFixed(1)).appendTo($tr);
							$("<td></td>").attr("dt",json[i].DRIVING_TIME).html(second2time(json[i].DRIVING_TIME)).appendTo($tr);
							$("<td></td>").attr("st",json[i].STOP_TIME).html(second2time(json[i].STOP_TIME)).appendTo($tr);
							$("<td></td>").html(json[i].AVG_SPEED).appendTo($tr);
							$("<td></td>").html(json[i].MAX_SPEED).appendTo($tr);
							$("<td></td>").attr("its",json[i].IDLE_TIMES).html(json[i].IDLE_TIMES).appendTo($tr);
							$("<td></td>").attr("it",json[i].IDLE_TIME).html(second2time(json[i].IDLE_TIME)).appendTo($tr);
							$("<td></td>").attr("dut",json[i].HEAVY_DUTY_TIME).html(second2time(json[i].HEAVY_DUTY_TIME)).appendTo($tr);
							$("<td></td>").attr("ha",json[i].HARSH_ACCELERATION_TIMES).html(json[i].HARSH_ACCELERATION_TIMES).appendTo($tr);
							$("<td></td>").attr("hb",json[i].HARSH_BRAKING_TIMES).html(json[i].HARSH_BRAKING_TIMES).appendTo($tr);
							$("<td></td>").attr("hc",json[i].HARSH_CORNERING_TIMES).html(json[i].HARSH_CORNERING_TIMES).appendTo($tr);
							$("<td></td>").attr("sf",json[i].SENSOR_FUEL).html(json[i].SENSOR_FUEL).appendTo($tr);
							$("<td></td>").attr("ef",json[i].ESTIMATE_FUEL).html(json[i].ESTIMATE_FUEL).appendTo($tr);
							$("<td></td>").attr("cf",json[i].CAN_FUEL).html(json[i].CAN_FUEL).appendTo($tr);
							$("<td></td>").attr("spd",json[i].SPEEDING_DIST).html(json[i].SPEEDING_DIST).appendTo($tr);
							$("<td></td>").attr("spt",json[i].SPEEDING_TIME).html(second2time(json[i].SPEEDING_TIME)).appendTo($tr);
							$("<td></td>").attr("spn",json[i].SPEEDING_COUNT).html(json[i].SPEEDING_COUNT).appendTo($tr);
							$("<td></td>").attr("egn",json[i].ENGINE_ON_COUNT).html(json[i].ENGINE_ON_COUNT).appendTo($tr);
							var fc = parseFloat(json[i].SENSOR_FUEL) * costfuel +";"+ parseFloat(json[i].ESTIMATE_FUEL) * costfuel +";"+ parseFloat(json[i].CAN_FUEL) * costfuel;
							$("<td></td>").attr("fc",fc).html(fc).appendTo($tr);
							var mc = ((json[i].MILEAGE / 1000).toFixed(1)) * costmileage;
							$("<td></td>").attr("mc",mc).html(mc).appendTo($tr);
							$("<td></td>").html(WP.JS_GROUP4NAME[WP.JS_DEVICE_ID4GROUPID[json[i].OBJECT_ID]]).appendTo($tr);
						
							if(cur_oid != json[i].OBJECT_ID){
								assets.push(getFlagById(json[i].OBJECT_ID));
								cur_oid = json[i].OBJECT_ID;
							}
						}catch(e){alert(e.message);}
					}
									
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
					
					for(var j=0; j<assets.length; j++){
						var asset = assets[j];
						cur_mil = 0;
						cur_dt = 0;
						cur_st = 0;
						cur_its = 0;
						cur_it = 0;
						cur_dut = 0;
						cur_ha = 0;
						cur_hb = 0;
						cur_hc = 0;
						cur_sf = 0;
						cur_ef = 0;
						cur_cf = 0;
						cur_spd = 0;
						cur_spt = 0;
					    cur_spn = 0;
					    cur_egn = 0;
					    cur_fcs = 0;
						cur_fce = 0;
						cur_fcc = 0;
					    cur_mc = 0;
					
						var $trs = $("#table_byrtime tbody tr[objname='"+asset+"']");
						$.each($trs, function(idx, value){
							cur_mil += parseFloat($(value).find("td:eq(3)").attr("mil"));
							cur_dt += parseFloat($(value).find("td:eq(4)").attr("dt")) / 3600.0;
							cur_st += parseFloat($(value).find("td:eq(5)").attr("st")) / 3600.0;
							cur_its += parseFloat($(value).find("td:eq(8)").attr("its"));
							cur_it += parseFloat($(value).find("td:eq(9)").attr("it")) / 3600.0;
							cur_dut += parseFloat($(value).find("td:eq(10)").attr("dut")) / 3600.0;
							cur_ha += parseFloat($(value).find("td:eq(11)").attr("ha"));
							cur_hb += parseFloat($(value).find("td:eq(12)").attr("hb"));
							cur_hc += parseFloat($(value).find("td:eq(13)").attr("hc"));
							
							cur_sf += parseFloat($(value).find("td:eq(14)").attr("sf"));
							cur_ef += parseFloat($(value).find("td:eq(15)").attr("ef"));
							cur_cf += parseFloat($(value).find("td:eq(16)").attr("cf"));
							
							cur_spd += parseFloat($(value).find("td:eq(17)").attr("spd"));
							cur_spt += parseFloat($(value).find("td:eq(18)").attr("spt"));
							cur_spn += parseFloat($(value).find("td:eq(19)").attr("spn"));
							cur_egn += parseFloat($(value).find("td:eq(20)").attr("egn"));
							cur_fcs += parseFloat($(value).find("td:eq(21)").attr("fc").split(";")[0]);
							cur_fce += parseFloat($(value).find("td:eq(21)").attr("fc").split(";")[1]);
							cur_fcc += parseFloat($(value).find("td:eq(21)").attr("fc").split(";")[2]);
							cur_mc += parseFloat($(value).find("td:eq(22)").attr("mc"));
							
							if (idx == $trs.length - 1){
								Y_mil.push(parseFloat(cur_mil.toFixed(1)));
								Y_dt.push(parseFloat(cur_dt.toFixed(1)));
								Y_st.push(parseFloat(cur_st.toFixed(1)));
								Y_it.push(parseFloat(cur_it.toFixed(1)));
								Y_dut.push(parseFloat(cur_dut.toFixed(1)));
								Y_sf.push(parseFloat(cur_sf.toFixed(1)));
								Y_ef.push(parseFloat(cur_ef.toFixed(1)));
								Y_cf.push(parseFloat(cur_cf.toFixed(1)));
								
								var $tr = $("<tr style='background-color: #D5D5D5'></tr>");
								$(value).after($tr);
								$("<td></td>").text("").appendTo($tr);
								$("<td></td>").text("").appendTo($tr);
								$("<td></td>").text(JS_TOTAL).appendTo($tr);
								$("<td></td>").text(cur_mil.toFixed(1)).appendTo($tr);
								$("<td></td>").text(second2time(parseInt(cur_dt * 3600))).appendTo($tr);
								$("<td></td>").text(second2time(parseInt(cur_st * 3600))).appendTo($tr);
								$("<td></td>").text("").appendTo($tr);
								$("<td></td>").text("").appendTo($tr);
								$("<td></td>").text(cur_its).appendTo($tr);
								$("<td></td>").text(second2time(parseInt(cur_it * 3600))).appendTo($tr);
								$("<td></td>").text(second2time(parseInt(cur_dut * 3600))).appendTo($tr);
								$("<td></td>").text(cur_ha).appendTo($tr);
								$("<td></td>").text(cur_hb).appendTo($tr);
								$("<td></td>").text(cur_hc).appendTo($tr);
								$("<td></td>").text(cur_sf.toFixed(2)).appendTo($tr);
								$("<td></td>").text(cur_ef.toFixed(2)).appendTo($tr);
								$("<td></td>").text(cur_cf.toFixed(2)).appendTo($tr);
								$("<td></td>").text(cur_spd.toFixed(2)).appendTo($tr);
								$("<td></td>").text(second2time(parseInt(cur_spt))).appendTo($tr);
								$("<td></td>").text(cur_spn).appendTo($tr);
								$("<td></td>").text(cur_egn).appendTo($tr);
								$("<td></td>").text(cur_fcs +";"+ cur_fce +";"+ cur_fcc).appendTo($tr);
								$("<td></td>").text(cur_mc.toFixed(1)).appendTo($tr);
								$("<td></td>").text("").appendTo($tr);
							}
						});
					}
					
					drawUsageChart(assets, Y_mil, Y_dt, Y_st, Y_it, Y_sf, Y_ef, Y_cf, Y_dut);
                }
            }catch(e){
				//alert(e.message);
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}            
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryTempGasMilHourRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#timebyrtime1, #timebyrtime2").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	$("#device_multi_flag").removeClass("invalidbox");
	var objectFlags = $("#device_multi_flag").val();
	var objids = "";
	if(objectFlags != null && typeof objectFlags.length != "undefined" && objectFlags.length > 0){
		for(var i = 0; i < objectFlags.length; i++){
			objids += getIdByFlag(objectFlags[i]) + ",";
		}		
		if(objids.length == 0){
			$("#device_multi_flag").addClass("invalidbox");
			mustok = false;
		}else{
			objids = objids.substring(0,objids.length - 1);
		}
	}else{
		$("#device_multi_flag").addClass("invalidbox");
		mustok = false;
	}
		
	$("#device_flag").removeClass("invalidbox");

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	$("#chart_byrtime").empty();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 1){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 1", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objids": objids.split(','),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.post("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false); 
			
            try{
                var json = eval('(' + data + ')');				
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=10>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=10>" + objectFlags.join(",") + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=10>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
					var assets = [];
					var cur_name = null;					
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").attr("objname",json[i].OBJECT_FLAG).appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").text(json[i].OBJECT_FLAG).appendTo($tr);
							$("<td></td>").text(json[i].DEVICE_SIM).appendTo($tr);
							$("<td></td>").text(json[i].T1).appendTo($tr);
							$("<td></td>").text(json[i].T2).appendTo($tr);
							$("<td></td>").text(json[i].F1).appendTo($tr);
							$("<td></td>").text(json[i].F2).appendTo($tr);
							$("<td></td>").text(json[i].MIL).appendTo($tr);						
							$("<td></td>").html($.format.date(json[i].GPS_TIME, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td></td>").html($.format.date(json[i].RCV_TIME, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);																			
						
							if(cur_name != json[i].OBJECT_FLAG){
								assets.push(json[i].OBJECT_FLAG);
								cur_name = json[i].OBJECT_FLAG;
							}
						}catch(e){alert(e.message);}
					}
									
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");					
                }
            }catch(e){
				//alert(e.message);
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}            
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryAssetRtUsageRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	$("#tab_byrtime").find("#cost_fuel_per_liter, #cost_mileage_per_km").each(function(){
		var value = $(this).val(); 
		if(value != ""){
			matchArray = value.match(/^([1-9]\d*|[0]{1,1})$/);
			if (matchArray == null) {
				$(this).addClass("invalidbox").focus();
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		}
	});
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }

	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	
	if(timeRange > 30){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 30", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false); 
			var costfuel = ($("#cost_fuel_per_liter").val() == null || $("#cost_fuel_per_liter").val().length == 0) ? 0 : parseInt($("#cost_fuel_per_liter").val());
			var costmileage = ($("#cost_mileage_per_km").val() == null || $("#cost_mileage_per_km").val().length == 0) ? 0 : parseInt($("#cost_mileage_per_km").val());
			
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=22>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=22>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=22>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").text(flag).appendTo($tr);
							$("<td></td>").html(json[i].m).appendTo($tr);
							$("<td></td>").html(json[i].dt).appendTo($tr);
							$("<td></td>").html(json[i].st).appendTo($tr);
							$("<td></td>").html(json[i].s).appendTo($tr);
							$("<td></td>").html(json[i].ms).appendTo($tr);
							$("<td></td>").html(json[i].its).appendTo($tr);
							$("<td></td>").html(json[i].it).appendTo($tr);
							$("<td></td>").html(json[i].dut).appendTo($tr);
							$("<td></td>").html(json[i].has).appendTo($tr);
							$("<td></td>").html(json[i].hbs).appendTo($tr);
							$("<td></td>").html(json[i].hcs).appendTo($tr);
							$("<td></td>").html(json[i].sfc).appendTo($tr);
							$("<td></td>").html(json[i].efc).appendTo($tr);
							$("<td></td>").html(json[i].cfc).appendTo($tr);
							$("<td></td>").html(json[i].spd).appendTo($tr);
							$("<td></td>").html(json[i].spt).appendTo($tr);
							$("<td></td>").html(json[i].spc).appendTo($tr);
							$("<td></td>").html(json[i].engc).appendTo($tr);
							$("<td></td>").html(parseFloat(json[i].sfc) * costfuel +";"+ parseFloat(json[i].efc) * costfuel +";"+ parseFloat(json[i].cfc) * costfuel).appendTo($tr);
							$("<td></td>").html(json[i].m * costmileage).appendTo($tr);
						}catch(e){alert(e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}            
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryDailyTravelRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }

	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	//var stime = $.trim($("#timebyrtime3").val());
	//var etime = new Date(newDate(stime + " 00:00:00").valueOf() + 1*24*60*60*1000 + new Date().getTimezoneOffset()*60*1000);
	//etime = $.format.date(etime, 'yyyy-MM-dd');
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
	var rduration = parseInt($("#stop_rduration").val());
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 31){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 31", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime,
				"rduration": rduration
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=12>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=12>" + flag + "</td></tr>";
					//WP.reportHeader += "<tr><td colspan=12>" + $.format.date(stime + " 00:00:00", JS_DEFAULT_DATE_FMT) + " - " + $.format.date(etime + " 00:00:00", JS_DEFAULT_DATE_FMT) + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=12>" + $.format.date(stime + " 00:00:00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(getCurentDateTime(), JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					var distancetotal = 0, haveTemps = false, haveDoorTime = false;
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(json[i].SN).appendTo($tr);
							
							if(json[i].START_STATE == "ON"){
								$("<td></td>").text(JS_STATUS_MOVING).appendTo($tr);
							}else{
								$("<td></td>").text(JS_STATUS_STOPPED).appendTo($tr);
							}
							
							$("<td></td>").html(json[i].START_TIME).appendTo($tr);
							$("<td></td>").html(json[i].END_TIME).appendTo($tr);
							$("<td></td>").html(json[i].TRIP_TIME).appendTo($tr);
							
							if(json[i].START_STATE == "ON"){
								$("<td></td>").html(json[i].MILEAGE).appendTo($tr);
								if(json[i].MILEAGE != null){
									distancetotal += parseFloat(json[i].MILEAGE);
								}
							}else{
								$("<td></td>").html('').appendTo($tr);
							}
							
							if(json[i].START_STATE != "ON"){
								var startLocation = json[i].UNION_EXTSTA.substring(9,json[i].UNION_EXTSTA.length);
								var $startAddress = $("<td colspan='3'></td>").attr("x",startLocation.split(',')[1] * 1000000).attr("y",startLocation.split(',')[0] * 1000000).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+startLocation+">"+startLocation+" </a>").appendTo($tr);
								$startAddress.addClass("is_address");
								
								if (i < 5 && $startAddress.isOnScreen()) {
									 $startAddress.addClass("geocode_address");
									 WP.map.GeoNames($startAddress.attr("x"), $startAddress.attr("y"), $startAddress, "link", 0);
								}
								$startAddress.unbind("hover").hover(function(e) {
									 if (!$(this).hasClass("geocode_address")) {
										 $(this).addClass("geocode_address");
										 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
									 }
								});
							}else{
								$("<td></td>").html('').appendTo($tr);
							}
							
							if(json[i].START_STATE == "ON"){
								$("<td></td>").html(json[i].AVG_SPEED).appendTo($tr);
								$("<td></td>").html(json[i].MAX_SPEED).appendTo($tr);
							}
							
							$("<td></td>").html(json[i].IDLE_TIME).appendTo($tr);
							
							var tempsStr = temps2Html(json[i].TEMPS.substring(6,json[i].TEMPS.length));
							$("<td></td>").html(json[i].TEMPS == null ? "" : tempsStr).appendTo($tr);
							
							if(json[i].TEMPS != null && tempsStr.length > 0){
								haveTemps = true;
							}
							
							$("<td></td>").html(json[i].DOOR_OPEN_TIME).appendTo($tr);
							
							if(json[i].DOOR_OPEN_TIME != "00:00:00"){
								haveDoorTime = true;
							}						
						}catch(e){alert(e.message);}
					}
					
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");

					if(distancetotal > 0){
						var $tr = $("<tr></tr>").appendTo($tbody);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text(JS_TOTAL).appendTo($tr);
						$("<td></td>").html(distancetotal.toFixed(1)).appendTo($tr);
						
					}
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr"), function(i,value){
							 var $tdstart = $(this).find("td:eq(6)");
							 if ($tdstart.isOnScreen() && !($tdstart.hasClass("geocode_address"))) {
								 $tdstart.addClass("geocode_address");
								 WP.map.GeoNames($tdstart.attr("x"), $tdstart.attr("y"), $tdstart, "link", 0);
							 }
						 });
					});*/	
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function temps2Html(temps){
	//alert(temps);
	var WP = window.parent;
	var html = "";
	var ts = temps.split(',');
	for(var i = 1; i < ts.length + 1; i++){
		console.log(ts[i]);
		if(ts[i - 1] != null && parseFloat(ts[i - 1]) > -90){
			var T = tempUnitConversion(ts[i -1], WP.JS_UNIT_TEMPERATURE);
			html += "T" + i +": "+ T +"&nbsp;"+ WP.UNIT_TEMP + "<br>";
		}
	}
	return html;
}

function queryNotReportedRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var WP = window.parent;
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var stime = $("#timebyrtime1").val() + ":00";
    var opts = {"rtime": true, "type": parseInt(rpttype)};

    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=14>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=14>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					var sn = 0;
					for(var i=0; i<json.length; i++)
					{
						try{
							if(json[i].r.length == 0 || newDate(json[i].r).getTime() < newDate(stime).getTime()){
								var $tr = $("<tr></tr>").appendTo($tbody);
								$("<td></td>").text(sn+1).appendTo($tr);
								$("<td></td>").text(json[i].c).appendTo($tr);
								$("<td></td>").text(json[i].n).appendTo($tr);
								//$("<td></td>").text(json[i].sim).appendTo($tr);
								$("<td></td>").html(json[i].e).appendTo($tr);
								var odometer = WP.getIdValue("A:",json[i].q);
								var engineHour = WP.getIdValue("11:",json[i].q);
								var innerBattery = WP.getIdValue("1:",json[i].q);
								
								if(odometer != null){
									$("<td></td>").html(parseInt(odometer)/10.0).appendTo($tr);
								}else{
									$("<td></td>").html("").appendTo($tr);
								}
								
								if(engineHour != null){
									$("<td></td>").html(engineHour).appendTo($tr);
								}else{
									$("<td></td>").html("").appendTo($tr);
								}
								if(innerBattery != null){
									$("<td></td>").html(innerBattery + "%").appendTo($tr);
								}else{
									$("<td></td>").html("").appendTo($tr);
								}
							
								if(json[i].v==1){
									$("<td></td>").text(JS_YES).appendTo($tr);
								}else{
									$("<td></td>").text(JS_NO).appendTo($tr);
								}								
								$("<td></td>").html(json[i].y / 1000000).appendTo($tr);
								$("<td></td>").html(json[i].x / 1000000).appendTo($tr);
								$("<td></td>").html(json[i].s).appendTo($tr);
								$("<td></td>").html(json[i].d).appendTo($tr);
								$("<td data-sort="+((json[i].g == null || json[i].g.length == 0) ? json[i].g : newDate(json[i].g).getTime())+"></td>").html((json[i].g == null || json[i].g.length == 0) ? json[i].g : $.format.date(json[i].g, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
								
								if(typeof json[i].r != "undefined" && json[i].r.length > 0){
									var recpTip = "";
									var time = newDate(json[i].r).getTime() + new Date().getTimezoneOffset()*60*1000;
									var timenow = new Date().getTime();
									//seconds
									var timeout = (timenow - time) / 1000.0;
									if(timeout < 0){
										
									}else if(timeout >= 0 && timeout < 60){
										recpTip = " (<1" + WP.JS_TIMEOUT_MINS +')';
									}else if(timeout >=60 && timeout < 3600){
										recpTip = " (>" + parseInt(timeout/60) + WP.JS_TIMEOUT_MINS +')';
									}else if(timeout >=3600 && timeout < 3600 * 24){
										recpTip = " (>" + parseInt(timeout/3600) + WP.JS_TIMEOUT_HOUR +')';
									}else if(timeout >=3600 * 24 && timeout < 3600 * 24 * 7){
										recpTip = " (>" + parseInt(timeout/(3600 * 24)) + WP.JS_TIMEOUT_DAY +')';
									}else if(timeout >=3600 * 24 * 7 && timeout < 3600 * 24 * 30){
										recpTip = " (>" + parseInt(timeout/(3600 * 24 * 7)) + WP.JS_TIMEOUT_WEEK +')';
									}else if(timeout >=3600 * 24 * 30 && timeout < 3600 * 24 * 365){
										recpTip = " (>" + parseInt(timeout/(3600 * 24 * 30)) + WP.JS_TIMEOUT_MON +')';
									}else{
										recpTip = " (>" + parseInt(timeout/(3600 * 24 * 365)) + WP.JS_TIMEOUT_YEAR +')';
									}
									$("<td data-sort="+((json[i].r == null || json[i].r.length == 0) ? json[i].r : newDate(json[i].r).getTime())+"></td>").html((json[i].r == null || json[i].r.length == 0) ? json[i].r : $.format.date(json[i].r, JS_DEFAULT_DATETIME_fmt_JS) + recpTip).appendTo($tr);
								}else{
									$("<td data-sort="+((json[i].r == null || json[i].r.length == 0) ? json[i].r : newDate(json[i].r).getTime())+"></td>").html((json[i].r == null || json[i].r.length == 0) ? json[i].r : $.format.date(json[i].r, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
								}
								var $address = $("<td></td>").attr("x",json[i].x).attr("y",json[i].y).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].y / 1000000 + "," + json[i].x / 1000000+">"+JS_LOCATION+" </a>").appendTo($tr);
								$("<td style='display:none'></td>").html(json[i].gname).appendTo($tr);
								
								if (i < 5 && $address.isOnScreen()) {
									 $tr.addClass("geocode_address");
									 $address.addClass("geocode_address");
									 WP.map.GeoNames($address.attr("x"), $address.attr("y"), $address, "link", 0);
								}
								
								$address.unbind("hover").hover(function(e) {
									 if (!$(this).hasClass("geocode_address")) {
										 $(this).addClass("geocode_address");
										 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
									 }
								});
								sn++;
							}							
						}catch(e){alert(json[i].r + ';'+e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
							 var $td = $(this).find("td:eq(13)");							 
							 if ($td.isOnScreen() && !($td.hasClass("geocode_address"))) {
								 $(this).addClass("geocode_address");
								 $td.addClass("geocode_address");
								 WP.map.GeoNames($td.attr("x"), $td.attr("y"), $td, "link", 0);
							 }
						 });
					});	*/
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}          
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryMaxSpeedRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	
	var WP = window.parent;
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	
	var flag = $("#device_flag").val();
	var objid = getIdByFlag(flag);
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
	/*var stime = $.trim($("#timebyrtime3").val());
	var etime = new Date(newDate(stime + " 00:00:00").valueOf() + 1*24*60*60*1000 + new Date().getTimezoneOffset()*60*1000);
	etime = $.format.date(etime, 'yyyy-MM-dd');
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);*/
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 31){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 31", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": typeof objid != "undefined" ? objid : -1,
				"stime": stime,
				"etime": etime
			   };

    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=9>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=9>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=9>" + $.format.date(stime + " 00:00:00", JS_DEFAULT_DATE_FMT) + " - " + $.format.date(etime + " 00:00:00", JS_DEFAULT_DATE_FMT) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					var sn = 0;
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(sn+1).appendTo($tr);
							$("<td></td>").text(json[i].OBJECT_FLAG).appendTo($tr);
							$("<td></td>").html(json[i].GROUP_NAME).appendTo($tr);
							$("<td></td>").text(json[i].DRIVER_NAME).appendTo($tr);
							$("<td></td>").html(json[i].USERDEF_FLAG).appendTo($tr);
							$("<td data-sort="+((json[i].GPS_TIME == null || json[i].GPS_TIME.length == 0) ? json[i].GPS_TIME : newDate(json[i].GPS_TIME).getTime())+"></td>").text(json[i].GPS_TIME).appendTo($tr);
							$("<td></td>").html(json[i].LAT).appendTo($tr);
							$("<td></td>").html(json[i].LNG).appendTo($tr);							
							$("<td></td>").html(json[i].MAX_SPEED).appendTo($tr);														
						}catch(e){alert(e.message);}
						sn++;
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");					
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}     
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryAlcoholADRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	var WP = window.parent;
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	
	var flag = $("#device_flag").val();
	var objid = getIdByFlag(flag);
	var stime = $.trim($("#timebyrtime3").val());
	var etime = new Date(newDate(stime + " 00:00:00").valueOf() + 1*24*60*60*1000 + new Date().getTimezoneOffset()*60*1000);
	etime = $.format.date(etime, 'yyyy-MM-dd');
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 2){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 2", 5);	
		return;
	}
	
   var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };

    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=5>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=5>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=5>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					var sn = 0;
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(sn+1).appendTo($tr);
							$("<td></td>").text(json[i].C).appendTo($tr);
							$("<td></td>").html(json[i].L).appendTo($tr);
							$("<td></td>").text(json[i].H).appendTo($tr);
							$("<td></td>").html(json[i].A).appendTo($tr);															
						}catch(e){alert(e.message);}
						sn++;
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");					
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function querySpeedingTimeRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	
	var WP = window.parent;
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	
	var flag = $("#device_flag").val();
	var objid = getIdByFlag(flag);
	
	var stime = $.trim($("#timebyrtime3").val());
	var etime = new Date(newDate(stime + " 00:00:00").valueOf() + 1*24*60*60*1000 + new Date().getTimezoneOffset()*60*1000);
	etime = $.format.date(etime, 'yyyy-MM-dd');
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 2){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 2", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": typeof objid != "undefined" ? objid : -1,
				"stime": stime,
				"etime": etime
			   };

    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=14>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=14>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=14>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					var sn = 0;
					var totalsec = 0;
					var totaldist = 0;
					var totalavspeed = 0;
					var totalmaxspeed = 0;
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(sn+1).appendTo($tr);
							$("<td></td>").text(json[i].OBJECT_FLAG).appendTo($tr);
							$("<td></td>").html(json[i].GROUP_NAME).appendTo($tr);
							$("<td></td>").text(json[i].DRIVER_NAME).appendTo($tr);
							$("<td></td>").html(json[i].USERDEF_FLAG).appendTo($tr);
							$("<td></td>").text(json[i].AV_SPEED).appendTo($tr);
							$("<td></td>").text(json[i].MAX_SPEED).appendTo($tr);
							$("<td></td>").html(json[i].LAT / 1000000).appendTo($tr);
							$("<td></td>").html(json[i].LNG / 1000000).appendTo($tr);
							$("<td></td>").html($.format.date(json[i].GPS_TIME_START, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td></td>").html($.format.date(json[i].GPS_TIME_END, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td></td>").html(json[i].LAST_TIME_FORMAT).appendTo($tr);
							$("<td></td>").html(json[i].DISTANCE).appendTo($tr);
							var $address = $("<td></td>").attr("x",json[i].LNG).attr("y",json[i].LAT).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].LAT + "," + json[i].LNG +">"+JS_LOCATION+" </a>").appendTo($tr);
							
							if (i < 5 && $address.isOnScreen()) {
								 $tr.addClass("geocode_address");
								 $address.addClass("geocode_address");
								 WP.map.GeoNames($address.attr("x"), $address.attr("y"), $address, "link", 0);
							}
							
							$address.unbind("hover").hover(function(e) {
								 if (!$(this).hasClass("geocode_address")) {
									 $(this).addClass("geocode_address");
									 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
								 }
							});
							
							totalsec += json[i].LAST_TIME_SECOND;
							totaldist += json[i].DISTANCE;
							
							if(i == 0){
								totalavspeed = json[i].AV_SPEED;
							}else{
								totalavspeed = (totalavspeed + json[i].AV_SPEED) / 2;
							}
							
							if(totalmaxspeed < json[i].MAX_SPEED){
								totalmaxspeed = json[i].MAX_SPEED
							}
						}catch(e){alert(e.message);}
						sn++;
					}
					if(totalsec > 0){
						var $tr = $("<tr></tr>").appendTo($tbody);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text(JS_TOTAL).appendTo($tr);
						$("<td></td>").text(totalavspeed.toFixed(0)).appendTo($tr);
						$("<td></td>").text(totalmaxspeed.toFixed(0)).appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").html(second2time(totalsec)).appendTo($tr);
						$("<td></td>").text(totaldist.toFixed(2)).appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
					}
					
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
							 var $td = $(this).find("td:eq(13)");							 
							 if ($td.isOnScreen() && !($td.hasClass("geocode_address"))) {
								 $(this).addClass("geocode_address");
								 $td.addClass("geocode_address");
								 WP.map.GeoNames($td.attr("x"), $td.attr("y"), $td, "link", 0);
							 }
						 });
					});*/
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}     
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryStopsDetailRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	
	var WP = window.parent;
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	
	var flag = $("#device_flag").val();
	var objid = getIdByFlag(flag);
	
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	var rduration = parseInt($("#stop_rduration").val());
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 31){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 31", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": typeof objid != "undefined" ? objid : -1,
				"stime": stime,
				"etime": etime,
				"rduration": rduration
			   };
	
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=11>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=11>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=11>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					var sn = 0;
					var totalsec = 0;

					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(sn+1).appendTo($tr);
							$("<td></td>").text(json[i].OBJECT_FLAG).appendTo($tr);
							$("<td></td>").html(json[i].GROUP_NAME).appendTo($tr);
							$("<td></td>").text(json[i].DRIVER_NAME).appendTo($tr);
							$("<td></td>").html(json[i].USERDEF_FLAG).appendTo($tr);
							$("<td></td>").html(json[i].LAT / 1000000).appendTo($tr);
							$("<td></td>").html(json[i].LNG / 1000000).appendTo($tr);
							$("<td></td>").html($.format.date(json[i].START_TIME, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td></td>").html($.format.date(json[i].END_TIME, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td></td>").html(json[i].DURATION).appendTo($tr);
							var $address = $("<td></td>").attr("x",json[i].LNG).attr("y",json[i].LAT).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].LAT + "," + json[i].LNG +">"+JS_LOCATION+" </a>").appendTo($tr);
							
							if (i < 5 && $address.isOnScreen()) {
								 $tr.addClass("geocode_address");
								 $address.addClass("geocode_address");
								 WP.map.GeoNames($address.attr("x"), $address.attr("y"), $address, "link", 0);
							}
							
							$address.unbind("hover").hover(function(e) {
								 if (!$(this).hasClass("geocode_address")) {
									 $(this).addClass("geocode_address");
									 WP.map.GeoNames($(this).attr("x"), $(this).attr("y"), $(this), "link", 0);
								 }
							});
							
							totalsec += json[i].DURATION_SECOND;
							
						}catch(e){alert(e.message);}
						sn++;
					}
					if(totalsec > 0){
						var $tr = $("<tr></tr>").appendTo($tbody);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
						$("<td></td>").text(JS_TOTAL).appendTo($tr);
						$("<td></td>").html(second2time(totalsec)).appendTo($tr);
						$("<td></td>").text("").appendTo($tr);
					}
					
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
							 var $td = $(this).find("td:eq(10)");	
							 if ($td.isOnScreen() && !($td.hasClass("geocode_address"))) {
								 $(this).addClass("geocode_address");
								 $td.addClass("geocode_address");
								 WP.map.GeoNames($td.attr("x"), $td.attr("y"), $td, "link", 0);
							 }
						 });
					});	*/
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}     
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryMovesDetailRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	
	var WP = window.parent;
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	
	var flag = $("#device_flag").val();
	var objid = getIdByFlag(flag);
	
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();	
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 31){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 31", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": typeof objid != "undefined" ? objid : -1,
				"stime": stime,
				"etime": etime,
				"distance": 10
			   };
	
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=13>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=13>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=13>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					var sn = 0;

					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(sn+1).appendTo($tr);
							$("<td></td>").text(json[i].OBJECT_FLAG).appendTo($tr);
							$("<td></td>").html(json[i].GROUP_NAME).appendTo($tr);
							$("<td></td>").text(json[i].DRIVER_NAME).appendTo($tr);
							$("<td></td>").html(json[i].USERDEF_FLAG).appendTo($tr);
							$("<td></td>").html(json[i].GPS_TIME_START).appendTo($tr);							
							var $address_start = $("<td></td>").attr("x",json[i].LNG_START * 1000000).attr("y",json[i].LAT_START * 1000000).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].LAT_START + "," + json[i].LNG_START +">"+JS_LOCATION+" </a>").appendTo($tr);
							
							if (i < 5 && $address_start.isOnScreen()) {
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
							
							$("<td></td>").html(json[i].e1).appendTo($tr);	
							$("<td></td>").html(json[i].GPS_TIME_END).appendTo($tr);
							var $address_end = $("<td></td>").attr("x",json[i].LNG_END * 1000000).attr("y",json[i].LAT_END * 1000000).html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+json[i].LAT_END + "," + json[i].LNG_END +">"+JS_LOCATION+" </a>").appendTo($tr);
							
							if (i < 5 && $address_end.isOnScreen()) {
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
							$("<td></td>").html(json[i].e2).appendTo($tr);
							$("<td></td>").html(json[i].DURATION).appendTo($tr);
							$("<td></td>").html(parseFloat(json[i].DISTANCE / 1000.0).toFixed(2)).appendTo($tr);
							
						}catch(e){alert(e.message);}
						sn++;
					}
					
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");			
					
					/*$table.parent().scroll(function(e){
						 $.each($table.find("tbody tr:not(.geocode_address)"), function(i,value){
							 var $tdstart = $(this).find("td:eq(6)");							 
							 if ($tdstart.isOnScreen() && !($tdstart.hasClass("geocode_address"))) {
								 $tdstart.addClass("geocode_address");
								 WP.map.GeoNames($tdstart.attr("x"), $tdstart.attr("y"), $tdstart, "link", 0);
							 }
							 
							 var $tdend = $(this).find("td:eq(9)");							 
							 if ($tdend.isOnScreen() && !($tdend.hasClass("geocode_address"))) {
								 $tdend.addClass("geocode_address");
								 WP.map.GeoNames($tdend.attr("x"), $tdend.attr("y"), $tdend, "link", 0);
							 }
						 });
					});*/
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}     
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryPlaceEventDetailRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }

	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 31){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 31", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false); 
			
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=23>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=23>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=23>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").text(flag).appendTo($tr);
							$("<td></td>").text(json[i].DRIVER_NAME).appendTo($tr);
							$("<td></td>").text(json[i].AREA_NAME).appendTo($tr);
							$("<td></td>").text(json[i].IN_TIME).appendTo($tr);
							$("<td></td>").text(json[i].OUT_TIME).appendTo($tr);
							$("<td></td>").html(second2time(json[i].DURATION)).appendTo($tr);
							$("<td></td>").html(parseFloat(json[i].MILEAGE / 1000.0).toFixed(2)).appendTo($tr);
							$("<td></td>").html(second2time(json[i].DRIVING_TIME)).appendTo($tr);
							$("<td></td>").html(second2time(json[i].STOP_TIME)).appendTo($tr);
							$("<td></td>").html(json[i].AVG_SPEED).appendTo($tr);
							$("<td></td>").html(json[i].MAX_SPEED).appendTo($tr);
							$("<td></td>").html(json[i].IDLE_TIMES).appendTo($tr);
							$("<td></td>").html(second2time(json[i].IDLE_TIME)).appendTo($tr);
							$("<td></td>").html(json[i].HARSH_ACCELERATION_TIMES).appendTo($tr);
							$("<td></td>").html(json[i].HARSH_BRAKING_TIMES).appendTo($tr);
							$("<td></td>").html(json[i].HARSH_CORNERING_TIMES).appendTo($tr);
							$("<td></td>").html(json[i].SENSOR_FUEL).appendTo($tr);
							$("<td></td>").html(json[i].ESTIMATE_FUEL).appendTo($tr);
							$("<td></td>").html(json[i].CAN_FUEL).appendTo($tr);
							$("<td></td>").html(parseFloat(json[i].OVER_SPEED_DIST).toFixed(2)).appendTo($tr);
							$("<td></td>").html(second2time(json[i].OVER_SPEED_TIME)).appendTo($tr);
							$("<td></td>").html(json[i].OVER_SPEED_COUNT).appendTo($tr);
						}catch(e){alert(e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}            
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryUserLoginRecordRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var uname = $("#user_name").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"uname": uname,
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=5>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=5>" + uname + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=5>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").html(json[i].un).appendTo($tr);
							$("<td data-sort="+((json[i].lt == null || json[i].lt.length == 0) ? json[i].lt : newDate(json[i].lt).getTime())+"></td>").html($.format.date(json[i].lt, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td></td>").html(json[i].ip).appendTo($tr);
							$("<td></td>").html(json[i].zo).appendTo($tr);							
						}catch(e){alert(e.message);}
					}
					
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function queryTaskDetailRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }

	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
	
	var timeRange = (newDate(etime).getTime() - newDate(stime).getTime()) / (3600*24*1000);
	if(timeRange > 31){
		$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
		showMessage("stop", msg_title, JS_TIME_RANGE_LESS_THAN + " 31", 5);	
		return;
	}
	
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false); 
			
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=24>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=24>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=24>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").text(flag).appendTo($tr);
							$("<td></td>").html(json[i].DRIVER_NAME).appendTo($tr);
							$("<td></td>").html(json[i].TASK_NAME).appendTo($tr);
							if(json[i].TASK_STATUS == 2){
								$("<td></td>").html(JS_INFO_TASK_COMPLETED).appendTo($tr);
							}else{
								$("<td></td>").html(JS_INFO_TASK_FAIL).appendTo($tr);
							}
							
							$("<td data-sort="+((json[i].START_TIME == null || json[i].START_TIME.length == 0) ? json[i].START_TIME : newDate(json[i].START_TIME).getTime())+"></td>").html(json[i].START_TIME).appendTo($tr);
							$("<td data-sort="+((json[i].END_TIME == null || json[i].END_TIME.length == 0) ? json[i].END_TIME : newDate(json[i].END_TIME).getTime())+"></td>").html(json[i].END_TIME).appendTo($tr);
							$("<td data-sort="+json[i].DURATION+"></td>").html(second2time(json[i].DURATION)).appendTo($tr);
							$("<td></td>").html(parseFloat(json[i].MILEAGE / 1000.0).toFixed(2)).appendTo($tr);
							$("<td data-sort="+json[i].DRIVING_TIME+"></td>").html(second2time(json[i].DRIVING_TIME)).appendTo($tr);
							$("<td data-sort="+json[i].STOP_TIME+"></td>").html(second2time(json[i].STOP_TIME)).appendTo($tr);
							$("<td></td>").html(json[i].AVG_SPEED).appendTo($tr);
							$("<td></td>").html(json[i].MAX_SPEED).appendTo($tr);
							$("<td></td>").html(json[i].IDLE_TIMES).appendTo($tr);
							$("<td data-sort="+json[i].IDLE_TIME+"></td>").html(second2time(json[i].IDLE_TIME)).appendTo($tr);
							$("<td></td>").html(json[i].HARSH_ACCELERATION_TIMES).appendTo($tr);
							$("<td></td>").html(json[i].HARSH_BRAKING_TIMES).appendTo($tr);
							$("<td></td>").html(json[i].HARSH_CORNERING_TIMES).appendTo($tr);
							$("<td></td>").html(json[i].SENSOR_FUEL).appendTo($tr);
							$("<td></td>").html(json[i].ESTIMATE_FUEL).appendTo($tr);
							$("<td></td>").html(json[i].CAN_FUEL).appendTo($tr);
							$("<td></td>").html(parseFloat(json[i].OVER_SPEED_DIST).toFixed(2)).appendTo($tr);
							$("<td data-sort="+json[i].OVER_SPEED_TIME+"></td>").html(second2time(json[i].OVER_SPEED_TIME)).appendTo($tr);
							$("<td></td>").html(json[i].OVER_SPEED_COUNT).appendTo($tr);
						}catch(e){alert(e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}            
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}


function doSearch(msg_title, by, search_fun, refresh_fun){
    var time1 = $("#time" + by + "1").val();
    var time2 = $("#time" + by + "2").val();
    var collect_by = by == "byobj" ? 0 : 1;
    var rpttype = $("#rpttype" + by).val();
    var objid = 0;
    if(collect_by == 0){
        var deviceobj = $("#deviceobj").val();
        objid = getIdByFlag(deviceobj);
    }
    if((collect_by == 0 && objid == 0) || time1 == "" || time2 == ""){
        showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
    $("#search" + by).attr("disabled",true).unbind("click");
        
    $table = $("#tab_"+by+" table");
    $table.find("tbody").remove();
    var opts = {"collect": collect_by, "time1": time1, "time2": time2, "type": parseInt(rpttype)};
    if(collect_by == 0){
        opts.objid = objid;
    }
    try{        
        showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
                    doRefreshList(by, json);
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
            $("#search" + by).removeAttr("disabled").bind("click", search_fun);
        });
    }catch(e){
        showLoading(false)
        $("#search" + by).removeAttr("disabled").bind("click", search_fun);
    }
}

function doQueryByRtime(){
	var msg_title = $("#rpttypebyrtime").find("option:selected").text();
	var by = $("#rpttypebyrtime").val();
	var flag = $("#device_flag").val();
	var time1 = $("#timebyrtime1").val();
    var time2 = $("#timebyrtime2").val();

	doQueryRpt(msg_title, by, flag, time1, time2);
}

function doSearchByObject(){
    doSearch(JS_REPORT_BYOBJECT, "byobj", doSearchByObject);
}

function doSearchByUser(){
    doSearch(JS_REPORT_BYUSER, "byuser", doSearchByUser);
}

function doRefreshList(by, jo){
    $table = $("#tab_"+by+" table");
    var $tbody = $("<tbody></tbody>").appendTo($table);
    for(var i=0; i<jo.length; i++)
    {
        try{
            var $tr = $("<tr></tr>").appendTo($tbody);
            $("<td></td>").text(i+1).appendTo($tr);
            $("<td></td>").text(jo[i].rpt_name).appendTo($tr);
            $("<td></td>").text($.format.date(jo[i].start_time, JS_DEFAULT_DATE_FMT)).appendTo($tr);
            $("<td></td>").text($.format.date(jo[i].end_time, JS_DEFAULT_DATE_FMT)).appendTo($tr);
            if(jo[i].file_path != ""){
                var $td = $("<td></td>").appendTo($tr);
                var row = 1;
                for(var j=i+1; j<jo.length; j++){
                    if(j < jo.length && jo[j].file_path == ""){
                        row++;
                    }else{
                        break;
                    }
                }
                if(row>1){
                    $td.attr("rowspan", row);
                }
                var str = "<a onclick=\"downloadRPT('"+jo[i].file_path+"','"+jo[i].save_name+"')\"></a>";
                $(str).attr("href","#").text(JS_BUTTON_DOWNLOAD).appendTo($td);
            }
        }catch(e){alert(e.message);}
    }
	$("#tab_"+by+" table" + " tbody tr:odd").removeClass().addClass("oddcolor");
    var $tr = $("<tr></tr>").appendTo($tbody);
    $("<td></td>").attr("colspan", "3").css("text-align","right").html("<b><?php echo $TEXT['status-totalrecords'] ?></b>").appendTo($tr);
    $("<td></td>").attr("colspan", "2").css("text-align","left").html("<b>"+jo.length+"</b>").appendTo($tr);
}

function queryVoiceRecordRpt(msg_title, rpttype){
	isQueryTimeOut = false;
	var mustok = true;
	$("#tab_byrtime input").removeClass("invalidbox");
	$("#tab_byrtime .must:not(:hidden)").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });

	if(!mustok){
		showMessage("stop", msg_title, JS_CONDITION_INVALID, 5);
        return;
    }
	
	$("#searchbyrtime").attr("disabled",true).unbind("click"); 
	$("#exportbyrtime").unbind("click"); 
    $table = $("#table_byrtime");
    $table.find("tbody").remove();
	var flag = $("#device_flag").val();
	var stime = $("#timebyrtime1").val();
	var etime = $("#timebyrtime2").val();
    var opts = {"rtime": true, 
				"type": parseInt(rpttype),
				"objid": getIdByFlag(flag),
				"stime": stime,
				"etime": etime
			   };
	var WP = window.parent;
    try{        
        showLoading(true);
		var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
							   $("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
									WP.exportFileName = msg_title;
									WP.exportTableId = "table_byrtime";
									$("#mnuOperat").hide();
									$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
									$("#mnuOperat").show();								
							   });							   
							   showLoading(false,true)}, requestTimeout);
							   
        $.get("stastics.ajax.php", opts, function(data) {
            clearTimeout(timer);
			showLoading(false);            
            try{
                var json = eval('(' + data + ')');
                if(json.length > 0){
					WP.reportHeader = "<tr><td colspan=5>" + msg_title + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=5>" + flag + "</td></tr>";
					WP.reportHeader += "<tr><td colspan=5>" + $.format.date(stime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + " - " + $.format.date(etime + ":00", JS_DEFAULT_DATETIME_fmt_JS) + "</td></tr>";
					
                    var $tbody = $("<tbody></tbody>").appendTo($table);
					$table.parent().unbind('scroll');
					for(var i=0; i<json.length; i++)
					{
						try{
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);
							$("<td></td>").text(flag).appendTo($tr);
							$("<td></td>").html(json[i].n).appendTo($tr);					
							$("<td data-sort="+((json[i].t == null || json[i].t.length == 0) ? json[i].t : newDate(json[i].t).getTime())+"></td>").html($.format.date(json[i].t, JS_DEFAULT_DATETIME_fmt_JS)).appendTo($tr);
							$("<td></td>").html(json[i].v).appendTo($tr);
						}catch(e){alert(e.message);}
					}
					//$("#table_byrtime tbody tr:odd").removeClass().addClass("oddcolor");
                }
            }catch(e){
                showMessage("stop", msg_title, JS_STATUS_NODATA, 5);
            }
			if(!isQueryTimeOut){
				$("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
				$("#exportbyrtime").removeAttr("disabled").bind("click", function(e){
					WP.exportFileName = msg_title;
					WP.exportTableId = "table_byrtime";
					$("#mnuOperat").hide();
					$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
					$("#mnuOperat").show();								
			    });
			}           
        });
    }catch(e){
        showLoading(false)
        $("#searchbyrtime").removeAttr("disabled").bind("click", doQueryByRtime);
    }
}

function drawSpeedChart(tracks){
	var WP = window.parent;
	$("#table_byrtime").empty();
	var datas = [];
	for (var i = 0; i < tracks.length; i++) {
		var speed = tracks[i].s;
		var time = newDate(tracks[i].t).getTime();
		datas.push([time, speed]);
	}

	$('#table_byrtime').highcharts({	
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
				text: JS_SPEED + "(" + WP.UNIT_SPEED + ")"
			},
			min: 0,
            plotLines : [ {
                value : 0,
                width : 1,
                color : '#808080'
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
						[0, Highcharts.getOptions().colors[0]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
					]
				},
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

		series: [{
			type: 'area',
			name: JS_SPEED,
			data: datas
		}],
		
		navigation: {
            buttonOptions: {
                verticalAlign: 'bottom',
				y: 15
            }
        }	
	});
}

function drawGraph(tracks){
	var WP = window.parent;
	$("#graph_byrtime").empty();
	var symbolColor = popSymbolColor();
	chart4SymbolColor['chart-axis_'+42] = symbolColor;
	var datas = [];
	for (var i = 0; i < tracks.length; i++) {
		if(tracks[i].q != null && getIdValue(42 + ":", tracks[i].q) != null){
			var speed = speedUnitConversion(getIdValue(42 + ":", tracks[i].q), WP.JS_UNIT_SPEED);
			var time = newDate(tracks[i].tg).getTime();
			datas.push([time, speed]);
		}	
	}

	charts = Highcharts.chart('graph_byrtime', {
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
						//clickToPlay(e.point.index,true);
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
		max: (eid == "1E" || eid == "1F") ? maxv + 50 : null,
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

function drawFuelChart(tracks){
	var WP = window.parent;
	$("#table_byrtime").empty();
	var fuels = [];
	var fuels2 = [];
	var speeds = [];
	var rfuels = [];
	var sfuels = [];
	var rfuels2 = [];
	var sfuels2 = [];
	var fuelpoints = tracks.fuel;
	var rfuelpoints = tracks.rfuel;
	var sfuelpoints = tracks.sfuel;
	var maxFuel = 0;
	
	for (var i = 0; i < fuelpoints.length; i++) {
		var fuel = parseInt(fuelpoints[i].f);
		var fuel2 = parseInt(fuelpoints[i].f2);
		var speed = parseInt(fuelpoints[i].s);
		var time = newDate(fuelpoints[i].t).getTime();
		//If speed equal 0 use last fuel
		//if(i > 0 && speed == 0 && fuels[i - 1][1] > 0){
		//	fuels.push([time, fuels[i - 1][1]]);
		//}else{			
			fuels.push([time, fuel]);
			fuels2.push([time, fuel2]);
		//}
		speeds.push([time, speed]);
		
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

	$('#table_byrtime').highcharts({	
		credits: {
			 text: '',
			 href: ''
		},
		chart: {
			zoomType: 'x',
			panning: true,
            panKey: 'shift',
			height: 300
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
		yAxis: [
			{
				title: {
					text: JS_FUEL + "(" + WP.UNIT_FUEL + ")"
				},
				min: 0,
				max: maxFuel,
				plotLines : [ {
					value : 0,
					width : 1,
					color : '#808080'
				} ] 
			},
			{
				lineWidth: 1,
				opposite: true,
				min: 0,
				max: 350,
				title: {
					text: JS_SPEED + "(" + WP.UNIT_SPEED + ")"
				}
			}
		],
		legend: {
			enabled: true
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

		series: [
			{
				type: 'area',
				name: JS_FUEL + " 1 (" + WP.UNIT_FUEL + ")",
				data: fuels,
				id : 'dataseries1'
			},
			{
				type: 'area',
				name: JS_FUEL + " 2 (" + WP.UNIT_FUEL + ")",
				data: fuels2,
				id : 'dataseries2'
			},
			{
				type: 'line',
				name: JS_SPEED + "(" + WP.UNIT_SPEED + ")",
				data: speeds
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
        }	
	});
}

function drawTempChart(tracks){
	var WP = window.parent;
	$("#table_byrtime").empty();
	var datas = [];
	var datas2 = [];
	for (var i = 0; i < tracks.length; i++) {
		var temp = parseFloat(parseFloat(tracks[i].w).toFixed(1));
		var temp2 = parseFloat(parseFloat(tracks[i].w2).toFixed(1));
		var time = newDate(tracks[i].t).getTime();
		datas.push([time, temp]);
		datas2.push([time, temp2]);
	}

	$('#table_byrtime').highcharts({	
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
                color : '#808080'
            } ] 
		},
		legend: {
			enabled: false
		},		
		series: [{
			type: 'area',
			name: JS_TEMP,
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
			color: '#0096FE'
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
			color: '#3ACCBC'
		}	
		],
		
		navigation: {
            buttonOptions: {
                verticalAlign: 'bottom',
				y: 15
            }
        }	
	});
}

function drawUsageChart(assets, Y_mil, Y_dt, Y_st, Y_it, Y_sf, Y_ef, Y_cf, Y_dut){
   var WP = window.parent;
   var chart = {
      zoomType: 'xy'
   };
   var credits = {
		 enabled: false
   };
   var subtitle = {
      text: '',
	  style: {
		  display: 'none'
	  }   
   };
   var title = {
      text: '',
	  style: {
		  display: 'none'
	  }   
   };
   var xAxis = {
      categories: assets,
      crosshair: true
   };
   var yAxis= [{ // 第一条Y轴
      labels: {
         format: '{value} ' + WP.UNIT_DIST,
         style: {
            color: Highcharts.getOptions().colors[0]
         }
      },
      title: {
         text: JS_DISTANCE + "(" + WP.UNIT_DIST + ")",
         style: {
            color: Highcharts.getOptions().colors[0]
         }
      }
   }, { // 第二条Y轴
      title: {
         text: JS_TIME,
         style: {
            color: Highcharts.getOptions().colors[1]
         }
      },
      labels: {
         format: '{value} (H)',
         style: {
            color: Highcharts.getOptions().colors[1]
         }
      },
      opposite: true
   },{ // 第三条Y轴
      title: {
         text: JS_FUEL,
         style: {
            color: Highcharts.getOptions().colors[5]
         }
      },
      labels: {
         format: '{value} (' + WP.UNIT_FUEL +')',
         style: {
            color: Highcharts.getOptions().colors[5]
         }
      },
      opposite: true
   }];
   var tooltip = {
      shared: true
   };
   var legend = {
	  enabled: true
   };
   var series= [
		{
            name: JS_DISTANCE,
            type: 'column',
            data: Y_mil,
            tooltip: {
                valueSuffix:  ' ' + WP.UNIT_DIST
            }
        },
		{
            name: JS_DRIVING_TIME,
            type: 'spline',
            yAxis: 1,
            data: Y_dt,
            tooltip: {
                valueSuffix: ' H'
            }

        }, 
		{
			name: JS_STOP_TIME,
            type: 'spline',
            yAxis: 1,
            data: Y_st,
            tooltip: {
                valueSuffix: ' H'
            }
        },
		{
			name: JS_IDLE_TIME,
            type: 'spline',
            yAxis: 1,
            data: Y_it,
            tooltip: {
                valueSuffix: ' H'
            }
        },
		{
			name: JS_HEAVY_DUTY_TIMES,
            type: 'spline',
            yAxis: 1,
            data: Y_dut,
            tooltip: {
                valueSuffix: ' H'
            }
        },
		{
			name: NAVI_SENSOR_FUEL_CONSUMPTION,
            type: 'spline',
            yAxis: 2,
            data: Y_sf,
			dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ' ' + WP.UNIT_FUEL
            }
        },
		{
			name: NAVI_ESTIMATE_FUEL_CONSUMPTION,
            type: 'spline',
            yAxis: 2,
            data: Y_ef,
			dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ' ' + WP.UNIT_FUEL
            }
        },
		{
			name: NAVI_CAN_FUEL_CONSUMPTION,
            type: 'spline',
            yAxis: 2,
            data: Y_cf,
			dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ' ' + WP.UNIT_FUEL
            }
        }		
   ];     
      
   var json = {};   
   json.chart = chart;   
   json.title = title;
   json.subtitle = subtitle;      
   json.xAxis = xAxis;
   json.yAxis = yAxis;
   json.tooltip = tooltip;  
   json.legend = legend;  
   json.series = series;
   json.credits = credits;
   $('#chart_byrtime').highcharts(json);  
}

function oninit() {
	var WP = window.parent;
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
	
	$("#tab_byobj").toggle();
    $("#tab_byuser").toggle();
	
	$("#timebyrtime1").val(getNowFormatDate() + " 00:00");
	$("#timebyrtime2").val(getNowFormatDate() + " 23:59");
    loadcalendar();//

	var allflag = getDeviceList();
	$("#device_flag").autocomplete({
		source: allflag,
		minLength: allflag.length < 2000 ? 0 : 2,
		max:10,
        scroll:true
	}).focus(function(){            
		 $(this).autocomplete('search', $(this).val())
	});
	
	$("#device_multi_flag").empty();
    /*for(i = 0; i< allflag.length; i++){
        var flag = allflag[i];
        $item = $("<option></option>").appendTo("#device_multi_flag");
        $item.attr("value", flag);
        $item.text(flag);
    }*/
	var g4flags = getGroup4Flags();
	for(var key in g4flags){
		var gname = key;
		var flags = g4flags[key];
		$item = $("<optgroup label='"+gname+"'></optgroup>").appendTo("#device_multi_flag");

		for(var k = 0; k < flags.length; k++){
			$it = $("<option></option>").appendTo($item);
			$it.attr("value", flags[k]);
			$it.text(flags[k]);
		}
	}
	
	$('#device_multi_flag').multiselect({
		columns: 10,
		placeholder: JS_SELECT,
		search   : true,
		texts: {
			selectedOptions: JS_SELECTED,
			search: JS_SEARCH,
			selectAll: JS_SELECT_ALL,
			unselectAll: JS_UNSELECT_ALL
		},

		selectAll: true,
		maxPlaceholderWidth: 160,
		maxHeight: 580,
		selectedList:5,
        minWidth:160,
		selectGroup: true,
		onOptionClick: function( element, option ) {
			var maxSelect = 10000;

			// too many selected, deselect this option
			if( $(element).val() != null && typeof $(element).val().length != "undefined" && $(element).val().length > maxSelect ) {
				if( $(option).is(':checked') ) {
					var thisVals = $(element).val();

					thisVals.splice(
						thisVals.indexOf( $(option).val() ), 1
					);

					$(element).val( thisVals );

					$(option).prop( 'checked', false ).closest('li')
						.toggleClass('selected');
				}
			}
			// max select reached, disable non-checked checkboxes
			else if($(element).val() != null && typeof $(element).val().length != "undefined" && $(element).val().length == maxSelect ) {
				$(element).next('.ms-options-wrap')
					.find('li:not(.selected)').addClass('disabled')
					.find('input[type="checkbox"]')
						.attr( 'disabled', 'disabled' );
			}
			// max select not reached, make sure any disabled
			// checkboxes are available
			else {
				$(element).next('.ms-options-wrap')
					.find('li.disabled').removeClass('disabled')
					.find('input[type="checkbox"]')
						.removeAttr( 'disabled' );
			}
		},
		onControlClose: function(event) {
			$('#table_byrtime').find('th').css("position", "sticky");
		},
		onControlOpen: function(event) {
			$('#table_byrtime').find('th').css("position", "static");
		}
	});

	$("#deviceobj").autocomplete({
		source: allflag,
		minLength: allflag.length < 2000 ? 0 : 2,
		max:10,
        scroll:true
	}).focus(function(){            
		 $(this).autocomplete('search', $(this).val())
	});

    $("#searchbyobj").bind("click", doSearchByObject);
    $("#searchbyuser").bind("click", doSearchByUser);
	$("#searchbyrtime").bind("click", doQueryByRtime);	
	$("#timebyrtime3").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});
	$('#rpttypebyrtime').change(function(){
		typeChange(parseInt($(this).children('option:selected').val()));
	});
	
	$('#table_byrtime tr:eq(0) th:eq(4)').append("("+WP.UNIT_DIST+")");
	$('#table_byrtime tr:eq(0) th:eq(6)').append("("+WP.UNIT_SPEED+")");
	$('#table_byrtime tr:eq(0) th:eq(7)').append("("+WP.UNIT_DIST+")");
	$('#table_byrtime tr:eq(0) th:eq(16)').append("("+WP.UNIT_SPEED+")");
	
	if(JS_CURRENT_LANG == "zh_CN" || JS_CURRENT_LANG == "zh_TW"){
		/**Chinese*/
		loadScript("js/fonts/FZYTK-normal.js", pdfFontLoaded);
	}else if(JS_CURRENT_LANG == "th"){
		/**Thai*/
		loadScript("js/fonts/NotoSansThai-VariableFont_wdth,wght-normal.js", pdfFontLoaded);
	}else{
		loadScript("js/fonts/arial-normal.js", pdfFontLoaded);
	}
}

function pdfFontLoaded(){
	$("#export_pdf").css('cursor', 'pointer');
}
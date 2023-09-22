var map, ext, map_load = false, objectKind, purview = [], requestTimeout = 60000, top_car_group = 0, device_id_editable = true;
var load1 = false, load2 = false, load3 = false, load4 = false, load5 = false, load6 = false, load7 = false, load8 = false, current_userid=0, current_objid=0, current_zid = 0, current_custid = 0, current_jobnumber = 0, current_taskid = 0, current_expenseid = 0, current_driver_photo = null, dev_cust, dev_group, dev_type, dev_kind, dev_driver, 
mgraccount_array_uname = [], mgraccount_array_login = [], mgraccount_array_phone = [], useraccess_array_uname = [], useraccess_array_login = [], useraccess_array_phone = [], mgrcustomer_array_name = [], mgrcustomer_array_fname = [], mgrcustomer_array_phone = [],
mgrvehicle_array_flag = [], mgrvehicle_array_deviceid = [], mgrvehicle_array_phone = [], mgrvehicle_array_driver = [], mgrdriver_array_name = [], mgrdriver_array_workid = [], mgrdriver_array_phone = [], mgrdriver_array_rfid = [], mgrplace_array_name = [], mgrevent_array_name = [], mgrsensor_array_name = [], service_place_array_name = [], mgrtask_array_name = [], mgrexpense_array_name = [], mgrtask_array_flag = [];
var array_group, array_dtype, array_atype, array_rptype, array_dlist, array_element;//useful table show
var purview_asset_management = 1000, purview_recorder = 1090, purview_driver = 1300, purview_place = 1700, purview_task = 1800, purview_expense = 1900, purview_customer_management = 2000, purview_customer = 2100, purview_account_management = 3000, purview_user_manager = 3200, purview_access_manager = 3300, purview_user_group_manager = 3400;
var driver_photo_width = 80, driver_photo_height = 89;
var selectreport;

function load_groups(usrid, isedit, gname){
    var etype=0;
    if(isedit){etype=1;}
    $.get("grouptree.ajax.php", {usrid: usrid, etype: etype, gname: gname}, function(data){
        try {
			var o = {showcheck: isSavePurview(purview_user_group_manager), theme:"bbit-tree-lines"};
			var json = eval('(' + data + ')');
			//top car group
			if(gname != null && gname.length == 0){
				top_car_group = json[0].ChildNodes[0].value;
			}
			
			o.data = json;
			$("#usr_group").treeview(o);
			array_group = [];
			traverseGroups(json);
			showLoading(false);
		} catch(e) {showLoading(false);}
    });
}

function traverseGroups(json){
	for(var o in json){
		if(json[o].value != 0){
			array_group[json[o].value] = json[o].text;
		}

		if(typeof(json[o].ChildNodes) != 'undefined'){
			traverseGroups(json[o].ChildNodes);
		}
	}
}

function dlgServiceInfo(keyid) {
	var WP = window.parent;
	array_element = [];
	locate_table("#devlist", "objid", keyid);
	pagechanged('#tab_baseservice');
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    $.post("service.ajax.php", {"objid": keyid}, function(data) { 
		clearTimeout(timer);
		showLoading(false); 
		try {
            $dlg = $("#dlg_services");			
            $dlg.find(".itext,icontent").val("");
			$dlg.find(".iselect").val(1);
			$dlg.find("#detect-stops-using").val(0);
			$dlg.find(".icheckbox").prop("checked", false);
			$dlg.find("#day-maintenance-last").removeClass().addClass("itime").addClass("enablebox").val('');
			$dlg.find("#day-maintenance-last").datepicker({
				dateFormat: "yy-mm-dd",
				changeMonth: true,
				changeYear: true,
				yearRange: "-20:+20"
			});
			cleanCustMaintenance();
			
            $dlg.css("display", "block");
            $("body").append("<div class='modalmask'></div>");
            $dlg.append("<span id='idclose' class='dialog_cancel'></span>");
            $dlg.find("#idclose").click(function() {
                $dlg.css("display", "none");
                $(this).remove();
                $(".modalmask").remove()
            });
            $dlg.find("#button_cancel").click(function(){
				$dlg.find("#button_ok").unbind("click");
                $dlg.css("display", "none");
				$dlg.find("#idclose").remove();
                $(".modalmask").remove()
            });
			
            $dlg.find("#button_ok").unbind("click").click(function() {
				$dlg.find(".itext, .itime").each(function(){
					$(this).removeClass("invalidbox"); 
				});
				
				var mustok = true;				
				$dlg.find("#speedalarm, #idlealarm, #innerbatlowalarm, #outerbaylowalarm, #fatiguedriving, #obdmileage, #engine-hour, #min-moving-speed, #min-idle-speed, #fuel-capacity, #mil-maintenance-value, #mil-maintenance-last, #eng-maintenance-value, #eng-maintenance-last, #day-maintenance-value").each(function(){
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
				
				$("#tab_maintenance table tr[custtype=1] td:eq(2) input, #tab_maintenance table tr[custtype=1] td:eq(4) input, #tab_maintenance table tr[custtype=2] td:eq(2) input, #tab_maintenance table tr[custtype=2] td:eq(4) input, #tab_maintenance table tr[custtype=3] td:eq(2) input").each(function(){
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
				
				$dlg.find("#asset-voltage").each(function(){
					var value = $(this).val(); 
					if(value != ""){
						matchArray = value.match(/^\d+(\.\d+)?$/);
						if (matchArray == null) {
							$(this).addClass("invalidbox").focus();
							mustok = false;
						}else{
							$(this).removeClass("invalidbox");
						}
					}
				});
				
				$dlg.find("#allowtempfrom, #allowtempto").each(function(){
					var value = $(this).val(); 
					if(value != ""){
						matchArray = value.match(/^-?\d+$/);
						if (matchArray == null) {
							$(this).addClass("invalidbox").focus();
							mustok = false;
						}else{
							$(this).removeClass("invalidbox");
						}
					}
				});

				var matchArray;
				$dlg.find("#allowdrivingfrom, #allowdrivingto").each(function(){
					var value = $(this).val();
					if(value != ""){
						matchArray = value.match(/(\d{2}):(\d{2})/);
						if (matchArray == null || (matchArray.length == 4 && (parseInt(matchArray[2]) > 23 || parseInt(matchArray[3]) > 59))) {
							$(this).addClass("invalidbox").focus();
							mustok = false;
						}else{
							$(this).removeClass("invalidbox");
						}
					}
				});
				
				$dlg.find("#day-maintenance-last").each(function(){
					var value = $(this).val();
					if(value != ""){
						matchArray = value.match(/^\d{4}\-\d{2}\-\d{2}$/);
						if (matchArray == null) {
							$(this).addClass("invalidbox").focus();
							mustok = false;
						}else{
							$(this).removeClass("invalidbox");
						}
					}
				});
				
				$("#tab_maintenance table tr[custtype=3] td:eq(4) input").each(function(){
					var value = $(this).val();
					if(value != ""){
						matchArray = value.match(/^\d{4}\-\d{2}\-\d{2}$/);
						if (matchArray == null) {
							$(this).addClass("invalidbox").focus();
							mustok = false;
						}else{
							$(this).removeClass("invalidbox");
						}
					}
				});
				
				if(!mustok)return;				               
				$(this).unbind("click");
				
				var $row = $("#service_place tbody tr");
				var geostr = "";
				$($row).each(function(i, value) {
					var zid = $(value).attr('zid');
					var atype = $(value).find("td input[type='radio']:checked").val(); 
					var distance = $(value).find("td input[type='text']").val();
					if(WP.JS_UNIT_DISTANCE == 1){
						distance = (distance * 1.609344).toFixed(2);
					}else if(WP.JS_UNIT_DISTANCE == 2){
						distance = (distance * 1.852).toFixed(2);
					}
					
					if(parseInt(atype) > 0){
						if(typeof distance != undefined && distance != null && parseFloat(distance) > 0){
							geostr += zid + "," + atype + "," + distance + ";";
						}else{
							geostr += zid + "," + atype + ";";
						}						
					}
				});
				
                var req = {
                    "style": "0",
                    "objid": keyid,
                    "sa": $dlg.find("#speedalarm").val(),                    
                    "ia": $dlg.find("#idlealarm").val(),                    
                    "tl": $dlg.find("#innerbatlowalarm").val(),
					"cl": $dlg.find("#outerbaylowalarm").val(),
					"fd": $dlg.find("#fatiguedriving").val(),
					"om": $dlg.find("#obdmileage").val(),
					"omb": $dlg.find("#odometer-by").val(),
					"engh": $dlg.find("#engine-hour").val(),
					"engb": $dlg.find("#engine-hour-by").val(),
					"mms": $dlg.find("#min-moving-speed").val(),
					"mis": $dlg.find("#min-idle-speed").val(),
					"ov": $dlg.find("#asset-voltage").val(),
					"dsu": $dlg.find("#detect-stops-using").val(),
					"fc": $dlg.find("#fuel-capacity").val(),
					"fut": $dlg.find("#fuel-upload-type").val(),
					"fpos": $dlg.find("#fuel-regressionLine").val(),
					"mile": $("#mil-maintenance-enable").prop("checked") ? 1 : 0,
					"milv": $dlg.find("#mil-maintenance-value").val(),
					"miln": $dlg.find("#mil-maintenance-name").val(),
					"mill": $dlg.find("#mil-maintenance-last").val(),
					"enge": $("#eng-maintenance-enable").prop("checked") ? 1 : 0,
					"engv": $dlg.find("#eng-maintenance-value").val(),
					"engn": $dlg.find("#eng-maintenance-name").val(),
					"engl": $dlg.find("#eng-maintenance-last").val(),
					"daye": $("#day-maintenance-enable").prop("checked") ? 1 : 0,
					"dayv": $dlg.find("#day-maintenance-value").val(),
					"dayn": $dlg.find("#day-maintenance-name").val(),
					"dayl": $dlg.find("#day-maintenance-last").val(),
					"custm": getCustMaintenance(),
					"adf": $dlg.find("#allowdrivingfrom").val(),
					"adt": $dlg.find("#allowdrivingto").val(),
					"atf": $dlg.find("#allowtempfrom").val(),
					"att": $dlg.find("#allowtempto").val(),
					"st": $dlg.find("#statetable").val() == null ? "" : $dlg.find("#statetable").val().join(),
					"it": $dlg.find("#iotable").val(),
					"gz": geostr,
					"en": $("#enable_notification").prop("checked") ? 1 : 0,
					"nm": $dlg.find("#notification_email").val(),
					"ns": $dlg.find("#notification_sms").val(),
					"nt": $dlg.find("#notification_telegram").val(),
					"f100": $dlg.find("#fuel-fuel100km").val()
                }
				
                showLoading(true);
				timer = setTimeout(function(){
									$dlg.css("display", "none");
									$dlg.find("#idclose").remove();
									$(".modalmask").remove();
									showLoading(false,true)}, requestTimeout);
                try{
                    $.post("service.ajax.php", req, function(data) {
						clearTimeout(timer);
                        showLoading(false);
                        if (data.indexOf("ok") >= 0) {
                            $dlg.css("display", "none");
							$dlg.find("#idclose").remove();
                            $(".modalmask").remove();	
							showMessage("succ", JS_DEVICE_INFO, JS_UPDATE_SUCC);
                        }
                    });
                }catch(e){error(showLoading(false));}
            });
			
			$dlg.find("#clear-engine-hour").unbind("click").click(function() {
				showLoading(false);
				showLoading(true);
				timer = setTimeout("showLoading(false,true)", requestTimeout);
                try{
                    $.post("service.ajax.php", {"objid": keyid, "style": "1"}, function(data) {
                        clearTimeout(timer);
						showLoading(false);
						$("body").append("<div class='modalmask'></div>");
                        if (data.indexOf("ok") >= 0) {
							showMessage("succ", JS_DEVICE_INFO, JS_UPDATE_SUCC);
                        }
                    });
                }catch(e){error(showLoading(false));}
			});
			
			$dlg.find("#clear-odometer").unbind("click").click(function() {
				showLoading(false);
				showLoading(true);
				timer = setTimeout("showLoading(false,true)", requestTimeout);
                try{
                    $.post("service.ajax.php", {"objid": keyid, "style": "2"}, function(data) {
                        clearTimeout(timer);
						showLoading(false);
						$("body").append("<div class='modalmask'></div>");
                        if (data.indexOf("ok") >= 0) {
							showMessage("succ", JS_DEVICE_INFO, JS_UPDATE_SUCC);
                        }
                    });
                }catch(e){error(showLoading(false));}
			});
			
            $dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
            $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
			
			$("#allowdrivingfrom").timepicker({
				timeFormat: "HH:mm"
			});
			$("#allowdrivingto").timepicker({
				timeFormat: "HH:mm"
			});						
			$('#statetable').val('');
			$('#statetable').multiselect( 'reload' );			
			
			if(typeof data != undefined && data != null && data.length > 1){
				var jos = eval('(' + data + ')');
				var jo = jos.list;
				var places = jos.places;
				var events = jos.events;
				var sensors = jos.sensors;
				var elements = jos.elements;
				var validgeostr = null;											
				
				if(typeof jo != undefined && jo != null){
					validgeostr = jo.gz;
					$dlg.find("#speedalarm").val(jo.sa == 0 ? "":jo.sa);
					$dlg.find("#idlealarm").val(jo.ia == 0 ? "":jo.ia);
					$dlg.find("#innerbatlowalarm").val(jo.tl == 0 ? "":jo.tl);
					$dlg.find("#outerbaylowalarm").val(jo.cl == 0 ? "":jo.cl);
					$dlg.find("#fatiguedriving").val(jo.fd == 0 ? "":jo.fd);
					$dlg.find("#obdmileage").val(jo.om == 0 ? "":jo.om);
					$dlg.find("#odometer-by").val(jo.omb);
					$dlg.find("#engine-hour").val(jo.engh == 0 ? "":jo.engh);
					$dlg.find("#engine-hour-by").val(jo.engb);
					$dlg.find("#min-moving-speed").val(jo.mms == 0 ? "":jo.mms);
					$dlg.find("#min-idle-speed").val(jo.mis == 0 ? "":jo.mis);
					$dlg.find("#asset-voltage").val(jo.ov == 0 ? "":jo.ov);
					$dlg.find("#detect-stops-using").val(jo.dsu);
					$dlg.find("#fuel-capacity").val(jo.fc == 0 ? "":jo.fc);
					$dlg.find("#fuel-upload-type").val(jo.fut);
					$dlg.find("#fuel-regressionLine").val(jo.fpos);
					$dlg.find("#mil-maintenance-enable").prop("checked", jo.mile==1);
					$dlg.find("#mil-maintenance-value").val(jo.milv == 0 ? "":jo.milv);
					$dlg.find("#mil-maintenance-name").val(jo.miln);
					$dlg.find("#mil-maintenance-last").val(jo.mill == 0 ? "":jo.mill);
					$dlg.find("#eng-maintenance-enable").prop("checked", jo.enge==1);
					$dlg.find("#eng-maintenance-value").val(jo.engv == 0 ? "":jo.engv);
					$dlg.find("#eng-maintenance-name").val(jo.engn);
					$dlg.find("#eng-maintenance-last").val(jo.engl == 0 ? "":jo.engl);
					$dlg.find("#day-maintenance-enable").prop("checked", jo.daye==1);
					$dlg.find("#day-maintenance-value").val(jo.dayv == 0 ? "":jo.dayv);
					$dlg.find("#day-maintenance-name").val(jo.dayn);
					$dlg.find("#day-maintenance-last").val(jo.dayl == "1900-01-01" ? "":jo.dayl);
					$dlg.find("#allowdrivingfrom").val(jo.adf);
					$dlg.find("#allowdrivingto").val(jo.adt);
					$dlg.find("#allowtempfrom").val((jo.atf == 0 && jo.att == 0) || (jo.atf == 32 && jo.att == 32) ? "":jo.atf);
					$dlg.find("#allowtempto").val((jo.atf == 0 && jo.att == 0) || (jo.atf == 32 && jo.att == 32) ? "":jo.att);
					$dlg.find("#iotable").val(jo.it);
					$dlg.find("#enable_notification").prop("checked", jo.en==1);
					$dlg.find("#notification_email").val(jo.nm);
					$dlg.find("#notification_sms").val(jo.ns);
					$dlg.find("#notification_telegram").val(jo.nt);
					$dlg.find("#fuel-fuel100km").val(jo.f100 == 0 ? "":jo.f100);
					
					initCustMaintenance(jo.custm);
					
					if(jo.st != null){
						$('#statetable').val(jo.st.split(','));
						$('#statetable').multiselect('reload');
					}
				}
				
				//place				
				$table = $("#service_place");	
				$table.find("tbody").remove();				
				
				if(typeof places != undefined && places != null && places.length > 0){															
					var $tbody = $("<tbody></tbody>").appendTo($table);
					service_place_array_name = [];
	
					for (var i = 0; i < places.length; i++) {		
						var $tr = $("<tr></tr>").attr("zid", places[i].zid + "").appendTo($tbody);
						$("<td></td>").text(i+1).appendTo($tr);
						$("<td></td>").attr("an",places[i].an).text(places[i].an).appendTo($tr);
						service_place_array_name.push(places[i].an);
						$("<td></td>").text(array_atype[places[i].at]).appendTo($tr);						
						var $alarmtype = $("<td></td>").appendTo($tr);
						if(places[i].at == 4){
							//marker
							$("<label>"+"["+"</label>").appendTo($alarmtype);
							$("<input type='radio' class='radio' name='"+places[i].zid+"' value='0' checked='true'></input>").appendTo($alarmtype);
							$("<label>"+JS_NOT_ASSOCIATED+"</label>").appendTo($alarmtype);
							$("<input type='radio' class='radio' name='"+places[i].zid+"' value='1'></input>").appendTo($alarmtype);
							$("<label>"+JS_ASSOCIATED+"</label>").appendTo($alarmtype);
							$("<label>"+" ]"+"</label>").appendTo($alarmtype);
						}else{
							//polygon and polyline
							$("<label>"+"["+"</label>").appendTo($alarmtype);
							$("<input type='radio' class='radio' name='"+places[i].zid+"' value='0' checked='true'></input>").appendTo($alarmtype);
							$("<label>"+JS_NOGEOALARM+"</label>").appendTo($alarmtype);
							$("<input type='radio' class='radio' name='"+places[i].zid+"' value='1'></input>").appendTo($alarmtype);
							$("<label>"+JS_INGEOALARM+"</label>").appendTo($alarmtype);
							$("<input type='radio' class='radio' name='"+places[i].zid+"' value='2'></input>").appendTo($alarmtype);
							$("<label>"+JS_OUTGEOALARM+"</label>").appendTo($alarmtype);
							$("<input type='radio' class='radio' name='"+places[i].zid+"' value='3'></input>").appendTo($alarmtype);
							$("<label>"+JS_BOTHGEOALARM+"</label>").appendTo($alarmtype);
							$("<label>"+" ]"+"</label>").appendTo($alarmtype);
							if(places[i].at == 5){
								//polyline
								$("<label>"+"  [ "+JS_DEVIATION+"</label>").appendTo($alarmtype);
								$("<input type='text'></input>").attr("zid", places[i].zid + "").css({'width':'25px', 'margin-left':'5px', 'border':'1px dashed #000;' }).appendTo($alarmtype);
								$("<label>"+WP.UNIT_DIST+" ]"+"</label>").appendTo($alarmtype);
							}
						}												
					}
										
					if(typeof validgeostr != undefined && validgeostr != null && validgeostr.length > 0){
						var validgeo = validgeostr.split(";");
						if (validgeo.length <= 0) return;
						
						for(var a = 0; a < validgeo.length; a++){
							if(validgeo[a].split(',').length >= 2){
								var validzid = validgeo[a].split(',')[0];
								var atype = validgeo[a].split(',')[1];
								$table.find("tbody tr[zid="+validzid+"] td input[type='radio'][value="+atype+"]").prop("checked",true);
								
								$input = $table.find("tbody tr[zid="+validzid+"] td input[type='text']");								
								if(typeof $input != undefined && $input != null && validgeo[a].split(',').length == 3){
									//polyline
									var deviation = validgeo[a].split(',')[2];
									if(WP.JS_UNIT_DISTANCE == 1){
										deviation = (deviation * 0.6213712).toFixed(2);
									}else if(WP.JS_UNIT_DISTANCE == 2){
										deviation = (deviation * 0.5399568).toFixed(2);
									}
									
									$input.val(deviation);
								}
							}						
						}						 
					}
										
					//$("#service_place tbody tr:odd").removeClass().addClass("oddcolor");
					
					if($("#service_place_item").val() == "1"){
						$("#service_place_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: service_place_array_name, minLength: service_place_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}
				}

				//Customized event 
				$("#event_addnew").unbind('click').click(function() {
					eventView(1, keyid,null);				
				});								
				
				$table = $("#customized_event");	
				$table.find("tbody").remove();				
				
				if(typeof events != undefined && events != null && events.length > 0){															
					var $tbody = $("<tbody></tbody>").appendTo($table);
					mgrevent_array_name = [];
					
					for (var i = 0; i < events.length; i++) {		
						var $tr = $("<tr></tr>").appendTo($tbody);
						$("<td></td>").text(i+1).attr("eid", events[i].eid).appendTo($tr);
						$("<td></td>").text(events[i].en).attr("en",events[i].en).appendTo($tr);
						mgrevent_array_name.push(events[i].en);
						
						if(events[i].ee == 0){
							$td = $("<td data-sort="+events[i].ee+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_disable").appendTo($td);														
						}else{
							$td = $("<td data-sort="+events[i].ee+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_enable").appendTo($td);														
						}
						
						if(events[i].pne == 0){
							$td = $("<td data-sort="+events[i].pne+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_disable").appendTo($td);														
						}else{
							$td = $("<td data-sort="+events[i].pne+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_enable").appendTo($td);														
						}
						
						if(events[i].nme == 0){
							$td = $("<td data-sort="+events[i].nme+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_disable").appendTo($td);														
						}else{
							$td = $("<td data-sort="+events[i].nme+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_enable").appendTo($td);														
						}
						
						if(events[i].nse == 0){
							$td = $("<td data-sort="+events[i].nse+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_disable").appendTo($td);														
						}else{
							$td = $("<td data-sort="+events[i].nse+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_enable").appendTo($td);														
						}
						
						if(events[i].nte == 0){
							$td = $("<td data-sort="+events[i].nte+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_disable").appendTo($td);														
						}else{
							$td = $("<td data-sort="+events[i].nte+"></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px; cursor: default;'></a>";
							$(str).attr("href","#").addClass("state_enable").appendTo($td);														
						}
						
						$td = $("<td></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px;' onclick='eventView(2,"+keyid+","+events[i].eid+")'></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);	
						
						str = "<a style='padding-left: 20px;' onclick='eventView(3,"+keyid+","+events[i].eid+")'></a>";
						$(str).attr("href","#").addClass("operate_delete").appendTo($td);	
					}
					
					//$("#customized_event tbody tr:odd").removeClass().addClass("oddcolor");
					
					if($("#mgrevent_item").val() == "1"){
						$("#mgrevent_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrevent_array_name, minLength: mgrevent_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}
				}
				
				//sensor
				$("#sensor_addnew").unbind('click').click(function() {
					sensorView(1, keyid,null);				
				});
				$table = $("#sensor_list");	
				$table.find("tbody").remove();	
				
				if(typeof elements != undefined && elements != null && elements.length > 0){					
					for(i=0; i<elements.length; i++){
						var e = {
							eid: elements[i].eid,
							en: elements[i].en,
							et: elements[i].et
						};
						array_element.push(e);
					}
				}
				
				if(typeof sensors != undefined && sensors != null && sensors.length > 0){															
					var $tbody = $("<tbody></tbody>").appendTo($table);
					mgrsensor_array_name = [];
					
					for (var i = 0; i < sensors.length; i++) {		
						var $tr = $("<tr></tr>").appendTo($tbody);
						$("<td></td>").text(i+1)/*.attr("sid", sensors[i].sid)*/.appendTo($tr);
						$("<td></td>").text(sensors[i].sn).attr("sid", sensors[i].sid).attr("sn", sensors[i].sn).appendTo($tr);
						$("<td></td>").text(getSensorTargetName(sensors[i].tg)).appendTo($tr);
						$("<td></td>").text(sensors[i].en).attr("eid", sensors[i].eid).attr("tg", sensors[i].tg).attr("st", sensors[i].st).appendTo($tr);
						$td = $("<td></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px;' onclick='sensorView(2,"+keyid+","+sensors[i].sid+")'></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);	
						
						str = "<a style='padding-left: 20px;' onclick='sensorView(3,"+keyid+","+sensors[i].sid+")'></a>";
						$(str).attr("href","#").addClass("operate_delete").appendTo($td);
						
						mgrsensor_array_name.push(sensors[i].sn);
						
						//$("#sensor_list tbody tr:odd").removeClass().addClass("oddcolor");
					
						if($("#mgrsensor_item").val() == "1"){
							$("#mgrsensor_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrsensor_array_name, minLength: mgrsensor_array_name.length < 2000 ? 0:2,max:10,scroll:true});
						}
					}
				}										
			}			           
        } catch(e) {showLoading(false); alert(e)}
    })
}

function getSensorTargetName(sensorTarget){
	for(var i = 0; i < array_element.length; i++){
		if(array_element[i].eid == sensorTarget){
			return array_element[i].en;
		}
	}
	
	return JS_INFO_SERVICE_SENSOR_TARGET_ORIGINAL;
}

function eventView(state, keyid, eventid){
	if(state != 3){
		eventstate(keyid);		
		eventfill();
	}
		
	if(state == 1){
		//new event
		showEventDlg(state, keyid, eventid);
	}else{
		//show event
		locate_table("#customized_event", "eid", eventid, true);
		dlgEventInfo(state,keyid, eventid);
	}
}

function sensorView(state, keyid, sensorid){
	if(state != 3){
		sensorstate(keyid);		
		sensorfill();
	}
		
	if(state == 1){
		//new sensor
		$("#sensor_element").find("option").eq(0).prop("selected",true);
	    $("#sensor_element").trigger("change");
		showSensorDlg(state, keyid, sensorid);
	}else{
		//edit sensor
		locate_table("#sensor_list", "sid", sensorid, true);
		dlgSensorInfo(state,keyid, sensorid);
	}
}

function dlgEventInfo(state,keyid,eventid){
	/**edit event*/
	if(state == 2){
		showLoading(true,null,3);
		var timer = setTimeout("showLoading(false,null,3);", requestTimeout);
		try {
			$.post("manage.ajax.php", {"type":15, "eid":eventid}, function(data) {			
				clearTimeout(timer);
				var WP = window.parent;
				showLoading(false,null,3);			
				var json = eval('(' + data + ')');
				var jo = json[0];	
				
				var Wnd = $("#dlg_event");				
				showEventDlg(state, keyid, eventid);
				//init event
				$(Wnd).find("#event_active").prop("checked", jo.ee==1);	
				$(Wnd).find("#event_name").val(jo.en);
			    $(Wnd).find("#event_type").val(jo.et);
				$(Wnd).find("#event_type").trigger("change");
				$(Wnd).find("#event_depending_place").val(jo.dop);
			    
				if(jo.ps != null){
					$('#event_place').val(jo.ps.split(','));
					$('#event_place').multiselect('reload');
				}
				
				$(Wnd).find("#event_time_period").val(jo.tp);				
				
				var param_value = jo.sl;
				//速度转换
				if(param_value != null && param_value.length > 0 && WP.JS_UNIT_SPEED == 1){
					param_value = (parseFloat(param_value) * 0.6213712).toFixed(0);
				}
				$(Wnd).find("#event_speed_limit").val(param_value);
				
				//距离转换
				param_value = jo.di;
				if(param_value != null && param_value.length > 0 && WP.JS_UNIT_DISTANCE == 1){
					param_value = (parseFloat(param_value) * 0.6213712).toFixed(0);
					
				}else if(param_value != null && param_value.length > 0 && WP.JS_UNIT_DISTANCE == 2){
					param_value = (parseFloat(param_value) * 0.5399568).toFixed(0);
				}
				$(Wnd).find("#event_distance").val(param_value);
				
				if(jo.ex != null){
					var paramRows = jo.ex.split(';');
					for(var i = 0; i < paramRows.length; i++){
						var row = paramRows[i].split(",");
						if(row.length == 3 && (row[1] == ">" || row[1] == "=" || row[1] == "<" || row[1] == "Φ")){
							var paramid = row[0];
							var symbol = row[1];
							var value = row[2]; 
							
							var $tbody = $("#parameters_and_sensors tbody");	
							if($tbody.length == 0){
								$tbody = $("<tbody></tbody>").appendTo($("#parameters_and_sensors"));
							}
							var $tr = $("<tr></tr>").appendTo($tbody);
							var text = $('#event_parameters_item option[value="' + paramid + '"]').text();
							
							$("<td></td>").text(text).attr("paramid", paramid).appendTo($tr);							
							$("<td></td>").text(symbol).appendTo($tr);
														
							if(value != null && symbol != "Φ" && paramid == "66"){
								//speed unit
								value = speedUnitConversion(value, WP.JS_UNIT_SPEED);						
							}else if(value != null && symbol != "Φ" && (paramid == "30" || paramid == "31" || paramid == "80")){
								//fuel unit
								value = fuelUnitConversion(value, WP.JS_UNIT_FUEL);								
							}else if(value != null && symbol != "Φ" && (paramid == "72" || paramid == "73" || paramid == "74" || paramid == "75" || paramid == "76" || paramid == "77" || paramid == "78" || paramid == "79")){
								//temp unit
								value = tempUnitConversion(value, WP.JS_UNIT_TEMPERATURE);								
							}else if(value != null && symbol != "Φ" && (paramid == "10" || paramid == "63")){
								//odometer unit mi
								value = mileageUnitConversion(value, WP.JS_UNIT_DISTANCE);						
							}else if(value != null && symbol != "Φ" && paramid == "27"){
								//altitude unit ft
								value = altitudeUnitConversion(value, WP.JS_UNIT_ALTITUDE);						
							}							
							
							$("<td></td>").text(value).appendTo($tr);
							$td = $("<td></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px;' onclick='removeSelfRow(this);'></a>";
							$(str).attr("href","#").addClass("operate_delete").appendTo($td);
						}
					}
				}
				
				$(Wnd).find("#event_time_duration").prop("checked", jo.tde==1);
				$(Wnd).find("#event_time_duration_value").val(jo.td);
				if(jo.wd != null && jo.wd.length > 0 && jo.wd.split(',').length == 7){
					var days = jo.wd.split(',');
					$(Wnd).find("#event_time_week_day_mon").prop("checked", days[0]=="1");
					$(Wnd).find("#event_time_week_day_tue").prop("checked", days[1]=="1");
					$(Wnd).find("#event_time_week_day_wed").prop("checked", days[2]=="1");
					$(Wnd).find("#event_time_week_day_thu").prop("checked", days[3]=="1");
					$(Wnd).find("#event_time_week_day_fri").prop("checked", days[4]=="1");
					$(Wnd).find("#event_time_week_day_sat").prop("checked", days[5]=="1");
					$(Wnd).find("#event_time_week_day_sun").prop("checked", days[6]=="1");
				}
				
				if(jo.dte==1){
					$(Wnd).find("#event_time_daytime_enable").trigger("click");
				}		
				
				if(jo.dt != null && jo.dt.length > 0 && jo.dt.split(';').length == 7){
					var dayTimes = jo.dt.split(';');
					if(dayTimes[0] != null && dayTimes[0].split(',').length == 3){
						var times = dayTimes[0].split(',');
						$(Wnd).find("#event_time_daytime_mon_enable").prop("checked", times[0]=="1");
						$(Wnd).find("#event_time_daytime_monday_from").val(times[1]);
						$(Wnd).find("#event_time_daytime_monday_to").val(times[2]);
					}
					
					if(dayTimes[1] != null && dayTimes[1].split(',').length == 3){
						var times = dayTimes[1].split(',');
						$(Wnd).find("#event_time_daytime_tue_enable").prop("checked", times[0]=="1");
						$(Wnd).find("#event_time_daytime_tuesday_from").val(times[1]);
						$(Wnd).find("#event_time_daytime_tuesday_to").val(times[2]);
					}
					
					if(dayTimes[2] != null && dayTimes[2].split(',').length == 3){
						var times = dayTimes[2].split(',');
						$(Wnd).find("#event_time_daytime_wed_enable").prop("checked", times[0]=="1");
						$(Wnd).find("#event_time_daytime_wednesday_from").val(times[1]);
						$(Wnd).find("#event_time_daytime_wednesday_to").val(times[2]);
					}
					
					if(dayTimes[3] != null && dayTimes[3].split(',').length == 3){
						var times = dayTimes[3].split(',');
						$(Wnd).find("#event_time_daytime_thu_enable").prop("checked", times[0]=="1");
						$(Wnd).find("#event_time_daytime_thursday_from").val(times[1]);
						$(Wnd).find("#event_time_daytime_thursday_to").val(times[2]);
					}
					
					if(dayTimes[4] != null && dayTimes[4].split(',').length == 3){
						var times = dayTimes[4].split(',');
						$(Wnd).find("#event_time_daytime_fri_enable").prop("checked", times[0]=="1");
						$(Wnd).find("#event_time_daytime_friday_from").val(times[1]);
						$(Wnd).find("#event_time_daytime_friday_to").val(times[2]);
					}
					
					if(dayTimes[5] != null && dayTimes[5].split(',').length == 3){
						var times = dayTimes[5].split(',');
						$(Wnd).find("#event_time_daytime_sat_enable").prop("checked", times[0]=="1");
						$(Wnd).find("#event_time_daytime_saturday_from").val(times[1]);
						$(Wnd).find("#event_time_daytime_saturday_to").val(times[2]);
					}
					
					if(dayTimes[6] != null && dayTimes[6].split(',').length == 3){
						var times = dayTimes[6].split(',');
						$(Wnd).find("#event_time_daytime_sun_enable").prop("checked", times[0]=="1");
						$(Wnd).find("#event_time_daytime_sunday_from").val(times[1]);
						$(Wnd).find("#event_time_daytime_sunday_to").val(times[2]);
					}
				}
				
				$(Wnd).find("#event_push_notification_enable").prop("checked", jo.pne==1);
				
				$(Wnd).find("#event_notification_email_enable").prop("checked", jo.nme==1);
				$(Wnd).find("#event_notification_email").val(jo.nm);
				
				$(Wnd).find("#event_notification_sms_enable").prop("checked", jo.nse==1);
				$(Wnd).find("#event_notification_sms").val(jo.ns);
				
				$(Wnd).find("#event_notification_telegram_enable").prop("checked", jo.nte==1);
				$(Wnd).find("#event_notification_telegram").val(jo.nt);
				
				$(Wnd).find("#event_event_arrow_enable").prop("checked", jo.are==1);
				$(Wnd).find("#event_event_arrow").val(jo.ar);
				
				$(Wnd).find("#event_event_list_color_enable").prop("checked", jo.coe==1);
				$(Wnd).find("#event_event_list_color").val(jo.co);			
				document.getElementById('event_event_list_color').jscolor.fromString(jo.co);
				
				$(Wnd).find("#event_control_enable").prop("checked", jo.ce==1);
				$(Wnd).find("#event_control_command").val(jo.cid);
				$(Wnd).find("#event_control_gateway").val(jo.gw);
				$(Wnd).find("#event_control_code_type").val(jo.ct);
				$(Wnd).find("#event_control_parameters").val(jo.cc);						
			});
		 } catch(e) {showLoading(false,null,3);}
	}else if(state == 3){
		/**delete event*/
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
				$.post("manage.ajax.php", {"type":16, "eid":eventid, "objid": keyid, "state": state}, function(data) {
					clearTimeout(timer);
					showLoading(false,null,3);
					var result = eval('(' + data + ')');
					if(result.status == 'ok'){
						
						var $td = $("#customized_event tbody tr td[eid="+eventid+"]");
						var delIdex = parseInt($td.parent().find("td:first-child").text());
						var $trs = $("#customized_event tbody tr");//$td.parent().nextAll();
						$.each($trs, function(idx, value){
							var index = parseInt($(value).find("td:first-child").text());
							if(delIdex < index){
								$(value).find("td:first-child").text(index - 1);
							}				
						});
						
						$td.parent().remove();
						mgrevent_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrevent_array_name),1);				
						
						//$("#customized_event tbody tr").removeClass("oddcolor");
						//$("#customized_event tbody tr:odd").addClass("oddcolor");
						
						$("#mgrevent_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrevent_array_name,minLength:mgrevent_array_name.length < 2000 ? 0:2,max:10,scroll:true});				
						
						showMessage("succ", JS_EVENT_INFO, JS_DELETE_SUCC);
					}else if(result.error == -20){
						showMessage("stop", JS_EVENT_INFO, JS_NO_PERMISSION);
					}else {
						showMessage("stop", JS_EVENT_INFO, JS_DELETE_FAIL);
					}
				});
			} catch(e) {showLoading(false,null,3);}
		});
	}
	
}

function dlgSensorInfo(state,keyid,sensorid){
	/**edit sensor*/
	if(state == 2){
		showLoading(true,null,3);
		var timer = setTimeout("showLoading(false,null,3);", requestTimeout);
		try {
			$.post("manage.ajax.php", {"type":18, "sid":sensorid}, function(data) {			
				clearTimeout(timer);
				var WP = window.parent;
				showLoading(false,null,3);			
				var json = eval('(' + data + ')');
				var jo = json[0];	
				
				var Wnd = $("#dlg_sensor");				
				showSensorDlg(state, keyid, sensorid);
				//init sensor
				$(Wnd).find("#sensor_name").val(jo.sn);
				$(Wnd).find("#sensor_target").val(jo.tg);
				$(Wnd).find("#sensor_element").val(jo.eid);
				$(Wnd).find("#sensor_element").trigger("change");	
				$(Wnd).find("#sensor_format").val(jo.vf);
				$(Wnd).find("#sensor_digital_1").val(jo.sd1);
				$(Wnd).find("#sensor_digital_0").val(jo.sd0);
				$(Wnd).find("#sensor_formula").val(jo.sf);
				$(Wnd).find("#sensor_lowest_value").val(jo.slv);			
				$(Wnd).find("#sensor_highest_value").val(jo.shv);
				$(Wnd).find("#sensor_ignore_ignition_off").prop("checked", jo.igo==1);
				$(Wnd).find("#sensor_smooth_data").prop("checked", jo.sd==1);
				$(Wnd).find("#sensor_reverse_digital").prop("checked", jo.rd==1);
				$(Wnd).find("#sensor_show_time").prop("checked", jo.sht==1);	
				$(Wnd).find("#sensor_keep_last_value").prop("checked", jo.klv==1);					
		
				if(jo.ca != null){
					var calibrationRows = jo.ca.split(';');
					for(var i = 0; i < calibrationRows.length; i++){
						var row = calibrationRows[i].split(",");
						if(row.length == 2){
							var calibration_x = row[0];
							var calibration_y = row[1];
							
							var $tbody = $("#calibration_parameters tbody");	
							if($tbody.length == 0){
								$tbody = $("<tbody></tbody>").appendTo($("#calibration_parameters"));
							}
							var $tr = $("<tr></tr>").appendTo($tbody);							
							$("<td></td>").text(calibration_x).appendTo($tr);							
							$("<td></td>").text(calibration_y).appendTo($tr);														
							$td = $("<td></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px;' onclick='removeSelfRow(this);'></a>";
							$(str).attr("href","#").addClass("operate_delete").appendTo($td);
						}
					}
				}
				
				if(jo.di != null){
					var dictionaryRows = jo.di.split(';');
					for(var i = 0; i < dictionaryRows.length; i++){
						var row = dictionaryRows[i].split("=");
						if(row.length == 2){
							var value = row[0];
							var text = row[1];
							
							var $tbody = $("#dictionary_parameters tbody");	
							if($tbody.length == 0){
								$tbody = $("<tbody></tbody>").appendTo($("#dictionary_parameters"));
							}
							var $tr = $("<tr></tr>").appendTo($tbody);							
							$("<td></td>").text(value).appendTo($tr);							
							$("<td></td>").text(text).appendTo($tr);														
							$td = $("<td></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px;' onclick='removeSelfRow(this);'></a>";
							$(str).attr("href","#").addClass("operate_delete").appendTo($td);
						}
					}
				}				
			});
		} catch(e) {showLoading(false,null,3);}
	}else if(state == 3){
		/**delete sensor*/
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
				$.post("manage.ajax.php", {"type":19, "sid":sensorid, "objid": keyid, "state": state}, function(data) {
					clearTimeout(timer);
					showLoading(false,null,3);
					var result = eval('(' + data + ')');
					if(result.status == 'ok'){
						
						var $td = $("#sensor_list tbody tr td[sid="+sensorid+"]");
						var delIdex = parseInt($td.parent().find("td:first-child").text());
						var $trs = $("#sensor_list tbody tr"); //$td.parent().nextAll();
						$.each($trs, function(idx, value){
							var index = parseInt($(value).find("td:first-child").text());
							if(delIdex < index){
								$(value).find("td:first-child").text(index - 1);
							}						
						});
						
						$td.parent().remove();
						mgrsensor_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrsensor_array_name),1);				
						
						//$("#sensor_list tbody tr").removeClass("oddcolor");
						//$("#sensor_list tbody tr:odd").addClass("oddcolor");
						
						$("#mgrsensor_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrsensor_array_name,minLength:mgrsensor_array_name.length < 2000 ? 0:2,max:10,scroll:true});				
						
						showMessage("succ", JS_SENSOR_INFO, JS_DELETE_SUCC);
					}else if(result.error == -20){
						showMessage("stop", JS_SENSOR_INFO, JS_NO_PERMISSION);
					}else {
						showMessage("stop", JS_SENSOR_INFO, JS_DELETE_FAIL);
					}
				});
			} catch(e) {showLoading(false,null,3);}
		});
	}
}

function showEventDlg(state, keyid, eventid){
	pagechanged('#tab_event_main');
	var Wind = $("#dlg_event");	
	$(Wind).css("z-index", "1012");
	$(Wind).css("display", "block");
	
	$("body").append("<div class='modalmask_level2'></div>");
	$(Wind).append("<span id='close' class='dialog_cancel'></span>");
	$(Wind).find("#close").click(function(){
		$(Wind).css("display", "none");
		$(this).remove();
		$(".modalmask_level2").remove();
	});
	
	$(Wind).find("#button_cancel").click(function(){
		$(Wind).css("display", "none");
		$(Wind).find("#close").remove();
		$(".modalmask_level2").remove()
	});
	
	$(Wind).css("top", Math.round(document.body.clientHeight / 2 - $(Wind).height() / 3*2) + "px");
	$(Wind).css("left", Math.round(document.body.clientWidth / 2 - $(Wind).width() / 2) + "px");
	
	$(Wind).find("#button_ok").unbind("click").click(function() {
		/**check event input*/
		if(checkEventDlg()){
			/**save event input*/
			saveEvent(state, keyid, eventid);
		}		
	 });
}

function showSensorDlg(state, keyid,sensorid){
	var Wind = $("#dlg_sensor");	
	$(Wind).css("z-index", "1012");
	$(Wind).css("display", "block");
	
	$("body").append("<div class='modalmask_level2'></div>");
	$(Wind).append("<span id='close' class='dialog_cancel'></span>");
	$(Wind).find("#close").click(function(){
		$(Wind).css("display", "none");
		$(this).remove();
		$(".modalmask_level2").remove();
	});
	
	$(Wind).find("#button_cancel").click(function(){
		$(Wind).css("display", "none");
		$(Wind).find("#close").remove();
		$(".modalmask_level2").remove()
	});
	
	$(Wind).css("top", Math.round(document.body.clientHeight / 2 - $(Wind).height()/2) + "px");
	$(Wind).css("left", Math.round(document.body.clientWidth / 2 - $(Wind).width() / 2) + "px");	
	
	$(Wind).find("#button_ok").unbind("click").click(function() {
		/**check sensor input*/
		if(checkSensorDlg()){
			/**save sensor input*/
			saveSensor(state, keyid, sensorid);
		}		
	 });
}

function checkEventDlg(){
	var Wind = $("#dlg_event");
	$(Wind).find(".itext, .itime").each(function(){
		$(this).removeClass("invalidbox"); 
	});
	
	var mustok = true;				
	$(Wind).find("#event_name").each(function(){
		var value = $(this).val().replace(/(^\s*)|(\s*$)/g,"");
		if(value == ""){			
			$(this).addClass("invalidbox").focus();
			pagechanged('#tab_event_main');
			mustok = false;
		}else{
			$(this).removeClass("invalidbox");
		}	
	});
	
	$(Wind).find("#event_time_period, #event_speed_limit, #event_distance").each(function(){
		var value = $(this).val(); 
		if(value != ""){
			matchArray = value.match(/^([1-9]\d*|[0]{1,1})$/);
			if (matchArray == null) {
				$(this).addClass("invalidbox").focus();
				pagechanged('#tab_event_main');
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		}
	});
	
	$(Wind).find("#event_time_duration_value").each(function(){
		var value = $(this).val(); 
		if(value != ""){
			matchArray = value.match(/^([1-9]\d*|[0]{1,1})$/);
			if (matchArray == null) {
				$(this).addClass("invalidbox").focus();
				pagechanged('#tab_event_time');
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		}
	});
	
	return mustok;
}

function checkSensorDlg(){
	var Wind = $("#dlg_sensor");
	$(Wind).find(".itext, .itime").each(function(){
		$(this).removeClass("invalidbox"); 
	});
	
	var mustok = true;				
	$(Wind).find("#sensor_name").each(function(){
		var value = $(this).val().replace(/(^\s*)|(\s*$)/g,"");
		if(value == ""){			
			$(this).addClass("invalidbox").focus();
			mustok = false;
		}else{
			$(this).removeClass("invalidbox");
		}	
	});
	
	$(Wind).find("#sensor_lowest_value, #sensor_highest_value").each(function(){
		var value = $(this).val(); 
		if(value != ""){
			matchArray = value.match(/^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/);  //正负浮点数
			if (matchArray == null) {			
				matchArray = value.match(/^-?\d+$/);  //正负整数
				if (matchArray == null) {
					$(this).addClass("invalidbox").focus();
					mustok = false;
				}else{
					$(this).removeClass("invalidbox");
				}
			}else{
				$(this).removeClass("invalidbox");								
			}
		}
	});
	
	return mustok;
}

function saveEvent(state, keyid, eventid){
	var WP = window.parent;
	var Wind = $("#dlg_event");
	
	var $row = $("#parameters_and_sensors tbody tr");
	var paramstr = "";
	$($row).each(function(i, value) {
		var param_id = $(value).find("td:first").attr('paramid');
		var param_symbol = $(value).find("td:eq(1)").text(); 
		var param_value = $(value).find("td:eq(2)").text();
		
		//速度转为km/h
		if(param_value != null && param_symbol != "Φ" && param_id == "66" && WP.JS_UNIT_SPEED == 1){
			param_value = parseFloat(param_value) * 1.609344;
		}
		
		//油量转为L
		if(param_value != null && param_symbol != "Φ" && (param_id == "30" || param_id == "31" || param_id == "80") && WP.JS_UNIT_FUEL == 1){
			param_value = parseFloat(param_value) * 4.5460919;
		}
		
		//温度转为摄氏度
		if(param_value != null && param_symbol != "Φ" && (param_id == "72" || param_id == "73" || param_id == "74" || param_id == "75" || param_id == "76" || param_id == "77" || param_id == "78" || param_id == "79") && WP.JS_UNIT_TEMPERATURE == 1){
			param_value = ((parseFloat(param_value) - 32) / 1.8) * 10;
			
		}else if(param_value != null && param_symbol != "Φ" && (param_id == "72" || param_id == "73" || param_id == "74" || param_id == "75" || param_id == "76" || param_id == "77" || param_id == "78" || param_id == "79") && WP.JS_UNIT_TEMPERATURE == 0){
			param_value = parseFloat(param_value) * 10;
		}
		
		//里程转换为km
		if(param_value != null && param_symbol != "Φ" && (param_id == "10" || param_id == "63") && WP.JS_UNIT_DISTANCE == 1){
			param_value = parseFloat(param_value) * 1.609344 * 10;	
			
		}else if(param_value != null && param_symbol != "Φ" && (param_id == "10" || param_id == "63") && WP.JS_UNIT_DISTANCE == 2){
			param_value = parseFloat(param_value) * 1.852 * 10;
			
		}else if(param_value != null && param_symbol != "Φ" && (param_id == "10" || param_id == "63") && WP.JS_UNIT_DISTANCE == 0){
			param_value = parseFloat(param_value) * 10;
		}
		
		//海拔转为米
		if(param_value != null && param_symbol != "Φ" && param_id == "27" && WP.JS_UNIT_ALTITUDE == 1){
			param_value = parseFloat(param_value) * 0.3048;			
		}
				
		paramstr += param_id +","+ param_symbol +","+ param_value +";";
		
	});
	
	var active = $("#event_active").prop("checked") ? 1 : 0;
	var eventName = $("#event_name").val();
	var eventType = $("#event_type").val();
	var dependingOnPlaces = $("#event_depending_place").val();
	var places = $(Wind).find("#event_place").val() == null ? "" : $(Wind).find("#event_place").val().join();
	var timePeriod = $("#event_time_period").val();
	var speedLimit = $("#event_speed_limit").val();
	//速度转为km/h
	if(speedLimit != null && speedLimit.length > 0 && WP.JS_UNIT_SPEED == 1){
		speedLimit = (parseFloat(speedLimit) * 1.609344).toFixed(0);
	}
	//距离转为km
	var distance = $("#event_distance").val();
	if(distance != null && distance.length > 0 && WP.JS_UNIT_DISTANCE == 1){
		distance = (parseFloat(distance) * 1.609344).toFixed(0);
		
	}else if(distance != null && distance.length > 0 && WP.JS_UNIT_DISTANCE == 2){
		distance = (parseFloat(distance) * 1.852).toFixed(0);
	}
	//time
	var eventTimeDuration = $("#event_time_duration").prop("checked") ? 1 : 0;
	var eventTimeDurationValue = $("#event_time_duration_value").val();
	var eventTimeWeekDayDon = $("#event_time_week_day_mon").prop("checked") ? 1 : 0;
	var eventTimeWeekDayTue = $("#event_time_week_day_tue").prop("checked") ? 1 : 0;
	var eventTimeWeekDayWed = $("#event_time_week_day_wed").prop("checked") ? 1 : 0;
	var eventTimeWeekDayThu = $("#event_time_week_day_thu").prop("checked") ? 1 : 0;
	var eventTimeWeekDayFri = $("#event_time_week_day_fri").prop("checked") ? 1 : 0;
	var eventTimeWeekDaySat = $("#event_time_week_day_sat").prop("checked") ? 1 : 0;
	var eventTimeWeekDaySun = $("#event_time_week_day_sun").prop("checked") ? 1 : 0;
	var weekDay = eventTimeWeekDayDon + "," + eventTimeWeekDayTue + "," + eventTimeWeekDayWed + "," + eventTimeWeekDayThu + "," + eventTimeWeekDayFri + "," + eventTimeWeekDaySat + "," + eventTimeWeekDaySun;
	
	var dayTimeEnable = $("#event_time_daytime_enable").prop("checked") ? 1 : 0;
	var dayTimeMonEnable = $("#event_time_daytime_mon_enable").prop("checked") ? 1 : 0;
	var eventTimeDayTimeMondayFrom = $("#event_time_daytime_monday_from").val();
	var eventTimeDayTimeMondayTo = $("#event_time_daytime_monday_to").val();
	
	var dayTimeTueEnable = $("#event_time_daytime_tue_enable").prop("checked") ? 1 : 0;
	var eventTimeDayTimeTuesdayFrom = $("#event_time_daytime_tuesday_from").val();
	var eventTimeDayTimeTuesdayTo = $("#event_time_daytime_tuesday_to").val();
	
	var dayTimeWedEnable = $("#event_time_daytime_wed_enable").prop("checked") ? 1 : 0;
	var eventTimeDayTimeWednesdayFrom = $("#event_time_daytime_wednesday_from").val();
	var eventTimeDayTimeWednesdayTo = $("#event_time_daytime_wednesday_to").val();
	
	var dayTimeThuEnable = $("#event_time_daytime_thu_enable").prop("checked") ? 1 : 0;
	var eventTimeDayTimeThursdayFrom = $("#event_time_daytime_thursday_from").val();
	var eventTimeDayTimeThursdayTo = $("#event_time_daytime_thursday_to").val();
	
	var dayTimeFriEnable = $("#event_time_daytime_fri_enable").prop("checked") ? 1 : 0;
	var eventTimeDayTimeFridayFrom = $("#event_time_daytime_friday_from").val();
	var eventTimeDayTimeFridayTo = $("#event_time_daytime_friday_to").val();
	
	var dayTimeSatEnable = $("#event_time_daytime_sat_enable").prop("checked") ? 1 : 0;
	var eventTimeDayTimeSaturdayFrom = $("#event_time_daytime_saturday_from").val();
	var eventTimeDayTimeSaturdayTo = $("#event_time_daytime_saturday_to").val();
	
	var dayTimeSunEnable = $("#event_time_daytime_sun_enable").prop("checked") ? 1 : 0;
	var eventTimeDayTimeSundayFrom = $("#event_time_daytime_sunday_from").val();
	var eventTimeDayTimeSundayTo = $("#event_time_daytime_sunday_to").val();
	
	var dayTime = dayTimeMonEnable + "," + eventTimeDayTimeMondayFrom + "," + eventTimeDayTimeMondayTo + ";" + 
				  dayTimeTueEnable + "," + eventTimeDayTimeTuesdayFrom + "," + eventTimeDayTimeTuesdayTo + ";" + 
				  dayTimeWedEnable + "," + eventTimeDayTimeWednesdayFrom + "," + eventTimeDayTimeWednesdayTo + ";" + 
				  dayTimeThuEnable + "," + eventTimeDayTimeThursdayFrom + "," + eventTimeDayTimeThursdayTo + ";" + 
				  dayTimeFriEnable + "," + eventTimeDayTimeFridayFrom + "," + eventTimeDayTimeFridayTo + ";" + 
				  dayTimeSatEnable + "," + eventTimeDayTimeSaturdayFrom + "," + eventTimeDayTimeSaturdayTo + ";" + 
				  dayTimeSunEnable + "," + eventTimeDayTimeSundayFrom + "," + eventTimeDayTimeSundayTo;
	
	//Notification
	var pushNotificationEnable = $("#event_push_notification_enable").prop("checked") ? 1 : 0;
	var notificationEmailEnable = $("#event_notification_email_enable").prop("checked") ? 1 : 0;
	var notificationEmail = $("#event_notification_email").val();
	var notificationSmsEnable = $("#event_notification_sms_enable").prop("checked") ? 1 : 0;
	var notificationSms = $("#event_notification_sms").val();
	var notificationTelegramEnable = $("#event_notification_telegram_enable").prop("checked") ? 1 : 0;
	var notificationTelegram = $("#event_notification_telegram").val();
	//color
	var arrowEnable = $("#event_event_arrow_enable").prop("checked") ? 1 : 0;
	var arrow = $("#event_event_arrow").val();
	var colorEnable = $("#event_event_list_color_enable").prop("checked") ? 1 : 0;
	var color = $("#event_event_list_color").val();
	//object control
	var controlEnable = $("#event_control_enable").prop("checked") ? 1 : 0;
	var command = $("#event_control_command").val();
	var gateWay = $("#event_control_gateway").val();
	var codeType = $("#event_control_code_type").val();
	var cmdParam = $("#event_control_parameters").val();
	
	var req = {
		"type":16,
		"state": state,
		"objid": keyid,
		"eid": eventid,
		"ea": active,
		"en": eventName,
		"et": eventType,
		"dop": dependingOnPlaces,
		"ps": places,
		"tp": timePeriod,
		"sl": speedLimit,
		"di": distance,
		"ex": paramstr,
		"tde": eventTimeDuration,
		"td": eventTimeDurationValue,
		"wd": weekDay,
		"dte": dayTimeEnable,
		"dt": dayTime,
		"pne": pushNotificationEnable,
		"nme": notificationEmailEnable,
		"nm": notificationEmail,
		"nse": notificationSmsEnable,
		"ns": notificationSms,
		"nte": notificationTelegramEnable,
		"nt": notificationTelegram,
		"are": arrowEnable,
		"ar": arrow,
		"coe": colorEnable,
		"co": color,
		"ce": controlEnable,
		"cid": command,
		"gw": gateWay,
		"ct": codeType,
		"cc": cmdParam		
	}
	
	showLoading(true,null,3);
	var timer = setTimeout("showLoading(false,null,3)", requestTimeout);
	try{
		$.post("manage.ajax.php", req, function(data) {
			clearTimeout(timer);
			showLoading(false,null,3);
			var result = eval('(' + data + ')');
            if (result.status == 'ok') {							
				if(state == 2){				
					/**edit event*/
					var str = "#customized_event tbody tr td[eid='"+req.eid+"']";
					var $td = $(str);
					if($td.length > 0){
						var $tr = $td.parent();						
						mgrevent_array_name.splice($.inArray($tr.find('td:eq(1)').text(),mgrevent_array_name),1);						
						$tr.find('td:eq(1)').text(req.en).attr("eid",req.eid);	
						
						$tr.find('td:eq(2)').attr("data-sort",req.ea);
						if(req.ea == 0){
							$tr.find('td:eq(2) a').removeClass("state_enable").addClass("state_disable");	
						}else{
							$tr.find('td:eq(2) a').removeClass("state_disable").addClass("state_enable");								
						}
						
						$tr.find('td:eq(3)').attr("data-sort",req.pne);
						if(req.pne == 0){
							$tr.find('td:eq(3) a').removeClass("state_enable").addClass("state_disable");															
						}else{
							$tr.find('td:eq(3) a').removeClass("state_disable").addClass("state_enable");													
						}
						
						$tr.find('td:eq(4)').attr("data-sort",req.nme);
						if(req.nme == 0){
							$tr.find('td:eq(4) a').removeClass("state_enable").addClass("state_disable");														
						}else{
							$tr.find('td:eq(4) a').removeClass("state_disable").addClass("state_enable");													
						}
						
						$tr.find('td:eq(5)').attr("data-sort",req.nse);
						if(req.nse == 0){
							$tr.find('td:eq(5) a').removeClass("state_enable").addClass("state_disable");														
						}else{
							$tr.find('td:eq(5) a').removeClass("state_disable").addClass("state_enable");													
						}
						
						$tr.find('td:eq(6)').attr("data-sort",req.nte);
						if(req.nte == 0){
							$tr.find('td:eq(6) a').removeClass("state_enable").addClass("state_disable");														
						}else{
							$tr.find('td:eq(6) a').removeClass("state_disable").addClass("state_enable");													
						}
																		
						mgrevent_array_name.push(req.en);
						
						if($("#mgrevent_item").val() == "1"){
							 $("#mgrevent_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrevent_array_name,minLength:mgrevent_array_name.length < 2000 ? 0:2,max:10,scroll:true});
						}
						showMessage("succ", JS_EVENT_INFO, JS_UPDATE_SUCC);
					}
				}else{					
					/**new event*/
					var $tbody = $("#customized_event tbody");
					if($tbody.length == 0){
						$tbody = $("<tbody></tbody>").appendTo($("#customized_event"));
					}
					
					mgrevent_array_name.push(req.en);
                    var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text($tbody.find("tr").size()).attr("eid", result.eid).appendTo($tr);
					$("<td></td>").text(req.en).attr("en",req.en).appendTo($tr);
					
					if(req.ee == 0){
						$td = $("<td data-sort="+req.ee+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_disable").appendTo($td);														
					}else{
						$td = $("<td data-sort="+req.ee+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_enable").appendTo($td);														
					}
					
					if(req.pne == 0){
						$td = $("<td data-sort="+req.pne+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_disable").appendTo($td);														
					}else{
						$td = $("<td data-sort="+req.pne+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_enable").appendTo($td);														
					}
					
					if(req.nme == 0){
						$td = $("<td data-sort="+req.nme+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_disable").appendTo($td);														
					}else{
						$td = $("<td data-sort="+req.nme+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_enable").appendTo($td);														
					}
					
					if(req.nse == 0){
						$td = $("<td data-sort="+req.nse+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_disable").appendTo($td);														
					}else{
						$td = $("<td data-sort="+req.nse+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_enable").appendTo($td);														
					}
					
					if(req.nte == 0){
						$td = $("<td data-sort="+req.nte+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_disable").appendTo($td);														
					}else{
						$td = $("<td data-sort="+req.nte+"></td>").appendTo($tr);
						var str = "<a style='padding-left: 20px; cursor: default;'></a>";
						$(str).attr("href","#").addClass("state_enable").appendTo($td);														
					}
					
					$td = $("<td></td>").appendTo($tr);
					var str = "<a style='padding-left: 20px;' onclick='eventView(2,"+keyid+","+result.eid+")'></a>";
					$(str).attr("href","#").addClass("operate_edit").appendTo($td);	
					
					str = "<a style='padding-left: 20px;' onclick='eventView(3,"+keyid+","+result.eid+")'></a>";
					$(str).attr("href","#").addClass("operate_delete").appendTo($td);
                				
					//$("#customized_event tbody tr").removeClass("oddcolor");
					//$("#customized_event tbody tr:odd").addClass("oddcolor");
					if($("#mgrevent_item").val() == "1"){
						 $("#mgrevent_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrevent_array_name,minLength:mgrevent_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					if(typeof req.en != "undefined"){
						locate_table("#customized_event", "en", req.en, true);
					}
					showMessage("succ", JS_EVENT_INFO, JS_SAVE_SUCC);
				}
			
			}else if(result.error == -20){
				showMessage("stop", JS_EVENT_INFO, JS_NO_PERMISSION);
			}else {
				pagechanged('#tab_event_main');
				$("#event_name").addClass("invalidbox").focus();
                showMessage("stop", JS_EVENT_INFO + (req.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
			}
		});
	}catch(e){error(showLoading(false,null,3));}
}

function saveSensor(state, keyid, sensorid){
	var WP = window.parent;
	var Wind = $("#dlg_sensor");
	
	var $row_calibration = $("#calibration_parameters tbody tr");
	var calibrations = "";
	$($row_calibration).each(function(i, value) {
		var param_x = $(value).find("td:eq(0)").text(); 
		var param_y = $(value).find("td:eq(1)").text(); 		
				
		calibrations += param_x +","+ param_y +";";	
	});
	
	var $row_dictionary = $("#dictionary_parameters tbody tr");
	var dictionarys = "";
	$($row_dictionary).each(function(i, value) {
		var dictionary_value = $(value).find("td:eq(0)").text(); 
		var dictionary_text = $(value).find("td:eq(1)").text(); 		
				
		dictionarys += dictionary_value +"="+ dictionary_text +";";		
	});
	
	var sensor_name = $("#sensor_name").val();	
	var sensor_target = $("#sensor_target option:selected").val();
	var sensor_target_name = $("#sensor_target option:selected").text()
	var element_id = $("#sensor_element option:selected").val();
	var element_type = $("#sensor_element option:selected").attr("et");
	var element_name = $("#sensor_element option:selected").text();
	var sensor_format = $("#sensor_format").val();
	var sensor_digital_1 = $("#sensor_digital_1").val();
	var sensor_digital_0 = $("#sensor_digital_0").val();
	var sensor_formula = $("#sensor_formula").val();
	var sensor_lowest_value = $("#sensor_lowest_value").val();
	var sensor_highest_value = $("#sensor_highest_value").val();
	var ignore_ignition_off = $("#sensor_ignore_ignition_off").prop("checked") ? 1 : 0;
	var smooth_data = $("#sensor_smooth_data").prop("checked") ? 1 : 0;
	var reverse_digital = $("#sensor_reverse_digital").prop("checked") ? 1 : 0;
	var show_time = $("#sensor_show_time").prop("checked") ? 1 : 0;
	var keep_last_value = $("#sensor_keep_last_value").prop("checked") ? 1 : 0;
	
	var req = {
		"type":19,
		"state": state,
		"objid": keyid,
		"sid": sensorid,
		"sn": sensor_name,
		"tg": sensor_target,
		"en": element_name,
		"eid": element_id,
		"et": element_type,
		"vf": sensor_format,
		"sd1": sensor_digital_1,
		"sd0": sensor_digital_0,
		"sf": sensor_formula,
		"slv": sensor_lowest_value,
		"shv": sensor_highest_value,
		"igo": ignore_ignition_off,
		"sd": smooth_data,
		"rd": reverse_digital,
		"sht": show_time,
		"klv": keep_last_value,
		"ca": calibrations,
		"di": dictionarys
	}
	
	showLoading(true,null,3);
	var timer = setTimeout("showLoading(false,null,3)", requestTimeout);
	try{
		$.post("manage.ajax.php", req, function(data) {
			clearTimeout(timer);
			showLoading(false,null,3);
			var result = eval('(' + data + ')');
            if (result.status == 'ok') {								
				if(state == 2){
					
					/**edit sensor*/
					var str = "#sensor_list tbody tr td[sid='"+req.sid+"']";
					var $td = $(str);
					if($td.length > 0){
						var $tr = $td.parent();						
						mgrsensor_array_name.splice($.inArray($tr.find('td:eq(1)').text(),mgrsensor_array_name),1);						
						$tr.find('td:eq(1)').text(req.sn).attr("sid",req.sid).attr("sn",req.sn);
						$tr.find('td:eq(2)').text(sensor_target_name);	
						$tr.find('td:eq(3)').text(req.en).attr("eid",req.eid).attr("tg",req.tg).attr("st",req.et);	
																	
						mgrsensor_array_name.push(req.sn);
						
						if($("#mgrsensor_item").val() == "1"){
							 $("#mgrsensor_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrsensor_array_name,minLength:mgrsensor_array_name.length < 2000 ? 0:2,max:10,scroll:true});
						}
						showMessage("succ", JS_SENSOR_INFO, JS_UPDATE_SUCC);
					}
				}else{					
					/**delete object same element*/
					var $td = $("#sensor_list tbody tr td[eid="+req.eid+"]");
					if($td.length > 0){
						var delIdex = parseInt($td.parent().find("td:first-child").text());
						var $trs = $("#sensor_list tbody tr");//$td.parent().nextAll();
						$.each($trs, function(idx, value){
							var index = parseInt($(value).find("td:first-child").text());
							if(delIdex < index){
								$(value).find("td:first-child").text(index - 1);
							}						
						});
						
						$td.parent().remove();
						mgrsensor_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrsensor_array_name),1);
					}								
								
					/**new sensor*/
					var $tbody = $("#sensor_list tbody");
					if($tbody.length == 0){
						$tbody = $("<tbody></tbody>").appendTo($("#sensor_list"));
					}
					
					mgrsensor_array_name.push(req.sn);
                    var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text($tbody.find("tr").size())/*.attr("sid", result.sid)*/.appendTo($tr);
					$("<td></td>").text(req.sn).attr("sid",result.sid).attr("sn",req.sn).appendTo($tr);
					$("<td></td>").text(sensor_target_name).appendTo($tr);
					$("<td></td>").text(req.en).attr("eid",req.eid).attr("tg",req.tg).appendTo($tr).attr("st",req.et);					
					
					$td = $("<td></td>").appendTo($tr);
					var str = "<a style='padding-left: 20px;' onclick='sensorView(2,"+keyid+","+result.sid+")'></a>";
					$(str).attr("href","#").addClass("operate_edit").appendTo($td);	
					
					str = "<a style='padding-left: 20px;' onclick='sensorView(3,"+keyid+","+result.sid+")'></a>";
					$(str).attr("href","#").addClass("operate_delete").appendTo($td);
                				
					//$("#sensor_list tbody tr").removeClass("oddcolor");
					//$("#sensor_list tbody tr:odd").addClass("oddcolor");
					if($("#mgrsensor_item").val() == "1"){
						 $("#mgrsensor_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrsensor_array_name,minLength:mgrsensor_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					if(typeof req.sn != "undefined"){
						locate_table("#sensor_list", "sn", req.sn, true);
					}
					showMessage("succ", JS_SENSOR_INFO, JS_SAVE_SUCC);
				}
				
			}else if(result.error == -20){
				showMessage("stop", JS_SENSOR_INFO, JS_NO_PERMISSION);
			}else {
				$("#event_name").addClass("invalidbox").focus();
                showMessage("stop", JS_SENSOR_INFO + (req.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
			}
		});
	}catch(e){error(showLoading(false,null,3));}	
}

function showEditGroup() {
	var p = $("#usr_group").getCurrentNode();
	
	if(typeof p == 'undefined' || p.parent == null /*|| p.value == top_car_group*//*p.parent.value ==0*/){
        showMessage("info", JS_GROUP_INFO, JS_GROUP_SELECT_TIP);
        return;
    }
	
    var $dlg = $("#dlg_newgroup");
    $dlg.find(".must").remove("invalidbox");
	$dlg.find("#parent").hide();
	$dlg.find("#parent_edit").show();
	$dlg.find("#group_text").val(p.text);
	
	var parent_gid = p.parent.value;
	$("#parent_edit").empty();
   
	if(parent_gid == 0){	
		$("#parent_edit").attr("disabled","disabled").removeClass("enablebox").addClass("disablebox");
	}else{
		$("#parent_edit").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
		
		if(array_group!=null)
		for(var g in array_group){
			if(g != p.value){
				$item = $("<option></option>").appendTo("#parent_edit");
				$item.attr("value", g);
				$item.text(array_group[g]);
			}
		}
		
		//排序
		var obj = document.getElementById("parent_edit");
		var tmp = new Array();
		for(var i=0;i<obj.options.length;i++){
			var ops = new op();
			ops._value = obj.options[i].value;
			ops._text = obj.options[i].text;
			tmp.push(ops);
		}
		tmp.sort(sortRule);

		for(var j=0;j<tmp.length;j++){
			obj.options[j].value = tmp[j]._value;
			obj.options[j].text = tmp[j]._text;
		}
		
		$("#parent_edit option[value='"+parent_gid+"']").attr("selected","selected");  
	}
	
    $dlg.css("display", "block");
    $("body").append("<div class='modalmask'></div>");
    $dlg.append("<span id='close' class='dialog_cancel'></span>");
    $dlg.find("#close").click(function() {
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_ok").click(function() {
        var mustok = true;
        $dlg.find(".must").each(function(){
            if($(this).val()=="" || $(this).val()==null){
                $(this).addClass("invalidbox");
                mustok = false;
            }else{
                $(this).removeClass("invalidbox");
            }
        });
        if(!mustok)return;
        $(this).unbind("click");
        showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
        var pid = $("#usr_group").getCurrentNode();
        var req = {
            "group": $dlg.find("#group_text").val(),
            "parent": pid != null ? pid.value : 0,
			"p_parent": $('#parent_edit').val(),
			"type": 1,
			"self": parent_gid == 0 ? 1:0
        }

        $dlg.css("display", "none");
        try{
            $.get("groupadd.ajax.php", req, function(data) {
                clearTimeout(timer);
				showLoading(false);
				load2 = false;
                var result = eval('(' + data + ')');
				if(result.status == 'no parent group'){
					showMessage("stop", JS_GROUP_INFO, JS_NO_GROUP_PARENT);
				} else if (result.status == 'ok') {
                    dev_group = result.group;
                    $("#ginfo").empty();                    
                    if(dev_group!=null)
                    for(i = 0; i< dev_group.length; i++){
                        var g = dev_group[i];
                        $item = $("<option></option>").appendTo("#ginfo");
                        $item.attr("value", g.id);
                        $item.text(g.name);
                    }
                    $(".modalmask").remove();
                    showMessage("succ", JS_GROUP_INFO, JS_UPDATE_SUCC);
                    
                    load_groups(current_userid, false, $("#serach_gname").val());
                } else if(result.error == -20){
					showMessage("stop", JS_GROUP_INFO, JS_NO_PERMISSION);
				} else if(result.error == -10){
					showMessage("stop", JS_GROUP_INFO, JS_GROUP_OPERATION_ERROR);
				}else {
                    showMessage("stop", JS_GROUP_INFO, JS_UPDATE_FAIL);
                }
            });
        }catch(e){error(showLoading(false));}
    });
    $dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px")
}

function showDelGroup(){
	var p = $("#usr_group").getCurrentNode();
    if(typeof p == 'undefined' || p.parent == null || p.value == top_car_group/*p.parent.value ==0*/){
        showMessage("info", JS_GROUP_INFO, JS_GROUP_SELECT_TIP);
        return;
    }

	var WP = window.parent
	var $dlg = $("#dlg_delconfirm");
	$dlg.css("display","block");
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$("body").append("<div class='modalmask'></div>");
	$dlg.find("#close").click(function() {
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
	$dlg.find("#button_ok").click(function() {
		$(this).unbind("click");
		showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
		$dlg.css("display", "none");
		try{
			$.post("manage.ajax.php", {"type":8, "gid": p.value}, function(data) {
				clearTimeout(timer);
				showLoading(false);
				var result = eval('(' + data + ')');
				if(result.status == 'ok'){
					load2 = false;
					load7 = false;
					load8 = false;
					load_groups(current_userid, false, $("#serach_gname").val());
					var gids = result.gids;
					for(var i=0; i<gids.length; i++){
						WP.deleteGroup(gids[i].GID);
					}
					showMessage("succ", JS_GROUP_INFO, JS_DELETE_SUCC);
				}else if(result.error == -20){
					showMessage("stop", JS_GROUP_INFO, JS_NO_PERMISSION);
				}else if(result.error == -7){
					showMessage("stop", JS_GROUP_INFO, JS_DELETE_ASSET_FIRST);
				}else {					
                    showMessage("stop", JS_GROUP_INFO, JS_DELETE_FAIL);
                }
			});
		}catch(e){error(showLoading(false));}
	});
}

function showDelTask(tid, oid, state){
	locate_table("#tasklist", "tid", tid);
	var WP = window.parent
	var $dlg = $("#dlg_delconfirm");
	$dlg.css("display","block");
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$("body").append("<div class='modalmask'></div>");
	$dlg.find("#close").click(function() {
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
	$dlg.find("#button_ok").click(function() {
		$(this).unbind("click");
		showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
		$dlg.css("display", "none");
		try{
			$.post("manage.task.ajax.php", {"type":14, "tid": tid, "oid": oid, "state": state}, function(data) {
				clearTimeout(timer);
				showLoading(false);
				var result = eval('(' + data + ')');
				if(result.status == 'ok'){
					//load7=false;
					//load_mgrtask();
					var $td = $("#tasklist tbody tr td[tid="+tid+"]");
					var delIdex = parseInt($td.parent().find("td:first-child").text());
					var $trs = $("#tasklist tbody tr");//$td.parent().nextAll();
					$.each($trs, function(idx, value){
						var index = parseInt($(value).find("td:first-child").text());
						if(delIdex < index){
							$(value).find("td:first-child").text(index - 1);
						}			
					});
					
					mgrtask_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrtask_array_name),1);

					$td.parent().remove();
					//$("#tasklist tbody tr").removeClass("oddcolor");
					//$("#tasklist tbody tr:odd").addClass("oddcolor");										
					
					if($("#mgrtask_item").val() == "1"){
						$("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrtask_array_name,minLength:mgrtask_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						var deviceList = getDeviceList();
						$("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					showMessage("succ", JS_TASK_INFO, JS_DELETE_SUCC);
				}else if(result.error == -20){
					showMessage("stop", JS_TASK_INFO, JS_NO_PERMISSION);
				}else{
					showMessage("stop", JS_TASK_INFO, JS_DELETE_FAIL);					
				}
			});
		}catch(e){error(showLoading(false));}
	});
}

function showDelExpense(eid, oid, state){
	locate_table("#expenselist", "eid", eid);
	var WP = window.parent
	var $dlg = $("#dlg_delconfirm");
	$dlg.css("display","block");
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$("body").append("<div class='modalmask'></div>");
	$dlg.find("#close").click(function() {
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
	$dlg.find("#button_ok").click(function() {
		$(this).unbind("click");
		showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
		$dlg.css("display", "none");
		try{
			$.post("manage.expense.ajax.php", {"type":2, "eid": eid, "oid": oid, "state": state}, function(data) {
				clearTimeout(timer);
				showLoading(false);
				var result = eval('(' + data + ')');
				if(result.status == 'ok'){
					//load8=false;
					//load_mgrexpense();
					var $td = $("#expenselist tbody tr td[eid="+eid+"]");
					var delIdex = parseInt($td.parent().find("td:first-child").text());
					var $trs = $("#expenselist tbody tr");//$td.parent().nextAll();
					$.each($trs, function(idx, value){
						var index = parseInt($(value).find("td:first-child").text());
						if(delIdex < index){
							$(value).find("td:first-child").text(index - 1);
						}					
					});
					
					mgrexpense_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrexpense_array_name),1);

					$td.parent().remove();
					//$("#expenselist tbody tr").removeClass("oddcolor");
					//$("#expenselist tbody tr:odd").addClass("oddcolor");										
					
					if($("#mgrexpense_item").val() == "1"){
						$("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrexpense_array_name,minLength:mgrexpense_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						var deviceList = getDeviceList();
						$("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					showMessage("succ", JS_EXPENSE_INFO, JS_DELETE_SUCC);
				}else if(result.error == -20){
					showMessage("stop", JS_EXPENSE_INFO, JS_NO_PERMISSION);
				}else{
					showMessage("stop", JS_EXPENSE_INFO, JS_DELETE_FAIL);					
				}
			});
		}catch(e){error(showLoading(false));}
	});
}

function showDelCustomer(custid, state){
	locate_table("#customerlist", "custid", custid);
	var WP = window.parent
	var $dlg = $("#dlg_delconfirm");
	$dlg.css("display","block");
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$("body").append("<div class='modalmask'></div>");
	$dlg.find("#close").click(function() {
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
	$dlg.find("#button_ok").click(function() {
		$(this).unbind("click");
		showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
		$dlg.css("display", "none");
		try{
			$.post("manage.ajax.php", {"type":10, "custid": custid, "state": state}, function(data) {
				clearTimeout(timer);
				showLoading(false);
				var result = eval('(' + data + ')');
				if(result.status == 'ok'){
					//load4=false;
					load2=false;
					//load_mgrcustomer();
					var $td = $("#customerlist tbody tr td[custid="+custid+"]");
					var delIdex = parseInt($td.parent().find("td:first-child").text());
					var $trs = $("#customerlist tbody tr");//$td.parent().nextAll();
					$.each($trs, function(idx, value){
						var index = parseInt($(value).find("td:first-child").text());
						if(delIdex < index){
							$(value).find("td:first-child").text(index - 1);
						}
					});
					
					mgrcustomer_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrcustomer_array_name),1);
					mgrcustomer_array_fname.splice(jQuery.inArray($td.parent().find("td:eq(2)").text(),mgrcustomer_array_fname),1);
					mgrcustomer_array_phone.splice(jQuery.inArray($td.parent().find("td:eq(3)").text(),mgrcustomer_array_phone),1);

					$td.parent().remove();
					//$("#customerlist tbody tr").removeClass("oddcolor");
					//$("#customerlist tbody tr:odd").addClass("oddcolor");										
					
					if($("#mgrcustomer_item").val() == "1"){
						 $("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_name,minLength:mgrcustomer_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrcustomer_item").val() == "2"){
						$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_fname,minLength:mgrcustomer_array_fname.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_phone,minLength:mgrcustomer_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					showMessage("succ", JS_CUSTOMER_INFO, JS_DELETE_SUCC);
				}else if(result.error == -20){
					showMessage("stop", JS_CUSTOMER_INFO, JS_NO_PERMISSION);
				}else if(result.error == -2){
					showMessage("stop", JS_CUSTOMER_INFO, JS_DELETE_ASSET_FIRST);
				}else{
					showMessage("stop", JS_CUSTOMER_INFO, JS_DELETE_FAIL);					
				}
			});
		}catch(e){error(showLoading(false));}
	});
}

function showDelDriver(jobnumber, state){
	locate_table("#driverlist", "jobnumber", jobnumber);
	var WP = window.parent
	var $dlg = $("#dlg_delconfirm");
	$dlg.css("display","block");
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$("body").append("<div class='modalmask'></div>");
	$dlg.find("#close").click(function() {
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
	$dlg.find("#button_ok").click(function() {
		$(this).unbind("click");
		showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
		$dlg.css("display", "none");
		try{
			$.post("manage.driver.ajax.php", {"type":12, "jno": jobnumber, "state": state}, function(data) {
				clearTimeout(timer);
				showLoading(false);
				var result = eval('(' + data + ')');
				if(result.status == 'ok'){
					load2=false;
					//load_mgrdriver();
					var $td = $("#driverlist tbody tr td[jobnumber="+jobnumber+"]");
					var delIdex = parseInt($td.parent().find("td:first-child").text());
					var $trs = $("#driverlist tbody tr");//$td.parent().nextAll();
					$.each($trs, function(idx, value){
						var index = parseInt($(value).find("td:first-child").text());
						if(delIdex < index){
							$(value).find("td:first-child").text(index - 1);
						}		
					});
					
					mgrdriver_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrdriver_array_name),1);
					mgrdriver_array_workid.splice(jQuery.inArray($td.parent().find("td:eq(2)").text(),mgrdriver_array_workid),1);
					mgrdriver_array_phone.splice(jQuery.inArray($td.parent().find("td:eq(5)").text(),mgrdriver_array_phone),1);
					mgrdriver_array_rfid.splice(jQuery.inArray($td.parent().find("td:eq(4)").text(),mgrdriver_array_rfid),1);				
					
					$td.parent().remove();
					//$("#driverlist tbody tr").removeClass("oddcolor");
					//$("#driverlist tbody tr:odd").addClass("oddcolor");
					
					if($("#mgrdriver_item").val() == "1"){
						 $("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_name,minLength:mgrdriver_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrdriver_item").val() == "2"){
						$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_workid,minLength:mgrdriver_array_workid.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrdriver_item").val() == "3"){
						$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_rfid,minLength:mgrdriver_array_rfid.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_phone,minLength:mgrdriver_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					showMessage("succ", JS_DRIVER_INFO, JS_DELETE_SUCC);
				}else if(result.error == -20){
					showMessage("stop", JS_DRIVER_INFO, JS_NO_PERMISSION);
				}else if(result.error == -2){
					showMessage("stop", JS_DRIVER_INFO, JS_DELETE_ASSET_FIRST);
				}else {
					showMessage("stop", JS_DRIVER_INFO, JS_DELETE_FAIL);
				}
			});
		}catch(e){error(showLoading(false));}
	});
}

function loginAsUser(usrid){
	var timezoneOffset = new Date().getTimezoneOffset() / 60 * -1;
	showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try{
		$.post("login.ajax.php?t=" + new Date().getTime(), {"usrid": usrid, "type": 1, "timezone": timezoneOffset}, function(data) {
			clearTimeout(timer);
			showLoading(false);
			if(data.indexOf('ok')>=0){
				window.parent.location.reload(true);
			}
		});
	}catch(e){error(showLoading(false));}	
}

function showDelUser(usrid, state){
	locate_table("#usrlist", "usrid", usrid);
	var WP = window.parent
	var $dlg = $("#dlg_delconfirm");
	$dlg.css("display","block");
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$("body").append("<div class='modalmask'></div>");
	$dlg.find("#close").click(function() {
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
	$dlg.find("#button_ok").click(function() {
		$(this).unbind("click");
		showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
		$dlg.css("display", "none");
		try{
			$.post("manage.ajax.php", {"type":3, "usrid": usrid, "state": state}, function(data) {
				clearTimeout(timer);
				showLoading(false);
				var result = eval('(' + data + ')');
				if(result.status == 'ok'){
					//load1=false;
					load5=false;
					//load_mgraccount();
					var $td = $("#usrlist tbody tr td[usrid="+usrid+"]");
					var delIdex = parseInt($td.parent().find("td:first-child").text());
					var $trs = $("#usrlist tbody tr");//$td.parent().nextAll();
					$.each($trs, function(idx, value){
						var index = parseInt($(value).find("td:first-child").text());
						if(delIdex < index){
							$(value).find("td:first-child").text(index - 1);
						}			
					});
					
					mgraccount_array_uname.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgraccount_array_uname),1);
					mgraccount_array_login.splice(jQuery.inArray($td.parent().find("td:eq(3)").text(),mgraccount_array_login),1);
					mgraccount_array_phone.splice(jQuery.inArray($td.parent().find("td:eq(4)").text(),mgraccount_array_phone),1);
					$td.parent().remove();
					//$("#usrlist tbody tr").removeClass("oddcolor");
					//$("#usrlist tbody tr:odd").addClass("oddcolor");										
					
					if($("#mgraccount_item").val() == "1"){
						 $("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_uname,minLength:mgraccount_array_uname.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgraccount_item").val() == "2"){
						$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_login,minLength:mgraccount_array_login.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_phone,minLength:mgraccount_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					WP.needUpdateUser = true;
					showMessage("succ", JS_USER_INFO, JS_DELETE_SUCC);
				}else if(result.error == -20){
					showMessage("stop", JS_USER_INFO, JS_NO_PERMISSION);
				}else if(result.error == -10){
					showMessage("stop", JS_USER_INFO, JS_DELETE_ASSET_FIRST);
				}
				else {
                    showMessage("stop", JS_USER_INFO, JS_DELETE_FAIL);
                }
			});
		}catch(e){error(showLoading(false));}
	});
}

function showDelObject(objid,gid){
	locate_table("#devlist", "objid", objid);
	var WP = window.parent;
	var $dlg = $("#dlg_delconfirm");
	$dlg.css("display","block");
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$("body").append("<div class='modalmask'></div>");
	$dlg.find("#close").click(function() {
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
	$dlg.find("#button_ok").click(function() {
		$(this).unbind("click");
		showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
		$dlg.css("display", "none");
		try{
			$.post("manage.ajax.php", {"type":5, "objid": objid}, function(data) {
				clearTimeout(timer);
				showLoading(false);
				var result = eval('(' + data + ')');
				if(result.status == 'ok'){
					load7=false;
					load8=false;
					//load_mgrvehicle();
					WP.deleteObject(gid,objid);
					
					var $td = $("#devlist tbody tr td[objid="+objid+"]");
					var delIdex = parseInt($td.parent().find("td:first-child").text());
					var $trs = $("#devlist tbody tr");//$td.parent().nextAll();
					$.each($trs, function(idx, value){
						var index = parseInt($(value).find("td:first-child").text());
						if(delIdex < index){
							$(value).find("td:first-child").text(index - 1);
						}						
					});
					
					mgrvehicle_array_flag.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrvehicle_array_flag),1);
					mgrvehicle_array_deviceid.splice(jQuery.inArray($td.parent().find("td:eq(2)").text(),mgrvehicle_array_deviceid),1);
					mgrvehicle_array_phone.splice(jQuery.inArray($td.parent().find("td:eq(3)").text(),mgrvehicle_array_phone),1);
					
					$td.parent().remove();
					//$("#devlist tbody tr").removeClass("oddcolor");
					//$("#devlist tbody tr:odd").addClass("oddcolor");
					
					if($("#mgrvehicle_item").val() == "1"){
					    $("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_flag,minLength:mgrvehicle_array_flag.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrvehicle_item").val() == "2"){
						$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_deviceid,minLength:mgrvehicle_array_deviceid.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrvehicle_item").val() == "3"){
						$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_phone,minLength:mgrvehicle_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					showMessage("succ", JS_DEVICE_INFO, JS_DELETE_SUCC);
				}else if(result.error == -20){
					showMessage("stop", JS_DEVICE_INFO, JS_NO_PERMISSION);
				}else {
                    showMessage("stop", JS_DEVICE_INFO, JS_DELETE_FAIL);
                }
			});
		}catch(e){error(showLoading(false));}
	});
}

function showEraseHistory(objid){
	locate_table("#devlist", "objid", objid);
	var WP = window.parent;
	var $dlg = $("#dlg_delconfirm");
	$dlg.css("display","block");
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$("body").append("<div class='modalmask'></div>");
	$dlg.find("#close").click(function() {
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
	$dlg.find("#button_ok").click(function() {
		$(this).unbind("click");
		showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
		$dlg.css("display", "none");
		try{
			$.post("manage.ajax.php", {"type":17, "objid": objid}, function(data) {
				clearTimeout(timer);
				showLoading(false);
				var result = eval('(' + data + ')');
				if(result.status == 'ok'){										
					showMessage("succ", JS_DEVICE_INFO, JS_DELETE_SUCC);
				}else if(result.error == -20){
					showMessage("stop", JS_DEVICE_INFO, JS_NO_PERMISSION);
				}else {
                    showMessage("stop", JS_DEVICE_INFO, JS_DELETE_FAIL);
                }
			});
		}catch(e){error(showLoading(false));}
	});
}

function showDelGeo(zid,state){
	locate_table("#placelist", "zid", zid);
	var WP = window.parent;
	var $dlg = $("#dlg_delconfirm");
	$dlg.css("display","block");
	$dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 3 * 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px");
	$dlg.append("<span id='close' class='dialog_cancel'></span>");
	$("body").append("<div class='modalmask'></div>");
	$dlg.find("#close").click(function() {
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
	$dlg.find("#button_ok").click(function() {
		$(this).unbind("click");
		showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
		$dlg.css("display", "none");
		try{
			$.post("manage.ajax.php", {"type":7, "zid": zid, "state": state,}, function(data) {
				clearTimeout(timer);
				showLoading(false);
				var result = eval('(' + data + ')');
				if(result.status == 'ok'){
					load7=false;
					//load_mgrgeo();
					WP.deletePlace(zid);
					var $td = $("#placelist tbody tr td[zid="+zid+"]");
					var delIdex = parseInt($td.parent().find("td:first-child").text());
					var $trs = $("#placelist tbody tr");//$td.parent().nextAll();
					$.each($trs, function(idx, value){
						var index = parseInt($(value).find("td:first-child").text());
						if(delIdex < index){
							$(value).find("td:first-child").text(index - 1);
						}		
					});
					
					mgrplace_array_name.splice(jQuery.inArray($td.parent().find("td:eq(1)").text(),mgrplace_array_name),1);
					
					$td.parent().remove();
					//$("#placelist tbody tr").removeClass("oddcolor");
					//$("#placelist tbody tr:odd").addClass("oddcolor");
					
					$("#mgrplace_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrplace_array_name,minLength:mgrplace_array_name.length < 2000 ? 0:2,max:10,scroll:true});				
					
					WP.needUpdatePlace = true;
					showMessage("succ", JS_GEO_INFO, JS_DELETE_SUCC);
				}else if(result.error == -20){
					showMessage("stop", JS_GEO_INFO, JS_NO_PERMISSION);
				}else {
                    showMessage("stop", JS_GEO_INFO, JS_DELETE_FAIL);
                }
			});
		}catch(e){error(showLoading(false));}
	});
}

function showAddGroup() {
    var p = $("#usr_group").getCurrentNode();
    if(p==null){
        showMessage("info", JS_GROUP_INFO, JS_GROUP_PARENT_TIP);
        return;
    }
    var $dlg = $("#dlg_newgroup");
    $dlg.find(".must").remove("invalidbox");
	$dlg.find("#parent").show();
	$dlg.find("#parent_edit").hide();
    $dlg.find("#parent").text(" ["+p.text+"]");
	$dlg.find("#group_text").val("");
    $dlg.css("display", "block");
    $("body").append("<div class='modalmask'></div>");
    $dlg.append("<span id='close' class='dialog_cancel'></span>");
    $dlg.find("#close").click(function() {
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_ok").click(function() {
        var mustok = true;
        $dlg.find(".must").each(function(){
            if($(this).val()=="" || $(this).val()==null){
                $(this).addClass("invalidbox");
                mustok = false;
            }else{
                $(this).removeClass("invalidbox");
            }
        });
        if(!mustok)return;
        $(this).unbind("click");
        showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
        var pid = $("#usr_group").getCurrentNode();
        var req = {
            "group": $dlg.find("#group_text").val(),
            "parent": pid != null ? pid.value : 0
        }
        $dlg.css("display", "none");
        try{
            $.get("groupadd.ajax.php", req, function(data) {
                clearTimeout(timer);
				showLoading(false);
                var result = eval('(' + data + ')');
				if(result.status == 'no parent group'){
					showMessage("stop", JS_GROUP_INFO, JS_NO_GROUP_PARENT);
				} else if (result.status == 'ok') {
                    dev_group = result.group;
                    $("#ginfo").empty();                    
                    if(dev_group!=null)
                    for(i = 0; i< dev_group.length; i++){
                        var g = dev_group[i];
                        $item = $("<option></option>").appendTo("#ginfo");
                        $item.attr("value", g.id);
                        $item.text(g.name);
                    }
                    $(".modalmask").remove();
                    showMessage("succ", JS_GROUP_INFO, JS_CREATE_SUCC);
                    
                    load_groups(current_userid, false, $("#serach_gname").val());
                } else if(result.error == -20){
					showMessage("stop", JS_GROUP_INFO, JS_NO_PERMISSION);
				} else {
                    showMessage("stop", JS_GROUP_INFO, JS_CREATE_FAIL);
                }
            });
        }catch(e){error(showLoading(false));}
    });
    $dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px")
}



function showAddCustomer() {
    var $dlg = $("#dlg_newcustomer");    
    $dlg.css("display", "block");
    $dlg.find(".must").remove("invalidbox");
    $("body").append("<div class='modalmask'></div>");
    $dlg.append("<span id='close' class='dialog_cancel'></span>");
    $dlg.find("#close").click(function() {
        $dlg.css("display", "none");
        $(this).remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_cancel").click(function(){
		$dlg.find("#button_ok").unbind("click");
        $dlg.css("display", "none");
		$dlg.find("#close").remove();
        $(".modalmask").remove()
    });
    $dlg.find("#button_ok").click(function() {
        var mustok = true;
        $dlg.find(".must").each(function(){
            if($(this).val()=="" || $(this).val()==null){
                $(this).addClass("invalidbox");
                mustok = false;
            }else{
                $(this).removeClass("invalidbox");
            }
        });
        if(!mustok)return;
        $(this).unbind("click");
        showLoading(true);
		var timer = setTimeout("showLoading(false,true)", requestTimeout);
        try{
            var req = {
                "sname": $("#short_name").val(),
                "fname": $("#full_name").val(),
                "phone": $("#cust_phone").val(),
                "remark": $("#cust_remark").val()
            }
            $dlg.css("display", "none");
            $.get("customer.ajax.php", req, function(data) {
                clearTimeout(timer);
				showLoading(false);
                var result = eval('(' + data + ')');
                if (result.status == 'ok') {
                    dev_cust = result.custlist;
                    //customer list
                    $("#cinfo").empty();
                    for(var i = 0; i< dev_cust.length; i++){
                        var c = dev_cust[i];
                        var $item = $("<option></option>").appendTo("#cinfo");
                        $item.attr("value", c.id);
                        $item.text(c.name);
                    }
                    $("#cinfo").val(result.custid);
                    $(".modalmask").remove();
                    $dlg.find(".itext,.icontent").val("");
                    showMessage("succ", JS_CUSTOMER_INFO, JS_CREATE_SUCC);
                } else if(result.error == -20){
					showMessage("stop", JS_CUSTOMER_INFO, JS_NO_PERMISSION);
				} else {
                    showMessage("stop", JS_CUSTOMER_INFO, JS_CREATE_FAIL);
                }
            });
        }catch(e){error(showLoading(false));}
    });
    $dlg.css("top", Math.round(document.body.clientHeight / 2 - $dlg.height() / 2) + "px");
    $dlg.css("left", Math.round(document.body.clientWidth / 2 - $dlg.width() / 2) + "px")
}

function usrstate(state, self){
	$("#luname,#uname,#lvalid,#valid,#lolimit,#olimit").css("display", "inline");
	$("#valid").css("display","inline");
	selectreport.disable();
	if(state > 0){
        $("#usr_edit label").removeClass("noedit").addClass("edit");
        $("#usr_edit .itext,#usr_edit, #valid, #rmail").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
        $("#uname,#login,#upass,#valid,#olimit").removeClass("enablebox").addClass("must");
        $("#usr_upass").css("display", "block");
		
        //button state change
        $("#usr_operat").css("display", "block");
        if(state == 1){
            //new
            $("#usr_tips").val(JS_APPEND_MODE);
            $("#usr_addnew").attr("disabled",true);            
            $("#usr_update").css("display", "none");
            $("#usr_save").css("display", "block").removeAttr("disabled");     
			
			/*email report purview*/
			if(isEmailPurview(purview_user_manager)){
				$("#usr_edit li.emailopt label").removeClass().addClass("edit");
				$("#usr_edit li.emailopt .itext").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
				$("#rmail,#selectreport").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
				selectreport.enable();
			}else{
				$("#usr_edit li.emailopt label").removeClass().addClass("noedit");
				$("#usr_edit li.emailopt .itext").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
				$("#rmail,#selectreport").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
				selectreport.disable();

			}
        }else{
            //modify
            $("#usr_tips").val(JS_MODIFY_MODE);
            $("#luname,#uname,#usr_save").css("display", "none");
            $("#usr_update").css("display", "block").removeAttr("disabled");
			
			if(self != null && typeof self != "undefined" && self == true){
				$("#lvalid,#lolimit,#valid,#olimit").css("display", "none");
			}else{
				$("#lvalid,#lolimit,#valid,#olimit").css("display", "inline");
				$("#valid").css("display","inline");
			}
			/*email report purview*/
			if(isEmailPurview(purview_user_manager)){
				$("#usr_edit li.emailopt label").removeClass().addClass("edit");
				$("#usr_edit li.emailopt .itext").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
				$("#rmail,#selectreport").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
				selectreport.enable();
			}else{
				$("#usr_edit li.emailopt label").removeClass().addClass("noedit");
				$("#usr_edit li.emailopt .itext").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
				$("#rmail,#selectreport").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
				selectreport.disable();
			}
        }
        $("#usr_cancel").removeAttr("disabled");
    }else{
        $("#usr_edit label").removeClass("edit").addClass("noedit");
        $("#usr_edit .itext,#usr_edit, #valid, #rmail").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
        $("#uname,#login,#upass,#valid,#olimit").removeClass("invalidbox").removeClass("must");
        $("#usr_upass").css("display", "none");
        $("#usr_operat").css("display", "none");
        $("#usr_tips").val(JS_BROWSE_MODE);
        $("#usr_addnew").removeAttr("disabled");	
    }
    $("#usr_edit").scrollTop(0);
}

function purstate(state, self){
    //modify
	if(state == 1){
		if(self != null && typeof self != "undefined" && self == true){
			$("#purview_edit .icheck").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
			$("#purview_edit label").removeClass("edit").addClass("noedit");
			//button state change
			$("#purview_operat").css("display", "none");
		}else{
			$("#purview_edit .icheck").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
			$("#purview_edit label").removeClass("noedit").addClass("edit");
			//button state change
			$("#purview_operat").css("display", "block");
		}
        $("#purview_update,#purview_cancel").removeAttr("disabled");
    }else{
		//view
        $("#purview_edit .icheck").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
		$("#purview_operat").css("display", "none");
		$("#purview_edit label").removeClass("edit").addClass("noedit");
		//button state change
    }
    $("#usr_edit").scrollTop(0);
}

function purviewview(usrid, state, self){
    locate_table("#pusrlist", "usrid", usrid);
	current_userid = usrid;
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    try{
        $.get("purview.ajax.php", {"type":1, "usrid":usrid, "etype":self ?  2 : 3}, function(data) {
            clearTimeout(timer);
			showLoading(false);
			purstate(state, self);
            var json = eval('(' + data + ')');
			if(json != null && typeof json != "undefined"){
				$("#purview_edit .icheck").prop("checked", false);
				var pur = json.pur;
				if(pur != null){
					var purviewSub = [];

					//Sub user purview
					if(pur.length >0){
						for(var i=0;i<pur.length;i++){
							purviewSub[pur[i].pid] = pur[i].p;
						}
					}
					/*Account Management*/					
					if(purviewSub[3200] != null){
						//Add
						if(purviewSub[3200].indexOf("A") != -1){
							$("#account_add").prop("checked", true);
						}else{
							$("#account_add").prop("checked", false);
						}
						//Modify
						if(purviewSub[3200].indexOf("M") != -1){
							$("#account_eidt").prop("checked", true);
						}else{
							$("#account_eidt").prop("checked", false);
						}
						//Delete
						if(purviewSub[3200].indexOf("D") != -1){
							$("#account_delete").prop("checked", true);
						}else{
							$("#account_delete").prop("checked", false);
						}
						//Email
						if(purviewSub[3200].indexOf("R") != -1){
							$("#account_email").prop("checked", true);
						}else{
							$("#account_email").prop("checked", false);
						}
					}else{
						$("#p_3000 .icheck").prop("checked", false);
					}
					
					/*Asset Management*/	
					if(purviewSub[1090] != null){
						//Add
						if(purviewSub[1090].indexOf("A") != -1){
							$("#asset_add").prop("checked", true);
						}else{
							$("#asset_add").prop("checked", false);
						}
						//Modify
						if(purviewSub[1090].indexOf("M") != -1){
							$("#asset_edit").prop("checked", true);
						}else{
							$("#asset_edit").prop("checked", false);
						}
						//Delete
						if(purviewSub[1090].indexOf("D") != -1){
							$("#asset_delete").prop("checked", true);
						}else{
							$("#asset_delete").prop("checked", false);
						}
						//Expired
						if(purviewSub[1090].indexOf("E") != -1){
							$("#asset_expired").prop("checked", true);
						}else{
							$("#asset_expired").prop("checked", false);
						}
					}else{
						$("#p_1000 .icheck").prop("checked", false);
					}
					
					/*Customer Management*/	
					if(purviewSub[2100] != null){
						//Add
						if(purviewSub[2100].indexOf("A") != -1){
							$("#cust_add").prop("checked", true);
						}else{
							$("#cust_add").prop("checked", false);
						}
						//Modify
						if(purviewSub[2100].indexOf("M") != -1){
							$("#cust_edit").prop("checked", true);
						}else{
							$("#cust_edit").prop("checked", false);
						}
						//Delete
						if(purviewSub[2100].indexOf("D") != -1){
							$("#cust_delete").prop("checked", true);
						}else{
							$("#cust_delete").prop("checked", false);
						}
					}else{
						$("#p_2100 .icheck").prop("checked", false);
					}
					
					/*Driver Management*/	
					if(purviewSub[1300] != null){
						//Add
						if(purviewSub[1300].indexOf("A") != -1){
							$("#driver_add").prop("checked", true);
						}else{
							$("#driver_add").prop("checked", false);
						}
						//Modify
						if(purviewSub[1300].indexOf("M") != -1){
							$("#driver_modify").prop("checked", true);
						}else{
							$("#driver_modify").prop("checked", false);
						}
						//Delete
						if(purviewSub[1300].indexOf("D") != -1){
							$("#driver_delete").prop("checked", true);
						}else{
							$("#driver_delete").prop("checked", false);
						}
					}else{
						$("#p_1300 .icheck").prop("checked", false);
					}
					
					/*Place Management*/	
					if(purviewSub[1700] != null){
						//Add
						if(purviewSub[1700].indexOf("A") != -1){
							$("#place_add").prop("checked", true);
						}else{
							$("#place_add").prop("checked", false);
						}
						//Modify
						if(purviewSub[1700].indexOf("M") != -1){
							$("#place_modify").prop("checked", true);
						}else{
							$("#place_modify").prop("checked", false);
						}
						//Delete
						if(purviewSub[1700].indexOf("D") != -1){
							$("#place_delete").prop("checked", true);
						}else{
							$("#place_delete").prop("checked", false);
						}
					}else{
						$("#p_1700 .icheck").prop("checked", false);
					}
					
					/*Task Management*/	
					if(purviewSub[1800] != null){
						//Add
						if(purviewSub[1800].indexOf("A") != -1){
							$("#task_add").prop("checked", true);
						}else{
							$("#task_add").prop("checked", false);
						}
						//Modify
						if(purviewSub[1800].indexOf("M") != -1){
							$("#task_modify").prop("checked", true);
						}else{
							$("#task_modify").prop("checked", false);
						}
						//Delete
						if(purviewSub[1800].indexOf("D") != -1){
							$("#task_delete").prop("checked", true);
						}else{
							$("#task_delete").prop("checked", false);
						}
					}else{
						$("#p_1800 .icheck").prop("checked", false);
					}
					
					/*Expense Management*/	
					if(purviewSub[1900] != null){
						//Add
						if(purviewSub[1900].indexOf("A") != -1){
							$("#expense_add").prop("checked", true);
						}else{
							$("#expense_add").prop("checked", false);
						}
						//Modify
						if(purviewSub[1900].indexOf("M") != -1){
							$("#expense_modify").prop("checked", true);
						}else{
							$("#expense_modify").prop("checked", false);
						}
						//Delete
						if(purviewSub[1900].indexOf("D") != -1){
							$("#expense_delete").prop("checked", true);
						}else{
							$("#expense_delete").prop("checked", false);
						}
					}else{
						$("#p_1900 .icheck").prop("checked", false);
					}
					
					/*User Access Manager*/
					if(purviewSub[3300] != null && purviewSub[3300].indexOf("S") != -1){					
						//Save
						$("#access_edit").prop("checked", true);
					}else{
						$("#access_edit").prop("checked", false);
					}
					
					/*User Vehicle Group*/
					if(purviewSub[3400] != null && purviewSub[3400].indexOf("S") != -1){				
						//Save
						$("#group_edit").prop("checked", true);
					}else{
						$("#group_edit").prop("checked", false);
					}
					
					/*User Command*/
					if(purviewSub[3500] != null && purviewSub[3500].indexOf("S") != -1){				
						//Save
						$("#cmd_edit").prop("checked", true);
					}else{
						$("#cmd_edit").prop("checked", false);
					}
				}
				$("#usr_cmd").empty();
				var otree = {showcheck: true, theme:"bbit-tree-lines"};
				otree.data = json.cmds;
				$("#usr_cmd").treeview(otree);
			
			}else{
				showMessage("stop", JS_PURVIEW_INFO, JS_NOT_EXIST);
			}
        });
    }catch(e){error(showLoading(false));}
}

function purviewsubmit(pid, p , parntid){
	$("#purview_update").attr("disabled",true);
	$("#purview_cancel").css("display","none");
	var p = $("#usr_cmd").getCheckedNodes();
	var checkcmd = p==null?"":p.join(";");

	var opts = {"type": 2,
				"pur": getCurrentPurview(),
				"usrid": current_userid,
				"cmds": checkcmd + ";"
			   };
	showLoading(true);
	var timer = setTimeout(function(){
						   $("#purview_update").removeAttr("disabled");
						   $("#purview_cancel").css("display","block");
						   purstate(0);
						   showLoading(false,true)}, requestTimeout);
	try{
		$.get("purview.ajax.php", opts, function(data){
			clearTimeout(timer);
			showLoading(false);
			$("#purview_update").removeAttr("disabled");
			$("#purview_cancel").css("display","block");
			var result = eval('(' + data + ')');
			
			if (result.status == 'ok') {
				purstate(0);
				showMessage("succ", JS_PURVIEW_INFO, JS_UPDATE_SUCC);
			} else if(result.error == -20){
				showMessage("stop", JS_PURVIEW_INFO, JS_NO_PERMISSION);
			} else{
				$("#nikname,#fullname").addClass("invalidbox").focus();
				showMessage("stop", JS_PURVIEW_INFO + JS_UPDATE_FAIL, JS_ERROR_TIP);
			}
		});
	}catch(e){showLoading(false);}
}

function getCurrentPurview(){
	var purview_account = "";
	var purview_asset = "";
	var purview_customer = "";
	var purview_driver = "";
	var purview_place = "";
	var purview_task = "";
	var purview_expense = "";
	var isPurview = false;
	
	/*Account Management*/
	var display = $('#p_3000').css('display');
	
	if(display != 'none'){
		/*User Manager*/
		purview_account =  "3000:" + ";" + purview_account;
		purview_account = purview_account + "3200:";
		
		if($("#account_add").prop("checked")){
			purview_account = purview_account + "A"
			isPurview = true;
		}
		if($("#account_eidt").prop("checked")){
			purview_account = purview_account + "M"
			isPurview = true;
		}
		if($("#account_delete").prop("checked")){
			purview_account = purview_account + "D"
			isPurview = true;
		}
		if($("#account_email").prop("checked")){
			purview_account = purview_account + "R"
			isPurview = true;
		}
		purview_account = purview_account + ";";
		
		/*User Access Manager*/
		purview_account = purview_account + "3300:";
		if($("#access_edit").prop("checked")){	
			purview_account = purview_account + "S"
			isPurview = true;
		}
		purview_account = purview_account + ";";
		
		/*User Vehicle Group*/
		purview_account = purview_account + "3400:";
		if($("#group_edit").prop("checked")){
			purview_account = purview_account + "S"
			isPurview = true;
		}
		purview_account = purview_account + ";";
		
		/*User Command*/
		purview_account = purview_account + "3500:";
		if($("#cmd_edit").prop("checked")){
			purview_account = purview_account + "S"
			isPurview = true;
		}
		purview_account = purview_account + ";";
		
		/*if no purview ignore*/
		if(!isPurview){
			purview_account = "";
		}
	}
	
	/*Asset Management*/
	display = $('#p_1000').css('display');
	if(display != 'none'){
		isPurview = false;
		purview_asset = purview_asset + "1000:" + ";";
		
		purview_asset = purview_asset + "1090:";
		if($("#asset_add").prop("checked")){
			purview_asset = purview_asset + "A"
			isPurview = true;
		}
		if($("#asset_edit").prop("checked")){
			purview_asset = purview_asset + "M"
			isPurview = true;
		}
		if($("#asset_delete").prop("checked")){
			purview_asset = purview_asset + "D"
			isPurview = true;
		}
		if($("#asset_expired").prop("checked")){
			purview_asset = purview_asset + "E"
			isPurview = true;
		}
		purview_asset = purview_asset + ";";
		
		/*if no purview ignore*/
		if(!isPurview){
			purview_asset = "1000:" + ";";
		}
	
		/*Driver Management*/
		isPurview = false;
		purview_driver = purview_driver + "1300:";
		
		if($("#driver_add").prop("checked")){
			purview_driver = purview_driver + "A"
			isPurview = true;
		}
		if($("#driver_modify").prop("checked")){
			purview_driver = purview_driver + "M"
			isPurview = true;
		}
		if($("#driver_delete").prop("checked")){
			purview_driver = purview_driver + "D"
			isPurview = true;
		}
		purview_driver = purview_driver + ";";
		
		/*if no purview ignore*/
		if(!isPurview){
			purview_driver = "";
		}
		
		/*Place Management*/
		isPurview = false;
		purview_place = purview_place + "1700:";
		if($("#place_add").prop("checked")){
			purview_place = purview_place + "A"
			isPurview = true;
		}
		if($("#place_modify").prop("checked")){
			purview_place = purview_place + "M"
			isPurview = true;
		}
		if($("#place_delete").prop("checked")){
			purview_place = purview_place + "D"
			isPurview = true;
		}
		purview_place = purview_place + ";";
		
		/*if no purview ignore*/
		if(!isPurview){
			purview_place = "";
		}
		
		/*Task Management*/
		isPurview = false;
		purview_task = purview_task + "1800:";
		if($("#task_add").prop("checked")){
			purview_task = purview_task + "A"
			isPurview = true;
		}
		if($("#task_modify").prop("checked")){
			purview_task = purview_task + "M"
			isPurview = true;
		}
		if($("#task_delete").prop("checked")){
			purview_task = purview_task + "D"
			isPurview = true;
		}
		purview_task = purview_task + ";";
		
		/*if no purview ignore*/
		if(!isPurview){
			purview_task = "";
		}
		
		/*Expense Management*/
		isPurview = false;
		purview_expense = purview_expense + "1900:";
		if($("#expense_add").prop("checked")){
			purview_expense = purview_expense + "A"
			isPurview = true;
		}
		if($("#expense_modify").prop("checked")){
			purview_expense = purview_expense + "M"
			isPurview = true;
		}
		if($("#expense_delete").prop("checked")){
			purview_expense = purview_expense + "D"
			isPurview = true;
		}
		purview_expense = purview_expense + ";";
		
		/*if no purview ignore*/
		if(!isPurview){
			purview_expense = "";
		}
	}
	
	/*Customer Management*/
	display = $('#p_2100').css('display');
	if(display != 'none'){
		isPurview = false;
		purview_customer = purview_customer + "2000:" + ";";
		
		purview_customer = purview_customer + "2100:";
		if($("#cust_add").prop("checked")){
			purview_customer = purview_customer + "A"
			isPurview = true;
		}
		if($("#cust_edit").prop("checked")){
			purview_customer = purview_customer + "M"
			isPurview = true;
		}
		if($("#cust_delete").prop("checked")){
			purview_customer = purview_customer + "D"
			isPurview = true;
		}
		purview_customer = purview_customer + ";";
		
		/*if no purview ignore*/
		if(!isPurview){
			purview_customer = "";
		}
	}
					
	return purview_account + purview_asset + purview_customer + purview_driver + purview_place + purview_task + purview_expense;
}

function usrview(usrid, state, self){
    locate_table("#usrlist", "usrid", usrid);
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    try{
        $.post("manage.ajax.php", {"type":1, "usrid":usrid}, function(data) {            
            clearTimeout(timer);
			var json = eval('(' + data + ')');
            if(json != null && typeof json != "undefined" && json.length == 1){
                var jo = json[0];
                usrstate(state, self);
                current_userid = jo.usrid;
                $("#usrid").val(jo.usrid);
                $("#uname").val(jo.uname);
                $("#upass").val(jo.upass);
                $("#login").val(jo.login);
                $("#email").val(jo.email);
                $("#rtime").val(jo.rtime);
                $("#rmail").prop("checked", jo.rmail==1);
                $("#valid").prop("checked", jo.valid==1);
				$("#uphone").val(jo.uphone);
				$("#olimit").val(jo.olimit);
                $("#usr_group").empty();
				
				if(jo.mtype != null){
					selectreport.setValue(jo.mtype.split(','));
				}
                load_groups(current_userid, state == 2 && !self, $("#serach_gname").val());
            }else{
				showMessage("stop", JS_USER_INFO, JS_NOT_EXIST);
			}
        });
    }catch(e){error(showLoading(false));}
}

function usrsubmit(state){
    var mustok = true;
    $("#usr_edit .must").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
    var p = $("#usr_group").getCheckedNodes();
    var matchArray;
    //check email
    var emailStr = $("#email").val();
    if(emailStr != ""){
        var emails = emailStr.split(";");        
        for(var i=0;i<emails.length;i++){
            var emailPat = /^(.+)@(.+)$/;
            matchArray = emails[i].match(emailPat);
            if (matchArray == null) {
                $("#email").addClass("invalidbox").focus();
                mustok = false;
                break;
            }else{
				$("#email").removeClass("invalidbox");
			}
        }
    }
    var rtime = $("#rtime").val();
    if(rtime != ""){
        matchArray = rtime.match(/^(\d{2}):(\d{2})/);
        if (matchArray == null || (matchArray.length == 3 && (parseInt(matchArray[1]) > 23 || parseInt(matchArray[2]) > 59))) {
            $("#rtime").addClass("invalidbox").focus();
            mustok = false;
        }else{
			$("#rtime").removeClass("invalidbox");
		}
    }
	var olimit = $("#olimit").val();
	if(olimit != ""){
		var intPat = /^([1-9]\d*|[0]{1,1})$/;
		matchArray = olimit.match(intPat);
		if (matchArray == null) {
			$("#olimit").addClass("invalidbox").focus();
			mustok = false;
		}else{
			$("#olimit").removeClass("invalidbox");
		}
	}
    if(!mustok)return;
    $("#email,#rtime").removeClass("invalidbox");
	var self = 0;
	var display = $('#valid').css('display');
	if(display == 'none'){
		self = 1;
	}
	
    var opts = {"type": 3, "state": state,
        "usrid": current_userid,
        "uname": $("#uname").val(),
        "login": $("#login").val(),
        "upass": $("#upass").val(),
        "email": $("#email").val(),
        "rtime": $("#rtime").val(),
        "rmail": $("#rmail").prop("checked") ? 1 : 0,
		"mtype": $("#selectreport").val() == null ? "" : $("#selectreport").val().join(),
        "valid": $("#valid").prop("checked") ? 1 : 0,
		"uphone": $("#uphone").val(),
		"olimit": $("#olimit").val(),
        "group": p==null?"":p.join(","),
		"self": self
    };
    if(state==1){
        $("#usr_save").attr("disabled",true);
    }else{
        $("#usr_update").attr("disabled",true);
    }
    $("#usr_cancel").css("display","none");
    showLoading(true);
	var timer = setTimeout(function(){
							$("#usr_save,#usr_update").removeAttr("disabled");
						    $("#usr_cancel").css("display","block");
							usrstate(0);
							showLoading(false,true)}, requestTimeout);
		
	try{
        $.post("manage.ajax.php", opts, function(data){
			clearTimeout(timer);
			showLoading(false);
            $("#usr_save,#usr_update").removeAttr("disabled");
            $("#usr_cancel").css("display","block");
            var result = eval('(' + data + ')');
            if (result.status == 'ok') {
                usrstate(0);
                var str = "#usrlist tbody tr td[usrid='"+opts.usrid+"']";
                var $td = $(str);
                if($td.length > 0){
                    var $tr = $td.parent();
					
					mgraccount_array_uname.splice($.inArray($tr.find('td:eq(1)').text(),mgraccount_array_uname),1);
					mgraccount_array_login.splice($.inArray($tr.find('td:eq(3)').text(),mgraccount_array_login),1);
					mgraccount_array_phone.splice($.inArray($tr.find('td:eq(4)').text(),mgraccount_array_phone),1);
					
                    $tr.find('td:eq(1)').text(opts.uname);
                    if(opts.valid==1){
                        $tr.find('td:eq(2)').removeClass("stopped").addClass("valid").attr("data-sort",opts.valid);
                    }else{
                        $tr.find('td:eq(2)').removeClass("valid").addClass("stopped").attr("data-sort",opts.valid);
                    }
                    $tr.find('td:eq(3)').text(opts.login).attr("login", opts.login);
					$tr.find('td:eq(4)').text(opts.uphone).attr("phone", opts.uphone);
					$tr.find('td:eq(5)').text(opts.olimit);
					
					mgraccount_array_uname.push(opts.uname);
                    mgraccount_array_login.push(opts.login);
					mgraccount_array_phone.push(opts.uphone);
					
					if($("#mgraccount_item").val() == "1"){
						 $("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_uname,minLength:mgraccount_array_uname.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgraccount_item").val() == "2"){
						$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_login,minLength:mgraccount_array_login.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_phone,minLength:mgraccount_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}
                }else{
                    //load1=false;
                    //load_mgraccount(opts.login);
					var $tbody = $("#usrlist tbody");
					if($tbody.length == 0){
						$tbody = $("<tbody></tbody>").appendTo($("#usrlist"));
					}
					mgraccount_array_uname.push(opts.uname);
                    mgraccount_array_login.push(opts.login);
					mgraccount_array_phone.push(opts.uphone);
                    var $tr = $("<tr></tr>").appendTo($tbody);
                    $("<td></td>").text($tbody.find("tr").size()).attr("usrid", result.uid).appendTo($tr);
                    $("<td></td>").text(opts.uname).attr("uname", opts.uname).appendTo($tr);
                    var $td = $("<td data-sort="+opts.valid+"></td>").appendTo($tr);
                    if(opts.valid==1){
                        $td.removeClass().addClass("valid");
                    }else{
                        $td.removeClass().addClass("stopped");
                    }
                    $("<td></td>").text(opts.login).attr("login", opts.login).appendTo($tr);
					$("<td></td>").text(opts.uphone).attr("phone", opts.uphone).appendTo($tr);
					$("<td></td>").text(opts.olimit).appendTo($tr);
                    $td = $("<td></td>").appendTo($tr);
                    var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"usrview('"+result.uid+"',0)\"></a>";
                    $(str).attr("href","#").addClass("operate_view").appendTo($td);

					if(isModPurview(purview_user_manager)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"usrview('"+result.uid+"',2,false)\"></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);
					}
					
					if(isDelPurview(purview_user_manager)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelUser('"+result.uid+"', 3)\"></a>";
						$(str).attr("href","#").addClass("operate_delete").appendTo($td);
					}
					
					if(self == 0){
						str = "<a style='padding-left: 20px; margin-left: 10px;' title='"+JS_BUTTON_LOGIN_AS_USER+"' onclick=\"loginAsUser('"+result.uid+"')\"></a>";
						$(str).attr("href","#").addClass("operate_login_as_user").appendTo($td);
					}
                				
					//$("#usrlist tbody tr").removeClass("oddcolor");
					//$("#usrlist tbody tr:odd").addClass("oddcolor");
					if($("#mgraccount_item").val() == "1"){
						 $("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_uname,minLength:mgraccount_array_uname.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgraccount_item").val() == "2"){
						$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_login,minLength:mgraccount_array_login.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_phone,minLength:mgraccount_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					if(typeof opts.login != "undefined"){
						locate_table("#usrlist", "login", opts.login, true);
					}
                }
				load5 = false;
				var WP = window.parent;
				WP.needUpdateUser = true;
                showMessage("succ", JS_USER_INFO, opts.state == 1 ? JS_SAVE_SUCC : JS_UPDATE_SUCC);
                //OK
            }else{
                if(result.error == -1){
					$("#login").addClass("invalidbox").focus();
                    showMessage("stop", JS_USER_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
                }else if(result.error == -6){
					$("#olimit").addClass("invalidbox").focus();
					showMessage("stop", JS_USER_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_EXCEED_CAR);
				} else if(result.error == -20){
					showMessage("stop", JS_USER_INFO, JS_NO_PERMISSION);
				} else{
					$("#login").addClass("invalidbox").focus();
                    showMessage("stop", JS_USER_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
                }
            }
        });
    }catch(e){error(showLoading(false));}
}

function devfill(){
    var $item;
    var i;
    //customer list
	var last_cust = $('#cinfo').val();
    $("#cinfo").empty();
	if(dev_cust != null)
	for(i = 0; i< dev_cust.length; i++){
		var c = dev_cust[i];
		$item = $("<option></option>").appendTo("#cinfo");
		$item.attr("value", c.id);
		$item.text(c.name);
	}
	if(last_cust != null && typeof last_cust != "undefined"){
		$("#cinfo").val(last_cust);
	}
	    
    //group list
	var last_grop = $('#ginfo').val();
    $("#ginfo").empty();
    if(dev_group!=null)
    for(i = 0; i< dev_group.length; i++){
        var g = dev_group[i];
        $item = $("<option></option>").appendTo("#ginfo");
        $item.attr("value", g.id);
        $item.text(g.name);
    }
	if(last_grop != null && typeof last_grop != "undefined"){
		$("#ginfo").val(last_grop);
	}
	
    //type list
	var last_type = $('#dtype').val();
    $("#dtype").empty();
    if(dev_type!=null)
    for(i = 0; i< dev_type.length; i++){
        var t = dev_type[i];
        $item = $("<option></option>").appendTo("#dtype");
        $item.attr("value", t.id);
        $item.text(t.name);
    } 
	if(last_type != null && typeof last_type != "undefined"){
		$("#dtype").val(last_type);	
	}
    /*kind list
    $("#okind").empty();
    if(dev_kind!=null)
    for(i = 0; i< dev_kind.length; i++){
        var k = dev_kind[i];
        $item = $("<option></option>").appendTo("#okind");
        $item.attr("value", k.id);
        $item.text(k.name);
    }*/
	//driver list
	var last_driv = $('#dlist').val();
	$("#dlist").empty();
	$item = $("<option></option>").appendTo("#dlist");
	$item.attr("value", "-1");
	$item.text(INFO_AUTO_ASSIGN);
		
    if(dev_driver!=null)
    for(i = 0; i< dev_driver.length; i++){
        var k = dev_driver[i];
        $item = $("<option></option>").appendTo("#dlist");
        $item.attr("value", k.jb);
        $item.text(k.jn);
    }
	if(last_driv != null && typeof last_driv != "undefined"){
		$("#dlist").val(last_driv);	
	}
	
	//device status
	var last_status = $('#dstate').val();
	$("#dstate").empty();
	$item = $("<option></option>").appendTo("#dstate");
	$item.attr("value", "0");
	$item.text(INFO_DEVICE_STATUS_NORMAL);
	
	$item = $("<option></option>").appendTo("#dstate");
	$item.attr("value", "1");
	$item.text(INFO_DEVICE_STATUS_IN_REPAIR);
	if(last_status != null && typeof last_status != "undefined"){
		$("#dstate").val(last_status);	
	}
	
}

function geofill(){
	array_atype = new Object();
	array_atype[1] = JS_CIRCLE;
	array_atype[2] = JS_RECTANGLE;
	array_atype[3] = JS_POLYGON;
	array_atype[4] = JS_MARKER;
	array_atype[5] = JS_POLYLINE;
	
	array_rptype = new Object();
	array_rptype[1] = JS_INGEOALARM;
	array_rptype[2] = JS_OUTGEOALARM;
	array_rptype[3] = JS_BOTHGEOALARM;
}

function driverfill(){
	$("#sex").empty();
	$item = $("<option></option>").appendTo("#sex");
	$item.attr("value", 0);
	$item.text(JS_FEMALE);
	
	$item = $("<option></option>").appendTo("#sex");
	$item.attr("value", 1);
	$item.text(JS_MALE);
	
	$("#primary").empty();
	$item = $("<option></option>").appendTo("#primary");
	$item.attr("value", 0);
	$item.text(JS_NO);
	
	$item = $("<option></option>").appendTo("#primary");
	$item.attr("value", 1);
	$item.text(JS_YES);
}


function sortRule(a,b) {
    var x = a._text;
    var y = b._text;
    return x.localeCompare(y);
}

function op(){
    var _value;
    var _text;
}

function taskfill(){
	$("#taskpriority").empty();
	$item = $("<option></option>").appendTo("#taskpriority");
	$item.attr("value", 0);
	$item.text(INFO_TASK_PRIORITY_LOW);
	
	$item = $("<option selected='selected'></option>").appendTo("#taskpriority");
	$item.attr("value", 1);
	$item.text(INFO_TASK_PRIORITY_NORMAL);
	
	$item = $("<option></option>").appendTo("#taskpriority");
	$item.attr("value", 2);
	$item.text(INFO_TASK_PRIORITY_HIGHT);
	
	$("#taskstatus").empty();
	$item = $("<option></option>").appendTo("#taskstatus");
	$item.attr("value", 0);
	$item.text(INFO_TASK_STATUS_NEW);
	
	$item = $("<option></option>").appendTo("#taskstatus");
	$item.attr("value", 1);
	$item.text(INFO_TASK_STATUS_IN_PROGRESS);
	
	$item = $("<option></option>").appendTo("#taskstatus");
	$item.attr("value", 2);
	$item.text(INFO_TASK_STATUS_COMPLETED);
	
	$item = $("<option></option>").appendTo("#taskstatus");
	$item.attr("value", 3);
	$item.text(INFO_TASK_STATUS_FAIL);
	
	$("#taskasset").empty();
	var flags = window.parent.JS_DEVICE_FLAG4ID;
    for(var key in flags){
		$item = $("<option></option>").appendTo("#taskasset");
		$item.attr("value", key);
		$item.text(flags[key]);
    }
	//排序
	var obj = document.getElementById("taskasset");
	var tmp = new Array();
	for(var i=0;i<obj.options.length;i++){
	    var ops = new op();
	    ops._value = obj.options[i].value;
	    ops._text = obj.options[i].text;
	    tmp.push(ops);
	}
	tmp.sort(sortRule);
	
	for(var j=0;j<tmp.length;j++){
	    obj.options[j].value = tmp[j]._value;
	    obj.options[j].text = tmp[j]._text;
	}
	
	$("#taskstartp").empty();
	var places = window.parent.JS_PLACE_NAME4ID;
	for(var key in places){
		$item = $("<option></option>").appendTo("#taskstartp");
		$item.attr("value", key);
		$item.text(places[key]);
    }
	//排序
	obj = document.getElementById("taskstartp");
    tmp = new Array();
    for(var i=0;i<obj.options.length;i++){
        var ops = new op();
        ops._value = obj.options[i].value;
        ops._text = obj.options[i].text;
        tmp.push(ops);
    }
    tmp.sort(sortRule);
    for(var j=0;j<tmp.length;j++){
        obj.options[j].value = tmp[j]._value;
        obj.options[j].text = tmp[j]._text;
    }
	
	$("#taskendp").empty();
	for(var key in places){
		$item = $("<option></option>").appendTo("#taskendp");
		$item.attr("value", key);
		$item.text(places[key]);
    }
	//排序
	obj = document.getElementById("taskendp");
    tmp = new Array();
    for(var i=0;i<obj.options.length;i++){
        var ops = new op();
        ops._value = obj.options[i].value;
        ops._text = obj.options[i].text;
        tmp.push(ops);
    }
    tmp.sort(sortRule);
    for(var j=0;j<tmp.length;j++){
        obj.options[j].value = tmp[j]._value;
        obj.options[j].text = tmp[j]._text;
    }
}

function expensefill(){
	$("#expenseasset").empty();
	var flags = window.parent.JS_DEVICE_FLAG4ID;
    for(var key in flags){
		$item = $("<option></option>").appendTo("#expenseasset");
		$item.attr("value", key);
		$item.text(flags[key]);
    }
	//排序
	var obj = document.getElementById("expenseasset");
	var tmp = new Array();
	for(var i=0;i<obj.options.length;i++){
	    var ops = new op();
	    ops._value = obj.options[i].value;
	    ops._text = obj.options[i].text;
	    tmp.push(ops);
	}
	tmp.sort(sortRule);
	
	for(var j=0;j<tmp.length;j++){
	    obj.options[j].value = tmp[j]._value;
	    obj.options[j].text = tmp[j]._text;
	}
	
	var oid = $('#expenseasset option:selected').val();   
	var odometer = getIdValue("A:", getIoById(oid), true);
	var engineHour = getIdValue("11:", getIoById(oid), true);
	$("#expenseodometer").val(odometer == null ? '':mileageUnitConversion(odometer,  window.parent.JS_UNIT_DISTANCE).toFixed(1));
	$("#expenseenghour").val(engineHour);
	
	$('#expenseasset').unbind('change').bind('change',function(){
		var oidc = $('#expenseasset option:selected').val();   
		var odometerc = getIdValue("A:", getIoById(oidc));
		var engineHourc = getIdValue("11:", getIoById(oidc), true);	
		$("#expenseodometer").val(odometerc == null ? '':mileageUnitConversion(odometerc,  window.parent.JS_UNIT_DISTANCE).toFixed(1));
		$("#expenseenghour").val(engineHourc);
	});
}


function eventfill(){	
	$("#event_place").empty();
	var places = window.parent.JS_PLACE_NAME4ID;
	for(var key in places){
		$item = $("<option></option>").appendTo("#event_place");
		$item.attr("value", key);
		$item.text(places[key]);
	}
	//排序
	obj = document.getElementById("event_place");
	tmp = new Array();
	for(var i=0;i<obj.options.length;i++){
		var ops = new op();
		ops._value = obj.options[i].value;
		ops._text = obj.options[i].text;
		tmp.push(ops);
	}
	tmp.sort(sortRule);
	for(var j=0;j<tmp.length;j++){
		obj.options[j].value = tmp[j]._value;
		obj.options[j].text = tmp[j]._text;
	}
	
	$('#event_place').multiselect({
		columns: 3,
		placeholder: JS_SELECT,
		search   : true,
		texts: {
			selectedOptions: JS_SELECTED,
			search: JS_SEARCH,
			selectAll: JS_SELECT_ALL,
			unselectAll: JS_UNSELECT_ALL
		},

		selectAll: true,
		maxPlaceholderWidth: 170,
		maxHeight: 13,
		selectedList:1,
        minWidth:160
		
	});
	
	$("#event_time_daytime_monday_from").empty();
	$("#event_time_daytime_tuesday_from").empty();
	$("#event_time_daytime_wednesday_from").empty();
	$("#event_time_daytime_thursday_from").empty();
	$("#event_time_daytime_friday_from").empty();
	$("#event_time_daytime_saturday_from").empty();
	$("#event_time_daytime_sunday_from").empty();
	
	var seconds = 0;
	for(var i = 0; i < 96; i++){
		var hhmm = formatSecToStr(seconds);
		$item = $("<option></option>").appendTo("#event_time_daytime_monday_from");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_tuesday_from");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_wednesday_from");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_thursday_from");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_friday_from");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_saturday_from");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_sunday_from");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		seconds += 900;
	}
	
	$("#event_time_daytime_monday_from").val("00:00");
	$("#event_time_daytime_tuesday_from").val("00:00");
	$("#event_time_daytime_wednesday_from").val("00:00");
	$("#event_time_daytime_thursday_from").val("00:00");
	$("#event_time_daytime_friday_from").val("00:00");
	$("#event_time_daytime_saturday_from").val("00:00");
	$("#event_time_daytime_sunday_from").val("00:00");
	
	$("#event_time_daytime_monday_to").empty();
	$("#event_time_daytime_tuesday_to").empty();
	$("#event_time_daytime_wednesday_to").empty();
	$("#event_time_daytime_thursday_to").empty();
	$("#event_time_daytime_friday_to").empty();
	$("#event_time_daytime_saturday_to").empty();
	$("#event_time_daytime_sunday_to").empty();
	
	var seconds = 0;
	for(var i = 0; i < 97; i++){
		var hhmm = formatSecToStr(seconds);
		$item = $("<option></option>").appendTo("#event_time_daytime_monday_to");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_tuesday_to");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_wednesday_to");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_thursday_to");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_friday_to");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_saturday_to");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		$item = $("<option></option>").appendTo("#event_time_daytime_sunday_to");
		$item.attr("value", hhmm);
		$item.text(hhmm);
		
		seconds += 900;
	}
	
	$("#event_time_daytime_monday_to").val("24:00");
	$("#event_time_daytime_tuesday_to").val("24:00");
	$("#event_time_daytime_wednesday_to").val("24:00");
	$("#event_time_daytime_thursday_to").val("24:00");
	$("#event_time_daytime_friday_to").val("24:00");
	$("#event_time_daytime_saturday_to").val("24:00");
	$("#event_time_daytime_sunday_to").val("24:00");
	
	//初始化event_parameters
	$("#event_parameters_item").empty();
	$item = $("<option value='-1'></option>").appendTo("#event_parameters_item");
	
	for(var i = 0; i < array_element.length; i++){
		var eid = array_element[i].eid;
		var et = array_element[i].et;
		var en = array_element[i].en;
		if(et >= 1 && et <= 5){
			$item = $("<option></option>").appendTo("#event_parameters_item");
			$item.attr("value", eid); //speed(dec)
			$item.text(en);
		}
	}
	
	//替换和增加sensor
	var $row_sensors = $("#sensor_list tbody tr");
	$($row_sensors).each(function(i, value) {
		var sn = $(value).find("td:eq(1)").text(); 
		var st = $(value).find("td:eq(3)").attr('st'); 
		var eid = $(value).find("td:eq(3)").attr('eid'); 
		var tg = $(value).find("td:eq(3)").attr('tg'); 	
		
		if(tg != -1){
			eid = tg;
		}
		
		if(st >= 1 && st <= 5){
			$("#event_parameters_item option[value="+eid+"]").remove(); 
			$("#event_parameters_item").append("<option value="+eid+">"+sn+"</option>");
		}		
	});
	$("#event_parameters_item option:first").prop("selected", 'selected');
	
}

function sensorfill(){
	var Wnd = $("#dlg_sensor");
	/**Sensor Targets
	* Target ID(dec) -1:   Original
	* Target ID(dec) 1:    Tracker Battery
	* Target ID(dec) 4:    Car Battery
	* Target ID(dec) 69:   Ignition (ACC)
	* Target ID(dec) 2:    Door 
	* Target ID(dec) 245:  Seat belt 
	* Target ID(dec) 10:   Odometer
	* Target ID(dec) 17:   Engine hours
	* Target ID(dec) 30:   Fuel level 1
	* Target ID(dec) 31:   Fuel level 2
	* Target ID(dec) 72:   Temperature 1
	* Target ID(dec) 73:   Temperature 2
	* Target ID(dec) 74:   Temperature 3
	* Target ID(dec) 75:   Temperature 4
	* Target ID(dec) 76:   Temperature 5
	* Target ID(dec) 77:   Temperature 6
	* Target ID(dec) 78:   Temperature 7
	* Target ID(dec) 79:   Temperature 8
	* Target ID(dec) 243:   Temperature 9
	* Target ID(dec) 99:   Weight	
	*/	
	
	/** Target ID(dec) -1:   Original*/
	$(Wnd).find("#sensor_target").empty();
	$item = $("<option></option>").appendTo("#sensor_target");
	$item.val(-1);
	$item.text(JS_INFO_SERVICE_SENSOR_TARGET_ORIGINAL);
	
	var sensorTargets = [1, 4, 69, 2, 245, 10, 17, 30, 31, 72, 73, 74, 75, 76, 77, 78, 79, 243, 99]; 
	
	for(var i = 0; i < array_element.length; i++){
		var eid = array_element[i].eid;
		var en = array_element[i].en;
		if(sensorTargets.indexOf(eid) > -1){
			$item = $("<option></option>").appendTo("#sensor_target");
			$item.val(eid);
			$item.text(en);
		}	
	}
	$(Wnd).find("#sensor_target").val($("#sensor_target option:first").val());
	
	/**fill io element*/
	$(Wnd).find("#sensor_element").empty();
	for(var i = 0; i < array_element.length; i++){
		$item = $("<option></option>").appendTo("#sensor_element");
		$item.val(array_element[i].eid);
		$item.attr("et", array_element[i].et);
		$item.text(array_element[i].en);
	}
	
	$(Wnd).find("#sensor_element").val($("#sensor_element option:first").val());
	
	$(Wnd).find("#sensor_element").unbind('change').change(function(){
		var elementType = $(Wnd).find("#sensor_element option:selected").attr("et");
		sensorInitType(elementType);	
	});
}

 function formatSecToStr(seconds){
  	let hourSec =  60 * 60;
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

function eventstate(keyid){
	var Wnd = $("#dlg_event");	
	//main
	$(Wnd).find("#event_active").prop("checked", true);
	$(Wnd).find(".itext").val("");
	$(Wnd).find("#event_type").val("4097");
	$(Wnd).find("#event_depending_place").val("0");
	$(Wnd).find("#parameters_and_sensors tbody").html("");
	$(Wnd).find("#event_parameters_item").val(-1);		
	$(Wnd).find("#event_parameters_symbol").val(-1);
	$(Wnd).find("#event_time_period,#event_speed_limit,#event_distance,#event_parameters_item,#event_parameters_symbol,"+
	"#event_parameters_value,#event_parameters_add,#parameters_and_sensors,#event_time_daytime_mon_enable,#event_time_daytime_tue_enable,"+
	"#event_time_daytime_wed_enable,#event_time_daytime_thu_enable,#event_time_daytime_fri_enable,#event_time_daytime_sat_enable,#event_time_daytime_sun_enable,"+
	"#event_time_daytime_monday_from,#event_time_daytime_monday_to,#event_time_daytime_tuesday_from,#event_time_daytime_tuesday_to,#event_time_daytime_wednesday_from,"+
	"#event_time_daytime_wednesday_to,#event_time_daytime_thursday_from,#event_time_daytime_thursday_to,#event_time_daytime_friday_from,#event_time_daytime_friday_to,"+
	"#event_time_daytime_saturday_from,#event_time_daytime_saturday_to,"+
	"#event_time_daytime_sunday_from,#event_time_daytime_sunday_to").attr("disabled",true).removeClass("enablebox").addClass("disablebox");
	
	//time
	$(Wnd).find("#event_time_duration").prop("checked", false);
	$(Wnd).find("#event_time_week_day_mon").prop("checked", true);
	$(Wnd).find("#event_time_week_day_tue").prop("checked", true);
	$(Wnd).find("#event_time_week_day_wed").prop("checked", true);
	$(Wnd).find("#event_time_week_day_thu").prop("checked", true);
	$(Wnd).find("#event_time_week_day_fri").prop("checked", true);
	$(Wnd).find("#event_time_week_day_sat").prop("checked", true);
	$(Wnd).find("#event_time_week_day_sun").prop("checked", true);
	
	$(Wnd).find("#event_time_daytime_enable").prop("checked", false);
	$(Wnd).find("#event_time_daytime_mon_enable").prop("checked", false);
	$(Wnd).find("#event_time_daytime_tue_enable").prop("checked", false);
	$(Wnd).find("#event_time_daytime_wed_enable").prop("checked", false);
	$(Wnd).find("#event_time_daytime_thu_enable").prop("checked", false);
	$(Wnd).find("#event_time_daytime_fri_enable").prop("checked", false);
	$(Wnd).find("#event_time_daytime_sat_enable").prop("checked", false);
	$(Wnd).find("#event_time_daytime_sun_enable").prop("checked", false);
	
	
	//notifications
	$(Wnd).find("#event_push_notification_enable,#event_notification_email_enable,#event_notification_sms_enable,#event_notification_telegram_enable,#event_event_arrow_enable,#event_event_list_color_enable").prop("checked", false);
	$(Wnd).find("#event_notification_email,#event_notification_sms,#event_notification_telegram").text("");
	$(Wnd).find("#event_event_arrow").val("yellow");
	document.getElementById('event_event_list_color').jscolor.fromString("FFFF00");
	
	
	//object control
	$(Wnd).find("#event_control_enable").prop("checked", false);
	$(Wnd).find("#event_control_command").val("-1");
	$(Wnd).find("#event_control_code_type").val("1");
	//disable invalid command
	var WP = window.parent;
	var typeid = WP.getTypeById(keyid);
	$("#event_control_command option").each(function() {
	    if(WP.issupportcmd(typeid, $(this).val()) || $(this).val() == '-1') {
		    $(this).removeAttr("disabled");		   
	    }else{
			$(this).attr("disabled", "disabled");		
		}
	});    
	
	eventPlaceActive(true);		
	eventTimePeriodActive(false);
	eventSpeedActive(false);
	eventDistanceActive(false);
	eventParamActive(false);
	
	$("#event_type").unbind('change').change(function(){
		var type = $("#event_type").val().split(",")[0];
		 
		/**place related*/
		if(type == 4110 || type == 4111){
			eventPlaceActive(false);		
			eventTimePeriodActive(false);
			eventSpeedActive(false);
			eventDistanceActive(false);
			eventParamActive(false);
		}else if(type == 12324 || type == 12325 || type == 12328){
			/**time related*/
			eventPlaceActive(true);		
			eventTimePeriodActive(true);
			eventSpeedActive(false);
			eventDistanceActive(false);
			eventParamActive(false);
		}else if(type == 4107 || type == 12326){
			/**speed related*/
			eventPlaceActive(true);		
			eventTimePeriodActive(false);
			eventSpeedActive(true);
			eventDistanceActive(false);
			eventParamActive(false);
		}else if(type == 20483){
			/**param related*/
			eventPlaceActive(true);		
			eventTimePeriodActive(false);
			eventSpeedActive(false);
			eventDistanceActive(false);
			eventParamActive(true);
		}else{
			/**other*/
			eventPlaceActive(true);		
			eventTimePeriodActive(false);
			eventSpeedActive(false);
			eventDistanceActive(false);
			eventParamActive(false);
		}
	});
	
	$("#event_parameters_add").unbind('click').click(function(){
		//var Wnd = $("#dlg_event");
		$(Wnd).find(".itext, .itime").each(function(){
			$(this).removeClass("invalidbox"); 
		});	
		var mustok = true;
		
		$(Wnd).find("#event_parameters_item, #event_parameters_symbol").each(function(){
			var value = $(this).val();
			if(value == -1){
				$(this).addClass("invalidbox").focus();
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		});
		
		$(Wnd).find("#event_parameters_value").each(function(){
			var value = $(this).val(); 
			if(value != ""){
				matchArray = value.match(/^(-?\d+)(\.\d+)?$/);
				if (matchArray == null) {
					$(this).addClass("invalidbox").focus();
					mustok = false;
				}else{
					$(this).removeClass("invalidbox");
				}
			}else{
				$(this).addClass("invalidbox").focus();
				mustok = false;
			}
		});
		
		if(!mustok) return;
		
		var $tbody = $("#parameters_and_sensors tbody");	
		if($tbody.length == 0){
			$tbody = $("<tbody></tbody>").appendTo($("#parameters_and_sensors"));
		}
		var $tr = $("<tr></tr>").appendTo($tbody);
		$("<td></td>").text($("#event_parameters_item option:selected").text()).attr("paramid", $("#event_parameters_item").val()).appendTo($tr);
		$("<td></td>").text($("#event_parameters_symbol option:selected").text()).appendTo($tr);
		$("<td></td>").text($("#event_parameters_value").val()).appendTo($tr);
		$td = $("<td></td>").appendTo($tr);
		var str = "<a style='padding-left: 20px;' onclick='removeSelfRow(this);'></a>";
		$(str).attr("href","#").addClass("operate_delete").appendTo($td);
						
	});
	
	$("#event_time_daytime_enable").unbind('click').click(function(){
		eventDayTimeActive($("#event_time_daytime_enable").prop("checked"));
	});
}

function sensorstate(keyid){
	var Wnd = $("#dlg_sensor");	
	$(Wnd).find(".itext").val("");
	$(Wnd).find("#sensor_element").empty();
	$(Wnd).find("#sensor_ignore_ignition_off").prop("checked", false);
	$(Wnd).find("#sensor_smooth_data").prop("checked", false);
	$(Wnd).find("#sensor_reverse_digital").prop("checked", false);
	$(Wnd).find("#sensor_show_time").prop("checked", false);
	$(Wnd).find("#sensor_keep_last_value").prop("checked", false);
	
	$("#calibration_parameters_add").unbind('click').click(function(){
		$(Wnd).find(".itext").each(function(){
			$(this).removeClass("invalidbox"); 
		});	
		var mustok = true;
		
		$(Wnd).find("#calibration_x, #calibration_y").each(function(){
			var value = $(this).val();
			if(value == null || value.length == 0){
				$(this).addClass("invalidbox").focus();
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		});
		
		$(Wnd).find("#calibration_x,#calibration_y").each(function(){
			var value = $(this).val(); 
			if(value != ""){
				matchArray = value.match(/^([0-9]+\.?[0-9]*|-[0-9]+\.?[0-9]*)$/);
				if (matchArray == null) {
					$(this).addClass("invalidbox").focus();
					mustok = false;
				}else{
					$(this).removeClass("invalidbox");
				}
			}else{
				$(this).addClass("invalidbox").focus();
				mustok = false;
			}
		});
		
		if(!mustok) return;
		
		var $tbody = $("#calibration_parameters tbody");	
		if($tbody.length == 0){
			$tbody = $("<tbody></tbody>").appendTo($("#calibration_parameters"));
		}
		var $tr = $("<tr></tr>").appendTo($tbody);
		$("<td></td>").text($("#calibration_x").val()).appendTo($tr);
		$("<td></td>").text($("#calibration_y").val()).appendTo($tr);
		$td = $("<td></td>").appendTo($tr);
		var str = "<a style='padding-left: 20px;' onclick='removeSelfRow(this);'></a>";
		$(str).attr("href","#").addClass("operate_delete").appendTo($td);
		
		$(Wnd).find("#calibration_x,#calibration_y").val('');		
	});
	
	$("#dictionary_parameters_add").unbind('click').click(function(){
		$(Wnd).find(".itext").each(function(){
			$(this).removeClass("invalidbox"); 
		});	
		var mustok = true;
		
		$(Wnd).find("#dictionary_value, #dictionary_text").each(function(){
			var value = $(this).val();
			if(value == null || value.length == 0){
				$(this).addClass("invalidbox").focus();
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		});				
		
		if(!mustok) return;
		
		var $tbody = $("#dictionary_parameters tbody");	
		if($tbody.length == 0){
			$tbody = $("<tbody></tbody>").appendTo($("#dictionary_parameters"));
		}
		var $tr = $("<tr></tr>").appendTo($tbody);
		$("<td></td>").text($("#dictionary_value").val()).appendTo($tr);
		$("<td></td>").text($("#dictionary_text").val()).appendTo($tr);
		$td = $("<td></td>").appendTo($tr);
		var str = "<a style='padding-left: 20px;' onclick='removeSelfRow(this);'></a>";
		$(str).attr("href","#").addClass("operate_delete").appendTo($td);
		
		$(Wnd).find("#dictionary_value, #dictionary_text").val('');
	});
}

/***
1:digital
2:formula
3:dictionary(option)
4:calibration(linear)
5:percentage
6:String(change element name)
*/
function sensorInitType(type){
	if(type == 1){
		//digital
		sensorFormatActive(false);
		sensorDigitalActive(true);
		sensorFormulaActive(false);
		sensorLowHightActive(false);
		sensorIgnoreIgnitionActive(true);
		sensorSmoothDataActive(false);
		sensorReverseDigitalActive(true);
		sensorCalibrationActive(false);
		sensorDictionaryActive(false);
		sensorShowTimeActive(true);
		sensorKeepLastValueActive(true);
	}else if(type == 2){
		//formula
		sensorFormatActive(true);
		sensorDigitalActive(false);
		sensorFormulaActive(true);
		sensorLowHightActive(true);
		sensorIgnoreIgnitionActive(true);
		sensorSmoothDataActive(true);
		sensorReverseDigitalActive(false);
		sensorCalibrationActive(false);
		sensorDictionaryActive(false);
		sensorShowTimeActive(false);
		sensorKeepLastValueActive(true);
	}else if(type == 3){
		//dictionary(option)
		sensorFormatActive(true);
		sensorDigitalActive(false);
		sensorFormulaActive(false);
		sensorLowHightActive(false);
		sensorIgnoreIgnitionActive(true);
		sensorSmoothDataActive(false);
		sensorReverseDigitalActive(false);
		sensorCalibrationActive(false);
		sensorDictionaryActive(true);
		sensorShowTimeActive(false);
		sensorKeepLastValueActive(true);
	}else if(type == 4){
		//calibration(linear)
		sensorFormatActive(true);
		sensorDigitalActive(false);
		sensorFormulaActive(true);
		sensorLowHightActive(true);
		sensorIgnoreIgnitionActive(true);
		sensorSmoothDataActive(true);
		sensorReverseDigitalActive(false);
		sensorCalibrationActive(true);
		sensorDictionaryActive(false);
		sensorShowTimeActive(false);
		sensorKeepLastValueActive(true);
	}else if(type == 5){
		//percentage
		sensorFormatActive(true);
		sensorDigitalActive(false);
		sensorFormulaActive(true);
		sensorLowHightActive(true);
		sensorIgnoreIgnitionActive(true);
		sensorSmoothDataActive(true);
		sensorReverseDigitalActive(false);
		sensorCalibrationActive(false);
		sensorDictionaryActive(false);
		sensorShowTimeActive(false);
		sensorKeepLastValueActive(true);
	}else if(type == 6){
		//String
		sensorFormatActive(false);
		sensorDigitalActive(false);
		sensorFormulaActive(false);
		sensorLowHightActive(false);
		sensorIgnoreIgnitionActive(true);
		sensorSmoothDataActive(false);
		sensorReverseDigitalActive(false);
		sensorCalibrationActive(false);
		sensorDictionaryActive(false);
		sensorShowTimeActive(false);
		sensorKeepLastValueActive(true);
	}else{
		//default
		sensorFormatActive(false);
		sensorDigitalActive(false);
		sensorFormulaActive(false);
		sensorLowHightActive(false);
		sensorIgnoreIgnitionActive(false);
		sensorSmoothDataActive(false);
		sensorReverseDigitalActive(false);
		sensorCalibrationActive(false);
		sensorDictionaryActive(false);
		sensorShowTimeActive(false);
		sensorKeepLastValueActive(false);
	}
}

function removeSelfRow(tr){
	$(tr).parent().parent().remove();
}

function eventPlaceActive(enable){
	if(enable){
		$("#event_depending_place").val(0);
		$(".place_related").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
		$("#event_place").multiselect('reset');
		$('#event_place').multiselect('disable', false);
	}else{
		$("#event_depending_place").val(0);		
		$(".place_related").removeClass("enablebox").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
		$("#event_place").multiselect('reset');
		$('#event_place').multiselect('disable', false);
	}	
}

function eventTimePeriodActive(enable){
	if(enable){
		$("#event_time_period").val("");
		$(".time_related").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#event_time_period").val("");		
		$(".time_related").removeClass("enablebox").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}	
}

function eventSpeedActive(enable){
	if(enable){
		$("#event_speed_limit").val("");
		$(".speed_related").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#event_speed_limit").val("");		
		$(".speed_related").removeClass("enablebox").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}	
}

function eventDistanceActive(enable){
	if(enable){
		$("#event_distance").val("");
		$(".distance_related").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#event_distance").val("");		
		$(".distance_related").removeClass("enablebox").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}	
}

function eventParamActive(enable){
	if(enable){
		$("#parameters_and_sensors tbody").html("");
		$("#event_parameters_item, #event_parameters_symbol").val("-1");
		$("#event_parameters_value").val("");
		
		$(".param_related").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#parameters_and_sensors tbody").html("");
		$("#event_parameters_item, #event_parameters_symbol").val("-1");
		$("#event_parameters_value").val("");		
		$(".param_related").removeClass("enablebox").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}	
}

function eventDayTimeActive(enable){
	if(enable){
		$(".daytime").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{		
		$(".daytime").removeClass("enablebox").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}	
}

function sensorFormatActive(enable){
	$("#sensor_format").val("");
	if(enable){
		$("#sensor_format").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#sensor_format").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}
}

function sensorDigitalActive(enable){
	$("#sensor_digital_1,#sensor_digital_0").val("");
	if(enable){
		$("#sensor_digital_1,#sensor_digital_0").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#sensor_digital_1,#sensor_digital_0").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}
}

function sensorFormulaActive(enable){
	$("#sensor_formula").val("");
	if(enable){
		$("#sensor_formula").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#sensor_formula").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}
}

function sensorLowHightActive(enable){
	$("#sensor_lowest_value,#sensor_highest_value").val("");
	if(enable){
		$("#sensor_lowest_value,#sensor_highest_value").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#sensor_lowest_value,#sensor_highest_value").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}
}

function sensorIgnoreIgnitionActive(enable){
	if(enable){
		$("#sensor_ignore_ignition_off").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#sensor_ignore_ignition_off").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
		$("#sensor_ignore_ignition_off").prop("checked", false);
	}
}

function sensorSmoothDataActive(enable){
	if(enable){
		$("#sensor_smooth_data").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#sensor_smooth_data").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
		$("#sensor_smooth_data").prop("checked", false);
	}
}

function sensorReverseDigitalActive(enable){
	if(enable){
		$("#sensor_reverse_digital").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#sensor_reverse_digital").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
		$("#sensor_reverse_digital").prop("checked", false);
	}
}

function sensorShowTimeActive(enable){
	if(enable){
		$("#sensor_show_time").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#sensor_show_time").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
		$("#sensor_show_time").prop("checked", false);
	}
}

function sensorKeepLastValueActive(enable){
	if(enable){
		$("#sensor_keep_last_value").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{
		$("#sensor_keep_last_value").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
		$("#sensor_keep_last_value").prop("checked", false);
	}
}

function sensorCalibrationActive(enable){
	$("#calibration_parameters tbody").html("");
	$("#calibration_x, #calibration_y").val("");
	if(enable){		
		$(".calibration_related").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{		
		$(".calibration_related").removeClass("enablebox").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}	
}

function sensorDictionaryActive(enable){
	$("#dictionary_parameters tbody").html("");
	$("#dictionary_value, #dictionary_text").val("");
	if(enable){			
		$(".dictionary_related").removeClass("disablebox").addClass("enablebox").removeAttr("disabled").css("background","#fff");
	}else{		
		$(".dictionary_related").removeClass("enablebox").addClass("disablebox").attr("disabled","disabled").css("background","#eeeeee");
	}	
}

function devstate(state){
	$("#okind").css("pointer-events", "none");
    if(state > 0){
		var last_ztime = $("#ztime").val();
        $("#dev_edit label").removeClass("noedit").addClass("edit");
        $("#dev_edit .itext,#dev_edit .icontent, #dev_edit .iselect").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
//        $("#lblginfo,#lbloflag,#lblokind,#lbldtype,#lbldevno,#lblsimno").removeClass("edit").addClass("need");
        $("#cinfo,#ginfo,#oflag,#dtype,#devno,#simno").removeClass("enablebox").addClass("must");
        $("#dev_stamp,#last_stamp").css("display", "none");
        
        //button state change
        $("#dev_operat").css("display", "block");
        if(state == 1){
            //new
            $("#dev_tips").val(JS_APPEND_MODE);
            $("#dev_edit .itext,#dev_edit .icontent").val("");
            $("#dev_addnew").attr("disabled",true);
			if(last_ztime == null || typeof last_ztime == "undefined" || last_ztime.length == 0){
				var timezone = new Date().getTimezoneOffset() / 60 * -1;
				$("#ztime").val(second2time(timezone * 3600, "-hm"));		
			}else{
				$("#ztime").val(last_ztime);
			}				
            $("#dev_devno").css("display", "block");
            $("#dev_update").css("display", "none");
            $("#dev_save").css("display", "block").removeAttr("disabled");  
			if(isExpiredPurview(purview_recorder)){
				$("#stamp").val(getNowFormatDate());
				$("#estamp").val(getNextYearFormatDate());
				$("#dev_stamp,#last_stamp").css("display", "block");
			}
			$("#okind").css("pointer-events", "auto");
        }else{
            //modify
            $("#dev_tips").val(JS_MODIFY_MODE);
            //$("#dev_devno").css("display", "none");
            $("#dev_save").css("display", "none");
            $("#dev_update").css("display", "block").removeAttr("disabled");
			if(isExpiredPurview(purview_recorder)){
				$("#dev_stamp,#last_stamp").css("display", "block");
			}
			if(!device_id_editable){
				$("#dev_devno").css("display", "none");
			}
			$("#okind").css("pointer-events", "auto");
        }
        $("#dev_cancel").removeAttr("disabled");
    }else{
        $("#dev_edit label").removeClass("edit").addClass("noedit");
        $("#dev_edit .itext,#dev_edit .icontent, #dev_edit .iselect").attr("disabled","disabled").removeClass("enablebox").addClass("disablebox");
        $("#cinfo,#ginfo,#oflag,#dtype,#devno,#simno").removeClass("invalidbox").removeClass("must");
        $("#dev_devno,#dev_stamp,#last_stamp").css("display", "block");
        $("#dev_operat").css("display", "none");
        $("#dev_tips").val(JS_BROWSE_MODE);
        $("#dev_addnew").removeAttr("disabled");
    }
    $("#dev_edit").scrollTop(0);
}

function devview(objid, state){
    locate_table("#devlist", "objid", objid);
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    try{
        $.post("manage.ajax.php", {"type":2, "objid": objid}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            var json = eval('(' + data + ')');
            if(json != null && typeof json != "undefined" && json.length == 1){
                var jo = json[0];
                devfill();
                devstate(state);
                current_objid = jo.objid;
                //customer info
                $("#cinfo").val(jo.cinfo);
                //group info
                $("#ginfo").val(jo.ginfo);               
                $("#oflag").val(jo.oflag);
				//driver info
				if(jo.jb ==  null){
					$("#dlist").val('-1');
				}else{
					$("#dlist").val(jo.jb);
				}
                $("#uflag").val(jo.uflag);
                $("#remark").val(jo.remark);
                //device info
                $("#dtype").val(jo.dtype);
				$("#dstate").val(jo.dstate);
                $("#devno").val(jo.devno);
                $("#simno").val(jo.simno);
                $("#upass").val(jo.dpass);
                $("#ztime").val(jo.ztime);
                $("#stamp").val((jo.stamp).substring(0,10));
                $("#iaddr").val(jo.iaddr); 
				$("#estamp").val((jo.estamp).substring(0,10));
				//object info
				objectKind.setSelectedIndex(jo.okind - 1);
                //$("#okind").val(jo.okind);
            }else{
				showMessage("stop", JS_DEVICE_INFO, JS_NOT_EXIST);
			}
        });
    }catch(e){error(showLoading(false));}
}
function devsubmit(state){
	var WP = window.parent;
    var mustok = true;
    $("#dev_edit .must").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
    var matchArray;
    var ztime = $("#ztime").val();
    if(ztime != ""){
        matchArray = ztime.match(/^(\+|\-)(\d{2}):(\d{2})/);
        if (matchArray == null || (matchArray.length == 4 && (parseInt(matchArray[2]) > 23 || parseInt(matchArray[3]) > 59))) {
            $("#ztime").addClass("invalidbox").focus();
            mustok = false;
        }else{
			$("#ztime").removeClass("invalidbox");
		}
    }else{
        $("#ztime").addClass("invalidbox").focus();
        mustok = false;
    }
	
	if(isExpiredPurview(purview_recorder)){
		 if($("#stamp").val()=="" || $("#stamp").val()==null){
            $("#stamp").addClass("invalidbox");
            mustok = false;
        }else{
            $("#stamp").removeClass("invalidbox");
        }
		
		if($("#estamp").val()=="" || $("#estamp").val()==null){
            $("#estamp").addClass("invalidbox");
            mustok = false;
        }else{
            $("#estamp").removeClass("invalidbox");
        }	
	}
	
    if(!mustok)return;

    if(mustok){
        var opts = {"type": 4, "state": state,
            "objid": current_objid,
            "cinfo": $("#cinfo").val(),
            "okind": parseInt(objectKind.getSelectedValue()),//$("#okind").val(),
            "ginfo": $("#ginfo").val(),
            "oflag": $("#oflag").val(),
            "uflag": $("#uflag").val(),
            "remark": $("#remark").val(),
            "dtype": $("#dtype").val(),
			"dstate": $("#dstate").val(),
            "devno": $("#devno").val(),
            "simno": $("#simno").val(),
            "dpass": $("#dpass").val(),
            "ztime": $("#ztime").val(),
            "stamp": $("#stamp").val() == "" || $("#stamp").val() == null ? -1 : $("#stamp").val() + " 00:00:00",
            "iaddr": $("#iaddr").val(),
			"estamp": $("#estamp").val()=="" || $("#estamp").val()==null ? -1 : $("#estamp").val() + " 00:00:00",
			"driver": $("#dlist").val() + ""
        };
        if(state==1){
            $("#dev_save").attr("disabled",true);
        }else{
            $("#dev_update").attr("disabled",true);
        }
        $("#dev_cancel").css("display","none");
        showLoading(true);
		var timer = setTimeout(function(){
								$("#dev_save,#dev_update").removeAttr("disabled");
								$("#dev_cancel").css("display","block");
								devstate(0);
								showLoading(false,true)}, requestTimeout);
								
        try{
            $.post("manage.ajax.php", opts, function(data){
                clearTimeout(timer);
				showLoading(false);
                $("#dev_save,#dev_update").removeAttr("disabled");
                $("#dev_cancel").css("display","block");
                var result = eval('(' + data + ')');
                if (result.status == 'ok') {
                    devstate(0);
                    var str = "#devlist tbody tr td[objid='"+opts.objid+"']";
                    var $td = $(str);
                    if($td.length > 0){						
						var $tr = $td.parent();
						
						mgrvehicle_array_flag.splice($.inArray($tr.find('td:eq(1)').text(),mgrvehicle_array_flag),1);
						mgrvehicle_array_deviceid.splice($.inArray($tr.find('td:eq(2)').text(),mgrvehicle_array_deviceid),1);
						mgrvehicle_array_phone.splice($.inArray($tr.find('td:eq(3)').text(),mgrvehicle_array_phone),1);
                        
						$tr.find('td:eq(1)').text(opts.oflag).attr("oflag", opts.oflag);
						$tr.find('td:eq(2) span').text(opts.devno);
						$tr.find('td:eq(2)').attr("devno", opts.devno);
						
						if(opts.dstate == 1){
							$("<i></i>").addClass("device_status_in_repair").attr("title",INFO_DEVICE_STATUS_IN_REPAIR).appendTo($tr.find('td:eq(2) span'));
						}else{
							var sta = $tr.find('td:eq(2) span i');
							sta.removeClass("device_status_in_repair").removeAttr("title");
						}
												
						$tr.find('td:eq(3)').text(opts.simno).attr("phone", opts.simno);	
						var drname = array_dlist[opts.driver];
						if(drname != null){
							$tr.find('td:eq(4)').text(drname).attr("drname", drname);
						}else{
							$tr.find('td:eq(4)').text("").removeAttr("drname");
						}  
						$tr.find('td:eq(5)').text(array_group[opts.ginfo]);
                        $tr.find('td:eq(6)').text(array_dtype[opts.dtype]);                        
                        $tr.find('td:eq(7)').text(opts.ztime); 
						if(isExpiredPurview(purview_recorder)){
							var stamp = $.format.date(result.stamp, JS_DEFAULT_DATE_FMT);
						    var estamp = $.format.date(result.estamp, JS_DEFAULT_DATE_FMT);
							$tr.find('td:eq(8)').html(stamp +'</br>'+ estamp);
						}		
						
						updateFlag(opts.objid,opts.oflag);
						updateDeviceId(opts.objid,opts.devno);
						updateSimcard(opts.objid,opts.simno);
						updateDeviceType(opts.objid,opts.dtype);
						
						mgrvehicle_array_flag.push(opts.oflag);
						mgrvehicle_array_deviceid.push(opts.devno);
						mgrvehicle_array_phone.push(opts.simno);
						
						if($("#mgrvehicle_item").val() == "1"){
							 $("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_flag,minLength:mgrvehicle_array_flag.length < 2000 ? 0:2,max:10,scroll:true});
						}else if($("#mgrvehicle_item").val() == "2"){
							 $("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_deviceid,minLength:mgrvehicle_array_deviceid.length < 2000 ? 0:2,max:10,scroll:true});
						}else if($("#mgrvehicle_item").val() == "3"){
							 $("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_phone,minLength:mgrvehicle_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
						}else{
							 $("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_driver,minLength:mgrvehicle_array_driver.length < 2000 ? 0:2,max:10,scroll:true});
						}
						load7=false;
						load8=false;
                    }else{
                        load7=false;
						load8=false;
                        //load_mgrvehicle(result.objid);
						mgrvehicle_array_flag.push(opts.oflag);
						mgrvehicle_array_deviceid.push(opts.devno);
						mgrvehicle_array_phone.push(opts.simno);

						var $tbody = $("#devlist tbody");	
						if($tbody.length == 0){
							$tbody = $("<tbody></tbody>").appendTo($("#devlist"));
						}
                        var $tr = $("<tr></tr>").appendTo($tbody);
                        $("<td></td>").text($tbody.find("tr").size()).attr("objid", result.objid).appendTo($tr);
						$("<td></td>").text(opts.oflag).attr("oflag", opts.oflag).appendTo($tr);						
	
						var $deviceno_col = $("<td></td>").attr("devno", opts.devno).appendTo($tr);
						var $deviceno = $("<span id='deviceno'></span>").text(opts.devno).css({"position": "relative", "padding": "5px"}).appendTo($deviceno_col);
						if(opts.dstate == 1){
							$("<i></i>").addClass("device_status_in_repair").attr("title",INFO_DEVICE_STATUS_IN_REPAIR).appendTo($deviceno);
						}
						$("<td></td>").text(opts.simno).attr("phone", opts.simno).appendTo($tr);				
                        var drname = array_dlist[opts.driver];                     
						if(drname != null){							
							$("<td></td>").text(drname).attr("drname", drname).appendTo($tr);
						}else{
							$("<td></td>").text("").appendTo($tr);
						}
						
						var gname = array_group[opts.ginfo];
						if(gname != null){							
							$("<td></td>").text(gname).attr("gname", gname).appendTo($tr);
						}else{
							$("<td></td>").text("").appendTo($tr);
						}
						
                        var dname = array_dtype[opts.dtype];
                        $("<td></td>").text(dname == null?"":dname).appendTo($tr);
                        if(dname == null)$tr.css("color", "red"); 												
					
                        $("<td></td>").text(opts.ztime).appendTo($tr);
						var stamp = $.format.date(result.stamp, JS_DEFAULT_DATE_FMT);
						var estamp = $.format.date(result.estamp, JS_DEFAULT_DATE_FMT);
                        $("<td></td>").html(stamp +'</br>'+ estamp).appendTo($tr);
                        var $td = $("<td></td>").appendTo($tr);
                        var str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_VIEW+"' onclick=\"devview('"+result.objid+"',0)\"></a>";
                        $(str).attr("href","#").addClass("operate_view").appendTo($td);
						
						if(isModPurview(purview_recorder)){
							str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_MODIFY+"' onclick=\"devview('"+result.objid+"',2)\"></a>";
							$(str).attr("href","#").addClass("operate_edit").appendTo($td);
							
							str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_SERVICE+"' onclick=\"dlgServiceInfo('"+result.objid+"')\"></a>";
							$(str).attr("href","#").addClass("operate_service").appendTo($td);
						}
						                       
						if(isDelPurview(purview_recorder)){
							str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_ERASE+"' onclick=\"showEraseHistory('"+result.objid+"')\"></a>";
							$(str).attr("href","#").addClass("operate_erase").appendTo($td);
							
							str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_DELETE+"' onclick=\"showDelObject('"+result.objid+"','"+opts.ginfo+"')\"></a>";
							$(str).attr("href","#").addClass("operate_delete").appendTo($td);
						}
                    
                
						//$("#devlist tbody tr").removeClass("oddcolor");
						//$("#devlist tbody tr:odd").addClass("oddcolor");

						if($("#mgrvehicle_item").val() == "1"){
							 $("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_flag,minLength:mgrvehicle_array_flag.length < 2000 ? 0:2,max:10,scroll:true});
						}else if($("#mgrvehicle_item").val() == "2"){
							 $("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_deviceid,minLength:mgrvehicle_array_deviceid.length < 2000 ? 0:2,max:10,scroll:true});
						}else if($("#mgrvehicle_item").val() == "3"){
							$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_phone,minLength:mgrvehicle_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
						}else{
							$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_driver,minLength:mgrvehicle_array_driver.length < 2000 ? 0:2,max:10,scroll:true});
						}
						
						if(typeof result.objid != "undefined"){
							locate_table("#devlist", "objid", result.objid, true);
						}
						
						updateFlag(result.objid,opts.oflag);
						updateDeviceId(opts.objid,opts.devno);
						updateSimcard(opts.objid,opts.simno);
						updateDeviceType(result.objid,opts.dtype);
						if(!isExpiredPurview(purview_recorder)){
							devview(result.objid,0);
						}												
                    }
                    showMessage("succ", JS_DEVICE_INFO, opts.state == 1 ? JS_SAVE_SUCC : JS_UPDATE_SUCC);
                    //OK
                }else{                   
                    if(result.error == -1){
                        $("#devno,#simno").addClass("invalidbox").focus();
                        showMessage("stop", JS_DEVICE_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
                    }else if(result.error == -5){
						showMessage("stop", JS_DEVICE_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_EXCEED_CAR);
					} else if(result.error == -20){
						showMessage("stop", JS_DEVICE_INFO, JS_NO_PERMISSION);
					} else{
                        $("#oflag").addClass("invalidbox").focus();
                        showMessage("stop", JS_DEVICE_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
                    }
                }
            });
        }catch(e){error(showLoading(false));}
    }
}

function geostate(state){
    if(state > 1){
        $("#place_edit label").removeClass("noedit").addClass("edit");
        $("#place_edit .itext,.icolor,#place_edit .icontent, #place_edit .iselect, #mgrplace_enable_speed").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
        $("#mgrplace_name").removeClass("enablebox").addClass("must");
        
        //button state change
        $("#place_operat").css("display", "block");
        if(state == 2){
            //new state=2
            $("#place_tips").val(JS_APPEND_MODE);
            $("#place_edit .itext,.icolor,#dev_edit .icontent").val("");
			$("#mgrplace_color").val("#006700");
			document.getElementById('mgrplace_color').jscolor.fromString("006700");
            $("#mgrplace_addnew").attr("disabled",true);
			$("#place_update").css("display", "none");
            $("#place_save").css("display", "block").removeAttr("disabled");            
        }else{
            //modify state=3
            $("#place_tips").val(JS_MODIFY_MODE);
            $("#place_save").css("display", "none");
            $("#place_update").css("display", "block").removeAttr("disabled");
        }
        $("#place_cancel").removeAttr("disabled");
    }else if(state == 0){
        //normal state=0
		$("#place_edit label").removeClass("edit").addClass("noedit");
        $("#place_edit .itext,.icolor,#place_edit .icontent, #place_edit .iselect, #mgrplace_enable_speed").attr("disabled","disabled").removeClass("enablebox").addClass("disablebox");
		$("#mgrplace_name").removeClass("invalidbox").removeClass("must");
        $("#place_operat").css("display", "none");
        $("#place_tips").val(JS_BROWSE_MODE);
        $("#mgrplace_addnew").removeAttr("disabled");
    }else{
		//view state=1
		$("#place_edit label").removeClass("edit").addClass("noedit");
        $("#place_edit .itext,.icolor,#place_edit .icontent, #place_edit .iselect, #mgrplace_enable_speed").attr("disabled","disabled").removeClass("enablebox").addClass("disablebox");
		$("#mgrplace_name").removeClass("invalidbox").removeClass("must");
        $("#place_operat").css("display", "none");
        $("#place_tips").val(JS_BROWSE_MODE);
        $("#mgrplace_addnew").removeAttr("disabled");
	}
    $("#dev_edit").scrollTop(0);
}

function geoview(zid, state){
	locate_table("#placelist", "zid", zid);
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    try{
        $.post("manage.ajax.php", {"type":6, "zid": zid}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            var json = eval('(' + data + ')');
			
			if(json != null && typeof json != "undefined" && json.length == 1){
                var jo = json[0];
                geostate(state);
				var editable = state == 1 ? false:true;
				current_zid=zid;
                $("#mgrplace_name").val(jo.an);
				var acolor = jo.ac;
				$("#mgrplace_color").val(acolor);
				document.getElementById('mgrplace_color').jscolor.fromString(acolor);
				$("#mgrplace_enable_speed").prop("checked", jo.es==1);
				$("#mgrplace_inside_speed").val(jo.ins);			
				
				var zoom = jo.zoom;
				
				if(jo.at == 1){
					var apts = jo.ap.split(",");
					ext.BuildCircle(parseFloat(apts[0]),parseFloat(apts[1]),parseFloat(apts[2]), editable, acolor, zoom, true, jo.an);
				}else if(jo.at == 2){
					var points = jo.ap.split(";");
					ext.BuildRectangle(parseFloat(points[0].split(",")[0]),
									   parseFloat(points[0].split(",")[1]),
									   parseFloat(points[1].split(",")[0]),
									   parseFloat(points[1].split(",")[1]),
									   editable, acolor, zoom, true, jo.an);
				}else if(jo.at == 3){
					var route = [];
					var points = jo.ap.split(";");
					for(var i = 0; i < points.length; i++){
						var point = [points[i].split(',')[0],points[i].split(',')[1]];
						route.push(point);
					}
					ext.BuildPolygon(route, editable, acolor, zoom, true, jo.an);
				}else if(jo.at == 4){
					var apts = jo.ap.split(",");
					ext.BuildMarker(parseFloat(apts[0]), parseFloat(apts[1]), editable, acolor, zoom, true, jo.an);
				}else if(jo.at == 5){
					var route = [];
					var points = jo.ap.split(";");
					for(var i = 0; i < points.length; i++){
						var point = [points[i].split(',')[0],points[i].split(',')[1]];
						route.push(point);
					}
					ext.BuildPolyline(route, editable, acolor, zoom, true, jo.an);
				}
            }else{
				showMessage("stop", JS_GEO_INFO, JS_NOT_EXIST);
			}
        });
    }catch(e){error(showLoading(false));}
}

function geosubmit(state){
	var mustok = true;
	$("#tab_mgrplace .must").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	var inside_speed = $("#mgrplace_inside_speed").val();
	if(inside_speed != ""){
		var intPat = /^([1-9]\d*|[0]{1,1})$/;
		matchArray = inside_speed.match(intPat);
		if (matchArray == null) {
			$("#mgrplace_inside_speed").addClass("invalidbox").focus();
			mustok = false;
		}else{
			$("#mgrplace_inside_speed").removeClass("invalidbox");
		}
	}

	if(!mustok)return;

	if(ext.GetApts() == undefined || ext.GetApts().length <= 0){
		return;
	}
	
    if(mustok){
		var ins = $("#mgrplace_inside_speed").val();
		var re=/^\d*$/;                  
		if(!re.test(ins) || isNaN(parseInt(ins))){                        
			ins = 0;		
		}
		
        var opts = {
		    "type": 7, 
			"state": state,
			"zid": current_zid,
            "aname": $("#mgrplace_name").val(),
			"acolor": $("#mgrplace_color").val(),
            "atype": ext.GetAtype(),
			"apts": ext.GetApts(),
			"zoom": map.GetMap().getZoom(),
			"es": $("#mgrplace_enable_speed").prop("checked") ? 1 : 0,
			"ins": ins
        };
	}
	if(state==2){
		$("#place_save").attr("disabled",true);
	}else{
		$("#place_update").attr("disabled",true);
	}
	$("#place_cancel").css("display","none");
	showLoading(true);
	var timer = setTimeout(function(){
							$("#place_save,#place_update").removeAttr("disabled");
							$("#place_cancel").css("display","block");
							geostate(0);
							showLoading(false,true)}, requestTimeout);
							
	try{
		$.post("manage.ajax.php", opts, function(data){
			clearTimeout(timer);
			showLoading(false);
			$("#place_save,#place_update").removeAttr("disabled");
			$("#place_cancel").css("display","block");
			var result = eval('(' + data + ')');
			if (result.status == 'ok') {
				geostate(0);
				var str = "#placelist tbody tr td[zid='"+opts.zid+"']";
				var $td = $(str);
				
				if($td.length > 0){
					var $tr = $td.parent();
					mgrplace_array_name.splice($.inArray($tr.find('td:eq(1)').text(),mgrplace_array_name),1);
					
					$tr.find('td:eq(1)').text(opts.aname).attr("an", opts.aname);
					$tr.find('td:eq(2)').text(array_atype[opts.atype]);
					geoview(opts.zid,3);
					
					mgrplace_array_name.push(opts.aname);					
					$("#mgrplace_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrplace_array_name,minLength:mgrplace_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					updatePlace(opts.zid,opts.aname);
					load7=false;
				}else{
					load7=false;
					/*
					if(result.newzid){
						load_mgrgeo(result.newzid);
					}else{
						load_mgrgeo(opts.zid);
					}*/
					
					mgrplace_array_name.push(opts.aname);
					
					var $tbody = $("#placelist tbody");
					if($tbody.length == 0){
						$tbody = $("<tbody></tbody>").appendTo($("#placelist"));
					}
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text($tbody.find("tr").size()).attr("zid", result.newzid).appendTo($tr);
					$("<td></td>").text(opts.aname).attr("an", opts.aname).appendTo($tr);
					$("<td></td>").text(array_atype[opts.atype]).appendTo($tr);
					var $td = $("<td></td>").appendTo($tr);
					var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"geoview('"+result.newzid +"',1)\"></a>";
					$(str).attr("href","#").addClass("operate_view").appendTo($td);						
					
					if(isModPurview(purview_place)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"geoview('"+result.newzid +"',3)\"></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);
					}
					
					if(isDelPurview(purview_place)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelGeo('"+result.newzid+"',4)\"></a>";
						$(str).attr("href","#").addClass("operate_delete").appendTo($td);
					}												
                                  
					//$("#placelist tbody tr").removeClass("oddcolor");
					//$("#placelist tbody tr:odd").addClass("oddcolor");
										
					$("#mgrplace_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrplace_array_name,minLength:mgrplace_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					
					if(typeof result.newzid != "undefined"){
						locate_table("#placelist", "zid", result.newzid, true);
					}
					updatePlace(result.newzid,opts.aname);
				}	
				var WP = window.parent;
				WP.needUpdatePlace = true;
				showMessage("succ", JS_GEO_INFO, opts.state == 1 ? JS_SAVE_SUCC : JS_UPDATE_SUCC);				
			} else if(result.error == -20){
				showMessage("stop", JS_GEO_INFO, JS_NO_PERMISSION);
			} else{  
				showMessage("stop", JS_GEO_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_PLACE_OVER);
			}
		});
	}catch(e){showLoading(false);}
}

function custstate(state){
    if(state > 0){
        $("#customer_edit label").removeClass("noedit").addClass("edit");
        $("#customer_edit .itext,#customer_edit .icontent").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
        $("#nikname,#fullname,#custmphone").removeClass("enablebox").addClass("must");
        //button state change
        $("#customer_operat").css("display", "block");
        if(state == 1){
            //new
            $("#cust_tips").val(JS_APPEND_MODE);
			$("#customer_edit .itext,#customer_edit .icontent").val("");
            $("#cust_addnew").attr("disabled",true);            
            $("#cust_update").css("display", "none");
            $("#cust_save").css("display", "block").removeAttr("disabled");            
        }else{
            //modify
            $("#cust_tips").val(JS_MODIFY_MODE);
            $("#cust_save").css("display", "none");
            $("#cust_update").css("display", "block").removeAttr("disabled");
        }
        $("#cust_cancel").removeAttr("disabled");
    }else{
        $("#customer_edit label").removeClass("edit").addClass("noedit");
        $("#customer_edit .itext,#customer_edit .icontent").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
        $("#nikname,#fullname,#custmphone").removeClass("invalidbox").removeClass("must");
        $("#customer_operat").css("display", "none");
        $("#cust_tips").val(JS_BROWSE_MODE);
        $("#cust_addnew").removeAttr("disabled");
    }
    $("#customer_edit").scrollTop(0);
}

function custview(custid, state){
    locate_table("#customerlist", "custid", custid);
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    try{
        $.post("manage.ajax.php", {"type":9, "custid":custid}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            var json = eval('(' + data + ')');
            if(json != null && typeof json !="undefined" && json.length == 1){
                var jo = json[0];
                custstate(state);
                current_custid = jo.id;
                $("#custid").val(jo.id);
                $("#nikname").val(jo.name);
                $("#fullname").val(jo.fname);
                $("#custmphone").val(jo.p);
                $("#custremark").val(jo.r);
            }else{
				showMessage("stop", JS_CUSTOMER_INFO, JS_NOT_EXIST);
			}
        });
    }catch(e){error(showLoading(false));}
}

function custsubmit(state){
	var mustok = true;
	$("#tab_mgrcustomer .must").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });

	if(!mustok)return;
	
    if(mustok){
        var opts = {
		    "type": 10, 
			"state": state,
            "custid": current_custid,
			"name": $("#nikname").val(),
			"fname": $("#fullname").val(),
			"phone": $("#custmphone").val(),
            "remark": $("#custremark").val()
        };
	}
	if(state==2){
		$("#cust_save").attr("disabled",true);
	}else{
		$("#cust_update").attr("disabled",true);
	}
	$("#cust_cancel").css("display","none");
	showLoading(true);
	var timer = setTimeout(function(){
							$("#cust_save,#cust_update").removeAttr("disabled");
							$("#cust_cancel").css("display","block");
							custstate(0);
							showLoading(false,true)}, requestTimeout);
							
	try{
		$.post("manage.ajax.php", opts, function(data){
			clearTimeout(timer);
			showLoading(false);
			$("#cust_save,#cust_update").removeAttr("disabled");
			$("#cust_cancel").css("display","block");
			var result = eval('(' + data + ')');
			
			if (result.status == 'ok') {
				custstate(0);
				var str = "#customerlist tbody tr td[custid='"+opts.custid+"']";
				var $td = $(str);
				if($td.length > 0){
					var $tr = $td.parent();
					mgrcustomer_array_name.splice($.inArray($tr.find('td:eq(1)').text(),mgrcustomer_array_name),1);
					mgrcustomer_array_fname.splice($.inArray($tr.find('td:eq(2)').text(),mgrcustomer_array_fname),1);
					mgrcustomer_array_phone.splice($.inArray($tr.find('td:eq(3)').text(),mgrcustomer_array_phone),1);
					
					$tr.find('td:eq(1)').text(opts.name).attr("name", opts.name);
					$tr.find('td:eq(2)').text(opts.fname).attr("fname", opts.fname);
					$tr.find('td:eq(3)').text(opts.phone).attr("phone", opts.phone); 
					
					mgrcustomer_array_name.push(opts.name);
					mgrcustomer_array_fname.push(opts.fname);
					mgrcustomer_array_phone.push(opts.phone);
					
					if($("#mgrcustomer_item").val() == "1"){
						 $("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_name,minLength:mgrcustomer_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrcustomer_item").val() == "2"){
						$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_fname,minLength:mgrcustomer_array_fname.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_phone,minLength:mgrcustomer_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}					
				}else{
					//load4=false;					
					//load_mgrcustomer(opts.name);
					mgrcustomer_array_name.push(opts.name);
					mgrcustomer_array_fname.push(opts.fname);
					mgrcustomer_array_phone.push(opts.phone);
					
					var $tbody = $("#customerlist tbody");
					if($tbody.length == 0){
						$tbody = $("<tbody></tbody>").appendTo($("#customerlist"));
					}
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text($tbody.find("tr").size()).attr("custid", result.cuid).appendTo($tr);
					$("<td></td>").text(opts.name).attr("name", opts.name).appendTo($tr);
					$("<td></td>").text(opts.fname).attr("fname", opts.fname).appendTo($tr);
					$("<td></td>").text(opts.phone).attr("phone", opts.phone).appendTo($tr);
					$td = $("<td></td>").appendTo($tr);
					var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"custview('"+result.cuid+"',0)\"></a>";
					$(str).attr("href","#").addClass("operate_view").appendTo($td);
					
					if(isModPurview(purview_customer)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"custview('"+result.cuid+"',2)\"></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);
					}
					
					if(isDelPurview(purview_customer)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelCustomer('"+result.cuid+"', 3)\"></a>";
						$(str).attr("href","#").addClass("operate_delete").appendTo($td);
					}
				
					//$("#customerlist tbody tr").removeClass("oddcolor");
					//$("#customerlist tbody tr:odd").addClass("oddcolor");
					
					if($("#mgrcustomer_item").val() == "1"){
						$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_name,minLength:mgrcustomer_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrcustomer_item").val() == "2"){
						$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_fname,minLength:mgrcustomer_array_fname.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_phone,minLength:mgrcustomer_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					if(typeof result.cuid != "undefined"){
						locate_table("#customerlist", "custid", result.cuid, true);
					}
				}
				load2=false;
				showMessage("succ", JS_CUSTOMER_INFO, opts.state == 1 ? JS_SAVE_SUCC : JS_UPDATE_SUCC);
			}else if(result.error == -20){
				showMessage("stop", JS_CUSTOMER_INFO, JS_NO_PERMISSION);
			}else{
				$("#nikname,#fullname").addClass("invalidbox").focus();
				showMessage("stop", JS_CUSTOMER_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
			}
		});
	}catch(e){showLoading(false);}
}

function driverstate(state){
	current_driver_photo = "no";
	$("#lbworkid,#workid").css("display", "block");
    if(state > 0){
        $("#driver_edit label").removeClass("noedit").addClass("edit");
        $("#driver_edit .itext,#driver_edit .icontent ,#driver_edit .iselect").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
        $("#workid,#driver,#sex,#primary,#driverrfid").removeClass("enablebox").addClass("must");
        //button state change
        $("#driver_operat").css("display", "block");
        if(state == 1){
            //new
            $("#driver_tips").val(JS_APPEND_MODE);
			$("#driver_edit .itext,#driver_edit .icontent").val("");
            $("#driver_addnew").attr("disabled",true);            
            $("#driver_update").css("display", "none");
            $("#driver_save").css("display", "block").removeAttr("disabled");
			$("#driverph").attr("src","img/none driver.png");
        }else{
            //modify
            $("#driver_tips").val(JS_MODIFY_MODE);
            $("#lbworkid,#workid,#driver_save").css("display", "none");
            $("#driver_update").css("display", "block").removeAttr("disabled");
        }
        $("#driver_cancel").removeAttr("disabled");
		$("#driverphbtn").css("cursor", "pointer");
		$("#driverphbtn").attr("disabled", false);
    }else{
        $("#driver_edit label").removeClass("edit").addClass("noedit");
        $("#driver_edit .itext,#driver_edit .icontent, #driver_edit .iselect").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
        $("#workid,#driver,#sex,#primary,#driverrfid").removeClass("invalidbox").removeClass("must");
        $("#driver_operat").css("display", "none");
        $("#driver_tips").val(JS_BROWSE_MODE);
        $("#driver_addnew").removeAttr("disabled");
		$("#driverphbtn").css("cursor", "default");
		$("#driverphbtn").attr("disabled", true);
    }
    $("#driver_edit").scrollTop(0);
}

function driverview(jobnumber, state){
    locate_table("#driverlist", "jobnumber", jobnumber);
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
							
    try{
        $.post("manage.driver.ajax.php", {"type":11, "jobnumber":jobnumber}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            var json = eval('(' + data + ')');
            if(json != null && typeof json != "undefined" && json.length == 1){
                var jo = json[0];
                driverstate(state);
                current_jobnumber = jo.j;
                $("#workid").val(jo.j);
                $("#driver").val(jo.n);
                $("#sex").val(jo.s);
                $("#primary").val(jo.ip);
                $("#idcard").val(jo.id);
				$("#license").val(jo.l);
				$("#licenseissuedate").val(jo.isd);
				$("#licenseexpiredate").val(jo.exd);
				$("#drivertel").val(jo.p);
				$("#driverrfid").val(jo.rfid);
				$("#drivercompany").val(jo.co);
				$("#driveraddr").val(jo.addr);
				$("#drivermark").val(jo.r);
				if(jo.ph == ""){
					$("#driverph").attr("src", "img/none driver.png"); 
				}else{
					$("#driverph").attr("src", jo.ph); 
				}
				$("#driverph").css( { "width" : driver_photo_width,"height" : driver_photo_height });
            }else{
				showMessage("stop", JS_DRIVER_INFO, JS_NOT_EXIST);
			}
        });
    }catch(e){error(showLoading(false));}
}

function driversubmit(state){
	var mustok = true;	
	$("#tab_mgrdriver .must").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	if(!mustok)return;
	
    if(mustok){
		var driverphoto = current_driver_photo;

        var opts = {
		    "type": 12, 
			"state": state,
            "jno": $('#workid').val(),
			"name": $("#driver").val(),
			"sex": $("#sex").val(),
			"ip": $("#primary").val(),
			"id": $("#idcard").val(),
			"l": $("#license").val(),
			"isd": $("#licenseissuedate").val(),
			"exd": $("#licenseexpiredate").val(),
			"tel": $("#drivertel").val(),
			"rfid": $("#driverrfid").val(),
			"co": $("#drivercompany").val(),
			"addr": $("#driveraddr").val(),
			"r": $("#drivermark").val(),
			"P": driverphoto
        };
	}
	if(state==2){
		$("#driver_save").attr("disabled",true);
	}else{
		$("#driver_update").attr("disabled",true);
	}
	$("#driver_cancel").css("display","none");
	showLoading(true);
	var timer = setTimeout(function(){
							$("#driver_save,#driver_update").removeAttr("disabled");
							$("#driver_cancel").css("display","block");
							driverstate(0);
							showLoading(false,true)}, requestTimeout);

	try{
		$.post("manage.driver.ajax.php", opts, function(data){
			clearTimeout(timer);
			showLoading(false);
			$("#driver_save,#driver_update").removeAttr("disabled");
			$("#driver_cancel").css("display","block");
			var result = eval('(' + data + ')');
			
			if (result.status == 'ok') {
				driverstate(0);
				var str = "#driverlist tbody tr td[jobnumber='"+opts.jno+"']";
				var $td = $(str);
				if($td.length > 0){
					var $tr = $td.parent();
					
					mgrdriver_array_name.splice($.inArray($tr.find('td:eq(1)').text(),mgrdriver_array_name),1);
					mgrdriver_array_phone.splice($.inArray($tr.find('td:eq(5)').text(),mgrdriver_array_phone),1);
					mgrdriver_array_rfid.splice($.inArray($tr.find('td:eq(4)').text(),mgrdriver_array_rfid),1);
					
					$tr.find('td:eq(1)').text(opts.name).attr("name", opts.name);
					$tr.find('td:eq(3)').text(opts.l);
					$tr.find('td:eq(4)').text(opts.rfid).attr("rfid", opts.rfid);
					$tr.find('td:eq(5)').text(opts.tel).attr("phone", opts.tel);
					
					mgrdriver_array_name.push(opts.name);
					mgrdriver_array_phone.push(opts.tel);
					mgrdriver_array_rfid.push(opts.rfid);
					
					if($("#mgrdriver_item").val() == "1"){
						 $("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_name,minLength:mgrdriver_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrdriver_item").val() == "2"){
						$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_workid,minLength:mgrdriver_array_workid.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrdriver_item").val() == "3"){
						$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_rfid,minLength:mgrdriver_array_rfid.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_phone,minLength:mgrdriver_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}
				}else{
					//load6=false;
					//load_mgrdriver(opts.jno);
					mgrdriver_array_name.push(opts.name);
					mgrdriver_array_workid.push(opts.jno);
					mgrdriver_array_phone.push(opts.tel);
					mgrdriver_array_rfid.push(opts.rfid);
					
					var $tbody = $("#driverlist tbody");
					if($tbody.length == 0){
						$tbody = $("<tbody></tbody>").appendTo($("#driverlist"));
					}
					
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text($tbody.find("tr").size()).appendTo($tr);							
					$("<td></td>").text(opts.name).attr("name", opts.name).appendTo($tr);
					$("<td></td>").text(opts.jno).attr("jobnumber", opts.jno).appendTo($tr);
					$("<td></td>").text(opts.l).attr("license", opts.l).appendTo($tr);
					$("<td></td>").text(opts.rfid).attr("rfid", opts.rfid).appendTo($tr);
					$("<td></td>").text(opts.tel).attr("phone", opts.tel).appendTo($tr);
					$td = $("<td></td>").appendTo($tr);
					var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"driverview('"+opts.jno+"',0)\"></a>";
					$(str).attr("href","#").addClass("operate_view").appendTo($td);
					
					if(isModPurview(purview_driver)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"driverview('"+opts.jno+"',2)\"></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);
					}
					
					if(isDelPurview(purview_driver)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelDriver('"+opts.jno+"', 3)\"></a>";
						$(str).attr("href","#").addClass("operate_delete").appendTo($td);
					}
						
					//$("#driverlist tbody tr").removeClass("oddcolor");
					//$("#driverlist tbody tr:odd").addClass("oddcolor");
					
					if($("#mgrdriver_item").val() == "1"){
						 $("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_name,minLength:mgrdriver_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrdriver_item").val() == "2"){
						$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_workid,minLength:mgrdriver_array_workid.length < 2000 ? 0:2,max:10,scroll:true});
					}else if($("#mgrdriver_item").val() == "3"){
						$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_rfid,minLength:mgrdriver_array_rfid.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_phone,minLength:mgrdriver_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					if(typeof opts.jno != "undefined"){
						locate_table("#driverlist", "jobnumber", opts.jno, true);
					}
				}
				load2=false;
				showMessage("succ", JS_DRIVER_INFO, opts.state == 1 ? JS_SAVE_SUCC : JS_UPDATE_SUCC);
			} else if(result.error == -20){
				showMessage("stop", JS_DRIVER_INFO, JS_NO_PERMISSION);
			} else{
				$("#workid").addClass("invalidbox").focus();
				$("#driverrfid").addClass("invalidbox").focus();
				showMessage("stop", JS_DRIVER_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
			}
		});
	}catch(e){alert(e);showLoading(false);}
}

function expensestate(state){
	$("#expensedate").removeClass("invalidbox");
    if(state > 0){
        $("#expense_edit label").removeClass("noedit").addClass("edit");
        $("#expense_edit .itext,#expense_edit .icontent ,#expense_edit .iselect").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
        $("#expensename,#expenseasset,#expensequantity,#expensecost").removeClass("enablebox").addClass("must");
		$("#expensesupplier,#expensebuyer,#expenseodometer,#expenseenghour,#expenserm").removeClass("enablebox")
        //button state change
        $("#expense_operat").css("display", "block");
        if(state == 1){
            //new
            $("#expense_tips").val(JS_APPEND_MODE);
			$("#expense_edit .itext,#expense_edit .icontent").val("");
            $("#expense_addnew").attr("disabled",true);            
            $("#expense_update").css("display", "none");
            $("#expense_save").css("display", "block").removeAttr("disabled");
        }else{
            //modify
            $("#expense_tips").val(JS_MODIFY_MODE);
            $("#expense_save").css("display", "none");
            $("#expense_update").css("display", "block").removeAttr("disabled");
        }
        $("#expense_cancel").removeAttr("disabled");
    }else{
        $("#expense_edit label").removeClass("edit").addClass("noedit");
        $("#expense_edit .itext,#expense_edit .icontent, #expense_edit .iselect").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
        $("#expensename,#expenseasset,#expensequantity,#expensecost").removeClass("invalidbox").removeClass("must");
		$("#expensesupplier,#expensebuyer,#expenseodometer,#expenseenghour,#expenserm").removeClass("invalidbox")
        $("#expense_operat").css("display", "none");
        $("#expense_tips").val(JS_BROWSE_MODE);
        $("#expense_addnew").removeAttr("disabled");
    }
    $("#expense_edit").scrollTop(0);
}

function expenseview(eid, oid, state){
    locate_table("#expenselist", "eid", eid);
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
							
    try{
        $.post("manage.expense.ajax.php", {"type":1, "eid":eid, "oid": oid}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            var json = eval('(' + data + ')');
            if(json != null && typeof json != "undefined" && json.length == 1){
				expensefill();
                var jo = json[0];
                expensestate(state);
                current_expenseid = jo.eid;
                $("#expensename").val(jo.en);
				$("#expensedate").val(jo.d);
                $("#expenseasset").val(jo.oid);				
                $("#expensequantity").val(jo.q);
                $("#expensecost").val(jo.c);
                $("#expensesupplier").val(jo.s);
				$("#expensebuyer").val(jo.b);
				$("#expenseodometer").val(jo.o);
				$("#expenseenghour").val(jo.g);	
				$("#expenserm").val(jo.r);
            }else{
				showMessage("stop", JS_EXPENSE_INFO, JS_NOT_EXIST);
			}
        });
    }catch(e){error(showLoading(false));}
}

function taskstate(state){
	$("#taskstartf").removeClass("invalidbox");
	$("#taskstartt").removeClass("invalidbox");
	$("#taskendf").removeClass("invalidbox");
	$("#taskendt").removeClass("invalidbox");
	$("#taskrepeat").removeClass("invalidbox");
	$("#daysinterval").removeClass("invalidbox");
    if(state > 0){
        $("#task_edit label").removeClass("noedit").addClass("edit");
        $("#task_edit .itext,#task_edit .icontent ,#task_edit .iselect, #task_edit .icheck").removeAttr("disabled").removeClass("disablebox").addClass("enablebox");
        $("#taskname,#taskasset,#taskpriority,#taskstatus").removeClass("enablebox").addClass("must");
        //button state change
        $("#task_operat").css("display", "block");
        if(state == 1){
            //new
            $("#task_tips").val(JS_APPEND_MODE);
			$("#task_edit .itext,#task_edit .icontent").val("");
			$("#taskrepeat").prop("checked", false);
            $("#task_addnew").attr("disabled",true);            
            $("#task_update").css("display", "none");
            $("#task_save").css("display", "block").removeAttr("disabled");
        }else{
            //modify
            $("#task_tips").val(JS_MODIFY_MODE);
            $("#task_save").css("display", "none");
            $("#task_update").css("display", "block").removeAttr("disabled");
        }
        $("#task_cancel").removeAttr("disabled");
    }else{
        $("#task_edit label").removeClass("edit").addClass("noedit");
        $("#task_edit .itext,#task_edit .icontent, #task_edit .iselect, #task_edit .icheck").attr("disabled", "disabled").removeClass("enablebox").addClass("disablebox");
        $("#taskname,#taskasset,#taskpriority,#taskstatus").removeClass("invalidbox").removeClass("must");
        $("#task_operat").css("display", "none");
        $("#task_tips").val(JS_BROWSE_MODE);
        $("#task_addnew").removeAttr("disabled");
    }
    $("#task_edit").scrollTop(0);
}

function taskview(tid, oid, state){
    locate_table("#tasklist", "tid", tid);
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
							
    try{
        $.post("manage.task.ajax.php", {"type":13, "tid":tid, "oid": oid}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            var json = eval('(' + data + ')');
            if(json != null && typeof json != "undefined" && json.length == 1){
				taskfill();
                var jo = json[0];
                taskstate(state);
                current_taskid = jo.tid;
                $("#taskname").val(jo.tn);
                $("#taskasset").val(jo.oid);
                $("#taskpriority").val(jo.p);
                $("#taskstatus").val(jo.s);
                $("#taskstartp").val(jo.sid);
				$("#taskstartf").val(jo.sf);
				$("#taskstartt").val(jo.st);
				$("#taskendp").val(jo.eid);	
				$("#taskendf").val(jo.ef);
				$("#taskendt").val(jo.et);
				$("#taskrepeat").prop("checked", jo.rt==1);	
				$("#daysinterval").val(jo.di == 0 ? '':jo.di);	
				$("#taskr").val(jo.r);
            }else{
				showMessage("stop", JS_TASK_INFO, JS_NOT_EXIST);
			}
        });
    }catch(e){error(showLoading(false));}
}

function tasksubmit(state){
	var mustok = true;	
	$("#tab_mgrtask .must").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	var days_interval = $("#daysinterval").val();
	if(days_interval != ""){
		var intPat = /^([1-9]\d*|[0]{1,1})$/;
		matchArray = days_interval.match(intPat);
		if (matchArray == null) {
			$("#daysinterval").addClass("invalidbox").focus();
			mustok = false;
		}else{
			$("#daysinterval").removeClass("invalidbox");
		}
	}
	
	if(!mustok)return;
	
	
	$("#taskstartf").removeClass("invalidbox");
	$("#taskstartt").removeClass("invalidbox");
	$("#taskendf").removeClass("invalidbox");
	$("#taskendt").removeClass("invalidbox");
	var startFrom = $("#taskstartf").val();
	var startTo = $("#taskstartt").val();
	var endFrom = $("#taskendf").val();
	var endTo = $("#taskendt").val();
	
	//startFrom < startTo	
	var timeRange = newDate(startFrom).getTime() - newDate(startTo).getTime();
	if(timeRange >= 0){
		$("#taskstartf").addClass("invalidbox");
		$("#taskstartt").addClass("invalidbox");
		return;
	}
	//endFrom < endTo
	timeRange = newDate(endFrom).getTime() - newDate(endTo).getTime();
	if(timeRange >= 0){
		$("#taskendf").addClass("invalidbox");
		$("#taskendt").addClass("invalidbox");
		return;
	}
	//startTo < endFrom
	timeRange = newDate(startTo).getTime() - newDate(endFrom).getTime();
	if(timeRange >= 0){
		$("#taskstartt").addClass("invalidbox");
		$("#taskendf").addClass("invalidbox");
		return;
	}
	
	
    if(mustok){
        var opts = {
		    "type": 14, 
			"state": state,
			"tid": current_taskid,
            "tn": $('#taskname').val(),
			"oid": $('#taskasset').val(),
			"p": $("#taskpriority").val(),
			"s": $("#taskstatus").val(),
			"sid": $("#taskstartp").val(),
			"sf": $("#taskstartf").val(),
			"st": $("#taskstartt").val(),
			"eid": $("#taskendp").val(),
			"ef": $("#taskendf").val(),
			"et": $("#taskendt").val(),
			"rt": $("#taskrepeat").prop("checked") ? 1 : 0,
			"di": $("#daysinterval").val(),
			"r": $("#taskr").val()
        };
	}
	if(state==2){
		$("#task_save").attr("disabled",true);
	}else{
		$("#task_update").attr("disabled",true);
	}
	$("#task_cancel").css("display","none");
	showLoading(true);
	var timer = setTimeout(function(){
							$("#task_save,#task_update").removeAttr("disabled");
							$("#task_cancel").css("display","block");
							taskstate(0);
							showLoading(false,true)}, requestTimeout);

	try{
		$.post("manage.task.ajax.php", opts, function(data){
			clearTimeout(timer);
			showLoading(false);
			$("#task_save,#task_update").removeAttr("disabled");
			$("#task_cancel").css("display","block");
			var result = eval('(' + data + ')');
			
			if (result.status == 'ok') {
				taskstate(0);
				var str = "#tasklist tbody tr td[tid='"+opts.tid+"']";
				var $td = $(str);
				if($td.length > 0){
					var $tr = $td.parent();
					
					mgrtask_array_name.splice($.inArray($tr.find('td:eq(1)').text(),mgrtask_array_name),1);
					
					$tr.find('td:eq(1)').text(opts.tn).attr("name", opts.tn);
					$tr.find('td:eq(2)').text($("#taskasset option:selected").text()).attr("flag", $("#taskasset option:selected").text());					
					$tr.find('td:eq(3)').text($("#taskpriority option:selected").text());
					$tr.find('td:eq(4)').text($("#taskstatus option:selected").text());
					$tr.find('td:eq(5)').text($("#taskstartp option:selected").text());
					$tr.find('td:eq(6)').text($("#taskendp option:selected").text());
					
					mgrtask_array_name.push(opts.tn);
					
					if($("#mgrtask_item").val() == "1"){
						 $("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrtask_array_name,minLength:mgrtask_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						var deviceList = getDeviceList();
						$("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
					}
				}else{
					//load7=false;
					//load_mgrtask(opts.tid);
					mgrtask_array_name.push(opts.tn);
					
					var $tbody = $("#tasklist tbody");
					if($tbody.length == 0){
						$tbody = $("<tbody></tbody>").appendTo($("#tasklist"));
					}
					
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text($tbody.find("tr").size()).attr("tid", result.newtid).appendTo($tr);							
					$("<td></td>").text(opts.tn).attr("name", opts.tn).appendTo($tr);
					$("<td></td>").text($("#taskasset option:selected").text()).attr("flag", $("#taskasset option:selected").text()).appendTo($tr);
					$("<td></td>").text($("#taskpriority option:selected").text()).appendTo($tr);
					$("<td></td>").text($("#taskstatus option:selected").text()).appendTo($tr);
					$("<td></td>").text($("#taskstartp option:selected").text()).appendTo($tr);
					$("<td></td>").text($("#taskendp option:selected").text()).appendTo($tr);
					$td = $("<td></td>").appendTo($tr);
					var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"taskview('"+result.newtid+"','"+opts.oid+"',0)\"></a>";
					$(str).attr("href","#").addClass("operate_view").appendTo($td);
					
					if(isModPurview(purview_task)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"taskview('"+result.newtid+"','"+opts.oid+"',2)\"></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);
					}
					
					if(isDelPurview(purview_task)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelTask('"+result.newtid+"','"+opts.oid+"', 3)\"></a>";
						$(str).attr("href","#").addClass("operate_delete").appendTo($td);
					}
						
					//$("#tasklist tbody tr").removeClass("oddcolor");
					//$("#tasklist tbody tr:odd").addClass("oddcolor");
					
					if($("#mgrtask_item").val() == "1"){
						 $("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrtask_array_name,minLength:mgrtask_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						var deviceList = getDeviceList();
						$("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					if(typeof result.newtid != "undefined"){
						locate_table("#tasklist", "tid", result.newtid, true);
					}
				}
				//load2=false;
				showMessage("succ", JS_TASK_INFO, opts.state == 1 ? JS_SAVE_SUCC : JS_UPDATE_SUCC);
			} else if(result.error == -20){
				showMessage("stop", JS_TASK_INFO, JS_NO_PERMISSION);
			} else{
				$("#taskname").addClass("invalidbox").focus();
				showMessage("stop", JS_TASK_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
			}
		});
	}catch(e){alert(e);showLoading(false);}
}

function expensesubmit(state){
	var mustok = true;	
	$("#tab_mgrexpense .must").each(function(){
        if($(this).val()=="" || $(this).val()==null){
            $(this).addClass("invalidbox");
            mustok = false;
        }else{
            $(this).removeClass("invalidbox");
        }
    });
	
	$("#expensequantity").each(function(){
		var value = $(this).val(); 
		if(value != ""){
			matchArray = value.match(/^\d+(\.\d+)?$/);
			if (matchArray == null) {
				$(this).addClass("invalidbox").focus();
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		}
	});
	
	$("#expensecost").each(function(){
		var value = $(this).val(); 
		if(value != ""){
			matchArray = value.match(/^\d+(\.\d+)?$/);
			if (matchArray == null) {
				$(this).addClass("invalidbox").focus();
				mustok = false;
			}else{
				$(this).removeClass("invalidbox");
			}
		}
	});
	
	if(!mustok)return;
	
	$("#expensedate").removeClass("invalidbox");
	
    if(mustok){
        var opts = {
		    "type": 2, 
			"state": state,
			"eid": current_expenseid,
            "en": $('#expensename').val(),
			"oid": $('#expenseasset').val(),
			"d": $("#expensedate").val(),
			"q": $("#expensequantity").val(),
			"c": $("#expensecost").val(),
			"s": $("#expensesupplier").val(),
			"b": $("#expensebuyer").val(),
			"o": $("#expenseodometer").val(),
			"g": $("#expenseenghour").val(),
			"r": $("#expenserm").val()
        };
	}
	if(state==2){
		$("#expense_save").attr("disabled",true);
	}else{
		$("#expense_update").attr("disabled",true);
	}
	$("#expense_cancel").css("display","none");
	showLoading(true);
	var timer = setTimeout(function(){
							$("#expense_save,#expense_update").removeAttr("disabled");
							$("#expense_cancel").css("display","block");
							expensestate(0);
							showLoading(false,true)}, requestTimeout);

	try{
		$.post("manage.expense.ajax.php", opts, function(data){
			clearTimeout(timer);
			showLoading(false);
			$("#expense_save,#expense_update").removeAttr("disabled");
			$("#expense_cancel").css("display","block");
			var result = eval('(' + data + ')');
			
			if (result.status == 'ok') {
				expensestate(0);
				var str = "#expenselist tbody tr td[eid='"+opts.eid+"']";
				var $td = $(str);
				if($td.length > 0){
					var $tr = $td.parent();
					
					mgrexpense_array_name.splice($.inArray($tr.find('td:eq(1)').text(),mgrexpense_array_name),1);
					
					$tr.find('td:eq(1)').text(opts.d);					
					$tr.find('td:eq(2)').text(opts.en).attr("name", opts.en);
					$tr.find('td:eq(3)').text($("#expenseasset option:selected").text()).attr("flag", $("#expenseasset option:selected").text());					
					$tr.find('td:eq(4)').text(opts.q);	
					$tr.find('td:eq(5)').text(opts.c);	
					$tr.find('td:eq(6)').text(opts.s);	
					$tr.find('td:eq(7)').text(opts.b);	
					
					mgrexpense_array_name.push(opts.en);
					
					if($("#mgrexpense_item").val() == "1"){
						 $("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrexpense_array_name,minLength:mgrexpense_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						var deviceList = getDeviceList();
						$("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
					}
				}else{
					//load8=false;
					//load_mgrexpense(opts.eid);
					mgrexpense_array_name.push(opts.en);
					
					var $tbody = $("#expenselist tbody");
					if($tbody.length == 0){
						$tbody = $("<tbody></tbody>").appendTo($("#expenselist"));
					}
					
					var $tr = $("<tr></tr>").appendTo($tbody);
					$("<td></td>").text($tbody.find("tr").size()).attr("eid", result.neweid).appendTo($tr);
					$("<td></td>").text(opts.d).appendTo($tr);					
					$("<td></td>").text(opts.en).attr("name", opts.en).appendTo($tr);
					$("<td></td>").text($("#expenseasset option:selected").text()).attr("flag", $("#expenseasset option:selected").text()).appendTo($tr);
					$("<td></td>").text(opts.q).appendTo($tr);	
					$("<td></td>").text(opts.c).appendTo($tr);
					$("<td></td>").text(opts.s).appendTo($tr);
					$("<td></td>").text(opts.b).appendTo($tr);
					
					$td = $("<td></td>").appendTo($tr);
					var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"expenseview('"+result.neweid+"','"+opts.oid+"',0)\"></a>";
					$(str).attr("href","#").addClass("operate_view").appendTo($td);
					
					if(isModPurview(purview_expense)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"expenseview('"+result.neweid+"','"+opts.oid+"',2)\"></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);
					}
					
					if(isDelPurview(purview_expense)){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelExpense('"+result.neweid+"','"+opts.oid+"', 3)\"></a>";
						$(str).attr("href","#").addClass("operate_delete").appendTo($td);
					}
						
					//$("#expenselist tbody tr").removeClass("oddcolor");
					//$("#expenselist tbody tr:odd").addClass("oddcolor");
					
					if($("#mgrexpense_item").val() == "1"){
						 $("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrexpense_array_name,minLength:mgrexpense_array_name.length < 2000 ? 0:2,max:10,scroll:true});
					}else{
						var deviceList = getDeviceList();
						$("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
					}
					
					if(typeof result.neweid != "undefined"){
						locate_table("#expenselist", "eid", result.neweid, true);
					}
				}
				
				showMessage("succ", JS_EXPENSE_INFO, opts.state == 1 ? JS_SAVE_SUCC : JS_UPDATE_SUCC);
			} else if(result.error == -20){
				showMessage("stop", JS_EXPENSE_INFO, JS_NO_PERMISSION);
			} else{
				//$("#taskname").addClass("invalidbox").focus();
				showMessage("stop", JS_EXPENSE_INFO + (opts.state == 1 ? JS_SAVE_FAIL : JS_UPDATE_FAIL), JS_ERROR_TIP);
			}
		});
	}catch(e){alert(e);showLoading(false);}
}

function load_mgraccount(usrid){
    if(load1==true) return;
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    try{
        //$("#usrlist tbody tr:odd").removeClass().addClass("oddcolor");
        $.post("manage.ajax.php", {type:1,full:1}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            if(data=="")return;
            var json = eval('(' + data + ')');
            if(typeof json != "undefined" && json.list != null){
                load1 = true;
                usrstate(0);            
                var jo;
                var list = json.list;
				/*have view user purview*/
				purview[purview_account_management] = "V";
				$("#usr_edit,.group_area").css("display", "block");
				
				if(json.pur != null){
					for(var i=0; i<json.pur.length; i++){
						var pur_row = json.pur[i];
						/*User Manager*/
						if(pur_row.pid == purview_user_manager){
							purview[purview_user_manager] = pur_row == null ? null : pur_row.p;
						}
						
						/*User Vehicle Group*/
						if(pur_row.pid == purview_user_group_manager){
							purview[purview_user_group_manager] = pur_row == null ? null : pur_row.p;
						}
					}
				}
					
				if(isAddPurview(purview_user_manager)){
					$("#usr_addnew,#group_addnew").css("visibility", "visible");
				}else{
					$("#usr_addnew,#group_addnew").css("visibility", "hidden");
				}
				
				if(isModPurview(purview_user_manager) && isSavePurview(purview_user_group_manager)){
					$("#group_edit_btn").css("visibility", "visible");
				}else{
					$("#group_edit_btn").css("visibility", "hidden");
				}
				
				if(isDelPurview(purview_user_manager) && isSavePurview(purview_user_group_manager)){
					$("#group_delete").css("visibility", "visible");
				}else{
					$("#group_delete").css("visibility", "hidden");
				}
				            
                $("#usrlist tbody").empty();
                var $tbody = $("<tbody></tbody>").appendTo($("#usrlist"));
				mgraccount_array_uname = [];
				mgraccount_array_login = [];
				mgraccount_array_phone = [];
				
                for(var i = 0; i < list.length; i++)
                {
                    jo = list[i];
                    mgraccount_array_uname.push(jo.uname);
                    mgraccount_array_login.push(jo.login);
					mgraccount_array_phone.push(jo.p);
                    var $tr = $("<tr></tr>").appendTo($tbody);
                    $("<td></td>").text(i+1).attr("usrid", jo.usrid).appendTo($tr);
                    $("<td></td>").text(jo.uname).attr("uname", jo.uname).appendTo($tr);
                    var $td = $("<td data-sort="+jo.valid+"></td>").appendTo($tr);
                    if(jo.valid==1){
                        $td.removeClass().addClass("valid");
                    }else{
                        $td.removeClass().addClass("stopped");
                    }
                    $("<td></td>").text(jo.login).attr("login", jo.login).appendTo($tr);
					$("<td></td>").text(jo.p).attr("phone", jo.p).appendTo($tr);
					$("<td></td>").text(jo.l).appendTo($tr);
                    $td = $("<td></td>").appendTo($tr);
                    var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"usrview('"+jo.usrid+"',0)\"></a>";
                    $(str).attr("href","#").addClass("operate_view").appendTo($td);

					if(isModPurview(purview_user_manager)){
						if(jo.usrid == json.self){
							str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"usrview('"+jo.usrid+"',2,true)\"></a>";
						}else{
							str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"usrview('"+jo.usrid+"',2,false)\"></a>";
						}
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);
					}
					
					if(isDelPurview(purview_user_manager)){
						if(jo.usrid != json.self){
							str = "<a style='padding-left: 30px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelUser('"+jo.usrid+"', 3)\"></a>";
							$(str).attr("href","#").addClass("operate_delete").appendTo($td);
						}
					}
					
					if(jo.usrid != json.self){
						str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_LOGIN_AS_USER+"' onclick=\"loginAsUser('"+jo.usrid+"')\"></a>";
						$(str).attr("href","#").addClass("operate_login_as_user").appendTo($td);
					}
                }
				
                //$("#usrlist tbody tr:odd").removeClass().addClass("oddcolor");
				if($("#mgraccount_item").val() == "1"){
					 $("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_uname,minLength:mgraccount_array_uname.length < 2000 ? 0:2,max:10,scroll:true});
				}else if($("#mgraccount_item").val() == "2"){
					$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_login,minLength:mgraccount_array_login.length < 2000 ? 0:2,max:10,scroll:true});
				}else{
					$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_phone,minLength:mgraccount_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
				}
				
                if(typeof usrid != "undefined"){
                    locate_table("#usrlist", "login", usrid, true);
                }
            }else{
				$("#usr_addnew,#usr_edit,.group_area").css("display", "none");
				$("#group_edit_btn,#group_delete,#group_addnew").css("visibility", "hidden");
			}        
        });
    }catch(e){error(showLoading(false));}
}

function isViewAccountPurview(pid){
	return purview[pid] != null && typeof purview[pid] != "undefined" && purview[pid].indexOf('V') != -1;
}

function isAddPurview(pid){
	return purview[pid] != null && typeof purview[pid] != "undefined" && purview[pid].indexOf('A') != -1;
}

function isModPurview(pid){
	return purview[pid] != null && typeof purview[pid] != "undefined" && purview[pid].indexOf('M') != -1;
}

function isSavePurview(pid){
	return purview[pid] != null && typeof purview[pid] != "undefined" && purview[pid].indexOf('S') != -1;
}

function isDelPurview(pid){
	return purview[pid] != null && typeof purview[pid] != "undefined" && purview[pid].indexOf('D') != -1;
}

function isEmailPurview(pid){
	return purview[pid] != null && typeof purview[pid] != "undefined" && purview[pid].indexOf('R') != -1;
}

function isExpiredPurview(pid){
	return purview[pid] != null && typeof purview[pid] != "undefined" && purview[pid].indexOf('E') != -1;
}

function load_mgraccess(usrid){
    if(load5==true) return;
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    try{
        //$("#pusrlist tbody tr:odd").removeClass().addClass("oddcolor");
        $.get("purview.ajax.php", {type:1}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            if(data=="")return;
            var json = eval('(' + data + ')');
            if(typeof json != "undefined" && json.list != null){
                load5 = true;
                purstate(0);            
                var jo;
                var list = json.list;
				/*have view access purview*/
				$("#purview_edit .icheck").prop("checked", false);
				$("#purview_edit").css("display", "block");
				
				var purviewAll = [];
				//All purview
				if(json.pur != null && json.pur.length > 0){
					for(var i=0;i<json.pur.length;i++){
						purviewAll[json.pur[i].pid] = json.pur[i].p;
					}
				}
				
				/*Account Management*/
				if(purviewAll[3000] != null){
					$("#p_3000").css("display", "block");

					/*User Manager*/
					if(purviewAll[3200] != null){
						if(purviewAll[3200].indexOf("A") != -1){
							$("#account_add_l,#account_add").show();
						}else{
							$("#account_add_l,#account_add").hide();
						}
						//Modify
						if(purviewAll[3200].indexOf("M") != -1){
							$("#account_eidt_l,#account_eidt").show();
						}else{
							$("#account_eidt_l,#account_eidt").hide();
						}
						//Delete
						if(purviewAll[3200].indexOf("D") != -1){
							$("#account_delete_l,#account_delete").show();
						}else{
							$("#account_delete_l,#account_delete").hide();
						}
						//Email
						if(purviewAll[3200].indexOf("R") != -1){
							$("#account_email_l,#account_email").show();
						}else{
							$("#account_email_l,#account_email").hide();
						}
					}else{
						$("#account_add_l,#account_add,#account_eidt_l,#account_eidt,#account_delete_l,#account_delete,#account_email_l,#account_email").hide();
					}
					
					/*User Access Manager*/
					if(purviewAll[3300] != null && purviewAll[3300].indexOf("S") != -1){
						//Save
						$("#access_edit_l,#access_edit").show();
					}else{
						$("#access_edit_l,#access_edit").hide();
					}

					/*User Vehicle Group*/
					if(purviewAll[3400] != null && purviewAll[3400].indexOf("S") != -1){
						//Save
						$("#group_edit_l,#group_edit").show();
					}else{
						$("#group_edit_l,#group_edit").hide();
					}
					
					//User Command
					if(purviewAll[3500] != null && purviewAll[3500].indexOf("S") != -1){
						//Save
						$("#cmd_edit_l,#cmd_edit").show();
						
						$("#usr_cmd").css("display", "block");
						$("#usr_cmd").empty();
						var otree = {showcheck: true, theme:"bbit-tree-lines"};
						otree.data = json.cmds;
						$("#usr_cmd").treeview(otree);
					}else{
						$("#cmd_edit_l,#cmd_edit").hide();
						$("#usr_cmd").css("display", "none");
					}
				}else{
					$("#p_3000,#usr_cmd").css("display", "none");
				}
							
				if(purviewAll[1000] != null){
					$("#p_1000,#p_1300,#p_1700,#p_1800,#p_1900").css("display", "block");
					
					/*Asset Management*/					
					if(purviewAll[1090] != null){
						//Asset Add
						if(purviewAll[1090].indexOf("A") != -1){
							$("#asset_add_l,#asset_add").show();
						}else{
							$("#asset_add_l,#asset_add").hide();
						}
						//Asset Modify
						if(purviewAll[1090].indexOf("M") != -1){
							$("#asset_edit_l,#asset_edit").show();
						}else{
							$("#asset_edit_l,#asset_edit").hide();
						}
						//Asset Delete
						if(purviewAll[1090].indexOf("D") != -1){
							$("#asset_delete_l,#asset_delete").show();
						}else{
							$("#asset_delete_l,#asset_delete").hide();
						}
						//Asset Expired
						if(purviewAll[1090].indexOf("E") != -1){
							$("#asset_expired_l,#asset_expired").show();
						}else{
							$("#asset_expired_l,#asset_expired").hide();
						}												
					}else{
						$("#asset_add_l,#asset_add,#asset_edit_l,#asset_edit,#asset_delete_l,#asset_delete,#asset_expired_l,#asset_expired").hide();
					}
					
					/*Customer Management*/
					if(purviewAll[2100] != null){
						//Customer Add
						if(purviewAll[2100].indexOf("A") != -1){
							$("#cust_add_l,#cust_add").show();
						}else{
							$("#cust_add_l,#cust_add").hide();
						}
						//Customer Modify
						if(purviewAll[2100].indexOf("M") != -1){
							$("#cust_edit_l,#cust_edit").show();
						}else{
							$("#cust_edit_l,#cust_edit").hide();
						}
						//Customer Delete
						if(purviewAll[2100].indexOf("D") != -1){
							$("#cust_delete_l,#cust_delete").show();
						}else{
							$("#cust_delete_l,#cust_delete").hide();
						}
					}else{
						$("#cust_add_l,#cust_add,#cust_edit_l,#cust_edit,#cust_delete_l,#cust_delete").hide();
					}

					/*Driver Management*/
					if(purviewAll[1300] != null){
						//Driver Add
						if(purviewAll[1300].indexOf("A") != -1){
							$("#driver_add_l,#driver_add").show();
						}else{
							$("#driver_add_l,#driver_add").hide();
						}
						//Driver Modify
						if(purviewAll[1300].indexOf("M") != -1){
							$("#driver_edit_l,#driver_modify").show();
						}else{
							$("#driver_edit_l,#driver_modify").hide();
						}
						//Driver Delete
						if(purviewAll[1300].indexOf("D") != -1){
							$("#driver_delete_l,#driver_delete").show();
						}else{
							$("#driver_delete_l,#driver_delete").hide();
						}
					}else{
						$("#driver_add_l,#driver_add,#driver_edit_l,#driver_modify,#driver_delete_l,#driver_delete").hide();
					}
					
					/*Place Management*/
					if(purviewAll[1700] != null){
						//Place Add
						if(purviewAll[1700].indexOf("A") != -1){
							$("#place_add_l,#place_add").show();
						}else{
							$("#place_add_l,#place_add").hide();
						}
						//Place Modify
						if(purviewAll[1700].indexOf("M") != -1){
							$("#place_edit_l,#place_modify").show();
						}else{
							$("#place_edit_l,#place_modify").hide();
						}
						//Place Delete
						if(purviewAll[1700].indexOf("D") != -1){
							$("#place_delete_l,#place_delete").show();
						}else{
							$("#place_delete_l,#place_delete").hide();
						}
					}else{
						$("#place_add_l,#place_add,#place_edit_l,#place_modify,#place_delete_l,#place_delete").hide();
					}
					
					/*Task Management*/
					if(purviewAll[1800] != null){
						//Task Add
						if(purviewAll[1800].indexOf("A") != -1){
							$("#task_add_l,#task_add").show();
						}else{
							$("#task_add_l,#task_add").hide();
						}
						//Task Modify
						if(purviewAll[1800].indexOf("M") != -1){
							$("#task_edit_l,#task_modify").show();
						}else{
							$("#task_edit_l,#task_modify").hide();
						}
						//Task Delete
						if(purviewAll[1800].indexOf("D") != -1){
							$("#task_delete_l,#task_delete").show();
						}else{
							$("#task_delete_l,#task_delete").hide();
						}
					}else{
						$("#task_add_l,#task_add,#task_edit_l,#task_modify,#task_delete_l,#task_delete").hide();
					}
					
					/*Expense Management*/
					if(purviewAll[1900] != null){
						//Expense Add
						if(purviewAll[1900].indexOf("A") != -1){
							$("#expense_add_l,#expense_add").show();
						}else{
							$("#expense_add_l,#expense_add").hide();
						}
						//Expense Modify
						if(purviewAll[1900].indexOf("M") != -1){
							$("#expense_edit_l,#expense_modify").show();
						}else{
							$("#expense_edit_l,#expense_modify").hide();
						}
						//Expense Delete
						if(purviewAll[1900].indexOf("D") != -1){
							$("#expense_delete_l,#expense_delete").show();
						}else{
							$("#expense_delete_l,#expense_delete").hide();
						}
					}else{
						$("#expense_add_l,#expense_add,#expense_edit_l,#expense_modify,#expense_delete_l,#expense_delete").hide();
					}
				}else{
					$("#p_1000,#p_1300,#p_1700,#p_1800,#p_1900").css("display", "none");
				}			
				
                var array_uname = [];
                var array_login = [];
                $("#pusrlist tbody").empty();
                var $tbody = $("<tbody></tbody>").appendTo($("#pusrlist"));
				useraccess_array_uname = [];
				useraccess_array_login = [];
				useraccess_array_phone = [];
				
                for(var i = 0; i < list.length; i++)
                {
                    jo = list[i];
                    useraccess_array_uname.push(jo.uname);
                    useraccess_array_login.push(jo.login);
					useraccess_array_phone.push(jo.p);
                    var $tr = $("<tr></tr>").appendTo($tbody);
                    $("<td></td>").text(i+1).attr("usrid", jo.usrid).appendTo($tr);
                    $("<td></td>").text(jo.uname).attr("uname", jo.uname).appendTo($tr);
                    var $td = $("<td data-sort="+jo.valid+"></td>").appendTo($tr);
                    if(jo.valid==1){
                        $td.removeClass().addClass("valid");
                    }else{
                        $td.removeClass().addClass("stopped");
                    }
                    $("<td></td>").text(jo.login).attr("login", jo.login).appendTo($tr);
					$("<td></td>").text(jo.p).attr("phone", jo.p).appendTo($tr);
					$("<td></td>").text(jo.l).appendTo($tr);
                    $td = $("<td></td>").appendTo($tr);
					
					if(purviewAll[3300] != null){
						var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"purviewview('"+jo.usrid+"',0,true)\"></a>";
						$(str).attr("href","#").addClass("operate_view").appendTo($td);
					}
					
					if(purviewAll[3300] != null && purviewAll[3300].indexOf("S") != -1 && jo.usrid != json.self){
						str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"purviewview('"+jo.usrid+"',1,false)\"></a>";
						$(str).attr("href","#").addClass("operate_edit").appendTo($td);
					}
                }
				
                //$("#pusrlist tbody tr:odd").removeClass().addClass("oddcolor");
				if($("#useraccess_item").val() == "1"){
					 $("#useraccess_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: useraccess_array_uname,minLength:useraccess_array_uname.length < 2000 ? 0:2,max:10,scroll:true});
				}else if($("#useraccess_item").val() == "2"){
					 $("#useraccess_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: useraccess_array_login,minLength:useraccess_array_login.length < 2000 ? 0:2,max:10,scroll:true});
				}else{
					$("#useraccess_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: useraccess_array_phone,minLength:useraccess_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
				}
                if(typeof usrid != "undefined"){
                    locate_table("#pusrlist", "login", usrid, true);
                }
            }else{
				$("#purview_edit").css("display", "none");
			}        
        });
    }catch(e){error(showLoading(false));}
}


function load_mgrvehicle(objid){
    if(load2==true) return;
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    try{
        //$("#devlist tbody tr:odd").removeClass().addClass("oddcolor");
        $.post("manage.ajax.php", {type:2}, function(data) {
            clearTimeout(timer);
			showLoading(false);        
            if(data != ""){
                load2 = true;
                var i;
                var json = eval('(' + data + ')');
				
				/*have recorder purview*/
				if(json.pur != null){
					var recorder_pur = json.pur[0];
					purview[purview_recorder] = recorder_pur == null ? null : recorder_pur.p;
				}
				
				if(isAddPurview(purview_recorder)){
					$("#dev_addnew").css("display", "block");
				}else{
					$("#dev_addnew").css("display", "none");
				}
				
				/*have view asset purview*/
				if(json.list!=null){
					purview[purview_asset_management] = "V";
					$("#dev_edit").css("display", "block");
				}else{
					if(!isAddPurview(purview_recorder)){
						$("#dev_edit").css("display", "none");
					}
				}
				
                //customer list
                dev_cust = json.cust;                        
                //group list
                array_group = new Object();
                dev_group = json.group;
                if(dev_group!=null)
                for(i=0; i<dev_group.length; i++){
                    var g = dev_group[i];
                    array_group[g.id] = g.name;
                }
                //type list            
                array_dtype = new Object();
                dev_type = json.type;
                if(dev_type!=null)
                for(i=0; i<dev_type.length; i++){
                    var t = dev_type[i];
                    array_dtype[t.id] = t.name;
                }
				//driver list
				mgrvehicle_array_driver = [];
				array_dlist = new Object();
				dev_driver = json.dlist;
				if(dev_driver!=null)
				for(i=0; i<dev_driver.length; i++){
                    var t = dev_driver[i];
                    array_dlist[t.jb] = t.jn;
					mgrvehicle_array_driver.push(t.jn);
                }
				
                //kind list
                dev_kind = json.kind;
                devstate(0);
                //object list
				$("#devlist tbody").empty();
                if(json.list!=null){
                    var jo = json.list;
                    var array_device = [];
					var array_deviceno = [];                    
                    var $tbody = $("<tbody></tbody>").appendTo($("#devlist"));
					mgrvehicle_array_flag = [];
					mgrvehicle_array_deviceid = [];
					mgrvehicle_array_phone = [];					
				
                    for(i = 0; i < jo.length; i++)
                    {
                        var o = jo[i];
						mgrvehicle_array_flag.push(o.oflag);
						mgrvehicle_array_deviceid.push(o.devno);
						mgrvehicle_array_phone.push(o.p);						
                        var $tr = $("<tr></tr>").appendTo($tbody);
                        $("<td></td>").text(i+1).attr("objid", o.objid).appendTo($tr);
						$("<td></td>").text(o.oflag).attr("oflag", o.oflag).appendTo($tr);						
	
						var $deviceno_col = $("<td></td>").attr("devno", o.devno).appendTo($tr);
						var $deviceno = $("<span id='deviceno'></span>").text(o.devno).css({"position": "relative", "padding": "5px"}).appendTo($deviceno_col);
						if(o.dstate == 1){
							$("<i></i>").addClass("device_status_in_repair").attr("title",INFO_DEVICE_STATUS_IN_REPAIR).appendTo($deviceno);
						}
						$("<td></td>").text(o.p).attr("phone", o.p).appendTo($tr);				
                        var drname = array_dlist[o.jb];                     
						if(drname != null){							
							$("<td></td>").text(drname).attr("drname", drname).appendTo($tr);
						}else{
							$("<td></td>").text("").appendTo($tr);
						}
						
						var gname = array_group[o.ginfo];
						if(gname != null){							
							$("<td></td>").text(gname).attr("gname", gname).appendTo($tr);
						}else{
							$("<td></td>").text("").appendTo($tr);
						}
						
                        var dname = array_dtype[o.dtype];
                        $("<td></td>").text(dname == null?"":dname).appendTo($tr);
                        if(dname == null)$tr.css("color", "red"); 												
					
                        $("<td></td>").text(o.ztime).appendTo($tr);
						var stamp = $.format.date(o.stamp, JS_DEFAULT_DATE_FMT);
						var estamp = $.format.date(o.estamp, JS_DEFAULT_DATE_FMT);
                        $("<td></td>").html(stamp +'</br>'+ estamp).appendTo($tr);
                        var $td = $("<td></td>").appendTo($tr);
                        var str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_VIEW+"' onclick=\"devview('"+o.objid+"',0)\"></a>";
                        $(str).attr("href","#").addClass("operate_view").appendTo($td);
						
						if(isModPurview(purview_recorder)){
							str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_MODIFY+"' onclick=\"devview('"+o.objid+"',2)\"></a>";
							$(str).attr("href","#").addClass("operate_edit").appendTo($td);
							
							str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_SERVICE+"' onclick=\"dlgServiceInfo('"+o.objid+"')\"></a>";
							$(str).attr("href","#").addClass("operate_service").appendTo($td);
						}
						                       
						if(isDelPurview(purview_recorder)){
							str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_ERASE+"' onclick=\"showEraseHistory('"+o.objid+"')\"></a>";
							$(str).attr("href","#").addClass("operate_erase").appendTo($td);
							
							str = "<a style='padding-left: 20px;' title='"+JS_BUTTON_DELETE+"' onclick=\"showDelObject('"+o.objid+"','"+o.ginfo+"')\"></a>";
							$(str).attr("href","#").addClass("operate_delete").appendTo($td);
						}
                    }
                }
                //$("#devlist tbody tr:odd").removeClass().addClass("oddcolor");

				if($("#mgrvehicle_item").val() == "1"){
					 $("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_flag,minLength:mgrvehicle_array_flag.length < 2000 ? 0:2,max:10,scroll:true});
				}else if($("#mgrvehicle_item").val() == "2"){
					 $("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_deviceid,minLength:mgrvehicle_array_deviceid.length < 2000 ? 0:2,max:10,scroll:true});
				}else if($("#mgrvehicle_item").val() == "3"){
					$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_phone,minLength:mgrvehicle_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
				}else{
					$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_driver,minLength:mgrvehicle_array_driver.length < 2000 ? 0:2,max:10,scroll:true});
				}
				
                if(typeof objid != "undefined"){
                    locate_table("#devlist", "objid", objid, true);
                }
            }else{
				$("#dev_addnew,#dev_edit,#customer_edit,#cust_addnew").css("display", "none");
			}
        });
    }catch(e){error(showLoading(false));}    
}

function load_mgrgeo(zid){
    if(load3==true) return;
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	try{
		//$("#placelist tbody tr:odd").removeClass().addClass("oddcolor");
        $.post("manage.ajax.php", {type:6}, function(data) {
            clearTimeout(timer);
			showLoading(false);        
            if(data != ""){
                load3 = true;
                var i;
                var json = eval('(' + data + ')');
				
				/*have place purview*/
				if(json.pur != null){
					var place_pur = json.pur[0];
					purview[purview_place] = place_pur == null ? null : place_pur.p;
				}
				
				if(isAddPurview(purview_place)){
					$("#mgrplace_addnew").css("display", "block");
				}else{
					$("#mgrplace_addnew").css("display", "none");
				}
				
				/*have view place purview*/
				if(json.list!=null){
					purview[purview_asset_management] = "V";
					$("#place_edit").css("display", "block");
				}else{
					if(!isAddPurview(purview_place)){
						$("#place_edit").css("display", "none");
					}
				}
				
				geostate(0);
				//geo list
				$("#placelist tbody").empty();
                if(json.list != null){
                    var jo = json.list;
                    mgrplace_array_name = [];                   
                    var $tbody = $("<tbody></tbody>").appendTo($("#placelist"));
					
					for(i = 0; i < jo.length; i++)
                    {
                        var o = jo[i];
                        mgrplace_array_name.push(o.an);
                        var $tr = $("<tr></tr>").appendTo($tbody);
                        $("<td></td>").text(i+1).attr("zid", o.zid).appendTo($tr);
                        $("<td></td>").text(o.an).attr("an", o.an).appendTo($tr);
                        $("<td></td>").text(array_atype[o.at]).appendTo($tr);
                        var $td = $("<td></td>").appendTo($tr);
                        var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"geoview('"+o.zid +"',1)\"></a>";
                        $(str).attr("href","#").addClass("operate_view").appendTo($td);						
                        
						if(isModPurview(purview_place)){
							str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"geoview('"+o.zid +"',3)\"></a>";
							$(str).attr("href","#").addClass("operate_edit").appendTo($td);
						}
						
						if(isDelPurview(purview_place)){
							str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelGeo('"+o.zid+"',4)\"></a>";
							$(str).attr("href","#").addClass("operate_delete").appendTo($td);
						}												
                    }
                }
                //$("#placelist tbody tr:odd").removeClass().addClass("oddcolor");
				
				$("#mgrplace_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrplace_array_name,minLength:mgrplace_array_name.length < 2000 ? 0:2,max:10,scroll:true});
				
				if(typeof zid != "undefined"){
                    locate_table("#placelist", "zid", zid, true);
                }
			}else{
				$("#mgrplace_addnew,#place_edit").css("display", "none");
			}
			if(!map_load){
				onLoadGoogle();
				//loadScript("http://ditu.google.cn/maps/api/js?key="+JS_GOOGLE_KEY+"&v=3.21&sensor=false&language="+JS_CURRENT_LANG+"&libraries=drawing&callback=onLoadGoogle");
			}
		});
	}catch(e){error(showLoading(false));}
}

function load_mgrcustomer(custid){
    if(load4==true) return;
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
    try{
        //$("#customerlist tbody tr:odd").removeClass().addClass("oddcolor");
        $.post("manage.ajax.php", {type:9}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            if(data !=""){
				var json = eval('(' + data + ')');
			
				/*have customer purview*/
				if(json.pur != null){
					var customer_pur = json.pur[0];
					purview[purview_customer] = customer_pur == null ? null : customer_pur.p;
				}
				
				if(isAddPurview(purview_customer)){
					$("#cust_addnew").css("display", "block");
				}else{
					$("#cust_addnew").css("display", "none");
				}
				
				/*have view customer purview*/
				if(json.list!=null){
					purview[purview_customer_management] = "V";
					$("#customer_edit").css("display", "block");
				}else{
					if(!isAddPurview(purview_customer)){
						$("#customer_edit").css("display", "none");
					}
				}
				
				if(json != null && typeof json != "undefined"){
					load4 = true;
					custstate(0);            
					var array_cname = [];
					$("#customerlist tbody").empty();
					if(json.list!=null && json.list.length > 0){						
						var jo;
						var $tbody = $("<tbody></tbody>").appendTo($("#customerlist"));
						mgrcustomer_array_name = [];
						mgrcustomer_array_fname = [];
						mgrcustomer_array_phone = [];
						
						for(var i = 0; i < json.list.length; i++)
						{
							jo = json.list[i];
							mgrcustomer_array_name.push(jo.name);
							mgrcustomer_array_fname.push(jo.fname);
							mgrcustomer_array_phone.push(jo.p);
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).attr("custid", jo.id).appendTo($tr);
							$("<td></td>").text(jo.name).attr("name", jo.name).appendTo($tr);
							$("<td></td>").text(jo.fname).attr("fname", jo.fname).appendTo($tr);
							$("<td></td>").text(jo.p).attr("phone", jo.p).appendTo($tr);
							$td = $("<td></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"custview('"+jo.id+"',0)\"></a>";
							$(str).attr("href","#").addClass("operate_view").appendTo($td);
							
							if(isModPurview(purview_customer)){
								str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"custview('"+jo.id+"',2)\"></a>";
								$(str).attr("href","#").addClass("operate_edit").appendTo($td);
							}
							
							if(isDelPurview(purview_customer)){
								str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelCustomer('"+jo.id+"', 3)\"></a>";
								$(str).attr("href","#").addClass("operate_delete").appendTo($td);
							}
						}
						//$("#customerlist tbody tr:odd").removeClass().addClass("oddcolor");
						if($("#mgrcustomer_item").val() == "1"){
							 $("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_name,minLength:mgrcustomer_array_name.length < 2000 ? 0:2,max:10,scroll:true});
						}else if($("#mgrcustomer_item").val() == "2"){
							$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_fname,minLength:mgrcustomer_array_fname.length < 2000 ? 0:2,max:10,scroll:true});
						}else{
							$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_phone,minLength:mgrcustomer_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
						}
						
						if(typeof custid != "undefined"){
							locate_table("#customerlist", "custid", custid, true);
						}
					}
				}
			}else{
				$("#cust_addnew,#customer_edit").css("display", "none");
			} 				
        });
    }catch(e){error(showLoading(false));}
}

function load_mgrdriver(driverid){
    if(load6==true) return;
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	
    try{
        //$("#driverlist tbody tr:odd").removeClass().addClass("oddcolor");
        $.post("manage.driver.ajax.php", {type:11}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            if(data !=""){
				var json = eval('(' + data + ')');
			
				/*have driver purview*/
				if(json.pur != null){
					var driver_pur = json.pur[0];
					purview[purview_driver] = driver_pur == null ? null : driver_pur.p;
				}
				
				if(isAddPurview(purview_driver)){
					$("#driver_addnew").css("display", "block");
				}else{
					$("#driver_addnew").css("display", "none");
				}
				
				/*have view driver purview*/
				if(json.list!=null){
					purview[purview_asset_management] = "V";
					$("#driver_edit").css("display", "block");
				}else{
					if(!isAddPurview(purview_driver)){
						$("#driver_edit").css("display", "none");
					}
				}
				
				$("#driverlist tbody").empty();
				if(json != null && typeof json != "undefined"){
					load6 = true;
					driverstate(0);            
					mgrdriver_array_name = [];
					mgrdriver_array_workid = [];
					mgrdriver_array_phone = [];
					mgrdriver_array_rfid = [];
						
					if(json.list!=null && json.list.length > 0){
						var jo;
						var $tbody = $("<tbody></tbody>").appendTo($("#driverlist"));
						for(var i = 0; i < json.list.length; i++)
						{
							jo = json.list[i];
							mgrdriver_array_name.push(jo.n);
							mgrdriver_array_workid.push(jo.j);
							mgrdriver_array_phone.push(jo.p);
							mgrdriver_array_rfid.push(jo.r);
							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).appendTo($tr);							
							$("<td></td>").text(jo.n).attr("name", jo.n).appendTo($tr);
							$("<td></td>").text(jo.j).attr("jobnumber", jo.j).appendTo($tr);
							$("<td></td>").text(jo.l).attr("license", jo.l).appendTo($tr);
							$("<td></td>").text(jo.r).attr("rfid", jo.r).appendTo($tr);
							$("<td></td>").text(jo.p).attr("phone", jo.p).appendTo($tr);
							$td = $("<td></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"driverview('"+jo.j+"',0)\"></a>";
							$(str).attr("href","#").addClass("operate_view").appendTo($td);
							
							if(isModPurview(purview_driver)){
								str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"driverview('"+jo.j+"',2)\"></a>";
								$(str).attr("href","#").addClass("operate_edit").appendTo($td);
							}
							
							if(isDelPurview(purview_driver)){
								str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelDriver('"+jo.j+"', 3)\"></a>";
								$(str).attr("href","#").addClass("operate_delete").appendTo($td);
							}
						}
						//$("#driverlist tbody tr:odd").removeClass().addClass("oddcolor");
						
						if($("#mgrdriver_item").val() == "1"){
							 $("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_name,minLength:mgrdriver_array_name.length < 2000 ? 0:2,max:10,scroll:true});
						}else if($("#mgrdriver_item").val() == "2"){
							$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_workid,minLength:mgrdriver_array_workid.length < 2000 ? 0:2,max:10,scroll:true});
						}else if($("#mgrdriver_item").val() == "3"){
							$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_rfid,minLength:mgrdriver_array_rfid.length < 2000 ? 0:2,max:10,scroll:true});
						}else{
							$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_phone,minLength:mgrdriver_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
						}
						
						if(typeof driverid != "undefined"){
							locate_table("#driverlist", "jobnumber", driverid, true);
						}
					}
				}
			}else{
				$("#driver_addnew,#driver_edit").css("display", "none");
			} 				
        });
    }catch(e){error(showLoading(false));}
}

function load_mgrtask(taskid){
    if(load7==true) return;
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	
    try{
        //$("#tasklist tbody tr:odd").removeClass().addClass("oddcolor");
        $.post("manage.task.ajax.php", {type:13}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            if(data !=""){
				var json = eval('(' + data + ')');
			
				/*have task purview*/
				if(json.pur != null){
					var task_pur = json.pur[0];
					purview[purview_task] = task_pur == null ? null : task_pur.p;
				}
				
				if(isAddPurview(purview_task)){
					$("#task_addnew").css("display", "block");
				}else{
					$("#task_addnew").css("display", "none");
				}
				
				/*have view task purview*/
				if(json.tlist!=null){
					purview[purview_asset_management] = "V";
					$("#task_edit").css("display", "block");
				}else{
					if(!isAddPurview(purview_task)){
						$("#task_edit").css("display", "none");
					}
				}
				
				$("#tasklist tbody").empty();
				if(json != null && typeof json != "undefined"){
					load7 = true;
					taskstate(0);             
					mgrtask_array_name = [];
					
					if(json.plist!=null && json.plist.length > 0){
						window.parent.JS_PLACE_NAME4ID.splice(0,window.parent.JS_PLACE_NAME4ID.length);
						
						for(var i = 0; i < json.plist.length; i++){
							var jo;
							jo = json.plist[i];
							window.parent.JS_PLACE_NAME4ID[jo.zid] = jo.an;
						}
					}
						
					if(json.tlist!=null && json.tlist.length > 0){
						var jo;												
						var $tbody = $("<tbody></tbody>").appendTo($("#tasklist"));
						for(var i = 0; i < json.tlist.length; i++)
						{
							jo = json.tlist[i];
							mgrtask_array_name.push(jo.tn);

							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).attr("tid", jo.tid).appendTo($tr);							
							$("<td></td>").text(jo.tn).attr("name", jo.tn).appendTo($tr);
							$("<td></td>").text(getFlagById(jo.oid)).attr("flag", getFlagById(jo.oid)).appendTo($tr);
							if(jo.p == 0){
								$("<td></td>").text(INFO_TASK_PRIORITY_LOW).attr("p", jo.p).appendTo($tr);
							}else if(jo.p == 1){
								$("<td></td>").text(INFO_TASK_PRIORITY_NORMAL).attr("p", jo.p).appendTo($tr);
							}else{
								$("<td></td>").text(INFO_TASK_PRIORITY_HIGHT).attr("p", jo.p).appendTo($tr);
							}
							
							if(jo.s == 0){
								$("<td></td>").text(INFO_TASK_STATUS_NEW).attr("s", jo.s).appendTo($tr);
							}else if(jo.s == 1){
								$("<td></td>").text(INFO_TASK_STATUS_IN_PROGRESS).attr("s", jo.s).appendTo($tr);
							}else if(jo.s == 2){
								$("<td></td>").text(INFO_TASK_STATUS_COMPLETED).attr("s", jo.s).appendTo($tr);
							}else {
								$("<td></td>").text(INFO_TASK_STATUS_FAIL).attr("s", jo.s).appendTo($tr);
							}
							
							$("<td></td>").text(getPlaceById(jo.sid)).attr("sid", jo.sid).appendTo($tr);
							$("<td></td>").text(getPlaceById(jo.eid)).attr("eid", jo.sid).appendTo($tr);
							$td = $("<td></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"taskview('"+jo.tid+"','"+jo.oid+"',0)\"></a>";
							$(str).attr("href","#").addClass("operate_view").appendTo($td);
							
							if(isModPurview(purview_task)){
								str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"taskview('"+jo.tid+"','"+jo.oid+"',2)\"></a>";
								$(str).attr("href","#").addClass("operate_edit").appendTo($td);
							}
							
							if(isDelPurview(purview_task)){
								str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelTask('"+jo.tid+"','"+jo.oid+"', 3)\"></a>";
								$(str).attr("href","#").addClass("operate_delete").appendTo($td);
							}
						}
						//$("#tasklist tbody tr:odd").removeClass().addClass("oddcolor");
						
						if($("#mgrtask_item").val() == "1"){
							 $("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrtask_array_name,minLength:mgrtask_array_name.length < 2000 ? 0:2,max:10,scroll:true});
						}else{
							var deviceList = getDeviceList();
							$("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
						}
						
						if(typeof taskid != "undefined"){
							locate_table("#tasklist", "tid", taskid, true);
						}
					}
				}
			}else{
				$("#task_addnew,#task_edit").css("display", "none");
			} 				
        });
    }catch(e){error(showLoading(false));}
}

function load_mgrexpense(expenseid){
    if(load8==true) return;
    showLoading(true);
	var timer = setTimeout("showLoading(false,true)", requestTimeout);
	
    try{
        //$("#expenselist tbody tr:odd").removeClass().addClass("oddcolor");
        $.post("manage.expense.ajax.php", {type:1}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            if(data !=""){
				var json = eval('(' + data + ')');
			
				/*have expense purview*/
				if(json.pur != null){
					var expense_pur = json.pur[0];
					purview[purview_expense] = expense_pur == null ? null : expense_pur.p;
				}
				
				if(isAddPurview(purview_expense)){
					$("#expense_addnew").css("display", "block");
				}else{
					$("#expense_addnew").css("display", "none");
				}
				
				/*have view expense purview*/
				if(json.elist!=null){
					purview[purview_asset_management] = "V";
					$("#expense_edit").css("display", "block");
				}else{
					if(!isAddPurview(purview_expense)){
						$("#expense_edit").css("display", "none");
					}
				}
				
				$("#expenselist tbody").empty();
				if(json != null && typeof json != "undefined"){
					load8 = true;
					expensestate(0);             
					mgrexpense_array_name = [];									
						
					if(json.elist!=null && json.elist.length > 0){
						var jo;												
						var $tbody = $("<tbody></tbody>").appendTo($("#expenselist"));
						for(var i = 0; i < json.elist.length; i++)
						{
							jo = json.elist[i];
							mgrexpense_array_name.push(jo.en);

							var $tr = $("<tr></tr>").appendTo($tbody);
							$("<td></td>").text(i+1).attr("eid", jo.eid).appendTo($tr);	
							$("<td></td>").text(jo.d).appendTo($tr);	
							$("<td></td>").text(jo.en).attr("name", jo.en).appendTo($tr);
							$("<td></td>").text(getFlagById(jo.oid)).attr("flag", getFlagById(jo.oid)).appendTo($tr);
							$("<td></td>").text(jo.q).appendTo($tr);
							$("<td></td>").text(jo.c).appendTo($tr);
							$("<td></td>").text(jo.s).appendTo($tr);							
							$("<td></td>").text(jo.b).appendTo($tr);
							
							$td = $("<td></td>").appendTo($tr);
							var str = "<a style='padding-left: 20px;' title="+JS_BUTTON_VIEW+" onclick=\"expenseview('"+jo.eid+"','"+jo.oid+"',0)\"></a>";
							$(str).attr("href","#").addClass("operate_view").appendTo($td);
							
							if(isModPurview(purview_expense)){
								str = "<a style='padding-left: 20px;' title="+JS_BUTTON_MODIFY+" onclick=\"expenseview('"+jo.eid+"','"+jo.oid+"',2)\"></a>";
								$(str).attr("href","#").addClass("operate_edit").appendTo($td);
							}
							
							if(isDelPurview(purview_expense)){
								str = "<a style='padding-left: 20px;' title="+JS_BUTTON_DELETE+" onclick=\"showDelExpense('"+jo.eid+"','"+jo.oid+"', 3)\"></a>";
								$(str).attr("href","#").addClass("operate_delete").appendTo($td);
							}
						}
						//$("#expenselist tbody tr:odd").removeClass().addClass("oddcolor");
						
						if($("#mgrexpense_item").val() == "1"){
							 $("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrexpense_array_name,minLength:mgrexpense_array_name.length < 2000 ? 0:2,max:10,scroll:true});
						}else{
							var deviceList = getDeviceList();
							$("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
						}
						
						if(typeof expenseid != "undefined"){
							locate_table("#expenselist", "eid", expenseid, true);
						}
					}
				}
			}else{
				$("#expense_addnew,#expense_edit").css("display", "none");
			} 				
        });
    }catch(e){error(showLoading(false));}
}

function tabChange(idx){
    switch(idx){
        case 1:
            load_mgraccount();
            break;
        case 2:
            load_mgrvehicle();
            break;
		case 3:
			load_mgrgeo();
			break;
		case 4:
			load_mgrcustomer();
			break;
		case 5:
			load_mgraccess();
			break;
		case 6:
			load_mgrdriver();
			break;			
		case 7:
			load_mgrtask();
			break;
		case 8:
			load_mgrexpense();
			break;	
    }
}

function SetColor(){
	if(ext != null){
		ext.SetColor($("#mgrplace_color").val());
	}	
}

function oninit() {
	var WP = window.parent;
	purview = [];
	loadcalendar();
	$("#tab_useraccess").toggle();
	$("#tab_mgrcustomer").toggle();
    $("#tab_mgrvehicle").toggle();
	$("#tab_mgrdriver").toggle();
	$("#tab_mgrplace").toggle();
	$("#tab_mgrtask").toggle();
	$("#tab_mgrexpense").toggle();
    $("#group_addnew").click(function(){        
        showAddGroup();
    });
	 $("#group_edit_btn").click(function(){        
        showEditGroup();
    });
	$("#group_delete").click(function(){        
        showDelGroup();
    });		
	
    /*user search*/
    $("#usr_search").click(function(){
        var mgraccount_cond = $("#mgraccount_cond").val();
		var mgraccount_item = $("#mgraccount_item").val();
        if(mgraccount_cond == "")return;       

        if(mgraccount_item == "1"){
            locate_table("#usrlist", "uname", mgraccount_cond, true);
        }else if(mgraccount_item == "2"){
            locate_table("#usrlist", "login", mgraccount_cond, true);
        }else{
			locate_table("#usrlist", "phone", mgraccount_cond, true);
		}
    });
	
	$('#mgraccount_item').change(function () {
		if($("#mgraccount_item").val() == "1"){
			$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_uname,minLength:mgraccount_array_uname.length < 2000 ? 0:2,max:10,scroll:true});
		}else if($("#mgraccount_item").val() == "2"){
			$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_login,minLength:mgraccount_array_login.length < 2000 ? 0:2,max:10,scroll:true});
		}else{
			$("#mgraccount_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgraccount_array_phone,minLength:mgraccount_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
		}
	});
    
    $("#usr_addnew").click(function(){
        locate_table("#usrlist", "", "", true);
        $("#uname,#login,#upass,#email,#uphone,#olimit").val("");
		$("#rmail").prop("checked", false);
        $("#rtime").val("11:00");
        $("#valid").prop("checked", true);
		selectreport.setValue([]);		
        usrstate(1);//new
        $("#usr_group").empty();
        current_userid=0;
        load_groups(current_userid, true, $("#serach_gname").val());
    });
    $("#usr_save").bind("click", function(){usrsubmit(1);});
    $("#usr_update").bind("click", function(){usrsubmit(2);});
    $("#usr_cancel").click(function(){usrstate(0);});//cancel
	
	selectreport = new vanillaSelectBox("#selectreport", {
        "maxHeight": 300, 
		"minWidth": 171,
        "search": false,
		"disableSelectAll": false,
		"placeHolder": JS_INFO_SELECT,
        "translations": { "all": JS_SELECT_ALL_ITEM, "items": JS_SELECT_ITEMS,"selectAll":'['+JS_SELECT_ALL+']',"clearAll":'['+JS_SELECT_CLEAR_ALL+']' }
    });
    
	/*user purview search*/
    $("#pusr_search").click(function(){
        var useraccess_item = $("#useraccess_item").val();
        var useraccess_cond = $("#useraccess_cond").val();
        if(useraccess_cond == "")return;
		
		if(useraccess_item == "1"){
            locate_table("#pusrlist", "uname", useraccess_cond, true);
        }else if(useraccess_item == "2"){
            locate_table("#pusrlist", "login", useraccess_cond, true);
        }else{
			locate_table("#pusrlist", "phone", useraccess_cond, true);
		}
    });
	
	$('#useraccess_item').change(function () {
		if($("#useraccess_item").val() == "1"){
			$("#useraccess_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: useraccess_array_uname,minLength:useraccess_array_uname.length < 2000 ? 0:2,max:10,scroll:true});
		}else if($("#useraccess_item").val() == "2"){
			$("#useraccess_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: useraccess_array_login,minLength:useraccess_array_login.length < 2000 ? 0:2,max:10,scroll:true});
		}else{
			$("#useraccess_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: useraccess_array_phone,minLength:useraccess_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
		}
	});
    
    $("#purview_update").bind("click", function(){purviewsubmit(1);});
    $("#purview_cancel").click(function(){purstate(0);});//cancel
	
	/*group search*/
    $("#group_filter").click(function(){
		var isedit = false;
		if($("#usr_addnew").attr("disabled")){
			isedit = true;
		}
        load_groups(0, isedit, $("#serach_gname").val());
    });
	
    /*vehicle search*/
    $("#dev_search").click(function(){
		var mgrvehicle_item = $("#mgrvehicle_item").val();
        var mgrvehicle_cond = $("#mgrvehicle_cond").val();
        if(mgrvehicle_cond == "")return;
		
		if(mgrvehicle_item == "1"){
            locate_table("#devlist", "oflag", mgrvehicle_cond, true);
        }else if(mgrvehicle_item == "2"){
            locate_table("#devlist", "devno", mgrvehicle_cond, true);
        }else if(mgrvehicle_item == "3"){
			locate_table("#devlist", "phone", mgrvehicle_cond, true);
		}else{
			locate_table("#devlist", "drname", mgrvehicle_cond, true);
		}
    });
	
	$('#mgrvehicle_item').change(function () {
		if($("#mgrvehicle_item").val() == "1"){
			$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_flag,minLength:mgrvehicle_array_flag.length < 2000 ? 0:2,max:10,scroll:true});
		}else if($("#mgrvehicle_item").val() == "2"){
			$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_deviceid,minLength:mgrvehicle_array_deviceid.length < 2000 ? 0:2,max:10,scroll:true});
		}else if($("#mgrvehicle_item").val() == "3"){
			$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_phone,minLength:mgrvehicle_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
		}else{
			$("#mgrvehicle_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrvehicle_array_driver,minLength:mgrvehicle_array_driver.length < 2000 ? 0:2,max:10,scroll:true});
		}
	});
	
    $("#dev_addnew").click(function(){
        locate_table("#devlist", "oflag", "", true);
		$("#oflag,#uflag,#devno,#simno,#stamp").val("");
        devstate(1);//new
        current_objid=0;
        devfill();
		objectKind.setSelectedIndex(0);
    });
    $("#dev_save").bind("click", function(){devsubmit(1);});
    $("#dev_update").bind("click", function(){devsubmit(2);});
    $("#dev_cancel").click(function(){devstate(0);});//cancel
	
	$("#licenseissuedate").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});
	$("#licenseexpiredate").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});	
	$("#stamp").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});	
	$("#estamp").datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});
	
	/*driver search*/
	$("#driver_search").click(function(){
		var mgrdriver_item = $("#mgrdriver_item").val();
        var mgrdriver_cond = $("#mgrdriver_cond").val();
        if(mgrdriver_cond == "")return;
		
		if(mgrdriver_item == "1"){
            locate_table("#driverlist", "name", mgrdriver_cond, true);
        }else if(mgrdriver_item == "2"){
            locate_table("#driverlist", "jobnumber", mgrdriver_cond, true);
        }else if(mgrdriver_item == "3"){
            locate_table("#driverlist", "rfid", mgrdriver_cond, true);
        }else{
			locate_table("#driverlist", "phone", mgrdriver_cond, true);
		}
    });
	
	$('#mgrdriver_item').change(function () {
		if($("#mgrdriver_item").val() == "1"){
			$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_name,minLength:mgrdriver_array_name.length < 2000 ? 0:2,max:10,scroll:true});
		}else if($("#mgrdriver_item").val() == "2"){
			$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_workid,minLength:mgrdriver_array_workid.length < 2000 ? 0:2,max:10,scroll:true});
		}else if($("#mgrdriver_item").val() == "3"){
			$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_rfid,minLength:mgrdriver_array_rfid.length < 2000 ? 0:2,max:10,scroll:true});
		}else{
			$("#mgrdriver_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrdriver_array_phone,minLength:mgrdriver_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
		}
	});
	
	$("#driver_addnew").click(function(){
        locate_table("#driverlist", "name", "", true);
        driverstate(1);//new
        current_jobnumber=0;
    });
	$("#driver_save").bind("click", function(){driversubmit(1);});
	$("#driver_update").bind("click", function(){driversubmit(2);});
    $("#driver_cancel").click(function(){driverstate(0);});//cancel
	driverfill();
	
	/*geo search*/
    $("#mgrplace_search").click(function(){
		var mgrplace_item = $("#mgrplace_item").val();
        var mgrplace_cond = $("#mgrplace_cond").val();
        if(mgrplace_cond == "")return;
		
		if(mgrplace_item == "1"){
            locate_table("#placelist", "an", mgrplace_cond, true);
        }
    });
	
	$('#mgrplace_item').change(function () {
		if($("#mgrplace_item").val() == "1"){
			$("#mgrplace_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrplace_array_name,minLength:mgrplace_array_name.length < 2000 ? 0:2,max:10,scroll:true});
		}
	});
	
	$("#mgrplace_addnew").click(function(){
        locate_table("#placelist", "oflag", "", true);
        geostate(2);//new
        current_zid=0;
    });
	$("#place_save").bind("click", function(){geosubmit(1);});
	$("#place_update").bind("click", function(){geosubmit(2);});
    $("#place_cancel").click(function(){geostate(0);});//cancel 
	geofill();
	
	/*customer search*/
    $("#cust_search").click(function(){
        var mgrcustomer_item = $("#mgrcustomer_item").val();
        var mgrcustomer_cond = $("#mgrcustomer_cond").val();
        if(mgrcustomer_cond == "")return;
		
		if(mgrcustomer_item == "1"){
            locate_table("#customerlist", "name", mgrcustomer_cond, true);
        }else if(mgrcustomer_item == "2"){
            locate_table("#customerlist", "fname", mgrcustomer_cond, true);
        }else{
			locate_table("#customerlist", "phone", mgrcustomer_cond, true);
		}
    });
	
	$('#mgrcustomer_item').change(function () {
		if($("#mgrcustomer_item").val() == "1"){
			$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_name,minLength:mgrcustomer_array_name.length < 2000 ? 0:2,max:10,scroll:true});
		}else if($("#mgrcustomer_item").val() == "2"){
			$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_fname,minLength:mgrcustomer_array_fname.length < 2000 ? 0:2,max:10,scroll:true});
		}else{
			$("#mgrcustomer_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrcustomer_array_phone,minLength:mgrcustomer_array_phone.length < 2000 ? 0:2,max:10,scroll:true});
		}
	});
	
	$("#cust_addnew").click(function(){
        locate_table("#customerlist", "name", "", true);
        custstate(1);//new
        current_custid=0;
    });
	$("#cust_save").bind("click", function(){custsubmit(1);});
	$("#cust_update").bind("click", function(){custsubmit(2);});
    $("#cust_cancel").click(function(){custstate(0);});//cancel

	/*task search*/
	$("#task_search").click(function(){
		var mgrtask_item = $("#mgrtask_item").val();
        var mgrtask_cond = $("#mgrtask_cond").val();
        if(mgrtask_cond == "")return;
		
		if(mgrtask_item == "1"){
            locate_table("#tasklist", "name", mgrtask_cond, true);
        }else{
			locate_table("#tasklist", "flag", mgrtask_cond, true);
		}
    });
	
	$('#mgrtask_item').change(function () {
		if($("#mgrtask_item").val() == "1"){
			$("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrtask_array_name,minLength:mgrtask_array_name.length < 2000 ? 0:2,max:10,scroll:true});
		}else{
			var deviceList = getDeviceList();
			$("#mgrtask_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
		}
	});
	
	$("#task_addnew").click(function(){
        locate_table("#tasklist", "name", "", true);
        taskstate(1);//new
        current_taskid=0;
		taskfill();
    });
	$("#task_save").bind("click", function(){tasksubmit(1);});
	$("#task_update").bind("click", function(){tasksubmit(2);});
    $("#task_cancel").click(function(){taskstate(0);});//cancel
	
	$("#taskstartf").datetimepicker({
		dateFormat: "yy-mm-dd",
		timeFormat: "HH:mm:ss",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});
	$("#taskstartt").datetimepicker({
		dateFormat: "yy-mm-dd",
		timeFormat: "HH:mm:ss",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});
	$("#taskendf").datetimepicker({
		dateFormat: "yy-mm-dd",
		timeFormat: "HH:mm:ss",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});
	$("#taskendt").datetimepicker({
		dateFormat: "yy-mm-dd",
		timeFormat: "HH:mm:ss",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});
	taskfill();
	
	/*expense search*/
	$("#expense_search").click(function(){
		var mgrexpense_item = $("#mgrexpense_item").val();
        var mgrexpense_cond = $("#mgrexpense_cond").val();
        if(mgrexpense_cond == "")return;
		
		if(mgrexpense_item == "1"){
            locate_table("#expenselist", "name", mgrexpense_cond, true);
        }else{
			locate_table("#expenselist", "flag", mgrexpense_cond, true);
		}
    });
	
	$('#mgrexpense_item').change(function () {
		if($("#mgrexpense_item").val() == "1"){
			$("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: mgrexpense_array_name,minLength:mgrexpense_array_name.length < 2000 ? 0:2,max:10,scroll:true});
		}else{
			var deviceList = getDeviceList();
			$("#mgrexpense_cond").focus(function(){$(this).autocomplete('search', $(this).val())}).autocomplete({source: deviceList,minLength:deviceList.length < 2000 ? 0:2,max:10,scroll:true});
		}
	});
	
	$("#expense_addnew").click(function(){
        locate_table("#expenselist", "name", "", true);
        expensestate(1);//new
        current_expenseid=0;
		expensefill();
    });
	$("#expense_save").bind("click", function(){expensesubmit(1);});
	$("#expense_update").bind("click", function(){expensesubmit(2);});
    $("#expense_cancel").click(function(){expensestate(0);});//cancel
	
	$("#expensedate").datetimepicker({
		dateFormat: "yy-mm-dd",
		timeFormat: "HH:mm:ss",
		changeMonth: true,
		changeYear: true,
		yearRange: "-20:+20"
	});
	expensefill();
	
	/*event search*/
    $("#event_search").click(function(){
		var mgrevent_item = $("#mgrevent_item").val();
        var mgrevent_cond = $("#mgrevent_cond").val();
        if(mgrevent_cond == "")return;
		
		if(mgrevent_item == "1"){
            locate_table("#customized_event", "en", mgrevent_cond, true);
        }
    });
	
	/*sensor search*/
    $("#sensor_search").click(function(){
		var mgrsensor_item = $("#mgrsensor_item").val();
        var mgrsensor_cond = $("#mgrsensor_cond").val();
        if(mgrsensor_cond == "")return;
		
		if(mgrsensor_item == "1"){
            locate_table("#sensor_list", "sn", mgrsensor_cond, true);
        }
    });
	
	/*service place search*/
    $("#service_place_search").click(function(){
		var service_place_item = $("#service_place_item").val();
        var service_place_cond = $("#service_place_cond").val();
        if(service_place_cond == "")return;
		
		if(service_place_item == "1"){
            locate_table("#service_place", "an", service_place_cond, true);
        }
    });
	
    load_mgraccount();
    $("#usr_group").empty();
	$("#usr_cmd").empty();
	load_groups(current_userid, false, $("#serach_gname").val());
	
	$('#statetable').multiselect({
		columns: 3,
		placeholder: JS_SELECT,
		texts: {
			selectedOptions: JS_SELECTED
		},
		searchOptions: {
			'default': 'Search States'
		},
		selectAll: false,
		search: false,
		maxPlaceholderWidth: 170,
		maxHeight: 20
	});
	
	/*init icon*/
	objectKind = new IconSelect("okind", 
		{'selectedIconWidth':24,
		'selectedIconHeight':24,
		'selectedBoxPadding':1,
		'iconsWidth':24,
		'iconsHeight':24,
		'boxIconSpace':1,
		'vectoralIconNumber':4,
		'horizontalIconNumber':4});	
	
	objectKind.refresh(WP.getIcons());
	$("#okind").css("pointer-events", "none");
	
	$dlg = $("#dlg_services");
	$dlg.find("#speedalarm_text").append("("+WP.UNIT_SPEED+")");
	$dlg.find("#min-moving-speed-text").append("("+WP.UNIT_SPEED+")");
	$dlg.find("#min-idle-speed-text").append("("+WP.UNIT_SPEED+")");
	$dlg.find("#obdmileage-text").append("("+WP.UNIT_DIST+")");
	$dlg.find("#mil-maintenance-text").append("("+WP.UNIT_DIST+")");
	$dlg.find("#fuel-capacity-text").append("("+WP.UNIT_FUEL+")");
	$dlg.find("#allowtempfrom_text").append("("+WP.UNIT_TEMP+")");
	$dlg.find("#allowtempto_text").append("("+WP.UNIT_TEMP+")");
	$dlg = $("#dlg_event");
	$dlg.find("#event_speed_limit_text").append(" ("+WP.UNIT_SPEED+")");
	$dlg.find("#event_distance_text").append(" ("+WP.UNIT_DIST+")");
	
	$("#lbrpinsidespeed").append("("+WP.UNIT_SPEED+")");
	
	$("#mil-maintenance-add").click(function(){
		addCustMaintenance(1);
	});
	
	$("#eng-maintenance-add").click(function(){
		addCustMaintenance(2);
	});
	
	$("#day-maintenance-add").click(function(){
		addCustMaintenance(3);
	});
	
	$("#export_usr").bind("click", function(e){
		WP.exportFileName = JS_MANAGE_MGRACCOUNT;
		WP.exportTableId = "usrlist";
		$("#mnuOperat").hide();
		$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
		$("#mnuOperat").show();	
	});
	
	$("#export_cust").bind("click", function(e){
		WP.exportFileName = JS_MANAGE_MGRCUSTOMER;
		WP.exportTableId = "customerlist";
		$("#mnuOperat").hide();
		$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
		$("#mnuOperat").show();	
	});
	
	$("#export_dev").bind("click", function(e){
		WP.exportFileName = JS_MANAGE_MGRVEHICLE;
		WP.exportTableId = "devlist";
		$("#mnuOperat").hide();
		$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
		$("#mnuOperat").show();	
	});
	
	$("#export_driver").bind("click", function(e){
		WP.exportFileName = JS_MANAGE_MGRDRIVER;
		WP.exportTableId = "driverlist";
		$("#mnuOperat").hide();
		$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
		$("#mnuOperat").show();	
	});
	
	$("#export_expense").bind("click", function(e){
		WP.exportFileName = JS_MANAGE_MGREXPENSE;
		WP.exportTableId = "expenselist";
		$("#mnuOperat").hide();
		$("#mnuOperat").css({'top':e.pageY,'left':e.pageX});
		$("#mnuOperat").show();	
	});
		
}

function addCustMaintenance(type, enable, value, name, last){
	var $tr = $("#mil-maintenance");
	if(type == 2){
		$tr = $("#eng-maintenance");
	}else if(type == 3){
		$tr = $("#day-maintenance");
	}
	
	var $trn = $tr.clone().addClass("custtype").attr("custtype",type);
	
	$trn.find("td:eq(1) input").removeAttr("id").prop("checked", enable == "undefined" ? false : (enable == 1 ? true : false));
	$trn.find("td:eq(2) input").removeAttr("id").val(value == "undefined" ? "" : value);
	$trn.find("td:eq(3) input").removeAttr("id").val(name == "undefined" ? "" : name);
	$trn.find("td:eq(4) input").removeAttr("id").val(last == "undefined" ? "" : last);
	$trn.find("td:eq(5) input").removeAttr("id").val("-");
	
	if(type == 3){
		$trn.find("td:eq(4)").remove();
		$tdn = "<td><input type='text' class='itime itext enablebox' style='width:140px; height: 20px;' readonly='true'></td>";
		$trn.find("td:eq(3)").after($tdn);	
		$trn.find("td:eq(4) input").val((last == "1900-01-01" || typeof last == "undefined") ? "":last.split(" ")[0]);
		
		$trn.find("td:eq(4) input").datepicker({
			dateFormat: "yy-mm-dd",
			changeMonth: true,
			changeYear: true,
			yearRange: "-20:+20"
		});
	}
	
	$trn.find("td:eq(5) input").click(function(){
		$trn.remove();
	});
	
	$tr.after($trn);
}

function getCustMaintenance(){
	var WP = window.parent;
	var $custmaint = "";
	
	$("#tab_maintenance table tr.custtype").each(function(i, value) {
		var $type = $(value).attr("custtype");
		var $enable = $(value).find("td:eq(1) input").prop("checked") ? 1 : 0;
		var $value = $(value).find("td:eq(2) input").val().replace(/,/g,"，").replace(/;/g,"；");
		var $name = $(value).find("td:eq(3) input").val().replace(/,/g,"，").replace(/;/g,"；");		
		var $last = $(value).find("td:eq(4) input").val().replace(/,/g,"，").replace(/;/g,"；");	
		
		if(($value != "undefined" && $value.length > 0) || ($name != "undefined" && $name.length > 0) || ($last != "undefined" && $last.length > 0)){
			if($type == 3){
				$custmaint = $custmaint + $type +","+ $enable +","+ $value +","+ $name +","+ $last  + " 00:00:00" + ";";
			}else if($type == 1){
				if(WP.JS_UNIT_DISTANCE == 1){
					$value = (parseFloat($value) * 1.609344).toFixed(0);
					$last = (parseFloat($last) * 1.609344).toFixed(0);
				}else if(WP.JS_UNIT_DISTANCE == 2){
					$value = (parseFloat($value) * 1.852).toFixed(0);
					$last = (parseFloat($last) * 1.852).toFixed(0);
				}
				
				$custmaint = $custmaint + $type +","+ $enable +","+ $value +","+ $name +","+ $last + ";";
			}else{
				$custmaint = $custmaint + $type +","+ $enable +","+ $value +","+ $name +","+ $last + ";";
			}			
		}
	});
	
	return $custmaint;
}

function cleanCustMaintenance(){
	$("#tab_maintenance table tr.custtype").each(function(){
		$(this).remove();
	});
}

function initCustMaintenance(custmstr){
	if(typeof custmstr != "undefined" && custmstr != null && custmstr.length > 0){
		var WP = window.parent;
		var custms = custmstr.split(";");
		for(var i = 0; i < custms.length; i++){
			if(typeof custms[i] != "undefined" && custms[i] != null && custms[i].length > 0){
				var custm = custms[i].split(",");			
				if(custm.length == 5){
					if(custm[0] == "1"){
						custm[2] = mileageUnitConversion(parseInt(custm[2])*10,WP.JS_UNIT_DISTANCE).toFixed(0);
						custm[4] = mileageUnitConversion(parseInt(custm[4])*10,WP.JS_UNIT_DISTANCE).toFixed(0);
					}
					addCustMaintenance(custm[0], custm[1], custm[2], custm[3], custm[4]);
				}
			}			
		}
	}
}

function readFile(button) {
	if (button.files && button.files[0]) {
		var fileSize = button.files[0].size;
		var fileName = button.files[0].name.toUpperCase();
		if(fileSize > 10 * 1024){
			showMessage("stop", JS_DRIVER_INFO +' '+ JS_UPDATE_FAIL, JS_PHOTO_SIZE_TIP);
			return;
		}
		if(!fileName.match("JPG$") && !fileName.match("JPEG$")){
			showMessage("stop", JS_DRIVER_INFO +' '+ JS_UPDATE_FAIL, JS_PHOTO_TYPE_TIP);
			return;
		}
		
		var FR = new FileReader();
		FR.addEventListener("load", function(e) {			
			$("#driverph").attr("src", e.target.result); 
			$("#driverph").css( { "width" : driver_photo_width,"height" : driver_photo_height });
			current_driver_photo = e.target.result;
		}); 
		FR.readAsDataURL(button.files[0]);
    }
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
    map = new MapOperat("place_map", opts, true, false, false);
	ext = new MapExtend(map.GetMap(), false, true);
    $("#loadmapwait").css("display", "none");
	map_load = true;
	
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
}

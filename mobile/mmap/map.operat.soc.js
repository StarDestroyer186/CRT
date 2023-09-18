function MapOperat(container, opts, mylocation, extbar, history) {
	this.markers = [];
	this.zoneMarkers = [];
	this.drivers = [];
	this.drivers4jb = [];
	this.extbar = extbar;
	this.mylocation = mylocation;
	this.history = history;
	this.historyid = 0;
	var container_div = document.getElementById(container);
	this.map_obj = new MapClassImpl(container_div, opts, mylocation, extbar, history, this.drivers4jb);
//    var bar_div = document.createElement("div");
//    bar_div.id = "mapsearchbar";
//    container_div.appendChild(bar_div);
//    var edt = doucument.createElement("input");
//    edt.setAttribute("id","mapsearchtext");
//    edt.setAttribute("type","text");
//    bar_div.appendChild(edt);
	
}
MapOperat.prototype = {
	SetHistoryId: function(historyid){
		this.historyid = historyid;
	},
	SetHistoryMode: function(mode){
		this.map_obj.SetHistoryMode(mode);
	},	
	ActiveTaskPathTool: function(active, points, message){
		this.map_obj.ActiveTaskPathTool(active, points, message);
	},
	ActiveMeasureTool: function(active){
		this.map_obj.ActiveMeasureTool(active);
	},
	ActiveRulerTool: function(active){
		this.map_obj.ActiveRulerTool(active);
	},
	AddEvent: function(name, event){
		this.map_obj.AddEvent(name, event);
	},    
	Free: function() {
		this.map_obj.Free();
		this.map_obj = null;
		this.markers = null
	},
	Center: function(lat, lng, zoom) {
		try {
			this.map_obj.Center(lat, lng, zoom);
		} catch(e) {}
	},
	Zoom: function(zoom){
		try {
			this.map_obj.Zoom(zoom);
		} catch(e) {}
	},
	GetMap: function(){
		return this.map_obj.GetMap();
	},
	GeoNames: function(x, y, element, style, geocoders, isAsync) {
		try {
			this.map_obj.GeoNames(x, y, element, style, geocoders, isAsync)
		} catch(e) {}
	},
	ClosePopup: function(){
		this.map_obj.ClosePopup();
	},
	GetIdValue: function(id, io){
		if(id == null || id.length < 1 || io == null || io.length < 1){
			return null;
		}
		
		var ios = io.split(",");
		for(var i = 0; i < ios.length; i++){
			var key4val = ios[i].split(":");
			if(ios[i].indexOf(id) == 0 && key4val.length == 2){
				return key4val[1].length == 0 ? null:key4val[1];
			}
		}
		return null;
	},
	MoveTop: function(marker){
		this.map_obj.MoveTop(marker);
	},
	DrawIcon: function(keyid, title, nc, si, v, x, y, ico, sta, dir, time, stime, spd, alarm, view, s, st, io, dt, jb, dn, du) {
		var first = false;
		var driverChange = false;
		try {
			var WP = window.parent;
			if (typeof this.map_obj != "undefined" && x != null && x != 0 && y != null && y != 0) {
				var acc_state = "--";
				var fuel = "--";
				var fuel2 = "--";
				var fuelstr;
				var temp = "--";
				var temp2 = "--";
				var tempstr;
				var battery = "--";
				var weight = "--";
				var gsm = "--";
				var gps= "--";
				var passenger = "--";
				var odometer = "--";
				var ndrvdef = WP.JS_NO_DRIVER;
				var idrvdef = "<img src='../img/none driver.png' alt='null' height='89' width='80'>";
				
				/*check driver info*/
				if(jb != null && typeof jb != "undefined" && jb.length > 0){
					var driver = this.drivers[keyid];
					/*get same driver*/
					if(!driver){
						driver = this.drivers4jb[jb];
						if(driver){
							this.drivers[keyid] = driver;
						}						
					}
					
					if (!driver || driver.jb != jb || driver.name != dn) {
						var driver = {
							jb: jb,
							name: dn,
							img:idrvdef
						};
						this.drivers[keyid] = driver;
						driverChange = true;
						
						idrvdef = driver.img;
						ndrvdef = dn;
					}else{
						idrvdef = driver.img;
						ndrvdef = dn;
					}
					this.drivers4jb[jb] = driver;
					
					//如果加上条件&& keyid == -1000,只有点击车辆和报警状态才查询一次司机
					var that = this;
					if(driverChange/* && keyid == -1000*/){
						$.get("../driver.image.ajax.php", {jb:jb}, function(data) {
							 if(data != 'none'){
								 driver.img = data;
								 that.drivers4jb[jb] = driver;
							 }
							 that.DrawIcon(keyid, title, nc, si, v, x, y, ico, sta, dir, time, stime, spd, alarm, view, s, st, io, dt, jb, dn, du);
						});
					}
				}
				
				if(st != null && typeof st != "undefined" && st.length > 0){
					if(st.indexOf('3005') >= 0){
						acc_state = WP.JS_ENGINE_ON;
					}else if(st.indexOf('3006') >= 0){
						acc_state = WP.JS_ENGINE_OFF;
					}
				}
				
				if(io != null && typeof io != "undefined" && io.length > 0){
					/*gsm and gps*/
					var oneIoVal = this.GetIdValue("15:", io);
					if(oneIoVal != null){
						gsm = parseFloat(oneIoVal);
					}
					
					oneIoVal = this.GetIdValue("14:", io);
					if(oneIoVal != null){
						gps = parseFloat(oneIoVal);
					}
					
					/*passenger*/
					oneIoVal = this.GetIdValue("1C:", io);
					if(oneIoVal != null){
						passenger = parseFloat(oneIoVal);
					}
					
					/*fuel*/
					oneIoVal = this.GetIdValue("1E:", io);
					if(oneIoVal != null){
						/*if(WP.JS_UNIT_FUEL == 1){
							oneIoVal = parseFloat(oneIoVal) * 0.2199692;
						}*/
						oneIoVal = fuelUnitConversion(oneIoVal, WP.JS_UNIT_FUEL);
						fuel = oneIoVal/*parseFloat(oneIoVal)*/.toFixed(0);
					}

					/*fuel2*/
					oneIoVal = this.GetIdValue("1F:", io);
					if(oneIoVal != null){
						/*if(WP.JS_UNIT_FUEL == 1){
							oneIoVal = parseFloat(oneIoVal) * 0.2199692;
						}*/
						oneIoVal = fuelUnitConversion(oneIoVal, WP.JS_UNIT_FUEL);
						fuel2 = oneIoVal/*parseFloat(oneIoVal)*/.toFixed(0);
					}
					fuelstr = (fuel + ',' + fuel2 + WP.UNIT_FUEL).replace("--,","").replace(",--","");	
					
					/*odometer*/
					oneIoVal = this.GetIdValue("A:", io);
					if(oneIoVal != null){
						/*if(WP.JS_UNIT_DISTANCE == 1){
							oneIoVal = parseFloat(oneIoVal) * 0.6213712;
						}else if(WP.JS_UNIT_DISTANCE == 2){
							oneIoVal = parseFloat(oneIoVal) * 0.5399568;
						}*/
						oneIoVal = mileageUnitConversion(oneIoVal, WP.JS_UNIT_DISTANCE);
						odometer = oneIoVal/*(parseFloat(oneIoVal)/10).toFixed(1)*/ +"&nbsp;"+ WP.UNIT_DIST;
					}

					//temperature
					oneIoVal = this.GetIdValue("48:", io);
					if(oneIoVal != null){
						/*if(WP.JS_UNIT_TEMPERATURE == 1){
							oneIoVal = (parseFloat(oneIoVal)/10) * 1.8 + 32;
						}else{
							oneIoVal =  parseFloat(oneIoVal)/10;
						}*/
						temp = tempUnitConversion(oneIoVal, WP.JS_UNIT_TEMPERATURE);
						temp = temp/*(parseFloat(oneIoVal))*/.toFixed(1);
					}
					
					//temperature2
					oneIoVal = this.GetIdValue("49:", io);
					if(oneIoVal != null){
						/*if(WP.JS_UNIT_TEMPERATURE == 1){
							oneIoVal = (parseFloat(oneIoVal)/10) * 1.8 + 32;
						}else{
							oneIoVal =  parseFloat(oneIoVal)/10;
						}*/
						temp2 = tempUnitConversion(oneIoVal, WP.JS_UNIT_TEMPERATURE);
						temp2 = temp2/*(parseFloat(oneIoVal))*/.toFixed(1);
					}
					tempstr = (temp + ',' + temp2 + WP.UNIT_TEMP).replace("--,","").replace(",--","");
					
					var status = WP.getStatusById(keyid);
					/*battery*/
					var batIndex = WP.getElementIndex("1",io);					
					battery = WP.getStatusByIndex(batIndex, status);										

					/*weight*/
					var wegIndex = WP.getElementIndex("63",io);					
					weight = WP.getStatusByIndex(wegIndex, status);	
				}
				
				/*title*/
				var tips = "<div class='infowindow'>" +
					       "<h3>" + title + "</h3>";
				
				/*driver info*/				
				var speedmeterId = "sta_speedometer_" + keyid;
				if(this.extbar == true || this.historyid != keyid){
					
					tips += "<div class='infodriver'>" +
							"<ul>" +
							"<li id='idrvdef_"+keyid+"'>" +
							idrvdef +
							"</li>"+
							"<li class='ndrvdef' id='ndrvdef_"+keyid+"'>" +
							ndrvdef+
							"</li>"+	
							"<li>" +
							"<canvas id='"+speedmeterId+"' style='max-width: 100px; max-height: 50px; margin-left: -10px; margin-top: -5px; margin-right: 0px; margin-bottom: -35px;'></canvas><label style='margin-left:4px; margin-top:-62px;'><span>" + s + UNIT_SPEED+"</span></label>" +
							"</li>"+
							"</ul>"+
							"</div>";
				}
				
				/*moving or static time*/
				var moving_static_time = null;
				var moving_time = this.GetIdValue("7:", io);
				var static_time = this.GetIdValue("8:", io);
				
				if(moving_time != null){
					moving_static_time = s + WP.UNIT_SPEED + " (" + second2time(moving_time) +")";
				}
				if(static_time != null){
					moving_static_time = s + WP.UNIT_SPEED + " (" + second2time(static_time) +")";
				}
				if(moving_static_time == null){
					moving_static_time = spd;
				}
				
				/*base info*/
				tips += "<div class='infobase'>"+
					    "<ul>";
				
				if(s > 0 || moving_time != null){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/move.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + moving_static_time + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/parked.svg) no-repeat 0px; background-size : 19px 19px;'>" + " <span>" + "&nbsp;&nbsp;" + moving_static_time + "</span></li>";
				}				
				
				if(this.extbar == true && this.historyid != keyid){
					tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + time + "</span></li>" +
					"<li class='odometer'>" + " <span>" + "&nbsp;&nbsp;" + odometer + "</span></li>" +
					"<li>" + "<span class='infogps'>" + gps + "</span>&nbsp;&nbsp;<span class='infogsm'>" + gsm + "</span>&nbsp;&nbsp;<span class='infopassenger'>" + passenger + "</span></li>" +
					//"<li class='infogsm'>" + " <span>" + "&nbsp;&nbsp;" + gsm + "</span></li>" +					
					"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;<a style ='color: #4D8ED9; text-decoration: none;' target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q=" + (y / 1000000).toFixed(5) + "," + (x / 1000000).toFixed(5) + ">" +  (y / 1000000).toFixed(5) + " &#176;," + (x / 1000000).toFixed(5) + " &#176;</a></span></li>"+																
					"<li class='infoaddress' id='infoaddress_"+keyid+"'></li>"+
					"<li><a href='#' class='button history' onfocus='this.blur();' title='"+WP.JS_HISTORY+"' onClick='menuselect(7,\""+keyid+"\");'></a>"+
					    "<a href='#' class='button objinfo' onfocus='this.blur();' title='"+WP.JS_CMD_OBJINFO+"' onClick='menuselect(1,\""+keyid+"\");'></a>"+
						"<a href='#' class='button sendcmd' onfocus='this.blur();' title='"+WP.JS_CMD_SENDCMD+"' onClick='menuselect(2,\""+keyid+"\","+dt+");'></a>";
					/*camera*/
					tips += "<a href='#' class='button lastpic' onfocus='this.blur();' title='"+WP.JS_LAST_PHOTO+"' onClick='menuselect(4,\""+keyid+"\");'></a>";
					tips += "<a href='#' class='button lastvoice' onfocus='this.blur();' title='"+WP.JS_LAST_VOICE+"' onClick='menuselect(5,\""+keyid+"\");'></a>";
					tips += "<a href='#' class='button shareposition' onfocus='this.blur();' title='"+WP.JS_SHARE_POSITION+"' onClick='menuselect(6,\""+keyid+"\",-1,"+ y +","+ x +",\""+time+"\");'></a>";
                    if(alarm>0){
                        tips += "<a href='#' class='button altifno' onfocus='this.blur();' title='"+WP.JS_CMD_ALTINFO+"' onClick='menuselect(3,\""+keyid+"\");'></a>";
                    }
					tips += "</li>";
					tips += "<li>";
					tips += "<a href='#' class='button opengmap' onfocus='this.blur();' onClick='mapsSelector("+(y/1000000).toFixed(5)+","+(x/1000000).toFixed(5)+")'></a>";
                    tips += "<a href='#' class='button openwmap' onfocus='this.blur();' onClick='openWaze("+(y/1000000).toFixed(5)+","+(x/1000000).toFixed(5)+")'></a>";
					tips += "</li>";
					tips += "</ul></div>";
				}else{
					tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + time + "</span></li>" +
					"<li class='odometer'>" + " <span>" + "&nbsp;&nbsp;" + odometer + "</span></li>" +
					"<li>" + " <span class='infogps'>" + gps + "</span>&nbsp;&nbsp;<span class='infogsm'>" + gsm + "</span>&nbsp;&nbsp;<span class='infopassenger'>" + passenger + "</span></li>" +
					//"<li class='infogsm'>" + " <span>" + "&nbsp;&nbsp;" + gsm + "</span></li>" +					
					"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;<a style ='color: #4D8ED9; text-decoration: none;' target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q=" + (y / 1000000).toFixed(5) + "," + (x / 1000000).toFixed(5) + ">" +  (y / 1000000).toFixed(5) + " &#176;," + (x / 1000000).toFixed(5) + " &#176;</a></span></li>";		
					tips += "</ul></div>";
				}				
				
				/*bottom info*/
				if(this.extbar == true || this.historyid != keyid){
					tips += "<div class='infobottom'>" +
						    "<ul>";
					if(st != null && typeof st != "undefined" && st.length > 0){
						/*ACC state*/
						if(st.indexOf('3005') >= 0){
							tips +=	"<li class='infoacc' style='padding-left: 18px; background: url(../img/engine_on.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;" + acc_state + "</span></li>";
						}else if(st.indexOf('3006') >= 0){
							tips +=	"<li class='infoacc' style='padding-left: 18px; background: url(../img/engine_off.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;" + acc_state + "</span></li>";
						}else{
							tips += "<li class='infoacc'>" + " <span>" + "&nbsp;" + acc_state +  "</span></li>";
						}
					}else{
						tips += "<li class='infoacc'>" + " <span>" + "&nbsp;" + acc_state +  "</span></li>";
					}

					tips += "<li class='infofuel'>" + " <span>" + "&nbsp;" + fuelstr + "</span></li>" +	
							"<li class='infotemp'>" + " <span>" + "&nbsp;" + tempstr + "</span></li>" +
							"<li class='infovolt'>" + " <span>" + "&nbsp;" + battery + "</span></li>" +
							"<li class='infoweight'>" + " <span>" + "&nbsp;" + weight + "</span></li>" +
							"</ul>"+
							"</div>";
				}
				tips += "</div>";								
				
				var marker = this.markers[keyid];
				if (!marker) {
					marker = this.map_obj.NewMarker(keyid, title, nc, si, x, y, ico, sta, dir, tips, view, this.extbar, s, time, stime, st, io, dt, jb, dn);
					this.markers[keyid] = marker;
                    first = true
				} else {
					this.map_obj.UpdateMarker(marker, title, nc, si, x, y, ico, sta, dir, tips, view, s, time, stime, st, io, dt, jb, dn, du);
				}
			}
			tips = null;
			WP = null
		} catch(e) {}
        return first
	},
	DrawTrackLine: function(keyid, tracks, opts, stops, nstops, events, nevents, nangles, ntimes, moves, du) {
		try {
			this.map_obj.DrawTrackLine(keyid, tracks, opts, stops, nstops, events, nevents, nangles, ntimes, moves, du)
		} catch(e) {}
	},
	ShowHideMovesLine: function(keyid, start, end, show){
		try {
			this.map_obj.ShowHideMovesLine(keyid, start, end, show)
		} catch(e) {}
	},
	ShowHideTrackLine: function(keyid, show){
		try {
			this.map_obj.ShowHideTrackLine(keyid, show)
		} catch(e) {}
	},
	ShowHideAveragePoint: function(show){
		try {
			this.map_obj.ShowHideAveragePoint(show)
		} catch(e) {}
	},
	GetMarker: function(keyid){
		return this.markers[keyid];
	},
	AddTrackPoint: function(keyid, x, y, s, t, d, opts, du) { 
		try {
			this.map_obj.AddTrackPoint(keyid, x, y, s, t, d, opts, du)
		} catch(e) {}
	},
	GetAndRemoveMarker: function(keyid){
		var marker = this.markers[keyid];
		this.RemoveMarker(keyid);
		
		for(var i = 0; i < this.markers.length; i++) {
			if(this.markers[i] == marker) {
			    this.markers.splice(i, 1);
			    break;
			}
		}
		return marker;
	},
	AddMarker: function(keyid, marker){
		this.markers[keyid] = marker;
		try {
			this.map_obj.AddMarker(marker)
		} catch(e) {}
	},
	LocateMarker: function(keyid, center, zoomIn, bound) {	
        var marker = this.markers[keyid];
		if (marker && typeof this.map_obj != "undefined") {
			this.map_obj.LocateMarker(marker, center, zoomIn, bound);
		}
		return marker
	},
	LocateEventMarker: function(index){
		var marker = this.map_obj.GetEventMarker(index);
		if (marker && typeof this.map_obj != "undefined") {
			this.map_obj.LocateMarker(marker, true, false, false, true)
		}		
	},
	LocateStopMarker: function(index){
		var marker = this.map_obj.GetStopMarker(index);
		if (marker && typeof this.map_obj != "undefined") {
			this.map_obj.LocateMarker(marker, true, false, false, true)
		}		
	},
	LocateStartMarker: function(){
		var marker = this.map_obj.GetStartMarker();
		if (marker && typeof this.map_obj != "undefined") {
			this.map_obj.LocateMarker(marker, true, false, false, true)
		}		
	},
	LocateEndMarker: function(){
		var marker = this.map_obj.GetEndMarker();
		if (marker && typeof this.map_obj != "undefined") {
			this.map_obj.LocateMarker(marker, true, false, false, true)
		}		
	},
	LinkMarker: function(keyid){
		var ret = { x: 0, y: 0 };
        var marker = this.markers[keyid];
		if (marker && typeof this.map_obj != "undefined") {
			//ret = this.map_obj.LinkMarker(marker)
		}
	},
	RemoveMarker: function(keyid){        
		this.map_obj.RemoveMarker(this.markers[keyid]);
		delete this.markers[keyid]
	},
	RemoveTrack: function(keyid) {
		this.map_obj.RemoveTrack(keyid)
	},
	ClearTrack: function(keyid) {
		this.map_obj.ClearTrack(keyid)
	},
	ClearMarkers: function() {
		this.map_obj.ClearMarker(this.markers);
		this.markers = []
	},
	MarkersFitBounds: function() {
		this.map_obj.MarkersFitBounds(this.markers);
	},
	HideShowMarker: function(show, keyid) {
		if(typeof keyid != "undefined"){
			var marker = this.markers[keyid];
			if (marker) {
				var markers = [];
				markers[keyid] = marker;
				this.map_obj.HideShowMarker(markers, show);
			}
		}else{
			this.map_obj.HideShowMarker(this.markers, show);
		}	
	},
	ClustersMarker: function(clusters){
		this.map_obj.ClustersMarker(clusters);
	},
	RefreshClusters: function(){
		this.map_obj.RefreshClusters();
	},
	ToggleMarkerTooltip: function(active){
		this.map_obj.ToggleMarkerTooltip(this.markers, active);
	},
	ToggleStopLayer: function(active){
		this.map_obj.ToggleStopLayer(active);
	},
	ToggleEventLayer: function(active){
		this.map_obj.ToggleEventLayer(active);
	},
	ToggleAngleLayer: function(active){
		this.map_obj.ToggleAngleLayer(active);
	},
	ToggleTimesLayer: function(active){
		this.map_obj.ToggleTimesLayer(active);
	},
	ToggleDriver:  function(active){
		this.map_obj.ToggleDriver(this.markers, active);
	},
	ResizeMapContainer: function(){
		this.map_obj.ResizeMapContainer();
	},
	ToggleSnapLayer: function(active){
		return this.map_obj.ToggleSnapLayer(active);
	},
	DisplayMyLocation: function(position, needCenter){
		return this.map_obj.DisplayMyLocation(position, needCenter);
	},
	HideMyLocation: function(){
		return this.map_obj.HideMyLocation();
	}
}
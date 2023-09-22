function MapClassImpl(container, opts, mylocation, extbar, history) {
	google.maps.visualRefresh = false;
	var g = google.maps;

	this.opts_poly = {
		strokeColor: opts.lineColor || "#f00",
		strokeOpacity: opts.lineOpacity || 0.8,
		strokeWeight: opts.lineWidth || 6,
		point: true
	}
	this.def_save_points = 50;
	this.measureTool;
	this.markerCluster;
	this.isClusters = true;
	this.isShowMarkers = true;
	this.markerManager;
	this.markers = [];
	this.anglePoints = [];
	this.timePoints = [];
	this.trackpts = [];
	this.stopValidMins = 5;
	var mapOpts = {
		center: new g.LatLng(opts.centerLat, opts.centerLng),
		zoom: opts.zoom,
		mapTypeId: g.MapTypeId.ROADMAP,
		streetViewControl: true,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		streetViewControl: true,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		},
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		},
		scaleControl: true
		
        /*mapTypeId: g.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: [ g.MapTypeId.ROADMAP, g.MapTypeId.SATELLITE],
            style: g.MapTypeControlStyle.DROPDOWN_MENU
        }*/
	};
	this.wndMap = new g.Map(container, mapOpts);
    this.lastMarker = null;
	var map = this.wndMap;
	var marker;

	this.wndTip = new g.InfoWindow({maxWidth:350});
	var infowindow = this.wndTip;
	g.event.addListener(this.wndTip, 'closeclick', function() {
		infowindow.isOpen = false
	});
	if(mylocation == true){
		var $box = $('<div id="mylocation" />').appendTo(container);
		$("#mylocation").click(function(){
		    var mylocation = getLocation();
		    var mylocation_marker = new google.maps.Marker({
								 map: map,
								 position: new google.maps.LatLng(mylocation.lat, mylocation.lng),
								 title: JS_MYLOCATION
							 });
			this.wndMap.setCenter(mylocation_marker.position);
		});
	}
	
	if(extbar == true || history == true){
		var $legdiv = $('<div id="legdiv" />').appendTo(container);
		var $tbody = $("<tbody></tbody>").appendTo($legdiv);
		var $trspeed = $("<tr></tr>").appendTo($tbody);
        $("<td width='30'></td>").text(0).appendTo($trspeed);
		$("<td width='30'></td>").text(40).appendTo($trspeed);
		$("<td width='30'></td>").text(80).appendTo($trspeed);
		$("<td width='30'></td>").text(90).appendTo($trspeed);
		$("<td width='30'></td>").text(120).appendTo($trspeed);
		
		var $trcolor = $("<tr></tr>").appendTo($tbody);
		$("<td height='5' bgcolor='#5DFEFE'></td>").appendTo($trcolor);
		$("<td height='5' bgcolor='#0096FE'></td>").appendTo($trcolor);
		$("<td height='5' bgcolor='#3200FF'></td>").appendTo($trcolor);
		$("<td height='5' bgcolor='#9A009C'></td>").appendTo($trcolor);
		$("<td height='5' bgcolor='#FF002A'></td>").appendTo($trcolor);
	}
	
	if(extbar == true){
		var $maptools = $('<div id="maptools" />').appendTo(container);
		var $tbody = $("<table></table>").appendTo($maptools);
		var $trtool1 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_asset' class='tool_active' height='12px' width='12px' src='../../img/tool_object-arrow.svg'/></td>").appendTo($trtool1);
		var $trtool4 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_clusters' class='tool_active' height='12px' width='12px' src='../../img/tool_clusters.svg'/></td>").appendTo($trtool4);
	}
	
	var mcOptions = {
		gridSize: 50, 
		maxZoom: 15,
		styles: [
		{
			url: '../img/clustericon.svg',
			textColor: 'white',
			height: 53,
			width: 52
		},
		{
			url: '../img/clustericon.svg',
			textColor: 'white',
			height: 56,
			width: 55
		},
		{
			url: '../img/clustericon.svg',
			textColor: 'white',
			height: 66,
			width: 65
		}]
	};
	this.markerCluster = new MarkerClusterer(this.wndMap, this.markers, mcOptions);
	
	this.markerManager = new MarkerManager(this.wndMap);
}
	
MapClassImpl.prototype = {
	getDirPoint: function(dir) {
		switch (Math.round(dir / 45)) {
			case 1: return { x: 30, y: 00 }
			case 2: return { x: 30, y: 15 }
			case 3: return { x: 30, y: 30 }
			case 4: return { x: 15, y: 30 }
			case 5: return { x: 00, y: 30 }
			case 6: return { x: 00, y: 15 }
			case 7: return { x: 00, y: 00 }
			default: return { x: 15, y: 00 }
		}
	},
	getDirPath: function(dir) {
		switch (Math.round(dir / 45)) {
			case 1: return '../img/locate/d1.png'
			case 2: return '../img/locate/d2.png' 
			case 3: return '../img/locate/d3.png' 
			case 4: return '../img/locate/d4.png'
			case 5: return '../img/locate/d5.png'
			case 6: return '../img/locate/d6.png'
			case 7: return '../img/locate/d7.png'
			default: return '../img/locate/d0.png'
		}
	},
	AddControl: function(control){
		control.setMap(this.wndMap);
	},
	ActiveMeasureTool: function(active){
		if(active){
			this.measureTool.start();
		}else{
			this.measureTool.end();
		}
	},
	AddEvent: function(name, event){
		google.maps.event.addListener(this.wndMap, name, event);
	},
	Free: function() {
		this.trackpts = null;
		this.wndMap = null;
		this.wndTip = null
	},
	Center: function(lat, lng, zoom) {
		var pt = new google.maps.LatLng(lat, lng);
		this.wndMap.setCenter(pt);
		if(zoom != 0){
			this.wndMap.setZoom(zoom);
		}
	},
	Zoom: function(zoom){
		if(zoom != 0){
			this.wndMap.setZoom(zoom);
		}
	},
	GetMap: function(){
		return this.wndMap;
	},
	GeoNames: function(x, y, element, style) {
		var g = google.maps;
		var pt = new g.LatLng(y / 1000000, x / 1000000);
		var geocoder = new g.Geocoder();
		try {
			geocoder.geocode({ "latLng": pt }, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK && results[1]) {
					var ret = results[0].formatted_address;
					try {
						if (style == "text") {
							element.text(ret)
						} else if (style == "val") {
							element.val(ret)
						} else if (style == "html") {
							element.htmll(ret)
						}
					} catch(e) {}
					geocoder = null
				}else{
					//if google fail, then use ArcGis
					var url = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location="+x / 1000000.0+","+y / 1000000.0+"&f=pjson";
					$.get(url, function(data){
						if(data != null && typeof data != "undefined"){
							var result = eval('(' + data + ')');
							if(result.address != null && typeof result.address != "undefined"){
								var ret = result.address.Address;
								try {
									if (style == "text") {
										element.text(ret)
									} else if (style == "val") {
										element.val(ret)
									} else if (style == "html") {
										element.htmll(ret)
									}
								} catch(e) {}
							}
						}
					});					
				}
			})
		} catch(e) {
			geocoder = null
		}
	},
    MoveTop: function(marker){
        if(this.lastMarker != null){
            this.lastMarker.setZIndex(0);
        }
        this.lastMarker = marker;
        marker.setZIndex(1000);
    },
	NewMarker: function(title, x, y, ico, sta, dir, tips, view, extbar, speed, time) {
		var g = google.maps;
		var pt = new g.LatLng(y / 1000000, x / 1000000);
		var a = this.getDirPoint(dir);
		var image;
		if(ico == 2){
			image = {
				url: "../img/icon_truck.svg",
				scaledSize: new google.maps.Size(28,28),
				anchor: new google.maps.Point(13, 37)
			};
		}else if(ico == 3){
			image = {
				url: "../img/icon_bus.svg",
				scaledSize: new google.maps.Size(28,28),
				anchor: new google.maps.Point(13, 37)
			};
		}else if(ico == 4){
			image = {
				url: "../img/icon_taxi.svg",
				scaledSize: new google.maps.Size(30,30),
				anchor: new google.maps.Point(13, 37)
			};
		}else if(ico == 5){
			image = {
				url: "../img/icon_bicycle.svg",
				scaledSize: new google.maps.Size(32,32),
				anchor: new google.maps.Point(13, 36)
			};
		}else if(ico == 6){
			image = {
				url: "../img/icon_man.svg",
				scaledSize: new google.maps.Size(25,25),
				anchor: new google.maps.Point(13, 37)
			};
		}else if(ico == 7){
			image = {
				url: "../img/icon_boat.svg",
				scaledSize: new google.maps.Size(32,32),
				anchor: new google.maps.Point(13, 37)
			};
		}else if(ico == 8){
			image = {
				url: "../img/icon_asset.svg",
				scaledSize: new google.maps.Size(25,25),
				anchor: new google.maps.Point(13, 37)
			};
		}else{
			image = {
				url: "../img/icon_car.svg",
				scaledSize: new google.maps.Size(32,32),
				anchor: new google.maps.Point(13, 37)
			};
		}

		var iconLabel = "<div style='text-align: left; padding-left: 25px; background: transparent url("+this.getDirPath(dir)+") no-repeat 4px center;'><b>"+title+" </b><br/>";

		var marker = new MarkerWithLabel({
			position: pt,
			map: this.wndMap,
			tip: this.wndTip,
			clickable: true,
			draggable: false,
			icon: image,
			title: title,
			content: tips,
			x: x,
			y: y,
			ico: ico,
			sta: sta,
			dir: dir,
			s: speed,
			t: time,
			labelContent: iconLabel,
            labelAnchor: new g.Point(13, 10),
			labelClass: "labels", // the CSS class for the label
            labelStyle: {opacity: 0.7},
			labelVisible: true
		});
        var self = this;
		g.event.addListener(marker, "click", function() {            
            self.MoveTop(marker);
			this.tip.setContent(marker.content);
			this.tip.open(this.map, marker);
			this.tip.isOpen = true
		});

        if(typeof view != "undefined" && view == true){
            if(!this.wndMap.getBounds().contains(marker.position)){
                this.wndMap.setCenter(marker.position)
            }
        }
		this.markerCluster.addMarker(marker, true);
		this.MoveTop(marker);
		return marker
	},
	UpdateMarker: function(marker, title, x, y, ico, sta, dir, tips, view, speed, time) {
		var g = google.maps;
		if ((marker.x != x || marker.y != y)) {
			var pt = new g.LatLng(y / 1000000, x / 1000000);
			marker.setPosition(pt);
			marker.x = x;
			marker.y = y
		}
		if (marker.ico != ico || marker.sta != sta) {
			var image;
			if(ico == 2){
				image = {
					url: "../img/icon_truck.svg",
					scaledSize: new google.maps.Size(28,28),
					anchor: new google.maps.Point(13, 37)
				};
			}else if(ico == 3){
				image = {
					url: "../img/icon_bus.svg",
					scaledSize: new google.maps.Size(28,28),
					anchor: new google.maps.Point(13, 37)
				};
			}else if(ico == 4){
				image = {
					url: "../img/icon_taxi.svg",
					scaledSize: new google.maps.Size(30,30),
					anchor: new google.maps.Point(13, 37)
				};
			}else if(ico == 5){
				image = {
					url: "../img/icon_bicycle.svg",
					scaledSize: new google.maps.Size(32,32),
					anchor: new google.maps.Point(13, 36)
				};
			}else if(ico == 6){
				image = {
					url: "../img/icon_man.svg",
					scaledSize: new google.maps.Size(25,25),
					anchor: new google.maps.Point(13, 37)
				};
			}else if(ico == 7){
				image = {
					url: "../img/icon_boat.svg",
					scaledSize: new google.maps.Size(32,32),
					anchor: new google.maps.Point(13, 37)
				};
			}else if(ico == 8){
				image = {
					url: "../img/icon_asset.svg",
					scaledSize: new google.maps.Size(25,25),
					anchor: new google.maps.Point(13, 37)
				};
			}else{
				image = {
					url: "../img/icon_car.svg",
					scaledSize: new google.maps.Size(32,32),
					anchor: new google.maps.Point(13, 37)
				};
			}
			
			marker.setIcon(image);
			marker.ico = ico;
			marker.sta = sta
		}
		if (marker.dir != dir) {
			var a = this.getDirPoint(dir);
			var iconLabel = "<div style='text-align: left; padding-left: 25px; background: transparent url("+this.getDirPath(dir)+") no-repeat 4px center;'><b>"+title+" </b><br/>";
			marker.labelContent = iconLabel;
			try {
				marker.label.draw();
			} catch(e) {}
			var shadow = new g.MarkerImage("../img/direction.png", new g.Size(15, 15), new g.Point(a.x, a.y), new g.Point(7, 7));
			marker.setShadow(shadow);
			marker.dir = dir
		}
		if (marker.s != speed) {
            marker.s = speed
        }
		if (marker.t != time) {
            marker.t = time
        }
        if (marker.title != title) {
            marker.title = title
        }
		if (marker.content != tips) {
			marker.content = tips
		}
        if(typeof view != "undefined" && view == true){
            this.MoveTop(marker);
            if(!this.wndMap.getBounds().contains(marker.position)){
                this.wndMap.setCenter(marker.position)
            }
        }	
	},
	AddLine: function(x1, y1, x2, y2, color, weight, opacity) {
		if(x1 != x2 || y1 != y2){
			var route = [];
			var g = google.maps;
			route[0] = new g.LatLng(y1 / 1000000, x1 / 1000000);
			route[1] = new g.LatLng(y2 / 1000000, x2 / 1000000);
			var line = new g.Polyline({
				path: route,
				strokeColor: color || this.opts_poly.strokeColor,
				strokeOpacity: opacity || this.opts_poly.strokeOpacity,
				strokeWeight: weight || this.opts_poly.strokeWeight
			});
			line.setMap(this.wndMap);
			return line;
		}else{
			return null;
		}
	},
	AddPoint: function(fx, fy, fd, x, y, s, t, d, tp, st, et, dut, ad){
		if (x != 0 && y !=0 && (tp  ==1 || tp == 2 || tp == 6 || fx != x || fy != y)){
			var g = google.maps;
			var markerType = 0;
			var pt = tp == 1 || tp == 3 || tp == 6 ? new g.LatLng(fy / 1000000, fx / 1000000) : new g.LatLng(y / 1000000, x / 1000000);
			var image;
			var tips = "";
			
			switch(tp)
			{
			case 1:
			    //start
			    image = {
					url: "../img/start_icon.png",
					size: new g.Size(39, 50),
					origin: new g.Point(0, 0),
					anchor: new g.Point(20, 50)
				}
				tips +="<div class='infowindow'>"+"<ul>";
				tips += "<h3>" + JS_START_POINT + "</h3>";
				var p = getSpeedState(1, 1, s, t);//defaul online and gpsvalid
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/move.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/park.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  y / 1000000 + "," + x / 1000000 + "</span></li>";
				tips += "</ul></div>";
			    break;
			case 2:
			    //end
			    image = {
					url: "../img/finish_icon.png",
					size: new g.Size(39, 50),
					origin: new g.Point(0, 0),
					anchor: new g.Point(20, 50)
				}
				tips +="<div class='infowindow'>"+"<ul>";
				tips += "<h3>" + JS_END_POINT + "</h3>";
				var p = getSpeedState(1, 1, s, t);//defaul online and gpsvalid
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/move.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/park.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  y / 1000000 + "," + x / 1000000 + "</span></li>";
				tips += "</ul></div>";
			    break;
			case 3:
				//stop
				image = {
					url: "../img/stop_icon.png",
					size: new g.Size(24, 50),
					origin: new g.Point(0, 0),
					anchor: new g.Point(12, 50)
				}
				tips +="<div class='infowindow'>";
				tips += "<h3>" + JS_STOP + "</h3>";
				tips +="<table>";
				tips +="<tr><td>"+JS_START+"</td><td style='padding-left:10px;'>"+st+"</td></tr>";
				tips +="<tr><td>"+JS_END+"</td><td style='padding-left:10px;'>"+et+"</td></tr>";
				tips +="<tr><td>"+JS_DURATION+"</td><td style='padding-left:10px;'>"+dut+"</td></tr>";
				tips += "</table></div>";
				break;
			case 4:
				if(fd == d && d != 0 && s > 0){
					image = {					
						path: g.SymbolPath.FORWARD_CLOSED_ARROW,//"M350,0 700,700 350,550 0,700",//*/
						scale: 1.8,
						strokeColor:'#FB9A3B',
						fillColor:'#FB9A3B',
						fillOpacity:1,
						rotation: d
					}
					markerType = 1;
				}else{
					image = {
						url: "../img/waypoint_icon1.png",
						size: new g.Size(10, 10),
						origin: new g.Point(0, 0),
						anchor: new g.Point(5, 5)
					}
					markerType = 2;
				}
				
				tips +="<div class='infowindow'>"+"<ul>";
				var p = getSpeedState(1, 1, s, t);//defaul online and gpsvalid
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/move.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/park.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  y / 1000000 + "," + x / 1000000 + "</span></li>";
				tips += "</ul></div>";
				break;
				
			case 5:
				image = {
					url: "../img/waypoint_icon1.png",
					size: new g.Size(10, 10),
					origin: new g.Point(0, 0),
					anchor: new g.Point(5, 5)
				}
							
				tips +="<div class='infowindow'>"+"<ul>";
				var p = getSpeedState(1, 1, s, t);//defaul online and gpsvalid
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/move.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/park.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  y / 1000000 + "," + x / 1000000 + "</span></li>";
				tips += "</ul></div>";
				break;
				
			case 6:
				//alarm
				image = {
					url: "../img/alarm_icon.png",
					size: new g.Size(24, 50),
					origin: new g.Point(0, 0),
					anchor: new g.Point(12, 50)
				}
				tips +="<div class='infowindow'>";
				tips += "<h3>" + ad + "</h3>"+"<ul>";
				var p = getSpeedState(1, 1, s, t);//defaul online and gpsvalid
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/move.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(../img/park.png) no-repeat 0px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  y / 1000000 + "," + x / 1000000 + "</span></li>";
				tips += "</ul></div>";
				break;
			}
			
			var marker = new g.Marker({
				position: pt,
				map: markerType > 0 ? null : this.wndMap,
				tip: this.wndTip,
				clickable: true,
				draggable: false,
				cursor: 'pointer',
				icon: image
			});

			var self = this;
			g.event.clearInstanceListeners(marker);
			g.event.addListener(marker, "click", function() {            
				self.MoveTop(marker);
				this.tip.setContent(tips);
				this.tip.open(this.map, marker);
				this.tip.isOpen = true
			});
			
			if(typeof markerType != "undefined" && markerType != null){
				if(markerType == 1){
					this.anglePoints.push(marker);
				}else if(markerType == 2){
					this.timePoints.push(marker);
				}
			}
			
			return marker;
		}else{
			return null;
		}
	},
	AddTrackPoint: function(keyid, x, y, s, t, d, opts) {
		var pts = this.trackpts[keyid];
		if (typeof pts != "undefined" && pts != null){
			if(pts.x != x || pts.y != y) {
				var color = getSpeedColor(s);
				var line = null;
				var marker = null;
				var weight, opacity, point;
				if(typeof opts != "undefined"){
					weight = opts.weight;
					opacity = opts.opacity;
					point = opts.point;
				}else{
					weight = this.opts_poly.strokeWeight;
					opacity = this.opts_poly.strokeOpacity;
					point = this.opts_poly.point;
				}
				line = this.AddLine(pts.x, pts.y, x, y, color, weight, opacity);                
				if(point){
					marker = this.AddPoint(pts.x, pts.y, pts.d, x, y, s, t, d, 5);
				}
				pts.x = x;
				pts.y = y;
				pts.d = d;
				if(line != null || marker != null){
					pts.info.push({ line: line, point: marker });
					//Save points
					if(pts.info.length > this.def_save_points){
						var firstinfo = pts.info.shift();
						if(typeof firstinfo.line != "undefined" && firstinfo.line != null){
							firstinfo.line.setMap(null);
							firstinfo.line = null;
						}
						if(typeof firstinfo.point != "undefined" && firstinfo.point != null){
							firstinfo.point.setMap(null);
							firstinfo.point = null;
						}
						firstinfo = null;
					}
				}
			}
		}else{
			pts = {
				x: x,
				y: y,
				d: d,
				info: []
			}
		}
		delete this.trackpts[keyid];
		this.trackpts[keyid] = pts;
	},
	DrawTrackLine: function(keyid, tracks, opts, stopduration, stops, events) {
		this.RemoveTrack(keyid);
		var pts = { x: 0, y: 0, info: [] };
		var weight, opacity, point;
		if(typeof opts != "undefined"){
			weight = typeof opts.weight != "undefined" ? opts.weight : this.opts_poly.strokeWeight;
			opacity = typeof opts.opacity != "undefined" ? opts.opacity : this.opts_poly.strokeOpacity;
			point = typeof opts.point != "undefined" ? opts.point : false;
		}else{
			weight = this.opts_poly.strokeWeight;
			opacity = this.opts_poly.strokeOpacity;
			point = false;
		}
		var color;
		try {
			var isstop = false, stopstart, stopend, timeout;			
			for (var i = 1; i < tracks.length; i++) {
				color = getSpeedColor(tracks[i].s);
				var line = null;
				var marker = null;
				line = this.AddLine(tracks[i - 1].x, tracks[i - 1].y, tracks[i].x, tracks[i].y, color, weight, opacity);
				if(point){
					if(!isstop && tracks[i].s == 0){
						/*start stop*/
						isstop = true;
						stopstart = tracks[i].tg;
					}else if(isstop && (tracks[i].s > 0 || i == tracks.length - 1)){
						/*end stop*/
						var t1 = newDate(stopstart).getTime();
						var t2 = newDate(tracks[i].tg).getTime();
						/*seconds*/
					    timeout = (t2 - t1) / 1000.0;
						if(stops && Math.round(timeout / 60.0) >= (typeof stopduration != "undefined" ? stopduration : this.stopValidMins)){							
							/*Draw stop*/
							var fstopstart = $.format.date(stopstart, JS_DEFAULT_DATETIME_fmt_JS);
							var fstopend = $.format.date(tracks[i].tg, JS_DEFAULT_DATETIME_fmt_JS);
							marker = this.AddPoint(tracks[i - 1].x, tracks[i - 1].y, tracks[i - 1].d, tracks[i].x, tracks[i].y, tracks[i].s, fstopend, tracks[i].d, 3, fstopstart, fstopend, second2time(timeout));
							pts.info.push({ line: null, point: marker });
						}
						isstop = false;
					}
					var ftime = $.format.date(tracks[i].tg, JS_DEFAULT_DATETIME_fmt_JS);
					if(i == 1){
						/*Draw start point*/
						marker = this.AddPoint(tracks[i - 1].x, tracks[i - 1].y, tracks[i - 1].d, tracks[i].x, tracks[i].y, tracks[i].s, ftime, tracks[i].d, 1);
						pts.info.push({ line: null, point: marker });
					}else if(i == tracks.length - 1){
						/*Draw end point*/
						marker = this.AddPoint(tracks[i - 1].x, tracks[i - 1].y, tracks[i - 1].d, tracks[i].x, tracks[i].y, tracks[i].s, ftime, tracks[i].d, 2);
						pts.info.push({ line: null, point: marker });
					}
					marker = this.AddPoint(tracks[i - 1].x, tracks[i - 1].y, tracks[i - 1].d, tracks[i].x, tracks[i].y, tracks[i].s, ftime, tracks[i].d, 4);
				}
				pts.x = tracks[i].x;
				pts.y = tracks[i].y;
				pts.d = tracks[i].d;
				if(line != null && marker != null){
					pts.info.push({ line: line, point: marker });
				}
			}
			
			/*Draw events*/
			if(typeof events != "undefined" && events.length > 0){	
				var marker = null;
				for (var i = 0; i < events.length; i++) {
					var ftime = $.format.date(events[i].t, JS_DEFAULT_DATETIME_fmt_JS);
				    marker = this.AddPoint(events[i].x, events[i].y, events[i].d, events[i].x, events[i].y, events[i].s, ftime, events[i].d, 6, "", "", "", events[i].e);
					pts.info.push({ line: null, point: marker });
				}
			}

			this.markerManager.addMarkers(this.anglePoints, 14);
			this.markerManager.addMarkers(this.timePoints, 10);
			this.markerManager.refresh();
			
			this.trackpts[keyid] = pts;
			this.opts_track = {
				point: opts.trackPoint || false, 
				line: opts.trackLine || true
			}            
			//this.wndMap.setCenter(new g.LatLng(track[0].y, track[0].x));
			this.wndMap.setZoom(12)
		} catch(e) {}
	},
	LocateMarker: function(marker, center) {
		if(typeof ext != "undefined"){
			ext.ClearLink();
		}
        if(typeof center != "undefined" && center == true){
            this.wndMap.setCenter(marker.position);
			this.wndMap.setZoom(18);
        }
		this.markerCluster.redraw();
		this.MoveTop(marker);
		this.wndTip.setContent(marker.content);
		//this.wndTip.open(this.wndMap, marker);
	},
	LinkMarker: function(marker){
		if(this.wndMap.getBounds().contains(marker.position)){
			var ret = { x: marker.x, y: marker.y };
			ext.BuildMarkerLink(ret);
		}
	},
	RemoveMarker: function(marker){
        if(typeof marker != "undefined"){
            if(this.lastMarker == marker){
                this.lastMarker = null;
            }
            marker.setMap(null);
			this.markerCluster.removeMarker(marker);
        }
	},
	RemoveTrack: function(keyid){
		this.markerManager.clearMarkers();
		var pts = this.trackpts[keyid];
		if(typeof pts != "undefined"){
			for (var i = 0; i < pts.info.length; i++) {				
				var info = pts.info[i];
				if(typeof info.line != "undefined" && info.line != null){
					info.line.setMap(null);
					info.line = null;
				}
				if(typeof info.point != "undefined" && info.point != null){
					info.point.setMap(null);
					info.point = null;
				}
			}
			delete this.trackpts[keyid];
		}
		this.anglePoints = [];
		this.timePoints = [];		
	},
	ClearTrack: function() {
		for (var keyid in this.trackpts){
			this.RemoveTrack(keyid);
		}
		this.trackpts = [];
	},
	ClearMarker: function(markers) {
        this.lastMarker = null;
		for (var keyid in markers) {
			markers[keyid].setMap(null);
			this.markerCluster.removeMarker(markers[keyid]);
			delete markers[keyid];
		}
	},
	HideShowMarker: function(markers, show) {
		if(show){
			for (var keyid in markers) {
				if(this.isClusters){
					this.markerCluster.addMarker(markers[keyid]);
				}else{
					markers[keyid].setOptions({ map:this.wndMap, visible: true});
				}				
			}
		}else{
			if(this.isClusters){
				this.markerCluster.clearMarkers();
			}else{
				for (var keyid in markers){
					markers[keyid].setOptions({ visible: false});
				}
			}					
			this.ClearTrack();
		}
		this.isShowMarkers = show;
		this.markerCluster.resetViewport();
		this.markerCluster.redraw();		
	},
	ClustersMarker: function(markers, clusters){
		this.isClusters = clusters;
		if(!this.isShowMarkers) return;
		
		if(clusters){
			for (var keyid in markers) { 
				this.markerCluster.addMarker(markers[keyid]);
			}
		}else{
			this.markerCluster.clearMarkers();
			for (var keyid in markers) { 
				markers[keyid].setOptions({map: this.wndMap, visible:true});
			}
		}			
		this.markerCluster.resetViewport();
		this.markerCluster.redraw();
	},
	AddZoneMarker: function(x,y,name){
		var g = google.maps;
		var pt = new g.LatLng(y, x);
		var marker = new MarkerWithLabel({
			position: pt,
			map: this.wndMap,
			clickable: false,
			draggable: false,
			icon: " ",
			labelContent: name,
            labelAnchor: new g.Point(10, 10),
			labelClass: "labelsgeo", // the CSS class for the label
            labelStyle: {opacity: 1},
			labelVisible: true
		});
		return marker;
	},
	ClearZoneMarker: function(markers){
		for (var zid in markers) {
			markers[zid].setMap(null);
			delete markers[zid];
		}
	}
}

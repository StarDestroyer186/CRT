function MapExtend(map, opts, showdrawtool){
	this.wndMap = map;
	this.atype = 0;
	this.apts = "";
	
	this.opts_poly = {
        strokeColor: "#005300",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#006700",
        fillOpacity: 0.2,
		scale: 1
	}

	var drawnItems = new L.FeatureGroup().addTo(map);
	this.drawnItems = drawnItems;
	
	//Do translation
	L.drawLocal.draw.toolbar.actions.title = JS_DRAW_TOOL_DRAW_TOOLBAR_ACTIONS_TITLE;
	L.drawLocal.draw.toolbar.actions.text = JS_DRAW_TOOL_DRAW_TOOLBAR_ACTIONS_TEXT;
	L.drawLocal.draw.toolbar.finish.title = JS_DRAW_TOOL_DRAW_TOOLBAR_FINISH_TITLE;
	L.drawLocal.draw.toolbar.finish.text = JS_DRAW_TOOL_DRAW_TOOLBAR_FINISH_TEXT;
	L.drawLocal.draw.toolbar.undo.title = JS_DRAW_TOOL_DRAW_TOOLBAR_UNDO_TITLE;
	L.drawLocal.draw.toolbar.undo.text = JS_DRAW_TOOL_DRAW_TOOLBAR_UNDO_TEXT;
	L.drawLocal.draw.toolbar.buttons.polyline = JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_POLYLINE;
    L.drawLocal.draw.toolbar.buttons.polygon = JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_POLYGON;
	L.drawLocal.draw.toolbar.buttons.rectangle = JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_RECTANGLE;
	L.drawLocal.draw.toolbar.buttons.circle = JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_CIRCLE;
	L.drawLocal.draw.toolbar.buttons.marker = JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_MARKER;
	L.drawLocal.draw.toolbar.buttons.circlemarker = JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_CIRCLEMARKER;
	L.drawLocal.draw.handlers.circle.tooltip.start = JS_DRAW_TOOL_DRAW_HANDLERS_CIRCLE_TOOLTIP_START;
	L.drawLocal.draw.handlers.circle.radius = JS_DRAW_TOOL_DRAW_HANDLERS_CIRCLE_RADIUS;
	L.drawLocal.draw.handlers.circlemarker.tooltip.start = JS_DRAW_TOOL_DRAW_HANDLERS_CIRCLEMARKER_TOOLTIP_START;
	L.drawLocal.draw.handlers.marker.tooltip.start = JS_DRAW_TOOL_DRAW_HANDLERS_MARKER_TOOLTIP_START;
	L.drawLocal.draw.handlers.polygon.tooltip.start = JS_DRAW_TOOL_DRAW_HANDLERS_POLYGON_TOOLTIP_START;
	L.drawLocal.draw.handlers.polygon.tooltip.cont = JS_DRAW_TOOL_DRAW_HANDLERS_POLYGON_TOOLTIP_CONT;
	L.drawLocal.draw.handlers.polygon.tooltip.end = JS_DRAW_TOOL_DRAW_HANDLERS_POLYGON_TOOLTIP_END;
	L.drawLocal.draw.handlers.polyline.tooltip.start = JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_TOOLTIP_START;
	L.drawLocal.draw.handlers.polyline.tooltip.cont = JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_TOOLTIP_CONT;
	L.drawLocal.draw.handlers.polyline.tooltip.end = JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_TOOLTIP_END;
	L.drawLocal.draw.handlers.polyline.error = JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_ERROR;
	L.drawLocal.draw.handlers.rectangle.tooltip.start = JS_DRAW_TOOL_DRAW_HANDLERS_RECTANGLE_TOOLTIP_START;
	L.drawLocal.draw.handlers.simpleshape.tooltip.end = JS_DRAW_TOOL_DRAW_HANDLERS_SIMPLESHAPE_TOOLTIP_END;
	L.drawLocal.edit.toolbar.actions.save.title = JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_SAVE_TITLE;
	L.drawLocal.edit.toolbar.actions.save.text = JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_SAVE_TEXT;
	L.drawLocal.edit.toolbar.actions.cancel.title = JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCEL_TITLE;
	L.drawLocal.edit.toolbar.actions.cancel.text = JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCEL_TEXT;
	L.drawLocal.edit.toolbar.actions.clearAll.title = JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCELALL_TITLE;
	L.drawLocal.edit.toolbar.actions.clearAll.text = JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCELALL_TEXT;
	L.drawLocal.edit.toolbar.buttons.edit = JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_EDIT;
	L.drawLocal.edit.toolbar.buttons.editDisabled = JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_EDITDISABLED;
	L.drawLocal.edit.toolbar.buttons.remove = JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_REMOVE;
	L.drawLocal.edit.toolbar.buttons.removeDisabled = JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_REMOVEDISABLED;
	L.drawLocal.edit.handlers.edit.tooltip.text = JS_DRAW_TOOL_EDIT_HANDLERS_EDIT_TOOLTIPS_TEXT;
	L.drawLocal.edit.handlers.edit.tooltip.subtext = JS_DRAW_TOOL_EDIT_HANDLERS_EDIT_TOOLTIPS_SUBTEXT;
	L.drawLocal.edit.handlers.remove.tooltip.text = JS_DRAW_TOOL_EDIT_HANDLERS_REMOVE_TOOLTIPS_TEXT;

	var drawOptions = {
        position: 'topleft',
        draw: {
            polyline: {
                shapeOptions: {
                    color: this.opts_poly.strokeColor,
                    weight: this.opts_poly.strokeWeight,
                },
				metric: true,
				feet: false, 
				nautic: false,
				icon: new L.DivIcon({
					iconSize: new L.Point(8, 8),
					className: 'leaflet-div-icon leaflet-editing-icon my-own-class'
				}),
				showArea:true
            },
            polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
				metric: true,
				feet: false, 
				nautic: false,
                shapeOptions: {
                    color: this.opts_poly.strokeColor,
                    weight: this.opts_poly.strokeWeight,
                },
				icon: new L.DivIcon({
					iconSize: new L.Point(8, 8),
					className: 'leaflet-div-icon leaflet-editing-icon my-own-class'
				}),
				showArea:true
            },
            circle: {
				shapeOptions: {
                    color: this.opts_poly.strokeColor,
                    weight: this.opts_poly.strokeWeight,
                },
				metric: true,
				feet: false, 
				nautic: false,
				showArea:true
			},
			circlemarker: false,
            rectangle: {
                shapeOptions: {
                    color: this.opts_poly.strokeColor,
                    weight: this.opts_poly.strokeWeight,
                },
				metric: true,
				feet: false, 
				nautic: false,
				icon: new L.DivIcon({
					iconSize: new L.Point(8, 8),
					className: 'leaflet-div-icon leaflet-editing-icon my-own-class'
				}),
				showArea:true
            },
            marker: {
                //icon: new MyCustomMarker()
            }
        },
        edit: {
            featureGroup: drawnItems, 
            remove: true,
			
			polyline: {
				icon: new L.DivIcon({
					iconSize: new L.Point(8, 8),
					className: 'leaflet-div-icon leaflet-editing-icon my-own-class'
				})
            },
        }
    };
	this.drawOptions = drawOptions;

	var drawControl = new L.Control.Draw(drawOptions);	
	this.drawControl = drawControl;
	if(showdrawtool){		
		map.addControl(drawControl);
	}	
	
	//Truncate value based on number of decimals
	var _round = function(num, len) {
		return Math.round(num*(Math.pow(10, len)))/(Math.pow(10, len));
	};
	
	// Helper method to format LatLng object (x.xxxxxx, y.yyyyyy)
	var strLatLng = function(latlng) {
		return "("+_round(latlng.lat, 6)+", "+_round(latlng.lng, 6)+")";
	};

	// Generate popup content based on layer type
	// - Returns HTML string, or null if unknown object
	var self = this;
	var getPopupContentAndGeo = function(layer) {
		// Marker - add lat/long
		if (layer instanceof L.Marker) {
			self.SetAtype(4);
			var lat = layer.getLatLng().lat > 90 ? (layer.getLatLng().lat - 180) : (layer.getLatLng().lat < -180 ? layer.getLatLng().lat + 180 : layer.getLatLng().lat);
			var lng = layer.getLatLng().lng > 180 ? (layer.getLatLng().lng - 360) : (layer.getLatLng().lng < -360 ? layer.getLatLng().lng + 360 : layer.getLatLng().lng);
					
			self.SetApts(_round(lat, 6)+","+_round(lng, 6));
			return strLatLng(layer.getLatLng());
			
		// Circle - lat/long, radius
		} else if (layer instanceof L.Circle) {
			self.SetAtype(1);
			var center = layer.getLatLng(),
				radius = layer.getRadius();
			var lat = center.lat > 90 ? (center.lat - 180) : (center.lat < -180 ? center.lat + 180 : center.lat);
			var lng = center.lng > 180 ? (center.lng - 360) : (center.lng < -360 ? center.lng + 360 : center.lng);
			self.SetApts(_round(lat, 6)+","+_round(lng, 6)+","+_round(radius, 2));
			return JS_DRAW_TOOL_TOOL_CENTER + " " + strLatLng(center)+"<br />"
				  + JS_DRAW_TOOL_TOOL_RADIUS + " "+_round(radius, 2)+" m";
				  
		// Rectangle - area
		} else if (layer instanceof L.Rectangle) {
			self.SetAtype(2);
			var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
				area = L.GeometryUtil.geodesicArea(latlngs);
			var lat1 = latlngs[0].lat > 90 ? (latlngs[0].lat - 180) : (latlngs[0].lat < -180 ? latlngs[0].lat + 180 : latlngs[0].lat);
			var lng1 = latlngs[0].lng > 180 ? (latlngs[0].lng - 360) : (latlngs[0].lng < -360 ? latlngs[0].lng + 360 : latlngs[0].lng);
			var lat2 = latlngs[2].lat > 90 ? (latlngs[2].lat - 180) : (latlngs[2].lat < -180 ? latlngs[2].lat + 180 : latlngs[2].lat);
			var lng2 = latlngs[2].lng > 180 ? (latlngs[2].lng - 360) : (latlngs[2].lng < -360 ? latlngs[2].lng + 360 : latlngs[2].lng);
			self.SetApts(_round(lat1, 6)+","+_round(lng1, 6)+";"+_round(lat2, 6)+","+_round(lng2, 6));
			return JS_DRAW_TOOL_TOOL_AREA + " " + L.GeometryUtil.readableArea(area, true);
			
		// Polygon - area
		} else if ((layer instanceof L.Polygon) && ! (layer instanceof L.Rectangle)) {
			self.SetAtype(3);
			var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
				area = L.GeometryUtil.geodesicArea(latlngs);
			var apts = "";
			for(var i = 0; i < latlngs.length; i++){
				var lat = latlngs[i].lat > 90 ? (latlngs[i].lat - 180) : (latlngs[i].lat < -180 ? latlngs[i].lat + 180 : latlngs[i].lat);
				var lng = latlngs[i].lng > 180 ? (latlngs[i].lng - 360) : (latlngs[i].lng < -360 ? latlngs[i].lng + 360 : latlngs[i].lng);
				apts = apts + _round(lat, 6)+","+_round(lng, 6)+";";
			}
			self.SetApts(apts.substring(0, apts.length - 1));
			return JS_DRAW_TOOL_TOOL_AREA + " " + L.GeometryUtil.readableArea(area, true);
			
		// Polyline - distance
		} else if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
			self.SetAtype(5);
			var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
				distance = 0;
			if (latlngs.length < 2) {
				return JS_DRAW_TOOL_TOOL_DISTANCE + " N/A";
			} else {
				var apts = "";
				for(var i = 0; i < latlngs.length; i++){
					var lat = latlngs[i].lat > 90 ? (latlngs[i].lat - 180) : (latlngs[i].lat < -180 ? latlngs[i].lat + 180 : latlngs[i].lat);
					var lng = latlngs[i].lng > 180 ? (latlngs[i].lng - 360) : (latlngs[i].lng < -360 ? latlngs[i].lng + 360 : latlngs[i].lng);
					apts = apts + _round(lat, 6)+","+_round(lng, 6)+";";
				}
				self.SetApts(apts.substring(0, apts.length - 1));
			
				for (var i = 0; i < latlngs.length-1; i++) {
					distance += latlngs[i].distanceTo(latlngs[i+1]);
				}
				return JS_DRAW_TOOL_TOOL_DISTANCE + " " + _round(distance, 2)+" m";
			}
		}
		return null;
	};
	this.getPopupContentAndGeo = getPopupContentAndGeo;
	
	map.on(L.Draw.Event.DRAWSTART, function(event) {
		drawnItems.clearLayers();
		//var type = event.layerType;
	});
	
	map.on(L.Draw.Event.DRAWSTOP, function(event) {
		
	});
	
	map.on(L.Draw.Event.EDITSTART, function(event) {
		
	});
	
	map.on(L.Draw.Event.EDITSTOP, function(event) {
		
	});
	
	map.on(L.Draw.Event.DELETESTOP, function(event) {
		self.SetApts(null);
	});
	
    //Object created - bind popup to layer, add to feature group
	map.on(L.Draw.Event.CREATED, function(event) {	
		var layer = event.layer;
		var content = getPopupContentAndGeo(layer);
		
		if (content !== null) {
			layer.bindPopup(content);			
		}
		drawnItems.addLayer(layer);
	});
	
	//Object(s) edited - update popups
	map.on(L.Draw.Event.EDITED, function(event) {
		var layers = event.layers,
			content = null;

		layers.eachLayer(function(layer) {			
			content = getPopupContentAndGeo(layer);
			if (content !== null) {
				layer.setPopupContent(content);
			}
		});
	});
	
}

MapExtend.prototype = {
	SetColor: function(color){
		this.drawOptions.draw.polyline.shapeOptions.color = color;
		this.drawOptions.draw.polygon.shapeOptions.color = color;
		this.drawOptions.draw.circle.shapeOptions.color = color;
		this.drawOptions.draw.rectangle.shapeOptions.color = color;
	},
	GetAtype: function(){
        return this.atype;
    },
	SetAtype: function(atype){
		this.atype = atype;
    },
	GetApts: function(){
        return this.apts;
    },
	SetApts: function(apts){
        this.apts = apts;
    },
	ToggleEditToolbar: function(active){
		for(var i in this.drawControl._toolbars){
			if(typeof this.drawControl._toolbars[i]._modes.edit != 'undefined'){
				editHandler = this.drawControl._toolbars[i]._modes.edit.handler;
				if(active){
					editHandler.enable();
				}else{
					editHandler.disable();
				}			
			}   
		}
	},
	BuildMarker: function(lat, lng, editable, color, zoom, needClear, name){
		this.ToggleEditToolbar(false);
		
		if(needClear){
			this.drawnItems.clearLayers();
		}
		
		var marker = L.marker([lat, lng])
			.bindTooltip(name, { 
				permanent: true, 
				offset: L.point(-15, 30),
				direction: 'bottom' 
			});
			
		var content = this.getPopupContentAndGeo(marker);		
		if (content !== null) {
			marker.bindPopup(content);			
		}
		this.drawnItems.addLayer(marker);
		
		if(editable){
			this.ToggleEditToolbar(true);
		}
		 
		if(needClear){			
			this.wndMap.setView(new L.LatLng(lat,lng), zoom);
		}

		this.wndMap.on('zoomend', function() {
			if(name != null && name.length > 0){
				marker.unbindTooltip().bindTooltip(name, { 
					permanent: true,
					offset: L.point(-15, 30),
					direction: 'bottom' 
				});
			}
		});
		return marker;
	},
	BuildCircle: function(lat, lng, r, editable, color, zoom, needClear, name, weight){
		this.ToggleEditToolbar(false);
		
		if(needClear){
			this.drawnItems.clearLayers();
		}

		var marker = L.circle([lat,lng], {
						radius: r, 
						color: color || this.opts_poly.strokeColor, 
						fillColor: color || this.opts_poly.strokeColor, 
						weight: weight || this.opts_poly.strokeWeight
					});
		if(name != null && name.length > 0){
			marker.bindTooltip(name, { 
				permanent: true,
				direction: 'center' 
			});
		}
		var content = this.getPopupContentAndGeo(marker);
		if (content !== null) {
			marker.bindPopup(content);			
		}
		this.drawnItems.addLayer(marker);
		
		if(editable){
			this.ToggleEditToolbar(true);
		}
		
		if(needClear){	
			this.wndMap.setView(new L.LatLng(lat,lng), zoom);
		}
		
		this.wndMap.on('zoomend', function() {
			if(name != null && name.length > 0){
				marker.unbindTooltip().bindTooltip(name, { 
					permanent: true,
					direction: 'center' 
				});
			}
		});
		return marker;	
	},
	BuildRectangle: function(minY, minX, maxY, maxX, editable, color, zoom, needClear, name, weight, fillOpacity){    
		this.ToggleEditToolbar(false);
		
		if(needClear){
			this.drawnItems.clearLayers();
		}
		
		var bounds = [[maxY, maxX], [minY, minX]];
		var marker = L.rectangle(bounds, {
						color: color || this.opts_poly.strokeColor,
						fillColor: color || this.opts_poly.strokeColor, 
						weight: weight || this.opts_poly.strokeWeight,
						fillOpacity: fillOpacity || this.opts_poly.fillOpacity
					 });
		if(name != null && name.length > 0){
			marker.bindTooltip(name, { 
				permanent: true,
				direction: 'center' 
			});
		}		 
		var content = this.getPopupContentAndGeo(marker);
		
		if (content !== null) {
			marker.bindPopup(content);			
		}
		this.drawnItems.addLayer(marker);
		
		if(editable){
			this.ToggleEditToolbar(true);
		}
		
		if(needClear){
			var center = new L.LatLng(minY + (maxY - minY)/2.0, minX + (maxX - minX)/2.0);
			this.wndMap.setView(center, zoom);
		}
		
		this.wndMap.on('zoomend', function() {
			if(name != null && name.length > 0){
				marker.unbindTooltip().bindTooltip(name, { 
					permanent: true,
					direction: 'center' 
				});
			}
		});
		return marker;	
	},
	BuildPolygon: function(points, editable, color, zoom, needClear, name, weight, fillOpacity){
		this.ToggleEditToolbar(false);
		
		if(needClear){
			this.drawnItems.clearLayers();
		}
		
		var marker = L.polygon(points, {
						color: color || this.opts_poly.strokeColor,
						fillColor: color || this.opts_poly.strokeColor, 
						weight: weight || this.opts_poly.strokeWeight,
						fillOpacity: fillOpacity || this.opts_poly.fillOpacity
					 });
		if(name != null && name.length > 0){
			marker.bindTooltip(name, { 
				permanent: true,
				direction: 'center' 
			});
		}
		var content = this.getPopupContentAndGeo(marker);
		if (content !== null) {
			marker.bindPopup(content);			
		}
		this.drawnItems.addLayer(marker);
		
		if(editable){
			this.ToggleEditToolbar(true);
		}
		
		if(needClear){
			this.wndMap.setView(marker.getBounds().getCenter(), zoom);
		}
		
		this.wndMap.on('zoomend', function() {
			if(name != null && name.length > 0){
				marker.unbindTooltip().bindTooltip(name, { 
					permanent: true,
					direction: 'center' 
				});
			}
		});
		return marker;	
	},
	BuildPolyline: function(points, editable, color, zoom, needClear, name, weight){
		this.ToggleEditToolbar(false);
		
		if(needClear){
			this.drawnItems.clearLayers();
		}
		
		var marker = L.polyline(points, {
						color: color || this.opts_poly.strokeColor,
						fillColor: color || this.opts_poly.strokeColor, 
						weight: 8,//weight || this.opts_poly.strokeWeight
						opacity: 0.5
					 });
		if(name != null && name.length > 0){
			marker.bindTooltip(name, { 
				permanent: true,
				direction: 'center' 
			});
		}
		var content = this.getPopupContentAndGeo(marker);
		if (content !== null) {
			marker.bindPopup(content);			
		}
		this.drawnItems.addLayer(marker);
		
		if(editable){
			this.ToggleEditToolbar(true);
		}
		
		if(needClear){
			this.wndMap.setView(marker.getBounds().getCenter(), zoom);
		}

		this.wndMap.on('zoomend', function() {
			if(name != null && name.length > 0){
				marker.unbindTooltip().bindTooltip(name, { 
					permanent: true,
					direction: 'center' 
				});
			}
		});
		return marker;	
	},
	ClearZone: function (zones){
		for(var zid in zones){
			this.drawnItems.removeLayer(zones[zid]);
			delete zones[zid];
		}
	},
	ClearUserMarker: function(markers){
		for (var zid in markers) {
			this.drawnItems.removeLayer(markers[zid]);
			delete markers[zid];
		}
	},
	RectangleCenter: function (minY, minX, maxY, maxX){
		var bounds = [[maxY, maxX], [minY, minX]];
		var marker = L.rectangle(bounds);
		bounds = marker.getBounds();
		var latLng = bounds.getCenter();
		var center = [];
		center.push(latLng.lat);
		center.push(latLng.lng);
		return center;
	},
	PolygonCenter: function(points){	
		var marker = L.polygon(points);
		var bounds = marker.getBounds();
		var latLng = bounds.getCenter();
		var center = [];
		center.push(latLng.lat);
		center.push(latLng.lng);		
		return center;
	},
	PolylineCenter: function(points){
		var marker = L.polyline(points);
		var bounds = marker.getBounds();
		var latLng = bounds.getCenter();
		var center = [];
		center.push(latLng.lat);
		center.push(latLng.lng);	
		return center;
	}
	
}


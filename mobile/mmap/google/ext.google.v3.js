function MapExtend(map, opts, drawtool){
	this.marker;
	this.circle;
	this.rectangle;
	this.polygon;
	this.polyline;
	this.markerLink;
	this.atype = 0;
	this.apts = "";
    this.wndMap = map;
	this.drawtool = drawtool;
	
    this.opts_poly = {
        strokeColor: "#005300",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#006700",
        fillOpacity: 0.2,
		scale: 1
	}
	
	this.markerOptions = {
		obj: this,
		icon: {
			path: "m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z",
			strokeColor: this.opts_poly.strokeColor,
			strokeOpacity: this.opts_poly.strokeOpacity,
			strokeWeight: this.opts_poly.strokeWeight,
			fillColor: this.opts_poly.fillColor,
			fillOpacity: this.opts_poly.fillOpacity,
			scale: this.opts_poly.scale,			
			anchor: new google.maps.Point(10, 10)
		},
		clickable: true,
		draggable: true,
		zIndex: 1 
	};
	this.circleOptions = {
		obj: this,
		strokeColor: this.opts_poly.strokeColor,
		strokeOpacity: this.opts_poly.strokeOpacity,
		strokeWeight: this.opts_poly.strokeWeight,
		fillColor: this.opts_poly.fillColor,
		fillOpacity: this.opts_poly.fillOpacity,
		clickable: true,
		editable: true,
		draggable: true,
		zIndex: 1 
	};
	this.rectangleOptions = {
		obj: this,
		strokeColor: this.opts_poly.strokeColor,
		strokeOpacity: this.opts_poly.strokeOpacity,
		strokeWeight: this.opts_poly.strokeWeight,
		fillColor: this.opts_poly.fillColor,
		fillOpacity: this.opts_poly.fillOpacity,
		clickable: true,
		editable: true,
		draggable: true,
		zIndex: 1
	};
	this.polygonOptions = {
		obj: this,
		strokeColor: this.opts_poly.strokeColor,
		strokeOpacity: this.opts_poly.strokeOpacity,
		strokeWeight: this.opts_poly.strokeWeight,
		fillColor: this.opts_poly.fillColor,
		fillOpacity: this.opts_poly.fillOpacity,
		clickable: true,
		editable: true,
		draggable: true,
		zIndex: 1
	};
	this.polylineOptions = {
		obj: this,
		strokeColor: this.opts_poly.strokeColor,
		strokeOpacity: this.opts_poly.strokeOpacity,
		strokeWeight: this.opts_poly.strokeWeight,
		fillColor: this.opts_poly.fillColor,
		fillOpacity: this.opts_poly.fillOpacity,
		clickable: true,
		editable: true,
		draggable: true,
		zIndex: 1
	};
	
	var drawingManager = new google.maps.drawing.DrawingManager({
		drawingControl: this.drawtool,
		drawingControlOptions: {
		    position: google.maps.ControlPosition.TOP_CENTER,
		    drawingModes: ['marker', 'circle', 'rectangle', 'polygon', 'polyline']
		},

		markerOptions: this.markerOptions,
		circleOptions: this.circleOptions,
		rectangleOptions: this.rectangleOptions,
		polygonOptions: this.polygonOptions,
		polylineOptions: this.polylineOptions
	}); 
	drawingManager.setMap(map);
	google.maps.event.addListener(drawingManager, 'overlaycomplete', this.Ondrawcomplete);
	google.maps.event.addListener(drawingManager, 'click', this.hiclick);
	
}

MapExtend.prototype = {
	SetColor: function(color){
		this.markerOptions.icon.strokeColor = color;
		this.markerOptions.icon.fillColor = color;
		this.circleOptions.strokeColor = color;
		this.circleOptions.fillColor = color;
		this.rectangleOptions.strokeColor = color;
		this.rectangleOptions.fillColor = color;
		this.polygonOptions.strokeColor = color;
		this.polygonOptions.fillColor = color;
		this.polylineOptions.strokeColor = color;
		this.polylineOptions.fillColor = color;
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
	BuildMarker: function(lat, lng, editable, color, zoom, needClear){
		if(needClear){
			this.ClearDraw(); 
		}
		var g = google.maps;
        var position = new g.LatLng(lat, lng);
		
		var shapeOpts = {
			obj: this,
            map: this.wndMap,
			icon: {
				path: "m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z",
				strokeColor: color || this.opts_poly.strokeColor,
				strokeOpacity: this.opts_poly.strokeOpacity,
				strokeWeight: this.opts_poly.strokeWeight,
				fillColor: color || this.opts_poly.fillColor,
				fillOpacity:this.opts_poly.fillOpacity,
				scale: this.opts_poly.scale,
				anchor: new google.maps.Point(10, 10)
			},
			position: position,
			clickable: true,
			draggable: editable,
			zIndex: 1 
        };
		
		this.marker = new g.Marker(shapeOpts);
		this.wndMap.setCenter(position);
		var marker = this.marker;
		if(typeof zoom != undefined && zoom > 0){
			this.wndMap.setZoom(zoom);
		}
		this.SetAtype(4);

		this.SetApts(marker.getPosition().lat().toFixed(5) +","+
				     marker.getPosition().lng().toFixed(5));
					 
		g.event.addListener(marker, 'dragend', function () {
			marker.obj.SetApts(marker.getPosition().lat().toFixed(5) +","+
							   marker.getPosition().lng().toFixed(5));
		});
		return marker;
	},
	BuildMarkerWithLabel: function(name, lat, lng, editable, color, needClear){
		if(needClear){
			this.ClearDraw(); 
		}
		var g = google.maps;
        var position = new g.LatLng(lat, lng);
		
		var shapeOpts = {
			obj: this,
            map: this.wndMap,
			icon: {
				path: "m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z",
				strokeColor: color || this.opts_poly.strokeColor,
				strokeOpacity: this.opts_poly.strokeOpacity,
				strokeWeight: this.opts_poly.strokeWeight,
				fillColor: color || this.opts_poly.fillColor,
				fillOpacity:this.opts_poly.fillOpacity,
				scale: this.opts_poly.scale,
				anchor: new google.maps.Point(10, 10)
			},
			labelContent: name,
			labelAnchor: new g.Point(-8, -8),
			labelClass: "labelsgeo", // the CSS class for the label
			position: position,
			clickable: true,
			draggable: editable,
			zIndex: 1 
        };
		
		var marker = new MarkerWithLabel(shapeOpts);
		this.wndMap.setCenter(position);
		
		return marker;
	},
    BuildCircle: function(lat, lng, r, editable, color, zoom, needClear){
		if(needClear){
			this.ClearDraw(); 
		} 
        var g = google.maps;
        var center = new g.LatLng(lat, lng);

        var shapeOpts = {
			obj: this,
            strokeColor: color || this.opts_poly.strokeColor,
            strokeOpacity: this.opts_poly.strokeOpacity,
            strokeWeight: this.opts_poly.strokeWeight,
            fillColor: color || this.opts_poly.fillColor,
            fillOpacity:this.opts_poly.fillOpacity,
            map: this.wndMap,
            center: center,
            radius: r,
            clickable: true,
			editable: editable,
			draggable: editable,
			zIndex: 1
        };
        this.circle = new g.Circle(shapeOpts);
		if(typeof zoom != undefined && zoom > 0){
			this.wndMap.setZoom(zoom);
		}
		this.wndMap.setCenter(center);
		var circle = this.circle;
		this.SetAtype(1);
		
		console.log('radius', circle.getRadius().toFixed(2));
		console.log('lat', circle.getCenter().lat().toFixed(5));
		console.log('lng', circle.getCenter().lng().toFixed(5));
		this.SetApts(circle.getCenter().lat().toFixed(5) +","+
				     circle.getCenter().lng().toFixed(5) +","+
				     circle.getRadius().toFixed(2));
		
		g.event.addListener(circle, 'radius_changed', function () {
			var atype = circle.obj.GetAtype();
			console.log('radius changed');
			console.log('radius', circle.getRadius().toFixed(2));
			console.log('lat', circle.getCenter().lat().toFixed(5));
			console.log('lng', circle.getCenter().lng().toFixed(5));
			if(atype == 1){
				circle.obj.SetApts(circle.getCenter().lat().toFixed(5) +","+
									circle.getCenter().lng().toFixed(5) +","+
									circle.getRadius().toFixed(2));
			} 
		});
		g.event.addListener(circle, 'center_changed', function (){
			var atype = circle.obj.GetAtype();
			console.log('center_changed');
			console.log('radius', circle.getRadius().toFixed(2));
			console.log('lat', circle.getCenter().lat().toFixed(5));
			console.log('lng', circle.getCenter().lng().toFixed(5));
			if(atype == 1){
				circle.obj.SetApts(circle.getCenter().lat().toFixed(5) +","+
									circle.getCenter().lng().toFixed(5) +","+
									circle.getRadius().toFixed(2));
			} 
		});	
		return circle;
	},
    BuildRectangle: function(minY, minX, maxY, maxX, editable, color, zoom, needClear){    
		if(needClear){
			this.ClearDraw(); 
		}       
        var g = google.maps;
		var center = new g.LatLng(minY + (maxY - minY)/2.0, minX + (maxX - minX)/2.0);

        var shapeOpts = {
			obj: this,
            strokeColor: color || this.opts_poly.strokeColor,
            strokeOpacity: this.opts_poly.strokeOpacity,
            strokeWeight: this.opts_poly.strokeWeight,
            fillColor: color || this.opts_poly.fillColor,
            fillOpacity: this.opts_poly.fillOpacity,
            map: this.wndMap,
            center: center,
            clickable: true,
			editable: editable,
			draggable: editable,
			bounds: new google.maps.LatLngBounds(
					new google.maps.LatLng(minY, minX),
					new google.maps.LatLng(maxY, maxX)),
			zIndex: 1
          };
        this.rectangle = new g.Rectangle(shapeOpts);
		if(typeof zoom != undefined && zoom > 0){
			this.wndMap.setZoom(zoom);
		}
		this.wndMap.setCenter(center);
		this.SetAtype(2);
		var rectangle = this.rectangle;
		
		var ne = rectangle.getBounds().getNorthEast();
		var sw = rectangle.getBounds().getSouthWest();
		console.log('ne',  ne.lat().toFixed(5) + ', ' + ne.lng().toFixed(5));
		console.log('sw',  sw.lat().toFixed(5) + ', ' + sw.lng().toFixed(5));
		this.SetApts(sw.lat().toFixed(5) + ',' + sw.lng().toFixed(5) +";" +
					 ne.lat().toFixed(5) + ',' + ne.lng().toFixed(5));
		
		g.event.addListener(rectangle, 'bounds_changed', function (){
			console.log('bounds_changed');
			var atype = rectangle.obj.GetAtype();
			
			var ne = rectangle.getBounds().getNorthEast();
			var sw = rectangle.getBounds().getSouthWest();
			console.log('ne',  ne.lat().toFixed(5) + ', ' + ne.lng().toFixed(5));
			console.log('sw',  sw.lat().toFixed(5) + ', ' + sw.lng().toFixed(5));
			if(atype == 2){
				rectangle.obj.SetApts(sw.lat().toFixed(5) + ',' + sw.lng().toFixed(5) +";" +
									  ne.lat().toFixed(5) + ',' + ne.lng().toFixed(5));
			}
		});
		return rectangle;
    },
	BuildPolygon: function(points, editable, color, zoom, needClear){
		if(needClear){
			this.ClearDraw(); 
		}		         
        var g = google.maps;
		var route = [];
		var bounds = new google.maps.LatLngBounds();
		for(var i = 0; i < points.length; i++){
			var latlng = new g.LatLng(parseFloat(points[i].split(",")[0]), parseFloat(points[i].split(",")[1]));
			route.push(latlng);
			bounds.extend(latlng);
		}

        var shapeOpts = {
			obj: this,
            paths: route,
            strokeColor: color || this.opts_poly.strokeColor,
            strokeOpacity: this.opts_poly.strokeOpacity,
            strokeWeight: this.opts_poly.strokeWeight,
            fillColor: color || this.opts_poly.fillColor,
            fillOpacity: this.opts_poly.fillOpacity,
            map: this.wndMap,
			clickable: true,
			editable: editable,
			draggable: editable,
            zIndex: 1
        };
        this.polygon = new g.Polygon(shapeOpts);
		if(typeof zoom != undefined && zoom > 0){
			this.wndMap.setZoom(zoom);
		}
		this.SetAtype(3);
		var polygon = this.polygon;
		var center = bounds.getCenter();
		this.wndMap.setCenter(center);
		
		var val = this.GetLatLngVertices(polygon.getPath()); 
		console.log('polygon=' + val.join(";"));
		this.SetApts(val.join(";"));
		
		g.event.addListener(polygon.getPath(), 'set_at', function() {
			var atype = polygon.obj.GetAtype();
			val = polygon.obj.GetLatLngVertices(polygon.getPath()); 
			console.log('polygon=' + val.join(";"));
			if(atype == 3){
				polygon.obj.SetApts(val.join(";"));
			}
		});

		g.event.addListener(polygon.getPath(), 'insert_at', function() {
			var atype = polygon.obj.GetAtype();
			val = polygon.obj.GetLatLngVertices(polygon.getPath()); 
			console.log('polygon=' + val.join(";"));
			if(atype == 3){
				polygon.obj.SetApts(val.join(";"));
			}
		});
		return polygon;
	}, 
	BuildPolyline: function(points, editable, color, zoom, needClear){
		if(needClear){
			this.ClearDraw(); 
		}		         
        var g = google.maps;
		var route = [];
		var bounds = new google.maps.LatLngBounds();
		for(var i = 0; i < points.length; i++){
			var latlng = new g.LatLng(parseFloat(points[i].split(",")[0]), parseFloat(points[i].split(",")[1]));
			route.push(latlng);
			bounds.extend(latlng);
		}
		
		var shapeOpts = {
			obj: this,
            path: route,
            strokeColor: color || this.opts_poly.strokeColor,
            strokeOpacity: this.opts_poly.strokeOpacity,
            strokeWeight: this.opts_poly.strokeWeight,
            fillColor: color || this.opts_poly.fillColor,
            fillOpacity: this.opts_poly.fillOpacity,
            map: this.wndMap,
			clickable: true,
			editable: editable,
			draggable: editable,
            zIndex: 1
        };
		
		this.polyline = new g.Polyline(shapeOpts);
		if(typeof zoom != undefined && zoom > 0){
			this.wndMap.setZoom(zoom);
		}
		this.SetAtype(5);
		var polyline = this.polyline;
		var center = bounds.getCenter();
		this.wndMap.setCenter(center);
		
		var val = this.GetLatLngVertices(polyline.getPath()); 
		console.log('polyline=' + val.join(";"));
		this.SetApts(val.join(";"));
		
		g.event.addListener(polyline.getPath(), 'set_at', function() {
			var atype = polyline.obj.GetAtype();
			val = polyline.obj.GetLatLngVertices(polyline.getPath()); 
			console.log('polyline=' + val.join(";"));
			if(atype == 5){
				polyline.obj.SetApts(val.join(";"));
			}
		});
		
		g.event.addListener(polyline.getPath(), 'insert_at', function() {
			var atype = polyline.obj.GetAtype();
			val = polyline.obj.GetLatLngVertices(polyline.getPath()); 
			console.log('polyline=' + val.join(";"));
			if(atype == 5){
				polyline.obj.SetApts(val.join(";"));
			}
		});
		return polyline;
	},
	BuildMarkerLink: function (point){
		this.ClearLink(); 
        var g = google.maps;
		var route = [];
		var bounds = this.wndMap.getBounds();
		var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
		var upperleft_latlng = new g.LatLng(ne.lat(), sw.lng());
		var marker_latlng = new g.LatLng((point.y / 1000000).toFixed(5), (point.x / 1000000).toFixed(5));
		route.push(upperleft_latlng);
		route.push(marker_latlng);

        var shapeOpts = {
			obj: this,
            paths: route,
            strokeColor: this.opts_poly.strokeColor,
            strokeOpacity: this.opts_poly.strokeOpacity,
            strokeWeight: this.opts_poly.strokeWeight,
            fillColor: this.opts_poly.fillColor,
            fillOpacity: this.opts_poly.fillOpacity,
            map: this.wndMap,
			clickable: true,
			editable: false,
			draggable: false,
            zIndex: 1
        };
        this.markerLink = new g.Polygon(shapeOpts);
	},
	Ondrawcomplete: function (shape) {
		if (shape == null) return;
		this.circleOptions.obj.ClearDraw();
		var g = google.maps;
		
		if (shape.type == g.drawing.OverlayType.MARKER){
			//draw marker
			this.markerOptions.obj.SetAtype(4);
			var marker = this.markerOptions.obj.marker;
			marker = shape.overlay;
			this.markerOptions.obj.marker = shape.overlay;
			
			this.markerOptions.obj.SetApts(marker.getPosition().lat().toFixed(5) +","+
										   marker.getPosition().lng().toFixed(5));
			
			g.event.addListener(marker, 'dragend', function () {
				marker = shape.overlay;
				marker.obj.SetApts(marker.getPosition().lat().toFixed(5) +","+
								   marker.getPosition().lng().toFixed(5));
			});
			
		} else if(shape.type == g.drawing.OverlayType.CIRCLE){
			//draw circle
			this.circleOptions.obj.SetAtype(1);
			var circle = this.circleOptions.obj.circle;
			circle = shape.overlay;
			this.circleOptions.obj.circle = shape.overlay;
			
			console.log('radius', circle.getRadius().toFixed(2));
			console.log('lat', circle.getCenter().lat().toFixed(5));
			console.log('lng', circle.getCenter().lng().toFixed(5));
			this.circleOptions.obj.SetApts(circle.getCenter().lat().toFixed(5) +","+
										   circle.getCenter().lng().toFixed(5) +","+
										   circle.getRadius().toFixed(2));
			
			g.event.addListener(circle, 'radius_changed', function () {
				circle = shape.overlay;
				var atype = circle.obj.GetAtype();

				console.log('radius changed');
				console.log('radius', circle.getRadius().toFixed(2));
				console.log('lat', circle.getCenter().lat().toFixed(5));
				console.log('lng', circle.getCenter().lng().toFixed(5));
				if(atype == 1){
					circle.obj.SetApts(circle.getCenter().lat().toFixed(5) +","+
									    circle.getCenter().lng().toFixed(5) +","+
									    circle.getRadius().toFixed(2));
				} 
		    });
			g.event.addListener(circle, 'center_changed', function (){
				circle = shape.overlay;
				var atype = circle.obj.GetAtype();
				
				console.log('center_changed');
				console.log('radius', circle.getRadius().toFixed(2));
				console.log('lat', circle.getCenter().lat().toFixed(5));
				console.log('lng', circle.getCenter().lng().toFixed(5));
				if(atype == 1){
					circle.obj.SetApts(circle.getCenter().lat().toFixed(5) +","+
									    circle.getCenter().lng().toFixed(5) +","+
									    circle.getRadius().toFixed(2));
				} 
			});	
		}else if(shape.type == g.drawing.OverlayType.RECTANGLE){
			//draw rectangle
			this.rectangleOptions.obj.SetAtype(2);
			var rectangle = this.rectangleOptions.obj.rectangle;
			rectangle = shape.overlay;
			this.rectangleOptions.obj.rectangle = shape.overlay;
			
			var ne = rectangle.getBounds().getNorthEast();
			var sw = rectangle.getBounds().getSouthWest();
			console.log('ne',  ne.lat().toFixed(5) + ', ' + ne.lng().toFixed(5));
			console.log('sw',  sw.lat().toFixed(5) + ', ' + sw.lng().toFixed(5));
			this.rectangleOptions.obj.SetApts(sw.lat().toFixed(5) + ',' + sw.lng().toFixed(5) +";" +
											  ne.lat().toFixed(5) + ',' + ne.lng().toFixed(5));
			
			g.event.addListener(rectangle, 'bounds_changed', function (){
				console.log('bounds_changed');
				rectangle = shape.overlay;
				var atype = rectangle.obj.GetAtype();
				
				var ne = rectangle.getBounds().getNorthEast();
				var sw = rectangle.getBounds().getSouthWest();
				console.log('ne',  ne.lat().toFixed(5) + ', ' + ne.lng().toFixed(5));
				console.log('sw',  sw.lat().toFixed(5) + ', ' + sw.lng().toFixed(5));
				if(atype == 2){
					rectangle.obj.SetApts(sw.lat().toFixed(5) + ',' + sw.lng().toFixed(5) +";" +
										  ne.lat().toFixed(5) + ',' + ne.lng().toFixed(5));
				}
			});	
		}else if(shape.type == g.drawing.OverlayType.POLYGON){
			//draw polygon
			this.polygonOptions.obj.SetAtype(3);
			var polygon = this.polygonOptions.obj.polygon;
			polygon = shape.overlay;
			this.polygonOptions.obj.polygon = shape.overlay;
			
			var val = polygon.obj.GetLatLngVertices(polygon.getPath()); 
			console.log('polygon=' + val.join(";"));
			this.polygonOptions.obj.SetApts(val.join(";"));
			
			g.event.addListener(polygon.getPath(), 'set_at', function() {
				polygon = shape.overlay;
				var atype = polygon.obj.GetAtype();
				val = polygon.obj.GetLatLngVertices(polygon.getPath()); 
				console.log('polygon=' + val.join(";"));
				if(atype == 3){
					polygon.obj.SetApts(val.join(";"));
				}
			});

			g.event.addListener(polygon.getPath(), 'insert_at', function() {
				polygon = shape.overlay;
				var atype = polygon.obj.GetAtype();
				val = polygon.obj.GetLatLngVertices(polygon.getPath()); 
				console.log('polygon=' + val.join(";"));
				if(atype == 3){
					polygon.obj.SetApts(val.join(";"));
				}
			});
		} else if(shape.type == g.drawing.OverlayType.POLYLINE){
			//draw polyline
			this.polylineOptions.obj.SetAtype(5);
			var polyline = this.polylineOptions.obj.polyline;
			polyline = shape.overlay;
			this.polylineOptions.obj.polyline = shape.overlay;
			
			var val = polyline.obj.GetLatLngVertices(polyline.getPath()); 
			console.log('polyline=' + val.join(";"));
			this.polylineOptions.obj.SetApts(val.join(";"));
			
			g.event.addListener(polyline.getPath(), 'set_at', function() {
				polyline = shape.overlay;
				var atype = polyline.obj.GetAtype();
				val = polyline.obj.GetLatLngVertices(polyline.getPath()); 
				console.log('polyline=' + val.join(";"));
				if(atype == 5){
					polyline.obj.SetApts(val.join(";"));
				}
			});

			g.event.addListener(polyline.getPath(), 'insert_at', function() {
				polyline = shape.overlay;
				var atype = polyline.obj.GetAtype();
				val = polyline.obj.GetLatLngVertices(polyline.getPath()); 
				console.log('polyline=' + val.join(";"));
				if(atype == 5){
					polyline.obj.SetApts(val.join(";"));
				}
			});
		}
    },
	ClearDraw: function(){
		if (this.marker != null){
			this.marker.setMap(null);
			this.marker = null;
		}
		if (this.circle != null) {
			this.circle.setMap(null);
			this.circle = null;
		}
		if (this.rectangle != null) {
			this.rectangle.setMap(null);
			this.rectangle = null;
		}
		if (this.polygon != null) {
			this.polygon.setMap(null);
			this.polygon = null;
		}
		if (this.polyline != null) {
			this.polyline.setMap(null);
			this.polyline = null;
		}		
	},
	ClearLink: function(){
		if (this.markerLink != null){
			this.markerLink.setMap(null);
			this.markerLink = null;
		}
	},
	GetLatLngVertices: function (path) {
		var pathArray = path.getArray();
		var vertices = [];
		for( var i = 0, n = pathArray.length;  i < n;  i++ ) {
			var latLng = pathArray[i];
			vertices.push(latLng.lat().toFixed(5) +","+ latLng.lng().toFixed(5));
		}
		return vertices;
	},
	PolygonCenter: function (poly) {
		var lowx,
			highx,
			lowy,
			highy,
			lats = [],
			lngs = [],
			vertices = poly.getPath();

		for(var i=0; i<vertices.length; i++) {
		    lngs.push(vertices.getAt(i).lng());
		    lats.push(vertices.getAt(i).lat());
		}

		lats.sort();
		lngs.sort();
		lowx = lats[0];
		highx = lats[vertices.length - 1];
		lowy = lngs[0];
		highy = lngs[vertices.length - 1];
		center_x = lowx + ((highx-lowx) / 2);
		center_y = lowy + ((highy - lowy) / 2);
		return (new google.maps.LatLng(center_x, center_y));
    },
	ClearZone: function (zones){
		for(var zid in zones){
			zones[zid].setMap(null);
			delete zones[zid];
		}
	},
	ClearUserMarker: function(markers){
		for (var zid in markers) {
			markers[zid].setMap(null);
			delete markers[zid];
		}
	}
	
	
}


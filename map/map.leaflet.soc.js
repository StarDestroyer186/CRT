function MapClassImpl(container, opts, searchbar, extbar, history, drivers4jb) {	
	this.opts_poly = {
		strokeColor: opts.lineColor || "#f00",
		strokeOpacity: opts.lineOpacity || 0.8,
		strokeWeight: opts.lineWidth || 3,
		strokeMovesWeight: opts.lineMovesWidth || 8,
		strokeMovesColor: "green",
		point: true
	}
	this.history = history;
	this.trackpts = [];
	this.showingMarkers = [];
	this.lastMarker = null;
	this.animationMarker = [];
	this.markerCluster;
	this.isClusters = true;
	this.isShowMarkers = false;
	this.isShowLabels = true;
	this.isShowStops = true;
	this.isShowEvents = true;
	this.isShowAngles = true;
	this.isShowTimes = false;
	this.isNavigation = false;
	this.isRoute = true;
	this.isSnap = false;
	this.isSnaping = false;
	this.isShowDriver = false;
	this.anglePoints = [];
	this.timePoints = [];
	this.stopPoints = [];
	this.eventPoints = [];
	this.averagePoints = [];
	this.startMarker = null;
	this.endMarker = null;
	this.router = new L.Routing.osrmv1({ serviceUrl: JS_ROUTING_MACHINE_URL });
	this.routing = null;	
	this.routingSnapControl = null;
	this.routingSnapRoute = null;
	this.tracklatLngs = [];
	this.taskPath = null;
	this.currentZoom = opts.zoom;
	this.def_save_points = 50;
	
	var WP = window.parent;
	if(extbar == true || history == true){		
		var $legdiv = $('<div id="legdiv" />').appendTo(container);
		var $tbody = $("<tbody></tbody>").appendTo($legdiv);
		var $trspeed = $("<tr></tr>").appendTo($tbody);
        $("<td width='50'></td>").text(0).appendTo($trspeed);
		$("<td width='50'></td>").text(40).appendTo($trspeed);
		$("<td width='50'></td>").text(80).appendTo($trspeed);
		$("<td width='50'></td>").text(90).appendTo($trspeed);
		$("<td width='50'></td>").text('120'+WP.UNIT_SPEED).appendTo($trspeed);
		
		var $trcolor = $("<tr></tr>").appendTo($tbody);
		$("<td height='8' bgcolor='#5DFEFE'></td>").appendTo($trcolor);
		$("<td height='8' bgcolor='#0096FE'></td>").appendTo($trcolor);
		$("<td height='8' bgcolor='#3200FF'></td>").appendTo($trcolor);
		$("<td height='8' bgcolor='#9A009C'></td>").appendTo($trcolor);
		$("<td height='8' bgcolor='#FF002A'></td>").appendTo($trcolor);
	}

	if(extbar == true){
		var $maptools = $('<div id="maptools" />').appendTo(container.parentElement);
		var $tbody = $("<table></table>").appendTo($maptools);	
		var $trtool0 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_asset' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_object-arrow.svg'/></td>").appendTo($trtool0);
		var $trtool1 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_fit' class='tool_active' height='50%' width='50%' src='../img/tool_fit_assets.svg'/></td>").appendTo($trtool1);
		var $trtool2 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_label' class='tool_active' height='50%' width='50%' src='../img/tool_tips.svg'/></td>").appendTo($trtool2);		
		var $trtool11 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_driver' style='opacity: 0.5' height='50%' width='50%' src='../img/steering_wheel_green.svg'/></td>").appendTo($trtool11);
		var $trtool3 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_marker' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_markers.svg'/></td>").appendTo($trtool3);
		var $trtool4 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_zone' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_zones.svg'/></td>").appendTo($trtool4);
		var $trtool5 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_clusters' class='tool_active' height='50%' width='50%' src='../img/tool_clusters.svg'/></td>").appendTo($trtool5);
		var $trtool6 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_measure' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_caliper.svg'/></td>").appendTo($trtool6);
		var $trtool7 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_ruler' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_ruler.svg'/></td>").appendTo($trtool7);
		var $trtool8 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_navigation' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_navigation.svg'/></td>").appendTo($trtool8);		
		var $trtool9 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_street_view' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_streetview.svg'/></td>").appendTo($trtool9);
		var $trtool10 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_task' style='opacity: 0.5' height='50%' width='50%' src='../img/tasknew.svg'/></td>").appendTo($trtool10);
		
		
	}else if(extbar == false && history == true){
		var $maptools = $('<div id="maptools" style="left: 316px; top: 110px; z-index: 1000;" />').appendTo(container.parentElement);
		var $tbody = $("<table></table>").appendTo($maptools);
		var $trtool1 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_label' class='tool_active' height='50%' width='50%' src='../img/tool_tips.svg'/></td>").appendTo($trtool1);		
		var $trtool10 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_driver' style='opacity: 0.5' height='50%' width='50%' src='../img/steering_wheel_green.svg'/></td>").appendTo($trtool10);
		var $trtool2 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_marker' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_markers.svg'/></td>").appendTo($trtool2);
		var $trtool3 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_zone' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_zones.svg'/></td>").appendTo($trtool3);
		
		var $trtool11 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_measure' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_caliper.svg'/></td>").appendTo($trtool11);
		var $trtool12 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_ruler' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_ruler.svg'/></td>").appendTo($trtool12);
		
		var $trtool4 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_arrow' class='tool_active' height='50%' width='50%' src='../img/tool_arrow.svg'/></td>").appendTo($trtool4);
		var $trtool5 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_point' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_point.svg'/></td>").appendTo($trtool5);
		var $trtool6 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_stop' class='tool_active' height='50%' width='50%' src='../img/tool_stop.svg'/></td>").appendTo($trtool6);
		var $trtool7 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_event' class='tool_active' height='50%' width='50%' src='../img/tool_event.svg'/></td>").appendTo($trtool7);
		var $trtool8 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_route' class='tool_active' height='50%' width='50%' src='../img/tool_route.svg'/></td>").appendTo($trtool8);		
		var $trtool9 = $("<tr></tr>").appendTo($tbody);
		$("<td align='center' height='28px' width='28px' bgcolor='#FFFFFF'><img id='ed_snap' style='opacity: 0.5' height='50%' width='50%' src='../img/tool_snap.svg'/></td>").appendTo($trtool9);
		
		
	}

	var openStreetAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		openStreetUrl = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';
	var openStreetLayer   = L.tileLayer(openStreetUrl, {id: 'mapbox.light', minZoom: 2, maxZoom: 20, attribution: openStreetAttr});
	
	var esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
		minZoom: 2, 
		maxZoom: 19,
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
	});
	
	var esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		minZoom: 2, 
		maxZoom: 19,
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});
	
	var googleStreets, googleHybrid, googleSat, googleTerrain, googleTraffic;
	
	if(JS_GOOGLE_TYPE == 0){
		googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&hl='+JS_CURRENT_LANG+'&x={x}&y={y}&z={z}',{
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3'],
			attribution: 'Google Streets'
		});	
		
		googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&hl='+JS_CURRENT_LANG+'&x={x}&y={y}&z={z}',{
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3'],
			attribution: 'Google Hybrid'
		});
		googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&hl='+JS_CURRENT_LANG+'&x={x}&y={y}&z={z}',{
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3'],
			attribution: 'Google Satellite'
		});
		googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&hl='+JS_CURRENT_LANG+'&x={x}&y={y}&z={z}',{
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3'],
			attribution: 'Google Terrain'
		});
		googleTraffic = L.tileLayer('https://{s}.google.com/vt/lyrs=m@159000000,traffic|seconds_into_week:-1&hl='+JS_CURRENT_LANG+'&x={x}&y={y}&z={z}',{
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3'],
			attribution: 'Google Traffic'
		});
	}else{
		googleStreets = L.gridLayer.googleMutant({
				maxZoom: 24,
				type: "roadmap"
			});
					
		googleHybrid = L.gridLayer.googleMutant({
			maxZoom: 24,
			type: "hybrid",
		});
					
		googleSat = L.gridLayer.googleMutant({
			maxZoom: 24,
			type: "satellite",
		});

		googleTerrain = L.gridLayer.googleMutant({
			maxZoom: 24,
			type: "terrain",
		});
		
		googleTraffic = L.gridLayer.googleMutant({
			maxZoom: 24,
			type: "roadmap",
		});
		googleTraffic.addGoogleLayer("TrafficLayer");
	}
	
	
	/*mapbox street*/
	//var mapboxStreets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	var mapboxStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		maxZoom: 20,
		id: 'mapbox/streets-v11',//'mapbox.streets',
		accessToken: JS_MAPBOX_KEY
	});
	
	/*mapbox satellite*/
	var mapboxSatellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {	
		maxZoom: 20,
		id: 'mapbox.satellite',
		accessToken: JS_MAPBOX_KEY
	});
	
	/*Baidu map*/	
	var baiDuNor = new L.tileLayer.baidu({ layer: 'vec' });
	var baiDuSat = new L.tileLayer.baidu({ layer: 'img' });
	
	/*高德地图*/
	var gaoDe =  L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        minZoom: 2,
        subdomains: ['1', '2', '3', '4']
     });

	var bingRoad = new L.BingLayer(JS_BING_KEY,{type: 'RoadOnDemand', minZoom: 2, maxZoom: 20});	
	var bingAerial = new L.BingLayer(JS_BING_KEY,{type: 'AerialWithLabels', minZoom: 2, maxZoom: 20});	
	
	var osmUrl = "http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png";
	var openSeaMapLayer = L.tileLayer(osmUrl, {
		maxZoom: 20,
		attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
	});
	
	var openAIPLayer = L.tileLayer('https://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.{ext}', {
		attribution: '<a href="https://www.openaip.net/">openAIP Data</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-NC-SA</a>)',
		ext: 'png',
		minZoom: 2,
		maxZoom: 20,
		tms: true,
		detectRetina: true,
		subdomains: '12'
	});
	
	var NASAGIBS_ModisTerraChlorophyll = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_Chlorophyll_A/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
		attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
		bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
		minZoom: 1,
		maxZoom: 7,
		format: 'png',
		time: '',
		tilematrixset: 'GoogleMapsCompatible_Level',
		opacity: 0.75
	});
	
	var openRailwayMapLayer = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
		maxZoom: 20,
		attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	});
	
	this.wndMap = L.map(container, {
		//crs: L.CRS.Baidu,//if baidu map, need this item
		editable: true,
		center: [opts.centerLat, opts.centerLng],
		zoom: 1,//opts.zoom,
		minZoom: 2,
		maxZoom: 20,
		attributionControl: false,
		bounceAtZoomLimits: false,
		layers: [googleStreets],	
		fullscreenControl: true,
		fullscreenControlOptions: {
			position: 'topleft',
			title: JS_FULL_SCREEN,
			forceSeparateButton: false,
			forcePseudoFullscreen: true	
		},
		preferCanvas: !(navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1)//if true ios not working
		//renderer: L.canvas()*/
	});
	var map = this.wndMap;

	var mapLayers = {		
		"Google Streets": googleStreets,
		"Google Hybrid": googleHybrid,		
		"Google Satellite": googleSat,
		"Google Terrain": googleTerrain,
		"Google Traffic": googleTraffic,
		"OSM": openStreetLayer,
		'Bing Road': bingRoad,
		"Bing Aerial": bingAerial,
		"Mapbox Streets": mapboxStreets,
		"Mapbox Satellite": mapboxSatellite,
		"Esri WorldTopoMap": esri_WorldTopoMap,
		"Esri WorldImagery": esri_WorldImagery,
		"高德地图": gaoDe
		//"百度地图": baiDuNor
		//"百度卫星": baiDuSat
	};
	
	var overlayLayers = {
		'OpenSea Layer': openSeaMapLayer,
		'OpenAIP Layer': openAIPLayer,
		'NASAGIBS Layer': NASAGIBS_ModisTerraChlorophyll,
		'Open Railway Layer': openRailwayMapLayer
	}
	/*默认取消次图层
	openSeaMapLayer.addTo(map);*/

	L.control.layers(mapLayers,overlayLayers,{collapsed: true}).addTo(map);
	var self = this;
	
	this.markerCluster = L.markerClusterGroup({
		animate: true, 
		animateAddingMarkers: true, 
		removeOutsideVisibleBounds: true, 
		disableClusteringAtZoom: 20,
		maxClusterRadius: 80,
		iconCreateFunction: defineClusterIcon
	});
	map.addLayer(this.markerCluster);
	this.markerCluster.on('animationend', function (event) {
        self.StopAnimationMarker(true);
    });
	
	this.markerCluster.on('clustermouseover', function(evt) {
	    var clusterMarkers = evt.layer.getAllChildMarkers();
	    $popupTable = $('<table class="tree_table"><table>');
		$tbody = $('<tbody></tbody>').appendTo($popupTable);
		var index = 0;
		
	    clusterMarkers.forEach(function(marker) {			
			var s = marker.properties.sta;
			var ios = marker.properties.io;
			var st = marker.properties.st;

			$tr = $('<tr></tr>').appendTo($tbody);
			$td = $('<td style="font-weight: bold;">' + (marker.properties.title.length > 20 ? (marker.properties.title.substring(0,20)+"..."):marker.properties.title) + '</td>').appendTo($tr);
			$td = $('<td style="white-space:nowrap;">' + marker.properties.s +' '+ WP.UNIT_SPEED + '</td>').appendTo($tr); //speed
			
			if(s != "0"){
				if(typeof st != undefined && st != null && st.indexOf('3005') >= 0){					
					$td = $('<td></td>').attr("class","engine_on").attr("title",WP.JS_ENGINE_ON).appendTo($tr);
				}else{
					if(typeof st != undefined && st != null && st.indexOf('3006') >= 0 && marker.properties.s != null && marker.properties.s > 0){
						$td = $('<td></td>').attr("class","engine_off").attr("title",WP.JS_ENGINE_OFF).appendTo($tr);
					}else{
						$td = $('<td></td>').attr("class","parking").attr("title",WP.JS_PARKING).appendTo($tr);
					}		
				}
			}else{
				$td = $('<td></td>').appendTo($tr);
			}
			
			if(s == "0"){ 
				$td = $('<td></td>').attr("class","offline").attr("title",WP.JS_TIP_OBJ_OFFLINE).appendTo($tr);
			}else{		
				$td = $('<td></td>').attr("class","online").attr("title",WP.JS_TIP_OBJ_ONLINE).appendTo($tr);	
			}
			
			var ptype = getIdValue("62:", ios, true);
			if(typeof ptype != undefined && ptype != null){
				if(ptype == '0'){
					$td = $('<td></td>').attr("class","gpsvalid").attr("title",WP.JS_GPS_VALID).appendTo($tr);
				}else{
					$td = $('<td></td>').attr("class","cellvalid").attr("title",WP.JS_LBS_VALID).appendTo($tr);
				}
			}else{
				if(typeof st != undefined && st.indexOf('200E') >= 0){
					$td = $('<td></td>').attr("class","gpsvalid").attr("title",WP.JS_GPS_VALID).appendTo($tr);
				}else{
					$td = $('<td></td>').attr("class","invalid").attr("title",WP.JS_LOCATION_INVALID).appendTo($tr);
				}
			}
		});
			
	    var popup = L.popup({offset: new L.Point(0, -10), minWidth : 220, maxHeight: 200})
			.setLatLng(evt.latlng)
			.setContent($popupTable.prop("outerHTML"))
			.openOn(map);
	});
	
	var polylineDecoratorLayer = [];
	this.polylineDecoratorLayer = polylineDecoratorLayer;
	this.anglePointsLayer = L.layerGroup();
	var anglePointsLayer = this.anglePointsLayer;
	this.timePointsLayer = L.layerGroup();
	var timePointsLayer = this.timePointsLayer;
	this.stopPointsLayer = L.layerGroup();
	var stopPointsLayer = this.stopPointsLayer;
	this.eventPointsLayer = L.layerGroup();
	var eventPointsLayer = this.eventPointsLayer;
	map.addLayer(anglePointsLayer);
	map.addLayer(timePointsLayer);	
	map.addLayer(stopPointsLayer);
	map.addLayer(eventPointsLayer);
	
	map.on('zoomstart', function(){
		this.currentZoom = map.getZoom();
	});
	
	map.on('zoomend', function() {
		if(this.currentZoom > map.getZoom()){
			self.StopAnimationMarker(false, true);
		}else{
			self.StopAnimationMarker(false, false);
		}
		
		if (map.getZoom() < 16){
			map.removeLayer(anglePointsLayer);
		}else {
			if(self.isShowAngles){
				map.addLayer(anglePointsLayer);
			}			
        }
		if (map.getZoom() < 12){
			map.removeLayer(timePointsLayer);
		}else {
			if(self.isShowTimes){
				map.addLayer(timePointsLayer);
			}			
        }
		//$("#maptools #ed_zone").click().click();
	});
	
	map.on('enterFullscreen', function(){
		$("#maptools, #assetinfo, #stasep").css("display","none");
	});
	map.on('exitFullscreen', function(){
		$("#maptools, #stasep").css("display","block");
		
		if(!$("#staswitch").hasClass("hide_status")){
			$("#assetinfo").css("display","block");		
		}
	});
	
	map.on('moveend', function(){
		self.StopAnimationMarker(false);			
	});
	
	map.on('popupopen', function(e) {
	   console.log('popupopen');	
	   var marker = e.popup._source;
	   if(marker == null || marker.properties == null){
		   return;
	   }
	
	   //update marker popup driver
	   if(typeof marker.properties.jb != "undefined" && typeof marker.properties.n != "undefined"){
		   var driver = drivers4jb[marker.properties.jb];
		   if(driver){
				var pi = driver.img;
				var dn = driver.name;					
				$(".infowindow .infodriver ul #idrvdef_"+marker.properties.n).html(pi);
				$(".infowindow .infodriver ul #ndrvdef"+marker.properties.n).text(dn);
		   }
	   }
	});
	
	if(searchbar == true){
		var $box = $('<div id="mapsearchbar" />').appendTo(container);
		var $edt = $('<input type="text" id="mapsearchtext" />').appendTo($box);
		var marker;
		
		$edt.keyup(function(event) {
			if (event.keyCode == '13') {
				if(marker!=null && map !=null){
					map.removeLayer(marker);
				}
				var address = $("#mapsearchtext").val();
				/*
				$.ajax({
					url:'https://maps.google.com/maps/api/geocode/json?address='+address+'&sensor=false&language='+JS_CURRENT_LANG,
					type:'get',
					success:function(resp){
						if(resp['status']==='OK' && resp.results[0].formatted_address != null && resp.results[0].geometry != null && resp.results[0].geometry.location != null){
							var lat = resp.results[0].geometry.location.lat;
							var lng = resp.results[0].geometry.location.lng;
							marker = L.marker([lat, lng])
								.bindPopup(lat+','+lng, {offset: new L.Point(0, -10)}).openPopup()
								.bindTooltip(resp.results[0].formatted_address, { 
									permanent: true, 
									offset: L.point(0, -42),
									direction: 'center' 
								}).addTo(map);
							map.setView(marker.getLatLng(), 18);			
						} else {
							 alert('not found');
						}			
					}   
				});*/
				
				if(address!=""){
					var latLng = address.split(",");
					
					if(latLng.length == 2 && !isNaN(latLng[0]) && !isNaN(latLng[1])){
						var lat = parseFloat(latLng[0]);
						var lng = parseFloat(latLng[1]);
							
						marker = L.marker([lat, lng])
								.bindPopup(lat+','+lng, {offset: new L.Point(0, -10)}).openPopup()
								.bindTooltip(address, { 
									permanent: true, 
									offset: L.point(0, -42),
									direction: 'center' 
								}).addTo(map);
							map.setView(marker.getLatLng(), 18);
					}else{
						//var geocoder = L.Control.Geocoder.mapzen('search-DopSHJw');
						var geocoder = L.Control.Geocoder.nominatim();
							 
						geocoder.geocode(address, function(results) {
							if(results != "undefined" && results.length > 0 && results[0].center != "undefined"){							
								var lat = results[0].center.lat;
								var lng = results[0].center.lng;
								marker = L.marker([lat, lng])
									.bindPopup(lat+','+lng, {offset: new L.Point(0, -10)}).openPopup()
									.bindTooltip(results[0].name, { 
										permanent: true, 
										offset: L.point(0, -42),
										direction: 'center' 
									}).addTo(map);
								map.setView(marker.getLatLng(), 18);			
							} else {
								 alert('not found');
							}						 
						});						
					}										
			    }
			}
		});
	}
	
	//面积测量
	var areaMeasure = {
		points:[],
		color: "#3388FF",
		layers: L.layerGroup(),
		polygon: null,
		//first: true,
		init:function(){
			areaMeasure.destroy();
			areaMeasure.points = [];
			areaMeasure.polygon = null;
			//areaMeasure.first = true;
			areaMeasure.layers.addTo(map);
			map.on('click', areaMeasure.click).on('dblclick', areaMeasure.dblclick);
		},
		close:function(){
			var lab = rectangleMeasure.tips.getLabel();
			var tt = document.createTextNode(rectangleMeasure.tips.getLabel()._content);
			lab._container.innerHTML = "";
			lab._container.appendChild(tt);
			var span = document.createElement("span");
			span.innerHTML = "【关闭】";
			span.style.color = "#00ff40";
			lab._container.appendChild(span);
			L.DomEvent.addListener(span,"click",function(){
				rectangleMeasure.destroy();
			});
		},
		click:function(e){ 
			/*if(areaMeasure.first) {
				areaMeasure.first = false;
				return;
			};*/
			map.doubleClickZoom.disable();
			// 添加点信息
			areaMeasure.points.push(e.latlng);
			// 添加面
			map.on('mousemove', areaMeasure.mousemove);
		},
		mousemove:function(e){
			areaMeasure.points.push(e.latlng);			
			if(areaMeasure.polygon){
				areaMeasure.layers.removeLayer(areaMeasure.polygon);
			}				
			areaMeasure.polygon = L.polygon(areaMeasure.points,{showMeasurements: true, color: '#3388FF'});	
			try{
				areaMeasure.polygon.addTo(areaMeasure.layers);
			}catch(e) {
				//alert(e);
			}
			areaMeasure.points.pop();			
		},
		dblclick:function(e){ // 双击结束
			if(areaMeasure.polygon){
				areaMeasure.polygon.addTo(areaMeasure.layers);
				areaMeasure.polygon.enableEdit();
				map.on('editable:vertex:drag editable:vertex:deleted', areaMeasure.polygon.updateMeasurements, areaMeasure.polygon);
			}		
			map.off('click', areaMeasure.click).off('mousemove', areaMeasure.mousemove).off('dblclick', areaMeasure.dblclick);
		},
		destroy:function(){			
			if(areaMeasure.layers && areaMeasure.polygon){
				areaMeasure.layers.removeLayer(areaMeasure.polygon);
			}		
			map.removeLayer(areaMeasure.layers);
		}
	}
	this.areaMeasure = areaMeasure;	
	
	var distMeasure = L.control.measure({ 
        keyboard: false,
        activeKeyCode: 'M'.charCodeAt(0),
        cancelKeyCode: 27,
        lineColor: '#3388FF',
        lineWeight: 3,
        lineDashArray: '6, 6',
        lineOpacity: 1,
        //distance formatter
        formatDistance: function (val) {
		   if(JS_UNIT_DISTANCE == 1){
			   return Math.round(1000 * val / 1609.344) / 1000 + 'mile';
		   }else{
			   if (val < 1000) {
				  return Math.round(val) + 'm'
				} else {
				  return Math.round((val / 1000) * 100) / 100 + 'km'
				}
		   }          
        }}).addTo(map);
		
	this.distMeasure = distMeasure;	
	
	if(extbar == true){
		function createButton(label, container) {
			var btn = L.DomUtil.create('button', '', container);
			btn.setAttribute('type', 'button');
			btn.innerHTML = label;
			return btn;
		}
		
		this.routing = L.Routing.control({	
			router: this.router,
			waypoints: [],
			routeWhileDragging: true,
			attributionControl: true,
			addWaypoints : false, 
			collapsible: true,
			geocoder: L.Control.Geocoder.nominatim(),//geocoder: new L.Control.Geocoder.Google('key');
			show: false,
			units: JS_UNIT_DISTANCE == 1 ? "imperial" : "metric"
			//language: JS_CURRENT_LANG
		}).addTo(this.wndMap);
		
		var routing = this.routing;
		var map = this.wndMap;
		var startBtn = null;
		var destBtn = null;
		var that = this;
		
		this.wndMap.on('click', function(e) {
			if(!that.isNavigation){
				return;
			}
			var container = L.DomUtil.create('div'),
				startBtn = createButton(JS_NAVIGATION_START, container),
				destBtn = createButton(JS_NAVIGATION_END, container);

			L.popup()
				.setContent(container)
				.setLatLng(e.latlng)
				.openOn(map);
			
			L.DomEvent.on(startBtn, 'click', function() {
				routing.setWaypoints([e.latlng]);
				map.closePopup();
			});
			
			L.DomEvent.on(destBtn, 'click', function() {
				routing.spliceWaypoints(routing.getWaypoints().length - 1, 1, e.latlng);
				map.closePopup();
			});
		});
		
	}
	
	function defineClusterIcon(cluster) {
		/*function that generates a svg markup for the pie chart*/
		function bakeThePie(options) {
			/*data and valueFunc are required*/
			if (!options.data || !options.valueFunc) {
				return '';
			}
			var data = options.data,
			valueFunc = options.valueFunc,
			r = options.outerRadius ? options.outerRadius : 28, //Default outer radius = 28px
			rInner = options.innerRadius ? options.innerRadius : r - 10, //Default inner radius = r-10
			strokeWidth = options.strokeWidth ? options.strokeWidth : 1, //Default stroke is 1
			pathClassFunc = options.pathClassFunc ? options.pathClassFunc : function () {
				return '';
			}, //Class for each path
			pathTitleFunc = options.pathTitleFunc ? options.pathTitleFunc : function () {
				return '';
			}, //Title for each path
			pieClass = options.pieClass ? options.pieClass : 'marker-cluster-pie', //Class for the whole pie
			pieLabel = options.pieLabel ? options.pieLabel : d3.sum(data, valueFunc), //Label for the whole pie
			pieLabelClass = options.pieLabelClass ? options.pieLabelClass : 'marker-cluster-pie-label', //Class for the pie label

			origo = (r + strokeWidth), //Center coordinate
			w = origo * 2, //width and height of the svg element
			h = w,
			donut = d3.layout.pie(),
			arc = d3.svg.arc().innerRadius(rInner).outerRadius(r);

			//Create an svg element
			var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
			//Create the pie chart
			var vis = d3.select(svg)
				.data([data])
				.attr('class', pieClass)
				.attr('width', w)
				.attr('height', h);

			var arcs = vis.selectAll('g.arc')
				.data(donut.value(valueFunc))
				.enter().append('svg:g')
				.attr('class', 'arc')
				.attr('transform', 'translate(' + origo + ',' + origo + ')');

			arcs.append('svg:path')
			.attr('class', pathClassFunc)
			.attr('stroke-width', strokeWidth)
			.attr('d', arc)
			.append('svg:title')
			.text(pathTitleFunc);
			
			vis.append("circle")
			.attr('cx', origo)
			.attr('cy', origo)
			.attr("r", 12)
			.attr("fill", "#F1F1F1");

			vis.append('text')
			.attr('x', origo)
			.attr('y', origo)
			.attr('class', pieLabelClass)
			.attr('text-anchor', 'middle')
			//.attr('dominant-baseline', 'central')
			/*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
			.attr('dy', '.3em')
			.text(pieLabel);
			//Return the svg-markup rather than the actual element
			return serializeXmlNode(svg);
		}

		/*Helper function*/
		function serializeXmlNode(xmlNode) {
			if (typeof window.XMLSerializer != "undefined") {
				return (new window.XMLSerializer()).serializeToString(xmlNode);
			} else if (typeof xmlNode.xml != "undefined") {
				return xmlNode.xml;
			}
			return "";
		}

		var children = cluster.getAllChildMarkers();
		
		var n = children.length; //Get number of markers in cluster
		var strokeWidth = 1; //Set clusterpie stroke width
		var r = 20;//30 - 2 * strokeWidth - (n < 10 ? 12 : n < 100 ? 8 : n < 1000 ? 4 : 0); //Calculate clusterpie radius...
		var iconDim = (r + strokeWidth) * 2; //...and divIcon dimensions (leaflet really want to know the size)
		var data = d3.nest() //Build a dataset for the pie chart
			.key(function (d) {
				return d.properties.mt;
			})
			.entries(children, d3.map);
		//bake some svg markup
		var html = bakeThePie({
				data : data,
				valueFunc : function (d) {
					return d.values.length;
				},
				strokeWidth : 1,
				outerRadius : r,
				innerRadius : r - 8,
				pieClass : 'cluster-pie',
				pieLabel : n,
				pieLabelClass : 'marker-cluster-pie-label',
				pathClassFunc : function (d) {
					return "category-" + d.data.key;
				}
			});
		//Create a new divIcon and assign the svg markup to the html property
		var myIcon = new L.DivIcon({
				html : html,
				className : 'marker-cluster',
				iconSize : new L.Point(iconDim, iconDim)
			});
		return myIcon;
	}
	
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
	createButton: function(label, container) {
		var btn = L.DomUtil.create('button', '', container);
		btn.setAttribute('type', 'button');
		btn.innerHTML = label;
		return btn;
	},
	ActiveNavigationTool: function(active){		
		this.isNavigation = active;
		
		if(active){	
			this.routing.show();			
		}else{
			this.routing.spliceWaypoints(0, 2);
			this.routing.hide();
		}
	},
	ActiveTaskPathTool: function(active, points, message){			
		if(active){
			var waypoints = [L.latLng(points[0][0], points[0][1]), L.latLng(points[1][0], points[1][1])];
			var geocoder = L.Control.Geocoder.nominatim();
			
			this.taskPath = L.Routing.control({	
				router: this.router,
				waypoints: waypoints,
				routeWhileDragging: false,
				attributionControl: true,
				addWaypoints : false, 
				collapsible: true,
				geocoder: geocoder,
				show: false,
				units: JS_UNIT_DISTANCE == 1 ? "imperial" : "metric",
				//collapseBtn: function(){alert('close')},
				plan: L.Routing.plan(waypoints, {
					createMarker: function(i, wp) {
						if(waypoints[0]) {
							return L.marker(wp.latLng, {
								draggable: false
							}).bindTooltip(message[i], { 
								permanent: true, 
								offset: L.point(0, 0),
								direction: 'bottom' 
							});//.bindPopup(message[i]).openPopup();
						}
					}
				})
			//language: JS_CURRENT_LANG
			}).addTo(this.wndMap);
			this.taskPath.show();			
		}else{
			if(this.taskPath != null && typeof this.taskPath != "undefined"){
				this.taskPath.spliceWaypoints(0, 2);
				this.taskPath.hide();
			}			
		}
	},
	ActiveMeasureTool: function(active){
		if(active){
			this.areaMeasure.init();
		}else{
			this.areaMeasure.destroy();
		}
	},
	ActiveRulerTool: function(active){
		if(active){
			this.distMeasure._startMeasuring();
		}else{
			this.distMeasure._stopMeasuring();
		}
	},
	AddEvent: function(name, event){
		this.wndMap.on(name, event);
	},
	Free: function() {
		this.trackpts = null;
		this.wndMap = null;
	},
	Center: function(lat, lng, zoom) {
		this.wndMap.panTo(new L.LatLng(lat,lng));
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
	GeoNames: function(x, y, element, style, geocoders) {
		try {
			var self = this;
			$.get("address.ajax.php", {"lat": y / 1000000.0, "lng": x / 1000000.0}, function(data) {  					
				try {
					if(data != '.' && data != 'no login'){						
						var result = eval('(' + data + ')');
						if(result.addr != null && typeof result.addr != "undefined"){
							element.removeClass("query_waiting");
							var ret = result.addr;
							try {
								if (style == "text") {
									element.text(ret)
								} else if (style == "val") {
									element.val(ret)
								} else if (style == "html") {
									element.html(ret)
								} else if (style == "link"){
									element.html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+y / 1000000.0 + "," + x / 1000000.0 +">"+ret+" </a>")
								}
							} catch(e) {}						
						}
					}else{
						if(typeof geocoders == "undefined"){
						/*$.ajax({
							url:JS_GOOGLE_MAP_BASE_LINK+'/maps/api/geocode/json?latlng='+y / 1000000.0+','+x / 1000000.0+'&sensor=false&language='+JS_CURRENT_LANG,
							type:'get',
							dataType:'json',
							success:function(resp){
								if(resp['status']==='OK'){
									element.removeClass("query_waiting");
									var ret = resp.results[0].formatted_address;
									try {
										if (style == "text") {
											element.text(ret)
										} else if (style == "val") {
											element.val(ret)
										} else if (style == "html") {
											element.html(ret)
										}
									} catch(e) {}
								}else{
									//if google fail, then use ArcGis
									var url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location="+x / 1000000.0+","+y / 1000000.0+"&f=pjson";
									$.get(url, function(data){
										if(data != null && typeof data != "undefined"){
											var result = eval('(' + data + ')');
											if(result.address != null && typeof result.address != "undefined"){
												element.removeClass("query_waiting");
												var ret = result.address.LongLabel;
												try {
													if (style == "text") {
														element.text(ret)
													} else if (style == "val") {
														element.val(ret)
													} else if (style == "html") {
														element.html(ret)
													}
												} catch(e) {}
											}
										}
									});					
								}
							}   
						});*/
						
						var url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location="+x / 1000000.0+","+y / 1000000.0+"&f=pjson";
						$.get(url, function(data){
							if(data != null && typeof data != "undefined"){
								var result = eval('(' + data + ')');
								if(result.address != null && typeof result.address != "undefined"){
									element.removeClass("query_waiting");
									var ret = result.address.LongLabel;
									try {
										if (style == "text") {
											element.text(ret)
										} else if (style == "val") {
											element.val(ret)
										} else if (style == "html") {
											element.html(ret)
										} else if (style == "link"){
											element.html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+y / 1000000.0 + "," + x / 1000000.0 +">"+ret+" </a>")
										}
										self.SaveGeoName(y / 1000000.0, x / 1000000.0, ret);
									} catch(e) {}
								}
							}
						});	
					}else{
						var geocoder = null;
						if(geocoders > 2){
							return;
						}
						switch(geocoders){
							case 0:
								geocoder = L.Control.Geocoder.nominatim();
								break;
								
							case 1:
								geocoder = L.Control.Geocoder.arcgis();
								break;

							case 2:
								geocoder = L.Control.Geocoder.mapzen('search-DopSHJw');
								break;									
						}
						var latlng = L.latLng(y / 1000000.0, x / 1000000.0);
						
						geocoder.reverse(latlng, self.wndMap.options.crs.scale(20), function(results) {
							var r = results[0];
							if (r) {
								element.removeClass("query_waiting");
								var ret = r.name;
								try {
									if (style == "text") {
										element.text(ret)
									} else if (style == "val") {
										element.val(ret)
									} else if (style == "html") {
										element.html(ret)
									} else if (style == "link"){
										element.html("<a target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q="+y / 1000000.0 + "," + x / 1000000.0 +">"+ret+" </a>")
									}
									self.SaveGeoName(y / 1000000.0, x / 1000000.0, ret);
								} catch(e) {self.GeoNames(geocoders + 1);}
							}
						})
					}
								
					/*
					var g = google.maps;
					var pt = new g.LatLng(y / 1000000, x / 1000000);
					var geocoder = new g.Geocoder();
					
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
					})*/
						
					}
					
				} catch(e) {}
			});			
		} catch(e) {
			//geocoder = null			
		}
	},
	SaveGeoName: function(lat, lng, addr){
		$.get("address.ajax.php", {"lat": lat, "lng": lng, "addr": addr}, function(data) {  
			if(data == "."){
				console.log('save address fail');
			}else{
				var result = eval('(' + data + ')');
				if(result.status != null && typeof result.status != "undefined" && result.status == "ok"){
					console.log('save address successful');
				}
			}		
		});
	},
	MoveTop: function(marker){
        if(this.lastMarker != null){
            this.lastMarker.setZIndexOffset(0);
        }
        this.lastMarker = marker;
        marker.setZIndexOffset(1000);
    },
	NewMarker: function(keyid, title, nc, si, x, y, ico, sta, dir, tips, view, extbar, speed, time, stime, st, io, dt, jb, dn) {
		var WP = window.parent;
		var mt = 0; //0: offline, 1: online and static, 2: online and moving, 7: online and alarm, 30: online and idle, 50: other
		var pt = L.latLng(y / 1000000, x / 1000000);
		var iconurl = "../img/arrow-offline.svg";
		if(sta == 1){
			iconurl = "../img/arrow-online.svg";
			mt = 1;
		}else if(sta > 1 && sta < 7){
			iconurl = "../img/arrow-green.svg";
			mt = 2;
		}else if(sta == 7){
			iconurl = "../img/arrow-red.svg";
			mt = 7;
		}else if(sta == 8){
			iconurl = "../img/arrow-black.svg";
			mt = 50;
		}else if(sta == 9){
			iconurl = "../img/arrow-blue.svg";
			mt = 50;
		}else if(sta == 10){
			iconurl = "../img/arrow-green.svg";
			mt = 50;
		}else if(sta == 11){
			iconurl = "../img/arrow-gray.svg";
			mt = 50;
		}else if(sta == 12){
			iconurl = "../img/arrow-orange.svg";
			mt = 50;
		}else if(sta == 13){
			iconurl = "../img/arrow-purple.svg";
			mt = 50;
		}else if(sta == 14){
			iconurl = "../img/arrow-red.svg";
			mt = 50;
		}else if(sta == 15){
			iconurl = "../img/arrow-yellow.svg";
			mt = 50;
		}else if(sta == 30){
			iconurl = "../img/arrow-idle.svg";
			mt = 30;
		}
		
		if(sta == 0 || sta == 1 || sta == 30){
			dir = 0;
		}
		
		var icon = L.icon({
			iconUrl: iconurl,
			iconSize: [28, 28],
			iconAnchor: [14, 14]
		});
		var kind = '../img/icons/icon_'+ico+'.svg';
		
		var io_246 = getIdValue("F6:", io, true);
		var io_247 =getIdValue("F7:", io, true);	
		var pathInfo = "";
		if(io_246 != null && io_247 != null){
			var movingLength = mileageUnitConversion(parseFloat(io_246)*10, WP.JS_UNIT_DISTANCE) * (parseFloat(io_247)/100.0);
			if(movingLength > parseFloat(io_246)){
				movingLength = io_246;
			}
			if(movingLength != null){
				pathInfo = ' | '+ parseFloat(movingLength).toFixed(0) +' '+ WP.UNIT_DIST +" | "+ io_247 + "%";
			}
		}
		var toolTips = '<ul><li style="background: url('+ kind +') no-repeat 0px center; padding-left: 22px; background-size : 18px 18px;">' + title + ' (' + speed + ' ' + WP.UNIT_SPEED + pathInfo + ')</li>' +
					   (this.isShowDriver ? '<li class="popup_driver">'+(dn == null ? "":dn)+'</li>' : '<li style="display: none;" class="popup_driver">'+(dn == null ? "":dn)+'</li>') +
		               '</ul>';
		
		var marker = L.marker(pt, {
			icon: icon,
            rotationAngle: dir,
            draggable: false
        })
		.bindPopup(tips, {offset: new L.Point(0, -10), minWidth : 340}).openPopup();
		/*.bindTooltip(toolTips, { 
			permanent: true, 
			offset: L.point(18, 0),
			direction: 'right' });
		.addTo(this.wndMap);*/
		
		if(this.isShowLabels){
			marker.openTooltip();
		}else{
			marker.closeTooltip();
		}
		
		marker.properties = {
			n: keyid,
			position: pt,
			map: this.wndMap,
			tip: this.wndTip,
			clickable: true,
			title: title,
			nc: nc,
			si: si,
			content: tips,
			x: x,
			y: y,
			ico: ico,
			sta: sta,
			dir: dir,
			s: speed,
			t: time,
			ts: stime,
			tt: toolTips,//marker.getTooltip()
			st: st,
			io: io,
			dt: dt,
			jb: jb,
			dn: dn,
			mt: mt
		}
		
		var self = this;
		marker.on("click", function (event) {
			self.MoveTop(marker);
		});

		if(typeof view != "undefined" && view == true){
            if(!this.wndMap.getBounds().contains(marker.getLatLng())){
				this.wndMap.panTo(marker.getLatLng());
            }
        }
		
		//this.markerCluster.addLayer(marker);
		//this.markerCluster.refreshClusters();
		this.MoveTop(marker);
		return marker;
	},
	UpdateMarker: function(marker, title, nc, si, x, y, ico, sta, dir, tips, view, speed, time, stime, st, io, dt, jb, dn, du) {
		var WP = window.parent;			
		var mt = 0; //0: offline, 1: online and static, 2: online and moving, 7: online and alarm, 30: online and idle, 50: other	
		marker.properties.sta = sta;	
		var iconurl = "../img/arrow-offline.svg";
		/*if(sta == 1){
			iconurl = "../img/arrow-green.svg";
		}else if(sta > 1 && sta < 7){
			iconurl = "../img/arrow-blue.svg";
		}else if(sta == 7){
			iconurl = "../img/arrow-red.svg";
		}*/
		if(sta == 1){
			iconurl = "../img/arrow-online.svg";
			mt = 1;
		}else if(sta > 1 && sta < 7){
			iconurl = "../img/arrow-green.svg";
			mt = 2;
		}else if(sta == 7){
			iconurl = "../img/arrow-red.svg";
			mt = 7;
		}else if(sta == 8){
			iconurl = "../img/arrow-black.svg";
			mt = 50;
		}else if(sta == 9){
			iconurl = "../img/arrow-blue.svg";
			mt = 50;
		}else if(sta == 10){
			iconurl = "../img/arrow-green.svg";
			mt = 50;
		}else if(sta == 11){
			iconurl = "../img/arrow-gray.svg";
			mt = 50;
		}else if(sta == 12){
			iconurl = "../img/arrow-orange.svg";
			mt = 50;
		}else if(sta == 13){
			iconurl = "../img/arrow-purple.svg";
			mt = 50;
		}else if(sta == 14){
			iconurl = "../img/arrow-red.svg";
			mt = 50;
		}else if(sta == 15){
			iconurl = "../img/arrow-yellow.svg";
			mt = 50;
		}else if(sta == 30){
			iconurl = "../img/arrow-idle.svg";
			mt = 30;
		}
		
		var icon = L.icon({
			iconUrl: iconurl,
			iconSize: [28, 28],
			iconAnchor: [14, 14]
		});
		
		if(sta == 0 || sta == 1 || sta == 30){
			dir = 0;
		}
		
		if (marker.properties.s != speed || marker.properties.title != title || marker.properties.ico != ico || getIdValue("F6:", io, true)) {
            marker.properties.title = title;
			marker.properties.s = speed;
			marker.properties.ico = ico;
			
			var kind = '../img/icons/icon_'+ico+'.svg';	
			
			var io_246 = getIdValue("F6:", io, true);
			var io_247 =getIdValue("F7:", io, true);	
			var pathInfo = "";
			if(io_246 != null && io_247 != null){
				var movingLength = mileageUnitConversion(parseFloat(io_246)*10, WP.JS_UNIT_DISTANCE) * (parseFloat(io_247)/100.0);
				if(movingLength > parseFloat(io_246)){
					movingLength = io_246;
				}
				if(movingLength != null){
					pathInfo = ' | '+ parseFloat(movingLength).toFixed(0) +' '+ WP.UNIT_DIST +" | "+ io_247 + "%";
				}
			}
			var toolTips = '<ul><li style="background: url('+ kind +') no-repeat 0px center; padding-left: 22px; background-size : 18px 18px;">' + title + ' (' + speed + ' ' + WP.UNIT_SPEED + pathInfo + ')</li>'+
						   (this.isShowDriver ? '<li class="popup_driver">'+(dn == null ? "":dn)+'</li>' : '<li style="display: none;" class="popup_driver">'+(dn == null ? "":dn)+'</li>') +
						   '</ul>';						   
					
			marker.setTooltipContent(toolTips);	
			marker.properties.tt = (toolTips);
			
        }
		
		var start = {'latitude': marker.properties.y / 1000000, 'longitude': marker.properties.x / 1000000};
		var end = {'latitude': y / 1000000, 'longitude': x / 1000000};		
		var angle = bearing(start, end);
		if(angle < 0){
			angle = angle + 360;
		}
		
		if (marker.properties.x != x || marker.properties.y != y) {
			var pt = L.latLng(y / 1000000, x / 1000000);			
			var pts = L.latLng(marker.properties.y / 1000000, marker.properties.x / 1000000);			
			var m = this.markerCluster.getVisibleParent(marker);
			
			if (!isMinStatus() && this.wndMap.getBounds().contains(pt) && this.wndMap.getBounds().contains(pts) && m && "_popup" in m) {			    
			    this.animationMarker[title] = marker;
			    var isPopup = marker.isPopupOpen();				
			    marker.closePopup();
				
				var cicon = false;
				if(sta != 0 && sta != 1 && sta != 30){
					marker.setIcon(icon);	
					cicon = true;
				}
							
				var that = this;
				marker.setEnd(function(){
					var markers = [];
					markers.push(marker);
					that.ToggleDriver(markers,that.isShowDriver);
					marker.setRotationAngle(dir);
					that.MoveTop(marker);					
					delete that.animationMarker[title];
					if(isPopup){
						marker.closePopup();
						marker.openPopup();	
					}
					if(!cicon){
						marker.setIcon(icon);	
					}
				});
				marker.slideTo(pt, {
					duration: du ? du : 0,
					rotationAngle: angle
				});
				
			} else {
			    marker.setRotationAngle(dir);
			    marker.setLatLng(pt);
				marker.setIcon(icon);
			    this.MoveTop(marker);
				var markers = [];
				markers.push(marker);
				this.ToggleDriver(markers,this.isShowDriver);
			}
						
			marker.properties.x = x;
			marker.properties.y = y;
		}else{
			marker.setIcon(icon);
			marker.setRotationAngle(dir);
		}
		
		if (marker.properties.dir != dir) {
			marker.properties.dir = dir
		}
		
		if (marker.properties.t != time) {
            marker.properties.t = time
        }
		if (marker.properties.ts != stime) {
            marker.properties.ts = stime
        }
		if (marker.properties.st != st) {
            marker.properties.st = st
        }
		if (marker.properties.io != io) {
            marker.properties.io = io
        }
		if (marker.properties.dt != dt) {
            marker.properties.dt = dt
        }
		if (marker.properties.jb != jb) {
            marker.properties.jb = jb
        }
		if (marker.properties.dn != dn) {
            marker.properties.dn = dn
        }
		if (marker.properties.nc != nc) {
            marker.properties.nc = nc
        }
		if (marker.properties.si != si) {
            marker.properties.si = si
        }
		if (marker.properties.mt != mt) {
            marker.properties.mt = mt
        }
		if (marker.properties.content != tips) {
			marker.properties.content = tips
			marker.getPopup().setContent(tips);
		}
		
		if(typeof view != "undefined" && view == true){
            this.MoveTop(marker);
            if(!this.wndMap.getBounds().contains(marker.getLatLng())){
				this.wndMap.panTo(marker.getLatLng());
            }
        }
		
		if(this.isShowLabels){
			marker.openTooltip();
		}else{
			marker.closeTooltip();
		}
	},
	StopAnimationMarker: function(byCluster, must){
		for (var keyid in this.animationMarker) {
			if(this.animationMarker[keyid] != null){				
			    if (byCluster) {
					var m = this.markerCluster.getVisibleParent(this.animationMarker[keyid]);
					if(m && "_popup" in m){
						continue;
					}else{
						var pt = L.latLng(this.animationMarker[keyid].properties.y / 1000000, this.animationMarker[keyid].properties.x / 1000000);
						this.animationMarker[keyid].setLatLng(pt);
						this.animationMarker[keyid].setRotationAngle(this.animationMarker[keyid].properties.dir);
						this.MoveTop(this.animationMarker[keyid]);
						var markers = [];
						markers.push(this.animationMarker[keyid]);
						this.ToggleDriver(markers,this.isShowDriver);
						delete this.animationMarker[keyid];
					}
				} else{
					var pt = L.latLng(this.animationMarker[keyid].properties.y / 1000000, this.animationMarker[keyid].properties.x / 1000000);
					if(!this.wndMap.getBounds().contains(pt) || must){
						this.animationMarker[keyid].setLatLng(pt);
						this.animationMarker[keyid].setRotationAngle(this.animationMarker[keyid].properties.dir);
						this.MoveTop(this.animationMarker[keyid]);
						var markers = [];
						markers.push(this.animationMarker[keyid]);
						this.ToggleDriver(markers,this.isShowDriver);
						delete this.animationMarker[keyid];
					}
				}		
			}			
		}			
	},
	AddLine: function(x1, y1, x2, y2, color, weight, opacity, du) {
		if(x1 != x2 || y1 != y2){
			var route = [];			
			route[0] = new L.LatLng(y1 / 1000000, x1 / 1000000);
			route[1] = new L.LatLng(y2 / 1000000, x2 / 1000000);
			
			var line;
			if(du == null){
				line = new L.polyline(route, {
					color: color || this.opts_poly.strokeColor,
					opacity: opacity || this.opts_poly.strokeOpacity,
					weight: weight || this.opts_poly.strokeWeight,
					smoothFactor: 1
				});
			}else{
				/**time calibration*/
				if(this.wndMap.getZoom() > 14){
					du = du - 50;
				}else{
					du = du - 250;
				}
				
				line = L.motion.polyline(route, {
					color: color || this.opts_poly.strokeColor,
					opacity: opacity || this.opts_poly.strokeOpacity,
					weight: weight || this.opts_poly.strokeWeight,
					smoothFactor: 1
					}, {
						auto: true,
						easing: L.Motion.Ease.linear
					}).motionDuration(du && this.wndMap.getBounds().contains(route[0]) && this.wndMap.getBounds().contains(route[1]) ? du : 0);
				line.addTo(this.wndMap);
			}
			return line;
		}else{
			return null;
		}
	},
	AddPoint: function(fx, fy, fd, x, y, s, t, d, tp, st, et, dut, ad){
		if (x != 0 && y !=0 && (tp  ==1 || tp == 2 || tp == 3 || tp == 6 || fx != x || fy != y)){
			var markerType = 0;
			var pt = tp == 1 || tp == 3 || tp == 6 ? new L.LatLng(fy / 1000000, fx / 1000000) : new L.LatLng(y / 1000000, x / 1000000);
			var image;
			var tips = "";
			
			switch(tp)
			{
			case 1:
			    //start
				image = L.icon({
					iconUrl: '../img/route-start.svg',
					iconSize: [28, 28],
					iconAnchor: [14, 28]
				});
				markerType = 7;
				tips +="<div class='infowindow'>"+"<ul>";
				tips += "<h3>" + JS_START_POINT + "</h3>";
				var p = getSpeedState(1, 1, s, t, 0);//defaul online and gpsvalid and no alarm
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/move.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/parking.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" + "<a style ='color: #4D8ED9; text-decoration: none;' target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q=" + (y / 1000000).toFixed(5) + "," + (x / 1000000).toFixed(5) + ">" +  (y / 1000000).toFixed(5) + " &#176;," + (x / 1000000).toFixed(5) + " &#176;</a></span></li>";
				tips += "</ul></div>";
			    break;
			case 2:
			    //end
				image = L.icon({
					iconUrl: '../img/route-end.svg',
					iconSize: [28, 28],
					iconAnchor: [14, 28]
				});
				markerType = 8;
				tips +="<div class='infowindow'>"+"<ul>";
				tips += "<h3>" + JS_END_POINT + "</h3>";
				var p = getSpeedState(1, 1, s, t, 0);//defaul online and gpsvalid and no alarm
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/move.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/parking.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  "<a style ='color: #4D8ED9; text-decoration: none;' target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q=" + (y / 1000000).toFixed(5) + "," + (x / 1000000).toFixed(5) + ">" +  (y / 1000000).toFixed(5) + " &#176;," + (x / 1000000).toFixed(5) + " &#176;</a></span></li>";
				tips += "</ul></div>";
			    break;
			case 3:
				//stop
				image = L.icon({
					iconUrl: '../img/route-stop.svg',
					iconSize: [28, 28],
					iconAnchor: [14, 28]
				});
				markerType = 4;
				tips +="<div class='infowindow'>";
				tips += "<h3>" + JS_STOP + "</h3>";
				tips +="<table>";
				tips +="<tr><td>"+JS_START+"</td><td style='padding-left:10px;'>"+st+"</td></tr>";
				tips +="<tr><td>"+JS_END+"</td><td style='padding-left:10px;'>"+et+"</td></tr>";
				tips +="<tr><td>"+JS_DURATION+"</td><td style='padding-left:10px;'>"+dut+"</td></tr>";
				tips += "</table></div>";
				break;
			case 4:
				/*if(fd == d && d != 0 && s > 0){
					image = L.icon({
						iconUrl: '../img/arrow-angle.svg',
						iconSize: [16, 16],
						iconAnchor: [8, 8]
					});
					markerType = 1;
				}else{*/
					image = L.icon({
						iconUrl: '../img/waypoint_icon1.png',
						iconSize: [10, 10],
						iconAnchor: [5, 5]
					});
					markerType = 2;
				//}
				
				tips +="<div class='infowindow'>"+"<ul>";
				var p = getSpeedState(1, 1, s, t, 0);//defaul online and gpsvalid and no alarm
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/move.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/parking.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  "<a style ='color: #4D8ED9; text-decoration: none;' target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q=" + (y / 1000000).toFixed(5) + "," + (x / 1000000).toFixed(5) + ">" +  (y / 1000000).toFixed(5) + " &#176;," + (x / 1000000).toFixed(5) + " &#176;</a></span></li>";
				tips += "</ul></div>";
				break;
				
			case 5:
				image = L.icon({
					iconUrl: '../img/waypoint_icon1.png',
					iconSize: [10, 10],
					iconAnchor: [5, 5]
				});
				markerType = 6;			
				tips +="<div class='infowindow'>"+"<ul>";
				var p = getSpeedState(1, 1, s, t, 0);//defaul online and gpsvalid and no alarm
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/move.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/parking.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  "<a style ='color: #4D8ED9; text-decoration: none;' target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q=" + (y / 1000000).toFixed(5) + "," + (x / 1000000).toFixed(5) + ">" +  (y / 1000000).toFixed(5) + " &#176;," + (x / 1000000).toFixed(5) + " &#176;</a></span></li>";
				tips += "</ul></div>";
				break;
				
			case 6:
				//event
				image = L.icon({
					iconUrl: '../img/route-event.svg',
					iconSize: [28, 28],
					iconAnchor: [14, 28]
				});
				markerType = 5;
				tips +="<div class='infowindow'>";
				tips += "<h3>" + ad + "</h3>"+"<ul>";
				var p = getSpeedState(1, 1, s, t, 0);//defaul online and gpsvalid and no alarm
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/move.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/parking.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  "<a style ='color: #4D8ED9; text-decoration: none;' target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q=" + (y / 1000000).toFixed(5) + "," + (x / 1000000).toFixed(5) + ">" +  (y / 1000000).toFixed(5) + " &#176;," + (x / 1000000).toFixed(5) + " &#176;</a></span></li>";
				tips += "</ul></div>";
				break;
				
			case 7:
				image = L.icon({
					iconUrl: '../img/arrow-angle.svg',
					iconSize: [16, 16],
					iconAnchor: [8, 8]
				});				
				markerType = 3;
				
				tips +="<div class='infowindow'>"+"<ul>";
				var p = getSpeedState(1, 1, s, t, 0);//defaul online and gpsvalid and no alarm
				if(s > 0){
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/move.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}else{
					tips += "<li class='infospeed' style='padding-left: 18px; background: url(img/parking.svg) no-repeat 0px; background-size : 18px 18px;'>" + " <span>" + "&nbsp;&nbsp;" + p.spd + "</span></li>";
				}

				tips += "<li class='infoltime'>" + " <span>" + "&nbsp;&nbsp;" + t + "</span></li>" +				
						"<li class='infolocal'>" + " <span>" + "&nbsp;&nbsp;" +  "<a style ='color: #4D8ED9; text-decoration: none;' target='_blank' href="+JS_GOOGLE_MAP_BASE_LINK+"/maps?hl=en&q=" + (y / 1000000).toFixed(5) + "," + (x / 1000000).toFixed(5) + ">" +  (y / 1000000).toFixed(5) + " &#176;," + (x / 1000000).toFixed(5) + " &#176;</a></span></li>";
				tips += "</ul></div>";
				break;	
			
			}
			
			var marker = L.marker(pt, {
				icon: image,
				rotationAngle: (markerType == 1 || markerType == 3) ? d : 0,
				draggable: false
			})
			.bindPopup(tips, {offset: new L.Point(0, markerType == 0 || markerType == 4 || markerType == 5 || markerType == 7 || markerType == 8 ? -25 : -5)});//.openPopup();

			var self = this;
			marker.on("click", function (event) {
				self.MoveTop(marker);
			});
			
			if(typeof markerType != "undefined" && markerType != null){
				if(markerType == 0 || markerType == 3 || markerType == 6 || markerType == 7 || markerType == 8){
					marker.addTo(this.wndMap);
					if(markerType == 3){
						this.averagePoints.push(marker);
					}else if(markerType == 7){
						this.startMarker = marker;
					}else if(markerType == 8){
						this.endMarker = marker;
					}
				}else if(markerType == 1){
					this.anglePoints.push(marker);
					this.anglePointsLayer.addLayer(marker);
				}else if(markerType == 2){
					this.timePoints.push(marker);
					this.timePointsLayer.addLayer(marker);
				}else if(markerType == 4){
					this.stopPoints.push(marker);
					this.stopPointsLayer.addLayer(marker);
				}else if(markerType == 5){
					this.eventPoints.push(marker);
					this.eventPointsLayer.addLayer(marker);
				}
			}
			
			return marker;
		}else{
			return null;
		}
	},
	AddTrackPoint: function(keyid, x, y, s, t, d, opts, du) {
		var pts = this.trackpts[keyid];
		if (typeof pts != "undefined" && pts != null){
			if(pts.x != x || pts.y != y) {
				var color = getSpeedColor(s);
				var line = null;
				var marker = null;
				var weight, opacity, point;
				if(opts != null && typeof opts != "undefined"){
					weight = opts.weight;
					opacity = opts.opacity;
					point = opts.point;
				}else{
					weight = this.opts_poly.strokeWeight;
					opacity = this.opts_poly.strokeOpacity;
					point = this.opts_poly.point;
				}
				line = this.AddLine(pts.x, pts.y, x, y, color, weight, opacity, du); 
				
				if(point){
					marker = this.AddPoint(pts.x, pts.y, pts.d, x, y, s, t, d, 5);
					marker.setZIndexOffset(0);
					if(du != null && du > 0){
						this.wndMap.removeLayer(marker);
						var that  = this;
						setTimeout(function(){
							var res = false;
							for(var i = 0; i < pts.info.length; i++){
								if(pts.info[i].point == marker){
									res = true;
								}
							}
							
							if(that.trackpts[keyid] && res){
								that.wndMap.addLayer(marker);	
							}else{
								that.wndMap.removeLayer(line);
							}							
						}, du - 200);
					}
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
							this.wndMap.removeLayer(firstinfo.line);
							firstinfo.line = null;
						}
						if(typeof firstinfo.point != "undefined" && firstinfo.point != null){
							this.wndMap.removeLayer(firstinfo.point);
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
	DrawTrackLine: function(keyid, tracks, opts, stops, nstops, events, nevents, nangles, ntimes, moves, du) {
		this.isShowStops = nstops;
		this.isShowEvents = nevents;
		this.isShowAngles = nangles;
		this.isShowTimes = ntimes;
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
			var moveCenter = null;
			var moveStep = null; 
			var latLngs = [];

			if(moves != null && typeof moves.length != "undefined" && moves.length > 0){
				for(var j = 0; j < moves.length; j++){
					this.tracklatLngs[moves[j].GPS_TIME_START] = new L.latLng(moves[j].LAT_START, moves[j].LNG_START);
					this.tracklatLngs[moves[j].GPS_TIME_END] = new L.latLng(moves[j].LAT_END, moves[j].LNG_END);					
				}
								
				moveStep = moves.shift();	
				moveCenter = newDate(moveStep.GPS_TIME_START).getTime() + (newDate(moveStep.GPS_TIME_END).getTime() - newDate(moveStep.GPS_TIME_START).getTime()) / 2; 						
			}			
			var multiCoords1 = [];
			for (var i = 1; i < tracks.length; i++) {
				color = getSpeedColor(tracks[i].s);
				var line = null;
				var marker = null;
				line = this.AddLine(tracks[i - 1].x, tracks[i - 1].y, tracks[i].x, tracks[i].y, color, weight, opacity, du);
				multiCoords1.push([tracks[i - 1].y / 1000000, tracks[i - 1].x / 1000000]);
				
				if(point){
					var ftime = $.format.date(tracks[i].tg, JS_DEFAULT_DATETIME_fmt_JS);
					if(i == 1){
						/*Draw start point*/
						var fstime = $.format.date(tracks[i - 1].tg, JS_DEFAULT_DATETIME_fmt_JS);
						marker = this.AddPoint(tracks[i - 1].x, tracks[i - 1].y, tracks[i - 1].d, tracks[i].x, tracks[i].y, tracks[i].s, fstime, tracks[i].d, 1);
						pts.info.push({ line: null, point: marker });
						
						if(marker != null && moves == null || typeof moves.length == "undefined"){
							this.tracklatLngs[tracks[i].tg] = marker.getLatLng();
						}	
						
						/*If only two points*/
						if(tracks.length == 2){
							marker = this.AddPoint(tracks[i].x, tracks[i].y, tracks[i].d, tracks[i].x, tracks[i].y, tracks[i].s, ftime, tracks[i].d, 2);
							pts.info.push({ line: null, point: marker });						
							
							if(marker != null && moves == null || typeof moves.length == "undefined"){
								this.tracklatLngs[tracks[i].tg] = marker.getLatLng();
							}
						}
					}else if(i == tracks.length - 1){
						/*Draw end point*/
						marker = this.AddPoint(tracks[i - 1].x, tracks[i - 1].y, tracks[i - 1].d, tracks[i].x, tracks[i].y, tracks[i].s, ftime, tracks[i].d, 2);
						pts.info.push({ line: null, point: marker });						
						
						if(marker != null && moves == null || typeof moves.length == "undefined"){
							this.tracklatLngs[tracks[i].tg] = marker.getLatLng();
						}
					}

					/*Draw move center*/
					if(moveCenter != null && moveCenter >= newDate(tracks[i - 1].tg).getTime() && moveCenter <= newDate(tracks[i].tg).getTime()){						
						//marker = this.AddPoint(tracks[i - 1].x, tracks[i - 1].y, tracks[i - 1].d, tracks[i].x, tracks[i].y, tracks[i].s, ftime, tracks[i].d, 7);
						//if(marker != null){
							this.tracklatLngs[tracks[i].tg] = new L.latLng(tracks[i].y / 1000000, tracks[i].x / 1000000);//marker.getLatLng();
						//}					
						
						moveStep = moves.shift();
						if(moveStep != null && typeof moveStep != "undefined"){
							moveCenter = newDate(moveStep.GPS_TIME_START).getTime() + (newDate(moveStep.GPS_TIME_END).getTime() - newDate(moveStep.GPS_TIME_START).getTime()) / 2;							
						}else{
							moveCenter = null;
						}
					}//else{
						marker = this.AddPoint(tracks[i - 1].x, tracks[i - 1].y, tracks[i - 1].d, tracks[i].x, tracks[i].y, tracks[i].s, ftime, tracks[i].d, 4);
					//}															
				}
				pts.x = tracks[i].x;
				pts.y = tracks[i].y;
				pts.d = tracks[i].d;
				if(line != null && marker != null){
					pts.info.push({ line: line, point: marker, time: tracks[i].tg, color: color });
					latLngs.push(marker.getLatLng());
				}				
			}
			
			this.polylineDecoratorLayer[keyid] = L.polylineDecorator(multiCoords1, {
				patterns: [{
					offset: 0, 
					repeat: 300, 
					rotate: false,
					symbol: L.Symbol.arrowHead({ 
						rotate: false,
						pixelSize: 13, 
						headAngle: 40, 
						pathOptions: { 
							weight: 1, 
							fillOpacity: 1, 
							opacity: 1, 
							stroke: true, 
							color: 'white', 
							fill: true, 
							fillColor: '#22B04B', 
							fillOpacity: 1
						}
					}) 	
				}]
			}).addTo(this.wndMap);
			
			/*Draw events*/
			if(typeof events != "undefined" && events.length > 0){	
				var marker = null;
				for (var i = 0; i < events.length; i++) {
					var ftime = $.format.date(events[i].t, JS_DEFAULT_DATETIME_fmt_JS);
				    marker = this.AddPoint(events[i].x, events[i].y, events[i].d, events[i].x, events[i].y, events[i].s, ftime, events[i].d, 6, "", "", "", events[i].e);
					pts.info.push({ line: null, point: marker });
				}
			}
			
			/*Draw stops*/
			if(typeof stops != "undefined" && stops.length > 0){
				var marker = null;
				for (var i = 0; i < stops.length; i++) {
					var fstopstart = $.format.date(stops[i].START_TIME, JS_DEFAULT_DATETIME_fmt_JS);
					var fstopend = $.format.date(stops[i].END_TIME, JS_DEFAULT_DATETIME_fmt_JS);
					var timeout = stops[i].DURATION_SECOND;
					marker = this.AddPoint(stops[i].LNG, stops[i].LAT, 0, stops[i].LNG, stops[i].LAT, 0, fstopend, 0, 3, fstopstart, fstopend, second2time(timeout));
					pts.info.push({ line: null, point: marker });
				}
			}									
						
			this.trackpts[keyid] = pts;
			this.opts_track = {
				point: opts.trackPoint || false, 
				line: opts.trackLine || true
			}  
			
			if(!this.isShowStops){
				this.wndMap.removeLayer(this.stopPointsLayer);
			}
			if(!this.isShowEvents){
				this.wndMap.removeLayer(this.eventPointsLayer);
			}
			if(!this.isShowAngles){
				this.wndMap.removeLayer(this.anglePointsLayer);
				this.wndMap.removeLayer(this.polylineDecoratorLayer[keyid]);
			}
			if(!this.isShowTimes){
				this.wndMap.removeLayer(this.timePointsLayer);
			}		
			
			this.ShowHideTrackLine(keyid, this.isRoute);
			
			if(this.isSnap){
				/*Draw snap*/
				this.ToggleSnapLayer(this.isSnap);
			}
			
			if(latLngs.length > 0){
				this.wndMap.fitBounds(latLngs);
			}			
		} catch(e) {alert(e.message)}
	},
	LocateMarker: function(marker, center, zoomIn, bound, popup) {
		this.StopAnimationMarker(false);
		if(typeof ext != "undefined"){
			//ext.ClearLink();
		}

		if(marker.isPopupOpen() || (typeof zoomIn != "undefined" && zoomIn == true) || (typeof popup != "undefined" && popup == true)){
			marker.closePopup();
			marker.openPopup();	
		}
						
        if(typeof center != "undefined" && center == true){	
			if(bound){
				if(!this.wndMap.getBounds().contains(marker.getLatLng()) || zoomIn){
					this.wndMap.panTo(marker.getLatLng());	
				}			
            }else{
				this.wndMap.panTo(marker.getLatLng());
			}
			/*var m = this.markerCluster.getVisibleParent(marker);
			if (m && "_popup" in m) {
				// marker's visible parent has a popup, ie: it's the marker itself
				// == no parent == not clustered
				alert('1');
			} else {
				// it's a cluster
				var latLngs = [marker.getLatLng()];
				var markerBounds = L.latLngBounds(latLngs);
				this.wndMap.fitBounds(markerBounds);
			}*/				
        }

		if(typeof zoomIn != "undefined" && zoomIn == true){	
			var latLngs = [marker.getLatLng()];
			var markerBounds = L.latLngBounds(latLngs);
			this.wndMap.fitBounds(markerBounds,{maxZoom: this.wndMap.getZoom() < 14 ? 14 : this.wndMap.getZoom()});			
		}
		this.MoveTop(marker);		
	},
	RemoveMarker: function(marker){
        if(typeof marker != "undefined"){
            if(this.lastMarker == marker){
                this.lastMarker = null;
            }
            this.wndMap.removeLayer(marker);
			this.markerCluster.removeLayer(marker);
        }
	},
	RemoveTrack: function(keyid){
		this.anglePointsLayer.clearLayers();
		this.timePointsLayer.clearLayers();
		this.stopPointsLayer.clearLayers();
		this.eventPointsLayer.clearLayers();					
		
		var pts = this.trackpts[keyid];
		if(typeof pts != "undefined"){
			for (var i = 0; i < pts.info.length; i++) {
				var info = pts.info[i];
				if(typeof info.line != "undefined" && info.line != null){
					this.wndMap.removeLayer(info.line);
					info.line = null;
				}
				if(typeof info.point != "undefined" && info.point != null){
					this.wndMap.removeLayer(info.point);
					info.point = null;
				}
			}
			delete this.trackpts[keyid];
		}
		this.anglePoints = [];
		this.timePoints = [];
		this.stopPoints = [];
		this.eventPoints = [];
		this.averagePoints = [];
		this.tracklatLngs = [];
		
		if(this.routingSnapControl != null){
			this.wndMap.removeControl(this.routingSnapControl);
			this.routingSnapControl = null;
		}
		
		if(this.routingSnapRoute != null){
			this.wndMap.removeLayer(this.routingSnapRoute);
			this.routingSnapRoute = null;
		}
		
		if(this.polylineDecoratorLayer[keyid] != null){
			this.wndMap.removeLayer(this.polylineDecoratorLayer[keyid]);
			this.polylineDecoratorLayer[keyid] = null;
		}
	},
	ClearTrack: function(keyid) {
		if(typeof keyid != "undefined"){
			this.RemoveTrack(keyid);
		}else{
			for (var keyid in this.trackpts){
				this.RemoveTrack(keyid);
			}
			this.trackpts = [];
		}
		
	},
	ClearMarker: function(markers) {
        this.lastMarker = null;
		for (var keyid in markers) {
			this.markerCluster.removeLayer(markers[keyid]);
			delete markers[keyid];
		}
	},
	MarkersFitBounds: function(markers){
		var latLngs = [];
		for (var keyid in markers) {
			latLngs.push(markers[keyid].getLatLng());
		}
		this.wndMap.fitBounds(latLngs);	
	},
	ShowHideMovesLine: function(keyid, start, end, show){
		var pts = this.trackpts[keyid];
		if(typeof pts != "undefined"){
			var latLngs = [];
			
			for (var i = 0; i < pts.info.length; i++) {
				var info = pts.info[i];
				if(typeof info.line != "undefined" && info.line != null && 
				   typeof info.point != "undefined" && info.point != null &&
				   typeof info.time != "undefined" && info.time != null &&
				   typeof info.color != "undefined" && info.color != null){
					
					var time = info.time;					
					var line = info.line;
					var color = info.color;
					var marker = info.point;
					if(show && newDate(time) >= newDate(start) && newDate(time) <= newDate(end)){
						line.setStyle({
							weight: this.opts_poly.strokeMovesWeight,
							color: this.opts_poly.strokeMovesColor
						});
						line.bringToFront();
						latLngs.push(marker.getLatLng());
					}else{
						line.setStyle({
							weight: this.opts_poly.strokeWeight,
							color: color
						});
						line.bringToBack();
					}
				}

			}
			this.wndMap.fitBounds(latLngs);			
		}
	},
	ShowHideTrackLine: function(keyid, show){
		this.isRoute = show;
		var pts = this.trackpts[keyid];
		if(typeof pts != "undefined"){
			
			for (var i = 0; i < pts.info.length; i++) {
				var info = pts.info[i];
				if(typeof info.line != "undefined" && info.line != null && 
				   typeof info.point != "undefined" && info.point != null &&
				   typeof info.time != "undefined" && info.time != null &&
				   typeof info.color != "undefined" && info.color != null){
					
					var line = info.line;
					if(show){
						line.addTo(this.wndMap);
					}else{
						this.wndMap.removeLayer(line);
					}
				}
			}		
		}
		this.ShowHideAveragePoint(!show);
	},
	ShowHideAveragePoint: function(show){
		var pts = this.averagePoints;
		if(typeof pts != "undefined"){			
			for (var i = 0; i < pts.length; i++) {				
				if(show){
					this.wndMap.removeLayer(pts[i]);						
				}else{
					pts[i].addTo(this.wndMap);
				}
			}	
		}
	},
	HideShowMarker: function(markers, show) {
		if(show){
			for (var keyid in markers) {
				if(this.isClusters){
					var isPopup = markers[keyid].isPopupOpen()
					this.wndMap.removeLayer(markers[keyid]);
					this.markerCluster.removeLayer(markers[keyid]);
					this.markerCluster.addLayer(markers[keyid]);
					
					if(isPopup){
						markers[keyid].closePopup();
						markers[keyid].openPopup();
					}
				}else{
					this.wndMap.removeLayer(markers[keyid]);
					this.markerCluster.removeLayer(markers[keyid]);
					markers[keyid].addTo(this.wndMap);
				}
				this.showingMarkers[keyid] = markers[keyid];
			}
			this.ToggleMarkerTooltip(markers, this.isShowLabels);
			
		}else{		
			for (var keyid in markers) {		
				markers[keyid].unbindTooltip();
				this.markerCluster.removeLayer(markers[keyid]);
				this.wndMap.removeLayer(markers[keyid]);
				this.ClearTrack(keyid);
				delete this.showingMarkers[keyid];
			}		    
		}
		this.isShowMarkers = show;	
	},
	ClustersMarker: function(clusters){
		this.isClusters = clusters;
		//if(!this.isShowMarkers) return;
		
		if(clusters){
			for (var keyid in this.showingMarkers) {
				this.showingMarkers[keyid].unbindTooltip();
				this.wndMap.removeLayer(this.showingMarkers[keyid]);
				this.markerCluster.addLayer(this.showingMarkers[keyid]);			
			}
		}else{
			for (var keyid in this.showingMarkers) { 
				this.showingMarkers[keyid].unbindTooltip();
				this.markerCluster.removeLayer(this.showingMarkers[keyid]);
				this.showingMarkers[keyid].addTo(this.wndMap);
			}
		}
		this.ToggleMarkerTooltip(this.showingMarkers, this.isShowLabels);
	},
	RefreshClusters: function(){
		this.markerCluster.refreshClusters();
	},
	ToggleMarkerTooltip: function(markers, active){
		if(active){
			for (var keyid in markers) {
				//hide toolTips driver
				if(!this.isShowDriver){
					$(markers[keyid].properties.tt).find(".popup_driver").css("display", "none");
					markers[keyid].properties.tt = $(markers[keyid].properties.tt).get(0);
				}else{
					$(markers[keyid].properties.tt).find(".popup_driver").css("display", "block");
					markers[keyid].properties.tt = $(markers[keyid].properties.tt).get(0);
				}
				
				markers[keyid].unbindTooltip().bindTooltip(markers[keyid].properties.tt, { 
					permanent: true, 
					offset: L.point(18, 0),
					direction: 'right' 
				})
			}	
		}else{
			for (var keyid in markers) {		
				markers[keyid].unbindTooltip();
			}
		}
		this.isShowLabels = active;
	},
	ToggleStopLayer: function(active){
		this.isShowStops = active;
		
		if(active){
			this.wndMap.addLayer(this.stopPointsLayer);
		}else{
			this.wndMap.removeLayer(this.stopPointsLayer);
		}
	},
	ToggleEventLayer: function(active){
		this.isShowEvents = active;
		
		if(active){
			this.wndMap.addLayer(this.eventPointsLayer);
		}else{
			this.wndMap.removeLayer(this.eventPointsLayer);
		}
	},
	ToggleAngleLayer: function(active){
		this.isShowAngles = active;
		
		if(active && this.wndMap.getZoom() >= 16){
			this.wndMap.addLayer(this.anglePointsLayer);
		}else{
			this.wndMap.removeLayer(this.anglePointsLayer);
		}
		
		for(var keyid in this.polylineDecoratorLayer){
			if(this.polylineDecoratorLayer[keyid] != null){
				if(active){
					this.wndMap.addLayer(this.polylineDecoratorLayer[keyid]); 
				}else{
					this.wndMap.removeLayer(this.polylineDecoratorLayer[keyid]);
				}
			}
		}		
	},
	ToggleTimesLayer: function(active){
		this.isShowTimes = active;
		
		if(active && this.wndMap.getZoom() >= 12){
			this.wndMap.addLayer(this.timePointsLayer);
		}else{
			this.wndMap.removeLayer(this.timePointsLayer);
		}
	},
	ToggleDriver: function(markers,active){
		this.isShowDriver = active;
		
		/*if(!this.isShowDriver){
			if($('.popup_driver').is(":visible")) {
				$(".popup_driver").css("display", "none");
			}
		}else{
			if($('.popup_driver').is(':hidden')) {
				$(".popup_driver").css("display", "block");
			}				
		}*/
		
		for (var keyid in markers) {
			//hide toolTips driver							
			if(!this.isShowDriver){
				$(markers[keyid].properties.tt).find(".popup_driver").css("display", "none");
				markers[keyid].properties.tt = $(markers[keyid].properties.tt).get(0);
			}else{
				$(markers[keyid].properties.tt).find(".popup_driver").css("display", "block");
				markers[keyid].properties.tt = $(markers[keyid].properties.tt).get(0);
			}
			
			if(this.isShowLabels){
				markers[keyid].unbindTooltip().bindTooltip(markers[keyid].properties.tt, { 
					permanent: true, 
					offset: L.point(18, 0),
					direction: 'right' 
				})
			}
		}
	},
	ResizeMapContainer: function(){
		 var map = this.wndMap;
		 setTimeout(function(){ map.invalidateSize(true)}, 400);
	},
	GetEventMarker: function(index){
		return this.eventPoints[index];
	},
	GetStopMarker: function(index){
		return this.stopPoints[index];
	},
	GetStartMarker: function(){
		return this.startMarker;
	},
	GetEndMarker: function(){
		return this.endMarker;
	},
	ToggleSnapLayer: function(active){
		if(this.isSnaping){
			return false;
		}				
		this.isSnap = active;
		
		if(active){
			if(this.routingSnapRoute != null){
				this.routingSnapRoute.addTo(this.wndMap);				
			}else if(Object.keys(this.tracklatLngs).length > 0){
				try {
					this.isSnaping = true;
					this.routingSnapControl = L.Routing.control({
						router: this.router,
						waypoints: unique(sortKey2Value(this.tracklatLngs)),
						show: false,
						routeWhileDragging: false,
						waypointMode: 'snap',
						createMarker: function() {}
					}).addTo(this.wndMap);
					
					var that = this;
					this.routingSnapControl.on('routeselected', function(e) {
						that.isSnaping = false;
						that.routingSnapRoute = L.polyline(e.route.coordinates, {color: 'yellow'}).addTo(that.wndMap);	
						that.wndMap.removeControl(that.routingSnapControl);					
					});
				}catch(err) {
					this.isSnaping = false;
				}			
			}
		}else{			
			if(this.routingSnapRoute != null){				
				this.wndMap.removeLayer(this.routingSnapRoute);
			}		
		}		
		return true;
	}
}

	


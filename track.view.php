<?php
session_start();
include_once('lang.inc.php');

if (isset($_GET['objid']) && ($_GET['objid'] != '') && isset($_GET['oflag']) && ($_GET['oflag'] != '')) {
	$objid = $_GET['objid'];
    $oflag = $_GET['oflag'];
	$assets[$objid] = $oflag; 
	$assets = json_encode($assets);
}
else if (isset($_POST['assets']) && $_POST['assets'] != '') {
	$assets = $_POST['assets'];
}
else
	die;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $TEXT['global-trackby']?></title>
<link rel="Bookmark" href="img/favicon.ico" />
<link rel="Shortcut Icon" href="img/favicon.ico" />
<link type="text/css" rel="stylesheet" href="css/style.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/leaflet.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/MarkerCluster.css"/>
<!--<link type="text/css" rel="stylesheet" href="map/leaflet/MarkerCluster.Default.css"/>-->
<link type="text/css" rel="stylesheet" href="map/leaflet/clusterpies.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/Control.FullScreen.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/leaflet.measure.css"/>
<link type="text/css" rel="stylesheet" href="css/jquery.multiselect.css" />
<script type="text/javascript" src="js/jquery.min.js?v=<?php echo $last_ver['jquery.min.js']?>"></script>
<script type="text/javascript" src="js/common.js?v=<?php echo $last_ver['common.js']?>" ></script>
<script type="text/javascript" src="js/jquery.multiselect.js"></script>
<script type="text/javascript" src="map/leaflet/ext.leaflet.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.js"></script>
<script type="text/javascript" src="map/leaflet/proj4.js"></script>
<script type="text/javascript" src="map/leaflet/proj4leaflet.js"></script>
<!--<script type="text/javascript" src="map/leaflet/leaflet.rotatedMarker.js"></script>-->
<script type="text/javascript" src="map/leaflet/leaflet.movingRotatedMarker.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.motion.min.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.markercluster.js"></script>
<script type="text/javascript" src="js/d3.v3.min.js"></script>
<script type="text/javascript" src="map/leaflet/bing.js"></script>
<script type="text/javascript" src="map/leaflet/Control.Geocoder.js"></script>
<script type="text/javascript" src="map/leaflet/Control.FullScreen.js"></script>
<script type="text/javascript" src="map/leaflet/tileLayer.baidu.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.measure.js"></script>
<script type="text/javascript" src="map/leaflet/RoutingMachine/leaflet-routing-machine.min.js"></script>
<script type="text/javascript" src="map/<?php echo $last_name['map.operat.js']?>?v=<?php echo $last_ver['map.operat.js']?>"></script>
<script type="text/javascript" src="map/<?php echo $last_name['map.leaflet.js']?>?v=<?php echo $last_ver['map.leaflet.js']?>"></script>

<!-- Leaflet.draw -->
<script type="text/javascript" src="map/leaflet/draw/Leaflet.draw.js"></script>
<script type="text/javascript" src="map/leaflet/draw/Leaflet.Draw.Event.js"></script>
<link rel="stylesheet" href="map/leaflet/draw/leaflet.draw.css" />
<script type="text/javascript" src="map/leaflet/draw/Toolbar.js"></script>
<script type="text/javascript" src="map/leaflet/draw/Tooltip.js"></script>
<script type="text/javascript" src="map/leaflet/draw/ext/GeometryUtil.js"></script>
<script type="text/javascript" src="map/leaflet/draw/ext/LatLngUtil.js"></script>
<script type="text/javascript" src="map/leaflet/draw/ext/LineUtil.Intersect.js"></script>
<script type="text/javascript" src="map/leaflet/draw/ext/Polygon.Intersect.js"></script>
<script type="text/javascript" src="map/leaflet/draw/ext/Polyline.Intersect.js"></script>
<script type="text/javascript" src="map/leaflet/draw/ext/TouchEvents.js"></script>
<script type="text/javascript" src="map/leaflet/draw/draw/DrawToolbar.js"></script>
<script type="text/javascript" src="map/leaflet/draw/draw/handler/Draw.Feature.js"></script>
<script type="text/javascript" src="map/leaflet/draw/draw/handler/Draw.SimpleShape.js"></script>
<script type="text/javascript" src="map/leaflet/draw/draw/handler/Draw.Polyline.js"></script>
<script type="text/javascript" src="map/leaflet/draw/draw/handler/Draw.Marker.js"></script>
<script type="text/javascript" src="map/leaflet/draw/draw/handler/Draw.CircleMarker.js"></script>
<script type="text/javascript" src="map/leaflet/draw/draw/handler/Draw.Circle.js"></script>
<script type="text/javascript" src="map/leaflet/draw/draw/handler/Draw.Polygon.js"></script>
<script type="text/javascript" src="map/leaflet/draw/draw/handler/Draw.Rectangle.js"></script>
<script type="text/javascript" src="map/leaflet/draw/edit/EditToolbar.js"></script>
<script type="text/javascript" src="map/leaflet/draw/edit/handler/EditToolbar.Edit.js"></script>
<script type="text/javascript" src="map/leaflet/draw/edit/handler/EditToolbar.Delete.js"></script>
<script type="text/javascript" src="map/leaflet/draw/Control.Draw.js"></script>
<script type="text/javascript" src="map/leaflet/draw/edit/handler/Edit.Poly.js"></script>
<script type="text/javascript" src="map/leaflet/draw/edit/handler/Edit.SimpleShape.js"></script>
<script type="text/javascript" src="map/leaflet/draw/edit/handler/Edit.Marker.js"></script>
<script type="text/javascript" src="map/leaflet/draw/edit/handler/Edit.CircleMarker.js"></script>
<script type="text/javascript" src="map/leaflet/draw/edit/handler/Edit.Circle.js"></script>
<script type="text/javascript" src="map/leaflet/draw/edit/handler/Edit.Rectangle.js"></script>
<!-- Leaflet.draw -->

<script type="text/javascript" src="js/jquery-dateFormat.min.js?>" ></script>
<script type='text/javascript'>
JS_DEVICE_STATUS = [];
JS_TRACK_BY = "<?php echo $TEXT['global-trackby']?>";
JS_ROUTING_MACHINE_URL = "<?php echo $last_ver['routing_machine_url']?>";
JS_GOOGLE_TYPE = "<?php echo $last_ver['google_map_type']?>";
JS_GOOGLE_KEY = "<?php echo $last_ver['google_map_v3_key']?>";
JS_BING_KEY = "<?php echo $last_ver['bing_map_key']?>";
JS_MAPBOX_KEY = "<?php echo $last_ver['mapbox_map_key']?>";
JS_GOOGLE_MAP_BASE_LINK = "<?php echo $last_ver['google_map_base_link']?>";
JS_SHARE_POSITION_SELECT_ASSETS =  "<?php echo $TEXT['js-share-position-select-assets']?>"; 
JS_SELECTED = "<?php echo $TEXT['info-selected']?>";
JS_SELECT_ALL = "<?php echo $TEXT['info-select-all']?>";
JS_UNSELECT_ALL = "<?php echo $TEXT['info-unselect-all']?>";
JS_LOCATE_TIP="<?php echo $TEXT['js-locate-tip']?>";
JS_SPEED_HOUR = "<?php echo $TEXT['js-speedhour']?>";
JS_OVER_SPEED = "<?php echo $TEXT['js-overspeed']?>";
JS_HIGH_SPEED = "<?php echo $TEXT['js-highspeed']?>";
JS_MOVING = "<?php echo $TEXT['js-moving']?>";
JS_STATIC = "<?php echo $TEXT['js-static']?>";
JS_TIP_TIME="<?php echo $TEXT['js-tip-locatetime']?>";
JS_TIP_STATE="<?php echo $TEXT['js-tip-speedstate']?>";
JS_TIP_ADDR="<?php echo $TEXT['js-tip-location']?>";
JS_POSITION = "<?php echo $TEXT['navi-position']?>";
JS_GPS_TIME = "<?php echo $TEXT['info-gpstime']?>";
JS_SERVER_TIME = "<?php echo $TEXT['info-revtime']?>";
JS_ODOMETER = "<?php echo $TEXT['info-obd-mileage']?>";
JS_GPS_SIGNAL = "<?php echo $TEXT['js-gps-signal']?>";
JS_GSM_SIGNAL = "<?php echo $TEXT['js-gsm-signal']?>";
JS_NO_DRIVER = "<?php echo $TEXT['js-no_driver']?>";
JS_ENGINE_ON= "<?php echo $TEXT['js-engine-on']?>";
JS_ENGINE_OFF = "<?php echo $TEXT['js-engine-off']?>";
JS_ENGINE = "<?php echo $TEXT['js-engine']?>";
JS_TEMP = "<?php echo $TEXT['info-temperature']?>";
JS_BAT = "<?php echo $TEXT['info-battery']?>";
JS_FUEL = "<?php echo $TEXT['info-fuel'] ?>";
JS_DRIVER_NAME = "<?php echo $TEXT['info-driver'] ?>";
JS_ADDRESS =  "<?php echo $TEXT['js-address'] ?>";
JS_GPS_TIME = "<?php echo $TEXT['info-gpstime']?>";
JS_SERVER_TIME = "<?php echo $TEXT['info-revtime']?>";
JS_ODOMETER = "<?php echo $TEXT['info-obd-mileage']?>";
JS_GPS_SIGNAL = "<?php echo $TEXT['js-gps-signal']?>";
JS_GSM_SIGNAL = "<?php echo $TEXT['js-gsm-signal']?>";
JS_CURRENT_LANG="<?php echo $_SESSION['lang']?>";
JS_FULL_SCREEN="<?php echo $TEXT['js-full-screen']?>";
JS_ASSET_NAME = "<?php echo $TEXT['info-objectflag']?>";
JS_POSITION = "<?php echo $TEXT['navi-position']?>";
JS_SPEED = "<?php echo $TEXT['navi-speed']?>";
JS_HEADING = "<?php echo $TEXT['info-heading']?>";
JS_GPS_TIME = "<?php echo $TEXT['info-gpstime']?>";
JS_SERVER_TIME = "<?php echo $TEXT['info-revtime']?>";
JS_ENGINE = "<?php echo $TEXT['js-engine']?>";
JS_DRIVER_NAME = "<?php echo $TEXT['info-driver'] ?>";
JS_ADDRESS =  "<?php echo $TEXT['js-address'] ?>";
JS_ON = "<?php echo $TEXT['js-on']?>";
JS_OFF = "<?php echo $TEXT['js-off']?>";
JS_ENGINE_ON= "<?php echo $TEXT['js-engine-on']?>";
JS_ENGINE_OFF = "<?php echo $TEXT['js-engine-off']?>";
JS_SHARE_EXPIRED = "<?php echo $TEXT['js-share-invalid']?>";
JS_DEFAULT_LNG=<?php echo $_SESSION['lng'] ?>;
JS_DEFAULT_LAT=<?php echo $_SESSION['lat'] ?>;
JS_DEFAULT_ZOOM=<?php echo $_SESSION['zoom'] ?>;
JS_DEFAULT_SHOW=<?php echo $_SESSION['show'] ?>;
JS_DEFAULT_ZONE=<?php echo $_SESSION['zone'] ?>;
JS_DEFAULT_MARKER=<?php echo $_SESSION['marker'] ?>;
JS_DEFAULT_DATETIME_fmt_JS = "<?php echo $_SESSION['datetime_fmt_js']?>";
JS_UNIT_DISTANCE = "<?php echo $_SESSION['unit_distance']?>";         //0:Kilometer(公里) 1:Mile(英里) 2:Nautical mile(海里)
JS_UNIT_FUEL = "<?php echo $_SESSION['unit_fuel']?>";                 //0:Liter(升) 1:Gallon(加仑)
JS_UNIT_TEMPERATURE = "<?php echo $_SESSION['unit_temperature']?>";   //0:Celsius  1:Fahrenheit
JS_UNIT_SPEED = "<?php echo $_SESSION['unit_speed']?>";               //0:kph(公里/小时) 1:mph(英里/小时)
JS_UNIT_ALTITUDE = "<?php echo $_SESSION['unit_altitude']?>";         //0:meter 1:feet
JS_UNIT_HUMIDITY = 0;
JS_ENABLE_DISABLE_LABEL = "<?php echo $TEXT['js-enable-disable-label']?>";
JS_ENABLE_DISABLE_MARKER = "<?php echo $TEXT['js-enable-disable-marker']?>";
JS_ENABLE_DISABLE_ZONES = "<?php echo $TEXT['js-enable-disable-zones']?>";
JS_ENABLE_DISABLE_DRIVER = "<?php echo $TEXT['js-enable-disable-driver']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_ACTIONS_TITLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-actions-title']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_ACTIONS_TEXT = "<?php echo $TEXT['js-draw-tool-draw-toolbar-actions-text']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_FINISH_TITLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-finish-title']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_FINISH_TEXT = "<?php echo $TEXT['js-draw-tool-draw-toolbar-finish-text']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_UNDO_TITLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-undo-title']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_UNDO_TEXT = "<?php echo $TEXT['js-draw-tool-draw-toolbar-undo-text']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_POLYLINE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-polyline']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_POLYGON = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-polygon']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_RECTANGLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-rectangle']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_CIRCLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-circle']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_MARKER = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-marker']?>";
JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_CIRCLEMARKER = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-circlemarker']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_CIRCLE_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-circle-tooltip-start']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_CIRCLE_RADIUS = "<?php echo $TEXT['js-draw-tool-draw-handlers-circle-radius']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_CIRCLEMARKER_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-circlemarker-tooltip-start']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_MARKER_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-marker-tooltip-start']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_POLYGON_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-polygon-tooltip-start']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_POLYGON_TOOLTIP_CONT = "<?php echo $TEXT['js-draw-tool-draw-handlers-polygon-tooltip-cont']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_POLYGON_TOOLTIP_END = "<?php echo $TEXT['js-draw-tool-draw-handlers-polygon-tooltip-end']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-polyline-tooltip-start']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_TOOLTIP_CONT = "<?php echo $TEXT['js-draw-tool-draw-handlers-polyline-tooltip-cont']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_TOOLTIP_END = "<?php echo $TEXT['js-draw-tool-draw-handlers-polyline-tooltip-end']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_ERROR = "<?php echo $TEXT['js-draw-tool-draw-handlers-polyline-error']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_RECTANGLE_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-rectangle-tooltip-start']?>";
JS_DRAW_TOOL_DRAW_HANDLERS_SIMPLESHAPE_TOOLTIP_END = "<?php echo $TEXT['js-draw-tool-draw-handlers-simpleshape-tooltip-end']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_SAVE_TITLE = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-save-title']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_SAVE_TEXT = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-save-text']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCEL_TITLE = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-cancel-title']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCEL_TEXT = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-cancel-text']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCELALL_TITLE = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-cancelall-title']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCELALL_TEXT = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-cancelall-text']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_EDIT = "<?php echo $TEXT['js-draw-tool-edit-toolbar-buttons-edit']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_EDITDISABLED = "<?php echo $TEXT['js-draw-tool-edit-toolbar-buttons-editDisabled']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_REMOVE = "<?php echo $TEXT['js-draw-tool-edit-toolbar-buttons-remove']?>";
JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_REMOVEDISABLED = "<?php echo $TEXT['js-draw-tool-edit-toolbar-buttons-removeDisabled']?>";
JS_DRAW_TOOL_EDIT_HANDLERS_EDIT_TOOLTIPS_TEXT = "<?php echo $TEXT['js-draw-tool-edit-handlers-edit-tooltips-text']?>";
JS_DRAW_TOOL_EDIT_HANDLERS_EDIT_TOOLTIPS_SUBTEXT = "<?php echo $TEXT['js-draw-tool-edit-handlers-edit-tooltips-subtext']?>";
JS_DRAW_TOOL_EDIT_HANDLERS_REMOVE_TOOLTIPS_TEXT = "<?php echo $TEXT['js-draw-tool-edit-handlers-remove-tooltips-text']?>";
JS_DRAW_TOOL_TOOL_CENTER = "<?php echo $TEXT['js-draw-tool-center']?>";
JS_DRAW_TOOL_TOOL_RADIUS = "<?php echo $TEXT['js-draw-tool-radius']?>";
JS_DRAW_TOOL_TOOL_AREA = "<?php echo $TEXT['js-draw-tool-area']?>";
JS_DRAW_TOOL_TOOL_DISTANCE = "<?php echo $TEXT['js-draw-tool-distance']?>";

var map, ext, firstClick = true, zones = [], usermarkers = [], geoList = window.opener == null ? null : window.opener.geoList, timer, remain = 0, current_id = 0, assets = <?php echo $assets ?>, UNIT_SPEED, UNIT_DIST, UNIT_FUEL, UNIT_TEMP, UNIT_ALTITUDE, first = true, lastLat, lastLng, sendTimeZone = false, ANIMATION_TIME = 2000;
var old = {c:"", x:0, y:0, i:0, d:0, t:"", s:0};

function getSpeedState(on, v, s, t, a, ar, st) {
	/**
	sta default
	0: offline
	1: online and static
	2 to 6: online and moving	
	7: online and alarm
	30: online and idle
	*/
    var WP = window.parent;
    //{tip:"short tips", sta: "state", spd:"map tipwindow tips"}
    var ret = {
        tip: "",
        sta: 0, //default offline
        spd: s +" "+ WP.UNIT_SPEED + " (" + WP.JS_STATIC + ")",
		val: s
    };
    if (on == 1) {
        ret.sta = 1;
        if (v == 1){			
            if (s >= 120) {
                ret.tip = s + "" + WP.UNIT_SPEED;
                ret.sta = 6;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_OVER_SPEED + ")"
            } else if (s >= 90) {
                ret.tip = s + "" + WP.UNIT_SPEED;
                ret.sta = 5;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_HIGH_SPEED + ")"
			} else if (s >= 80) {
                ret.tip = s + " " + WP.UNIT_SPEED;
                ret.sta = 4;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_HIGH_SPEED + ")"            
			} else if (s > 40) {
                ret.tip = s + " " + WP.UNIT_SPEED;
                ret.sta = 3;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_MOVING + ")"
            } else if (s > 0) {
                ret.tip = s + " " + WP.UNIT_SPEED;
                ret.sta = 2;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_MOVING + ")"
            }else {
                var acc = (typeof st != undefined && st != null && st.indexOf('3005') >= 0);
				if(acc){
					ret.sta = 30;
				}else{
					ret.sta = 1;
				}
                ret.tip = "0" + " " + WP.UNIT_SPEED;
                ret.spd = s + WP.UNIT_SPEED + " (" + WP.JS_STATIC + ")"
            }						
        }
		//if have alarm
		if(a > 0){
			ret.sta = 7;
		}
		
		//custom arrow
		if(ar == "black"){
			ret.sta = 8;
		}else if(ar == "blue"){
			ret.sta = 9;
		}else if(ar == "green"){
			ret.sta = 10;
		}else if(ar == "gray"){
			ret.sta = 11;
		}else if(ar == "orange"){
			ret.sta = 12;
		}else if(ar == "purple"){
			ret.sta = 13;
		}else if(ar == "red"){
			ret.sta = 14;
		}else if(ar == "yellow"){
			ret.sta = 15;
		}
    }else{
        ret.spd = s + " " + WP.UNIT_SPEED;
        
		if(t == null || t == undefined || t == ''){			
			ret.tip = WP.JS_TIMEOUT_INVALID;
		}else{
			var time = newDate(t).getTime() + new Date().getTimezoneOffset()*60*1000;
			var timenow = new Date().getTime();

			//seconds
			var timeout = (timenow - time) / 1000.0;
			
			if(s == -1){
				ret.tip = WP.JS_EXPIRED;
			}else if(timeout <= 0){
				 ret.tip = s + " " + WP.UNIT_SPEED;
			}else if(timeout > 0 && timeout < 60){
				ret.tip = "<1" + " " + WP.JS_TIMEOUT_MINS;
			}else if(timeout >=60 && timeout < 3600){
				ret.tip = ">" + parseInt(timeout/60) + " " + WP.JS_TIMEOUT_MINS;
			}else if(timeout >=3600 && timeout < 3600 * 24){
				ret.tip = ">" + parseInt(timeout/3600) + " " + WP.JS_TIMEOUT_HOUR;
			}else if(timeout >=3600 * 24 && timeout < 3600 * 24 * 7){
				ret.tip = ">" + parseInt(timeout/(3600 * 24)) + " " + WP.JS_TIMEOUT_DAY;
			}else if(timeout >=3600 * 24 * 7 && timeout < 3600 * 24 * 30){
				ret.tip = ">" + parseInt(timeout/(3600 * 24 * 7)) + " " + WP.JS_TIMEOUT_WEEK;
			}else if(timeout >=3600 * 24 * 30 && timeout < 3600 * 24 * 365){
				ret.tip = ">" + parseInt(timeout/(3600 * 24 * 30)) + " " + WP.JS_TIMEOUT_MON;
			}else{
				ret.tip = ">" + parseInt(timeout/(3600 * 24 * 365)) + " " + WP.JS_TIMEOUT_YEAR;
			}
		}
    }
    return ret;
}

function getSpeedColor(s) {
    if (s >= 120) {
        return "#FF002A"
    } else if (s >= 90) {
        return "#9A009C"
    } else if (s >= 80) {
        return "#3200FF"
    } else if (s > 40) {
        return "#0096FE"
    } else if (s <= 40) {
        return "#5DFEFE"
    } else {
        return "#5DFEFE"
    }
}

function setStatusById(id, status){
    window.parent.JS_DEVICE_STATUS[id] = status;
}

function getStatusById(id){
    return window.parent.JS_DEVICE_STATUS[id];
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
}

function getTrackObjid(){
	var selectObjs = [];
	$.each($("#track_asset tr"), function(i, value) {
		var isSelect = $(value).find("td:first-child input").prop('checked');
		if(isSelect){
			var keyid = parseInt($(this).attr("n"));
			selectObjs.push(keyid);
		}				
	});
	return selectObjs;
}

function map_locate(keyid, center, geoname, track, zoomIn){
	//try{
		 if(keyid > 0){
			if(typeof map != "undefined"){
				var marker = map.LocateMarker(keyid, center, zoomIn, false);
				
				if(marker == null || typeof marker.properties == "undefined" || marker.properties == null){
					$("#assetinfo #statuslist").empty();
					return;
				}
				
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
					if(marker.properties.st.indexOf("3005") != -1){
						acc_state = JS_ON ;
					}else if(marker.properties.st.indexOf("3006") != -1){
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
				
				//if(typeof geoname != "undefined" && geoname){
					if($('#assetinfo').is(':hidden')){
						//do nothing
					}else if (lastLat != 0 && lastLng != 0 && lastLat == marker.properties.y && lastLng == marker.properties.x && $addresslast != null && $addresslast.length > 0){
						$address.text($addresslast);							
					}else{							
						$address.addClass("query_waiting");
						map.GeoNames(marker.properties.x, marker.properties.y, $address, "text", 0);
						lastLat = marker.properties.y;
						lastLng = marker.properties.x;
					}						

					if($('#maptools #ed_street_view').hasClass("tool_active")){
						$('#maptools #ed_street_view').attr("x",marker.properties.x).attr("y",marker.properties.y).attr("dir",marker.properties.dir);
						$('#streetview_img').html('<img src=https://maps.googleapis.com/maps/api/streetview/metadata?key='+JS_GOOGLE_KEY+'&size=308x170&sensor=false&location='+marker.properties.y / 1000000+','+marker.properties.x / 1000000+'&fov=90&heading='+marker.properties.dir+'&pitch=10>');						
						//following link do not have heading
						//http://cbk0.google.com/cbk?output=thumbnail&w=380&h=170&p=60&ll=45.47264,-73.65495
					}else{
						$('#maptools #ed_street_view').removeAttr("x").removeAttr("y").removeAttr("dir");
					}
				//}
			
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
									$td_status = $("<td style='white-space: nowrap;' bgcolor='#F5F5F5' style='border-top: 0px solid;'></td>").text(one_status_value[0]).appendTo($tr_status);						
								}else{
									var $td =  $("<td style='padding-left: 20px; border-left: 10px solid #fff; border-right: 0px solid;'></td>").text(one_status_value[0]).addClass("oneline").appendTo($tr);
									
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
										$td_status = $("<td bgcolor='#fff' height='100px' rowspan='5' valign='top' style='background: #fff; min-width: 150px; border-left: 10px solid #F5F5F5; border-top: 0px solid; border-right: 0px solid; border-bottom: 0px solid;'></td>").appendTo($tr_status);
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
				$("#assetinfo").animate({scrollLeft: -$scroll_left}, 0);			
			}
		 }	
	//}catch(e){}	
}

function relocate(){
    remain--;
    if(remain < 0){
		var os;
		os = getTrackObjid();
        remain = 5;
		
        if(map && os && os.length > 0){
			var res;
			
			if(!sendTimeZone){
				var timezoneOffset = new Date().getTimezoneOffset() / 60 * -1;
				res = {
					"track": true,
					"objid": getTrackObjid(),
					"timezone": timezoneOffset
				};				
			}else{
				res = {
					"track": true,
					"objid": getTrackObjid()
				};
			}
			
			$.post("devstat.ajax.php?t=" + new Date().getTime(),res, function(data){				
				//try{
					if(data.indexOf('expired')>=0 || data.indexOf('nologin')>=0){
						alert(JS_SHARE_EXPIRED);
						remain = 3600;
						return;
					}
				
					sendTimeZone = true;
					var json = eval('(' + data + ')');
					$("#locate_tip,#status").css("display", "block");
					for (var r = 0; r < json.length; r++) {
						for(var i = 0; i < json[r].item.length; i++){
							var j = json[r].item[i];												
							//var j = json[0].item[0];
							setStatusById(j.n, j.e);
							if(old.c != j.c || old.x != j.x || old.y != j.y || old.i != j.i || old.d != j.d || old.t != j.t || old.s != j.s){
								old = j;										
								
								var p = getSpeedState(j.on, j.v, j.s, j.t, j.a, j.ar, j.st);
								var ftime = (j.t == null || j.t.length == 0) ? j.t : $.format.date(j.t, JS_DEFAULT_DATETIME_fmt_JS);
								var fstime = (j.ts == null || j.ts.length == 0) ? j.ts : $.format.date(j.ts, JS_DEFAULT_DATETIME_fmt_JS);
								map.DrawIcon(j.n, j.c, null, null, j.v, j.x, j.y, j.i, p.sta, j.d, ftime, fstime, p.spd, 0, current_id == j.n, p.val,j.st, j.io, j.dt, j.jb, j.dn, ANIMATION_TIME);//no alarm
								
								if(first){
									map.HideShowMarker(true,j.n);
								}
								map.AddTrackPoint(j.n, j.x, j.y, j.s, ftime, j.d, null, ANIMATION_TIME);
								if(current_id == j.n){
									map_locate(j.n, true, true, true, false);	
								}
							}
						}
					}
					if(first){
						map.MarkersFitBounds();	
						first = false;
						$("#loadmapwait").css("display", "none");
					}
					json = null;				
				//}catch(e){};
			});		
		}		
    }
    $("#locate_tip span").text(remain).attr("title", JS_LOCATE_TIP.replace("%d", remain));
    timer = setTimeout("relocate()", 1000);
}
function onfree(){
    try{ map.Free(); }catch(e){}
    map = null;
}
function oninit() {
    $("#loadmapwait").css("display", "block");
	
	$tbody = $("<tbody></tbody>").appendTo("#track_asset");
	$tr = $("<tr></tr>").appendTo($tbody);
	$("<td><input style='margin: 0px 0px 0px 5px;' type='checkbox'></input></td>").appendTo($tr).find("input").prop('checked', true);
	
	for (o in assets) {
		$tr = $("<tr></tr>").attr("n", o).appendTo($tbody);
		$("<td><input style='margin: 0px 0px 0px 5px;' type='checkbox'></input></td>").attr("n", o).appendTo($tr).find("input").prop('checked', true);
		$td = $("<td style='word-wrap:break-word; word-break:break-all; white-space:nowrap; cursor: default;'></td>").attr("c", assets[o]).html(assets[o]).appendTo($tr);
	}
	
	$.each($("#track_asset tr"), function(i, value) {
		$(value).find("td:eq(1)").unbind("click").click(function() {
			$(".active").removeClass("active");
			$(value).addClass("active");
			var keyid = parseInt($(value).attr("n"));
			current_id = keyid;
			
			if(firstClick){
				$("#staswitch").click();
			}
			
			$(value).find("td:eq(0) input").prop('checked',true);
			map.HideShowMarker(true, keyid);
			map_locate(keyid, true, true, true, true);			
		});
		
		$(value).find("td:eq(0) input").unbind("click").click(function() {
			var keyid = parseInt($(value).attr("n"));		
			map.HideShowMarker($(this).prop('checked'), keyid);
			
			if(!$(this).prop('checked')){
				$(value).removeClass("active");
				map.ClearTrack(keyid);
				
				if(current_id == keyid){
					current_id = 0;
				}
			}
		});
	});
	
	$("#track_asset tbody tr:first-child td:first-child").unbind("click").click(function() {
		var checked = $(this).find("input").prop('checked');
		
		$.each($("#track_asset tr:not(tr:first-child)"), function(i, value) {
			$(value).find("td:eq(0) input").prop('checked', checked);
			var keyid = parseInt($(value).attr("n"));
			map.HideShowMarker(checked, keyid);
			if(!checked){
				map.ClearTrack(keyid);
			}			
		});
	});
		
	initUnits();
	onLoadGoogle();
	
	$("#staswitch").addClass("hide_status");
	$("#staswitch").unbind("click").click(function() {
		if($(this).hasClass("hide_status") || firstClick){
			$(this).removeClass("hide_status");
			$(this).attr('src','img/down-arrow.svg'); 
			$("#stasep").css("bottom", "155px");
			$("#assetinfo").css("display", "block");
			$("#track_map").css("bottom", "163px");
			if(map){
				map.ResizeMapContainer();
			}
			if(firstClick){
				firstClick = false;
			}
		}else{						
			$(this).addClass("hide_status");
			$(this).attr('src','img/up-arrow.svg');
			$("#stasep").css("bottom", "1px"); 			
			$("#assetinfo").css("display", "none");
			$("#track_map").css("bottom", "8px");
			if(map){
				map.ResizeMapContainer();
			}			
		}
	});	
    //loadScript("http://maps.google.com/maps/api/js?sensor=false&language="+JS_CURRENT_LANG+"&callback=onLoadMap");
	//loadScript("http://ditu.google.cn/maps/api/js?key="+JS_GOOGLE_KEY+"&v=3.21&sensor=false&language="+JS_CURRENT_LANG+"&callback=onLoadGoogle");
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
    map = new MapOperat("track_map", opts, true, false, true);
	ext = new MapExtend(map.GetMap(), false, false);      
    map.Zoom(JS_DEFAULT_ZOOM);	
    remain = 1;
    timer = setTimeout("relocate()", 1000);
	
	/*map tools*/
	$("#maptools").css({"left": "10px", "top": "120px"});
	$("#maptools #ed_label").attr('title',JS_ENABLE_DISABLE_LABEL);
	$("#maptools #ed_marker").attr('title',JS_ENABLE_DISABLE_MARKER);
	$("#maptools #ed_driver").attr('title',JS_ENABLE_DISABLE_DRIVER);
	if(JS_DEFAULT_MARKER == 1){
		$("#maptools #ed_marker").css({opacity: 1.0}).addClass("tool_active");
	}
	$("#maptools #ed_zone").attr('title',JS_ENABLE_DISABLE_ZONES);	
	if(JS_DEFAULT_ZONE == 1){
		$("#maptools #ed_zone").css({opacity: 1.0}).addClass("tool_active");
	}
	
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
</script>
<style type="text/css">
<!--
html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-size: 12px; font-family: Arial, Tahoma; overflow: auto; background: #fff; }
#loadmapwait { position: absolute; top: 1px; left: 1px; margin:0 auto; font-size: 120%; color: #ff6; font-weight: bold; cursor: default; background: #ccc url("../../img/ajax-loader.gif") no-repeat 4px center; padding: 1px 5px 1px 24px; z-index: 2;}
#track_map { position: absolute; left: 1px; right: 1px; top: 1px; bottom: 8px; border: 1px solid #369; z-index: 1; }
#locate_tip { position: absolute; left: 255px; top: 13px; padding: 2px 4px; background: #fff; color: #f00; border: 1px solid #369; z-index: 10; display: none;}
#select_asset { position: absolute; left: 50px; top: 13px; width: 200px; height: 200px; padding: 0px; background: #fff; z-index: 10; overflow: scroll;}
#select_asset tr.normal { color: #000; }
#select_asset tr.active { background-color: #DDDDDD; padding: 0 2px; font-weight: normal; }
#stasep { position: absolute; left: 1px; right: 1px; height: 8px; bottom: 1px; background: #F8F8F8; color: #000; border: none; text-align: center; }
#staswitch { margin: 0 auto; height: 8px; cursor: pointer; }
#assetinfo { display: none; position: absolute; left: 1px; right: 1px; height: 152px;  bottom: 1px; border: 1px solid #369; z-index: 1; overflow-x: scroll; overflow-y: scroll;}
.oddcolor { background-color: #EEE; }
.tab_status { width: 100%; border-collapse: collapse; overflow: hidden; }
.tab_status td { border: 0px solid #D5D5D5; font-size:100%; padding: 4px 4px; min-width: 100px; }
.tab_status a:link { font-size: 12px; color: #4D8ED9; text-decoration: none; }   
.tab_status a:visited { font-size: 12px; color: #4D8ED9; text-decoration: none; }   
.tab_status a:hover { font-size: 12px; color: #4D8ED9; text-decoration: none; } 
.info_name { padding-left: 20px; background: transparent url("../img/info_name.svg") no-repeat 2px center; background-size: 14px 14px; }
.info_position { padding-left: 20px; background: transparent url("../img/info_position.svg") no-repeat 2px center; background-size: 14px 14px; }
.info_speed { padding-left: 20px; background: transparent url("../img/info_speed.svg") no-repeat 2px center; background-size: 14px 14px; }
.info_angle { padding-left: 20px; background: transparent url("../img/info_angle.svg") no-repeat 2px center; background-size: 14px 14px; }
.info_time { padding-left: 20px; background: transparent url("../img/info_time.svg") no-repeat 2px center; background-size: 14px 14px; }
.info_engine { padding-left: 20px; background: transparent url("../img/info_engine.svg") no-repeat 2px center; background-size: 14px 14px; }
.info_driver { padding-left: 20px; background: transparent url("../img/info_driver.svg") no-repeat 2px center; background-size: 14px 14px; }
.info_address { padding-left: 20px; background: transparent url("../img/info_address.svg") no-repeat 2px 3px; background-size: 14px 14px; }
.info_io { padding-left: 20px; background: transparent url("../img/info_io.svg") no-repeat 2px center; background-size: 14px 14px; }
.oneline { word-break: keep-all; white-space: nowrap; }
.iselect { margin: 1px 2px; width: 172px; height: 24px; line-height:24px; font-size: 12px; font-weight: normal; -webkit-appearance: menulist-button;}

-->
</style>
</head>
<body onload="oninit();" onunload="onfree();">
	<div id="loadmapwait"><span><?php echo $TEXT['map-loading'] ?></span></div>
	<div id="track_map"></div>
	<div id="locate_tip"><span></span></div>
	<div id="select_asset">
		<table id="track_asset"></table>	
	</div>
	<div id="stasep">
		<img id="staswitch" alt="" src="img/up-arrow.svg"/>
	</div>
	<div id="assetinfo">
		<table id="statuslist" class="tab_status"></table>	
	</div>
</body>
</html>

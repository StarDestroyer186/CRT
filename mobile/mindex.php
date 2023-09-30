 <?php
header('Access-Control-Allow-Origin:*');
session_start();
if (!isset($_SESSION['uid']) or (int) $_SESSION['uid'] < 1) {
    Header("Location: mlogin.php");
    exit;
}
include_once('../lang.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta content="black" name="apple-mobile-web-app-status-bar-style">     
<meta content="telephone=no" name="format-detection">
<title><?php echo $TEXT['global-title'] ?></title>
<link rel="Bookmark" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-mfav-icon'];?>" />
<link rel="Shortcut Icon" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-mfav-icon'];?>" />
<link rel="apple-touch-icon" href="../img/apple-touch-icon.png">
<link rel="apple-touch-icon-precomposed" href="../img/apple-touch-icon.png">
<link type="text/css" rel="stylesheet" href="mcss/button.css"/>
<link type="text/css" rel="stylesheet" href="mcss/bootstrap.css?v=<?php echo $last_ver['style.css']?>"/>
<link type="text/css" rel="stylesheet" href="mcss/mstyle.css"/>
<link type="text/css" rel="stylesheet" href="../css/jquery-ui.css" />
<link type="text/css" rel="stylesheet" href="mcss/vanillaSelectBox.css"/>
<link type="text/css" rel="stylesheet" href="mcss/picker.min.css"/>
<link type="text/css" rel="stylesheet" href="mmap/leaflet/leaflet.css"/>
<link type="text/css" rel="stylesheet" href="mmap/leaflet/MarkerCluster.css"/>
<!--<link type="text/css" rel="stylesheet" href="mmap/leaflet/MarkerCluster.Default.css"/>-->
<link type="text/css" rel="stylesheet" href="mmap/leaflet/clusterpies.css"/>
<link type="text/css" rel="stylesheet" href="mmap/leaflet/leaflet-measure-path.css"/>
<link type="text/css" rel="stylesheet" href="mmap/leaflet/Control.FullScreen.css"/>
<link type="text/css" rel="stylesheet" href="../css/toastr.min.css"/>
<link type="text/css" rel="stylesheet" href="../css/jquery.contextMenu.min.css"/>
<link type="text/css" rel="stylesheet" href="mmap/leaflet/leaflet.measure.css"/>
<link type="text/css" rel="stylesheet" href="mmap/leaflet/RoutingMachine/leaflet-routing-machine.css"/>
<!--<link type="text/css" rel="stylesheet" href="mcss/jquery.mobile-1.4.5.min.css"/>-->
<script type="text/javascript" src="../js/gauge.min.js"></script>
<script type="text/javascript" src="../js/jquery.min.js?v=<?php echo $last_ver['jquery.min.js']?>"></script>
<script type="text/javascript" src="../js/jquery-ui.min.js"></script>
<script type="text/javascript" src="../js/jquery.cookie.js"></script>
<script>
	$(document).on('mobileinit', function () {
		//$.mobile.ignoreContentEnabled = true;
		$.mobile.keepNative = "select,input";
	});
</script>
  <script src="https://cdn.tailwindcss.com"></script>
<script type='text/javascript' src="mjs/jquery.mobile-1.4.5.min.js"></script>

<script type="text/javascript" src="../js/jquery-dateFormat.min.js?>" ></script>
<script type="text/javascript" src="../js/jquery-ui-datepicker-min.js"></script>
<script type="text/javascript" src="../js/jquery-ui-timepicker-addon.js"></script>
<script type="text/javascript" src="mjs/vanillaSelectfBox.js"></script>
<script type='text/javascript' src="../js/jquery.contextMenu.min.js"></script>
<script type='text/javascript' src="../js/toastr.min.js"></script>
<script type="text/javascript" src="mjs/mcommon.js?v=<?php echo $last_ver['common.js']?>" ></script>
<script type="text/javascript" src="mjs/mplayback.js?v=<?php echo $last_ver['playback.js']?>"></script>
<script type="text/javascript" src="mjs/<?php echo $last_name['mdevicelist.js']?>?v=<?php echo $last_ver['devicelist.js']?>"></script>
<script type="text/javascript" src="mjs/<?php echo $last_name['mindex.js']?>?v=<?php echo $last_ver['index.js']?>>"></script>
<script type="text/javascript" src="mmap/leaflet/ext.leaflet.js"></script>
<script type="text/javascript" src="mmap/leaflet/leaflet.js"></script>
<script type="text/javascript" src="mmap/leaflet/proj4.js"></script>
<script type="text/javascript" src="mmap/leaflet/proj4leaflet.js"></script>
<!--<script type="text/javascript" src="mmap/leaflet/leaflet.rotatedMarker.js"></script>-->
<script type="text/javascript" src="mmap/leaflet/leaflet.movingRotatedMarker.js"></script>
<script type="text/javascript" src="mmap/leaflet/leaflet.motion.min.js"></script>
<script type="text/javascript" src="mmap/leaflet/leaflet.markercluster.js"></script>
<script type="text/javascript" src="../js/d3.v3.min.js"></script>
<script type="text/javascript" src="mmap/leaflet/bing.js"></script>
<script src="mjs/picker.min.js"></script>
<script type="text/javascript" src="mmap/leaflet/leaflet-measure-path.js"></script>
<script type="text/javascript" src="mmap/leaflet/Leaflet.Editable.js"></script>
<script type="text/javascript" src="mmap/leaflet/Control.Geocoder.js"></script>
<script type="text/javascript" src="mmap/leaflet/Control.FullScreen.js"></script>
<script type="text/javascript" src="mmap/leaflet/tileLayer.baidu.js"></script>
<script type="text/javascript" src="mmap/leaflet/leaflet.measure.js"></script>
<script type="text/javascript" src="mmap/leaflet/RoutingMachine/leaflet-routing-machine.min.js"></script>
<script type="text/javascript" src="mmap/leaflet/leaflet.polylineDecorator.js"></script>
<script type="text/javascript" src="mmap/<?php echo $last_name['map.operat.js']?>?v=<?php echo $last_ver['map.operat.js']?>"></script>
<script type="text/javascript" src="mmap/<?php echo $last_name['map.leaflet.js']?>?v=<?php echo $last_ver['map.leaflet.js']?>"></script>

<!-- Leaflet.draw -->
<script type="text/javascript" src="mmap/leaflet/draw/Leaflet.draw.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/Leaflet.Draw.Event.js"></script>
<link rel="stylesheet" href="mmap/leaflet/draw/leaflet.draw.css" />
<script type="text/javascript" src="mmap/leaflet/draw/Toolbar.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/Tooltip.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/ext/GeometryUtil.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/ext/LatLngUtil.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/ext/LineUtil.Intersect.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/ext/Polygon.Intersect.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/ext/Polyline.Intersect.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/ext/TouchEvents.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/draw/DrawToolbar.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/draw/handler/Draw.Feature.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/draw/handler/Draw.SimpleShape.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/draw/handler/Draw.Polyline.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/draw/handler/Draw.Marker.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/draw/handler/Draw.CircleMarker.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/draw/handler/Draw.Circle.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/draw/handler/Draw.Polygon.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/draw/handler/Draw.Rectangle.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/edit/EditToolbar.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/edit/handler/EditToolbar.Edit.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/edit/handler/EditToolbar.Delete.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/Control.Draw.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/edit/handler/Edit.Poly.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/edit/handler/Edit.SimpleShape.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/edit/handler/Edit.Marker.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/edit/handler/Edit.CircleMarker.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/edit/handler/Edit.Circle.js"></script>
<script type="text/javascript" src="mmap/leaflet/draw/edit/handler/Edit.Rectangle.js"></script>
<!-- Leaflet.draw -->

<script type='text/javascript' src="../js/highstock.js"></script>
<script type='text/javascript' src="../js/exporting.js"></script>
<script type="text/javascript" src="../js/highcharts-more.js"></script>
<script type="text/javascript">
JS_ROUTING_MACHINE_URL = "<?php echo $last_ver['routing_machine_url']?>";
JS_GOOGLE_TYPE = "<?php echo $last_ver['google_map_type']?>";
JS_GOOGLE_KEY = "<?php echo $last_ver['google_map_v3_key']?>";
JS_BING_KEY = "<?php echo $last_ver['bing_map_key']?>";
JS_MAPBOX_KEY = "<?php echo $last_ver['mapbox_map_key']?>";
JS_GOOGLE_MAP_BASE_LINK = "<?php echo $last_ver['google_map_base_link']?>";
JS_GLOBAL_MIM_UPDATE = "<?php echo $GLOBAL_MIM_UPDATE?>";
JS_DEVICE_FLAG4ID = [];//getFlag(id)
JS_DEVICE_ID4FLAG = [];//getId(Flag)
JS_DEVICE_STATUS = [];
JS_DEVICE_TYPE4ID = [];
JS_GROUP = [];
JS_DEVICE_NO4ID = [];
JS_DEVICE_SIM4ID = [];
JSDEVICE_DRIVER4ID = [];
JS_DEVICE_ID4GROUPID = [];
JS_OBJECT_KIND=<?php echo $_SESSION['object_kind'] ?>;
JS_SPEED_HOUR = "<?php echo $TEXT['js-speedhour'] ?>";
JS_OVER_SPEED = "<?php echo $TEXT['js-overspeed'] ?>";
JS_HIGH_SPEED = "<?php echo $TEXT['js-highspeed'] ?>";
JS_UNREPORTED = "<?php echo $TEXT['js-unreported'] ?>";
JS_MOVING = "<?php echo $TEXT['js-moving'] ?>";
JS_STATIC = "<?php echo $TEXT['js-static'] ?>";
JS_TIP_ADDR="<?php echo $TEXT['js-tip-location'] ?>";
JS_TIMEOUT_INVALID = "<?php echo $TEXT['timeout-item-invalid']?>";
JS_EXPIRED = "<?php echo $TEXT['js-expired']?>";
JS_ENGINE_ON= "<?php echo $TEXT['js-engine-on']?>";
JS_ENGINE_OFF = "<?php echo $TEXT['js-engine-off']?>";
JS_TEMP_UNIT = "<?php echo $TEXT['js-temp_unit']?>";
JS_NO_DRIVER = "<?php echo $TEXT['js-no_driver']?>";
JS_NO_NEED_PARAM = "<?php echo $TEXT['js-noneedparam']?>";
JS_SELECT_ONE_CMD = "<?php echo $TEXT['js-selectonecmd']?>";
JS_CMD_OBJINFO="<?php echo $TEXT['navi-objectinfo'] ?>";
JS_CMD_ALTINFO= "<?php echo $TEXT['js-lastvoice']?>";
JS_LAST_PHOTO = "<?php echo $TEXT['navi-lastphoto']?>";
JS_NO_PHOTO = "<?php echo $TEXT['js-nophoto']?>";
JS_LAST_VOICE = "<?php echo $TEXT['js-lastvoice']?>";
JS_HISTORY = "<?php echo $TEXT['navi-playback']?>";
JS_SHARE_POSITION = "<?php echo $TEXT['js-share-position']?>";
JS_SHARE_FAIL = "<?php echo $TEXT['js-share-fail']?>";
JS_SHARE_COPY_SUCCESS = "<?php echo $TEXT['js-share-copy-successful']?>";
JS_NO_VOICE = "<?php echo $TEXT['js-novoice']?>";
JS_RANGE_ERROR = "<?php echo $TEXT['js-rangeerror']?>";
JS_LENGTH_ERROR = "<?php echo $TEXT['js-lengtherror']?>";
JS_NO_COMMAND = "<?php echo $TEXT['js-nocommand']?>";
JS_DEFAULT_DATETIME_fmt_JS="<?php echo $_SESSION['datetime_fmt_js']?>";
JS_NAVI_CHART_FUEL_1 = "<?php echo $TEXT['navi-chart-fuel-1']?>";
JS_NAVI_CHART_TEMP_1 = "<?php echo $TEXT['navi-chart-temp-1']?>";
JS_GPS_VALID = "<?php echo $TEXT['js-gpsvalid']?>";
JS_LBS_VALID = "<?php echo $TEXT['js-lbsvalid']?>";
JS_LOCATION_INVALID = "<?php echo $TEXT['js-location-invalid']?>";
JS_ALARM_INFO = "<?php echo $TEXT['js-alarm-info']?>";
JS_TASK_NEW_INFO = "<?php echo $TEXT['4026']?>";
JS_TASK_PROCESSING_INFO = "<?php echo $TEXT['4027']?>";
JS_ASSET_CONTROL = "<?php echo $TEXT['js-asset-control']?>";
JS_PARKING = "<?php echo $TEXT['js-parking']?>";
JS_TIP_OBJ_ALARM="<?php echo $TEXT['navi-tabalarm'] ?>";
JS_TIP_OBJ_EXPIRED="<?php echo $TEXT['navi-tabexpired'] ?>";
JS_CURRENT_LANG="<?php echo $_SESSION['lang']?>";
JS_FULL_SCREEN="<?php echo $TEXT['js-full-screen']?>";
JS_TIMEOUT_MINS = "<?php echo $TEXT['timeout-item-mins']?>";
JS_TIMEOUT_HOUR = "<?php echo $TEXT['timeout-item-hour']?>";
JS_TIMEOUT_DAY = "<?php echo $TEXT['timeout-item-day']?>";
JS_TIMEOUT_WEEK = "<?php echo $TEXT['timeout-item-week']?>";
JS_TIMEOUT_MON = "<?php echo $TEXT['timeout-item-mon']?>";
JS_TIMEOUT_YEAR = "<?php echo $TEXT['timeout-item-year']?>";
JS_TIMEOUT_INVALID = "<?php echo $TEXT['timeout-item-invalid']?>";
JS_TIP_OBJ_ONLINE="<?php echo $TEXT['navi-tabonline'] ?>";
JS_TIP_OBJ_OFFLINE="<?php echo $TEXT['navi-tabinactive'] ?>";
JS_MOVING = "<?php echo $TEXT['js-moving'] ?>";
JS_STATIC = "<?php echo $TEXT['js-static'] ?>";
JS_IDLE = "<?php echo $TEXT['js-idle'] ?>";
JS_EXPIRE_30 = "<?php echo $TEXT['js-expire-30'] ?>";
JS_EXPIRE_15 = "<?php echo $TEXT['js-expire-15'] ?>";
JS_EXPIRE_7 = "<?php echo $TEXT['js-expire-7'] ?>";
JS_EXPIRE_1 = "<?php echo $TEXT['js-expire-1'] ?>";
JS_EXPIRE_0 = "<?php echo $TEXT['js-expire-0'] ?>";
JS_SPEED_0_40 = "<?php echo $TEXT['js-speed-0-40'] ?>";
JS_SPEED_40_80 = "<?php echo $TEXT['js-speed-40-80'] ?>";
JS_SPEED_80_90 = "<?php echo $TEXT['js-speed-80-90'] ?>";
JS_SPEED_90_120 = "<?php echo $TEXT['js-speed-90-120'] ?>";
JS_SPEED_120 = "<?php echo $TEXT['js-speed-120'] ?>";
JS_OBJECTS = "<?php echo $TEXT['js-objects']?>";
JS_MILEAGE = "<?php echo $TEXT['info-mileage']?>";
JS_LAST24H_MILEAGE = "<?php echo $TEXT['js-last24h-mileage']?>";
JS_LAST24H_ENGINE = "<?php echo $TEXT['js-last24h-engine']?>";
JS_LAST24H_IDLE = "<?php echo $TEXT['js-last24h-idle']?>";
JS_LAST24H_MOVING = "<?php echo $TEXT['js-last24h-moving']?>";
JS_HOUR="<?php echo $TEXT['js-hour'] ?>";
JS_DEFAULT_LNG=<?php echo $_SESSION['lng'] ?>;
JS_DEFAULT_LAT=<?php echo $_SESSION['lat'] ?>;
JS_DEFAULT_ZOOM=<?php echo $_SESSION['zoom'] ?>;
JS_DEFAULT_PAGE=<?php echo $_SESSION['page'] ?>;  //0: menu  1: object list  2: map
JS_DEFAULT_SHOW=<?php echo $_SESSION['show'] ?>;
JS_DEFAULT_ZONE=<?php echo $_SESSION['zone'] ?>;
JS_DEFAULT_FIT=<?php echo $_SESSION['fit'] ?>;
JS_DEFAULT_COLLAPSED=<?php echo $_SESSION['collapsed'] ?>;
JS_DEFAULT_ASSET_INFOS="<?php echo $_SESSION['assetInfos'] ?>";
JS_CHART_SELECT = "<?php echo $TEXT['navi-chart-select']?>"
JS_SELECTED = "<?php echo $TEXT['info-selected']?>";
JS_INFO_SELECT = "<?php echo $TEXT['info-select']?>"
JS_SELECT_ALL = "<?php echo $TEXT['info-select-all']?>";
JS_SELECT_ALL = "[<?php echo $TEXT['info-select-all']?>]"
JS_SELECT_ALL_ITEM = "<?php echo $TEXT['info-select-all-item']?>";
JS_SELECT_ITEMS = "<?php echo $TEXT['info-select-item']?>";
JS_SELECT_CLEAR_ALL = "[<?php echo $TEXT['info-select-clear-all']?>]";
JS_DEFAULT_MARKER=<?php echo $_SESSION['marker'] ?>;
JS_PUSH_NOTIFICATION=<?php echo $_SESSION['puno'] ?>;
JS_PUSH_INTERVAL=<?php echo $_SESSION['puin'] ?>;
JS_DEFAULT_DATETIME_fmt_JS="<?php echo $_SESSION['datetime_fmt_js']?>";
JS_DEFAULT_DATE_FMT="<?php echo $_SESSION['date_fmt_js']?>";
JS_DEFAULT_SOUND_ALARM = "<?php echo $_SESSION['sond_alarm']?>";
JS_DEFAULT_POPUP_ALARM = "<?php echo $_SESSION['popup_alarm']?>";
JS_UNIT_DISTANCE = "<?php echo $_SESSION['unit_distance']?>";         //0:Kilometer(公里) 1:Mile(英里) 2:Nautical mile(海里)
JS_UNIT_FUEL = "<?php echo $_SESSION['unit_fuel']?>";
console.log(JS_UNIT_FUEL);                 //0:Liter(升) 1:Gallon(加仑)
JS_UNIT_TEMPERATURE = "<?php echo $_SESSION['unit_temperature']?>";   //0:Celsius  1:Fahrenheit
JS_UNIT_SPEED = "<?php echo $_SESSION['unit_speed']?>";               //0:kph(公里/小时) 1:mph(英里/小时)
JS_UNIT_ALTITUDE = "<?php echo $_SESSION['unit_altitude']?>";         //0:meter 1:feet
JS_UNIT_HUMIDITY = 0;
JS_UNIT_TPMS = "<?php echo $_SESSION['unit_tpms']?>";                 //0: bar 1:kpa 2:psi 3:kg/cm2
JS_FUEL = "<?php echo $TEXT['report-fuel']?>";
JS_REFUEL = "<?php echo $TEXT['report-re-fuel']?>";
JS_STEAL_FUEL = "<?php echo $TEXT['report-steal-fuel']?>";
JS_ALTITUDE = "<?php echo $TEXT['navi-altitudechart']?>";
JS_IGNITION = "<?php echo $TEXT['navi-ignitionchart']?>";
JS_LOCATE_TIP="<?php echo $TEXT['js-locate-tip'] ?>";
JS_TOTAL_DISTANCE = "<?php echo $TEXT['js-total-distance']?>";
JS_TOTAL_AREA = "<?php echo $TEXT['js-total-area']?>";
JS_ENABLE_DISABLE_ASSET = "<?php echo $TEXT['js-enable-disable-asset']?>";
JS_FIT_ASSETS = "<?php echo $TEXT['js-fit-assets']?>";
JS_ENABLE_DISABLE_LABEL = "<?php echo $TEXT['js-enable-disable-label']?>";
JS_ENABLE_DISABLE_MARKER = "<?php echo $TEXT['js-enable-disable-marker']?>";
JS_ENABLE_DISABLE_ZONES = "<?php echo $TEXT['js-enable-disable-zones']?>";
JS_ENABLE_DISABLE_CLUSTERS = "<?php echo $TEXT['js-enable-disable-clusters']?>";
JS_ENABLE_DISABLE_MEASURE = "<?php echo $TEXT['js-enable-disable-measure']?>";
JS_ENABLE_DISABLE_ARROWS = "<?php echo $TEXT['js-enable-disable-arrows']?>";
JS_ENABLE_DISABLE_POINTS = "<?php echo $TEXT['js-enable-disable-points']?>";
JS_ENABLE_DISABLE_STOPS = "<?php echo $TEXT['js-enable-disable-stops']?>";
JS_ENABLE_DISABLE_EVENTS = "<?php echo $TEXT['js-enable-disable-events']?>";
JS_ENABLE_DISABLE_STREETVIEW = "<?php echo $TEXT['js-enable-disable-streetview']?>";
JS_ENABLE_DISABLE_SNAP = "<?php echo $TEXT['js-enable-disable-snap']?>";
JS_ENABLE_DISABLE_ROUTE = "<?php echo $TEXT['js-enable-disable-route']?>";
JS_DISABLE_TASK = "<?php echo $TEXT['js-enable-disable-task']?>";
JS_TASK_INFO = "<?php echo $TEXT['info-taskinfo']?>";
JS_DISABLE_TASK_SUCC = "<?php echo $TEXT['info-task-disable-succ']?>";
JS_DISABLE_TASK_FAIL = "<?php echo $TEXT['info-task-disable-fail']?>";
JS_ENABLE_DISABLE_DRIVER = "<?php echo $TEXT['js-enable-disable-driver']?>";
JS_NO_TASK= "<?php echo $TEXT['info-task-no-task']?>";
JS_TASK_START = "<?php echo $TEXT['info-task-start-place']?>";
JS_TASK_END = "<?php echo $TEXT['info-task-end-place']?>";
JS_NO_PERMISSION = "<?php echo $TEXT['status-nopermission']?>";
JS_HIS_TIME_START ="<?php echo $TEXT['info-starttime'] ?>";
JS_HIS_TIME_END ="<?php echo $TEXT['info-endtime'] ?>";
JS_BUTTON_OK = "<?php echo $TEXT['button-ok'] ?>";
JS_BUTTON_CANCEL = "<?php echo $TEXT['button-cancel'] ?>";
JS_BUTTON_SEND = "<?php echo $TEXT['cmd-send'] ?>";
JS_BUTTON_RETURN = "<?php echo $TEXT['return-back'] ?>";
JS_PLAY_TITLE = "<?php echo $TEXT['navi-playback']?>";
JS_STATUS_NODATA = "<?php echo $TEXT['status-nodata']?>";
JS_MAX_ITEMS = "<?php echo $TEXT['navi-chart-max-items']?>";
JS_GLOBAL_TIPS = "<?php echo $TEXT['global-loading']?>";
JS_START_POINT = "<?php echo $TEXT['navi-start-point']?>";
JS_END_POINT = "<?php echo $TEXT['navi-end-point']?>";
JS_PLAY = "<?php echo $TEXT['button-play']?>";
JS_STOP = "<?php echo $TEXT['button-stop']?>";
JS_ROUTE = "<?php echo $TEXT['button-route']?>";
JS_HIDE = "<?php echo $TEXT['button-hide']?>";
JS_MAP = "<?php echo $TEXT['button-map']?>";
JS_START = "<?php echo $TEXT['navi-start']?>";
JS_END = "<?php echo $TEXT['navi-end']?>";
JS_DURATION = "<?php echo $TEXT['navi-duration']?>";
JS_TEMP = "<?PHP echo $TEXT['report-temp']?>";
JS_NAVI_DISTANCE = "<?php echo $TEXT['navi-distance'] ?>";
JS_NAVI_DIVTIME = "<?php echo $TEXT['navi-divtime'] ?>";
JS_NAVI_STOPTIME = "<?php echo $TEXT['navi-stoptime'] ?>";
JS_NAVI_AVSPEED = "<?php echo $TEXT['navi-avspeed'] ?>";
JS_NAVI_MAXSPEED = "<?php echo $TEXT['navi-maxspeed'] ?>";
JS_NAVI_IDLETIME = "<?php echo $TEXT['navi-idletime'] ?>";
JS_NAVI_DUTYTIME = "<?php echo $TEXT['navi-dutytime'] ?>";
NAVI_DISTANCE = "<?php echo $TEXT['navi-distance'] ?>";
NAVI_DIVTIME = "<?php echo $TEXT['navi-divtime'] ?>";
NAVI_STOPTIME = "<?php echo $TEXT['navi-stoptime'] ?>";
NAVI_AVSPEED = "<?php echo $TEXT['navi-avspeed'] ?>";
NAVI_MAXSPEED = "<?php echo $TEXT['navi-maxspeed'] ?>";
NAVI_IDLETIME = "<?php echo $TEXT['navi-idletime'] ?>";
NAVI_LOADTIME = "<?php echo $TEXT['navi-dutytime'] ?>";
NAVI_SENSOR_FUEL_CONSUMPTION = "<?php echo $TEXT['navi-sensor-fuel-consumption'] ?>";
NAVI_ESTIMATE_FUEL_CONSUMPTION = "<?php echo $TEXT['navi-estimate-fuel-consumption'] ?>";
NAVI_CAN_FUEL_CONSUMPTION = "<?php echo $TEXT['navi-can-fuel-consumption'] ?>";
NAVI_SPEEDING_DIST = "<?php echo $TEXT['report-speeding-distance'] ?>:";
NAVI_SPEEDING_TIME = "<?php echo $TEXT['report-speeding-last-time'] ?>:";
NAVI_SPEEDING_COUNT = "<?php echo $TEXT['report-speeding-count'] ?>:";
NAVI_ENGINE_COUNT = "<?php echo $TEXT['report-engine-on-count'] ?>:";
JS_SELECT_TIME = "<?php echo $TEXT['select-time'] ?>";
JS_CMD_SENDCMD="<?php echo $TEXT['navi-sendcmd'] ?>";
JS_CMD_SEND_SUCC = "<?php echo $TEXT['status-sendsuccess']?>";
JS_GLOBAL_TIPS = "<?php echo $TEXT['global-update']?>";
JS_UPDATE_SET = "<?php echo $TEXT['navi-updateset']?>";
JS_UPDATE_SUCC = "<?php echo $TEXT['status-updatesuccess']?>";
JS_REQUEST_INFO = "<?php echo $TEXT['info-requestinfo']?>";
JS_REQUEST_TIMEOUT = "<?php echo $TEXT['status-timeout']?>";
JS_SHOW = "<?php echo $TEXT['info-show']?>";
JS_TRACK = "<?php echo $TEXT['info-track']?>";
JS_SHOW_ALL = "<?php echo $TEXT['info-show-all']?>";
JS_TRACK_ALL = "<?php echo $TEXT['info-track-all']?>";
JS_UPDATE_FAIL = "<?php echo $TEXT['status-updatefail']?>";
OBJECT_INFO_FLAG = "<?php echo $TEXT['info-objectflag']?>";
JS_ADDRESS = "<?php echo $TEXT['js-address']?>";
OBJECT_INFO_TYPE = "<?php echo $TEXT['info-devicetype']?>";
OBJECT_INFO_DEVICE_ID = "<?php echo $TEXT['info-deviceid']?>";
OBJECT_INFO_SIMCARD = "<?php echo $TEXT['info-simcard']?>";
OBJECT_INFO_INSTALLTIME = "<?php echo $TEXT['info-installtime']?>";
OBJECT_INFO_EXPIRETIME = "<?php echo $TEXT['info-expiretime']?>";
OBJECT_INFO_CUSTNAME = "<?php echo $TEXT['info-custname']?>";
OBJECT_INFO_CONTACTPHONE = "<?php echo $TEXT['info-contactphone']?>";
JS_POSITION = "<?php echo $TEXT['navi-position']?>";
JS_SPEED = "<?php echo $TEXT['navi-speed']?>";
JS_HEADING = "<?php echo $TEXT['info-heading']?>";
JS_GPS_TIME = "<?php echo $TEXT['info-gpstime']?>";
JS_SERVER_TIME = "<?php echo $TEXT['info-revtime']?>";
JS_PARKING = "<?php echo $TEXT['js-parking']?>";
JS_TOTAL_DISTANCE = "<?php echo $TEXT['js-total-distance']?>";
JS_TOTAL_AREA = "<?php echo $TEXT['js-total-area']?>";
JS_GENERAL_STATUS = "<?php echo $TEXT['navi-generalstatus']?>";
JS_RECENT_MILEAGE = "<?php echo $TEXT['info-recent-mileage']?>";
JS_RECENT_ENGINE = "<?php echo $TEXT['info-recent-engine']?>";
JS_RECENT_LOAD = "<?php echo $TEXT['info-recent-load']?>";
JS_RECENT_TIRESENSOR = "<?php echo $TEXT['info-recent-tiresensor']?>";
JS_TIRE_PRESSURE = "<?php echo $TEXT['info-tire-pressure']?>";
JS_NO_DATA = "<?php echo $TEXT['info-no-data']?>";
JS_BAT = "<?php echo $TEXT['info-battery']?>";
JS_DOOR_OPEN = "<?php echo $TEXT['info-door-open'] ?>";
JS_DOOR_CLOSE = "<?php echo $TEXT['info-door-close'] ?>";
JS_DOOR_STATE = "<?php echo $TEXT['asset-infos-door-status'] ?>";
JS_MYLOCATION = "<?php echo $TEXT['mylocation']?>";
JS_RELEASE_TRACK = "<?php echo $TEXT['js-release-track']?>";
JS_STATUS_EMPTYOLDPASS = "<?php echo $TEXT['status-emptyoldpass']?>";
JS_STATUS_EMPTYNEWPASS = "<?php echo $TEXT['status-emptynewpass']?>";
JS_STATUS_INVALIDREPEPASS = "<?php echo $TEXT['status-invalidrepepass']?>";
JS_CONTEXTBUTTONTITLE = "<?php echo $TEXT['js-highcharts-contextbuttontitle']?>";
JS_DECIMALPOINT = "<?php echo $TEXT['js-highcharts-decimalpoint']?>";
JS_DOWNLOADJPEG = "<?php echo $TEXT['js-highcharts-downloadjpeg']?>";
JS_DOWNLOADPDF = "<?php echo $TEXT['js-highcharts-downloadpdf']?>";
JS_DOWNLOADPNG = "<?php echo $TEXT['js-highcharts-downloadpng']?>";
JS_DOWNLOADSVG = "<?php echo $TEXT['js-highcharts-downloadsvg']?>";
JS_LOADING = "<?php echo $TEXT['js-highcharts-loading']?>";
JS_MONTHS1 = "<?php echo $TEXT['js-highcharts-months1']?>";
JS_MONTHS2 = "<?php echo $TEXT['js-highcharts-months2']?>";
JS_MONTHS3 = "<?php echo $TEXT['js-highcharts-months3']?>";
JS_MONTHS4 = "<?php echo $TEXT['js-highcharts-months4']?>";
JS_MONTHS5 = "<?php echo $TEXT['js-highcharts-months5']?>";
JS_MONTHS6 = "<?php echo $TEXT['js-highcharts-months6']?>";
JS_MONTHS7 = "<?php echo $TEXT['js-highcharts-months7']?>";
JS_MONTHS8 = "<?php echo $TEXT['js-highcharts-months8']?>";
JS_MONTHS9 = "<?php echo $TEXT['js-highcharts-months9']?>";
JS_MONTHS10 = "<?php echo $TEXT['js-highcharts-months10']?>";
JS_MONTHS11 = "<?php echo $TEXT['js-highcharts-months11']?>";
JS_MONTHS12 = "<?php echo $TEXT['js-highcharts-months12']?>";
JS_NODATA = "<?php echo $TEXT['js-highcharts-nodata']?>";
JS_PRINTCHART = "<?php echo $TEXT['js-highcharts-printchart']?>";
JS_RESETZOOM = "<?php echo $TEXT['js-highcharts-resetzoom']?>";
JS_RESETZOOMTITLE = "<?php echo $TEXT['js-highcharts-resetzoomtitle']?>";
JS_SHORTMONTHS1 = "<?php echo $TEXT['js-highcharts-shortmonths1']?>";
JS_SHORTMONTHS2 = "<?php echo $TEXT['js-highcharts-shortmonths2']?>";
JS_SHORTMONTHS3 = "<?php echo $TEXT['js-highcharts-shortmonths3']?>";
JS_SHORTMONTHS4 = "<?php echo $TEXT['js-highcharts-shortmonths4']?>";
JS_SHORTMONTHS5 = "<?php echo $TEXT['js-highcharts-shortmonths5']?>";
JS_SHORTMONTHS6 = "<?php echo $TEXT['js-highcharts-shortmonths6']?>";
JS_SHORTMONTHS7 = "<?php echo $TEXT['js-highcharts-shortmonths7']?>";
JS_SHORTMONTHS8 = "<?php echo $TEXT['js-highcharts-shortmonths8']?>";
JS_SHORTMONTHS9 = "<?php echo $TEXT['js-highcharts-shortmonths9']?>";
JS_SHORTMONTHS10 = "<?php echo $TEXT['js-highcharts-shortmonths10']?>";
JS_SHORTMONTHS11 = "<?php echo $TEXT['js-highcharts-shortmonths11']?>";
JS_SHORTMONTHS12 = "<?php echo $TEXT['js-highcharts-shortmonths12']?>";
JS_THOUSANDSSEP = "<?php echo $TEXT['js-highcharts-thousandssep']?>";
JS_WEEKDAYS1 = "<?php echo $TEXT['js-highcharts-weekdays1']?>";
JS_WEEKDAYS2 = "<?php echo $TEXT['js-highcharts-weekdays2']?>";
JS_WEEKDAYS3 = "<?php echo $TEXT['js-highcharts-weekdays3']?>";
JS_WEEKDAYS4 = "<?php echo $TEXT['js-highcharts-weekdays4']?>";
JS_WEEKDAYS5 = "<?php echo $TEXT['js-highcharts-weekdays5']?>";
JS_WEEKDAYS6 = "<?php echo $TEXT['js-highcharts-weekdays6']?>";
JS_WEEKDAYS7 = "<?php echo $TEXT['js-highcharts-weekdays7']?>";
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
</script>

<style type="text/css">
	.ui-link{font-weight: bold !important;}
.icheck { margin: 5px 10px; height: 20px; width: 20px; font-size: 12px; line-height: 20px; font-weight: normal; }
.iselect { outline-style: none;  border: 1px solid #ccc; border-radius: 3px; }
.oneline { width: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  }
.itext { outline-style: none;  border: 1px solid #ccc; border-radius: 3px; }
</style>
</head>
<body onload="oninit();" onContextMenu="return true;" >
	<div id="loadmapwait"><span><?php echo $TEXT['map-loading'] ?></span></div>
	<div id="page_menu" class="page_menu" style="display: none;" ontouchmove="event.preventDefault();">
		<div class="title-block">
			<div class="page-title"><?php echo $TEXT['menu-menu'] ?></div>
			<a href="#" onclick="showPage('page_last');">
				<i></i>
			</a>
		</div>	
		<ul> 
			<li>
				<a href="#" id="page_menu_map" onclick="showPage('page_map');">
					<i class="icon icon-menu-map"></i>
					<?php echo /*$TEXT['menu-map']*/ 'Live Map' ?>	
				</a>
			</li>  
			<li>
				<a href="#" id="page_menu_objects" onclick="showPage('page_objects');">
					<i class="icon icon-menu-object"></i>
					<?php echo $TEXT['menu-objects'] ?>	                                
				</a>
			</li>
			<li>
				<a href="#" id="page_menu_dashboard" onclick="showPage('page_dashboard');">
					<i class="icon icon-menu-dashboard"></i>
					<?php echo $TEXT['menu-dashboard'] ?>	                                
				</a>
			</li>
			<li>
				<a href="#" id="page_menu_events" onclick="showPage('page_events');">
					<i class="icon icon-menu-event"></i>
					<?php echo $TEXT['menu-events'] ?>	                                
				</a>
			</li>  
			<li>
				<a href="#" id="page_menu_history" onclick="showPage('page_history');">
					<i class="icon icon-menu-history"></i>
					<?php echo $TEXT['menu-history'] ?>                                
				</a>
			</li>
			<li>
				<a href="#" id="page_menu_object_control" onclick="showPage('page_cmd');">
					<i class="icon icon-menu-control"></i>
					<?php echo $TEXT['menu-control'] ?>                                
				</a>
			</li> 
			<li>
				<a href="#" id="page_menu_settings" onclick="showPage('page_setting');">
					<i class="icon icon-menu-setting"></i>
					<?php echo $TEXT['menu-setting'] ?>                                 
				</a>
			</li> 
		</ul>
						
		<div class="button-block">
			<a style="margin-right: 15px;"  class="desktop-btn" href="../index.php" onfocus="this.blur();" data-ajax="false">										
				<?php echo $TEXT['menu-desktop-version'] ?>                        
			</a>
			<a class="logout-btn" href="mexit.php" onclick="clearTimeout(timer);" onfocus="this.blur();" data-ajax="false">
				<?php echo $TEXT['menu-logout'] ?>
			</a>
		</div>
	</div>
	
	<div id="page_map" class="page_map" style="display: none;">
		<div class="title-block" ontouchmove="event.preventDefault();">
			<a href="#" onclick="showPage('page_menu');"><i></i></a>
			<div class="page-title"><?php echo $TEXT['menu-map'] ?></div>			
		</div>
		<div id="map"></div>
		<div id="streetview_img" style="display: none;" ontouchmove="event.preventDefault();">
			<p style="font-size:20px; color:rgba(0,0,0,0.5)"><?php echo $TEXT['js-streetview'] ?></p>
		</div>
		
		<div id="details_panel" class="details-panel" style="display: none;">
			<div id="details_panel_detail_list" class="panel panel-default">
				<table id="general" class="general" border="0" cellpadding="0" cellspacing="0">
					<thead>
						<tr colspan="2">
							<td><?php echo $TEXT['navi-his-statistics'] ?></td>
						</tr>
					</thead>
				</table>
			</div>
			<div id="route_panel_detail_list" class="panel panel-default">
				<table id="hisroute" class="hisroute" border="0" cellpadding="0" cellspacing="0">
					<thead>
						<tr colspan="2">
							<td><?php echo $TEXT['navi-his-process'] ?></td>
						</tr>
					</thead>
				</table>
			</div>
			<div id="details_panel_detail_ext_list" class="list-group" style="display: none;"></div>
			<div id="hisstatus">	
				<ul class="tabbar">		
					<li target="#tab_chart" class="tab_active"><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['navi-chart']?>"></a></li>
					<!--<li target="#tab_ignitionchart" ><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['navi-ignitionchart']?>"></a></li>
					<li target="#tab_fuelchart" ><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['navi-fuelchart']?>"></a></li>
					<li target="#tab_tempchart" ><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['report-temp']?>"></a></li>
					<li target="#tab_altitudechart" ><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['navi-altitudechart']?>"></a></li>-->
					<li target="#tab_movesdetail"><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['navi-moves-detail']?>"></a></li>
				</ul>
				<div id="tab_chart" class="tab_content">		
					<div id="select_chart"></div>
					<div id="chart_div"></div>
				</div>
				<!--<div id="tab_speedchart" class="tab_content"></div>
				<div id="tab_ignitionchart" class="tab_content"></div>
				<div id="tab_fuelchart" class="tab_content"></div>
				<div id="tab_tempchart" class="tab_content"></div>
				<div id="tab_altitudechart" class="tab_content"></div>-->				
				<div id="tab_movesdetail" style="overflow:auto;" class="tab_content">
					<table id="table_movesdetail" class="tab_report">
						<thead>
							<tr>
								<th width="13%"><?php echo $TEXT['report-start']?></th>                    
								<th width="10%"><?php echo $TEXT['report-duration']?></th>
								<th width="10%"><?php echo $TEXT['navi-distance']?></th>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		</div>

		<div id="history_navbar" style="display: none;" ontouchmove="event.preventDefault();">
			<ul class="nav">
				<li><a id="play" href="#" onfocus="this.blur();"><i class="icon icon-navbar-stop"></i><span><?php echo $TEXT['button-play']?></span></a></li>
				<li><a id="route" href="#" onfocus="this.blur();"><i class="icon icon-navbar-route"></i><span><?php echo $TEXT['button-route']?></span></a></li>
				<li><a id="hide" href="#" onfocus="this.blur();"><i class="icon icon-navbar-hide"></i><span><?php echo $TEXT['button-hide']?></span></a></li>
			</ul>
		</div>
	</div>
	
	<div id="page_history" class="page_history" style="display: none;" >		
		<div class="title-block" ontouchmove="event.preventDefault();">
			<a href="#" onclick="showPage('page_menu');">
				<i></i>
			</a>
			<div class="page-title"><?php echo $TEXT['menu-history'] ?></div>			
		</div>
		<div id="page_history_setting" class="page_history_setting">
			<table border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td><label class="ilabel" for="oflag"><?php echo $TEXT['info-objectflag'] ?></label></td>
					<td><input id="oflag" class="itext" type="text" /></td>
				</tr>
				<tr>
					<td><label class="ilabel" for="day"><?php echo $TEXT['info-daterange'] ?></label></td>
					<td>
						<select id="day" class="iselect" name="day">
							<option value='1/24' selected='selected'><?php echo $TEXT['info-daterange-hour'] ?></option>
							<option value='1/12'><?php echo $TEXT['info-daterange-2hour'] ?></option>
							<option value='0.1'><?php echo $TEXT['info-daterange-day'] ?></option>
							<option value='0.2'><?php echo $TEXT['info-daterange-yesterday'] ?></option>
							<option value='1'><?php echo $TEXT['info-daterange-1day'] ?></option>
							<option value='2'><?php echo $TEXT['info-daterange-2day'] ?></option>
							<option value='3'><?php echo $TEXT['info-daterange-3day'] ?></option>
							<option value='7'><?php echo $TEXT['info-daterange-week'] ?></option>
							<option value='14'><?php echo $TEXT['info-daterange-2week'] ?></option>
							<option value='-1'><?php echo $TEXT['info-daterange-usedef'] ?></option>
						</select>
					</td>
				</tr>
				<tr id="starttime" style="display: none;">
					<td><label class="ilabel"><?php echo $TEXT['info-starttime'] ?></label></td>
					<td>
						<div class="input-group">
							<input id="history_date_from" class="form-control history_date_from" data-field="datetime" readonly="readonly" type="text">
							<div class="input-group-addon"></div>
						</div>
					</td>
				</tr>
				<tr id="endtime" style="display: none;">
					<td><label class="ilabel"><?php echo $TEXT['info-endtime'] ?></label></td>
					<td>
						<div class="input-group">
							<input id="history_date_to" class="form-control history_date_to" data-field="datetime" readonly="readonly" type="text">
							<div class="input-group-addon"></div>
						</div>
					</td>
				</tr>
				<tr>
					<td><label class="ilabel" for="stop_duration"><?php echo $TEXT['info-stop-duration'] ?></label></td>
					<td>
						<select id="stop_duration" class="iselect" name="stoptime">
							<option value='1'><?php echo $TEXT['info-1min'] ?></option>
							<option value='2'><?php echo $TEXT['info-2min'] ?></option>
							<option value='5'><?php echo $TEXT['info-5min'] ?></option>
							<option value='10'><?php echo $TEXT['info-10min'] ?></option>
							<option value='20' selected='selected'><?php echo $TEXT['info-20min'] ?></option>
							<option value='30'><?php echo $TEXT['info-30min'] ?></option>
							<option value='60'><?php echo $TEXT['info-60min'] ?></option>
							<option value='120'><?php echo $TEXT['info-120min'] ?></option>
							<option value='300'><?php echo $TEXT['info-300min'] ?></option>
						</select>
					</td>
				</tr>
				<tr>
					<td><label class="ilabel" for="stop_mark"><?php echo $TEXT['info-stops'] ?></label></td>
					<td>
						<select id="stop_mark" class="iselect" name="stopmark">
							<option value='1' selected='selected'><?php echo $TEXT['js-yes'] ?></option>
							<option value='2'><?php echo $TEXT['js-no'] ?></option>
						</select>
					</td>
				</tr>
				<tr>
					<td><label class="ilabel" for="event_mark"><?php echo $TEXT['info-events'] ?></label></td>
					<td>
						<select id="event_mark" class="iselect" name="eventmark">
							<option value='1' selected='selected'><?php echo $TEXT['js-yes'] ?></option>
							<option value='2'><?php echo $TEXT['js-no'] ?></option>
						</select>
					</td>
				</tr>
				<tr>
					<td><label class="ilabel" for="gpslbs_mark"><?php echo $TEXT['js-position-type'] ?></label></td>
					<td>
						<select id="position_type" class="iselect" name="gpslbs_mark">
							 <option value='1' selected='selected'><?php echo $TEXT['js-position-type-gps'] ?></option>
							 <option value='2'><?php echo $TEXT['js-position-type-gps-lbs'] ?></option>
						</select>
					</td>
				</tr>
				<tr>
					<td><label class="ilabel" for="playback_mark"><?php echo $TEXT['js-playback-type'] ?></label></td>
					<td>
						<select id="playback_type" class="iselect" name="playback_mark">
							  <option value='1' selected='selected'><?php echo $TEXT['js-playback-type-track'] ?></option>
							  <option value='2'><?php echo $TEXT['js-playback-type-track-route'] ?></option>
							  <option value='3'><?php echo $TEXT['js-playback-type-track-route-statistics'] ?></option>
						</select>
					</td>
				</tr>
				
				<tr>
					<td align="center">
						<button type="button" class="icon-button" id="queryhis">
						  <span></span><span><?php echo $TEXT['button-search'] ?></span>
						</button>
					</td>
					<td align="center">
						<button type="button" class="icon-button" id="history-back">
						  <span class="icon-button-back"></span><span><?php echo $TEXT['return-back'] ?></span>
						</button>
					</td>
				</tr>
			</table>
		</div>
	</div>
	
	<div id="page_cmd" class="page_cmd" style="display: none;">
		<div class="title-block" ontouchmove="event.preventDefault();">
			<a href="#" onclick="showPage('page_menu');">
				<i></i>
			</a>
			<div class="page-title"><?php echo $TEXT['menu-control'] ?></div>			
		</div>
		<div id="page_cmd_details" class="page_cmd_details">
			<div id="page_cmd_object_cmd">
				<table border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td><label class="ilabel" for="cflag"><?php echo $TEXT['info-objectflag'] ?></label></td>
						<td><input id="cflag" class="itext" type="text" /></td>
					</tr>
					<tr>
						<td><label class="ilabel" for="cmdul"><?php echo $TEXT['cmd-command'] ?></label></td>
						<td>
							<ul id="cmdul" class="iul"></ul>
						</td>
					</tr>
				</table>
			</div>
			<div id="page_cmd_params">
				<table id="cmdparam" border="0" cellpadding="0" cellspacing="0">
					<tbody></tbody>
					<tfoot>
						<tr>
							<td align="center">
								<button type="button" class="icon-button" id="cmd-send">
								  <span></span><span><?php echo $TEXT['cmd-send'] ?></span>
								</button>
							</td>
							<td align="center">
								<button type="button" class="icon-button" id="cmd-back">
								  <span class="icon-button-back"></span><span><?php echo $TEXT['return-back'] ?></span>
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
			<label id="cmderror"></label>
		</div>		
	</div>
	
    <div id="page_objects" class="page_objects" style="display: none;">
		<div class="title-block" ontouchmove="event.preventDefault();">
			<a href="#" onclick="showPage('page_menu');">
				<i></i>
			</a>
			<div class="page-title"><?php echo $TEXT['menu-objects'] ?></div>			
		</div>
		<div id="object_list">
			<div id="sch" ontouchmove="event.preventDefault();">
				<input id="device" type="text" placeholder="<?php echo $TEXT['info-objectflag'] ?>"/>
				<!--<input id="selone" type="button" value="<?php echo $TEXT['button-search'] ?>" />-->
				<label id="selone" type="button" style="display: table-cell; vertical-align: middle; text-align: center;">
				  <span><?php echo $TEXT['button-search'] ?></span>
				</label>
			</div>
			<div id="mod">
				<ul class="tabbar" ontouchmove="event.preventDefault();">
					<li target="#tab_all" class="tab_active"><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['navi-taball'] ?>"></a></li>
					<li target="#tab_online"><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['navi-tabonline'] ?>"></a></li>
					<li target="#tab_offline"><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['navi-tabinactive'] ?>"></a></li>
					<li target="#tab_expired"><a href="#" onfocus="this.blur();" title="<?php echo $TEXT['navi-tabexpired'] ?>"></a></li>
				</ul>
				<div id="tablist" class="tablist">
					<div id="tab_all" class="tab_content">
						<div id="tree_all" class="tree_table" border="0" cellpadding="0" cellspacing="0" width="303">
							<div></div>
						</div>
					</div>
					<div id="tab_online" class="tab_content">
						<table id="tree_online" class="tree_table" border="0" cellpadding="0" cellspacing="0" width="303">
							<thead></thead>
						</table>
					</div>
					<div id="tab_offline" class="tab_content">
						<table id="tree_offline" class="tree_table" border="0" cellpadding="0" cellspacing="0" width="303">
							<thead></thead>
						</table>
					</div>
					<div id="tab_expired" class="tab_content">
						<table id="tree_expired" class="tree_table" border="0" cellpadding="0" cellspacing="0" width="303">
							<thead>
							</thead>
						</table>
					</div>
				</div>
				<div id="object-release" ontouchmove="event.preventDefault();">
					<label type="button" class="icon-button" style="display: table-cell; vertical-align: middle; text-align: center;">
					  <span></span><span><?php echo $TEXT['js-release-track'] ?></span>
					</label>
				</div>
				<div id="object-back" ontouchmove="event.preventDefault();">			
					<label type="button" class="icon-button" style="display: table-cell; vertical-align: middle; text-align: center;">
					  <span class="icon-button-back"></span><span><?php echo $TEXT['return-back'] ?></span>
					</label>
				</div>		
			</div>
		</div>

		<div id="object_detail" class="details-panel" style="display: none; bottom: 0px;">
			<div id="object_detail_scmd_list" class="panel panel-default">
				<table id="object_detail_scmd" class="general" border="0" cellpadding="0" cellspacing="0">
					<thead>
						<tr colspan="2">
							<td><?php echo $TEXT['info-shortcut-command'] ?></td>
						</tr>					
					</thead>
					<!--menu from list-->
					<tbody>
						<tr>
							<td><?php echo $TEXT['info-cmd-enable-immobilizer'] ?></td><td><input type='checkbox' id='scmd_cut' class='cmdcheckbox'></input><label class='cmdswitch' for='scmd_cut'></label></td>
						</tr>
						<tr>
							<td><?php echo $TEXT['info-cmd-disable-immobilizer'] ?></td><td><input type='checkbox' id='scmd_uncut' class='cmdcheckbox'></input><label class='cmdswitch' for='scmd_uncut'></label></td>
						</tr>
						<tr>
							<td><?php echo $TEXT['info-cmd-arm'] ?></td><td><input type='checkbox' id='scmd_arm' class='cmdcheckbox'></input><label class='cmdswitch' for='scmd_arm'></label></td>
						</tr>
						<tr>
							<td><?php echo $TEXT['info-cmd-disarm'] ?></td><td><input type='checkbox' id='scmd_disarm' class='cmdcheckbox'></input><label class='cmdswitch' for='scmd_disarm'></label></td>
						</tr>
						<tr>
							<td><?php echo $TEXT['info-cmd-lock-door'] ?></td><td><input type='checkbox' id='scmd_lock' class='cmdcheckbox'></input><label class='cmdswitch' for='scmd_lock'></label></td>
						</tr>
						<tr>
							<td><?php echo $TEXT['info-cmd-unlock-door'] ?></td><td><input type='checkbox' id='scmd_unlock' class='cmdcheckbox'></input><label class='cmdswitch' for='scmd_unlock'></label></td>
						</tr>
					</tbody>
				</table>
			</div>
		
			<div id="object_detail_general" class="panel panel-default">
				<table id="object_detail_list" class="general" border="0" cellpadding="0" cellspacing="0">
					<thead>
						<tr colspan="2">
							<td><?php echo $TEXT['general'] ?></td>
						</tr>
					</thead>
				</table>
			</div>
			<div id="object_detail_ext_list" class="panel panel-default">
				<table id="object_detail_ext" class="general" border="0" cellpadding="0" cellspacing="0">
					<thead>
						<tr colspan="2">
							<td><?php echo $TEXT['navi-targetstatus'] ?></td>
						</tr>
					</thead>
				</table>
			</div>
			<div id="object_detail_sta_last5day" class="panel panel-default">
				<table id="last5day_table" class="general" border="0" cellpadding="0" cellspacing="0">
					<thead>
						<tr colspan="1">
							<td><?php echo $TEXT['navi-objstatechartinfo'] ?></td>
						</tr>
					</thead>
					<tbody>
						<tr style="border='none';">
							<td style="border-top: 1px solid #DDDDDD; align='top'; width: 50%;"><div id="last5day_mil" style="min-height: 100px;"></div></td>					
						</tr>
						<tr style="border='none';">
							<td style="border-top: 1px solid #DDDDDD; align='top'; width: 50%;"><div id="last5day_eng" style="min-height: 100px;"></div></td>					
						</tr>
						<tr style="border='none';">
							<td style="border-top: 1px solid #DDDDDD; align='top'; width: 50%;"><div id="last5day_load" style="min-height: 100px;"></div></td>					
						</tr>
						<tr style="border='none';">
							<td style="border-top: 1px solid #DDDDDD; align='top'; width: 50%;"><div id="last5day_tire" style="min-height: 100px;"></div></td>					
						</tr>
					</tbody>
				</table>
			</div>
			<div id="object-detail-back" ontouchmove="event.preventDefault();">			
				<label type="button" class="icon-button" style="display: table-cell; vertical-align: middle; text-align: center;">
				  <span class="icon-button-back"></span><span><?php echo $TEXT['return-back'] ?></span>
				</label>
			</div>
		</div>
	</div>
	
	<div id="page_dashboard" class="page_dashboard" style="display: none;">
		<div class="title-block" ontouchmove="event.preventDefault();">
			<a href="#" onclick="showPage('page_menu');">
				<i></i>
			</a>
			<div class="page-title"><?php echo $TEXT['menu-dashboard'] ?></div>			
		</div>
		<div id="dashboard">
			<div id="dashboard-table-div">
				<table id="dashboard-table" border="0" cellpadding="0" cellspacing="0" style="box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;">	
					<tr style="border='none';">
						<td style="border-top: 1px solid #DDDDDD; align='top'; width: 50%;"><div id="sta_on_off_exp" style="min-height: 180px;"></div></td>					
						<td style="border-top: 1px solid #DDDDDD; align='top'; width: 50%;"><div id="sta_mov_sti_alm" style="min-height: 180px;"></div></td>
					</tr>
					<tr style="border='none';">
						<td style="border-bottom: 1px solid #DDDDDD; align='top'; width: 50%;"><div id="sta_speed_range" style="min-height: 180px;"></div></td>					
						<td style="border-bottom: 1px solid #DDDDDD; align='top'; width: 50%;"><div id="sta_exp_time" style="min-height: 180px;"></div></td>
					</tr>
					<tr style="border='none';">
						<td colspan="2" style="border-bottom: 1px solid #DDDDDD; align='top'; width: 100%;"><div id="sta_last24h_moving" style=" min-height: 240px;"></div></td>
					</tr>
					<tr style="border='none';">
						<td colspan="2" style="border-bottom: 1px solid #DDDDDD; align='top'; width: 100%;"><div id="sta_last24h_idle" style="min-height: 240px;"></div></td>
					</tr>
					<tr style="border='none';">
						<td colspan="2" style="border-bottom: 1px solid #DDDDDD; align='top'; width: 100%;"><div id="sta_last24h_mileage" style="min-height: 240px;"></div></td>
					</tr>
					<tr style="border='none';">
						<td colspan="2" style="border-bottom: 1px solid #DDDDDD; align='top'; width: 100%;"><div id="sta_last24h_engine" style="min-height: 240px;"></div></td>						
					</tr>
				</table>
			</div>			
			<div id="dashboard-back" ontouchmove="event.preventDefault();">			
				<label type="button" class="icon-button" style="display: table-cell; vertical-align: middle; text-align: center;">
				  <span class="icon-button-back"></span><span><?php echo $TEXT['return-back'] ?></span>
				</label>
			</div>
		</div>
	</div>
	
	<div id="page_events" class="page_events" style="display: none;background-color: white;">
		<div class="title-block" ontouchmove="event.preventDefault();">
			<a href="#" onclick="showPage('page_menu');">
				<i></i>
			</a>
			<div class="page-title"><?php echo $TEXT['menu-events'] ?></div>			
		</div>
		<div id="events">
			<div id="event-table-div">
				<table id="event-table" border="0" cellpadding="0" cellspacing="0">				
				</table>
			</div>			
			<div id="event-back" ontouchmove="event.preventDefault();">			
				<label type="button" class="icon-button" style="display: table-cell; vertical-align: middle; text-align: center;">
				  <span class="icon-button-back"></span><span><?php echo $TEXT['return-back'] ?></span>
				</label>
			</div>
		</div>
	</div>
	
	<div id="page_setting" class="page_setting" style="display: none;">
		<div class="title-block" ontouchmove="event.preventDefault();">
			<a href="#" onclick="showPage('page_menu');">
				<i></i>
			</a>
			<div class="page-title"><?php echo $TEXT['menu-setting'] ?></div>			
		</div>
		<div id="settings">
			<div id="settings-items" class="settings-items">
				<table id="setting-table" border="0" cellpadding="0" cellspacing="0">
					<tr id="push_setting">
						<td><label for="pushNoti"><?php echo $TEXT['push-notification']?></label></td>
						<td><input id="pushNoti" type="checkbox" class="icheck" name="pushNoti"/></td>
					</tr>
					<tr>
						<td><label for="idLng"><?php echo $TEXT['set-deflng']?></label></td>
						<td><input id="idLng" type="text" class="itext" name="idLng" maxlength="30" value="<?php echo $_SESSION['lng']?>" /></td>
					</tr>
					<tr>
						<td><label for="idLat"><?php echo $TEXT['set-deflat']?></label></td>
						<td><input id="idLat" type="text" class="itext" name="idLat" maxlength="30" value="<?php echo $_SESSION['lat']?>" /></td>
					</tr>
					<tr>
					<td><label for="idZoom"><?php echo $TEXT['set-defzoom']?></label></td>
						<td>
							<select id="idZoom" class="iselect" name="idZoom">                       						
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
								<option value="11">11</option>
								<option value="12">12</option>
								<option value="13">13</option>
								<option value="14">14</option>
								<option value="15">15</option>
								<option value="16">16</option>
								<option value="17">17</option>
								<option value="18">18</option>
								<option value="19">19</option>
								<option value="20">20</option>
								<option value="21">21</option>
								<option value="22">22</option>
								<option value="23">23</option>
								<option value="24">24</option>
								<option value="25">25</option>
								<option value="26">26</option>
								<option value="27">27</option>
								<option value="28">28</option>
								<option value="29">29</option>
								<option value="30">30</option>
							</select>
						</td>
					</tr>
					<tr>
						<td><label for="object_fit_bounds"><?php echo $TEXT['set-asset-fit-bounds']?></label></td>
						<td><input id="object_fit_bounds" type="checkbox" class="icheck" name="object_fit_bounds" /></td>
					</tr>
					
					<tr>
						<td><label for="collapsed_asset_group"><?php echo $TEXT['collapsed-asset-group']?></label></td>
						<td><input id="collapsed_asset_group" type="checkbox" class="icheck" name="collapsed_asset_group" /></td>
					</tr>
					
					<tr>
						<td><label for="asset_infos"><?php echo $TEXT['asset-infos']?></label></td>
						<td style="padding-left: 10px;"><select id="asset_infos" name="asset_infos" multiple size="0">
								<option value="1"><?php echo $TEXT['info-temperature']?></option>
								<option value="2"><?php echo $TEXT['info-fuel']?></option>
								<option value="3"><?php echo $TEXT['info-odometer-24h']?></option>
								<option value="4"><?php echo $TEXT['info-max-speed-24h']?></option>
								<option value="5"><?php echo $TEXT['info-moving-time-24h']?></option>
								<option value="6"><?php echo $TEXT['info-idle-time-24h']?></option>
								<option value="7"><?php echo $TEXT['info-stop-time-24h']?></option>
								<option value="8"><?php echo $TEXT['info-engine-time-24h']?></option>
								<option value="9"><?php echo $TEXT['info-obd-mileage']?></option>
								<option value="10"><?php echo $TEXT['asset-infos-door-status']?></option>
								<option value="11"><?php echo $TEXT['info-driver']?></option>
							</select>
						</td>
					</tr>
					
					<tr>
						<td><label for="show_all_object"><?php echo $TEXT['set-show-asset']?></label></td>
						<td><input id="show_all_object" type="checkbox" class="icheck" name="show_all_object" /></td>
					</tr>
					
					<tr>
						<td><label for="show_marker"><?php echo $TEXT['set-show-marker']?></label></td>
						<td><input id="show_marker" type="checkbox" class="icheck" name="show_marker" /></td>
					</tr>
					
					<tr>
						<td><label for="show_zone"><?php echo $TEXT['set-show-zone']?></label></td>
						<td><input id="show_zone" type="checkbox" class="icheck" name="show_zone" /></td>
					</tr>
					
					<tr>
					<td><label for="def_page"><?php echo $TEXT['set-defpage']?></label></td>
						<td><select id="def_page" class="iselect" name="def_page">
							<option value='0' selected='selected'><?php echo $TEXT['menu-menu']?></option>
							<option value='1'><?php echo $TEXT['menu-objects']?></option>
							<option value='2'><?php echo $TEXT['menu-map']?></option>
							<option value='3'><?php echo $TEXT['menu-dashboard']?></option>
						</select></td>
					</tr>
					
					<tr>
						<td><label for="idDate"><?php echo $TEXT['set-datefmt']?></label></td>
							<td><select id="idDate" class="iselect" name="idDate">
							<?php
							foreach($support_datefmt as $key => $value){
								if($value == $_SESSION['date_fmt']){
									echo "<option value='$key' selected='selected'>$key</option>";
								}else{
									echo "<option value='$key'>$key</option>";
								}
							}
							?>
							</select></td>
					</tr>
					<tr>
						<td><label for="idTime"><?php echo $TEXT['set-timefmt']?></label></td>
							<td><select id="idTime" class="iselect" name="idTime">
							<?php
							foreach($support_timefmt as $key => $value){
								if($value == $_SESSION['time_fmt']){
									echo "<option value='$key' selected='selected'>$key</option>\n";
								}else{
									echo "<option value='$key'>$key</option>\n";
								}
							}
							?>
							</select></td>
					</tr>
					
					<tr>
					<td><label for="unit_speed"><?php echo $TEXT['set-unit-speed']?></label></td>
						<td><select id="unit_speed" class="iselect" name="unit_speed">
							<option value='0' selected='selected'><?php echo $TEXT['set-speed-kph']?></option>
							<option value='1'><?php echo $TEXT['set-speed-mph']?></option>
						</select></td>
					</tr>
					
					<tr>
						<td><label for="unit_distance"><?php echo $TEXT['set-unit-distance']?></label></td>
							<td><select id="unit_distance" class="iselect" name="unit_distance">
								<option value='0' selected='selected'><?php echo $TEXT['set-distance-kilometer']?></option>
								<option value='1'><?php echo $TEXT['set-distance-mile']?></option>
								<option value='2'><?php echo $TEXT['set-distance-nautical-mile']?></option>
							</select></td>
					</tr>
					
					<tr>
						<td><label for="unit_fuel"><?php echo $TEXT['set-unit-fuel']?></label></td>
							<td><select id="unit_fuel" class="iselect" name="unit_fuel">
								<option value='0' selected='selected'><?php echo $TEXT['set-fuel-liter']?></option>
								<option value='1'><?php echo $TEXT['set-fuel-gallon']?></option>
							</select></td>
					</tr>
					
					<tr>
						<td><label for="unit_temp"><?php echo $TEXT['set-unit-temp']?></label></td>
							<td><select id="unit_temp" class="iselect" name="unit_temp">
								<option value='0' selected='selected'><?php echo $TEXT['set-temp-celsius']?></option>
								<option value='1'><?php echo $TEXT['set-temp-fahrenheit']?></option>
							</select></td>
					</tr>
					
					<tr>
						<td><label for="unit_altitude"><?php echo $TEXT['set-unit-altitude']?></label></td>
							<td><select id="unit_altitude" class="iselect" name="unit_altitude">
								<option value='0' selected='selected'><?php echo $TEXT['set-altitude-meter']?></option>
								<option value='1'><?php echo $TEXT['set-altitude-feet']?></option>
							</select></td>
					</tr>
					
					<tr>
						<td><label for="unit_tpms"><?php echo $TEXT['set-unit-tpms']?></label></td>
							<td><select id="unit_tpms" class="iselect" name="unit_tpms">
								<option value='0' selected='selected'><?php echo $TEXT['set-tpms-bar']?></option>
								<option value='1'><?php echo $TEXT['set-tpms-kpa']?></option>
								<option value='2'><?php echo $TEXT['set-tpms-psi']?></option>
								<option value='3'><?php echo $TEXT['set-tpms-kg']?></option>
							</select></td>
					</tr>
					
					<tr>
						<td><label for="sond_alarm"><?php echo $TEXT['set-sound-alarm']?></label></td>
						<td><input id="sond_alarm" type="checkbox" class="icheck" name="sond_alarm" /></td>
					</tr>
					<tr>
						<td><label for="popup_alarm"><?php echo $TEXT['set-popup-alarm']?></label></td>
						<td><input id="popup_alarm" type="checkbox" class="icheck" name="popup_alarm" /></td>
					</tr>
					<tr>
						<td><label for="oldpwd"><?php echo $TEXT['info-oldpass']?></label></td>
						<td><input id="oldpwd" type="password" class="itext" name="oldpwd" maxlength="16" /></td>
					</tr>
					<tr>
						<td><label for="newpwd"><?php echo $TEXT['info-newpass']?></label></td>
						<td><input id="newpwd" type="password" class="itext" name="newpwd" maxlength="16" /></td>
					</tr>
					<tr>
						<td><label for="reppwd"><?php echo $TEXT['info-confrimpass']?></label></td>
						<td><input id="reppwd" type="password" class="itext" name="repwd" maxlength="16" /></td>
					</tr>
					<tr>
						<td colspan="2"><span id="errorpwd" class="error" style="dispaly: none;"></span></td>
					</tr>						
				</table>
			</div>
			<div id="setting-setting" ontouchmove="event.preventDefault();">
				<button type="button" class="icon-button" id="setting-btn">
				  <span></span><span><?php echo $TEXT['button-ok'] ?></span>
				</button>
			</div>
			<div id="setting-back" ontouchmove="event.preventDefault();">			
				<button type="button" class="icon-button" id="setting-back">
				  <span class="icon-button-back"></span><span><?php echo $TEXT['return-back'] ?></span>
				</button>
			</div>	
		</div>
	</div>
	
	<!--last photo-->
	<div id="dlg_lastphoto" class="dialog" style="width: 330px;">
        <div class="out">
            <div class="in">
                <h3 onmousedown="dragstart('dlg_lastphoto', event)"
                    onmousemove="dragmove(event)"><?php echo $TEXT['navi-lastphoto'] ?></h3>
                <p id="phototime"></p>
                <div id="lastphoto" style="min-width: 270px; height: 240px; max-width: 330px; margin: 0 auto" class="content">
                </div>
                <div class="footer">
                    <input id="button_ok" type="button" class="right small button blue" style="width: 60px; height: 24px;" value="<?php echo $TEXT['button-ok'] ?>"/>
                </div>
            </div>
        </div>
    </div>
	<!--last voice record-->
	<div id="dlg_lastvoice" class="dialog" style="width: 330px;">
        <div class="out">
            <div class="in">
                <h3 onmousedown="dragstart('dlg_lastvoice', event)"
                    onmousemove="dragmove(event)"><?php echo $TEXT['js-lastvoice'] ?></h3>
                <p id="voicetime"></p>
                <div id="lastvoice" style="min-width: 270px; height: 240px; max-width: 330px; margin: 0 auto" class="content">
                </div>
                <div class="footer">
                    <input id="button_ok" type="button" class="right small button blue" style="width: 60px; height: 24px;" value="<?php echo $TEXT['button-ok'] ?>"/>
                </div>
            </div>
        </div>
    </div>
	<!--Share Position
    <div id="dlg_shareposition" class="dialog" style="min-width: 330px; _width: 330px; max-width: 330px;">
        <div class="out">
            <div class="in">
                <h3 onmousedown="dragstart('dlg_shareposition', event)" onmousemove="dragmove(event)"><?php echo $TEXT['js-share-position'] ?></h3>
                <p><?php echo $TEXT['js-share-tips'] ?></p>
                <div class="content" style="min-height: 70px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                        <tr>
                            <td class="oneline">*<?php echo $TEXT['js-share-expired'] ?></td>
                            <td><input id="shareexpired" type="text" class="itext disablebox must" readonly="readonly" /></td>
                        </tr>
						<tr></tr>
						<tr id="urltr" style="display: none;">
                            <td class="oneline"><?php echo $TEXT['js-share-link'] ?></td>
                            <td><input id="shareurl" type="text" class="itext disablebox oneline" style="width: 330px;" readonly="readonly" /></td>
                        </tr>
                    </table>
                </div>
                <div class="footer">
                    <input style="display: none;" id="button_copy" type="button" class="right small button blue" style="margin-left: 5px;  height: 24px;" value="<?php echo $TEXT['js-copy'] ?>"/>
                    <input id="button_ok" type="button" class="right small button blue" style="height: 24px;" value="<?php echo $TEXT['button-ok'] ?>"/>
                </div>
            </div>
        </div>
    </div>-->
	<!--Share Position-->
    <div id="dlg_shareposition" class="dialog" style="min-width: 700px; _width: 700px;">
        <div class="out">
            <div class="in">
                <h3 onmousedown="dragstart('dlg_shareposition', event)" onmousemove="dragmove(event)"><?php echo $TEXT['js-share-position'] ?></h3>
                <div class="content" style="min-height: 300px;">
                    <div class="share_position_bar">
						<ul class="share_serach">
							<li class="tab">
								<select id="mgrshare_position_item" class="iselect">
									<option value='1' selected='selected'><?php echo $TEXT['js-share-position-name'] ?></option>
								</select>					
								<input id="mgrshare_position_cond" type="text" class="itext enablebox" maxlength="30" />
							</li>
							<li  class="tab"><input id="share_position_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>"/></li>
							<li  class="tab"><input id="share_position_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>"/></li>
						</ul>
					</div>
					<div class="share_position_area">
						<table id="share_position_list" class="tab_report">
							<thead>
								<tr>
									<th width="5%"><?php echo $TEXT['info-order']?></th>
									<th width="15%"><?php echo $TEXT['js-share-position-name']?></th>
									<th width="15%"><?php echo $TEXT['js-share-position-email']?></th>
									<th width="15%"><?php echo $TEXT['js-share-position-phone']?></th>
									<th width="5%"><?php echo $TEXT['js-share-position-assets']?></th>
									<th width="5%"><?php echo $TEXT['js-share-position-active']?></th>
									<th width="15%"><?php echo $TEXT['js-share-position-expire-on']?></th>
									<th width="8%"><?php echo $TEXT['info-operate']?></th>
								</tr>
							</thead>
						</table>
					</div>
                </div> 
				<div class="footer">
                    <input id="button_cancel" type="button" class="right small button" style="height: 24px;" value="<?php echo $TEXT['button-cancel'] ?>"/>
                </div>
            </div>
        </div>
    </div>
	<!--Share Position properties-->
    <div id="dlg_shareposition_properties" class="dialog" style="min-width: 600px; _width: 600px;">
        <div class="out">
            <div class="in">
                <h3 onmousedown="dragstart('dlg_shareposition_properties', event)" onmousemove="dragmove(event)"><?php echo $TEXT['js-share-position-properties'] ?></h3>
                <div class="content" style="min-height: 70px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                        <tr>
							<td colspan=5 style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['js-share-position']?></td>
						</tr>
						<tr>
							<td><?php echo $TEXT['js-share-position-active'] ?></td>
							<td><input id="share_position_active" type="checkbox" class="icheckbox"/></td>
							<td><?php echo $TEXT['js-share-position-expire-on'] ?></td>
							<td><input id="share_position_expire" type="checkbox" class="icheckbox"/></td>
							<td><input id="shareexpired" type="text" class="itime disablebox" readonly="readonly" /></td>	
						</tr>
						<tr>
							<td><?php echo $TEXT['js-share-position-name'] ?></td>
							<td><input id="share_position_name" type="text" class="itext enablebox must"/></td>
							<td><?php echo $TEXT['js-share-position-enable-delete'] ?></td>
							<td><input id="share_position_delete" type="checkbox" class="icheckbox"/></td>
						</tr>
						<tr>
                            <td><?php echo $TEXT['js-share-position-assets'] ?></td>
                            <td><select id="share_position_assets" class="iselect" multiple></select></td>
                        </tr>
						<tr>
                            <td><?php echo $TEXT['js-share-position-email'] ?></td>
                            <td><input id="share_position_email" type="text" class="itext enablebox must"/></td>
                        </tr>
						<tr>
                            <td><?php echo $TEXT['js-share-position-phone'] ?></td>
                            <td><input id="share_position_phone" type="text" class="itext enablebox must"/></td>
                        </tr>
						<tr>
							<td colspan=5 style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['js-share-tips']?></td>
						</tr>
						<tr>
							<td><?php echo $TEXT['js-share-position-send-email'] ?></td>
							<td><input id="share_position_send_email" type="checkbox" class="icheckbox"/></td>
						</tr>
						<tr>
							<td><?php echo $TEXT['js-share-position-send-sms'] ?></td>
							<td><input id="share_position_send_sms" type="checkbox" class="icheckbox"/></td>
						</tr>						
						<tr id="urltr">
                            <td><?php echo $TEXT['js-share-link'] ?></td>
                            <td colspan=4><input id="shareurl" type="text" class="itext disablebox" style="width: 600px;" readonly="readonly" /></td>
                        </tr>
                    </table>
                </div>
                <div class="footer">
                    <input id="button_copy" type="button" class="right small button" style="margin-left: 5px; height: 24px;" value="<?php echo $TEXT['js-copy'] ?>"/>                    
					<input id="button_cancel" type="button" class="right small button" style="margin-left: 5px; height: 24px;" value="<?php echo $TEXT['button-cancel'] ?>"/>
					<input id="button_ok" type="button" class="right small button" style="height: 24px;" value="<?php echo $TEXT['button-ok'] ?>"/>	
                </div>
            </div>
        </div>
    </div>
	
	<video id="player" style="display: none;" controls="controls" >
		<source src="../sound/BUZZ5.mp3"/>
	</video>
</body>
</html>

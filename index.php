<?php
header('Access-Control-Allow-Origin:*');
session_start();
if (!isset($_SESSION['logined']) or !$_SESSION['logined'] or !isset($_SESSION['uid']) or (int) $_SESSION['uid'] < 1 or isset($_SESSION['share']) or $_SESSION['share']) {
    session_unset();
    Header("Location: login.php");
    exit;
}
include_once('lang.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Access-Control-Allow-Origin" content="*" />
<title>CRT</title>
<link rel="Bookmark" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-fav-icon'];?>" />
<link rel="Shortcut Icon" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-fav-icon'];?>" />
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon.png">
<link type="text/css" rel="stylesheet" href="css/button.css"/>
<!-- <link type="text/css" rel="stylesheet" href="css/style.css?v=<?php echo $last_ver['style.css']?>"/> -->
<link type="text/css" rel="stylesheet" href="css/style.css"/>
<link type="text/css" rel="stylesheet" href="css/jquery-ui.css"/>
<link type="text/css" rel="stylesheet" href="css/jquery.multiselect.css" />
<link type="text/css" rel="stylesheet" href="map/leaflet/leaflet.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/MarkerCluster.css"/>
<!--<link type="text/css" rel="stylesheet" href="map/leaflet/MarkerCluster.Default.css"/>-->
<link type="text/css" rel="stylesheet" href="map/leaflet/clusterpies.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/leaflet-measure-path.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/Control.FullScreen.css"/>
<link type="text/css" rel="stylesheet" href="css/jquery-ui-timepicker-addon.css"/>
<link type="text/css" rel="stylesheet" href="css/toastr.min.css"/>
<link type="text/css" rel="stylesheet" href="css/jquery.contextMenu.min.css"/>
<link type="text/css" rel="stylesheet" href="css/iconselect.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/leaflet.measure.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/RoutingMachine/leaflet-routing-machine.css"/>
<link type="text/css" rel="stylesheet" href="css/sortable.min.css" />
<script type="text/javascript" src="js/jquery.min.js?v=<?php echo $last_ver['jquery.min.js']?>"></script>
<script type="text/javascript" src="js/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/jquery-dateFormat.min.js?>"></script>
<script type="text/javascript" src="js/jquery-ui-datepicker-min.js"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js"></script>
<script type="text/javascript" src="js/jquery.multiselect.js"></script>
<script type="text/javascript" src="js/common.js?v=<?php echo $last_ver['common.js']?>"></script>
<script type='text/javascript' src="js/jquery.contextMenu.min.js"></script>
<script type='text/javascript' src="js/iconselect.js"></script>
<script type='text/javascript' src="js/toastr.min.js"></script>
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
<script type="text/javascript" src="map/leaflet/leaflet-measure-path.js"></script>
<script type="text/javascript" src="map/leaflet/Leaflet.Editable.js"></script>
<script type="text/javascript" src="map/leaflet/Control.Geocoder.js"></script>
<script type="text/javascript" src="map/leaflet/Control.FullScreen.js"></script>
<script type="text/javascript" src="map/leaflet/tileLayer.baidu.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.measure.js"></script>
<script type="text/javascript" src="map/leaflet/RoutingMachine/leaflet-routing-machine.min.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.polylineDecorator.js"></script>
<script type="text/javascript" src="map/<?php echo $last_name['map.operat.js']?>?v=<?php echo $last_ver['map.operat.js']?>"></script>
<script type="text/javascript" src="map/<?php echo $last_name['map.leaflet.js']?>?v=<?php echo $last_ver['map.leaflet.js']?>"></script>
<script type='text/javascript' src="js/sortable.min.js"></script>


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
<script type="text/javascript" src="js/gauge.min.js"></script>
<script type="text/javascript" src="js/highstock.js"></script>
<script type="text/javascript" src="js/exporting.js"></script>
<script type="text/javascript" src="js/highcharts-more.js"></script>
<script type="text/javascript" src="js/<?php echo $last_name['devicelist.js']?>?v=<?php echo $last_ver['devicelist.js']?>"></script>
<script type="text/javascript" src="js/<?php echo $last_name['index.js']?>?v=<?php echo $last_ver['index.js']?>"></script>

<script type='text/javascript'>
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
JS_DEVICE_ID4IO = [];
JS_DEVICE_TYPE4ID = [];
JS_DEVICE_ID4GROUPID = [];
JS_PLACE_NAME4ID = [];
JS_PLACE_ID4NAME = [];
JS_GROUP = [];
JS_GROUP4NAME = [];
JS_DEVICE_NO4ID = [];
JS_DEVICE_SIM4ID = [];
JSDEVICE_DRIVER4ID = [];
JS_OBJECT_KIND=<?php echo $_SESSION['object_kind'] ?>;
JS_P_UID = "<?php echo $_SESSION['p_uid'] ?>";
JS_SPEED_HOUR = "<?php echo $TEXT['js-speedhour'] ?>";
JS_OVER_SPEED = "<?php echo $TEXT['js-overspeed'] ?>";
JS_HIGH_SPEED = "<?php echo $TEXT['js-highspeed'] ?>";
JS_UNREPORTED = "<?php echo $TEXT['js-unreported'] ?>";
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
JS_WEEK=["<?php echo $TEXT['js-week-sun'] ?>",
    "<?php echo $TEXT['js-week-mon'] ?>",
    "<?php echo $TEXT['js-week-tue'] ?>",
    "<?php echo $TEXT['js-week-wed'] ?>",
    "<?php echo $TEXT['js-week-thu'] ?>",
    "<?php echo $TEXT['js-week-fir'] ?>",
    "<?php echo $TEXT['js-week-sat'] ?>"];
JS_TODAY="<?php echo $TEXT['js-today'] ?>";
JS_MONTH="<?php echo $TEXT['js-month'] ?>";
JS_HOUR="<?php echo $TEXT['js-hour'] ?>";
JS_MINUTE="<?php echo $TEXT['js-minute'] ?>";
JS_LAST_MONTH="<?php echo $TEXT['js-prior-month'] ?>";
JS_NEXT_MONTH="<?php echo $TEXT['js-next-month'] ?>";
JS_SEL_YEAR="<?php echo $TEXT['js-select-year'] ?>";
JS_SEL_MONTH="<?php echo $TEXT['js-select-month'] ?>";
JS_LOCATE_TIP="<?php echo $TEXT['js-locate-tip'] ?>";
JS_TIP_TIME="<?php echo $TEXT['js-tip-locatetime'] ?>";
JS_TIP_STATE="<?php echo $TEXT['js-tip-speedstate'] ?>";
JS_TIP_ADDR="<?php echo $TEXT['js-tip-location'] ?>";
JS_TIP_OBJ_STATE="<?php echo $TEXT['navi-objstate'] ?>";
JS_TIP_OBJ_ALL="<?php echo $TEXT['navi-taball'] ?>";
JS_TIP_OBJ_ONLINE="<?php echo $TEXT['navi-tabonline'] ?>";
JS_TIP_OBJ_OFFLINE="<?php echo $TEXT['navi-tabinactive'] ?>";
JS_TIP_OBJ_ALARM="<?php echo $TEXT['navi-tabalarm'] ?>";
JS_TIP_OBJ_EXPIRED="<?php echo $TEXT['navi-tabexpired'] ?>";
JS_CURRENT_LANG="<?php echo $_SESSION['lang']?>";
JS_FULL_SCREEN="<?php echo $TEXT['js-full-screen']?>";
JS_NAVIGATION_START="<?php echo $TEXT['js-navigation-start']?>";
JS_NAVIGATION_END="<?php echo $TEXT['js-navigation-end']?>";
JS_DEFAULT_LNG=<?php echo $_SESSION['lng'] ?>;
JS_DEFAULT_LAT=<?php echo $_SESSION['lat'] ?>;
JS_DEFAULT_ZOOM=<?php echo $_SESSION['zoom'] ?>;
JS_DEFAULT_PAGE=<?php echo $_SESSION['page'] ?>;
JS_DEFAULT_FIT=<?php echo $_SESSION['fit'] ?>;
JS_DEFAULT_COLLAPSED=<?php echo $_SESSION['collapsed'] ?>;
JS_DEFAULT_ASSET_INFOS="<?php echo $_SESSION['assetInfos'] ?>";
JS_DEFAULT_SHOW=<?php echo $_SESSION['show'] ?>;
JS_DEFAULT_ZONE=<?php echo $_SESSION['zone'] ?>;
JS_DEFAULT_MARKER=<?php echo $_SESSION['marker'] ?>;
JS_DEFAULT_DATETIME_fmt_JS="<?php echo $_SESSION['datetime_fmt_js']?>";
JS_DEFAULT_DATE_FMT="<?php echo $_SESSION['date_fmt_js']?>";
JS_DEFAULT_SOUND_ALARM = "<?php echo $_SESSION['sond_alarm']?>";
JS_DEFAULT_POPUP_ALARM = "<?php echo $_SESSION['popup_alarm']?>";
JS_UNIT_DISTANCE = "<?php echo $_SESSION['unit_distance']?>";         //0:Kilometer(公里) 1:Mile(英里) 2:Nautical mile(海里)
JS_UNIT_FUEL = "<?php echo $_SESSION['unit_fuel']?>";                 //0:Liter(升) 1:Gallon(加仑)
JS_UNIT_TEMPERATURE = "<?php echo $_SESSION['unit_temperature']?>";   //0:Celsius  1:Fahrenheit
JS_UNIT_SPEED = "<?php echo $_SESSION['unit_speed']?>";               //0:kph(公里/小时) 1:mph(英里/小时)
JS_UNIT_ALTITUDE = "<?php echo $_SESSION['unit_altitude']?>";         //0:meter 1:feet
JS_UNIT_HUMIDITY = 0;
JS_UNIT_TPMS = "<?php echo $_SESSION['unit_tpms']?>";                 //0: bar 1:kpa 2:psi 3:kg/cm2
JS_CMD_TRACKBY="<?php echo $TEXT['navi-tracknewwindow'] ?>";
JS_CMD_OBJINFO="<?php echo $TEXT['navi-objectinfo'] ?>";
JS_CMD_ALTINFO="<?php echo $TEXT['navi-alarminfo'] ?>";
JS_CMD_SENDCMD="<?php echo $TEXT['navi-sendcmd'] ?>";
JS_CMD_SEND_SUCC = "<?php echo $TEXT['status-sendsuccess']?>";
JS_GLOBAL_TIPS = "<?php echo $TEXT['global-loading']?>";
JS_SPEED="<?php echo $TEXT['navi-speed']?>";
JS_TIMEOUT_MINS = "<?php echo $TEXT['timeout-item-mins']?>";
JS_TIMEOUT_HOUR = "<?php echo $TEXT['timeout-item-hour']?>";
JS_TIMEOUT_DAY = "<?php echo $TEXT['timeout-item-day']?>";
JS_TIMEOUT_WEEK = "<?php echo $TEXT['timeout-item-week']?>";
JS_TIMEOUT_MON = "<?php echo $TEXT['timeout-item-mon']?>";
JS_TIMEOUT_YEAR = "<?php echo $TEXT['timeout-item-year']?>";
JS_TIMEOUT_INVALID = "<?php echo $TEXT['timeout-item-invalid']?>";
JS_EXPIRED = "<?php echo $TEXT['js-expired']?>";
JS_ENGINE = "<?php echo $TEXT['js-engine']?>";
JS_ON = "<?php echo $TEXT['js-on']?>";
JS_OFF = "<?php echo $TEXT['js-off']?>";
JS_ENGINE_ON= "<?php echo $TEXT['js-engine-on']?>";
JS_ENGINE_OFF = "<?php echo $TEXT['js-engine-off']?>";
JS_TEMP_UNIT = "<?php echo $TEXT['js-temp_unit']?>";
JS_NO_DRIVER = "<?php echo $TEXT['js-no_driver']?>";
JS_NO_NEED_PARAM = "<?php echo $TEXT['js-noneedparam']?>";
JS_SELECT_ONE_CMD = "<?php echo $TEXT['js-selectonecmd']?>";
JS_LAST_PHOTO = "<?php echo $TEXT['navi-lastphoto']?>";
JS_NO_PHOTO = "<?php echo $TEXT['js-nophoto']?>";
JS_LAST_VOICE = "<?php echo $TEXT['js-lastvoice']?>";
JS_SHARE_POSITION = "<?php echo $TEXT['js-share-position']?>";
JS_SHARE_FAIL = "<?php echo $TEXT['js-share-fail']?>";
JS_SHARE_COPY_SUCCESS = "<?php echo $TEXT['js-share-copy-successful']?>";
JS_NO_VOICE = "<?php echo $TEXT['js-novoice']?>";
JS_NO_TASK= "<?php echo $TEXT['info-task-no-task']?>";
JS_RANGE_ERROR = "<?php echo $TEXT['js-rangeerror']?>";
JS_LENGTH_ERROR = "<?php echo $TEXT['js-lengtherror']?>";
JS_TEMP = "<?php echo $TEXT['info-temperature']?>";
JS_BAT = "<?php echo $TEXT['info-battery']?>";
JS_WEIGHT = "<?php echo $TEXT['info-weight']?>";
JS_RECENT_EVENTS = "<?php echo $TEXT['info-recent-events']?>";
JS_RECENT_MILEAGE = "<?php echo $TEXT['info-recent-mileage']?>";
JS_RECENT_ENGINE = "<?php echo $TEXT['info-recent-engine']?>";
JS_RECENT_LOAD = "<?php echo $TEXT['info-recent-load']?>";
JS_RECENT_SPEEDOMETER = "<?php echo $TEXT['info-recent-speedometer']?>";
JS_RECENT_TIRESENSOR = "<?php echo $TEXT['info-recent-tiresensor']?>";
JS_TIRE_PRESSURE = "<?php echo $TEXT['info-tire-pressure']?>";
JS_RECENT_DRIVER = "<?php echo $TEXT['info-recent-driver']?>";
JS_RECENT_TASK = "<?php echo $TEXT['info-recent-task']?>";
JS_RECENT_MAINTAINANCE = "<?php echo $TEXT['info-recent-maintainance']?>";
JS_SHARE_POSITION_SELECT_ASSETS =  "<?php echo $TEXT['js-share-position-select-assets']?>"; 
JS_SELECTED = "<?php echo $TEXT['info-selected']?>";
JS_SELECT_ALL = "<?php echo $TEXT['info-select-all']?>";
JS_UNSELECT_ALL = "<?php echo $TEXT['info-unselect-all']?>";
JS_LEFT = "<?php echo $TEXT['info-left']?>";
JS_NO_DATA = "<?php echo $TEXT['info-no-data']?>";
JS_NO_COMMAND = "<?php echo $TEXT['js-nocommand']?>";
JS_GPS_VALID = "<?php echo $TEXT['js-gpsvalid']?>";
JS_LBS_VALID = "<?php echo $TEXT['js-lbsvalid']?>";
JS_LOCATION_INVALID = "<?php echo $TEXT['js-location-invalid']?>";
JS_ALARM_INFO = "<?php echo $TEXT['js-alarm-info']?>";
JS_TASK_NEW_INFO = "<?php echo $TEXT['4026']?>";
JS_TASK_PROCESSING_INFO = "<?php echo $TEXT['4027']?>";
JS_TASK_FINISH = "<?php echo $TEXT['4028']?>";
JS_TASK_FAIL = "<?php echo $TEXT['4029']?>";
JS_ASSET_CONTROL = "<?php echo $TEXT['js-asset-control']?>";
JS_RELEASE_TRACK = "<?php echo $TEXT['js-release-track']?>";
JS_GLOBAL_COPYRIGHT = "<?php echo $TEXT['global-copyright']?>";
JS_DATEPICKER_CLOSETEXT = "<?php echo $TEXT['js-datepicker-closetext']?>";
JS_DATEPICKER_PREVTEXT = "<?php echo $TEXT['js-datepicker-prevtext']?>";
JS_DATEPICKER_NEXTTEXT = "<?php echo $TEXT['js-datepicker-nexttext']?>";
JS_DATEPICKER_CURRENTTEXT = "<?php echo $TEXT['js-datepicker-currenttext']?>";
JS_DATEPICKER_MONTHNAMES1 = "<?php echo $TEXT['js-datepicker-monthnames1']?>";
JS_DATEPICKER_MONTHNAMES2 = "<?php echo $TEXT['js-datepicker-monthnames2']?>";
JS_DATEPICKER_MONTHNAMES3 = "<?php echo $TEXT['js-datepicker-monthnames3']?>";
JS_DATEPICKER_MONTHNAMES4 = "<?php echo $TEXT['js-datepicker-monthnames4']?>";
JS_DATEPICKER_MONTHNAMES5 = "<?php echo $TEXT['js-datepicker-monthnames5']?>";
JS_DATEPICKER_MONTHNAMES6 = "<?php echo $TEXT['js-datepicker-monthnames6']?>";
JS_DATEPICKER_MONTHNAMES7 = "<?php echo $TEXT['js-datepicker-monthnames7']?>";
JS_DATEPICKER_MONTHNAMES8 = "<?php echo $TEXT['js-datepicker-monthnames8']?>";
JS_DATEPICKER_MONTHNAMES9 = "<?php echo $TEXT['js-datepicker-monthnames9']?>";
JS_DATEPICKER_MONTHNAMES10 = "<?php echo $TEXT['js-datepicker-monthnames10']?>";
JS_DATEPICKER_MONTHNAMES11 = "<?php echo $TEXT['js-datepicker-monthnames11']?>";
JS_DATEPICKER_MONTHNAMES12 = "<?php echo $TEXT['js-datepicker-monthnames12']?>";
JS_DATEPICKER_MONTHNAMESSHORT1 = "<?php echo $TEXT['js-datepicker-monthnamesshort1']?>";
JS_DATEPICKER_MONTHNAMESSHORT2 = "<?php echo $TEXT['js-datepicker-monthnamesshort2']?>";
JS_DATEPICKER_MONTHNAMESSHORT3 = "<?php echo $TEXT['js-datepicker-monthnamesshort3']?>";
JS_DATEPICKER_MONTHNAMESSHORT4 = "<?php echo $TEXT['js-datepicker-monthnamesshort4']?>";
JS_DATEPICKER_MONTHNAMESSHORT5 = "<?php echo $TEXT['js-datepicker-monthnamesshort5']?>";
JS_DATEPICKER_MONTHNAMESSHORT6 = "<?php echo $TEXT['js-datepicker-monthnamesshort6']?>";
JS_DATEPICKER_MONTHNAMESSHORT7 = "<?php echo $TEXT['js-datepicker-monthnamesshort7']?>";
JS_DATEPICKER_MONTHNAMESSHORT8 = "<?php echo $TEXT['js-datepicker-monthnamesshort8']?>";
JS_DATEPICKER_MONTHNAMESSHORT9 = "<?php echo $TEXT['js-datepicker-monthnamesshort9']?>";
JS_DATEPICKER_MONTHNAMESSHORT10 = "<?php echo $TEXT['js-datepicker-monthnamesshort10']?>";
JS_DATEPICKER_MONTHNAMESSHORT11 = "<?php echo $TEXT['js-datepicker-monthnamesshort11']?>";
JS_DATEPICKER_MONTHNAMESSHORT12 = "<?php echo $TEXT['js-datepicker-monthnamesshort12']?>";
JS_DATEPICKER_DAYNAMES1 = "<?php echo $TEXT['js-datepicker-daynames1']?>";
JS_DATEPICKER_DAYNAMES2 = "<?php echo $TEXT['js-datepicker-daynames2']?>";
JS_DATEPICKER_DAYNAMES3 = "<?php echo $TEXT['js-datepicker-daynames3']?>";
JS_DATEPICKER_DAYNAMES4 = "<?php echo $TEXT['js-datepicker-daynames4']?>";
JS_DATEPICKER_DAYNAMES5 = "<?php echo $TEXT['js-datepicker-daynames5']?>";
JS_DATEPICKER_DAYNAMES6 = "<?php echo $TEXT['js-datepicker-daynames6']?>";
JS_DATEPICKER_DAYNAMES7 = "<?php echo $TEXT['js-datepicker-daynames7']?>";
JS_DATEPICKER_DAYNAMESSHORT1 = "<?php echo $TEXT['js-datepicker-daynamesshort1']?>";
JS_DATEPICKER_DAYNAMESSHORT2 = "<?php echo $TEXT['js-datepicker-daynamesshort2']?>";
JS_DATEPICKER_DAYNAMESSHORT3 = "<?php echo $TEXT['js-datepicker-daynamesshort3']?>";
JS_DATEPICKER_DAYNAMESSHORT4 = "<?php echo $TEXT['js-datepicker-daynamesshort4']?>";
JS_DATEPICKER_DAYNAMESSHORT5 = "<?php echo $TEXT['js-datepicker-daynamesshort5']?>";
JS_DATEPICKER_DAYNAMESSHORT6 = "<?php echo $TEXT['js-datepicker-daynamesshort6']?>";
JS_DATEPICKER_DAYNAMESSHORT7 = "<?php echo $TEXT['js-datepicker-daynamesshort7']?>";
JS_DATEPICKER_DAYNAMESMIN1 = "<?php echo $TEXT['js-datepicker-daynamesmin1']?>";
JS_DATEPICKER_DAYNAMESMIN2 = "<?php echo $TEXT['js-datepicker-daynamesmin2']?>";
JS_DATEPICKER_DAYNAMESMIN3 = "<?php echo $TEXT['js-datepicker-daynamesmin3']?>";
JS_DATEPICKER_DAYNAMESMIN4 = "<?php echo $TEXT['js-datepicker-daynamesmin4']?>";
JS_DATEPICKER_DAYNAMESMIN5 = "<?php echo $TEXT['js-datepicker-daynamesmin5']?>";
JS_DATEPICKER_DAYNAMESMIN6 = "<?php echo $TEXT['js-datepicker-daynamesmin6']?>";
JS_DATEPICKER_DAYNAMESMIN7 = "<?php echo $TEXT['js-datepicker-daynamesmin7']?>";
JS_DATEPICKER_WEEKHEADER = "<?php echo $TEXT['js-datepicker-weekheader']?>";
JS_DATEPICKER_DATEFORMAT = "<?php echo $TEXT['js-datepicker-dateformat']?>";
JS_DATEPICKER_FIRSTDAY = "<?php echo $TEXT['js-datepicker-firstday']?>";
JS_DATEPICKER_YEARSUFFIX = "<?php echo $TEXT['js-datepicker-yearsuffix']?>";
JS_TIMEPICKER_TIMEONLYTITLE = "<?php echo $TEXT['js-timepicker-timeonlytitle']?>";
JS_TIMEPICKER_TIMETEXT = "<?php echo $TEXT['js-timepicker-timetext']?>";
JS_TIMEPICKER_HOURTEXT = "<?php echo $TEXT['js-timepicker-hourtext']?>";
JS_TIMEPICKER_MINUTETEXT = "<?php echo $TEXT['js-timepicker-minutetext']?>";
JS_TIMEPICKER_SECONDTEXT = "<?php echo $TEXT['js-timepicker-secondtext']?>";
JS_TIMEPICKER_MILLISECTEXT = "<?php echo $TEXT['js-timepicker-millisectext']?>";
JS_TIMEPICKER_TIMEZONETEXT = "<?php echo $TEXT['js-timepicker-timezonetext']?>";
JS_TIMEPICKER_CURRENTTEXT = "<?php echo $TEXT['js-timepicker-currenttext']?>";
JS_TIMEPICKER_CLOSETEXT = "<?php echo $TEXT['js-timepicker-closetext']?>";
JS_GENERAL_STATUS = "<?php echo $TEXT['navi-generalstatus']?>";
JS_ASSET_NAME = "<?php echo $TEXT['info-objectflag']?>";
JS_DEVICE_ID = "<?php echo $TEXT['info-deviceid']?>";
JS_SIMCARD_NO = "<?php echo $TEXT['info-simcard']?>";
JS_GROUP_NAME = "<?php echo $TEXT['info-groupname']?>";
JS_POSITION = "<?php echo $TEXT['navi-position']?>";
JS_RACE_INFO = "<?php echo $TEXT['info-race-info']?>";
JS_SPEED = "<?php echo $TEXT['navi-speed']?>";
JS_HEADING = "<?php echo $TEXT['info-heading']?>";
JS_ALTITUDE = "<?php echo $TEXT['navi-altitudechart']?>";
JS_FUEL = "<?php echo $TEXT['info-fuel'] ?>";
JS_MAX_SPEED_24H = "<?php echo $TEXT['info-max-speed-24h'] ?>";
JS_ODOMETER_24H = "<?php echo $TEXT['info-odometer-24h'] ?>";
JS_DOOR_OPEN = "<?php echo $TEXT['info-door-open'] ?>";
JS_DOOR_CLOSE = "<?php echo $TEXT['info-door-close'] ?>";
JS_BUTTON_DOWNLOAD = "<?php echo$TEXT['button-download']?>";
JS_DOWNLOADING_FONT = "<?php echo$TEXT['js-downloading-font']?>";
JS_INFO_MOVING_TIME_24H = "<?php echo $TEXT['info-moving-time-24h'] ?>";
JS_INFO_IDLE_TIME_24H = "<?php echo $TEXT['info-idle-time-24h'] ?>";
JS_INFO_STOP_TIME_24H = "<?php echo $TEXT['info-stop-time-24h'] ?>";
JS_INFO_ENGINE_TIME_24H = "<?php echo $TEXT['info-engine-time-24h'] ?>";
JS_INFO_CURRENT_TIME = "<?php echo $TEXT['info-current-time'] ?>";
JS_INFO_LAST_ENGINE_ON = "<?php echo $TEXT['info-last-engine-on'] ?>";
JS_INFO_LAST_ENGINE_OFF = "<?php echo $TEXT['info-last-engine-off'] ?>";
JS_PLAY_TITLE = "<?php echo $TEXT['navi-playback']?>";
JS_STATUS_NODATA = "<?php echo $TEXT['status-nodata']?>";
JS_START_POINT = "<?php echo $TEXT['navi-start-point']?>";
JS_END_POINT = "<?php echo $TEXT['navi-end-point']?>";
JS_STOP = "<?php echo $TEXT['navi-stop']?>";
JS_START = "<?php echo $TEXT['navi-start']?>";
JS_END = "<?php echo $TEXT['navi-end']?>";
JS_DURATION = "<?php echo $TEXT['navi-duration']?>";
JS_DOOR_STATE = "<?php echo $TEXT['asset-infos-door-status'] ?>";
JS_DRIVER_NAME = "<?php echo $TEXT['info-driver'] ?>";
JS_ADDRESS =  "<?php echo $TEXT['js-address'] ?>";
JS_GPS_TIME = "<?php echo $TEXT['info-gpstime']?>";
JS_SERVER_TIME = "<?php echo $TEXT['info-revtime']?>";
JS_SHORTCUT_COMMAND = "<?php echo $TEXT['info-shortcut-command']?>";
JS_CMD_ENABLE_IMMOBILIZER = "<?php echo $TEXT['info-cmd-enable-immobilizer']?>";
JS_CMD_DISABLE_IMMOBILIZER = "<?php echo $TEXT['info-cmd-disable-immobilizer']?>";
JS_CMD_ARM = "<?php echo $TEXT['info-cmd-arm']?>";
JS_CMD_DISARM = "<?php echo $TEXT['info-cmd-disarm']?>";
JS_CMD_LOCK_DOOR = "<?php echo $TEXT['info-cmd-lock-door']?>";
JS_CMD_UNLOCK_DOOR = "<?php echo $TEXT['info-cmd-unlock-door']?>";
JS_ODOMETER = "<?php echo $TEXT['info-obd-mileage']?>";
JS_GPS_SIGNAL = "<?php echo $TEXT['js-gps-signal']?>";
JS_GSM_SIGNAL = "<?php echo $TEXT['js-gsm-signal']?>";
JS_PASSENGER = "<?php echo $TEXT['info-passenger-count']?>";
JS_OBJECTS = "<?php echo $TEXT['js-objects']?>";
JS_MILEAGE = "<?php echo $TEXT['info-mileage']?>";
JS_LAST24H_MILEAGE = "<?php echo $TEXT['js-last24h-mileage']?>";
JS_LAST24H_ENGINE = "<?php echo $TEXT['js-last24h-engine']?>";
JS_LAST24H_IDLE = "<?php echo $TEXT['js-last24h-idle']?>";
JS_LAST24H_MOVING = "<?php echo $TEXT['js-last24h-moving']?>";
JS_PARKING = "<?php echo $TEXT['js-parking']?>";
JS_TOTAL_DISTANCE = "<?php echo $TEXT['js-total-distance']?>";
JS_TOTAL_AREA = "<?php echo $TEXT['js-total-area']?>";
JS_ENABLE_DISABLE_ASSET = "<?php echo $TEXT['js-enable-disable-asset']?>";
JS_FIT_ASSETS = "<?php echo $TEXT['js-fit-assets']?>";
JS_ENABLE_DISABLE_LABEL = "<?php echo $TEXT['js-enable-disable-label']?>";
JS_ENABLE_DISABLE_MARKER = "<?php echo $TEXT['js-enable-disable-marker']?>";
JS_ENABLE_DISABLE_ZONES = "<?php echo $TEXT['js-enable-disable-zones']?>";
JS_ENABLE_DISABLE_CLUSTERS = "<?php echo $TEXT['js-enable-disable-clusters']?>";
JS_ENABLE_DISABLE_MEASURE = "<?php echo $TEXT['js-enable-disable-measure']?>";
JS_ENABLE_DISABLE_RULER = "<?php echo $TEXT['js-enable-disable-ruler']?>";
JS_ENABLE_DISABLE_NAVIGATION = "<?php echo $TEXT['js-enable-disable-navigation']?>";
JS_ENABLE_DISABLE_STREETVIEW = "<?php echo $TEXT['js-enable-disable-streetview']?>";
JS_DISABLE_TASK = "<?php echo $TEXT['js-enable-disable-task']?>";
JS_TASK_INFO = "<?php echo $TEXT['info-taskinfo']?>";
JS_DISABLE_TASK_SUCC = "<?php echo $TEXT['info-task-disable-succ']?>";
JS_DISABLE_TASK_FAIL = "<?php echo $TEXT['info-task-disable-fail']?>";
JS_ENABLE_DISABLE_DRIVER = "<?php echo $TEXT['js-enable-disable-driver']?>";
JS_NO_PERMISSION = "<?php echo $TEXT['status-nopermission']?>";
JS_DEVICE_INFO = "<?php echo $TEXT['info-objectinfo']?>";
JS_DELETE_SUCC = "<?php echo $TEXT['status-delsuccess']?>";
JS_DELETE_FAIL = "<?php echo $TEXT['status-delfail']?>";
JS_SAVE_SUCC = "<?php echo $TEXT['status-savesuccess']?>";
JS_UPDATE_SUCC = "<?php echo $TEXT['status-updatesuccess']?>";
JS_UPDATE_FAIL = "<?php echo $TEXT['status-updatefail']?>";
JS_ERROR_TIP = "<?php echo $TEXT['status-errortip']?>";
JS_REQUEST_INFO = "<?php echo $TEXT['info-requestinfo']?>";
JS_REQUEST_TIMEOUT = "<?php echo $TEXT['status-timeout']?>";
JS_SHOW = "<?php echo $TEXT['info-show']?>";
JS_TRACK = "<?php echo $TEXT['info-track']?>";
JS_SHOW_ALL = "<?php echo $TEXT['info-show-all']?>";
JS_TRACK_ALL = "<?php echo $TEXT['info-track-all']?>";
JS_TASK_START = "<?php echo $TEXT['info-task-start-place']?>";
JS_TASK_END = "<?php echo $TEXT['info-task-end-place']?>";
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
<script type="text/javascript" src="js/jquery-ui-datepicker-lang.js" charset="gb2312"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-lang.js" charset="gb2312"></script>
<script type="text/javascript">
	$(function(){
		$(document).bind("click",function(e){
			var target = $(e.target);
			if(target.closest(".mnuOperat").length == 0 && target.closest("td[mu='1']").length == 0){
				$(".mnuOperat").hide();
			}
		})
	})
	
	// 去掉所有input的autocomplete, 显示指定的除外 
	$(function(){ 								  
	   $('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off'); 	 
	}); 
	
</script>
<style type="text/css">
	
.ilabel { margin: 2px; width: 200px; height: 20px; border: 1px solid #fff; font-size: 12px; line-height: 20px; }
.itext { margin: 2px; width: 170px; height: 20px; font-size: 12px; line-height: 20px; font-weight: normal; }
.iselect { margin: 1px 2px 1px 4px; width: 180px; height: 24px; line-height:24px; font-size: 12px; font-weight: normal; -webkit-appearance: menulist-button;}
.icontent { margin: 1px 2px; width: 350px; height: 50px; font-size: 12px; line-height: 20px; font-weight: normal; overflow-y: auto;}
.icheck { margin: 2px; height: 20px; font-size: 12px; line-height: 20px; font-weight: normal; }
.itime { background: #fff url(img/date.png) no-repeat right center; height: 20px; background-size: 16px 16px; }
.enablebox { border: 1px solid #666; color: #000; }
.disablebox { border: 1px solid #999; color: #999; }
.invalidbox { border: 1px solid #f00; color: #333; }
.valid { background: transparent url(img/user_online.png) no-repeat 8px center; }
.noedit { color: #999; }
.tipscontent { color: #999; font-weight: bold}
.line { font-size: 0; width: 1px; height: 12px; color: #fff; background: #fff; margin-top: 5px }
#value { margin: 5px; }
#cmderror { margin: 5px; }
.oddcolor { background-color: #F5F5F5; }
.tab_status { width: 100%; border-collapse: collapse; overflow-y: scroll; }
.tab_status td:not(.scmd):not(.speedometer):not(.lastEvent):not(.lastMa):not(.lastTa) { border: 0px solid #D5D5D5; font-size:100%; padding: 4px 4px; min-width: 100px; height: 15px;}
.tab_status a:link { font-size: 12px; color: #4D8ED9; text-decoration: none; }   
.tab_status a:visited { font-size: 12px; color: #4D8ED9; text-decoration: none; }   
.tab_status a:hover { font-size: 12px; color: #4D8ED9; text-decoration: none; } 

.tab_report { width: 100%; border-collapse: collapse; overflow: hidden; }
.tab_report a { padding: 2px 4px; }
.tab_report th { border-left: 1px solid #ccc; border-bottom: 1px solid #ccc; background-color:#D5D5D5; font-size:12px; line-height:120%; font-weight:bold; padding:4px; text-align:center; position: sticky; top: 0; z-index: 1; }
.tab_report td { border: 1px solid #D5D5D5; font-size:12px; padding: 3px; white-space:nowrap; text-align:center; }
.tab_report tr.selected { background: #CAE8EA; color: #333; font-weight: normal; }
.tab_report tr.selected a{ color: #fff; }


</style>
</head>
<body onload="oninit();" onunload="onfree();" onContextMenu="return true">
    <div id="header">
        <h1><a href="#"><img width="100%" style="margin:5px 5px " src="<?php echo $TEXT['link-partner-site']; ?>img/logo_main.png"/></a></h1>
        <div id="nav">
            <ul>
                <b>
                    <li><a href="#" onclick="showPage(this, 'monitor');" id="nav_current"><?php echo $TEXT['navi-monitor'] ?></a></li>
                    <li><a class="playback" href="#" onclick="showPage(this, 'playback');"><?php echo $TEXT['navi-playback'] ?></a></li>
                    <li><a href="#" onclick="showPage(this, 'stastics');"><?php echo $TEXT['navi-stastics'] ?></a></li>
                    <li><a href="#" onclick="showPage(this, 'manage');"><?php echo $TEXT['navi-manage'] ?></a></li>
                    <li><a href="#" onclick="showPage(this, 'setting');"><?php echo $TEXT['navi-setting'] ?></a></li>
                </b>
            </ul>
        </div>
		<div id="useinfo">
            <ul>
                <li id="user"><a href="#" onclick="showUseInfo();"><?php echo $_SESSION['uname'] ?></a></li>
				<li><div class="line"></div></li>
				<li id="share"><a href="#" onclick="loadSharePosition();"><?php echo $TEXT['js-share-position'] ?></a></li>
                <li><div class="line"></div></li>
                <li id="alarm_msg"><a href="#"><?php echo $TEXT['navi-tabalarm'] ?></a></li>
                <li><div class="line"></div></li>
				<li id="mobile_version"><a href="mobile/mindex.php"><?php echo $TEXT['navi-mobile'] ?></a></li>
				<li id="return_line"><div class="line"></div></li>
                <li id="user_return"><a onclick="returnUser();"><?php echo $TEXT['button-login-return'] ?></a></li>
				<li><div class="line"></div></li>
                <li id="user_exit"><a href="exit.php" onclick="clearTimeout(timer);"><?php echo $TEXT['navi-exit'] ?></a></li>
            </ul>
        </div>
    </div>
    <div id="container">
        <div id="sch">
			<select id="asset_list_item" class="iselect">
				<option value='1' selected='selected'><?php echo $TEXT['info-objectflag'] ?></option>
				<option value='2'><?php echo $TEXT['info-deviceid'] ?></option>
				<option value='3'><?php echo $TEXT['info-simcard'] ?></option>
				<!--<option value='4'><?php echo $TEXT['info-driver'] ?></option>-->
				<option value='5'><?php echo $TEXT['info-groupname'] ?></option>
			</select>
			<input id="device" type="text" maxlength="30" placeholder="<?php echo $TEXT['info-objectflag'] ?>"/>
			<input  class="small button-search" style="color:white;" id="selone" type="button" value="<?php echo $TEXT['button-search'] ?>" /> 
			<button class="small button" id="showobjchart" title="<?php echo $TEXT['navi-objstatechartinfo'] ?>"><span class="dashboard"></span></button>					
        </div>
        <div id="mod">
    <ul class="tabbar">
        <li target="#tab_all" class="tab_active"><b><a href="#" title="<?php echo $TEXT['navi-taball'] ?>"></b></a></li>
        <li target="#tab_online"><b><a href="#" title="<?php echo $TEXT['navi-tabonline'] ?>"></b></a></li>
        <li target="#tab_offline"><b><a href="#" title="<?php echo $TEXT['navi-tabinactive'] ?>"></b></a></li>
        <li target="#tab_expired"><b><a href="#" title="<?php echo $TEXT['navi-tabexpired'] ?>"></b></a></li>
    </ul>
    <div class="tablist" style="margin-top: 15px;"> <!-- Adjust margin-top as needed -->
        <div id="tab_all" class="tab_content">
            <table id="tree_all" class="tree_table" border="0" cellpadding="0" cellspacing="0" width="323">
                <thead>
                    <!-- Content for tab_all -->
                </thead>
            </table>
        </div>
        <div id="tab_online" class="tab_content">
            <table id="tree_online" class="tree_table" border="0" cellpadding="0" cellspacing="0" width="323">
                <thead>
                    <!-- Content for tab_online -->
                </thead>
            </table>
        </div>
        <div id="tab_offline" class="tab_content">
            <table id="tree_offline" class="tree_table" border="0" cellpadding="0" cellspacing="0" width="323">
                <thead>
                    <!-- Content for tab_offline -->
                </thead>
            </table>
        </div>
        <div id="tab_expired" class="tab_content">
            <table id="tree_expired" class="tree_table" border="0" cellpadding="0" cellspacing="0" width="323">
                <thead>
                    <!-- Content for tab_expired -->
                </thead>
            </table>
        </div>
    </div>
</div>

        <div id="tip">
            <ul class="tabbar">
                <li class="tab_active"><a href="#" title="1.<?php echo $TEXT['navi-targetstatus'] ?>"></a></li>
                <li id="btn_send_cmd" style="display: none;">
                    <a href="#" onclick="showSendCmd();" title="2.<?php echo $TEXT['navi-sendcmd'] ?>"></a>
                </li>
            </ul>
            <div class="tablist">
					<!--<table id="statuslist" class="tab_status"></table>-->		
            </div>
        </div>
		
		<div id="mnuOperat" class="mnuOperat" style="display: none;">
			<ul>
				<li id="trackby" style="border-top:3px solid #2982D6;" onclick="showTrackInfo();"><a href="#"><?php echo $TEXT['navi-tracknewwindow'] ?></a></li>
				<li id="objinfo" onclick="showDeviceInfo();"><a href="#"><?php echo $TEXT['navi-objectinfo'] ?></a></li>
				<li id="sendcmd" onclick="showSendCmd();"><a href="#"><?php echo $TEXT['navi-sendcmd'] ?></a></li>
				<li class="liHistory"><a class="aHistory" href="#" onclick=""><?php echo $TEXT['navi-playback'] ?></a><img src="img/right_arrow.svg"></img>
					<ul class="mnuHistory">
						<li style="border-top:3px solid #2982D6;" onclick="showFastHistory('1/24');"><a class="iHistory"><?php echo $TEXT['info-daterange-hour'] ?></a></li>
						<li onclick="showFastHistory('1/12');"><a class="iHistory"><?php echo $TEXT['info-daterange-2hour'] ?></a></li>
						<li onclick="showFastHistory('0.1');"><a class="iHistory"><?php echo $TEXT['info-daterange-day'] ?></a></li>
						<li onclick="showFastHistory('0.2');"><a class="iHistory"><?php echo $TEXT['info-daterange-yesterday'] ?></a></li>
						<li onclick="showFastHistory('1');"><a class="iHistory"><?php echo $TEXT['info-daterange-1day'] ?></a></li>
						<li onclick="showFastHistory('2');"><a class="iHistory"><?php echo $TEXT['info-daterange-2day'] ?></a></li>
						<li onclick="showFastHistory('3');"><a class="iHistory"><?php echo $TEXT['info-daterange-3day'] ?></a></li>
						<li onclick="showFastHistory('7');"><a class="iHistory"><?php echo $TEXT['info-daterange-week'] ?></a></li>
						<li onclick="showFastHistory('14');"><a class="iHistory"><?php echo $TEXT['info-daterange-2week'] ?></a></li>
					</ul>
				</li>
				<li id="streetview" onclick="showStreetView();"><a href="#"><?php echo $TEXT['navi-street-view'] ?></a></li>
				<li id="shareposition" onclick="showSharePositionInfo();"><a href="#"><?php echo $TEXT['js-share-position'] ?></a></li>
			</ul>
		</div>
        <div id="map"><span id="loadmapwait"><?php echo $TEXT['map-loading'] ?></span>

			<div id="race_info" style="display: none;">
				<table id="race_details" class="tab_report" style="position:absolute; top: 0px;" >
					<thead>
						<tr style="cursor: pointer;">
							<th><?php echo $TEXT['info-objectflag']?></th>
							<th><?php echo $TEXT['navi-position']?></th>
							<th><?php echo $TEXT['info-dist-from-start']?></th>
							<th><?php echo $TEXT['info-dist-to-finish']?></th>
							<th><?php echo $TEXT['navi-speed']?></th>
							<th><?php echo $TEXT['info-gap-distance']?></th>
							<th><?php echo $TEXT['info-gap-time']?></th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
        <div id="geo">
            <ul><li><!--<span id="loadmapwait"><?php echo $TEXT['map-loading'] ?></span>--></li><li id="timeout" style="display: none;"></li><li><img id="click_show_add" src="img/address.png"/></li><li id="dev_flag"></li><li id="address"></li></ul>
        </div>
		<div id="stasep">
			<img id="staswitch" alt="" src="img/up-arrow.svg"/>
		</div>
		<div id="assetinfo">
			<table id="statuslist" class="tab_status"></table>
		</div>
        <div id="frm">
            <iframe id="frame_content" src="" scrolling="auto" 	frameborder="0"></iframe>
        </div>
		<div id="streetview_img" style="display: none;">
			<p style="font-size:20px; color:rgba(0,0,0,0.5)"><?php echo $TEXT['js-streetview'] ?></p>
		</div>
    </div>
    <!--device info-->
    <div id="dlg_objinfo" class="dialog" style="min-width: 450px; _width: 550px;">
        <div class="out">
            <div class="in">
                <h3 onmousedown="dragstart('dlg_objinfo', event)" onmousemove="dragmove(event)"><?php echo $TEXT['navi-objectinfo'] ?></h3>
                <p><?php echo $TEXT['info-infotips'] ?></p>
                <div class="content">
                    <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                        <tr>
                            <td><?php echo $TEXT['info-objectflag'] ?></td>
                            <td><input id="oflag" type="text" class="itext enablebox must" maxlength="50" /></td>
                            <td width="4" rowspan="5"></td>
                            <td class="noedit"><?php echo $TEXT['info-devicetype'] ?></td>
                            <td><input id="dtype" type="text" class="itext disablebox" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td class="noedit"><?php echo $TEXT['info-deviceid'] ?></td>
                            <td><input id="devno" type="text" class="itext disablebox" readonly="readonly" /></td>
                            <td class="noedit"><?php echo $TEXT['info-simcard'] ?></td>
                            <td><input id="simno" type="text" class="itext disablebox" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td class="noedit"><?php echo $TEXT['info-installtime'] ?></td>
                            <td><input id="itime" type="text" class="itext disablebox" readonly="readonly" /></td>
							<td class="noedit"><?php echo $TEXT['info-expiretime'] ?></td>
                            <td><input id="etime" type="text" class="itext disablebox" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td class="noedit"><?php echo $TEXT['info-custname'] ?></td>
                            <td><input id="custname" type="text" class="itext disablebox" maxlength="100" readonly="readonly"/></td>
                            <td><?php echo $TEXT['info-contactphone'] ?></td>
                            <td><input id="custphone" type="text" class="itext enablebox" maxlength="50" /></td>
                        </tr>
						<!--取消司机
                        <tr>
                            <td class="noedit"><?php echo $TEXT['info-driver'] ?></td>
                            <td><input id="drvname" type="text" class="itext disablebox" readonly="readonly" /></td>
                            <td class="noedit"><?php echo $TEXT['info-driverphone'] ?></td>
                            <td><input id="drvphone" type="text" class="itext disablebox" readonly="readonly" /></td>
                        </tr>
						-->
                        <tr>
                            <td><?php echo $TEXT['info-useicon'] ?></td>
                            <td>
							<div id="my-icon-select"></div>
							<!--
							<input type="radio" class="radio" name="okind" value="1" />
                                <img src="img/icon_car.svg" height="28" width="28" alt="" />
                                <input type="radio" class="radio" name="okind" value="2" />
                                <img src="img/icon_truck.svg" height="25" width="25" alt="" />
                                <input type="radio" class="radio" name="okind" value="3" />
                                <img src="img/icon_bus.svg" height="24" width="23" alt="" />
                                <input type="radio" class="radio" name="okind" value="4" />
                                <img src="img/icon_taxi.svg" height="25" width="25" alt="" />
                                <input type="radio" class="radio" name="okind" value="5" />
                                <img src="img/icon_bicycle.svg" height="28" width="28" alt="" />
                                <input type="radio" class="radio" name="okind" value="6" />
                                <img src="img/icon_man.svg" height="20" width="20" alt="" />
								<input type="radio" class="radio" name="okind" value="7" />
                                <img src="img/icon_boat.svg" height="25" width="25" alt="" />
								<input type="radio" class="radio" name="okind" value="8" />
                                <img src="img/icon_asset.svg" height="23" width="23" alt="" />-->
                            </td>
                        </tr>
                        <tr>
                            <td><?php echo $TEXT['info-remark'] ?></td>
                            <td colspan="5"><textarea id="remark" class="icontent enablebox"></textarea></td>
                        </tr>
                    </table>
                </div>
                <div class="footer">
                    <input id="button_cancel" type="button" class="right small button" style="margin-left: 5px; height: 24px;" value="<?php echo $TEXT['button-cancel'] ?>"/>
                    <input id="button_ok" type="button" class="right small button" style="height: 24px;" value="<?php echo $TEXT['button-ok'] ?>"/>
                </div>
            </div>
        </div>
    </div>
    <!--send command-->
    <div id="dlg_sendcmd" class="dialog" style="width: 400px;">
        <div class="out">
            <div class="in">
                <h3 onmousedown="dragstart('dlg_sendcmd', event)"
                    onmousemove="dragmove(event)"><?php echo $TEXT['navi-sendcmd'] ?></h3>
                <p><?php echo $TEXT['info-cmdtips'] ?></p>
                <div style="height: 150px;" class="content">
                    <ul id="cmdul">
                    </ul>
                </div>
				<p><?php echo $TEXT['js-cmdparam']?></p>
				<div style="height: 150px;" class="content">
					<table id="cmdparam">						
					</table>
				</div>
				<label id="cmderror"></label>
                <div class="footer">
                    <input id="button_cancel" type="button" class="right small button" style="margin-left: 5px; height: 24px;" value="<?php echo $TEXT['button-cancel'] ?>"/>
                    <input id="button_ok" type="button" class="right small button" style="height: 24px;" value="<?php echo $TEXT['button-send'] ?>"/>
                </div>
            </div>
        </div>
    </div>
    <!--alarm info-->
    <div id="dlg_altinfo" class="dialog" style="width: 450px;">
        <div class="out">
            <div class="in">
                <h3 onmousedown="dragstart('dlg_altinfo', event)"
                    onmousemove="dragmove(event)"><?php echo $TEXT['navi-alarminfo'] ?></h3>
                <div style="height: 500px;" class="content">
                    <ul id="altul">                        
                    </ul>
                </div>
                <div class="footer">
                    <input id="button_ok" type="button" class="right small button" style="height: 24px;" value="<?php echo $TEXT['button-ok'] ?>"/>
                </div>
            </div>
        </div>
    </div>
	
	<!-- user info -->
    <div id="dlg_useinfo" class="dialog" style="min-width: 450px; _width: 550px;">
         <div class="out">
              <div class="in">
	             <h3 onmousedown="dragstart('dlg_useinfo', event)" onmousemove="dragmove(event)"><?php echo $TEXT['navi-userinfo'] ?></h3>
                 <p><?php echo $TEXT['info-accountinfo'] ?></p>
                 <div class="content">
                    <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                        <tr>
                            <td class="noedit"><?php echo $TEXT['info-username'] ?></td>
                            <td><input id="username" type="text" class="itext disablebox"/></td>
                            <td class="noedit"><?php echo $TEXT['login-account'] ?></td>
                            <td><input id="loginname" type="text" class="itext disablebox"/></td>
                        </tr>
                        <tr>
                            <td class="noedit"><?php echo $TEXT['info-email'] ?></td>
                            <td><input id="useremail" type="text" class="itext disablebox"/></td>
                            <td class="noedit"><?php echo $TEXT['info-emailreport'] ?></td>
                            <td><input id="emailreport" type="checkbox" class="icheck disablebox"/></td>
                        </tr>
                        <tr>
                            <td class="noedit"><?php echo $TEXT['info-emailoffset'] ?></td>
                            <td><input id="emailoffset" type="text" class="itext disablebox"/></td>
							<td class="noedit"><?php echo $TEXT['info-available'] ?></td>
                            <td><input id="available" type="checkbox" class="icheck disablebox"/></td>
                        </tr>
                        <tr>
                            <td class="noedit"><?php echo $TEXT['info-userphone'] ?></td>
                            <td><input id="userphone" type="text" class="itext disablebox"/></td>
							<td class="noedit"><?php echo $TEXT['info-limitcar'] ?></td>
							<td><input id="limitcar" type="text" class="itext disablebox"/></td>
                        </tr>
                    </table>
                </div>
                <div class="footer">
                    <input id="button_cancel" type="button" class="right small button" style="height: 24px;" value="<?php echo $TEXT['button-cancel'] ?>"/>
		        </div>
               </div>  
         </div>
    </div>
	
	<!--objects state chart-->
	<div id="dlg_objstatechart" class="dialog" style="position: absolute; width: 90%; padding: 0px 0px; margin: 0px;">
        <div class="out">
            <div class="in">
                <h3 onmousedown="dragstart('dlg_objstatechart', event)"
                    onmousemove="dragmove(event)"><?php echo $TEXT['navi-objstatechartinfo'] ?></h3>
                <p id="title"></p>
				<table border="0" cellpadding="0" cellspacing="0" style="padding: 0px 0px; margin: 0px; width: 100%;">
                        <tr>
							<td style="border='none'; align='top'; width: 25%;"><div id="sta_on_off_exp" style="min-height: 240px;"></div></td>
							<td style=" border='none'; align='top'; width: 25%;"><div id="sta_mov_sti_alm" style="min-height: 240px;"></div></td>
							<td style=" border='none'; align='top'; width: 25%;"><div id="sta_speed_range" style="min-height: 240px;"></div></td>
							<td style=" border='none'; align='top'; width: 25%;"><div id="sta_exp_time" style="min-height: 240px;"></div></td>
						</tr>
						<tr>
							<td style="border: 1px solid #369; border-right: none; align='top'; width: 25%;"><div id="sta_last24h_moving" style="min-height: 240px;"></div></td>
							<td style="border: 1px solid #369; border-right: none; align='top'; width: 25%;"><div id="sta_last24h_idle" style="min-height: 240px;"></div></td>
							<td style="border: 1px solid #369; border-right: none; align='top'; width: 25%;"><div id="sta_last24h_mileage" style="min-height: 240px;"></div></td>
							<td style="border: 1px solid #369; border-right: none; align='top'; width: 25%;"><div id="sta_last24h_engine" style="min-height: 240px;"></div></td>						
						</tr>
				</table>
                
                
                <div class="footer">
                    <input id="button_ok" type="button" class="right small button" style="height: 24px;" value="<?php echo $TEXT['button-ok'] ?>"/>
                </div>
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
                    <input id="button_ok" type="button" class="right small button" style="height: 24px;" value="<?php echo $TEXT['button-ok'] ?>"/>
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
                    <input id="button_ok" type="button" class="right small button" style="height: 24px;" value="<?php echo $TEXT['button-ok'] ?>"/>
                </div>
            </div>
        </div>
    </div>
	<div id="devicetips" style="display: none;">
		<table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
			<tr>
				<td class="noedit"><?php echo $TEXT['info-objectflag'] ?></td>
				<td><label id="tip_name" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-passenger-count'] ?></td>
				<td><label id="tip_passenger" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-deviceid'] ?></td>
				<td><label id="tip_device_no" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-simcard'] ?></td>
				<td><label id="tip_simcard" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-driver'] ?></td>
				<td><label id="tip_driver" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-latitude'] ?></td>
				<td><label id="tip_lat" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-longitude'] ?></td>
				<td><label id="tip_lng" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['navi-speed'] ?></td>
				<td><label id="tip_speed" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-heading'] ?></td>
				<td><label id="tip_heading" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-mileage'] ?></td>
				<td><label id="tip_mil" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-fuel'] ?></td>
				<td><label id="tip_fuel" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-battery'] ?></td>
				<td><label id="tip_bat" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-temperature'] ?></td>
				<td><label id="tip_temp" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['info-humidity'] ?></td>
				<td><label id="tip_humidity" class="tipscontent"></label></td>
			</tr>
			<tr>
				<td class="noedit"><?php echo $TEXT['js-tip-locatetime'] ?></td>
				<td><label id="tip_time" class="tipscontent"></label></td>
			</tr>
		</table>
	</div>
	
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
						<table id="share_position_list" class="tab_report sortable">
							<thead>
								<tr>
									<th width="5%"><?php echo $TEXT['info-order']?></th>
									<th width="15%"><?php echo $TEXT['js-share-position-name']?></th>
									<th width="15%"><?php echo $TEXT['js-share-position-email']?></th>
									<th width="15%"><?php echo $TEXT['js-share-position-phone']?></th>
									<th width="5%"><?php echo $TEXT['js-share-position-assets']?></th>
									<th width="5%"><?php echo $TEXT['js-share-position-active']?></th>
									<th width="15%"><?php echo $TEXT['js-share-position-expire-on']?></th>
									<th class="no-sort" width="8%"><?php echo $TEXT['info-operate']?></th>
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
							<td colspan=5 style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #fff; "><?php echo $TEXT['js-share-position']?></td>
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
	
	<!--delete confirm-->
	<div id="dlg_delconfirm" class="dialog" style="min-width: 300px;">
		<div class="out">
			<div class="in">
				<h3 onmousedown="dragstart('dlg_delconfirm', event)"
					onmousemove="dragmove(event)"><?php echo $TEXT['info-warning'] ?></h3>
				<div style="min-height: 20px;_height: 20px; padding: 15px 0px 10px 0px;">
					<span class="icon_warning" style="padding: 10px 15px 10px 55px;"><?php echo $TEXT['info-delwarning'] ?></span>
				</div>
				<div class="footer">
					<input id="button_cancel" type="button" class="right small button" style="margin-left: 5px;" value="<?php echo $TEXT['button-cancel'] ?>" />
					<input id="button_ok" type="button" class="right small button" value="<?php echo $TEXT['button-ok'] ?>"/>
				</div>
			</div>
		</div>
	</div>
	
    <div id="footer">
        <ul>
            <li style="float: left"><?php echo $TEXT['global-copyright'] ?></li>
            <li style="float: right"><?php echo $TEXT['global-support'] ?></li>
        </ul>
    </div>
	
	<audio id="player" style="display: none;" controls="controls">
		<source src="sound/BUZZ5.mp3"/>
	</audio>
</body>
</html>

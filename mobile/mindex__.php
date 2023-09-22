<?php
header('Access-Control-Allow-Origin:*');
session_start();
if (!isset($_SESSION['uid']) or (int) $_SESSION['uid'] < 1) {
    Header("Location: mlogin.php");
    exit;
}
include_once('../lang.inc.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <!-- Include Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta content="telephone=no" name="format-detection">
    <title><?php echo $TEXT['global-title'] ?></title>
    <link rel="Bookmark" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-mfav-icon']; ?>" />
    <link rel="Shortcut Icon" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-mfav-icon']; ?>" />
    <link rel="apple-touch-icon" href="../img/apple-touch-icon.png">
    <link rel="apple-touch-icon-precomposed" href="../img/apple-touch-icon.png">
    <link type="text/css" rel="stylesheet" href="mcss/button.css" />
    <link type="text/css" rel="stylesheet" href="mcss/bootstrap.css?v=<?php echo $last_ver['style.css'] ?>" />
    <link type="text/css" rel="stylesheet" href="mcss/mstyle.css?v=<?php echo $last_ver['style.css'] ?>" />
    <link type="text/css" rel="stylesheet" href="../css/jquery-ui.css" />
    <link type="text/css" rel="stylesheet" href="mcss/vanillaSelectBox.css" />
    <link type="text/css" rel="stylesheet" href="mcss/picker.min.css" />
    <link type="text/css" rel="stylesheet" href="mmap/leaflet/leaflet.css" />
    <link type="text/css" rel="stylesheet" href="mmap/leaflet/MarkerCluster.css" />
    <!--<link type="text/css" rel="stylesheet" href="mmap/leaflet/MarkerCluster.Default.css"/>-->
    <link type="text/css" rel="stylesheet" href="mmap/leaflet/clusterpies.css" />
    <link type="text/css" rel="stylesheet" href="mmap/leaflet/leaflet-measure-path.css" />
    <link type="text/css" rel="stylesheet" href="mmap/leaflet/Control.FullScreen.css" />
    <link type="text/css" rel="stylesheet" href="../css/toastr.min.css" />
    <link type="text/css" rel="stylesheet" href="../css/jquery.contextMenu.min.css" />
    <link type="text/css" rel="stylesheet" href="mmap/leaflet/leaflet.measure.css" />
    <link type="text/css" rel="stylesheet" href="mmap/leaflet/RoutingMachine/leaflet-routing-machine.css" />
    <!--<link type="text/css" rel="stylesheet" href="mcss/jquery.mobile-1.4.5.min.css"/>-->
    <script type="text/javascript" src="../js/gauge.min.js"></script>
    <script type="text/javascript" src="../js/jquery.min.js?v=<?php echo $last_ver['jquery.min.js'] ?>"></script>
    <script type="text/javascript" src="../js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="../js/jquery.cookie.js"></script>
    <script>
        $(document).on('mobileinit', function() {
            //$.mobile.ignoreContentEnabled = true;
            $.mobile.keepNative = "select,input";
        });
    </script>
    <script type='text/javascript' src="mjs/jquery.mobile-1.4.5.min.js"></script>

    <script type="text/javascript" src="../js/jquery-dateFormat.min.js?>"></script>
    <script type="text/javascript" src="../js/jquery-ui-datepicker-min.js"></script>
    <script type="text/javascript" src="../js/jquery-ui-timepicker-addon.js"></script>
    <script type="text/javascript" src="mjs/vanillaSelectBox.js"></script>
    <script type='text/javascript' src="../js/jquery.contextMenu.min.js"></script>
    <script type='text/javascript' src="../js/toastr.min.js"></script>
    <script type="text/javascript" src="mjs/mcommon.js?v=<?php echo $last_ver['common.js'] ?>"></script>
    <script type="text/javascript" src="mjs/mplayback.js?v=<?php echo $last_ver['playback.js'] ?>"></script>
    <script type="text/javascript" src="mjs/<?php echo $last_name['mdevicelist.js'] ?>?v=<?php echo $last_ver['devicelist.js'] ?>"></script>
    <script type="text/javascript" src="mjs/<?php echo $last_name['mindex.js'] ?>?v=<?php echo $last_ver['index.js'] ?>>"></script>
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
    <script type="text/javascript" src="mmap/<?php echo $last_name['map.operat.js'] ?>?v=<?php echo $last_ver['map.operat.js'] ?>"></script>
    <script type="text/javascript" src="mmap/<?php echo $last_name['map.leaflet.js'] ?>?v=<?php echo $last_ver['map.leaflet.js'] ?>"></script>

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
        JS_ROUTING_MACHINE_URL = "<?php echo $last_ver['routing_machine_url'] ?>";
        JS_GOOGLE_TYPE = "<?php echo $last_ver['google_map_type'] ?>";
        JS_GOOGLE_KEY = "<?php echo $last_ver['google_map_v3_key'] ?>";
        JS_BING_KEY = "<?php echo $last_ver['bing_map_key'] ?>";
        JS_MAPBOX_KEY = "<?php echo $last_ver['mapbox_map_key'] ?>";
        JS_GOOGLE_MAP_BASE_LINK = "<?php echo $last_ver['google_map_base_link'] ?>";
        JS_GLOBAL_MIM_UPDATE = "<?php echo $GLOBAL_MIM_UPDATE ?>";
        JS_DEVICE_FLAG4ID = []; //getFlag(id)
        JS_DEVICE_ID4FLAG = []; //getId(Flag)
        JS_DEVICE_STATUS = [];
        JS_DEVICE_TYPE4ID = [];
        JS_GROUP = [];
        JS_DEVICE_NO4ID = [];
        JS_DEVICE_SIM4ID = [];
        JSDEVICE_DRIVER4ID = [];
        JS_DEVICE_ID4GROUPID = [];
        JS_OBJECT_KIND = <?php echo $_SESSION['object_kind'] ?>;
        JS_SPEED_HOUR = "<?php echo $TEXT['js-speedhour'] ?>";
        JS_OVER_SPEED = "<?php echo $TEXT['js-overspeed'] ?>";
        JS_HIGH_SPEED = "<?php echo $TEXT['js-highspeed'] ?>";
        JS_UNREPORTED = "<?php echo $TEXT['js-unreported'] ?>";
        JS_MOVING = "<?php echo $TEXT['js-moving'] ?>";
        JS_STATIC = "<?php echo $TEXT['js-static'] ?>";
        JS_TIP_ADDR = "<?php echo $TEXT['js-tip-location'] ?>";
        JS_TIMEOUT_INVALID = "<?php echo $TEXT['timeout-item-invalid'] ?>";
        JS_EXPIRED = "<?php echo $TEXT['js-expired'] ?>";
        JS_ENGINE_ON = "<?php echo $TEXT['js-engine-on'] ?>";
        JS_ENGINE_OFF = "<?php echo $TEXT['js-engine-off'] ?>";
        JS_TEMP_UNIT = "<?php echo $TEXT['js-temp_unit'] ?>";
        JS_NO_DRIVER = "<?php echo $TEXT['js-no_driver'] ?>";
        JS_NO_NEED_PARAM = "<?php echo $TEXT['js-noneedparam'] ?>";
        JS_SELECT_ONE_CMD = "<?php echo $TEXT['js-selectonecmd'] ?>";
        JS_CMD_OBJINFO = "<?php echo $TEXT['navi-objectinfo'] ?>";
        JS_CMD_ALTINFO = "<?php echo $TEXT['js-lastvoice'] ?>";
        JS_LAST_PHOTO = "<?php echo $TEXT['navi-lastphoto'] ?>";
        JS_NO_PHOTO = "<?php echo $TEXT['js-nophoto'] ?>";
        JS_LAST_VOICE = "<?php echo $TEXT['js-lastvoice'] ?>";
        JS_HISTORY = "<?php echo $TEXT['navi-playback'] ?>";
        JS_SHARE_POSITION = "<?php echo $TEXT['js-share-position'] ?>";
        JS_SHARE_FAIL = "<?php echo $TEXT['js-share-fail'] ?>";
        JS_SHARE_COPY_SUCCESS = "<?php echo $TEXT['js-share-copy-successful'] ?>";
        JS_NO_VOICE = "<?php echo $TEXT['js-novoice'] ?>";
        JS_RANGE_ERROR = "<?php echo $TEXT['js-rangeerror'] ?>";
        JS_LENGTH_ERROR = "<?php echo $TEXT['js-lengtherror'] ?>";
        JS_NO_COMMAND = "<?php echo $TEXT['js-nocommand'] ?>";
        JS_DEFAULT_DATETIME_fmt_JS = "<?php echo $_SESSION['datetime_fmt_js'] ?>";
        JS_NAVI_CHART_FUEL_1 = "<?php echo $TEXT['navi-chart-fuel-1'] ?>";
        JS_NAVI_CHART_TEMP_1 = "<?php echo $TEXT['navi-chart-temp-1'] ?>";
        JS_GPS_VALID = "<?php echo $TEXT['js-gpsvalid'] ?>";
        JS_LBS_VALID = "<?php echo $TEXT['js-lbsvalid'] ?>";
        JS_LOCATION_INVALID = "<?php echo $TEXT['js-location-invalid'] ?>";
        JS_ALARM_INFO = "<?php echo $TEXT['js-alarm-info'] ?>";
        JS_TASK_NEW_INFO = "<?php echo $TEXT['4026'] ?>";
        JS_TASK_PROCESSING_INFO = "<?php echo $TEXT['4027'] ?>";
        JS_ASSET_CONTROL = "<?php echo $TEXT['js-asset-control'] ?>";
        JS_PARKING = "<?php echo $TEXT['js-parking'] ?>";
        JS_TIP_OBJ_ALARM = "<?php echo $TEXT['navi-tabalarm'] ?>";
        JS_TIP_OBJ_EXPIRED = "<?php echo $TEXT['navi-tabexpired'] ?>";
        JS_CURRENT_LANG = "<?php echo $_SESSION['lang'] ?>";
        JS_FULL_SCREEN = "<?php echo $TEXT['js-full-screen'] ?>";
        JS_TIMEOUT_MINS = "<?php echo $TEXT['timeout-item-mins'] ?>";
        JS_TIMEOUT_HOUR = "<?php echo $TEXT['timeout-item-hour'] ?>";
        JS_TIMEOUT_DAY = "<?php echo $TEXT['timeout-item-day'] ?>";
        JS_TIMEOUT_WEEK = "<?php echo $TEXT['timeout-item-week'] ?>";
        JS_TIMEOUT_MON = "<?php echo $TEXT['timeout-item-mon'] ?>";
        JS_TIMEOUT_YEAR = "<?php echo $TEXT['timeout-item-year'] ?>";
        JS_TIMEOUT_INVALID = "<?php echo $TEXT['timeout-item-invalid'] ?>";
        JS_TIP_OBJ_ONLINE = "<?php echo $TEXT['navi-tabonline'] ?>";
        JS_TIP_OBJ_OFFLINE = "<?php echo $TEXT['navi-tabinactive'] ?>";
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
        JS_OBJECTS = "<?php echo $TEXT['js-objects'] ?>";
        JS_MILEAGE = "<?php echo $TEXT['info-mileage'] ?>";
        JS_LAST24H_MILEAGE = "<?php echo $TEXT['js-last24h-mileage'] ?>";
        JS_LAST24H_ENGINE = "<?php echo $TEXT['js-last24h-engine'] ?>";
        JS_LAST24H_IDLE = "<?php echo $TEXT['js-last24h-idle'] ?>";
        JS_LAST24H_MOVING = "<?php echo $TEXT['js-last24h-moving'] ?>";
        JS_HOUR = "<?php echo $TEXT['js-hour'] ?>";
        JS_DEFAULT_LNG = <?php echo $_SESSION['lng'] ?>;
        JS_DEFAULT_LAT = <?php echo $_SESSION['lat'] ?>;
        JS_DEFAULT_ZOOM = <?php echo $_SESSION['zoom'] ?>;
        JS_DEFAULT_PAGE = <?php echo $_SESSION['page'] ?>; //0: menu  1: object list  2: map
        JS_DEFAULT_SHOW = <?php echo $_SESSION['show'] ?>;
        JS_DEFAULT_ZONE = <?php echo $_SESSION['zone'] ?>;
        JS_DEFAULT_FIT = <?php echo $_SESSION['fit'] ?>;
        JS_DEFAULT_COLLAPSED = <?php echo $_SESSION['collapsed'] ?>;
        JS_DEFAULT_ASSET_INFOS = "<?php echo $_SESSION['assetInfos'] ?>";
        JS_CHART_SELECT = "<?php echo $TEXT['navi-chart-select'] ?>"
        JS_SELECTED = "<?php echo $TEXT['info-selected'] ?>";
        JS_INFO_SELECT = "<?php echo $TEXT['info-select'] ?>"
        JS_SELECT_ALL = "<?php echo $TEXT['info-select-all'] ?>";
        JS_SELECT_ALL = "[<?php echo $TEXT['info-select-all'] ?>]"
        JS_SELECT_ALL_ITEM = "<?php echo $TEXT['info-select-all-item'] ?>";
        JS_SELECT_ITEMS = "<?php echo $TEXT['info-select-item'] ?>";
        JS_SELECT_CLEAR_ALL = "[<?php echo $TEXT['info-select-clear-all'] ?>]";
        JS_DEFAULT_MARKER = <?php echo $_SESSION['marker'] ?>;
        JS_PUSH_NOTIFICATION = <?php echo $_SESSION['puno'] ?>;
        JS_PUSH_INTERVAL = <?php echo $_SESSION['puin'] ?>;
        JS_DEFAULT_DATETIME_fmt_JS = "<?php echo $_SESSION['datetime_fmt_js'] ?>";
        JS_DEFAULT_DATE_FMT = "<?php echo $_SESSION['date_fmt_js'] ?>";
        JS_DEFAULT_SOUND_ALARM = "<?php echo $_SESSION['sond_alarm'] ?>";
        JS_DEFAULT_POPUP_ALARM = "<?php echo $_SESSION['popup_alarm'] ?>";
        JS_UNIT_DISTANCE = "<?php echo $_SESSION['unit_distance'] ?>"; //0:Kilometer(公里) 1:Mile(英里) 2:Nautical mile(海里)
        JS_UNIT_FUEL = "<?php echo $_SESSION['unit_fuel'] ?>"; //0:Liter(升) 1:Gallon(加仑)
        JS_UNIT_TEMPERATURE = "<?php echo $_SESSION['unit_temperature'] ?>"; //0:Celsius  1:Fahrenheit
        JS_UNIT_SPEED = "<?php echo $_SESSION['unit_speed'] ?>"; //0:kph(公里/小时) 1:mph(英里/小时)
        JS_UNIT_ALTITUDE = "<?php echo $_SESSION['unit_altitude'] ?>"; //0:meter 1:feet
        JS_UNIT_HUMIDITY = 0;
        JS_UNIT_TPMS = "<?php echo $_SESSION['unit_tpms'] ?>"; //0: bar 1:kpa 2:psi 3:kg/cm2
        JS_FUEL = "<?php echo $TEXT['report-fuel'] ?>";
        JS_REFUEL = "<?php echo $TEXT['report-re-fuel'] ?>";
        JS_STEAL_FUEL = "<?php echo $TEXT['report-steal-fuel'] ?>";
        JS_ALTITUDE = "<?php echo $TEXT['navi-altitudechart'] ?>";
        JS_IGNITION = "<?php echo $TEXT['navi-ignitionchart'] ?>";
        JS_LOCATE_TIP = "<?php echo $TEXT['js-locate-tip'] ?>";
        JS_TOTAL_DISTANCE = "<?php echo $TEXT['js-total-distance'] ?>";
        JS_TOTAL_AREA = "<?php echo $TEXT['js-total-area'] ?>";
        JS_ENABLE_DISABLE_ASSET = "<?php echo $TEXT['js-enable-disable-asset'] ?>";
        JS_FIT_ASSETS = "<?php echo $TEXT['js-fit-assets'] ?>";
        JS_ENABLE_DISABLE_LABEL = "<?php echo $TEXT['js-enable-disable-label'] ?>";
        JS_ENABLE_DISABLE_MARKER = "<?php echo $TEXT['js-enable-disable-marker'] ?>";
        JS_ENABLE_DISABLE_ZONES = "<?php echo $TEXT['js-enable-disable-zones'] ?>";
        JS_ENABLE_DISABLE_CLUSTERS = "<?php echo $TEXT['js-enable-disable-clusters'] ?>";
        JS_ENABLE_DISABLE_MEASURE = "<?php echo $TEXT['js-enable-disable-measure'] ?>";
        JS_ENABLE_DISABLE_ARROWS = "<?php echo $TEXT['js-enable-disable-arrows'] ?>";
        JS_ENABLE_DISABLE_POINTS = "<?php echo $TEXT['js-enable-disable-points'] ?>";
        JS_ENABLE_DISABLE_STOPS = "<?php echo $TEXT['js-enable-disable-stops'] ?>";
        JS_ENABLE_DISABLE_EVENTS = "<?php echo $TEXT['js-enable-disable-events'] ?>";
        JS_ENABLE_DISABLE_STREETVIEW = "<?php echo $TEXT['js-enable-disable-streetview'] ?>";
        JS_ENABLE_DISABLE_SNAP = "<?php echo $TEXT['js-enable-disable-snap'] ?>";
        JS_ENABLE_DISABLE_ROUTE = "<?php echo $TEXT['js-enable-disable-route'] ?>";
        JS_DISABLE_TASK = "<?php echo $TEXT['js-enable-disable-task'] ?>";
        JS_TASK_INFO = "<?php echo $TEXT['info-taskinfo'] ?>";
        JS_DISABLE_TASK_SUCC = "<?php echo $TEXT['info-task-disable-succ'] ?>";
        JS_DISABLE_TASK_FAIL = "<?php echo $TEXT['info-task-disable-fail'] ?>";
        JS_ENABLE_DISABLE_DRIVER = "<?php echo $TEXT['js-enable-disable-driver'] ?>";
        JS_NO_TASK = "<?php echo $TEXT['info-task-no-task'] ?>";
        JS_TASK_START = "<?php echo $TEXT['info-task-start-place'] ?>";
        JS_TASK_END = "<?php echo $TEXT['info-task-end-place'] ?>";
        JS_NO_PERMISSION = "<?php echo $TEXT['status-nopermission'] ?>";
        JS_HIS_TIME_START = "<?php echo $TEXT['info-starttime'] ?>";
        JS_HIS_TIME_END = "<?php echo $TEXT['info-endtime'] ?>";
        JS_BUTTON_OK = "<?php echo $TEXT['button-ok'] ?>";
        JS_BUTTON_CANCEL = "<?php echo $TEXT['button-cancel'] ?>";
        JS_BUTTON_SEND = "<?php echo $TEXT['cmd-send'] ?>";
        JS_BUTTON_RETURN = "<?php echo $TEXT['return-back'] ?>";
        JS_PLAY_TITLE = "<?php echo $TEXT['navi-playback'] ?>";
        JS_STATUS_NODATA = "<?php echo $TEXT['status-nodata'] ?>";
        JS_MAX_ITEMS = "<?php echo $TEXT['navi-chart-max-items'] ?>";
        JS_GLOBAL_TIPS = "<?php echo $TEXT['global-loading'] ?>";
        JS_START_POINT = "<?php echo $TEXT['navi-start-point'] ?>";
        JS_END_POINT = "<?php echo $TEXT['navi-end-point'] ?>";
        JS_PLAY = "<?php echo $TEXT['button-play'] ?>";
        JS_STOP = "<?php echo $TEXT['button-stop'] ?>";
        JS_ROUTE = "<?php echo $TEXT['button-route'] ?>";
        JS_HIDE = "<?php echo $TEXT['button-hide'] ?>";
        JS_MAP = "<?php echo $TEXT['button-map'] ?>";
        JS_START = "<?php echo $TEXT['navi-start'] ?>";
        JS_END = "<?php echo $TEXT['navi-end'] ?>";
        JS_DURATION = "<?php echo $TEXT['navi-duration'] ?>";
        JS_TEMP = "<?PHP echo $TEXT['report-temp'] ?>";
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
        JS_CMD_SENDCMD = "<?php echo $TEXT['navi-sendcmd'] ?>";
        JS_CMD_SEND_SUCC = "<?php echo $TEXT['status-sendsuccess'] ?>";
        JS_GLOBAL_TIPS = "<?php echo $TEXT['global-update'] ?>";
        JS_UPDATE_SET = "<?php echo $TEXT['navi-updateset'] ?>";
        JS_UPDATE_SUCC = "<?php echo $TEXT['status-updatesuccess'] ?>";
        JS_REQUEST_INFO = "<?php echo $TEXT['info-requestinfo'] ?>";
        JS_REQUEST_TIMEOUT = "<?php echo $TEXT['status-timeout'] ?>";
        JS_SHOW = "<?php echo $TEXT['info-show'] ?>";
        JS_TRACK = "<?php echo $TEXT['info-track'] ?>";
        JS_SHOW_ALL = "<?php echo $TEXT['info-show-all'] ?>";
        JS_TRACK_ALL = "<?php echo $TEXT['info-track-all'] ?>";
        JS_UPDATE_FAIL = "<?php echo $TEXT['status-updatefail'] ?>";
        OBJECT_INFO_FLAG = "<?php echo $TEXT['info-objectflag'] ?>";
        JS_ADDRESS = "<?php echo $TEXT['js-address'] ?>";
        OBJECT_INFO_TYPE = "<?php echo $TEXT['info-devicetype'] ?>";
        OBJECT_INFO_DEVICE_ID = "<?php echo $TEXT['info-deviceid'] ?>";
        OBJECT_INFO_SIMCARD = "<?php echo $TEXT['info-simcard'] ?>";
        OBJECT_INFO_INSTALLTIME = "<?php echo $TEXT['info-installtime'] ?>";
        OBJECT_INFO_EXPIRETIME = "<?php echo $TEXT['info-expiretime'] ?>";
        OBJECT_INFO_CUSTNAME = "<?php echo $TEXT['info-custname'] ?>";
        OBJECT_INFO_CONTACTPHONE = "<?php echo $TEXT['info-contactphone'] ?>";
        JS_POSITION = "<?php echo $TEXT['navi-position'] ?>";
        JS_SPEED = "<?php echo $TEXT['navi-speed'] ?>";
        JS_HEADING = "<?php echo $TEXT['info-heading'] ?>";
        JS_GPS_TIME = "<?php echo $TEXT['info-gpstime'] ?>";
        JS_SERVER_TIME = "<?php echo $TEXT['info-revtime'] ?>";
        JS_PARKING = "<?php echo $TEXT['js-parking'] ?>";
        JS_TOTAL_DISTANCE = "<?php echo $TEXT['js-total-distance'] ?>";
        JS_TOTAL_AREA = "<?php echo $TEXT['js-total-area'] ?>";
        JS_GENERAL_STATUS = "<?php echo $TEXT['navi-generalstatus'] ?>";
        JS_RECENT_MILEAGE = "<?php echo $TEXT['info-recent-mileage'] ?>";
        JS_RECENT_ENGINE = "<?php echo $TEXT['info-recent-engine'] ?>";
        JS_RECENT_LOAD = "<?php echo $TEXT['info-recent-load'] ?>";
        JS_RECENT_TIRESENSOR = "<?php echo $TEXT['info-recent-tiresensor'] ?>";
        JS_TIRE_PRESSURE = "<?php echo $TEXT['info-tire-pressure'] ?>";
        JS_NO_DATA = "<?php echo $TEXT['info-no-data'] ?>";
        JS_BAT = "<?php echo $TEXT['info-battery'] ?>";
        JS_DOOR_OPEN = "<?php echo $TEXT['info-door-open'] ?>";
        JS_DOOR_CLOSE = "<?php echo $TEXT['info-door-close'] ?>";
        JS_DOOR_STATE = "<?php echo $TEXT['asset-infos-door-status'] ?>";
        JS_MYLOCATION = "<?php echo $TEXT['mylocation'] ?>";
        JS_RELEASE_TRACK = "<?php echo $TEXT['js-release-track'] ?>";
        JS_STATUS_EMPTYOLDPASS = "<?php echo $TEXT['status-emptyoldpass'] ?>";
        JS_STATUS_EMPTYNEWPASS = "<?php echo $TEXT['status-emptynewpass'] ?>";
        JS_STATUS_INVALIDREPEPASS = "<?php echo $TEXT['status-invalidrepepass'] ?>";
        JS_CONTEXTBUTTONTITLE = "<?php echo $TEXT['js-highcharts-contextbuttontitle'] ?>";
        JS_DECIMALPOINT = "<?php echo $TEXT['js-highcharts-decimalpoint'] ?>";
        JS_DOWNLOADJPEG = "<?php echo $TEXT['js-highcharts-downloadjpeg'] ?>";
        JS_DOWNLOADPDF = "<?php echo $TEXT['js-highcharts-downloadpdf'] ?>";
        JS_DOWNLOADPNG = "<?php echo $TEXT['js-highcharts-downloadpng'] ?>";
        JS_DOWNLOADSVG = "<?php echo $TEXT['js-highcharts-downloadsvg'] ?>";
        JS_LOADING = "<?php echo $TEXT['js-highcharts-loading'] ?>";
        JS_MONTHS1 = "<?php echo $TEXT['js-highcharts-months1'] ?>";
        JS_MONTHS2 = "<?php echo $TEXT['js-highcharts-months2'] ?>";
        JS_MONTHS3 = "<?php echo $TEXT['js-highcharts-months3'] ?>";
        JS_MONTHS4 = "<?php echo $TEXT['js-highcharts-months4'] ?>";
        JS_MONTHS5 = "<?php echo $TEXT['js-highcharts-months5'] ?>";
        JS_MONTHS6 = "<?php echo $TEXT['js-highcharts-months6'] ?>";
        JS_MONTHS7 = "<?php echo $TEXT['js-highcharts-months7'] ?>";
        JS_MONTHS8 = "<?php echo $TEXT['js-highcharts-months8'] ?>";
        JS_MONTHS9 = "<?php echo $TEXT['js-highcharts-months9'] ?>";
        JS_MONTHS10 = "<?php echo $TEXT['js-highcharts-months10'] ?>";
        JS_MONTHS11 = "<?php echo $TEXT['js-highcharts-months11'] ?>";
        JS_MONTHS12 = "<?php echo $TEXT['js-highcharts-months12'] ?>";
        JS_NODATA = "<?php echo $TEXT['js-highcharts-nodata'] ?>";
        JS_PRINTCHART = "<?php echo $TEXT['js-highcharts-printchart'] ?>";
        JS_RESETZOOM = "<?php echo $TEXT['js-highcharts-resetzoom'] ?>";
        JS_RESETZOOMTITLE = "<?php echo $TEXT['js-highcharts-resetzoomtitle'] ?>";
        JS_SHORTMONTHS1 = "<?php echo $TEXT['js-highcharts-shortmonths1'] ?>";
        JS_SHORTMONTHS2 = "<?php echo $TEXT['js-highcharts-shortmonths2'] ?>";
        JS_SHORTMONTHS3 = "<?php echo $TEXT['js-highcharts-shortmonths3'] ?>";
        JS_SHORTMONTHS4 = "<?php echo $TEXT['js-highcharts-shortmonths4'] ?>";
        JS_SHORTMONTHS5 = "<?php echo $TEXT['js-highcharts-shortmonths5'] ?>";
        JS_SHORTMONTHS6 = "<?php echo $TEXT['js-highcharts-shortmonths6'] ?>";
        JS_SHORTMONTHS7 = "<?php echo $TEXT['js-highcharts-shortmonths7'] ?>";
        JS_SHORTMONTHS8 = "<?php echo $TEXT['js-highcharts-shortmonths8'] ?>";
        JS_SHORTMONTHS9 = "<?php echo $TEXT['js-highcharts-shortmonths9'] ?>";
        JS_SHORTMONTHS10 = "<?php echo $TEXT['js-highcharts-shortmonths10'] ?>";
        JS_SHORTMONTHS11 = "<?php echo $TEXT['js-highcharts-shortmonths11'] ?>";
        JS_SHORTMONTHS12 = "<?php echo $TEXT['js-highcharts-shortmonths12'] ?>";
        JS_THOUSANDSSEP = "<?php echo $TEXT['js-highcharts-thousandssep'] ?>";
        JS_WEEKDAYS1 = "<?php echo $TEXT['js-highcharts-weekdays1'] ?>";
        JS_WEEKDAYS2 = "<?php echo $TEXT['js-highcharts-weekdays2'] ?>";
        JS_WEEKDAYS3 = "<?php echo $TEXT['js-highcharts-weekdays3'] ?>";
        JS_WEEKDAYS4 = "<?php echo $TEXT['js-highcharts-weekdays4'] ?>";
        JS_WEEKDAYS5 = "<?php echo $TEXT['js-highcharts-weekdays5'] ?>";
        JS_WEEKDAYS6 = "<?php echo $TEXT['js-highcharts-weekdays6'] ?>";
        JS_WEEKDAYS7 = "<?php echo $TEXT['js-highcharts-weekdays7'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_ACTIONS_TITLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-actions-title'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_ACTIONS_TEXT = "<?php echo $TEXT['js-draw-tool-draw-toolbar-actions-text'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_FINISH_TITLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-finish-title'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_FINISH_TEXT = "<?php echo $TEXT['js-draw-tool-draw-toolbar-finish-text'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_UNDO_TITLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-undo-title'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_UNDO_TEXT = "<?php echo $TEXT['js-draw-tool-draw-toolbar-undo-text'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_POLYLINE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-polyline'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_POLYGON = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-polygon'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_RECTANGLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-rectangle'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_CIRCLE = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-circle'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_MARKER = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-marker'] ?>";
        JS_DRAW_TOOL_DRAW_TOOLBAR_BUTTONS_CIRCLEMARKER = "<?php echo $TEXT['js-draw-tool-draw-toolbar-buttons-circlemarker'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_CIRCLE_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-circle-tooltip-start'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_CIRCLE_RADIUS = "<?php echo $TEXT['js-draw-tool-draw-handlers-circle-radius'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_CIRCLEMARKER_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-circlemarker-tooltip-start'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_MARKER_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-marker-tooltip-start'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_POLYGON_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-polygon-tooltip-start'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_POLYGON_TOOLTIP_CONT = "<?php echo $TEXT['js-draw-tool-draw-handlers-polygon-tooltip-cont'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_POLYGON_TOOLTIP_END = "<?php echo $TEXT['js-draw-tool-draw-handlers-polygon-tooltip-end'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-polyline-tooltip-start'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_TOOLTIP_CONT = "<?php echo $TEXT['js-draw-tool-draw-handlers-polyline-tooltip-cont'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_TOOLTIP_END = "<?php echo $TEXT['js-draw-tool-draw-handlers-polyline-tooltip-end'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_POLYLINE_ERROR = "<?php echo $TEXT['js-draw-tool-draw-handlers-polyline-error'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_RECTANGLE_TOOLTIP_START = "<?php echo $TEXT['js-draw-tool-draw-handlers-rectangle-tooltip-start'] ?>";
        JS_DRAW_TOOL_DRAW_HANDLERS_SIMPLESHAPE_TOOLTIP_END = "<?php echo $TEXT['js-draw-tool-draw-handlers-simpleshape-tooltip-end'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_SAVE_TITLE = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-save-title'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_SAVE_TEXT = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-save-text'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCEL_TITLE = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-cancel-title'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCEL_TEXT = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-cancel-text'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCELALL_TITLE = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-cancelall-title'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_ACTIONS_CANCELALL_TEXT = "<?php echo $TEXT['js-draw-tool-edit-toolbar-actions-cancelall-text'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_EDIT = "<?php echo $TEXT['js-draw-tool-edit-toolbar-buttons-edit'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_EDITDISABLED = "<?php echo $TEXT['js-draw-tool-edit-toolbar-buttons-editDisabled'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_REMOVE = "<?php echo $TEXT['js-draw-tool-edit-toolbar-buttons-remove'] ?>";
        JS_DRAW_TOOL_EDIT_TOOLBAR_BUTTONS_REMOVEDISABLED = "<?php echo $TEXT['js-draw-tool-edit-toolbar-buttons-removeDisabled'] ?>";
        JS_DRAW_TOOL_EDIT_HANDLERS_EDIT_TOOLTIPS_TEXT = "<?php echo $TEXT['js-draw-tool-edit-handlers-edit-tooltips-text'] ?>";
        JS_DRAW_TOOL_EDIT_HANDLERS_EDIT_TOOLTIPS_SUBTEXT = "<?php echo $TEXT['js-draw-tool-edit-handlers-edit-tooltips-subtext'] ?>";
        JS_DRAW_TOOL_EDIT_HANDLERS_REMOVE_TOOLTIPS_TEXT = "<?php echo $TEXT['js-draw-tool-edit-handlers-remove-tooltips-text'] ?>";
        JS_DRAW_TOOL_TOOL_CENTER = "<?php echo $TEXT['js-draw-tool-center'] ?>";
        JS_DRAW_TOOL_TOOL_RADIUS = "<?php echo $TEXT['js-draw-tool-radius'] ?>";
        JS_DRAW_TOOL_TOOL_AREA = "<?php echo $TEXT['js-draw-tool-area'] ?>";
        JS_DRAW_TOOL_TOOL_DISTANCE = "<?php echo $TEXT['js-draw-tool-distance'] ?>";
    </script>
</head>

<body class="bg-gray-200">
    <!-- Mobile Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white h-full transform -translate-x-full ease-in-out transition-transform duration-200" id="sidebar">
        <!-- Sidebar content goes here -->
        <div class="sidebar fixed top-0 bottom-0 le:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900">
            <img src="https://clipart-library.com/image_gallery2/Deviantart-Logo-Transparent.png" width="200px" height="200px" class="m-auto">
            <div class="text-gray-100 text-sm">
                <h2 class="text-left mx-4 my-4 font-sans text-gray-300">
                    Main Menu</h2>
                <div class="flex my-2 mx-4 items-center space-x-2 px-8 py-2 rounded-md align-middle bg-gray-700 hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <h1 class="font-bold text-gray-200 text-[15]">Live Location</h1>
                </div>

                <div class="flex my-2 mx-4 items-center space-x-2 px-8 py-2 rounded-md align-middle bg-gray-700 hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    <h1 class="font-bold text-gray-200 text-[15]">K.M Summary</h1>
                </div>

                <div class="flex my-2 mx-4 items-center space-x-2 px-8 py-2 rounded-md align-middle bg-gray-700 hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>

                    <h1 class="font-bold text-gray-200 text-[15]">Travel Summary</h1>
                </div>

                <div class="flex my-2 mx-4 items-center space-x-2 px-8 py-2 rounded-md align-middle bg-gray-700 hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <h1 class="font-bold text-gray-200 text-[15]">Geofence</h1>
                </div>

                <h2 class="text-left mx-4 my-4 font-sans text-gray-300">
                    App</h2>

                <div class="flex my-2 mx-4 items-center space-x-2 px-8 py-2 rounded-md align-middle bg-gray-700 hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h1 class="font-bold text-gray-200 text-[15]">Settings</h1>
                </div>


                <div class="flex my-2 mx-4 items-center space-x-2 px-8 py-2 rounded-md align-middle bg-gray-700 hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    <h1 class="font-bold text-gray-200 text-[15]">Check RC</h1>
                </div>

                <div class="flex my-2 mx-4 items-center space-x-2 px-8 py-2 rounded-md align-middle bg-gray-700 hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>

                    <h1 class="font-bold text-gray-200 text-[15]">Logout</h1>
                </div>

                <h2 class="text-left mx-4 my-4 font-sans text-gray-300">
                    About</h2>

                <div class="flex my-2 mx-4 items-center space-x-2 px-8 py-2 rounded-md align-middle bg-gray-700 hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                    </svg>


                    <h1 class="font-bold text-gray-200 text-[15]">Contact Us</h1>
                </div>

                <div class="flex my-2 mx-4 items-center space-x-2 px-8 py-2 rounded-md align-middle bg-gray-700">
                    <h1 class="font-bold text-gray-200 text-[15]">Version 1.1.2</h1>
                </div>
            </div>
        </div>

    </div>

    <!-- Mobile Navbar -->
    <header class="bg-gray-800 w-100 fixed top-0 w-full py-4 px-6">
        <div class="flex items-center justify-between">
            <!-- Mobile Sidebar Toggle Button -->
            <button class="text-white md:hidden" onclick="toggleSidebar()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>

            <!-- Logo or Branding -->
            <a href="#" class="text-white text-2xl font-semibold">Dashboard</a>

            <button class="text-white md:hidden" onclick="toggleSearch()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>

            </button>

            <!-- Mobile Navbar Menu (optional) -->
            <nav class="hidden md:inline-flex">
                <ul class="space-x-4">
                    <li><a href="#" class="text-white">Home</a></li>
                    <li><a href="#" class="text-white">About</a></li>
                    <li><a href="#" class="text-white">Services</a></li>
                    <!-- Add more navigation links as needed -->
                </ul>
            </nav>
        </div>
    </header>

    <!-- Content -->
    <main class="p-4 bg-gray-900 mt-16 h-screen overflow-y-auto">
        <!--filter section-->
        <div class="overflow-x-auto flex space-x-2">
            <div class="p-2 max-w-sm mx-auto bg-white rounded-l-xl shadow-lg flex items-center space-x-4">
                <div>
                    <div class="text-xl font-medium text-black">ChitChat</div>
                </div>
            </div>
            <div class="p-2 max-w-sm mx-auto bg-white shadow-lg flex items-center space-x-4">
                <div>
                    <div class="text-xl font-medium text-black">ChitChat</div>
                </div>
            </div>
            <div class="p-2 max-w-sm mx-auto bg-white shadow-lg flex items-center space-x-4">
                <div>
                    <div class="text-xl font-medium text-black">ChitChat</div>
                </div>
            </div>
            <div class="p-2 max-w-sm mx-auto bg-white shadow-lg rounded-r-xl flex items-center space-x-4">
                <div>
                    <div class="text-xl font-medium text-black">ChitChat</div>
                </div>
            </div>
        </div>

        <!-- Your page content goes here -->
        <div class="p-6 my-4 max-w-sm mx-auto bg-gray-300 rounded-xl block shadow-lg items-center">
            <div class="flex">
                <div class="w-full m-auto">
                    <img class="h-24 gray-200" src="https://cdn.mos.cms.futurecdn.net/bS3rBkcg3PkPASSpHLfsSb.png" alt="ChitChat Logo">
                </div>
                <div class="text-left">
                    <div class="text-xl font-semibold text-black">MH31AD8174</div>
                    <div class="text-md italic text-black">Hansa Travels</div>


                    <p class="text-slate-500 mt-2 text-sm">1-14, Kamptee Rd. Teka Naka, Nagpur, Maharashtra, 440002, India</p>
                </div>
            </div>
            <div class="grid grid-cols-2 mt-4">
                <div class="m-2 text-sm">
                    <ul>
                        <li>Last Packet: </li>
                        <li>Today K.M : </li>
                        <li>Speed: </li>
                        <li>Fuel : </li>
                        <li>Since : </li>
                    </ul>
                </div>
                <div class="m-2 text-sm">
                    <ul>
                        <li>07/09/2023 12:21:28</li>
                        <li>28 KM</li>
                        <li>40 Km/H</li>
                        <li>12 Lt.</li>
                        <li>17Hr 12 Min</li>
                    </ul>
                </div>
            </div>
            <div class="flex justify-end space-x-5 mt-5">
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
                    </svg>
                </div>
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                    </svg>

                </div>
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>
                </div>
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                </div>
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="p-6 my-4 max-w-sm mx-auto bg-gray-300 rounded-xl block shadow-lg items-center">
            <div class="flex">
                <div class="w-full m-auto">
                    <img class="h-24 gray-200" src="https://cdn.mos.cms.futurecdn.net/bS3rBkcg3PkPASSpHLfsSb.png" alt="ChitChat Logo">
                </div>
                <div class="text-left">
                    <div class="text-xl font-semibold text-black">MH31AD8174</div>
                    <div class="text-md italic text-black">Hansa Travels</div>


                    <p class="text-slate-500 mt-2 text-sm">1-14, Kamptee Rd. Teka Naka, Nagpur, Maharashtra, 440002, India</p>
                </div>
            </div>
            <div class="grid grid-cols-2 mt-4">
                <div class="m-2 text-sm">
                    <ul>
                        <li>Last Packet: </li>
                        <li>Today K.M : </li>
                        <li>Speed: </li>
                        <li>Fuel : </li>
                        <li>Since : </li>
                    </ul>
                </div>
                <div class="m-2 text-sm">
                    <ul>
                        <li>07/09/2023 12:21:28</li>
                        <li>28 KM</li>
                        <li>40 Km/H</li>
                        <li>12 Lt.</li>
                        <li>17Hr 12 Min</li>
                    </ul>
                </div>
            </div>
            <div class="flex justify-end space-x-5 mt-5">
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
                    </svg>
                </div>
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                    </svg>

                </div>
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>
                </div>
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                </div>
                <div class="text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-white hover:border-2 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                </div>
            </div>
        </div>
    </main>

    <!-- JavaScript to toggle sidebar and close it when clicking outside -->
    <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('-translate-x-full');
        }

        // Close the sidebar when clicking outside of it
        document.addEventListener('mouseup', function(event) {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar.contains(event.target)) {
                sidebar.classList.add('-translate-x-full');
            }
        });
    </script>
</body>

</html>
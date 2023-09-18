<?php
header('Access-Control-Allow-Origin:*');
session_start();
include_once('lang.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $TEXT['navi-playback']?></title>
<link type="text/css" rel="stylesheet" href="css/button.css"/>
<link type="text/css" rel="Shortcut Icon" href="img/favicon.ico" />
<link type="text/css" rel="stylesheet" href="css/style.css?v=<?php echo $last_ver['style.css']?>" />
<link type="text/css" rel="stylesheet" href="css/timepicker.css" />
<link type="text/css" rel="stylesheet" href="css/jquery.trackbar.css" />
<link type="text/css" rel="stylesheet" href="css/jquery-ui.css"/>
<link type="text/css" rel="stylesheet" href="css/vanillaSelectBox.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/leaflet.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/MarkerCluster.css"/>
<!--<link type="text/css" rel="stylesheet" href="map/leaflet/MarkerCluster.Default.css"/>-->
<link type="text/css" rel="stylesheet" href="map/leaflet/leaflet-measure-path.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/Control.FullScreen.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/leaflet.measure.css"/>
<link type="text/css" rel="stylesheet" href="map/leaflet/RoutingMachine/leaflet-routing-machine.css"/>
<script type="text/javascript" src="js/jquery.min.js?v=<?php echo $last_ver['jquery.min.js']?>"></script>
<script type="text/javascript" src="js/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/jquery-dateFormat.min.js?>" ></script>
<script type='text/javascript' src="js/html2CSV.js"></script>
<script type='text/javascript' src="js/html2canvas.min.js"></script>
<script type='text/javascript' src="js/purify.min.js"></script>
<script type='text/javascript' src="js/jspdf.umd.min.js"></script>
<script type="text/javascript" src="js/common.js?v=<?php echo $last_ver['common.js']?>" ></script>
<script type="text/javascript" src="js/<?php echo $last_name['devicelist.js']?>?v=<?php echo $last_ver['devicelist.js']?>"></script>
<script type="text/javascript" src="js/timepicker.js?v=<?php echo $last_ver['timepicker.js']?>"></script>
<script type="text/javascript" src="js/vanillaSelectBox.js"></script>
<script type="text/javascript" src="js/playback.js?v=<?php echo $last_ver['playback.js']?>" ></script>
<script type="text/javascript" src="js/jquery.trackbar.js"></script>
<script type="text/javascript" src="map/leaflet/ext.leaflet.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.js"></script>
<script type="text/javascript" src="map/leaflet/proj4.js"></script>
<script type="text/javascript" src="map/leaflet/proj4leaflet.js"></script>
<!--<script type="text/javascript" src="map/leaflet/leaflet.rotatedMarker.js"></script>-->
<script type="text/javascript" src="map/leaflet/leaflet.movingRotatedMarker.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.motion.min.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.markercluster.js"></script>
<script type="text/javascript" src="map/leaflet/bing.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet-measure-path.js"></script>
<script type="text/javascript" src="map/leaflet/Leaflet.Editable.js"></script>
<script type="text/javascript" src="map/leaflet/Control.Geocoder.js"></script>
<script type="text/javascript" src="map/leaflet/Control.FullScreen.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet-image.js"></script>
<script type="text/javascript" src="map/leaflet/tileLayer.baidu.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.measure.js"></script>
<script type="text/javascript" src="map/leaflet/RoutingMachine/leaflet-routing-machine.min.js"></script>
<script type="text/javascript" src="map/leaflet/leaflet.polylineDecorator.js"></script>

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

<script type='text/javascript' src="js/highstock.js"></script>
<script type='text/javascript' src="js/exporting.js"></script>

<script type='text/javascript'>
JS_ROUTING_MACHINE_URL = "<?php echo $last_ver['routing_machine_url']?>";
JS_GOOGLE_TYPE = "<?php echo $last_ver['google_map_type']?>";
JS_GOOGLE_KEY = "<?php echo $last_ver['google_map_v3_key']?>";
JS_BING_KEY = "<?php echo $last_ver['bing_map_key']?>";
JS_MAPBOX_KEY = "<?php echo $last_ver['mapbox_map_key']?>";
JS_GOOGLE_MAP_BASE_LINK = "<?php echo $last_ver['google_map_base_link']?>";
JS_PLAY_TITLE = "<?php echo $TEXT['navi-playback']?>";
JS_STATUS_NODATA = "<?php echo $TEXT['status-nodata']?>";
JS_MAX_ITEMS = "<?php echo $TEXT['navi-chart-max-items']?>";
JS_BUTTON_PLAY = "<?php echo $TEXT['button-play']?>";
JS_BUTTON_STOP = "<?php echo $TEXT['button-stop']?>";
JS_CURRENT_LANG = "<?php echo $_SESSION['lang']?>";
JS_FULL_SCREEN="<?php echo $TEXT['js-full-screen']?>";
JS_DEFAULT_LNG = <?php echo $_SESSION['lng'] ?>;
JS_DEFAULT_LAT = <?php echo $_SESSION['lat'] ?>;
JS_DEFAULT_ZOOM = <?php echo $_SESSION['zoom'] ?>;
JS_DEFAULT_PAGE=<?php echo $_SESSION['page'] ?>;
JS_DEFAULT_SHOW=<?php echo $_SESSION['show'] ?>;
JS_DEFAULT_ZONE=<?php echo $_SESSION['zone'] ?>;
JS_DEFAULT_MARKER=<?php echo $_SESSION['marker'] ?>;
JS_SPEED_Y_TEXT = "<?php echo $TEXT['navi-speed-y-text']?>";
JS_LOCATION = "<?php echo $TEXT['js-tip-location']?>";
JS_SPEED = "<?php echo $TEXT['navi-speed']?>";
JS_FUEL = "<?php echo $TEXT['report-fuel']?>";
JS_ALTITUDE = "<?php echo $TEXT['navi-altitudechart']?>";
JS_IGNITION = "<?php echo $TEXT['navi-ignitionchart']?>";
JS_NAVI_CHART_FUEL_1 = "<?php echo $TEXT['navi-chart-fuel-1']?>";
JS_NAVI_CHART_TEMP_1 = "<?php echo $TEXT['navi-chart-temp-1']?>";
JS_DEFAULT_DATETIME_fmt_JS = "<?php echo $_SESSION['datetime_fmt_js']?>";
JS_START_POINT = "<?php echo $TEXT['navi-start-point']?>";
JS_END_POINT = "<?php echo $TEXT['navi-end-point']?>";
JS_STOP = "<?php echo $TEXT['navi-stop']?>";
JS_START = "<?php echo $TEXT['navi-start']?>";
JS_END = "<?php echo $TEXT['navi-end']?>";
JS_DURATION = "<?php echo $TEXT['navi-duration']?>";
JS_YES = "<?PHP echo $TEXT['js-yes']?>";
JS_NO = "<?PHP echo $TEXT['js-no']?>";
JS_TEMP = "<?PHP echo $TEXT['report-temp']?>";
JS_REFUEL = "<?php echo $TEXT['report-re-fuel']?>";
JS_SELECT = "<?php echo $TEXT['info-select']?>";
JS_SEARCH = "<?php echo $TEXT['info-search']?>";
JS_STEAL_FUEL = "<?php echo $TEXT['report-steal-fuel']?>";
JS_CHART_SELECT = "<?php echo $TEXT['navi-chart-select']?>"
JS_SELECTED = "<?php echo $TEXT['info-selected']?>";
JS_INFO_SELECT = "<?php echo $TEXT['info-select']?>"
JS_SELECT_ALL = "<?php echo $TEXT['info-select-all']?>"
JS_SELECT_ALL_ITEM = "<?php echo $TEXT['info-select-all-item']?>";
JS_SELECT_ITEMS = "<?php echo $TEXT['info-select-item']?>";
JS_SELECT_CLEAR_ALL = "<?php echo $TEXT['info-select-clear-all']?>";
JS_UNIT_DISTANCE = "<?php echo $_SESSION['unit_distance']?>";         //0:Kilometer(公里) 1:Mile(英里) 2:Nautical mile(海里)
JS_NAVI_DISTANCE = "<?php echo $TEXT['navi-distance'] ?>";
JS_NAVI_DIVTIME = "<?php echo $TEXT['navi-divtime'] ?>";
JS_NAVI_STOPTIME = "<?php echo $TEXT['navi-stoptime'] ?>";
JS_NAVI_AVSPEED = "<?php echo $TEXT['navi-avspeed'] ?>";
JS_NAVI_MAXSPEED = "<?php echo $TEXT['navi-maxspeed'] ?>";
JS_NAVI_IDLETIME = "<?php echo $TEXT['navi-idletime'] ?>";
JS_NAVI_DUTYTIME = "<?php echo $TEXT['navi-dutytime'] ?>";
JS_NAVI_SENSOR_FUEL_CONSUMPTION = "<?php echo $TEXT['navi-sensor-fuel-consumption'] ?>";
JS_NAVI_ESTIMATE_FUEL_CONSUMPTION = "<?php echo $TEXT['navi-estimate-fuel-consumption'] ?>";
JS_NAVI_CAN_FUEL_CONSUMPTION = "<?php echo $TEXT['navi-can-fuel-consumption'] ?>";
JS_REPORT_SPEEDING_DISTANCE = "<?php echo $TEXT['report-speeding-distance'] ?>";
JS_REPORT_SPEEDING_LAST_TIME = "<?php echo $TEXT['report-speeding-last-time'] ?>";
JS_REPORT_SPEEDING_COUNT = "<?php echo $TEXT['report-speeding-count'] ?>";
JS_REPORT_ENGINE_ON_COUNT = "<?php echo $TEXT['report-engine-on-count'] ?>";
JS_ENABLE_DISABLE_LABEL = "<?php echo $TEXT['js-enable-disable-label']?>";
JS_ENABLE_DISABLE_MARKER = "<?php echo $TEXT['js-enable-disable-marker']?>";
JS_ENABLE_DISABLE_ZONES = "<?php echo $TEXT['js-enable-disable-zones']?>";
JS_ENABLE_DISABLE_MEASURE = "<?php echo $TEXT['js-enable-disable-measure']?>";
JS_ENABLE_DISABLE_RULER = "<?php echo $TEXT['js-enable-disable-ruler']?>";
JS_ENABLE_DISABLE_ARROWS = "<?php echo $TEXT['js-enable-disable-arrows']?>";
JS_ENABLE_DISABLE_POINTS = "<?php echo $TEXT['js-enable-disable-points']?>";
JS_ENABLE_DISABLE_STOPS = "<?php echo $TEXT['js-enable-disable-stops']?>";
JS_ENABLE_DISABLE_EVENTS = "<?php echo $TEXT['js-enable-disable-events']?>";
JS_ENABLE_DISABLE_SNAP = "<?php echo $TEXT['js-enable-disable-snap']?>";
JS_ENABLE_DISABLE_ROUTE = "<?php echo $TEXT['js-enable-disable-route']?>";
JS_ENABLE_DISABLE_DRIVER = "<?php echo $TEXT['js-enable-disable-driver']?>";
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
html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-size: 12px; font-family: Arial, Tahoma; color:#000 !important; overflow: auto; }
#search_bar { position: absolute;  margin: 0;left: 0; top: 0px; width: 300px; bottom: 0; z-index: 2; border: 1px solid #369;  }
#search_bar li { list-style: none; text-decoration: none; padding: 0px;  }
#historymap { position: absolute; left: 306px; top: 0; right: 0; bottom: 206px; border: 1px solid #369;  }
#separation { position: absolute; left: 306px; right: 0; bottom: 198px; color: #000; border: none; text-align: center; }
#sepswitch { margin: 0 auto; height: 8px; width: 100%; cursor: pointer; }
#status { margin: 1px auto; line-height: 18px; color: #000; overflow-y: scroll; height: 102px; }
#hisstatus { position: absolute; left: 306px; right: 0; bottom: 0; height: 197px; color: #000; border: 1px solid #369; }
#tab_chart { position: absolute; margin: 0px auto; left: 0; right: 0; top: 22px; bottom: 0; line-height: 18px; color: #369; }
#select_chart { margin-left: 5px; margin-top: 4px; }
#chart_div { position: absolute; margin: 0px auto; left: 0; right: 0; top: 30px; bottom: 0; line-height: 18px; color: #369; }
#tab_speedchart { position: absolute; margin: 0px auto; left: 0; right: 0; top: 28px; bottom: 0; line-height: 18px; color: #369; }
#tab_ignitionchart { position: absolute; margin: 0px auto; left: 0; right: 0; top: 28px; bottom: 0; line-height: 18px; color: #369; }
#tab_fuelchart { position: absolute; margin: 0px auto; left: 0; right: 0; top: 28px; bottom: 0; line-height: 18px; color: #369; }
#tab_tempchart { position: absolute; margin: 0px auto; left: 0; right: 0; top: 28px; bottom: 0; line-height: 18px; color: #369; }
#tab_altitudechart { position: absolute; margin: 0px auto; left: 0; right: 0; top: 23px; bottom: 0; line-height: 18px; color: #369; }
#tab_movesdetail { position: absolute; margin: 0px auto; left: 0; right: 0; top: 23px; bottom: 0; line-height: 18px; color: #369; }
#tab_messages { position: absolute; margin: 0px auto; left: 0; right: 0; top: 23px; bottom: 0; line-height: 18px; color: #369; }

.speedcompassshow { position: absolute; right: 0px; bottom: 0px; width: 150px; height: 160px; border: 1px solid #369; z-index: 1;}
.speedcompasshide { position: absolute; right: 0px; bottom: 0px; width: 150px; height: 22px; border: 1px solid #369; z-index: 1;}
fieldset { border: 1px solid #999; margin: 2px; padding: 1px 4px 4px 4px;}
legend { color: #0275FF; font-weight: bold; line-height: 20px; }
#fieldset_pro { position: absolute; top: 345px; bottom: 0px; left: 0px; right: 0px; padding: 1px 0px 4px 0px;} 
.itext { margin: 3px 2px; width: 146px; height: 20px; border: 1px solid #999; font-size: 12px; line-height: 20px; font-weight: normal; }
.iselect { margin: 3px 2px; width: 152px; height: 24px; border: 1px solid #999;font-size: 12px; line-height: 24px; font-weight: normal; -webkit-appearance: menulist-button;}
.itime { background: #fff url(img/date.png) no-repeat right center; background-size: 16px 16px; }
.button { float: left; margin: 3px; width: 84px; height: 24px; }
.trackbar { border: 1px solid #ccc; height: 21px; margin-left: 4px; width: 260px; }
ul.list li label{ float: left; display: block; width: 112px; color: #000; line-height: 20px; margin: 4px auto;}
#tab_process { position: absolute; overflow-y: auto; overflow-x: auto; top: 26px; left: 6px; right: 6px; bottom: 0px; }
#tab_statistics { position: absolute; overflow-y: auto; overflow-x: auto; top: 26px; left: 6px; right: 6px; bottom: 0px; white-space: nowrap; }
ul.list li label.statistics{ float: left; display: block; width: 150px; color: #000; line-height: 20px; margin: 1px auto; }
ul.list li label.statisticsval{ float: right; display: block; width: 90px; color: #000; line-height: 20px; margin: 1px auto; }
.tab_report { width:100%; border-collapse: collapse; }
.tab_report th { border-left: 1px solid #ccc; background-color:#D5D5D5; font-size:12px; line-height:120%; font-weight:bold; padding:5px; text-align:left; position: sticky; top: 0; z-index: 1000; }
.tab_report td { border:1px solid #D5D5D5; font-size:10px; padding:1px; }
.tab_report td.fixed { color: #ccc; background: url(img/ajax-loader.gif) no-repeat 4px center; margin-left: 20px;}
.tab_report td.success {color: #0b0;}
.tab_report td.fail {color: #000;}
.tab_report tr.selected { background: #CAE8EA; color: #333; font-weight: normal; }
.tab_report tr.selected a{ color: #fff; }
.ui-autocomplete{ z-index: 11111; }
#tab_process tr { width: 100%; padding: 0px; height: 23px; }
#tab_process tr td{ width: 100%; margin: 0px; cursor:pointer; border-bottom: 1px solid #DDDDDD; }
#tab_process tr.active { background-color: #DDDDDD; }

#message_tool { height: 20px; margin-top: 1px; text-align:center; background-color: #D5D5D5; }
#tab_messages a { text-decoration: none; display: inline-block; padding: 1px 1px; }
#tab_messages a:hover { background-color: #F1F1F1; color: black; }
#page_first { width: 15px; }
#page_current { width: 30px; height: 12px; text-align: center; }
#table_messages_div { height: 148px; width: 100%; overflow:auto; }
#table_messages { table-layout:fixed; }
#table_messages td { overflow:hidden; white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; -moz-text-overflow: ellipsis; -webkit-text-overflow: ellipsis; }
#table_movesdetail td { overflow:hidden; white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; -moz-text-overflow: ellipsis; -webkit-text-overflow: ellipsis; }
.oddcolor { background-color: #EEE; }
</style>
<script type="text/javascript">
	$(function(){
		$(document).bind("click",function(e){
			var target = $(e.target);
			if(target.closest(".mnuOperat").length == 0 && target.closest("#export").length == 0){
				$(".mnuOperat").hide();
			}
		})
	})
	
	// 去掉所有input的autocomplete, 显示指定的除外 
	$(function(){ 								  
	   $('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off'); 	 
	});
</script>
</head>
<body onload="oninit();" onunload="onfree();">
<div id="search_bar">
    <ul class="list">
        <li>
            <fieldset>
                <legend>1.<?php echo $TEXT['info-searchinfo'] ?></legend>
                <label for="device">*<?php echo $TEXT['info-objectflag'] ?></label>
                <input id="device" type="text" class="itext" name="device" maxlength="30" />

                <label for="day">*<?php echo $TEXT['info-daterange'] ?></label>
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
                <div id="seltime" style="display: none;">
                    <label for="time1">*<?php echo $TEXT['info-starttime'] ?></label>
                    <input id="time1" type="text" autocomplete="off" class="itext itime" name="time1" maxlength="19" onclick="showcalendar(event, this, true)" />
                    <label for="time2">*<?php echo $TEXT['info-endtime'] ?></label>
                    <input id="time2" type="text" autocomplete="off" class="itext itime" name="time2" maxlength="19" onclick="showcalendar(event, this, true)" />
                </div>
				<label><?php echo $TEXT['info-stop-duration'] ?></label>
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
				<label><?php echo $TEXT['js-position-type'] ?></label>
				<select id="position_type" class="iselect" name="positiontype">
                    <option value='1' selected='selected'><?php echo $TEXT['js-position-type-gps'] ?></option>
                    <option value='2'><?php echo $TEXT['js-position-type-gps-lbs'] ?></option>
                </select>
				<label><?php echo $TEXT['js-playback-type'] ?></label>
				<select id="playback_type" class="iselect" name="playbacktype">
					<option value='1' selected='selected'><?php echo $TEXT['js-playback-type-track'] ?></option>
					<option value='2'><?php echo $TEXT['js-playback-type-track-route'] ?></option>
                    <option value='3' ><?php echo $TEXT['js-playback-type-track-route-statistics'] ?></option>
                </select>
				<!--<label><?php echo $TEXT['info-stops'] ?></label>
				<select id="stop_mark" class="iselect" name="stopmark">
					<option value='1' selected='selected'><?php echo $TEXT['js-yes'] ?></option>
                    <option value='2'><?php echo $TEXT['js-no'] ?></option>
				</select>
				<label><?php echo $TEXT['info-events'] ?></label>
				<select id="event_mark" class="iselect" name="eventmark">
					<option value='1' selected='selected'><?php echo $TEXT['js-yes'] ?></option>
                    <option value='2'><?php echo $TEXT['js-no'] ?></option>
				</select>-->
            </fieldset>
        </li>
        <li>
            <fieldset>
                <legend>2.<?php echo $TEXT['info-operatcmd'] ?></legend>
                <input id="search" type="button" class="small button" disabled title="<?php echo $TEXT['status-mapnotloaded'] ?>" value="<?php echo $TEXT['button-search'] ?>" />
                <input id="play" type="button" class="small button" disabled  value="<?php echo $TEXT['button-play'] ?>" />
                <input id="export" type="button" class="small button" disabled value="<?php echo $TEXT['button-export'] ?>" />
            </fieldset>
        </li>	
        <li>
            <fieldset>
                <legend>3.<?php echo $TEXT['info-playspeed'] ?></legend>
                <label for="speed">*<?php echo $TEXT['info-playspeed'] ?></label>
                <select id="speed" class="iselect" name="speed">
                    <option value='1000' selected='selected'><?php echo $TEXT['info-playspeed-normal'] ?></option>
                    <option value='500'><?php echo $TEXT['info-playspeed-quick'] ?></option>
                    <option value='100'><?php echo $TEXT['info-playspeed-fast'] ?></option>
                </select>
                
            </fieldset>
        </li>
        <li>
            <fieldset>
                <legend>4.<?php echo $TEXT['info-playtrack'] ?></legend>
                <div id="trackbar"></div>
            </fieldset>
        </li>
		
        <li>		
            <fieldset id="fieldset_pro">				
				<legend >5.<?php echo $TEXT['navi-targetstatus'] ?></legend>	
					<ul class="tabbar">		
						<li target="#tab_process" class="tab_active"><a href="#" title="<?php echo $TEXT['navi-his-process']?>"></a></li>
						<li target="#tab_statistics" ><a href="#" title="<?php echo $TEXT['navi-his-statistics']?>"></a></li>
					</ul>
					<div id="tab_process" class="tab_content"></div>
				
					<div id="tab_statistics" class="tab_content" >
						<label id="distance_text" class="statistics"><?php echo $TEXT['navi-distance'] ?></label>
						<label id="distance" class="statisticsval"></label><br>
						<label class="statistics"><?php echo $TEXT['navi-divtime'] ?></label>
						<label id="divtime" class="statisticsval"></label><br>
						<label class="statistics"><?php echo $TEXT['navi-stoptime'] ?></label>
						<label id="stoptime" class="statisticsval"></label><br>
						<label id="avspeed_text" class="statistics"><?php echo $TEXT['navi-avspeed'] ?></label>
						<label id="avspeed" class="statisticsval"></label><br>
						<label id="maxspeed_text" class="statistics"><?php echo $TEXT['navi-maxspeed'] ?></label>
						<label id="maxspeed" class="statisticsval"></label><br>
						<label class="statistics"><?php echo $TEXT['navi-idletime'] ?></label>
						<label id="idletime" class="statisticsval"></label><br>
						<label class="statistics"><?php echo $TEXT['navi-dutytime'] ?></label>
						<label id="dutytime" class="statisticsval"></label><br>
						<label id="sensorfuelconsumption_text" class="statistics"><?php echo $TEXT['navi-sensor-fuel-consumption'] ?></label>
						<label id="sensorfuelconsumption" class="statisticsval"></label><br>
						<label id="estimatefuelconsumption_text" class="statistics"><?php echo $TEXT['navi-estimate-fuel-consumption'] ?></label>
						<label id="estimatefuelconsumption" class="statisticsval"></label><br>
						<label id="canfuelconsumption_text" class="statistics"><?php echo $TEXT['navi-can-fuel-consumption'] ?></label>
						<label id="canfuelconsumption" class="statisticsval"></label><br>
						<label id="speedingdist_text" class="statistics"><?php echo $TEXT['report-speeding-distance'] ?></label>
						<label id="speedingdist" class="statisticsval"></label><br>
						<label class="statistics"><?php echo $TEXT['report-speeding-last-time'] ?>:</label>
						<label id="speedingtime" class="statisticsval"></label><br>
						<label class="statistics"><?php echo $TEXT['report-speeding-count'] ?>:</label>
						<label id="speedingcount" class="statisticsval"></label><br>
						<label class="statistics"><?php echo $TEXT['report-engine-on-count'] ?>:</label>
						<label id="enginecount" class="statisticsval"></label><br>
					</div>					
            </fieldset>			
        </li>
		<li style="display:none;">
            <fieldset>
                <legend>6.<?php echo $TEXT['navi-targetstatus'] ?></legend>
                <div id="status"></div>
            </fieldset>
        </li>
    </ul>
</div>
<div id="mnuOperat" class="mnuOperat" style="display: none;">
	<ul>
		<li id="export_xls" style="border-top:3px solid #2982D6; width: 150px; cursor: pointer;" onClick="doExport(1);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/xls.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-xls'] ?></a></li>
		<li id="export_pdf" style="width: 150px; cursor: wait;" onClick="exportPdf();"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/pdf.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-pdf'] ?></a></li>
		<li id="export_html" style="width: 150px; cursor: pointer;" onClick="doExport(3);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/html.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-html'] ?></a></li>
		<li id="export_csv" style="width: 150px; cursor: pointer;" onClick="doExport(4);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/csv.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-csv'] ?></a></li>
		<li id="export_doc" style="width: 150px; cursor: pointer;" onClick="doExport(5);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/doc.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-doc'] ?></a></li>
		<li id="export_txt" style="width: 150px; cursor: pointer;" onClick="doExport(6);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/txt.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-txt'] ?></a></li>
	</ul>
</div>
<!--map container-->
<div id="historymap">
    <span id="loadmapwait">loading map...</span>	
</div>
<div id="separation">
	<img id="sepswitch" alt="" src="img/down-arrow.svg"/>
</div>
<div id="hisstatus">	
	<ul class="tabbar">		
		<li target="#tab_chart" class="tab_active"><a href="#" title="<?php echo $TEXT['navi-chart']?>"></a></li>
		<!--<li target="#tab_ignitionchart" ><a href="#" title="<?php echo $TEXT['navi-ignitionchart']?>"></a></li>
		<li target="#tab_fuelchart" ><a href="#" title="<?php echo $TEXT['navi-fuelchart']?>"></a></li>
		<li target="#tab_tempchart" ><a href="#" title="<?php echo $TEXT['report-temp']?>"></a></li>
		<li target="#tab_altitudechart" ><a href="#" title="<?php echo $TEXT['navi-altitudechart']?>"></a></li>-->
		<li target="#tab_movesdetail"><a href="#" title="<?php echo $TEXT['navi-moves-detail']?>"></a></li>
		<li target="#tab_messages" ><a href="#" title="<?php echo $TEXT['navi-messages']?>"></a></li>
	</ul>
	<div id="tab_chart" class="tab_content">		
		<div id="select_chart"></div>
		<div id="chart_div"></div>
	</div>
	<!--<div id="tab_ignitionchart" class="tab_content"></div>
	<div id="tab_fuelchart" class="tab_content"></div>
	<div id="tab_tempchart" class="tab_content"></div>
	<div id="tab_altitudechart" class="tab_content"></div>-->
	<div id="tab_movesdetail" style="overflow:auto;" class="tab_content">
		<table id="table_movesdetail" class="tab_report">
            <thead>
                <tr>
                    <th width="4%"><?php echo $TEXT['report-no']?></th>
                    <th width="13%"><?php echo $TEXT['report-start']?></th>                    
					<th width="25%"><?php echo $TEXT['report-start-location']?></th>
					<th width="13%"><?php echo $TEXT['report-end']?></th>
					<th width="25%"><?php echo $TEXT['report-end-location']?></th>
					<th width="10%"><?php echo $TEXT['report-duration']?></th>
					<th width="10%"><?php echo $TEXT['navi-distance']?></th>
					<th width="10%" style='display:none'><?php echo $TEXT['report-maxspeed']?></th>
					<th width="10%" style='display:none'><?php echo $TEXT['report-divtime']?></th>
					<th width="10%" style='display:none'><?php echo $TEXT['report-idletime']?></th>
					<th width="10%" style='display:none'><?php echo $TEXT['navi-sensor-fuel-consumption']?></th>
					<th width="10%" style='display:none'><?php echo $TEXT['navi-estimate-fuel-consumption']?></th>
                </tr>
            </thead>
        </table>
	</div>
	<div id="tab_messages"  class="tab_content">
		<div id="table_messages_div">
			<table id="table_messages" class="tab_report">
				<thead>
					<tr>
						<th width="4%"><?php echo $TEXT['report-no']?></th>
						<th width="30%"><?php echo $TEXT['navi-targetstatus']?></th>                    
						<th width="8%"><?php echo $TEXT['js-gpsvalid']?></th>
						<th width="8%"><?php echo $TEXT['info-latitude']?></th>
						<th width="8%"><?php echo $TEXT['info-longitude']?></th>
						<th width="8%"><?php echo $TEXT['navi-speed']?></th>
						<th width="6%"><?php echo $TEXT['info-heading']?></th>
						<th width="10%"><?php echo $TEXT['info-gpstime']?></th>
						<th width="10%"><?php echo $TEXT['info-revtime']?></th>
					</tr>
				</thead>
			</table>
		</div>
		<div id="message_tool">
			<a href="#" id="page_first"><img src="../img/arrow-left2.svg" width="10px"></img></a>
			<a href="#" id="page_previous"><img src="../img/arrow-left.svg" width="10px"></img></a>
			<label><?php echo $TEXT['js-playback-msg-page']?></label>
			<input id="page_current"></input>
			<label><?php echo $TEXT['js-playback-msg-of']?></label>
			<label id="page_total"></label>
			<a id="page_next"><img src="../img/arrow-right.svg" width="10px"></img></a>
			<a id="page_end"><img src="../img/arrow-right2.svg" width="10px"></img></a>
			<select id="page_size">
				<option value='25'>25</option>
				<option value='50' selected='selected'>50</option>
				<option value='100'>100</option>
				<option value='200'>200</option>
				<option value='300'>300</option>
				<option value='400'>400</option>
				<option value='500'>500</option>
			</select>
		</div>
	</div>
</div>
<div id="speedcompass" class="speedcompassshow" style="display: none;">
	<h3><?php echo $TEXT['navi-speed_compass'] ?></h3>
	<span id='close' class='speedchart_min'></span>
	<div style="min-width: 130px; height: 138px; max-width: 150px; margin: 0 auto" class="content"></div>
</div>
</body>
</html>
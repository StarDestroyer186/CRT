<?php
session_start();
include_once('lang.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title><?php echo $TEXT['navi-manage'] ?></title>
    <link type="text/css" rel="stylesheet" href="css/button.css" />
    <link type="text/css" rel="stylesheet" href="css/style.css?v=<?php echo $last_ver['style.css']?>" />
    <link type="text/css" rel="stylesheet" href="css/tree.css?v=1.4" />
    <link type="text/css" rel="stylesheet" href="css/timepicker.css" />
    <link type="text/css" rel="stylesheet" href="css/jquery-ui.css" />
    <link type="text/css" rel="stylesheet" href="css/jquery-ui-timepicker-addon.css" />
    <link type="text/css" rel="stylesheet" href="css/jquery.multiselect.css" />
    <link type="text/css" rel="stylesheet" href="css/vanillaSelectBox.css" />
    <link type="text/css" rel="stylesheet" href="map/leaflet/leaflet.css" />
    <link type="text/css" rel="stylesheet" href="map/leaflet/MarkerCluster.css" />

    <!--<link type="text/css" rel="stylesheet" href="map/leaflet/MarkerCluster.Default.css"/>-->
    <link type="text/css" rel="stylesheet" href="map/leaflet/leaflet-measure-path.css" />
    <link type="text/css" rel="stylesheet" href="map/leaflet/Control.FullScreen.css" />
    <link type="text/css" rel="stylesheet" href="css/iconselect.css" />
    <link type="text/css" rel="stylesheet" href="map/leaflet/leaflet.measure.css" />
    <link type="text/css" rel="stylesheet" href="css/sortable.min.css" />
    <script type="text/javascript" src="js/jquery.min.js?v=<?php echo $last_ver['jquery.min.js']?>"></script>
    <script type="text/javascript" src="js/jquery-dateFormat.min.js?>"></script>
    <script type="text/javascript" src="js/common.js?v=<?php echo $last_ver['common.js']?>"></script>
    <script type="text/javascript" src="js/<?php echo $last_name['devicelist.js']?>?v=<?php echo $last_ver['devicelist.js']?>"></script>
    <script type="text/javascript" src="js/manage.js?v=<?php echo $last_ver['manage.js']?>"></script>
    <script type='text/javascript' src="js/jquery.tree.js?v=1.0"></script>
    <script type="text/javascript" src="js/jquery-ui-datepicker-min.js"></script>
    <script type="text/javascript" src="js/jquery-ui-timepicker-addon.js"></script>
    <script type="text/javascript" src="js/jquery-ui-datepicker-lang.js" charset="gb2312"></script>
    <script type="text/javascript" src="js/jquery-ui-timepicker-lang.js"></script>
    <script type="text/javascript" src="js/timepicker.js?v=<?php echo $last_ver['timepicker.js']?>"></script>
    <script type="text/javascript" src="js/jquery.multiselect.js"></script>
    <script type="text/javascript" src="js/vanillaSelectBox.js"></script>
    <script type='text/javascript' src="js/iconselect.js"></script>
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
    <script type="text/javascript" src="map/leaflet/tileLayer.baidu.js"></script>
    <script type="text/javascript" src="map/leaflet/leaflet.measure.js"></script>
    <script type="text/javascript" src="map/leaflet/RoutingMachine/leaflet-routing-machine.min.js"></script>
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
    <script type="text/javascript" src="js/jscolor.min.js"></script>
    <script type='text/javascript'>
      JS_ROUTING_MACHINE_URL = "<?php echo $last_ver['routing_machine_url']?>";
      JS_GOOGLE_TYPE = "<?php echo $last_ver['google_map_type']?>";
      JS_GOOGLE_KEY = "<?php echo $last_ver['google_map_v3_key']?>";
      JS_BING_KEY = "<?php echo $last_ver['bing_map_key']?>";
      JS_MAPBOX_KEY = "<?php echo $last_ver['mapbox_map_key']?>";
      JS_DEFAULT_DATE_FMT = "<?php echo $_SESSION['date_fmt_js']?>";
      JS_BROWSE_MODE = "<?php echo $TEXT['info-browsemode'] ?>";
      JS_APPEND_MODE = "<?php echo $TEXT['info-appendmode'] ?>";
      JS_MODIFY_MODE = "<?php echo $TEXT['info-modifymode'] ?>";
      JS_BUTTON_VIEW = "<?php echo $TEXT['button-view']?>";
      JS_BUTTON_MODIFY = "<?php echo $TEXT['button-modify']?>";
      JS_BUTTON_LOGIN_AS_USER = "<?php echo $TEXT['button-login-as-user']?>";
      JS_BUTTON_SERVICE = "<?php echo $TEXT['button-service']?>";
      JS_BUTTON_DELETE = "<?php echo $TEXT['button-delete']?>";
      JS_BUTTON_ERASE = "<?php echo $TEXT['button-erase']?>";
      JS_USER_INFO = "<?php echo $TEXT['navi-userinfo']?>";
      JS_DEVICE_INFO = "<?php echo $TEXT['info-objectinfo']?>";
      JS_EVENT_INFO = "<?php echo $TEXT['info-service-event-properties']?>";
      JS_SENSOR_INFO = "<?php echo $TEXT['info-service-sensor-properties']?>";
      JS_GROUP_INFO = "<?php echo $TEXT['info-groupinfo']?>";
      JS_CUSTOMER_INFO = "<?php echo $TEXT['info-customerinfo']?>";
      JS_DRIVER_INFO = "<?php echo $TEXT['info-driverinfo']?>";
      JS_GEO_INFO = "<?php echo $TEXT['info-placeinfo']?>";
      JS_PURVIEW_INFO = "<?php echo $TEXT['info-purviewinfo']?>";
      JS_TASK_INFO = "<?php echo $TEXT['info-taskinfo']?>";
      JS_NO_TASK = "<?php echo $TEXT['info-task-no-task']?>";
      JS_EXPENSE_INFO = "<?php echo $TEXT['info-expenseinfo']?>";
      JS_CREATE_SUCC = "<?php echo $TEXT['status-createsuccess']?>";
      JS_CREATE_FAIL = "<?php echo $TEXT['status-createfail']?>";
      JS_DELETE_SUCC = "<?php echo $TEXT['status-delsuccess']?>";
      JS_DELETE_FAIL = "<?php echo $TEXT['status-delfail']?>";
      JS_NO_PERMISSION = "<?php echo $TEXT['status-nopermission']?>";
      JS_GROUP_OPERATION_ERROR = "<?php echo $TEXT['status-group-operation-error']?>";
      JS_NOT_EXIST = "<?php echo $TEXT['status-not-exist']?>";
      JS_DELETE_ASSET_FIRST = "<?php echo $TEXT['status-delassetfirst']?>";
      JS_NO_GROUP_PARENT = "<?php echo $TEXT['no-group-parent']?>";
      JS_SAVE_SUCC = "<?php echo $TEXT['status-savesuccess']?>";
      JS_SAVE_FAIL = "<?php echo $TEXT['status-savefail']?>";
      JS_UPDATE_SUCC = "<?php echo $TEXT['status-updatesuccess']?>";
      JS_UPDATE_FAIL = "<?php echo $TEXT['status-updatefail']?>";
      JS_ERROR_TIP = "<?php echo $TEXT['status-errortip']?>";
      JS_PHOTO_SIZE_TIP = "<?php echo $TEXT['status-exceedphotosize']?>";
      JS_PHOTO_TYPE_TIP = "<?php echo $TEXT['status-phototypeerror']?>";
      JS_EXCEED_CAR = "<?php echo $TEXT['status-exceedcar']?>";
      JS_GROUP_PARENT_TIP = "<?php echo $TEXT['info-groupparenttips']?>";
      JS_GROUP_SELECT_TIP = "<?php echo $TEXT['info-groupselecttips']?>";
      JS_CURRENT_LANG = "<?php echo $_SESSION['lang']?>";
      JS_FULL_SCREEN = "<?php echo $TEXT['js-full-screen']?>";
      JS_DEFAULT_LNG = < ? php echo $_SESSION['lng'] ? > ;
      JS_DEFAULT_LAT = < ? php echo $_SESSION['lat'] ? > ;
      JS_DEFAULT_ZOOM = < ? php echo $_SESSION['zoom'] ? > ;
      JS_DEFAULT_PAGE = < ? php echo $_SESSION['page'] ? > ;
      JS_DEFAULT_SHOW = < ? php echo $_SESSION['show'] ? > ;
      JS_DEFAULT_ZONE = < ? php echo $_SESSION['zone'] ? > ;
      JS_DEFAULT_MARKER = < ? php echo $_SESSION['marker'] ? > ;
      JS_NOGEOALARM = "<?php echo $TEXT['info-nogeoalarm'] ?>";
      JS_INGEOALARM = "<?php echo $TEXT['info-ingeoalarm'] ?>";
      JS_OUTGEOALARM = "<?php echo $TEXT['info-outgeoalarm'] ?>";
      JS_BOTHGEOALARM = "<?php echo $TEXT['info-bothgeoalarm'] ?>";
      JS_NOT_ASSOCIATED = "<?php echo $TEXT['info-not-associated'] ?>";
      JS_ASSOCIATED = "<?php echo $TEXT['info-associated'] ?>";
      JS_DEVIATION = "<?php echo $TEXT['info-deviation'] ?>";
      JS_CIRCLE = "<?php echo $TEXT['info-circle'] ?>";
      JS_RECTANGLE = "<?php echo $TEXT['info-rectangle'] ?>";
      JS_POLYGON = "<?php echo $TEXT['info-polygon'] ?>";
      JS_MARKER = "<?php echo $TEXT['info-marker'] ?>";
      JS_POLYLINE = "<?php echo $TEXT['info-polyline'] ?>";
      JS_MALE = "<?php echo $TEXT['info-male'] ?>";
      JS_FEMALE = "<?php echo $TEXT['info-female'] ?>";
      JS_YES = "<?php echo $TEXT['js-yes'] ?>";
      JS_NO = "<?php echo $TEXT['js-no'] ?>";
      JS_PLACE_OVER = "<?php echo $TEXT['js-place-over'] ?>";
      JS_COLOR_THEME_COLORS = "<?php echo $TEXT['js-color-theme-colors']?>";
      JS_COLOR_STANDARD_COLORS = "<?php echo $TEXT['js-color-standard-colors']?>";
      JS_COLOR_WEB_COLORS = "<?php echo $TEXT['js-color-web-colors']?>";
      JS_COLOR_BACK_TO_PALETTE = "<?php echo $TEXT['js-color-back-to-palette']?>";
      JS_COLOR_HISTORY = "<?php echo $TEXT['js-color-history']?>";
      JS_COLOR_NO_HISTORY_YET = "<?php echo $TEXT['js-color-no-history-yet']?>";
      JS_MANAGE_MGRACCOUNT = "<?php echo $TEXT['manage-mgraccount']?>";
      JS_MANAGE_MGRCUSTOMER = "<?php echo $TEXT['manage-mgrcustomer']?>";
      JS_MANAGE_MGRVEHICLE = "<?php echo $TEXT['manage-mgrvehicle']?>";
      JS_MANAGE_MGRDRIVER = "<?php echo $TEXT['manage-mgrdriver']?>";
      JS_MANAGE_MGREXPENSE = "<?php echo $TEXT['manage-mgrexpense']?>";
      JS_INFO_SERVICE_EVENT_PARAMETERS_ITEM_ACC = "<?php echo $TEXT['info-service-event-parameters-item-acc']?>";
      JS_INFO_SERVICE_EVENT_PARAMETERS_ITEM_SPEED = "<?php echo $TEXT['info-service-event-parameters-item-speed']?>";
      JS_INFO_SERVICE_EVENT_PARAMETERS_ITEM_FUEL1 = "<?php echo $TEXT['info-service-event-parameters-item-fuel1']?>";
      JS_INFO_SERVICE_EVENT_PARAMETERS_ITEM_FUEL2 = "<?php echo $TEXT['info-service-event-parameters-item-fuel2']?>";
      JS_INFO_SERVICE_EVENT_PARAMETERS_ITEM_TEMP1 = "<?php echo $TEXT['info-service-event-parameters-item-temp1']?>";
      JS_INFO_SERVICE_EVENT_PARAMETERS_ITEM_TEMP2 = "<?php echo $TEXT['info-service-event-parameters-item-temp2']?>";
      JS_INFO_SERVICE_EVENT_PARAMETERS_ITEM_INNER_BATTERY = "<?php echo $TEXT['info-service-event-parameters-item-inner-battery']?>";
      JS_INFO_SERVICE_EVENT_PARAMETERS_ITEM_EXTERNAL_POWER = "<?php echo $TEXT['info-service-event-parameters-item-external-power']?>";
      JS_INFO_SERVICE_SENSOR_TARGET_ORIGINAL = "<?php echo $TEXT['info-service-sensor-target-original']?>";
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
      JS_SELECT = "<?php echo $TEXT['info-select']?>";
      JS_SEARCH = "<?php echo $TEXT['info-search']?>";
      JS_SELECTED = "<?php echo $TEXT['info-selected']?>";
      JS_SELECT_ALL = "<?php echo $TEXT['info-select-all']?>";
      JS_UNSELECT_ALL = "<?php echo $TEXT['info-unselect-all']?>";
      JS_INFO_SELECT = "<?php echo $TEXT['info-select']?>"
      JS_SELECT_ALL_ITEM = "<?php echo $TEXT['info-select-all-item']?>";
      JS_SELECT_ITEMS = "<?php echo $TEXT['info-select-item']?>";
      JS_SELECT_CLEAR_ALL = "<?php echo $TEXT['info-select-clear-all']?>";
      INFO_AUTO_ASSIGN = "<?php echo $TEXT['info-auto-assign']?>";
      INFO_DEVICE_STATUS_NORMAL = "<?php echo $TEXT['info-devicestatus-normal']?>";
      INFO_DEVICE_STATUS_IN_REPAIR = "<?php echo $TEXT['info-devicestatus-in-repair']?>";
      INFO_TASK_PRIORITY_LOW = "<?php echo $TEXT['info-task-priority-low']?>";
      INFO_TASK_PRIORITY_NORMAL = "<?php echo $TEXT['info-task-priority-normal']?>";
      INFO_TASK_PRIORITY_HIGHT = "<?php echo $TEXT['info-task-priority-hight']?>";
      INFO_TASK_STATUS_NEW = "<?php echo $TEXT['info-task-status-new']?>";
      INFO_TASK_STATUS_IN_PROGRESS = "<?php echo $TEXT['info-task-status-in-progress']?>";
      INFO_TASK_STATUS_COMPLETED = "<?php echo $TEXT['info-task-status-completed']?>";
      INFO_TASK_STATUS_FAIL = "<?php echo $TEXT['info-task-status-fail']?>";
    </script>
    <style type="text/css">
      html,
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-size: 12px;
        font-family: Arial, Tahoma;
        color: #000 !important;
        overflow: hidden;
      }
      #manage {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #999;
      }
      .tab_report {
        width: 100%;
        border-collapse: collapse;
      }
      .tab_report a {
        padding: 2px 4px;
      }
      .tab_report th {
        border-left: 1px solid #ccc;
        background-color: #D5D5D5;
        font-size: 12px;
        line-height: 120%;
        font-weight: bold;
        padding: 4px;
        text-align: left;
        position: sticky;
        top: 0;
        z-index: 1;
      }
      .tab_report td {
        border: 1px solid #D5D5D5;
        font-size: 12px;
        padding: 3px;
      }
      .tab_report tr.selected {
        background: #CAE8EA;
        color: #333;
        font-weight: normal;
      }
      .tab_report tr.selected a {
        color: #fff;
      }
      .search_bar {
        position: absolute;
        left: 4px;
        top: 28px;
        right: 4px;
        height: 32px;
        border: 1px solid #ccc;
        z-index: 1;
      }
      .user_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        left: 4px;
        top: 68px;
        right: 666px;
        bottom: 4px;
      }
      .group_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow: none;
        width: 300px;
        top: 68px;
        right: 360px;
        bottom: 4px;
      }
      .device_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        left: 4px;
        top: 68px;
        right: 360px;
        bottom: 4px;
      }
      .device_area table {
        table-layout: fixed;
      }
      .device_area td {
        word-wrap: break-word;
      }
      .customer_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        left: 4px;
        top: 68px;
        right: 360px;
        bottom: 4px;
      }
      .driver_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        left: 4px;
        top: 68px;
        right: 360px;
        bottom: 4px;
      }
      .place_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        left: 4px;
        top: 68px;
        width: 380px;
        bottom: 4px;
      }
      .task_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        left: 4px;
        top: 68px;
        right: 360px;
        bottom: 4px;
      }
      .expense_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        left: 4px;
        top: 68px;
        right: 360px;
        bottom: 4px;
      }
      .edit_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        width: 350px;
        top: 68px;
        right: 4px;
        bottom: 4px;
      }
      .purview_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        width: 370px;
        top: 68px;
        right: 4px;
        bottom: 4px;
      }
      .command_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow: none;
        width: 280px;
        top: 68px;
        right: 380px;
        bottom: 4px;
      }
      .event_search_bar {
        position: absolute;
        left: 10px;
        top: 60px;
        right: 10px;
        height: 32px;
        border: 1px solid #ccc;
        z-index: 1;
      }
      .sensor_search_bar {
        position: absolute;
        left: 10px;
        top: 60px;
        right: 10px;
        height: 32px;
        border: 1px solid #ccc;
        z-index: 1;
      }
      .event_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        left: 10px;
        top: 100px;
        right: 10px;
        bottom: 40px;
      }
      .service_place_area {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        overflow-y: scroll;
        left: 10px;
        top: 100px;
        right: 10px;
        bottom: 40px;
      }
      .place_map {
        position: absolute;
        margin: 0;
        border: 1px solid #999;
        left: 390px;
        top: 68px;
        right: 360px;
        bottom: 4px;
      }
      .oddcolor {
        background-color: #EEE;
      }
      .button {
        float: left;
        margin-top: 2px;
        height: 23px;
      }
      fieldset {
        border: 1px solid #999;
        margin: 2px;
        padding: 2px 6px 6px 6px;
      }
      legend {
        color: #0275FF;
        font-weight: bold;
        line-height: 20px;
      }
      .ilabel {
        margin: 2px;
        width: 200px;
        height: 20px;
        border: 1px solid #fff;
        font-size: 12px;
        line-height: 20px;
      }
      .itext {
        margin: 2px;
        width: 165px;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        font-weight: normal;
      }
      .iselect {
        margin: 1px 2px;
        width: 170px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        font-weight: normal;
        -webkit-appearance: menulist-button;
      }
      .icontent {
        margin: 1px 2px;
        width: 165px;
        height: 50px;
        font-size: 12px;
        line-height: 20px;
        font-weight: normal;
        overflow-y: auto;
      }
      .icheck {
        margin: 2px;
        margin-right: 150px;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        font-weight: normal;
      }
      .need {
        color: #f90;
      }
      .must {
        border: 1px solid #666;
        color: #000;
      }
      input[type=text]:disabled,
      select:disabled,
      textarea:disabled {
        background-color: #fff
      }
      .edit {
        color: #000;
      }
      .noedit {
        color: #999;
      }
      .enablebox {
        border: 1px solid #666;
        color: #000;
      }
      .disablebox {
        border: 1px solid #999;
        color: #999;
      }
      .invalidbox {
        border: 1px solid #f00;
        color: #333;
      }
      .valid {
        background: transparent url(img/user_online.png) no-repeat 8px center;
      }
      .stopped {
        background: transparent url(img/user_offline.png) no-repeat 8px center;
      }
      ul.list li label {
        float: left;
        display: inline;
        width: 125px;
        line-height: 20px;
        margin: 2px 8px 2px 2px;
        text-align: right;
      }
      ul.flat li {
        float: left;
        list-style: none;
        text-decoration: none;
        padding: 2px;
      }
      ul.flat li label {
        margin: auto 4px;
      }
      ul.extend li {
        float: right;
        list-style: none;
        text-decoration: none;
        line-height: 24px;
        margin: auto 4px;
        padding: 4px;
      }
      .dialog table td,
      .dialog p {
        white-space: nowrap;
      }
      .itime {
        background: #fff url(img/date.png) no-repeat right center;
        background-size: 16px 16px;
      }
      .icolor {
        margin: 2px;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        font-weight: normal;
      }
      .file_upload_box {
        position: relative;
      }
      .file_upload_box input[type=file] {
        opacity: 0;
        filter: alpha(opacity=0);
        height: 80px;
        width: 89px;
        position: absolute;
        top: 0;
        left: 125px;
        z-index: 9;
      }
      .device_status_in_repair {
        display: block;
        background: #f00;
        border-radius: 50%;
        width: 8px;
        height: 8px;
        top: 0px;
        right: 0px;
        position: absolute;
      }
      #event_time_table tr td {
        height: 20px;
        margin: 0px;
        padding: 0px;
      }
      #parameters_and_sensors tr th {
        text-align: center;
      }
      #parameters_and_sensors tr td {
        text-align: center;
      }
      #event_time_week_day {
        border-collapse: separate;
        border-spacing: 0px;
      }
      #event_time_week_day tr td {
        height: 10px;
        margin: 0px;
        padding: 0px;
        text-align: center;
      }
      #customized_event th {
        text-align: center;
      }
      #customized_event td {
        text-align: center;
        height: 20px;
      }
      .ui-autocomplete {
        z-index: 2000 !important;
      }
    </style>
    <script type="text/javascript">
      $(function() {
        $(document).bind("click", function(e) {
          var target = $(e.target);
          if (target.closest(".mnuOperat").length == 0 && target.closest("#export_usr").length == 0 && target.closest("#export_cust").length == 0 && target.closest("#export_dev").length == 0 && target.closest("#export_driver").length == 0 && target.closest("#export_expense").length == 0) {
            $(".mnuOperat").hide();
          }
        })
      })
      // È¥µôËùÓÐinputµÄautocomplete, ÏÔÊ¾Ö¸¶¨µÄ³ýÍâ 
      $(function() {
        $('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
      });
    </script>
    <script>
      // Here we can adjust defaults for all color pickers on page:
      jscolor.presets.default = {
        palette: [
          '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26', '#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
          '#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d', '#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
        ],
        //paletteCols: 12,
        //hideOnPaletteClick: true,
        //width: 271,
        //height: 151,
        //position: 'right',
        //previewPosition: 'right',
        //backgroundColor: 'rgba(51,51,51,1)', controlBorderColor: 'rgba(153,153,153,1)', buttonColor: 'rgba(240,240,240,1)',
      }
    </script>
  </head>
  <body onload="oninit();">
    <div id="manage">
      <div id="editmask"></div>
      <ul class="tabbar">
        <li target="#tab_mgraccount" onClick="tabChange(1);" class="tab_active">
          <a href="#" title="1.<?php echo $TEXT['manage-mgraccount']?>"></a>
        </li>
        <li target="#tab_useraccess" onClick="tabChange(5);">
          <a href="#" title="2.<?php echo $TEXT['manage-mgruseraccess']?>"></a>
        </li>
        <li target="#tab_mgrcustomer" onClick="tabChange(4);">
          <a href="#" title="3.<?php echo $TEXT['manage-mgrcustomer']?>"></a>
        </li>
        <li target="#tab_mgrvehicle" onClick="tabChange(2);">
          <a href="#" title="4.<?php echo $TEXT['manage-mgrvehicle']?>"></a>
        </li>
        <li target="#tab_mgrdriver" onClick="tabChange(6);">
          <a href="#" title="5.<?php echo $TEXT['manage-mgrdriver']?>"></a>
        </li>
        <li target="#tab_mgrplace" onClick="tabChange(3);">
          <a href="#" title="6.<?php echo $TEXT['manage-mgrplace']?>"></a>
        </li>
        <li target="#tab_mgrtask" onClick="tabChange(7);">
          <a href="#" title="7.<?php echo $TEXT['manage-mgrtask']?>"></a>
        </li>
        <li target="#tab_mgrexpense" onClick="tabChange(8);">
          <a href="#" title="8.<?php echo $TEXT['manage-mgrexpense']?>"></a>
        </li>
      </ul>

      <!--manage account-->
      <div id="tab_mgraccount" class="tab_content">
        <div class="search_bar">
          <ul class="flat">
            <li>
              <select id="mgraccount_item" class="iselect">
                <option value='1' selected='selected'><?php echo $TEXT['info-username'] ?></option>
                <option value='2'><?php echo $TEXT['login-account'] ?></option>
                <option value='3'><?php echo $TEXT['info-userphone'] ?></option>
              </select>
              <input id="mgraccount_cond" type="text" class="itext enablebox" maxlength="30" />
            </li>
            <li><input id="usr_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
            <li><input id="usr_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>" /></li>
            <li><input id="export_usr" type="button" class="small button" value="<?php echo $TEXT['button-export']?>" /></li>
            <li><input id="usr_tips" type="text" class="ilabel" readonly="readonly"></input></li>
          </ul>
        </div>
        <div class="user_area">
          <table id="usrlist" class="tab_report sortable">
            <thead>
              <tr>
                <th class="manage-header" width="5%"><?php echo $TEXT['info-order']?></th>
                <th class="manage-header" width="15%"><?php echo $TEXT['info-username']?></th>
                <th class="manage-header" width="10%"><?php echo $TEXT['info-available']?></th>
                <th class="manage-header" width="20%"><?php echo $TEXT['login-account']?></th>
                <th class="manage-header" width="15%"><?php echo $TEXT['info-userphone']?></th>
                <th class="manage-header" width="15%"><?php echo $TEXT['info-limitcar']?></th>
                <th class="manage-header no-sort" width="10%"><?php echo $TEXT['info-operate']?></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="group_area">
          <div style="background: #ccc;">
            <table>
              <tr>
                <td colspan="4"><span><?php echo $TEXT['info-groupinfo']?></span></td>
              </tr>
              <tr>
                <td><input id="serach_gname" type="text" class="itext enablebox" style="width: 100px; height: 18px" maxlength="20" /></td>
                <td><span><a style='padding-left: 20px;' title='<?php echo $TEXT['button-search']?>' class="operate_search" id="group_filter" href="#"></a></span></td>
                <td><span><a style='padding-left: 20px;' title='<?php echo $TEXT['info-addgroup']?>' class="operate_add" id="group_addnew" href="#"></a></span></td>
                <td><span><a style='padding-left: 20px;' title='<?php echo $TEXT['info-editgroup']?>' class="operate_edit" id="group_edit_btn" href="#"></a></span></td>
                <td><span><a style='padding-left: 20px;' title='<?php echo $TEXT['info-delgroup']?>' class="operate_delete" id="group_delete" href="#"></a></span></td>
              </tr>
            </table>
          </div>
          <div id="usr_group" style="position: absolute; top: 51px; bottom: 0; left: 0; right:0; overflow-y: auto;"></div>
        </div>
        <div id="usr_edit" class="edit_area">
          <ul class="list">
            <li>
              <fieldset>
                <legend>1.<?php echo $TEXT['info-accountinfo']?></legend>
                <input id="usrid" type="hidden" />
                <label id="luname" for="uname">*<?php echo $TEXT['info-username']?></label>
                <input id="uname" type="text" class="itext disablebox" name="uname" maxlength="50" />
                <label for="login">*<?php echo $TEXT['login-account']?></label>
                <input id="login" type="text" class="itext disablebox" name="login" maxlength="50" />
                <div id="usr_upass">
                  <label for="upass">*<?php echo $TEXT['login-password']?></label>
                  <input id="upass" type="password" class="itext disablebox" name="upass" maxlength="50" />
                </div>
                <label for="email"><?php echo $TEXT['info-email']?></label>
                <input id="email" type="text" class="itext disablebox" name="email" maxlength="100" />
                <label id="lvalid" for="valid"><?php echo $TEXT['info-available']?></label>
                <input id="valid" type="checkbox" class="icheck disablebox" name="valid" />
                <label for="uphone"><?php echo $TEXT['info-userphone']?></label>
                <input id="uphone" type="text" class="itext disablebox" name="upass" maxlength="16" / />
                <label id="lolimit" for="olimit">*<?php echo $TEXT['info-limitcar']?></label>
                <input id="olimit" type="text" class="itext disablebox" name="olimit" maxlength="16" />
              </fieldset>
            </li>
            <li class='emailopt'>
              <fieldset>
                <legend>2.<?php echo $TEXT['info-emailreportinfo']?></legend>
                <label for="rmail"><?php echo $TEXT['info-emailreport']?></label>
                <input id="rmail" type="checkbox" class="icheck disablebox" name="rmail" />
                <label for="rtime"><?php echo $TEXT['info-emailoffset']?></label>
                <input id="rtime" type="text" class="itext disablebox" name="rtime" maxlength="5" />
                <label for="rusagedy" style="margin-right: 10px;"><?php echo $TEXT['info-select-report']?></label>
                <select id="selectreport" name="selectreport" class="iselect" multiple size="0">
                  <option value="0_1_1"><?php echo $TEXT['info-usagedailyreport'] ?></option>
                  <option value="1_0_1"><?php echo $TEXT['info-usageweeklyreport'] ?></option>
                  <option value="2_0_1"><?php echo $TEXT['info-usagemonthlyreport'] ?></option>
                  <option value="0_0_2"><?php echo $TEXT['info-speeddailyreport'] ?></option>
                  <option value="0_0_3"><?php echo $TEXT['info-traveldailyreport'] ?></option>
                  <option value="0_1_4"><?php echo $TEXT['info-alarmdailyreport'] ?></option>

                  <!--<option value="0_1_10"><?php echo $TEXT['info-geodailyreport'] ?></option>-->
                  <option value="0_0_12"><?php echo $TEXT['info-refuelreport'] ?></option>
                  <option value="0_0_13"><?php echo $TEXT['info-stealfuelreport'] ?></option>
                  <option value="0_1_14"><?php echo $TEXT['info-maxspeeddailyreport'] ?></option>
                  <option value="0_1_15"><?php echo $TEXT['info-expirationreport'] ?></option>
                </select>
              </fieldset>
            </li>
            <li id="usr_operat">
              <fieldset>
                <legend>3.<?php echo $TEXT['info-operatcmd']?></legend>
                <ul class="flat">
                  <li>
                    <input id="usr_save" type="button" class="small button" disabled value="<?php echo $TEXT['button-save']?>" />
                  </li>
                  <li>
                    <input id="usr_update" type="button" class="small button" disabled value="<?php echo $TEXT['button-update']?>" />
                  </li>
                  <li>
                    <input id="usr_cancel" type="button" class="small button" disabled value="<?php echo $TEXT['button-cancel']?>" />
                  </li>
                </ul>
              </fieldset>
            </li>
          </ul>
        </div>
      </div>

      <!--manage user access-->
      <div id="tab_useraccess" class="tab_content">
        <div class="search_bar">
          <ul class="flat">
            <li>
              <select id="useraccess_item" class="iselect">
                <option value='1' selected='selected'><?php echo $TEXT['info-username'] ?></option>
                <option value='2'><?php echo $TEXT['login-account'] ?></option>
                <option value='3'><?php echo $TEXT['info-userphone'] ?></option>
              </select>
              <input id="useraccess_cond" type="text" class="itext enablebox" maxlength="30" />
            </li>
            <li><input id="pusr_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
          </ul>
        </div>
        <div class="user_area">
          <table id="pusrlist" class="tab_report sortable">
            <thead>
              <tr>
                <th width="5%"><?php echo $TEXT['info-order']?></th>
                <th width="15%"><?php echo $TEXT['info-username']?></th>
                <th width="10%"><?php echo $TEXT['info-available']?></th>
                <th width="20%"><?php echo $TEXT['login-account']?></th>
                <th width="15%"><?php echo $TEXT['info-userphone']?></th>
                <th width="15%"><?php echo $TEXT['info-limitcar']?></th>
                <th class="no-sort" width="10%"><?php echo $TEXT['info-operate']?></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="command_area">
          <div style="padding: 4px; background: #ccc;">
            <span><?php echo $TEXT['info-cmdinfo']?></span>
          </div>
          <div id="usr_cmd" style="position: absolute; top: 23px; bottom: 0; left: 0; right:0; overflow-y: auto;"></div>
        </div>
        <div id="purview_edit" class="purview_area">
          <ul class="list">
            <li id="p_3000">
              <fieldset>
                <legend>1.<?php echo $TEXT['manage-mgraccount']?></legend>
                <label id="account_add_l" for="account_add"><?php echo $TEXT['purview-add']?></label>
                <input id="account_add" type="checkbox" class="icheck disablebox" name="account_add" />
                <label id="account_eidt_l" for="account_eidt"><?php echo $TEXT['purview-edit']?></label>
                <input id="account_eidt" type="checkbox" class="icheck disablebox" name="account_eidt" />
                <label id="account_delete_l" for="account_delete"><?php echo $TEXT['purview-delete']?></label>
                <input id="account_delete" type="checkbox" class="icheck disablebox" name="account_delete" />
                <label id="account_email_l" for="account_email"><?php echo $TEXT['purview-email']?></label>
                <input id="account_email" type="checkbox" class="icheck disablebox" name="account_email" />
                <label id="group_edit_l" for="group_edit"><?php echo $TEXT['purview-group']?></label>
                <input id="group_edit" type="checkbox" class="icheck disablebox" name="group_edit" />
                <label id="access_edit_l" for="access_edit"><?php echo $TEXT['purview-access']?></label>
                <input id="access_edit" type="checkbox" class="icheck disablebox" name="access_edit" />
                <label id="cmd_edit_l" for="cmd_edit"><?php echo $TEXT['cmd-access']?></label>
                <input id="cmd_edit" type="checkbox" class="icheck disablebox" name="cmd_edit" />
              </fieldset>
            </li>
            <li id="p_2100">
              <fieldset>
                <legend>2.<?php echo $TEXT['manage-mgrcustomer']?></legend>
                <label id="cust_add_l" for="cust_add"><?php echo $TEXT['purview-add']?></label>
                <input id="cust_add" type="checkbox" class="icheck disablebox" name="cust_add" />
                <label id="cust_edit_l" for="cust_edit"><?php echo $TEXT['purview-edit']?></label>
                <input id="cust_edit" type="checkbox" class="icheck disablebox" name="cust_edit" />
                <label id="cust_delete_l" for="cust_delete"><?php echo $TEXT['purview-delete']?></label>
                <input id="cust_delete" type="checkbox" class="icheck disablebox" name="cust_delete" />
              </fieldset>
            </li>
            <li id="p_1000">
              <fieldset>
                <legend>3.<?php echo $TEXT['manage-mgrvehicle']?></legend>
                <label id="asset_add_l" for="asset_add"><?php echo $TEXT['purview-add']?></label>
                <input id="asset_add" type="checkbox" class="icheck disablebox" name="asset_add" />
                <label id="asset_edit_l" for="asset_edit"><?php echo $TEXT['purview-edit']?></label>
                <input id="asset_edit" type="checkbox" class="icheck disablebox" name="asset_edit" />
                <label id="asset_delete_l" for="asset_delete"><?php echo $TEXT['purview-delete']?></label>
                <input id="asset_delete" type="checkbox" class="icheck disablebox" name="asset_delete" />
                <label id="asset_expired_l" for="asset_expired"><?php echo $TEXT['purview-expired']?></label>
                <input id="asset_expired" type="checkbox" class="icheck disablebox" name="asset_expired" />
              </fieldset>
            </li>
            <li id="p_1300">
              <fieldset>
                <legend>4.<?php echo $TEXT['manage-mgrdriver']?></legend>
                <label id="driver_add_l" for="driver_add"><?php echo $TEXT['purview-add']?></label>
                <input id="driver_add" type="checkbox" class="icheck disablebox" name="driver_add" />
                <label id="driver_edit_l" for="driver_modify"><?php echo $TEXT['purview-edit']?></label>
                <input id="driver_modify" type="checkbox" class="icheck disablebox" name="driver_modify" />
                <label id="driver_delete_l" for="driver_delete"><?php echo $TEXT['purview-delete']?></label>
                <input id="driver_delete" type="checkbox" class="icheck disablebox" name="driver_delete" />
              </fieldset>
            </li>
            <li id="p_1700">
              <fieldset>
                <legend>5.<?php echo $TEXT['manage-mgrplace']?></legend>
                <label id="place_add_l" for="place_add"><?php echo $TEXT['purview-add']?></label>
                <input id="place_add" type="checkbox" class="icheck disablebox" name="place_add" />
                <label id="place_edit_l" for="place_modify"><?php echo $TEXT['purview-edit']?></label>
                <input id="place_modify" type="checkbox" class="icheck disablebox" name="place_modify" />
                <label id="place_delete_l" for="place_delete"><?php echo $TEXT['purview-delete']?></label>
                <input id="place_delete" type="checkbox" class="icheck disablebox" name="place_delete" />
              </fieldset>
            </li>
            <li id="p_1800">
              <fieldset>
                <legend>6.<?php echo $TEXT['manage-mgrtask']?></legend>
                <label id="task_add_l" for="task_add"><?php echo $TEXT['purview-add']?></label>
                <input id="task_add" type="checkbox" class="icheck disablebox" name="task_add" />
                <label id="task_edit_l" for="task_modify"><?php echo $TEXT['purview-edit']?></label>
                <input id="task_modify" type="checkbox" class="icheck disablebox" name="task_modify" />
                <label id="task_delete_l" for="task_delete"><?php echo $TEXT['purview-delete']?></label>
                <input id="task_delete" type="checkbox" class="icheck disablebox" name="task_delete" />
              </fieldset>
            </li>
            <li id="p_1900">
              <fieldset>
                <legend>7.<?php echo $TEXT['manage-mgrexpense']?></legend>
                <label id="expense_add_l" for="expense_add"><?php echo $TEXT['purview-add']?></label>
                <input id="expense_add" type="checkbox" class="icheck disablebox" name="expense_add" />
                <label id="expense_edit_l" for="expense_modify"><?php echo $TEXT['purview-edit']?></label>
                <input id="expense_modify" type="checkbox" class="icheck disablebox" name="expense_modify" />
                <label id="expense_delete_l" for="expense_delete"><?php echo $TEXT['purview-delete']?></label>
                <input id="expense_delete" type="checkbox" class="icheck disablebox" name="expense_delete" />
              </fieldset>
            </li>
            <li id="purview_operat">
              <fieldset>
                <legend>8.<?php echo $TEXT['info-operatcmd']?></legend>
                <ul class="flat">
                  <li>
                    <input id="purview_update" type="button" class="small button" disabled value="<?php echo $TEXT['button-update']?>" />
                  </li>
                  <li>
                    <input id="purview_cancel" type="button" class="small button" disabled value="<?php echo $TEXT['button-cancel']?>" />
                  </li>
                </ul>
              </fieldset>
            </li>
          </ul>
        </div>
      </div>

      <!--manage customer-->
      <div id="tab_mgrcustomer" class="tab_content">
        <div class="search_bar">
          <ul class="flat">
            <li>
              <select id="mgrcustomer_item" class="iselect">
                <option value='1' selected='selected'><?php echo $TEXT['info-custname'] ?></option>
                <option value='2'><?php echo $TEXT['info-fullname'] ?></option>
                <option value='3'><?php echo $TEXT['info-contactphone'] ?></option>
              </select>
              <input id="mgrcustomer_cond" type="text" class="itext enablebox" maxlength="30" />
            </li>
            <li><input id="cust_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
            <li><input id="cust_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>" /></li>
            <li><input id="export_cust" type="button" class="small button" value="<?php echo $TEXT['button-export']?>" /></li>
            <li><input id="cust_tips" type="text" class="ilabel" readonly="readonly"></input></li>
          </ul>
        </div>
        <div class="customer_area">
          <table id="customerlist" class="tab_report sortable">
            <thead>
              <tr>
                <th width="5%"><?php echo $TEXT['info-order']?></th>
                <th width="23%"><?php echo $TEXT['info-custname']?></th>
                <th width="23%"><?php echo $TEXT['info-fullname']?></th>
                <th width="23%"><?php echo $TEXT['info-contactphone']?></th>
                <th class="no-sort" width="10%"><?php echo $TEXT['info-operate']?></th>
              </tr>
            </thead>
          </table>
        </div>
        <div id="customer_edit" class="edit_area">
          <ul class="list">
            <li>
              <fieldset>
                <legend>1.<?php echo $TEXT['info-customerinfo']?></legend>
                <input id="custid" type="hidden" />
                <label id="lbnikname" for="nikname">*<?php echo $TEXT['info-custname']?></label>
                <input id="nikname" type="text" class="itext disablebox" name="nikname" maxlength="50" />
                <label id="lbfullname" for="fullname">*<?php echo $TEXT['info-fullname']?></label>
                <input id="fullname" type="text" class="itext disablebox" name="fullname" maxlength="50" />
                <label id="lbcustmphone" for="custmphone">*<?php echo $TEXT['info-contactphone']?></label>
                <input id="custmphone" type="text" class="itext disablebox" name="custmphone" maxlength="50" />
                <label for="custremark"><?php echo $TEXT['info-remark']?></label>
                <textarea id="custremark" class="icontent disablebox" name="remark" maxlength="200"></textarea>
              </fieldset>
            </li>
            <li id="customer_operat">
              <fieldset>
                <legend>2.<?php echo $TEXT['info-operatcmd']?></legend>
                <ul class="flat">
                  <li>
                    <input id="cust_save" type="button" class="small button" disabled value="<?php echo $TEXT['button-save']?>" />
                  </li>
                  <li>
                    <input id="cust_update" type="button" class="small button" disabled value="<?php echo $TEXT['button-update']?>" />
                  </li>
                  <li>
                    <input id="cust_cancel" type="button" class="small button" disabled value="<?php echo $TEXT['button-cancel']?>" />
                  </li>
                </ul>
              </fieldset>
            </li>
          </ul>
        </div>
      </div>

      <!--manage vehicle-->
      <div id="tab_mgrvehicle" class="tab_content">
        <div class="search_bar">
          <ul class="flat">
            <li>
              <select id="mgrvehicle_item" class="iselect">
                <option value='1' selected='selected'><?php echo $TEXT['info-objectflag'] ?></option>
                <option value='2'><?php echo $TEXT['info-deviceid'] ?></option>
                <option value='3'><?php echo $TEXT['info-simcard'] ?></option>
                <option value='4'><?php echo $TEXT['info-driver'] ?></option>
              </select>
              <input id="mgrvehicle_cond" type="text" class="itext enablebox" maxlength="30" />
            </li>
            <li><input id="dev_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
            <li><input id="dev_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>" /></li>
            <li><input id="export_dev" type="button" class="small button" value="<?php echo $TEXT['button-export']?>" /></li>
            <li><input id="dev_tips" type="text" class="ilabel" readonly="readonly"></input></li>
          </ul>

          <!--
            <ul class="extend">
                <li><a id="cust_addnew" href="#"><?php echo $TEXT['info-addcustomer']?></a></li>
            </ul>
			-->
        </div>
        <div class="device_area">
          <table id="devlist" class="tab_report sortable">
            <thead>
              <tr>
                <th width="4%"><?php echo $TEXT['info-order']?></th>
                <th width="12%"><?php echo $TEXT['info-objectflag']?></th>
                <th width="12%"><?php echo $TEXT['info-deviceid']?></th>
                <th width="12%"><?php echo $TEXT['info-simcard']?></th>
                <th width="10%"><?php echo $TEXT['info-driver']?></th>
                <th width="10%"><?php echo $TEXT['info-groupname']?></th>
                <th width="8%"><?php echo $TEXT['info-devicetype']?></th>
                <th width="5%"><?php echo $TEXT['info-timezone']?></th>
                <th class="no-sort" width="8%"><?php echo $TEXT['info-expiretime']?></th>
                <th class="no-sort" style="min-width:110px !important; width: 110px;"><?php echo $TEXT['info-operate']?></th>
              </tr>
            </thead>
          </table>
        </div>
        <div id="dev_edit" class="edit_area">
          <ul class="list">
            <li>
              <fieldset>
                <legend>1.<?php echo $TEXT['info-customerinfo']?></legend>
                <label id="lblcinfo" for="cinfo">*<?php echo $TEXT['info-customerinfo']?></label>
                <select id="cinfo" class="iselect" name="cinfo">
                </select>
              </fieldset>
            </li>
            <li>
              <fieldset>
                <legend>2.<?php echo $TEXT['info-groupinfo']?></legend>
                <label id="lblginfo" for="ginfo">*<?php echo $TEXT['info-groupname']?></label>
                <select id="ginfo" class="iselect" name="ginfo">
                </select>
              </fieldset>
            </li>
            <li>
              <fieldset>
                <legend>3.<?php echo $TEXT['info-objectinfo']?></legend>
                <div>
                  <label id="lblokind" for="okind">*<?php echo $TEXT['info-objectkind']?></label>
                  <div id="okind" style="margin-left: 137px;" name="okind"></div>
                </div>

                <!--
						 <select id="okind" class="iselect disablebox" name="okind">
                         </select>-->
                <label id="lbdlist" for="dlist">*<?php echo $TEXT['info-driver']?></label>
                <select id="dlist" class="iselect disablebox" name="dlist">
                </select>
                <label id="lbloflag" for="oflag">*<?php echo $TEXT['info-objectflag']?></label>
                <input id="oflag" type="text" class="itext disablebox" name="oflag" maxlength="50" />
                <label id="lbluflag" for="uflag"><?php echo $TEXT['info-usedefflag']?></label>
                <input id="uflag" type="text" class="itext disablebox" name="uflag" maxlength="50" />
                <label for="remark"><?php echo $TEXT['info-remark']?></label>
                <textarea id="remark" class="icontent disablebox" name="remark" maxlength="200"></textarea>
              </fieldset>
            </li>
            <li>
              <fieldset>
                <legend>4.<?php echo $TEXT['info-deviceinfo']?></legend>
                <label id="lbldtype" for="dtype">*<?php echo $TEXT['info-devicetype']?></label>
                <select id="dtype" class="iselect" name="dtype">
                </select>
                <label id="lbldstatus" for="dstate">*<?php echo $TEXT['info-devicestatus']?></label>
                <select id="dstate" class="iselect" name="dstate">
                </select>
                <div id="dev_devno">
                  <label id="lbldevno" for="devno">*<?php echo $TEXT['info-deviceid']?></label>
                  <input id="devno" type="text" class="itext disablebox" name="devno" maxlength="20" />
                </div>
                <label id="lblsimno" for="simno">*<?php echo $TEXT['info-simcard']?></label>
                <input id="simno" type="text" class="itext disablebox" name="simno" maxlength="20" />

                <!--Òþ²ØÉè±¸ÃÜÂë-->
                <label for="dpass" style="display:none;"><?php echo $TEXT['info-devicepass']?></label>
                <input id="dpass" style="display:none;" type="password" class="itext disablebox" name="dpass" maxlength="10" />
                <label for="ztime">*<?php echo $TEXT['info-timezone']?></label>
                <input id="ztime" type="text" class="itext disablebox" name="ztime" maxlength="6" />
                <div id="dev_stamp">
                  <label>*<?php echo $TEXT['info-installtime']?></label>
                  <input id="stamp" type="text" class="itext disablebox" maxlength="10" readonly='true' />
                </div>
                <label for="iaddr"><?php echo $TEXT['info-installaddr']?></label>
                <input id="iaddr" type="text" class="itext disablebox" name="iaddr" maxlength="64" />
                <div id="last_stamp">
                  <label>*<?php echo $TEXT['info-expiretime']?></label>
                  <input id="estamp" type="text" class="itext disablebox" maxlength="10" readonly='true' />
                </div>
              </fieldset>
            </li>
            <li id="dev_operat">
              <fieldset>
                <legend>5.<?php echo $TEXT['info-operatcmd']?></legend>
                <ul class="flat">
                  <li>
                    <input id="dev_save" type="button" class="small button" disabled value="<?php echo $TEXT['button-save']?>" />
                  </li>
                  <li>
                    <input id="dev_update" type="button" class="small button" disabled value="<?php echo $TEXT['button-update']?>" />
                  </li>
                  <li>
                    <input id="dev_cancel" type="button" class="small button" disabled value="<?php echo $TEXT['button-cancel']?>" />
                  </li>
                </ul>
              </fieldset>
            </li>
          </ul>
        </div>
      </div>

      <!--manage driver-->
      <div id="tab_mgrdriver" class="tab_content">
        <div class="search_bar">
          <ul class="flat">
            <li>
              <select id="mgrdriver_item" class="iselect">
                <option value='1' selected='selected'><?php echo $TEXT['info-driver'] ?></option>
                <option value='2'><?php echo $TEXT['info-workid'] ?></option>
                <option value='3'><?php echo $TEXT['info-driver-rfid'] ?></option>
                <option value='4'><?php echo $TEXT['info-driver-tel'] ?></option>
              </select>
              <input id="mgrdriver_cond" type="text" class="itext enablebox" maxlength="30" />
            </li>
            <li><input id="driver_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
            <li><input id="driver_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>" /></li>
            <li><input id="export_driver" type="button" class="small button" value="<?php echo $TEXT['button-export']?>" /></li>
            <li><input id="driver_tips" type="text" class="ilabel" readonly="readonly"></input></li>
          </ul>
        </div>
        <div class="driver_area">
          <table id="driverlist" class="tab_report sortable">
            <thead>
              <tr>
                <th width="5%"><?php echo $TEXT['info-order']?></th>
                <th width="16%"><?php echo $TEXT['info-driver']?></th>
                <th width="16%"><?php echo $TEXT['info-workid']?></th>
                <th width="16%"><?php echo $TEXT['info-driver-license']?></th>
                <th width="16%"><?php echo $TEXT['info-driver-rfid']?></th>
                <th width="16%"><?php echo $TEXT['info-driver-tel']?></th>
                <th class="no-sort" width="10%"><?php echo $TEXT['info-operate']?></th>
              </tr>
            </thead>
          </table>
        </div>
        <div id="driver_edit" class="edit_area">
          <ul class="list">
            <li>
              <fieldset>
                <legend>1.<?php echo $TEXT['info-driverinfo']?></legend>
                <input id="driverid" type="hidden" />
                <label id="lbworkid" for="workid">*<?php echo $TEXT['info-workid']?></label>
                <input id="workid" type="text" class="itext disablebox must" name="workid" maxlength="50" />
                <label id="lbdriver" for="driver">*<?php echo $TEXT['info-driver']?></label>
                <input id="driver" type="text" class="itext disablebox must" name="driver" maxlength="50" />
                <label id="lbsex" for="sex">*<?php echo $TEXT['info-sex']?></label>
                <select id="sex" class="iselect must" name="sex">
                </select>
                <label id="lbprimary" for="primary">*<?php echo $TEXT['info-primary-driver']?></label>
                <select id="primary" class="iselect must" name="primary">
                </select>
                <label id="lbidcard" for="idcard"><?php echo $TEXT['info-driver-id-card']?></label>
                <input id="idcard" type="text" class="itext disablebox" name="idcard" maxlength="50" />
                <label id="lblicense" for="license"><?php echo $TEXT['info-driver-license']?></label>
                <input id="license" type="text" class="itext disablebox" name="license" maxlength="50" />
                <label id="lblicenseissuedate" for="licenseissuedate"><?php echo $TEXT['info-license-issue-date']?></label>
                <input id="licenseissuedate" type="text" class="itext itime disablebox" name="licenseissuedate" maxlength="50" readonly='true' />
                <label id="lblicenseexpiredate" for="licenseexpiredate"><?php echo $TEXT['info-license-expire-date']?></label>
                <input id="licenseexpiredate" type="text" class="itext itime disablebox" name="licenseexpiredate" maxlength="50" readonly='true' />
                <label id="lbdrivertel" for="drivertel"><?php echo $TEXT['info-driver-tel']?></label>
                <input id="drivertel" type="text" class="itext disablebox" name="drivertel" maxlength="50" />
                <label id="lbdriverrfid" for="driverrfid">*<?php echo $TEXT['info-driver-rfid']?></label>
                <input id="driverrfid" type="text" class="itext disablebox must" name="driverrfid" maxlength="50" />
                <label id="lbdrivercompany" for="drivercompany"><?php echo $TEXT['info-driver-company']?></label>
                <input id="drivercompany" type="text" class="itext disablebox" name="drivercompany" maxlength="50" />
                <label id="lbdriveraddr" for="driveraddr"><?php echo $TEXT['info-driver-add']?></label>
                <input id="driveraddr" type="text" class="itext disablebox" name="driveraddr" maxlength="50" />
                <label id="lbdrivermark" for="drivermark"><?php echo $TEXT['info-remark']?></label>
                <textarea id="drivermark" class="icontent disablebox" name="drivermark" maxlength="200"></textarea>
                <label for="lbdriverph"><?php echo $TEXT['info-driver-photo']?></label>
                <div class="file_upload_box">
                  <input id="driverphbtn" type="file" accept="image/jpeg" onchange="readFile(this)" style="cursor: pointer;" name="driverphbtn" />
                  <img id="driverph" src="img/none driver.png" />
                </div>
              </fieldset>
            </li>
            <li id="driver_operat">
              <fieldset>
                <legend>2.<?php echo $TEXT['info-operatcmd']?></legend>
                <ul class="flat">
                  <li>
                    <input id="driver_save" type="button" class="small button" disabled value="<?php echo $TEXT['button-save']?>" />
                  </li>
                  <li>
                    <input id="driver_update" type="button" class="small button" disabled value="<?php echo $TEXT['button-update']?>" />
                  </li>
                  <li>
                    <input id="driver_cancel" type="button" class="small button" disabled value="<?php echo $TEXT['button-cancel']?>" />
                  </li>
                </ul>
              </fieldset>
            </li>
          </ul>
        </div>
      </div>

      <!--manage place-->
      <div id="tab_mgrplace" class="tab_content">
        <div class="search_bar">
          <ul class="flat">
            <li>
              <select id="mgrplace_item" class="iselect">
                <option value='1' selected='selected'><?php echo $TEXT['info-placename'] ?></option>
              </select>
              <input id="mgrplace_cond" type="text" class="itext enablebox" maxlength="30" />
            </li>
            <li><input id="mgrplace_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
            <li><input id="mgrplace_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>" /></li>
            <li><input id="place_tips" type="text" class="ilabel" readonly="readonly"></input></li>
          </ul>
        </div>
        <div class="place_area">
          <table id="placelist" class="tab_report sortable">
            <thead>
              <tr>
                <th width="5%"><?php echo $TEXT['info-order']?></th>
                <th width="26%"><?php echo $TEXT['info-placename']?></th>
                <th width="12%"><?php echo $TEXT['info-placetype']?></th>
                <th class="no-sort" width="10%"><?php echo $TEXT['info-operate']?></th>
              </tr>
            </thead>
          </table>
        </div>
        <div id="place_map" class="place_map"><span id="loadmapwait">loading map...</span></div>
        <div id="place_edit" class="edit_area">
          <ul class="list">
            <li>
              <fieldset>
                <legend>1.<?php echo $TEXT['info-placeinfo']?></legend>
                <label id="lbrpname" for="mgrplace_name">*<?php echo $TEXT['info-placename']?></label>
                <input id="mgrplace_name" type="text" class="itext disablebox must" name="mgrplace_name" maxlength="30" />
                <label id="lbrpcolor" for="mgrplace_color">*<?php echo $TEXT['info-placecolor']?></label>
                <input id="mgrplace_color" onChange="SetColor(this.jscolor)" type="text" class="icolor icolor disablebox must" name="mgrplace_color" maxlength="30" style="width: 127px;" value="006700" data-jscolor="{}" />
                <label id="lbrpenablespeed" for="mgrplace_enable_speed"><?php echo $TEXT['info-enable-speed-limit']?></label>
                <input id="mgrplace_enable_speed" type="checkbox" class="icheck disablebox" name="valid" />
                <label id="lbrpinsidespeed" for="mgrplace_inside_speed"><?php echo $TEXT['info-inside-speed-limit']?></label>
                <input id="mgrplace_inside_speed" type="text" class="itext disablebox" name="mgrplace_inside_speed" maxlength="30" />
              </fieldset>
            </li>
            <li id="place_operat">
              <fieldset>
                <legend>2.<?php echo $TEXT['info-operatcmd']?></legend>
                <ul class="flat">
                  <li>
                    <input id="place_save" type="button" class="small button" disabled value="<?php echo $TEXT['button-save']?>" />
                  </li>
                  <li>
                    <input id="place_update" type="button" class="small button" disabled value="<?php echo $TEXT['button-update']?>" />
                  </li>
                  <li>
                    <input id="place_cancel" type="button" class="small button" disabled value="<?php echo $TEXT['button-cancel']?>" />
                  </li>
                </ul>
              </fieldset>
            </li>
          </ul>
        </div>
      </div>

      <!--manage task-->
      <div id="tab_mgrtask" class="tab_content">
        <div class="search_bar">
          <ul class="flat">
            <li>
              <select id="mgrtask_item" class="iselect">
                <option value='1' selected='selected'><?php echo $TEXT['info-task-name'] ?></option>
                <option value='2'><?php echo $TEXT['info-objectflag'] ?></option>
              </select>
              <input id="mgrtask_cond" type="text" class="itext enablebox" maxlength="30" />
            </li>
            <li><input id="task_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
            <li><input id="task_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>" /></li>
            <li><input id="task_tips" type="text" class="ilabel" readonly="readonly"></input></li>
          </ul>
        </div>
        <div class="task_area">
          <table id="tasklist" class="tab_report sortable">
            <thead>
              <tr>
                <th width="3%"><?php echo $TEXT['info-order']?></th>
                <th width="14%"><?php echo $TEXT['info-task-name']?></th>
                <th width="14%"><?php echo $TEXT['info-objectflag']?></th>
                <th width="14%"><?php echo $TEXT['info-task-priority']?></th>
                <th width="14%"><?php echo $TEXT['info-task-status']?></th>
                <th width="14%"><?php echo $TEXT['info-task-start-place']?></th>
                <th width="14%"><?php echo $TEXT['info-task-end-place']?></th>
                <th class="no-sort" width="10%"><?php echo $TEXT['info-operate']?></th>
              </tr>
            </thead>
          </table>
        </div>
        <div id="task_edit" class="edit_area">
          <ul class="list">
            <li>
              <fieldset>
                <legend>1.<?php echo $TEXT['info-taskinfo']?></legend>
                <input id="taskid" type="hidden" />
                <label id="lbtaskname" for="taskname">*<?php echo $TEXT['info-task-name']?></label>
                <input id="taskname" type="text" class="itext disablebox must" name="taskname" maxlength="50" />
                <label id="lbtaskasset" for="taskasset">*<?php echo $TEXT['info-objectflag']?></label>
                <select id="taskasset" class="iselect must" name="taskasset">
                </select>
                <label id="lbtaskpriority" for="taskpriority">*<?php echo $TEXT['info-task-priority']?></label>
                <select id="taskpriority" class="iselect must" name="taskpriority">
                </select>
                <label id="lbtaskstatus" for="taskstatus">*<?php echo $TEXT['info-task-status']?></label>
                <select id="taskstatus" class="iselect must" name="taskstatus">
                </select>
                <label id="lbtaskstartp" for="taskstartp"><?php echo $TEXT['info-task-start-place']?></label>
                <select id="taskstartp" class="iselect must" name="taskstartp">
                </select>
                <label id="lbtaskstartf" for="taskstartf">*<?php echo $TEXT['info-task-start-from']?></label>
                <input id="taskstartf" type="text" class="itext itime must disablebox" name="taskstartf" maxlength="50" readonly='true' />
                <label id="lbtaskstartt" for="taskstartt">*<?php echo $TEXT['info-task-start-to']?></label>
                <input id="taskstartt" type="text" class="itext itime must disablebox" name="taskstartt" maxlength="50" readonly='true' />
                <label id="lbtaskendp" for="taskendp"><?php echo $TEXT['info-task-end-place']?></label>
                <select id="taskendp" class="iselect must" name="taskendp">
                </select>
                <label id="lbtaskendf" for="taskendf">*<?php echo $TEXT['info-task-end-from']?></label>
                <input id="taskendf" type="text" class="itext itime must disablebox" name="taskendf" maxlength="50" readonly='true' />
                <label id="lbtaskendt" for="taskendt">*<?php echo $TEXT['info-task-end-to']?></label>
                <input id="taskendt" type="text" class="itext itime must disablebox" name="taskendt" maxlength="50" readonly='true' />
                <label id="lbtaskrepeat" for="taskrepeat"><?php echo $TEXT['info-task-repeat-task']?></label>
                <input id="taskrepeat" type="checkbox" class="icheck disablebox" name="taskrepeat" />
                <label id="ldaysinterval" for="daysinterval"><?php echo $TEXT['info-task-days-interval']?></label>
                <input id="daysinterval" type="text" class="itext disablebox" name="daysinterval" maxlength="30" />
                <label id="lbtaskr" for="taskr"><?php echo $TEXT['info-remark']?></label>
                <textarea id="taskr" class="icontent disablebox" name="taskr" maxlength="200"></textarea>
              </fieldset>
            </li>
            <li id="task_operat">
              <fieldset>
                <legend>2.<?php echo $TEXT['info-operatcmd']?></legend>
                <ul class="flat">
                  <li>
                    <input id="task_save" type="button" class="small button" disabled value="<?php echo $TEXT['button-save']?>" />
                  </li>
                  <li>
                    <input id="task_update" type="button" class="small button" disabled value="<?php echo $TEXT['button-update']?>" />
                  </li>
                  <li>
                    <input id="task_cancel" type="button" class="small button" disabled value="<?php echo $TEXT['button-cancel']?>" />
                  </li>
                </ul>
              </fieldset>
            </li>
          </ul>
        </div>
      </div>

      <!--manage expense-->
      <div id="tab_mgrexpense" class="tab_content">
        <div class="search_bar">
          <ul class="flat">
            <li>
              <select id="mgrexpense_item" class="iselect">
                <option value='1' selected='selected'><?php echo $TEXT['info-expense-name'] ?></option>
                <option value='2'><?php echo $TEXT['info-objectflag'] ?></option>
              </select>
              <input id="mgrexpense_cond" type="text" class="itext enablebox" maxlength="30" />
            </li>
            <li><input id="expense_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
            <li><input id="expense_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>" /></li>
            <li><input id="export_expense" type="button" class="small button" value="<?php echo $TEXT['button-export']?>" /></li>
            <li><input id="expense_tips" type="text" class="ilabel" readonly="readonly"></input></li>
          </ul>
        </div>
        <div class="expense_area">
          <table id="expenselist" class="tab_report sortable">
            <thead>
              <tr>
                <th width="3%"><?php echo $TEXT['info-order']?></th>
                <th width="12%"><?php echo $TEXT['info-expense-date']?></th>
                <th width="12%"><?php echo $TEXT['info-expense-name']?></th>
                <th width="12%"><?php echo $TEXT['info-objectflag']?></th>
                <th width="12%"><?php echo $TEXT['info-expense-quantity']?></th>
                <th width="12%"><?php echo $TEXT['info-expense-cost']?></th>
                <th width="12%"><?php echo $TEXT['info-expense-supplier']?></th>
                <th width="12%"><?php echo $TEXT['info-expense-buyer']?></th>
                <th class="no-sort" width="10%"><?php echo $TEXT['info-operate']?></th>
              </tr>
            </thead>
          </table>
        </div>
        <div id="expense_edit" class="edit_area">
          <ul class="list">
            <li>
              <fieldset>
                <legend>1.<?php echo $TEXT['info-expenseinfo']?></legend>
                <input id="expense_oid" type="hidden" />
                <label id="lbexpensename" for="expensename">*<?php echo $TEXT['info-expense-name']?></label>
                <input id="expensename" type="text" class="itext disablebox must" name="expensename" maxlength="50" />
                <label id="lbexpensedate" for="expensedate">*<?php echo $TEXT['info-expense-date']?></label>
                <input id="expensedate" type="text" class="itext itime must disablebox" name="expensedate" maxlength="50" readonly='true' />
                <label id="lbexpenseasset" for="expenseasset">*<?php echo $TEXT['info-objectflag']?></label>
                <select id="expenseasset" class="iselect must" name="expenseasset">
                </select>
                <label id="lbexpensequantity" for="expensequantity">*<?php echo $TEXT['info-expense-quantity']?></label>
                <input id="expensequantity" type="text" class="itext disablebox must" name="expensequantity" maxlength="50" />
                <label id="lbexpensecost" for="expensecost">*<?php echo $TEXT['info-expense-cost']?></label>
                <input id="expensecost" type="text" class="itext disablebox must" name="expensecost" maxlength="50" />
                <label id="lbexpensesupplier" for="expensesupplier"><?php echo $TEXT['info-expense-supplier']?></label>
                <input id="expensesupplier" type="text" class="itext disablebox" name="expensesupplier" maxlength="50" />
                <label id="lbexpensebuyer" for="expensebuyer"><?php echo $TEXT['info-expense-buyer']?></label>
                <input id="expensebuyer" type="text" class="itext disablebox" name="expensebuyer" maxlength="50" />
                <label id="lbexpenseodometer" for="expenseodometer"><?php echo $TEXT['info-expense-odometer']?></label>
                <input id="expenseodometer" type="text" class="itext disablebox" name="expenseodometer" maxlength="50" />
                <label id="lbexpenseenghour" for="expenseenghour"><?php echo $TEXT['info-expense-engine-hours']?></label>
                <input id="expenseenghour" type="text" class="itext disablebox" name="expenseenghour" maxlength="50" />
                <label id="lexpenserm" for="expenserm"><?php echo $TEXT['info-expense-description']?></label>
                <textarea id="expenserm" class="icontent disablebox" name="expenserm" maxlength="200"></textarea>
              </fieldset>
            </li>
            <li id="expense_operat">
              <fieldset>
                <legend>2.<?php echo $TEXT['info-operatcmd']?></legend>
                <ul class="flat">
                  <li>
                    <input id="expense_save" type="button" class="small button" disabled value="<?php echo $TEXT['button-save']?>" />
                  </li>
                  <li>
                    <input id="expense_update" type="button" class="small button" disabled value="<?php echo $TEXT['button-update']?>" />
                  </li>
                  <li>
                    <input id="expense_cancel" type="button" class="small button" disabled value="<?php echo $TEXT['button-cancel']?>" />
                  </li>
                </ul>
              </fieldset>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!--new customer-->
    <div id="dlg_newcustomer" class="dialog" style="min-width: 200px;">
      <div class="out">
        <div class="in">
          <h3 onmousedown="dragstart('dlg_newcustomer', event)" onmousemove="dragmove(event)"><?php echo $TEXT['info-addcustomer']?></h3>
          <p><?php echo $TEXT['info-customerinfo']?></p>
          <div class="content">
            <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
              <tr>
                <td>*<?php echo $TEXT['info-custname']?></td>
                <td><input id="short_name" type="text" class="itext enablebox must" maxlength="50" /></td>
              </tr>
              <tr>
                <td>*<?php echo $TEXT['info-fullname']?></td>
                <td><input id="full_name" type="text" class="itext enablebox must" maxlength="100" /></td>
              </tr>
              <tr>
                <td>*<?php echo $TEXT['info-contactphone']?></td>
                <td><input id="cust_phone" type="text" class="itext enablebox must" maxlength="50" /></td>
              </tr>
              <tr>
                <td><?php echo $TEXT['info-remark']?></td>
                <td><textarea id="cust_remark" class="icontent enablebox" maxlength="256"></textarea></td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <input id="button_cancel" type="button" class="right small button" style="margin-left: 5px;" value="<?php echo $TEXT['button-cancel'] ?>" />
            <input id="button_ok" type="button" class="right small button" value="<?php echo $TEXT['button-ok'] ?>" />
          </div>
        </div>
      </div>
    </div>

    <!--new group-->
    <div id="dlg_newgroup" class="dialog" style="min-width: 200px;">
      <div class="out">
        <div class="in">
          <h3 onmousedown="dragstart('dlg_newgroup', event)" onmousemove="dragmove(event)"><?php echo $TEXT['info-groupinfo']?></h3>
          <p><?php echo $TEXT['info-newgrouptips']?><span id="parent"></span>&nbsp;<select id="parent_edit" class="iselect" style="width: 153px;"></select></p>
          <div class="content">
            <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
              <tr>
                <td>*<?php echo $TEXT['info-groupname']?></td>
                <td><input id="group_text" type="text" class="itext enablebox must" /></td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <input id="button_cancel" type="button" class="right small button" style="margin-left: 5px;" value="<?php echo $TEXT['button-cancel'] ?>" />
            <input id="button_ok" type="button" class="right small button" value="<?php echo $TEXT['button-ok'] ?>" />
          </div>
        </div>
      </div>
    </div>

    <!--delete confirm-->
    <div id="dlg_delconfirm" class="dialog" style="min-width: 300px;">
      <div class="out">
        <div class="in">
          <h3 onmousedown="dragstart('dlg_delconfirm', event)" onmousemove="dragmove(event)"><?php echo $TEXT['info-warning'] ?></h3>
          <div style="min-height: 20px;_height: 20px; padding: 15px 0px 10px 0px;">
            <span class="icon_warning" style="padding: 10px 15px 10px 55px;"><?php echo $TEXT['info-delwarning'] ?></span>
          </div>
          <div class="footer">
            <input id="button_cancel" type="button" class="right small button" style="margin-left: 5px;" value="<?php echo $TEXT['button-cancel'] ?>" />
            <input id="button_ok" type="button" class="right small button" value="<?php echo $TEXT['button-ok'] ?>" />
          </div>
        </div>
      </div>
    </div>
    <div id="dlg_services" class="dialog" style="min-width: 450px; _width: 550px;">
      <div class="out">
        <div class="in">
          <h3 onmousedown="dragstart('dlg_services', event)" onmousemove="dragmove(event)"><?php echo $TEXT['info-service-info'] ?></h3>
          <div class="content">
            <ul class="tabbar tab">
              <li target="#tab_baseservice" class="tab_active tab"><a href="#" class="tab" title="<?php echo $TEXT['info-service-main']?>"></a></li>
              <li target="#tab_event" class="tab"><a href="#" class="tab" title="<?php echo $TEXT['info-service-customized-event']?>"></a></li>
              <li target="#tab_accuracy" class="tab"><a href="#" class="tab" title="<?php echo $TEXT['info-service-accuracy']?>"></a></li>
              <li target="#tab_sensor" class="tab"><a href="#" class="tab" title="<?php echo $TEXT['info-service-sensor']?>"></a></li>
              <li target="#tab_maintenance" class="tab"><a href="#" class="tab" title="<?php echo $TEXT['info-maintenance-info']?>"></a></li>
              <li target="#tab_place" class="tab"><a href="#" class="tab" title="<?php echo $TEXT['info-place']?>"></a></li>
              <li target="#tab_notification" class="tab"><a href="#" class="tab" title="<?php echo $TEXT['info-notification']?>"></a></li>
            </ul>
            <div id="tab_baseservice" class="tab_content" style="height: 250px; width: 650px">
              <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                <tr>
                  <td id="speedalarm_text"><?php echo $TEXT['info-speed-alarm'] ?></td>
                  <td><input id="speedalarm" type="text" class="itext enablebox" /></td>
                  <td><?php echo $TEXT['info-idle-alarm'] ?></td>
                  <td><input id="idlealarm" type="text" class="itext enablebox" /></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-low-inner-battery'] ?></td>
                  <td><input id="innerbatlowalarm" type="text" class="itext enablebox" /></td>
                  <td><?php echo $TEXT['info-low-outer-battery'] ?></td>
                  <td><input id="outerbaylowalarm" type="text" class="itext enablebox" /></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-fatigue-driving'] ?></td>
                  <td><input id="fatiguedriving" type="text" class="itext enablebox" /></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-fob-driving-from'] ?></td>
                  <td><input id="allowdrivingfrom" type="text" class="itext itime enablebox" /></td>
                  <td><?php echo $TEXT['info-fob-driving-to'] ?></td>
                  <td><input id="allowdrivingto" type="text" class="itext itime enablebox" /></td>
                </tr>
                <tr>
                  <td id="allowtempfrom_text"><?php echo $TEXT['info-temp-alarm-low'] ?></td>
                  <td><input id="allowtempfrom" type="text" class="itext enablebox" /></td>
                  <td id="allowtempto_text"><?php echo $TEXT['info-temp-alarm-high'] ?></td>
                  <td><input id="allowtempto" type="text" class="itext enablebox" /></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-statetable'] ?></td>
                  <td>
                    <select id="statetable" name="statetable" class="iselect" multiple>
                      <option value="12293"><?php echo $TEXT['3005'] ?></option>
                      <option value="12294"><?php echo $TEXT['3006'] ?></option>
                      <option value="12289"><?php echo $TEXT['3001'] ?></option>
                      <option value="12290"><?php echo $TEXT['3002'] ?></option>
                      <option value="12295"><?php echo $TEXT['3007'] ?></option>
                      <option value="12296"><?php echo $TEXT['3008'] ?></option>
                      <option value="12310"><?php echo $TEXT['3016'] ?></option>
                      <option value="12311"><?php echo $TEXT['3017'] ?></option>
                      <option value="12299"><?php echo $TEXT['300B'] ?></option>
                      <option value="12313"><?php echo $TEXT['3019'] ?></option>
                      <option value="12314"><?php echo $TEXT['301A'] ?></option>
                      <option value="8197"><?php echo $TEXT['2005'] ?></option>
                      <option value="8205"><?php echo $TEXT['200D'] ?></option>
                      <option value="8206"><?php echo $TEXT['200E'] ?></option>
                      <option value="8207"><?php echo $TEXT['200F'] ?></option>
                      <option value="8208"><?php echo $TEXT['2010'] ?></option>
                      <option value="8209"><?php echo $TEXT['2011'] ?></option>
                      <option value="4170"><?php echo $TEXT['104A'] ?></option>
                      <option value="4171"><?php echo $TEXT['104B'] ?></option>
                      <option value="4173"><?php echo $TEXT['104D'] ?></option>
                      <option value="20482"><?php echo $TEXT['5002'] ?></option>
                      <option value="8210"><?php echo $TEXT['2012'] ?></option>
                      <option value="8211"><?php echo $TEXT['2013'] ?></option>
                      <option value="8212"><?php echo $TEXT['2014'] ?></option>
                      <option value="8213"><?php echo $TEXT['2015'] ?></option>
                      <option value="8214"><?php echo $TEXT['2016'] ?></option>
                      <option value="8215"><?php echo $TEXT['2017'] ?></option>
                      <option value="12319"><?php echo $TEXT['301F'] ?></option>
                      <option value="12320"><?php echo $TEXT['3020'] ?></option>
                    </select>
                  </td>
                  <td style="display: none;"><?php echo $TEXT['info-iotable'] ?></td>
                  <td style="display: none;"><input id="iotable" type="text" class="itext enablebox" /></td>
                </tr>
              </table>
            </div>
            <div id="tab_event" class="tab_content" style="display:none; height: 250px; width: 650px">
              <div class="event_search_bar">
                <ul class="flat">
                  <li class="tab">
                    <select id="mgrevent_item" class="iselect">
                      <option value='1' selected='selected'><?php echo $TEXT['info-service-event-name'] ?></option>
                    </select>
                    <input id="mgrevent_cond" type="text" class="itext enablebox" maxlength="30" />
                  </li>
                  <li class="tab"><input id="event_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
                  <li class="tab"><input id="event_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>" /></li>
                </ul>
              </div>
              <div class="event_area">
                <table id="customized_event" class="tab_report sortable">
                  <thead>
                    <tr>
                      <th width="3%"><?php echo $TEXT['info-order']?></th>
                      <th width="32%"><?php echo $TEXT['info-service-event-name']?></th>
                      <th width="10%"><?php echo $TEXT['info-service-event-active']?></th>
                      <th width="10%"><?php echo $TEXT['push-notification']?></th>
                      <th width="10%"><?php echo $TEXT['info-service-event-email']?></th>
                      <th width="10%"><?php echo $TEXT['info-service-event-sms']?></th>
                      <th width="10%"><?php echo $TEXT['info-service-event-telegram']?></th>
                      <th class="no-sort" width="13%"><?php echo $TEXT['info-operate']?></th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div id="tab_accuracy" class="tab_content" style="height: 250px; width: 650px">
              <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                <tr>
                  <td id="obdmileage-text"><?php echo $TEXT['info-obd-mileage'] ?></td>
                  <td><input id="obdmileage" type="text" class="itext enablebox" /></td>
                  <td><?php echo $TEXT['info-odometer-by'] ?></td>
                  <td><select id="odometer-by" class="iselect must" name="odometer-by">
                      <option value="0"><?php echo $TEXT['info-by-off'] ?></option>
                      <option selected="selected" value="1"><?php echo $TEXT['info-by-tracker'] ?></option>
                      <option value="2"><?php echo $TEXT['info-by-server'] ?></option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-engine-hour'] ?></td>
                  <td><input id="engine-hour" type="text" class="itext enablebox" /></td>
                  <td><?php echo $TEXT['info-engine-hour-by'] ?></td>
                  <td><select id="engine-hour-by" class="iselect must" name="engine-hour-by">
                      <option value="0"><?php echo $TEXT['info-by-off'] ?></option>
                      <option selected="selected" value="1"><?php echo $TEXT['info-by-tracker'] ?></option>
                      <option value="2"><?php echo $TEXT['info-by-server'] ?></option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td id="min-moving-speed-text"><?php echo $TEXT['info-min-moving-speed'] ?></td>
                  <td><input id="min-moving-speed" type="text" class="itext enablebox" /></td>
                  <td id="min-idle-speed-text"><?php echo $TEXT['info-min-idle-speed'] ?></td>
                  <td><input id="min-idle-speed" type="text" class="itext enablebox" /></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-asset-voltage'] ?></td>
                  <td><input id="asset-voltage" type="text" class="itext enablebox" /></td>
                  <td><?php echo $TEXT['info-detect-stops-using'] ?></td>
                  <td><select id="detect-stops-using" class="iselect must" name="detect-stops-using">
                      <option value="0"><?php echo $TEXT['info-detect-stops-using-gps'] ?></option>
                      <option value="1"><?php echo $TEXT['info-detect-stops-using-acc'] ?></option>
                      <option value="2"><?php echo $TEXT['info-detect-stops-using-gpsacc'] ?></option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td id="fuel-capacity-text"><?php echo $TEXT['info-fuel-capacity'] ?></td>
                  <td><input id="fuel-capacity" type="text" class="itext enablebox" /></td>
                  <td><?php echo $TEXT['info-fuel-upload-type'] ?></td>
                  <td><select id="fuel-upload-type" class="iselect must" name="fuel-upload-type">
                      <option value="0"><?php echo $TEXT['info-fuel-upload-liter'] ?></option>
                      <option value="1"><?php echo $TEXT['info-fuel-upload-per'] ?></option>
                      <option value="2"><?php echo $TEXT['info-fuel-upload-ad'] ?></option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-fuel-ad-points'] ?></td>
                  <td><input id="fuel-regressionLine" type="text" class="itext enablebox" placeholder="<?php echo $TEXT['info-fuel-ad-format'] ?>"></td>
                  <td id="fuel-fuel100km-text"><?php echo $TEXT['info-fuel-100-km'] ?></td>
                  <td><input id="fuel-fuel100km" type="text" class="itext enablebox"></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-clear-engine-hour'] ?></td>
                  <td><input id="clear-engine-hour" type="button" class="small button" value="<?php echo $TEXT['info-clear-button'] ?>" /></td>
                  <td><?php echo $TEXT['info-clear-odometer'] ?></td>
                  <td><input id="clear-odometer" type="button" class="small button" value="<?php echo $TEXT['info-clear-button'] ?>" /></td>
                </tr>
              </table>
            </div>
            <div id="tab_sensor" class="tab_content" style="display:none; height: 250px; width: 650px">
              <div class="sensor_search_bar">
                <ul class="flat">
                  <li class="tab">
                    <select id="mgrsensor_item" class="iselect">
                      <option value='1' selected='selected'><?php echo $TEXT['info-service-sensor-name'] ?></option>
                    </select>
                    <input id="mgrsensor_cond" type="text" class="itext enablebox" maxlength="30" />
                  </li>
                  <li class="tab"><input id="sensor_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
                  <li class="tab"><input id="sensor_addnew" type="button" class="small button" value="<?php echo $TEXT['button-addnew'] ?>" /></li>
                </ul>
              </div>
              <div class="event_area">
                <table id="sensor_list" class="tab_report sortable">
                  <thead>
                    <tr>
                      <th width="5%"><?php echo $TEXT['info-order']?></th>
                      <th width="25%"><?php echo $TEXT['info-service-sensor-name']?></th>
                      <th width="25%"><?php echo $TEXT['info-service-sensor-target']?></th>
                      <th width="25%"><?php echo $TEXT['info-service-sensor-element']?></th>
                      <th class="no-sort" width="15%"><?php echo $TEXT['info-operate']?></th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div id="tab_maintenance" class="tab_content" style="overflow:auto; display:none; height: 250px; width: 650px">
              <table border="0" cellpadding="0" cellspacing="0" align="left" style="padding: 0 10px">
                <tr align="left">
                  <th width="25%"><?php echo $TEXT['info-maintenance-item']?></th>
                  <th width="10%"><?php echo $TEXT['info-maintenance-enbale']?></th>
                  <th width="20%"><?php echo $TEXT['info-maintenance-value']?></th>
                  <th width="30%"><?php echo $TEXT['info-maintenance-name']?></th>
                  <th width="15%"><?php echo $TEXT['info-maintenance-last']?></th>
                </tr>
                <tr id="mil-maintenance">
                  <td id="mil-maintenance-text"><?php echo $TEXT['info-maintenance-mil'] ?></td>
                  <td><input id="mil-maintenance-enable" type="checkbox" class="icheckbox" name="enable_notification" /></td>
                  <td><input id="mil-maintenance-value" type="text" class="itext enablebox" style="width:80px;" /></td>
                  <td><input id="mil-maintenance-name" type="text" class="itext enablebox" style="width:140px;" /></td>
                  <td><input id="mil-maintenance-last" type="text" class="itext enablebox" style="width:140px;" /></td>
                  <td><input id="mil-maintenance-add" type="button" class="small button" style="margin-top:0px;" value="+" /></td>
                </tr>
                <tr id="eng-maintenance">
                  <td><?php echo $TEXT['info-maintenance-eng'] ?></td>
                  <td><input id="eng-maintenance-enable" type="checkbox" class="icheckbox" name="enable_notification" /></td>
                  <td><input id="eng-maintenance-value" type="text" class="itext enablebox" style="width:80px;" /></td>
                  <td><input id="eng-maintenance-name" type="text" class="itext enablebox" style="width:140px;" /></td>
                  <td><input id="eng-maintenance-last" type="text" class="itext enablebox" style="width:140px;" /></td>
                  <td><input id="eng-maintenance-add" type="button" class="small button" style="margin-top:0px;" value="+" /></td>
                </tr>
                <tr id="day-maintenance">
                  <td><?php echo $TEXT['info-maintenance-day'] ?></td>
                  <td><input id="day-maintenance-enable" type="checkbox" class="icheckbox" name="enable_notification" /></td>
                  <td><input id="day-maintenance-value" type="text" class="itext enablebox" style="width:80px;" /></td>
                  <td><input id="day-maintenance-name" type="text" class="itext enablebox" style="width:140px;" /></td>
                  <td><input id="day-maintenance-last" type="text" class="itext enablebox" style="width:140px; height: 20px;" readonly='true'></td>
                  <td><input id="day-maintenance-add" type="button" class="small button" style="margin-top:0px;" value="+" /></td>
                </tr>
              </table>
            </div>
            <div id="tab_place" class="tab_content" style="overflow:auto; display:none; height: 250px; width: 650px">
              <div class="place_search_bar">
                <ul class="flat">
                  <li class="tab">
                    <select id="service_place_item" class="iselect">
                      <option value='1' selected='selected'><?php echo $TEXT['info-placename'] ?></option>
                    </select>
                    <input id="service_place_cond" type="text" class="itext enablebox" maxlength="30" />
                  </li>
                  <li class="tab"><input id="service_place_search" type="button" class="small button" value="<?php echo $TEXT['button-search'] ?>" /></li>
                </ul>
              </div>
              <div class="service_place_area">
                <table id="service_place" class="tab_report sortable">
                  <thead>
                    <tr>
                      <th width="5%"><?php echo $TEXT['info-order']?></th>
                      <th width="20%"><?php echo $TEXT['info-placename']?></th>
                      <th width="20%"><?php echo $TEXT['info-placetype']?></th>
                      <th class="no-sort" width="55%"><?php echo $TEXT['info-rptype']?></th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div id="tab_notification" class="tab_content" style="display:none; height: 250px; width: 650px">
              <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                <tr>
                  <td><label><?php echo $TEXT['info-enable-notification']?></label></td>
                  <td align="left"><input id="enable_notification" type="checkbox" class="icheckbox" name="enable_notification" /></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['js-notification-email']?></td>
                  <td><input id="notification_email" type="text" class="itext enablebox" style="width:250px;" /><?php echo $TEXT['info-notification-email-hint']?></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['js-notification-sms']?></td>
                  <td><input id="notification_sms" type="text" class="itext enablebox" style="width:250px;" /><?php echo $TEXT['info-notification-sms-hint']?></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['js-notification-telegram']?></td>
                  <td><input id="notification_telegram" type="text" class="itext enablebox" style="width:250px;" /><?php echo $TEXT['info-notification-telegram-hint']?></td>
                </tr>
              </table>
            </div>
          </div>
          <div class="footer">
            <input id="button_cancel" type="button" class="right small button" style="margin-left: 5px;" value="<?php echo $TEXT['button-cancel'] ?>" />
            <input id="button_ok" type="button" class="right small button" value="<?php echo $TEXT['button-ok'] ?>" />
          </div>
        </div>
      </div>
    </div>
    <div id="dlg_event" class="dialog" style="min-width: 450px; _width: 700px;">
      <div class="out">
        <div class="in">
          <h3 onmousedown="dragstart('dlg_event', event)" onmousemove="dragmove(event)"><?php echo $TEXT['info-service-event-properties'] ?></h3>
          <div class="content">
            <ul class="tabbar tab">
              <li target="#tab_event_main" class="tab_active tab"><a href="#" class="tab" title="<?php echo $TEXT['info-service-event-main']?>"></a></li>
              <li target="#tab_event_time" class="tab"><a href="#" class="tab" title="<?php echo $TEXT['info-service-event-trigger']?>"></a></li>
              <li target="#tab_event_notification" class="tab"><a href="#" class="tab" title="<?php echo $TEXT['info-service-event-notification']?>"></a></li>
              <li target="#tab_event_control" class="tab"><a href="#" class="tab" title="<?php echo $TEXT['info-service-event-control']?>"></a></li>
            </ul>
            <div id="tab_event_main" class="tab_content" style="height: 300px; width: 700px">
              <table width="100%">
                <tr>
                  <td width="50%" valign="top">
                    <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                      <tr>
                        <td colspan=2 style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['info-service-event-title']?></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-event-active'] ?></td>
                        <td width="50%"><input id="event_active" type="checkbox" class="icheckbox" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-event-name'] ?></td>
                        <td width="50%"><input id="event_name" type="text" class="itext enablebox must" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-event-type'] ?></td>
                        <td>
                          <select id="event_type" class="iselect must">

                            <!--option value format = 
												-> event(dec), 
												-> relate IO(dec) 7: moving, 8: stopped, 66: speed, 104: idle, 
												-> relate type(1: time element(mins), 2: speed over element(km/h), 3: distance element(100meter)), 4: speed low element(km/h)
												-->
                            <option value="4097"><?php echo $TEXT['1001'] ?></option>
                            <option value="4099"><?php echo $TEXT['1003'] ?></option>
                            <option value="4100"><?php echo $TEXT['1004'] ?></option>
                            <option value="4101"><?php echo $TEXT['1005'] ?></option>
                            <option value="4102"><?php echo $TEXT['1006'] ?></option>
                            <option value="4103"><?php echo $TEXT['1007'] ?></option>
                            <option value="4105"><?php echo $TEXT['1009'] ?></option>
                            <option value="4107,66,2"><?php echo $TEXT['100B'] ?></option>
                            <option value="12326,66,4"><?php echo $TEXT['3026'] ?></option>
                            <option value="4110"><?php echo $TEXT['100E'] ?></option>
                            <option value="4111"><?php echo $TEXT['100F'] ?></option>
                            <option value="4114"><?php echo $TEXT['1012'] ?></option>
                            <option value="4131"><?php echo $TEXT['1023'] ?></option>
                            <option value="4163"><?php echo $TEXT['1043'] ?></option>
                            <option value="4165"><?php echo $TEXT['1045'] ?></option>
                            <option value="12318"><?php echo $TEXT['301E'] ?></option>
                            <option value="4183"><?php echo $TEXT['1057'] ?></option>
                            <option value="4166"><?php echo $TEXT['1046'] ?></option>
                            <option value="4167"><?php echo $TEXT['1047'] ?></option>
                            <option value="4168"><?php echo $TEXT['1048'] ?></option>
                            <option value="4174"><?php echo $TEXT['104E'] ?></option>
                            <option value="4175"><?php echo $TEXT['104F'] ?></option>
                            <option value="20483"><?php echo $TEXT['5003'] ?></option>
                            <option value="4129"><?php echo $TEXT['1021'] ?></option>
                            <option value="4130"><?php echo $TEXT['1022'] ?></option>
                            <option value="20482"><?php echo $TEXT['5002'] ?></option>
                            <option value="16407"><?php echo $TEXT['4017'] ?></option>
                            <option value="16408"><?php echo $TEXT['4018'] ?></option>
                            <option value="16409"><?php echo $TEXT['4019'] ?></option>
                            <option value="12293"><?php echo $TEXT['3005'] ?></option>
                            <option value="12294"><?php echo $TEXT['3006'] ?></option>
                            <option value="12289"><?php echo $TEXT['3001'] ?></option>
                            <option value="12290"><?php echo $TEXT['3002'] ?></option>
                            <option value="12295"><?php echo $TEXT['3007'] ?></option>
                            <option value="12296"><?php echo $TEXT['3008'] ?></option>
                            <option value="12310"><?php echo $TEXT['3016'] ?></option>
                            <option value="12311"><?php echo $TEXT['3017'] ?></option>
                            <option value="12299"><?php echo $TEXT['300B'] ?></option>
                            <option value="12313"><?php echo $TEXT['3019'] ?></option>
                            <option value="12314"><?php echo $TEXT['301A'] ?></option>
                            <option value="12324,7,1"><?php echo $TEXT['3024'] ?></option>
                            <option value="12325,8,1"><?php echo $TEXT['3025'] ?></option>
                            <option value="12328,104,1"><?php echo $TEXT['3028'] ?></option>
                            <option value="4164"><?php echo $TEXT['1044'] ?></option>
                            <option value="12327"><?php echo $TEXT['3027'] ?></option>
                            <option value="16432"><?php echo $TEXT['4030'] ?></option>
                            <option value="4151"><?php echo $TEXT['1037'] ?></option>
                            <option value="4152"><?php echo $TEXT['1038'] ?></option>
                            <option value="4153"><?php echo $TEXT['1039'] ?></option>
                            <option value="4180"><?php echo $TEXT['1054'] ?></option>
                            <option value="4181"><?php echo $TEXT['1055'] ?></option>
                            <option value="4182"><?php echo $TEXT['1056'] ?></option>
                            <option value="8197"><?php echo $TEXT['2005'] ?></option>
                            <option value="8205"><?php echo $TEXT['200D'] ?></option>
                            <option value="8206"><?php echo $TEXT['200E'] ?></option>
                            <option value="8207"><?php echo $TEXT['200F'] ?></option>
                            <option value="8208"><?php echo $TEXT['2010'] ?></option>
                            <option value="8209"><?php echo $TEXT['2011'] ?></option>
                            <option value="4170"><?php echo $TEXT['104A'] ?></option>
                            <option value="4171"><?php echo $TEXT['104B'] ?></option>
                            <option value="4173"><?php echo $TEXT['104D'] ?></option>
                            <option value="20482"><?php echo $TEXT['5002'] ?></option>
                            <option value="8210"><?php echo $TEXT['2012'] ?></option>
                            <option value="8211"><?php echo $TEXT['2013'] ?></option>
                            <option value="8212"><?php echo $TEXT['2014'] ?></option>
                            <option value="8213"><?php echo $TEXT['2015'] ?></option>
                            <option value="8214"><?php echo $TEXT['2016'] ?></option>
                            <option value="8215"><?php echo $TEXT['2017'] ?></option>
                            <option value="12319"><?php echo $TEXT['301F'] ?></option>
                            <option value="12320"><?php echo $TEXT['3020'] ?></option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-event-depending-place'] ?></td>
                        <td>
                          <select id="event_depending_place" class="iselect place_related">
                            <option value="0"><?php echo $TEXT['info-service-event-depending-place-off'] ?></option>
                            <option value="1"><?php echo $TEXT['info-service-event-in-place'] ?></option>
                            <option value="2"><?php echo $TEXT['info-service-event-out-place'] ?></option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-event-place'] ?></td>
                        <td>
                          <select id="event_place" class="iselect tab place_related" style="height: 24px;" multiple="multiple"></select>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-event-time-period'] ?></td>
                        <td width="50%"><input id="event_time_period" type="text" class="itext enablebox time_related" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><label id="event_speed_limit_text"><?php echo $TEXT['info-service-event-speed-limit'] ?></label></td>
                        <td width="50%"><input id="event_speed_limit" type="text" class="itext enablebox speed_related" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><label id="event_distance_text"><?php echo $TEXT['info-service-event-distance'] ?></label></td>
                        <td width="50%"><input id="event_distance" type="text" class="itext enablebox distance_related" /></td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" valign="top">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                      <tr>
                        <td style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['info-service-event-parameters-and-sensors']?></td>
                      </tr>
                      <tr>
                        <td>
                          <div style="overflow-y: scroll; height: 210px; width: 100%; border-bottom: 1px solid #DDDDDD;;">
                            <table id="parameters_and_sensors" class="tab_report param_related">
                              <thead>
                                <tr>
                                  <th width="30%"><?php echo $TEXT['info-service-event-parameters-source']?></th>
                                  <th width="10%"></th>
                                  <th width="30%"><?php echo $TEXT['info-service-event-parameters-value']?></th>
                                  <th width="10%"></th>
                                </tr>
                              </thead>
                              <tbody></tbody>
                            </table>
                          </div>
                          <table>
                            <tr>
                              <td>
                                <select id="event_parameters_item" class="iselect param_related" style="width: 100px;">
                                </select>
                              </td>
                              <td>
                                <select id="event_parameters_symbol" class="iselect param_related" style="width: 50px;">
                                  <option value="-1"></option>
                                  <option value="0">=</option>
                                  <option value="1">></option>
                                  <option value="2">
                                    << /option>

                                      <!--<option value="3">>&#37;</option>
															<option value="4"><&#37;</option>-->
                                  <option value="5">&#934;</option>
                                </select>
                              </td>
                              <td><input id="event_parameters_value" type="text" class="itext param_related" style="width: 50px;" /></td>
                              <td><input id="event_parameters_add" type="button" class="small button param_related" style="margin-top:0px;" value="+" /></td>
                            </tr>
                          </table>
                        <td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
            <div id="tab_event_time" class="tab_content" style="display: none; height: 300px; width: 700px">
              <table id="event_time_table" width="100%">
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-duration'] ?></td>
                  <td width="50%"><input id="event_time_duration" type="checkbox" class="icheckbox" /><input id="event_time_duration_value" type="text" class="itext" style="width: 50px;" /></td>
                </tr>
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-week-days'] ?></td>
                  <td>
                    <table id='event_time_week_day'>
                      <tr>
                        <td>M</td>
                        <td>T</td>
                        <td>W</td>
                        <td>T</td>
                        <td>F</td>
                        <td>S</td>
                        <td>S</td>
                      </tr>
                      <tr>
                        <td><input id="event_time_week_day_mon" type="checkbox" class="icheckbox" /></td>
                        <td><input id="event_time_week_day_tue" type="checkbox" class="icheckbox" /></td>
                        <td><input id="event_time_week_day_wed" type="checkbox" class="icheckbox" /></td>
                        <td><input id="event_time_week_day_thu" type="checkbox" class="icheckbox" /></td>
                        <td><input id="event_time_week_day_fri" type="checkbox" class="icheckbox" /></td>
                        <td><input id="event_time_week_day_sat" type="checkbox" class="icheckbox" /></td>
                        <td><input id="event_time_week_day_sun" type="checkbox" class="icheckbox" /></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-daytime-enable'] ?></td>
                  <td width="50%"><input id="event_time_daytime_enable" type="checkbox" class="icheckbox" /></td>
                </tr>
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-monday'] ?></td>
                  <td width="50%">
                    <input id="event_time_daytime_mon_enable" type="checkbox" class="icheckbox daytime" />
                    <select id="event_time_daytime_monday_from" class="iselect daytime" style="width: 60px;"></select>
                    <select id="event_time_daytime_monday_to" class="iselect daytime" style="width: 60px;"></select>
                  </td>
                </tr>
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-tuesday'] ?></td>
                  <td width="50%">
                    <input id="event_time_daytime_tue_enable" type="checkbox" class="icheckbox daytime" />
                    <select id="event_time_daytime_tuesday_from" class="iselect daytime" style="width: 60px;"></select>
                    <select id="event_time_daytime_tuesday_to" class="iselect daytime" style="width: 60px;"></select>
                  </td>
                </tr>
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-wednesday'] ?></td>
                  <td width="50%">
                    <input id="event_time_daytime_wed_enable" type="checkbox" class="icheckbox daytime" />
                    <select id="event_time_daytime_wednesday_from" class="iselect daytime" style="width: 60px;"></select>
                    <select id="event_time_daytime_wednesday_to" class="iselect daytime" style="width: 60px;"></select>
                  </td>
                </tr>
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-thursday'] ?></td>
                  <td width="50%">
                    <input id="event_time_daytime_thu_enable" type="checkbox" class="icheckbox daytime" />
                    <select id="event_time_daytime_thursday_from" class="iselect daytime" style="width: 60px;"></select>
                    <select id="event_time_daytime_thursday_to" class="iselect daytime" style="width: 60px;"></select>
                  </td>
                </tr>
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-friday'] ?></td>
                  <td width="50%">
                    <input id="event_time_daytime_fri_enable" type="checkbox" class="icheckbox daytime" />
                    <select id="event_time_daytime_friday_from" class="iselect daytime" style="width: 60px;"></select>
                    <select id="event_time_daytime_friday_to" class="iselect daytime" style="width: 60px;"></select>
                  </td>
                </tr>
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-saturday'] ?></td>
                  <td width="50%">
                    <input id="event_time_daytime_sat_enable" type="checkbox" class="icheckbox daytime" />
                    <select id="event_time_daytime_saturday_from" class="iselect daytime" style="width: 60px;"></select>
                    <select id="event_time_daytime_saturday_to" class="iselect daytime" style="width: 60px;"></select>
                  </td>
                </tr>
                <tr>
                  <td width="50%"><?php echo $TEXT['info-service-event-time-sunday'] ?></td>
                  <td width="50%">
                    <input id="event_time_daytime_sun_enable" type="checkbox" class="icheckbox daytime" />
                    <select id="event_time_daytime_sunday_from" class="iselect daytime" style="width: 60px;"></select>
                    <select id="event_time_daytime_sunday_to" class="iselect daytime" style="width: 60px;"></select>
                  </td>
                </tr>
              </table>
            </div>
            <div id="tab_event_notification" class="tab_content" style="display:none; height: 300px; width: 700px">
              <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                <tr>
                  <td colspan=2 style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['info-service-event-notification']?></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['push-notification']?></td>
                  <td>
                    <input id="event_push_notification_enable" type="checkbox" class="icheckbox" />
                  </td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['js-notification-email']?></td>
                  <td>
                    <input id="event_notification_email_enable" type="checkbox" class="icheckbox" />
                    <input id="event_notification_email" type="text" class="itext enablebox" style="width:250px;" /><?php echo $TEXT['info-notification-email-hint']?>
                  </td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['js-notification-sms']?></td>
                  <td>
                    <input id="event_notification_sms_enable" type="checkbox" class="icheckbox" />
                    <input id="event_notification_sms" type="text" class="itext enablebox" style="width:250px;" /><?php echo $TEXT['info-notification-sms-hint']?>
                  </td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['js-notification-telegram']?></td>
                  <td>
                    <input id="event_notification_telegram_enable" type="checkbox" class="icheckbox" />
                    <input id="event_notification_telegram" type="text" class="itext enablebox" style="width:250px;" /><?php echo $TEXT['info-notification-telegram-hint']?>
                  </td>
                </tr>
                <tr></tr>
                <tr>
                  <td colspan=2 style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['info-service-event-color']?></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-service-event-arrow']?></td>
                  <td>
                    <input id="event_event_arrow_enable" type="checkbox" class="icheckbox" />
                    <select id="event_event_arrow" class="iselect" style="width: 150px;">
                      <option value="black"><?php echo $TEXT['info-service-event-list-color-black']?></option>
                      <option value="blue"><?php echo $TEXT['info-service-event-list-color-blue']?></option>
                      <option value="green"><?php echo $TEXT['info-service-event-list-color-green']?></option>
                      <option value="gray"><?php echo $TEXT['info-service-event-list-color-gray']?></option>
                      <option value="orange"><?php echo $TEXT['info-service-event-list-color-orange']?></option>
                      <option value="purple"><?php echo $TEXT['info-service-event-list-color-purple']?></option>
                      <option value="red"><?php echo $TEXT['info-service-event-list-color-red']?></option>
                      <option selected="selected" value="yellow"><?php echo $TEXT['info-service-event-list-color-yellow']?></option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-service-event-list-color']?></td>
                  <td>
                    <input id="event_event_list_color_enable" type="checkbox" class="icheckbox" />
                    <input id="event_event_list_color" class="icolor enablebox" style="width:60px;" value="FFFF00" data-jscolor="{}" />
                  </td>
                </tr>
              </table>
            </div>
            <div id="tab_event_control" class="tab_content" style="display:none; height: 300px; width: 700px">
              <table border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                <tr>
                  <td><label><?php echo $TEXT['info-service-event-control-enable']?></label></td>
                  <td align="left"><input id="event_control_enable" type="checkbox" class="icheckbox" /></td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-service-event-control-command']?></td>
                  <td>
                    <select id="event_control_command" class="iselect" style="width: 200px;">
                      <option value="-1"></option>

                      <!--<option value="19"><?php echo $TEXT['info-cmd-custom-content-command']?></option>-->
                      <option value="1"><?php echo $TEXT['info-cmd-poll-position']?></option>
                      <option value="6"><?php echo $TEXT['info-cmd-enable-immobilizer']?></option>
                      <option value="7"><?php echo $TEXT['info-cmd-disable-immobilizer']?></option>
                      <option value="653"><?php echo $TEXT['info-cmd-arm']?></option>
                      <option value="665"><?php echo $TEXT['info-cmd-disarm']?></option>
                      <option value="4"><?php echo $TEXT['info-cmd-lock-door']?></option>
                      <option value="5"><?php echo $TEXT['info-cmd-unlock-door']?></option>
                      <option value="666"><?php echo $TEXT['info-cmd-take-photo']?></option>
                      <option value="16"><?php echo $TEXT['info-cmd-make-a-call']?></option>
                      <option value="23"><?php echo $TEXT['info-cmd-voice-monitor']?></option>
                      <option value="35"><?php echo $TEXT['info-cmd-voice-record']?></option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-service-event-control-gateway']?></td>
                  <td>
                    <select id="event_control_gateway" class="iselect" style="width: 200px;">
                      <option value="1"><?php echo $TEXT['info-service-event-control-gateway-gprs']?></option>
                      <option value="2"><?php echo $TEXT['info-service-event-control-gateway-sms']?></option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-service-event-control-code-type']?></td>
                  <td>
                    <select id="event_control_code_type" class="iselect" style="width: 200px;">
                      <option value="1"><?php echo $TEXT['info-service-event-control-code-type-ascii']?></option>
                      <option value="2"><?php echo $TEXT['info-service-event-control-code-type-hex']?></option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><?php echo $TEXT['info-service-event-control-parameters']?></td>
                  <td><input id="event_control_parameters" type="text" class="itext enablebox" style="width:400px;" /></td>
                </tr>
              </table>
            </div>
          </div>
          <div class="footer">
            <input id="button_cancel" type="button" class="right small button" style="margin-left: 5px;" value="<?php echo $TEXT['button-cancel'] ?>" />
            <input id="button_ok" type="button" class="right small button" value="<?php echo $TEXT['button-ok'] ?>" />
          </div>
        </div>
      </div>
    </div>
    <div id="dlg_sensor" class="dialog" style="min-width: 700px; width: 880px; ">
      <div class="out">
        <div class="in">
          <h3 onmousedown="dragstart('dlg_sensor', event)" onmousemove="dragmove(event)"><?php echo $TEXT['info-service-sensor-properties'] ?></h3>
          <div class="content">
            <div id="sensor_main" class="tab_content" style="height: 505px; width: 720px">
              <table width="100%">
                <tr>
                  <td width="50%" valign="top">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                      <tr>
                        <td width="50%" colspan=2 style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['info-service-sensor-title']?></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-name'] ?></td>
                        <td width="50%"><input id="sensor_name" type="text" class="itext enablebox must" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-target'] ?></td>
                        <td width="50%">
                          <select id="sensor_target" class="iselect">
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-element'] ?></td>
                        <td width="50%">

                          <!--Element type
											1:digital
											2:formula
											3:dictionary(option)
											4:calibration(linear)
											5:percentage
											6:String(change element name)
											-->
                          <select id="sensor_element" class="iselect">
                          </select>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" valign="top" rowspan="2">
                    <table width="50%" border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                      <tr>
                        <td style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['info-service-sensor-calibration']?></td>
                      </tr>
                      <tr>
                        <td>
                          <div style="overflow-y: scroll; height: 300px; width: 100%; border-bottom: 1px solid #DDDDDD;;">
                            <table id="calibration_parameters" class="tab_report calibration_related">
                              <thead>
                                <tr>
                                  <th width="30%"><?php echo $TEXT['info-service-sensor-calibration-x']?></th>
                                  <th width="30%"><?php echo $TEXT['info-service-sensor-calibration-y']?></th>
                                  <th width="10%"></th>
                                </tr>
                              </thead>
                              <tbody></tbody>
                            </table>
                          </div>
                          <table>
                            <tr>
                              <td width="10%"><?php echo $TEXT['info-service-sensor-calibration-x'] ?></td>
                              <td width="20%"><input id="calibration_x" type="text" class="itext enablebox must calibration_related" style="width: 60px;" /></td>
                              <td width="10%"><?php echo $TEXT['info-service-sensor-calibration-y'] ?></td>
                              <td width="20%"><input id="calibration_y" type="text" class="itext enablebox must calibration_related" style="width: 60px;" /></td>
                              <td width="5%"><input id="calibration_parameters_add" type="button" class="small button calibration_related" style="margin-top:0px;" value="+" /></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" valign="top" rowspan="2">
                    <table width="50%" border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                      <tr>
                        <td style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['info-service-sensor-dictionary']?></td>
                      </tr>
                      <tr>
                        <td>
                          <div style="overflow-y: scroll; height: 300px; width: 100%; border-bottom: 1px solid #DDDDDD;;">
                            <table id="dictionary_parameters" class="tab_report dictionary_related">
                              <thead>
                                <tr>
                                  <th width="30%"><?php echo $TEXT['info-service-sensor-dictionary-value']?></th>
                                  <th width="30%"><?php echo $TEXT['info-service-sensor-dictionary-text']?></th>
                                  <th width="10%"></th>
                                </tr>
                              </thead>
                              <tbody></tbody>
                            </table>
                          </div>
                          <table>
                            <tr>
                              <td width="20%"><input id="dictionary_value" type="text" class="itext enablebox must dictionary_related" style="width: 60px;" /></td>
                              <td width="10%">=</td>
                              <td width="20%"><input id="dictionary_text" type="text" class="itext enablebox must dictionary_related" style="width: 60px;" /></td>
                              <td width="5%"><input id="dictionary_parameters_add" type="button" class="small button dictionary_related" style="margin-top:0px;" value="+" /></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td width="50%" valign="top">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding: 0 10px">
                      <tr>
                        <td width="50%" colspan=2 style="color:#2B82D4; font-weight: bold;border-bottom: 1px solid #DDDDDD; "><?php echo $TEXT['info-service-sensor-result']?></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-format'] ?></td>
                        <td width="50%"><input id="sensor_format" type="text" class="itext enablebox must" placeholder="%.1f &#8451;" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-digital-1'] ?></td>
                        <td width="50%"><input id="sensor_digital_1" type="text" class="itext enablebox must" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-digital-0'] ?></td>
                        <td width="50%"><input id="sensor_digital_0" type="text" class="itext enablebox must" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-formula'] ?></td>
                        <td width="50%"><input id="sensor_formula" type="text" class="itext enablebox must" placeholder="(X+1)/2*3" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-lowest-value'] ?></td>
                        <td width="50%"><input id="sensor_lowest_value" type="text" class="itext enablebox must" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-highest-value'] ?></td>
                        <td width="50%"><input id="sensor_highest_value" type="text" class="itext enablebox must" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-ignore-ignition-off'] ?></td>
                        <td width="50%"><input id="sensor_ignore_ignition_off" type="checkbox" class="icheckbox" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-smooth-data'] ?></td>
                        <td width="50%"><input id="sensor_smooth_data" type="checkbox" class="icheckbox" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-reverse-digital'] ?></td>
                        <td width="50%"><input id="sensor_reverse_digital" type="checkbox" class="icheckbox" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-show-time'] ?></td>
                        <td width="50%"><input id="sensor_show_time" type="checkbox" class="icheckbox" /></td>
                      </tr>
                      <tr>
                        <td width="50%"><?php echo $TEXT['info-service-sensor-keep-last-value'] ?></td>
                        <td width="50%"><input id="sensor_keep_last_value" type="checkbox" class="icheckbox" /></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="footer">
            <input id="button_cancel" type="button" class="right small button" style="margin-left: 5px;" value="<?php echo $TEXT['button-cancel'] ?>" />
            <input id="button_ok" type="button" class="right small button" value="<?php echo $TEXT['button-ok'] ?>" />
          </div>
        </div>
      </div>
    </div>
    <div id="mnuOperat" class="mnuOperat" style="display: none;">
      <ul>
        <li id="export_xls" style="border-top:3px solid #2982D6; width: 150px; cursor: pointer;" onClick="doExport(1);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/xls.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-xls'] ?></a></li>

        <!--<li id="export_pdf" style="width: 150px;" onClick="doExport(7);"><a style="padding-left: 25px; background: transparent url('img/pdf.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-pdf'] ?></a></li>-->
        <li id="export_html" style="width: 150px; cursor: pointer;" onClick="doExport(3);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/html.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-html'] ?></a></li>
        <li id="export_csv" style="width: 150px; cursor: pointer;" onClick="doExport(4);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/csv.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-csv'] ?></a></li>
        <li id="export_doc" style="width: 150px; cursor: pointer;" onClick="doExport(5);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/doc.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-doc'] ?></a></li>
        <li id="export_txt" style="width: 150px; cursor: pointer;" onClick="doExport(6);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/txt.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-txt'] ?></a></li>
      </ul>
    </div>
  </body>
</html>
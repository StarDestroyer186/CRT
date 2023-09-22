<?php
session_start();
include_once('lang.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $TEXT['navi-sysreport']?></title>
<link type="text/css" rel="stylesheet" href="css/button.css"/>
<link type="text/css" rel="stylesheet" href="css/style.css?v=<?php echo $last_ver['style.css']?>" />
<link type="text/css" rel="stylesheet" href="css/timepicker.css" />
<link type="text/css" rel="stylesheet" href="css/jquery-ui.css" />
<link type="text/css" rel="stylesheet" href="css/vanillaSelectBox.css"/>
<link type="text/css" rel="stylesheet" href="css/jquery-ui-timepicker-addon.css" />
<link type="text/css" rel="stylesheet" href="css/jquery-ui.css"/>
<link type="text/css" rel="stylesheet" href="css/jquery.multiselect.css" />
<link type="text/css" rel="stylesheet" href="css/sortable.min.css" />
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
<script type="text/javascript" src="js/jquery.multiselect.js"></script>
<script type="text/javascript" src="js/vanillaSelectBox.js"></script>
<script type="text/javascript" src="js/jquery-ui-datepicker-min.js"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js"></script>
<script type="text/javascript" src="js/jquery-ui-datepicker-lang.js" charset="gb2312"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-lang.js"></script>
<script type='text/javascript' src="js/stastics.js?v=<?php echo $last_ver['stastics.js']?>"></script>
<script type='text/javascript' src="js/highstock.js"></script>
<script type='text/javascript' src="js/exporting.js"></script>
<script type='text/javascript' src="js/sortable.min.js"></script>


<script type='text/javascript'>
JS_GOOGLE_MAP_BASE_LINK = "<?php echo $last_ver['google_map_base_link']?>";
JS_DEFAULT_DATETIME_fmt_JS="<?php echo $_SESSION['datetime_fmt_js']?>";
JS_DEFAULT_DATE_FMT="<?php echo $_SESSION['date_fmt_js']?>";
JS_UNIT_DISTANCE = "<?php echo $_SESSION['unit_distance']?>";         //0:Kilometer(公里) 1:Mile(英里) 2:Nautical mile(海里)
JS_UNIT_FUEL = "<?php echo $_SESSION['unit_fuel']?>";                 //0:Liter(升) 1:Gallon(加仑)
JS_UNIT_TEMPERATURE = "<?php echo $_SESSION['unit_temperature']?>";   //0:Celsius  1:Fahrenheit
JS_UNIT_SPEED = "<?php echo $_SESSION['unit_speed']?>";               //0:kph(公里/小时) 1:mph(英里/小时)
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
JS_CONDITION_INVALID = "<?php echo $TEXT['status-conditioninvalid']?>";
JS_STATUS_NODATA = "<?php echo $TEXT['status-nodata']?>";
JS_CURRENT_LANG = "<?php echo $_SESSION['lang']?>";
JS_BUTTON_DOWNLOAD = "<?php echo$TEXT['button-download']?>";
JS_REPORT_BYOBJECT = "<?php echo $TEXT['report-byobject']?>";
JS_REPORT_BYUSER = "<?PHP echo $TEXT['report-byuser']?>";
JS_YES = "<?PHP echo $TEXT['js-yes']?>";
JS_NO = "<?PHP echo $TEXT['js-no']?>";
JS_REPORT_NO = "<?php echo $TEXT['report-no']?>";
JS_INFO_OBJECTFLAG = "<?php echo $TEXT['info-objectflag']?>";
JS_INFO_DEVICEID = "<?php echo $TEXT['info-deviceid']?>";
JS_INFO_DEVICESIM = "<?php echo $TEXT['info-simcard']?>";
JS_NAVI_TARGETSTATUS = "<?php echo $TEXT['navi-targetstatus']?>";
JS_INFO_BATTERY = "<?php echo $TEXT['info-battery'] ?>";
JS_INFO_ENGINE_HOUR = "<?php echo $TEXT['info-engine-hour'] ?>";
JS_INFO_MAX_SPEED_24H = "<?php echo $TEXT['info-max-speed-24h'] ?>";
JS_INFO_ODOMETER_24H = "<?php echo $TEXT['info-odometer-24h'] ?>";
JS_INFO_MOVING_TIME_24 = "<?php echo $TEXT['info-moving-time-24h'] ?>";
JS_INFO_IDLE_TIME_24H = "<?php echo $TEXT['info-idle-time-24h'] ?>";
JS_INFO_STOP_TIME_24H = "<?php echo $TEXT['info-stop-time-24h'] ?>";
JS_INFO_ENGINE_TIME_24H = "<?php echo $TEXT['info-engine-time-24h'] ?>";
JS_INFO_ROUTE_COMPLETE = "<?php echo $TEXT['info-route-complete'] ?>";
JS_INFO_ODOMETER = "<?php echo $TEXT['info-obd-mileage'] ?>";
JS_INFO_TEMPERATURE = "<?php echo $TEXT['info-temperature'] ?>";
JS_INFO_FUEL = "<?php echo $TEXT['report-fuel'] ?>";
JS_GPSVALID = "<?php echo $TEXT['js-gpsvalid']?>";
JS_INFO_LATITUDE = "<?php echo $TEXT['info-latitude']?>";
JS_INFO_LONGITUDE = "<?php echo $TEXT['info-longitude']?>";
JS_NAVI_SPEED_Y_TEXT = "<?php echo $TEXT['navi-speed-y-text']?>";
JS_INFO_HEADING = "<?php echo $TEXT['info-heading']?>";
JS_INFO_GPSTIME = "<?php echo $TEXT['info-gpstime']?>";
JS_INFO_REVTIME = "<?php echo $TEXT['info-revtime']?>";
JS_INFO_SPEEDING_START_TIME = "<?php echo $TEXT['report-speeding-start-time']?>";
JS_INFO_SPEEDING_END_TIME = "<?php echo $TEXT['report-speeding-end-time']?>";
JS_INFO_SPEEDING_LAST_TIME = "<?php echo $TEXT['report-speeding-last-time']?>";
JS_INFO_SPEEDING_DISTANCE = "<?php echo $TEXT['report-speeding-distance']?>";
JS_INFO_SPEEDING_COUNT = "<?php echo $TEXT['report-speeding-count']?>";
JS_INFO_ENGINE_ON_COUNT = "<?php echo $TEXT['report-engine-on-count']?>";
JS_INFO_PLACE_NAME = "<?php echo $TEXT['info-placename']?>";
JS_INFO_ENTER_TIME = "<?php echo $TEXT['report-enter-time']?>";
JS_INFO_LEAVE_TIME = "<?php echo $TEXT['report-leave-time']?>";
JS_INFO_TASK_NAME = "<?php echo $TEXT['info-task-name']?>";
JS_INFO_TASK_STATUS = "<?php echo $TEXT['info-task-status']?>";
JS_INFO_TASK_START_TIME = "<?php echo $TEXT['info-task-start-time']?>";
JS_INFO_TASK_END_TIME = "<?php echo $TEXT['info-task-end-time']?>";
JS_INFO_TASK_COMPLETED = "<?php echo $TEXT['info-task-status-completed']?>";
JS_INFO_TASK_FAIL = "<?php echo $TEXT['info-task-status-fail']?>";
JS_EXPENSE_DATE="<?php echo $TEXT['info-expense-date'] ?>";
JS_EXPENSE_NAME="<?php echo $TEXT['info-expense-name'] ?>";
JS_EXPENSE_QUANTITY="<?php echo $TEXT['info-expense-quantity'] ?>";
JS_EXPENSE_COST="<?php echo $TEXT['info-expense-cost'] ?>";
JS_EXPENSE_SUPPLIER="<?php echo $TEXT['info-expense-supplier'] ?>";
JS_EXPENSE_BUYER="<?php echo $TEXT['info-expense-buyer'] ?>";
JS_EXPENSE_ODOMETER="<?php echo $TEXT['info-expense-odometer'] ?>";
JS_EXPENSE_ENGINE_HOUR="<?php echo $TEXT['info-expense-engine-hours'] ?>";
JS_EXPENSE_REMARK="<?php echo $TEXT['info-expense-description'] ?>";
JS_CAMERAID = "<?php echo $TEXT['report-cameraid']?>";
JS_PHOTOTYPE = "<?php echo $TEXT['report-phototype']?>";
JS_PHOTOTIME = "<?php echo $TEXT['report-phototime']?>";
JS_PHOTODETAIL = "<?php echo $TEXT['report-photodetail']?>";
JS_PHOTOBYMANUAL = "<?php echo $TEXT['report-photobymanual']?>";
JS_PHOTOBYAUTO = "<?php echo $TEXT['report-photobyauto']?>";
JS_PHOTOBYALARM = "<?php echo $TEXT['report-photobyalarm']?>";
JS_WORKID = "<?php echo $TEXT['report-workid']?>";
JS_DRIVERNAME = "<?php echo $TEXT['info-driver']?>";
JS_DRIVER_LICENSE = "<?php echo $TEXT['report-driver-license']?>";
JS_DRIVER_PHONE = "<?php echo $TEXT['report-driver-phone']?>";
JS_BRUSH_TIME = "<?php echo $TEXT['report-brush-time']?>";
JS_SPEED_Y_TEXT = "<?php echo $TEXT['navi-speed-y-text']?>";
JS_SPEED = "<?php echo $TEXT['navi-speed']?>";
JS_MAX_ITEMS = "<?php echo $TEXT['navi-chart-max-items']?>";
JS_IGNITION = "<?php echo $TEXT['navi-ignitionchart']?>";
JS_NAVI_CHART_FUEL_1 = "<?php echo $TEXT['navi-chart-fuel-1']?>";
JS_NAVI_CHART_TEMP_1 = "<?php echo $TEXT['navi-chart-temp-1']?>";
JS_LOCATION = "<?php echo $TEXT['js-tip-location']?>";
JS_GROUP_NAME = "<?php echo $TEXT['info-groupname']?>";
JS_ALARM_TYPE = "<?php echo $TEXT['report-alarm-type']?>";
JS_FUEL_Y_TEXT = "<?php echo $TEXT['report-fuel-y-test']?>";
JS_FUEL = "<?php echo $TEXT['report-fuel']?>";
JS_FUEL_SENSOR = "<?php echo $TEXT['report-fuel-sensor']?>";
JS_BEFORE_FUEL = "<?php echo $TEXT['report-fuel-before']?>";
JS_AFTER_FUEL = "<?php echo $TEXT['report-fuel-after']?>";
JS_REFUEL = "<?php echo $TEXT['report-re-fuel']?>";
JS_STEAL_FUEL = "<?php echo $TEXT['report-steal-fuel']?>";
JS_TEMP_Y_TEXT = "<?php echo $TEXT['report-temp-y-test']?>";
JS_TEMP = "<?php echo $TEXT['report-temp']?>";
JS_USAGE_DATE = "<?php echo $TEXT['report-usage-date']?>";
JS_DISTANCE = "<?php echo $TEXT['report-distance']?>";
JS_DRIVING_TIME = "<?php echo $TEXT['report-divtime']?>";
JS_STOP_TIME = "<?php echo $TEXT['report-stoptime']?>";
JS_AV_SPEED = "<?php echo $TEXT['report-avspeed']?>";
JS_MAX_SPEED = "<?php echo $TEXT['report-maxspeed']?>";
JS_IDLE_TIME = "<?php echo $TEXT['report-idletime']?>";
JS_IDLE_TIMES = "<?php echo $TEXT['report-idletimes']?>";
JS_TEMPERATURES = "<?php echo $TEXT['report-temperatures']?>";
JS_DOOR_OPEN_TIME = "<?php echo $TEXT['report-door-open-time']?>";

JS_HEAVY_DUTY_TIMES = "<?php echo $TEXT['report-heavy-duty-time']?>";
JS_HARSH_ACCELERATION = "<?php echo $TEXT['104A']?>";
JS_HARSH_BRAKING = "<?php echo $TEXT['104B']?>";
JS_HARSH_CORNERING = "<?php echo $TEXT['104D']?>";
JS_TIME_RANGE_LESS_THAN = "<?php echo $TEXT['report-time-range-less-than']?>";
JS_IGNITION_STATUS = "<?php echo $TEXT['navi-generalstatus']?>";
JS_STATUS_STOPPED = "<?php echo $TEXT['3025']?>";
JS_STATUS_MOVING = "<?php echo $TEXT['3024']?>";
JS_START = "<?php echo $TEXT['report-start']?>";
JS_END = "<?php echo $TEXT['report-end']?>";
JS_START_LOCATION = "<?php echo $TEXT['report-start-location']?>";
JS_END_LOCATION = "<?php echo $TEXT['report-end-location']?>";
JS_TRIP_TIME = "<?php echo $TEXT['report-trip-time']?>";
JS_TIMEOUT_MINS = "<?php echo $TEXT['timeout-item-mins']?>";
JS_TIMEOUT_HOUR = "<?php echo $TEXT['timeout-item-hour']?>";
JS_TIMEOUT_DAY = "<?php echo $TEXT['timeout-item-day']?>";
JS_TIMEOUT_WEEK = "<?php echo $TEXT['timeout-item-week']?>";
JS_TIMEOUT_MON = "<?php echo $TEXT['timeout-item-mon']?>";
JS_TIMEOUT_YEAR = "<?php echo $TEXT['timeout-item-year']?>";
JS_BLANK_FOR_ALL_ASSET = "<?php echo $TEXT['report-blank-for-all-asset']?>";
JS_BLANK_FOR_ALL_USER = "<?php echo $TEXT['report-blank-for-all-user']?>";
JS_TOTAL = "<?php echo $TEXT['status-totalrecords']?>";
JS_CUSTOMER_INFO = "<?php echo $TEXT['info-customerinfo']?>";
JS_INFO_USEDEFFLAG = "<?php echo $TEXT['info-usedefflag']?>";
JS_LOWEST_AD = "<?php echo $TEXT['report-lowest-ad']?>";
JS_HIGHEST_AD = "<?php echo $TEXT['report-highest-ad']?>";
JS_AVERAGE_AD = "<?php echo $TEXT['report-average-ad']?>";
JS_DURATION = "<?php echo $TEXT['report-duration']?>";
JS_COST_FUEL = "<?php echo $TEXT['report-cost-fuel']?>";
JS_COST_MILEAGE = "<?php echo $TEXT['report-cost-mileage']?>";
NAVI_SENSOR_FUEL_CONSUMPTION = "<?php echo $TEXT['navi-sensor-fuel-consumption'] ?>";
NAVI_ESTIMATE_FUEL_CONSUMPTION = "<?php echo $TEXT['navi-estimate-fuel-consumption'] ?>";
NAVI_CAN_FUEL_CONSUMPTION = "<?php echo $TEXT['navi-can-fuel-consumption'] ?>";
JS_CHART_SELECT = "<?php echo $TEXT['navi-chart-select']?>";
JS_SELECT = "<?php echo $TEXT['info-select']?>";
JS_SELECTED = "<?php echo $TEXT['info-selected']?>";
JS_INFO_SELECT = "<?php echo $TEXT['info-select']?>"
JS_SELECT_ALL_ITEM = "<?php echo $TEXT['info-select-all-item']?>";
JS_SELECT_ITEMS = "<?php echo $TEXT['info-select-item']?>";
JS_SELECT_CLEAR_ALL = "<?php echo $TEXT['info-select-clear-all']?>";
JS_SEARCH = "<?php echo $TEXT['info-search']?>";
JS_SELECT_ALL = "<?php echo $TEXT['info-select-all']?>";
JS_UNSELECT_ALL = "<?php echo $TEXT['info-unselect-all']?>";
JS_USER_NAME = "<?php echo $TEXT['info-username']?>";
JS_LOGIN_TIME = "<?php echo $TEXT['report-login-time']?>";
JS_LOGIN_IP = "<?php echo $TEXT['report-login-ip']?>";
JS_LOGIN_TIME_ZONE = "<?php echo $TEXT['report-login-time-zone']?>";
JS_RECORDING_TIME = "<?php echo $TEXT['report-record-time']?>";
JS_RECORDING_DETAIL = "<?php echo $TEXT['report-record-detail']?>";
JS_TIME = "<?php echo $TEXT['js-time']?>";
</script>
<style type="text/css">
html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-size: 12px; font-family: Arial, Tahoma; color:#000 !important; overflow: auto; }
#stastics { position: absolute; left: 0; top: 0;right: 0;bottom: 0; border: 1px solid #999; }
.tab_report { width:100%; border-collapse: collapse; }
.tab_report th { border-left: 1px solid #ccc; background-color:#D5D5D5; font-size:12px; line-height:120%; font-weight:bold; padding:5px; text-align:left; position: sticky; top: 0; z-index: 1; }
.tab_report tr { text-align:left; }
.tab_report td { border:1px solid #D5D5D5; font-size:12px; padding:5px; text-align:left; }
.tab_report td.fixed { color: #ccc; background: url(img/ajax-loader.gif) no-repeat 4px center; margin-left: 20px;}
.tab_report td.success {color: #0b0;}
.tab_report td.fail {color: #000;}
.itext { margin: 2px; width: 160px; height: 20px; border: 1px solid #999; font-size: 12px; line-height: 20px; font-weight: normal; }
.iselect { margin: 2px; width: 160px; height: 24px; border: 1px solid #999;font-size: 12px; line-height: 24px; font-weight: normal; -webkit-appearance: menulist-button; }
.itime { background: #fff url(img/date.png) no-repeat right center; background-size: 16px 16px;}
.button { float: left; margin-top: 2px; height: 23px;  }
.search_bar { position: absolute; left:4px; top: 28px; right:4px; height: 32px; border: 1px solid #ccc; z-index: 1; }
.search_bar li { float: left; list-style: none; text-decoration: none; padding: 2px; }
.search_bar li label { margin: auto 4px;}
.oddcolor { background-color: #EEE; }
.valid { background: transparent url(img/v_online.png) no-repeat 25px center; }
.invalid { background: transparent url(img/gps_invalid.png) no-repeat 25px center; }
.invalidbox { background-color:red }
.must { border: 1px solid #666; color: #000;}
.ui-autocomplete { cursor:default; z-index:10000 !important; }
</style>
<script type="text/javascript">
	$(function(){
		$(document).bind("click",function(e){
			var target = $(e.target);
			if(target.closest(".mnuOperat").length == 0 && target.closest("#exportbyrtime").length == 0){
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
<body onload="oninit();">
<div id="stastics">
	<ul class="tabbar">
		<li target="#tab_byrtime" class="tab_active"><a href="#" title="1.<?php echo $TEXT['report-byrtime']?>"></a></li>
		<li target="#tab_byobj" ><a href="#" title="2.<?php echo $TEXT['report-byobject']?>"></a></li>
		<li target="#tab_byuser"><a href="#" title="3.<?php echo $TEXT['report-byuser']?>"></a></li>
	</ul>
	<div id="tab_byrtime" class="tab_content">
        <ul class="search_bar">
            <li>
              <label for="rpttypebyrtime"><?php echo $TEXT['info-reporttype']?></label>
              <select id="rpttypebyrtime" type="text" class="iselect" style="width: 140px;" name="rpttypebyrtime">
				  <option value="" disabled><?php echo $TEXT['info-reporttype-main']?></option>
                  <option value="0">1. <?php echo $TEXT['report-laststate']?></option>
                  <option value="1">2. <?php echo $TEXT['report-triplog']?></option>
                  <option value="2">3. <?php echo $TEXT['report-historyphoto']?></option>				 
				  <option value="3">4. <?php echo $TEXT['report-assetrfid']?></option>
				  <!--<option value="4"><?php echo $TEXT['report-driverrfid']?></option>-->
				  <option value="30">5. <?php echo $TEXT['report-alcohol-ad']?></option>
				  <option value="43">6. <?php echo $TEXT['report-history-voice']?></option>
				  <option value="55">7. <?php echo $TEXT['report-expense']?></option>
				  <option value="42">8. <?php echo $TEXT['report-user-login-record']?></option>
				  
				  <option value=""disabled></option>
				  <option value="" disabled><?php echo $TEXT['info-reporttype-graph-fuel']?></option>
				  <option value="54">1. <?php echo $TEXT['report-graph']?></option>	
				  <option value="5">2. <?php echo $TEXT['report-speedchart']?></option>				  				  
				  <option value="7">3. <?php echo $TEXT['report-fuelchart']?></option>
				  <option value="8">4. <?php echo $TEXT['report-refuel']?></option>
				  <option value="9">5. <?php echo $TEXT['report-stealfuel']?></option>
				  <option value="10">6. <?php echo $TEXT['report-tempchart']?></option>
				  <option value="52">7. <?php echo $TEXT['report-temp-gas-mil-hour']?></option>
				  
				  <option value=""disabled></option>
				  <option value="" disabled><?php echo $TEXT['info-reporttype-detailed']?></option>
				  <option value="11">1. <?php echo $TEXT['report-assetusage']?></option>
				  <option value="39">2. <?php echo $TEXT['report-assetusage-realtime']?></option>
				  <option value="12">3. <?php echo $TEXT['report-dailytravel']?></option>
				  <option value="13">4. <?php echo $TEXT['report-notreported']?></option>
				  <option value="29">5. <?php echo $TEXT['report-max-speed']?></option>
				  <option value="33">6. <?php echo $TEXT['report-speeding-time']?></option>
				  <option value="34">7. <?php echo $TEXT['report-stops-detail']?></option>
				  <option value="38">8. <?php echo $TEXT['report-moves-detail']?></option>
				  <option value="41">9. <?php echo $TEXT['report-place-event-detail']?></option>			
				  
				  <option value=""disabled></option>
				  <option value="" disabled><?php echo $TEXT['info-reporttype-events']?></option>
				  <option value="6">1. <?php echo $TEXT['report-alarmevent']?></option>
				  <option value="14">2. <?php echo $TEXT['report-event-over-speed']?></option>
				  <option value="15">3. <?php echo $TEXT['report-event-hijack']?></option>
				  <option value="16">4. <?php echo $TEXT['report-event-steal']?></option>
				  <option value="17">5. <?php echo $TEXT['report-event-towing']?></option>
				  <option value="18">6. <?php echo $TEXT['report-event-shock']?></option>
				  <option value="19">7. <?php echo $TEXT['report-event-door-opened']?></option>
				  <option value="20">8. <?php echo $TEXT['report-event-illegal-ignition']?></option>
				  <option value="21">9. <?php echo $TEXT['report-event-power-tamper']?></option>
				  <option value="22">10. <?php echo $TEXT['report-event-zone-break']?></option>
				  <option value="23">11. <?php echo $TEXT['report-event-zone-inbreak']?></option>
				  <option value="24">12. <?php echo $TEXT['report-event-Fatigue-driving']?></option>
				  <option value="25">13. <?php echo $TEXT['report-event-overtime-driving']?></option>
				  <option value="26">14. <?php echo $TEXT['report-event-idle']?></option>
				  <option value="27">15. <?php echo $TEXT['report-event-backup-battery-low']?></option>
				  <option value="28">16. <?php echo $TEXT['report-event-car-battery-low']?></option>
				  <option value="31">17. <?php echo $TEXT['report-event-drunk-driving']?></option>
				  <option value="32">18. <?php echo $TEXT['report-event-blowing']?></option>
				  <option value="40">19. <?php echo $TEXT['report-event-seat-belt']?></option>
				  <option value="48">20. <?php echo $TEXT['report-event-harsh-acceleration']?></option>	
				  <option value="49">21. <?php echo $TEXT['report-event-harsh-braking']?></option>	
				  <option value="50">22. <?php echo $TEXT['report-event-harsh-cornering']?></option>	
				  <option value="53">23. <?php echo $TEXT['report-custom-event']?></option>
				  
				  <option value=""disabled></option>
				  <option value="" disabled><?php echo $TEXT['info-reporttype-tasks']?></option>
				  <option value="47">1. <?php echo $TEXT['report-task-detail']?></option>
				  <option value="44">2. <?php echo $TEXT['report-task-processing']?></option>
				  <option value="45">3. <?php echo $TEXT['report-task-completed']?></option>
				  <option value="46">4. <?php echo $TEXT['report-task-fail']?></option>
				  				  
				  <option value=""disabled></option>
				  <option value="" disabled><?php echo $TEXT['info-reporttype-maintenance']?></option>
				  <option value="35">1. <?php echo $TEXT['report-event-mileage-maintenance']?></option>
				  <option value="36">2. <?php echo $TEXT['report-event-engine-maintenance']?></option>
				  <option value="37">3. <?php echo $TEXT['report-event-days-maintenance']?></option>
              </select>
            </li>
			<li id="condition_flag" style="display: none;">
			  <label for="device_flag"><?php echo $TEXT['info-objectflag']?></label>
			  <input id="device_flag" type="text" class="itext enablebox must" style="width: 140px;" name="device_flag" maxlength="30" />
			</li>
			<div id="condition_multi_flag" style="display: none;">
				<li style="margin-top:5px;">
				  <label for="device_multi_flag"><?php echo $TEXT['info-objectflag']?></label>
				</li>
				<li>
				  <select id="device_multi_flag" class="iselect" name="device_multi_flag" multiple="multiple"></select>
				</li>
			</div>
			<li id="condition_data_items" style="display: none;">
				<label for="data_items"><?php echo $TEXT['info-data-items']?></label>
			    <select id="data_items" class="iselect" name="data_items"></select>
			</li>
			<li id="condition_uname" style="display: none;">
			  <label for="user_name"><?php echo $TEXT['info-username']?></label>
			  <input id="user_name" type="text" class="itext enablebox must" style="width: 140px;" name="user_name" maxlength="30" />
			</li>
			<li id="condition_stime" style="display: none;">
			  <label for="timebyrtime1"><?php echo $TEXT['info-starttime']?></label>
			  <input id="timebyrtime1" type="text" autocomplete="off" class="itext itime enablebox must" style="width: 120px" name="timebyrtime1" maxlength="19" onclick="showcalendar(event, this, true)" />
			</li>
			<li id="condition_etime" style="display: none;">
			  <label for="timebyrtime2"><?php echo $TEXT['info-endtime']?></label>
			  <input id="timebyrtime2" type="text" autocomplete="off" class="itext itime enablebox must" style="width: 120px" name="timebyrtime2" maxlength="19" onclick="showcalendar(event, this, true)" />
			</li>
			<li id="condition_day" style="display: none;">
			  <label for="timebyrtime3"><?php echo $TEXT['report-usage-date']?></label>
			  <input id="timebyrtime3" type="text" autocomplete="off" class="itext itime enablebox must" style="width: 120px" name="timebyrtime3" maxlength="19" readonly='true'/>
			</li>          
			<li id="rduration" style="display: none;">
				<label><?php echo $TEXT['info-stop-duration'] ?></label>
				<select id="stop_rduration" class="iselect" style="width: 80px" name="stoptime">
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
			</li>
			<li id="cost_fuel" style="display: none;">
			   <label id="cost_fuel_per_liter_l" for="cost_fuel_per_liter"><?php echo $TEXT['report-cost-fuel']?></label>
			   <input id="cost_fuel_per_liter" type="text" class="itext enablebox" style="width: 40px;" name="cost_fuel_per_liter" maxlength="20" />
			</li>
			<li id="cost_mileage" style="display: none;">
			   <label id="cost_mileage_per_km_l" for="cost_mileage_per_km"><?php echo $TEXT['report-cost-mileage']?></label>
			   <input id="cost_mileage_per_km" type="text" class="itext enablebox" style="width: 40px;" name="cost_mileage_per_km" maxlength="20" />
			</li>
			<li>
			  <input id="searchbyrtime" type="button" class="small button" value="<?php echo $TEXT['button-search']?>" />
			</li>
			<li>
			  <input id="exportbyrtime" type="button" class="small button" disabled value="<?php echo $TEXT['button-export']?>" />
			</li>
        </ul>
        <div id="table_byrtime_div" style="page-break-after: always; position: absolute; margin: 0; border: 1px solid #999; overflow-y: scroll; left: 4px; top:68px; right: 4px; bottom: 4px;">
			<div id="select_chart"></div>
			<table id="table_byrtime" nobr="true" class="tab_report sortable" style="width: 180%;">
				<thead>
					<tr>
						<th width="2%"><?php echo $TEXT['report-no']?></th>
						<th width="5%"><?php echo $TEXT['info-objectflag']?></th>
						<th width="5%"><?php echo $TEXT['info-deviceid']?></th>
						<!--<th width="7%"><?php echo $TEXT['info-simcard']?></th>-->
						<th class="no-sort" width="10%"><?php echo $TEXT['navi-targetstatus']?></th> 
						<th width="5%"><?php echo $TEXT['info-obd-mileage'] ?></th>
						<th width="5%"><?php echo $TEXT['info-engine-hour'] ?></th>
						<th width="5%"><?php echo $TEXT['info-max-speed-24h'] ?></th>
						<th width="5%"><?php echo $TEXT['info-odometer-24h'] ?></th>
						<th width="5%"><?php echo $TEXT['info-moving-time-24h'] ?></th>
						<th width="5%"><?php echo $TEXT['info-idle-time-24h'] ?></th>
						<th width="5%"><?php echo $TEXT['info-stop-time-24h'] ?></th>
						<th width="5%"><?php echo $TEXT['info-engine-time-24h'] ?></th>
						<th width="4%"><?php echo $TEXT['info-route-complete'] ?></th>
						<th width="4%"><?php echo $TEXT['info-battery'] ?></th> 
						<th width="4%"><?php echo $TEXT['js-gpsvalid']?></th>
						<th width="4%"><?php echo $TEXT['info-latitude']?></th>
						<th width="4%"><?php echo $TEXT['info-longitude']?></th>
						<th width="4%"><?php echo $TEXT['navi-speed']?></th>
						<th width="4%"><?php echo $TEXT['info-heading']?></th>
						<th width="5%"><?php echo $TEXT['info-gpstime']?></th>
						<th width="5%"><?php echo $TEXT['info-revtime']?></th>
						<th class="no-sort" width="10%"><?php echo $TEXT['js-tip-location']?></th>
						<th class="no-sort" width="0%" style='display:none'><?php echo $TEXT['info-groupname']?></th>
					</tr>
				</thead>
			</table>			
        </div>
		<div id="graph_byrtime" style="display: none; height: 250px; right: 25px; left: 10px; position: absolute; top: 95px;"></div>
		<div id="chart_byrtime" style="display: none; height: 250px; width: 100%; position: absolute; bottom: 0px;"></div>
    </div>
	<div id="mnuOperat" class="mnuOperat" style="display: none;">
		<ul>
			<li id="export_xls" style="border-top:3px solid #2982D6; width: 150px; cursor: pointer;" onClick="doExport(1);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/xls.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-xls'] ?></a></li>
			<li id="export_pdf" style="width: 150px; cursor: wait;" onClick="doExport(8);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/pdf.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-pdf'] ?></a></li>
			<li id="export_html" style="width: 150px; cursor: pointer;" onClick="doExport(3);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/html.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-html'] ?></a></li>
			<li id="export_csv" style="width: 150px; cursor: pointer;" onClick="doExport(4);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/csv.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-csv'] ?></a></li>
			<li id="export_doc" style="width: 150px; cursor: pointer;" onClick="doExport(5);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/doc.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-doc'] ?></a></li>
			<li id="export_txt" style="width: 150px; cursor: pointer;" onClick="doExport(6);"><a style="pointer-events: none; padding-left: 25px; background: transparent url('img/txt.svg') no-repeat 4px center; background-size: 18px 18px;" href="#"><?php echo $TEXT['button-export-txt'] ?></a></li>
		</ul>
	</div>
    <div id="tab_byobj" class="tab_content">
        <ul class="search_bar">
            <li>
              <label for="rpttypebyobj"><?php echo $TEXT['info-reporttype']?></label>
              <select id="rpttypebyobj" type="text" class="iselect" name="rpttypebyobj">
                  <option value="0"><?php echo $TEXT['report-byday']?></option>
                  <option value="1"><?php echo $TEXT['report-byweek']?></option>
                  <option value="2"><?php echo $TEXT['report-bymonth']?></option>
              </select>
            </li>
            <li>
              <label for="deviceobj"><?php echo $TEXT['info-objectflag']?></label>
              <input id="deviceobj" type="text" class="itext" name="device" maxlength="30" />
            </li>            
            <li>
              <label for="timebyobj1"><?php echo $TEXT['info-starttime']?></label>
              <input id="timebyobj1" type="text" autocomplete="off" class="itext itime" name="timebyobj1" maxlength="19" onclick="showcalendar(event, this, true)" />
            </li>
            <li>
              <label for="timebyobj2"><?php echo $TEXT['info-endtime']?></label>
              <input id="timebyobj2" type="text" autocomplete="off" class="itext itime" name="timebyobj2" maxlength="19" onclick="showcalendar(event, this, true)" />
            </li>
            <li>
              <input id="searchbyobj" type="button" class="small button" value="<?php echo $TEXT['button-search']?>" />
            </li>
        </ul>
        <div style="position: absolute; margin: 0; border: 1px solid #999; overflow-y: scroll; left: 4px; top:68px; width: 860px; bottom: 4px;">
        <table id="table_byobj" class="tab_report">
            <thead>
                <tr>
                    <th><?php echo $TEXT['report-no']?></th>
                    <th><?php echo $TEXT['report-kindname']?></th>
                    <th><?php echo $TEXT['info-starttime']?></th>
                    <th><?php echo $TEXT['info-endtime']?></th>                    
                    <th><?php echo $TEXT['info-operate']?></th>
                </tr>
            </thead>
        </table>
        </div>
    </div>
    <div id="tab_byuser" class="tab_content">
        <ul class="search_bar">
            <li>
              <label for="rpttypebyuser"><?php echo $TEXT['info-reporttype']?></label>
              <select id="rpttypebyuser" type="text" class="iselect" name="rpttypebyuser">
                  <option value="0"><?php echo $TEXT['report-byday']?></option>
                  <option value="1"><?php echo $TEXT['report-byweek']?></option>
                  <option value="2"><?php echo $TEXT['report-bymonth']?></option>
              </select>
            </li>
            <li>
                <label for="timebyuser1"><?php echo $TEXT['info-starttime']?></label>
                <input id="timebyuser1" type="text" autocomplete="off" class="itext itime" name="timebyuser1" maxlength="19" onclick="showcalendar(event, this, true)" />
            </li>
            <li>
                <label for="timebyuser2"><?php echo $TEXT['info-endtime']?></label>
                <input id="timebyuser2" type="text" autocomplete="off" class="itext itime" name="timebyuser2" maxlength="19" onclick="showcalendar(event, this, true)" />
            </li>
            <li>
                <input id="searchbyuser" type="button" class="small button" value="<?php echo $TEXT['button-search']?>" />
            </li>
        </ul>
      <div style="position: absolute; margin: 0; border: 1px solid #999; overflow-y: scroll; left: 4px; top:68px; width: 860px; bottom: 4px;">
        <table id="table_byuser" class="tab_report">
            <thead>
                <tr>
                    <th><?php echo $TEXT['report-no']?></th>
                    <th><?php echo $TEXT['report-kindname']?></th>
                    <th><?php echo $TEXT['info-starttime']?></th>
                    <th><?php echo $TEXT['info-endtime']?></th>                    
                    <th><?php echo $TEXT['info-operate']?></th>
                </tr>
            </thead>
        </table>
        </div>
    </div>
	<iframe id="txtAreaRpt" style="display:none"></iframe>
</div>
</body>
</html>

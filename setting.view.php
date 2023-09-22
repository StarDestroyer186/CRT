<?php
session_start();
include_once('lang.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $TEXT['navi-setting']?></title>
<link type="text/css" rel="stylesheet" href="css/button.css"/>
<link type="text/css" rel="stylesheet" href="css/style.css?v=<?php echo $last_ver['style.css']?>" />
<link type="text/css" rel="stylesheet" href="css/vanillaSelectBox.css"/>
<script type="text/javascript" src="js/jquery.min.js?v=<?php echo $last_ver['jquery.min.js']?>" ></script>
<script type="text/javascript" src="js/common.js?v=<?php echo $last_ver['common.js']?>"></script>
<script type="text/javascript" src="js/vanillaSelectBox.js"></script>
<script type='text/javascript'>
JS_UPDATE_SET = "<?php echo $TEXT['navi-updateset']?>";
JS_UPDATE_SUCC = "<?php echo $TEXT['status-updatesuccess']?>";
JS_UPDATE_FAIL = "<?php echo $TEXT['status-updatefail']?>";
JS_CHANGE_PASS = "<?php echo $TEXT['navi-chgpass']?>";
JS_GLOBAL_TIPS = "<?php echo $TEXT['global-update']?>";
JS_SELECTED = "<?php echo $TEXT['info-selected']?>";
JS_INFO_SELECT = "<?php echo $TEXT['info-select']?>"
JS_SELECT_ALL = "<?php echo $TEXT['info-select-all']?>"
JS_SELECT_ALL_ITEM = "<?php echo $TEXT['info-select-all-item']?>";
JS_SELECT_ITEMS = "<?php echo $TEXT['info-select-item']?>";
JS_SELECT_CLEAR_ALL = "<?php echo $TEXT['info-select-clear-all']?>";
JS_TEMP = "<?php echo $TEXT['info-temperature']?>";
JS_FUEL = "<?php echo $TEXT['info-fuel'] ?>";
JS_MAX_SPEED_24H = "<?php echo $TEXT['info-max-speed-24h'] ?>";
JS_ODOMETER_24H = "<?php echo $TEXT['info-odometer-24h'] ?>";
JS_INFO_MOVING_TIME_24H = "<?php echo $TEXT['info-moving-time-24h'] ?>";
JS_INFO_IDLE_TIME_24H = "<?php echo $TEXT['info-idle-time-24h'] ?>";
JS_INFO_STOP_TIME_24H = "<?php echo $TEXT['info-stop-time-24h'] ?>";
JS_INFO_ENGINE_TIME_24H = "<?php echo $TEXT['info-engine-time-24h'] ?>";
JS_ODOMETER = "<?php echo $TEXT['info-obd-mileage']?>";
JS_DRIVER_NAME = "<?php echo $TEXT['info-driver'] ?>";
JS_DOOR_STATUS = "<?php echo $TEXT['asset-infos-door-status'] ?>";
var isQueryTimeOut = false, selectAssetInfos;

// 去掉所有input的autocomplete, 显示指定的除外 
	$(function(){ 								  
	   $('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off'); 	 
	});

function doUpdateSet(){	
	isQueryTimeOut = false;
    var idLng = $("#idLng").val();
    var idLat = $("#idLat").val();
    var idDate = $("#idDate").val();
    var idTime = $("#idTime").val();
    var idLang = $("#idLang").val();
	var idZoom = $("#idZoom").val();
	var iFitBounds = $("#object_fit_bounds").prop("checked") ? 1 : 0;
	var iCollapsedGroup = $("#collapsed_asset_group").prop("checked") ? 1 : 0;
	var assetInfos = $("#asset_infos").val() == null ? '':$("#asset_infos").val().toString();
	var idShow = $("#show_all_object").prop("checked") ? 1 : 0;
	var idMarker = $("#show_marker").prop("checked") ? 1 : 0;
	var idZone = $("#show_zone").prop("checked") ? 1 : 0;
	var idSound = $("#sond_alarm").prop("checked") ? 1 : 0;
	var idPopup = $("#popup_alarm").prop("checked") ? 1 : 0;
	var unitSpeed = $("#unit_speed").find("option:selected").val();
	var unitDist = $("#unit_distance").find("option:selected").val();
	var unitFuel = $("#unit_fuel").find("option:selected").val();
	var unitTemp = $("#unit_temp").find("option:selected").val();
	var unitAltitude = $("#unit_altitude").find("option:selected").val();
	var unitTpms = $("#unit_tpms").find("option:selected").val();
	
    showLoading(true, JS_GLOBAL_TIPS);
    $("#updateSet").removeClass("enable").addClass("disable").unbind("click");
	var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#updateSet").removeClass("disable").addClass("enable").bind("click", doUpdateSet);
							   showLoading(false)}, 30000);
						   
    try{
        $.get("setting.ajax.php", { "idLat": idLat, "idLng": idLng, "idDate": idDate, "idTime": idTime, "idLang": idLang, "idZoom": idZoom, "iFitBounds": iFitBounds, "iCollapsedGroup": iCollapsedGroup, "assetInfos": assetInfos, "idShow": idShow, "idMarker": idMarker, "idZone": idZone, "idSound": idSound, "idPopup": idPopup, "unitSpeed": unitSpeed, "unitDist": unitDist, "unitFuel": unitFuel, "unitTemp": unitTemp, "unitAltitude": unitAltitude, "unitTpms": unitTpms}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            if(data.indexOf('ok') >= 0){
				var WP = window.parent;
				WP.JS_DEFAULT_DATETIME_fmt_JS = idDate + ' ' + idTime;
				WP.JS_DEFAULT_SOUND_ALARM = idSound;
				WP.JS_DEFAULT_POPUP_ALARM = idPopup;
				WP.JS_UNIT_SPEED = unitSpeed;
				WP.JS_UNIT_DISTANCE = unitDist;
				WP.JS_UNIT_FUEL = unitFuel;
				WP.JS_UNIT_TEMPERATURE = unitTemp;
				WP.JS_UNIT_ALTITUDE = unitAltitude;
				WP.JS_UNIT_TPMS = unitTpms;
				WP.JS_DEFAULT_COLLAPSED = iCollapsedGroup;
				WP.JS_DEFAULT_ASSET_INFOS = assetInfos;
				WP.initUnits();
                showMessage("succ", JS_UPDATE_SET, JS_UPDATE_SUCC, 5);
            }else{
                showMessage("stop", JS_UPDATE_SET, JS_UPDATE_FAIL, 5);
            }
			if(!isQueryTimeOut){
				$("#updateSet").removeClass("disable").addClass("enable").bind("click", doUpdateSet);
			}          
        });
    }catch(e){
        showLoading(false);
        showMessage("stop", JS_UPDATE_SET, JS_UPDATE_FAIL, 5);
        $("#updateSet").removeClass("disable").addClass("enable").bind("click", doUpdateSet);
    }
}

function doUpdatePwd(){
    isQueryTimeOut = false;
	var idOld = $("#oldpwd").val();
    var idNew = $("#newpwd").val();
    var idRep = $("#reppwd").val();
    $("#errorpwd").css("display", "none");
    if(idOld == ""){
        $("#errorpwd").css("display", "block").text("<?php echo $TEXT['status-emptyoldpass']?>");
        $("#oldpwd").focus();
        return;
    }
    if(idNew == ""){
        $("#errorpwd").css("display", "block").text("<?php echo $TEXT['status-emptynewpass']?>");
        $("#oldpwd").focus();
        return;
    }
    if(idNew != idRep){
        $("#errorpwd").css("display", "block").text("<?php echo $TEXT['status-invalidrepepass']?>");
        $("#oldpwd").focus();
        return;
    }
    showLoading(true, JS_GLOBAL_TIPS);
    $("#updatePwd").removeClass("enable").addClass("disable").unbind("click");
    var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#updatePwd").removeClass("disable").addClass("enable").bind("click", doUpdatePwd);
							   showLoading(false)}, 30000);
							   
    try{
        $.get("changpass.ajax.php", { "idOld": idOld, "idNew": idNew, "idRep": idRep }, function(data) {
            clearTimeout(timer);
			showLoading(false);
            if(data.indexOf('ok') >= 0){
                showMessage("succ", JS_CHANGE_PASS, JS_UPDATE_SUCC, 5);
            }else{
                showMessage("stop", JS_CHANGE_PASS, JS_UPDATE_FAIL, 5);
            }
			if(!isQueryTimeOut){
				$("#updatePwd").removeClass("disable").addClass("enable").bind("click", doUpdatePwd);
			}           
        });
    }catch(e){
        showLoading(false);
        showMessage("stop", JS_UPDATE_SET, JS_UPDATE_FAIL, 5);
        $("#updatePwd").removeClass("disable").addClass("enable").bind("click", doUpdatePwd);
    }
}

function doUpdateEpt()
{
    isQueryTimeOut = false;
	//check email
    var mustok = true;
    var email = $("#email").val();
    if(email != ""){
        var emails = email.split(";");
        var matchArray;
        for(var i=0;i<emails.length;i++){
            var emailPat = /^(.+)@(.+)$/;
            matchArray = emails[i].match(emailPat);
            if (matchArray == null) {
                $("#email").addClass("invalidbox").focus();
                mustok = false;
                break;
            }
        }
    }
    var rtime = $("#rtime").val();
    if(rtime != ""){
        matchArray = rtime.match(/^(\d{2}):(\d{2})/);
        if (matchArray == null || (matchArray.length == 3 && (parseInt(matchArray[1]) > 23 || parseInt(matchArray[2]) > 59))) {
            $("#rtime").addClass("invalidbox").focus();
            mustok = false;
        }
    }
	var mtype = getemailtype();
    if(!mustok)return;
    var rmail = typeof $("#rmail").prop("checked") == "undefined" ? 0 : 1;
    showLoading(true, JS_GLOBAL_TIPS);
    $("#updateEpt").removeClass("enable").addClass("disable").unbind("click");
    var timer = setTimeout(function(){
							   isQueryTimeOut = true;
							   $("#updateEpt").removeClass("disable").addClass("enable").bind("click", doUpdateEpt);
							   showLoading(false)}, 30000);
							   
    try{
        $.get("email.ajax.php", { "email": email, "rtime": rtime, "rmail": rmail, "mtype": mtype}, function(data) {
            clearTimeout(timer);
			showLoading(false);
            if(data.indexOf('ok') >= 0){
                showMessage("succ", JS_UPDATE_SET, JS_UPDATE_SUCC, 5);
            }else{
                showMessage("stop", JS_UPDATE_SET, JS_UPDATE_FAIL, 5);
            }
			if(!isQueryTimeOut){
				$("#updateEpt").removeClass("disable").addClass("enable").bind("click", doUpdateEpt);
			}           
        });
    }catch(e){
        showLoading(false);
        showMessage("stop", JS_UPDATE_SET, JS_UPDATE_FAIL, 5);
        $("#updateEpt").removeClass("disable").addClass("enable").bind("click", doUpdateEpt);
    }
}

function initemailtype(mail_type){
	mail_type =','+ mail_type +',';
	
	if(mail_type.indexOf(',0_1_1,') != -1){
		$('#rusagedy').prop("checked", true);
	}else{
		$('#rusagedy').prop("checked", false);
	}
	
	if(mail_type.indexOf(',1_0_1,') != -1){
		$('#rusagewy').prop("checked", true);
	}else{
		$('#rusagewy').prop("checked", false);
	}
	
	if(mail_type.indexOf(',0_0_2,') != -1){
		$('#rspeeddy').prop("checked", true);
	}else{
		$('#rspeeddy').prop("checked", false);
	} 
	
	if(mail_type.indexOf(',0_0_3,') != -1){
		$('#rtraveldy').prop("checked", true);
	}else{
		$('#rtraveldy').prop("checked", false);
	}

	if(mail_type.indexOf(',0_1_4,') != -1){
		$('#ralarmdy').prop("checked", true);
	}else{
		$('#ralarmdy').prop("checked", false);
	}
	
	if(mail_type.indexOf(',0_1_10,') != -1){
		$('#rgeody').prop("checked", true);
	}else{
		$('#rgeody').prop("checked", false);
	}
	
	if(mail_type.indexOf(',0_1_11,') != -1){
		$('#rmaintenance').prop("checked", true);
	}else{
		$('#rmaintenance').prop("checked", false);
	}
}

function getemailtype(){
	var email_type = '';
	if(typeof $("#rusagedy").prop("checked") != "undefined"){
		email_type = email_type + '0_1_1' + ',';
	}
	
	if(typeof $("#rusagewy").prop("checked") != "undefined"){
		email_type = email_type + '1_0_1' + ',';
	}
	
	if(typeof $("#rspeeddy").prop("checked") != "undefined"){
		email_type = email_type + '0_0_2' + ',';
	}
	
	if(typeof $("#rtraveldy").prop("checked") != "undefined"){
		email_type = email_type + '0_0_3' + ',';
	}
	
	if(typeof $("#ralarmdy").prop("checked") != "undefined"){
		email_type = email_type + '0_1_4' + ',';
	}
	
	if(typeof $("#rgeody").prop("checked") != "undefined"){
		email_type = email_type + '0_1_10' + ',';
	}
	
	if(typeof $("#rmaintenance").prop("checked") != "undefined"){
		email_type = email_type + '0_1_11' + ',';
	}
	return email_type;
}

function oninit() {
	<?php if($_SESSION['fit'] == 1){ ?>
        $("#object_fit_bounds").prop("checked", true);
    <?php }?>
	
	<?php if($_SESSION['collapsed'] == 1){ ?>
        $("#collapsed_asset_group").prop("checked", true);
    <?php }?>
	
	<?php if($_SESSION['show'] == 1){ ?>
        $("#show_all_object").prop("checked", true);
    <?php }?>
	
	<?php if($_SESSION['marker'] == 1){ ?>
        $("#show_marker").prop("checked", true);
    <?php }?>
	
	<?php if($_SESSION['zone'] == 1){ ?>
        $("#show_zone").prop("checked", true);
    <?php }?>
	
    <?php if($_SESSION['rmail'] == 1){ ?>
        $("#rmail").prop("checked", true);
    <?php }?>
	
	<?php if($_SESSION['sond_alarm'] == 1){ ?>
        $("#sond_alarm").prop("checked", true);
    <?php }?>
	<?php if($_SESSION['popup_alarm'] == 1){ ?>
        $("#popup_alarm").prop("checked", true);
    <?php }?>
	
	$("#idZoom").find("option[value='"+<?php echo $_SESSION['zoom']?>+"']").prop("selected",true);
	
	var WP = window.parent;
    $("#unit_speed option[value="+WP.JS_UNIT_SPEED+"]").prop("selected", true);
	$("#unit_distance option[value="+WP.JS_UNIT_DISTANCE+"]").prop("selected", true);
	$("#unit_fuel option[value="+WP.JS_UNIT_FUEL+"]").prop("selected", true);
	$("#unit_temp option[value="+WP.JS_UNIT_TEMPERATURE+"]").prop("selected", true);
	$("#unit_altitude option[value="+WP.JS_UNIT_ALTITUDE+"]").prop("selected", true);
	$("#unit_tpms option[value="+WP.JS_UNIT_TPMS+"]").prop("selected", true);
	
    $("#tab_chgpass,#tab_mailreport").toggle();
    $("#updateSet").bind("click", doUpdateSet);
    $("#updatePwd").bind("click", doUpdatePwd);
    $("#updateEpt").bind("click", doUpdateEpt); 
	
	selectAssetInfos = new vanillaSelectBox("#asset_infos", {
        "maxHeight": 300, 
		"minWidth": 130,
        "search": false,
		"disableSelectAll": false,
		"placeHolder": JS_INFO_SELECT,
        "translations": { "all": JS_SELECT_ALL_ITEM, "items": JS_SELECT_ITEMS,"selectAll":'['+JS_SELECT_ALL+']',"clearAll":'['+JS_SELECT_CLEAR_ALL+']' }
    });
	
	initAssetInfosUpdate();
}

function initAssetInfosUpdate(){
	var WP = window.parent;
	selectAssetInfos.empty();
	selectAssetInfos.setValue(WP.JS_DEFAULT_ASSET_INFOS.toString().split(','));
}

function haveInfo(info){
	var WP = window.parent;
	if(WP.JS_DEFAULT_ASSET_INFOS == null){
		return false;
	}else{
		var ins = WP.JS_DEFAULT_ASSET_INFOS.toString().split(',');
		for(var i = 0; i < ins.length; i++){
			if(info.toString() == ins[i]){
				return true;
			}
		}
		return false;
	}
}

</script>
<style type="text/css">
html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-size: 12px; font-family: Arial, Tahoma; color:#000 !important; overflow: auto; }
#setting { position: absolute; left: 0; top: 0;right: 0;bottom: 0; border: 1px solid #999; }
#tab_setting, #tab_chgpass, #tab_mailreport { padding: 10px; }
.icontent { width: 250px; line-height: 22px; height: 20px; border: 1px solid #666; font-size: 12px; }
.itext { width: 125px; line-height: 22px; height: 20px; border: 1px solid #666; font-size: 12px; }
.iselect { width: 130px; padding: 3px; line-height: 20px; border: 1px solid #666; font-size: 12px; -webkit-appearance: menulist-button; }
.icheck { height: 20px;  line-height: 20px; font-size: 12px;}
.error { color: #c00; font-weight: bold; }
.distext {color: #999;}
.button { width: 90px; float: left; margin-top: 0px; height: 23px;  }

</style>
</head>
<body onload="oninit();">
<div id="setting">
    <ul class="tabbar">
        <li target="#tab_setting" class="tab_active"><a href="#" title="1.<?php echo $TEXT['navi-setting']?>"></a></li>
        <li target="#tab_chgpass"><a href="#" title="2.<?php echo $TEXT['navi-chgpass']?>"></a></li>
        <!--<li target="#tab_mailreport"><a href="#" onclick="initemailtype('<?php echo $_SESSION['mtype']?>');" title="3.<?php echo $TEXT['navi-emailreport']?>"></a></li>-->
    </ul>
    <div id="tab_setting" class="tab_content">
        <table style="height: 200px;">
			<tr>
				<td valign="top">
					<table>
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
							<td><select id="asset_infos" name="asset_infos" multiple size="0">
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
					</table>
				</td>
				
				<td valign="top" style="padding-left: 50px;">
					<table>
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
					</table>
				</td>
			</tr>
            <tr>
				<td><input id="updateSet" type="button" class="small button" value="<?php echo $TEXT['button-ok']?>" /></td>
			</tr>
        </table>
    </div>
    <div id="tab_chgpass" class="tab_content">
        <table style="height: 150px;">
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
            <tr>
                <td><input id="updatePwd" type="button" class="small button" value="<?php echo $TEXT['button-ok']?>" /></td>
            </tr>
        </table>
    </div>
	<!--
    <div id="tab_mailreport" class="tab_content">
        <table style="height: 150px;">
			<tr>
                <td><label for="rmail"><?php echo $TEXT['info-emailreport']?></label></td>
                <td><input id="rmail" type="checkbox" class="icheck" name="rmail" /></td>
            </tr>
            <tr>
                <td><label for="email"><?php echo $TEXT['info-email']?></label></td>
                <td><input id="email" type="text" class="icontent" name="email" maxlength="100"value="<?php echo $_SESSION['email']?>" /></td>
            </tr>
            <tr>
                <td></td>
                <td><lable class="distext"><?php echo $TEXT['info-emailtips']?></lable><td>
            </tr>			
            <tr>
                <td><label for="rtime"><?php echo $TEXT['info-emailoffset']?></label></td>
                <td><input id="rtime" type="text" class="itext" name="rtime" maxlength="5" value="<?php echo $_SESSION['rtime']?>"/></td>
            </tr>
            <tr>
                <td></td>
                <td><lable class="distext">00:00 ~ 23:59</lable><td>
            </tr>
			<tr>
                <td><label for="rusagedy"><?php echo $TEXT['info-usagedailyreport']?></label></td>
                <td><input id="rusagedy" type="checkbox" class="icheck" name="rusagedy" /></td>
			</tr>
			<tr>
                <td><label for="rusagewy"><?php echo $TEXT['info-usageweeklyreport']?></label></td>
                <td><input id="rusagewy" type="checkbox" class="icheck" name="rusagewy" /></td>
			</tr>
			<tr>
                <td><label for="rspeeddy"><?php echo $TEXT['info-speeddailyreport']?></label></td>
                <td><input id="rspeeddy" type="checkbox" class="icheck" name="rspeeddy" /></td>
			</tr>
			<tr>
                <td><label for="rtraveldy"><?php echo $TEXT['info-traveldailyreport']?></label></td>
                <td><input id="rtraveldy" type="checkbox" class="icheck" name="rtraveldy" /></td>
			</tr>
			<tr>
                <td><label for="ralarmdy"><?php echo $TEXT['info-alarmdailyreport']?></label></td>
                <td><input id="ralarmdy" type="checkbox" class="icheck" name="ralarmdy" /></td>
			</tr>
			<tr>
                <td><label for="rgeody"><?php echo $TEXT['info-geodailyreport']?></label></td>
                <td><input id="rgeody" type="checkbox" class="icheck" name="rgeody" /></td>
			</tr>
			<tr>
                <td><label for="rmaintenance"><?php echo $TEXT['info-maintenancereport']?></label></td>
                <td><input id="rmaintenance" type="checkbox" class="icheck" name="rgeody" /></td>
			</tr>
            <tr>
                <td><input id="updateEpt" type="button" class="button enable" value="<?php echo $TEXT['button-ok']?>" /></td>
            </tr>
        </table>
    </div>
	-->
</div>

</body>
</html>

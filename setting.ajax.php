<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if(isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid']))
{
    $user_id = (int)$_SESSION['uid'];
    $idLat = isset($_GET['idLat']) ? (double)$_GET['idLat'] : (double)$_SESSION['lat'];
    $idLng = isset($_GET['idLng']) ? (double)$_GET['idLng'] : (double)$_SESSION['lng'];
    $idDate = isset($_GET['idDate']) ? $_GET['idDate'] : $_SESSION['date_fmt_js'];
    $idTime = isset($_GET['idTime']) ? $_GET['idTime'] : $_SESSION['time_fmt_js'];
	$idSound = isset($_GET['idSound']) ? $_GET['idSound'] : $_SESSION['sond_alarm'];
	$idPopup = isset($_GET['idPopup']) ? $_GET['idPopup'] : $_SESSION['popup_alarm'];
	$idZoom = isset($_GET['idZoom']) ? $_GET['idZoom'] : $_SESSION['zoom'];
	if($idZoom < 2){
		$idZoom = 2;
	}
	if($idZoom > 30){
		$idZoom = 30;
	}
	
	$iFitBounds = isset($_GET['iFitBounds']) ? $_GET['iFitBounds'] : $_SESSION['fit'];
	$iCollapsedGroup = isset($_GET['iCollapsedGroup']) ? $_GET['iCollapsedGroup'] : $_SESSION['collapsed'];
	$assetInfos = isset($_GET['assetInfos']) ? $_GET['assetInfos'] : $_SESSION['assetInfos'];
	$idShow = isset($_GET['idShow']) ? $_GET['idShow'] : $_SESSION['show'];
	$idMarker = isset($_GET['idMarker']) ? $_GET['idMarker'] : $_SESSION['marker'];
	$idZone = isset($_GET['idZone']) ? $_GET['idZone'] : $_SESSION['zone'];
	$idPage = isset($_GET['idPage']) ? $_GET['idPage'] : $_SESSION['page'];
	$pushNoti = isset($_GET['pushNoti']) ? $_GET['pushNoti'] : $_SESSION['puno'];
	
	$unitSpeed = isset($_GET['unitSpeed']) ? $_GET['unitSpeed'] : $_SESSION['unit_speed'];
	$unitDist = isset($_GET['unitDist']) ? $_GET['unitDist'] : $_SESSION['unit_distance'];
	$unitFuel = isset($_GET['unitFuel']) ? $_GET['unitFuel'] : $_SESSION['unit_fuel'];
	$unitTemp = isset($_GET['unitTemp']) ? $_GET['unitTemp'] : $_SESSION['unit_temperature'];
	$unitAltitude = isset($_GET['unitAltitude']) ? $_GET['unitAltitude'] : $_SESSION['unit_altitude'];
	$unitTpms = isset($_GET['unitTpms']) ? $_GET['unitTpms'] : $_SESSION['unit_tpms'];

    $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
    $sqlweb = "select w.* from sys_user u, web_default w where u.user_id = w.user_id and u.user_id = ?";
    $params = array($user_id);
	$data = $db->query($sqlweb, $params);
    
    if(!empty($data)){
        $subsql = "set @code = -1
				update web_default set def_lat=? * 1000000,
                def_lng=? * 1000000, def_zoom = ?, def_fit_bounds = ?, def_collapsed_group = ?, def_asset_infos = ?, def_show = ?, show_marker = ?, show_zone = ?, def_page = ?, def_date_fmt=?, def_time_fmt=?, def_sound_alarm = ?, def_popup_alarm = ?,
                unit_distance = ?, unit_fuel = ?, unit_temperature = ?, unit_speed = ?, unit_altitude = ?, unit_tpms = ?, push_notification = ?
				where user_id = ?
				set @code = 0";
		$params = array($idLat, $idLng, $idZoom, $iFitBounds, $iCollapsedGroup, $assetInfos, $idShow, $idMarker, $idZone, $idPage, $idDate, $idTime, $idSound, $idPopup, $unitDist, $unitFuel, $unitTemp, $unitSpeed, $unitAltitude, $unitTpms, $pushNoti, $user_id);
    }else{
        $subsql = "set @code = -1
				insert into web_default (user_id, def_lat, def_lng, def_zoom, def_fit_bounds, def_collapsed_group, def_asset_infos, def_show, show_marker, show_zone, def_page, def_date_fmt, def_time_fmt, def_sound_alarm, def_popup_alarm, unit_distance, unit_fuel, unit_temperature, unit_speed, unit_altitude, unit_tpms, push_notification)
                values (?, ? * 1000000, ? * 1000000, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				set @code = 0";
		$params = array($user_id, $idLat, $idLng, $idZoom, $iFitBounds, $iCollapsedGroup, $assetInfos, $idShow, $idMarker, $idZone, $idPage, $idDate, $idTime, $idSound, $idPopup, $unitDist, $unitFuel, $unitTemp, $unitSpeed, $unitAltitude, $unitTpms, $pushNoti);
    }
	
	$sql = "declare @code int
			begin try
				begin tran
				$subsql
				commit tran
			end try
			begin catch
				rollback tran
			end catch

			select @code as errcode";
	$data = $db->queryLastDS($sql,$params);
	$error_code = $data[0]['errcode'];
		
	if($error_code == 0){
        $_SESSION['lat'] = $idLat;
        $_SESSION['lng']= $idLng;
        $_SESSION['date_fmt'] = $support_datefmt[$idDate];
        $_SESSION['time_fmt'] = $support_timefmt[$idTime];
        $_SESSION['datetime_fmt_js'] =  $idDate . ' ' . $idTime;
		$_SESSION['sond_alarm']= $idSound;
		$_SESSION['popup_alarm']= $idPopup;
		$_SESSION['unit_distance']= $unitDist;
		$_SESSION['unit_fuel']= $unitFuel;
		$_SESSION['unit_temperature']= $unitTemp;
		$_SESSION['unit_speed']= $unitSpeed;
		$_SESSION['unit_altitude']= $unitAltitude;
		$_SESSION['unit_tpms']= $unitTpms;
		
		$_SESSION['zoom']= $idZoom;
		$_SESSION['fit']= $iFitBounds;
		$_SESSION['collapsed']= $iCollapsedGroup;
		$_SESSION['assetInfos']= $assetInfos;
		$_SESSION['show']= $idShow;
		$_SESSION['marker']= $idMarker;
		$_SESSION['zone']= $idZone;
		$_SESSION['page']= $idPage;
		$_SESSION['puno']= $pushNoti;
		
        echo 'ok';
    }else{
        echo 'fail';
    }
}
else echo 'no login';
?>

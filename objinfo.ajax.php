<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

$device_id = trim($_GET['device_id']);
$time_zone = isset($_GET['timezone']) ? (float)$_GET['timezone'] : 0;	
$lang = isset($_GET['lang']) ? $_GET['lang'] : "en";

$_SESSION['timezone'] = $time_zone;	
$_SESSION['lang'] = $lang;

$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
$sql = "select o.object_flag c, o.object_id oid, t.protocol_id pid, s.speed s, 
		convert(varchar(20), dbo.fn_to_client_time(s.gps_time, ?*60), 20) t, s.angle h, s.lng lng, s.lat lat, 
		s.sta_table st,s.ios_table io from cfg_device d
		left join cfg_object o on d.object_id = o.object_id
		left join cfg_device_state s on d.device_no = s.device_no
		left join sys_device_type t on d.dtype_id = t.dtype_id
		where d.device_no=?";
$params = array($time_zone, $device_id);			
$data = $db->query($sql, $params); 

if(!empty($data) ){	
	$row = $data[0];
	$x = $row['lng'] / 1000000.0;
	$y = $row['lat'] / 1000000.0;
    $pid = $row['pid'];
	$st = $row['st'];
	$io = $row['io'];
	
	$memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
    $online = memcache_get($memcache, $GLOBAL_USER);
    //memcache_set($memcache, $GLOBAL_UNIT, $s_id, 0, 0);
    $deviceinfo = memcache_get($memcache, $GLOBAL_UNIT);
    $ioparams = memcache_get($memcache, $GLOBAL_IOSP);
	$sensorParams = memcache_get($memcache, $GLOBAL_SENP);
    memcache_close($memcache);
	
	$state_table = getDeviceStatus($st);
	$io_table = getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$row['oid']], $io , 1, $ioparams[$lang]['command']);
	
	//get address
	$url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=".$x.",".$y."&f=pjson";	
	$resp_json = file_get_contents($url);
	$resp = json_decode($resp_json, true);

	if (!empty($resp['address']) and !empty($resp['address']['LongLabel'])) {
		$address = $resp['address']['LongLabel'];
	} else {
		$address = '-';
	}
	
	$ret = '<html><head>'
		.'<meta http-equiv="content-type" content="text/html; charset=UTF-8" />'
		.'<style type="text/css">'
		.'table { width: 100%; border-collapse: collapse; overflow: hidden; }'
		.'</style></head><body><table>'
		.'<tr><td><font>'.$TEXT['info-objectflag'].':</font>&nbsp;'.$row['c'].'</td></tr>'
		.'<tr><td><font>'.$TEXT['js-tip-location'].':</font>&nbsp;'.$address.'</td></tr>'
		.'<tr><td><font>'.$TEXT['navi-speed'].':</font>&nbsp;'.$row['s'].'&nbsp;km/h</td></tr>'
		.'<tr><td><font>'.$TEXT['info-gpstime'].':</font>&nbsp;'.$row['t'].'</td></tr>'		
		.'<tr><td><font>'.$TEXT['info-deviceid'].':</font>&nbsp;'.$device_id.'</td></tr>'		
		.'<tr><td><font>'.$TEXT['info-heading'].':</font>&nbsp;'.$row['h'].'</td></tr>'		
		.'<tr><td><font>'.$TEXT['info-longitude'].':</font>&nbsp;'.$x.'</td></tr>'
		.'<tr><td><font>'.$TEXT['info-latitude'].':</font>&nbsp;'.$y.'</td></tr>'		
		.'<tr><td>'.$io_table.'</td></tr>'
		.'<tr><td><font>State:</font>&nbsp;'.$state_table.'</td></tr>'
		.'</table>'
		.'</body>'
		.'</html>';

	echo $ret; 
}else{
	echo 'No data, Please confirm your device ID is correct or not.';
}

?>

<?php
session_start();
include_once('common.inc.php');
require_once 'svc.class.php';

if(isset($_SESSION['logined']) and $_SESSION['logined']){
    $s_id = session_id(); 
    $user_id = (int)$_SESSION["uid"];
	$start = $_GET['start'];
    $lang = $_SESSION['lang'];
    $svcCheck = new StateCheck();
    $onlineChanged = false;
    $infoChanged = false;
    $iosChanged = false;

    $memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);

    /*update online info*/
    $online = memcache_get($memcache, $GLOBAL_USER);
    if(!$online){
        $online = $svcCheck->createOnline();
        $onlineChanged = true;
    }
	if($start == 0){
		unset($online['list'][$user_id]);
	}
	
	$ulcahnge = $online['list'][$user_id];
	if(is_null($ulcahnge) || !empty($ulcahnge['need_update']) || !empty($ulcahnge['need_deleteo']) || !empty($ulcahnge['need_deleteg']) || is_null($_SESSION['endpoint'])){
		$endpoint = $svcCheck->createEndPoint($user_id);
		$online['list'][$user_id] = array('user_id'=>$user_id, 'need_update'=>[], 'need_deleteo'=>[], 'need_deleteg'=>[]);
		$_SESSION['endpoint'] = &$endpoint;
		$onlineChanged = true;
	}else{
        $endpoint = &$_SESSION['endpoint'];
    }
	
	if($onlineChanged){
		memcache_set($memcache, $GLOBAL_USER, $online, MEMCACHE_COMPRESSED, 0);
	}
	
    /*update ioparams*/
    $ioparams = memcache_get($memcache, $GLOBAL_IOSP);
    $iosChanged = $svcCheck->queryIoParams($lang, $ioparams);
    if($iosChanged){ 
        memcache_set($memcache, $GLOBAL_IOSP, $ioparams, MEMCACHE_COMPRESSED, 0);
    }
	
	/*update sensors*/
	$sensorParams = memcache_get($memcache, $GLOBAL_SENP);
    $sensChanged = $svcCheck->querySensors($sensorParams);
    if($sensChanged){
        memcache_set($memcache, $GLOBAL_SENP, $sensorParams, MEMCACHE_COMPRESSED, 0);
    }
    
    /*update device info list*/
	$deviceinfo = memcache_get($memcache, $GLOBAL_UNIT);
	$infoChanged = $svcCheck->timeCheck($online, $deviceinfo);    
	if($start == 0 || $infoChanged){
		memcache_set($memcache, $GLOBAL_UNIT, $deviceinfo, MEMCACHE_COMPRESSED, 0);
	}
    
    memcache_close($memcache);
    
    $data = $svcCheck->getData($deviceinfo, $endpoint, true, null,$start, false);
	
    if(!empty($data) && $start == 0 && count($data) < $GLOBALS['GLOBAL_LOAD']){
		//$_SESSION['endpoint'] = $endpoint;
		
		$json = getInfoByjson($ioparams[$lang], $sensorParams, $data);
    	echo "{\"first\": true, \"start\":".(-1).", \"data\": $json}";
		
	}else if(!empty($data) && $start == 0 && count($data) == $GLOBALS['GLOBAL_LOAD']){
		$json = getInfoByjson($ioparams[$lang], $sensorParams, $data);
		echo "{\"first\": true, \"start\":".($start + $GLOBALS['GLOBAL_LOAD']).", \"data\": $json}";
		
	}else if(!empty($data) && $start > 0 && count($data) == $GLOBALS['GLOBAL_LOAD']){
    	$json = getInfoByjson($ioparams[$lang], $sensorParams, $data);
    	echo "{\"first\": false, \"start\":".($start + $GLOBALS['GLOBAL_LOAD']).", \"data\": $json}";
		
    }else if(!empty($data) && $start > 0 && count($data) < $GLOBALS['GLOBAL_LOAD']){
		//$_SESSION['endpoint'] = $endpoint;
		
    	$json = getInfoByjson($ioparams[$lang], $sensorParams, $data);
    	echo "{\"first\": false, \"start\":".(-1).", \"data\": $json}";
		
    }else{
        echo "{\"first\": false, \"start\":".(-1).", \"data\": \"\"}";
    }
	
}
?>

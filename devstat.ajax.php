<?php
session_start();
include_once('common.inc.php');
require_once 'svc.class.php';

if((isset($_SESSION['logined']) and $_SESSION['logined']) or (isset($_SESSION['share']) and $_SESSION['share'])){
	$last_update_time = $_SESSION['last_update_time'];
	/*if(isset($last_update_time) and (time() - $last_update_time) < $GLOBAL_MIM_UPDATE){
		exit(''); //与track.view.php冲突，导致无法更新
	}*/
	
	if(isset($_POST['timezone'])){
		$_SESSION['timezone'] = $_POST['timezone'];
	} 
	
    $s_id = session_id();
    $user_id = (int)$_SESSION["uid"];
    $lang = $_SESSION['lang'];
    $svcCheck = new StateCheck();
    $onlineChanged = false;
    $infoChanged = false;
    $iosChanged = false;
	
	/*share position expire*/
	if(isset($_SESSION['share']) and $_SESSION['share'] and !($svcCheck->sharePositionValid($_SESSION['share_token']))){
		echo 'expired';
		session_unset();
		exit;
	}
	
    $memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
    /*update online info*/
    $online = memcache_get($memcache, $GLOBAL_USER);
	
    if(!$online){
        $online = $svcCheck->createOnline();
        $onlineChanged = true;
    }
	
	$ulcahnge = $online['list'][$user_id];	
	
	$objids = array_merge((array)$_POST['objid'],(array)$ulcahnge['need_update'],(array)$ulcahnge['need_deleteo']);
	if(empty($objids)){		
		exit;
	}
	
	$deleteo = $ulcahnge['need_deleteo'];
	$deleteg = $ulcahnge['need_deleteg'];
	$deletestr = (empty($deleteo) ? null : ',"deleteo":'. array2json($deleteo)).(empty($deleteg) ? null : ',"deleteg":'. array2json($deleteg));  
	
    if(is_null($ulcahnge) || !empty($ulcahnge['need_update']) || !empty($ulcahnge['need_deleteo']) || !empty($ulcahnge['need_deleteg']) || is_null($_SESSION['endpoint'])){			
		$endpoint = $svcCheck->createEndPoint($user_id, isset($_POST['track']) ? $_POST['objid']:'');
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
        memcache_set($memcache, $GLOBAL_SENP, $sensorParams, MEMCACHE_COMPRESSED, 5);
    }
    
    /*update device info list*/
    $deviceinfo = memcache_get($memcache, $GLOBAL_UNIT);
    $infoChanged = $svcCheck->timeCheck($online, $deviceinfo);
    if($infoChanged){		
        memcache_set($memcache, $GLOBAL_UNIT, $deviceinfo, MEMCACHE_COMPRESSED, 0);
    }
    memcache_close($memcache);
	
    $data = $svcCheck->getData($deviceinfo, $endpoint, false, $objids, -1, isset($_POST['track']));
	/*if (!empty($data)) {  
		$_SESSION['endpoint'] = $endpoint;
	}*/
	
    if(!empty($data)){
        $json = empty($data) ? null : getInfoByJson($ioparams[$lang], $sensorParams, $data);
        if(isset($_POST['track'])){
            echo $json;
        }else{					
			if($onlineChanged){				
				echo "{\"first\": false, \"start\":".(-1).", \"data\": $json".$deletestr."}";
			}else{
				echo "{\"first\": false, \"data\": $json".$deletestr."}";
			} 
        }
    }else if(empty($data) and !empty($deletestr)){
		if($onlineChanged){				
				echo "{\"first\": false, \"start\":".(-1).$deletestr."}";
			}else{
				echo "{\"first\": false".$deletestr."}";
			}
	}
	else{
        echo "";
    }
	$_SESSION['last_update_time'] = time();	
}else{
	echo "nologin";
}
?>

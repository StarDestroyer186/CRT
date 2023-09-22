<?php
include_once('common.inc.php');
require_once 'svc.class.php';

if (isset($_GET['type']) && isset($_GET['uid'])) {
	$type = $_GET['type'];
	$user_id = (int)$_GET["uid"];
	$svcCheck = new StateCheck();
	$memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
	/*update event info*/
	$event = memcache_get($memcache, $GLOBAL_EVENT);	
	if(!$event){
		$event = $svcCheck->createEvent();
		memcache_set($memcache, $GLOBAL_EVENT, $event, MEMCACHE_COMPRESSED, 0);				
	}
	
	switch ($type) {
        case 1: //pull		
			$lang = isset($_GET['lang']) ? $_GET['lang'] : 'en';
			$timezone = isset($_GET['timezone']) ? (float)$_GET['timezone'] : 0;						
			$data = $event['list'][$user_id];
			unset($event['list'][$user_id]);
							
			if(!empty($data)){		
				$ioparams = memcache_get($memcache, $GLOBAL_IOSP);
				$sensorParams = memcache_get($memcache, $GLOBAL_SENP);	
				memcache_set($memcache, $GLOBAL_EVENT, $event, MEMCACHE_COMPRESSED, 0);						
				$ios = $ioparams[$lang];
				
				foreach ($data as $row) {
					if (is_array($row)) {
						$pid = $row['pid'];
						// Out GEO
						if($row['a'] == 4110 && $row['q'] != ''){
							$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('C',$row['q']), 1, $ios['command']);
						}
						// In GEO
						else if($row['a'] == 4111 && $row['q'] != ''){
							$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('B',$row['q']), 1, $ios['command']);
						}
						// MainTenance
						else if(($row['a'] == 16407 || $row['a'] == 16408 || $row['a'] == 16409) && $row['q'] != ''){
							$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('D',$row['q']), 1, $ios['command']);
						}
						//Command reply
						else if($row['a'] == 20482 && $row['q'] != ''){
							$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], str_replace(array("\r\n", "\r", "\n"), "", getIonValue('19',$row['q']) . getIonValue('1A',$row['q'])), 1, $ios['command']);
						}
						//New Task
						else if($row['a'] == 16422 && $row['q'] != ''){
							$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('5A',$row['q']), 1, $ios['command']);
						}
						//Task processing
						else if($row['a'] == 16423 && $row['q'] != ''){
							$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('5B',$row['q']), 1, $ios['command']);
						}
						//Task completed
						else if($row['a'] == 16424 && $row['q'] != ''){
							$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('5C',$row['q']), 1, $ios['command']);
						}
						//Task fail
						else if($row['a'] == 16425 && $row['q'] != ''){
							$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('5D',$row['q']), 1, $ios['command']);
						}					
						// State Table Event
						else if($row['e'] != '' && $row['a'] != 20481){
							$row['a'] = getDeviceStatus(dechex($row['a']));	
						} 
						// Customize Io event
						else if($row['q'] != ''){
							// Out GEO
							if(strpos($row['e'],'100E') !== false){ 
								$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']) ." (". getIoValue('C',$row['q']) .")";
							}
							// In GEO
							else if(strpos($row['e'],'100F') !== false){ 					    
								$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']) .' ('. getIoValue('B',$row['q']) .')';
							}
							// MainTenance
							else if(strpos($row['e'],'4017') !== false || strpos($row['e'],'4018') !== false || strpos($row['e'],'4019') !== false){ 					    
								$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']) .' ('. getIoValue('D',$row['q']) .')';
							}
							// Command reply
							else if(strpos($row['e'],'5002') !== false){
								$cmdname = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('19',$row['q']), 1, $ios['command']);
								$ackcon = getIoValue('1A',$row['q']);
								if($ackcon != ""){
									$cmdname .= ' - ' .$ackcon;
								}
								$row['a'] = str_replace(array("\r\n", "\r", "\n"), "", getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']) .' ('. $cmdname .')');	
							}
							// New Task
							else if(strpos($row['e'],'4026') !== false){ 						    
								$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']) .' ('. getIoValue('5A',$row['q']) .')';
							}
							// Task processing
							else if(strpos($row['e'],'4027') !== false){ 						    
								$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']) .' ('. getIoValue('5B',$row['q']) .')';
							}
							// Task completed
							else if(strpos($row['e'],'4028') !== false){ 						   
								$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']) .' ('. getIoValue('5C',$row['q']) .')';
							}
							// Task fail
							else if(strpos($row['e'],'4029') !== false){ 						    
								$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']) .' ('. getIoValue('5D',$row['q']) .')';
							}						
							else{
								$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']);
							}								
						}
						
						$row['t'] = toCustomTime(new DateTime($row['t']), $timezone, null);
						
						unset($row['e']);
						unset($row['q']);
						unset($row['pid']);
						unset($row['oid']);	
						unset($row['ts']);								
						$ret[] = $row;					
					}
				}					
				$json = array2json($ret);
				echo $json;	
			}		
			break;
		
		case 2://push
			if(isset($_GET["pass"]) && $_GET["pass"] == $GLOBAL_EVENT_PUSH_PASS && isset($_GET["uid"]) && isset($_GET["a"]) && isset($_GET["oid"]) && isset($_GET["pid"]) && isset($_GET["t"]) && isset($_GET["ts"])){
				$a = $_GET['a'];
				$oid = $_GET['oid'];
				$pid = $_GET['pid'];
				$e = $_GET['e'];
				$q = $_GET['q'];
				$t = $_GET['t'];
				$ts = $_GET['ts'];		
				$e_row = array('a' => $a, 'oid' => $oid, 'pid' => $pid, 'e' => $e, 'q' => $q, 't' => $t, 'ts' => $ts);
				
				if(is_null($event['list'][$user_id])){
					$event['list'][$user_id] = [];		
				}
	
				$event['list'][$user_id][] = $e_row;
			
				//var_dump($event['list'][$user_id]);
				memcache_set($memcache, $GLOBAL_EVENT, $event, MEMCACHE_COMPRESSED, 0);	
				echo "ok";
			}
			break;
	}
	memcache_close($memcache);	
}
?>

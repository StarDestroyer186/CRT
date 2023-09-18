<?php

session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if ($_SESSION['logined'] and isset($_SESSION['uid'])) {
    if (isset($_GET['delid']) && ((int)$_GET['delid'] > 0)) {
		$delid = (int)$_GET['delid'];
        $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
        $sql = "update dat_alarm set finish_time = getdate() where alarm_id = $delid";       
		
		if($db->exec($sql))
        {
            echo 'ok';
        }else{
            echo 'fail';
        }
    }
    else {
		$sql = "";
		$lang = $_SESSION['lang'];
		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		if(isset($_GET['needfish']) && $_GET['needfish'] == 1){
			if(isset($_GET['objid']) && ((int)$_GET['objid'] > 0)){
				$objid = (int)$_GET['objid'];
				$sql = "select o.object_flag c, o.object_id oid, a.alarm_id n, a.alarm_type a, a.gps_time t, a.alarm_time ts, a.lng x, a.lat y, a.speed s, a.angle d, a.sta_table e, a.ios_table q, dt.protocol_id pid
				from cfg_device d, cfg_object o, sys_device_type dt, dat_alarm a
				where d.object_id = o.object_id and dt.dtype_id = d.dtype_id
				and a.device_no = d.device_no and o.object_id = $objid
				and a.alarm_time > dateadd(day, -1, getdate())
				and a.finish_time is null
				order by n";
			}else{
				$user_id = (int) $_SESSION['uid']; 
				$sql = "select o.object_flag c, o.object_id oid, a.alarm_id n, a.alarm_type a, a.gps_time t, a.alarm_time ts, a.lng x, a.lat y, a.speed s, a.angle d, a.sta_table e, a.ios_table q, dt.protocol_id pid
				from cfg_device d, cfg_object o, sys_device_type dt, dat_alarm a
				where d.last_stamp > getdate() and d.object_id = o.object_id and dt.dtype_id = d.dtype_id
				and a.device_no = d.device_no and o.group_id in (select group_id from dbo.fn_group4user($user_id) )
				and a.alarm_time > dateadd(day, -1, getdate())
				and a.finish_time is null
				order by t desc";
			}
		}else{
			if(isset($_GET['objid']) && ((int)$_GET['objid'] > 0)){
				$objid = (int)$_GET['objid'];
				$sql = "select o.object_flag c, o.object_id oid, a.alarm_id n, a.alarm_type a, a.gps_time t, a.alarm_time ts, a.lng x, a.lat y, a.speed s, a.angle d, a.sta_table e, a.ios_table q, dt.protocol_id pid
				from cfg_device d, cfg_object o, sys_device_type dt, dat_alarm a
				where d.object_id = o.object_id and dt.dtype_id = d.dtype_id
				and a.device_no = d.device_no and o.object_id = $objid
				and a.alarm_time > dateadd(hh, $GLOBAL_EVENT_HOUR, getdate())
				and a.alarm_time < dateadd(hh, 1, getdate())
				--and a.finish_time is null
				order by t desc";
			}else{
				$user_id = (int) $_SESSION['uid']; 
				$sql = "select o.object_flag c, o.object_id oid, a.alarm_id n, a.alarm_type a, a.gps_time t, a.alarm_time ts, a.lng x, a.lat y, a.speed s, a.angle d, a.sta_table e, a.ios_table q, dt.protocol_id pid
				from cfg_device d, cfg_object o, sys_device_type dt, dat_alarm a
				where d.last_stamp > getdate() and d.object_id = o.object_id and dt.dtype_id = d.dtype_id
				and a.device_no = d.device_no and o.group_id in (select group_id from dbo.fn_group4user($user_id) )
				and a.alarm_time > dateadd(hh, $GLOBAL_EVENT_HOUR, getdate())
				and a.alarm_time < dateadd(hh, 1, getdate())
				--and a.finish_time is null
				order by t desc";
			}
		}
		//echo $sql;
        
        $data = $db->query($sql);
        if (!empty($data)) {
            $memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
            $ioparams = memcache_get($memcache, $GLOBAL_IOSP);
			$sensorParams = memcache_get($memcache, $GLOBAL_SENP);
            memcache_close($memcache);
            $ios = $ioparams[$lang];
            $timezone = isset($_SESSION['timezone']) ? (float) $_SESSION['timezone'] : 0;
			$unit_speed = $_SESSION['unit_speed'];
            foreach ($data as $row) {
                if ($row != null) {
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
						//over speed inside place
						else if(strpos($row['e'],'104C') !== false){ 					    
							$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']) .' ('. getIoValue('A',$row['q']) .')';
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
						
						//$row['a'] = getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], getIonValue('64',$row['q']), 1, $ios['command']);
						
						
						//$row['a'] = getDeviceStatus(dechex($row['a'])) .' ('. getDeviceIoParam($ios[$pid], $row['q'], 1, $ios['command']).')';
					}
					/*else{
						$alarm = strtoupper(dechex($row['a']));
						$row['a'] = $GLOBALS['TEXT'][$alarm];
					}*/
					
                    $row['t'] = toCustomTime($row['t'], $timezone, $_SESSION['datetime_fmt']);
					$row['ts'] = toCustomTime($row['ts'], $timezone, $_SESSION['datetime_fmt']);
                    $status = $row['e'];
                    if($status != ''){
                        $row['e'] = '';//getDeviceStatus($status); 取消报警设备状态
                    }
                    if($row['q'] != ''){
                        
                        //$row['e'] = $row['e'] . ';' . getDeviceIoParam($ios[$pid], $sensorParams[$row['oid']], $row['q'], 1, $ios['command']);取消报警设备状态
                    }
					//speed unit
					if($unit_speed == 1 && $row['s'] >= 0){
						//mph(英里/小时)
						$row['e'] = round(speedUnitConversion($row['s']),0) .'mph, '. $row['e'];
					}else{
						$row['e'] = $row['s'] .'kph, '. $row['e'];
					}
					
					$row['st'] = $status;
					$row['io'] = $row['q'];
					
                    unset($row['q']);
                    unset($row['pid']);
					unset($row['oid']);
                    $ret[] = $row;
                }
            }
            $json = array2json($ret);
            echo $json;
        } else {
            echo '.';
        }
    }
}
?>

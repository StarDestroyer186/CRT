<?php
session_start();
include_once('common.inc.php');
require_once 'svc.class.php';
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid'])) {
    $user_id = (int) $_SESSION['uid'];    
    $lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'en';
	if(isset($_GET['rtime']) or isset($_POST['rtime'])){
		 $memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
		 $online = memcache_get($memcache, $GLOBAL_USER);
		 //memcache_set($memcache, $GLOBAL_UNIT, $s_id, 0, 0);
		 $deviceinfo = memcache_get($memcache, $GLOBAL_UNIT);
		 $ioparams = memcache_get($memcache, $GLOBAL_IOSP);
		 $sensorParams = memcache_get($memcache, $GLOBAL_SENP);
		 memcache_close($memcache);
		 
		 $type = isset($_GET['type']) ? (int) $_GET['type'] : (int) $_POST['type'];
		 $time_zone = (float)$_SESSION['timezone'];
		 $unit_speed = $_SESSION['unit_speed'];
		 $unit_dist = $_SESSION['unit_distance'];
		 $unit_fuel = $_SESSION['unit_fuel'];
		 $unit_temp = $_SESSION['unit_temperature'];
		
		 switch ($type) {
			case 0://last location report
			case 13://Not Reported report
				$sql = "select t1.object_id id,t1.object_flag c, t1.device_no n,t1.device_sim sim,t1.group_name gname,ds.lng x,ds.lat y,ds.speed s,ds.angle d,ds.valid v,ds.sta_table e,ds.ios_table q, 
						convert(varchar(20), dbo.fn_to_client_time(ds.gps_time, $time_zone*60), 120) g,convert(varchar(20), dbo.fn_to_client_time(ds.rcv_time, $time_zone*60), 120) r 
						from ( 
							select o.object_id,o.object_flag,d.device_no, d.device_sim, g.group_name
							from dbo.cfg_object o,dbo.cfg_device d, cfg_group g
							where o.group_id in (select group_id from dbo.fn_group4user($user_id)) and o.object_id = d.object_id
							and datediff(ss, d.last_stamp, getdate()) <= 0
							and o.group_id = g.group_id
							 )t1 
						left join dbo.cfg_device_state ds on ds.device_no = t1.device_no order by t1.object_id asc";
				$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
				$data = $db->query($sql);
				if (!empty($data)) {
					$datetime_fmt = $_SESSION['datetime_fmt'];
					foreach ($data as $row) {
						//speed unit
						/*if($unit_speed == 1 && $row['s'] >= 0){
							//mph(英里/小时)
							$row['s'] = round($row['s'] * 0.6213712,0);
						}*/
						$row['s'] = round(speedUnitConversion($row['s']),0);
						$pid = $deviceinfo[$row['id']]['pid'];						
						$row['g'] = $row['g'] == null ? "" : $row['g'];
						$row['r'] = $row['r'] == null ? "" : $row['r'];
						if($row['e'] != '')
							$row['e'] = getDeviceStatus($row['e']);
						if($row['q'] != '')
							$row['e'] = strlen($row['e']) > 0 ? $row['e'] . ',</br>'. getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$row['id']], $row['q'], 1, $ioparams[$lang]['command']) : getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$row['id']], $row['q'], 1, $ioparams[$lang]['command']);
						unset($row['id']);
						$output[] = $row;
					}
					$json = array2json($output);
					echo $json;
				}
				break;
				
			case 1://Trip Log Report				
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$pid = $deviceinfo[$objid]['pid'];
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";

				$data_device_id = $db->query($sql_query_device_id);
				if (!empty($data_device_id)) {
					$track_table_name = $data_device_id[0]['table_name'];
					
					$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									@last_stamp datetime,
									@total int
									
							select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
							if datediff(ss, @last_stamp, getdate()) <= 0
							begin
								select @total = count(*) from ".$track_table_name." 
								where gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
								
								if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS
								begin							
									select distinct x, y, s, d, v, e, q, g, r from (
									select distinct lng x, lat y, round(speed/1,0) s, angle d, valid v, sta_table e, ios_table q,
									convert(varchar(20), dbo.fn_to_client_time(gps_time, $time_zone*60), 120) g,convert(varchar(20), dbo.fn_to_client_time(rcv_time, $time_zone*60), 120) r 
									from ".$track_table_name." h
									where (lat <> 0 and lng <> 0)
									and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
									) g
									order by g						
								end
							end";
					try{
						$data = $db->query($sql);
						if (!empty($data)) {
							$datetime_fmt = $_SESSION['datetime_fmt'];
							foreach ($data as $row) {
								//speed unit
								/*if($unit_speed == 1 && $row['s'] >= 0){
									//mph(英里/小时)
									$row['s'] = round($row['s'] * 0.6213712,0);
								}*/
								$row['s'] = round(speedUnitConversion($row['s']),0);
								
								//$row['g'] = $row['g'] == null ? "" : toCustomTime(new DateTime($row['g']), $time_zone, $datetime_fmt);
								//$row['r'] = $row['r'] == null ? "" :toCustomTime(new DateTime($row['r']), $time_zone, $datetime_fmt);
								if($row['e'] != '')
									$row['e'] = getDeviceStatus($row['e']);
								if($row['q'] != '')
									$row['e'] = strlen($row['e']) > 0 ? $row['e'] . ',</br>'. getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$deviceinfo[$objid]['n']], $row['q'], 1, $ioparams[$lang]['command']) : getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$deviceinfo[$objid]['n']], $row['q'], 1, $ioparams[$lang]['command']);
								unset($row['q']);
								$output[] = $row;
							}
							$json = array2json($output);
							echo $json;
						}
					}catch(Exception $e){
						return $e->getMessage();
					}
				}
				break;
			case 2://History Photo Report
				$objid = (int)$_GET['objid'];				
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);

				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
								
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							declare @total int
							select @total = count(*) from dat_photo 
							where device_no = @device_no 					
							and take_time >= convert(datetime, '$time1', 20) and take_time < convert(datetime, '$time2', 20)					

							if @total <= 200
							begin
								select device_no n, camera_id id, event_type e, convert(varchar(20), dbo.fn_to_client_time(take_time, $time_zone*60), 120) t, photo p 
								from dat_photo
								where device_no = @device_no 
								and take_time >= convert(datetime, '$time1', 20) and take_time < convert(datetime, '$time2', 20)
							end
						end";
				try{
					$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
					$data = $db->query($sql);
					if (!empty($data)) {
						$datetime_fmt = $_SESSION['datetime_fmt'];
						
						foreach ($data as $row) {
							//$row['t'] = $row['t'] == null ? "" : toCustomTime(new DateTime($row['t']), $time_zone, $datetime_fmt);
							$row['p'] = $row['p'] == null ? "" : '<img src="data:image/jpeg;base64,'.base64_encode( $row['p'] ).'"/>';
							$output[] = $row;
						}
						$json = array2json($output);
						echo $json;
					}
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
				
			case 3://Asset RFID Log
				$objid = (int)$_GET['objid'];				
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);

				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
								
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							declare @total int
							select @total = count(*) from dat_rfid_history  
							where device_no = @device_no 
							and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
							
							if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS
							begin
								select d.job_number j, d.driver_name n, d.license l, d.phone p, convert(varchar(20), dbo.fn_to_client_time(gps_time, $time_zone*60), 120) t from dat_rfid_history r,cfg_driver d
								where r.device_no = @device_no and r.rfid = d.rfid 
								and r.gps_time >= convert(datetime, '$time1', 20) and r.gps_time < convert(datetime, '$time2', 20)
								order by r.gps_time
							end
						end";
						
						
				try{
					$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
					$data = $db->query($sql);
					if (!empty($data)) {
						$datetime_fmt = $_SESSION['datetime_fmt'];
						$json = array2json($data);
						echo $json;
					}
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
			case 5://Speed Chart			
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";

				$data_device_id = $db->query($sql_query_device_id);
				if (!empty($data_device_id)) {
					$track_table_name = $data_device_id[0]['table_name'];
					
					$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									@last_stamp datetime,
									@total int
									
							select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
							if datediff(ss, @last_stamp, getdate()) <= 0
							begin
								select @total = count(*) from ".$track_table_name." 
								where gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
								
								if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS*10
								begin							
									select round(speed/1,0) s, convert(varchar(20), dbo.fn_to_client_time(gps_time, $time_zone*60), 120) t
									from ".$track_table_name."
									where (lat <> 0 and lng <> 0)
									and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)									
									order by t						
								end
							end";
					try{
						$data = $db->query($sql);
						if (!empty($data)) {
							foreach ($data as $row) {
								if ($row != null) {
									//speed unit
									/*if($unit_speed == 1 && $row['s'] >= 0){
										//mph(英里/小时)
										$row['s'] = round($row['s'] * 0.6213712,0);
									}*/
									$row['s'] = round(speedUnitConversion($row['s']),0);
									
									$output[] = $row;
								}
							}
							$json = array2json($output);
							echo $json;
						}
					}catch(Exception $e){
						return $e->getMessage();
					}
				}
				break;
			case 54://Graph			
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";

				$data_device_id = $db->query($sql_query_device_id);
				if (!empty($data_device_id)) {
					$track_table_name = $data_device_id[0]['table_name'];
					
					$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									@last_stamp datetime,
									@total int
									
							select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
							if datediff(ss, @last_stamp, getdate()) <= 0
							begin
								select @total = count(*) from ".$track_table_name." 
								where gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
								
								if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS*10
								begin							
									select ios_table q, convert(varchar(20), dbo.fn_to_client_time(gps_time, $time_zone*60), 120) tg
									from ".$track_table_name."
									where (lat <> 0 and lng <> 0)
									and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)									
									order by tg						
								end
							end";
					try{
						$data = $db->query($sql);
						if (!empty($data)) {
							foreach ($data as $row) {
								if ($row != null) {																
									$output[] = $row;
								}
							}
							$json = array2json($output);
							
							$sql = "exec dbo.p_collect_fuel_event $objid, '$time1', '$time2', $GLOBAL_REFUEL_RATE, $GLOBAL_STEALFUEL_RATE, $GLOBAL_FUEL_EVENT_TIME_DIFFERENCE, 0, 0";	
							$fuel_event = $db->query($sql);
							if(!empty($fuel_event)){
								foreach ($fuel_event as $fuel_event_row) {
									if ($fuel_event_row != null) {
										$fuel_event_row['GPS_TIME'] = toCustomTime($fuel_event_row['GPS_TIME'], $time_zone, $datetime_fmt);
										$fuel_event_row['RCV_TIME'] = toCustomTime($fuel_event_row['RCV_TIME'], $time_zone, $datetime_fmt);
										//fuel unit
										/*if($unit_fuel == 1){
											//Gallon(加仑)
											$fuel_event_row['FBEFORE'] = round($fuel_event_row['FBEFORE'] * 0.2199692,0);
											$fuel_event_row['FAFTER'] = round($fuel_event_row['FAFTER'] * 0.2199692,0);
										}*/
										$fuel_event_row['FBEFORE'] = round(fuelUnitConversion($fuel_event_row['FBEFORE']),0);
										$fuel_event_row['FAFTER'] = round(fuelUnitConversion($fuel_event_row['FAFTER']),0);
																			
										if($fuel_event_row['CHANGE_TYPE'] == 1){
											$refuel_output[] = $fuel_event_row;
										}else if($fuel_event_row['CHANGE_TYPE'] == 2){
											$sfuel_output[] = $fuel_event_row;
										}
									}
								}
							}
							$rfuel = array2json($refuel_output);
							$sfuel = array2json($sfuel_output);	
							
							$sql_chart_sensor = "select element_id eid, sensor_name sn, sensor_type st, sensor_target tg from cfg_sensor where valid = 1 and object_id = $objid and (sensor_type = 1 or sensor_type = 2 or sensor_type = 4 or sensor_type = 5)";
							$chart_sensor_data = $db->query($sql_chart_sensor);					
							if (!empty($chart_sensor_data)) {					
								foreach ($chart_sensor_data as $row_chart_sensor) {
									$row_chart_sensor['eid'] = $row_chart_sensor['tg'] == -1 ? $row_chart_sensor['eid'] : $row_chart_sensor['tg'];
									$chart_sensor_output[] = $row_chart_sensor;
								}
							}
							$ctsensor = array2json($chart_sensor_output);
							//echo $json;				
							echo "{\"ios\":$json, \"rfuel\":$rfuel, \"sfuel\": $sfuel, \"ctsensor\": $ctsensor}";
						}
					}catch(Exception $e){
						return $e->getMessage();
					}
				}
				break;
			case 6://Alarm Events Report
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
			case 22:
			case 23:
			case 24:
			case 25:
			case 26:
			case 27:
			case 28:
			case 31:
			case 32:
			case 35:
			case 36:
			case 37:	
			case 40:
			case 44:
			case 45:
			case 46:
			case 48:
			case 49:
			case 50:
			case 53:
				$objid = (int)$_GET['objid'];
				$eventtype = $_GET['eventtype'];
				$eventtype_hex = dechex($eventtype);
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				
				try{
					$sql = null;
					if($type == 6){
						if($objid == -1){
							$sql = "declare @total int
									select @total = count(*) from cfg_device d, cfg_object o, dat_alarm a
									where o.group_id in (select group_id from dbo.fn_group4user($user_id)) 
									and d.object_id = o.object_id and a.device_no = d.device_no
									and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
									
									if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS
									begin
										select o.object_flag c, o.object_id oid, a.alarm_id n, a.alarm_type a, g.group_name gn, convert(varchar(20), dbo.fn_to_client_time(a.alarm_time, $time_zone*60), 120) t, a.lng x, a.lat y, a.speed s, a.angle d, a.valid v,
										convert(varchar(20), dbo.fn_to_client_time(a.gps_time, $time_zone*60), 120) g, 
										convert(varchar(20), dbo.fn_to_client_time(a.alarm_time, $time_zone*60), 120) r, 
										a.sta_table e, a.ios_table q, dt.protocol_id pid
										from cfg_device d, cfg_object o, sys_device_type dt, dat_alarm a, cfg_group g
										where o.group_id in(select group_id from dbo.fn_group4user($user_id)) 
										and d.object_id = o.object_id and dt.dtype_id = d.dtype_id
										and a.device_no = d.device_no 
										and a.gps_time >= convert(datetime, '$time1', 20) and a.gps_time < convert(datetime, '$time2', 20)
										and o.group_id = g.group_id
										and datediff(ss, d.last_stamp, getdate()) <= 0
										order by c asc
									end";
						}else{
							$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									@last_stamp datetime
									
									select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
									if datediff(ss, @last_stamp, getdate()) <= 0
									begin
										declare @total int
										select @total = count(*) from dat_alarm  
										where device_no = @device_no 
										and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
										
										if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS
										begin
											select o.object_flag c, o.object_id oid, a.alarm_id n, a.alarm_type a, g.group_name gn, convert(varchar(20), dbo.fn_to_client_time(a.alarm_time, $time_zone*60), 120) t, a.lng x, a.lat y, a.speed s, a.angle d, a.valid v,
											convert(varchar(20), dbo.fn_to_client_time(a.gps_time, $time_zone*60), 120) g, 
											convert(varchar(20), dbo.fn_to_client_time(a.alarm_time, $time_zone*60), 120) r, 
											a.sta_table e, a.ios_table q, dt.protocol_id pid
											from cfg_device d, cfg_object o, sys_device_type dt, dat_alarm a, cfg_group g
											where d.object_id = o.object_id and dt.dtype_id = d.dtype_id
											and a.device_no = d.device_no and o.object_id = $objid
											and a.gps_time >= convert(datetime, '$time1', 20) and a.gps_time < convert(datetime, '$time2', 20)
											and o.group_id = g.group_id
										end						
									end";
						}
					}else{
						if($objid == -1){
							$sql = "declare @total int
									select @total = count(*) from cfg_device d, cfg_object o, dat_alarm a
									where o.group_id in (select group_id from dbo.fn_group4user($user_id)) 
									and d.object_id = o.object_id and a.device_no = d.device_no and a.alarm_type = '$eventtype'
									and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
									
									if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS
									begin
										select o.object_flag c, o.object_id oid, a.alarm_id n, a.alarm_type a, g.group_name gn, convert(varchar(20), dbo.fn_to_client_time(a.alarm_time, $time_zone*60), 120) t, a.lng x, a.lat y, a.speed s, a.angle d, a.valid v,
										convert(varchar(20), dbo.fn_to_client_time(a.gps_time, $time_zone*60), 120) g, 
										convert(varchar(20), dbo.fn_to_client_time(a.alarm_time, $time_zone*60), 120) r, 
										a.sta_table e, a.ios_table q, dt.protocol_id pid
										from cfg_device d, cfg_object o, sys_device_type dt, dat_alarm a, cfg_group g
										where o.group_id in(select group_id from dbo.fn_group4user($user_id)) 
										and d.object_id = o.object_id and dt.dtype_id = d.dtype_id
										and a.device_no = d.device_no
										and (a.alarm_type = '$eventtype' /*or (alarm_type = 20481 and charindex('$eventtype_hex', sta_table) > 0 and (charindex('$eventtype_hex', sta_table)-1) % 4 = 0)*/) and a.gps_time >= convert(datetime, '$time1', 20) and a.gps_time < convert(datetime, '$time2', 20)
										and datediff(ss, d.last_stamp, getdate()) <= 0
										and o.group_id = g.group_id
									end";
						}else{
							$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									@last_stamp datetime
									
									select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
									if datediff(ss, @last_stamp, getdate()) <= 0
									begin
										declare @total int
										select @total = count(*) from dat_alarm  
										where device_no = @device_no 
										and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
										
										if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS
										begin
											select o.object_flag c, o.object_id oid, a.alarm_id n, a.alarm_type a, g.group_name gn, convert(varchar(20), dbo.fn_to_client_time(a.alarm_time, $time_zone*60), 120) t, a.lng x, a.lat y, a.speed s, a.angle d, a.valid v,
											convert(varchar(20), dbo.fn_to_client_time(a.gps_time, $time_zone*60), 120) g, 
											convert(varchar(20), dbo.fn_to_client_time(a.alarm_time, $time_zone*60), 120) r, 
											a.sta_table e, a.ios_table q, dt.protocol_id pid
											from cfg_device d, cfg_object o, sys_device_type dt, dat_alarm a, cfg_group g
											where d.object_id = o.object_id and dt.dtype_id = d.dtype_id
											and a.device_no = d.device_no and o.object_id = $objid
											and (a.alarm_type = '$eventtype' /*or (alarm_type = 20481 and charindex('$eventtype_hex', sta_table) > 0 and (charindex('$eventtype_hex', sta_table)-1) % 4 = 0)*/) and a.gps_time >= convert(datetime, '$time1', 20) and a.gps_time < convert(datetime, '$time2', 20)
											and o.group_id = g.group_id
										end						
									end";
						}
					}
					
						
					$data = $db->query($sql);
					//echo $sql;
					if (!empty($data)) {
						$datetime_fmt = $_SESSION['datetime_fmt'];
						foreach ($data as $row) {
							if ($row != null) {
								//speed unit
								/*if($unit_speed == 1 && $row['s'] >= 0){
									//mph(英里/小时)
									$row['s'] = round($row['s'] * 0.6213712,0);
								}*/
								$row['s'] = round(speedUnitConversion($row['s']),0);
								
								//$row['t'] = $row['t'] == null ? "" : toCustomTime(new DateTime($row['t']), $time_zone, $datetime_fmt);
								$alarm = strtoupper(dechex($row['a']));
								$row['a'] = $alarm == "5001" ? getIoValue('64',$row['q']) : $GLOBALS['TEXT'][$alarm];
								if($row['e'] != '')
									$row['e'] = getDeviceStatus($row['e']);
								if($row['q'] != '')
									$row['e'] = strlen($row['e']) > 0 ? $row['e'] . ',</br>'. getDeviceIoParam($ioparams[$lang][$row['pid']], $sensorParams[$row['oid']], $row['q'], 1, $ioparams[$lang]['command']) : getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$row['oid']], $row['q'], 1, $ioparams[$lang]['command']);
								unset($row['q']);
								unset($row['pid']);
								unset($row['oid']);
								$output[] = $row;
							}
						}
						$json = array2json($output);
						echo $json;
					}
				}catch(Exception $e){
					return $e->getMessage();
				}			
				break;
			case 7://Fuel Chart			
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";

				$data_device_id = $db->query($sql_query_device_id);
				if (!empty($data_device_id)) {
					$track_table_name = $data_device_id[0]['table_name'];
					
					$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									@last_stamp datetime,
									@total int
									
							select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
							if datediff(ss, @last_stamp, getdate()) <= 0
							begin
								select @total = count(*) from ".$track_table_name." 
								where (charindex('1e:',ios_table) > 0 or charindex('1f:',ios_table) > 0) 
								and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
								
								if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS*10
								begin							
									select round(speed/1,0) s, dbo.fn_io4value('1e',ios_table) f, dbo.fn_io4value('1f',ios_table) f2, convert(varchar(20), dbo.fn_to_client_time(gps_time, $time_zone*60), 120) t
									from ".$track_table_name."
									where (charindex('1e:',ios_table) > 0 or charindex('1f:',ios_table) > 0) 
									and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)									
									order by t						
								end
							end";
					try{
						$data = $db->query($sql);
						if (!empty($data)) {
							$datetime_fmt = $_SESSION['datetime_fmt'];
							foreach ($data as $row) {
								if ($row != null) {
									//fuel unit
									/*if($unit_fuel == 1 && $row['f'] >= 0){
										//Gallon(加仑)
										$row['f'] = round($row['f'] * 0.2199692,0);
									}
									if($unit_fuel == 1 && $row['f2'] >= 0){
										//Gallon(加仑)
										$row['f2'] = round($row['f2'] * 0.2199692,0);
									}*/
									$row['f'] = round(fuelUnitConversion($row['f']),0);
									$row['f2'] = round(fuelUnitConversion($row['f2']),0);
									$output[] = $row;
								}
							}
							$fuel = array2json($output);
							
							$sql = "exec dbo.p_collect_fuel_event $objid, '$time1', '$time2', $GLOBAL_REFUEL_RATE, $GLOBAL_STEALFUEL_RATE, $GLOBAL_FUEL_EVENT_TIME_DIFFERENCE, 0, 0";	
							$fuel_event = $db->query($sql);
							if(!empty($fuel_event)){
								foreach ($fuel_event as $fuel_event_row) {
									if ($fuel_event_row != null) {
										$fuel_event_row['GPS_TIME'] = toCustomTime($fuel_event_row['GPS_TIME'], $time_zone, $datetime_fmt);
										$fuel_event_row['RCV_TIME'] = toCustomTime($fuel_event_row['RCV_TIME'], $time_zone, $datetime_fmt);
										//fuel unit
										/*if($unit_fuel == 1){
											//Gallon(加仑)
											$fuel_event_row['FBEFORE'] = round($fuel_event_row['FBEFORE'] * 0.2199692,0);
											$fuel_event_row['FAFTER'] = round($fuel_event_row['FAFTER'] * 0.2199692,0);
										}*/
										$fuel_event_row['FBEFORE'] = round(fuelUnitConversion($fuel_event_row['FBEFORE']),0);
										$fuel_event_row['FAFTER'] = round(fuelUnitConversion($fuel_event_row['FAFTER']),0);
																			
										if($fuel_event_row['CHANGE_TYPE'] == 1){
											$refuel_output[] = $fuel_event_row;
										}else if($fuel_event_row['CHANGE_TYPE'] == 2){
											$sfuel_output[] = $fuel_event_row;
										}
									}
								}
							}
							$rfuel = array2json($refuel_output);
							$sfuel = array2json($sfuel_output);																			
							
							echo "{'fuel':$fuel, 'rfuel':$rfuel, 'sfuel': $sfuel}";
						}
					}catch(Exception $e){
						return $e->getMessage();
					}
				}
				break;
			case 8://Refuel Log
				$objid = (int)$_GET['objid'];				
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";

				$data_device_id = $db->query($sql_query_device_id);
				if (!empty($data_device_id)) {
					$track_table_name = $data_device_id[0]['table_name'];
					
					$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
								
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							declare @total int
							select @total = count(*) from ".$track_table_name."  
							where charindex('1e:',ios_table) > 0 
							and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)				

							if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS * 10
							begin
								exec dbo.p_collect_fuel_event $objid, '$time1', '$time2', $GLOBAL_REFUEL_RATE, $GLOBAL_STEALFUEL_RATE, $GLOBAL_FUEL_EVENT_TIME_DIFFERENCE, 1, 0
							end
						end";
					try{						
						$data = $db->query($sql);
						if (!empty($data)) {
							$datetime_fmt = $_SESSION['datetime_fmt'];
							foreach ($data as $row) {
								if ($row != null) {
									$row['SENSOR_ID'] = $row['SENSOR_ID'] - 29;
									$row['GPS_TIME'] = toCustomTime($row['GPS_TIME'], $time_zone, $datetime_fmt);
									//fuel unit
									/*if($unit_fuel == 1){
										//Gallon(加仑)
										$row['FBEFORE'] = round($row['FBEFORE'] * 0.2199692,0);
										$row['FAFTER'] = round($row['FAFTER'] * 0.2199692,0);
									}*/
									$row['FBEFORE'] = round(fuelUnitConversion($row['FBEFORE']),0);
									$row['FAFTER'] = round(fuelUnitConversion($row['FAFTER']),0);
									
									$row['r'] = $row['FAFTER'] - $row['FBEFORE'];
									if($row['r'] > 0){
										$output[] = $row;
									}
								}
							}
							$json = array2json($output);
							echo $json;
						}
					}catch(Exception $e){
						return $e->getMessage();
					}
				}								
				break;	
			case 9://Steal fuel Log
				$objid = (int)$_GET['objid'];				
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";

				$data_device_id = $db->query($sql_query_device_id);
				if (!empty($data_device_id)) {
					$track_table_name = $data_device_id[0]['table_name'];
					
					$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
								
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							declare @total int
							select @total = count(*) from ".$track_table_name."  
							where charindex('1e:',ios_table) > 0 
							and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)				

							if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS * 10
							begin
								exec dbo.p_collect_fuel_event $objid, '$time1', '$time2', $GLOBAL_REFUEL_RATE, $GLOBAL_STEALFUEL_RATE, $GLOBAL_FUEL_EVENT_TIME_DIFFERENCE, 2, 0
							end
						end";
					try{						
						$data = $db->query($sql);
						if (!empty($data)) {
							$datetime_fmt = $_SESSION['datetime_fmt'];
							foreach ($data as $row) {
								if ($row != null) {
									$row['SENSOR_ID'] = $row['SENSOR_ID'] - 29;
									$row['GPS_TIME'] = toCustomTime($row['GPS_TIME'], $time_zone, $datetime_fmt);
									//fuel unit
									/*if($unit_fuel == 1){
										//Gallon(加仑)
										$row['FBEFORE'] = round($row['FBEFORE'] * 0.2199692,0);
										$row['FAFTER'] = round($row['FAFTER'] * 0.2199692,0);
									}*/
									$row['FBEFORE'] = round(fuelUnitConversion($row['FBEFORE']),0);
									$row['FAFTER'] = round(fuelUnitConversion($row['FAFTER']),0);
									
									$row['s'] = $row['FBEFORE'] - $row['FAFTER'];
									if($row['s'] > 0){
										$output[] = $row;
									}
								}
							}
							$json = array2json($output);
							echo $json;
						}
					}catch(Exception $e){
						return $e->getMessage();
					}
				}				
				break;
			case 10://Temperature Chart			
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";

				$data_device_id = $db->query($sql_query_device_id);
				if (!empty($data_device_id)) {
					$track_table_name = $data_device_id[0]['table_name'];
					
					$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									@last_stamp datetime,
									@total int
									
							select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
							if datediff(ss, @last_stamp, getdate()) <= 0
							begin
								select @total = count(*) from ".$track_table_name." 
								where (charindex('48:',ios_table) > 0 or charindex('49:',ios_table) > 0)
								and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
								
								if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS*10
								begin							
									select dbo.fn_io4value('48',ios_table) w, dbo.fn_io4value('49',ios_table) w2, convert(varchar(20), dbo.fn_to_client_time(gps_time, $time_zone*60), 120) t
									from ".$track_table_name."
									where (charindex('48:',ios_table) > 0 or charindex('49:',ios_table) > 0)
									and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)									
									order by t						
								end
							end";
					try{
						$data = $db->query($sql);
						if (!empty($data)) {
							foreach ($data as $row) {
								if ($row != null) {
									//temp unit
									/*if($unit_temp == 1){
										//Fahrenheit
										$row['w'] = round(($row['w']/10.0) * 1.8 + 32,1);
									}else{
										//Celsius
										$row['w'] = round($row['w']/10.0,1);
									}*/
									$row['w'] = round(tempUnitConversion($row['w']/10.0),1);
																	
									/*if($unit_temp == 1){
										//Fahrenheit
										$row['w2'] = round(($row['w2']/10.0) * 1.8 + 32,1);
									}else{
										//Celsius
										$row['w2'] = round($row['w2']/10.0,1);
									}*/
									$row['w2'] = round(tempUnitConversion($row['w2']/10.0),1);
									
									$output[] = $row;
								}
							}
							
							$json = array2json($output);
							echo $json;
						}
					}catch(Exception $e){
						return $e->getMessage();
					}
				}
				break;
			case 11://Asset Daily Usage Report			
				$objids = $_POST['objids'];
				$time1 = $_POST['stime'];//toServerTime(strtotime($_POST['stime']), $time_zone);
				$time2 = $_POST['etime'];//toServerTime(strtotime($_POST['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);

				$sql = "select o.OBJECT_ID, convert(nvarchar(10) ,COLLECT_DATE,120) COLLECT_DATE, MILEAGE, DRIVING_TIME, STOP_TIME, AVG_SPEED, MAX_SPEED, isnull(idle_times,0) IDLE_TIMES, isnull(idle_time,0) IDLE_TIME, isnull(heavy_duty_time,0) HEAVY_DUTY_TIME,
						isnull(harsh_acceleration_times,0) HARSH_ACCELERATION_TIMES, isnull(harsh_braking_times,0) HARSH_BRAKING_TIMES, isnull(harsh_cornering_times,0) HARSH_CORNERING_TIMES,
						isnull(sensor_fuel,0) SENSOR_FUEL, isnull(estimate_fuel,0) ESTIMATE_FUEL, isnull(can_fuel,0) CAN_FUEL, isnull(speeding_dist,0) SPEEDING_DIST,
						isnull(speeding_time,0) SPEEDING_TIME, isnull(speeding_count,0) SPEEDING_COUNT, isnull(engine_on_count,0) ENGINE_ON_COUNT from dbo.cfg_device d, dbo.cfg_object o, dbo.rpt_usage r where 
						d.object_id = o.object_id and o.object_id = r.object_id and datediff(ss, d.last_stamp, getdate()) <= 0 and
					   ";
				$where = "";
				foreach($objids as $o) {
					$where .= " or r.object_id=".$o;
				}
				$sql .= "(".substr($where,4).")"." and r.collect_date between '$time1' and '$time2' order by o.OBJECT_ID, COLLECT_DATE";
				
				try{
					$data = $db->query($sql);
					if (!empty($data)) {
						$datetime_fmt = $_SESSION['datetime_fmt'];
						foreach ($data as $row) {
							if ($row != null) {
								//speed unit
								/*if($unit_speed == 1 && $row['AVG_SPEED'] >= 0){
									//mph(英里/小时)
									$row['AVG_SPEED'] = round($row['AVG_SPEED'] * 0.6213712,0);
								}*/
								$row['AVG_SPEED'] = round(speedUnitConversion($row['AVG_SPEED']),0);
								
								/*if($unit_speed == 1 && $row['MAX_SPEED'] >= 0){
									//mph(英里/小时)
									$row['MAX_SPEED'] = round($row['MAX_SPEED'] * 0.6213712,0);
								}*/
								$row['MAX_SPEED'] = round(speedUnitConversion($row['MAX_SPEED']),0);
								
								//distance unit
								/*if($unit_dist == 1){
									$row['MILEAGE'] = round($row['MILEAGE'] * 0.6213712,0);
									$row['OVER_SPEED_DIST'] = round($row['OVER_SPEED_DIST'] * 0.6213712,0);
								}else if($unit_dist == 2){
									$row['MILEAGE'] = round($row['MILEAGE'] * 0.5399568,0);
									$row['OVER_SPEED_DIST'] = round($row['OVER_SPEED_DIST'] * 0.5399568,0);
								}*/
								$row['MILEAGE'] = round(mileageUnitConversion($row['MILEAGE']),0);
								$row['OVER_SPEED_DIST'] = round(mileageUnitConversion($row['OVER_SPEED_DIST']),0);
								
								//fuel unit
								/*if($unit_fuel == 1){
									$row['SENSOR_FUEL'] = round($row['SENSOR_FUEL'] * 0.2199692,0);
									$row['ESTIMATE_FUEL'] = round($row['ESTIMATE_FUEL'] * 0.2199692,0);
									$row['CAN_FUEL'] = round($row['CAN_FUEL'] * 0.2199692,0);
								}*/
								$row['SENSOR_FUEL'] = round(fuelUnitConversion($row['SENSOR_FUEL']),0);
								$row['ESTIMATE_FUEL'] = round(fuelUnitConversion($row['ESTIMATE_FUEL']),0);
								$row['CAN_FUEL'] = round(fuelUnitConversion($row['CAN_FUEL']),0);
								
								
								//$row['COLLECT_DATE'] = toCustomTime($row['COLLECT_DATE'], $time_zone, $datetime_fmt);
								$output[] = $row;
							}
						}
						$json = array2json($output);
						echo $json;
					}
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
			case 12://Daily travel Report			
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$sotime = $_GET['rduration'];
				$time_zone_mins = $time_zone*60;
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";

				$data_device_id = $db->query($sql_query_device_id);
				if (!empty($data_device_id)) {
					$track_table_name = $data_device_id[0]['table_name'];
					
					$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									@last_stamp datetime
									
							select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
							if datediff(ss, @last_stamp, getdate()) <= 0
							begin
								exec dbo.p_collect_drives_and_stops $objid, '$time1', '$time2', 100, $sotime, $time_zone_mins
							end";
					try{
						$data = $db->query($sql);
						if (!empty($data)) {
							foreach ($data as $row) {
								if ($row != null) {
									//speed unit
									/*if($unit_speed == 1 && $row['AVG_SPEED'] >= 0){
										//mph(英里/小时)
										$row['AVG_SPEED'] = round($row['AVG_SPEED'] * 0.6213712,0);
									}*/
									$row['AVG_SPEED'] = round(speedUnitConversion($row['AVG_SPEED']),0);
									
									/*if($unit_speed == 1 && $row['MAX_SPEED'] >= 0){
										//mph(英里/小时)
										$row['MAX_SPEED'] = round($row['MAX_SPEED'] * 0.6213712,0);
									}*/
									$row['MAX_SPEED'] = round(speedUnitConversion($row['MAX_SPEED']),0);
									
									//distance unit
									/*if($unit_dist == 1){
										$row['MILEAGE'] = round($row['MILEAGE'] * 0.6213712,0);
										$row['OVER_SPEED_DIST'] = round($row['OVER_SPEED_DIST'] * 0.6213712,0);
									}else if($unit_dist == 2){
										$row['MILEAGE'] = round($row['MILEAGE'] * 0.5399568,0);
										$row['OVER_SPEED_DIST'] = round($row['OVER_SPEED_DIST'] * 0.5399568,0);
									}*/
									$row['MILEAGE'] = round(mileageUnitConversion($row['MILEAGE']),0);
									$row['OVER_SPEED_DIST'] = round(mileageUnitConversion($row['OVER_SPEED_DIST']),0);
									
									$output[] = $row;
								}
							}
							
							$json = array2json($output);
							echo $json;
						}
					}catch(Exception $e){
						return $e->getMessage();
					}
				}
				break;
				
			case 29:
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$datetime_fmt = $_SESSION['datetime_fmt'];
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				
				//if($objid == -1){
				//	$sql = "exec dbo.p_collect_max_speed_info 1, 0, $user_id, '$time1', '$time2'";					
				//}else{
					$sql = "exec dbo.p_collect_max_speed_info 0, $objid, 0, '$time1', '$time2'";					
				//}
							
				try{
					$data = $db->query($sql);					
					if (!empty($data)) {
						foreach ($data as $row) {
							//speed unit
							/*if($unit_speed == 1 && $row['MAX_SPEED'] >= 0){
								//mph(英里/小时)
								$row['MAX_SPEED'] = round($row['MAX_SPEED'] * 0.6213712,0);
							}*/
							$row['MAX_SPEED'] = round(speedUnitConversion($row['MAX_SPEED']),0);
							
							//$row['GPS_TIME'] = toCustomTime($row['GPS_TIME'], $time_zone, $datetime_fmt);
							$output[] = $row;
						}
						$json = array2json($output);
						echo $json;
					}	
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;	

			case 30:
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$datetime_fmt = $_SESSION['datetime_fmt'];
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);				
				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
									
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							exec dbo.p_collect_alcohol_ad $objid, '$time1', '$time2'
						end";					
	
				try{
					$data = $db->query($sql);
					if (!empty($data)) {	
						foreach ($data as $row) {
							$output[] = $row;
						}
						$json = array2json($output);
						echo $json;
					}	
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;

			case 33:
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$datetime_fmt = $_SESSION['datetime_fmt'];
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				
				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
									
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							exec dbo.p_collect_speeding_time $objid, '$time1', '$time2'
						end";					
							
				try{
					$data = $db->query($sql);					
					if (!empty($data)) {
						foreach ($data as $row) {
							//speed unit
							/*if($unit_speed == 1 && $row['AVG_SPEED'] >= 0){
								//mph(英里/小时)
								$row['AVG_SPEED'] = round($row['AVG_SPEED'] * 0.6213712,0);
							}*/
							$row['AVG_SPEED'] = round(speedUnitConversion($row['AVG_SPEED']),0);
							
							/*if($unit_speed == 1 && $row['MAX_SPEED'] >= 0){
								//mph(英里/小时)
								$row['MAX_SPEED'] = round($row['MAX_SPEED'] * 0.6213712,0);
							}*/
							$row['MAX_SPEED'] = round(speedUnitConversion($row['MAX_SPEED']),0);
							
							//distance unit
							/*if($unit_dist == 1){
								$row['DISTANCE'] = round($row['DISTANCE'] * 0.6213712,0);
							}else if($unit_dist == 2){
								$row['DISTANCE'] = round($row['DISTANCE'] * 0.5399568,0);
							}*/
							$row['DISTANCE'] = round(mileageUnitConversion($row['DISTANCE']),0);
							
							//$row['GPS_TIME_START'] = toCustomTime($row['GPS_TIME_START'], $time_zone, $datetime_fmt);
							//$row['GPS_TIME_END'] = toCustomTime($row['GPS_TIME_END'], $time_zone, $datetime_fmt);
							$output[] = $row;
						}
						$json = array2json($output);
						echo $json;
					}	
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
				
			case 34:
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$rduration = $_GET['rduration'];
				$datetime_fmt = $_SESSION['datetime_fmt'];
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$itime_zone = $time_zone*60;
				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
									
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							exec dbo.p_collect_stops_detail $objid, '$time1', '$time2', $rduration, 1, $itime_zone
						end";					
							
				try{
					$data = $db->query($sql);					
					if (!empty($data)) {
						foreach ($data as $row) {
							//$row['START_TIME'] = toCustomTime($row['START_TIME'], $time_zone, $datetime_fmt);
							//$row['END_TIME'] = toCustomTime($row['END_TIME'], $time_zone, $datetime_fmt);
							$output[] = $row;
						}
						$json = array2json($output);
						echo $json;
					}	
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
				
			case 38:
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$distance = $_GET['distance'];
				$datetime_fmt = $_SESSION['datetime_fmt'];
				$mtime_zone = $time_zone * 60;
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				
				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
									
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							exec dbo.p_collect_moves_detail $objid, '$time1', '$time2', $distance, $mtime_zone, 0
						end";					
							
				try{
					$data = $db->query($sql);					
					if (!empty($data)) {
						$pid = $deviceinfo[$objid]['pid'];	
						foreach ($data as $row) {
							if($row['STA_TABLE_START'] != '')
								$row['e1'] = getDeviceStatus($row['STA_TABLE_START']);
							if($row['STA_TABLE_END'] != '')
								$row['e2'] = getDeviceStatus($row['STA_TABLE_END']);
								
							if($row['IOS_TABLE_START'] != '')
								$row['e1'] = strlen($row['e1']) > 0 ? $row['e1'] . ',</br>'. getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$deviceinfo[$objid]['n']], $row['IOS_TABLE_START'], 1, $ioparams[$lang]['command']) : getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$deviceinfo[$objid]['n']], $row['IOS_TABLE_START'], 1, $ioparams[$lang]['command']);
							if($row['IOS_TABLE_END'] != '')
								$row['e2'] = strlen($row['e2']) > 0 ? $row['e2'] . ',</br>'. getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$deviceinfo[$objid]['n']], $row['IOS_TABLE_END'], 1, $ioparams[$lang]['command']) : getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$deviceinfo[$objid]['n']], $row['IOS_TABLE_END'], 1, $ioparams[$lang]['command']);
							
							unset($row['STA_TABLE_START']);
							unset($row['STA_TABLE_END']);
							unset($row['IOS_TABLE_START']);
							unset($row['IOS_TABLE_END']);
							$output[] = $row;
						}
						$json = array2json($output);
						echo $json;
					}	
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
				
			case 39://Asset Usage Report Real Time			
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";

				$data_device_id = $db->query($sql_query_device_id);
				if (!empty($data_device_id)) {
					$track_table_name = $data_device_id[0]['table_name'];
					
					$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									@last_stamp datetime,
									@total int
									
							select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
							if datediff(ss, @last_stamp, getdate()) <= 0
							begin
								select @total = count(*) from ".$track_table_name." 
								where gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20)
								
								if @total <= $GLOBAL_DOWNLOAD_MAX_POINTS
								begin							
									declare @code int,
											@track_name nvarchar(200),
											@driv_time int,
											@mileage int,
											@stop_time int,
											@idle_time int,
											@heavy_duty_time int,
											@avg_speed int,
											@max_speed int,
											@sensor_fuel_consumption int,
											@estimate_fuel_consumption int,
											@can_fuel_consumption int,
											@speeding_dist int,
											@speeding_time int,
											@speeding_count int,
											@engine_count int,
											@idle_times        int,
											@harsh_acceleration_times int,
											@harsh_braking_times      int,
											@harsh_cornering_times    int,
											@can_len int,
											@object_id     int	
											
									create table #temp_over_speed(
										object_id          int,		
										object_flag        nvarchar(50),
										group_name         nvarchar(50),
										driver_name        nvarchar(50),
										userdef_flag       nvarchar(50),
										lng                int,
										lat                int,
										av_speed           int,        --平均速度
										max_speed          int,        --最大速度
										distance           float,      --单位:km
										gps_time_start     datetime, 
										gps_time_end       datetime,
										last_time_second   int,        --持续时间(秒)
										last_time_format   varchar(20) --持续时间(hh:mm:ss)
									)
											
									set @track_name = 'track_' + @device_no
									select @can_len = dt.can_mileage 
								    from dbo.cfg_device d,dbo.sys_device_type dt 
								    where d.dtype_id = dt.dtype_id and d.device_no = @device_no
									
									truncate table #temp_over_speed
									select @object_id = object_id from dbo.cfg_device where device_no = @device_no
									insert into #temp_over_speed(object_id,object_flag,group_name,driver_name,userdef_flag,lng,lat, av_speed, max_speed,distance,gps_time_start,gps_time_end,last_time_second,last_time_format) exec dbo.p_collect_speeding_time @object_id, '$time1', '$time2'
						   
									
									exec @mileage = dbo.p_collect_mileage '$time1', '$time2', @track_name, @can_len
									exec @driv_time = dbo.p_collect_drivtime '$time1', '$time2', @track_name	 
									exec @stop_time = dbo.p_collect_stoptime '$time1', '$time2', @track_name
									exec @idle_time = dbo.p_collect_idletime '$time1', '$time2', @track_name
									exec @heavy_duty_time = dbo.p_collect_dutytime '$time1', '$time2', @track_name
									exec @avg_speed = dbo.p_collect_avg_speed '$time1', '$time2', @track_name
									exec @max_speed = dbo.p_collect_max_speed '$time1', '$time2', @track_name
									exec @sensor_fuel_consumption = dbo.p_collect_sensor_fuel '$time1', '$time2', @track_name
								    exec @estimate_fuel_consumption = dbo.p_collect_estimate_fuel '$time1', '$time2', @track_name
									exec @can_fuel_consumption = dbo.p_collect_can_fuel '$time1', '$time2', @track_name
								    select @speeding_dist = isnull(sum(distance),0) from #temp_over_speed
								    select @speeding_time = isnull(sum(last_time_second),0) from #temp_over_speed
								    select @speeding_count = count(*) from #temp_over_speed
								    exec @engine_count = dbo.p_collect_engine_count '$time1','$time2',@track_name 
									exec @idle_times = dbo.p_collect_alarm_times '$time1','$time2',@device_no,4164			
									exec @harsh_acceleration_times = dbo.p_collect_alarm_times '$time1','$time2',@device_no,4170		
									exec @harsh_braking_times = dbo.p_collect_alarm_times '$time1','$time2',@device_no,4171		
									exec @harsh_cornering_times = dbo.p_collect_alarm_times '$time1','$time2',@device_no,4173
									
									
									select convert(decimal(18,0), @mileage / 1000.0) m, dbo.fn_sec2time(@driv_time, null) as dt, 
									dbo.fn_sec2time(@stop_time, null) as st, @avg_speed as s, @max_speed ms, @idle_times its,
									dbo.fn_sec2time(@idle_time, null) as it, dbo.fn_sec2time(@heavy_duty_time, null) as dut, @harsh_acceleration_times has, @harsh_braking_times hbs, @harsh_cornering_times hcs,
									round(isnull(@sensor_fuel_consumption,0)/100.0,2) sfc, round(isnull(@estimate_fuel_consumption,0)/100.0,2) efc, round(isnull(@can_fuel_consumption,0),2) cfc, @speeding_dist spd, dbo.fn_sec2time(@speeding_time, null) spt, @speeding_count spc, @engine_count engc						   								
								end
								else 
								begin
									select -1 as errcode
								end
							end
							else 
							begin
								select -2 as errcode
							end";	
					try{
						$data = $db->queryLastDS($sql);
						$error_code = $data[0]['errcode'];
						if (is_null($error_code) && !empty($data)) {
							$datetime_fmt = $_SESSION['datetime_fmt'];
							foreach ($data as $row) {
								if ($row != null) {
									//speed unit
									/*if($unit_speed == 1 && $row['s'] >= 0){
										//mph(英里/小时)
										$row['s'] = round($row['s'] * 0.6213712,0);
									}*/
									$row['s'] = round(speedUnitConversion($row['s']),0);
									/*if($unit_speed == 1 && $row['ms'] >= 0){
										//mph(英里/小时)
										$row['ms'] = round($row['ms'] * 0.6213712,0);
									}*/
									$row['ms'] = round(speedUnitConversion($row['ms']),0);
									
									//distance unit
									/*if($unit_dist == 1){
										$row['m'] = round($row['m'] * 0.6213712,0);
										$row['spd'] = round($row['spd'] * 0.6213712,0);
									}else if($unit_dist == 2){
										$row['m'] = round($row['m'] * 0.5399568,0);
										$row['spd'] = round($row['spd'] * 0.5399568,0);
									}*/
									$row['m'] = round(mileageUnitConversion($row['m']),0);
									$row['spd'] = round(mileageUnitConversion($row['spd']),0);
									
									//fuel unit
									/*if($unit_fuel == 1){
										$row['sfc'] = round($row['sfc'] * 0.2199692,2);
										$row['efc'] = round($row['efc'] * 0.2199692,2);
										$row['cfc'] = round($row['cfc'] * 0.2199692,2);
									}else{
										$row['sfc'] = round($row['sfc'],2);
										$row['efc'] = round($row['efc'],2);
										$row['cfc'] = round($row['cfc'],2);
									}*/
									$row['sfc'] = round(fuelUnitConversion($row['sfc']),2);
									$row['efc'] = round(fuelUnitConversion($row['efc']),2);
									$row['cfc'] = round(fuelUnitConversion($row['cfc']),2);
									
									$output[] = $row;
								}
							}
							$json = array2json($output);
							echo $json;
						}
					}catch(Exception $e){
						return $e->getMessage();
					}
				}
				break;
				
			case 41:
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$datetime_fmt = $_SESSION['datetime_fmt'];				
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				
				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
									
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							exec dbo.p_collect_place_event_detail $objid, '$time1', '$time2'
						end";					
				
				try{
					$data = $db->query($sql);					
					if (!empty($data)) {
							$datetime_fmt = $_SESSION['datetime_fmt'];
							
							foreach ($data as $row) {
								if ($row != null) {
									$row['IN_TIME'] = toCustomTime($row['IN_TIME'], $time_zone, $datetime_fmt);
									$row['OUT_TIME'] = toCustomTime($row['OUT_TIME'], $time_zone, $datetime_fmt);
									
									//speed unit
									//if($unit_speed == 1 && $row['AVG_SPEED'] >= 0){
										//mph(英里/小时)
										$row['AVG_SPEED'] = round(speedUnitConversion($row['AVG_SPEED']),0);
									//}
									//if($unit_speed == 1 && $row['MAX_SPEED'] >= 0){
										//mph(英里/小时)
										$row['MAX_SPEED'] = round(speedUnitConversion($row['MAX_SPEED']),0);
									//}
									
									//distance unit
									/*if($unit_dist == 1){
										$row['MILEAGE'] = round($row['MILEAGE'] * 0.6213712,0);
										$row['OVER_SPEED_DIST'] = round($row['OVER_SPEED_DIST'] * 0.6213712,0);
									}else if($unit_dist == 2){
										$row['MILEAGE'] = round($row['MILEAGE'] * 0.5399568,0);
										$row['OVER_SPEED_DIST'] = round($row['OVER_SPEED_DIST'] * 0.5399568,0);
									}*/
									$row['MILEAGE'] = round(mileageUnitConversion($row['MILEAGE']),0);
									$row['OVER_SPEED_DIST'] = round(mileageUnitConversion($row['OVER_SPEED_DIST']),0);
									
									//fuel unit
									/*if($unit_fuel == 1){
										$row['SENSOR_FUEL'] = round($row['SENSOR_FUEL'] * 0.2199692,0);
										$row['ESTIMATE_FUEL'] = round($row['ESTIMATE_FUEL'] * 0.2199692,0);
										$row['CAN_FUEL'] = round($row['ESTIMATE_FUEL'] * 0.2199692,0);
									}*/
									$row['SENSOR_FUEL'] = round(fuelUnitConversion($row['SENSOR_FUEL']),0);
									$row['ESTIMATE_FUEL'] = round(fuelUnitConversion($row['ESTIMATE_FUEL']),0);
									$row['CAN_FUEL'] = round(fuelUnitConversion($row['CAN_FUEL']),0);
									
									$output[] = $row;
								}
							}
							$json = array2json($output);
							echo $json;
						}	
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
				
			case 42://User Login Record
				$uname = trim($_GET['uname']);				
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				
				if(empty($uname) or mb_strlen($uname) == 0){
					$sql = "select user_id uid, session_id sid, user_name un, login_name ln, login_time lt, leave_time vt, login_ip ip, time_zone zo from dbo.web_login_log where user_id in (select user_id from dbo.fn_user_tree($user_id)) and login_time between '$time1' and '$time2' order by login_time";
					$params = null;	
				}else{
					$sql = "select user_id uid, session_id sid, user_name un, login_name ln, login_time lt, leave_time vt, login_ip ip, time_zone zo from dbo.web_login_log where user_name = ? and login_time between '$time1' and '$time2' order by login_time";
					$params = array($uname);	
				}
				

				try{						
					$data = $db->query($sql, $params);
					if (!empty($data)) {
						$datetime_fmt = $_SESSION['datetime_fmt'];
						foreach ($data as $row) {
							if ($row != null) {
								$row['lt'] = toCustomTime($row['lt'], $time_zone, $datetime_fmt);
								$row['vt'] = toCustomTime($row['vt'], $time_zone, $datetime_fmt);
								$output[] = $row;
							}
						}
						$json = array2json($output);
						echo $json;
					}
				}catch(Exception $e){
					return $e->getMessage();
				}
												
				break;	
				
			case 43://Voice Record Report
				$objid = (int)$_GET['objid'];				
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);

				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
								
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							declare @total int
							select @total = count(*) from dat_voice_record 
							where device_no = @device_no 					
							and rcv_time >= convert(datetime, '$time1', 20) and rcv_time < convert(datetime, '$time2', 20)	
							and voice is not null

							if @total <= 20
							begin
								select device_no n, convert(varchar(20), dbo.fn_to_client_time(rcv_time, $time_zone*60), 120) t, voice v 
								from dat_voice_record
								where device_no = @device_no 
								and rcv_time >= convert(datetime, '$time1', 20) and rcv_time < convert(datetime, '$time2', 20)
								and voice is not null
							end
						end";
				try{
					$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
					$data = $db->query($sql);
					if (!empty($data)) {
						$datetime_fmt = $_SESSION['datetime_fmt'];
						
						foreach ($data as $row) {
							//$row['t'] = $row['t'] == null ? "" : toCustomTime(new DateTime($row['t']), $time_zone, $datetime_fmt);
							$row['v'] = $row['v'] == null ? "" : '<audio controls="controls" preload="metadata">
																	<source src="data:audio/mpeg;base64,'.base64_encode( $row['v'] ).'"/>;
																  </audio>';
							$output[] = $row;
						}
						$json = array2json($output);
						echo $json;
					}
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
				
			case 47:
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$datetime_fmt = $_SESSION['datetime_fmt'];				
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				
				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
									
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							exec dbo.p_collect_task_detail $objid, '$time1', '$time2'
						end";					
				
				try{
					$data = $db->query($sql);					
					if (!empty($data)) {
							$datetime_fmt = $_SESSION['datetime_fmt'];
							
							foreach ($data as $row) {
								if ($row != null) {
									$row['START_TIME'] = toCustomTime($row['START_TIME'], $time_zone, $datetime_fmt);
									$row['END_TIME'] = toCustomTime($row['END_TIME'], $time_zone, $datetime_fmt);
									
									//speed unit
									//if($unit_speed == 1 && $row['AVG_SPEED'] >= 0){
										//mph(英里/小时)
										$row['AVG_SPEED'] = round(speedUnitConversion($row['AVG_SPEED']),0);
									//}
									//if($unit_speed == 1 && $row['MAX_SPEED'] >= 0){
										//mph(英里/小时)
										$row['MAX_SPEED'] = round(speedUnitConversion($row['MAX_SPEED']),0);
									//}
									
									//distance unit
									/*if($unit_dist == 1){
										$row['MILEAGE'] = round($row['MILEAGE'] * 0.6213712,0);
										$row['OVER_SPEED_DIST'] = round($row['OVER_SPEED_DIST'] * 0.6213712,0);
									}else if($unit_dist == 2){
										$row['MILEAGE'] = round($row['MILEAGE'] * 0.5399568,0);
										$row['OVER_SPEED_DIST'] = round($row['OVER_SPEED_DIST'] * 0.5399568,0);
									}*/
									$row['MILEAGE'] = round(mileageUnitConversion($row['MILEAGE']),0);
									$row['OVER_SPEED_DIST'] = round(mileageUnitConversion($row['OVER_SPEED_DIST']),0);
									
									//fuel unit
									/*if($unit_fuel == 1){
										$row['SENSOR_FUEL'] = round($row['SENSOR_FUEL'] * 0.2199692,0);
										$row['ESTIMATE_FUEL'] = round($row['ESTIMATE_FUEL'] * 0.2199692,0);
										$row['CAN_FUEL'] = round($row['ESTIMATE_FUEL'] * 0.2199692,0);
									}*/
									$row['SENSOR_FUEL'] = round(fuelUnitConversion($row['SENSOR_FUEL']),0);
									$row['ESTIMATE_FUEL'] = round(fuelUnitConversion($row['ESTIMATE_FUEL']),0);
									$row['CAN_FUEL'] = round(fuelUnitConversion($row['CAN_FUEL']),0);
									
									$output[] = $row;
								}
							}
							$json = array2json($output);
							echo $json;
						}	
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;				
				
			case 51:
				$objid = (int)$_GET['objid'];
				$time2 = $_GET['etime'];//toServerTime(strtotime($_GET['etime']), $time_zone);
				$time1 = date("Y-m-d H:i:s",strtotime("$time2 -4 day"));
				$time_zone_mins = $time_zone*60;
				
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				
				$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
								@last_stamp datetime
									
						select @last_stamp = last_stamp from cfg_device where device_no = @device_no							  
						if datediff(ss, @last_stamp, getdate()) <= 0
						begin
							exec dbo.p_collect_last5days_mil_eng @device_no, '$time1', '$time2', $time_zone_mins
						end";					
						
				try{
					$data = $db->query($sql);					
					if (!empty($data)) {						
						foreach ($data as $row) {
							if ($row != null) {															
								//distance unit
								/*if($unit_dist == 1){
									$row['MILEAGE'] = round($row['MILEAGE'] * 0.6213712,0);
								}else if($unit_dist == 2){
									$row['MILEAGE'] = round($row['MILEAGE'] * 0.5399568,0);
								}*/
								$row['MILEAGE'] = round(mileageUnitConversion($row['MILEAGE']),0);								
								
								$output[] = $row;
							}
						}
						$json = array2json($output);
						echo $json;
					}	
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
				
			case 52:
				$objids = implode (',', $_POST['objids']);
				$time1 = toServerTime(strtotime($_POST['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_POST['etime']), $time_zone);
				$datetime_fmt = $_SESSION['datetime_fmt'];				
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
				$sql = "exec dbo.p_collect_temp_fuel_mil_hour '$time1', '$time2', '$objids'";					
				
				try{
					$data = $db->query($sql);	
					if (!empty($data)) {
							$datetime_fmt = $_SESSION['datetime_fmt'];
							
							foreach ($data as $row) {
								if ($row != null) {
									$row['GPS_TIME'] = toCustomTime($row['GPS_TIME'], $time_zone, $datetime_fmt);
									$row['RCV_TIME'] = toCustomTime($row['RCV_TIME'], $time_zone, $datetime_fmt);									
									
									//distance unit
									/*if($unit_dist == 1){
										$row['MIL'] = round($row['MIL'] * 0.6213712,0);
									}else if($unit_dist == 2){
										$row['MIL'] = round($row['MIL'] * 0.5399568,0);
									}*/
									$row['MIL'] = round(mileageUnitConversion($row['MIL']),0);
									
									//fuel unit
									/*if($unit_fuel == 1){
										$row['F1'] = round($row['F1'] * 0.2199692,0);
										$row['F2'] = round($row['F2'] * 0.2199692,0);
									}*/
									$row['F1'] = round(fuelUnitConversion($row['F1']),0);
									$row['F2'] = round(fuelUnitConversion($row['F2']),0);
									
									//temp unit
									/*if($unit_temp == 1){
										//Fahrenheit
										$row['T1'] = round(($row['T1']/10.0) * 1.8 + 32,1);
										$row['T2'] = round(($row['T2']/10.0) * 1.8 + 32,1);
									}else{
										//Celsius
										if(!empty($row['T1'])){
											$row['T1'] = round($row['T1']/10.0,1);
										}
										
										if(!empty($row['T2'])){
											$row['T2'] = round($row['T2']/10.0,1);
										}									
									}*/
									$row['T1'] = round(tempUnitConversion($row['T1']/10.0));
									$row['T2'] = round(tempUnitConversion($row['T2']/10.0));
									
									$output[] = $row;
								}
							}
							$json = array2json($output);
							echo $json;
						}	
				}catch(Exception $e){
					return $e->getMessage();
				}
				break;
				
				
			case 55://Expense Report				
				$objid = (int)$_GET['objid'];
				$time1 = toServerTime(strtotime($_GET['stime']), $time_zone);
				$time2 = toServerTime(strtotime($_GET['etime']), $time_zone);
				$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);				
				$sql = "select expense_name en, convert(varchar(20), dbo.fn_to_client_time(expense_date, $time_zone*60), 120) d, quantity q, cost c, supplier s, buyer b, odometer o, engine_hour g, description r from dat_expense 
				        where object_id = $objid and (expense_date between '$time1' and '$time2')";
						
				try{
					$data = $db->query($sql);
					if (!empty($data)) {
						foreach ($data as $row) {								
							$output[] = $row;
						}
						$json = array2json($output);
						echo $json;
					}
				}catch(Exception $e){
					return $e->getMessage();
				}			
				break;
		}
	}else{
		$time1 = toDate(strtotime($_GET['time1']));
		$time2 = toDate(strtotime($_GET['time2']));
		$type = (int)$_GET['type'];
		$collect = (int)$_GET['collect'];    
		
		if ($collect == 0) {
			$objid = (int)$_GET['objid'];
			$andwhere = "and collect_id = (select object_id from cfg_object where object_id = $objid)";
		}else{        
			$andwhere = " and collect_id = $user_id";
		}
		$sql = "select dbo.fn_trans_entry('$lang', rk.rpt_name) rpt_name, d.start_time, d.end_time, d.file_path from (
					select distinct rpt_kind, convert(varchar(20), start_time, 20) start_time, 
					convert(varchar(20), end_time, 20) end_time, file_path from dat_report
					where collect_type = $type and collect_by = $collect
						--and lang_code = '$lang'
					$andwhere
					and start_time >= convert(datetime, '$time1', 20)
					and start_time < convert(datetime, '$time2', 20)
				) d
				left join sys_report_kind rk on d.rpt_kind = rk.rpt_kind
				order by start_time, end_time, d.rpt_kind, file_path";

		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		$data = $db->query($sql);
		if (!empty($data)) {                
			$last_file = "";
			foreach($data as &$row){
				if($row != null){
					$next_file = $row['file_path'];
					if($next_file != $last_file){                    
						$row['file_path'] = base64_encode($next_file);
						$last_file = $next_file;
						
						$time = strtotime($row['start_time']);
						$save = '_'.get_basename($next_file);
						switch ($type){
							case 0: $save = 'D_' . date('Y-m-d', $time) . $save;
							break;
							case 1: $save = 'W_' . date('Y-W', $time) . $save;
							break;
							case 2: $save = 'M_' . date('Y-m', $time) . $save;
							break;
						}
						$row['save_name'] = $save;  
						$row['save_name'] = $save;                    
					}else{
						$row['file_path'] = "";
					}
				}
			}
			$json = array2json($data);
			echo $json;
		}
	}  
}
else{
    echo '';
}

function get_basename($filename){  
    return preg_replace('/^.+[\\\\\\/]/', '', $filename);  
}

?>

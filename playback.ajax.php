<?php
session_start();
include_once('common.inc.php');
require_once 'svc.class.php';
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined']
        and isset($_GET['objid']) and ($_GET['objid'] != '')
        and isset($_GET['day']) and ($_GET['day'] != '')) {
			
    $s_id = session_id();
	$user_id = (int) $_SESSION['uid'];    
    $lang = $_SESSION['lang'];
    $objid = (int)$_GET['objid'];
    $day = (float) $_GET['day'];
	
    $memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
    $online = memcache_get($memcache, $GLOBAL_USER);
    //memcache_set($memcache, $GLOBAL_UNIT, $s_id, 0, 0);
    $deviceinfo = memcache_get($memcache, $GLOBAL_UNIT);
    $ioparams = memcache_get($memcache, $GLOBAL_IOSP);
	$sensorParams = memcache_get($memcache, $GLOBAL_SENP);
    memcache_close($memcache);
	
    if($online['list'][$user_id] && $_SESSION['endpoint'][$objid]){
        $ico = $deviceinfo[$objid]['i'];
        $pid = $deviceinfo[$objid]['pid'];
		$stop = isset($_GET['stop']) ? $_GET['stop'] : 0;
		$event = isset($_GET['event']) ? $_GET['event'] : 0;
		$ptype = isset($_GET['ptype']) ? $_GET['ptype'] : 1;
		$btype = isset($_GET['btype']) ? $_GET['btype'] : 3;
		
        if($ico && $pid){
            $timezone = isset($_SESSION['timezone']) ? (float) $_SESSION['timezone'] : 0;
            if ($day < 0) {
                $time1 = toServerTime(strtotime($_GET['time1']), $timezone);
                $time2 = toServerTime(strtotime($_GET['time2']), $timezone);
            } else {				
				if($day == 0.1){
					//today
					$current_time = time();
					$time1 = date('Y-m-d',$current_time) . ' 00:00:00';
					$time2 = date('Y-m-d H:i:s',$current_time);
			    }else if($day == 0.2){
					//yesterday
					$time1 = date("Y-m-d",strtotime("-1 day")) . ' 00:00:00';
					$time2 = date("Y-m-d") . ' 00:00:00';
				}else{
					$current_time = time();
					$time1 = date('Y-m-d H:i:s',$current_time - $day * 86400);
					$time2 = date('Y-m-d H:i:s',$current_time);
				}              
            }
            $svcCheck = new StateCheck();
			$svcCheck->setMaxEndtime($objid, $time1, $time2);
			
			$data = $svcCheck->queryHistory($objid, $time1, $time2);						
			$datetime_fmt = $_SESSION['datetime_fmt'];
			$unit_speed = $_SESSION['unit_speed'];
			$unit_dist = $_SESSION['unit_distance'];
			$unit_fuel = $_SESSION['unit_fuel'];
			$unit_temp = $_SESSION['unit_temperature'];
			$unit_altitude = $_SESSION['unit_altitude'];
			
            if (!empty($data)) {
                if(!is_array($data)){
                    $ret = "{\"ico\":$ico,\"t1\":\"$time1\",\"t2\":\"$time2\",\"error\":$data}";
                }else{	
					foreach ($data as $row) {
						$pt = getIoValue('62',$row['q']);
						if($ptype == 1 && $row['q'] != '' && $pt != '' && ($pt == '1' || $pt == '2' ||  $pt == '3' ||  $pt == '4')){
							continue;
						}
						
						$row['tg'] = toCustomTime($row['tg'], $timezone, $datetime_fmt);
						$row['ts'] = toCustomTime($row['ts'], $timezone, $datetime_fmt);
						$row['st'] = $row['e'];;
						//speed unit
						if(/*$unit_speed == 1 && */$row['s'] >= 0){
							//mph(英里/小时)
							$row['s'] = round(speedUnitConversion($row['s']),0);
						}					
						
						//altitude unit
						/*if($unit_altitude == 1){
							//feet(英尺)
							$row['h'] = round($row['h'] * 3.28083989501,0);
						}*/
						$row['h'] = round(altitudeUnitConversion($row['h'] ),0);
									
						if($row['e'] != ''){
							$row['ad'] = '';//考虑到iPhone的app，此项保留
							$row['e'] = getDeviceStatus($row['e']);	
						}							
						if($row['q'] != '')
							$row['e'] = strlen($row['e']) > 0 ? $row['e'] . ',<br>'. getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$objid], $row['q'], 1, $ioparams[$lang]['command']) : getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$objid], $row['q'], 1, $ioparams[$lang]['command']);						
						
						if($btype == 1){
							unset($row['h']);
							unset($row['v']);
							unset($row['ts']);
							unset($row['e']);
							unset($row['q']);
							//unset($row['st']);
							unset($row['ad']);
							
						}else if($btype == 2){
							unset($row['h']);
							unset($row['v']);
							unset($row['ts']);
							unset($row['e']);
							//unset($row['st']);
							unset($row['ad']);
						}
						
						$output[] = $row;
					}
					$json = array2json($output);
					$t1 = new DateTime($time1);
					$t2 = new DateTime($time2);
					$time1_1 = toCustomTime($t1, $timezone, $datetime_fmt);
					$time2_2 = toCustomTime($t2, $timezone, $datetime_fmt);
                }
            }
			
			if($event > 0 and ($btype == 2 || $btype == 3)){
				$events = $svcCheck->queryEvent($objid, $time1, $time2);
				if(!empty($events) && is_array($events)){
					$ios = $ioparams[$lang];
					foreach ($events as $row_n) {
						$row_n['t'] = toCustomTime($row_n['t'], $timezone, $datetime_fmt);
						// Out GEO
						if($row_n['a'] == 4110 && $row_n['q'] != ''){
							$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$objid], getIonValue('C',$row_n['q']), 1, $ios['command']);
						}
						// In GEO
						else if($row_n['a'] == 4111 && $row_n['q'] != ''){
							$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$objid], getIonValue('B',$row_n['q']), 1,$ios['command']);
						}
						//区域内超速报警
						else if($row_n['a'] == 4172 && $row_n['q'] != ''){
							$TEXT = $GLOBALS['TEXT'];
							$row_n['e'] = $TEXT['104C'] .": ". getIoValue('10',$row_n['q']);
						}
						// MainTenance
						else if(($row_n['a'] == 16407 || $row_n['a'] == 16408 || $row_n['a'] == 16409) && $row_n['q'] != ''){
							$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$objid], getIonValue('D',$row_n['q']), 1, $ios['command']);
						}
						//Command reply
						else if($row_n['a'] == 20482){
							$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$objid], getIonValue('19',$row_n['q']), 1, $ios['command']);
						}
						//New Task
						else if($row_n['a'] == 16422 && $row_n['q'] != ''){
							$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$objid], getIonValue('5A',$row_n['q']), 1, $ios['command']);
						}
						//Task processing
						else if($row_n['a'] == 16423 && $row_n['q'] != ''){
							$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$objid], getIonValue('5B',$row_n['q']), 1, $ios['command']);
						}
						//Task completed
						else if($row_n['a'] == 16424 && $row_n['q'] != ''){
							$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$objid], getIonValue('5C',$row_n['q']), 1, $ios['command']);
						}
						//Task fail
						else if($row_n['a'] == 16425 && $row_n['q'] != ''){
							$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$objid], getIonValue('5D',$row_n['q']), 1, $ios['command']);
						}
						// State Table Event
						else if($row_n['e'] != '' && $row_n['a'] != 20481){
							$row_n['e'] = getDeviceStatus(dechex($row_n['a']));							
						} 
						// Customize Io event
						else if($row_n['q'] != ''){
							// Out GEO
							if(strpos($row_n['e'],'100E') !== false){ 						   
								$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$row_n['oid']], getIonValue('64',$row_n['q']), 1, $ios['command']) .' ('. getIoValue('C',$row_n['q']) .')';
							}
							// In GEO
							else if(strpos($row_n['e'],'100F') !== false){ 					    
								$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$row_n['oid']], getIonValue('64',$row_n['q']), 1, $ios['command']) .' ('. getIoValue('B',$row_n['q']) .')';
							}
							// MainTenance
							else if(strpos($row_n['e'],'4017') !== false || strpos($row_n['e'],'4018') !== false || strpos($row_n['e'],'4019') !== false){ 					    
								$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$row_n['oid']], getIonValue('64',$row_n['q']), 1, $ios['command']) .' ('. getIoValue('D',$row_n['q']) .')';
							}
							// Command reply 
							else if(strpos($row_n['e'],'5002') !== false){
								$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$row_n['oid']], getIonValue('19',$row_n['q']), 1, $ios['command']);
							}
							// New Task
							else if(strpos($row_n['e'],'4026') !== false){ 						    
								$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$row_n['oid']], getIonValue('64',$row_n['q']), 1, $ios['command']) .' ('. getIoValue('5A',$row_n['q']) .')';
							}
							// Task processing
							else if(strpos($row_n['e'],'4027') !== false){ 						    
								$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$row_n['oid']], getIonValue('64',$row_n['q']), 1, $ios['command']) .' ('. getIoValue('5B',$row_n['q']) .')';
							}
							// Task completed
							else if(strpos($row_n['e'],'4028') !== false){ 						   
								$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$row_n['oid']], getIonValue('64',$row_n['q']), 1, $ios['command']) .' ('. getIoValue('5C',$row_n['q']) .')';
							}
							// Task fail
							else if(strpos($row_n['e'],'4029') !== false){ 						    
								$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$row_n['oid']], getIonValue('64',$row_n['q']), 1, $ios['command']) .' ('. getIoValue('5D',$row_n['q']) .')';
							}						
							else{
								$row_n['e'] = getDeviceIoParam($ios[$pid], $sensorParams[$row_n['oid']], getIonValue('64',$row_n['q']), 1, $ios['command']);
							}
							
							//$row_n['e'] = getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$objid], getIonValue('64',$row_n['q']), 1, $ioparams[$lang]['command']);
							//$row_n['e'] = getDeviceIoParam($ioparams[$lang][$pid], $sensorParams[$objid], $row_n['q'], 1, $ioparams[$lang]['command']);
						}
						unset($row_n['q']);
						
						$output_n[] = $row_n;
					}
					$events_json = array2json($output_n);
				}
			}
			
			$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);	
			//stop details
			if($stop > 0 and ($btype == 2 || $btype == 3)){
				$itime_zone = $timezone*60;
				$sql_stops = "exec dbo.p_collect_stops_detail $objid, '$time1', '$time2', $stop, 0, $itime_zone";	
				try{
					$stops_data = $db->query($sql_stops);					
					if (!empty($stops_data)) {
						foreach ($stops_data as $row_stop) {
							$output_stop[] = $row_stop;
						}
						$stops_json = array2json($output_stop);
					}	
				}catch(Exception $e){
					return $e->getMessage();
				}
			}
			
			//moves detail
			if($btype == 2 || $btype == 3){
				$mtime_zone = $timezone * 60;			
				$sql_moves = "exec dbo.p_collect_moves_detail $objid, '$time1', '$time2', 100, $mtime_zone, 1";	
				try{
					$moves_data = $db->query($sql_moves);					
					if (!empty($moves_data)) {					
						foreach ($moves_data as $row_move) {
							//distance unit
							/*if($unit_dist == 1){
								//Mile(英里)
								$row_move['DISTANCE'] = round($row_move['DISTANCE'] * 0.6213712,2);
								
							}else if($unit_dist == 2){
								//Nautical mile(海里)
								$row_move['DISTANCE'] = round($row_move['DISTANCE'] * 0.5399568,2);
							}*/
							$row_move['DISTANCE'] = round(mileageUnitConversion($row_move['DISTANCE']),2);
							
							//speed unit
							/*if($unit_speed == 1){
								//mph(英里/小时)
								$row_move['MAX_SPEED'] = round($row_move['MAX_SPEED'] * 0.6213712,0);
							}*/
							$row_move['MAX_SPEED'] = round(speedUnitConversion($row_move['MAX_SPEED']),0);
							
							//fuel unit
							/*if($unit_fuel == 1){
								//Gallon(加仑)
								$row_move['SENSOR_FUEL'] = round($row_move['SENSOR_FUEL'] * 0.2199692,2);
								$row_move['ESTIMATE_FUEL'] = round($row_move['ESTIMATE_FUEL'] * 0.2199692,2);
							}*/
							$row_move['SENSOR_FUEL'] = round(fuelUnitConversion($row_move['SENSOR_FUEL']),2);
							$row_move['ESTIMATE_FUEL'] = round(fuelUnitConversion($row_move['ESTIMATE_FUEL']),2);
							
							$output_move[] = $row_move;
						}
						$moves_json = array2json($output_move);
					}	
				}catch(Exception $e){
					return $e->getMessage();
				}
			}
			
			//fuel event
			if(/*$btype == 2 || */$btype == 3){
				$sql_fuel_event = "exec dbo.p_collect_fuel_event $objid, '$time1', '$time2', $GLOBAL_REFUEL_RATE, $GLOBAL_STEALFUEL_RATE, $GLOBAL_FUEL_EVENT_TIME_DIFFERENCE, 0, 0";	
				$fuel_event = $db->query($sql_fuel_event);
				if(!empty($fuel_event)){
					foreach ($fuel_event as $fuel_event_row) {
						if ($fuel_event_row != null) {
							$fuel_event_row['GPS_TIME'] = toCustomTime($fuel_event_row['GPS_TIME'], $timezone, $datetime_fmt);
							$fuel_event_row['RCV_TIME'] = toCustomTime($fuel_event_row['RCV_TIME'], $timezone, $datetime_fmt);
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
			}
			
			// if need statistics and have history
			if(count($data) > 0){
				if($btype == 2 || $btype == 3){
					$sql_chart_sensor = "select element_id eid, sensor_name sn, sensor_type st, sensor_target tg from cfg_sensor where valid = 1 and object_id = $objid and (sensor_type = 1 or sensor_type = 2 or sensor_type = 4 or sensor_type = 5)";
					$chart_sensor_data = $db->query($sql_chart_sensor);					
					if (!empty($chart_sensor_data)) {					
						foreach ($chart_sensor_data as $row_chart_sensor) {
							$row_chart_sensor['eid'] = $row_chart_sensor['tg'] == -1 ? $row_chart_sensor['eid'] : $row_chart_sensor['tg'];
							$chart_sensor_output[] = $row_chart_sensor;
						}
					}
					$ctsensor = array2json($chart_sensor_output);
				}
				
				if($btype == 3){									
					$sql_st = "declare @device_no nvarchar(20) = dbo.fn_device4oid($objid),
									   @track_name nvarchar(200)

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
							   exec @duty_time = dbo.p_collect_dutytime '$time1', '$time2', @track_name
							   exec @sensor_fuel_consumption = dbo.p_collect_sensor_fuel '$time1', '$time2', @track_name
							   exec @estimate_fuel_consumption = dbo.p_collect_estimate_fuel '$time1', '$time2', @track_name
							   exec @can_fuel_consumption = dbo.p_collect_can_fuel '$time1', '$time2', @track_name
							   select @speeding_dist = isnull(sum(distance),0) from #temp_over_speed
							   select @speeding_time = isnull(sum(last_time_second),0) from #temp_over_speed
							   select @speeding_count = count(*) from #temp_over_speed
							   exec @engine_count = dbo.p_collect_engine_count '$time1','$time2',@track_name 
							   
							   --if @mileage >0 and @driv_time > 0 and (@driv_time - @idle_time) > 0
							   --begin
								  exec @avg_speed = dbo.p_collect_avg_speed '$time1', '$time2', @track_name
								  exec @max_speed = dbo.p_collect_max_speed '$time1', '$time2', @track_name
								  --if @max_speed = 0 set @avg_speed = 0
							   --end
							   --else
							   --begin
								  --set @avg_speed = 0
								  --set @max_speed = 0
							   --end					   
							   ";
							   
					$sql = "declare @code int, 
									@driv_time int,
									@mileage int,
									@stop_time int,
									@idle_time int,
									@duty_time int,
									@avg_speed int,
									@max_speed int,
									@sensor_fuel_consumption int,
									@estimate_fuel_consumption int,
									@can_fuel_consumption int,
									@speeding_dist int,
									@speeding_time int,
									@speeding_count int,
									@engine_count int,
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
		
							begin try
								begin tran
									$sql_st
								commit tran   
							end try
							begin catch
								rollback tran
							end catch

							select @code as errcode, convert(decimal(18,0), @mileage / 1000.0) m, dbo.fn_sec2time(@driv_time, null) as dt, 
							dbo.fn_sec2time(@stop_time, null) as st, @avg_speed as s, @max_speed ms, 
							dbo.fn_sec2time(@idle_time, null) as it, dbo.fn_sec2time(@duty_time, null) as dut, round(isnull(@sensor_fuel_consumption,0)/100.0,2) sfc, round(isnull(@estimate_fuel_consumption,0)/100.0,2) efc, round(isnull(@can_fuel_consumption,0),2) cfc, @speeding_dist spd, dbo.fn_sec2time(@speeding_time, null) spt, @speeding_count spc, @engine_count engc";
					
					$data_2 = $db->queryLastDS($sql);
					
					if(!is_null($data_2)){					
						$mileage = $data_2[0]['m'];
						$driv_time = $data_2[0]['dt'];
						$stop_time = $data_2[0]['st'];
						$avg_speed = $data_2[0]['s'];					
						$max_speed = $data_2[0]['ms'];
						$idle_time = $data_2[0]['it'];
						$duty_time = $data_2[0]['dut'];
						$sensor_fuel_consumption = round($data_2[0]['sfc'],2);
						$estimate_fuel_consumption = round($data_2[0]['efc'],2);
						$can_fuel_consumption = round($data_2[0]['cfc'],2);
						$speeding_dist = $data_2[0]['spd'];
						$speeding_time = $data_2[0]['spt'];
						$speeding_count = $data_2[0]['spc'];
						$engine_count = $data_2[0]['engc'];
						
						//speed unit
						/*if($unit_speed == 1){
							//mph(英里/小时)
							$avg_speed = round($avg_speed * 0.6213712,0);
							$max_speed = round($max_speed * 0.6213712,0);
						}*/
						$avg_speed = round(speedUnitConversion($avg_speed),0);
						$max_speed = round(speedUnitConversion($max_speed),0);
						
						//distance unit
						/*if($unit_dist == 1){
							//Mile(英里)
							$mileage = round($mileage * 0.6213712,2);
							$speeding_dist = round($speeding_dist * 0.6213712,2);
						}else if($unit_dist == 2){
							//Nautical mile(海里)
							$mileage = round($mileage * 0.5399568,2);
							$speeding_dist = round($speeding_dist * 0.5399568,2);
						}*/
						$mileage = round(mileageUnitConversion($mileage),2);
						$speeding_dist = round(mileageUnitConversion($speeding_dist),2);
						
						if(empty($mileage)){
							$mileage = 0;
						}
						if(empty($driv_time)){
							$driv_time = 0;
						}
						if(empty($stop_time)){
							$stop_time = 0;
						}
						if(empty($avg_speed)){
							$avg_speed = 0;
						}
						if(empty($max_speed)){
							$max_speed = 0;
						}
						
						//fuel unit
						/*if($unit_fuel == 1){
							//Gallon(加仑)
							$sensor_fuel_consumption = round($sensor_fuel_consumption * 0.2199692,2);
							$estimate_fuel_consumption = round($estimate_fuel_consumption * 0.2199692,2);
							$can_fuel_consumption = round($can_fuel_consumption * 0.2199692,2);
						}*/
						$sensor_fuel_consumption = round(fuelUnitConversion($sensor_fuel_consumption),2);
						$estimate_fuel_consumption = round(fuelUnitConversion($estimate_fuel_consumption),2);
						$can_fuel_consumption = round(fuelUnitConversion($can_fuel_consumption),2);
						
						$ret = "{\"ico\":$ico,\"t1\":\"$time1_1\",\"t2\":\"$time2_2\",\"m\":$mileage,\"dt\":\"$driv_time\",\"st\":\"$stop_time\",\"s\":$avg_speed,\"ms\":$max_speed,\"it\":\"$idle_time\",\"dut\":\"$duty_time\",\"sfc\":\"$sensor_fuel_consumption\",\"efc\":\"$estimate_fuel_consumption\",\"cfc\":\"$can_fuel_consumption\",\"spd\":\"$speeding_dist\",\"spt\":\"$speeding_time\",\"spc\":\"$speeding_count\",\"engc\":\"$engine_count\",\"rfuel\":$rfuel,\"sfuel\":$sfuel,\"item\":$json";
						if(!empty($events_json)){
							$ret = $ret . ",\"events\":$events_json";
						}
						if(!empty($stops_json)){
							$ret = $ret . ",\"stops\":$stops_json";
						}
						if(!empty($moves_json)){
							$ret = $ret . ",\"moves\":$moves_json";
						}
						if(!empty($ctsensor)){
							$ret = $ret . ",\"ctsensor\":$ctsensor";
						}
						
						$ret = $ret . "}";
											
						echo $ret;
						return;
					}
				}else if($btype == 2){
					//btype = 2
					$ret = "{\"ico\":$ico, \"item\":$json";
					
					if(!empty($events_json)){
						$ret = $ret . ",\"events\":$events_json";
					}
					if(!empty($stops_json)){
						$ret = $ret . ",\"stops\":$stops_json";
					}
					if(!empty($moves_json)){
						$ret = $ret . ",\"moves\":$moves_json";
					}
					/*if(!empty($ctsensor)){
						$ret = $ret . ",\"ctsensor\":$ctsensor";
					}
					*/
					$ret = $ret . "}";
										
					echo $ret;
					return;
				}
				else{
					//btype = 1
					$ret = "{\"ico\":$ico, \"item\":$json}";																
					echo $ret;				
					return;	
				}
			}
			echo $ret;
        }
    }else{
        echo 'error';
    }
}
?>
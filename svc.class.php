<?php
//session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

class StateCheck {

    public function createOnline() {
        $online = array('last_stamp_online' => time() - 6, 'list' => array());
        return $online;
    }
	
	public function createEvent() {
        $event = array('last_stamp_event' => time() - 6, 'list' => array());
        return $event;
    }
	
//dbo.fn_to_client_time(dateadd(day, -1, getdate()), z.time_zone) and dbo.fn_to_client_time(getdate(), z.time_zone)
    public function createEndPoint($user_id, $objid = "") {
		$objcon = "";
		
		if($objid != ""){
			foreach($objid as $o) {
				$objcon .= " ,".$o;
			}
			$objcon = " and o.object_id in (" . substr($objcon,2) . ")";	
		}
			
		$offline_timeout = $GLOBALS['GLOBAL_DEVICE_OFFLINE_TIMEOUT'];
        $db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
        $sql = "select z.object_id n, z.object_flag c, ds.gps_time t, ds.rcv_time ts,
					case when datediff(ss,ds.rcv_time,getdate()) < $offline_timeout then 1
					when z.online = 1 then 1
					else 0 end [on], isnull(ds.valid,0) v, count(a.alarm_time) a,
					z.group_id gid, z.group_name gtxt, z.object_kind i
				from (
					select o.object_id, o.object_flag, o.group_id, g.group_name, o.object_kind, o.time_zone, d.online, d.device_no, t.can_alarm
					from cfg_device d, cfg_object o, cfg_group g, sys_device_type t
					where d.object_id = o.object_id and o.group_id = g.group_id and d.dtype_id = t.dtype_id ".$objcon."
					and o.group_id in
					(
						select group_id from dbo.fn_group4user($user_id)
					)
				) z 
				left join cfg_device_state ds on ds.device_no = z.device_no
				left join dat_alarm a on z.can_alarm = 1 and z.device_no = a.device_no 
					and a.alarm_time between dateadd(hour, -1, getdate()) and getdate()
					and a.finish_time is null
				group by z.object_id, z.object_flag, z.online, ds.gps_time, ds.rcv_time, ds.valid, z.group_id, z.group_name, z.object_kind
				order by gtxt, c";

        $data = $db->query($sql);

        if (!empty($data)) {
            foreach ($data as $row) {
                if ($row) {
                    $objid = trim($row['n']);
                    $endpoint[$objid] = array(
                        'c' => $row['c'],
                        't' => $row['t'],
						'ts' => $row['ts'],
                        'on' => $row['on'],                        
                        'v' => $row['v'],
                        'a' => $row['a'],
                        'gid' => $row['gid'],
                        'gtxt' => $row['gtxt'],
                        'i' => $row['i']
                        );
                }
            }
        }
        return $endpoint;
    }

    public function timeCheck(&$online, &$deviceinfo) {
		/*if user disable or password change*/
		$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
		$uid = $_SESSION['uid'];
		$pass = $_SESSION['pass'];
		$sql = "select user_id, (select count(*) from dbo.fn_invalid_user_tree_upper(sys_user.user_id)) pno from sys_user where user_id = $uid and login_pass = '$pass' and valid = 1";
		$user_data = $db->query($sql); 
		$row = $user_data[0];
		if ($row['pno'] > 0 or empty($user_data) ) {
		   //session_unset();
		   //return;
		   die();
		}
		
        $changed = false;
        if (($online['last_stamp_online'] + 5) <= time()) {          
            $online['last_stamp_online'] = time();
			$offline_timeout = $GLOBALS['GLOBAL_DEVICE_OFFLINE_TIMEOUT'];
            $sql = "select z.group_id gid, z.group_name gtxt, z.protocol_id pid, z.object_id n, z.device_no nc, z.device_sim si, ds.gps_time t, ds.rcv_time ts,
					case when datediff(ss,ds.rcv_time,getdate()) < $offline_timeout then 1
					when z.online = 1 then 1
					else 0 end [on], z.object_kind i, z.object_flag c, 
					isnull(ds.lng, 0) x, isnull(ds.lat, 0) y, isnull(ds.angle, 0) d, 
					case when datediff(ss, z.ex, (convert(varchar(11),getdate(),120)+'23:59:59')) > 0 then -1
					when ds.gps_time is null then 0
					when ds.rcv_time is null then 0
					else round(ds.speed/1,0)
					end s, isnull(ds.valid, 0) v,z.dtype_id dt, isnull(ds.sta_table,'') e, isnull(ds.sta_table,'') st, isnull(ds.ios_table, '') q,isnull(ds.ios_table, '') io,
					count(a.alarm_time) a, case when e.color_enable =1 then e.color else null end ic, case when e.arrow_enable = 1 then e.arrow else null end ar, isnull(dbo.fn_io4value('5f',isnull(ds.ios_table, '')),'') jb, isnull(dbo.fn_io4value('5e',isnull(ds.ios_table, '')),'') dn ,z.ex
					--s.mil_maintenance_enable mile,s.mil_maintenance_value milv,s.mil_maintenance_name miln,s.mil_maintenance_last mill,
					--s.eng_maintenance_enable enge,s.eng_maintenance_value engv,s.eng_maintenance_name engn,s.eng_maintenance_last engl,
					--s.day_maintenance_enable daye,s.day_maintenance_value dayv,s.day_maintenance_name dayn,s.day_maintenance_last dayl
				from (
					select o.object_id, d.dtype_id, d.device_no,d.device_sim, o.group_id, g.group_name, t.protocol_id,
					d.online, d.last_stamp ex, o.object_kind, o.object_flag, o.userdef_flag, o.time_zone, t.can_alarm
					from cfg_device d, cfg_object o, cfg_group g, sys_device_type t
					where d.object_id = o.object_id and o.group_id = g.group_id
						and d.dtype_id = t.dtype_id
				) z
				left join cfg_device_state ds on ds.device_no = z.device_no
				left join dat_alarm a on z.can_alarm = 1 and z.device_no = a.device_no 
					and a.alarm_time between dateadd(hour, -1, getdate()) and getdate()
					and a.finish_time is null
				left join cfg_services s on z.object_id = s.object_id
				left join cfg_event e on e.event_name = dbo.fn_io4value('64',isnull(a.ios_table, ''))  
				group by z.group_id, z.group_name, z.protocol_id, z.object_id, 
					z.online, z.object_kind, z.object_flag, z.device_no, z.device_sim, z.ex,z.dtype_id,
					ds.gps_time, ds.rcv_time, ds.lng, ds.lat, ds.angle, ds.speed, ds.valid, ds.sta_table, e.color_enable, e.color, e.arrow_enable, e.arrow, ds.ios_table
					--s.mil_maintenance_enable,s.mil_maintenance_value,s.mil_maintenance_name,s.mil_maintenance_last,
					--s.eng_maintenance_enable,s.eng_maintenance_value,s.eng_maintenance_name,s.eng_maintenance_last,
					--s.day_maintenance_enable,s.day_maintenance_value,s.day_maintenance_name,s.day_maintenance_last
				order by gtxt, c";
			
			//以下sql在沙特bus项目才会用到			
			/*$sql = "select z.group_id gid, z.group_name gtxt, z.protocol_id pid, z.object_id n, z.device_no nc, z.device_sim si, ds.gps_time t, ds.rcv_time ts,
				case when datediff(ss,ds.rcv_time,getdate()) <$offline_timeout then 1
				when z.online = 1 then 1
				else 0 end [on], z.object_kind i, z.object_flag c, 
				isnull(ds.lng, 0) x, isnull(ds.lat, 0) y, isnull(ds.angle, 0) d, 
				case when datediff(ss, z.ex, getdate()) > 0 then -1
				when ds.gps_time is null then 0
				when ds.rcv_time is null then 0
				else round(ds.speed/1,0)
				end s, isnull(ds.valid, 0) v,z.dtype_id dt, isnull(ds.sta_table,'') e, isnull(ds.sta_table,'') st, isnull(ds.ios_table, '') q,isnull(ds.ios_table, '') io,
				count(a.alarm_time) a, isnull(dbo.fn_io4value('5f',isnull(ds.ios_table, '')),'') jb, isnull(dbo.fn_io4value('5e',isnull(ds.ios_table, '')),'') dn, z.ex, bt.[job order] bjo, bp.[Current Passengers] cp
				--s.mil_maintenance_enable mile,s.mil_maintenance_value milv,s.mil_maintenance_name miln,s.mil_maintenance_last mill,
				--s.eng_maintenance_enable enge,s.eng_maintenance_value engv,s.eng_maintenance_name engn,s.eng_maintenance_last engl,
				--s.day_maintenance_enable daye,s.day_maintenance_value dayv,s.day_maintenance_name dayn,s.day_maintenance_last dayl
			from (
				select o.object_id, d.dtype_id, d.device_no,d.device_sim, o.group_id, g.group_name, t.protocol_id,
				d.online, d.last_stamp ex, o.object_kind, o.object_flag, o.userdef_flag, o.time_zone, t.can_alarm
				from cfg_device d, cfg_object o, cfg_group g, sys_device_type t
				where d.object_id = o.object_id and o.group_id = g.group_id
					and d.dtype_id = t.dtype_id
			) z
			left join cfg_device_state ds on ds.device_no = z.device_no
			left join dat_alarm a on z.can_alarm = 1 and z.device_no = a.device_no 
				and a.alarm_time between dateadd(hour, -1, getdate()) and getdate()
				and a.finish_time is null
			left join cfg_services s on z.object_id = s.object_id
			left join buses_tripstarted bt on bt.[bus plate number] collate Arabic_CI_AI = z.object_flag  collate Arabic_CI_AI
			left join ( select top(1) * from Buses_PassengerCounter bp order by bp.[date] desc) bp on bp.[Bus Name] collate Arabic_CI_AI = z.object_flag  collate Arabic_CI_AI
			group by bt.[job order], bp.[Current Passengers], z.group_id, z.group_name, z.protocol_id, z.object_id, 
				z.online, z.object_kind, z.object_flag, z.device_no, z.device_sim, z.ex,z.dtype_id,
				ds.gps_time, ds.rcv_time, ds.lng, ds.lat, ds.angle, ds.speed, ds.valid, ds.sta_table, ds.ios_table
				--s.mil_maintenance_enable,s.mil_maintenance_value,s.mil_maintenance_name,s.mil_maintenance_last,
				--s.eng_maintenance_enable,s.eng_maintenance_value,s.eng_maintenance_name,s.eng_maintenance_last,
				--s.day_maintenance_enable,s.day_maintenance_value,s.day_maintenance_name,s.day_maintenance_last
			order by gtxt, c";*/
            $data = $db->query($sql);
            if (!empty($data)) {
                $deviceinfo = array();
                foreach ($data as $row) {
                    if ($row != null) {
                        $objid = trim($row['n']);
						/*以下if else在沙特bus项目才会用到
						if(!empty($row['bjo'])){
							$row['gid'] = strval($row['gid']) .'_'. strval($row['bjo']);
							$row['gtxt'] = $row['bjo'];
						}else{
							$row['gid'] = strval($row['gid']);
						}
						if(!empty($row['cp'])){
							$row['q'] = $row['q']  . '1C:' . $row['cp'] . ',';
							$row['io'] = $row['io']  . '1C:' . $row['cp'] . ',';
						}*/
						//Expired
						if($row['s'] < 0){
							$row['x'] = 0;
							$row['y'] = 0;
							$row['on'] = 0;
							$row['v'] = 0;
							$row['e'] = '';
							$row['q'] = '';
							$row['io'] = '';
							$row['a'] = 0;
						}	
						
						//如果有多个报警，则同一个设备会有多行，此时只递增报警数量并保留最后一个报警箭头和颜色的css
						if(!empty($deviceinfo[$objid])){
							$row[a] = $row[a] + $deviceinfo[$objid][a];
						}
						
                        $deviceinfo[$objid] = $row;
                    }
                }
                $changed = true;
            }
        }
        return $changed;
    }

    public function getData($deviceinfo, &$endpoint, $first, $object = null, $start, $track = false) {
		if ($track) {
			foreach ($object as $key => $value) {
				$data[] = $deviceinfo[$object[$key]];	
			}
			//$data[] = $deviceinfo[$object[0]];	
			
        } else {
            if($endpoint != null && count($endpoint) > 0){
				if($start >= 0){
					$endpoint_part = array_slice($endpoint, $start, $GLOBALS['GLOBAL_LOAD'], true);
					foreach ($endpoint_part as $objid => $info) {
						$row = $deviceinfo[$objid];
						$data[] = $row;
						
						$endpoint[$objid]['c'] = $row['c'];
						$endpoint[$objid]['t'] = $row['t'];
						$endpoint[$objid]['ts'] = $row['ts'];
						$endpoint[$objid]['on'] = $row['on'];
						$endpoint[$objid]['v'] = $row['v'];
						$endpoint[$objid]['a'] = $row['a'];
						$endpoint[$objid]['gid'] = $row['gid'];
						$endpoint[$objid]['gtxt'] = $row['gtxt'];
						$endpoint[$objid]['i'] = $row['i'];
						$endpoint[$objid]['jb'] = $row['jb'];
						$endpoint[$objid]['ex'] = $row['ex'];												
					}
				}else{
					foreach ($endpoint as $objid => $info) {						
						$row = $deviceinfo[$objid];
						$changed = false;
						try {
							if (($GLOBALS['GLOBAL_UPDATE_ALL'] or ($object != null and in_array($row['n'], $object))) and ($info['c'] != $row['c'] or $row['t'] > $info['t'] or $row['ts'] > $info['ts']
								or $info['on'] != $row['on'] or $row['v'] != $info['v'] 
								or $row['a'] != $info['a'] or $row['gid'] != $info['gid']
								or $row['gtxt'] != $info['gtxt'] or $row['i'] != $info['i'] or $row['jb'] != $info['jb'] or $row['ex'] != $info['ex']))
							{
								$endpoint[$objid]['c'] = $row['c'];
								$endpoint[$objid]['t'] = $row['t'];
								$endpoint[$objid]['ts'] = $row['ts'];
								$endpoint[$objid]['on'] = $row['on'];
								$endpoint[$objid]['v'] = $row['v'];
								$endpoint[$objid]['a'] = $row['a'];
								$endpoint[$objid]['gid'] = $row['gid'];
								$endpoint[$objid]['gtxt'] = $row['gtxt'];
								$endpoint[$objid]['i'] = $row['i'];
								$endpoint[$objid]['jb'] = $row['jb'];
								$endpoint[$objid]['ex'] = $row['ex'];
								$changed = true;
							}
							
							if ($first or $changed) {
								$data[] = $row;
							}
						} catch (Exception $e) {

						}
					}
				} 
            }
        }
		return $data;
    }

    public function queryHistory($object, $time1, $time2) {
        $db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
		$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($object)) as table_name";
		
		$data_device_id = $db->query($sql_query_device_id);
		if (!empty($data_device_id)) {
			$track_table_name = $data_device_id[0]['table_name'];
			
			$sql = "declare @device_no nvarchar(20) = dbo.fn_device4oid($object),
					        @last_stamp datetime
							
					select @last_stamp = last_stamp from cfg_device where device_no = @device_no
					  
					if datediff(ss, @last_stamp, getdate()) <= 0
					begin						
						select distinct x, y, h, s, d, v, tg, ts, e, q from (
						select distinct lng x, lat y, round(speed/1,0) s, high h, angle d, valid v, gps_time tg, rcv_time ts, sta_table e, ios_table q 
						from ".$track_table_name." h
						where (lat <> 0 and lng <> 0)
						and gps_time >= convert(datetime, '$time1', 20) and gps_time < convert(datetime, '$time2', 20) 			
						) tg
						order by tg 							
					end";									  			
			try{
				$data = $db->query($sql);
				return $data;
			}catch(Exception $e){
				return $e->getMessage();
			}
		}else{
			echo 'error';
		}
    }
	
	public function queryEvent($object, $time1, $time2) {
        $db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
		$sql = "select o.object_flag c, a.alarm_id n, a.alarm_type a, a.gps_time t, a.lng x, a.lat y, round(a.speed/1,0) s, a.angle d, a.sta_table e, a.ios_table q, dt.protocol_id pid
					  from cfg_device d, cfg_object o, sys_device_type dt, dat_alarm a
					  where d.object_id = o.object_id and dt.dtype_id = d.dtype_id
					  and a.device_no = d.device_no and o.object_id = $object
					  and a.gps_time >= convert(datetime, '$time1', 20) and a.gps_time < convert(datetime, '$time2', 20)
					  --and a.alarm_type <> 20482					  
					  ";								
		try{				
			$data = $db->query($sql);
			return $data;
		}catch(Exception $e){
			return $e->getMessage();
		}
    }
    
    public function queryIoParams($lang, &$ioparams){
        if($ioparams[$lang] == null || ($ioparams['last_stamp_io'] + 60) <= time()) {
			//unset($ioparams);
            $ioparams['last_stamp_io'] = time();
            $db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);           
			
			$sql = "select protocol_id pid, element_id id, dbo.fn_trans_entry('$lang', attrib_name) attrib, 
                dbo.fn_trans_entry('$lang', value_format) vformat,
                dbo.fn_trans_entry('$lang', value_option) voption, attach_func attfunc
                from sys_io_element where valid = 1";
            $data = $db->query($sql);
            foreach($data as $item){
                $pid = $item['pid'];
                $id = $item['id'];
                $attrib = $item['attrib'];
                $format = $item['vformat'];
                $option = $item['voption'];
                $atfunc = $item['attfunc'];
                $ioparams[$lang][$pid][$id] = array('attrib'=>$attrib, 'vformat' => $format, 'voption'=>$option, 'attfunc'=>$atfunc);
            }
			
			$sql = "select command_id cid, dbo.fn_trans_entry('$lang', command_name) cname from sys_command";
			$cmds = $db->query($sql);
			foreach($cmds as $item){
				$cid = $item['cid'];
				$cname = $item['cname'];
				$ioparams[$lang]['command'][$cid] = $cname;
			}
			
            return true;
        } else
            return false;
    }
	
	public function querySensors(&$sensorParams){
		if(($sensorParams['last_stamp_sensor'] + 5) <= time()) {
            $sensorParams['last_stamp_sensor'] = time();
            $db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);           
			
			$sql = "select object_id oid, element_id eid, sensor_name sn, sensor_type st, sensor_target tg, isnull(value_format,'') vf, isnull(value_option,'') di, value_digital_1 sd1, value_digital_0 sd0
                    from cfg_sensor where valid = 1";
            $data = $db->query($sql);
			
			if (!empty($data)) {
				foreach($data as $item){
					$oid = $item['oid'];
					$eid = $item['tg'] == -1 ? $item['eid'] : $item['tg'];
					$sn = $item['sn'];
					$st = $item['st'];
					$vf = $item['vf'];
					$di = $item['di'];
					$sd1 = $item['sd1'];
					$sd0 = $item['sd0'];
					$sensorParams[$oid][$eid] = array('sn'=>$sn, 'st'=>$st, 'vf' => $vf, 'di' => $di, 'sd1' => $sd1, 'sd0' => $sd0);
				}	
			}
			
            return true;
        } else
            return false;
	}
	
	public function sharePositionValid($token){
		$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
		
		$sql = "select s.object_id objid
				from dat_share_position s
				left join sys_user u on s.user_id = u.user_id
				left join web_default w on u.user_id = w.user_id
				left join (select ur.user_id, r.role_name from sys_role r, sys_user_role ur
						   where r.role_id = ur.role_id) rr on rr.user_id = u.user_id
				where token = '$token' and s.share_active = 1 and u.valid = 1 and ((s.enable_expired = 1 and datediff(ss, s.expired_time, getdate()) <= 0) or s.enable_expired = 0)";
		
		$data = $db->query($sql); 
		
		if (!empty($data)) {
			 return true;
		}else{
			return false;
		}
	}
	
	public function setMaxEndtime($objid, $start, &$end){
		$db = new db_mssql($GLOBALS['db_host'], $GLOBALS['db_dbms'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
		$sql_query_device_id = "select dbo.fn_track4device_no(dbo.fn_device4oid($objid)) as table_name";
		
		$data_device_id = $db->query($sql_query_device_id);
		if (!empty($data_device_id)) {
			$track_table_name = $data_device_id[0]['table_name'];
			$max_points = $GLOBALS['GLOBAL_DOWNLOAD_MAX_POINTS'];
			
			$sql = "declare @total int,
							@end_time datetime
			
					select @total = count(*) from ".$track_table_name." 
					where gps_time >= convert(datetime, '$start', 20) and gps_time < convert(datetime, '$end', 20)
					
					if @total <= $max_points
						set @end_time = '$end'
					else
						set @end_time = dateadd(day, 1, convert(datetime, '$start', 20))
					
					select convert(varchar(20), @end_time, 120) as end_time";
			
			$data = $db->query($sql);
			
			if (!empty($data)) {
				$end = $data[0]['end_time'];	
			}          		
		}
	}

}
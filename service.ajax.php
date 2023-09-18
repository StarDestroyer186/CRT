<?php

session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined']) {
    if (isset($_POST['objid']) && ((int)$_POST['objid'] > 0)) {
		$time_zone = (float)$_SESSION['timezone'];
        $objid = (int)$_POST['objid'];
		$user_id = (int) $_SESSION['uid'];
		$unit_speed = $_SESSION['unit_speed'];
		$unit_dist = $_SESSION['unit_distance'];
		$unit_fuel = $_SESSION['unit_fuel'];
		$unit_temp = $_SESSION['unit_temperature'];

        $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
        if (isset($_POST['style']) and ($_POST['style'] == '0')) {            
			$sa = (int) $_POST['sa'];
            $ia = (int) $_POST['ia'];
			$tl = (int) $_POST['tl'];
			$cl = (int) $_POST['cl'];
			$fd = (int) $_POST['fd'];
			$om = (int) $_POST['om'];
			$omb = (int) $_POST['omb'];
			$engh = (int) $_POST['engh'];
			$engb = (int) $_POST['engb'];
			$mms = (int) $_POST['mms'];
			$mis = (int) $_POST['mis'];
			$ov = (float) $_POST['ov'];
			$dsu = (int) $_POST['dsu'];
			$fc = (int) $_POST['fc'];
			$fut = (int) $_POST['fut'];
			$fpos = substr($_POST['fpos'], 0, 50);
			$mile = (int) $_POST['mile'];
			$milv = (int) $_POST['milv'];
			$miln = substr($_POST['miln'], 0, 256);
			$mill = (int) $_POST['mill'];
			$enge = (int) $_POST['enge'];
			$engv = (int) $_POST['engv'];
			$engn = substr($_POST['engn'], 0, 256);
			$engl = (int) $_POST['engl'];
			$daye = (int) $_POST['daye'];
			$dayv = (int) $_POST['dayv'];
			$dayn = substr($_POST['dayn'], 0, 256);
			$dayl = ($_POST['dayl'] == null or strlen($_POST['dayl'])==0) ? null:toServerTime(strtotime($_POST['dayl']), $time_zone);
			$adfstr = $_POST['adf'];
			$adtstr = $_POST['adt'];
			$custm = $_POST['custm'];
			
			$regex = "/(2[0-4]|[01][1-9]|10):([0-5][0-9])/";
            $matches = array();
            $adf = '';
            if(preg_match($regex, $adfstr, $matches)){
                $adf = $adfstr;
            }
			
			$adt = "";
			if(preg_match($regex, $adtstr, $matches)){
                $adt = $adtstr;
            }
			
			$atf = (int) $_POST['atf'];
			$att = (int) $_POST['att'];
			$st = substr($_POST['st'], 0, 256);
			$it = substr($_POST['it'], 0, 256);
			$gz = $_POST['gz'];//substr($_POST['gz'], 0, 1024);
			$en = (int) $_POST['en'];
			$nm = substr($_POST['nm'], 0, 256);
			$ns = substr($_POST['ns'], 0, 256);
			$nt = substr($_POST['nt'], 0, 256);
			$f100 = (int) $_POST['f100'];
			
			//speed unit
			if($unit_speed == 1 && $row['sa'] >= 0){
				//速度转为km/h
				$sa = round($sa * 1.609344,0);
				$mms = round($mms * 1.609344,0);
				$mis = round($mis * 1.609344,0);
			}
			
			//distance unit
			if($unit_dist == 1){
				$om = round($om * 1.609344,0);
				$milv = round($milv * 1.609344,0);
				$mill = round($mill * 1.609344,0);
			}else if($unit_dist == 2){
				$om = round($om * 1.852,0);
				$milv = round($milv * 1.852,0);
				$mill = round($mill * 1.852,0);
			}
			
			//fuel unit
			if($unit_fuel == 1){
				$fc = round($fc * 4.5460919,0);
				$f100 = round($f100 * 4.5460919,0);
			}
			
			//temp unit
			if($unit_temp == 1){
				$atf = round(($atf - 32) / 1.8,0);
				$att = round(($att - 32) / 1.8,0);
			}
			
            $subsql = "
				declare @purview    int,
						@have       int
				set @code = -1
				exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'	
				exec @have = dbo.p_user_have_object $user_id, $objid
				if @purview > 0 and @have > 0
				begin
					
					if not exists(select * from cfg_services where object_id = $objid)
					begin					
						insert into cfg_services (object_id, speed_alarm, idle_alarm, tracker_low_bat, car_low_bat, 
						fatigue_driving, obd_mileage, obd_mileage_by, engine_hour, engine_hour_by, min_moving_speed, min_idle_speed, detect_stop_using, fuel_tank_capacity, fuel_upload_type, fuel_ad_points, fuel_100_km, object_voltage, 
						allow_driving_from, allow_driving_to, allow_temp_from, allow_temp_to, state_event_table, io_event_table, place, enable_notification, notification_email, notification_sms, notification_telegram,
						mil_maintenance_enable, mil_maintenance_value, mil_maintenance_name, mil_maintenance_last,
						eng_maintenance_enable, eng_maintenance_value, eng_maintenance_name, eng_maintenance_last,
						day_maintenance_enable, day_maintenance_value, day_maintenance_name, day_maintenance_last, cust_maintenance) 
						values ($objid, $sa, $ia, $tl, $cl, $fd, $om, $omb, $engh, $engb, $mms, $mis, $dsu, $fc, $fut, ?, $f100, $ov, '$adf', '$adt', $atf, $att, '$st', '$it', '$gz', $en, ?, ?, ?, $mile, $milv, ?, $mill, $enge, $engv, ?, $engl, $daye, $dayv, ?, '$dayl', ?)					
						set @code = 0
					end else
					begin
						update cfg_services set speed_alarm = $sa, idle_alarm = $ia, tracker_low_bat = $tl, car_low_bat = $cl,
						fatigue_driving = $fd, obd_mileage = $om, obd_mileage_by = $omb, engine_hour = $engh, 
						engine_hour_by = $engb, min_moving_speed = $mms, min_idle_speed = $mis, detect_stop_using = $dsu, fuel_tank_capacity = $fc, fuel_upload_type = $fut, fuel_ad_points = ?, fuel_100_km = $f100, object_voltage = $ov, 
						allow_driving_from = '$adf', allow_driving_to = '$adt', allow_temp_from = $atf, allow_temp_to = $att, state_event_table = '$st', io_event_table = '$it', place = '$gz', enable_notification = $en, notification_email = ?, notification_sms = ?, notification_telegram = ?,
						mil_maintenance_enable = $mile, mil_maintenance_value = $milv, mil_maintenance_name = ?, mil_maintenance_last = $mill,
						eng_maintenance_enable = $enge, eng_maintenance_value = $engv, eng_maintenance_name = ?, eng_maintenance_last = $engl,
						day_maintenance_enable = $daye, day_maintenance_value = $dayv, day_maintenance_name = ?, day_maintenance_last = '$dayl', cust_maintenance = ?
						from cfg_services where object_id = $objid
						set @code = 0
					end
				end";
				
			
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
			$params = array($fpos, $nm, $ns, $nt, $miln, $engn, $dayn, $custm, $fpos, $nm, $ns, $nt, $miln, $engn, $dayn, $custm);		
			$data = $db->queryLastDS($sql, $params);
			$error_code = $data[0]['errcode'];
				
			if($error_code == 0){
                echo 'ok';
            } else {
                echo 'x';
            }
        } else if (isset($_POST['style']) and ($_POST['style'] == '1')) {
			$subsql = "declare @purview    int,
							   @have       int
					set @code = -1
					exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'	
					exec @have = dbo.p_user_have_object $user_id, $objid
					if @purview > 0 and @have > 0
					begin				
						begin tran
							update cfg_services set clear_eigine_cahce = 1 where object_id = ?
							set @code = 0
						commit tran
					end";
			
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
			$params = array($objid);
			$data = $db->queryLastDS($sql, $params);
			$error_code = $data[0]['errcode'];
				
			if($error_code == 0){
                echo 'ok';
            } else {
                echo 'x';
            }		
		} else if (isset($_POST['style']) and ($_POST['style'] == '2')) {
			$subsql = "declare @purview    int,
							   @have       int
					set @code = -1
					exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'	
					exec @have = dbo.p_user_have_object $user_id, $objid
					if @purview > 0 and @have > 0
					begin				
						update cfg_services set clear_mileage_cache = 1 where object_id = ?
						set @code = 0
					end";
			
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
			$params = array($objid);
			$data = $db->queryLastDS($sql, $params);
			$error_code = $data[0]['errcode'];
				
			if($error_code == 0){
                echo 'ok';
            } else {
                echo 'x';
            }		
		} else {
			$time_zone = (float)$_SESSION['timezone'];
			$lang = $_SESSION['lang'];
            $sql = "select speed_alarm sa, idle_alarm ia, tracker_low_bat tl, car_low_bat cl,
                fatigue_driving fd, obd_mileage om, obd_mileage_by omb, engine_hour engh, engine_hour_by engb, min_moving_speed mms, min_idle_speed mis, detect_stop_using dsu, fuel_tank_capacity fc, fuel_upload_type fut, fuel_ad_points fpos, fuel_100_km f100, object_voltage ov,
                isnull(allow_driving_from, '') adf, isnull(allow_driving_to, '') adt, allow_temp_from atf, allow_temp_to att, state_event_table st, io_event_table it, place gz, enable_notification en, notification_email nm, notification_sms ns, notification_telegram nt, 
				mil_maintenance_enable mile, mil_maintenance_value milv, isnull(mil_maintenance_name, '') miln, mil_maintenance_last mill,
				eng_maintenance_enable enge, eng_maintenance_value engv, isnull(eng_maintenance_name, '') engn, eng_maintenance_last engl,
				day_maintenance_enable daye, day_maintenance_value dayv, isnull(day_maintenance_name, '') dayn, convert(varchar(10), dbo.fn_to_client_time(day_maintenance_last, $time_zone*60), 20) dayl, cust_maintenance custm
				from cfg_services where object_id = $objid";
				
			$sql_place = "select place_id zid, area_name an, area_type at from cfg_place where place_id in (select place_id from dbo.fn_place4user($user_id))
						 order by an";
						 
			$sql_event = "select event_id eid, object_id oid, event_enable ee, event_name en, isnull(push_notification,0) pne, notification_email_enable nme, notification_sms_enable nse, notification_telegram_enable nte
					      from cfg_event where object_id = $objid";
						  
			$sql_sensor = "select s.sensor_id sid, s.sensor_name sn, s.sensor_type st, s.sensor_target tg, dbo.fn_trans_entry('$lang', e.attrib_name) en, e.element_id eid from cfg_object o, cfg_device d, sys_device_type t, cfg_sensor s, sys_io_element e 
						   where o.object_id = d.object_id and d.dtype_id = t.dtype_id and t.protocol_id = e.protocol_id and s.element_id = e.element_id and e.valid = 1 and s.object_id = $objid and o.object_id = $objid";
						  
			$sql_element = "select e.element_id eid, dbo.fn_trans_entry('$lang', e.attrib_name) en, e.attrib_type et from cfg_object o, cfg_device d, sys_device_type t, sys_io_element e 
						   where o.object_id = d.object_id and d.dtype_id = t.dtype_id and t.protocol_id = e.protocol_id and e.valid = 1 and o.object_id = $objid and e.attrib_type > 0";
			
            $data = $db->query($sql);
			$places = $db->query($sql_place);
			$events = $db->query($sql_event);
			$sensors = $db->query($sql_sensor);
			$elements = $db->query($sql_element);
			
            if (!empty($data) or !empty($places) or !empty($events) or !empty($sensors) or !empty($elements)) {
				$row = $data[0];
				//speed unit
				/*if($unit_speed == 1 && $row['sa'] >= 0){
					//mph(英里/小时)
					/*$row['sa'] = round($row['sa'] * 0.6213712,0);
					$row['mms'] = round($row['mms'] * 0.6213712,0);
					$row['mis'] = round($row['mis'] * 0.6213712,0);
				}*/
				$row['sa'] = round(speedUnitConversion($row['sa']),0);
				$row['mms'] = round(speedUnitConversion($row['mms']),0);
				$row['mis'] = round(speedUnitConversion($row['mis']),0);
				
				//distance unit
				/*if($unit_dist == 1 && $row['om'] >= 0){
					$row['om'] = round($row['om'] * 0.6213712,0);
					$row['milv'] = round($row['milv'] * 0.6213712,0);
					$row['mill'] = round($row['mill'] * 0.6213712,0);
				}else if($unit_dist == 2){
					$row['om'] = round($row['om'] * 0.5399568,0);
					$row['milv'] = round($row['milv'] * 0.5399568,0);
					$row['mill'] = round($row['mill'] * 0.5399568,0);
				}*/			
				$row['om'] = round(mileageUnitConversion($row['om']),0);
				$row['milv'] = round(mileageUnitConversion($row['milv']),0);
				$row['mill'] = round(mileageUnitConversion($row['mill']),0);
				
			
				//fuel unit
				/*if($unit_fuel == 1){
					$row['fc'] = round($row['fc'] * 0.2199692,0);
					$row['f100'] = round($row['f100'] * 0.2199692,0);
				}*/
				$row['fc'] = round(fuelUnitConversion($row['fc']),0);
				$row['f100'] = round(fuelUnitConversion($row['f100']),0);
				
				
				//temp unit
				/*if($unit_temp == 1){
					$row['atf'] = round($row['atf'] * 1.8 + 32,0);
					$row['att'] = round($row['att'] * 1.8 + 32,0);
				}*/
				$row['atf'] = round(tempUnitConversion($row['atf']),0);
				$row['att'] = round(tempUnitConversion($row['att']),0);
				
				$list1 = array2json($row);
				$list2 = array2json($places);
				$list3 = array2json($events);
				$list4 = array2json($sensors);
				$list5 = array2json($elements);
				$json = "{\"list\": $list1, \"places\": $list2, \"events\": $list3, \"sensors\": $list4, \"elements\": $list5}";                
                echo $json;
            } else {
                echo '.';
            }
        }
    }
}
?>

<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if(isset($_GET['token'])){	
	$token = $_GET['token'];
	$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	
	$sql = "select s.object_id objid, u.user_id uid, u.user_name uname, u.login_pass pass, u.valid valid, s.lang lang, s.expired_time expire,
		  w.def_lat lat, w.def_lng lng, isnull(w.def_zoom, 5) zoom, isnull(w.def_show,0) show, isnull(w.show_zone,0) zone, isnull(w.show_marker,0) marker, w.def_date_fmt date_fmt, w.def_time_fmt time_fmt, isnull(w.def_sound_alarm,0) sond_alarm, isnull(w.def_popup_alarm,0) popup_alarm,
		  isnull(w.unit_distance,0) ud, isnull(w.unit_fuel,0) uf, isnull(w.unit_temperature,0) ut, isnull(w.unit_speed,0) us, isnull(w.unit_altitude,0) ua, token
		  from dat_share_position s
		  left join sys_user u on s.user_id = u.user_id
		  left join web_default w on u.user_id = w.user_id
		  --left join cfg_object o cast(o.object_id as varchar(20)) in (s.object_id)
		  left join (select ur.user_id, r.role_name from sys_role r, sys_user_role ur
					   where r.role_id = ur.role_id) rr on rr.user_id = u.user_id
		  where s.share_active = 1 and u.valid = 1 and ((s.enable_expired = 1 and datediff(ss, s.expired_time, getdate()) <= 0) or s.enable_expired = 0) and token = ?";
	$params = array($token);
	$data = $db->query($sql, $params); 
	
	if (!empty($data)) {
		$row = $data[0];	
		if(strcmp($row['token'], $token)==0){
			$objids = explode(',', $row['objid']);
			$osql = "select o.object_id oid, o.object_flag n from cfg_object o where o.object_id in ( ";
			
			$where = "";
			foreach($objids as $o) {
				$where .= " ,".$o;
			}
			$osql .= substr($where,2).")";			
			$odata = $db->query($osql);
			
			if (!empty($odata)) {
				foreach ($odata as $jo) {
					$assets[$jo['oid']] = $jo['n'];
				}
			}		
			
			if(!isset($_SESSION['share']) or !$_SESSION['share']){
				$_SESSION['uid'] = $row['uid'];
				$_SESSION['uname'] = $row['uname'];
				$_SESSION['pass'] = $row['pass'];
				$_SESSION['lang'] = $row['lang'];
				$_SESSION['share'] = true;
				$_SESSION['share_token'] = $token;
				$_SESSION['lat'] = empty($row['lat']) ? $default_latlng['lat'] : number_format(((double) $row['lat'] / 1000000) , 5);
				$_SESSION['lng'] = empty($row['lng']) ? $default_latlng['lng'] : number_format(((double) $row['lng'] / 1000000), 5);
				$_SESSION['zoom'] = empty($row['zoom']) ? $default_latlng['zoom'] : $row['zoom'];
				$_SESSION['show'] = $row['show'];
				$_SESSION['zone'] = $row['zone'];
				$_SESSION['marker'] = $row['marker'];
				$_SESSION['date_fmt'] = empty($row['date_fmt']) ? $support_datefmt['yyyy-MM-dd'] : $support_datefmt[$row['date_fmt']];
				$_SESSION['time_fmt'] = empty($row['time_fmt']) ? $support_timefmt['HH:mm:ss'] : $support_timefmt[$row['time_fmt']];
				$date_fmt_js = empty($row['date_fmt']) ? 'yyyy-MM-dd' : $row['date_fmt'];
				$time_fmt = empty($row['time_fmt']) ? 'HH:mm:ss' : $row['time_fmt'];
				$_SESSION['date_fmt_js'] = $date_fmt_js;
				$_SESSION['time_fmt_js'] = $time_fmt;
				$_SESSION['datetime_fmt_js'] = $date_fmt_js . ' ' . $time_fmt;
				$_SESSION['unit_distance'] = $row['ud'];
				$_SESSION['unit_fuel'] = $row['uf'];
				$_SESSION['unit_temperature'] = $row['ut'];
				$_SESSION['unit_speed'] = $row['us'];
				$_SESSION['unit_altitude'] = $row['ua'];
				
			}

			$url = "track.view.php";	
			echo "
				<form name='tr' action='".$url."' method='POST'>
					<input type='hidden' name='assets' value='".array2json($assets)."'>
				</form>
				<script type='text/javascript'>
					document.tr.submit();
				</script>";
			
			//header('location:track.view.php?objid=' .$objid . '&oflag=' . $oflag);
			exit();
			
		}else{
			$TEXT = $GLOBALS['TEXT'];
			echo $TEXT['js-share-invalid'];
			exit();
		}
	}else{
		$TEXT = $GLOBALS['TEXT'];
		echo $TEXT['js-share-invalid'];
		exit();
	}
}else{
	echo 'x'; 
}
?>
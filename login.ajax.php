<?php

session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

/*
if(!isset($_SESSION['logintimes'])){
	$_SESSION['logintimes'] = 1;
}else if(!isset($_POST['authcode']) or !isset($_SESSION['authcode']) or strtolower($_POST['authcode']) != $_SESSION['authcode']){
	unset($_SESSION['authcode']);
	die("noauth");
}else{
	unset($_SESSION['authcode']);
}*/

$iduser = null;
$idpass = null;

if(isset($_POST['type']) && (int)$_POST['type'] == 1 && isset($_SESSION['logined']) && $_SESSION['logined'] && isset($_POST['usrid']) && $_POST['usrid'] != '' && isset($_SESSION['uid'])){		 
	$s_usrid = (int)$_POST['usrid'];
	$p_user_id = $_SESSION['uid'];
	if($_SESSION['uid'] != (int)$_POST['usrid']){
		$_SESSION['p_uid'] = $_SESSION['uid'];
	}
	
	$sql = "declare @have       int
			exec @have = dbo.p_user_have_subuser $p_user_id, $s_usrid
			if @have > 0
			begin
				select u.login_name iduser, u.login_pass pass from sys_user u where u.user_id = $s_usrid and u.valid = 1
			end";
	try{
		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		$data = $db->query($sql);
		if (!empty($data)) {
			$row = $data[0];
			$iduser = $row['iduser'];
            $idpass = $row['pass'];
		}
	}catch(Exception $e){
		return $e->getMessage();
	}
	
}else if(isset($_POST['type']) && (int)$_POST['type'] == 0 && isset($_SESSION['logined']) && $_SESSION['logined'] && isset($_SESSION['p_uid'])){
	$p_user_id = $_SESSION['p_uid'];
	$sql = "select u.login_name iduser, u.login_pass pass from sys_user u where u.user_id = $p_user_id and u.valid = 1";
		
	try{
		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		$data = $db->query($sql);
		if (!empty($data)) {
			$row = $data[0];
			$iduser = $row['iduser'];
            $idpass = $row['pass'];
		}
	}catch(Exception $e){
		return $e->getMessage();
	}
	unset($_SESSION['p_uid']);
}else{
	$iduser = (isset($_POST['iduser']) && ($_POST['iduser'] != '')) ? trim($_POST['iduser']) : null;
    $idpass = (isset($_POST['idpass']) and ($_POST['idpass'] != '')) ? $_POST['idpass'] : null;
}


//if (/*!isset($_SESSION['logined']) and*/ isset($_POST['iduser']) and ($_POST['iduser'] != '') and isset($_POST['idpass']) and ($_POST['idpass'] != '')) {	
if(isset($iduser) && isset($idpass)) {
	//$iduser = trim($_POST['iduser']);
    //$idpass = $_POST['idpass'];
	$time_zone = isset($_POST['timezone']) ? (float)$_POST['timezone'] : 0;
    $sql = "select u.user_id uid, u.user_name uname, u.login_pass pass, u.email, 
        convert(varchar(5), convert(time, dbo.fn_to_client_time(dateadd(mi, isnull(u.mail_offset,0), 0), ?*60),20)) rtime, 
        isnull(u.mail_report,0) rmail, mail_type mtype, u.valid valid, rr.role_name rname,
        w.def_lat lat, w.def_lng lng, isnull(w.def_zoom, 5) zoom, isnull(w.def_fit_bounds,0) fit, isnull(w.def_collapsed_group,0) collapsed, isnull(w.def_asset_infos,'1,2,3,4,5,6,7,8,9,10,11') assetInfos, isnull(w.def_page,0) page, isnull(w.push_notification,0) puno, isnull(w.def_show,0) show, isnull(w.show_zone,0) zone, isnull(w.show_marker,0) marker, w.def_date_fmt date_fmt, w.def_time_fmt time_fmt, isnull(w.def_sound_alarm,0) sond_alarm, isnull(w.def_popup_alarm,0) popup_alarm,
        isnull(w.unit_distance,0) ud, isnull(w.unit_fuel,0) uf, isnull(w.unit_temperature,0) ut, isnull(w.unit_speed,0) us, isnull(w.unit_altitude,0) ua, isnull(w.unit_tpms,0) up,
		(select count(*) from dbo.fn_invalid_user_tree_upper(u.user_id)) pno
		from sys_user u
        left join web_default w on u.user_id = w.user_id
        left join (select ur.user_id, r.role_name from sys_role r, sys_user_role ur
                where r.role_id = ur.role_id) rr on rr.user_id = u.user_id
        where u.login_name = ?";
	
    $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	$params = array($time_zone, $iduser);
    $data = $db->query($sql, $params); 
	$sql = "select count(*) okind from sys_object_kind";
    $okind = $db->query($sql);	
    if (!empty($data) and !empty($okind)) {
        $row = $data[0];
		$object_kind = $okind[0];
        if ($row['pno'] > 0 or (int) $row['valid'] != 1) {
            echo 'stopped';
        } else if ($row['pass'] != $idpass) {
            echo 'invalid';
        } else {
			unset($_SESSION['share']);
            $_SESSION['uid'] = $row['uid'];
            $_SESSION['pass'] = $row['pass'];
            $_SESSION['maptype'] = $_POST['idmap'];
            $_SESSION['uname'] = $row['uname'];
            $_SESSION['rname'] = $row['rname'];
            $_SESSION['email'] = $row['email'];
            $_SESSION['rtime'] = $row['rtime'];
            $_SESSION['rmail'] = $row['rmail'];
			$_SESSION['mtype'] = $row['mtype'];
            $_SESSION['timezone'] = $time_zone;
            $_SESSION['logined'] = true;
            $_SESSION['lat'] = empty($row['lat']) ? $default_latlng['lat'] : number_format(((double) $row['lat'] / 1000000) , 5);
            $_SESSION['lng'] = empty($row['lng']) ? $default_latlng['lng'] : number_format(((double) $row['lng'] / 1000000), 5);
            $_SESSION['zoom'] = empty($row['zoom']) ? $default_latlng['zoom'] : $row['zoom'];
			$_SESSION['fit'] = $row['fit'];
			$_SESSION['collapsed'] = $row['collapsed'];
			$_SESSION['assetInfos'] = $row['assetInfos'];
			$_SESSION['page'] = $row['page'];
			$_SESSION['puno'] = $row['puno'];
			$_SESSION['puin'] = $GLOBAL_EVENT_PUSH_INTERVAL;
			$_SESSION['show'] = $row['show'];
			$_SESSION['zone'] = $row['zone'];
			$_SESSION['marker'] = $row['marker'];
            $_SESSION['date_fmt'] = empty($row['date_fmt']) ? $support_datefmt['yyyy-MM-dd'] : $support_datefmt[$row['date_fmt']];
            $_SESSION['time_fmt'] = empty($row['time_fmt']) ? $support_timefmt['HH:mm:ss'] : $support_timefmt[$row['time_fmt']];
            //$_SESSION['datetime_fmt'] = $_SESSION['date_fmt'] . ' ' . $_SESSION['time_fmt'];
			$date_fmt_js = empty($row['date_fmt']) ? 'yyyy-MM-dd' : $row['date_fmt'];
            $time_fmt = empty($row['time_fmt']) ? 'HH:mm:ss' : $row['time_fmt'];
			$_SESSION['date_fmt_js'] = $date_fmt_js;
			$_SESSION['time_fmt_js'] = $time_fmt;
			$_SESSION['datetime_fmt_js'] = $date_fmt_js . ' ' . $time_fmt;
            $_SESSION['lang'] = $_SESSION['lang'];
			$_SESSION['sond_alarm'] = $row['sond_alarm'];
			$_SESSION['popup_alarm'] = $row['popup_alarm'];
			$_SESSION['object_kind'] = $object_kind['okind'];
			
			$_SESSION['unit_distance'] = $row['ud'];
			$_SESSION['unit_fuel'] = $row['uf'];
			$_SESSION['unit_temperature'] = $row['ut'];
			$_SESSION['unit_speed'] = $row['us'];
			$_SESSION['unit_altitude'] = $row['ua'];
			$_SESSION['unit_tpms'] = $row['up'];
			
			$user_id = $row['uid'];
			$user_name = $row['uname'];
			$login_name = $iduser;
			$session_id = session_id();			
			$login_time = date('Y-m-d H:i:s', time());
			$_SESSION['login_time'] = $login_time;
			$ip = getIp();
			$sql = "insert into dbo.web_login_log (user_id, session_id, user_name, login_name, login_time, login_ip, time_zone) values (?, ?, ?, ?, ?, ?, ?)";
			$params = array($user_id, $session_id, $user_name, $login_name, $login_time, $ip, $time_zone);
			$db->query($sql, $params); 
			
			unset($_SESSION['logintimes']);
            //echo 'ok';
			echo "{'status':'ok', 'uid': $user_id}";
        }
    } else if($db->error_code == 0){
        echo 'invalid';
    } else {
        echo 'error';
    }
} else {
    echo '.';
}

/*
function getIp(){
  $ip=false;
  if(!empty($_SERVER["HTTP_CLIENT_IP"])){
     $ip = $_SERVER["HTTP_CLIENT_IP"];
  }
  if(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
     $ips = explode (", ", $_SERVER['HTTP_X_FORWARDED_FOR']);
     if ($ip) { array_unshift($ips, $ip); $ip = FALSE; }
     for ($i = 0; $i < count($ips); $i++) {
        if (!eregi ("^(10│172.16│192.168).", $ips[$i])) {
			$ip = $ips[$i];
			break;
        }
     }
  }
  return ($ip ? $ip : $_SERVER['REMOTE_ADDR']);
}*/
function getIp(){
    $ip='null';
    if(!empty($_SERVER['HTTP_CLIENT_IP'])){
        return is_ip($_SERVER['HTTP_CLIENT_IP'])?$_SERVER['HTTP_CLIENT_IP']:$ip;
    }elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
        return is_ip($_SERVER['HTTP_X_FORWARDED_FOR'])?$_SERVER['HTTP_X_FORWARDED_FOR']:$ip;
    }else{
        return is_ip($_SERVER['REMOTE_ADDR'])?$_SERVER['REMOTE_ADDR']:$ip;
    }
}
function is_ip($str){
    $ip=explode('.',$str);
    for($i=0;$i<count($ip);$i++){ 
        if($ip[$i]>255){ 
            return false; 
        } 
    } 
    return preg_match('/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/',$str); 
}

?>
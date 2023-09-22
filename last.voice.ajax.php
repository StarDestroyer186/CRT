<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid'])) {
	if (isset($_GET['objid']) && ((int)$_GET['objid'] > 0)) {
		$objid = (int)$_GET['objid'];
		$time_zone = (float)$_SESSION['timezone'];
		
		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		$sql = "select top(1) voice, convert(varchar(20), dbo.fn_to_client_time(v.rcv_time, $time_zone*60), 120) time from cfg_object o, cfg_device d, dat_voice_record v 
				where o.object_id = d.object_id and d.device_no = v.device_no and v.voice is not null and o.object_id = ?
				order by v.rcv_time desc";
		$params = array($objid);
		$voice = $db->query($sql, $params);
		$audio = array2json('<audio controls="controls" preload="metadata" autoplay>
								<source src="data:audio/mpeg;base64,'.base64_encode( $voice[0]['voice'] ).'"/>;
							 </audio>');
		$time = array2json($voice[0]['time']);
		
		if($voice[0]['voice'] != null){
			echo "{'audio':$audio, 'time':$time}";
		}else{
			echo 'none';
		}		
	}else{
		echo 'none';
	}
}
else echo 'no login';
?>

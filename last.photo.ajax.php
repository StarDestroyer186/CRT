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
		$sql = "select top(1) photo, convert(varchar(20), dbo.fn_to_client_time(p.take_time, $time_zone*60), 120) time from cfg_object o, cfg_device d, dat_photo p 
				where o.object_id = d.object_id and d.device_no = p.device_no and o.object_id = ?
				order by p.take_time desc";
		$params = array($objid);
		$image = $db->query($sql, $params);
		if (isset($_GET['size'])){
			$img = array2json('<img width="100px" height="100px" src="data:image/jpeg;base64,'.base64_encode( $image[0]['photo'] ).'"/>');
		}else{
			$img = array2json('<img src="data:image/jpeg;base64,'.base64_encode( $image[0]['photo'] ).'"/>');
		}
					
		$time = array2json($image[0]['time']);
		
		if($image[0]['photo'] != null){
			echo "{'img':$img, 'time':$time}";
		}else{
			echo 'none';
		}		
	}else{
		echo 'none';
	}
}
else echo 'no login';
?>

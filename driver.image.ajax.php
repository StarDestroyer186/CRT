<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if((isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid'])) or (isset($_SESSION['share']) and $_SESSION['share']))
{
    if(!isset($_GET['full'])){
		$jb = trim($_GET['jb']);

		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		$sql = "select photo from cfg_driver where job_number = ?";
		$params = array($jb);
		$image = $db->query($sql, $params);
		if($image[0]['photo'] != null){
			echo '<img width="80" height="89" src="data:image/jpeg;base64,'.base64_encode( $image[0]['photo'] ).'"/>';
		}else{
			echo 'none';
		}
	}else{
		$jb = trim($_GET['jb']);

		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		$sql = "select job_number jb, driver_name dn, phone ph, photo pi, rfid rf from cfg_driver where job_number = ?";
		$params = array($jb);
		$driver =$db->query($sql, $params);
		$dn = $driver[0]['dn'];
		$ph = $driver[0]['ph'];
		$rf = $driver[0]['rf'];
		
		$pi = empty($driver[0]['pi']) ? null : '<img width="80" height="89" src="data:image/jpeg;base64,'.base64_encode( $driver[0]['pi'] ).'"/>';
		
		if($driver[0]['jb'] != null){ 
			echo "{'jb': '$jb', 'dn': '$dn', 'ph': '$ph', 'rf': '$rf', 'pi':'$pi'}";
		}else{
			echo 'none';
		}
	}		
}
else echo 'no login';
?>

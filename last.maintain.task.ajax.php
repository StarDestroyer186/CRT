<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid'])) {
	if (isset($_GET['objid']) && ((int)$_GET['objid'] > 0)) {
		$objid = (int)$_GET['objid'];
		$time_zone = (float)$_SESSION['timezone'];
		$unit_dist = $_SESSION['unit_distance'];
		
		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		$sql = "select mil_maintenance_enable mile, mil_maintenance_value milv, isnull(mil_maintenance_name, '') miln, mil_maintenance_last mill,
				eng_maintenance_enable enge, eng_maintenance_value engv, isnull(eng_maintenance_name, '') engn, eng_maintenance_last engl,
				day_maintenance_enable daye, day_maintenance_value dayv, isnull(day_maintenance_name, '') dayn, convert(varchar(10), dbo.fn_to_client_time(day_maintenance_last, $time_zone*60), 20) dayl, cust_maintenance custm
				from cfg_services where object_id = ?";
		$params = array($objid);
		$mt_list = $db->query($sql, $params);
		if(!empty($mt_list)){
			foreach ($mt_list as $mt_row) {
				//distance unit
				//if($unit_dist == 1){
					$mt_row['milv'] = round(mileageUnitConversion($mt_row['milv']),0);
					$mt_row['mill'] = round(mileageUnitConversion($mt_row['mill']),0);
				/*}else if($unit_dist == 2){
					$mt_row['milv'] = round(mileageUnitConversion($mt_row['milv']),0);
					$mt_row['mill'] = round(mileageUnitConversion($mt_row['mill']),0);
				}*/
				
				$mt_output[] = $mt_row;
			}
			$mt = array2json($mt_output);
		}else{
			$mt = "null";
		}
			
		$sql = "select task_name tn, status ts from cfg_tasks where object_id = ? and (start_from > dateadd(day, -5, getdate()) or (status < 3 and end_to >= getdate()))";
		$params = array($objid);
		$ta_list = $db->query($sql, $params);
		if(!empty($ta_list)){
			foreach ($ta_list as $ta_row) {
				$ta_output[] = $ta_row;
			}
			$ta = array2json($ta_output);
		}else{
			$ta = "null";
		}			
		
		$json = "{\"mt\": $mt, \"ta\": $ta}";
         echo $json;
	}else{
		echo 'none';
	}
}
else echo 'no login';
?>

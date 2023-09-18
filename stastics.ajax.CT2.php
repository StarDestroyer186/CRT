<?php
session_start();
include_once('common.inc.php');
require_once 'svc.class.php';
require_once 'db.class.php';
require_once 'db.sqlsrv.php';
 return;
/*$sql = "select o.object_flag, convert(nvarchar(10) ,collect_date,120) collect_date, mileage/1000 mileage from dbo.cfg_object o, dbo.rpt_usage r where 
		o.object_id = r.object_id and r.collect_date > convert(nvarchar(10),dateadd(day, -2, getdate()),20) and o.group_id in
		(
			select group_id from dbo.fn_group4user(4)
		)";

try{
	$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	
	$data = $db->query($sql);
	if (!empty($data)) {
		foreach ($data as $row) {
			if ($row != null) {
				
				$output[] = $row;
			}
		}
		$json = array2json($output);
		echo $json;
	}
}catch(Exception $e){
	return $e->getMessage();
}
*/

?>

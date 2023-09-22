<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if ((isset($_SESSION['logined']) and $_SESSION['logined']) or (isset($_SESSION['share']) and $_SESSION['share']) and isset($_SESSION['uid'])) {
	if (isset($_GET['lat']) && isset($_GET['lng']) && isset($_GET['addr'])) {
		$lang = $_SESSION['lang'];
		$lat = (float)$_GET['lat'];
		$lng = (float)$_GET['lng'];
		$addr = mb_substr($_GET['addr'], 0, 255, 'utf-8');
		
		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		$subsql = "set @code = -1
				   if exists(select * from dat_address where lat = $lat and lng = $lng and lang = '$lang')
				   begin
					  update dat_address set addr = ? where lat = $lat and lng = $lng and lang = '$lang'
					  set @code = 0
				   end else
				   begin
					  insert into dat_address (lat, lng, addr, lang) values ($lat, $lng, ?, '$lang')
					  set @code = 0
				   end				  
				   ";
		
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
		$params = array($addr, $addr);			
		$data = $db->queryLastDS($sql, $params);
		$error_code = $data[0]['errcode'];

		 if(!is_null($error_code) && $error_code == 0){
			echo "{'status':'ok'}";
		}else{
			echo ".";
		}
		
	}else if (isset($_GET['lat']) && isset($_GET['lng'])){
		$lat = (float)$_GET['lat'];
		$lng = (float)$_GET['lng'];
		$precision = 0.0002;
		
		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
		$sql = "select top(1) addr from dat_address where lat >= $lat - $precision and lng >= $lng - $precision and lat <= $lat + $precision and lng <= $lng + $precision and lang = '$lang' order by lat desc";
	
		$address = $db->query($sql);
		
		if (!empty($address)) {
			$json = array2json($address[0]);
			echo $json;
		}else{
			echo ".";
		}		
	}
}
else echo 'no login';
?>

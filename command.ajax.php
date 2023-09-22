<?php

session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid']) and isset($_GET['objid']) and isset($_GET['cmdid'])) {
    $user_id = (int) $_SESSION['uid'];
	$objid = (int)$_GET['objid'];
    $cmdid = (int) $_GET['cmdid'];
	//$params = isset($_GET['params']) ? str_replace(",","，",$_GET['params']) : null;
	$params = isset($_GET['params']) ? $_GET['params'] : null;
	
	$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	$subsql = "declare @havecmd  int,
					   @haveobj  int
			set @code = -1
			exec @havecmd = dbo.p_user_have_command $user_id, $cmdid
			exec @haveobj = dbo.p_user_have_object $user_id, $objid
			if @havecmd > 0 and @haveobj > 0
			begin				
				declare @device nvarchar(20)
				select @device = device_no from cfg_device d, cfg_object o where d.object_id = o.object_id and o.object_id = $objid

				if not exists(select * from dbo.web_command_interface where device_no = @device and command_id = $cmdid and send_state = -1)
				begin
					insert into dbo.web_command_interface (device_no, command_id, send_state, params, send_time)
					values (@device, $cmdid, -1, ?, getdate())
				end
				else
				begin
					update dbo.web_command_interface set send_time = getdate(), params = ? where device_no = @device and command_id = $cmdid and send_state = -1
				end
				set @code = 0
			end
			else
				set @code = -20";
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
	$pas = array($params, $params);		
	$data = $db->queryLastDS($sql, $pas);
	$error_code = $data[0]['errcode'];
		
	if($error_code == 0){
		echo 'ok';
	} else {
		echo "{'status':'fail','error':$error_code}";
	}
	/*try{
		if ($db->exec($sql)) {
			echo 'ok';
		} else {
			echo 'fail';
		}
	}catch(Exception $e){echo 'error';}*/
}
else{
    echo 'no login';
}
?>

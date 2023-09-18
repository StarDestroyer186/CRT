<?php

session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if(isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid']))
{
	$user_id = (int)$_SESSION['uid'];
	$idOld = trim($_GET['idOld']);
	$idNew = trim($_GET['idNew']);
	$idRep = trim($_GET['idRep']);

	if($_SESSION['pass'] == $idOld && $idNew == $idRep && $idNew != ""){
		$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
        $sql = "declare @code int
        begin try
            begin tran
            set @code = -1
            update sys_user set login_pass = ? 
			where user_id = ?
            commit tran
            set @code = 0
        end try
        begin catch
            rollback tran
        end catch
        select @code as errcode";
		$params = array($idNew, $user_id);
		$data =$db->queryLastDS($sql, $params);
        $error_code = $data[0]['errcode'];
        if(!is_null($error_code) && $error_code == 0){
            $_SESSION['pass'] = $idNew;
			echo 'ok';
		}
	}else echo '*';
}
else echo 'no login';
?>

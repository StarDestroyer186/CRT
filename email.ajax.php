<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if(isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid']))
{
    $user_id = (int)$_SESSION['uid'];
    $email = $_GET['email'];
    $rtime = $_GET['rtime'] == "" ? "00:00" : $_GET['rtime'];
    $rmail = $_GET['rmail'];
	$mtype = $_GET['mtype'];
	$time_zone = $_SESSION['timezone'];

    $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
    $sql = "update sys_user set email = '$email', mail_offset = datediff(mi, 0, convert(time, dbo.fn_to_server_time('$rtime', $time_zone*60), 20)),
            mail_report = $rmail, mail_type = '$mtype' 
            where user_id = $user_id";
    if($db->exec($sql)){
        $_SESSION['email'] = $email;
        $_SESSION['rtime'] = $rtime;
        $_SESSION['rmail'] = $rmail;
		$_SESSION['mtype'] = $mtype;
		
        echo 'ok';
    }else{
        echo 'fail';
    }
}
else echo 'no login';
?>

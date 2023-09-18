<?php

session_start();
include_once('config.inc.php');
require_once 'svc.class.php';
require_once 'db.sqlsrv.php';

$user_id = (int)$_SESSION["uid"];
$lang = $_SESSION['lang'];
$memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
$online = memcache_get($memcache, $GLOBAL_USER);
unset($online['list'][$user_id]);
memcache_set($memcache, $GLOBAL_USER, $online, MEMCACHE_COMPRESSED, 0);
memcache_close($memcache);

$user_id = $_SESSION['uid'];
$session_id = session_id();	
$login_time = $_SESSION['login_time'];		
$leave_time = date('Y-m-d H:i:s', time());
$sql = "update dbo.web_login_log set leave_time = '$leave_time' where user_id = $user_id and session_id = '$session_id' and login_time='$login_time'";
$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
$data = $db->query($sql); 

unset($_SESSION['uid']);
unset($_SESSION['uname']);
unset($_SESSION['pass']);
unset($_SESSION['logined']);
unset($_SESSION['share']);
unset($_SESSION['lang']);
unset($_SESSION['login_time']);
unset($_SESSION['p_uid']);

session_unset();
echo "<SCRIPT language=JavaScript>window.location='login.php?lang=$lang';</script>";
?>
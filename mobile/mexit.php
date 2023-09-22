<?php

session_start();
include_once('../config.inc.php');
require_once '../svc.class.php';

$user_id = (int)$_SESSION["uid"];
$lang = $_SESSION['lang'];
$memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
$online = memcache_get($memcache, $GLOBAL_USER);
unset($online['list'][$user_id]);
memcache_set($memcache, $GLOBAL_USER, $online, MEMCACHE_COMPRESSED, 0);
memcache_close($memcache);

unset($_SESSION['uid']);
unset($_SESSION['uname']);
unset($_SESSION['logined']);
unset($_SESSION['lang']);

session_unset();
echo "<SCRIPT language=JavaScript>window.location='mlogin.php?lang=$lang';</script>";
?>
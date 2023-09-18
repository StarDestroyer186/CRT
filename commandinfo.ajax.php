<?php

session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined']) {
	$user_id = (int)$_SESSION["uid"];
	$lang = $_SESSION['lang'];

	$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	$sql = "select dtype.dtype_id tid, scmd.command_id cid, dtype.protocol_id pid, dbo.fn_trans_entry('$lang',scmd.command_name) cn, scmd.command_kind ckind, scmd.command_key ckey 
			from sys_device_type dtype 
			inner join cfg_type_command tcmd on dtype.dtype_id = tcmd.dtype_id 
			inner join sys_protocol_command pcmd on dtype.protocol_id = pcmd.protocol_id and tcmd.command_id = pcmd.command_id 
			inner join sys_command scmd on tcmd.command_id = scmd.command_id 
			inner join cfg_user_command ucmd on scmd.command_id = ucmd.command_id 
			where ucmd.user_id = ?
			order by dtype.dtype_id,scmd.command_id";
	$params = array($user_id);
	$tcmd = $db->query($sql, $params);
	
	$sql = "select distinct scmdp.protocol_id pid, scmdp.command_id cid, scmdp.param_id paid, scmdp.param_sn psn, scmdp.param_must pm,
			dbo.fn_trans_entry('$lang',sysp.param_name) pn, dbo.fn_trans_entry('$lang',sysp.units) units,
			sysp.value_type vt, dbo.fn_trans_entry('$lang',sysp.hint) h, sysp.max_len maxl, sysp.min_value minv, sysp.max_value maxv, dbo.fn_trans_entry('$lang',sysp.def_value) dv,sysp.limit l
			from sys_command_param scmdp 
			inner join sys_param sysp on scmdp.param_id = sysp.param_id 
			order by scmdp.protocol_id,scmdp.command_id,scmdp.param_sn";		
	$pparam = $db->query($sql);
	
	$jt = array2json($tcmd);
	$jp = array2json($pparam);
	
	$json = "{'tcmd': $jt, 'pparam': $jp}";
    echo $json;
}
?>

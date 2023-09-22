<?php
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_GET['uname']) and isset($_GET['mail']) and isset($_GET['lang'])){
	$uname = trim($_GET['uname']);
	$email = trim($_GET['mail']); 
	$lang = trim($_GET['lang']);

	$sql = "select u.user_id uid, u.user_name uname, u.login_pass pass, u.email from sys_user u where user_name = ? and email = ?"; 
	$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	$params = array($uname, $email);
	$data = $db->query($sql, $params); 
		
	if(empty($data)){ 
		echo 'noreg'; 
		die; 
	}else{ 
		$row = $data[0];
		if ($row['uname'] == $uname) {			
			$getpasstime = time(); 
			$uid = $row['uid']; 
			$token = md5($uid.$row['uname'].$row['email'].$row['pass']);//组合验证码 
			$http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
			$url = $http_type . $_SERVER['HTTP_HOST']."/reset.password.php?lang=".$lang."&uname=".$uname."&email=".$email."&token=".$token;//构造URL 
			$time = date('Y-m-d H:i'); 
			
			$subject = $TEXT['recpass-subject'];
			$emailbody = $TEXT['recpass-dear']." ".$uname.":".$TEXT['recpass-content']."<a href='".$url."'target='_blank'>".$TEXT['recpass-reset']."</a>";
			
			$result = sendmail($mail_host,$mail_port,$mail_default_from,$mail_username,$mail_password,$email,$subject,$emailbody); 

			if($result==1){//邮件发送成功 
				$msg = 'ok'; 
				//更新数据发送时间 
				$sql = "update sys_user set valid_key = ? where user_id = ?";
				$params = array($getpasstime, $uid);
				$data = $db->query($sql, $params); 
			}else{ 
				$msg = $result; 
			} 
			echo $msg;
		}else{
			echo 'noreg'; 
		}
	} 
}else{
	echo 'noreg'; 
}


?>
<?php
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

	$token = $_GET['token']; 
	$uname = trim($_GET['uname']);
	$email = trim($_GET['email']); 

	$sql = "select u.user_id uid, u.user_name uname, u.login_pass pass, u.email, valid_key vkey from sys_user u where user_name = ? and email = ?"; 
	$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	$params = array($uname, $email);
	$data = $db->query($sql, $params); 
	$row = $data[0];

	if($row){ 
		$uid = $row['uid']; 
		$mt = md5($row['uid'].$row['uname'].$row['email'].$row['pass']); 
		if($mt==$token){ 
			if(time()-$row['vkey']>24*60*60){ 
				$msg = $TEXT['recpass-link-expired']; 
			}else{ 
				if(isGet()){
					//重置密码... 
					$msg = '<form name="reset" method="post" >
							<label for="pass">'.$TEXT['info-newpass'].'</label>
							<input id="pass" type="password" name="pass" autocomplete="off"></input>
							<label for="cpass">'.$TEXT['info-confrimpass'].'</label>
							<input id="cpass" type="password" name="cpass" autocomplete="off"></input>
							<input type="submit" name="reset"></button>
							</form>'; 
				}else{
					$pass = $_POST['pass'];
					$cpass = $_POST['cpass'];

					if($pass == ""){
						$msg = $TEXT['recpass-pass-blank'];
					}else{
						if($pass == $cpass){							
							$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
							$sql = "declare @code int
							begin try
								begin tran
								set @code = -1
								update sys_user set login_pass = ?, valid_key = 0 where user_id = ?
								commit tran
								set @code = 0
							end try
							begin catch
								rollback tran
							end catch
							select @code as errcode";
							$params = array($pass, $uid);
							$data =$db->queryLastDS($sql, $params);
							$error_code = $data[0]['errcode'];
							if(!is_null($error_code) && $error_code == 0){
								$msg = $TEXT['recpass-complete'];
							}														
						}else{
							$msg = $TEXT['recpass-pass-nosame'];
						}					
					}				
				}
			} 
		}else{ 
			$msg = $TEXT['recpass-link-invalid']; 
		} 
	}else{ 
		$msg = $TEXT['recpass-link-invalid']; 
	} 
	echo $msg;
	

function isGet(){
	return $_SERVER['REQUEST_METHOD'] == 'GET' ? true : false;
}


?>
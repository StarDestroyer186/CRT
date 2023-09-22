<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined']){
	$timezone = isset($_SESSION['timezone']) ? (float) $_SESSION['timezone'] : 0;
	$user_id = (int) $_SESSION['uid'];
	$lang = $_SESSION['lang'];
	$type = (int) $_POST['type'];
	$db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	
	switch ($type) {
        case 1: //share position list
			$sql = "select s.share_id shid, share_name sn, share_active sa, object_id oids, lang lg, email e, phone p, create_time ct,
				    enable_expired ee, case when expired_time = null then '' else convert(varchar(20), dbo.fn_to_client_time(expired_time, ?*60), 120) end et, enable_delete ed, enable_email enm, enable_sms ens, token tn
				    from dat_share_position s where s.user_id = ?";
			$params = array($timezone, $user_id);		
			$slist = $db->query($sql, $params);
			if (!empty($slist)) {
				foreach ($slist as $row) {
					if(startwith($row['et'],"1970")){
						$row['et'] = '';
					}				
					$output[] = $row;
				}			
				$json = array2json($output);
				echo $json;
			}           		
			break;
			
		case 2:	//query one share position	
			$shid = (int) $_POST['shid'];
			$sql = "select s.share_id shid, share_name sn, share_active sa, object_id oids, lang lg, email e, phone p, create_time ct,
				    enable_expired ee, case when expired_time = null then '' else convert(varchar(20), dbo.fn_to_client_time(expired_time, ?*60), 120) end et, enable_delete ed, enable_email enm, enable_sms ens, token tn
				    from dat_share_position s where s.share_id = ?";
			$params = array($timezone, $shid);		
			$slist = $db->query($sql, $params);
            if (!empty($slist)) {
				foreach ($slist as $row) {
					if(startwith($row['et'],"1970")){
						$row['et'] = '';
					}				
					$output[] = $row;
				}			
				$json = array2json($output);
				echo $json;
			} 
			break;
		
		case 3:
			$sn = trim(substr($_POST['sn'], 0, 50));
			$sa = (int) $_POST['sa'];					
			$oids = trim($_POST['oids']);
			$e = substr($_POST['e'], 0, 100);
			$p = substr($_POST['p'], 0, 50);
			$ee = (int) $_POST['ee'];
			$et = trim($_POST['et']);
			$ed = (int) $_POST['ed'];
			$enm = (int) $_POST['enm'];
			$ens = (int) $_POST['ens'];
			$shid = (int) $_POST['shid'];
			
			switch($_POST['state']){
				case 1://new					
					$create_time = date('Y-m-d H:i:s',time()); 
					$expired = toServerTime(strtotime($_POST['et']), $timezone);
					$token = md5($user_id . $oids . $create_time . $create_time . uniqid());//组合验证码
					
					$subsql = "declare @have int,
									   @next int,
									   @objid int
						set @code = -1
						set @next= 1
						while @next <= dbo.fn_str_array_length('$oids' ,',')
						begin 
							set @objid = dbo.fu_str_array_str_of_index('$oids' ,',',@next)
							exec @have = dbo.p_user_have_object $user_id, @objid
							if(@have <= 0) 
								break
							set @next = @next+1
						end
						
						if @have > 0
						begin				
							if not exists(select * from dbo.dat_share_position where share_name = N'$sn' and user_id = $user_id)
							begin					
								insert into dbo.dat_share_position (share_name, share_active, user_id, object_id, lang, email, phone, create_time, enable_expired, expired_time, enable_delete, enable_email, enable_sms, token) 
								values (?, $sa, $user_id, '$oids', '$lang', N'$e', '$p', '$create_time', $ee, '$expired', $ed, $enm, $ens, N'$token')	
								set @shid = scope_identity()
								set @code = 0
							end else
							begin
								update dbo.dat_share_position set share_active = $sa, user_id = $user_id, object_id = '$oids', lang = '$lang', email = N'$e', phone = '$p', create_time = '$create_time', 
								enable_expired = $ee, expired_time = '$expired', enable_delete = $ed, enable_email = $enm, enable_sms = $ens, token = N'$token'
								where share_name = ? and user_id = $user_id
								
								select @shid = share_id from dbo.dat_share_position where share_name = ? and user_id = $user_id
								set @code = 0
							end
						end
						else
							set @code = -20";
					$params = array($sn, $sn, $sn);		
					break;
				
				case 2://modify
					$expired = toServerTime(strtotime($_POST['et']), $timezone);
					$subsql = "declare @have int,
									   @next int,
									   @objid int
								set @code = -1
								set @next= 1
								while @next <= dbo.fn_str_array_length('$oids' ,',')
								begin 
									set @objid = dbo.fu_str_array_str_of_index('$oids' ,',',@next)
									exec @have = dbo.p_user_have_object $user_id, @objid
									if(@have <= 0) 
										break
									set @next = @next+1
								end
								
								if @have > 0
								begin							
								   update dbo.dat_share_position set share_name = N'$sn', share_active = $sa, user_id = $user_id, object_id = '$oids', lang = '$lang', email = N'$e', phone = '$p',  
								   enable_expired = $ee, expired_time = '$expired', enable_delete = $ed, enable_email = $enm, enable_sms = $ens
								   where share_id = ?
								   
								   select @token = token from dbo.dat_share_position where share_id = ?
								   set @shid = $shid
								   set @code = 0
							   end
							   else
							   set @code = -20";
					$params = array($shid, $shid);	
					break;
				
				case 3://delete
					$subsql = "delete from dbo.dat_share_position where share_id = ? and user_id = ?";
					$params = array($shid, $user_id);	
					break;					
			}
			
			$sql = "declare @code int,
							@shid int,
							@token nvarchar(100)
					begin try
						begin tran
						$subsql
						commit tran
					end try
					begin catch
						rollback tran
					end catch

					select @code as errcode, @shid as shid, @token as token";
			
			$data = $db->queryLastDS($sql, $params);	
			$error_code = $data[0]['errcode'];
			$shid = $data[0]['shid'];
				
			if($error_code == 0){
				if($_POST['state'] == 1 || $_POST['state'] == 2){
					if($_POST['state'] == 2){
						$token = $data[0]['token'];
					}
					echo "{\"status\":\"ok\", \"shid\": $shid, \"token\": \"$token\"}";	
					/**send email*/	
					if(isset($e) && $enm == 1){	
						$http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';					
						$url = $http_type . $_SERVER['HTTP_HOST']."/share.login.ajax.php?token=" . $token;
						$subject = $TEXT['js-share-position'] .' - '. $sn;
						$emailbody = $url;
						$result = sendmail($mail_host,$mail_port,$mail_default_from,$mail_username,$mail_password,$e,$subject,$emailbody); 

						if($result == 1){ 
							//send email successful
						}else{ 
							//send email fail
						} 
					}
				}else{
					echo "{\"status\":\"ok\"}";
				}					 
			} else {
				echo "{\"status\":\"fail\",\"error\":$error_code}";
			}
		break;			
	}
}else{
	echo '.'; 
}


?>
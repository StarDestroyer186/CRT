<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';
if (isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid']) and isset($_POST['type'])) {
    $user_id = (int) $_SESSION['uid'];    

    $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
    $type = (int) $_POST['type'];
    switch ($type) {
		case 11://query driver
			if (isset($_POST['jobnumber'])) {
				$jobnumber = trim($_POST['jobnumber']);
                //query one driver
				$time_zone = (float)$_SESSION['timezone'];
				$sql = "select d.job_number j, d.driver_name n, d.sex s, d.is_primary ip,
						d.phone p, d.ident id, d.rfid rfid, d.license l, 
						convert(varchar(10), dbo.fn_to_client_time(d.issue_date, $time_zone*60), 20) isd, 
						convert(varchar(10), dbo.fn_to_client_time(d.expire_date, $time_zone*60), 20) exd,
						d.company co, d.address addr, d.photo ph, d.remark r 
						from dbo.cfg_driver d 
						where d.job_number = ?";
				$params = array($jobnumber);		
				$driverlist = $db->query($sql, $params);
				foreach ($driverlist as $row) {
					$row['ph'] = $row['ph'] == null ? "" : 'data:image/jpeg;base64,'.base64_encode( $row['ph'] );
					$output[] = $row;
				}
				$json = array2json($output);
				echo $json;
			}else{
				//query driver list
				$sql = "select d.job_number j, d.driver_name n, d.phone p, d.license l , d.rfid r from cfg_user_purview p, dbo.cfg_driver d where p.user_id = $user_id and p.purview_id = 1000 and d.job_number in
						(select driver_job_number from dbo.cfg_object where group_id in ( select group_id from dbo.fn_group4user($user_id))) 
						union 
						select d.job_number j, d.driver_name n, d.phone p, d.license l , d.rfid r from cfg_user_purview p, dbo.cfg_driver d where p.user_id = $user_id and p.purview_id = 1000 and d.user_id = $user_id
						union 
						select d.job_number j, d.driver_name n, d.phone p, d.license l , d.rfid r from cfg_user_purview p, dbo.cfg_driver d where p.user_id = $user_id and p.purview_id = 1000 and d.user_id in (select user_id from dbo.fn_user_tree($user_id))					
						order by driver_name";
				$driverlist = $db->query($sql);
				
				$sql_pur = "select purview_id pid, isnull(purview,'') p from cfg_user_purview where user_id = $user_id and purview_id = 1300";
				$upurview = $db->query($sql_pur);
				
				$list = array2json($driverlist);
				$pr = array2json($upurview);
				$json = "{'list': $list, 'pur': $pr}";
				echo $json;
			}	
		break;
		
		case 12:
			$jno = trim($_POST['jno']);
		    $name = $_POST['name'];
			$oid = (int)$_POST['oid'];
			$sex = $_POST['sex'];
			$ip = (int)$_POST['ip'];
			$id = $_POST['id'];
			$l = $_POST['l'];
			$isd = $_POST['isd'];
			$exd = $_POST['exd'];
			$tel = $_POST['tel'];
			$rfid = $_POST['rfid'];
			$co = $_POST['co'];
			$addr = $_POST['addr'];
			$r = $_POST['r'];
			$havePhoto = true;
			if(strcmp($_POST['P'],"no") == 0){
				$havePhoto = false;
			}else{
				$p = "0x".bin2hex(base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $_POST['P'])));
			}		
			
            switch($_POST['state']){
                case 1://new
					if($havePhoto){
						$subsql = "
							declare @purview    int
							exec @purview = dbo.p_user_have_purview $user_id, 1300, 'A'
							if @purview > 0
							begin
								   set @code = -1
								   insert into dbo.cfg_driver 
								   (job_number,driver_name,sex,customer_id,user_id,is_primary,password,phone,ident,rfid,license,issue_date,expire_date,company,address,remark,photo) 
								   values 
								   (?, ?, $sex, 0, $user_id, $ip, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, $p) 
								   set @code = 0
							end
							else
								set @code = -20";
						$params = array($jno, $name, $tel, $id, $rfid, $l, $isd, $exd, $co, $addr, $r);	
					}else{
						$subsql = "
							declare @purview    int
							exec @purview = dbo.p_user_have_purview $user_id, 1300, 'A'
							if @purview > 0
							begin
								   set @code = -1
								   insert into dbo.cfg_driver 
								   (job_number,driver_name,sex,customer_id,user_id,is_primary,password,phone,ident,rfid,license,issue_date,expire_date,company,address,remark) 
								   values 
								   (?, ?,$sex, 0, $user_id, $ip, '', ?, ?, ?, ?, ?, ?, ?, ?, ?) 
								   set @code = 0
							end
							else
								set @code = -20";
						$params = array($jno, $name, $tel, $id, $rfid, $l, $isd, $exd, $co, $addr, $r);	
					}	
					break;
				
				case 2://modify					
					if($havePhoto){
						$subsql = "
							declare @purview    int,
									@have       int
							exec @purview = dbo.p_user_have_purview $user_id, 1300, 'M'
							exec @have = dbo.p_user_have_driver $user_id, N'$jno'
							if @purview > 0 and @have > 0
							begin
								   set @code = -1
								   
								   declare @oldrfid varchar(40)
								   select @oldrfid = rfid from cfg_driver where job_number = N'$jno'
								   
								   if '$rfid' != @oldrfid
								   begin									   
										update dbo.dat_rfid_last
										set rfid = '$rfid'
										where rfid = @oldrfid
								   end
								   
								   update dbo.cfg_driver set driver_name = ?, sex = $sex, is_primary = $ip, 
								   phone = ?, ident = ?, rfid = ?, license = ?, issue_date = ?, expire_date = ?,
								   company = ?, address = ?, remark = ?, photo = $p where job_number = ?								   										
								   set @code = 0
							end
							else
								set @code = -20";
						$params = array($name, $tel, $id, $rfid, $l, $isd, $exd, $co, $addr, $r, $jno);		
					}else{
						$subsql = "
							declare @purview    int,
									@have       int
							exec @purview = dbo.p_user_have_purview $user_id, 1300, 'M'
							exec @have = dbo.p_user_have_driver $user_id, N'$jno'
							if @purview > 0 and @have > 0
							begin
								   set @code = -1 
								   
								   declare @oldrfid varchar(40)
								   select @oldrfid = rfid from cfg_driver where job_number = N'$jno'
								   
								   if '$rfid' != @oldrfid
								   begin									   
										update dbo.dat_rfid_last
										set rfid = '$rfid'
										where rfid = @oldrfid
								   end
								   
								   update dbo.cfg_driver set driver_name = ?, sex = $sex, is_primary = $ip, 
								   phone = ?, ident = ?, rfid = ?, license = ?, issue_date = ?, expire_date = ?,
								   company = ?, address = ?, remark = ? where job_number = ?
								   set @code = 0
							end
							else
								set @code = -20";
						$params = array($name, $tel, $id, $rfid, $l, $isd, $exd, $co, $addr, $r, $jno);	
					}					
					break;
				
				case 3://delete
					$subsql = "
						declare @purview    int,
								@have       int
						exec @purview = dbo.p_user_have_purview $user_id, 1300, 'D'
						exec @have = dbo.p_user_have_driver $user_id, '$jno'
						if @purview > 0 and @have > 0
						begin
							set @code = -1
							if exists(select object_id from cfg_object where driver_job_number = N'$jno')
							begin
								set @code = -2;
							end
							else
							begin
								delete from cfg_driver where job_number = ?
								set @code = 0
							end						   
						end
						else
							set @code = -20";
						$params = array($jno);	
				    break;
			}
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
			$data = $db->queryLastDS($sql, $params);
			$error_code = $data[0]['errcode'];
			
			if(!is_null($error_code) && $error_code == 0){
				echo "{'status':'ok'}";
			}else{
				echo "{'status':'fail','error':$error_code}";
			}	
		break;
		
    }
}
else
    echo 'no login';
?>

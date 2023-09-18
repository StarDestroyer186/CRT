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
        case 1: //user list
            if (isset($_POST['usrid'])) {
                //query one
				if (isset($_POST['view'])){
					$usrid = $user_id;
				}else{
					$usrid = (int)trim($_POST['usrid']);
				}
                
                $time_zone = (float)$_SESSION['timezone'];
                $sql = "select user_id usrid, user_name uname, login_name login, login_pass upass, isnull(email,'') email,
                    case when mail_offset is null then '12:00' else
                    convert(varchar(5), convert(time, dbo.fn_to_client_time( dateadd(mi, isnull(mail_offset,0), 0), $time_zone*60),20))
                    end rtime,
                    isnull(mail_report, 0) rmail, mail_type mtype, valid, user_phone uphone, limit_object olimit from sys_user
                    where user_id = $usrid";
                $ulist = $db->query($sql);
                $json = array2json($ulist);
                echo $json;
            }else {
                //query all
				$time_zone = (float)$_SESSION['timezone'];
				if (isset($_POST['full'])){
					$sql_list = "select u.user_id usrid, u.user_name uname, u.login_name login, convert(varchar(20),dbo.fn_to_client_time(u.expire_time, $time_zone*60), 20) etime, u.valid, 
				             u.user_phone p, u.limit_object l from cfg_user_purview p,sys_user u
							 where p.user_id = $user_id and p.purview_id = 3000 and u.user_id in (select user_id from dbo.fn_user_tree($user_id))
							 order by u.owner_id, u.user_name";
				}else{
					$sql_list = "select u.user_id usrid, u.user_name uname, u.login_name login from sys_user u
							 where u.user_id in (select user_id from dbo.fn_user_tree($user_id))
							 order by u.owner_id, u.user_name";
				}
                
                $ulist = $db->query($sql_list);
                $list = array2json($ulist);
				
				$sql_pur = "select purview_id pid, isnull(purview,'') p from cfg_user_purview where user_id = $user_id and (purview_id = 3200 or purview_id = 3400)";
				$upurview = $db->query($sql_pur);
				$purview = array2json($upurview);
                echo "{'self':$user_id, 'list':$list, 'pur': $purview}";
            }
            break;
        case 2: //object list
            if (isset($_POST['objid'])) {
                //query one
                $objid = (int)$_POST['objid'];
				$time_zone = (float)$_SESSION['timezone'];
                $sql = "select d.dtype_id dtype, d.device_no devno, d.device_state dstate, d.device_sim simno, d.device_pass dpass,
                dbo.fn_sec2time(60 * isnull(time_zone, datediff(minute, getutcdate(), getdate())), '-hm') ztime,
                convert(varchar(20), dbo.fn_to_client_time(d.install_time, $time_zone*60), 20) stamp, d.install_addr iaddr, convert(varchar(20), dbo.fn_to_client_time(d.last_stamp, $time_zone*60), 20) estamp,
                o.object_id objid, o.group_id ginfo, o.customer_id cinfo, o.object_flag oflag, o.driver_job_number jb,
                o.userdef_flag uflag, o.object_kind okind, o.remark remark, dbo.fn_group1user(o.group_id, $user_id) valid
                    from cfg_device d, cfg_object o, sys_device_type dt
                    where d.object_id = o.object_id and dt.dtype_id = d.dtype_id
                     and o.object_id = $objid";
                    $data = $db->query($sql);
                    $json = array2json($data);
                    echo $json;
            } else {
				$sql = "select customer_id id, short_name name from dbo.cfg_customer where customer_id in  
					   (select customer_id from dbo.cfg_object where group_id in ( select group_id from dbo.fn_group4user($user_id))) 
					   union 
					   select customer_id id, short_name name from dbo.cfg_customer where user_id = $user_id
					   union
					   select customer_id id, short_name name from dbo.cfg_customer where user_id in (select user_id from dbo.fn_user_tree($user_id)) 
					   order by name";
                $custs = $db->query($sql);
                
                $sql = "select dtype_id id, dtype_name name from sys_device_type order by dtype_name";
                $dtype = $db->query($sql);
				
				$sql = "select job_number jb, driver_name jn from dbo.cfg_driver d where d.job_number in
						(select driver_job_number from dbo.cfg_object where group_id in ( select group_id from dbo.fn_group4user($user_id))) 
						union 
						select job_number jb, driver_name jn from dbo.cfg_driver d where d.user_id = $user_id
						union 
						select job_number jb, driver_name jn from dbo.cfg_driver d where d.user_id in (select user_id from dbo.fn_user_tree($user_id))
						order by driver_name";
                $drivers = $db->query($sql);
				
                $sql = "select b.group_id id,
						case when cc>1 then '['+ ltrim(str(b.group_id)) +'] ' +b.group_name else b.group_name end name, b.group_parent parent from (
						select group_name, count(*) cc from cfg_group
						where group_id in (
							select group_id from dbo.fn_group4user($user_id)
						)
						group by group_name
					) a,(
						select group_id,group_name,group_parent from cfg_group g1
						where g1.group_id in (
							select group_id from dbo.fn_group4user($user_id)
						)
					) b
					where a.group_name = b.group_name
					order by b.group_name, b.group_id";
                $group = $db->query($sql);
                
                $lang = $_SESSION['lang'];
				$time_zone = (float)$_SESSION['timezone'];
                $sql = "select kind_id id, dbo.fn_trans_entry(upper('$lang'), kind_name) name from sys_object_kind order by kind_id";
                $okind = $db->query($sql);
				
				$sql_pur = "select purview_id pid, isnull(purview,'') p from cfg_user_purview where user_id = $user_id and purview_id = 1090";
				$upurview = $db->query($sql_pur);
				
                //query all
                $sql = "select o.object_id objid, o.object_flag oflag, o.driver_job_number jb, d.dtype_id dtype, d.device_state dstate, o.group_id ginfo,d.device_no devno,d.device_sim p,
                    dbo.fn_sec2time(60 * isnull(o.time_zone, datediff(minute, getutcdate(), getdate())), '-hm') ztime,
                    convert(varchar(20), dbo.fn_to_client_time(d.install_time, $time_zone*60), 20) stamp, convert(varchar(20), dbo.fn_to_client_time(d.last_stamp, $time_zone*60), 20) estamp
                from cfg_user_purview p,cfg_device d, cfg_object o, cfg_group g
                where p.user_id = $user_id and p.purview_id = 1000 and d.object_id = o.object_id and o.group_id = g.group_id
                    and o.group_id in (select * from dbo.fn_group4user($user_id))
                order by g.group_name, o.object_flag";
                $olist = $db->query($sql);
                $jc = array2json($custs);
                $jt = array2json($dtype);
                $jg = array2json($group);
                $jk = array2json($okind);
                $jo = array2json($olist);
				$pr = array2json($upurview);
				$dlist = array2json($drivers);
                $json = "{'cust': $jc, 'type': $jt, 'group': $jg, 'kind': $jk, 'list': $jo, 'pur': $pr, 'dlist': $dlist}";
                echo $json;
            }
            break;
        case 3: 
            $uname_ = $_POST['uname'];
            $login_ = $_POST['login'];
            $upass_ = $_POST['upass'];
            $email_ = $_POST['email'];
            $rtime_ = $_POST['rtime'] == "" ? "12:00" : $_POST['rtime'];
            $rmail_ = $_POST['rmail'];
			$mtype_ = $_POST['mtype'];
            $valid_ = $_POST['valid'];
            $group_ = $_POST['group'] == "" ? "0" : $_POST['group'];//1,2,3,4,5
            $time_zone_ = (float)$_SESSION['timezone'];
			$uphone_ = $_POST['uphone'];
			$olimit_ = $_POST['olimit'];
			$self_ = $_POST['self'];
			
			$idLat_ = (double)$_SESSION['lat'] * 1000000;
			$idLng_ = (double)$_SESSION['lng'] * 1000000;
			$idZoom_ = (int)$_SESSION['zoom'];
			$idDate_ = $_SESSION['date_fmt_js'];
			$idTime_ = $_SESSION['time_fmt_js'];
			$idSound_ = $_SESSION['sond_alarm'];
			$idPopup_ = $_SESSION['popup_alarm'];
			$idAssetInfos_ = $_SESSION['assetInfos'];
			
			$unitSpeed_ = $_SESSION['unit_speed'];
			$unitDist_ = $_SESSION['unit_distance'];
			$unitFuel_ = $_SESSION['unit_fuel'];
			$unitTemp_ = $_SESSION['unit_temperature'];
			
            //1.add or update or delete user
			
            switch($_POST['state']){
                case 1://new
                    $subsql = "										
					declare @purview    int
					exec @purview = dbo.p_user_have_purview $user_id, 3200, 'A'					
					if @purview > 0 
					begin
						set @code = -1
						declare @remain int 
						
						if $user_id <> 1
							select @remain = (limit_object - $olimit_) from sys_user where user_id = $user_id;
						else
							set @remain = 0
						if @remain >= 0 and $olimit_ >=0
						begin
							declare @user int
							set @code = -2
							insert into sys_user (user_name, login_name, login_pass, email, mail_offset, mail_report, mail_type, valid, owner_id, user_phone, limit_object)
								values (?, ?, ?, ?,
									datediff(mi, 0, convert(time, dbo.fn_to_server_time(convert(time, ?, 20), $time_zone_ * 60), 20)),
									?, ?, ?, ?, ?, ?)
							set @code = -3
							set @user = scope_identity()
							
							delete cfg_user_group where user_id = @user
							insert into cfg_user_group
							select @user, group_id from cfg_group where group_id in ($group_)
							set @uid = @user
							set @code = -4
							
							delete web_default where user_id = @user 
							insert into dbo.web_default (user_id, def_lat, def_lng, def_zoom, def_asset_infos, def_date_fmt, def_time_fmt, def_sound_alarm, def_popup_alarm, unit_distance, unit_fuel, unit_temperature, unit_speed, def_page, def_show, show_zone, show_marker) 
							values (@user, $idLat_, $idLng_, $idZoom_, '$idAssetInfos_', '$idDate_', '$idTime_', $idSound_, $idPopup_, $unitDist_, $unitFuel_, $unitTemp_, $unitSpeed_, 1, 1, 1, 1)
							set @code = -5
							
							if $user_id <> 1
								update sys_user set limit_object = @remain where user_id = $user_id
							set @code = 0
						end
						else
							set @code = -6
					end
					else
						set @code = -20";
					$params = array($uname_, $login_, $upass_, $email_, $rtime_, $rmail_, $mtype_, $valid_, $user_id, $uphone_, $olimit_);
                    break;
                case 2://modify
                    $usrid_ = (int)$_POST['usrid'];
					$subsql = null;
					if($user_id != $usrid_){
						//modify sub user
						$subsql = "													
							declare @purview    int,
							        @have       int
							exec @purview = dbo.p_user_have_purview $user_id, 3200, 'M'
							exec @have = dbo.p_user_have_subuser $user_id, $usrid_
							if @purview > 0 and @have > 0
							begin
								set @code = -1						
								declare @remain     int,
										@total      int,
										@dist       int
								
								if $user_id <> 1
								begin
									select @total = limit_object from sys_user where user_id = $usrid_;
									set @dist = $olimit_ - @total;
									select @remain = (limit_object - @dist) from sys_user where user_id = $user_id;
								end
								else
									set @remain = 0
								if @remain >= 0 and $olimit_ >=0
								begin
									set @code = -2
									update sys_user set user_name = ?, login_name = ?, login_pass = ?, email = ?,
										mail_offset = datediff(mi, 0, convert(time, dbo.fn_to_server_time(convert(time, ?, 20), $time_zone_ * 60), 20)), mail_report = ?, mail_type = ?, valid = ?, user_phone = ?, limit_object = ? 
									where user_id = $usrid_
									delete cfg_user_group where user_id = $usrid_ and group_id in (
										select group_id from dbo.fn_group4user($user_id)
									)
									set @code = -3
									insert into cfg_user_group
									select $usrid_, group_id from cfg_group where group_id in ($group_)
									set @code = -4
									
									if $user_id <> 1
										update sys_user set limit_object = @remain where user_id = $user_id
									set @code = 0
								end
								else
									set @code = -5
							end
							else
								set @code = -20
							";
						$params = array($uname_, $login_, $upass_, $email_, $rtime_, $rmail_, $mtype_, $valid_, $uphone_, $olimit_);		
					}else{
						//modify self
						$subsql = "														
							declare @purview    int
							exec @purview = dbo.p_user_have_purview $user_id, 3200, 'M'
							if @purview > 0
							begin
								set @code = -2
								update sys_user set user_name = ?, login_name = ?, login_pass = ?, email = ?,
								mail_offset = datediff(mi, 0, convert(time, dbo.fn_to_server_time(convert(time, ?, 20), $time_zone_ * 60), 20)), mail_report = ?, mail_type = ?, user_phone = ? 
								where user_id = ?
								set @code = 0
							end
							else
								set @code = -20
							";
						$params = array($uname_, $login_, $upass_, $email_, $rtime_, $rmail_, $mtype_, $uphone_, $usrid_);
					}
                    
                    break;
					
				case 3://delete
					$usrid = (int)$_POST['usrid'];
					$subsql = "
						declare @purview    int,
						        @have       int
						exec @purview = dbo.p_user_have_purview $user_id, 3200, 'D'
						exec @have = dbo.p_user_have_subuser $user_id, $usrid
						if @purview > 0 and @have > 0
						begin
							exec @code = p_delete_user ?
						end
						else
							set @code = -20";
					$params = array($usrid);
				    break;
            }
            //2.update user group
            $sql = "declare @code int, 
							@uid  int
					begin try
						begin tran
						$subsql
						commit tran
					end try
					begin catch
						rollback tran
					end catch

					select @code as errcode, @uid as uid";
	
            $data = $db->queryLastDS($sql, $params);
            $error_code = $data[0]['errcode'];
			$uid = $data[0]['uid'];
           
			if($error_code == 0){
				if($_POST['state'] == 2 and $self_ != 0){
					$_SESSION['pass'] = $upass_;
					$_SESSION['uname'] = $uname_;
					$_SESSION['email'] = $email_;
					$_SESSION['rtime'] = $rtime_;
					$_SESSION['rmail'] = $rmail_;
					$_SESSION['mtype'] = $mtype_;
				}
				
				if($_POST['state'] == 1){
					echo "{'status':'ok','uid':$uid}";
				}else{
					echo "{'status':'ok'}";
				}                
            }else{
                echo "{'status':'fail','error':$error_code}";
            }
            break;
        case 4:
            $dtype = (int)$_POST['dtype'];
			$dstate = (int)$_POST['dstate'];
            $devno = $_POST['devno'];
            $simno = $_POST['simno'];
            $dpass = $_POST['dpass'];
            $zstrs = $_POST['ztime'];
            $regex = '/^(\+|\-)(\d{2})\:(\d{2})$/';
            $matches = array();
            $ztime = 'null';
            if(preg_match($regex, $zstrs, $matches)){
                if(count($matches) == 4){
                    $ztime = (int)$matches[2] * 60 + (int)$matches[3];
                    if($matches[1] == "-"){
                        $ztime = -$ztime;
                    }
                }
            }
            $iaddr = $_POST['iaddr'];
            $okind = (int)$_POST['okind'];
            $cinfo = (int)$_POST['cinfo'];
            $ginfo = (int)$_POST['ginfo'];
            $oflag = $_POST['oflag'];
            $uflag = $_POST['uflag'];
            $remark = $_POST['remark'];
			$jb = $_POST['driver'];
			
            switch($_POST['state']){
                case 1://new
					$time_zone_ = (float)$_SESSION['timezone'];
					$stamp = $_POST['stamp'] == "-1" ? date('Y-m-d H:i:s',time()) : toServerTime(strtotime($_POST['stamp']), $time_zone_);
					$estamp = $_POST['estamp'] == "-1" ? date('Y-m-d 00:00:00', strtotime("+1 year")) : toServerTime(strtotime($_POST['estamp']), $time_zone_);
					$nextyear = date('Y-m-d 00:00:00', strtotime("+1 year"));
					
                    $subsql = "
					declare @purview    int,
					        @expired    int
					exec @purview = dbo.p_user_have_purview $user_id, 1090, 'A'
					exec @expired = dbo.p_user_have_purview $user_id, 1090, 'E'
					if @purview > 0
					begin
						set @code = -1	
						declare @olimit int
								
						select @olimit = limit_object from sys_user where user_id = $user_id;
						if @olimit > 0 or $user_id = 1
						begin
							if @expired > 0
								begin
									insert into cfg_device (object_id, dtype_id, device_state, device_no, device_sim, device_pass, install_time, install_addr, last_stamp)
									values (0, $dtype, $dstate, ?, ?, ?, ?, ?, ?)
								end
							else
								begin
									insert into cfg_device (object_id, dtype_id, device_state, device_no, device_sim, device_pass, install_time, install_addr, last_stamp)
									values (0, $dtype, $dstate, ?, ?, ?, ?, ?, dateadd(year, 1, getdate()) )
								end
							 						
							set @code = -2
							insert into cfg_object (customer_id, group_id, object_kind, object_flag, userdef_flag, time_zone, driver_job_number, remark)
							values ($cinfo, $ginfo, $okind, ?, ?, $ztime, ?, ?)
							set @objid = @@identity
							set @code = -3
							update cfg_device set object_id = o.object_id from cfg_object o
							where device_no = ? and o.object_flag = ?
							if $user_id <> 1
								update sys_user set limit_object = (@olimit -1) where user_id = $user_id;
							set @code = -4
							
							if ? = '-1'
							    delete from dat_rfid_last where device_no = ?
							else
								begin
									if not exists(select * from dbo.dat_rfid_last where device_no = ?)
									begin
										insert into dbo.dat_rfid_last
											(device_no, rfid)
										values
											(?, (select rfid from cfg_driver where job_number = ?))
									end
									else
										update dbo.dat_rfid_last
										set rfid = (select rfid from cfg_driver where job_number = ?)
										where device_no = ?
								end
							set @code = 0
						end
						else
							set @code = -5
                    end
					else
						set @code = -20";
					$params = array($devno, $simno, $dpass, $stamp, $iaddr, $estamp, $devno, $simno, $dpass, $stamp, $iaddr, $oflag, $uflag, $jb, $remark, $devno, $oflag, $jb, $devno, $devno, $devno, $jb, $jb, $devno);
                    break;
                case 2://modify
                    $objid = (int)$_POST['objid'];
					$time_zone_ = (float)$_SESSION['timezone'];
					$stamp =  toServerTime(strtotime($_POST['stamp']), $time_zone_);
					$estamp = toServerTime(strtotime($_POST['estamp']), $time_zone_);
					
                    $subsql = "
					declare @purview    int,
					        @have       int,
							@expired    int
					exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'
					exec @have = dbo.p_user_have_object $user_id, $objid
					exec @expired = dbo.p_user_have_purview $user_id, 1090, 'E'
					
					if @purview > 0 and @have > 0 and @expired > 0
					begin
						set @code = -1
						set @objid = $objid                    
						update cfg_device set device_no = ?, dtype_id = $dtype, device_state = $dstate, device_sim = ?, device_pass = ?, install_addr = ?, install_time = '$stamp', last_stamp ='$estamp'
						where object_id = $objid
						set @code = -2
						update cfg_object set customer_id = $cinfo, group_id = $ginfo, object_kind = $okind, object_flag = ?, userdef_flag = ?,  time_zone = $ztime, driver_job_number = ?, remark = ?
						where object_id = $objid						
						
						if ? = '-1'
							delete from dat_rfid_last where device_no = ?
						else
							begin
								if not exists(select * from dbo.dat_rfid_last where device_no = ?)
								begin
									insert into dbo.dat_rfid_last
										(device_no, rfid)
									values
										(?, (select rfid from cfg_driver where job_number = ?))
								end
								else
									update dbo.dat_rfid_last
									set rfid = (select rfid from cfg_driver where job_number = ?)
									where device_no = ?
							end
							
						set @code = 0
                    end
					else
						if @purview > 0 and @have > 0 and @expired = 0
						begin
							set @code = -1
							set @objid = $objid                    
					        update cfg_device set device_no = ?, dtype_id = $dtype, device_state = $dstate, device_sim = ?, device_pass = ?, install_addr = ? 
							where object_id = $objid
							set @code = -2							
							update cfg_object set customer_id = $cinfo, group_id = $ginfo, object_kind = $okind, object_flag = ?, userdef_flag = ?,  time_zone = $ztime, driver_job_number = ?, remark = ?
							where object_id = $objid
							
							if ? = '-1'
								delete from dat_rfid_last where device_no = ?
							else
							begin
								if not exists(select * from dbo.dat_rfid_last where device_no = ?)
								begin
									insert into dbo.dat_rfid_last
										(device_no, rfid)
									values
										(?, (select rfid from cfg_driver where job_number = ?))
								end
								else
									update dbo.dat_rfid_last
									set rfid = (select rfid from cfg_driver where job_number = ?)
									where device_no = ?
							end	
							
							set @code = 0
						end
						else
							set @code = -20";
					$params = array($devno, $simno, $dpass, $iaddr, $oflag, $uflag, $jb, $remark, $jb, $devno, $devno, $devno, $jb, $jb, $devno, $devno, $simno, $dpass, $iaddr, $oflag, $uflag, $jb, $remark, $jb, $devno, $devno, $devno, $jb, $jb, $devno);
                    break;
            }
            $sql = "declare @code int, @objid int
					begin try
						begin tran
						$subsql
						commit tran   
					end try
					begin catch
						rollback tran
					end catch

					select @code as errcode, @objid as objectid";
            $data = $db->queryLastDS($sql, $params);
            $error_code = $data[0]['errcode'];
            $object_id = $data[0]['objectid'];
			
            if(!is_null($error_code) && $error_code == 0){
                $sql = "declare @gid int
                    select @gid = group_id from cfg_object where object_flag = ?
                    select user_id from dbo.fn_user4group(@gid)";
				$params = array($oflag);	
                $data = $db->query($sql, $params);
                
				if(!empty($data)){
                    $memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
                    $online = memcache_get($memcache, $GLOBAL_USER);
                    if($online){
						$online['last_stamp'] = time() - 6;
                        foreach ($data as $row){
							if($online['list'][$row['user_id']]){
								//$online['list'][$row['user_id']]['need_update'] = true;
								array_push($online['list'][$row['user_id']]['need_update'],$object_id);
							}
                        }
                        memcache_set($memcache, $GLOBAL_USER, $online, MEMCACHE_COMPRESSED, 0);
                    }
                    memcache_close($memcache);
                }
				$e_stamp = toCustomTime(new DateTime($stamp), $time_zone_, null);
				$e_estamp = toCustomTime(new DateTime($estamp), $time_zone_, null);
                echo "{'status':'ok', 'objid': $object_id, 'stamp': '$e_stamp', 'estamp': '$e_estamp'}";
            }else{
                if(is_null($error_code)){
                    $error_code = -100;
                }
                echo "{'status':'fail','error':$error_code}";
            }
            break;
			
		case 5:// delete object
			$objid = (int)$_POST['objid'];
			$subsql = "
				declare @purview    int,
				        @have       int
				exec @purview = dbo.p_user_have_purview $user_id, 1090, 'D'
				exec @have = dbo.p_user_have_object $user_id, $objid
				if @purview > 0 and @have > 0
				begin
					set @code = -1
					set @objid = $objid
					declare @device_no nvarchar(20)	
					select @gid = group_id from cfg_object where object_id = $objid
					select @device_no = device_no from cfg_device where object_id = $objid;					
					delete from cfg_object where object_id = $objid;
					set @code = -2
					delete from cfg_device where device_no = @device_no;
					set @code = -3
					delete from cfg_services where object_id = $objid;
					set @code = -4
					delete from cfg_tasks where object_id = $objid;	
					set @code = -5
					delete from cfg_device_state where device_no = @device_no; 
					set @code = -6

					declare @track_name	   nvarchar(50)
					set	@track_name	= dbo.fn_track4device_no(@device_no)
					
					if exists (select * from sysobjects where id = object_id(@track_name) and OBJECTPROPERTY(ID, N'ISUSERTABLE') = 1) 
					begin
						declare	@strtemp varchar(1024)
						set	@strtemp = 'drop table ' + @track_name
						exec(@strtemp)
					end
					
					set @code = 0
				
				end
				else
					set @code = -20
			";
			$sql = "declare @code int, @objid int, @gid int
					begin try
						begin tran
						$subsql
						commit tran   
					end try
					begin catch
						rollback tran
					end catch

                select @code as errcode, @objid as objectid, @gid as groupid";
            $data = $db->queryLastDS($sql);
            $error_code = $data[0]['errcode'];
			$object_id = $data[0]['objectid'];
			$gid = $data[0]['groupid'];			
			if(!is_null($error_code) && $error_code == 0 && !is_null($gid)){
				$sql = "select user_id from dbo.fn_user4group($gid)";
			
                $data = $db->query($sql);
				if(!empty($data)){
                    $memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
                    $online = memcache_get($memcache, $GLOBAL_USER);
                    if($online){
						$online['last_stamp'] = time() - 6;
                        foreach ($data as $row){
							if($online['list'][$row['user_id']]){
								array_push($online['list'][$row['user_id']]['need_deleteo'],$object_id);
							}
                        }
                        memcache_set($memcache, $GLOBAL_USER, $online, MEMCACHE_COMPRESSED, 0);
                    }
                    memcache_close($memcache);
                }
                echo "{'status':'ok', 'objid': $object_id}";
            }else{
                if(is_null($error_code)){
                    $error_code = -100;
                }
                echo "{'status':'fail','error':$error_code}";
            }
			break;
			
		case 6: //place list
			 $unit_speed = $_SESSION['unit_speed'];
			 if (isset($_POST['zid'])) {
				$zid = (int)$_POST['zid'];
                //query one place
				$sql = "select area_name an, area_type at, area_pts ap, aera_color ac, aera_zoom zoom, isnull(enable_speed_limit, 0) es, isnull(inside_speed_limit, '') ins
					    from cfg_place where place_id = $zid";
				$geolist = $db->query($sql);
				
				if (!empty($geolist)) {
					foreach ($geolist as $row) {
						//speed unit
						if(/*$unit_speed == 1 && */strlen($row['ins']) > 0 && $row['ins'] >= 0){
							//mph(英里/小时)
							$row['ins'] = round(speedUnitConversion($row['ins']),0);
						}
						$output[] = $row;
					}
				}
				$json = array2json($output);
				echo $json;
			}else{
				//query place list
				if (isset($_POST['full'])){
					$sql = "select place_id zid, area_name an, area_type at, area_pts ap, aera_color ac, aera_zoom zoom
							from /*cfg_user_purview p,*/ cfg_place pl where /*p.user_id = $user_id and p.purview_id = 1000 and*/ pl.place_id in (select place_id from dbo.fn_place4user($user_id))
							order by an";
				}else{					
					$sql = "select place_id zid, area_name an, area_type at 
							from cfg_user_purview p, cfg_place pl where p.user_id = $user_id and p.purview_id = 1000 and pl.place_id in (select place_id from dbo.fn_place4user($user_id))
							order by an";
				}
				$geolist = $db->query($sql);
				
				$sql_pur = "select purview_id pid, isnull(purview,'') p from cfg_user_purview where user_id = $user_id and purview_id = 1700";
				$upurview = $db->query($sql_pur);
								
				$json = array2json($geolist);
				$pr = array2json($upurview);
				echo "{'self':$user_id, 'list':$json, 'pur': $pr}";
			}
			break;
			
		case 7:	
			$unit_speed = $_SESSION['unit_speed'];
            switch($_POST['state']){
                case 1://new
					$aname = $_POST['aname'];
					$acolor = $_POST['acolor'];
					$atype = $_POST['atype'];
					$apts = $_POST['apts'];
					$zoom = (int)$_POST['zoom'];
					$es = (int)$_POST['es'];
					$ins = (int)$_POST['ins'];
					//speed unit
					if($unit_speed == 1 && $row['ins'] >= 0){
						//速度转为km/h
						$ins = round($ins * 1.609344,0);
					}
					
					$subsql = "declare @purview    int
							   exec @purview = dbo.p_user_have_purview $user_id, 1700, 'A'							   
							   if @purview > 0
							   begin
								 set @code = -1
							     declare @total int
							     select @total = count(*) from cfg_place where user_id = $user_id;
							   
							     if @total <= 2000
							     begin
								   insert into cfg_place (USER_ID, area_name, area_type, area_pts, aera_color, aera_zoom, enable_speed_limit, inside_speed_limit) values 
								   ($user_id, ?, $atype, ?, ?, $zoom, $es, $ins); 
								   set @max_id = @@identity; 
								   set @code = 0
							     end else
							     begin
								   set @code = -2
							     end
							   end
							   else
								 set @code = -20";	
					$params = array($aname, $apts, $acolor);
					break;
				
				case 2://modify
					$zid = (int)$_POST['zid'];
					$aname = $_POST['aname'];
					$acolor = $_POST['acolor'];
					$atype = (int)$_POST['atype'];
					$apts = $_POST['apts'];
					$zoom = (int)$_POST['zoom'];
					$es = (int)$_POST['es'];
					$ins = (int)$_POST['ins'];
					//speed unit
					if($unit_speed == 1 && $row['ins'] >= 0){
						//速度转为km/h
						$ins = round($ins * 1.609344,0);
					}
					
					$subsql = "declare @purview    int,
									   @have       int
							   exec @purview = dbo.p_user_have_purview $user_id, 1700, 'M'
							   exec @have = dbo.p_user_have_place $user_id, $zid
							   if @purview > 0 and @have > 0
							   begin
								 set @code = -1 
								 update cfg_place set area_name = ?, area_type = $atype, area_pts = ?, aera_color = ?, aera_zoom = $zoom, enable_speed_limit = $es, inside_speed_limit = $ins where place_id = $zid 
								 set @code = 0
							   end
							   else
								   set @code = -20";
					$params = array($aname, $apts, $acolor);
					break;
				
				case 4://delete
					$zid = (int)$_POST['zid'];
					
					$subsql = "declare @purview    int,
									   @have       int
							   exec @purview = dbo.p_user_have_purview $user_id, 1700, 'D'
							   exec @have = dbo.p_user_have_place $user_id, $zid
							   if @purview > 0 and @have > 0
							   begin
								  set @code = -1 
								  if exists(select place_id from dbo.cfg_place where place_id = $zid and user_id =  $user_id)
								  begin
							          delete from cfg_place where place_id = ? 
									  set @code = 0
								  end
								  else
								      set @code = -20
							   end
							   else
								   set @code = -20";
					$params = array($zid);
				    break;
			}
			
			$sql = "declare @code int, @max_id int
					begin try
						begin tran
						$subsql
						commit tran   
					end try
					begin catch
						rollback tran
					end catch

					select @code as errcode, @max_id as zid";
            $data = $db->queryLastDS($sql, $params);
            $error_code = $data[0]['errcode'];
            
            if(!is_null($error_code) && $error_code == 0){
				if($_POST['state'] == 1){
					$newzid = $data[0]['zid'];
					echo "{'status':'ok', 'newzid': $newzid}";
				}else{
					echo "{'status':'ok'}";
				}
            }else{
                if(is_null($error_code)){
                    $error_code = -100;
                }
                echo "{'status':'fail','error':$error_code}";
            }
		break;
		
		case 8:// delete group
			$gid = (int)$_POST['gid'];
			$sql = "
				declare @purview    int,
				        @have       int,
						@code int
				exec @purview = dbo.p_user_have_purview $user_id, 3400, 'S'
				exec @have = dbo.p_user_have_group $user_id, $gid
				if @purview > 0 and @have > 0
				begin
					exec @code = p_delete_group $gid
					select @code as errcode
				end";
			$data = $db->query($sql);
            $error_code = $data[0]['CODE'];
			
			if(!is_null($data) && !isset($error_code)){
				$json = array2json($data);
				
				/*foreach ($data as $row) {
					$sql = "select user_id from dbo.fn_user4group($row)";
			
					$datag = $db->query($sql);
					if(!empty($datag)){
						$memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
						$online = memcache_get($memcache, $GLOBAL_USER);
						if($online){
							$online['last_stamp'] = time() - 6;
							foreach ($datag as $rowg){
								if($online['list'][$rowg['user_id']]){
									array_push($online['list'][$rowg['user_id']]['need_deleteg'],$row);
								}
							}
							memcache_set($memcache, $GLOBAL_USER, $online, MEMCACHE_COMPRESSED, 0);
						}
						memcache_close($memcache);
					}					
				}*/							
					
                echo "{'status':'ok' , 'gids' : $json}";
            }else{
				echo "{'status':'fail','error': $error_code}";
			}
		break;
		
		case 9://query customer
			if (isset($_POST['custid'])) {
				$custjid = (int)$_POST['custid'];
                //query one customer
				$sql = "select customer_id id,short_name name,full_name fname,phone p,remark r 
					    from cfg_customer where customer_id = $custjid";
				$custlist = $db->query($sql);
				$json = array2json($custlist);
				echo $json;
			}else{
				//query customer list
				$sql = "select customer_id id,short_name name,full_name fname,phone p,remark r from cfg_user_purview p,dbo.cfg_customer where 
						p.user_id = $user_id and p.purview_id = 1000 and customer_id in  
					   (select customer_id from dbo.cfg_object where group_id in ( select group_id from dbo.fn_group4user($user_id))) 
					   union 
					   select customer_id id,short_name name,full_name fname,phone p,remark r from cfg_user_purview p, dbo.cfg_customer c where p.user_id = $user_id and p.purview_id = 1000 and c.user_id = $user_id
					   union 
					   select customer_id id,short_name name,full_name fname,phone p,remark r from cfg_user_purview p, dbo.cfg_customer c where p.user_id = $user_id and p.purview_id = 1000 and c.user_id in (select user_id from dbo.fn_user_tree($user_id)) 
					   order by name";	
				$custlist = $db->query($sql);
				
				$sql_pur = "select purview_id pid, isnull(purview,'') p from cfg_user_purview where user_id = $user_id and purview_id = 2100";
				$upurview = $db->query($sql_pur);
				
				$list = array2json($custlist);
				$pr = array2json($upurview);
				$json = "{'list': $list, 'pur': $pr}";
				echo $json;
			}	
		break;
		
		case 10:
			$custid = (int)$_POST['custid'];
		    $name = $_POST['name'];
			$fname = $_POST['fname'];
			$phone = $_POST['phone'];
			$remark = $_POST['remark'];
            
            switch($_POST['state']){
                case 1://new
					$subsql = "
							declare @purview    int
							exec @purview = dbo.p_user_have_purview $user_id, 2100, 'A'
							if @purview > 0
							begin
								set @code = -1
								insert into cfg_customer (short_name, full_name, phone, remark, user_id)
									values (?, ?, ?, ?, $user_id)
								set @cuid = @@identity; 
								set @code = 0
							end
							else
								set @code = -20";	
					$params = array($name, $fname, $phone, $remark);
					break;
				
				case 2://modify
					$subsql = "
							declare @purview    int,
							        @have       int
							exec @purview = dbo.p_user_have_purview $user_id, 2100, 'M'
							exec @have = dbo.p_user_have_customer $user_id, $custid
							if @purview > 0 and @have > 0
							begin
								set @code = -1
								update cfg_customer set short_name = ?, full_name = ?, phone = ?, remark = ? where customer_id = $custid
								set @code = 0
							end
							else
								set @code = -20							
							";
					$params = array($name, $fname, $phone, $remark);
					break;
				
				case 3://delete
					$subsql = "
						declare @purview    int,
								@have       int
						exec @purview = dbo.p_user_have_purview $user_id, 2100, 'D'
						exec @have = dbo.p_user_have_customer $user_id, $custid
						if @purview > 0 and @have > 0
						begin
							set @code = -1 
							if exists(select object_id from cfg_object where customer_id = $custid)
							begin
								set @code = -2;
							end
							else
							begin
								delete from cfg_customer where customer_id = ? 
								set @code = 0
							end
						end
						else
							set @code = -20";	
					$params = array($custid);
				    break;
			}
			$sql = "declare @code int,
			                @cuid int
					begin try
						begin tran
						$subsql
						commit tran   
					end try
					begin catch
						rollback tran
					end catch

					select @code as errcode, @cuid as cuid";
			$data = $db->queryLastDS($sql, $params);
			$error_code = $data[0]['errcode'];
			$cuid = $data[0]['cuid'];
			
			if(!is_null($error_code) && $error_code == 0){
				if($_POST['state'] == 1){
					echo "{'status':'ok', 'cuid': $cuid}";
				}else{
					echo "{'status':'ok'}";
				}				
			}else{
				echo "{'status':'fail','error':$error_code}";
			}	
		break;
		
		case 15://query one event
			$eventid = (int)$_POST['eid'];
			
			$sql = "select event_id eid, object_id oid, event_enable ee, event_name en, event_type et, depending_on_place dop, places ps, time_period tp, speed_limit sl,
					distance di, expression ex, time_duration_enable tde, time_duration td, week_days wd, day_time_enable dte, day_time dt, isnull(push_notification, 0) pne, notification_email_enable nme, 
					notification_email nm, notification_sms_enable nse,notification_sms ns, notification_telegram_enable nte, notification_telegram nt, arrow_enable are, 
					arrow ar, color_enable coe, color co, webhook_enable we, webhook_url wu, command_enable ce, command_id cid, gate_way gw, code_type ct, command_content cc 
					from cfg_event where event_id = $eventid";
			$eventlist = $db->query($sql);
			$json = array2json($eventlist);
			echo $json;
	
		break;
		
		case 16: //save event
			 $eid = (int)$_POST['eid'];
			 $objid = (int)$_POST['objid'];
			 $ea = $_POST['ea'];
			 $en = str_replace("'", "''", substr($_POST['en'], 0, 50));
			 $et = $_POST['et'];
			 $dop = $_POST['dop'];
			 $ps = $_POST['ps'];
			 $tp = substr($_POST['tp'], 0, 16); 
			 $sl = substr($_POST['sl'], 0, 16); 
			 $di = substr($_POST['di'], 0, 16); 
			 $ex = substr($_POST['ex'], 0, 256);
			 $tde = $_POST['tde'];
			 $td = $_POST['td'];
			 $wd = $_POST['wd'];
			 $dte = $_POST['dte'];
			 $dt = (!empty($_POST['dt']) && number_format($_POST['dt']) > 10) ? "10" : $_POST['dt'];
			 $pne = $_POST['pne'];
			 $nme = $_POST['nme'];
			 $nm = substr($_POST['nm'], 0, 256);
			 $nse = (int)$_POST['nse'];
			 $ns = substr($_POST['ns'], 0, 256);
			 $nte = (int)$_POST['nte'];
			 $nt = substr($_POST['nt'], 0, 256);
			 $are = (int)$_POST['are'];
			 $ar = $_POST['ar'];
			 $coe = (int)$_POST['coe'];
			 $co = $_POST['co'];
			 $ce = (int)$_POST['ce'];
			 $cid = $_POST['cid'] == '-1' ? null:$_POST['cid'];
			 $gw = (int)$_POST['gw'];
			 $ct = (int)$_POST['ct'];
			 $cc = substr($_POST['cc'], 0, 256);
			 
			 switch($_POST['state']){
                case 1://new
					$subsql = "
							declare @purview    int,
									@have       int
							exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'
							exec @have = dbo.p_user_have_object $user_id, $objid
							if @purview > 0 and @have > 0
							begin
								set @code = -1
								insert into dbo.cfg_event (object_id, user_id, event_enable, event_name, event_type, depending_on_place,places,time_period,speed_limit,distance,
								expression, time_duration_enable, time_duration, week_days, day_time_enable, day_time, push_notification, notification_email_enable, notification_email,
								notification_sms_enable, notification_sms, notification_telegram_enable, notification_telegram, arrow_enable, arrow, color_enable,
								color, command_enable, command_id, gate_way, code_type, command_content)
								values ($objid, $user_id, $ea, ?, ?, $dop, ?, ?, ?, ?, ?, $tde, ?, ?, $dte, ?, $pne, $nme,  ?, $nse, ?,
								$nte, ?, $are, ?, $coe, ?, $ce, ?, $gw, $ct, ?)
								set @eid = @@identity; 
								set @code = 0
							end
							else
								set @code = -20";
					$params = array($en, $et, $ps, $tp, $sl, $di, $ex, $td, $wd, $dt, $nm, $ns, $nt, $ar, $co, $cid, $cc);			
					break;
					
				case 2://modify
					$subsql = "
							declare @purview    int,
							        @have       int
							exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'
							exec @have = dbo.p_user_have_object $user_id, $objid
							if @purview > 0 and @have > 0
							begin
								set @code = -1
								update dbo.cfg_event set event_enable = $ea, event_name = ?, event_type = ?, depending_on_place = $dop, places = ?,
								time_period = ?, speed_limit = ?, distance = ?, expression = ?, time_duration_enable = $tde,
								time_duration = ?, week_days = ?, day_time_enable = $dte, day_time = ?, push_notification = $pne, notification_email_enable = $nme,
								notification_email = ?, notification_sms_enable = $nse, notification_sms = ?, notification_telegram_enable = $nte,
								notification_telegram = ?, arrow_enable = $are, arrow = ?, color_enable = $coe, color = ?, command_enable = $ce,
								command_id = ?, gate_way = $gw, code_type = $ct, command_content = ?
								where event_id = $eid
								set @code = 0
							end
							else
								set @code = -20							
							";
					$params = array($en, $et, $ps, $tp, $sl, $di, $ex, $td, $wd, $dt, $nm, $ns, $nt, $ar, $co, $cid, $cc);
					break;
				
				case 3://delete
					$subsql = "
						declare @purview    int,
								@have       int
						exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'
						exec @have = dbo.p_user_have_object $user_id, $objid
						if @purview > 0 and @have > 0
						begin
							set @code = -1 							
							delete from dbo.cfg_event where event_id = ? 
							set @code = 0
						end
						else
							set @code = -20";
					$params = array($eid);		
				    break;
			 }
			
			 $sql = "declare @code int,
			                @eid int
					begin try
						begin tran
						$subsql
						commit tran   
					end try
					begin catch
						rollback tran
					end catch

					select @code as errcode, @eid as eid";
			
			$data = $db->queryLastDS($sql, $params);
			$error_code = $data[0]['errcode'];
			$eid = $data[0]['eid'];
			
			if(!is_null($error_code) && $error_code == 0){
				if($_POST['state'] == 1){
					echo "{'status':'ok', 'eid': $eid}";
				}else{
					echo "{'status':'ok'}";
				}				
			}else{
				echo "{'status':'fail','error':$error_code}";
			}
		break;
		
		case 17:// delete object history
			$objid = (int)$_POST['objid'];
			$subsql = "
				declare @purview    int,
				        @have       int
				exec @purview = dbo.p_user_have_purview $user_id, 1090, 'D'
				exec @have = dbo.p_user_have_object $user_id, $objid
				if @purview > 0 and @have > 0
				begin
					set @code = -1
					set @objid = $objid
					declare @device_no nvarchar(20)	
					select @device_no = device_no from cfg_device where object_id = $objid;										

					declare @track_name	   nvarchar(50)
					set	@track_name	= dbo.fn_track4device_no(@device_no)
					
					if exists (select * from sysobjects where id = object_id(@track_name) and OBJECTPROPERTY(ID, N'ISUSERTABLE') = 1) 
					begin
						declare	@strtemp varchar(1024)
						set	@strtemp = 'drop table ' + @track_name
						exec(@strtemp)
					end
					
					set @code = 0
				
				end
				else
					set @code = -20
			";
			$sql = "declare @code int, @objid int
					begin try
						begin tran
						$subsql
						commit tran   
					end try
					begin catch
						rollback tran
					end catch

                select @code as errcode, @objid as objectid";
            $data = $db->queryLastDS($sql);
            $error_code = $data[0]['errcode'];
			$object_id = $data[0]['objectid'];
		
			if(!is_null($error_code) && $error_code == 0){				
                echo "{'status':'ok', 'objid': $object_id}";
            }else{
                if(is_null($error_code)){
                    $error_code = -100;
                }
                echo "{'status':'fail','error':$error_code}";
            }
		break;
			
		case 18://query one sensor
			$sensorid = (int)$_POST['sid'];
			
			$sql = "select sensor_id sid,element_id eid,object_id oid,sensor_name sn, sensor_target tg, value_format vf, value_formula sf, value_option di,value_digital_1 sd1,value_digital_0 sd0,value_linear ca,
			        lowest_value slv,highest_value shv,ignore_ignition_off igo, smooth_data sd, reverse_digital rd, show_time sht, keep_last_value klv
				    from cfg_sensor where sensor_id = $sensorid and valid = 1";
			$sensorlist = $db->query($sql);
			$json = array2json($sensorlist);
			echo $json;
	
		break;
		
		case 19: //save sensor
			 $objid = (int)$_POST['objid'];
			 $sid = (int)$_POST['sid'];
			 $sn = str_replace("'", "''", substr($_POST['sn'], 0, 50));
			 $tg = (int)$_POST['tg'];
			 $eid = (int)$_POST['eid'];
			 $et = (int)$_POST['et'];
			 $sd1 = $_POST['sd1'];
			 $sd0 = $_POST['sd0'];
			 $vf = substr($_POST['vf'], 0, 100);
			 $sf = substr($_POST['sf'], 0, 100);
			 $slv = (empty($_POST['slv']) && strlen($_POST['slv']) == 0)  ? 'null' : (float)$_POST['slv'];
			 $shv = empty($_POST['shv']) ? 'null' : (float)$_POST['shv'];
			 $igo = (int)$_POST['igo'];
			 $sd = (int)$_POST['sd'];
			 $rd = (int)$_POST['rd'];
			 $sht = (int)$_POST['sht'];
			 $klv = (int)$_POST['klv'];
			 $ca = substr($_POST['ca'], 0, 150);
			 $di = substr($_POST['di'], 0, 1024);			 			 

			 switch($_POST['state']){
                case 1://new
					$subsql = "
							declare @purview    int,
									@have       int
							exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'
							exec @have = dbo.p_user_have_object $user_id, $objid
							if @purview > 0 and @have > 0
							begin
								set @code = -1
								if exists(select * from dbo.cfg_sensor where element_id = $eid and object_id = $objid)
								begin
									delete from dbo.cfg_sensor where element_id = $eid and object_id = $objid
								end
								set @code = -2
								insert into dbo.cfg_sensor (element_id, object_id, sensor_type, sensor_target, sensor_name, value_format, value_formula, value_option, value_digital_1, value_digital_0,
								value_linear, lowest_value, highest_value, ignore_ignition_off, smooth_data, reverse_digital, show_time, keep_last_value)
								values ($eid, $objid, $et, $tg, ?, ?, ?, ?, ?, ?, ?, $slv, $shv, $igo, $sd, $rd, $sht, $klv)
								set @sid = @@identity; 
								set @code = 0
							end
							else
								set @code = -20";
					$params = array($sn, $vf, $sf, $di, $sd1, $sd0, $ca);				
					break;
					
				case 2://modify
					$subsql = "
							declare @purview    int,
							        @have       int
							exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'
							exec @have = dbo.p_user_have_object $user_id, $objid
							if @purview > 0 and @have > 0
							begin
								set @code = -1
								update dbo.cfg_sensor set element_id = $eid, object_id = $objid, sensor_type = $et, sensor_target = $tg, sensor_name = ?, value_format = ?, value_formula = ?, value_option = ?,
								value_digital_1 = ?, value_digital_0 = ?, value_linear = ?, lowest_value = $slv, highest_value = $shv, ignore_ignition_off = $igo, smooth_data = $sd, reverse_digital = $rd, show_time = $sht, keep_last_value = $klv
								where sensor_id = $sid
								set @code = 0
							end
							else
								set @code = -20							
							";
					$params = array($sn, $vf, $sf, $di, $sd1, $sd0, $ca);
					break;
				
				case 3://delete
					$subsql = "
						declare @purview    int,
								@have       int
						exec @purview = dbo.p_user_have_purview $user_id, 1090, 'M'
						exec @have = dbo.p_user_have_object $user_id, $objid
						if @purview > 0 and @have > 0
						begin
							set @code = -1 							
							delete from dbo.cfg_sensor where sensor_id = ? 
							set @code = 0
						end
						else
							set @code = -20";	
					$params = array($sid);
				    break;
			 }
			
			 $sql = "declare @code int,
			                 @sid int
					begin try
						begin tran
						$subsql
						commit tran   
					end try
					begin catch
						rollback tran
					end catch

					select @code as errcode, @sid as sid";
			
			$data = $db->queryLastDS($sql, $params);
			$error_code = $data[0]['errcode'];
			$sid = $data[0]['sid'];
			
			if(!is_null($error_code) && $error_code == 0){
				if($_POST['state'] == 1){
					echo "{'status':'ok', 'sid': $sid}";
				}else{
					echo "{'status':'ok'}";
				}				
			}else{
				echo "{'status':'fail','error':$error_code}";
			}
		break;
    }
}
else
    echo 'no login';
?>

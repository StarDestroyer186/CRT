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
		case 13://query task			
			if (isset($_POST['tid'])) {
				$tid = (int)$_POST['tid'];
                //query one task by taskId
				$time_zone = (float)$_SESSION['timezone'];
				$sql = "select t.task_id tid, t.object_id oid, t.task_name tn, t.priority p,
						t.status s, t.start_place_id sid, 
						convert(varchar(20), dbo.fn_to_client_time(t.start_from, $time_zone*60), 20) sf, 
						convert(varchar(20), dbo.fn_to_client_time(t.start_to, $time_zone*60), 20) st, 
						t.end_place_id eid, 
						convert(varchar(20), dbo.fn_to_client_time(t.end_from, $time_zone*60), 20) ef, 
						convert(varchar(20), dbo.fn_to_client_time(t.end_to, $time_zone*60), 20) et, 
						t.repeat_task rt, t.days_interval di, t.remark r
						from dbo.cfg_tasks t 
						where t.task_id = $tid";
				$tasklist = $db->query($sql);
				foreach ($tasklist as $row) {
					$output[] = $row;
				}
				$json = array2json($output);
				echo $json;
			}else if(isset($_POST['tname'])){
				//query one task by task name
				$time_zone = (float)$_SESSION['timezone'];
				$tname = trim($_POST['tname']);             
				$sql = "select t.task_id tid, t.object_id oid,
						convert(varchar(20), dbo.fn_to_client_time(t.start_from, $time_zone*60), 20) sf, 
						convert(varchar(20), dbo.fn_to_client_time(t.start_to, $time_zone*60), 20) st,
						p.area_name an, p.area_type at, p.area_pts ap
						from dbo.cfg_tasks t
						left join dbo.cfg_place p 
						on t.start_place_id = p.place_id 
						where t.task_name = ? and (t.status = 0 or t.status = 1)";
				$params = array($tname);			
				$splace = $db->query($sql, $params);
				foreach ($splace as $rows) {
					$outputs[] = $rows;
				}
				$jsons = array2json($outputs);
				
				$sql = "select convert(varchar(20), dbo.fn_to_client_time(t.end_from, $time_zone*60), 20) ef, 
						convert(varchar(20), dbo.fn_to_client_time(t.end_to, $time_zone*60), 20) et, 
						p.area_name an, p.area_type at, p.area_pts ap
						from dbo.cfg_tasks t
						left join dbo.cfg_place p 
						on t.end_place_id = p.place_id  
						where t.task_name = ? and (t.status = 0 or t.status = 1)";
				$params = array($tname);		
				$eplace = $db->query($sql, $params);
				foreach ($eplace as $rowe) {
					$outpute[] = $rowe;
				}
				$jsone = array2json($outpute);
				
				echo "{'jsons': $jsons, 'jsone': $jsone}";
				
			}else{
				//query task list
				$sql = "select t.task_id tid, t.object_id oid, t.task_name tn, t.priority p, t.status s, t.start_place_id sid, 						
						t.end_place_id eid from cfg_user_purview p, cfg_object o, cfg_tasks t
						where p.user_id = $user_id and p.purview_id = 1000 and o.object_id = t.object_id and o.group_id in
						(
							select group_id from dbo.fn_group4user($user_id)
						)
						order by t.task_name";
				$tasklist = $db->query($sql);
								
				//place list
				$sql = "select place_id zid, area_name an, area_type at 
						from cfg_user_purview p, cfg_place pl where p.user_id = $user_id and p.purview_id = 1000 and pl.place_id in (select place_id from dbo.fn_place4user($user_id))
						order by an";
				$placelist = $db->query($sql);
				
				/*object list
				$sql = "select o.object_id, o.object_flag from cfg_user_purview p, cfg_object o where p.user_id = $user_id and p.purview_id = 1000
						and o.group_id in
						(
							select group_id from dbo.fn_group4user($user_id)
						)
						order by o.object_flag";
				$olist = $db->query($sql);*/
										
				$sql_pur = "select purview_id pid, isnull(purview,'') p from cfg_user_purview where user_id = $user_id and purview_id = 1800";
				$upurview = $db->query($sql_pur);
				
				$tlist = array2json($tasklist);
				$plist = array2json($placelist);
				$olist = array2json($olist);
				$pr = array2json($upurview);
				$json = "{'tlist': $tlist, 'plist': $plist, 'olist': $olist, 'pur': $pr}";
				echo $json;
			}	
		break;
		
		case 14:
			$time_zone = (float)$_SESSION['timezone'];
            switch($_POST['state']){
                case 1://new
					$tn = $_POST['tn'];
					$oid = (int)$_POST['oid'];
					$p = (int)$_POST['p'];
					$s = (int)$_POST['s'];
					$sid = (int)$_POST['sid'];
					$sf = toServerTime(strtotime($_POST['sf']), $time_zone);
					$st = toServerTime(strtotime($_POST['st']), $time_zone);
					$eid = (int)$_POST['eid'];
					$ef = toServerTime(strtotime($_POST['ef']), $time_zone);
					$et = toServerTime(strtotime($_POST['et']), $time_zone);
					$rt = (int)$_POST['rt'];
					$di = (empty($_POST['di']) or strlen($_POST['di']) == 0) ? 0 : (int)$_POST['di']; 
					$r = $_POST['r'];					
					
					$subsql = "declare @purview    int,
					                   @have       int
							   exec @purview = dbo.p_user_have_purview $user_id, 1800, 'A'	
							   exec @have = dbo.p_user_have_object $user_id, $oid
							   if @purview > 0 and @have > 0
							   begin
								 set @code = -1							     							   
								   insert into cfg_tasks (object_id, task_name, priority, status, start_place_id, start_from, start_to, end_place_id, end_from, end_to, repeat_task, days_interval, remark) values 
								   ($oid, ?, $p, $s, $sid, '$sf', '$st', $eid, '$ef', '$et', $rt, $di, ?); 
								   set @max_id = @@identity; 
								   set @code = 0
							   end
							   else
								 set @code = -20";	
					$params = array($tn, $r);	
					break;
				
				case 2://modify
					$tid = (int)$_POST['tid'];
					$tn = $_POST['tn'];
					$oid = (int)$_POST['oid'];
					$p = (int)$_POST['p'];
					$s = (int)$_POST['s'];
					$sid = (int)$_POST['sid'];
					$sf = toServerTime(strtotime($_POST['sf']), $time_zone);
					$st = toServerTime(strtotime($_POST['st']), $time_zone);
					$eid = (int)$_POST['eid'];
					$ef = toServerTime(strtotime($_POST['ef']), $time_zone);
					$et = toServerTime(strtotime($_POST['et']), $time_zone);
					$rt = (int)$_POST['rt'];
					$di = (empty($_POST['di']) or strlen($_POST['di']) == 0) ? 0 : (int)$_POST['di']; 
					$r = $_POST['r'];
					
					$subsql = "declare @purview    int,
									   @have       int
							   exec @purview = dbo.p_user_have_purview $user_id, 1800, 'M'
							   exec @have = dbo.p_user_have_object $user_id, $oid
							   if @purview > 0 and @have > 0
							   begin
								 set @code = -1 
							     update cfg_tasks set object_id = $oid, task_name = ?, priority = $p, status = $s, start_place_id = $sid, start_from = '$sf', start_to = '$st', end_place_id = $eid, end_from = '$ef', end_to = '$et', repeat_task = $rt, days_interval = $di, remark = ? where task_id = $tid 
							     set @code = 0
							   end
							   else
								 set @code = -20";
					$params = array($tn, $r);		 
					break;
				
				case 3://delete
					$tid = (int)$_POST['tid'];
					$oid = (int)$_POST['oid'];
					
					$subsql = "declare @purview    int,
									   @have       int
							   exec @purview = dbo.p_user_have_purview $user_id, 1800, 'D'
							   exec @have = dbo.p_user_have_object $user_id, $oid
							   if @purview > 0 and @have > 0
							   begin
								  set @code = -1 
							      delete from cfg_tasks where task_id = ? 
							      set @code = 0
							   end
							   else
								 set @code = -20";
					$params = array($tid);
				    break;
					
				case 4://disable task
					$tid = (int)$_POST['tid'];
					$oid = (int)$_POST['oid'];
					$subsql = "declare @have       int
							   exec @have = dbo.p_user_have_object $user_id, $oid
							   if @have > 0
							   begin
								 set @code = -1 
							     update cfg_tasks set status = 3 where task_id = ? and (status = 0 or status = 1) 
							     set @code = 0
							   end
							   else
								 set @code = -20";
					$params = array($tid);
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

					select @code as errcode, @max_id as tid";
            $data = $db->queryLastDS($sql, $params);
            $error_code = $data[0]['errcode'];
            
            if(!is_null($error_code) && $error_code == 0){
				if($_POST['state'] == 1){
					$newtid = $data[0]['tid'];
					echo "{'status':'ok', 'newtid': $newtid}";
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
		
    }
}
else
    echo 'no login';
?>

<?php
session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

function tree($table, $etype) {
    $tree = array();
	if(count($table) <=0) return;
	
    foreach($table as $row){  
		if($row['id'] != null){
			$row['value'] = $row['id'];
			$row['id'] = 'id_'.$row['id'];
			$row['complete'] = true;
			$row['isexpand'] = true;
			$row['hasChildren'] = false;
			
			if($etype == 1){
				//view all
				$row['showcheck'] = false;
				$row['checkstate'] = 0; 
			}else if($etype == 2){
				//view one
				$row['showcheck'] = $row['checkstate'] != null;
				$row['checkstate'] = $row['checkstate'] == null ? 0: 1;
			}else{
				//modify one
				$row['showcheck'] = true;
				$row['checkstate'] = $row['checkstate'] == null ? 0: 1;
			}
					   
			$tree[] = $row; 
		}               
    }
    return $tree;        
}

if(isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid']) and isset($_GET['type']))
{
    $user_id = (int)$_SESSION['uid'];
	$lang = $_SESSION['lang'];
	
    $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	
	$type = (int) $_GET['type'];
    switch ($type) {
        case 1: 
			if (isset($_GET['usrid']) and isset($_GET['etype'])) {
				//query one
				$subuser = (int)$_GET['usrid'];				
				if($user_id == $subuser){
					$etype = 1;
				}else{
					$etype = (int)$_GET['etype'];
				}
				$eshow = $subuser;
				
				$sql = "select purview_id pid, isnull(purview,'') p from cfg_user_purview where user_id = $subuser";
				$pur = $db->query($sql);
				$json = array2json($pur);
				
				$sql_cmd = "select t1.*, t2.checkstate from(
								select c.command_id id, dbo.fn_trans_entry('$lang',c.command_name) text 
								from dbo.cfg_user_command u
								left join dbo.sys_command c on u.command_id = c.command_id 
								where u.command_id in (select command_id from dbo.cfg_type_command)
								and u.command_id in (select command_id from dbo.sys_protocol_command)
								and user_id = $user_id
							) t1
							left join
							(
								select c.command_id checkstate from dbo.cfg_user_command u
								left join dbo.sys_command c on u.command_id = c.command_id
								where user_id = $eshow
							) t2 on t1.id = t2.checkstate";
				$ucmds = $db->query($sql_cmd);
				
				$tree = tree($ucmds, $etype);
				$data = array('id'=>'id_0', 
					'text' => $TEXT['info-mycommand'],  
					'complete' => true, 
					'showcheck' => false, 
					'hasChildren' => true,
					'checkstate' => 0, 
					'isexpand' => true, 
					'value' => '0', 
					'ChildNodes' => $tree
				);
				$cmds = '['.array2json($data).']';
				
				echo "{'pur': $json, 'cmds':$cmds}";
			 }else {
				//query all
				$time_zone = (float)$_SESSION['timezone'];
				$etype = 1;
				$eshow = $user_id;
				
				$sql_list = "select u.user_id usrid, u.user_name uname, u.login_name login, convert(varchar(20),dbo.fn_to_client_time(u.expire_time, $time_zone*60), 20) etime, u.valid, 
							 u.user_phone p, u.limit_object l from cfg_user_purview p, sys_user u
							 where p.user_id = $user_id and p.purview_id = 3000 and u.user_id in (select user_id from dbo.fn_user_tree($user_id))
							 order by u.owner_id, u.user_name";
				$ulist = $db->query($sql_list);
				$list = array2json($ulist);
				
				$sql_pur = "select purview_id pid, isnull(purview,'') p from cfg_user_purview where user_id = $user_id";
				$upurview = $db->query($sql_pur);
				$purview = array2json($upurview);
				
				$sql_cmd = "select t1.*, t2.checkstate from(
								select c.command_id id, dbo.fn_trans_entry('$lang',c.command_name) text 
								from dbo.cfg_user_command u
								left join dbo.sys_command c on u.command_id = c.command_id 
								where u.command_id in (select command_id from dbo.cfg_type_command)
								and u.command_id in (select command_id from dbo.sys_protocol_command)
								and user_id = $user_id 
							) t1
							left join
							(
								select c.command_id checkstate from dbo.cfg_user_command u
								left join dbo.sys_command c on u.command_id = c.command_id
								where user_id = $eshow
							) t2 on t1.id = t2.checkstate";
				$ucmds = $db->query($sql_cmd);
				
				$tree = tree($ucmds, $etype);
				$data = array('id'=>'id_0', 
					'text' => $TEXT['info-mycommand'], 
					'complete' => true, 
					'showcheck' => false, 
					'hasChildren' => true,
					'checkstate' => 0, 
					'isexpand' => true, 
					'value' => '0', 
					'ChildNodes' => $tree
				);
				$cmds = '['.array2json($data).']';
				
				echo "{'self':$user_id, 'list':$list, 'pur': $purview, 'cmds':$cmds}";
			 }
			 break;
		
		case 2:
			//Update
			$usrid = (int)$_GET['usrid'];
			$pur = $_GET['pur'];
			$cmds = $_GET['cmds'];
			
			if($user_id != $usrid){
				$subsql = "
					declare @purview    int
					exec @purview = dbo.p_user_have_purview $user_id, 3300, 'S'
					if @purview > 0
					begin			
						  declare @pur_n varchar(256),
								   @i int,
								   @pid int,
								   @p varchar(20),
								   @one_pur varchar(256),
								   @cmds_n varchar(1024),
								   @one_cmd varchar(20)
								   
						   set @code = -1
						   set @pur_n = ?;
						   delete from dbo.cfg_user_purview where user_id = $usrid
						   set @code = -2
						   
						   while len(@pur_n) > 0
						   begin
								set @i = charindex(';',@pur_n)
								if(@i > 0) 
								begin 
									declare @z int
									set @one_pur = substring(@pur_n, 1, @i - 1) 
									set @z = charindex(':', @one_pur)
									if (@z > 0)
									begin
										set @pid = convert(int,substring(@one_pur, 1, @z - 1))
										set @p = substring(@one_pur, @z + 1, len(@one_pur) -@z);
										
										exec @purview = dbo.p_user_have_purview $user_id, @pid, @p
										if @purview > 0
										insert into dbo.cfg_user_purview (user_id,purview_id,purview) values ($usrid,@pid,@p);
									end
									set @pur_n = substring (@pur_n , @i + 1 , len(@pur_n) - @i)
								end
								else 
									break
						   end
						   
						   set @cmds_n = ?
						   delete from cfg_user_command where user_id = $usrid
						   set @code = -3
						   
						   while len(@cmds_n) > 0
						   begin
								set @i = charindex(';',@cmds_n)
								if(@i > 0) 
								begin 
									set @one_cmd = convert(int,substring(@cmds_n, 1, @i - 1))
									insert into cfg_user_command (user_id, command_id) values ($usrid, @one_cmd)
									set @cmds_n = substring (@cmds_n , @i + 1 , len(@cmds_n) - @i)
								end
								else 
									break
						   end
						   
						   set @code = 0
					end
					else
						set @code = -20";
				//2.update user group
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
				$params = array($pur, $cmds);		
				$data = $db->queryLastDS($sql, $params);
				$error_code = $data[0]['errcode'];
				
				if($error_code == 0){
					echo "{'status':'ok'}";
				}else{
					echo "{'status':'fail','error':$error_code}";
				}
			}else{
				echo "{'status':'fail','error':'-20'}";
			}
		break;
	
    }
}
else echo 'no login';
?>

<?php

session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid'])) {
    $user_id = (int) $_SESSION['uid'];
    $group = trim($_GET['group']);
    $parent = (int)$_GET['parent'];
	$p_parent = (int)$_GET['p_parent'];
	$self = isset($_GET['self']) ? (int)$_GET['self'] : 1;   //1: self
	$type = isset($_GET['type']) ? (int)$_GET['type'] : 0;   //0: new  1: update
	if($parent == 0){
		echo "{'status': 'no parent group'}";
		return;
	}

    $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
	
	/*只有admin用户才能把车辆组添加到root组*/
	$sql = "declare @owner_id     int,
				    @group_parent int;
		    select @owner_id = owner_id from sys_user where user_id = ?;
		    select @group_parent = group_parent from cfg_group where group_id = ?;
		    select @owner_id as owner_id, @group_parent as group_parent;";
	$params = array($user_id, $parent);	  
	$data = $db->queryLastDS($sql, $params);
    $owner_id = $data[0]['owner_id'];
	$group_parent = $data[0]['group_parent'];

	if($owner_id != 0 && $group_parent == 0){
		echo "{'status': 'no parent group'}";
		return;
	}
	
    $subsql = "
		declare @purview    int,
				@have       int,
				@p_have     int
		if $type = 1
		begin
			exec @purview = dbo.p_user_have_purview $user_id, 3200, 'M'
			exec @have = dbo.p_user_have_group $user_id, $parent
			exec @p_have = dbo.p_user_have_group $user_id, $p_parent
		end
		else
		begin
			exec @purview = dbo.p_user_have_purview $user_id, 3400, 'S'
		end
		
		if @purview > 0
		begin
			set @code = -1
			if $type = 1 
			begin
				if $self = 0 and @have > 0 and @p_have > 0
				begin
					if $p_parent not in (select group_id from fn_group_tree($parent))
					begin
						set @code = -2
						update dbo.cfg_group set group_name = ?, group_parent = $p_parent where group_id = $parent
						set @code = 0
					end
					else
						set @code = -10
				end
				else
				begin
					if @have > 0
					set @code = -3
					update dbo.cfg_group set group_name = ? where group_id = $parent
					set @code = 0
				end		
			end
			else
			begin	
				insert into cfg_group (group_name, group_parent) values (?, ?)		
				set @code = -4		
				insert into cfg_user_group
				select $user_id, group_id from cfg_group where group_name = ?
				set @code = 0
			end			
		end
		else
			set @code = -20";
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

	$params = array($group, $group, $group, $parent, $group);	 
    $data = $db->queryLastDS($sql, $params);
    $error_code = $data[0]['errcode'];

    if($error_code == 0){
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
        $data = $db->query($sql);
        $json = array2json($data);
        echo "{'status': 'ok', 'group': $json}";
    }else{
        echo "{'status': 'fail', 'error': $error_code}";
    }
}
else{
    echo 'no login';
}
?>

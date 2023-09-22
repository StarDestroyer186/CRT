<?php

session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

if (isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid'])) {	
	if (isset($_GET['objid']) && ((int)$_GET['objid'] > 0)) {
        $user_id = (int) $_SESSION['uid'];
	    $objid = (int)$_GET['objid'];
	    $time_zone = (float)$_SESSION['timezone'];
		
        $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
        if (isset($_GET['style']) and ($_GET['style'] == 'post')) {
            $oflag = substr($_GET['oflag'], 0, 50);
			$custphone = substr($_GET['custphone'], 0, 50);
            $okind = (int) $_GET['okind'];
            $remark = substr($_GET['remark'], 0, 1024);			

            $subsql = "declare @haveobj  int
					exec @haveobj = dbo.p_user_have_object $user_id, $objid
					if @haveobj > 0
					begin
						set @code = -1
						
						begin tran
						update cfg_object set object_flag = ?, object_kind = $okind, remark = ?
						where object_id = $objid
						update cfg_customer set phone = ?
						where customer_id = (select customer_id from cfg_object where object_id = $objid)
						set @code = 0
						commit tran
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
			$params = array($oflag, $remark, $custphone);			
			$data = $db->queryLastDS($sql, $params);
			$error_code = $data[0]['errcode'];
				
			if($error_code == 0){
				$sql = "declare @gid int
                    select @gid = group_id from cfg_object where object_id = $objid
                    select user_id from dbo.fn_user4group(@gid)";
                $data = $db->query($sql);
                
				if(!empty($data)){
                    $memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
                    $online = memcache_get($memcache, $GLOBAL_USER);
                    if($online){
						$online['last_stamp'] = time() - 6;
                        foreach ($data as $row){
							if($online['list'][$row['user_id']]){
								//$online['list'][$row['user_id']]['need_update'] = true;
								array_push($online['list'][$row['user_id']]['need_update'],$objid);
							}
                        }
                        memcache_set($memcache, $GLOBAL_USER, $online, MEMCACHE_COMPRESSED, 0);
                    }
                    memcache_close($memcache);
                }
				
				echo 'ok';
			} else {
				echo "{'status':'fail','error':$error_code}";
			}
        } else {
            $sql = "select object_flag oflag, dtype_name dtype, d.device_sim simno, d.device_no devno,
                d.install_time itime, d.last_stamp etime, c.full_name custname, c.phone custphone, 
                o.object_kind okind, o.remark remark 
				from cfg_device d, cfg_object o, cfg_customer c, sys_device_type t 
                where d.object_id = o.object_id and o.customer_id = c.customer_id
                and t.dtype_id = d.dtype_id and o.object_id = $objid";
            $data = $db->query($sql);
            if (!empty($data)) {
                $row = $data[0];
                $row['itime'] = toCustomTime($row['itime'], $time_zone, $_SESSION['date_fmt']);
				$row['etime'] = toCustomTime($row['etime'], $time_zone, $_SESSION['date_fmt']);
                $json = array2json($row);
                echo $json;
            } else {
                echo '.';
            }
        }
    }
}
?>

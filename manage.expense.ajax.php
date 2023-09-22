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
		case 1://query expense	
			$time_zone = (float)$_SESSION['timezone'];
			if (isset($_POST['eid'])) {
				$eid = (int)$_POST['eid'];
                //query one expense by expenseId				
				$sql = "select e.expense_id eid, e.object_id oid, e.expense_name en, 
						convert(varchar(20), dbo.fn_to_client_time(e.expense_date, $time_zone*60), 20) d, 
						e.quantity q, e.cost c, e.supplier s, e.buyer b, e.odometer o, e.engine_hour g, e.description r
						from dbo.dat_expense e 
						where e.expense_id = $eid";
				//echo $sql;
				$expenselist = $db->query($sql);
				foreach ($expenselist as $row) {
					$output[] = $row;
				}
				$json = array2json($output);
				echo $json;
			}else{
				//query expense list
				$sql = "select e.expense_id eid, e.object_id oid, e.expense_name en, 
						convert(varchar(20), dbo.fn_to_client_time(e.expense_date, $time_zone*60), 20) d, 
						e.quantity q, e.cost c, e.supplier s, e.buyer b from cfg_user_purview p, cfg_object o, dat_expense e
						where p.user_id = $user_id and p.purview_id = 1000 and o.object_id = e.object_id and o.group_id in
						(
							select group_id from dbo.fn_group4user($user_id)
						)
						order by d";
				$expenselist = $db->query($sql);
												
				$sql_pur = "select purview_id pid, isnull(purview,'') p from cfg_user_purview where user_id = $user_id and purview_id = 1900";
				$upurview = $db->query($sql_pur);
				
				$elist = array2json($expenselist);
				$pr = array2json($upurview);
				$json = "{'elist': $elist, 'pur': $pr}";
				echo $json;
			}	
		break;
		
		case 2:
			$time_zone = (float)$_SESSION['timezone'];
            switch($_POST['state']){
                case 1://new
					$en = substr($_POST['en'], 0, 50);
					$oid = (int)$_POST['oid'];
					$d = toServerTime(strtotime($_POST['d']), $time_zone);
					$q = $_POST['q'];
					$c = $_POST['c'];
					$s = substr($_POST['s'], 0, 50);
					$b = substr($_POST['b'], 0, 50);
					$o = substr($_POST['o'], 0, 50);
					$g = substr($_POST['g'], 0, 50);
					$r = substr($_POST['r'], 0, 256);										
					
					$subsql = "declare @purview    int,
					                   @have       int
							   exec @purview = dbo.p_user_have_purview $user_id, 1900, 'A'	
							   exec @have = dbo.p_user_have_object $user_id, $oid
							   if @purview > 0 and @have > 0
							   begin
								 set @code = -1							     							   
								   insert into dat_expense (object_id, expense_name, expense_date, quantity, cost, supplier, buyer, odometer, engine_hour, description) values 
								   ($oid, ?, '$d', $q, $c, ?, ?, ?, ?, ?); 
								   set @max_id = @@identity; 
								   set @code = 0
							   end
							   else
								 set @code = -20";
					$params = array($en, $s, $b, $o, $g, $r);				
					break;
				
				case 2://modify
					$eid = (int)$_POST['eid'];
					$en = substr($_POST['en'], 0, 50);
					$oid = (int)$_POST['oid'];
					$d = toServerTime(strtotime($_POST['d']), $time_zone);
					$q = (float)$_POST['q'];
					$c = (float)$_POST['c'];
					$s = substr($_POST['s'], 0, 50);
					$b = substr($_POST['b'], 0, 50);
					$o = substr($_POST['o'], 0, 50);
					$g = substr($_POST['g'], 0, 50);
					$r = substr($_POST['r'], 0, 256);	
					
					$subsql = "declare @purview    int,
									   @have       int
							   exec @purview = dbo.p_user_have_purview $user_id, 1900, 'M'
							   exec @have = dbo.p_user_have_object $user_id, $oid
							   if @purview > 0 and @have > 0
							   begin
								 set @code = -1 
							     update dat_expense set object_id = $oid, expense_name = ?, expense_date = '$d', quantity = $q, cost = $c, supplier = ?, buyer = ?, odometer = ?, engine_hour = ?, description = ? where expense_id = ? 
							     set @code = 0
							   end
							   else
								 set @code = -20";
					$params = array($en, $s, $b, $o, $g, $r, $eid);		 
					break;
				
				case 3://delete
					$eid = (int)$_POST['eid'];
					$oid = (int)$_POST['oid'];
					
					$subsql = "declare @purview    int,
									   @have       int
							   exec @purview = dbo.p_user_have_purview $user_id, 1900, 'D'
							   exec @have = dbo.p_user_have_object $user_id, $oid
							   if @purview > 0 and @have > 0
							   begin
								  set @code = -1 
							      delete from dat_expense where expense_id = ? 
							      set @code = 0
							   end
							   else
								 set @code = -20";
					$params = array($eid);
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

					select @code as errcode, @max_id as eid";

			$data = $db->queryLastDS($sql, $params);
            $error_code = $data[0]['errcode'];
            
            if(!is_null($error_code) && $error_code == 0){
				if($_POST['state'] == 1){
					$neweid = $data[0]['eid'];
					echo "{'status':'ok', 'neweid': $neweid}";
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

<?php

session_start();
include_once('common.inc.php');
require_once 'db.class.php';
require_once 'db.sqlsrv.php';

function tree($table, $etype, $p_id) {
    $tree = array();
    foreach($table as $row){
        if($row['parent'] == $p_id){
            $child = tree($table, $etype, $row['id']);                
            $row['value'] = $row['id'];
            $row['id'] = 'id_'.$row['id'];
            $row['complete'] = true;
            $row['isexpand'] = true;
            if($etype == 1){
                //edit
                $row['showcheck'] = $row['showcheck'] != null;
                $row['checkstate'] = $row['checkstate'] == null ? 0: 1; 
            }else{
                //view
                $row['showcheck'] = ($row['showcheck'] != null) && ($row['checkstate'] != null);
                $row['checkstate'] = $row['showcheck'] == null ? 0: 1;
            }
                       
            if($child){
                $row['hasChildren'] = true;
                $row['ChildNodes'] = $child;
            }else{
                $row['hasChildren'] = false;
            }
            unset($row['parent']);
            $tree[] = $row;                
        }
    }
    return $tree;        
}

function isTopGroup($table, $group){
	foreach($table as $row){
		if($row['id'] == $group['parent']){
			return false;
		}
	}
	return true;
}

if (isset($_SESSION['logined']) and $_SESSION['logined'] and isset($_SESSION['uid'])) {
    $user_id = (int) $_SESSION['uid'];
    $subuser = (int)$_GET['usrid'];
    if($user_id == $subuser){
        $subuser = 0;
    }
    $etype = (int)$_GET['etype'];
    $gname = $_GET['gname'] == "" ? "%%" : "%".trim($_GET['gname'])."%";
	
    if($etype == 1){
        $eshow = $user_id;
    }else{
        $eshow = $subuser;
    }
    $db = new db_mssql($db_host, $db_dbms, $db_user, $db_pass);
    /*
	$sql = "with ca1 as (
				select group_id from dbo.fn_group4user($user_id)
			),
			cg1 (group_id, group_parent) as 
			(
				select group_id, group_parent from cfg_group 
				where group_parent in (select * from ca1) or group_id in (select * from ca1)
				union all 
				select a.group_id, a.group_parent from cfg_group a,cg1 b
				where b.group_parent = a.group_id
			) 
			  
			select t1.*, t2.showcheck, t3.checkstate from (
				select group_id id, group_name text, group_parent parent from cfg_group
				where group_id in (
					select group_id from cg1
				)
			) t1
			left join 
			(
				select group_id showcheck from dbo.fn_group4user($eshow) 
			) t2 on t1.id = t2.showcheck
			left join
			(
				select group_id checkstate from dbo.fn_group4user($subuser) 	
			) t3 on t1.id = t3.checkstate
			order by t1.parent, t1.text";
	*/
	$sql = "select t1.*, t2.showcheck, t3.checkstate from (
				select group_id id, group_name text, group_parent parent from cfg_group
				where group_id in (
					select group_id from dbo.fn_group4user(?)
				) and group_name like ?
			) t1
			left join 
			(
				select group_id showcheck from dbo.fn_group4user(?) 
			) t2 on t1.id = t2.showcheck
			left join
			(
				select group_id checkstate from dbo.fn_group4user(?) 	
			) t3 on t1.id = t3.checkstate
			order by t1.parent, t1.text";
    $params = array($user_id, $gname, $eshow, $subuser);
    $data = $db->query($sql, $params);

    if(!empty($data)){
		foreach($data as &$row){
			if(isTopGroup($data, $row)){
				$row['parent'] = 0;
			}
		}
        $tree = tree($data, $etype, $data[0]['parent']);
    }
    $data = array('id'=>'id_0', 
        'text' => $TEXT['info-mygroup'], 
        'complete' => true, 
        'showcheck' => $subuser != 0 && $etype == 1, 
        'hasChildren' => $tree != null,
        'checkstate' => 0, 
        'isexpand' => true, 
        'value' => '0', 
        'ChildNodes' => $tree
    );
    $json = array2json($data);
    echo '['.$json.']';
}


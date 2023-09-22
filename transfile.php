<?php
require_once 'default.inc.php';

function table($var) {
    if (!$var) 
        return false;
    echo '<style>table.dump { font-family:Arial; font-size:8pt; }</style>';
    echo '<table class="dump" border="1" cellpadding="1" cellspacing="0">' . "\n";
    echo '<tr>';
    echo '<th>#</th>';
    foreach ($var[0] as $key => $val) {
        echo '<th><b>';
        echo $key;
        echo '</b></th>';
    }
    echo '</tr>' . "\n";
    $row_cnt = 0;
    foreach ($var as $row) {        
        if($row_cnt>0){        
            echo '<tr align="center">';
            echo '<td>' . $row_cnt . '</td>';
            foreach ($row as $val) {
                echo '<td>';
                echo $val;
                echo '</td>';
            }
            echo '</tr>' . "\n";
        }
        $row_cnt++;
    }
    echo '</table>' . "\n";
}

function downfile($filepath){    
    if(file_exists($filepath)){
        $filename = basename($filepath);
        $len = filesize($filepath);
        ob_end_clean();
        header("Pragma: public");
        header("Expires: 0");  
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-type: text/plain");
        header("Content-Disposition: attachment; filename=$filename;");
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: $len");
        readfile($filepath);
    }
}

//$TRANS[0]['key'] = 'key';
//foreach ($support_lang as $lang => $langtext) {
//    $TRANS[0][$lang] = $lang;
//}
if(isset($_GET['new_lang']) and $_GET['new_lang'] != ''){
    
    require("lang/en.php");
    foreach ($TEXT as $key => $value) {
        $ORG[$key] = $value;
    }
    $lang = $_GET['new_lang'];

    $TEXT = null;
    if(file_exists("lang/$lang.php")){       
        require("lang/$lang.php");//load langauge file
    }
    
    $filepath = "temp/$lang.php";
    
    $op = fopen($filepath,"w");
    try{
        $TRANS[0] = array('key' => 'key', 'value' => 'value', 'need'=>null);
        fwrite($op, "<?php\r\n\r\n");
        foreach ($ORG as $key => $value) {
            $remark = false;
            if($TEXT[$key]){
                $new = $TEXT[$key];
            }else{
                $new = $value;
                $remark = true;
            }
            $TRANS[$key] = array('key'=>$key, 'value'=>$new, 'need' => $remark);
            $str = '$TEXT['."'$key'".'] = "'.$new.'";';
            if($remark){
                $str .= '   //To be translated items';
            }
            $str .= "\r\n";
            fwrite($op, $str);
        }
        if($_GET['show']){
            echo table($TRANS);
        }else{
            downfile($filepath);
        }
    }catch(Exception $e){
        echo $e->getMessage();
    }
    fclose($op);
}else{
	echo 'no lanuage';
}

 
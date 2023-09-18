<?php
session_start();
include_once('config.inc.php');
include_once('lang.inc.php');

if(isset($_POST['file_name'])){
    if (isset($_SESSION['logined']) and $_SESSION['logined']) {
        if(isset($_POST['file_data'])){
            $flag = $_POST['file_name'];
            $file = "history-$flag.html";
            $file = str_replace(' ', '_', $file);
            $file = iconv('UTF-8', 'GBK', $file);
            $data = $_POST['file_data'];//download file data
            $his = json_decode(trim($data,chr(239).chr(187).chr(191)), true);
            $t1 = $his['t1'];
            $t2 = $his['t2'];
            $items = $his['item'];
            $count = count($items);
            $ret = '<html><title>'.$TEXT['report-triplog'].'|'.$flag.'</title>'
            .'<meta http-equiv="content-type" content="text/html; charset=UTF-8" />'
            .'<style type="text/css">'
            .'html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-size: small; font-family: Arial, Tahoma; overflow: hidden; background: #fff; }'
            .'table { width: 100%; border-collapse: collapse; overflow: hidden; }'
            .'table th { border: 1px solid #ccc; background-color:#D5D5D5; font-size: 110%; line-height:120%; font-weight:bold; padding:4px; text-align:left; }'
            .'table td { border: 1px solid #D5D5D5; font-size: 90%; padding: 3px; }'
            .'#canvas {position: absolute; margin: 0; top: 0; bottom: 0; left: 0; right: 0; overflow-y: scroll;}'
            .'</style></head><body><div id="canvas">'
            .'<table><thead>'
            .'<tr><td colspan="3">'.$TEXT['info-objectflag'].':</td><td colspan="4">'.$flag.'</td></tr>'
            .'<tr><td colspan="3">'.$TEXT['status-totalrecords'].':</td><td colspan="4">'.$count.'</td>'
            .'<tr><td colspan="3">'.$TEXT['info-daterange'].':</td><td colspan="4">'.$t1.' to '.$t2.'</td></tr>'
            .'<tr><th>'.$TEXT['report-no'].'</th><th>'.$TEXT['info-longitude'].'</th><th>'.$TEXT['info-latitude'].'</th><th>'.$TEXT['navi-speed'].'</th><th>'.$TEXT['info-heading'].'</th><th>'.$TEXT['info-gpstime'].'</th><th>'.$TEXT['info-revtime'].'</th><th>'.$TEXT['navi-targetstatus'].'</th></tr>'
            .'</thead><tbody>';
            $sn = 0;
            foreach($items as $item){
                $sn += 1;
                $ret .= '<tr>'
                    .'<td>'.$sn.'</td>'
                    .'<td>'.sprintf('%.6f', $item['x']/1000000).'</td>'
                    .'<td>'.sprintf('%.6f', $item['y']/1000000).'</td>'
                    .'<td>'.$item['s'].'</td>'
                    .'<td>'.$item['d'].'</td>'
                    .'<td>'.$item['tg'].'</td>'
					.'<td>'.$item['ts'].'</td>'
                    .'<td>'.$item['e'].'</td>'
                    .'</tr>';
            }
            $ret .= '</tbody></table></div></body></html>';
            header('Cache-control: private');
			//header ( "Content-type:application/vnd.ms-excel" );
			//header ( "Content-Disposition:filename=csat.xls" );
            header("Content-type: text/html; charset=UTF-8");
            header("Content-Disposition: attachment; filename=$file");
            header("Pragma: no-cache");
            header("Expires: 0");
            echo $ret; 
        }else{
            $file = base64_decode($_POST['file_name']);
			$file = str_replace('\\', '/', $REPORT_PATH . $file);
            $file = iconv('UTF-8', 'GBK', $file);
            if(file_exists($file)){
                $name = $_POST['file_alias'] == "" ? basename($file) : $_POST['file_alias'];
                $name = str_replace(' ', '_', $name);
                $len = filesize($file);
                ob_end_clean();
                header("Pragma: public");  
                header("Expires: 0");  
                header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                header("Cache-Control: public");
                header("Content-Description: File Transfer");
                header("Content-type: application/vnd.ms-excel");
                header("Content-Disposition: attachment; filename=$name;");
                header("Content-Transfer-Encoding: binary");
                header("Content-Length: $len");
                readfile($file); 
            }else{
                echo 'not exists';
            }
        }
    }else{
        echo 'no login';
    }
}	
?>
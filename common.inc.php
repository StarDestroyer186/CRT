<?php
include_once('lang.inc.php');
include_once('config.inc.php');
include_once('smtp.class.php');

function filterParam($param){
	 $param = str_replace(";", "", $param);
	 $param = str_replace("--", "", $param);
	 $param = str_replace("'", "", $param);
	 return $param;
}

/*
 * custom timezone convert to server timezone
 * server = time + (server - client) * 3600
 */
function toServerTime($time, $timezone) {    
    return date('Y-m-d H:i:s', $time + ($GLOBALS['SERVER_TIMEZONE'] - $timezone) * 3600);
}

function toDate($time){
    return date('Y-m-d', $time);
}
/*
 * server timezone convert to client timezone
 * sample:
 * server = +8
 * client = +7.5
 * result = time - (server - client) * 3600
 */
function toCustomTime($time, $timezone, $datetimefmt = null) {
    if($time != null){
        $endtime = $time->getTimestamp() - ($GLOBALS['SERVER_TIMEZONE'] - $timezone) * 3600;
        return date('Y-m-d H:i:s', $endtime);
		/*客户端自己转换时间格式
		if ($datetimefmt) {
            return date($datetimefmt, $endtime);
        } else {
            return date('Y-m-d H:i:s', $endtime);
        }*/
		
    }else{
        return '';
    }
}
function toCustFmtTime($time, $datetimefmt){
    if($time != null){
        return date('Y-m-d H:i:s', $time->getTimestamp());
		/*客户端自己转换时间格式
		if ($datetimefmt) {
            return date($datetimefmt, $time->getTimestamp());
        } else {
            return date('Y-m-d H:i:s', $time->getTimestamp());
        }
		*/
    }else{
        return '';
    }
}

function startwith($str,$pattern) {
    return (strpos($str,$pattern) === 0) ? true : false;
}

//发送邮件 
function sendmail($mail_host,$mail_port,$from,$mail_username,$mail_password,$to,$subject,$emailbody){ 
	$smtpserver = $mail_host; 
	$smtpserverport = $mail_port ;  
	$smtpusermail = $from;  
	$smtpuser = $mail_username; 
	$smtppass = $mail_password; 
	$smtp = new \Think\Smtp($smtpserver,$smtpserverport,true,$smtpuser,$smtppass);
	$emailtype = "HTML";
	$smtpemailto = $to; 
	$smtpemailfrom = $smtpusermail; 
	$emailsubject = "=?UTF-8?B?".base64_encode($subject)."?="; 
	$rs = $smtp->sendmail($smtpemailto, $smtpemailfrom, $emailsubject, $emailbody, $emailtype);
	return $rs; 
}

function secondsToWords($seconds){
    $TEXT = $GLOBALS['TEXT'];
	$ret = "";

    /*** get the days ***/
    $days = intval(intval($seconds) / (3600*24));
    if($days> 0)
    {
        $ret .= "$days " . $TEXT['js-dhms-day'];
    }

    /*** get the hours ***/
    $hours = (intval($seconds) / 3600) % 24;
    if($hours > 0)
    {
        $ret .= " $hours " . $TEXT['js-dhms-hour'];
    }

    /*** get the minutes ***/
    $minutes = (intval($seconds) / 60) % 60;
    if($minutes > 0)
    {
        $ret .= " $minutes " . $TEXT['js-dhms-min'];
    }

    /*** get the seconds ***/
    $seconds = intval($seconds) % 60;
    if ($seconds > 0) {
        $ret .= " $seconds " . $TEXT['js-dhms-second'];
    }

    return $ret;
}

function getIonValue($io, $iotable){
	$ios = explode(',', $iotable); 
	for($i = 0; $i < count($ios); $i++){
		 if(strpos($ios[$i], $io . ":") === 0){
			 return $ios[$i] . ",";
		 }
	} 
	return '';
}

function getIoValue($io, $iotable){
	$ios = explode(',', $iotable); 
	for($i = 0; $i < count($ios); $i++){
		 if(strpos($ios[$i], $io . ":") === 0){
			 $value = explode(':', $ios[$i]);
			 return $value[1];
		 }
	} 
	return '';
}

function removeIoValue($io, $iotable){
	$ioValue = "," . $io .":". getIoValue($io, $iotable);
	return str_replace($ioValue,"",$iotable);
}


/*
 * array to json
 */
function array2json($array) {
    return json_encode($array);;
}
/*
 * filter speed by device stauts
 */
function filterSpeed($status){
    $p1 = strpos($status, "3005");//ACC ON
    if($p1 && $p1 >= 0 && $p1 % 4 == 0){
        return 0;
    }else{
        $p2 = strpos($status, "3006");//ACC OFF
        if($p2 && $p2 >= 0 && $p2 % 4 == 0){
            return 1;
        }else{
            return 2;
        }
    }
}

function getDeviceStatus($status){
    $TEXT = $GLOBALS['TEXT'];
    for($i=0; $i<intval(strlen($status)/4); $i++){
        $state = strtoupper(substr($status, $i * 4, 4));
        $txt = $TEXT[$state];
        if(isset($txt)){
            $output[] = $txt;
        }
    }
    if(isset($output)){
        return implode (',', $output);
    }else{
        return '';
    }
}

function speedUnitConversion($value){
	$unit_speed = isset($_SESSION['unit_speed']) ? $_SESSION['unit_speed'] : 0;
	
	if($unit_speed == 1 && $value >= 0){
		//mph
		$value = round($value * 0.6213712,0);
	}
	//kph
	return $value;
}

function mileageUnitConversion($value){
	$unit_dist = isset($_SESSION['unit_distance']) ? $_SESSION['unit_distance'] : 0;
	
	if($unit_dist == 1 && $value >= 0){
		//Mile(英里)
		$value = $value * 0.6213712;		
	}else if($unit_dist == 2 && $value >= 0){
		//Nautical mile(海里)
		$value = $value * 0.5399568;		
	}
	//Kilometer(公里)
	return $value = round($value,2);
}

function fuelUnitConversion($value){
	$unit_fuel = isset($_SESSION['unit_fuel']) ? $_SESSION['unit_fuel'] : 0;
	
	if($unit_fuel == 1 && $value >= 0){
		//Gallon(加仑)
		$value = round($value * 0.2199692);		
	}
	//liter
	return round($value,0);
}

function tempUnitConversion($value){
	$unit_temp = isset($_SESSION['unit_temperature']) ? $_SESSION['unit_temperature'] : 0;
	
	if($unit_temp == 1 && $value >= 0){
		//Fahrenheit
		$value = $value * 1.8 + 32;
	}
	//Celsius
	return round($value,1);
}

function altitudeUnitConversion($value){
	$unit_altitude = isset($_SESSION['unit_altitude']) ? $_SESSION['unit_altitude'] : 0;
	
	if($unit_altitude == 1 && $value >= 0){
		//ft(英尺)
		$value = $value * 3.28083989501;
	}
	//meter
	return round($value, 0);
}

function getDeviceIoParam($params, $sensorParams, &$ios, $online, $command, $realtime = false){
	$timezone = isset($_SESSION['timezone']) ? (float) $_SESSION['timezone'] : 0;
	$unit_speed = isset($_SESSION['unit_speed']) ? $_SESSION['unit_speed'] : 0;
	$unit_dist = isset($_SESSION['unit_distance']) ? $_SESSION['unit_distance'] : 0;
	$unit_fuel = isset($_SESSION['unit_fuel']) ? $_SESSION['unit_fuel'] : 0;
	$unit_temp = isset($_SESSION['unit_temperature']) ? $_SESSION['unit_temperature'] : 0;
	$datetime_fmt = isset($_SESSION['datetime_fmt']) ? $_SESSION['datetime_fmt'] : 0;
	$unit_altitude = isset($_SESSION['unit_altitude']) ? $_SESSION['unit_altitude'] : 0;
	
    $array = explode(',', $ios);
    if($array != null){
        foreach($array as $item){
            if($item != ''){
                $ret = explode(':', $item);
                $id = hexdec('0x'.$ret[0]);	
				$isvf = false;
				
				//替换sensor名称和格式和option
				if(isset($sensorParams) && isset($sensorParams[$id])){
					if(isset($sensorParams[$id]['sn']) && strlen($sensorParams[$id]['sn']) > 0){
						$params[$id]['attrib'] = $sensorParams[$id]['sn'];
						
						/***
						1:digital
						2:formula
						3:dictionary(option)
						4:calibration(linear)
						5:percentage
						6:String(change element name)
						*/
						if($sensorParams[$id]['st'] == 1){	
							$params[$id]['vformat'] = '';
							
							$dv = explode(' ', $ret[1]);
							//如果digital带时间参数
							if(count($dv) == 2){
								if($dv[0] == '0'){
									$params[$id]['voption'] = '0=' . $sensorParams[$id]['sd0'] .' '. secondsToWords((int)$dv[1]) . ';1='. $sensorParams[$id]['sd1'];
								}else{
									$params[$id]['voption'] = '0=' . $sensorParams[$id]['sd0'] . ';1='. $sensorParams[$id]['sd1'] .' '. secondsToWords((int)$dv[1]);
								}
								$ret[1] = $dv[0];
							}else{
								$params[$id]['voption'] = '0=' . $sensorParams[$id]['sd0'] . ';1='. $sensorParams[$id]['sd1'];
							}
						}else if($sensorParams[$id]['st'] == 3){
							$params[$id]['vformat'] = '';
							$params[$id]['voption'] = $sensorParams[$id]['di'];
						}else{
							$params[$id]['vformat'] = $sensorParams[$id]['vf'];
							$params[$id]['voption'] = '';
						}
						$isvf = true;
					}
				}
				
				//去掉设备不支持的IO元素				
				if(!isset($params[$id])){
					$ios = removeIoValue($ret[0],$ios);
					continue;
				}
				
                $func = $params[$id]['attfunc'];
				//if($func=='GEO' || $func=='MAT' || $func=='NGEO' || $func=='NPOI' || $func=='IGEO' || $func =='ENGH'){
					$value = $ret[1];
				//}else{
				//	$value = (int)$ret[1];
				//}
				
                if($func=='DIV10'){
                    $value = $value / 10;
                }
				
				/*里程单位转换*/
				if($unit_dist == 1 && ($id == 10 || $id == 63 || $id == 246 || $id == 290 || $id == 293)){
					//Mile(英里)
					$value = mileageUnitConversion($value);//$value * 0.6213712;
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : 'mi');
					}
				}else if($unit_dist == 2 && ($id == 10 || $id == 63 || $id == 246 || $id == 290 || $id == 293)){
					//Nautical mile(海里)
					$value = mileageUnitConversion($value);//$value * 0.5399568;
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : 'nmi');
					}
				}else if($unit_dist == 0 && ($id == 10 || $id == 63 || $id == 246 || $id == 290 || $id == 293)){
					//Kilometer(公里)
					$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : 'km');
				}else if($realtime && ($id == 94 || $id == 66 || $id == 96)){
					//不重复显示司机名和速度和司机号码
					$ios = removeIoValue($ret[0],$ios);
					continue;
				}else if($id == 67 || $id == 68 /*|| $id == 69*/){
					//去掉不解析状态的IO元素94,66,67,68,69,81
					$ios = removeIoValue($ret[0],$ios);
					continue;
				}
				else if($id == 81){
					//解析胎压
					$tires = explode('&', $ret[1]);
					$tvalue = '';
					foreach ($tires as $tire){
						$t = explode('*', $tire);
						if(count($t) == 4){
							$tvalue = $tvalue . $t[0] .'='. round($t[1],1) . ', ';
						}											
					}
					$value = substr($tvalue, 0, strlen($tvalue) - 2);
					//echo 'tire=' . $value;
				}
				
				if($unit_dist == 1 && ($id == 14 || $id == 15)){
					//Mile(英里)
					$dist_index = strripos($value, " ") + 1;
					$dist_len = strlen(substr($value,$dist_index)) - 2;
					$dist = round(mileageUnitConversion((float)substr($value,$dist_index,$dist_len)),2);
					$value = substr($value,0,$dist_index) .'('. $dist . ' mi)';
				}else if($unit_dist == 2 && ($id == 14 || $id == 15)){
					//Nautical mile(海里)
					$dist_index = strripos($value, " ") + 1;
					$dist_len = strlen(substr($value,$dist_index)) - 2;
					$dist = round(mileageUnitConversion((float)substr($value,$dist_index,$dist_len)),2);
					$value = substr($value,0,$dist_index) .'('. $dist . ' nmi)';
				}else if($unit_dist == 0 && ($id == 14 || $id == 15)){
					//Kilometer(公里)
					$dist_index = strripos($value, " ") + 1;
					$dist_len = strlen(substr($value,$dist_index)) - 2;
					$dist = round((float)substr($value,$dist_index,$dist_len),2);
					$value = substr($value,0,$dist_index) .'('. $dist . ' km)';
				}
				
				if($unit_speed == 1 && $id == 60){
					//mph(英里/小时)
					$value = round(speedUnitConversion($value),0);
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : ' mph');
					}
				}else if($unit_speed == 0 && $id == 60){
					$value = $value;
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : ' kph');
					}
				}
				
				if($unit_altitude == 1 && $id == 27){
					//ft(英尺)
					$value = altitudeUnitConversion($value);
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : ' ft');
					}
				}else if($unit_altitude == 0 && $id == 27){
					$value = $value;
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : ' m');
					}
				}
				
				/*油量单位转换*/
				if($unit_fuel == 1 && ($id == 30 || $id == 31 || $id == 80)){
					//Gallon(加仑)
					$value = round(fuelUnitConversion($value));
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : 'gal');
					}
				}else if($unit_fuel == 0 && ($id == 30 || $id == 31 || $id == 80)){
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : 'L');
					}
				}
				
				/*温度单位转换*/
				if($unit_temp == 1 && ($id == 72 || $id == 73)){
					//Fahrenheit
					$value = tempUnitConversion($value);
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : '℉');
					}
				}else if($unit_temp == 0 && ($id == 72 || $id == 73)){
					if($params[$id]['vformat'] != ''){
						$params[$id]['vformat'] = $params[$id]['vformat'] . ($isvf ? "" : '℃');
					}
				}
												
                $attrib = $params[$id]['attrib'] . ': ';
				
                if($params[$id]['vformat'] != ''){
                    $output[] = $attrib . sprintf($params[$id]['vformat'], $value);
                }else if($func=='DHMS' /*&& $online == 1*/){
					$output[] = $attrib . secondsToWords((int)$value);
				}else if($func=='LENG'){
					$output[] = $attrib . toCustomTime(new DateTime(date('Y-m-d H:i:s', (int)$value)), $timezone, $datetime_fmt);
				}else if($func=='CMID'){
					$output[] = $attrib . $command[(int)$value];
				}
				else if($params[$id]['voption'] != ''){
                    $subs = explode(';', $params[$id]['voption']);
                    foreach ($subs as $item){
                        $ret = explode('=', $item);
                        if($value == (int)$ret[0]){
                            $output[] = $attrib . $value . '('. $ret[1] .')';
                            break;
                        }else{
                            $vls = explode('..', $ret[0]);
                            if(count($vls) == 2 && $value >= (int)$vls[0] && $value <= (int)$vls[1]){
                                $output[] = $attrib . $value . '('. $ret[1] .')';
                                break;
                            }
                        }
                    }
                }else{
					$output[] = $attrib . sprintf('%s', $value);
				}
            }
        }
    }
    if(isset($output)){
        return implode ("<br> ", $output);
    }else{
        return '';
    }
}

function getInfoByJson($ioparams, $sensorParams, $data){
    $lastgid = 0;
    $ncnt = -1;
    $timezone = isset($_SESSION['timezone']) ? (float) $_SESSION['timezone'] : 0;
	$unit_speed = $_SESSION['unit_speed'];
	$unit_altitude = $_SESSION['unit_altitude'];
	$TEXT = $GLOBALS['TEXT'];
    foreach ($data as $row) {
        if ($row != null) {
            $gid = $row['gid'];
			
			//before 24 hours
			if($row['t'] != null && (round(strtotime(date('Y-m-d H:i:s',time())) - $row['t']->getTimestamp())/86400) >= 1){
				$row['io'] = removeIoValue("3C",$row['io']);
				$row['io'] = removeIoValue("3D",$row['io']);
				$row['io'] = removeIoValue("3E",$row['io']);
				$row['io'] = removeIoValue("3F",$row['io']);
				
				$row['q'] = removeIoValue("3C",$row['q']);
				$row['q'] = removeIoValue("3D",$row['q']);
				$row['q'] = removeIoValue("3E",$row['q']);
				$row['q'] = removeIoValue("3F",$row['q']);
			}
			
            $row['t'] = toCustomTime($row['t'], $timezone, $_SESSION['datetime_fmt']);
			$row['ts'] = toCustomTime($row['ts'], $timezone, $_SESSION['datetime_fmt']);
			$row['ex'] = toCustomTime($row['ex'], $timezone, $_SESSION['datetime_fmt']);
			
			//speed unit
			/*if($unit_speed == 1 && $row['s'] >= 0){
				//mph(英里/小时)
				$row['s'] = round($row['s'] * 0.6213712,0);
			}*/
			$row['s'] = speedUnitConversion($row['s']);
			
			//altitude unit
			/*if($unit_altitude == 1 && $row['h'] >= 0){
				//英尺
				$row['h'] = round($row['h'] * 3.28083989501,0);
			}*/
			$row['h'] = altitudeUnitConversion($row['h']);
			
            $status = $row['e'];           
			if($status != ''){
                $row['e'] = "<br> " . $TEXT['navi-generalstatus'] .': '.getDeviceStatus($status);               
				/*
				if($row['on'] == 1){
                    //0=ACC ON; 1=ACC OFF; 2=OTHER
                    $over = filterSpeed($status);
                    if($over > 0){
                        if($over == 1){
                            $row['s'] = 0;
                        }else{
                            $row['s'] = $row['s'] > 2 ? $row['s'] : 0;
                        }
                    }
                }else{
                    if($row['s'] >= 0){
                        $row['s'] = 0;
                    }
                }*/
            }
            if($row['io'] != ''){
                $pid = $row['pid'];
                $row['e'] = getDeviceIoParam($ioparams[$pid], $sensorParams[$row['n']], $row['io'], $row['on'], $ioparams['command'], true) . $row['e'];
            }
            unset($row['q']);
            if ($lastgid != $gid) {
                $ncnt++;
                $lastgid = $gid;
                $gtxt = $row['gtxt'];
                array_splice($row, 0, 3);                
                $result[$ncnt] = array('gid' => $gid, 'gtxt' => $gtxt, 'item' => array($row));
				print_r($row);
				die;
            } else {
                array_splice($row, 0, 3);
                array_push($result[$ncnt]['item'], $row);
            }
        }
    }
    $json = array2json($result);
    return $json;
}
?>

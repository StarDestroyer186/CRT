<?php

// 显示所有信息，默认显示 INFO_ALL
//phpinfo();

/*$date = new DateTime();
$timeZone = $date->getTimezone();
var_dump($timeZone);// $timeZone->getName();
*/
/*$date = new DateTime();
$date->setTimezone(new DateTimeZone(ini_get('date.timezone')));
*/
//echo ini_get('date.timezone');
//echo gmdate('Y-m-d H:i:s', time() + 3600 * $h);

/*$tz = timezone_open(date_default_timezone_get());
$dateTimeOslo = date_create("now",timezone_open("Etc/GMT"));

echo timezone_offset_get($tz,$dateTimeOslo)/3600;*/
//echo var_dump(time());

//echo date('Y-m-d H:i:s',time());
echo date('Y-m-d 00:00:00', strtotime("+1 year"));

?>
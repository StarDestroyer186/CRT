<?php
$support_lang = array(
	"en" => "English",
	"zh_CN" => "中文(简体)",
	"zh_TW" => "中文(繁体)",
    "ar" => "عربي",
	"es" => "Español",
	"vi" => "Việt",
	"fr" => "Français",
	"pl" => "Polski",
	"it" => "Italiano",
	"pt" => "Português",
	"ru" => "Pусский",
	"id" => "Indonesia",
	"th" => "ไทย",
	"gr" => "Ελληνικά",
	"de" => "Deutsch");
	
$support_server = array(

);
/*
$support_datefmt = array(
	"yyyy-MM-dd" => "Y-m-d",
	"MM-dd-yyyy" => "m-d-Y");

$support_timefmt = array(
	"HH:mm:ss" => "H:i:s");
*/
$support_datefmt = array(
	"yyyy-MM-dd" => "Y-m-d",
	"MM-dd-yyyy" => "m-d-Y",
	"dd-MM-yyyy" => "d-m-Y",
	"yyyy/MM/dd" => "Y/m/d",
	"dd.MM.yyyy" => "d.m.Y",
	"dd MM yyyy" => "d m Y");

$support_timefmt = array(
	"HH:mm:ss" => "HH:i:s",
	"H:mm:ss" => "H:i:s",
	"hh:mm:ss a" => "hh:i:s A",
	"hh:mm:ss p" => "hh:i:s a",
	"h:mm:ss a" => "h:i:s A",
	"h:mm:ss p" => "h:i:s a");
	
$default_latlng = array(
	"lng" => 113.052491,
	"lat" => 23.84375,
	"zoom" => 5);
	
$debug = true;
$last_name['index.js'] = $debug ? 'index.soc.js' : 'index.min.js';               
$last_name['devicelist.js'] = $debug ? 'devicelist.soc.js' : 'devicelist.min.js';      
$last_name['mindex.js'] = $debug ? 'mindex.soc.js' : 'mindex.min.js';              
$last_name['mdevicelist.js'] = $debug ? 'mdevicelist.soc.js' : 'mdevicelist.min.js';   
$last_name['map.operat.js'] = $debug ? 'map.operat.soc.js' : 'map.operat.min.js';      
$last_name['map.leaflet.js'] = $debug ? 'map.leaflet.soc.js' : 'map.leaflet.min.js';  

$last_ver['jquery.min.js'] = '1.6.2';
$last_ver['style.css'] = '2.2.071';
$last_ver['common.js'] = '2.2.070';
$last_ver['devicelist.js'] = '2.2.094';
$last_ver['index.js'] = '2.2.094';
$last_ver['playback.js'] = '2.2.054';
$last_ver['manage.js'] = '2.2.256';
$last_ver['stastics.js'] = '2.2.256';
$last_ver['timepicker.js'] = '2.2.019';
$last_ver['table2csv.js'] = '2.2.016';
$last_ver['map.operat.js'] = '2.2.061';
$last_ver['map.leaflet.js'] = '2.2.061';
$last_ver['map.ol.js'] = '1.24.019';
$last_ver['map.google.v3.js'] = '2.2.014';
$last_ver['geo.google.v3.js'] = '2.2.014';
$last_ver['ext.google.v3.js'] = '2.2.014';
$last_ver['service.seat.js'] = '22.07.07';
$last_ver['androidapp.js'] = '10.0';
$last_ver['iphoneapp.js'] = '4.1';
$last_ver['mobile.js'] = '1.0.1';
$last_ver['routing_machine_url'] = 'http://router.project-osrm.org/route/v1';
$last_ver['google_map_type'] = 0;  //0: free  1: not free
$last_ver['google_map_base_link'] = 'https://www.google.com';
$last_ver['google_map_v3_key'] = '';
$last_ver['bing_map_key'] = '';
$last_ver['mapbox_map_key'] = '';
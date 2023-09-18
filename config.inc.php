<?php
$db_host = '127.0.0.1,1433';//127.0.0.1'
$db_dbms = 'ANB-GPSDB';
$db_user = 'sa';
$db_pass = 'qwe789/*';

$mail_host = '';
$mail_port = 25;
$mail_username = '';
$mail_password = '';
$mail_default_from = '';

$REPORT_PATH = '\EmailReportServer\bin/';
$GLOBAL_HOST = '127.0.0.1';
$GLOBAL_PORT = 11211;
$GLOBAL_USER = "aaulist_$db_dbms";//每个网站实例都应该设置为不同的前缀
$GLOBAL_UNIT = "aadlist_$db_dbms";//同上
$GLOBAL_IOSP = "ioprm_$db_dbms";
$GLOBAL_SENP = "senprm_$db_dbms";
$GLOBAL_EVENT = "event_$db_dbms";
$GLOBAL_EVENT_PUSH_PASS = "123bnm";
$GLOBAL_EVENT_PUSH_INTERVAL = 20;
$GLOBAL_LOAD = 2000;//登录时每个包最大车辆数
$GLOBAL_MIM_UPDATE = 10;//对象列表最小更新间隔,单位：秒
$GLOBAL_UPDATE_ALL = false; 
$GLOBAL_EVENT_HOUR = -24; //web显示最近小时事件
$GLOBAL_DOWNLOAD_MAX_POINTS = 100000; //下载历史记录和报表最大点数
$GLOBAL_DEVICE_OFFLINE_TIMEOUT=0;//超过次时间无数据显示为掉线状态，否则显示为在线状态,单位：秒
$GLOBAL_REFUEL_RATE = 0.075;//加油事件油量每秒变化率(升)
$GLOBAL_STEALFUEL_RATE = 0.075;//偷油事件油量每秒变化率(升)
$GLOBAL_FUEL_EVENT_TIME_DIFFERENCE=180;//偷油、加油事件判断间隔(秒)
$GLOBAL_DEVICE_ID_EDITABLE = false;
$SESSION_TIME = 20;
$DELINE_TIME = 10;


$tz = timezone_open(date_default_timezone_get());
$dateTimeGMT = date_create("now",timezone_open("Etc/GMT"));
$SERVER_TIMEZONE = timezone_offset_get($tz,$dateTimeGMT)/3600;
?>
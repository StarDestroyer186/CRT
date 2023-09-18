<?php

include_once('config.inc.php');

$memcache = memcache_connect($GLOBAL_HOST, $GLOBAL_PORT);
if ($memcache) {
    memcache_set($memcache, $GLOBAL_USER, null, 0, 0);
    memcache_close($memcache);
}
echo 'stopped: '.Date('Y-m-d H:i:s', time());
?>

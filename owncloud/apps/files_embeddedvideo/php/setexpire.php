<?php

// vlc windows plugin doesnt get session cookies

OCP\User::checkLoggedIn();

$timeout	= $_GET[ 'timeout' ];
$vidId		= $_GET[ 'vidId' ];
$vidInfo	= unserialize( @file_get_contents( sys_get_temp_dir().'/'.$vidId.'.fev' ) );

$vidInfo[ 'expire' ] = time() + $timeout;

file_put_contents( sys_get_temp_dir().'/'.$vidId.'.fev', serialize( $vidInfo ) );

?>

<?php

// vlc windows plugin doesnt get session cookies

OCP\User::checkLoggedIn();

$filename = $_GET["dir"] . "/" . $_GET["file"];

if( ! \OC\Files\Filesystem::file_exists( $filename ) ) {
	header("HTTP/1.0 404 Not Found");
	$tmpl = new OCP\Template( '', '404', 'guest' );
	$tmpl->assign('file',$filename);
	$tmpl->printPage();
	exit;
}

$vidInfo = array();
$vidInfo[ 'file' ]	= \OC\Files\Filesystem::getLocalFile( $filename );
$vidInfo[ 'expire' ]	= time() + ( 60 * 5 );

$vidId = \OCP\Util::generateRandomBytes( 5 );
file_put_contents( sys_get_temp_dir().'/'.$vidId.'.fev', serialize( $vidInfo ) );

echo $vidId;

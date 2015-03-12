<?php

$result = @file_get_contents( 'http://tinyurl.com/api-create.php?url='.$_GET[ 'url' ] );

if ( $result === false ) {
	header( 'HTTP/1.0 404 Not Found' );
	exit;
}

echo $result;

?>

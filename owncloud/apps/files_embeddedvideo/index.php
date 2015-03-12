<?php

OCP\User::checkLoggedIn();
OCP\App::checkAppEnabled('files_embeddedvideo');
OCP\App::setActiveNavigationEntry('files_embeddedvideo_index');

OCP\Util::addStyle('files_embeddedvideo', 'style');

$tmpl = new OCP\Template('files_embeddedvideo', 'index', 'user');
$tmpl->printPage();

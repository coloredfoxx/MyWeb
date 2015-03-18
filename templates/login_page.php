<?php
session_start();

if (isset($_POST)) 
{
    if (($_POST['username'] == 'user') && ($_POST['password'] == 'admin')) 
    {
        echo 'You are now logged in.<br>';
        header("Location: internal_page.html");
        exit;
    }
    else 
    {
        echo 'Invalid login.<br>';
        exit;
    }
}
?> 


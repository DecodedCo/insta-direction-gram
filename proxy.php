<?php
//$url = "https://maps.googleapis.com/maps/api/directions/json?origin=18+Nepal+Park+Singapore&destination=Changi&sensor=false&key=AIzaSyBonQprqCosH6xXPZOYR3CRzwL7BbZL0ig";
$location = urlencode($_GET['location']);
$destination = urlencode($_GET['destination']);
$url = "https://maps.googleapis.com/maps/api/directions/json?origin=" . $location . "&destination=" . $destination. "&sensor=false&key=AIzaSyBonQprqCosH6xXPZOYR3CRzwL7BbZL0ig";
$file = file_get_contents( $url );
echo $file;
?>

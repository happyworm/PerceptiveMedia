<?php

	header('Content-type: application/xml; charset=UTF-8');
	header('Cache-control: no-cache');
	header('Pragma: no-cache');
	header('Expires: 0');

	// This script is from:
	// http://phpsense.com/2007/php-curl-functions/


	// Suggest we implement simple caching... The concept of which is demonstrated here:
	// http://www.gayadesign.com/diy/caching-external-data-in-php/


	/*
	 * Initialize the cURL session
	 */
	$ch = curl_init();

	/*
	 * Set the URL of the page or file to download.
	 */
	curl_setopt($ch, CURLOPT_URL, 'http://www.filmdates.co.uk/rss/out-this-week/');

	/*
	 * Ask cURL to return the contents in a variable instead of simply echoing them to  the browser.
	 */
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	/*
	 * Execute the cURL session
	 */
	$contents = curl_exec ($ch);

	/*
	 * Close cURL session
	 */
	curl_close ($ch);

	echo $contents;
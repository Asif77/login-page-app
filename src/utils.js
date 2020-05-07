
import React from 'react';
import { Link, Typography } from '@material-ui/core';

export function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://www.Ultimus.com/">
				Ultimus Inc.
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

export function getEikEndpoint() {
  const endpoint = window.env ? window.env.EIK_ENDPOINT : null;
  console.log('getEikEndpoint: ', endpoint);
  return endpoint;
}
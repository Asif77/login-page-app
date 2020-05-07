import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, CssBaseline, Box, Button } from '@material-ui/core';
import logo from './images/logo.png';
import  { getEikEndpoint, Copyright } from  './utils';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	logo: {
		margin: theme.spacing(1),
		width: '300px',
		height: '80px'
	},
	formStatusMessage: {
		margin: theme.spacing(4)
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	singout: {
		margin: theme.spacing(3, 0, 1)
	},
	wrapIcon: {
		verticalAlign: 'middle',
		display: 'inline-flex'
	}
}));

export default function Signout(props) {
	const classes = useStyles();
	const [ protocol, setProtocol ] = React.useState('http');
	const [ hostname, setHostname ] = React.useState('');
	const [ logoutSuccess, setLogoutSuccess ] = useState(false);
	const [ isError, setIsError ] = useState(false);
	const eikApiPort = 5321;

	useEffect(() => {
		let parser = document.createElement('a');
		parser.href = window.location.href;
		const protocol = parser.protocol;
		const hostname = parser.hostname;
		setProtocol(protocol);
		setHostname(hostname);
	}, []);

	const handleSignout = () => {
		const { sessionId } = props;
		let endpoint = getEikEndpoint();
		endpoint = endpoint ? endpoint : `${protocol}//${hostname}:${eikApiPort}`;
		const url = `${endpoint}/Api/v1.0/EIK/Logout`;
		console.log(url);

		const fetchData = async () => {
			try {
				const result = await axios({
					method: 'post',
					url: url,
					data: {
						SessionId: sessionId
					}
				});

				if (result.status === 200)
					setLogoutSuccess(true);
				console.log(result);

			} catch (error) {
				console.log(error);
				setIsError(true);
			}
		};
	
		fetchData();
	}

	const handleClose = () => {
		window.open('about:blank', '_self');
		window.close();
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<img className={classes.logo} alt="Logo" src={logo} align="center" />
				<Typography className={classes.formStatusMessage} variant="h5">
					Form Submitted Successfully
				</Typography>
				<form className={classes.form}>
					{!logoutSuccess ? 
						<Button
							margin="normal"
							fullWidth
							variant="contained"
							color="primary"
							onClick={handleSignout}
							className={classes.singout}
						>
							Sign out
						</Button> : 
						<Typography variant="h5" align="left">
							Signout success..
						</Typography>}
					{isError && (
						<Typography variant="body2" color="error" align="left">
							Signout failed..
						</Typography>
					)}
					<Button
						margin="normal"
						fullWidth
						variant="contained"
						color="primary"
						onClick={handleClose}
						className={classes.singout}
					>
						Close
					</Button>					
				</form>
			</div>
			<Box mt={8}>
				<Copyright />
			</Box>
		</Container>
	);
}


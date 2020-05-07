import React, { useState, useEffect } from 'react';
import {
	Avatar,
	Button,
	MenuItem,
	Container,
	CssBaseline,
	TextField,
	Box,
	Typography,
	makeStyles
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from './images/ultimus.png';
import { getEikEndpoint, Copyright } from './utils';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

export default function SignIn(props) {
	const classes = useStyles();
	let location = useLocation();

	const [ user, setUser ] = useLocalStorage('user', '');
	const [ password, setPassword ] = React.useState('');
	const [ domain, setDomain ] = useLocalStorage('domain', '');

	const [ eikEndpoint, setEikEndpoint ] = React.useState('');
	const [ domains, setDomains ] = useState([ '' ]);
	const [ isError, setIsError ] = useState(false);
	const [ isUserError, setIsUserError ] = useState(false);
	const [ isGetDomainsError, setIsGetDomainsError ] = useState(false);

	const handleChangeUser = (event) => {
		setIsUserError(false);
		setUser(event.target.value);
	};

	const handleChangePassword = (event) => {
		setPassword(event.target.value);
	};

	const handleChangeDomain = (event) => {
		setDomain(event.target.value);
	};

	useEffect(() => {
		let parser = document.createElement('a');
		parser.href = window.location.href;
		const protocol = parser.protocol;
		const hostname = parser.hostname;
		const eikApiPort = 5321;

		let endpoint = getEikEndpoint();
		endpoint = endpoint ? endpoint : `${protocol}//${hostname}:${eikApiPort}`;
		setEikEndpoint(endpoint);
		const url = `${endpoint}/Api/v1.0/EIK/GetDomains`;
		console.log(url);

		const fetchData = async () => {
			try {
				const result = await axios(url);
				setDomains(result.data);
			} catch (error) {
				setIsGetDomainsError(true);
			}
		};

		fetchData();

		return () => {};
	}, []);

	const handleSubmit = (event) => {
		setIsError(false);

		if (!user) setIsUserError(true);

		const url = `${eikEndpoint}/Api/v1.0/EIK/Login`;
		console.log(url);
		const fetchData = async () => {
			try {
				const result = await axios({
					method: 'post',
					url: url,
					data: {
						Domain: domain,
						UserName: user,
						Password: password
					}
				});

				const returnParamString = 'returnParameter';
				let returnUrl = location.search;
				const pos = returnUrl.indexOf(returnParamString);
				returnUrl = pos >= 0 ? returnUrl.substring(pos + returnParamString.length + 1) : returnUrl;
				returnUrl = decodeURI(returnUrl);
				const qs = returnUrl.replace('SID=~', `SID=${result.data}`);
				const formAccessPath = '/UltWeb/';
				const redirectUrl = `${formAccessPath}${qs}`;
				console.log('redirectUrl: ', redirectUrl);
				window.location = redirectUrl;
			} catch (error) {
				console.log(error);
				setIsError(true);
			}
		};

		fetchData();
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar} alt="Ultimus" src={logo}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form className={classes.form}>
					<TextField
						error={isUserError}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="user"
						label="User"
						name="user"
						autoComplete="user"
						defaultValue={user}
						onChange={handleChangeUser}
						autoFocus
						helperText={isUserError ? 'Please enter user.' : ''}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						onChange={handleChangePassword}
					/>
					<TextField
						error={isGetDomainsError}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="filled-select-domain"
						select
						label="Doamin"
						value={domain}
						onChange={handleChangeDomain}
						helperText={isGetDomainsError ? 'Error getting domains' : ''}
					>
						{domains.map((domain) => (
							<MenuItem key={domain} value={domain}>
								{domain}
							</MenuItem>
						))}
					</TextField>
					<Button
						margin="normal"
						fullWidth
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						className={classes.submit}
					>
						Sign In
					</Button>
					{isError && (
						<Typography variant="body2" color="error" align="left">
							Login failed..
						</Typography>
					)}
				</form>
			</div>
			<Box mt={8}>
				<Copyright />
			</Box>
		</Container>
	);
}

function useLocalStorage(key, initialValue) {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [ storedValue, setStoredValue ] = useState(() => {
		try {
			// Get from local storage by key
			const item = window.localStorage.getItem(key);
			// Parse stored json or if none return initialValue
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			// If error also return initialValue
			console.log(error);
			return initialValue;
		}
	});

	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			// Save state
			setStoredValue(valueToStore);
			// Save to local storage
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.log(error);
		}
	};

	return [ storedValue, setValue ];
}

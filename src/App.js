import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as queryString from 'query-string';
import SignIn from './SignIn';
import Signout from './Signout';

export default function App() {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isSignout, setIsSignout ] = useState(false);
  const [ sessionId, setSessionId ] = useState('');
  const location = useLocation();

	useEffect(() => {
    const { search } = location;    
    const qs = queryString.parse(search);
    setIsSignout(qs.signout === 'true');
    setSessionId(qs.SessionID);
    setIsLoading(true);
	}, [location]);

	return (
    isLoading ? isSignout ? <Signout sessionId={sessionId} /> : <SignIn /> : ''
	);
}

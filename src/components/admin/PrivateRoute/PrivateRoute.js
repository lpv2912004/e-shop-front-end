import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('jwtToken');
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.Role.some(role => role.authority === 'ROLE_ADMIN')) {
        isAdmin = true;
      }
    } catch (error) {
      console.error("Token decoding failed", error);
    }
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/404" />
        )
      }
    />
  );
};

export default PrivateRoute;

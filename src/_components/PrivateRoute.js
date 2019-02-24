import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRouteOld = ({ component: Component, auth: Auth, render: Render, ...rest }) => (
    <Route {...rest} render={props => (
        Auth.loggedIn
            ? ( Component ? <Component {...props} /> : Render(props) )
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)

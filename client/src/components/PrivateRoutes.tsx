import React from "react";
import {Redirect, Route, RouteProps} from "react-router";

export const PrivateRoute = (props: { isAuthenticated: boolean; user?: any } & RouteProps) => {
    const {component, isAuthenticated, ...rest} = props;
    return (
        <Route
            {...rest}
            render={routeProps => {
                return isAuthenticated ? (
                    renderMergedProps(component, routeProps, rest)
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: routeProps.location},
                        }}
                    />
                );
            }}
        />
    );
};

export const PrivateAdminRoute = (props: { isAuthenticated: boolean; user: any } & RouteProps) => {
    const {component, isAuthenticated, user, ...rest} = props;
    console.log(isAuthenticated);
    console.log(user && user.isAdmin);
    return (
        <Route
            {...rest}
            render={routeProps => {
                return isAuthenticated && user && user.isAdmin ? (
                    renderMergedProps(component, routeProps, rest)
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: routeProps.location},
                        }}
                    />
                );
            }}
        />
    );
};

const renderMergedProps = (component: any, ...rest: any) => {
    const finalProps = Object.assign({}, ...rest);
    return (
        React.createElement(component, finalProps)
    );
};

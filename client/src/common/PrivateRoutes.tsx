import React from "react";
import {Redirect, Route, RouteProps} from "react-router";
import {IUser} from "../typings";

export const PrivateRoute = (props: { user: IUser, triggerErrorToast?(error: Error): void } & RouteProps) => {
    const {component, user, ...rest} = props;
    return (
        <Route
            {...rest}
            render={routeProps => {
                return user != null ? (
                    renderMergedProps(component, routeProps, rest, {user})
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

export const PrivateAdminRoute = (props: { user: IUser,  triggerErrorToast?(error: Error): void } & RouteProps) => {
    const {component, user, ...rest} = props;
    return (
        <Route
            {...rest}
            render={routeProps => {
                return user != null && user.isAdmin ? (
                    renderMergedProps(component, routeProps, rest, {user})
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

export const AuthRoute = (props: { user: IUser, triggerErrorToast?(error: Error): void } & RouteProps) => {
    const {component, user, ...rest} = props;
    return (
        <Route
            {...rest}
            render={routeProps => {
                return user != null
                    ? <Redirect
                        to={{
                            pathname: "/dashboard",
                            state: {from: routeProps.location},
                        }}
                    />
                    : (
                        renderMergedProps(component, routeProps, rest, {user})
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

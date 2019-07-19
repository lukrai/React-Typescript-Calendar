import React, {Component} from "react";
import {connect} from "react-redux";
import {BrowserRouter, Redirect} from "react-router-dom";
import {Calendar} from "../calendar";
import {checkLoggedIn, logoutAction} from "../common/auth/auth.actions";
import EventErrorHandler from "../common/EventErrorHandler";
import {AuthRoute, PrivateAdminRoute, PrivateRoute} from "../common/PrivateRoutes";
import {Dashboard} from "../dashboard";
import {Login} from "../login";
import {IUser} from "../typings";
import {Users} from "../users";
import Header from "./Header";

interface IProps {
    auth: IUser;
    checkLoggedIn(): void;
    logout(): void;
}

interface IState {
    isLoading: boolean;
}

class App extends Component<IProps, IState> {
    private eventErrorHandler: any;

    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    public async componentDidMount() {
        await this.props.checkLoggedIn();
        this.setState({isLoading: false});
    }

    public triggerErrorToast = (error: Error) => {
        this.eventErrorHandler.triggerErrorToast(error);
    }

    public render() {
        return (
            <BrowserRouter>
                <div>
                    <EventErrorHandler ref={eventErrorHandler => this.eventErrorHandler = eventErrorHandler}>
                        {this.state.isLoading && <div>Loading...</div>}
                        {!this.state.isLoading && <>
                          <Header user={this.props.auth} logout={this.props.logout}/>
                          <AuthRoute
                            exact
                            path="/login"
                            component={Login}
                            user={this.props.auth}
                            triggerErrorToast={this.triggerErrorToast}/>
                          <PrivateRoute
                            exact path="/dashboard"
                            component={Dashboard}
                            user={this.props.auth}
                            triggerErrorToast={this.triggerErrorToast}
                          />
                          <PrivateAdminRoute
                            exact
                            path="/calendar"
                            component={Calendar}
                            user={this.props.auth}
                            triggerErrorToast={this.triggerErrorToast}
                          />
                          <PrivateAdminRoute
                            exact
                            path="/users"
                            component={Users}
                            user={this.props.auth}
                            triggerErrorToast={this.triggerErrorToast}
                          />
                          <Redirect to={this.props.auth ? "/dashboard" : "/login"} />
                        </>}
                    </EventErrorHandler>
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = ({auth}) => ({
    auth,
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logoutAction()),
    checkLoggedIn: () => dispatch(checkLoggedIn()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);

import React, {Component} from "react";
import {connect} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import Calendar from "./calendar/Calendar";
import {checkLoggedIn, logoutAction} from "./common/auth.actions";
import EventErrorHandler from "./common/EventErrorHandler";
import Header from "./components/Header";
import Home from "./components/Home";
import {AuthRoute, PrivateAdminRoute, PrivateRoute} from "./components/PrivateRoutes";
import {Dashboard} from "./dashboard";
import Login from "./login/Login";
import {Users} from "./users";

interface IState {
    isLoading: boolean;
}

class App extends Component<any, IState> {
    private eventErrorHandler: any;

    constructor(props: any) {
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
                          <PrivateRoute exact path="/" component={Home} user={this.props.auth}/>
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

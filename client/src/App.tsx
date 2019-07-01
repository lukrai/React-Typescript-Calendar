import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Calendar from "./calendar/Calendar";
import {getCurrentUser} from "./common/auth.actions";
import EventErrorHandler from "./common/EventErrorHandler";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Home from "./components/Home";
import {PrivateAdminRoute, PrivateRoute} from "./components/PrivateRoutes";
import Register from "./components/Register";
import Login from "./login/Login";
import {Users} from "./users";

interface IState {
    isAuthenticated: boolean;
    user: any;
}

class App extends Component<any, IState> {
    private eventErrorHandler: any;
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthenticated: false,
            user: null,
        };
        console.log(props.history);
    }

    public async componentDidMount() {
        const r = await getCurrentUser();
        this.setState({isAuthenticated: r.isAuthenticated, user: r.user});
    }

    public updateUserState = (userObject: IState) => {
        this.setState(userObject);
    }

    public triggerErrorToast = (error: Error) => {
        this.eventErrorHandler.triggerErrorToast(error);
    }

    public render() {
        return (
            <BrowserRouter>
                <div>
                    <EventErrorHandler ref={eventErrorHandler => this.eventErrorHandler = eventErrorHandler}>
                        <Header isAuthenticated={this.state.isAuthenticated} user={this.state.user} updateUserState={this.updateUserState}/>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/login" render={props => <Login {...props} updateUserState={this.updateUserState} triggerErrorToast={this.triggerErrorToast}/>}/>
                        <PrivateRoute exact path="/dashboard" component={Dashboard} isAuthenticated={this.state.isAuthenticated} user={this.state.user}/>
                        <PrivateRoute exact path="/" component={Home} isAuthenticated={this.state.isAuthenticated}/>
                        <PrivateAdminRoute
                            exact
                            path="/calendar"
                            component={Calendar}
                            isAuthenticated={this.state.isAuthenticated}
                            user={this.state.user}
                            triggerErrorToast={this.triggerErrorToast}
                        />
                        <PrivateAdminRoute
                            exact
                            path="/users"
                            component={Users}
                            isAuthenticated={this.state.isAuthenticated}
                            user={this.state.user}
                            triggerErrorToast={this.triggerErrorToast}
                        />
                        {/*{props.children}*/}
                    </EventErrorHandler>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

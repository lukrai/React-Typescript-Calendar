import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Home from "./Home";
import Login from "./login/Login";
import {getCurrentUser} from "./login/login.actions";
import {PrivateRoute} from "./PrivateRoutes";
import Register from "./Register";

interface IState {
    isAuthenticated: boolean;
    user: any;
}

class App extends Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthenticated: false,
            user: null,
        };
    }

    public async componentDidMount() {
        const r = await getCurrentUser();
        this.setState({isAuthenticated: r.isAuthenticated, user: r.user});
    }

    public updateUserState = (userObject: IState) => {
        console.log(userObject);
        this.setState(userObject);
    }

    public render() {
        return (
            <BrowserRouter>
                <div>
                    <Header isAuthenticated={this.state.isAuthenticated} updateUserState={this.updateUserState}/>
                    <PrivateRoute exact path="/" component={Home} isAuthenticated={this.state.isAuthenticated}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/login" render={props => <Login {...props} updateUserState={this.updateUserState}/>}/>
                    <PrivateRoute exact path="/dashboard" component={Dashboard} isAuthenticated={this.state.isAuthenticated}/>
                    {/*{props.children}*/}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

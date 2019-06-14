import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./login/Login";
import {getCurrentUser} from "./common/auth.actions";
import {PrivateRoute} from "./components/PrivateRoutes";
import Register from "./components/Register";

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
                    <PrivateRoute exact path="/dashboard" component={Dashboard} isAuthenticated={this.state.isAuthenticated} user={this.state.user}/>
                    {/*{props.children}*/}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

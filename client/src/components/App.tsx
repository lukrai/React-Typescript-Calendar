import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Home from "./Home";
import Login from "./login/Login";
import {getCurrentUser} from "./login/login.actions";
import Register from "./Register";

class App extends Component<any, any> {
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

    public updateUserState(userObject: any) {
        this.setState(userObject);
    }

    public render() {
        return (
            <BrowserRouter>
                <div>
                    <Header isAuthenticated={this.state.isAuthenticated} updateUserState={this.updateUserState}/>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/dashboard" component={Dashboard}/>
                    {/*{props.children}*/}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

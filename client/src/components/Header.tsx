import React, {Component} from "react";
import {Link} from "react-router-dom";
import { withRouter } from "react-router-dom";
import {logout} from "./login/login.actions";

class Header extends Component<any> {
    constructor(props: any) {
        super(props);
        this.signOut = this.signOut.bind(this);
    }

    public render() {
        return (
            <nav className="navbar navbar-expand navbar-dark bg-dark" style={{marginBottom: "30px"}}>
                <Link className="navbar-brand" to="/">Calendar</Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>

                    <ul className="nav navbar-nav ml-auto">
                        {!this.props.isAuthenticated ?
                            [<li className="nav-item" key="signup">
                                <Link className="nav-link" to="/register">Sign Up</Link>
                            </li>,
                                <li className="nav-item" key="signin">
                                    <Link className="nav-link" to="/login">Sign In</Link>
                                </li>] : null}

                        {this.props.isAuthenticated ?
                            <li className="nav-item">
                                <Link className="nav-link" to="/signout" onClick={this.signOut}>Sign Out</Link>
                            </li> : null}
                    </ul>
                </div>
            </nav>
        );
    }

    private async signOut() {
        await logout();
        await this.props.updateUserState({isAuthenticated: false, user: null});
        this.props.history.push("/login");
    }
}

export default withRouter(Header);

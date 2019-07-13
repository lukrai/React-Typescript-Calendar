import React, {Component} from "react";
import {Link, RouteComponentProps} from "react-router-dom";
import {withRouter} from "react-router-dom";
import {IUser} from "../typings";

interface IProps extends RouteComponentProps {
    user: IUser;

    logout(): void;
}

class Header extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        this.signOut = this.signOut.bind(this);
    }

    public render() {
        const {user} = this.props;
        return (
            <nav className="navbar navbar-expand navbar-dark bg-dark" style={{marginBottom: "30px"}}>
                <div className="navbar-brand">Calendar</div>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        {user != null && <li className="nav-item">
                          <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>}
                        {
                            user != null && user.isAdmin
                                ? [
                                    <li key={"nav-calendar"} className="nav-item">
                                        <Link className="nav-link" to="/calendar">Calendar</Link>
                                    </li>,
                                    <li key={"nav-users"} className="nav-item">
                                        <Link className="nav-link" to="/users">Users</Link>
                                    </li>,
                                ]
                                : null
                        }
                    </ul>

                    <ul className="nav navbar-nav ml-auto">
                        {
                            user == null
                                ? [
                                    <li className="nav-item" key="signin">
                                        <Link className="nav-link" to="/login">Sign In</Link>
                                    </li>,
                                ]
                                : null
                        }

                        {user != null ?
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={this.signOut}>Sign Out</a>
                            </li> : null}
                    </ul>
                </div>
            </nav>
        );
    }

    private async signOut() {
        await this.props.logout();
        this.props.history.push("/login");
    }
}

export default withRouter(Header);

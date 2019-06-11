import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { connect } from "react-redux";

// import * as actions from '../actions';

export default class Header extends Component<any> {
    constructor(props: any) {
        super(props);
        this.signOut = this.signOut.bind(this);
    }

    public render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ marginBottom: "30px" }}>
                <Link className="navbar-brand" to="/">Calendar</Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>

                    <ul className="nav navbar-nav ml-auto">
                        { !this.props.isAuth ?
                            [<li className="nav-item" key="signup">
                                <Link className="nav-link" to="/register">Sign Up</Link>
                            </li>,
                                <li className="nav-item" key="signin">
                                    <Link className="nav-link" to="/login">Sign In</Link>
                                </li>] : null }

                        {/*{ this.props.isAuth ?*/}
                            <li className="nav-item">
                                <Link className="nav-link" to="/signout" onClick={this.signOut}>Sign Out</Link>
                            </li>
                        {/*    </li> : null }*/}
                    </ul>
                </div>
            </nav>
        );
    }

    private signOut() {
        this.props.signOut();
    }
}

function mapStateToProps(state: any) {
    return {
        isAuth: state.auth.isAuthenticated,
    };
}

// export default connect(mapStateToProps, actions)(Header);

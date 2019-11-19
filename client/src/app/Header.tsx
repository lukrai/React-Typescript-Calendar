import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { IUser } from "../typings";
import Button from "react-bootstrap/Button";

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
    const { user } = this.props;
    return (
      <nav className="navbar navbar-expand navbar-dark bg-dark" style={{ marginBottom: "30px" }}>
        <div className="navbar-brand">Bylų registracijos sistema</div>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            {user != null && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Registruoti bylą
                </Link>
              </li>
            )}
            {user != null && user.isAdmin
              ? [
                  <li key={"nav-calendar"} className="nav-item">
                    <Link className="nav-link" to="/calendar">
                      Kalendorius
                    </Link>
                  </li>,
                  <li key={"nav-users"} className="nav-item">
                    <Link className="nav-link" to="/users">
                      Vartotojai
                    </Link>
                  </li>,
                ]
              : null}
          </ul>

          <ul className="nav navbar-nav ml-auto">
            {user == null
              ? [
                  <li className="nav-item" key="signin">
                    <Link className="nav-link" to="/login">
                      Prisijungti
                    </Link>
                  </li>,
                ]
              : null}

            {user != null ? (
              <li className="nav-item">
                <Button variant="outline-light" onClick={this.signOut}>
                  Atsijungti
                </Button>
              </li>
            ) : null}
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
